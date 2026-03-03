"use client";

import { useEffect, useRef, useState } from "react";

export default function DotMatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  },[]);

  useEffect(() => {
    if (!isMounted) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let dots: Dot[] =[];
    
    // 🔧 极客视觉配置 (Pure White & Grid Logic)
    const config = {
      spacing: 103,            // 网格间距 (稍大一点，显出大气)
      baseRadius: 1,          // 静默状态点的大小
      majorRadius: 2,     // 🆕 关键点大小 (每隔 5 个的大点)
      activeRadius: 1.5,      // 激活状态点的大小 (由小变大)
      mouseRadius: 250,       // 鼠标光照范围 (手电筒半径)
      
      // 颜色配置 (纯白灰度系统)
      colorBase: "rgba(255, 255, 255, 0.12)",   // 背景潜伏色 (极暗)
      colorActive: "255, 255, 255",             // 激活色 (纯白)
      colorMajor: "255, 255, 255",   // 🆕 大点：极客蓝 (Tailwind Blue-500)
      // 静默亮度必须低于下面的 lineThreshold (0.2)
      baseAlpha: 0.15,      // 默认点的亮度
      majorAlpha: 0.9,      // 🆕 大点的亮度
      // 物理配置
      pullStrength: 0.2,     // 微引力强度 (不破坏网格结构，仅轻微形变)
      dampening: 0.1,         // 回弹阻尼
    };

    // 在 useEffect 内部，定义 mouse 对象时增加 lastX, lastY 和 speed
    let mouse = { 
        x: -1000, 
        y: -1000, 
        lastX: -1000, 
        lastY: -1000,
        speed: 0 // 记录当前这一帧的移动速度
    };
    let cols = 0; // 记录列数，用于寻找“下方的邻居”

    class Dot {
      x: number;
      y: number;
      originX: number;
      originY: number;
      size: number;
      alpha: number;
      // 🆕 新增属性：记录这个点原本应该多大
      initialSize: number;
      color: string; // 🆕 新增：每个点拥有独立的颜色属性
      // 在网格中的索引位置，用于画线
      ix: number;
      iy: number;

      constructor(x: number, y: number, ix: number, iy: number) {
        this.x = x;
        this.y = y;
        this.originX = x;
        this.originY = y;
        this.ix = ix;
        this.iy = iy;
        // 🆕 核心逻辑：每隔 5 个格子 (索引能被 5 整除) 使用大尺寸
        const isMajor = (ix % 4 === 0 && iy % 4 === 0);
        this.initialSize = isMajor ? config.majorRadius : config.baseRadius;

        // 初始化大小使用计算好的 initialSize
        this.size = this.initialSize;
        this.color = isMajor ? config.colorMajor : config.colorActive;
        this.alpha = isMajor ? 0.2 : config.baseAlpha;
      }

      update() {
        // 1. 计算距离
        const dx = mouse.x - this.originX;
        const dy = mouse.y - this.originY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 2. 交互逻辑 (光照范围内的变化)
        if (distance < config.mouseRadius) {
            const force = (config.mouseRadius - distance) / config.mouseRadius; // 0 (边缘) -> 1 (中心)
            
            // A. 大小渐变 (Size Gradient)
            const targetSize = this.initialSize + (config.activeRadius - 1) * force;
            this.size += (targetSize - this.size) * config.dampening;

            // B. 透明度渐变 (Alpha Gradient) - 中心纯白，边缘透明
            // 使用 easeIn 曲线 (force * force) 让光晕中心更聚光
            const targetAlpha = 0.1 + force * 0.9; 
            this.alpha += (targetAlpha - this.alpha) * config.dampening;

            // C. 微引力 (Micro-Gravity) - 轻微向鼠标靠拢
            const pullX = (dx * force) * config.pullStrength;
            const pullY = (dy * force) * config.pullStrength;
            this.x += (this.originX + pullX - this.x) * config.dampening;
            this.y += (this.originY + pullY - this.y) * config.dampening;

        } else {
            // 复原逻辑
            // 确保非major点也能正确恢复到baseRadius  
            this.size += (this.initialSize - this.size) * config.dampening;
            // 简单起见，统一回弹到 baseAlpha 也可以，或者：
            const targetBaseAlpha = (this.ix % 4 === 0 && this.iy % 4 === 0) ? 0.2 : config.baseAlpha;
            this.alpha += (targetBaseAlpha - this.alpha) * config.dampening;
            this.x += (this.originX - this.x) * config.dampening;
            this.y += (this.originY - this.y) * config.dampening;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
        ctx.fill();
      }
    }

    const initMatrix = () => {
      dots =[];
      // 处理视网膜屏高清渲染
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      // CSS 尺寸必须显式设置
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      cols = Math.floor(window.innerWidth / config.spacing) + 1;
      const rows = Math.floor(window.innerHeight / config.spacing) + 1;

      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          dots.push(new Dot(
             i * config.spacing, 
             j * config.spacing,
             i, 
             j
          ));
        }
      }
    };

    // ⬜️ 绘制方块填充 (Quad Fill)
    const drawQuad = (dot: Dot, rightDot: Dot, bottomDot: Dot, bottomRightDot: Dot) => {
        // 计算四个点的平均亮度
        const avgAlpha = (dot.alpha + rightDot.alpha + bottomDot.alpha + bottomRightDot.alpha) / 4;

        // ⚠️ 阈值拦截：只有亮度超过 0.4 的区域才填充方块
        // 这保证了方块只出现在鼠标中心，而不是边缘
        if (avgAlpha < 0.6) return;

        // 绘制填充
        ctx.fillStyle = `rgba(255, 255, 255, ${avgAlpha * 0.08})`; // 透明度 10% 的白
        ctx.beginPath();
        ctx.moveTo(dot.x, dot.y);
        ctx.lineTo(rightDot.x, rightDot.y);
        ctx.lineTo(bottomRightDot.x, bottomRightDot.y);
        ctx.lineTo(bottomDot.x, bottomDot.y);
        ctx.closePath();
        ctx.fill();
    };

    // ⚡️ 绘制连线 (动量驱动的故障效果)
    const drawLines = (dot: Dot, rightDot: Dot | undefined, bottomDot: Dot | undefined) => {
        // 1. 基础阈值：太暗不画
        if (dot.alpha < 0.25) return;

        // 2. 动量检测
        // 只有当鼠标在移动 (speed > 2) 且处于边缘区域 (alpha < 0.5) 时，才触发故障
        const isEdge = dot.alpha < 0.3;
        const isMoving = mouse.speed > 0.2 && mouse.speed < 10; // 速度阈值，太慢的微动不算
        const shouldGlitch = isEdge && isMoving;

        // 3. 故障参数计算
        // 如果触发故障，随机大幅改变透明度 (模拟接触不良 0.1 ~ 0.9)
        // 如果不触发，使用稳定的亮度
        const lineAlpha = shouldGlitch 
            ? (Math.random() > 0.6 ? dot.alpha * 0.6 : 0.05) // 50%概率高亮，50%概率消失(闪烁)
            : dot.alpha * 0.3; // 稳定态

        // 故障位移：只有在故障时才跳动，幅度取决于鼠标速度
        const jitterAmount = shouldGlitch ? 3 : 0;

        ctx.lineWidth = 0.5;
        ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha})`;

        // --- 绘制水平线 ---
        if (rightDot) {
            ctx.beginPath();
            
            // 只有故障时才计算随机偏移
            const ox = shouldGlitch ? (Math.random() - 0.5) * jitterAmount : 0;
            const oy = shouldGlitch ? (Math.random() - 0.5) * jitterAmount : 0;
            
            ctx.moveTo(dot.x + ox, dot.y + oy);
            ctx.lineTo(rightDot.x + ox, rightDot.y + oy);
            ctx.stroke();
        }

        // --- 绘制垂直线 ---
        if (bottomDot) {
            ctx.beginPath();
            
            const ox = shouldGlitch ? (Math.random() - 0.5) * jitterAmount : 0;
            const oy = shouldGlitch ? (Math.random() - 0.5) * jitterAmount : 0;

            ctx.moveTo(dot.x + ox, dot.y + oy);
            ctx.lineTo(bottomDot.x + ox, bottomDot.y + oy);
            ctx.stroke();
        }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 🚀 1. 计算当前帧的鼠标速度 (曼哈顿距离简单高效)
      // 如果鼠标移出屏幕 (-1000)，速度视为 0
      if (mouse.x < -100) {
          mouse.speed = 0;
      } else {
          // 计算瞬间速度
          const currSpeed = Math.abs(mouse.x - mouse.lastX) + Math.abs(mouse.y - mouse.lastY);
          // 使用缓动系数 (lerp) 让速度变化平滑一点点，避免闪烁过快
          // 0.8 是衰减系数，模拟"跳动4次"的短促感 (能量每帧衰减 20%)
          mouse.speed = mouse.speed * 0.6 + currSpeed * 0.4;
      }

      // 2. 遍历点阵
      for (let i = 0; i < dots.length; i++) {
          const dot = dots[i];
          dot.update();

          const hasRight = dot.ix < cols - 1;
          const rightDot = hasRight ? dots[i + 1] : undefined;
          const bottomDot = dots[i + cols];
          const bottomRightDot = (hasRight && bottomDot) ? dots[i + cols + 1] : undefined;

          if (rightDot && bottomDot && bottomRightDot) {
              drawQuad(dot, rightDot, bottomDot, bottomRightDot);
          }

          drawLines(dot, rightDot, bottomDot);

          dot.draw(ctx);
      }

      // 🚀 3. 更新上一帧坐标，供下一次计算速度使用
      mouse.lastX = mouse.x;
      mouse.lastY = mouse.y;

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleResize = () => {
      initMatrix();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    initMatrix();
    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMounted]);

  if (!isMounted) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none" 
      aria-hidden="true"
    />
  );
}