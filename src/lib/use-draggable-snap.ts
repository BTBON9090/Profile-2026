// src/lib/use-draggable-snap.ts
"use client";
import { useState, useCallback, useRef, useLayoutEffect, type RefObject } from "react";
import { useMotionValue, animate, type MotionValue } from "framer-motion";

/**
 * useDraggableSnap — 通用可拖拽 + 左右贴边吸附 hook
 *
 * 性能要点：
 * - 拖拽期间**完全不触发 React 重渲染**：位置通过 Framer Motion 的 `MotionValue`
 *   直接以命令式 `mx.set(x) / my.set(y)` 更新，绑定到 motion.div 的 `style={{x,y}}`。
 *   因为 MotionValue 是 mutable 引用，set 不会引起 React 重渲染，也就不会让
 *   Framer 用旧 state 重新计算 transform 把气泡复位 —— 彻底消除"拖拽时不动"。
 * - 仅在松手（pointerup）时调用 `animate(mx, target, {...})` 触发吸附动画。
 *
 * 关键约定：
 * - `position` 表示元素**左上角**的屏幕坐标（x=left, y=top）。
 * - 吸附宽度 = 元素实际 offsetWidth（动态读取），保证气泡真实贴边、无留白。
 * - 仅吸附**左右两侧**边缘。
 *
 * 使用方：
 *   const drag = useDraggableSnap(ref, x, y);
 *   <motion.div style={{ x: drag.x, y: drag.y }} onPointerDown={drag.onPointerDown} />
 *   需要读取"当前吸附位置"时用 drag.position（仅在松手后更新）。
 */
export interface SnapPosition {
  x: number; // left
  y: number; // top
}

export type SnapSide = "left" | "right";

interface UseDraggableSnapReturn {
  /** 绑定到容器 onPointerDown */
  onPointerDown: (e: React.PointerEvent) => void;
  /** Framer Motion 的 x / y MotionValue，绑定到 motion.div 的 style={{ x, y }} */
  x: MotionValue<number>;
  y: MotionValue<number>;
  /** 当前吸附后的位置（左上角，仅松手后更新，用于派生布局计算） */
  position: SnapPosition;
  /** 是否正在拖拽 */
  isDragging: boolean;
  /** 最近一次吸附到的一侧（释放后更新） */
  snapSide: SnapSide;
  /** 拖拽刚结束的标记窗口：true 时消费方应抑制随后的 click 事件 */
  justDraggedRef: React.RefObject<boolean>;
}

const EDGE_PAD = 2; // 贴边后元素左/右边距屏幕边缘的距离

