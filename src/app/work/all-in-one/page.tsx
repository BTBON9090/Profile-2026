"use client";
import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Layers, Zap, Bot, CheckCircle2 } from "lucide-react";
import BackToTop from "@/components/ui/back-to-top";

// ==========================================
// 核心数据 (直接写在页面内，结构清晰)
// ==========================================
const projectData = {
  title: "AllinOne Plugin",
  subtitle: "AI-Native Productivity Tool for Designers",
  tags: ["Independent Developer", "AI Engineering", "Figma API"],
  heroImage: "/images/plugin-ui.png", // 确保 public/images/ 下有这张图
  
  painPoints:[
    { title: "繁琐的重复劳动", desc: "重命名、打组、清理无用图层占据了设计师每天近 20% 的时间，极大消耗了创造力。" },
    { title: "插件碎片化", desc: "市场上的插件功能极其单一，设计师需要安装十几个插件并频繁切换，打断工作心流。" },
    { title: "跨软件沟通成本", desc: "导出切图到 PPT 进行汇报，需要手动排版、对齐，效率极低且极易出错。" }
  ],
  
  workflow: "我不仅仅是在画图，我是在构建一个“设计+汇报”的全域提效闭环。通过接入 Gemini 3.1 Pro 大模型，我让 AI 理解 Figma Node 节点树的结构，实现了零代码基础的自动化脚本编写与打包部署。",
  
  features:[
    { title: "一键导出 PPT", desc: "自动识别画板并保持宽高比，直接生成可编辑的汇报文档。", icon: Layers, colSpan: "md:col-span-2" },
    { title: "智能组件清洗", desc: "秒级移除隐藏图层与解绑无用实例。", icon: Zap, colSpan: "md:col-span-1" },
    { title: "全局文本替换", desc: "支持正则匹配的跨页面文本替换。", icon: Bot, colSpan: "md:col-span-1" },
    { title: "超级选择器", desc: "按颜色、字体、类型一键选中成百上千个同类元素。", icon: CheckCircle2, colSpan: "md:col-span-2" }
  ],

  results:[
    { metric: "180+", label: "Active Designers" },
    { metric: "20+", label: "Integrated Features" },
    { metric: "100%", label: "AI Generated Code" }
  ],
  
  nextProject: { slug: "light-branding", name: "Light Branding" }
};

// ==========================================
// 动画预设
// ==========================================
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } }
};

