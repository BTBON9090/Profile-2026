// src/components/sections/hero.tsx
"use client";
import { Spotlight } from "@/components/ui/spotlight";
import { ArrowDown, Code2, Layers } from "lucide-react"; // 引入图标
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section id="hero" className="h-screen w-full flex items-center justify-center bg-transparent antialiased bg-grid-white/[0.02] relative overflow-hidden">
      {/* 1. 聚光灯背景特效 */}
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
      
      <div className="p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
        
        {/* 2. 核心文本区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center"
        >
          {/* 小标签：身份定义 */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 backdrop-blur-md mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-xs font-mono text-zinc-400">OPEN TO WORK · 2026</span>
          </div>

          {/* 主标题 */}
          <h1 className="text-5xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50 pb-4">
            Product & <br />
            <span className="text-blue-500/90">Engineering</span> Designer
          </h1>

          {/* 副标题：你的 Slogan */}
          <p className="mt-4 font-normal text-base text-neutral-300 max-w-2xl mx-auto font-mono leading-relaxed">
            Designing Systems. Building Tools. <span className="text-blue-500">Empowered by AI.</span>
            <br />
            Constructing logical beauty from pixels to code.
          </p>

          {/* 3. 装饰性代码/设计元素 */}
          <div className="flex justify-center gap-8 mt-12 text-zinc-500">
             <div className="flex flex-col items-center gap-2 group cursor-pointer hover:text-white transition-colors">
                <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 group-hover:border-blue-500/50 transition-colors">
                  <Layers className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono">System Design</span>
             </div>
             <div className="flex flex-col items-center gap-2 group cursor-pointer hover:text-white transition-colors">
                <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 group-hover:border-purple-500/50 transition-colors">
                  <Code2 className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono">AI Engineering</span>
             </div>
          </div>
        </motion.div>
      </div>

      {/* 4. 底部滚动提示 */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 1, duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-zinc-500 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] font-mono tracking-widest uppercase">Scroll to Explore</span>
        <ArrowDown className="w-4 h-4" />
      </motion.div>
    </section>
  );
}
