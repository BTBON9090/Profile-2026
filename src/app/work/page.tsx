// src/app/work/page.tsx
"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useState, useMemo} from "react";
import UniversalModal from "@/components/ui/UniversalModal";
import { getProjectBySlug } from "@/data/projects";

// 1. 结构化你的作品数据 (方便以后随时增删改)
const projects = [
  {
    sectionId: "company",
    categoryKey: "companyProjects",
    items:[
      {
        id: "snow-ecosystem",
        title: "SNOW Ecosystem",
        subtitle: "B-End System & Browser",
        description: "主导雪诺企业零信任安全生态，包含管理后台长表单重构与 AI 浏览器跨端体验设计。",
        date: "2024 - 2026",
        image: "/images/AI-NEWTAB.png",
        link: "/work/snow-ecosystem",
      },
      {
        id: "all-in-one",
        title: "AllinOne Figma Plugin",
        subtitle: "B-End System & Browser",
        description: "主导雪诺企业零信任安全生态，包含管理后台长表单重构与 AI 浏览器跨端体验设计。",
        date: "2024 - 2026",
        image: "/images/allinone封面.jpg",
        link: "/work/all-in-one",
      },
      
      {
        id: "light-branding",
        title: "Light Branding",
        subtitle: "Visual Identity & Print",
        description: "雪诺科技从 0 到 1 的品牌基因构建，包含 Logo、宣传册及官网视觉推演。",
        date: "2024",
        image: "/images/cili-project/Desk-03.jpg",
        link: "/work/light-branding", // 👈 这个是纯看图的，指向刚刚建好的 /project 路由
      },
      {
        id: "dark-app-ui",
        title: "Dark App UI",
        subtitle: "Conceptual Data Viz",
        description: "B 端数据可视化大屏概念探索。",
        date: "2025",
        image: "/images/cili-project/Desk-06.jpg",
        link: "/work/dark-app-ui", // 👈 这个是纯看图的，指向刚刚建好的 /project 路由
      },
      {
        id: "K05",
        title: "第五个项目",
        subtitle: "Figma Productivity Tool",
        description: "100% 由 AI 辅助生成的 Figma 提效插件，集成 20+ 功能，累计服务 180+ 真实设计师。",
        date: "2025",
        image: "/images/plugin-ui.png",
        link: "/work/light-branding",
        useModal: true,
        dataSlug: "k05"
      },
      {
        id: "K06",
        title: "第六个项目",
        subtitle: "Figma Productivity Tool",
        description: "100% 由 AI 辅助生成的 Figma 提效插件，集成 20+ 功能，累计服务 180+ 真实设计师。",
        date: "2025",
        image: "/images/plugin-ui.png",
        link: "/work/light-branding",
        useModal: true,
        dataSlug: "k06"
      },
    ]
  },
  {
    sectionId: "personal",
    categoryKey: "personalProjects",
    items:[
      {
        id: "p01",
        title: "AllinOne Plugin",
        subtitle: "Figma Productivity Tool",
        description: "100% 由 AI 辅助生成的 Figma 提效插件，集成 20+ 功能，累计服务 180+ 真实设计师。",
        date: "2025",
        image: "/images/plugin-ui.png",
        link: "/work/light-branding",
      },
      {
        id: "K07",
        title: "第七个项目",
        subtitle: "Figma Productivity Tool",
        description: "100% 由 AI 辅助生成的 Figma 提效插件，集成 20+ 功能，累计服务 180+ 真实设计师。",
        date: "2025",
        image: "/images/plugin-ui.png",
        link: "/work/light-branding",
        useModal: true,
        dataSlug: "k07"
      },
      {
        id: "K08",
        title: "第八个项目",
        subtitle: "Figma Productivity Tool",
        description: "100% 由 AI 辅助生成的 Figma 提效插件，集成 20+ 功能，累计服务 180+ 真实设计师。",
        date: "2025",
        image: "/images/plugin-ui.png",
        link: "/work/light-branding",
        useModal: true,
        dataSlug: "k08"
      },
      {
        id: "K09",
        title: "第九个项目",
        subtitle: "Figma Productivity Tool",
        description: "100% 由 AI 辅助生成的 Figma 提效插件，集成 20+ 功能，累计服务 180+ 真实设计师。",
        date: "2025",
        image: "/images/plugin-ui.png",
        link: "/work/light-branding",
        useModal: true,
        dataSlug: "k09"
      },
      {
        id: "K10",
        title: "第十个项目",
        subtitle: "Figma Productivity Tool",
        description: "100% 由 AI 辅助生成的 Figma 提效插件，集成 20+ 功能，累计服务 180+ 真实设计师。",
        date: "2025",
        image: "/images/plugin-ui.png",
        link: "/work/light-branding",
        useModal: true,
        dataSlug: "k10"
      },
    ]
  },
  {
    sectionId: "others",
    categoryKey: "furtherWorks",
    items:[
      {
        id: "o01",
        title: "Snow Design System",
        subtitle: "UI Components & Tokens",
        description: "建立并维护桌面端与 Web 端两套独立组件库，保障全域产品视觉基因统一。",
        date: "Ongoing",
        image: "/images/snow-system.png",
        link: "/work/dark-app-ui",
      },
    ]
  }
];

