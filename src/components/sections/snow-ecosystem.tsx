// src/components/sections/snow-ecosystem.tsx
"use client";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ShieldCheck, Layers, Bot, LayoutTemplate } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// 定义叙事数据结构
const features = [
  {
    id: "architecture",
    icon: ShieldCheck,
    title: "The Paradigm Shift",
    subtitle: "From VDI to Secure Browser",
    description: "传统 VDI 部署成本高、体验差。雪诺方案通过“端+云”架构，将企业办公成本降低 90%。我构建了零信任网关的可视化拓扑逻辑。",
    // 这里我们不放图，我们用代码画一个动态拓扑图
    type: "code-visual", 
  },
  {
    id: "admin",
    icon: LayoutTemplate,
    title: "Logic Refactoring",
    subtitle: "SnowSpaces Admin Panel",
    description: "针对超长表单痛点，我引入了“Draft vs Publish”发布流机制，并增加了敏感因子的实时预览区。将管理员配置效率提升了 40%。",
    image: "/images/snow-admin.png",
    type: "image",
  },
  {
    id: "browser",
    icon: Bot,
    title: "AI-Native Experience",
    subtitle: "SnowBrowser AI Edition",
    description: "不仅仅是 Chrome 套壳。我设计了沉浸式 AI 侧边栏，支持多模态输入与上下文感知，让企业办公从“搜索”进化为“生成”。",
    image: "/images/snow-browser.png",
    type: "image",
  },
  {
    id: "system",
    icon: Layers,
    title: "Dual Design System",
    subtitle: "Consistent Foundation",
    description: "一个人维护 Web (Admin) 与 Desktop (Browser) 两套组件库。通过 Figma Variables 统一 Token，确保了跨端体验的一致性。",
    image: "/images/snow-system.png",
    type: "image",
  },
];

export default function SnowEcosystem() {
  // 记录当前激活的板块索引
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <section className="bg-transparent py-20 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* 标题区 */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 mb-4"
          >
             <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
             <span className="text-blue-400 font-mono text-sm tracking-wider uppercase">
               Core Business
             </span>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            SnowTech <span className="text-zinc-600">Ecosystem</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl text-lg font-light">
            A comprehensive zero-trust security solution. Rebuilding the enterprise workspace from the ground up.
          </p>
        </div>

        {/* 核心布局：左侧滚动文字，右侧固定画面 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative">
          
          {/* 左侧：滚动叙事块 */}
          <div className="space-y-[50vh] pb-[20vh]">
            {features.map((feature, index) => (
              <TextBlock 
                key={feature.id} 
                feature={feature} 
                index={index} 
                setActive={setActiveFeature} 
              />
            ))}
          </div>

          {/* 右侧：Sticky 视觉展示窗 */}
          <div className="hidden lg:block relative">
            <div className="sticky top-24 h-[600px] w-full bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl">
              {/* 装饰：顶部浏览器栏 */}
              <div className="h-8 bg-zinc-800 flex items-center px-4 gap-2 border-b border-zinc-700/50">
                 <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                 <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                 <div className="ml-4 h-4 w-60 bg-zinc-700/50 rounded-full text-[10px] flex items-center px-2 text-zinc-500 font-mono">
                   snowtech.internal
                 </div>
              </div>

              {/* 内容切换区域 */}
              <div className="relative w-full h-full p-1">
                 {features.map((feature, index) => (
                   <motion.div
                     key={feature.id}
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ 
                       opacity: activeFeature === index ? 1 : 0,
                       scale: activeFeature === index ? 1 : 0.95,
                       zIndex: activeFeature === index ? 10 : 0
                     }}
                     transition={{ duration: 0.5 }}
                     className="absolute inset-0 w-full h-full flex items-center justify-center p-4"
                   >
                     {feature.type === 'code-visual' ? (
                        <TopologyVisual /> // 如果是第一个，显示代码画的拓扑图
                     ) : (
                        <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg border border-zinc-700/50">
                          {/* 这里的图片建议是高保真 UI 截图 */}
                          <Image 
                             src={feature.image || ""} 
                             alt={feature.title}
                             fill
                             className="object-cover object-top"
                          />
                        </div>
                     )}
                   </motion.div>
                 ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// 子组件：文本块 (带 Viewport 监听)
function TextBlock({ feature, index, setActive }: { feature: any, index: number, setActive: (i: number) => void }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-50% 0px -50% 0px" });

  if (isInView) {
    setActive(index);
  }

  return (
    <div ref={ref} className="min-h-[50vh] flex flex-col justify-center p-6 rounded-2xl transition-colors duration-500 hover:bg-zinc-900/30 border border-transparent hover:border-zinc-800/50">
       <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6">
         <feature.icon className="w-6 h-6 text-blue-400" />
       </div>
       <h3 className="text-3xl font-bold text-white mb-2">{feature.title}</h3>
       <div className="text-blue-500 font-mono text-sm mb-6">{feature.subtitle}</div>
       <p className="text-zinc-400 leading-relaxed text-lg">
         {feature.description}
       </p>
    </div>
  );
}

// 子组件：用代码画的拓扑动画 (展示技术力)
function TopologyVisual() {
  return (
    <div className="w-full h-full bg-grid-white/[0.05] relative flex items-center justify-center overflow-hidden bg-black">
       {/* 中心节点：Gateway */}
       <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.5)] z-10 relative">
          <ShieldCheck className="w-8 h-8 text-white" />
          <div className="absolute inset-0 border border-blue-400 rounded-full animate-ping opacity-20"></div>
       </div>

       {/* 周围节点动画 */}
       {[0, 1, 2, 3].map((i) => (
         <motion.div
           key={i}
           className="absolute w-12 h-12 bg-zinc-800 border border-zinc-700 rounded-xl flex items-center justify-center z-10"
           animate={{
             x: [0, Math.cos(i * 1.57) * 150, 0], // 简单的圆形扩散动画
             y: [0, Math.sin(i * 1.57) * 150, 0],
           }}
           transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
         >
           <div className="w-2 h-2 bg-zinc-500 rounded-full"></div>
         </motion.div>
       ))}
       
       {/* 连线 (简化版，仅示意) */}
       <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <circle cx="50%" cy="50%" r="150" fill="none" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
       </svg>
       
       <div className="absolute bottom-8 text-xs font-mono text-zinc-600">
          Architecture Topology Viz
       </div>
    </div>
  );
}