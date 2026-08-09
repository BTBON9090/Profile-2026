// src/app/work/page.tsx
"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import UniversalModal from "@/components/ui/UniversalModal";
import { getProjectBySlug } from "@/data/projects";
import Footer from "@/components/layout/footer";
import WorkGalleryV3 from "@/components/v3/work-gallery-v3";
import { useUIVersion } from "@/lib/ui-version-context";
import { getProjectResources } from "@/data/project-resources";

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

type ModalItem = {
  id: string;
  title: string;
  images: string[];
  isCompanyProject: boolean;
};

const enterpriseProjects: ProjectItem[] = [
  {
    id: "snownewtab",
    title: "雪诺企业安全浏览器",
    description: "替代传统繁重的 VDI 与 VPN + DLP 方案，在互联网与企业内网双环境下，从访问入口守护企业核心资产。",
    image: "https://cdn.btbon.cn/snownewtab/AI-NEWTAB.webp",
    date: "2024 - 2026",
    useModal: true,
    dataSlug: "snownewtab",
    tags: ["B端", "安全", "浏览器"],
  },
  {
    id: "snowspace",
    title: "雪诺企业安全工作空间",
    description: "围绕企业安全办公构建的管理系统与浏览器后台，统一权限、策略与工作空间体验。",
    image: "https://cdn.btbon.cn/snowspace/ssth3.webp",
    date: "2024 - 2026",
    useModal: true,
    dataSlug: "snowspace",
    tags: ["B端", "管理后台", "安全"],
  },
  {
    id: "kwai-magnetic-star",
    title: "磁力聚星 · 快手达人营销平台",
    description: "达人营销平台全链路体验升级，老用户下单效率提升 22%，首月转化率提升 5.6%。",
    image: "https://cdn.btbon.cn/Kwai-磁力聚星/them03-01.webp",
    date: "2024",
    useModal: true,
    dataSlug: "kwai-magnetic-star",
    tags: ["C端", "营销", "增长"],
  },
  {
    id: "avic",
    title: "商网办公系统",
    description: "为国企定制的 IM 办公协同系统，覆盖视频会议、行程管理与活动统筹。",
    image: "https://cdn.btbon.cn/AVIC-商网/them07-01.webp",
    date: "2019",
    useModal: true,
    dataSlug: "avic",
    tags: ["IM", "协同", "国企"],
  },
  {
    id: "enterplorer",
    title: "Enterplorer · 企业浏览器",
    description: "以零信任为核心，实现桌面端与移动端无缝衔接，保障企业办公数据安全。",
    image: "https://cdn.btbon.cn/YSP-Enterporer/them06-01.webp",
    date: "2018 - 2020",
    useModal: true,
    dataSlug: "enterplorer",
    tags: ["B端", "零信任", "跨端"],
  },
  {
    id: "studio",
    title: "Enterplorer Studio",
    description: "将桌面网页快速适配到移动端的开发工具，降低适配门槛并提升开发效率。",
    image: "https://cdn.btbon.cn/YSP-Studio/them04-01.webp",
    date: "2018 - 2020",
    useModal: true,
    dataSlug: "studio",
    tags: ["开发者工具", "适配"],
  },
  {
    id: "amazeui",
    title: "AmazeUI · 开源设计系统",
    description: "独立建立的移动端适配设计系统，包含组件库、样式库与图标库。",
    image: "https://cdn.btbon.cn/YSP-AmazeUI/them05-01.webp",
    date: "2018 - 2020",
    useModal: true,
    dataSlug: "amazeui",
    tags: ["设计系统", "开源"],
  },
];

function ModalHandler({ modalList, setCurrentModalIndex }: { modalList: ModalItem[]; setCurrentModalIndex: (index: number | null) => void }) {
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
  const { version } = useUIVersion();
  if (version === "2") return <WorkGalleryV3 />;
  return <WorkProjectV1 />;
}

