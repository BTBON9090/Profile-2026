"use client";
import { motion } from "framer-motion";
import { createContext, useContext, useEffect, useRef, useState } from "react";

/* ==========================================================================
   ToolDemos — AllinOne 简单工具集的动态演示组件
   每个演示用循环动画展示 Figma 设计场景下功能的真实因果，
   并辅以底部动态说明文字（Caption）说明动作过程中发生了什么。

   统一视觉语言：
   - 主色 黑/白/灰；点缀色仅 蓝(VIOLET=#7C3AED) / 粉(PINK=#EC4899)
   - 圆角统一 rounded-md；边框统一 1.5px；文字统一 11px monospace
   - 元素尺寸统一偏大（w-16 h-16 级别），保证可读
   - 循环：动作 1.2s → 保持 1.5s → 复位 0.3s → 间隔 ≥3s 再播下一次
   - 仅用 transform / opacity，避免 reflow
   ========================================================================== */

const mono = { fontFamily: "'SF Mono', 'JetBrains Mono', 'Consolas', monospace" };

/* ── 激活态 Context：仅前台/居中项为 true，其余项冻结动画 ── */
const DemoActiveContext = createContext<boolean>(true);
export const DemoActiveProvider = DemoActiveContext.Provider;

export type DemoType =
  | "to-frame"
  | "to-rect"
  | "split-text"
  | "join-text"
  | "remove-al"
  | "add-al-wrapper"
  | "up-one"
  | "up-all"
  | "ungroup-all"
  | "unlock-all"
  | "swap-fs"
  | "reset-image"
  | "sort-layers"
  | "rename-content"
  | "detach-all"
  | "remove-hidden"
  | "pixel-perfect"
  | "swap-positions"
  | "create-styles"
  | "match-styles"
  | "ppt-export"
  | "component-clean"
  | "isometric-transform"
  | "space-beacon"
  | "language-switch";

const VIOLET = "#7C3AED";
const PINK = "#EC4899";

/* 缓动：干脆利落 */
const EASE = [0.4, 0.0, 0.2, 1] as const;
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/* 通用颜色 token */
const ink = (dark?: boolean) => (dark ? "#fff" : "#171717");
const muted = (dark?: boolean) => (dark ? "#9b9b9b" : "#6b6b6b");
const line = (dark?: boolean) => (dark ? "#3a3a3a" : "#d4d2cc");
const card = (dark?: boolean) => (dark ? "#2a2a2a" : "#ffffff");
const soft = (dark?: boolean, a = 0.04) => (dark ? `rgba(255,255,255,${a})` : `rgba(0,0,0,${a})`);

/* ── 通用容器：动画区域吃掉剩余高度，Caption 字幕条贴底部居中 ── */
function DemoBox({ children, dark }: { children?: React.ReactNode; dark?: boolean }) {
  // 拆分 children：倒数第一个为底部 Caption，其余为上半部分内容（动画 + Tag2）
  const arr = Array.isArray(children) ? children.flat() : [children];
  const last = arr[arr.length - 1];
  const rest = arr.slice(0, -1);
  const bg = dark ? "#171717" : "#ffffff";
  // demo 内部画板底色，与外层拉开层次；浅色用米灰、深色用炭灰
  const subBg = dark ? "#202020" : "#f1efea";
  const subBorder = dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.10)";
  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden" style={{ background: bg }}>
      {/* 上：动画区域，内部画板有独立底色 + 边界，吃掉所有剩余高度 */}
      <div className="relative flex-1 flex items-center justify-center p-3 min-h-0">
        <div className="relative w-full h-full flex items-center justify-center"
          style={{ background: subBg, border: `1.5px solid ${subBorder}`, borderRadius: 8 }}>
          {rest}
        </div>
      </div>
      {/* 下：Caption 字幕条，贴底部居中，上提留白、无横线 */}
      <div className="shrink-0 pb-3 pt-1">{last}</div>
    </div>
  );
}

