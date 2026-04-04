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
        hidden: true,
      },      
      
      {
        id: "dark-app-ui",
        title: "Enterporer-企业浏览器",
        subtitle: "Conceptual Data Viz",
        description: "B 端数据可视化大屏概念探索。",
        date: "2019",
        image: "/images/cili-project/Desk-06.jpg",
        link: "/work/dark-app-ui",
        hidden: true,
      },
      {
        id: "kwai-magnetic-star",
        title: "磁力聚星-快手达人营销平台",
        description: "快手磁力聚星官网改版，全链路体验升级，老用户下单效率提升22%，首月转化率提升5.6%。",
        image: "https://cdn.btbon.cn/Kwai-磁力聚星/them03-01.png",
        date: "2024 - 2026",
        useModal: true,
        dataSlug: "kwai-magnetic-star"
      },
      {
        id: "avic",
        title: "商网办公系统",
        description: "中航金网IM办公协同系统，2019年疫情期间为国企定制开发，涵盖视频会议、行程管理、活动统筹，对标钉钉飞书。",
        image: "https://cdn.btbon.cn/AVIC-商网/them07-01.png", 
        useModal: true,
        dataSlug: "avic"
      },
      {
        id: "enterplorer",
        title: "Enterplorer - 企业浏览器",
        description: "Enterplorer 企业安全浏览器，以零信任为核心，实现桌面端与移动端无缝衔接，保障企业办公数据安全。",
        image: "https://cdn.btbon.cn/YSP-Enterporer/them06-01.png", 
        useModal: true,
        dataSlug: "enterplorer"
      },
      {
        id: "studio",
        title: "Enterplorer Studio - 开发者工具",
        description: "Enterplorer Studio 网页移动端适配开发工具，将桌面端网页快速适配到移动端，降低适配门槛，提升开发者效率。",
        image: "https://cdn.btbon.cn/YSP-Studio/them04-01.png",
        useModal: true,
        dataSlug: "studio"
      },
      {
        id: "amazeui",
        title: "AmazeUI - 开源设计系统",
        description: "独立建立的移动端适配设计系统，应用于 Enterplorer Studio，包含组件库、样式库、图标库，提升设计效率与前端对接效率。",
        image: "https://cdn.btbon.cn/YSP-AmazeUI/them05-01.png",
        useModal: true,
        dataSlug: "amazeui"
      },
    ]
  },
  {
    sectionId: "personal",
    categoryKey: "personalProjects",
    items:[
      {
        id: "all-in-one",
        title: "AllinOne - Figma全能插件（免费）",
        description: "主导雪诺企业零信任安全生态，包含管理后台长表单重构与 AI 浏览器跨端体验设计。",
        image: "/images/allinone封面.jpg",
        link: "/work/all-in-one",
      },
      {
        id: "p01",
        title: "AI Translate - AI翻译插件（免费）",
        description: "自驱型业务项目、个人外包项目、日常练习作品。",
        image: "/images/plugin-ui.png",
        link: "/work/light-branding",
      },
      {
        id: "others",
        title: "其他作品",
        description: "自驱型业务项目、个人外包项目、日常练习作品。",
        image: "https://cdn.btbon.cn/Other/them09-01.png",
        link: "/work/others",
        dataSlug: "others" 
      },
      
    ]
  },
];

export default function WorkProject() {
  const { t } = useI18n();
  
  // 核心状态：记录当前打开的弹窗项目的索引
  const [currentModalIndex, setCurrentModalIndex] = useState<number | null>(null);

// 提取出所有支持 Modal 的项目，用于"上一篇/下一篇"切换
  const modalList = useMemo(() => {
    return projects
      // ✅ 修改这里：显式断言为 any 数组，绕过结构不一致的类型检查
      .flatMap(section => section.items as any[])
      .filter(item => item.useModal && item.dataSlug)
      .map(item => {
        const detailData = getProjectBySlug(item.dataSlug as string);
        return {
          id: item.id,
          title: item.title,
          images: detailData?.behanceSlices || []
        };
      });
  }, []);

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
    <div className="relative z-10 min-h-screen pt-32 pb-48 px-4 md:px-12 2xl:px-20 selection:bg-blue-500/30 selection:text-blue-200">
      {/* 🔴 修改 1: 移除 max-w 限制，横向完全撑满 */}
      <div className="w-full mx-auto">
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="mb-20">
          <h1 className="text-5xl md:text-9xl font-bold text-zinc-300 tracking-tight mb-6">All Work</h1>
          <p className="text-zinc-400 text-lg max-w-2xl font-regular">{t.work.description}</p>
        </motion.div>

        <div className="space-y-32">
          {projects.map((section, sectionIdx) => (
            <div key={sectionIdx} id={section.sectionId} className="scroll-mt-32">
              <div className="flex items-center gap-4 mb-10 border-b border-zinc-800/60 pb-4">
                <span className="text-5xl font-mono font-bold text-blue-500 tracking-widest uppercase">0{sectionIdx + 1}</span>
                <h2 className="text-5xl font-bold text-zinc-300">{t.work[section.categoryKey as keyof typeof t.work]}</h2>
              </div>

              {/* 🔴 修改 2: 响应式 1 到 5 列适配 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 ">
                {section.items.filter(project => !(project as any).hidden).map((project, idx) => {
                  const isModal = (project as any).useModal && (project as any).dataSlug;
                  const Wrapper: any = isModal ? "div" : Link;
                  const wrapperProps = isModal ? { onClick: () => openModal(project.id) } : { href: project.link };

                  return (
                    <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: idx * 0.1, duration: 0.5 }} className="h-full">
                      <Wrapper {...wrapperProps} className={`block group h-full ${isModal ? 'cursor-pointer' : ''}`}>
                        <div className="bg-zinc-900/50  border border-zinc-800/40 rounded-3xl overflow-hidden hover:border-zinc-600 transition-colors duration-300 h-full flex flex-col">
                          
                          {/* 🔴 修改 3: 使用 aspect-video 或 aspect-[4/3] 替代固定高度，保证各端比例完美 */}
                          <div className="relative aspect-[3/2] w-full bg-zinc-950 overflow-hidden flex-shrink-0">
                            <Image 
                              src={project.image} 
                              alt={project.title} 
                              fill 
                              unoptimized
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                              className="object-cover object-top group-hover:scale-102 transition-all duration-500" 
                            />
                          </div>
                          <div className="p-4 md:p-6 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-3">
                              <div className="min-w-0 pr-2">
                                <h3 className="text-md md:text-xl font-semibold text-white/80 group-hover:text-white transition-colors truncate md:whitespace-normal">{project.title}</h3>
                              </div>
                            </div>
                            <p className="hidden md:block text-zinc-500 text-sm leading-relaxed line-clamp-3 mt-auto">{project.description}</p>
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
          projectId={modalList[currentModalIndex].id}
          nextTitle={currentModalIndex < modalList.length - 1 ? modalList[currentModalIndex + 1].title : undefined}
        />
      )}
    </div>
  );
}