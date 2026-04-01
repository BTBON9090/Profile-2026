// src/components/sections/hero.tsx
"use client";
import { Spotlight } from "@/components/ui/spotlight";
import { ArrowDown, Code2, Layers } from "lucide-react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

export default function Hero() {
  const { t } = useI18n();
  
  return (
    <section id="hero" className="h-screen w-full flex items-center justify-center bg-transparent antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
      
      <div className="p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-xs font-mono text-zinc-400">{t.hero.badge}</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-bold text-zinc-300 pb-4">
            {t.hero.title} <br />
            <span className="text-blue-500/90">{t.hero.titleHighlight}</span> {t.hero.titleEnd}
          </h1>

          <p className="mt-4 font-normal text-base text-zinc-400 max-w-2xl mx-auto font-mono leading-relaxed">
            {t.hero.subtitle}<span className="text-blue-500">{t.hero.subtitleAi}</span>{t.hero.subtitleAnd}<span className="text-purple-500">{t.hero.subtitleVibe}</span>{t.hero.subtitleEnd}
            <br />
            {t.hero.description}
          </p>

          <div className="flex justify-center gap-8 mt-12 text-zinc-500">
             <div className="flex flex-col items-center gap-2 group cursor-pointer hover:text-zinc-300 transition-colors">
                <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 group-hover:border-blue-500/50 transition-colors">
                  <Layers className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono">{t.hero.systemDesign}</span>
             </div>
             <div className="flex flex-col items-center gap-2 group cursor-pointer hover:text-zinc-300 transition-colors">
                <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 group-hover:border-purple-500/50 transition-colors">
                  <Code2 className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono">{t.hero.aiEngineering}</span>
             </div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 1, duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-zinc-500 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] font-mono tracking-widest uppercase">{t.hero.scrollHint}</span>
        <ArrowDown className="w-4 h-4" />
      </motion.div>
    </section>
  );
}