export default function WorkProject() {
  const { t } = useI18n();
  
  // 核心状态：记录当前打开的弹窗项目的索引
  const [currentModalIndex, setCurrentModalIndex] = useState<number | null>(null);

  // 提取出所有支持 Modal 的项目，用于“上一篇/下一篇”切换
  const modalList = useMemo(() => {
    return projects
      .flatMap(section => section.items)
      .filter(item => item.useModal && item.dataSlug)
      .map(item => {
        const detailData = getProjectBySlug(item.dataSlug as string);
        return {
          id: item.id,
          title: item.title,
          images: detailData?.behanceSlices ||[]
        };
      });
  },[]);

  const openModal = (projectId: string) => {
    const index = modalList.findIndex(p => p.id === projectId);
    if (index !== -1) setCurrentModalIndex(index);
  };

  const handlePrev = () => {
    if (currentModalIndex !== null && currentModalIndex > 0) {
      setCurrentModalIndex(currentModalIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentModalIndex !== null && currentModalIndex < modalList.length - 1) {
      setCurrentModalIndex(currentModalIndex + 1);
    }
  };

  // 🔴 修改 3: 移除固定宽度，改为响应式 1200px 居中
  return (
    <div className="relative z-10 min-h-screen pt-32 pb-48 px-4 md:px-8 2xl:px-32 selection:bg-blue-500/30 selection:text-blue-200">
      {/* 🔴 修改 1: 移除 max-w 限制，横向完全撑满 */}
      <div className="w-full mx-auto">
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="mb-20">
          <h1 className="text-5xl md:text-9xl font-bold text-white tracking-tight mb-6">All Work</h1>
          <p className="text-zinc-400 text-lg max-w-2xl font-light">{t.work.description}</p>
        </motion.div>

        <div className="space-y-32">
          {projects.map((section, sectionIdx) => (
            <div key={sectionIdx} id={section.sectionId} className="scroll-mt-32">
              <div className="flex items-center gap-4 mb-10 border-b border-zinc-800 pb-4">
                <span className="text-5xl font-mono font-bold text-blue-500 tracking-widest uppercase">0{sectionIdx + 1}</span>
                <h2 className="text-5xl font-bold text-white">{t.work[section.categoryKey as keyof typeof t.work]}</h2>
              </div>

              {/* 🔴 修改 2: 响应式 1 到 5 列适配 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
                {section.items.map((project, idx) => {
                  const isModal = project.useModal && project.dataSlug;
                  const Wrapper: any = isModal ? "div" : Link;
                  const wrapperProps = isModal ? { onClick: () => openModal(project.id) } : { href: project.link };

                  return (
                    <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: idx * 0.1, duration: 0.5 }} className="h-full">
                      <Wrapper {...wrapperProps} className={`block group h-full ${isModal ? 'cursor-pointer' : ''}`}>
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-600 transition-colors duration-300 h-full flex flex-col">
                          
                          {/* 🔴 修改 3: 使用 aspect-video 或 aspect-[4/3] 替代固定高度，保证各端比例完美 */}
                          <div className="relative aspect-video w-full bg-zinc-950 overflow-hidden flex-shrink-0">
                            <Image src={project.image} alt={project.title} fill className="object-cover object-top opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                            <div className="hidden md:flex absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-md border border-white/10 rounded-full items-center justify-center opacity-0  group-hover:opacity-100  transition-all duration-300">
                              <ArrowUpRight className="w-5 h-5 text-white" />
                            </div>
                          </div>

                          <div className="p-5 md:p-6 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-3">
                              <div className="min-w-0 pr-2">
                                <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-blue-400 transition-colors truncate md:whitespace-normal">{project.title}</h3>
                                <p className="text-xs font-mono text-zinc-500 mt-1 truncate">{project.subtitle}</p>
                              </div>
                              <span className="hidden md:inline-block text-[10px] font-mono text-zinc-600 bg-zinc-900 px-2 py-1 rounded flex-shrink-0">{project.date}</span>
                            </div>
                            <p className="hidden md:block text-zinc-400 text-sm leading-relaxed line-clamp-3 mt-auto">{project.description}</p>
                          </div>
                        </div>
                      </Wrapper>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Universal Modal */}
      {currentModalIndex !== null && (
        <UniversalModal
          isOpen={true}
          onClose={() => setCurrentModalIndex(null)}
          title={modalList[currentModalIndex].title}
          images={modalList[currentModalIndex].images}
          hasPrev={currentModalIndex > 0}
          hasNext={currentModalIndex < modalList.length - 1}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </div>
  );
}