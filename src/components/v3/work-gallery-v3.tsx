"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Check, Copy } from "lucide-react";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import UniversalModal from "@/components/ui/UniversalModal";
import { getProjectBySlug } from "@/data/projects";

type Category = "all" | "company" | "lab";

type IndexProject = {
  id: string;
  title: string;
  en: string;
  description: string;
  year: string;
  image: string;
  category: Exclude<Category, "all">;
  href?: string;
  dataSlug?: string;
};

const indexProjects: IndexProject[] = [
  {
    id: "snownewtab",
    title: "雪诺企业安全浏览器",
    en: "Snow Enterprise Browser",
    description: "替代繁重的 VDI 与 VPN 方案，从访问入口守护企业核心资产。",
    year: "2024—2026",
    image: "https://cdn.btbon.cn/snownewtab/AI-NEWTAB.webp",
    category: "company",
    dataSlug: "snownewtab",
  },
  {
    id: "all-in-one-v2",
    title: "AllinOne V2",
    en: "Figma Power Plugin",
    description: "瑞士国际风格设计，AI 组件说明书、多语言翻译与等轴形变。",
    year: "2025",
    image: "https://cdn.btbon.cn/images/ALO.webp",
    category: "lab",
    href: "/work/all-in-one-v2",
  },
  {
    id: "kwai-magnetic-star",
    title: "磁力聚星",
    en: "Kwai Creator Marketing",
    description: "达人营销平台全链路改版，老用户下单效率提升 22%。",
    year: "2024",
    image: "https://cdn.btbon.cn/Kwai-磁力聚星/them03-01.webp",
    category: "company",
    dataSlug: "kwai-magnetic-star",
  },
  {
    id: "snowspace",
    title: "雪诺安全工作空间",
    en: "SnowSpaces Admin",
    description: "企业安全办公管理系统与浏览器后台体验设计。",
    year: "2024—2026",
    image: "https://cdn.btbon.cn/snowspace/ssth3.webp",
    category: "company",
    dataSlug: "snowspace",
  },
  {
    id: "ai-translate",
    title: "AI Translate",
    en: "Browser Extension",
    description: "自定义 AI 模型的悬浮翻译插件，双语对照与划词翻译。",
    year: "2024",
    image: "https://cdn.btbon.cn/images/aitran.webp",
    category: "lab",
    href: "/work/ai-translate",
  },
  {
    id: "enterplorer",
    title: "Enterplorer 企业浏览器",
    en: "Zero-trust Browser",
    description: "以零信任为核心，桌面端与移动端无缝衔接的企业浏览器。",
    year: "2018—2020",
    image: "https://cdn.btbon.cn/YSP-Enterporer/them06-01.webp",
    category: "company",
    dataSlug: "enterplorer",
  },
  {
    id: "studio",
    title: "Enterplorer Studio",
    en: "Developer Tool",
    description: "网页移动端适配开发工具，降低适配门槛，提升开发效率。",
    year: "2018—2020",
    image: "https://cdn.btbon.cn/YSP-Studio/them04-01.webp",
    category: "company",
    dataSlug: "studio",
  },
  {
    id: "amazeui",
    title: "AmazeUI",
    en: "Open Design System",
    description: "独立建立的移动端适配设计系统，组件、样式与图标库。",
    year: "2018—2020",
    image: "https://cdn.btbon.cn/YSP-AmazeUI/them05-01.webp",
    category: "company",
    dataSlug: "amazeui",
  },
  {
    id: "avic",
    title: "商网办公系统",
    en: "AVIC Collaboration",
    description: "为国企定制的 IM 协同系统，视频会议、行程与活动统筹。",
    year: "2019",
    image: "https://cdn.btbon.cn/AVIC-商网/them07-01.webp",
    category: "company",
    dataSlug: "avic",
  },
  {
    id: "launchpad",
    title: "LaunchPad",
    en: "Native macOS Launcher",
    description: "为 macOS 找回熟悉的启动台，快捷键、手势与触发角唤起。",
    year: "2026",
    image: "/product-assets/launchpad-icon.png",
    category: "lab",
    href: "/work/launchpad",
  },
  {
    id: "aura",
    title: "Aura",
    en: "Private Photo Gallery",
    description: "本地优先的私密影像管理，标签整理、物理隔离与入口伪装。",
    year: "2026",
    image: "/product-assets/aura-logo.png",
    category: "lab",
    href: "/work/aura",
  },
  {
    id: "others",
    title: "其他作品",
    en: "Selected Experiments",
    description: "自驱型业务项目、个人外包与日常练习作品合集。",
    year: "2015—2025",
    image: "https://cdn.btbon.cn/Other/them09-01.webp",
    category: "lab",
    dataSlug: "others",
  },
];

