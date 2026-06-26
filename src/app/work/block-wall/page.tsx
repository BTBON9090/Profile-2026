// src/app/work/block-wall/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { X, ArrowDown, ArrowUpRight, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type { BlockWallConfig } from "@/components/ui/block-wall-types";
import { DEFAULT_CONFIG } from "@/components/ui/block-wall-types";

// three.js 必须 client-only，禁用 SSR
const BlockWall = dynamic(() => import("@/components/ui/block-wall"), {
  ssr: false,
});
const BlockWallPanel = dynamic(
  () => import("@/components/ui/block-wall-panel"),
  { ssr: false }
);

export default function BlockWallPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [config, setConfig] = useState<BlockWallConfig>(
    () => JSON.parse(JSON.stringify(DEFAULT_CONFIG)) as BlockWallConfig
  );

  // 关闭 —— 优先回退到上一页，否则回作品集
  const handleClose = useCallback(() => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/work");
    }
  }, [router]);

  // 进入页面锁滚动（沉浸式全屏 3D 体验）
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <section
      id="hero"
      // z-[200] 盖住 layout 中全局点阵背景（DotMatrixBackground 为 fixed z-0）
      // 整页不再需要点阵背景，方块墙本身就是视觉主体
      className="fixed inset-0 z-[200] flex flex-col antialiased relative overflow-hidden bg-black"
    >
      {/* 三维方块墙背景 —— 绝对定位铺满整个视口，z-0 */}
      <BlockWall config={config} className="absolute inset-0 z-0" />

      {/* 调参面板（与 home2 一致，常驻浮动） */}
      <BlockWallPanel
        config={config}
        onChange={setConfig}
        onReset={() =>
          setConfig(
            JSON.parse(JSON.stringify(DEFAULT_CONFIG)) as BlockWallConfig
          )
        }
      />

      {/* 关闭按钮 —— 右上角，与 ai-translate / all-in-one 等作品详情一致 */}
      <button
        onClick={handleClose}
        className="fixed top-20 right-4 md:top-24 md:right-8 z-[100000] w-10 h-10 md:w-14 md:h-14 bg-black/50 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all shadow-[0_0_30px_rgba(0,0,0,0.3)] group"
        aria-label="关闭"
      >
        <X className="w-4 h-4 md:w-6 md:h-6 text-white group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {/* 顶部刊头栏 */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex justify-between items-center px-6 md:px-12 pt-24 md:pt-28 relative z-10 max-w-[1400px] mx-auto w-full pointer-events-none"
      >
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-blue-500 tracking-widest">
            01
          </span>
          <span className="h-px w-12 bg-zinc-800"></span>
          <span className="font-mono text-xs md:text-sm text-zinc-400 tracking-[0.2em] uppercase font-bold">
            {t.hero.name}
          </span>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
          <span className="text-[10px] md:text-xs font-mono text-zinc-400 tracking-wider">
            {t.hero.badge}
          </span>
        </div>
      </motion.div>

      {/* 主体 — 左右分栏 */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center relative z-10 max-w-[1400px] mx-auto w-full px-6 md:px-12 py-12 pointer-events-none">
        {/* 左侧 — 文字内容 */}
        <div className="md:col-span-7 order-1 md:order-1 overflow-visible relative z-20 pointer-events-auto">
          {/* 元数据 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center gap-3 mb-6 md:mb-8"
          >
            <span className="font-mono text-[10px] md:text-xs text-zinc-600 tracking-[0.2em] uppercase">
              {t.hero.location} — {t.hero.year}
            </span>
            <span className="h-px w-8 bg-zinc-800"></span>
            <span className="font-mono text-[10px] md:text-xs text-zinc-600 tracking-[0.2em] uppercase">
              {t.hero.endType}
            </span>
          </motion.div>

          {/* 主标题 PORTFOLIO */}
          <motion.h1
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.175, 0.885, 0.32, 1.1] }}
            className="text-[15vw] md:text-[12vw] lg:text-[10rem] font-black leading-[0.82] tracking-[-0.05em] text-zinc-100 select-none"
            style={{ textShadow: "0 2px 30px rgba(0,0,0,0.6)" }}
          >
            {t.hero.mainTitle}
            <span className="text-blue-500">.</span>
          </motion.h1>

          {/* 主题词 */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex items-center gap-3 md:gap-4 mt-6 md:mt-8 flex-wrap"
          >
            <span className="text-sm md:text-base font-mono text-zinc-200 tracking-[0.1em] uppercase">
              {t.hero.themeWords1}
            </span>
            <span className="text-blue-500 text-sm md:text-base font-mono">×</span>
            <span className="text-sm md:text-base font-mono text-zinc-200 tracking-[0.1em] uppercase">
              {t.hero.themeWords2}
            </span>
          </motion.div>

          {/* 描述 */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-4 md:mt-5 text-sm md:text-base text-zinc-500 max-w-lg font-mono leading-relaxed"
            style={{ textShadow: "0 1px 12px rgba(0,0,0,0.7)" }}
          >
            {t.hero.description}
          </motion.p>

          {/* CTA */}
          <motion.a
            href="#profile"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
            className="group inline-flex items-center gap-2 mt-8 md:mt-10 px-5 py-3 rounded-full bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 hover:border-blue-500/50 transition-all duration-300"
          >
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-mono font-bold text-blue-300 group-hover:text-white uppercase tracking-wider">
              {t.hero.tagline}
            </span>
            <ArrowUpRight className="w-4 h-4 text-blue-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </motion.a>
        </div>
      </div>

      {/* 底部栏 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.3 }}
        className="flex justify-between items-end px-6 md:px-12 pb-8 md:pb-10 relative z-10 max-w-[1400px] mx-auto w-full pointer-events-none"
      >
        <div className="flex flex-col items-start gap-2">
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-zinc-600">
            {t.hero.scrollHint}
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="w-4 h-4 text-zinc-600" />
          </motion.div>
        </div>
        <div className="font-mono text-[10px] md:text-xs text-zinc-700 tracking-wider">
          © {t.hero.year} {t.hero.name}
        </div>
      </motion.div>
    </section>
  );
}
