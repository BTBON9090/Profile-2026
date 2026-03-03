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
      spacing: 80,            // 网格间距 (稍大一点，显出大气)
      baseRadius: 1,          // 静默状态点的大小
      activeRadius: 1.5,      // 激活状态点的大小 (由小变大)
      mouseRadius: 250,       // 鼠标光照范围 (手电筒半径)
      
      // 颜色配置 (纯白灰度系统)
      colorBase: "rgba(255, 255, 255, 0.12)",   // 背景潜伏色 (极暗)
      colorActive: "255, 255, 255",             // 激活色 (纯白)
      
      // 物理配置
      pullStrength: 0.3,     // 微引力强度 (不破坏网格结构，仅轻微形变)
      dampening: 0.1,         // 回弹阻尼
    };

    let mouse = { x: -1000, y: -1000 };
    let cols = 0; // 记录列数，用于寻找“下方的邻居”

    class Dot {
      x: number;
      y: number;
      originX: number;
      originY: number;
      size: number;
      alpha: number;
      
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
        this.size = config.baseRadius;
        this.alpha = 0.3; // 背景 dot 的透明度
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
            const targetSize = config.baseRadius + (config.activeRadius - config.baseRadius) * force;
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
            this.size += (config.baseRadius - this.size) * config.dampening;
            this.alpha += (0.3 - this.alpha) * config.dampening;
            this.x += (this.originX - this.x) * config.dampening;
            this.y += (this.originY - this.y) * config.dampening;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${config.colorActive}, ${this.alpha})`;
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

    const drawLines = (dot: Dot, rightDot: Dot | undefined, bottomDot: Dot | undefined) => {
        // 只有当点有足够的亮度(alpha)时才绘制连线，优化性能且制造"光场"效果
        if (dot.alpha < 0.6) return;

        ctx.strokeStyle = `rgba(${config.colorActive}, ${dot.alpha * 0.4})`; // 线比点淡一点
        ctx.lineWidth = 0.5;

        // 绘制水平连线 (Grid Horizontal)
        if (rightDot) {
            ctx.beginPath();
            ctx.moveTo(dot.x, dot.y);
            ctx.lineTo(rightDot.x, rightDot.y);
            ctx.stroke();
        }

        // 绘制垂直连线 (Grid Vertical)
        if (bottomDot) {
            ctx.beginPath();
            ctx.moveTo(dot.x, dot.y);
            ctx.lineTo(bottomDot.x, bottomDot.y);
            ctx.stroke();
        }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 我们需要通过索引找到邻居
      for (let i = 0; i < dots.length; i++) {
          const dot = dots[i];
          dot.update();
          dot.draw(ctx);

          // 寻找邻居：只有在鼠标附近被激活的点才画线
          if (dot.alpha > 0.15) { 
              // 找到右边的邻居 (index + 1)，确保不是当前行的最后一个
              const rightDot = (dot.ix < cols - 1) ? dots[i + 1] : undefined;
              
              // 找到下边的邻居 (index + cols)
              const bottomDot = dots[i + cols];

              drawLines(dot, rightDot, bottomDot);
          }
      }

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