const filters: { key: Category; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "company", label: "企业项目" },
  { key: "lab", label: "个人实验" },
];

function ModalParamHandler({ onOpen }: { onOpen: (slug: string) => void }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const slug = searchParams.get("project");
    if (slug && indexProjects.some((project) => project.dataSlug === slug)) {
      onOpen(slug);
    }
  }, [searchParams, onOpen]);

  return null;
}

export default function WorkGalleryV3() {
  const [category, setCategory] = useState<Category>("all");
  const [modalId, setModalId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    await navigator.clipboard.writeText("nc0032@qq.com");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const visibleProjects = useMemo(
    () =>
      category === "all"
        ? indexProjects
        : indexProjects.filter((project) => project.category === category),
    [category]
  );

  const modalIndex = indexProjects.findIndex(
    (project) => project.dataSlug === modalId
  );
  const modalProject = modalId ? getProjectBySlug(modalId) : null;

  const changeModal = (direction: -1 | 1) => {
    let next = modalIndex + direction;
    while (
      next >= 0 &&
      next < indexProjects.length &&
      !indexProjects[next].dataSlug
    ) {
      next += direction;
    }
    if (next >= 0 && next < indexProjects.length) {
      setModalId(indexProjects[next].dataSlug ?? null);
    }
  };

  return (
    <div className="v3-gallery">
      <Suspense fallback={null}>
        <ModalParamHandler onOpen={setModalId} />
      </Suspense>

      <header className="v3-gallery__hero">
        <div className="v3-shell">
          <Link href="/" className="v3-gallery__back">
            <ArrowLeft size={13} /> 返回首页
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            项目索引
            <span>{indexProjects.length} 个收录</span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="v3-gallery__filters"
            role="group"
            aria-label="项目筛选"
          >
            {filters.map((filter) => (
              <button
                type="button"
                key={filter.key}
                onClick={() => setCategory(filter.key)}
                aria-pressed={category === filter.key}
              >
                {filter.label}
                <sup>
                  {filter.key === "all"
                    ? indexProjects.length
                    : indexProjects.filter((item) => item.category === filter.key)
                        .length}
                </sup>
              </button>
            ))}
          </motion.div>
        </div>
      </header>

      <main className="v3-shell v3-gallery__main">
        <AnimatePresence mode="popLayout">
          {visibleProjects.map((project, index) => {
            const row = (
              <>
                <span className="v3-project__index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="v3-project__thumb">
                  <Image
                    src={project.image}
                    alt={`${project.title} 项目封面`}
                    fill
                    unoptimized
                    sizes="(max-width: 800px) 96px, 144px"
                  />
                </span>
                <span className="v3-project__body">
                  <span className="v3-project__title">
                    {project.title}
                    <em>{project.en}</em>
                  </span>
                  <span className="v3-project__desc">{project.description}</span>
                </span>
                <span className="v3-project__aside">
                  <time>{project.year}</time>
                  <ArrowUpRight size={15} aria-hidden="true" />
                </span>
              </>
            );

            return (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.4, delay: index * 0.02 }}
              >
                {project.href ? (
                  <Link href={project.href} className="v3-project">
                    {row}
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="v3-project"
                    onClick={() => setModalId(project.dataSlug ?? null)}
                  >
                    {row}
                  </button>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </main>

      <footer className="v3-gallery__footer">
        <div className="v3-shell">
          <p>看到合适的项目了？</p>
          <button
            type="button"
            onClick={copyEmail}
            className="v3-capsule"
            aria-live="polite"
          >
            {copied ? "已复制" : "邮箱 · nc0032@qq.com"}
            {copied ? <Check size={13} /> : <Copy size={13} />}
          </button>
        </div>
      </footer>

      {modalProject && (
        <UniversalModal
          isOpen
          onClose={() => setModalId(null)}
          title={modalProject.title}
          images={modalProject.behanceSlices ?? []}
          hasPrev={modalIndex > 0}
          hasNext={modalIndex < indexProjects.length - 1}
          onPrev={() => changeModal(-1)}
          onNext={() => changeModal(1)}
          projectId={modalId as string}
        />
      )}
    </div>
  );
}