/* ── 顶部小标签 ── */
function Tag2({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] tracking-wider z-10 ${dark ? "bg-white/12 text-white/60 border border-white/10" : "bg-white text-neutral-500 border border-neutral-200"}`}
      style={mono}
    >
      {children}
    </span>
  );
}

/* ── 循环进度 hook：返回 0→1 的循环进度，周期为 duration 秒
   非激活态（DemoActiveContext=false）时冻结进度，停止 rAF，避免背景动画干扰 ── */
function useLoopProgress(duration: number) {
  const active = useContext(DemoActiveContext);
  const [p, setP] = useState(0);
  const pRef = useRef(0);
  useEffect(() => {
    if (!active) return;                       // 冻结：不启动 rAF
    let raf = 0;
    let start = 0;
    const tick = (t: number) => {
      if (!start) start = t;
      const elapsed = (t - start) / 1000;
      const cur = (elapsed % duration) / duration;
      pRef.current = cur;
      setP(cur);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration, active]);
  // 非激活态：保留上次进度，使画面停在静态状态
  return active ? p : pRef.current;
}

/* ── 底部动态说明文字（字幕）：贴底部居中，无横线 ── */
function Caption({ progress, dark, steps }: {
  progress: number; dark?: boolean;
  steps: { at: number; text: string }[];
}) {
  const cur = [...steps].reverse().find((s) => progress >= s.at) || steps[0];
  return (
    <div className="flex items-center justify-center px-4">
      <motion.span
        key={cur.text}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: EASE_OUT }}
        className={`text-[11px] tracking-wide text-center ${dark ? "text-white/55" : "text-neutral-400"}`}
        style={mono}
      >
        {cur.text}
      </motion.span>
    </div>
  );
}

/* 通用箭头组件：支持 right/left/down/up */
function Arrow({ dir = "right", dark, color, size = 1 }: { dir?: "right" | "left" | "down" | "up"; dark?: boolean; color?: string; size?: number }) {
  const stroke = color || muted(dark);
  const w = 28 * size;
  const h = dir === "down" || dir === "up" ? 28 * size : 14 * size;
  const w2 = dir === "down" || dir === "up" ? 14 * size : 28 * size;
  const rot = dir === "left" ? "rotate(180)" : dir === "down" ? "rotate(90)" : dir === "up" ? "rotate(-90)" : "";
  return (
    <svg width={w2} height={h} viewBox="0 0 28 14" fill="none" style={{ transform: rot, transformOrigin: "center" }}>
      <path d="M2 7 H22" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M18 3 L24 7 L18 11" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/* ==========================================================================
   1. 矩转框 — 左：矩形 → 右：Frame（箭头指向）
   ========================================================================== */
function ToFrameDemo({ dark }: { dark?: boolean }) {
  const D = 6.0;
  const p = useLoopProgress(D);
  const c = ink(dark);
  // 阶段：0-0.45 展示矩形 → 0.45-0.55 转换 → 0.55-1 展示 Frame
  const showFrame = p > 0.5;
  return (
    <DemoBox dark={dark}>
      <Tag2 dark={dark}>Rectangle → Frame</Tag2>
      <div className="flex items-center justify-center gap-4">
        {/* 左：矩形 */}
        <div className="flex flex-col items-center gap-1.5">
          <motion.div
            className="w-16 h-16 rounded-md"
            style={{ background: VIOLET }}
            animate={{ opacity: showFrame ? 0.25 : 1, scale: showFrame ? 0.85 : 1 }}
            transition={{ duration: 0.3, ease: EASE }}
          />
          <span className="text-[11px]" style={{ ...mono, color: muted(dark) }}>Rectangle</span>
        </div>
        {/* 中：向右箭头 */}
        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, ease: EASE }}>
          <Arrow dir="right" dark={dark} />
        </motion.div>
        {/* 右：Frame */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="relative w-16 h-16">
            <div
              className="absolute inset-0 rounded-md border-[1.5px] border-dashed flex items-center justify-center"
              style={{ borderColor: c, background: soft(dark, 0.03) }}
            >
              <div className="w-9 h-7 rounded" style={{ background: PINK }} />
            </div>
            <span className="absolute -top-2 -left-1.5 px-1 py-0 rounded text-[9px] font-bold leading-none" style={{ ...mono, color: "#fff", background: c }}>Frame</span>
          </div>
          <span className="text-[11px]" style={{ ...mono, color: muted(dark) }}>Frame</span>
        </div>
      </div>
      <Caption dark={dark} progress={p} steps={[
        { at: 0, text: "选中一个普通矩形" },
        { at: 0.45, text: "执行 矩转框" },
        { at: 0.55, text: "矩形升级为 Frame，可容纳子元素" },
        { at: 0.92, text: "外观保留 · 容器化" },
      ]} />
    </DemoBox>
  );
}

/* ==========================================================================
   2. 框转矩 — 左：Frame → 右：矩形（箭头指向）
   ========================================================================== */
function ToRectDemo({ dark }: { dark?: boolean }) {
  const D = 6.0;
  const p = useLoopProgress(D);
  const c = ink(dark);
  return (
    <DemoBox dark={dark}>
      <Tag2 dark={dark}>Frame → Rectangle</Tag2>
      <div className="flex items-center justify-center gap-4">
        {/* 左：Frame（含子元素） */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="relative w-16 h-16">
            <div
              className="absolute inset-0 rounded-md border-[1.5px] border-dashed flex items-center justify-center gap-1"
              style={{ borderColor: c, background: soft(dark, 0.03) }}
            >
              <div className="w-5 h-5 rounded" style={{ background: PINK }} />
              <div className="w-4 h-4 rounded-full" style={{ background: VIOLET }} />
            </div>
            <span className="absolute -top-2 -left-1.5 px-1 py-0 rounded text-[9px] font-bold leading-none" style={{ ...mono, color: "#fff", background: c }}>Frame</span>
          </div>
          <span className="text-[11px]" style={{ ...mono, color: muted(dark) }}>Frame</span>
        </div>
        {/* 中：向右箭头 */}
        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, ease: EASE }}>
          <Arrow dir="right" dark={dark} />
        </motion.div>
        {/* 右：矩形 */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-16 h-16 rounded-md" style={{ background: VIOLET }} />
          <span className="text-[11px]" style={{ ...mono, color: muted(dark) }}>Rectangle</span>
        </div>
      </div>
      <Caption dark={dark} progress={p} steps={[
        { at: 0, text: "选中一个 Frame 容器" },
        { at: 0.45, text: "执行 框转矩" },
        { at: 0.55, text: "移除容器属性，降维扁平化" },
        { at: 0.92, text: "变为单个矩形" },
      ]} />
    </DemoBox>
  );
}

/* ==========================================================================
   3. 段落行拆分 — 一整段两行文本 → 拆成两个独立文本图层
   ========================================================================== */
function SplitTextDemo({ dark }: { dark?: boolean }) {
  const D = 6.0;
  const p = useLoopProgress(D);
  const c = ink(dark);
  const para1 = "今天天气真不错，";
  const para2 = "适合出去散散步。";
  // 拆分前：一个文本框两段；拆分后：两个独立文本框带各自边框
  const split = p > 0.5;
  return (
    <DemoBox dark={dark}>
      <Tag2 dark={dark}>Split by Paragraph</Tag2>
      <div className="relative" style={{ width: 300, height: 120 }}>
        {/* 整段文本框（拆分前） */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 top-3 rounded-md px-4 py-2 text-[13px] leading-relaxed text-center"
          style={{ color: c, background: soft(dark, 0.04), border: `1.5px solid ${split ? "transparent" : VIOLET}` }}
          animate={{ opacity: split ? 0 : 1, scale: split ? 0.92 : 1 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          {para1}<br />{para2}
        </motion.div>
        {/* 拆分后：两个独立图层 */}
        <motion.div
          className="absolute rounded-md px-3.5 py-1.5 text-[13px]"
          style={{ color: c, background: soft(dark, 0.04), border: `1.5px solid ${VIOLET}`, top: 6, left: split ? 14 : 100 }}
          animate={{ opacity: split ? 1 : 0, x: split ? 0 : -20 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          {para1}
        </motion.div>
        <motion.div
          className="absolute rounded-md px-3.5 py-1.5 text-[13px]"
          style={{ color: c, background: soft(dark, 0.04), border: `1.5px solid ${PINK}`, top: 58, left: split ? 96 : 100 }}
          animate={{ opacity: split ? 1 : 0, x: split ? 0 : 20 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          {para2}
        </motion.div>
      </div>
      <Caption dark={dark} progress={p} steps={[
        { at: 0, text: "一段带换行的文本" },
        { at: 0.45, text: "执行 段落行拆分" },
        { at: 0.55, text: "按换行拆成独立文本层" },
        { at: 0.92, text: "两段各自成层，可单独编辑" },
      ]} />
    </DemoBox>
  );
}

/* ==========================================================================
   4. 文本拼合 — 两个独立文本层 → 合成一段带换行的文本
   ========================================================================== */
function JoinTextDemo({ dark }: { dark?: boolean }) {
  const D = 6.0;
  const p = useLoopProgress(D);
  const c = ink(dark);
  const para1 = "今天天气真不错，";
  const para2 = "适合出去散散步。";
  const joined = p > 0.5;
  return (
    <DemoBox dark={dark}>
      <Tag2 dark={dark}>Join to Text</Tag2>
      <div className="relative" style={{ width: 300, height: 120 }}>
        {/* 拼合前：两个独立图层 */}
        <motion.div
          className="absolute rounded-md px-3.5 py-1.5 text-[13px]"
          style={{ color: c, background: soft(dark, 0.04), border: `1.5px solid ${joined ? "transparent" : VIOLET}`, top: 6, left: 14 }}
          animate={{ opacity: joined ? 0 : 1, x: joined ? 20 : 0 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          {para1}
        </motion.div>
        <motion.div
          className="absolute rounded-md px-3.5 py-1.5 text-[13px]"
          style={{ color: c, background: soft(dark, 0.04), border: `1.5px solid ${joined ? "transparent" : PINK}`, top: 58, left: 96 }}
          animate={{ opacity: joined ? 0 : 1, x: joined ? -20 : 0 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          {para2}
        </motion.div>
        {/* 拼合后：一个文本框两段 */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 top-3 rounded-md px-4 py-2 text-[13px] leading-relaxed text-center"
          style={{ color: c, background: soft(dark, 0.04), border: `1.5px solid ${joined ? VIOLET : "transparent"}` }}
          animate={{ opacity: joined ? 1 : 0, scale: joined ? 1 : 0.92 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          {para1}<br />{para2}
        </motion.div>
      </div>
      <Caption dark={dark} progress={p} steps={[
        { at: 0, text: "散落的两个文本图层" },
        { at: 0.45, text: "执行 文本拼合" },
        { at: 0.55, text: "按视觉位置排序合并" },
        { at: 0.92, text: "合成一段带换行的文本" },
      ]} />
    </DemoBox>
  );
}

/* ==========================================================================
   5. 清除自动布局属性 — Auto Layout 容器内整齐排列 → 移除后散落
   ========================================================================== */
function RemoveALDemo({ dark }: { dark?: boolean }) {
  const D = 6.0;
  const p = useLoopProgress(D);
  const c = muted(dark);
  const removed = p > 0.5;
  const blocks = [
    { color: VIOLET, al: { x: 28, y: 8 }, free: { x: 6, y: 4 } },
    { color: PINK, al: { x: 28, y: 40 }, free: { x: 96, y: 36 } },
    { color: VIOLET, al: { x: 28, y: 72 }, free: { x: 36, y: 84 } },
  ];
  return (
    <DemoBox dark={dark}>
      <Tag2 dark={dark}>Remove Auto Layout</Tag2>
      <div className="relative" style={{ width: 192, height: 132 }}>
        {/* AL 容器边框 */}
        <motion.div
          className="absolute rounded-md border-[1.5px] border-dashed"
          style={{ borderColor: c, background: card(dark), left: 16, top: 4, width: 100, height: 108 }}
          animate={{ opacity: removed ? 0.25 : 1, scale: removed ? 0.96 : 1 }}
          transition={{ duration: 0.3, ease: EASE }}
        />
        {blocks.map((b, i) => (
          <motion.div
            key={i}
            className="absolute w-12 h-7 rounded"
            style={{ background: b.color }}
            animate={{
              x: removed ? b.free.x : b.al.x,
              y: removed ? b.free.y : b.al.y,
            }}
            transition={{ duration: 0.4, ease: EASE }}
          />
        ))}
      </div>
      <Caption dark={dark} progress={p} steps={[
        { at: 0, text: "Auto Layout 容器，子元素自动排列" },
        { at: 0.45, text: "执行 清除自动布局" },
        { at: 0.55, text: "移除布局约束" },
        { at: 0.92, text: "子元素恢复绝对定位，自由摆放" },
      ]} />
    </DemoBox>
  );
}

/* ==========================================================================
   6. 外加自动布局 Frame — 给每个选中图层分别套一层 AL 外套
   ========================================================================== */
function AddALWrapperDemo({ dark }: { dark?: boolean }) {
  const D = 6.0;
  const p = useLoopProgress(D);
  const c = muted(dark);
  const wrapped = p > 0.5;
  const items = [
    { color: VIOLET, label: "Btn" },
    { color: PINK, label: "Card" },
  ];
  return (
    <DemoBox dark={dark}>
      <Tag2 dark={dark}>Wrap Each in AL Frame</Tag2>
      <div className="flex flex-col items-center gap-3">
        {items.map((it, i) => (
          <div key={i} className="relative flex flex-col items-center gap-1.5">
            <div className="relative" style={{ padding: wrapped ? 8 : 0 }}>
              {/* AL 外套 */}
              <motion.div
                className="absolute rounded-md border-[1.5px] border-dashed"
                style={{ borderColor: c, background: card(dark), inset: 0 }}
                animate={{
                  opacity: wrapped ? 1 : 0,
                  scale: wrapped ? 1 : 0.7,
                }}
                transition={{ duration: 0.3, ease: EASE, delay: i * 0.08 }}
              />
              <div
                className="relative w-20 h-10 rounded-md flex items-center justify-center text-white text-[12px] font-bold"
                style={{ background: it.color }}
              >
                {it.label}
              </div>
              {wrapped && (
                <motion.span
                  className="absolute -top-2 left-1 px-1 py-0 rounded text-[9px] font-bold leading-none"
                  style={{ ...mono, color: "#fff", background: ink(dark) }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                >Frame</motion.span>
              )}
            </div>
          </div>
        ))}
      </div>
      <Caption dark={dark} progress={p} steps={[
        { at: 0, text: "选中多个裸奔图层" },
        { at: 0.45, text: "执行 外加自动布局 Frame" },
        { at: 0.55, text: "分别套上 AL 外套" },
        { at: 0.92, text: "各自成为响应式容器，互不影响" },
      ]} />
    </DemoBox>
  );
}

/* ==========================================================================
   7. 逃逸一层 — 元素从子 Frame 移到父 Frame 同级
   ========================================================================== */
function UpOneDemo({ dark }: { dark?: boolean }) {
  const D = 6.0;
  const p = useLoopProgress(D);
  const c = muted(dark);
  const escaped = p > 0.5;
  return (
    <DemoBox dark={dark}>
      <Tag2 dark={dark}>Escape One Level</Tag2>
      <div className="relative" style={{ width: 180, height: 120 }}>
        {/* 父 Frame */}
        <div className="absolute rounded-md border-[1.5px] border-dashed" style={{ borderColor: c, background: card(dark), left: 4, top: 4, width: 172, height: 112 }}>
          {/* 子 Frame */}
          <motion.div
            className="absolute rounded border-[1.5px] border-dashed"
            style={{ borderColor: PINK, left: 12, top: 14, width: 88, height: 44 }}
            animate={{ opacity: escaped ? 0.35 : 1, scale: escaped ? 0.96 : 1 }}
            transition={{ duration: 0.3, ease: EASE }}
          />
          {/* 逃逸的元素 */}
          <motion.div
            className="absolute w-12 h-8 rounded"
            style={{ background: VIOLET }}
            animate={{
              x: escaped ? 90 : 14,
              y: escaped ? 70 : 22,
            }}
            transition={{ duration: 0.4, ease: EASE }}
          />
        </div>
      </div>
      <Caption dark={dark} progress={p} steps={[
        { at: 0, text: "元素嵌套在子 Frame 内" },
        { at: 0.45, text: "执行 逃逸一层" },
        { at: 0.55, text: "移入上一级容器" },
        { at: 0.92, text: "层级 -1，子集变父级同级" },
      ]} />
    </DemoBox>
  );
}

/* ==========================================================================
   8. 完全逃逸 — 元素直接逃到最外层之外，虚线框变浅
   ========================================================================== */
function UpAllDemo({ dark }: { dark?: boolean }) {
  const D = 6.0;
  const p = useLoopProgress(D);
  const c = muted(dark);
  const escaped = p > 0.5;
  return (
    <DemoBox dark={dark}>
      <Tag2 dark={dark}>Escape to Root</Tag2>
      <div className="relative" style={{ width: 200, height: 130 }}>
        {/* 最外层 Frame（灰色虚线） */}
        <motion.div
          className="absolute rounded-md border-[1.5px] border-dashed"
          style={{ borderColor: c, background: card(dark), left: 4, top: 4, width: 150, height: 110 }}
          animate={{ opacity: escaped ? 0.3 : 1 }}
          transition={{ duration: 0.3, ease: EASE }}
        />
        {/* 内层 Frame（粉色虚线） */}
        <motion.div
          className="absolute rounded border-[1.5px] border-dashed"
          style={{ borderColor: PINK, left: 16, top: 16, width: 100, height: 60 }}
          animate={{ opacity: escaped ? 0.25 : 1 }}
          transition={{ duration: 0.3, ease: EASE }}
        />
        {/* 紫色矩形：逃逸前在内层，逃逸后到最外层之外（右侧外） */}
        <motion.div
          className="absolute w-12 h-9 rounded"
          style={{ background: VIOLET }}
          animate={{
            x: escaped ? 162 : 30,
            y: escaped ? 50 : 30,
          }}
          transition={{ duration: 0.4, ease: EASE }}
        />
        {escaped && (
          <motion.span
            className="absolute text-[9px] font-bold px-1.5 py-0.5 rounded"
            style={{ ...mono, color: "#fff", background: VIOLET, left: 160, top: 30 }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, ease: EASE }}
          >Root</motion.span>
        )}
      </div>
      <Caption dark={dark} progress={p} steps={[
        { at: 0, text: "元素深层嵌套在两层 Frame 内" },
        { at: 0.45, text: "执行 完全逃逸" },
        { at: 0.55, text: "直接逃到最外层之外" },
        { at: 0.92, text: "两层 Frame 变浅 · 跳过所有中间层" },
      ]} />
    </DemoBox>
  );
}

/* ==========================================================================
   9. 解除所有 Group — Group 虚线和标签爆炸消失，元素不动
   ========================================================================== */
function UngroupAllDemo({ dark }: { dark?: boolean }) {
  const D = 6.0;
  const p = useLoopProgress(D);
  const c = muted(dark);
  const ungrouped = p > 0.5;
  return (
    <DemoBox dark={dark}>
      <Tag2 dark={dark}>Ungroup All</Tag2>
      <div className="relative" style={{ width: 160, height: 110 }}>
        {/* 外层 Group 虚线 */}
        <motion.div
          className="absolute rounded-md border-[1.5px] border-dashed"
          style={{ borderColor: c, left: 8, top: 8, width: 144, height: 94 }}
          animate={{ opacity: ungrouped ? 0 : 1, scale: ungrouped ? 1.15 : 1 }}
          transition={{ duration: 0.25, ease: EASE }}
        />
        {/* 内层 Group 虚线 */}
        <motion.div
          className="absolute rounded-md border-[1.5px] border-dashed"
          style={{ borderColor: c, left: 20, top: 22, width: 84, height: 50 }}
          animate={{ opacity: ungrouped ? 0 : 1, scale: ungrouped ? 1.15 : 1 }}
          transition={{ duration: 0.25, ease: EASE, delay: 0.06 }}
        />
        {/* Group 标签 */}
        <motion.div
          className="absolute -top-1 left-3 px-1.5 py-0.5 rounded text-[8px] font-bold"
          style={{ ...mono, color: "#fff", background: ink(dark) }}
          animate={{ opacity: ungrouped ? 0 : 1, y: ungrouped ? -8 : 0 }}
          transition={{ duration: 0.2, ease: EASE }}
        >Group</motion.div>
        {/* 元素：不动 */}
        <div className="absolute w-7 h-7 rounded" style={{ background: VIOLET, left: 28, top: 30 }} />
        <div className="absolute w-7 h-7 rounded-full" style={{ background: PINK, left: 64, top: 32 }} />
        <div className="absolute w-10 h-4 rounded" style={{ background: VIOLET, left: 26, top: 74 }} />
      </div>
      <Caption dark={dark} progress={p} steps={[
        { at: 0, text: "嵌套的 Group 容器" },
        { at: 0.45, text: "执行 解除所有 Group" },
        { at: 0.55, text: "递归解散所有 Group" },
        { at: 0.92, text: "虚线与标签消失 · 元素保持原位" },
      ]} />
    </DemoBox>
  );
}

/* ==========================================================================
   10. 解锁内部图层 — 树状父子层级，同时解锁父级和子级
   ========================================================================== */
function UnlockAllDemo({ dark }: { dark?: boolean }) {
  const D = 6.0;
  const p = useLoopProgress(D);
  const bg = card(dark);
  const c = muted(dark);
  const unlocked = p > 0.5;
  // 树状结构：父级 + 两个子级
  const tree = [
    { name: "Frame 父级", depth: 0, color: VIOLET },
    { name: "Layer 子级 A", depth: 1, color: PINK },
    { name: "Layer 子级 B", depth: 1, color: VIOLET },
  ];
  return (
    <DemoBox dark={dark}>
      <Tag2 dark={dark}>Unlock All Children</Tag2>
      <div className="flex flex-col gap-2 w-52">
        {tree.map((node, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-2 rounded-md"
            style={{ ...mono, background: bg, paddingLeft: 8 + node.depth * 20, paddingRight: 12, paddingTop: 8, paddingBottom: 8, color: c }}
          >
            {node.depth > 0 && <span className="text-[10px] opacity-40">└─</span>}
            <div className="relative w-4 h-4 flex-shrink-0">
              {/* 锁定状态 */}
              <motion.svg viewBox="0 0 24 24" className="absolute inset-0 w-full h-full" fill="none" stroke={c} strokeWidth={2}
                animate={{ opacity: unlocked ? 0 : 1, scale: unlocked ? 0.5 : 1 }}
                transition={{ duration: 0.25, ease: EASE }}>
                <rect x="5" y="11" width="14" height="9" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </motion.svg>
              {/* 解锁状态 */}
              <motion.svg viewBox="0 0 24 24" className="absolute inset-0 w-full h-full" fill="none" stroke={VIOLET} strokeWidth={2}
                animate={{ opacity: unlocked ? 1 : 0, scale: unlocked ? 1 : 0.5 }}
                transition={{ duration: 0.25, ease: EASE }}>
                <rect x="5" y="11" width="14" height="9" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 7-2" />
              </motion.svg>
            </div>
            <span className="w-1.5 h-1.5 rounded-sm flex-shrink-0" style={{ background: node.color }} />
            <span className="text-[11px]">{node.name}</span>
          </motion.div>
        ))}
      </div>
      <Caption dark={dark} progress={p} steps={[
        { at: 0, text: "父级与子级均被锁定" },
        { at: 0.45, text: "执行 解锁内部图层" },
        { at: 0.55, text: "递归解锁父子层级" },
        { at: 0.92, text: "所有图层可自由编辑" },
      ]} />
    </DemoBox>
  );
}

/* ==========================================================================
   11. 交换填充描边 — 填充色与描边色互换
   ========================================================================== */
function SwapFSDemo({ dark }: { dark?: boolean }) {
  const D = 6.0;
  const p = useLoopProgress(D);
  const swapped = p > 0.5;
  return (
    <DemoBox dark={dark}>
      <Tag2 dark={dark}>Swap Fill ↔ Stroke</Tag2>
      <div className="flex flex-col items-center gap-3">
        <motion.div
          className="w-16 h-16 rounded-md border-4"
          animate={{
            backgroundColor: swapped ? PINK : VIOLET,
            borderColor: swapped ? VIOLET : PINK,
          }}
          transition={{ duration: 0.3, ease: EASE }}
        />
        {/* 说明文字纵向排布：Fill 行在上，Stroke 行在下 */}
        <div className="flex flex-col items-center gap-1.5 text-[11px]" style={{ ...mono, color: muted(dark) }}>
          <div className="flex items-center gap-2">
            <span>Fill</span>
            <motion.span className="w-3 h-3 rounded-sm" animate={{ backgroundColor: swapped ? PINK : VIOLET }} transition={{ duration: 0.3 }} />
          </div>
          <div className="flex items-center gap-2">
            <span>Stroke</span>
            <motion.span className="w-3 h-3 rounded-sm border-2" animate={{ backgroundColor: swapped ? VIOLET : PINK, borderColor: swapped ? VIOLET : PINK }} transition={{ duration: 0.3 }} />
          </div>
        </div>
      </div>
      <Caption dark={dark} progress={p} steps={[
        { at: 0, text: "填充与描边颜色不同" },
        { at: 0.45, text: "执行 交换填充描边" },
        { at: 0.55, text: "Fill ↔ Stroke 颜色对调" },
        { at: 0.92, text: "互换完成" },
      ]} />
    </DemoBox>
  );
}

/* ==========================================================================
   12. 重置图片比例 — 拉伸变形 → 原生比例，文字居中切换
   ========================================================================== */
function ResetImageDemo({ dark }: { dark?: boolean }) {
  const D = 6.0;
  const p = useLoopProgress(D);
  const reset = p > 0.5;
  return (
    <DemoBox dark={dark}>
      <Tag2 dark={dark}>Reset Image Ratio</Tag2>
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center justify-center" style={{ width: 120, height: 90 }}>
          <motion.div
            className="rounded-md overflow-hidden flex items-center justify-center"
            style={{ background: "#1a1a1a" }}
            animate={{
              scaleX: reset ? 1 : 0.55,
              scaleY: reset ? 1 : 1.5,
            }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <div className="w-16 h-16 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-9 h-9" fill="none" stroke="#ffffff" strokeWidth={1.5}>
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <circle cx="9" cy="10" r="1.5" />
                <path d="M21 16l-5-5-9 9" />
              </svg>
            </div>
          </motion.div>
        </div>
        {/* 文字在图片正下方居中切换 */}
        <div className="relative h-4 flex items-center justify-center" style={{ width: 100 }}>
          <motion.span
            className="absolute text-[10px]"
            style={{ ...mono, color: muted(dark) }}
            animate={{ opacity: reset ? 0 : 1 }}
            transition={{ duration: 0.25, ease: EASE }}
          >拉伸变形</motion.span>
          <motion.span
            className="absolute text-[10px]"
            style={{ ...mono, color: VIOLET }}
            animate={{ opacity: reset ? 1 : 0 }}
            transition={{ duration: 0.25, ease: EASE }}
          >原生比例</motion.span>
        </div>
      </div>
      <Caption dark={dark} progress={p} steps={[
        { at: 0, text: "图片被横向拉伸变形" },
        { at: 0.45, text: "执行 重置图片比例" },
        { at: 0.55, text: "恢复原生宽高比" },
        { at: 0.92, text: "变形修复" },
      ]} />
    </DemoBox>
  );
}

/* ==========================================================================
   13. 按视觉排序图层 — X/Y 都随机散落 → 整齐一整列（按视觉顺序）
   ========================================================================== */
function SortLayersDemo({ dark }: { dark?: boolean }) {
  const D = 6.0;
  const p = useLoopProgress(D);
  const bg = card(dark);
  const c = muted(dark);
  const sorted = p > 0.5;
  // 散落位置（X 和 Y 都随机）
  const scattered = [
    { name: "C", x: 70, y: 8, color: PINK },
    { name: "A", x: 8, y: 30, color: VIOLET },
    { name: "E", x: 90, y: 70, color: VIOLET },
    { name: "B", x: 30, y: 50, color: PINK },
    { name: "D", x: 60, y: 90, color: VIOLET },
  ];
  // 排序后位置（整齐一列，按视觉顺序上→下）
  const ordered = [
    { name: "A", color: VIOLET },
    { name: "B", color: PINK },
    { name: "C", color: PINK },
    { name: "D", color: VIOLET },
    { name: "E", color: VIOLET },
  ];
  return (
    <DemoBox dark={dark}>
      <Tag2 dark={dark}>Sort by Visual Order</Tag2>
      <div className="relative" style={{ width: 130, height: 120 }}>
        {scattered.map((it, i) => {
          const target = ordered[i];
          return (
            <motion.div
              key={i}
              className="absolute flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px]"
              style={{ ...mono, background: bg, color: c, border: `1px solid ${line(dark)}` }}
              animate={{
                x: sorted ? 8 : it.x,
                y: sorted ? i * 22 : it.y,
              }}
              transition={{ duration: 0.4, ease: EASE, delay: sorted ? i * 0.04 : 0 }}
            >
              <span className="w-1.5 h-1.5 rounded-sm" style={{ background: sorted ? target.color : it.color }} />
              {sorted ? target.name : it.name}
            </motion.div>
          );
        })}
      </div>
      <Caption dark={dark} progress={p} steps={[
        { at: 0, text: "图层在画布上散落（X/Y 都乱）" },
        { at: 0.45, text: "执行 按视觉排序图层" },
        { at: 0.55, text: "按 X/Y 坐标排序" },
        { at: 0.92, text: "从上到下整齐排列" },
      ]} />
    </DemoBox>
  );
}

/* ==========================================================================
   14. 按内容重命名 — 图层名 → 读取其文本内容 → 同步重命名
   ========================================================================== */
function RenameContentDemo({ dark }: { dark?: boolean }) {
  const D = 6.0;
  const p = useLoopProgress(D);
  const bg = card(dark);
  const c = muted(dark);
  const renamed = p > 0.5;
  const items = [
    { default: "Rectangle 1", content: "确定" },
    { default: "Text 2", content: "取消" },
  ];
  return (
    <DemoBox dark={dark}>
      <Tag2 dark={dark}>Rename by Content</Tag2>
      <div className="flex flex-col items-center gap-4">
        {items.map((it, i) => (
          <div key={i} className="flex items-center justify-center gap-2">
            {/* 图层名（默认名 → 内容） */}
            <div className="relative h-5 flex items-center justify-center px-3 py-1 rounded-md" style={{ ...mono, background: bg, color: c, width: 120 }}>
              <span className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-sm" style={{ background: i === 0 ? VIOLET : PINK }} />
              <div className="relative h-4" style={{ width: 70 }}>
                <motion.span className="absolute inset-0 text-[11px] leading-4 text-center"
                  animate={{ opacity: renamed ? 0 : 1, y: renamed ? -6 : 0 }}
                  transition={{ duration: 0.25, ease: EASE }}>{it.default}</motion.span>
                <motion.span className="absolute inset-0 text-[11px] leading-4 font-bold text-center"
                  style={{ color: VIOLET }}
                  animate={{ opacity: renamed ? 1 : 0, y: renamed ? 0 : 6 }}
                  transition={{ duration: 0.25, ease: EASE }}>{it.content}</motion.span>
              </div>
            </div>
            {/* 向右箭头 */}
            <Arrow dir="right" dark={dark} color={line(dark)} size={0.8} />
            {/* 文本内容（画布上的文字） */}
            <span className="px-2.5 py-0.5 rounded text-[11px]" style={{ background: dark ? "#333" : "#fff", color: c, border: `1px solid ${line(dark)}` }}>{it.content}</span>
          </div>
        ))}
      </div>
      <Caption dark={dark} progress={p} steps={[
        { at: 0, text: "图层名是默认名（Rectangle 1…）" },
        { at: 0.45, text: "执行 按内容重命名" },
        { at: 0.55, text: "读取图层的文本内容" },
        { at: 0.92, text: "图层名同步为内容" },
      ]} />
    </DemoBox>
  );
}

/* ==========================================================================
   15. 解绑所有实例 — 多个 Instance → 全部变为普通 Frame
   ========================================================================== */
function DetachAllDemo({ dark }: { dark?: boolean }) {
  const D = 6.0;
  const p = useLoopProgress(D);
  const bg = card(dark);
  const c = muted(dark);
  const detached = p > 0.5;
  const instances = [VIOLET, PINK, VIOLET];
  const labels = ["a", "b", "c"];
  return (
    <DemoBox dark={dark}>
      <Tag2 dark={dark}>Detach All Instances</Tag2>
      <div className="flex flex-col items-center gap-3">
        {instances.map((color, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <div className="relative w-14 h-14 rounded-md border-[1.5px] flex items-center justify-center" style={{ borderColor: detached ? line(dark) : color, background: bg }}>
              {/* Instance 图标（实心菱形角标） */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ opacity: detached ? 0 : 1, scale: detached ? 0.5 : 1 }}
                transition={{ duration: 0.25, ease: EASE }}
              >
                <div className="w-7 h-7 rounded" style={{ background: color }} />
              </motion.div>
              {/* Frame 图标（虚线框 + 子块） */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ opacity: detached ? 1 : 0, scale: detached ? 1 : 0.5 }}
                transition={{ duration: 0.25, ease: EASE }}
              >
                <div className="w-7 h-7 rounded border-[1.5px] border-dashed flex items-center justify-center" style={{ borderColor: c }}>
                  <div className="w-3 h-3 rounded-sm" style={{ background: color }} />
                </div>
              </motion.div>
            </div>
            {/* 标签切换：纵向放在图标下方 */}
            <div className="relative h-3.5" style={{ width: 64 }}>
              <motion.span className="absolute inset-0 text-[10px] text-center" style={{ ...mono, color: c }}
                animate={{ opacity: detached ? 0 : 1 }} transition={{ duration: 0.25 }}>Instance {labels[i]}</motion.span>
              <motion.span className="absolute inset-0 text-[10px] font-bold text-center" style={{ ...mono, color: VIOLET }}
                animate={{ opacity: detached ? 1 : 0 }} transition={{ duration: 0.25 }}>Frame {labels[i]}</motion.span>
            </div>
          </div>
        ))}
      </div>
      <Caption dark={dark} progress={p} steps={[
        { at: 0, text: "多个 Instance 关联母版" },
        { at: 0.45, text: "执行 解绑所有实例" },
        { at: 0.55, text: "递归脱离母版" },
        { at: 0.92, text: "全部变为普通 Frame" },
      ]} />
    </DemoBox>
  );
}

/* ==========================================================================
   16. 删除隐藏图层 — 隐藏图层原地消失，可见图层不动
   ========================================================================== */
function RemoveHiddenDemo({ dark }: { dark?: boolean }) {
  const D = 6.0;
  const p = useLoopProgress(D);
  const bg = card(dark);
  const c = muted(dark);
  const removed = p > 0.5;
  const items = [
    { name: "Layer 1", visible: true },
    { name: "Layer 2", visible: false },
    { name: "Layer 3", visible: true },
    { name: "Layer 4", visible: false },
    { name: "Layer 5", visible: true },
  ];
  return (
    <DemoBox dark={dark}>
      <Tag2 dark={dark}>Remove Hidden Layers</Tag2>
      <div className="flex flex-col gap-1.5 w-40">
        {items.map((item, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px]"
            style={{ ...mono, background: bg, color: c, border: `1px solid ${line(dark)}` }}
            animate={
              item.visible
                ? { opacity: 1, scale: 1 }
                : { opacity: removed ? 0 : 1, scale: removed ? 0.7 : 1 }
            }
            transition={{ duration: 0.25, ease: EASE }}
          >
            <svg viewBox="0 0 24 24" className="w-3 h-3 flex-shrink-0" fill="none" stroke={item.visible ? VIOLET : (dark ? "#666" : "#ccc")} strokeWidth={2}>
              {item.visible ? (
                <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
              ) : (
                <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><path d="M1 1l22 22" /></>
              )}
            </svg>
            {item.name}
          </motion.div>
        ))}
      </div>
      <Caption dark={dark} progress={p} steps={[
        { at: 0, text: "图层列表含隐藏图层（闭眼）" },
        { at: 0.45, text: "执行 删除隐藏图层" },
        { at: 0.55, text: "递归删除闭眼图层" },
        { at: 0.92, text: "隐藏图层原地消失 · 文件瘦身" },
      ]} />
    </DemoBox>
  );
}

/* ==========================================================================
   17. 像素取整 — 严格对齐像素格，小数坐标 → 整数坐标
   ========================================================================== */
function PixelPerfectDemo({ dark }: { dark?: boolean }) {
  const D = 6.0;
  const p = useLoopProgress(D);
  const c = muted(dark);
  const snapped = p > 0.5;
  return (
    <DemoBox dark={dark}>
      <Tag2 dark={dark}>Pixel Perfect</Tag2>
      {/* 像素网格背景 */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage: `linear-gradient(${ink(dark)} 1px, transparent 1px), linear-gradient(90deg, ${ink(dark)} 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }} />
      <div className="relative flex flex-col items-center gap-3">
        {/* X/Y 坐标：纵向排布在矩形上方 */}
        <div className="flex flex-col items-center gap-1 text-[11px]" style={{ ...mono, color: c }}>
          <div className="flex items-center gap-1.5">
            <span>X</span>
            <div className="relative h-3.5" style={{ width: 32 }}>
              <motion.span className="absolute inset-0" animate={{ opacity: snapped ? 0 : 1 }} transition={{ duration: 0.25 }}>10.3</motion.span>
              <motion.span className="absolute inset-0 font-bold" style={{ color: VIOLET }} animate={{ opacity: snapped ? 1 : 0 }} transition={{ duration: 0.25 }}>10</motion.span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span>Y</span>
            <div className="relative h-3.5" style={{ width: 32 }}>
              <motion.span className="absolute inset-0" animate={{ opacity: snapped ? 0 : 1 }} transition={{ duration: 0.25 }}>5.7</motion.span>
              <motion.span className="absolute inset-0 font-bold" style={{ color: VIOLET }} animate={{ opacity: snapped ? 1 : 0 }} transition={{ duration: 0.25 }}>6</motion.span>
            </div>
          </div>
        </div>
        {/* 矩形：严格对齐像素格（20px 网格） */}
        <motion.div
          className="w-16 h-16 rounded"
          style={{ background: VIOLET }}
          animate={{
            x: snapped ? 0 : 3,   // 10.3 → 10 的偏移（3px）
            y: snapped ? 0 : 4,   // 5.7 → 6 的偏移（4px）
          }}
          transition={{ duration: 0.3, ease: EASE }}
        />
      </div>
      <Caption dark={dark} progress={p} steps={[
        { at: 0, text: "坐标含小数，未对齐像素格" },
        { at: 0.45, text: "执行 像素取整" },
        { at: 0.55, text: "X/Y/宽高四舍五入" },
        { at: 0.92, text: "严格对齐像素格 · 消除杂边" },
      ]} />
    </DemoBox>
  );
}

