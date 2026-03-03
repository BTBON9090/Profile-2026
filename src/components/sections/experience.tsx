"use client";

import { motion } from "framer-motion";
import { GitCommit } from "lucide-react";

// 替换为你的真实职业经历数据
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

export default function Experience() {
  return (
    <section className="py-24 relative bg-black" id="experience">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        
        {/* 标题区 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-mono">
            <span className="text-blue-500">{"$"}</span> git log --oneline
          </h2>
          <p className="text-zinc-400 font-mono text-sm">Professional timeline & milestones.</p>
        </motion.div>

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
                {/* 职位 (Inter) */}
                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                  {exp.role}
                </h3>
                {/* 日期 (JetBrains Mono) */}
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
      </div>
    </section>
  );
}