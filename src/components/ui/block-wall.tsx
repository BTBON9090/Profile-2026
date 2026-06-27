"use client";

/**
 * BlockWall — 三维可交互方块墙背景（受控版）
 *
 * 由 InstancedMesh 构成的大规模方块阵列，全部参数由 BlockWallConfig 驱动：
 *  - 鼠标悬停的方块会"陷入"墙面（z 轴后移 + 轻微缩放）
 *  - 偶尔随机若干方块触发"塌陷翻转"动画，过一会儿自动还原
 *  - 整体随鼠标轻微视差倾斜，相机随时间微缓漂移
 *  - 支持多种材质（亚克力/磨砂玻璃/塑料/磨砂墙/金属/标准）
 *  - 支持真倒角（RoundedBoxGeometry）/ 假倒角 / 无倒角
 *  - 灯光、背景色、动画细节全可调
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import type { BlockWallConfig } from "./block-wall-types";

export default function BlockWall({
  config,
  className,
  interactive = true,
  background = false,
}: {
  config: BlockWallConfig;
  className?: string;
  /**
   * 是否启用鼠标交互（hover 凹陷、点击翻转、视差倾斜）。
   * 作为页面背景时仍可启用，组件会用 document 级监听 + 滚动偏移
   * 计算命中方块，且不拦截上层内容的点击。
   */
  interactive?: boolean;
  /**
   * 背景模式：容器用 absolute 随文档流滚动（而非 fixed 固定在视口）。
   * 适合首页这种长滚动场景，让方块墙跟着页面一起滚。
   */
  background?: boolean;
}) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  // 始终最新的 config，供 render loop 读取，避免每帧重建场景
  const configRef = useRef(config);
  const interactiveRef = useRef(interactive);
  const backgroundRef = useRef(background);
  useEffect(() => {
    configRef.current = config;
  }, [config]);
  useEffect(() => {
    interactiveRef.current = interactive;
  }, [interactive]);
  useEffect(() => {
    backgroundRef.current = background;
  }, [background]);

  // buildGrid 句柄，供几何/材质变化时调用以重建网格（无需卸载组件）
  const buildGridRef = useRef<(() => void) | null>(null);

  // 几何/材质的依赖签名：变化时调用 buildGrid 重建网格
  const gridKey = `${config.grid.cols}|${config.grid.rows}|${config.grid.cellSize}|${config.grid.gap}|${config.grid.depth}|${config.geometry.bevelMode}|${config.geometry.bevelRadius}|${config.geometry.fakeBevelIntensity}`;
  const materialKey = `${config.material.preset}|${config.material.opacity}|${config.material.transmission}|${config.material.roughness}|${config.material.metalness}|${config.material.clearcoat}|${config.material.ior}|${config.material.blockColor}|${config.material.glowColor}|${config.material.glowDensity}|${config.material.glowIntensity}`;

  // ---------- 一次性的 scene / camera / renderer / lights / loop ----------
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const cfg = configRef.current;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(cfg.scene.bgColor);
    scene.fog = new THREE.Fog(cfg.scene.fogColor, cfg.scene.fogNear, cfg.scene.fogFar);

    // 容器尺寸：dynamic import 首帧布局未完成时 mount.clientWidth/Height 可能读到
    // 部分值或 0（曾出现 680px 而非整屏 1098px）。优先用视口尺寸固定铺满，
    // 再用 ResizeObserver 二次校正。
    const cw = window.innerWidth;
    const ch = window.innerHeight;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      cfg.scene.cameraFov,
      cw / ch,
      0.1,
      200
    );
    camera.position.set(0, 0, cfg.scene.cameraZ);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(cw, ch);
    camera.aspect = cw / ch;
    camera.updateProjectionMatrix();
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, cfg.lighting.ambientIntensity);
    scene.add(ambient);
    const keyLight = new THREE.DirectionalLight(0xffffff, cfg.lighting.keyIntensity);
    keyLight.position.set(cfg.lighting.keyX, cfg.lighting.keyY, cfg.lighting.keyZ);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0xb0c4ff, cfg.lighting.rimIntensity);
    rimLight.position.set(cfg.lighting.rimX, cfg.lighting.rimY, cfg.lighting.rimZ);
    scene.add(rimLight);
    const pointLight = new THREE.PointLight(0xffffff, cfg.lighting.pointIntensity, 100);
    pointLight.position.set(cfg.lighting.pointX, cfg.lighting.pointY, cfg.lighting.pointZ);
    scene.add(pointLight);

    // ---------- 方块状态（与几何解耦，几何变化时重建） ----------
    type Block = {
      baseX: number;
      baseY: number;
      baseZ: number;
      glow: number; // 0~1，越大越亮
      isGlow: boolean; // 是否为高光方块（用 glowColor）
      flipping: boolean;
      flipPhase: number;
      flipDuration: number;
      flipDir: number;
      flipAxis: "x" | "y";
      hovered: boolean;
      hoverT: number;
    };

    let mesh: THREE.InstancedMesh | null = null;
    let geometry: THREE.BufferGeometry | null = null;
    let material: THREE.Material | null = null;
    let blocks: Block[] = [];

    const dummy = new THREE.Object3D();
    const colorObj = new THREE.Color();
    const baseColorObj = new THREE.Color();
    const glowColorObj = new THREE.Color();

    function buildGrid() {
      // 清理旧的
      if (mesh) {
        scene.remove(mesh);
        mesh.dispose();
      }
      if (geometry) geometry.dispose();
      if (material) material.dispose();

      const c = configRef.current;
      // 注：原先 real 倒角模式下会强制 cols=min(18) / rows=min(12) 降密度
      // 防止顶点数爆炸。但 bevelRadius 小、depth 浅时 26×16 完全可承受，
      // 且降密度会让方块视觉上变大、丢失细节。改为尊重配置的真实密度。
      const cols = c.grid.cols;
      const rows = c.grid.rows;
      const cell = c.grid.cellSize;
      const gap = c.grid.gap;
      const blockSize = cell - gap;
      const depth = c.grid.depth;
      const count = cols * rows;

      // 几何
      if (c.geometry.bevelMode === "real") {
        const r = Math.max(0.001, Math.min(c.geometry.bevelRadius, blockSize / 2 - 0.01));
        geometry = new RoundedBoxGeometry(blockSize, blockSize, depth, 4, r);
      } else {
        geometry = new THREE.BoxGeometry(blockSize, blockSize, depth);
      }

      // 材质
      const m = c.material;
      const isTransparent = m.opacity < 1 || m.transmission > 0;
      material = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(m.blockColor),
        roughness: m.roughness,
        metalness: m.metalness,
        transparent: isTransparent,
        opacity: m.opacity,
        transmission: m.transmission,
        ior: m.ior,
        clearcoat: m.clearcoat,
        clearcoatRoughness: 0.2,
        // fake 倒角：用 sheen 模拟边缘高光
        sheen: c.geometry.bevelMode === "fake" ? c.geometry.fakeBevelIntensity : 0,
        sheenColor: new THREE.Color(0xffffff),
        sheenRoughness: 0.4,
        depthWrite: !isTransparent,
      });

      mesh = new THREE.InstancedMesh(geometry, material, count);
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      scene.add(mesh);

      // 每个 instance 颜色
      mesh.instanceColor = new THREE.InstancedBufferAttribute(
        new Float32Array(count * 3),
        3
      );

      // blocks 数据
      blocks = [];
      const totalW = cols * cell;
      const totalH = rows * cell;
      const startX = -totalW / 2 + cell / 2;
      const startY = -totalH / 2 + cell / 2;
      baseColorObj.set(m.blockColor);
      glowColorObj.set(m.glowColor);

      for (let r = 0; r < rows; r++) {
        for (let col = 0; col < cols; col++) {
          const isGlow = Math.random() < m.glowDensity;
          blocks.push({
            baseX: startX + col * cell,
            baseY: startY + (rows - 1 - r) * cell,
            baseZ: 0,
            glow: isGlow ? 0.55 + Math.random() * 0.45 : Math.random() * 0.18,
            isGlow,
            flipping: false,
            flipPhase: 0,
            flipDuration: 1.1 + Math.random() * 0.9,
            flipDir: Math.random() < 0.5 ? 1 : -1,
            flipAxis: Math.random() < 0.5 ? "x" : "y",
            hovered: false,
            hoverT: 0,
          });
        }
      }

      for (let i = 0; i < count; i++) applyBlock(i);
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }

    function applyBlock(i: number) {
      if (!mesh) return;
      const b = blocks[i];
      const c = configRef.current;

      const hoverTarget = b.hovered ? 1 : 0;
      b.hoverT += (hoverTarget - b.hoverT) * 0.18;

      const x = b.baseX;
      const y = b.baseY;
      let z = b.baseZ;
      let rotX = 0;
      let rotY = 0;
      let scale = 1;

      // hover
      z -= b.hoverT * c.animation.hoverRetreat;
      scale -= b.hoverT * c.animation.hoverScale;

      // 翻转
      if (b.flipping) {
        const t = Math.min(b.flipPhase, 1);
        const rot = Math.sin(t * Math.PI) * b.flipDir * Math.PI;
        if (b.flipAxis === "x") rotX = rot;
        else rotY = rot;
        z -= Math.sin(t * Math.PI) * c.animation.flipRetreat;
        scale *= 1 - Math.sin(t * Math.PI) * c.animation.flipScaleReduce;
        if (t >= 1) {
          b.flipping = false;
          b.flipPhase = 0;
        }
      }

      dummy.position.set(x, y, z);
      dummy.rotation.set(rotX, rotY, 0);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);

      // 颜色：高光方块用 glowColor，普通方块用 blockColor；hover/flip 提亮
      const m = c.material;
      if (b.isGlow) {
        colorObj.copy(glowColorObj);
      } else {
        colorObj.copy(baseColorObj);
        // 普通 glow 权重提亮
        const lift = b.glow * m.glowIntensity;
        colorObj.multiplyScalar(1 + lift);
      }
      const boost = b.hoverT * m.hoverBoost + (b.flipping ? 0.12 : 0);
      if (boost > 0) colorObj.lerp(new THREE.Color(0xffffff), Math.min(boost, 1));
      mesh.setColorAt(i, colorObj);
    }

    buildGrid();
    // 暴露 buildGrid 给重建 effect
    buildGridRef.current = buildGrid;

    // ---------- 交互 ----------
    // 注意：作为背景（background=true）时 canvas pointerEvents:none，
    // 所以 pointermove/click 必须监听到 document 上，否则上层透明 section
    // 会把鼠标事件挡掉，hover 效果就失效了。
    const pointer = new THREE.Vector2(0, 0);
    const pointerTarget = new THREE.Vector2(0, 0);
    const raycaster = new THREE.Raycaster();
    const mouseNDC = new THREE.Vector2(0, 0);
    let mouseInside = false;

    function getNDC(clientX: number, clientY: number) {
      // 用 canvas 的视口矩形算 NDC；背景模式下 canvas 会随页面滚动，
      // rect.top 可能为负（滚出顶部）或大于视口（滚出底部），都需如实反映
      const rect = renderer.domElement.getBoundingClientRect();
      const nx = ((clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((clientY - rect.top) / rect.height) * 2 - 1);
      return { nx, ny, rect };
    }
    function onPointerMove(e: PointerEvent) {
      const { nx, ny, rect } = getNDC(e.clientX, e.clientY);
      // 鼠标是否在 canvas 当前可见范围内（含滚动后的位置）
      const inX = e.clientX >= rect.left && e.clientX <= rect.right;
      const inY = e.clientY >= rect.top && e.clientY <= rect.bottom;
      mouseInside = inX && inY;
      if (mouseInside) {
        pointerTarget.set(nx, ny);
        mouseNDC.set(nx, ny);
      } else {
        pointerTarget.set(0, 0);
        mouseNDC.set(0, 0);
      }
    }
    function onPointerLeave() {
      mouseInside = false;
      pointerTarget.set(0, 0);
      mouseNDC.set(0, 0);
    }
    function onClick(e: MouseEvent) {
      if (!mesh) return;
      const { nx, ny, rect } = getNDC(e.clientX, e.clientY);
      const inX = e.clientX >= rect.left && e.clientX <= rect.right;
      const inY = e.clientY >= rect.top && e.clientY <= rect.bottom;
      if (!inX || !inY) return;
      raycaster.setFromCamera({ x: nx, y: ny } as THREE.Vector2, camera);
      const hit = raycaster.intersectObject(mesh);
      if (hit.length > 0) {
        const id = hit[0].instanceId;
        if (id != null && !blocks[id].flipping) {
          const c = configRef.current;
          blocks[id].flipping = true;
          blocks[id].flipPhase = 0;
          blocks[id].flipDir = Math.random() < 0.5 ? 1 : -1;
          blocks[id].flipAxis = Math.random() < 0.5 ? "x" : "y";
          blocks[id].flipDuration =
            c.animation.flipDurationMin +
            Math.random() * (c.animation.flipDurationMax - c.animation.flipDurationMin);
        }
      }
    }
    // 背景模式下 canvas 不接收事件，监听到 document/window 上
    const eventTarget: Window = window;
    eventTarget.addEventListener("pointermove", onPointerMove as EventListener);
    eventTarget.addEventListener("pointerleave", onPointerLeave as EventListener);
    eventTarget.addEventListener("click", onClick as EventListener);
    // 交互命中已由上方 window 级监听 + getBoundingClientRect 计算，
    // canvas 本身永远不拦截指针事件，避免 fixed 全屏 canvas 挡住上层
    // 内容（如工作经历 hover tooltip）的鼠标进入/离开事件。
    renderer.domElement.style.pointerEvents = "none";

    // ---------- 移动端重力感应 ----------
    // 桌面端用鼠标位置做视差 + hover 凹陷；移动端没有鼠标，
    // 改用 DeviceOrientation 重力感应：手机倾斜方向 = 鼠标位置，
    // 倾斜越大指针越偏向屏幕边缘，从而驱动视差倾斜与 hover。
    let tiltActive = false;
    // 重力映射出的 NDC 指针目标（-1..1）
    const tiltTarget = new THREE.Vector2(0, 0);
    const tiltNDC = new THREE.Vector2(0, 0);

    function onDeviceOrientation(e: DeviceOrientationEvent) {
      // gamma: 左右倾斜 -90..90，beta: 前后倾斜 -180..180
      const gamma = e.gamma ?? 0;
      const beta = e.beta ?? 0;
      // 移动端灵敏度比桌面端高 3 倍：
      // 桌面端基准 /22（±22° 满偏），移动端 /7.3（约 ±7.3° 即满偏，3 倍灵敏）
      const tiltDiv = 22 / 3;
      const nx = Math.max(-1, Math.min(1, gamma / tiltDiv));
      const ny = Math.max(-1, Math.min(1, (beta - 45) / tiltDiv)); // 手持自然角约 45°
      tiltTarget.set(nx, ny);
      tiltNDC.set(nx, ny);
      tiltActive = true;
    }
    // iOS 13+ 需要请求权限，延迟到首次用户交互后申请
    let tiltPermissionRequested = false;
    function requestTiltPermission() {
      if (tiltPermissionRequested) return;
      tiltPermissionRequested = true;
      const D = DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<"granted" | "denied">;
      };
      if (typeof D.requestPermission === "function") {
        D.requestPermission()
          .then((state) => {
            if (state === "granted") {
              window.addEventListener(
                "deviceorientation",
                onDeviceOrientation as EventListener
              );
            }
          })
          .catch(() => {});
      } else {
        // Android 等无需权限
        window.addEventListener(
          "deviceorientation",
          onDeviceOrientation as EventListener
        );
      }
      window.removeEventListener("touchstart", requestTiltPermission);
      window.removeEventListener("pointerdown", requestTiltPermission);
    }
    // 仅在触屏设备上启用（避免桌面端无谓监听）
    const isTouch =
      typeof window !== "undefined" &&
      (window.matchMedia?.("(pointer: coarse)").matches ||
        "ontouchstart" in window);
    if (isTouch) {
      window.addEventListener("touchstart", requestTiltPermission, {
        once: true,
      });
      window.addEventListener("pointerdown", requestTiltPermission, {
        once: true,
      });
    }

    // ---------- 自动翻转 ----------
    let flipTimer = 0;
    function maybeTriggerFlips(dt: number) {
      const c = configRef.current;
      if (!c.animation.autoFlipEnabled) return;
      flipTimer += dt;
      if (flipTimer < c.animation.flipTriggerInterval) return;
      flipTimer = 0;      let active = 0;
      for (let i = 0; i < blocks.length; i++) if (blocks[i].flipping) active++;
      if (active >= c.animation.flipMaxConcurrent) return;
      const n = 1 + Math.floor(Math.random() * 2);
      for (let k = 0; k < n; k++) {
        const idx = Math.floor(Math.random() * blocks.length);
        const b = blocks[idx];
        if (!b.flipping) {
          b.flipping = true;
          b.flipPhase = 0;
          b.flipDir = Math.random() < 0.5 ? 1 : -1;
          b.flipAxis = Math.random() < 0.5 ? "x" : "y";
          b.flipDuration =
            c.animation.flipDurationMin +
            Math.random() * (c.animation.flipDurationMax - c.animation.flipDurationMin);
        }
      }
    }

    // ---------- resize ----------
    function onResize() {
      if (!mount) return;
      // 背景模式：canvas 随页面滚动，尺寸用容器自身宽高（absolute inset-0 撑满父级）
      // 详情页模式：fixed 铺满视口
      const bg = backgroundRef.current;
      const w = bg ? mount.clientWidth : (mount.clientWidth || window.innerWidth);
      const h = bg ? mount.clientHeight : (mount.clientHeight || window.innerHeight);
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener("resize", onResize);

    // 兜底：监听容器自身尺寸变化（fixed inset-0 通常不需要，但 dynamic import
    // 首帧布局未完成时 clientHeight 可能为 0，这里二次校正）
    const ro = new ResizeObserver(() => onResize());
    ro.observe(mount);

    // 首帧保险：dynamic import 完成后立刻校正一次，确保 canvas 真正铺满
    requestAnimationFrame(() => onResize());
    requestAnimationFrame(() => requestAnimationFrame(() => onResize()));

    // ---------- render loop ----------
    const clock = new THREE.Clock();
    let frameId = 0;

    function render() {
      const dt = Math.min(clock.getDelta(), 0.05);
      const time = clock.elapsedTime;
      const c = configRef.current;

      // 视差：桌面端跟随鼠标，移动端跟随重力倾斜
      // 移动端 tiltActive 时优先用重力数据，否则用鼠标
      // 移动端晃动幅度比桌面端大 6 倍（parallaxAmt × 6），响应速度也更快
      const useTilt = tiltActive;
      const parallaxScale = useTilt ? 6 : 1;
      const followSpeed = useTilt ? 0.15 : 0.06;
      const tx = useTilt ? tiltTarget.x : pointerTarget.x;
      const ty = useTilt ? tiltTarget.y : pointerTarget.y;
      pointer.x += (tx - pointer.x) * followSpeed;
      pointer.y += (ty - pointer.y) * followSpeed;
      camera.position.x = pointer.x * c.scene.parallaxAmt * parallaxScale;
      // Y 方向取反：手机向上抬起时，相机下移看向墙的下半部分，
      // 视觉上呈现"上半部落下变暗、下半部抬起变亮"
      camera.position.y = -pointer.y * c.scene.parallaxAmt * parallaxScale;
      camera.position.x += Math.sin(time * c.scene.driftSpeed) * c.scene.driftRange;
      camera.position.y += Math.cos(time * c.scene.driftSpeed * 0.75) * c.scene.driftRange * 0.66;
      camera.lookAt(0, 0, 0);

      // hover 检测：移动端用重力映射的 NDC 做命中
      const hoverNDC = useTilt ? tiltNDC : mouseNDC;
      const hoverInside = useTilt ? tiltActive : mouseInside;
      if (interactiveRef.current && c.animation.hoverEnabled && hoverInside && mesh) {
        raycaster.setFromCamera(hoverNDC, camera);
        const hit = raycaster.intersectObject(mesh);
        let hoveredId = -1;
        if (hit.length > 0) hoveredId = hit[0].instanceId ?? -1;
        for (let i = 0; i < blocks.length; i++) blocks[i].hovered = i === hoveredId;
      } else {
        for (let i = 0; i < blocks.length; i++) blocks[i].hovered = false;
      }

      // 翻转推进
      for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].flipping) blocks[i].flipPhase += dt / blocks[i].flipDuration;
      }
      maybeTriggerFlips(dt);

      for (let i = 0; i < blocks.length; i++) applyBlock(i);
      if (mesh) {
        mesh.instanceMatrix.needsUpdate = true;
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      }

      // 灯光/场景参数实时更新（不重建）
      scene.background = new THREE.Color(c.scene.bgColor);
      if (scene.fog) {
        (scene.fog as THREE.Fog).color.set(c.scene.fogColor);
        (scene.fog as THREE.Fog).near = c.scene.fogNear;
        (scene.fog as THREE.Fog).far = c.scene.fogFar;
      }
      camera.fov = c.scene.cameraFov;
      camera.position.z = c.scene.cameraZ;
      camera.updateProjectionMatrix();

      ambient.color.set(c.lighting.ambientColor);
      ambient.intensity = c.lighting.ambientIntensity;
      keyLight.color.set(c.lighting.keyColor);
      keyLight.intensity = c.lighting.keyIntensity;
      keyLight.position.set(c.lighting.keyX, c.lighting.keyY, c.lighting.keyZ);
      rimLight.color.set(c.lighting.rimColor);
      rimLight.intensity = c.lighting.rimIntensity;
      rimLight.position.set(c.lighting.rimX, c.lighting.rimY, c.lighting.rimZ);
      pointLight.visible = c.lighting.pointEnabled;
      pointLight.color.set(c.lighting.pointColor);
      pointLight.intensity = c.lighting.pointIntensity;
      pointLight.position.set(c.lighting.pointX, c.lighting.pointY, c.lighting.pointZ);

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(render);
    }
    render();

    // ---------- 清理 ----------
    return () => {
      buildGridRef.current = null;
      cancelAnimationFrame(frameId);
      ro.disconnect();
      window.removeEventListener("resize", onResize);
      eventTarget.removeEventListener("pointermove", onPointerMove as EventListener);
      eventTarget.removeEventListener("pointerleave", onPointerLeave as EventListener);
      eventTarget.removeEventListener("click", onClick as EventListener);
      window.removeEventListener("deviceorientation", onDeviceOrientation as EventListener);
      window.removeEventListener("touchstart", requestTiltPermission);
      window.removeEventListener("pointerdown", requestTiltPermission);
      if (mesh) mesh.dispose();
      if (geometry) geometry.dispose();
      if (material) material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  // ---------- 几何/材质变化时重建网格 ----------
  useEffect(() => {
    buildGridRef.current?.();
  }, [gridKey, materialKey]);

  return (
    <div
      ref={mountRef}
      className={className}
      style={
        background
          ? {
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            }
          : {
              position: "fixed",
              inset: 0,
              width: "100vw",
              height: "100vh",
              // 容器始终不拦截指针事件：交互命中由 window 级
              // pointermove/click 监听 + getBoundingClientRect 计算，
              // 这样 fixed 全屏 canvas 不会挡住上层内容的 hover 事件。
              pointerEvents: "none",
            }
      }
    />
  );
}