/* ==========================================================================
   18. 交换位置 — 两个图层互换 X/Y 坐标
   ========================================================================== */
function SwapPositionsDemo({ dark }: { dark?: boolean }) {
  const D = 6.0;
  const p = useLoopProgress(D);
  const swapped = p > 0.5;
  return (
    <DemoBox dark={dark}>
      <Tag2 dark={dark}>Swap Positions</Tag2>
      <div className="relative" style={{ width: 176, height: 88 }}>
        <motion.div
          className="absolute w-16 h-16 rounded-md flex items-center justify-center text-white text-lg font-bold"
          style={{ background: VIOLET }}
          animate={{ x: swapped ? 80 : 0, y: swapped ? 8 : 0 }}
          transition={{ duration: 0.4, ease: EASE }}
        >A</motion.div>
        <motion.div
          className="absolute w-16 h-16 rounded-md flex items-center justify-center text-white text-lg font-bold"
          style={{ background: PINK, left: 80, top: 16 }}
          animate={{ x: swapped ? -80 : 0, y: swapped ? -8 : 0 }}
          transition={{ duration: 0.4, ease: EASE }}
        >B</motion.div>
      </div>
      <Caption dark={dark} progress={p} steps={[
        { at: 0, text: "选中两个图层 A 与 B" },
        { at: 0.45, text: "执行 交换位置" },
        { at: 0.55, text: "X/Y 坐标互换" },
        { at: 0.92, text: "位置对调 · 层级不变" },
      ]} />
    </DemoBox>
  );
}

