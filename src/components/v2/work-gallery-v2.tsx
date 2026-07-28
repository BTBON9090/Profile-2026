"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowUpRight, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import UniversalModal from "@/components/ui/UniversalModal";
import { getProjectBySlug } from "@/data/projects";

type Category = "all" | "company" | "lab";

type GalleryProject = {
  id: string;
  title: string;
  en: string;
  year: string;
  image: string;
  category: Exclude<Category, "all">;
  type: string;
  href?: string;
  dataSlug?: string;
  featured?: boolean;
};

const galleryProjects: GalleryProject[] = [
  {
    id: "snownewtab",
    title: "雪诺企业安全浏览器",
    en: "Snow Enterprise Browser",
    year: "2024—26",
    image: "https://cdn.btbon.cn/snownewtab/AI-NEWTAB.webp",
    category: "company",
    type: "Product / Security",
    dataSlug: "snownewtab",
    featured: true,
  },
  {
    id: "all-in-one-v2",
    title: "AllinOne V2",
    en: "Figma Power Plugin",
    year: "2025",
    image: "https://cdn.btbon.cn/images/ALO.webp",
    category: "lab",
    type: "Solo product / AI",
    href: "/work/all-in-one-v2",
    featured: true,
  },
  {
    id: "kwai-magnetic-star",
    title: "磁力聚星",
    en: "Kwai Creator Marketing",
    year: "2024",
    image: "https://cdn.btbon.cn/Kwai-磁力聚星/them03-01.webp",
    category: "company",
    type: "Growth / Redesign",
    dataSlug: "kwai-magnetic-star",
  },
  {
    id: "snowspace",
    title: "雪诺安全工作空间",
    en: "SnowSpaces",
    year: "2024—26",
    image: "https://cdn.btbon.cn/snowspace/ssth3.webp",
    category: "company",
    type: "B-end / Admin",
    dataSlug: "snowspace",
  },
  {
    id: "ai-translate",
    title: "AI Translate",
    en: "Browser Extension",
    year: "2024",
    image: "https://cdn.btbon.cn/images/aitran.webp",
    category: "lab",
    type: "Solo product / AI",
    href: "/work/ai-translate",
  },
  {
    id: "enterplorer",
    title: "Enterplorer 企业浏览器",
    en: "Zero-trust Browser",
    year: "2018—20",
    image: "https://cdn.btbon.cn/YSP-Enterporer/them06-01.webp",
    category: "company",
    type: "Product / Cross-platform",
    dataSlug: "enterplorer",
  },
  {
    id: "studio",
    title: "Enterplorer Studio",
    en: "Developer Tool",
    year: "2018—20",
    image: "https://cdn.btbon.cn/YSP-Studio/them04-01.webp",
    category: "company",
    type: "Developer experience",
    dataSlug: "studio",
  },
  {
    id: "amazeui",
    title: "AmazeUI",
    en: "Open Design System",
    year: "2018—20",
    image: "https://cdn.btbon.cn/YSP-AmazeUI/them05-01.webp",
    category: "company",
    type: "Design system / Open source",
    dataSlug: "amazeui",
  },
  {
    id: "avic",
    title: "商网办公系统",
    en: "AVIC Collaboration",
    year: "2019",
    image: "https://cdn.btbon.cn/AVIC-商网/them07-01.webp",
    category: "company",
    type: "Collaboration / IM",
    dataSlug: "avic",
  },
  {
    id: "launchpad",
    title: "LaunchPad",
    en: "Native macOS Launcher",
    year: "2026",
    image: "/product-assets/launchpad-icon.png",
    category: "lab",
    type: "macOS / SwiftUI",
    href: "/work/launchpad",
  },
  {
    id: "aura",
    title: "Aura",
    en: "Private Photo Gallery",
    year: "2026",
    image: "/product-assets/aura-logo.png",
    category: "lab",
    type: "Android / Privacy",
    href: "/work/aura",
  },
  {
    id: "others",
    title: "其他作品",
    en: "Selected Experiments",
    year: "2015—25",
    image: "https://cdn.btbon.cn/Other/them09-01.webp",
    category: "lab",
    type: "Archive / Experiments",
    dataSlug: "others",
  },
];

