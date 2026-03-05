// src/components/sections/all-in-one.tsx
"use client";
import { motion, type Variants } from "framer-motion";
import { Code2, Cpu, Zap, Star, ArrowUpRight } from "lucide-react";
import Image from "next/image";

// 动画变体配置
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.5, // 子元素依次延迟出现
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function AllInOne() {
  return (
    <section id="all-in-one" className="min-h-screen w-full bg-transparent py-40 px-4 md:px-8 flex flex-col justify-center relative overflow-hidden">
      
      {/* 1. 标题区 */}
      <div className="max-w-7xl mx-auto w-full mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 mb-4"
        >
          <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
          <span className="text-purple-400 font-mono text-sm tracking-wider uppercase">
            The Nuclear Weapon
          </span>
        </motion.div>
        
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 flex items-center flex-wrap gap-4">
            AllinOne <span className="text-zinc-500">Figma Plugin</span>
            <a 
                href="https://allinone-plugin.netlify.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="backdrop-blur-sm group relative inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-800/50 border border-zinc-700 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300 cursor-pointer"
            >
                <Code2 className="w-4 h-4 text-white/60" />
                <span className="text-xl font-mono text-zinc-300 group-hover:text-white uppercase tracking-wider">View Project</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                
                {/* 底部发光条装饰 */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </a>
        </h2>
        <p className="text-zinc-400 max-w-2xl text-lg font-light leading-relaxed">
          The ultimate efficiency tool for designers. <br />
          <span className="text-white font-mono">100% AI-Generated Code</span> by a designer with 0 coding background.
        </p>
      </div>

      {/* 2. Bento Grid 布局区 */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-7xl mx-auto w-full grid grid-cols-2 md:grid-cols-12 gap-4 md:h-[960px]"
      >

        {/* 卡片 A: AI 生成过程展示 */}
        <motion.div
          variants={itemVariants}
          className="col-span-12 md:col-span-7 bg-gradient-to-br from-zinc-900 via-zinc-900/98 to-zinc-800/95 backdrop-blur-xl border border-zinc-700/50 rounded-3xl overflow-hidden relative group hover:border-purple-500/30 transition-all duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full"></div>

          <div className="p-8 h-full flex flex-col relative z-10">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <Code2 className="w-5 h-5 text-purple-400" />
                </div>
                <span className="font-mono text-xs text-zinc-500 tracking-wider">AI WORKFLOW</span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">从提示到产品</h3>
              <p className="text-zinc-400 text-sm">Gemini 3 Pro × Trae IDE 驱动</p>
            </div>

            {/* 代码终端 */}
            <div className="flex-1 min-h-[320px] bg-black/60 backdrop-blur-sm rounded-2xl border border-zinc-800/80 p-5 font-mono shadow-2xl overflow-auto relative">
               <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800/50">
                 <div className="flex gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-500/40 group-hover:bg-red-500 transition-colors"></div>
                   <div className="w-3 h-3 rounded-full bg-yellow-500/40 group-hover:bg-yellow-500 transition-colors"></div>
                   <div className="w-3 h-3 rounded-full bg-green-500/40 group-hover:bg-green-500 transition-colors"></div>
                 </div>
                 <span className="text-xs text-zinc-600">terminal.tsx</span>
               </div>

               <div className="space-y-4 text-sm leading-relaxed">
                 <div className="flex gap-3 items-start">
                   <span className="text-purple-400 font-semibold">user</span>
                   <span className="text-zinc-300">构建一个批量重命名图层的插件...</span>
                 </div>
                 <div className="flex gap-3 items-start">
                   <span className="text-blue-400 font-semibold">AI</span>
                   <span className="text-zinc-400">正在分析 Figma API 节点结构...</span>
                 </div>
                 <div className="pl-4 border-l-2 border-zinc-700/50 mt-2 space-y-1.5 text-zinc-400">
                   <p><span className="text-pink-400">const</span> <span className="text-yellow-300">renameLayers</span> = (<span className="text-orange-300">selection</span>) ={">"} {"{"}</p>
                   <p className="pl-4">selection.<span className="text-blue-300">forEach</span>(node ={">"} {"{"}</p>
                   <p className="pl-8">node.name = node.name.<span className="text-blue-300">replace</span>(regex, replacement)</p>
                   <p className="pl-4">{"}"});</p>
                   <p>{"}"}</p>
                 </div>
                 <div className="flex items-center gap-2 text-green-400">
                   <span className="animate-pulse">●</span>
                   <span>插件构建成功，已部署至生产环境</span>
                 </div>
               </div>
            </div>
          </div>
        </motion.div>

        {/* 卡片 B: 产品界面展示 */}
        <motion.div
          variants={itemVariants}
          className="col-span-12 md:col-span-5 md:row-span-2 bg-gradient-to-br from-zinc-900 via-zinc-900/95 to-zinc-800/90 border border-zinc-700/50 rounded-3xl overflow-hidden relative group hover:border-blue-500/30 transition-all duration-500"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/20 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-purple-500/10 blur-[100px] rounded-full"></div>

          <div className="p-8 h-full flex flex-col relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <Cpu className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="font-mono text-xs text-zinc-500 tracking-wider">INTERFACE</span>
                </div>
                <h3 className="text-2xl font-bold text-white">产品界面</h3>
              </div>

              <a
                href="https://allinone-plugin.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/80 border border-zinc-700/50 hover:bg-blue-600 hover:border-blue-500 hover:text-white text-zinc-400 transition-all duration-300 group/btn backdrop-blur-sm"
              >
                <span className="text-xs font-mono font-medium">访问网站</span>
                <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </a>
            </div>

            <div className="relative flex-1 min-h-[420px] bg-black/40 backdrop-blur-sm rounded-2xl border border-zinc-800/80 overflow-hidden group-hover:scale-[1.02] group-hover:border-zinc-700 transition-all duration-500 shadow-2xl">
              <Image
                src="/images/plugin-ui.png"
                alt="AllinOne Plugin UI"
                fill
                className="object-cover object-top opacity-90 group-hover:opacity-100 transition-opacity duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>
        </motion.div>

        {/* 卡片 C1: 开发周期 */}
        <motion.div
          variants={itemVariants}
          className="col-span-12 md:col-span-4 bg-gradient-to-br from-zinc-900 via-zinc-900/98 to-zinc-800/40 border border-zinc-700/50 rounded-3xl p-6 relative overflow-hidden group hover:border-purple-500/30 transition-all duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/8 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <Zap className="w-4 h-4 text-purple-400" />
                </div>
                <span className="text-xs font-mono text-zinc-500 tracking-wider">TIMELINE</span>
              </div>
              <div className="px-2.5 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                <span className="text-xs font-semibold text-green-400">快速上线</span>
              </div>
            </div>

            <div>
              <div className="text-5xl font-bold text-white group-hover:text-purple-400 transition-colors duration-300 mb-2">8</div>
              <div className="text-sm text-zinc-400">有效工期</div>
            </div>
          </div>
        </motion.div>
        
        {/* 卡片 C3: 版本迭代 */}
        <motion.div
          variants={itemVariants}
          className="col-span-6 md:col-span-3 bg-gradient-to-br from-zinc-900 via-zinc-900/98 to-zinc-800/40 border border-zinc-700/50 rounded-3xl p-6 relative overflow-hidden group hover:border-blue-500/30 transition-all duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/8 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <Cpu className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-xs font-mono text-zinc-500 tracking-wider">VERSION</span>
            </div>

            <div>
              <div className="text-5xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300 mb-2">7</div>
              <div className="text-sm text-zinc-400">迭代版本</div>
            </div>
          </div>
        </motion.div>

        {/* 卡片 C2: 用户数据 */}
        <motion.div
          variants={itemVariants}
          className="col-span-6 md:col-span-4 bg-gradient-to-br from-zinc-900 via-zinc-900/98 to-zinc-800/40 border border-zinc-700/50 rounded-3xl p-6 relative overflow-hidden group hover:border-yellow-500/30 transition-all duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/8 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <Star className="w-4 h-4 text-yellow-500" />
              </div>
              <span className="text-xs font-mono text-zinc-500 tracking-wider">USERS</span>
            </div>

            <div>
              <div className="text-5xl font-bold text-white group-hover:text-yellow-400 transition-colors duration-300 mb-2">181</div>
              <div className="text-sm text-zinc-400">活跃用户</div>
            </div>
          </div>
        </motion.div>
        
        {/* 卡片 D: 功能展示 */}
        <motion.div
          variants={itemVariants}
          className="col-span-12 md:col-span-8 bg-gradient-to-br from-blue-800/50 via-blue-700/10 to-indigo-800/10 border border-blue-400/20 rounded-3xl p-8 text-white relative overflow-hidden group hover:border-blue-500/40 transition-all duration-500"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(225, 0, 255, 1),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="absolute -bottom-10 -right-10 text-white/5 group-hover:text-white/10 transition-colors duration-500">
            <Cpu className="w-48 h-48 rotate-12" />
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-3">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-white/10 rounded-lg border border-white/20">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-mono text-blue-100 tracking-wider">FEATURES</span>
              </div>
              <div className="text-6xl font-bold mb-2">20+</div>
              <div className="text-sm text-blue-100/80">强大功能</div>
            </div>

            <div className="md:col-span-9 grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-colors">
                <div className="text-md text-blue-100/90 font-medium al">一键导出 PPT</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-colors">
                <div className="text-md text-blue-100/90 font-medium">组件命名清洗</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-colors">
                <div className="text-md text-blue-100/90 font-medium">超级选择工具</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-colors">
                <div className="text-md text-blue-100/90 font-medium">文本查找替换</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-colors">
                <div className="text-md text-blue-100/90 font-medium">AI 内容生成</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-colors">
                <div className="text-md text-blue-100/90 font-medium">简易工具集合</div>
              </div>
            </div>
          </div>
        </motion.div>

      </motion.div>


    </section>
  );
}