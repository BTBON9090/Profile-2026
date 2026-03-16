// src/app/about/page.tsx
"use client";
import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import { 
  MapPin, GraduationCap, Briefcase, Mail, 
  MessageCircle, Hash, Sparkles, Layers, Figma, 
  TerminalSquare, Palette, Cpu, Check, Phone
} from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";



// --- 动画变体 ---
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
        duration: 0.7, 
        ease:[0.22, 1, 0.36, 1] } }
};

export default function AboutPage() {
  const { t } = useI18n();
  const[copiedText, setCopiedText] = useState("");
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(""), 2000);
  };
  return (
    <div className="relative z-10  min-h-screen pt-32 pb-48 px-4 md:px-8 selection:bg-blue-500/30 selection:text-blue-200 relative overflow-hidden">
      
      {/* 极度克制的背景光晕 */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* ==========================================
            模块 1: 个人名片 (Hero Card)
        ========================================== */}
        <motion.div 
          id="biography"
          initial="hidden" animate="visible" variants={fadeUp}
          className="scroll-mt-32 mb-6"
        >
          <div className="relative p-8 md:p-12 rounded-[2.5rem] bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-xl overflow-hidden group">
            {/* 顶部的极细高光线，增加 Apple 般的精致感 */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            
            <div className="flex flex-col md:flex-row gap-10 items-center md:items-start relative z-10">
              {/* 头像区 */}
              <div className="relative w-36 h-36 md:w-48 md:h-48 flex-shrink-0">
                <div className="absolute inset-0 bg-blue-500/20 rounded-[2rem] blur-2xl group-hover:bg-blue-500/40 transition-colors duration-700"></div>
                <div className="relative w-full h-full rounded-[2rem] overflow-hidden border border-white/10 bg-zinc-900 shadow-2xl">
                  {/* 请放入你的头像 */}
                  <Image 
                    src="/images/avatar.png" 
                    alt="BTBON" 
                    fill 
                    className="object-cover scale-100 group-hover:scale-105 transition-transform duration-700" 
                  />
                </div>
              </div>

              {/* 核心信息区 */}
              <div className="text-center md:text-left flex-1 mt-4 md:mt-0">
                <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-4">
                  {t.about.hero.title} <span className="text-white/60 font-medium text-xl md:text-4xl pl-8">{t.about.hero.titleSuffix}</span>
                </h1>
                
                <p className="text-lg md:text-xl text-white/50 font-light leading-relaxed mb-8 max-w-full">
                  "{t.about.hero.subtitle.split(/(Vibe Coding)/).map((part, i) => 
                    part === 'Vibe Coding' ? <span key={i} className="text-purple-500 font-medium">Vibe Coding</span> : part
                  )}"
                </p>

                {/* 👇 2. 完全替换这部分：实用主义联络矩阵 (Click to Copy) */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  
                  {/* 邮箱 */}
                  <button 
                    onClick={() => handleCopy("hello@nicheng.com")}
                    className="group flex items-center gap-2.5 px-4 py-2 rounded-full bg-zinc-900/50 border border-zinc-700/50 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all cursor-pointer"
                  >
                    {copiedText === "hello@nicheng.com" ? <Check className="w-4 h-4 text-green-400" /> : <Mail className="w-4 h-4 text-blue-400" />}
                    <span className="text-sm font-mono text-zinc-300 group-hover:text-white transition-colors">nc0032@qq.com</span>
                  </button>

                  {/* 微信 */}
                  <button 
                    onClick={() => handleCopy("NiCheng_Design")}
                    className="group flex items-center gap-2.5 px-4 py-2 rounded-full bg-zinc-900/50 border border-zinc-700/50 hover:border-green-500/50 hover:bg-green-500/10 transition-all cursor-pointer"
                  >
                    {copiedText === "NiCheng_Design" ? <Check className="w-4 h-4 text-green-400" /> : <MessageCircle className="w-4 h-4 text-green-400" />}
                    <span className="text-sm font-mono text-zinc-300 group-hover:text-white transition-colors">WECHAT：Aiden0032</span>
                  </button>

                  {/* 电话 */}
                  <button 
                    onClick={() => handleCopy("+86 138-xxxx-xxxx")}
                    className="group flex items-center gap-2.5 px-4 py-2 rounded-full bg-zinc-900/50 border border-zinc-700/50 hover:border-zinc-400/50 hover:bg-zinc-800 transition-all cursor-pointer"
                  >
                    {copiedText === "+86 138-xxxx-xxxx" ? <Check className="w-4 h-4 text-green-400" /> : <Phone className="w-4 h-4 text-zinc-400" />}
                    <span className="text-sm font-mono text-zinc-300 group-hover:text-white transition-colors">+86 17611231055</span>
                  </button>

                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ==========================================
            模块 2: 技能矩阵 (Bento Grid) - [极致优化区]
        ========================================== */}
        <motion.div 
          id="skills"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6"
        >
          {/* 左侧：基本属性卡片 */}
          <div className="lg:col-span-4 bg-zinc-900/30 border border-zinc-800/50 rounded-[2rem] p-8 flex flex-col justify-between hover:bg-zinc-900/50 transition-colors">
            <div>
              <div className="flex items-center gap-2 mb-8">
                <Cpu className="w-5 h-5 text-zinc-500" />
                <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-widest">{t.about.hero.baseStats}</h3>
              </div>
              <ul className="space-y-6 text-sm text-zinc-300">
                <li className="flex items-start gap-4">
                  <Briefcase className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white font-medium mb-1">{t.about.hero.role}</div>
                    <div className="text-zinc-500 text-xs font-mono">{t.about.hero.experience}</div>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <GraduationCap className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white font-medium mb-1">{t.about.hero.education}</div>
                    <div className="text-zinc-500 text-xs font-mono">{t.about.hero.school}</div>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white font-medium mb-1">{t.about.hero.location}</div>
                    <div className="text-zinc-500 text-xs font-mono">{t.about.hero.locationDetail}</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* 右侧：双核技能池 (核心视觉亮点) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* 第一个卡片 */}
            <div className="relative bg-gradient-to-b from-blue-500/20 to-blue-500/0 border border-blue-500/30 bg-opacity-10 rounded-[2rem] p-8 overflow-hidden group hover:-translate-y-1 transition-transform duration-500">
              <div className="absolute inset-0 bg-zinc-950/80 z-0"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-blue-400">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-blue-400">{t.about.hero.designEngineering}</h3>
                </div>
                <div className="flex flex-col gap-3">
                  {[t.about.hero.skills1, t.about.hero.skills2, t.about.hero.skills3, t.about.hero.skills4, t.about.hero.skills5].map((skill, i) => (
                    <div key={i} className="flex items-center gap-3 group/skill">
                      {/* 👇 核心修复：加上 shrink-0 */}
                      <div className="shrink-0 w-1 h-1 rounded-full bg-zinc-700 group-hover/skill:bg-white transition-colors"></div>
                      <span className="text-sm text-zinc-400 group-hover/skill:text-zinc-200 transition-colors font-medium tracking-wide">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* 第二个卡片 */}
            <div className="relative bg-gradient-to-b from-purple-500/20 to-purple-500/0 border border-purple-500/30 bg-opacity-10 rounded-[2rem] p-8 overflow-hidden group hover:-translate-y-1 transition-transform duration-500">
              <div className="absolute inset-0 bg-zinc-950/80 z-0"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-purple-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-purple-400">{t.about.hero.aiNativeWorkflows}</h3>
                </div>
                <div className="flex flex-col gap-3">
                  {[t.about.hero.skills6, t.about.hero.skills7, t.about.hero.skills8].map((skill, i) => (
                    <div key={i} className="flex items-center gap-3 group/skill">
                      {/* 👇 核心修复：加上 shrink-0 */}
                      <div className="shrink-0 w-1 h-1 rounded-full bg-zinc-700 group-hover/skill:bg-white transition-colors"></div>
                      <span className="text-sm text-zinc-400 group-hover/skill:text-zinc-200 transition-colors font-medium tracking-wide">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="mb-24 flex justify-end"
        >
            <span className="text-sm font-medium text-white/60 tracking-tight">
              {t.about.hero.tips.split(/(\*\*[^*]+\*\*)/).map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return <em key={i} className="italic font-bold">{part.slice(2, -2)}</em>;
                }
                return part;
              })}
            </span>
        </motion.div>

        {/* ==========================================
            模块 3: 工作经历时间轴 (极简代码风)
        ========================================== */}
        <motion.div 
          id="experience"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="scroll-mt-32"
        >
          <div className="flex items-center gap-3 mb-12 border-b border-zinc-800/50 pb-6">
            <TerminalSquare className="w-6 h-6 text-zinc-500" />
            <h2 className="text-2xl font-semibold text-white tracking-tight">{t.about.experience.title}</h2>
          </div>

          <div className="relative ml-3 space-y-16 pb-10">
            {/* 隐藏的贯穿线 */}
            <div className="absolute top-2 bottom-0 left-[7px] w-px bg-gradient-to-b from-zinc-800 via-zinc-800 to-transparent"></div>

            {t.about.experience.items.map((exp: any) => (
              <div key={exp.id} className="relative pl-10 md:pl-16 group">
                {/* 精致的节点指示器 */}
                <div className="absolute left-[2px] top-1.5 w-[11px] h-[11px] rounded-full bg-black border-2 border-zinc-600 group-hover:border-blue-400 group-hover:shadow-[0_0_10px_rgba(96,165,250,0.5)] transition-all duration-300"></div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                  <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm overflow-hidden">
                      {exp.logo ? (
                        <img src={exp.logo} alt={exp.company} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-zinc-500">🏢</span>
                      )}
                    </span>
                    {exp.company}
                    <span className="text-zinc-600 font-light hidden md:inline-block mx-2">/</span> 
                    <span className="text-lg text-zinc-400 font-medium">{exp.role}</span>
                  </h3>
                  <div className="text-xs font-mono text-zinc-500 tracking-widest uppercase">
                    {exp.time}
                  </div>
                </div>
                
                <div className="text-zinc-400 text-sm leading-relaxed mb-6 max-w-3xl">
                  {Array.isArray(exp.description) ? (
                    <ol className="list-decimal list-inside space-y-1.5 pl-2">
                      {exp.description.map((item: string, index: number) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ol>
                  ) : (
                    <p>{exp.description}</p>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {exp.tech.map((t: string, i: number) => (
                    <span key={i} className="px-3 py-1.5 bg-zinc-900/50 border border-zinc-800/50 rounded-lg text-xs font-mono text-zinc-500 hover:text-white hover:border-zinc-600 transition-colors cursor-default backdrop-blur-sm">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}