function WorkProjectV1() {
  const { t } = useI18n();
  const [currentModalIndex, setCurrentModalIndex] = useState<number | null>(null);
  const [imageLoaded, setImageLoaded] = useState<Record<string, boolean>>({});

  // 提取出所有支持 Modal 的项目，用于"上一篇/下一篇"切换
  const modalList = useMemo(() => {
    return enterpriseProjects
      .filter(item => item.useModal && item.dataSlug)
      .map(item => {
        const detailData = getProjectBySlug(item.dataSlug as string);
        return {
          id: item.id,
          title: item.title,
          images: detailData?.behanceSlices || [],
          isCompanyProject: true,
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
            <span className="font-mono text-[11px] text-blue-400 tracking-[0.25em] uppercase font-medium">/ Enterprise Work</span>
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
              Enterprise<span className="text-blue-500">.</span>
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
              <div className="text-3xl font-bold text-zinc-50 tabular-nums">0{enterpriseProjects.length}</div>
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] mt-1.5">Selected Cases</div>
            </div>
            <div className="group">
              <div className="text-3xl font-bold text-zinc-50 tabular-nums">2018-26</div>
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] mt-1.5">Timeline</div>
            </div>
            <div className="group">
              <div className="text-3xl font-bold text-zinc-50 tabular-nums">B2B / B2C</div>
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] mt-1.5">Product Context</div>
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
            id="company"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="scroll-mt-32"
          >
            <motion.button
              type="button"
              onClick={() => openModal(enterpriseProjects[0].id)}
              aria-label={`查看 ${enterpriseProjects[0].title} 详情`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="group grid w-full overflow-hidden rounded-2xl border border-zinc-800/70 bg-zinc-900/45 text-left md:grid-cols-[1.45fr_0.75fr] hover:border-blue-500/35 transition-colors"
            >
              <span className="relative min-h-[340px] md:min-h-[560px] overflow-hidden bg-zinc-900">
                {!imageLoaded[enterpriseProjects[0].id] && <span className="absolute inset-0 bg-zinc-900 animate-pulse" />}
                <Image
                  src={enterpriseProjects[0].image}
                  alt={enterpriseProjects[0].title}
                  fill
                  unoptimized
                  priority
                  sizes="(max-width: 768px) 100vw, 66vw"
                  className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                  onLoad={() => setImageLoaded(prev => ({ ...prev, [enterpriseProjects[0].id]: true }))}
                />
                <span className="absolute left-5 top-5 border border-white/15 bg-black/45 px-2.5 py-1 font-mono text-[10px] tracking-[0.18em] text-white/70 backdrop-blur-md">LEAD CASE</span>
              </span>
              <span className="flex min-h-[300px] md:min-h-[560px] flex-col p-6 md:p-9">
                <span className="flex items-center justify-between font-mono text-[10px] tracking-[0.16em] text-zinc-500">
                  <span>01 / {String(enterpriseProjects.length).padStart(2, "0")}</span>
                  <span>{enterpriseProjects[0].date}</span>
                </span>
                <span className="mt-auto block">
                  <span className="block text-2xl md:text-3xl font-semibold tracking-tight text-zinc-100 group-hover:text-blue-400 transition-colors">
                    {enterpriseProjects[0].title}
                  </span>
                  <span className="mt-4 block text-sm leading-7 text-zinc-400">{enterpriseProjects[0].description}</span>
                </span>
                <span className="mt-7 flex items-end justify-between gap-4 border-t border-zinc-800 pt-5">
                  <span className="flex flex-wrap gap-1.5">
                    {enterpriseProjects[0].tags?.map(tag => <span key={tag} className="border border-zinc-700/60 bg-zinc-800/50 px-2 py-1 font-mono text-[10px] text-zinc-500">{tag}</span>)}
                  </span>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-zinc-700 text-zinc-300 group-hover:border-blue-500/60 group-hover:text-blue-400 transition-colors">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </span>
              </span>
            </motion.button>

            <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
              {enterpriseProjects.slice(1).map((project, idx) => (
                <motion.button
                  type="button"
                  key={project.id}
                  onClick={() => openModal(project.id)}
                  aria-label={`查看 ${project.title} 详情`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="group overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-900/35 text-left hover:border-zinc-600/80 hover:bg-zinc-900/60 transition-colors"
                >
                  <span className="relative block aspect-[16/8.5] overflow-hidden bg-zinc-900">
                    {!imageLoaded[project.id] && <span className="absolute inset-0 bg-zinc-900 animate-pulse" />}
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                      onLoad={() => setImageLoaded(prev => ({ ...prev, [project.id]: true }))}
                    />
                    <span className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-black/35 text-white/80 opacity-0 backdrop-blur-md transition-all group-hover:opacity-100">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </span>
                  <span className="block p-5 md:p-6">
                    <span className="flex items-center justify-between gap-5">
                      <span className="text-base md:text-lg font-semibold text-zinc-100 group-hover:text-blue-400 transition-colors">{project.title}</span>
                      <span className="shrink-0 font-mono text-[10px] text-zinc-600">{project.date}</span>
                    </span>
                    <span className="mt-3 block text-[13px] leading-6 text-zinc-400">{project.description}</span>
                    <span className="mt-5 flex flex-wrap gap-1.5 border-t border-zinc-800/70 pt-4">
                      {project.tags?.map(tag => <span key={tag} className="border border-zinc-700/50 bg-zinc-800/35 px-2 py-0.5 font-mono text-[10px] text-zinc-500">{tag}</span>)}
                    </span>
                  </span>
                </motion.button>
              ))}
            </div>
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
          resources={getProjectResources(modalList[currentModalIndex].id)}
        />
      )}
      <Footer />
    </div>
  );
}
