// src/components/sections/snow-ecosystem.tsx
"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ShieldCheck, Layers, Bot, LayoutTemplate, ArrowUpRight, Globe } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export default function SnowEcosystem() {
  const { t } = useI18n();
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      id: "architecture",
      icon: ShieldCheck,
      title: t.snowEcosystem.features.architecture.title,
      subtitle: t.snowEcosystem.features.architecture.subtitle,
      description: t.snowEcosystem.features.architecture.description,
      type: "code-visual", 
    },
    {
      id: "admin",
      icon: LayoutTemplate,
      title: t.snowEcosystem.features.admin.title,
      subtitle: t.snowEcosystem.features.admin.subtitle,
      description: t.snowEcosystem.features.admin.description,
      image: "/images/snow-admin.png",
      type: "image",
    },
    {
      id: "browser",
      icon: Bot,
      title: t.snowEcosystem.features.browser.title,
      subtitle: t.snowEcosystem.features.browser.subtitle,
      description: t.snowEcosystem.features.browser.description,
      image: "/images/snow-browser.png",
      type: "image",
    },
    {
      id: "system",
      icon: Layers,
      title: t.snowEcosystem.features.system.title,
      subtitle: t.snowEcosystem.features.system.subtitle,
      description: t.snowEcosystem.features.system.description,
      image: "/images/snow-system.png",
      type: "image",
    },
  ];

  return (
    <section id="snow-ecosystem" className="bg-transparent py-40 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 mb-4"
          >
             <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
             <span className="text-blue-400 font-mono text-sm tracking-wider uppercase">
               {t.snowEcosystem.badge}
             </span>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {t.snowEcosystem.title} <span className="text-zinc-600">{t.snowEcosystem.titleSuffix}</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl text-lg font-light">
            {t.snowEcosystem.description}
          </p>
          <div className="mt-10 mb-10">
              <a 
                href="https://www.snowtech.com.cn/" 
                target="_blank"
                rel="noopener noreferrer"
                className="backdrop-blur-sm group relative inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-800/50 border border-zinc-700 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300 cursor-pointer"
            >
                <Globe className="w-4 h-4 text-white/60" />
                <span className="text-xl font-mono font-bold text-zinc-300 group-hover:text-white uppercase tracking-wider">{t.snowEcosystem.visitWebsite}</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </a>
            </div>
        </div>
        

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative">
          
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

          <div className="hidden lg:block relative">
            <div className="sticky top-24 h-[600px] w-full bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl">
              <div className="h-8 bg-zinc-800 flex items-center px-4 gap-2 border-b border-zinc-700/50">
                 <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                 <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                 <div className="ml-4 h-4 w-60 bg-zinc-700/50 rounded-full text-[10px] flex items-center px-2 text-zinc-500 font-mono">
                   snowtech.internal
                 </div>
              </div>

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
                        <TopologyVisual />
                     ) : (
                        <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg border border-zinc-700/50">
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

function TextBlock({ feature, index, setActive }: { feature: any, index: number, setActive: (i: number) => void }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-50% 0px -50% 0px" });

  // 👇 核心修复：把状态更新放到 useEffect 里，让它在渲染完成后执行
  useEffect(() => {
    if (isInView) {
      setActive(index);
    }
  }, [isInView, index, setActive]);

  return (
    <div ref={ref} className="min-h-[50vh] flex flex-col justify-center p-6 rounded-2xl transition-colors duration-500 hover:bg-zinc-900/30 border border-zinc-800/50 hover:border-zinc-800/80 hover:backdrop-blur-sm">
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

function TopologyVisual() {
  return (
    <div className="w-full h-full bg-grid-white/[0.05] relative flex items-center justify-center overflow-hidden bg-black">
       <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.5)] z-10 relative">
          <ShieldCheck className="w-8 h-8 text-white" />
          <div className="absolute inset-0 border border-blue-400 rounded-full animate-ping opacity-20"></div>
       </div>

       {[0, 1, 2, 3].map((i) => (
         <motion.div
           key={i}
           className="absolute w-12 h-12 bg-zinc-800 border border-zinc-700 rounded-xl flex items-center justify-center z-10"
           animate={{
             x: [0, Math.cos(i * 1.57) * 150, 0],
             y: [0, Math.sin(i * 1.57) * 150, 0],
           }}
           transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
         >
           <div className="w-2 h-2 bg-zinc-500 rounded-full"></div>
         </motion.div>
       ))}
       
       <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <circle cx="50%" cy="50%" r="150" fill="none" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
       </svg>
       
       <div className="absolute bottom-8 text-xs font-mono text-zinc-600">
          Architecture Topology Viz
       </div>
    </div>
  );
}