/* ==========================================================================
   19. 生成本地样式 — 提取填充颜色样式 + 阴影样式
   ========================================================================== */
function CreateStylesDemo({ dark }: { dark?: boolean }) {
  const D = 6.0;
  const p = useLoopProgress(D);
  const bg = card(dark);
  const c = muted(dark);
  const created = p > 0.5;
  return (
    <DemoBox dark={dark}>
      <Tag2 dark={dark}>Create Local Style</Tag2>
      <div className="flex items-center justify-center gap-4">
        {/* 左：源图层（带填充 + 阴影） */}
        <div className="flex flex-col items-center gap-1.5">
          <div
            className="w-16 h-16 rounded-md flex items-center justify-center"
            style={{ background: VIOLET, boxShadow: "0 6px 14px rgba(124,58,237,0.4)" }}
          >
            <span className="text-[10px] text-white/70" style={mono}>Layer</span>
          </div>
          <span className="text-[10px]" style={{ ...mono, color: c }}>源图层</span>
        </div>
        {/* 中：向右箭头 */}
        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, ease: EASE }}>
          <Arrow dir="right" dark={dark} />
        </motion.div>
        {/* 右：生成的样式库 */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[10px]" style={{ ...mono, color: c }}>Styles</span>
          <motion.div
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-md"
            style={{ background: bg, border: `1px solid ${created ? VIOLET : line(dark)}` }}
            animate={{ opacity: created ? 1 : 0.3, x: created ? 0 : -8 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <div className="w-3.5 h-3.5 rounded-sm" style={{ background: VIOLET }} />
            <span className="text-[10px]" style={{ ...mono, color: c }}>Primary/Fill</span>
          </motion.div>
          <motion.div
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-md"
            style={{ background: bg, border: `1px solid ${created ? PINK : line(dark)}` }}
            animate={{ opacity: created ? 1 : 0.3, x: created ? 0 : -8 }}
            transition={{ duration: 0.3, ease: EASE, delay: 0.1 }}
          >
            <div className="w-3.5 h-3.5 rounded-sm" style={{ background: PINK, boxShadow: "0 2px 4px rgba(0,0,0,0.3)" }} />
            <span className="text-[10px]" style={{ ...mono, color: c }}>Shadow/Soft</span>
          </motion.div>
        </div>
      </div>
      <Caption dark={dark} progress={p} steps={[
        { at: 0, text: "选中带填充和阴影的图层" },
        { at: 0.45, text: "执行 生成本地样式" },
        { at: 0.55, text: "提取颜色样式 + 阴影样式" },
        { at: 0.92, text: "沉淀为可复用样式" },
      ]} />
    </DemoBox>
  );
}

/* ==========================================================================
   20. 匹配本地样式 — 裸奔属性 → 绑定样式（绑定图标 + 指向箭头）
   ========================================================================== */
function MatchStylesDemo({ dark }: { dark?: boolean }) {
  const D = 6.0;
  const p = useLoopProgress(D);
  const bg = card(dark);
  const c = muted(dark);
  const matched = p > 0.5;
  return (
    <DemoBox dark={dark}>
      <Tag2 dark={dark}>Match Local Style</Tag2>
      <div className="flex items-center justify-center gap-4">
        {/* 左：源图层（裸奔 → 已绑定） */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="relative">
            <div className="w-16 h-16 rounded-md" style={{ background: VIOLET }} />
            {/* 绑定角标 */}
            <motion.div
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: matched ? VIOLET : "transparent" }}
              animate={{ opacity: matched ? 1 : 0, scale: matched ? 1 : 0.4 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="#fff" strokeWidth={3}>
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </motion.div>
          </div>
          <div className="relative h-3.5" style={{ width: 48 }}>
            <motion.span className="absolute inset-0 text-[10px] text-center" style={{ ...mono, color: c }}
              animate={{ opacity: matched ? 0 : 1 }} transition={{ duration: 0.25 }}>裸奔</motion.span>
            <motion.span className="absolute inset-0 text-[10px] text-center font-bold" style={{ ...mono, color: VIOLET }}
              animate={{ opacity: matched ? 1 : 0 }} transition={{ duration: 0.25 }}>已绑定</motion.span>
          </div>
        </div>
        {/* 中：向右箭头 */}
        <motion.div animate={{ opacity: matched ? 1 : 0.3 }} transition={{ duration: 0.3 }}>
          <Arrow dir="right" dark={dark} color={matched ? VIOLET : line(dark)} />
        </motion.div>
        {/* 右：样式库 */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[10px]" style={{ ...mono, color: c }}>Styles</span>
          <motion.div
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-md"
            style={{ background: bg, border: `1px solid ${matched ? VIOLET : line(dark)}` }}
            animate={{ borderColor: matched ? VIOLET : line(dark) }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-3.5 h-3.5 rounded-sm" style={{ background: VIOLET }} />
            <span className="text-[10px]" style={{ ...mono, color: c }}>Primary/Fill</span>
          </motion.div>
        </div>
      </div>
      <Caption dark={dark} progress={p} steps={[
        { at: 0, text: "图层属性裸奔，未绑定样式" },
        { at: 0.45, text: "执行 匹配本地样式" },
        { at: 0.55, text: "扫描属性并匹配样式库" },
        { at: 0.92, text: "绑定本地样式 · 便于统一管理" },
      ]} />
    </DemoBox>
  );
}

/* ==========================================================================
   21. PPT 一键导出 — 多个 Figma Frame → 可编辑 PowerPoint
   说明：图片无法导出，需手动导入替换
   ========================================================================== */
function PPTExportDemo({ dark }: { dark?: boolean }) {
  const D = 6.0;
  const p = useLoopProgress(D);
  const bg = card(dark);
  const c = muted(dark);
  const exported = p > 0.5;
  // 三个 Figma Frame
  const frames = [
    { color: VIOLET, label: "Slide 1" },
    { color: PINK, label: "Slide 2" },
    { color: VIOLET, label: "Slide 3" },
  ];
  return (
    <DemoBox dark={dark}>
      <Tag2 dark={dark}>Export to PPT</Tag2>
      <div className="flex items-center justify-center gap-4">
        {/* 左：Figma Frames 横排（堆叠三张） */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-1.5">
            {frames.map((f, i) => (
              <motion.div
                key={i}
                className="flex flex-col items-center gap-1 px-2 py-1.5 rounded-md"
                style={{ ...mono, background: bg, color: c, border: `1px solid ${line(dark)}` }}
                animate={{ opacity: exported ? 0.4 : 1, y: exported ? -2 : 0 }}
                transition={{ duration: 0.25, ease: EASE, delay: i * 0.04 }}
              >
                <span className="w-5 h-5 rounded-sm" style={{ background: f.color }} />
                <span className="text-[10px]">{f.label}</span>
              </motion.div>
            ))}
          </div>
          <span className="text-[10px]" style={{ ...mono, color: c }}>Figma Frames</span>
        </div>
        {/* 中：向右箭头 */}
        <motion.div className="self-start mt-10" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, ease: EASE }}>
          <Arrow dir="right" dark={dark} />
        </motion.div>
        {/* 右：PPT 窗口 */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="relative">
            <motion.div
              className="rounded-md overflow-hidden"
              style={{ background: bg, border: `1.5px solid ${exported ? ink(dark) : line(dark)}`, width: 130, height: 92 }}
              animate={{ scale: exported ? 1 : 0.92, opacity: exported ? 1 : 0.6 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              {/* PPT 顶栏 */}
              <div className="flex items-center gap-1 px-2 py-1 border-b" style={{ borderColor: line(dark) }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: PINK }} />
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: VIOLET }} />
                <span className="text-[8px] ml-1" style={{ ...mono, color: c }}>PPT</span>
              </div>
              {/* 当前页内容 */}
              <div className="px-2.5 py-1.5">
                <motion.div
                  className="h-1.5 rounded-sm mb-1"
                  style={{ background: VIOLET }}
                  animate={{ width: [50, 70, 50] }}
                  transition={{ duration: 2, repeat: Infinity, ease: EASE }}
                />
                <div className="h-1 rounded-sm mb-1" style={{ background: line(dark), width: 76 }} />
                <div className="h-1 rounded-sm" style={{ background: line(dark), width: 56 }} />
              </div>
              {/* 缩略图条 */}
              <div className="flex gap-1 px-2 pt-1">
                {frames.map((f, i) => (
                  <motion.div
                    key={i}
                    className="h-3 flex-1 rounded-sm"
                    style={{ background: f.color, opacity: 0.4 }}
                    animate={{ opacity: i === 0 ? [0.4, 1, 0.4] : 0.4 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: EASE, delay: i * 0.5 }}
                  />
                ))}
              </div>
            </motion.div>
            {/* 图片替换提示 */}
            <motion.div
              className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] whitespace-nowrap px-2 py-0.5 rounded"
              style={{ ...mono, color: PINK, background: bg, border: `1px solid ${PINK}` }}
              animate={{ opacity: exported ? 1 : 0, y: exported ? 0 : -4 }}
              transition={{ duration: 0.3, ease: EASE, delay: 0.2 }}
            >⚠ 图片需手动替换</motion.div>
          </div>
          <span className="text-[10px]" style={{ ...mono, color: c }}>PowerPoint</span>
        </div>
      </div>
      <Caption dark={dark} progress={p} steps={[
        { at: 0, text: "选中多个 Figma Frame" },
        { at: 0.45, text: "执行 PPT 一键导出" },
        { at: 0.55, text: "转换为可编辑 PowerPoint" },
        { at: 0.92, text: "图层可编辑 · 图片需手动导入替换" },
      ]} />
    </DemoBox>
  );
}

/* ==========================================================================
   22. 组件清洗器 — 组件名格式统一（camelCase / PascalCase / snake_case）
   ========================================================================== */
function ComponentCleanDemo({ dark }: { dark?: boolean }) {
  const D = 6.0;
  const p = useLoopProgress(D);
  const bg = card(dark);
  const c = muted(dark);
  // 每行分阶段转换：阈值递增，右侧标签跟随对应行的转换而选中
  const thresholds = [0.45, 0.55, 0.65];
  // 每行：前→后，对应的目标命名类型
  const rows = [
    { before: "Button primary",  after: "buttonPrimary", format: "camelCase" },
    { before: "card_list_item",  after: "CardListItem",  format: "PascalCase" },
    { before: "Hero-Section",    after: "hero_section",   format: "snake_case" },
  ];
  return (
    <DemoBox dark={dark}>
      <Tag2 dark={dark}>Component Cleaner</Tag2>
      <div className="flex flex-col gap-2">
        {rows.map((n, i) => {
          const cleaned = p > thresholds[i];
          return (
            <div key={i} className="flex items-center gap-2">
              {/* 左：命名卡片（默认名 → 规范名） */}
              <div className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-md" style={{ ...mono, background: bg, color: c, border: `1px solid ${cleaned ? VIOLET : line(dark)}`, width: 150 }}>
                <span className="w-3 h-3 rounded-sm" style={{ background: i % 2 ? PINK : VIOLET }} />
                {/* 命名切换：固定宽高，绝对定位 before/after */}
                <div className="relative h-4 overflow-hidden" style={{ width: 112 }}>
                  <motion.span className="absolute inset-0 text-[12px] leading-4 text-center truncate"
                    animate={{ opacity: cleaned ? 0 : 1, y: cleaned ? -10 : 0 }}
                    transition={{ duration: 0.25, ease: EASE }}>{n.before}</motion.span>
                  <motion.span className="absolute inset-0 text-[12px] leading-4 font-bold text-center truncate"
                    style={{ color: VIOLET }}
                    animate={{ opacity: cleaned ? 1 : 0, y: cleaned ? 0 : 10 }}
                    transition={{ duration: 0.25, ease: EASE }}>{n.after}</motion.span>
                </div>
                {/* 格式化标记 */}
                <motion.span className="text-[11px]"
                  style={{ color: cleaned ? VIOLET : line(dark) }}
                  animate={{ rotate: cleaned ? [0, -90, 0] : 0 }}
                  transition={{ duration: 0.4, ease: EASE }}>↻</motion.span>
              </div>
              {/* 右：对应的命名类型标签（纵向排列在右侧，跟随该行转换而选中） */}
              <motion.span className="text-[10px] px-2 py-0.5 rounded text-center"
                style={{ ...mono, minWidth: 76, color: cleaned ? VIOLET : c, background: bg, border: `1px solid ${cleaned ? VIOLET : line(dark)}` }}
                animate={{ scale: cleaned ? [1, 1.12, 1] : 1 }}
                transition={{ duration: 0.4, ease: EASE }}>{n.format}</motion.span>
            </div>
          );
        })}
      </div>
      <Caption dark={dark} progress={p} steps={[
        { at: 0, text: "组件命名混乱不一" },
        { at: 0.45, text: "执行 组件清洗器" },
        { at: 0.55, text: "统一格式化命名 · 支持查找替换" },
        { at: 0.92, text: "命名规范化 · 可读性提升" },
      ]} />
    </DemoBox>
  );
}

/* ==========================================================================
   23. 等轴形变工具 — 2D 矩形 → 等轴测倾斜视图（2.5D）
   ========================================================================== */
function IsometricTransformDemo({ dark }: { dark?: boolean }) {
  const D = 6.0;
  const p = useLoopProgress(D);
  const c = muted(dark);
  const iso = p > 0.5;
  return (
    <DemoBox dark={dark}>
      <Tag2 dark={dark}>Isometric Transform</Tag2>
      <div className="relative flex items-center justify-center" style={{ width: 200, height: 120 }}>
        {/* 原始平面（前） */}
        <motion.div
          className="absolute"
          style={{ transformStyle: "preserve-3d", transformOrigin: "center" }}
          animate={{
            rotateX: iso ? 60 : 0,
            rotateZ: iso ? -45 : 0,
            scale: iso ? 0.85 : 1,
          }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <div className="w-20 h-20 rounded-md flex items-center justify-center" style={{ background: VIOLET }}>
            <div className="w-10 h-10 rounded-sm" style={{ background: PINK }} />
          </div>
        </motion.div>
        {/* 坐标轴指示 */}
        <motion.svg className="absolute bottom-0 left-2 w-12 h-12" viewBox="0 0 48 48"
          animate={{ opacity: iso ? 1 : 0 }} transition={{ duration: 0.3 }}>
          <line x1="6" y1="42" x2="42" y2="42" stroke={c} strokeWidth="1" />
          <line x1="6" y1="42" x2="6" y2="6" stroke={c} strokeWidth="1" />
          <line x1="6" y1="42" x2="32" y2="16" stroke={PINK} strokeWidth="1.5" strokeDasharray="2 2" />
        </motion.svg>
        {/* 预设标签 */}
        <motion.div className="absolute top-0 right-0 text-[8px] px-1.5 py-0.5 rounded"
          style={{ ...mono, color: c, background: card(dark), border: `1px solid ${line(dark)}` }}
          animate={{ opacity: iso ? 1 : 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
          Preset · 30°
        </motion.div>
      </div>
      <Caption dark={dark} progress={p} steps={[
        { at: 0, text: "选中 2D 图形" },
        { at: 0.45, text: "执行 等轴形变" },
        { at: 0.55, text: "倾斜为等轴测视图（2.5D）" },
        { at: 0.92, text: "支持保存自定义预设" },
      ]} />
    </DemoBox>
  );
}

/* ==========================================================================
   24. 时空信标 — 记录编辑位置，切走后一键跳回
   ========================================================================== */
function SpaceBeaconDemo({ dark }: { dark?: boolean }) {
  const D = 7.0;
  const p = useLoopProgress(D);
  const c = muted(dark);
  const bg = card(dark);
  // 阶段：
  // 0-0.30  在 Page A 标记位置（信标锚定）
  // 0.30-0.45 切换到 Page B 操作（高亮 B）
  // 0.45-0.55 点击信标准备跳回
  // 0.55-1.0  跳回 Page A 的记录位置（A 高亮 + 信标闪烁）
  const phase: "mark" | "onB" | "jumpBack" = p < 0.3 ? "mark" : p < 0.55 ? "onB" : "jumpBack";
  const onA = phase === "mark" || phase === "jumpBack";
  // 顶部 page 标签高亮
  const PageTab = ({ label, active }: { label: string; active: boolean }) => (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md"
      style={{ ...mono, background: bg, border: `1px solid ${active ? VIOLET : line(dark)}`, color: active ? VIOLET : c }}>
      <span className="w-1.5 h-1.5 rounded-sm" style={{ background: active ? VIOLET : line(dark) }} />
      <span className="text-[10px] font-bold">{label}</span>
    </div>
  );
  return (
    <DemoBox dark={dark}>
      <Tag2 dark={dark}>Space Beacon</Tag2>
      <div className="flex flex-col items-center gap-3 w-72">
        {/* 顶部：两个 Page 标签 */}
        <div className="flex items-center gap-2">
          <PageTab label="Page A" active={onA} />
          <PageTab label="Page B" active={!onA} />
        </div>

        {/* 两个画板并排 */}
        <div className="flex items-center gap-3">
          {/* Page A：标记位置 / 跳回后高亮 */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="relative overflow-hidden rounded-md" style={{ width: 110, height: 80, background: bg, border: `1px solid ${onA ? VIOLET : line(dark)}` }}>
              {/* 网格 */}
              <div className="absolute inset-0 opacity-[0.12]"
                style={{ backgroundImage: `linear-gradient(${c} 1px, transparent 1px), linear-gradient(90deg, ${c} 1px, transparent 1px)`, backgroundSize: "14px 14px" }} />
              {/* 散落小图形 */}
              <div className="absolute w-3 h-3 rounded" style={{ background: VIOLET, opacity: 0.35, top: 10, left: 14 }} />
              <div className="absolute w-4 h-2 rounded-full" style={{ background: PINK, opacity: 0.35, top: 50, left: 70 }} />
              <div className="absolute w-2 h-4 rounded" style={{ background: VIOLET, opacity: 0.35, top: 56, left: 30 }} />
              {/* 信标点：A 始终在记录位置；跳回阶段闪烁放大 */}
              <motion.div
                className="absolute w-2.5 h-2.5 rounded-full"
                style={{ background: PINK, top: 32, left: 50 }}
                animate={{
                  scale: phase === "jumpBack" ? [1, 2, 1] : 1,
                  opacity: phase === "jumpBack" ? [1, 0.4, 1] : (phase === "mark" ? 1 : 0.5),
                }}
                transition={{ duration: 0.9, repeat: phase === "jumpBack" ? Infinity : 0, ease: EASE }}
              />
              {/* 跳回阶段：视口框圈中信标 */}
              <motion.div
                className="absolute rounded border-[1.5px] border-dashed"
                style={{ borderColor: VIOLET, top: 26, left: 44, width: 22, height: 22 }}
                animate={{ opacity: phase === "jumpBack" ? 1 : 0, scale: phase === "jumpBack" ? 1 : 1.4 }}
                transition={{ duration: 0.3, ease: EASE }}
              />
            </div>
            <span className="text-[9px]" style={{ ...mono, color: onA ? VIOLET : c }}>A · 记录点</span>
          </div>

          {/* 中间跳回箭头（jumpBack 阶段显示） */}
          <motion.div
            animate={{ opacity: phase === "jumpBack" ? 1 : 0.2 }}
            transition={{ duration: 0.25 }}
          >
            <Arrow dir="left" dark={dark} color={VIOLET} />
          </motion.div>

          {/* Page B：在 B 页面操作 */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="relative overflow-hidden rounded-md" style={{ width: 110, height: 80, background: bg, border: `1px solid ${!onA ? PINK : line(dark)}` }}>
              {/* 网格 */}
              <div className="absolute inset-0 opacity-[0.12]"
                style={{ backgroundImage: `linear-gradient(${c} 1px, transparent 1px), linear-gradient(90deg, ${c} 1px, transparent 1px)`, backgroundSize: "14px 14px" }} />
              {/* B 页面的内容：一个正在编辑的卡片 */}
              <div className="absolute rounded" style={{ background: VIOLET, opacity: 0.4, top: 16, left: 20, width: 44, height: 26 }} />
              <div className="absolute rounded-sm" style={{ background: PINK, opacity: 0.5, top: 50, left: 30, width: 30, height: 8 }} />
              {/* 操作光标：B 阶段显示 */}
              <motion.div
                className="absolute"
                style={{ top: 30, left: 60 }}
                animate={{ opacity: phase === "onB" ? 1 : 0.3, x: phase === "onB" ? [0, 8, 0] : 0 }}
                transition={{ duration: 1.2, repeat: phase === "onB" ? Infinity : 0, ease: EASE }}
              >
                <svg width="10" height="12" viewBox="0 0 10 12" fill={PINK}><path d="M0 0 L0 9 L3 6 L5 11 L7 10 L4 5 L9 5 Z" /></svg>
              </motion.div>
            </div>
            <span className="text-[9px]" style={{ ...mono, color: !onA ? PINK : c }}>B · 操作中</span>
          </div>
        </div>

        {/* 底部状态条 */}
        <motion.div className="text-[10px] px-2.5 py-1 rounded-md"
          style={{ ...mono, color: "#fff", background: phase === "jumpBack" ? VIOLET : (phase === "onB" ? PINK : "#3b3b3b") }}
          key={phase}
          initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
        >
          {phase === "mark" && "① 在 A 页标记信标"}
          {phase === "onB" && "② 切到 B 页继续操作"}
          {phase === "jumpBack" && "③ 一键跳回 A 页记录点"}
        </motion.div>
      </div>
      <Caption dark={dark} progress={p} steps={[
        { at: 0, text: "在 Page A 标记编辑位置" },
        { at: 0.3, text: "切到 Page B 继续操作" },
        { at: 0.45, text: "点击 时空信标" },
        { at: 0.55, text: "跨页面跳回 A 的记录点" },
        { at: 0.92, text: "跨页面记忆 · 一键回归" },
      ]} />
    </DemoBox>
  );
}

/* ==========================================================================
   25. 语言切换 — 界面文本直接替换 / 生成新语言为本地 Variables 模式
   ========================================================================== */
function LanguageSwitchDemo({ dark }: { dark?: boolean }) {
  const D = 6.0;
  const p = useLoopProgress(D);
  const bg = card(dark);
  const c = muted(dark);
  const isEN = p > 0.5;
  return (
    <DemoBox dark={dark}>
      <Tag2 dark={dark}>Language Switch</Tag2>
      <div className="flex items-center justify-center gap-4">
        {/* 左：界面文本直接切换 */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[10px]" style={{ ...mono, color: c }}>界面文本</span>
          <div className="rounded-md px-3 py-2" style={{ background: bg, border: `1px solid ${line(dark)}` }}>
            <div className="relative h-4 mb-1.5" style={{ width: 64 }}>
              <motion.span className="absolute inset-0 text-[12px] leading-4" style={{ color: ink(dark) }}
                animate={{ opacity: isEN ? 0 : 1, y: isEN ? -8 : 0 }} transition={{ duration: 0.25 }}>确定</motion.span>
              <motion.span className="absolute inset-0 text-[12px] leading-4" style={{ color: VIOLET }}
                animate={{ opacity: isEN ? 1 : 0, y: isEN ? 0 : 8 }} transition={{ duration: 0.25 }}>Confirm</motion.span>
            </div>
            <div className="relative h-4" style={{ width: 64 }}>
              <motion.span className="absolute inset-0 text-[12px] leading-4" style={{ color: ink(dark) }}
                animate={{ opacity: isEN ? 0 : 1, y: isEN ? -8 : 0 }} transition={{ duration: 0.25 }}>取消</motion.span>
              <motion.span className="absolute inset-0 text-[12px] leading-4" style={{ color: PINK }}
                animate={{ opacity: isEN ? 1 : 0, y: isEN ? 0 : 8 }} transition={{ duration: 0.25 }}>Cancel</motion.span>
            </div>
          </div>
        </div>
        {/* 中：向右箭头 */}
        <motion.div className="self-start mt-5" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, ease: EASE }}>
          <Arrow dir="right" dark={dark} />
        </motion.div>
        {/* 右：本地 Variables 模式 */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[10px]" style={{ ...mono, color: c }}>Variables 模式</span>
          <motion.div className="rounded-md px-2.5 py-2"
            style={{ background: bg, border: `1px solid ${isEN ? VIOLET : line(dark)}` }}
            animate={{ opacity: isEN ? 1 : 0.5 }} transition={{ duration: 0.25 }}>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: VIOLET }} />
              <span className="text-[10px]" style={{ ...mono, color: c }}>lang/EN</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: PINK }} />
              <span className="text-[10px]" style={{ ...mono, color: c }}>lang/ZH</span>
            </div>
          </motion.div>
        </div>
      </div>
      <Caption dark={dark} progress={p} steps={[
        { at: 0, text: "界面文本为中文" },
        { at: 0.45, text: "执行 语言切换" },
        { at: 0.55, text: "直接替换为英文 / 或生成为 Variables 模式" },
        { at: 0.92, text: "一键多语言 · 可绑定 Text Variables" },
      ]} />
    </DemoBox>
  );
}

/* ==========================================================================
   主组件 — 根据 type 渲染对应演示
   ========================================================================== */
export function ToolDemo({ type, dark }: { type: DemoType; dark?: boolean }) {
  switch (type) {
    case "to-frame":          return <ToFrameDemo dark={dark} />;
    case "to-rect":           return <ToRectDemo dark={dark} />;
    case "split-text":        return <SplitTextDemo dark={dark} />;
    case "join-text":         return <JoinTextDemo dark={dark} />;
    case "remove-al":         return <RemoveALDemo dark={dark} />;
    case "add-al-wrapper":    return <AddALWrapperDemo dark={dark} />;
    case "up-one":            return <UpOneDemo dark={dark} />;
    case "up-all":            return <UpAllDemo dark={dark} />;
    case "ungroup-all":       return <UngroupAllDemo dark={dark} />;
    case "unlock-all":        return <UnlockAllDemo dark={dark} />;
    case "swap-fs":           return <SwapFSDemo dark={dark} />;
    case "reset-image":       return <ResetImageDemo dark={dark} />;
    case "sort-layers":       return <SortLayersDemo dark={dark} />;
    case "rename-content":    return <RenameContentDemo dark={dark} />;
    case "detach-all":        return <DetachAllDemo dark={dark} />;
    case "remove-hidden":     return <RemoveHiddenDemo dark={dark} />;
    case "pixel-perfect":     return <PixelPerfectDemo dark={dark} />;
    case "swap-positions":    return <SwapPositionsDemo dark={dark} />;
    case "create-styles":     return <CreateStylesDemo dark={dark} />;
    case "match-styles":      return <MatchStylesDemo dark={dark} />;
    case "ppt-export":            return <PPTExportDemo dark={dark} />;
    case "component-clean":       return <ComponentCleanDemo dark={dark} />;
    case "isometric-transform":   return <IsometricTransformDemo dark={dark} />;
    case "space-beacon":          return <SpaceBeaconDemo dark={dark} />;
    case "language-switch":       return <LanguageSwitchDemo dark={dark} />;
    default:                  return <DemoBox dark={dark}>{null}</DemoBox>;
  }
}
