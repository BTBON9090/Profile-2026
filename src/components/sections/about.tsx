// src/components/sections/about.tsx
"use client";
import { motion } from "framer-motion";
import { Download, Terminal, Layers, ArrowUpRight, GitCommit } from "lucide-react";

const stack =[
  { category: "Design & Systems", items: ["Figma", "Design Tokens", "Prototyping", "Design Systems"] },
  { category: "AI & Engineering", items:["Gemini 3.1 Pro", "Trae IDE", "HTML/CSS", "React (Basic)"] },
];

// 工作经验数据
const EXPERIENCES =[
  {
    id: 1,
    date: "2023.05 - Present",
    role: "Senior Frontend Engineer",
    company: "Tech Innovation Corp.",
    description:
      "负责核心业务线前端架构设计，主导从 Vue2 到 Next.js 14 的重构，首屏加载速度提升 60%。构建团队内部前端工程化规范。",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Zustand"],
  },
  {
    id: 2,
    date: "2021.07 - 2023.05",
    role: "Frontend Developer",
    company: "Digital Matrix Ltd.",
    description:
      "参与大型 SaaS 后台管理系统开发，设计并实现微前端架构，拆分解耦 5+ 个子系统。开发了一套供全公司使用的 React 业务组件库。",
    tech:["React", "Webpack", "Ant Design", "Micro-frontends"],
  },
  {
    id: 3,
    date: "2020.06 - 2021.06",
    role: "Junior Web Developer",
    company: "Creative Studio",
    description:
      "负责官网及多个高交互 H5 营销活动页开发，通过 Canvas 和 WebGL 实现复杂的视觉动效，保障多端兼容性。",
    tech:["Vue.js", "Three.js", "GSAP", "Sass"],
  },
];

export default function About() {
  return (
    <section id="about" className="py-32 bg-transparent relative border-t border-zinc-900">
      {/* 极简网格背景 */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem][mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24">
          
          {/* 左侧：巨型宣言 */}
          <div className="md:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="sticky top-32"
            >
              <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6">
                Beyond <br />
                <span className="text-zinc-600">Pixels.</span>
              </h2>
              <div className="w-12 h-1 bg-blue-500 mb-8"></div>
              <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                我是一名拥抱 AI 的 B 端体验架构师。我相信在 2026 年，设计的边界已经与工程融合。我不仅追求像素级的完美，更致力于构建系统、开发工具、提升团队的真实生产力。
              </p>
              
              {/* 简历下载按钮 (高亮 CTA) */}
              <a 
                href="/resume.pdf" // 请确保 public 目录下有你的简历 PDF
                target="_blank"
                className="group inline-flex items-center gap-3 px-6 py-4 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 transition-colors"
              >
                <span>Download Resume</span>
                <Download className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
              </a>
            </motion.div>
          </div>

          {/* 右侧：能力雷达与技术栈 */}
          <div className="md:col-span-7 space-y-16 mt-12 md:mt-0">
            
            {/* 哲学/元能力 */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="border-l-2 border-zinc-800 pl-6">
                <div className="flex items-center gap-2 text-white mb-2">
                  <Layers className="w-5 h-5 text-blue-400" />
                  <h3 className="text-xl font-bold">System Architect</h3>
                </div>
                <p className="text-zinc-400">擅长处理极度复杂的 B 端业务逻辑，从 0 到 1 搭建可扩展的设计系统（Design System），确保跨端体验的一致性与研发交付的高效。</p>
              </div>

              <div className="border-l-2 border-zinc-800 pl-6">
                <div className="flex items-center gap-2 text-white mb-2">
                  <Terminal className="w-5 h-5 text-purple-400" />
                  <h3 className="text-xl font-bold">AI-Empowered Engineer</h3>
                </div>
                <p className="text-zinc-400">熟练运用 Gemini、Trae 等大模型工具链。能跨越语言障碍，独立完成辅助提效工具（如 Figma 插件）的代码编写与部署。</p>
              </div>
            </motion.div>

            {/* 技术栈标签云 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8"
            >
              <h3 className="text-sm font-mono text-zinc-500 mb-6 uppercase tracking-widest">Tech Stack & Arsenal</h3>
              
              <div className="space-y-8">
                {stack.map((group, idx) => (
                  <div key={idx}>
                    <div className="text-white font-medium mb-3">{group.category}</div>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((item, i) => (
                        <span 
                          key={i} 
                          className="px-3 py-1 bg-black border border-zinc-800 rounded-full text-xs font-mono text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors cursor-default"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 工作经验 (Git Timeline 风格) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-bold text-white mb-4 font-mono">
                  <span className="text-blue-500">{"$"}</span> git log --oneline
                </h3>
                <p className="text-zinc-400 font-mono text-sm">Professional timeline & milestones.</p>
              </div>

              {/* Git Timeline 容器 */}
              <div className="relative border-l border-zinc-800 ml-4 md:ml-6 space-y-16">
                {EXPERIENCES.map((exp, index) => (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative pl-8 md:pl-12 group"
                  >
                    {/* Git Commit 节点图标 (Hover 时点亮为蓝色) */}
                    <div className="absolute -left-[17px] top-1 bg-black p-1">
                      <GitCommit className="w-6 h-6 text-zinc-600 group-hover:text-blue-500 transition-colors duration-300" />
                    </div>

                    <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4 mb-3">
                      {/* 职位 */}
                      <h4 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                        {exp.role}
                      </h4>
                      {/* 日期 */}
                      <span className="text-sm font-mono text-zinc-500">
                        {exp.date}
                      </span>
                    </div>

                    {/* 公司名 */}
                    <div className="text-zinc-300 font-medium mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-sm bg-zinc-700"></span>
                      {exp.company}
                    </div>

                    {/* 经历描述 */}
                    <p className="text-zinc-400 leading-relaxed mb-6 text-sm md:text-base max-w-2xl">
                      {exp.description}
                    </p>

                    {/* 技术栈标签 (Chip) */}
                    <div className="flex flex-wrap gap-2">
                      {exp.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-mono rounded-full hover:border-zinc-600 hover:text-zinc-200 transition-colors cursor-default"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}

                {/* 底部起点标识 */}
                <div className="relative pl-8 md:pl-12 pt-8">
                   <div className="absolute -left-[5px] top-10 w-2 h-2 rounded-full bg-zinc-800 ring-4 ring-black" />
                   <span className="text-xs font-mono text-zinc-600">Initial commit</span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
