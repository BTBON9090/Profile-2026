// src/app/work/page.tsx
"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import UniversalModal from "@/components/ui/UniversalModal";
import { getProjectBySlug } from "@/data/projects";
import Footer from "@/components/layout/footer";

// 1. 结构化你的作品数据 (方便以后随时增删改)
type ProjectItem = {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  date: string;
  image: string;
  link?: string;
  hidden?: boolean;
  useModal?: boolean;
  dataSlug?: string;
  tags?: string[];
  badge?: string;
};

type ProjectSection = {
  sectionId: string;
  categoryKey: string;
  items: ProjectItem[];
};

const projects: ProjectSection[] = [
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
        image: "https://cdn.btbon.cn/images/AI-NEWTAB.png",
        link: "/work/snow-ecosystem",
        hidden: true,
      },      
      
      {
        id: "dark-app-ui",
        title: "Enterporer-企业浏览器",
        subtitle: "Conceptual Data Viz",
        description: "B 端数据可视化大屏概念探索。",
        date: "2019",
        image: "https://cdn.btbon.cn/images/cili-project/Desk-06.jpg",
        link: "/work/dark-app-ui",
        hidden: true,
      },
      {
        id: "snownewtab",
        title: "雪诺企业安全浏览器",
        description: "旨在替代传统繁重的 VDI（桌面虚拟化）与 VPN + DLP 方案，在互联网与企业内网双环境下，从访问入口处守护企业核心资产。",
        image: "https://cdn.btbon.cn/snownewtab/AI-NEWTAB.png",
        date: "2024 - 2026",
        useModal: true,
        dataSlug: "snownewtab",
        tags: ["B端", "安全", "浏览器"],
      },
      {
        id: "snowspace",
        title: "雪诺企业安全工作空间",
        description: "企业安全办公管理系统，浏览器后台",
        image: "https://cdn.btbon.cn/snowspace/ssth3.png",
        date: "2024 - 2026",
        useModal: true,
        dataSlug: "snowspace",
        tags: ["B端", "管理后台"],
      },
      {
        id: "avic",
        title: "商网办公系统",
        description: "中航金网IM办公协同系统，2019年疫情期间为国企定制开发，涵盖视频会议、行程管理、活动统筹，对标钉钉飞书。",
        image: "https://cdn.btbon.cn/AVIC-商网/them07-01.png", 
        date: "2019",
        useModal: true,
        dataSlug: "avic",
        tags: ["IM", "协同", "国企"],
      },
      {
        id: "enterplorer",
        title: "Enterplorer - 企业浏览器",
        description: "Enterplorer 企业安全浏览器，以零信任为核心，实现桌面端与移动端无缝衔接，保障企业办公数据安全。",
        image: "https://cdn.btbon.cn/YSP-Enterporer/them06-01.png", 
        date: "2018 - 2020",
        useModal: true,
        dataSlug: "enterplorer",
        tags: ["B端", "零信任", "跨端"],
      },
      {
        id: "studio",
        title: "Enterplorer Studio - 开发者工具",
        description: "Enterplorer Studio 网页移动端适配开发工具，将桌面端网页快速适配到移动端，降低适配门槛，提升开发者效率。",
        image: "https://cdn.btbon.cn/YSP-Studio/them04-01.png",
        date: "2018 - 2020",
        useModal: true,
        dataSlug: "studio",
        tags: ["开发者工具", "适配"],
      },
      {
        id: "amazeui",
        title: "AmazeUI - 开源设计系统",
        description: "独立建立的移动端适配设计系统，应用于 Enterplorer Studio，包含组件库、样式库、图标库，提升设计效率与前端对接效率。",
        image: "https://cdn.btbon.cn/YSP-AmazeUI/them05-01.png",
        date: "2018 - 2020",
        useModal: true,
        dataSlug: "amazeui",
        tags: ["设计系统", "开源"],
      },
      {
        id: "kwai-magnetic-star",
        title: "磁力聚星-快手达人营销平台",
        description: "快手磁力聚星官网改版，全链路体验升级，老用户下单效率提升22%，首月转化率提升5.6%。",
        image: "https://cdn.btbon.cn/Kwai-磁力聚星/them03-01.png",
        date: "2024",
        useModal: true,
        dataSlug: "kwai-magnetic-star",
        tags: ["C端", "营销", "改版"],
      },
    ]
  },
  {
    sectionId: "personal",
    categoryKey: "personalProjects",
    items:[
      {
        id: "all-in-one",
        title: "AllinOne - Figma全能插件",
        description: "340+设计师使用的 Figma 提效插件，集成 30+ 功能，另有 AI 功能，提升设计效率。",
        image: "https://cdn.btbon.cn/images/allinone-cover.png",
        date: "2024",
        useModal: false,
        link: "/work/all-in-one",
        tags: ["Figma", "插件", "AI"],
        badge: "免费",
      },
      {
        id: "all-in-one-v2",
        title: "AllinOne V2 — 全新升级",
        description: "瑞士国际风格设计 · AI 组件说明书 · 多语言翻译 · 等轴形变 · 时空信标",
        image: "https://cdn.btbon.cn/images/ALO.jpg",
        date: "2025",
        useModal: false,
        link: "/work/all-in-one-v2",
        tags: ["Figma", "瑞士风格", "AI"],
        badge: "新",
      },
      {
        id: "block-wall",
        title: "BlockWall — 三维方块墙",
        description: "Three.js 驱动的可交互三维方块墙背景，支持多材质、倒角、灯光与翻转动画的实时调参。",
        image: "https://cdn.btbon.cn/images/ALO.jpg",
        date: "2026",
        useModal: false,
        link: "/work/block-wall",
        tags: ["Three.js", "WebGL", "交互"],
        badge: "新",
      },
      {
        id: "ai-translate",
        title: "AI Translate - AI翻译插件",
        description: "支持自定义 AI 模型配置的极简悬浮翻译插件，提供沉浸式双语对照与局部划词翻译体验。",
        image: "https://cdn.btbon.cn/images/aitran.png",
        date: "2024",
        useModal: false,
        link: "/work/ai-translate",
        tags: ["翻译", "AI", "插件"],
        badge: "免费",
      },
      {
        id: "launchpad",
        title: "LaunchPad — macOS 原生启动台",
        description: "为 macOS 重新找回熟悉的启动体验，支持快捷键、F4、触控板手势与触发角唤起。",
        image: "/product-assets/launchpad-icon.png",
        date: "2026",
        useModal: false,
        link: "/work/launchpad",
        tags: ["macOS", "SwiftUI", "原生应用"],
        badge: "新",
      },
      {
        id: "aura",
        title: "Aura — 私密图片画廊",
        description: "本地优先的私密影像管理工具，覆盖标签整理、物理隔离、幻灯片与入口伪装。",
        image: "/product-assets/aura-logo.png",
        date: "2026",
        useModal: false,
        link: "/work/aura",
        tags: ["Android", "Flutter", "隐私产品"],
        badge: "新",
      },
      {
        id: "others",
        title: "其他作品",
        description: "自驱型业务项目、个人外包项目、日常练习作品。",
        image: "https://cdn.btbon.cn/Other/them09-01.png",
        date: "合集",
        useModal: true,
        dataSlug: "others",
        tags: ["合集"],
      },
    ]
  },
];