export function useDraggableSnap(
  containerRef: RefObject<HTMLDivElement | null>,
  initialX: number,
  initialY: number,
): UseDraggableSnapReturn {
  // 用 MotionValue 承载位置：set 不触发 React 重渲染，Framer 直接驱动 transform
  const mx = useMotionValue(initialX);
  const my = useMotionValue(initialY);

  // position state 仅用于派生布局（如面板定位），只在松手时更新一次
  const [position, setPositionState] = useState<SnapPosition>({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const [snapSide, setSnapSide] = useState<SnapSide>(initialX < 0 ? "right" : "left");
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  // 拖拽期间实时位置（不进 state）
  const livePosRef = useRef<SnapPosition>({ x: initialX, y: initialY });

  // 动态读取元素实际宽高（收起/展开态不同）
  const getElSize = useCallback(() => {
    const el = containerRef.current;
    return { w: el?.offsetWidth ?? 64, h: el?.offsetHeight ?? 64 };
  }, [containerRef]);

  const clampPosition = useCallback(
    (x: number, y: number): SnapPosition => {
      if (typeof window === "undefined") return { x, y };
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const { w, h } = getElSize();
      const safeVh = Math.max(h, vh);
      return {
        x: Math.max(EDGE_PAD, Math.min(vw - w - EDGE_PAD, x)),
        y: Math.max(EDGE_PAD, Math.min(safeVh - h - EDGE_PAD, y)),
      };
    },
    [getElSize],
  );

  // 在客户端渲染后修正初始位置（处理 SSR：innerWidth 在服务端为 undefined）
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const { w } = getElSize();

    // SSR 默认 initialX=0 → 改为贴右侧；否则尊重传入值，仅做 clamp
    const fixedX = initialX === 0 ? vw - w - EDGE_PAD : initialX;
    const fixedY = initialY === 0 ? vh / 2 : initialY;

    const next = clampPosition(fixedX, fixedY);
    livePosRef.current = next;
    mx.set(next.x);
    my.set(next.y);
    setPositionState(next);
    setSnapSide(initialX === 0 ? "right" : initialX < vw / 2 ? "left" : "right");
    // 仅初始化一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const snapToNearestSide = useCallback(
    (x: number, y: number): SnapPosition => {
      if (typeof window === "undefined") return { x, y };
      const vw = window.innerWidth;
      const { w } = getElSize();
      const cx = x + w / 2;

      // 仅左右吸附：选更近的一侧
      const side: SnapSide = cx < vw / 2 ? "left" : "right";
      const snappedX = side === "left" ? EDGE_PAD : vw - w - EDGE_PAD;

      return clampPosition(snappedX, y);
    },
    [getElSize, clampPosition],
  );

  const snapToNearestSideRef = useRef(snapToNearestSide);
  useLayoutEffect(() => {
    snapToNearestSideRef.current = snapToNearestSide;
  });

  // 窗口尺寸变化：重新 clamp 位置，避免被裁切或跑到屏幕外
  useLayoutEffect(() => {
    const onResize = () => {
      const prev = { x: mx.get(), y: my.get() };
      const snapped = snapToNearestSideRef.current(prev.x, prev.y);
      livePosRef.current = snapped;
      mx.set(snapped.x);
      my.set(snapped.y);
      const { w } = { w: containerRef.current?.offsetWidth ?? 64 };
      setSnapSide(prev.x + w / 2 < window.innerWidth / 2 ? "left" : "right");
      setPositionState(snapped);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [containerRef, mx, my]);

  // 记录当前进行中的吸附动画控制句柄，便于在新的拖拽开始时取消
  const snapControlsRef = useRef<{ x: ReturnType<typeof animate> | null; y: ReturnType<typeof animate> | null }>({
    x: null,
    y: null,
  });

  // 是否刚刚完成了一次拖拽：用于消费方在 pointerup 后抑制随之而来的 click 事件，
  // 避免"拖拽松手即误触打开/关闭"。
  const justDraggedRef = useRef(false);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) return;
      const el = containerRef.current;
      if (!el) return;

      // 触屏：立即阻止默认行为，避免浏览器把 pointer 当作滚动/点击手势，
      // 否则 pointermove 会被动监听吞掉、preventDefault 无效，气泡根本拖不动。
      if (e.pointerType === "touch") {
        e.preventDefault();
      }

      // 取消任何正在进行的吸附 tween，否则会和拖拽互相打架
      snapControlsRef.current.x?.stop();
      snapControlsRef.current.y?.stop();
      snapControlsRef.current = { x: null, y: null };

      let started = false;
      const startX = e.clientX;
      const startY = e.clientY;

      const rect = el.getBoundingClientRect();
      // 左上角语义：position.x = rect.left（Framer transform 已生效后）
      dragOffsetRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };

      // 优先用 window 级监听，保证鼠标移出气泡、移到面板上方时仍能持续追踪拖拽。
      // pointer capture 在某些场景（如被 panel 的高 z-index 覆盖）会丢失事件。
      const moveTarget: Element | Window = window;
      const upTarget: Element | Window = window;

      const onMove = (ev: PointerEvent) => {
        // 拖拽阈值：移动超过 5px 才开始
        if (!started) {
          if (Math.abs(ev.clientX - startX) < 5 && Math.abs(ev.clientY - startY) < 5) return;
          started = true;
          try { el.setPointerCapture?.(e.pointerId); } catch {}
          setIsDragging(true);
        }
        // 触屏下必须 preventDefault 才能阻止页面滚动；listener 以 passive:false 注册。
        ev.preventDefault();
        const raw = {
          x: ev.clientX - dragOffsetRef.current.x,
          y: ev.clientY - dragOffsetRef.current.y,
        };
        const clamped = clampPosition(raw.x, raw.y);
        livePosRef.current = clamped;
        // 关键：直接 set MotionValue，Framer 立刻驱动 transform，无 React 重渲染、无复位
        mx.set(clamped.x);
        my.set(clamped.y);
      };

      const onUp = () => {
        if (started) {
          // 标记刚完成拖拽：随后的 click 事件应被消费方抑制
          justDraggedRef.current = true;
          // 短暂窗口后复位，避免误吞下一次合法点击
          window.setTimeout(() => { justDraggedRef.current = false; }, 50);
          // 松手才 setState 一次 + 触发 spring 吸附
          const snapped = snapToNearestSideRef.current(livePosRef.current.x, livePosRef.current.y);
          const vw = window.innerWidth;
          const w = el.offsetWidth ?? 64;
          setSnapSide(livePosRef.current.x + w / 2 < vw / 2 ? "left" : "right");
          livePosRef.current = snapped;
          setPositionState(snapped);
          setIsDragging(false);
          // 用 Framer 命令式 animate 触发吸附 tween（直接驱动 MotionValue，不经过 React state）
          snapControlsRef.current.x = animate(mx, snapped.x, {
            type: "tween",
            duration: 0.18,
            ease: "easeOut",
            onComplete: () => {
              if (snapControlsRef.current.x) {
                snapControlsRef.current.x = null;
              }
            },
          });
          snapControlsRef.current.y = animate(my, snapped.y, {
            type: "tween",
            duration: 0.18,
            ease: "easeOut",
            onComplete: () => {
              if (snapControlsRef.current.y) {
                snapControlsRef.current.y = null;
              }
            },
          });
        }
        moveTarget.removeEventListener("pointermove", onMove as EventListener);
        upTarget.removeEventListener("pointerup", onUp as EventListener);
        upTarget.removeEventListener("lostpointercapture", onUp as EventListener);
      };

      // passive:false：触屏必须允许 preventDefault 阻止页面滚动，否则拖不动。
      moveTarget.addEventListener("pointermove", onMove as EventListener, { passive: false });
      upTarget.addEventListener("pointerup", onUp as EventListener);
      upTarget.addEventListener("lostpointercapture", onUp as EventListener);
    },
    [containerRef, clampPosition, mx, my],
  );

  return { onPointerDown, x: mx, y: my, position, isDragging, snapSide, justDraggedRef };
}
