// src/components/sections/ai-translate.tsx
"use client";
import { motion, type Variants } from "framer-motion";
import { Globe2, SplitSquareHorizontal, Key, MousePointer2, ArrowUpRight, Download, Puzzle } from "lucide-react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";

export default function AITranslate() {
  const { t } = useI18n();
  
  const features =[
    {
      icon: SplitSquareHorizontal,
      title: t.aiTranslate.features.bilingual.title,
      description: t.aiTranslate.features.bilingual.description
    },
    {
      icon: MousePointer2,
      title: t.aiTranslate.features.hover.title,
      description: t.aiTranslate.features.hover.description
    },
    {
      icon: Key,
      title: t.aiTranslate.features.byok.title,
      description: t.aiTranslate.features.byok.description
    }
  ];
  
  return (
    <section id="ai-translate" className="py-40 bg-zinc-950 relative overflow-hidden border-t border-zinc-900">
      
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 mb-4"
            >
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              <span className="text-blue-400 font-mono text-sm tracking-wider uppercase">
                {t.aiTranslate.badge}
              </span>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-300 mb-6">
              {t.aiTranslate.title} <span className="text-zinc-600">
                {t.aiTranslate.titleSuffix}
              </span>
            </h2>
            
            <p className="text-zinc-400 text-lg leading-relaxed mb-10">
              {t.aiTranslate.description}
            </p>

            <div className="space-y-8">
              {features.map((feature, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-zinc-300" />
                  </div>
                  <div>
                    <h3 className="text-zinc-300 font-semibold text-lg mb-1">{feature.title}</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 mb-10">
              <a 
                href="https://github.com/BTBON9090/AI-Translate/archive/refs/heads/20260312.zip" 
                download="AI-Translate.zip"
                className="backdrop-blur-sm group relative inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-800/50 border border-zinc-700 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300 cursor-pointer"
            >
                <Puzzle className="w-4 h-4 text-white/60" />
                <span className="text-xl font-mono font-bold text-zinc-300 group-hover:text-white uppercase tracking-wider">{t.aiTranslate.download}</span>
                <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative h-[600px]  flex items-center justify-center lg:justify-end"
          >
            <div className="absolute inset-0 bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden opacity-16 shadow-2xl scale-95 origin-right">
              <Image 
                src="/images/medium2.png"
                alt="AI Translate Extension"
                fill
                className="object-cover object-top"
              />
            </div>

            <motion.div 
              animate={{ y: [-10, 10, -10], x: [30, 30, 30] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 w-[320px] h-[444px] rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] bg-white"
            >
              <Image 
                src="/images/ai-translate2.png"
                alt="AI Translate Extension"
                fill
                className="object-cover object-top"
              />
            </motion.div>
            
         </motion.div>

        </div>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/7 blur-[120px] rounded-full pointer-events-none"></div>

    </section>
  );
}