// src/components/sections/hero.tsx
"use client";
import { Spotlight } from "@/components/ui/spotlight";
import { ArrowDown } from "lucide-react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

export default function Hero() {
  const { t } = useI18n();

  return (
    <section
      id="hero"
      className="min-h-screen w-full flex flex-col antialiased relative z-10 overflow-hidden bg-transparent"
    >
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

      {/* 背景网格 - 与 Act 3 匹配（方块墙为底，这里仅保留极淡装饰网格） */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>

      {/* 顶部刊头栏 */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex justify-between items-center px-6 md:px-12 pt-24 md:pt-28 relative z-10 max-w-[1400px] mx-auto w-full"
      >
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-white tracking-widest">01</span>
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
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center relative z-10 max-w-[1400px] mx-auto w-full px-6 md:px-12 py-12">
        {/* 左侧 — 文字内容 */}
        <div className="md:col-span-7 order-1 md:order-1 overflow-visible relative z-20">
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
            className="text-[26vw] md:text-[12vw] lg:text-[10rem] font-black leading-[0.82] tracking-[-0.05em] text-zinc-100 select-none"
          >
            {/* 移动端：PORT \n FOLIO.  桌面端：PORTFOLIO. */}
            <span className="md:hidden">PORT<br/>FOLIO</span>
            <span className="hidden md:inline">PORTFOLIO</span>
            <span className="text-blue-500">.</span>
          </motion.h1>

          {/* 主题词 */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex items-center gap-3 md:gap-4 mt-16 md:mt-24 flex-wrap"
          >
            <span className="text-sm md:text-base font-mono text-zinc-200 tracking-[0.1em] uppercase">
              {t.hero.themeWords1}
            </span>
            <span className="text-blue-500 text-sm md:text-base font-mono">×</span>
            <span className="text-sm md:text-base font-mono text-zinc-200 tracking-[0.1em] uppercase">
              VibeCoding
            </span>
          </motion.div>

        </div>


      </div>

      {/* 底部栏 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.3 }}
        className="flex justify-between items-end px-6 md:px-12 pb-8 md:pb-10 relative z-10 max-w-[1400px] mx-auto w-full"
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