function ModalHandler({ modalList, setCurrentModalIndex }: { modalList: any[], setCurrentModalIndex: (index: number | null) => void }) {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const projectId = searchParams.get("project");
    if (projectId) {
      const index = modalList.findIndex(p => p.id === projectId);
      if (index !== -1) {
        setCurrentModalIndex(index);
      }
    }
  }, [searchParams, modalList, setCurrentModalIndex]);

  return null;
}

export default function WorkProject() {
  const { t } = useI18n();
  const [currentModalIndex, setCurrentModalIndex] = useState<number | null>(null);
  const [imageLoaded, setImageLoaded] = useState<Record<string, boolean>>({});
  // 从详情页返回时强制图片立即加载（避免 lazy 导致页面高度不够无法恢复滚动）
  const [forceEager, setForceEager] = useState(false);

  // 进入详情页（如 /work/all-in-one-v2）前记录作品列表滚动位置，返回时恢复。
  // —— 关键：保存的位置在「确认恢复到位」之前不清除，避免首次 scrollTo 因
  //   页面高度未渲染而失败后，后续兜底定时器读到空值无法重试。
  useEffect(() => {
    // 只有从详情页返回（带 work-scroll-back 标记）才尝试恢复，
    // 避免首次进入 /work 或从其它页面跳来时误恢复到一个旧值。
    const flag = sessionStorage.getItem("work-scroll-back");
    if (!flag) return;
    sessionStorage.removeItem("work-scroll-back");
    setForceEager(true); // 强制所有图片立即加载，确保页面高度足够

    const tryRestore = () => {
      const saved = sessionStorage.getItem("work-scroll-y");
      if (!saved) return;
      const y = Number(saved);
      if (!Number.isFinite(y) || y <= 0) return;
      window.scrollTo(0, y);
      // 若已接近目标位置（容差 4px），视为恢复成功，清除保存值，停止重试。
      if (Math.abs(window.scrollY - y) < 4) {
        sessionStorage.removeItem("work-scroll-y");
      }
    };
    // 多次尝试，等骨架/图片渲染出足够高度后再恢复。
    const tries = [0, 60, 160, 340, 700, 1200, 2000];
    const timers = tries.map((d) => setTimeout(tryRestore, d));
    requestAnimationFrame(() => requestAnimationFrame(tryRestore));
    const onPop = () => setTimeout(tryRestore, 50);
    window.addEventListener("popstate", onPop);

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("popstate", onPop);
    };
  }, []);

  // 提取出所有支持 Modal 的项目，用于"上一篇/下一篇"切换
  const modalList = useMemo(() => {
    return projects
      .flatMap(section => {
        const isCompanyProject = section.sectionId === "company";
        return section.items.map(item => ({ ...item, isCompanyProject }));
      })
      .filter(item => item.useModal && item.dataSlug)
      .map(item => {
        const detailData = getProjectBySlug(item.dataSlug as string);
        return {
          id: item.id,
          title: item.title,
          images: detailData?.behanceSlices || [],
          isCompanyProject: item.isCompanyProject,
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

  // 统计数据
  const stats = useMemo(() => {
    const all = projects.flatMap(s => s.items).filter(i => !i.hidden);
    return {
      total: all.length,
      company: projects[0].items.filter(i => !i.hidden).length,
      personal: projects[1].items.filter(i => !i.hidden).length,
    };
  }, []);

  return (
    <div className="relative z-10 min-h-screen bg-zinc-950 selection:bg-blue-500/30 selection:text-blue-200">
      <Suspense fallback={null}>
        <ModalHandler modalList={modalList} setCurrentModalIndex={setCurrentModalIndex} />
      </Suspense>

      {/* ========================================== */}
      {/* Hero 区 — 严谨的信息层次                    */}
      {/* ========================================== */}
      <section className="relative pt-32 pb-16 px-6 md:px-12 overflow-hidden">
        

        <div className="max-w-[1400px] mx-auto relative z-10">
          {/* 章节标识 — 严谨的元数据条 */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-10"
          >
            <span className="font-mono text-[11px] text-blue-400 tracking-[0.25em] uppercase font-medium">/ Portfolio</span>
            <span className="h-px w-16 bg-gradient-to-r from-blue-500/40 to-transparent"></span>
            <span className="font-mono text-[11px] text-zinc-500 tracking-[0.2em] uppercase">Gallery · 2026</span>
          </motion.div>

          {/* 主标题 — 强对比度，符合 WCAG AAA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mb-6"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-zinc-50 tracking-tight leading-[0.95]">
              All Project<span className="text-blue-500">.</span>
            </h1>
          </motion.div>

          {/* 副标题 — 对比度 7.2:1 */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-zinc-300 text-base md:text-lg max-w-2xl leading-relaxed mb-10"
          >
            {t.work.description}
          </motion.p>

          {/* 统计信息 — 严谨的数据展示 */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex flex-wrap gap-8 md:gap-12 pt-8 border-t border-zinc-800/80"
          >
            <div className="group">
              <div className="text-3xl font-bold text-zinc-50 tabular-nums">{stats.total}</div>
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] mt-1.5">Total Projects</div>
            </div>
            <div className="group">
              <div className="text-3xl font-bold text-zinc-50 tabular-nums">{stats.company}</div>
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] mt-1.5">Enterprise</div>
            </div>
            <div className="group">
              <div className="text-3xl font-bold text-zinc-50 tabular-nums">{stats.personal}</div>
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] mt-1.5">Personal</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 作品列表区 — 严谨的卡片设计                  */}
      {/* ========================================== */}
      <div className="w-full mx-auto pb-40 px-6 md:px-12 pt-16">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-24 md:space-y-32"
          >
            {projects.map((section, sectionIdx) => {
              const visibleItems = section.items.filter(project => !project.hidden);
                return (
                  <div key={section.sectionId} id={section.sectionId} className="scroll-mt-32">
                    {/* 章节标题 — 严谨的层级 */}
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="flex items-center gap-5 mb-12 pb-5 border-b border-zinc-800/80"
                    >
                      <span className="text-4xl md:text-5xl font-mono font-black text-blue-500/90 tracking-tight tabular-nums">
                        {String(sectionIdx + 1).padStart(2, "0")}
                      </span>
                      <div className="flex-1">
                        <h2 className="text-2xl md:text-3xl font-bold text-zinc-100 tracking-tight">
                          {t.work[section.categoryKey as keyof typeof t.work]}
                        </h2>
                        <div className="text-[11px] font-mono text-zinc-600 uppercase tracking-[0.2em] mt-1">
                          {section.sectionId === "company" ? "Enterprise Projects" : "Personal Works"}
                        </div>
                      </div>
                      <span className="font-mono text-[11px] text-zinc-500 uppercase tracking-wider px-3 py-1 rounded-full bg-zinc-900/60 border border-zinc-800">
                        {visibleItems.length} {visibleItems.length === 1 ? "item" : "items"}
                      </span>
                    </motion.div>

                    {/* 作品网格 — 严谨的间距和对齐 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
                      {visibleItems.map((project, idx) => {
                        const isModal = project.useModal && project.dataSlug;
                        const isExternal = project.link && (project.link.startsWith('http://') || project.link.startsWith('https://'));
                        const projectTags = project.tags || [];
                        const isProductApp = project.id === "launchpad" || project.id === "aura";
                        
                        let Wrapper: any = "div";
                        let wrapperProps: any = {};
                        
                        if (isModal) {
                          Wrapper = "div";
                          wrapperProps = { 
                            onClick: () => openModal(project.id),
                            role: "button",
                            tabIndex: 0,
                            "aria-label": `查看 ${project.title} 详情`,
                            onKeyDown: (e: any) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                openModal(project.id);
                              }
                            }
                          };
                        } else if (isExternal) {
                          Wrapper = "a";
                          wrapperProps = { 
                            href: project.link, 
                            target: "_blank", 
                            rel: "noopener noreferrer",
                            "aria-label": `访问 ${project.title}（新窗口）`
                          };
                        } else {
                          Wrapper = Link;
                          wrapperProps = {
                            href: project.link,
                            "aria-label": `查看 ${project.title} 详情`,
                            onClick: () => sessionStorage.setItem("work-scroll-y", String(window.scrollY)),
                          };
                        }

                        return (
                          <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            className="h-full"
                          >
                            <Wrapper {...wrapperProps} className={`block group h-full ${isModal ? 'cursor-pointer' : ''}`}>
                              <article className="relative bg-zinc-900/40 border border-zinc-800/60 rounded-xl overflow-hidden hover:border-zinc-600/80 hover:bg-zinc-900/60 transition-all duration-400 h-full flex flex-col group-hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)]">
                                
                                {/* 图片区 — 严谨的宽高比和加载状态 */}
                                <div className={`relative aspect-[16/10] w-full overflow-hidden flex-shrink-0 ${
                                  project.id === "launchpad"
                                    ? "bg-[radial-gradient(circle_at_50%_45%,#1748a8,#070b22_68%)]"
                                    : project.id === "aura"
                                      ? "bg-[radial-gradient(circle_at_50%_42%,#eadff1,#bca6cc_72%)]"
                                      : "bg-zinc-900"
                                }`}>
                                  {/* 骨架屏 */}
                                  {!imageLoaded[project.id] && (
                                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800/50 to-zinc-900 animate-pulse"></div>
                                  )}
                                  <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    unoptimized
                                    loading={forceEager ? "eager" : "lazy"}
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                    className={`${isProductApp ? "object-contain p-8 md:p-10 drop-shadow-[0_18px_30px_rgba(0,0,0,.28)]" : "object-cover object-top"} group-hover:scale-[1.04] transition-transform duration-700 ease-out`}
                                    onLoad={() => setImageLoaded(prev => ({ ...prev, [project.id]: true }))}
                                  />
                                  
                                  
                                  {/* 角标 — 严谨的交互指示 */}
                                  <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/30 backdrop-blur-md border border-white/15 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                                    {isModal ? (
                                      <ArrowRight className="w-4 h-4 text-white" />
                                    ) : (
                                      <ArrowUpRight className="w-4 h-4 text-white" />
                                    )}
                                  </div>
                                </div>

                                {/* 信息区 — 严谨的排版层级 */}
                                <div className="p-5 md:p-6 flex flex-col flex-1">
                                  <h3 className="text-base md:text-lg font-semibold text-zinc-100 group-hover:text-blue-500 transition-colors duration-300 leading-snug mb-2.5">
                                    {project.title}
                                  </h3>
                                  <p className="text-[13px] text-zinc-400 leading-relaxed line-clamp-2 flex-1 mb-3">
                                    {project.description}
                                  </p>
                                  
                                  {/* 技术栈标签 — 严谨的标签系统 */}
                                  {projectTags.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-zinc-800/60">
                                      {projectTags.map((tag: string) => (
                                        <span 
                                          key={tag}
                                          className="px-2 py-0.5 text-[10px] font-mono text-zinc-500 bg-zinc-800/40 border border-zinc-700/40 rounded-md tracking-wide"
                                        >
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </article>
                            </Wrapper>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </motion.div>
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
          isCompanyProject={modalList[currentModalIndex].isCompanyProject}
        />
      )}
      <Footer />
    </div>
  );
}