const filters: { key: Category; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "company", label: "企业项目" },
  { key: "lab", label: "个人实验" },
];

export default function WorkGalleryV2() {
  const [category, setCategory] = useState<Category>("all");
  const [modalId, setModalId] = useState<string | null>(null);

  const visibleProjects = useMemo(
    () =>
      category === "all"
        ? galleryProjects
        : galleryProjects.filter((project) => project.category === category),
    [category]
  );

  const modalIndex = galleryProjects.findIndex(
    (project) => project.dataSlug === modalId
  );
  const modalProject = modalId ? getProjectBySlug(modalId) : null;

  const changeModal = (direction: -1 | 1) => {
    let next = modalIndex + direction;
    while (
      next >= 0 &&
      next < galleryProjects.length &&
      !galleryProjects[next].dataSlug
    ) {
      next += direction;
    }
    if (next >= 0 && next < galleryProjects.length) {
      setModalId(galleryProjects[next].dataSlug ?? null);
    }
  };

  return (
    <div className="v2-gallery">
      <header className="v2-gallery__hero">
        <div className="v2-shell">
          <Link href="/" className="v2-gallery__back">
            <ArrowLeft size={15} /> 返回首页
          </Link>
          <div className="v2-gallery__title-row">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            >
              项目索引
              <span>Archive</span>
            </motion.h1>
            <p>
              这里收录企业产品、增长项目与个人实验。
              <br />
              按你关心的方向筛选，或从头开始慢慢看。
            </p>
          </div>
          <div className="v2-gallery__controls" role="group" aria-label="项目筛选">
            <span><SlidersHorizontal size={14} /> Filter</span>
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
                    ? galleryProjects.length
                    : galleryProjects.filter((item) => item.category === filter.key)
                        .length}
                </sup>
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="v2-shell v2-gallery__main">
        <AnimatePresence mode="popLayout">
          {visibleProjects.map((project, index) => {
            const content = (
              <>
                <div className="v2-gallery-card__image">
                  <Image
                    src={project.image}
                    alt={`${project.title} 项目封面`}
                    fill
                    unoptimized
                    sizes="(max-width: 760px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <span><ArrowUpRight size={16} /></span>
                </div>
                <div className="v2-gallery-card__info">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <small>{project.en}</small>
                    <h2>{project.title}</h2>
                  </div>
                  <div>
                    <small>{project.type}</small>
                    <time>{project.year}</time>
                  </div>
                </div>
              </>
            );

            return (
              <motion.article
                layout
                key={project.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.45, delay: index * 0.025 }}
                className={project.featured ? "is-featured" : ""}
              >
                {project.href ? (
                  <Link href={project.href}>{content}</Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => setModalId(project.dataSlug ?? null)}
                  >
                    {content}
                  </button>
                )}
              </motion.article>
            );
          })}
        </AnimatePresence>
      </main>

      <footer className="v2-gallery__footer">
        <div className="v2-shell">
          <p>看到合适的项目了？</p>
          <a href="mailto:nc0032@qq.com">
            说说你正在做什么 <ArrowUpRight size={18} />
          </a>
        </div>
      </footer>

      {modalProject && (
        <UniversalModal
          isOpen
          onClose={() => setModalId(null)}
          title={modalProject.title}
          images={modalProject.behanceSlices ?? []}
          hasPrev={modalIndex > 0}
          hasNext={modalIndex < galleryProjects.length - 1}
          onPrev={() => changeModal(-1)}
          onNext={() => changeModal(1)}
          projectId={modalId as string}
        />
      )}
    </div>
  );
}
