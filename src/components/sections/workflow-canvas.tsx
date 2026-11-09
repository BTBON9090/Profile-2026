"use client";

import { useEffect, useRef } from "react";
import "./workflow-canvas.css";

type Point = { x: number; y: number };
type Route = { start: Point; end: Point; axis?: "x" | "y"; color?: string };
const blue = "#8bbbf5";
const muted = "#9ca8b9";

function curve(route: Route) {
  const { start: a, end: b } = route;
  return route.axis === "y"
    ? [a, { x: a.x, y: (a.y + b.y) / 2 }, { x: b.x, y: (a.y + b.y) / 2 }, b]
    : [a, { x: (a.x + b.x) / 2, y: a.y }, { x: (a.x + b.x) / 2, y: b.y }, b];
}

function pointOnRoute(route: Route, t: number) {
  const [a, b, c, d] = curve(route);
  const q = 1 - t;
  return { x: q ** 3 * a.x + 3 * q ** 2 * t * b.x + 3 * q * t ** 2 * c.x + t ** 3 * d.x, y: q ** 3 * a.y + 3 * q ** 2 * t * b.y + 3 * q * t ** 2 * c.y + t ** 3 * d.y };
}

/** Canvas owns all node and connector geometry, so lines cannot drift from their labels. */
export default function WorkflowCanvas({ isZh }: { isZh: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const base = document.createElement("canvas");
    const bg = base.getContext("2d");
    if (!bg) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let visible = false;
    let disposed = false;
    let routes: Route[] = [];
    let scale = 1;
    let offset = 0;
    let ratio = 1;
    let cssWidth = 0;
    let cssHeight = 0;
    const font = '"Inter", "PingFang SC", "Microsoft YaHei", sans-serif';
    const text = (value: string, x: number, y: number, size = 13, color = muted, weight = 400) => {
      bg.font = `${weight} ${size}px ${font}`;
      bg.fillStyle = color;
      bg.textAlign = "center";
      bg.textBaseline = "middle";
      bg.fillText(value, x, y);
    };
    const box = (x: number, y: number, w: number, h: number, fill: string, stroke: string) => {
      bg.beginPath();
      bg.roundRect(x - w / 2, y - h / 2, w, h, 14);
      bg.fillStyle = fill;
      bg.fill();
      bg.lineWidth = 1;
      bg.strokeStyle = stroke;
      bg.stroke();
    };
    const node = (x: number, y: number, title: string, subtitle: string, final = false) => {
      bg.beginPath(); bg.arc(x, y, 11, 0, Math.PI * 2);
      bg.fillStyle = "#0d141f"; bg.fill();
      bg.strokeStyle = final ? "#66bfac" : "#45698f"; bg.lineWidth = 1; bg.stroke();
      bg.beginPath(); bg.arc(x, y, 3.5, 0, Math.PI * 2);
      bg.fillStyle = final ? "#8ddbc7" : blue; bg.fill();
      text(title, x, y + 32, 14, "#edf2f8", 600);
      text(subtitle, x, y + 54, 12);
    };
    const drawRoute = (route: Route) => {
      const [a, b, c, d] = curve(route);
      bg.beginPath(); bg.moveTo(a.x, a.y); bg.bezierCurveTo(b.x, b.y, c.x, c.y, d.x, d.y);
      bg.strokeStyle = route.color || "#405570"; bg.lineWidth = 1.2; bg.stroke();
      const previous = pointOnRoute(route, .96);
      const angle = Math.atan2(d.y - previous.y, d.x - previous.x);
      bg.save(); bg.translate(d.x, d.y); bg.rotate(angle);
      bg.beginPath(); bg.moveTo(-5, -3); bg.lineTo(0, 0); bg.lineTo(-5, 3);
      bg.lineCap = "round"; bg.lineJoin = "round"; bg.stroke(); bg.restore();
    };
    const render = (time: number) => {
      frame = 0;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(base, 0, 0);
      if (!reduced.matches) {
        ctx.setTransform(ratio * scale, 0, 0, ratio * scale, ratio * offset, 0);
        routes.forEach((route, index) => {
          // A small moving point explains direction without animating text or layout.
          const progress = ((time / 5600 + index * .19) % 1);
          const p = pointOnRoute(route, progress);
          ctx.globalAlpha = .65 * Math.sin(progress * Math.PI);
          ctx.beginPath(); ctx.arc(p.x, p.y, 2.1, 0, Math.PI * 2);
          ctx.fillStyle = route.color || blue; ctx.fill();
        });
        ctx.globalAlpha = 1;
        if (visible && !document.hidden) frame = requestAnimationFrame(render);
      }
    };
    const redraw = () => {
      if (disposed) return;
      cancelAnimationFrame(frame);
      cssWidth = canvas.getBoundingClientRect().width;
      if (!cssWidth) return;
      const mobile = cssWidth < 960;
      const logicalWidth = mobile ? 360 : 1200;
      scale = mobile ? Math.min(cssWidth, 440) / logicalWidth : cssWidth / logicalWidth;
      offset = (cssWidth - logicalWidth * scale) / 2;
      cssHeight = (mobile ? 825 : 350) * scale;
      ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.style.height = `${cssHeight}px`;
      canvas.width = base.width = Math.round(cssWidth * ratio);
      canvas.height = base.height = Math.round(cssHeight * ratio);
      bg.setTransform(ratio * scale, 0, 0, ratio * scale, ratio * offset, 0);
      const p = (x: number, y: number) => ({ x, y });
      if (mobile) {
        routes = [
          { start: p(90, 108), end: p(90, 133), axis: "y" },
          { start: p(90, 210), end: p(90, 245), axis: "y" },
          { start: p(210, 145), end: p(103, 145), color: "#a397d4" },
          { start: p(90, 323), end: p(90, 370), axis: "y" },
          { start: p(90, 323), end: p(270, 370), axis: "y" },
          { start: p(90, 442), end: p(180, 548), axis: "y" },
          { start: p(270, 502), end: p(180, 548), axis: "y" },
          { start: p(180, 625), end: p(180, 658), axis: "y" },
          { start: p(180, 735), end: p(180, 768), axis: "y" },
        ];
        routes.forEach(drawRoute);
        node(90, 45, "PRD", isZh ? "需求文档" : "Requirements");
        node(90, 145, isZh ? "AI 理解" : "AI understanding", isZh ? "拆解需求与场景" : "Needs & scenarios");
        box(280, 145, 140, 48, "#211d30", "#4b4267");
        text(isZh ? "设计 Skill 约束" : "Design skill", 280, 145, 13, "#d3c9f1", 500);
        node(90, 257, isZh ? "多版输出对比" : "Compare options", isZh ? "界面 / 交互" : "Interface / interaction");
        box(90, 406, 158, 72, "#101a26", "#30475f");
        text(isZh ? "静态 H5" : "Static H5", 90, 395, 14, "#e5eef9", 600);
        text("HTML + CSS", 90, 419, 12);
        box(270, 436, 158, 132, "#101a26", "#30475f");
        text(isZh ? "工程选型" : "Frameworks", 270, 395, 14, "#e5eef9", 600);
        text("React / Vue / uni-app", 270, 419, 11);
        text("Element / Ant Design", 270, 443, 11);
        text("Arco / shadcn", 270, 463, 11);
        text(isZh ? "部署 · Vercel" : "Deploy · Vercel", 270, 488, 11);
        node(180, 560, isZh ? "工程化 UI 审查" : "UI review", isZh ? "界面 · 交互 · 功能" : "Interface · interaction · function");
        node(180, 670, isZh ? "前端 Demo" : "Frontend demo", isZh ? "演示与验证" : "Present & validate");
        node(180, 780, isZh ? "前端交付" : "Frontend delivery", "", true);
      } else {
        routes = [
          { start: p(54, 170), end: p(178, 170) },
          { start: p(202, 170), end: p(338, 170) },
          { start: p(190, 85), end: p(190, 158), axis: "y", color: "#a397d4" },
          { start: p(362, 170), end: p(460, 96) },
          { start: p(362, 170), end: p(460, 266) },
          { start: p(710, 96), end: p(818, 170) },
          { start: p(710, 266), end: p(818, 170) },
          { start: p(842, 170), end: p(988, 170) },
          { start: p(1012, 170), end: p(1145, 170) },
        ];
        routes.forEach(drawRoute);
        node(42, 170, "PRD", isZh ? "需求文档" : "Requirements");
        node(190, 170, isZh ? "AI 理解" : "AI understanding", isZh ? "拆解需求与场景" : "Needs & scenarios");
        box(190, 61, 148, 48, "#211d30", "#4b4267");
        text(isZh ? "设计 Skill 约束" : "Design skill", 190, 61, 13, "#d3c9f1", 500);
        node(350, 170, isZh ? "多版输出对比" : "Compare options", isZh ? "界面 / 交互" : "Interface / interaction");
        box(585, 96, 250, 72, "#101a26", "#30475f");
        text(isZh ? "静态 H5" : "Static H5", 585, 84, 14, "#e5eef9", 600);
        text("HTML + CSS", 585, 110, 13);
        box(585, 266, 250, 122, "#101a26", "#30475f");
        text(isZh ? "工程选型" : "Frameworks", 585, 226, 14, "#e5eef9", 600);
        text("React / Vue / uni-app", 585, 252, 12);
        text("Element / Ant Design / Arco / shadcn", 585, 276, 12);
        text(isZh ? "部署 · Vercel" : "Deploy · Vercel", 585, 302, 12);
        node(830, 170, isZh ? "工程化 UI 审查" : "UI review", isZh ? "界面 · 交互 · 功能" : "Interface · interaction · function");
        node(1000, 170, isZh ? "前端 Demo" : "Frontend demo", isZh ? "演示与验证" : "Present & validate");
        node(1157, 170, isZh ? "前端交付" : "Delivery", isZh ? "代码与规范" : "Code & specs", true);
      }
      render(performance.now());
    };
    const resume = () => { cancelAnimationFrame(frame); render(performance.now()); };
    const size = new ResizeObserver(redraw);
    size.observe(canvas);
    const viewport = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; resume(); });
    viewport.observe(canvas);
    reduced.addEventListener("change", resume);
    document.addEventListener("visibilitychange", resume);
    void document.fonts.ready.then(redraw);
    redraw();
    return () => { disposed = true; cancelAnimationFrame(frame); size.disconnect(); viewport.disconnect(); reduced.removeEventListener("change", resume); document.removeEventListener("visibilitychange", resume); };
  }, [isZh]);

  return <figure className="workflow-diagram" aria-label={isZh ? "从需求理解到前端交付的工作流程" : "Workflow from requirements to frontend delivery"}>
    <canvas ref={canvasRef} className="workflow-diagram__canvas" aria-hidden="true" />
    <figcaption className="sr-only">{isZh ? "PRD → AI 理解，结合设计 Skill 约束 → 多版界面与交互输出对比 → 前端实现：静态 H5（HTML + CSS），或工程选型（React、Vue、uni-app，统一选用 Element、Ant Design、Arco、shadcn 等组件库，Vercel 部署）→ 工程化 UI 的界面、交互和功能审查 → 前端 Demo 演示与验证 → 前端交付。" : "PRD → AI understanding with design skill constraints → Compare interface and interaction options → Static HTML/CSS or framework and component library selection → UI, interaction and functional review → Frontend demo → Frontend delivery."}</figcaption>
  </figure>;
}
