"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy, Terminal } from "lucide-react";

const SKILLS_JSON = `{
  "developer": "倪城 (Aiden)",
  "core_competencies":[
    "Frontend Architecture",
    "Performance Optimization",
    "User Experience (UX)"
  ],
  "tech_stack": {
    "frameworks": ["Next.js", "React", "Vue", "Node.js"],
    "languages":["TypeScript", "JavaScript", "HTML/CSS"],
    "styling":["Tailwind CSS", "Framer Motion", "Shadcn/ui"]
  },
  "tools":["Git", "Webpack", "Vite", "Figma"]
}`;

export default function Skills() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SKILLS_JSON);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-24 relative bg-black" id="skills">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        {/* 标题区 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-mono">
            <span className="text-blue-500">{"<"}</span>Skills{" />"}
          </h2>
          <p className="text-zinc-400 font-mono text-sm">System configuration loaded.</p>
        </motion.div>

        {/* 代码编辑器窗口 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950/50 backdrop-blur-sm shadow-2xl"
        >
          {/* 编辑器顶部栏 */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-950">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
            </div>
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono">
              <Terminal className="w-3 h-3" />
              <span>skills.json</span>
            </div>
            <button
              onClick={handleCopy}
              className="text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1 text-xs font-mono"
            >
              {copied ? <Check className="w-3 h-3 text-blue-500" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>

          {/* 代码高亮区域 (纯 Tailwind 实现 JSON 高亮) */}
          <div className="p-6 md:p-8 overflow-x-auto text-sm md:text-base leading-relaxed font-mono">
            <pre className="text-zinc-300">
              <code>
                <span className="text-zinc-500">{"{"}</span>
                <br />
                <span className="text-blue-400">  "developer"</span>
                <span className="text-zinc-500">: </span>
                <span className="text-green-400">"倪城 (Aiden)"</span>
                <span className="text-zinc-500">,</span>
                <br />
                <span className="text-blue-400">  "core_competencies"</span>
                <span className="text-zinc-500">:[</span>
                <br />
                <span className="text-green-400">    "Frontend Architecture"</span>
                <span className="text-zinc-500">,</span>
                <br />
                <span className="text-green-400">    "Performance Optimization"</span>
                <span className="text-zinc-500">,</span>
                <br />
                <span className="text-green-400">    "User Experience (UX)"</span>
                <br />
                <span className="text-zinc-500">  ],</span>
                <br />
                <span className="text-blue-400">  "tech_stack"</span>
                <span className="text-zinc-500">: {"{"}</span>
                <br />
                <span className="text-blue-400">    "frameworks"</span>
                <span className="text-zinc-500">:[</span>
                <span className="text-green-400">"Next.js"</span>
                <span className="text-zinc-500">, </span>
                <span className="text-green-400">"React"</span>
                <span className="text-zinc-500">, </span>
                <span className="text-green-400">"Vue"</span>
                <span className="text-zinc-500">],</span>
                <br />
                <span className="text-blue-400">    "languages"</span>
                <span className="text-zinc-500">:[</span>
                <span className="text-green-400">"TypeScript"</span>
                <span className="text-zinc-500">, </span>
                <span className="text-green-400">"JavaScript"</span>
                <span className="text-zinc-500">]</span>
                <br />
                <span className="text-zinc-500">  {"}"},</span>
                <br />
                <span className="text-blue-400">  "tools"</span>
                <span className="text-zinc-500">:[</span>
                <span className="text-green-400">"Git"</span>
                <span className="text-zinc-500">, </span>
                <span className="text-green-400">"Webpack"</span>
                <span className="text-zinc-500">, </span>
                <span className="text-green-400">"Figma"</span>
                <span className="text-zinc-500">]</span>
                <br />
                <span className="text-zinc-500">{"}"}</span>
              </code>
            </pre>
          </div>
        </motion.div>
      </div>
    </section>
  );
}