// ==========================================
// 主页面组件
// ==========================================
export default function AllInOneProjectPage() {
  return (
    <div className="bg-black min-h-screen text-zinc-300 selection:bg-purple-500/30 selection:text-purple-200">
      
      {/* 顶部全局返回按钮 */}
      <Link href="/work" className="fixed top-28 left-8 z-50 w-12 h-12 bg-black/50 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all group">
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
      </Link>

      {/* --- 阶段 1: 头部信息与头图 (Hero Section) --- */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-70 pb-20 relative overflow-hidden">
        {/* 背景紫色极光特效 */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/10 blur-[150px] pointer-events-none rounded-full"></div>
        
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="relative z-10">
          <div className="flex flex-wrap gap-3 mb-8">
            {projectData.tags.map((tag, i) => (
              <span key={i} className="px-4 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-mono text-purple-400">
                {tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-5xl md:text-8xl font-bold text-white tracking-tight mb-6">
            {projectData.title}
          </h1>
          <p className="text-xl md:text-3xl text-zinc-500 font-light max-w-3xl mb-16">
            {projectData.subtitle}
          </p>

          {/* 顶部超宽大图，带极细边框和阴影 */}
          <div className="relative w-full h-[50vh] md:h-[70vh] rounded-[2rem] overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-900 group">
             <Image 
               src={projectData.heroImage} 
               alt="Project Hero" 
               fill 
               className="object-cover object-top opacity-90 group-hover:scale-105 transition-transform duration-1000" 
             />
          </div>
        </motion.div>
      </div>

      {/* --- 阶段 2: 痛点空间拆解 (The Problem Space) --- */}
      <div className="bg-zinc-950 py-32 border-y border-zinc-900">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="flex items-center gap-4 mb-16">
            <span className="w-12 h-px bg-purple-500"></span>
            <h2 className="text-sm font-mono text-purple-400 uppercase tracking-widest">The Problem Space</h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projectData.painPoints.map((pain, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="bg-black border border-zinc-800 p-10 rounded-3xl hover:border-zinc-600 transition-colors"
              >
                 <div className="text-5xl text-zinc-800 font-bold mb-6 font-mono">0{i+1}</div>
                 <h3 className="text-2xl font-bold text-white mb-4">{pain.title}</h3>
                 <p className="text-zinc-400 leading-relaxed text-lg">{pain.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* --- 阶段 3: AI 驱动架构与工作流 (Logic & Workflow) --- */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-32">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="lg:col-span-5">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                AI-Driven <br/><span className="text-zinc-600">Architecture</span>
              </h2>
              <p className="text-xl text-zinc-400 leading-relaxed font-light">
                {projectData.workflow}
              </p>
            </motion.div>
            
            {/* 右侧：高保真 Terminal 代码模拟器 (极其硬核) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7 bg-[#0D0D0D] rounded-3xl p-8 border border-zinc-800 font-mono text-sm shadow-2xl"
            >
               {/* 模拟 Mac 窗口顶部控制按钮 */}
               <div className="flex gap-2 mb-8 border-b border-zinc-800 pb-4">
                 <div className="w-3.5 h-3.5 rounded-full bg-red-500/80"></div>
                 <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/80"></div>
                 <div className="w-3.5 h-3.5 rounded-full bg-green-500/80"></div>
                 <div className="ml-4 text-xs text-zinc-600">trae-ide ~ figma-plugin/src/main.ts</div>
               </div>
               {/* 伪代码区 */}
               <div className="space-y-4 text-zinc-400 text-sm md:text-base leading-relaxed">
                 <p className="text-zinc-600">{`// Step 1: Parse active nodes in Figma canvas`}</p>
                 <p><span className="text-pink-500">const</span> <span className="text-blue-400">activeNodes</span> = figma.<span className="text-blue-300">currentPage</span>.selection;</p>
                 <br />
                 <p className="text-zinc-600">{`// Step 2: Gemini 3.1 Pro Code Generation Agent`}</p>
                 <p><span className="text-pink-500">await</span> LLMAgent.<span className="text-yellow-200">generateCode</span>({`{`}</p>
                 <p className="pl-4">nodes: activeNodes,</p>
                 <p className="pl-4">intent: <span className="text-green-400">"Build a 20-in-1 efficiency toolkit"</span>,</p>
                 <p className="pl-4">framework: <span className="text-green-400">"React + UI3"</span></p>
                 <p>{`}`});</p>
                 <br />
                 <p className="text-zinc-600">{`// Step 3: Deployment`}</p>
                 <p className="text-purple-400 animate-pulse">{`> Plugin bundled successfully. Ready for designers.`}</p>
               </div>
            </motion.div>
         </div>
      </div>

      {/* --- 阶段 4: 核心功能矩阵 (Feature Highlights Bento Grid) --- */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pb-32">
         <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-4xl font-bold text-white mb-16">
           Feature Highlights
         </motion.h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projectData.features.map((feat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className={`bg-zinc-900 border border-zinc-800 p-10 rounded-[2rem] flex flex-col justify-between ${feat.colSpan} hover:bg-zinc-800/80 transition-colors group`}
              >
                 <div className="w-16 h-16 rounded-2xl bg-black border border-zinc-800 flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500">
                   <feat.icon className="w-8 h-8 text-purple-400" />
                 </div>
                 <div>
                   <h3 className="text-2xl font-bold text-white mb-4">{feat.title}</h3>
                   <p className="text-zinc-400 text-lg leading-relaxed">{feat.desc}</p>
                 </div>
              </motion.div>
            ))}
         </div>
      </div>

      {/* --- 阶段 5: 数据与收益看板 (The Impact) --- */}
      <div className="bg-purple-900/10 border-y border-purple-500/20 py-32">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
           <div className="flex flex-col md:flex-row gap-16 justify-between items-center text-center md:text-left">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <h2 className="text-4xl font-bold text-white mb-4">The Impact</h2>
                <p className="text-purple-400/80 font-mono tracking-widest uppercase text-sm">Measurable Results</p>
              </motion.div>
              
              <div className="flex flex-wrap justify-center gap-16 md:gap-32">
                 {projectData.results.map((res, i) => (
                   <motion.div 
                     key={i}
                     initial={{ opacity: 0, scale: 0.8 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     viewport={{ once: true }}
                     transition={{ delay: i * 0.2, duration: 0.6 }}
                   >
                     <div className="text-6xl md:text-7xl font-bold text-white mb-4">{res.metric}</div>
                     <div className="text-sm font-mono text-purple-400 uppercase tracking-widest">{res.label}</div>
                   </motion.div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* --- 阶段 6: 底部无缝引流 (Next Project) --- */}
      {/* 注意：这里的 href 暂时写死了上一版的 [slug] 路径，以保证你可以点过去看 V1 */}
      <Link href={`/work/${projectData.nextProject.slug}`} className="block w-full py-32 bg-black hover:bg-zinc-900 transition-colors text-center border-t border-zinc-900 group">
         <div className="text-sm font-mono text-zinc-500 tracking-widest uppercase mb-6 group-hover:text-blue-400 transition-colors">
           Next Project
         </div>
         <h2 className="text-5xl md:text-7xl font-bold text-white group-hover:translate-y-2 transition-transform duration-500">
           {projectData.nextProject.name}
         </h2>
      </Link>
                 <BackToTop />
    </div>
  );
}