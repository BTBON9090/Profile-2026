// src/components/sections/ai-plugins.tsx
"use client";
import { motion } from "framer-motion";
import { Code2, Globe2, ArrowUpRight, Sparkles, Brain, Cpu, MessageSquare, Wand2, Layers, SplitSquareHorizontal, Key, MousePointer2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function AIPlugins() {
  const { t } = useI18n();

  const allInOneFeatures = [
    { icon: Wand2, title: "AI 内容填充", desc: "智能生成占位文本与图片" },
    { icon: Brain, title: "AI 组件说明书", desc: "自动生成组件使用文档" },
    { icon: MessageSquare, title: "AI 多语言翻译", desc: "一键翻译并绑定 Variables" },
    { icon: Code2, title: "组件命名清洗", desc: "AI 驱动的智能命名规范" },
    { icon: Layers, title: "一键导出 PPT", desc: "设计稿直接转为演示文稿" },
    { icon: Cpu, title: "30+ 效率工具", desc: "超级选择、等轴形变、时空信标..." },
  ];

  const translateFeatures = [
    {
      icon: SplitSquareHorizontal,
      title: t.aiTranslate.features.bilingual.title,
      description: t.aiTranslate.features.bilingual.description,
    },
    {
      icon: MousePointer2,
      title: t.aiTranslate.features.hover.title,
      description: t.aiTranslate.features.hover.description,
    },
    {
      icon: Key,
      title: t.aiTranslate.features.byok.title,
      description: t.aiTranslate.features.byok.description,
    },
  ];

  return (
    <section id="ai-plugins" className="min-h-screen w-full bg-black/40 backdrop-blur-[2px] relative z-10 overflow-hidden py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 relative z-10">
        {/* 章节标题 */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-12 md:mb-16"
        >
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-blue-500 tracking-widest">05</span>
            <span className="h-px w-12 bg-zinc-800"></span>
            <span className="font-mono text-xs text-zinc-500 tracking-[0.2em] uppercase">AI-NATIVE PLUGINS</span>
          </div>
          <span className="font-mono text-[10px] text-zinc-700 tracking-widest hidden md:block">VIBE CODING</span>
        </motion.div>

        {/* 大标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16 max-w-4xl"
        >
          <h2 className="text-4xl md:text-6xl font-black text-zinc-100 tracking-tight leading-[0.9] mb-4">
            AI 驱动的<span className="text-blue-500">.</span>
            <br />
            <span className="text-zinc-600 mt-2 block">设计工具双星</span>
          </h2>
          <p className="text-sm md:text-base text-zinc-400 leading-relaxed max-w-2xl">
            0 编程基础，借助多种 AI 大模型和 IDE 工具进行 Vibe Coding，
            独立完成全栈开发。两个插件分别服务于<span className="text-purple-400">设计效率</span>与
            <span className="text-blue-400">信息获取</span>，覆盖设计师工作全链路。
          </p>
        </motion.div>

        {/* Bento Grid 布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          {/* AllinOne - 大卡片 (左侧) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 border border-zinc-800/50 rounded-xl bg-zinc-950 overflow-hidden group hover:bg-zinc-900 transition-all duration-500"
          >
            <div className="p-6 md:p-8 relative z-10">
              {/* 头部 */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                      <Code2 className="w-5 h-5 text-purple-400" />
                    </div>
                    <span className="font-mono text-xs text-zinc-500 tracking-wider uppercase">
                      {t.allInOne.badge}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-zinc-100 mb-1">
                    {t.allInOne.title}
                  </h3>
                  <p className="text-sm text-zinc-500 font-mono">{t.allInOne.titleSuffix}</p>
                </div>

                {/* 右上角按钮 */}
                <Link
                  href="/work/all-in-one-v2"
                  className="group/btn flex items-center gap-1.5 text-zinc-500 hover:text-zinc-200 transition-colors duration-300"
                >
                  <span className="text-xs font-mono">查看项目</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </Link>
              </div>

              {/* 预览图 */}
              <div className="relative aspect-[16/9] bg-black/40 rounded-lg border border-zinc-800/80 overflow-hidden mb-6 group-hover:scale-[1.01] transition-transform duration-500">
                <Image
                  src="https://cdn.btbon.cn/images/ALO.jpg"
                  alt="AllinOne Figma Plugin"
                  fill
                  unoptimized
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              </div>

              {/* 描述 */}
              <p className="text-sm text-zinc-400 leading-relaxed mb-8">
                设计师的终极效率工具 — 集成 30+ 功能，涵盖 AI 智能填充、组件管理、文本处理与实用工具。<br />目前已有 340+ 设计师使用。
              </p>

              {/* 功能宫格 */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                {allInOneFeatures.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-zinc-800/50 hover:border-zinc-700 transition-colors duration-300">
                    <feature.icon className="w-4 h-4 text-zinc-500 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0" >
                      <div className="text-sm font-semibold text-zinc-300 truncate pb-1">{feature.title}</div>
                      <div className="text-[12px] text-zinc-600 leading-snug">{feature.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* AI Translate - 右侧 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 border border-zinc-800/50 rounded-xl bg-zinc-950 overflow-hidden group hover:bg-zinc-900 transition-all duration-500"
          >
            <div className="p-6 md:p-8 relative z-10 h-full flex flex-col">
              {/* 头部 */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                      <Globe2 className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-mono text-xs text-zinc-500 tracking-wider uppercase">
                      {t.aiTranslate.badge}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-zinc-100 mb-1">
                    {t.aiTranslate.title}
                  </h3>
                  <p className="text-sm text-zinc-500 font-mono">{t.aiTranslate.titleSuffix}</p>
                </div>

                {/* 右上角按钮 */}
                <Link
                  href="/work/ai-translate"
                  className="group/btn flex items-center gap-1.5 text-zinc-500 hover:text-zinc-200 transition-colors duration-300"
                >
                  <span className="text-xs font-mono">查看项目</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </Link>
              </div>

              {/* 产品图 - 加高 */}
              <div className="relative flex-1 min-h-[280px] bg-black/40 rounded-lg border border-zinc-800/80 overflow-hidden mb-12 group-hover:scale-[1.01] transition-transform duration-500">
                <Image
                  src="https://cdn.btbon.cn/images/aitran.png"
                  alt="AI Translate Extension"
                  fill
                  unoptimized
                  className="object-cover object-right"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>

              {/* 特性列表 */}
              <div className="space-y-4 mb-0">
                {translateFeatures.map((feature, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg border border-zinc-700/50 flex items-center justify-center">
                      <feature.icon className="w-4 h-4 text-zinc-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-zinc-300 font-semibold text-sm mb-0.5">{feature.title}</h4>
                      <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* 底部 - Vibe Coding 叙事 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-12 border border-zinc-800/60 rounded-xl bg-black overflow-hidden"
          >
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-end">
                {/* 左侧 - Vibe Coding 叙事 */}
                <div className="md:col-span-7">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-4 h-4 text-white" />
                    <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">HOW I VIBE CODE</span>
                  </div>
                  <h3 className="text-lg md:text-2xl font-black text-zinc-200 mb-6">
                    从提示词到产品，AI 就是我的开发伙伴
                  </h3>
                  <p className="text-sm text-zinc-600 leading-relaxed mb-4">
                    2026 年，设计行业对 AI 能力的要求已从"会用 ChatGPT"升级为"能用 AI 构建产品"。
                    我选择直接面对这个挑战 — 用 <span className="text-zinc-200 font-mono">Gemini / DeepSeek / GLM</span> 理解 API 文档与生成核心逻辑，优化代码结构与调试，
                    用 <span className="text-zinc-200 font-mono">Trae / ZCode</span> 作为 AI-Native 开发环境串联全流程。
                  </p>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    两个插件从 0 到发布，全程 Vibe Coding — 不是照搬 AI 输出，而是将设计思维注入提示词，
                    在 AI 生成与人工审查之间找到最优解。这是设计师在 AI 时代的新竞争力。
                  </p>
                </div>

                {/* 右侧 - 工具链条 */}
                <div className="md:col-span-5 space-y-1">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-zinc-400 mb-1">Gemini / DeepSeek / GLM</div>
                      <div className="text-[12px] text-zinc-500">API 文档理解 · 核心逻辑生成 · 代码优化 · 结构重构 · 调试</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5">
                    <div className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center flex-shrink-0">
                      <Cpu className="w-4 h-4 text-pink-400" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-zinc-400 mb-1">Seedream / Midjourney / ComfyUI</div>
                      <div className="text-[12px] text-zinc-500">图片生成 · 视频生成</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <Code2 className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-zinc-400 mb-1">Trae IDE / ZCode / GitHub</div>
                      <div className="text-[12px] text-zinc-500">AI-Native 开发环境 · 全流程串联 · 代码管理 · 版本控制 · 部署管理</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
