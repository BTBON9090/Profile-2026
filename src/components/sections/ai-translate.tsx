// src/components/sections/ai-translate.tsx
"use client";
import { motion, type Variants } from "framer-motion";
import { Globe2, SplitSquareHorizontal, Key, MousePointer2, ArrowUpRight, Download, Puzzle } from "lucide-react";
import Image from "next/image";

const features =[
  {
    icon: SplitSquareHorizontal,
    title: "Bilingual Mode",
    description: "双语对照阅读，沉浸式翻译体验，支持极简字体样式自适应。"
  },
  {
    icon: MousePointer2,
    title: "Hover & Select",
    description: "精准的局部划词翻译，无需跳转页面，随时随地打破语言障碍。"
  },
  {
    icon: Key,
    title: "BYOK Customization",
    description: "支持自定义 API Key 与模型代理（GLM, Kimi, Claude 等），Key 仅保存在本地，兼顾隐私与灵活性。"
  }
];

export default function AITranslate() {
  return (
    <section id="ai-translate" className="py-40 bg-zinc-950 relative overflow-hidden border-t border-zinc-900">
      
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center">
          
          {/* 左侧：文字与特性 */}
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
                Chrome Extension
              </span>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              AI Translate <span className="text-zinc-600">
                Extension
              </span>
            </h2>
            
            <p className="text-zinc-400 text-lg leading-relaxed mb-10">
              打破传统机器翻译的生硬感。这是一个利用大语言模型（LLM）能力重塑的浏览器翻译插件。从 UI 交互到前端逻辑，全链路独立设计与研发。
            </p>

            {/* 核心特性列表 */}
            <div className="space-y-8">
              {features.map((feature, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-zinc-300" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1">{feature.title}</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA 按钮（可选，如果有 Github 或上架链接） */}
            <div className="mt-10">
              <a 
                href="https://github.com/BTBON9090/AI-Translate/archive/refs/heads/01071636.zip" 
                download="AI-Translate.zip"
                className="backdrop-blur-sm group relative inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-800/50 border border-zinc-700 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300 cursor-pointer"
            >
                <Puzzle className="w-4 h-4 text-white/60" />
                <span className="text-xl font-mono font-bold text-zinc-300 group-hover:text-white uppercase tracking-wider">Download Puzzle</span>
                <Download className="w-4 h-4 group-hover:translate-y-0.5 group-hover:text-blue-600 transition-transform" />
                
                {/* 底部发光条装饰 */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </a>
            </div>
          </motion.div>

          {/* 右侧：悬浮视觉展示 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative h-[600px]  flex items-center justify-center lg:justify-end"
          >
            {/* 模拟浏览器背景板 */}
            <div className="absolute inset-0 bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden opacity-16 shadow-2xl scale-95 origin-right">
              <Image 
                src="/images/medium2.png" // 确保这张图存在
                alt="AI Translate Extension"
                fill
                className="object-cover object-top"
              />
            </div>

            {/* 插件本体悬浮图 */}
            <motion.div 
              animate={{ y: [-10, 10, -10], x: [30, 30, 30] }} // 呼吸悬浮动效
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 w-[320px] h-[444px] rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] border border-zinc-700/50 bg-white"
            >
              <Image 
                src="/images/ai-translate2.png" // 确保这张图存在
                alt="AI Translate Extension"
                fill
                className="object-cover object-top"
              />
            </motion.div>
            
         </motion.div>

        </div>
      </div>
      {/* 极简背景光效 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/7 blur-[120px] rounded-full pointer-events-none"></div>

    </section>
  );
}