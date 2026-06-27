// src/components/sections/hero.tsx
"use client";
import { Spotlight } from "@/components/ui/spotlight";
import { ArrowDown, ArrowUpRight, Sparkles } from "lucide-react";
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
              {t.hero.themeWords2}
            </span>
          </motion.div>

          {/* 描述 */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-4 md:mt-5 text-sm md:text-base text-zinc-500 max-w-lg font-mono leading-relaxed"
          >
            {t.hero.description}
          </motion.p>

          {/* CTA */}
          <motion.a
            href="#profile"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
            className="group inline-flex items-center gap-2 mt-8 md:mt-10 px-4 py-3 rounded-xl bg-white/3 backdrop-blur-md border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all duration-300"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-sm font-mono font-bold text-white group-hover:text-white uppercase tracking-wider">
              {t.hero.tagline}
            </span>
            <ArrowUpRight className="w-4 h-4 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </motion.a>
        </div>

        {/* 右侧 — Bento Card 风格的展示卡 (暂时隐藏) */}
        {false && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="md:col-span-5 order-2 md:order-2 flex justify-center md:justify-end"
        >
          <div className="relative w-full max-w-sm aspect-[4/5] rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-900/50 group hover:border-blue-500/30 transition-all duration-500">
            {/* 渐变背景 */}
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black"></div>
            {/* 网格纹理 */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
            {/* 光晕 */}
            <div className="absolute -top-1/4 -right-1/4 w-3/4 h-3/4 bg-blue-500/10 blur-3xl rounded-full"></div>

            {/* 内容层 - Vibe Coding 信息卡 */}
            <div className="absolute inset-0 flex flex-col justify-between p-6">
              {/* 顶部 - 标识 */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                  <span className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase">AI-NATIVE</span>
                </div>
                <span className="font-mono text-[9px] text-zinc-700 tracking-widest">01</span>
              </div>

              {/* 中部 - 核心信息 */}
              <div className="flex flex-col items-center justify-center flex-1 gap-4 py-8">
                <div className="w-20 h-20 rounded-full border border-blue-500/30 bg-blue-500/5 flex items-center justify-center backdrop-blur-sm">
                  <Sparkles className="w-8 h-8 text-blue-400" />
                </div>
                <div className="text-center">
                  <div className="text-xs font-mono text-zinc-500 mb-1 tracking-wider uppercase">Vibe Coding</div>
                  <div className="text-lg font-black text-zinc-200">设计 × AI × 实现</div>
                </div>
              </div>

              {/* 底部 - 技术栈 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-zinc-600 uppercase tracking-widest">Stack</span>
                  <span className="text-zinc-400">Trae · Gemini · Antigravity</span>
                </div>
                <div className="h-px bg-zinc-800"></div>
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-zinc-600 uppercase tracking-widest">Role</span>
                  <span className="text-zinc-400">UI/UX Designer + Dev</span>
                </div>
              </div>
            </div>

            {/* 角标 */}
            <div className="absolute bottom-3 right-3 font-mono text-[9px] text-zinc-700 tracking-widest">4:5</div>
            {/* 悬停效果 */}
            <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors duration-500"></div>
          </div>
        </motion.div>
        )}
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
