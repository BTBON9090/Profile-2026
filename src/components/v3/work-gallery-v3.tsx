"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Check, Copy } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import UniversalModal from "@/components/ui/UniversalModal";
import { getProjectBySlug } from "@/data/projects";
import { getProjectResources } from "@/data/project-resources";

type IndexProject = {
  id: string;
  title: string;
  en: string;
  description: string;
  year: string;
  image: string;
  dataSlug: string;
};

type ProjectGroup = {
  id: string;
  index: string;
  title: string;
  en: string;
  description: string;
  projects: IndexProject[];
};

const projectGroups: ProjectGroup[] = [
  {
    id: "secure-workspace",
    index: "01",
    title: "安全工作入口",
    en: "Secure workspace",
    description: "从浏览器入口到管理后台，把复杂安全策略转化为可理解、可执行的办公体验。",
    projects: [
      {
        id: "snownewtab",
        title: "雪诺企业安全浏览器",
        en: "Snow Enterprise Browser",
        description: "替代繁重的 VDI 与 VPN 方案，从访问入口守护企业核心资产。",
        year: "2024—2026",
        image: "https://cdn.btbon.cn/snownewtab/AI-NEWTAB.webp",
        dataSlug: "snownewtab",
      },
      {
        id: "snowspace",
        title: "雪诺安全工作空间",
        en: "SnowSpaces Admin",
        description: "企业安全办公管理系统与浏览器后台体验设计。",
        year: "2024—2026",
        image: "https://cdn.btbon.cn/snowspace/ssth3.webp",
        dataSlug: "snowspace",
      },
    ],
  },
  {
    id: "growth-collaboration",
    index: "02",
    title: "增长与协同",
    en: "Growth & collaboration",
    description: "在营销转化与多人办公场景中，重排关键路径并建立稳定的信息秩序。",
    projects: [
      {
        id: "kwai-magnetic-star",
        title: "磁力聚星",
        en: "Kwai Creator Marketing",
        description: "达人营销平台全链路改版，老用户下单效率提升 22%。",
        year: "2024",
        image: "https://cdn.btbon.cn/Kwai-磁力聚星/them03-01.webp",
        dataSlug: "kwai-magnetic-star",
      },
      {
        id: "avic",
        title: "商网办公系统",
        en: "AVIC Collaboration",
        description: "为国企定制的 IM 协同系统，覆盖视频会议、行程与活动统筹。",
        year: "2019",
        image: "https://cdn.btbon.cn/AVIC-商网/them07-01.webp",
        dataSlug: "avic",
      },
    ],
  },
  {
    id: "browser-foundation",
    index: "03",
    title: "企业浏览器基础设施",
    en: "Browser foundation",
    description: "围绕企业浏览器构建开发工具与设计系统，让跨端适配成为可复用的产品能力。",
    projects: [
      {
        id: "enterplorer",
        title: "Enterplorer 企业浏览器",
        en: "Zero-trust Browser",
        description: "以零信任为核心，实现桌面端与移动端无缝衔接。",
        year: "2018—2020",
        image: "https://cdn.btbon.cn/YSP-Enterporer/them06-01.webp",
        dataSlug: "enterplorer",
      },
      {
        id: "studio",
        title: "Enterplorer Studio",
        en: "Developer Tool",
        description: "网页移动端适配开发工具，降低适配门槛并提升开发效率。",
        year: "2018—2020",
        image: "https://cdn.btbon.cn/YSP-Studio/them04-01.webp",
        dataSlug: "studio",
      },
      {
        id: "amazeui",
        title: "AmazeUI",
        en: "Open Design System",
        description: "独立建立的移动端适配设计系统，覆盖组件、样式与图标库。",
        year: "2018—2020",
        image: "https://cdn.btbon.cn/YSP-AmazeUI/them05-01.webp",
        dataSlug: "amazeui",
      },
    ],
  },
];

const indexProjects = projectGroups.flatMap((group) => group.projects);

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
  const [modalId, setModalId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    await navigator.clipboard.writeText("nc0032@qq.com");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const modalIndex = indexProjects.findIndex((project) => project.dataSlug === modalId);
  const modalProject = modalId ? getProjectBySlug(modalId) : null;

  const changeModal = (direction: -1 | 1) => {
    const next = modalIndex + direction;
    if (next >= 0 && next < indexProjects.length) {
      setModalId(indexProjects[next].dataSlug);
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
          <div className="v3-gallery__hero-grid">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              企业项目
              <span>{indexProjects.length} 个案例 · {projectGroups.length} 组产品体系</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              不再把项目当作彼此孤立的封面，而是按真实业务系统归档：安全工作入口、增长协同与企业浏览器基础设施。
            </motion.p>
          </div>
        </div>
      </header>

      <main className="v3-shell v3-gallery__main v3-gallery__grouped">
        {projectGroups.map((group, groupIndex) => (
          <motion.section
            key={group.id}
            className="v3-gallery__group"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: groupIndex * 0.08 }}
          >
            <header className="v3-gallery__group-head">
              <span>{group.index}</span>
              <div>
                <h2>{group.title}<em>{group.en}</em></h2>
                <p>{group.description}</p>
              </div>
              <small>{group.projects.length} cases</small>
            </header>

            <div className="v3-gallery__group-list">
              {group.projects.map((project) => {
                const projectIndex = indexProjects.findIndex((item) => item.id === project.id);
                return (
                  <div className="v3-gallery__project-entry" key={project.id}>
                    <button
                      type="button"
                      className="v3-project"
                      onClick={() => setModalId(project.dataSlug)}
                    >
                      <span className="v3-project__index">{String(projectIndex + 1).padStart(2, "0")}</span>
                      <span className="v3-project__thumb">
                        <Image
                          src={project.image}
                          alt={`${project.title} 项目封面`}
                          fill
                          unoptimized
                          loading={projectIndex === 0 ? "eager" : "lazy"}
                          sizes="(max-width: 800px) 96px, 144px"
                        />
                      </span>
                      <span className="v3-project__body">
                        <span className="v3-project__title">{project.title}<em>{project.en}</em></span>
                        <span className="v3-project__desc">{project.description}</span>
                      </span>
                      <span className="v3-project__aside">
                        <time>{project.year}</time>
                        <ArrowUpRight size={15} aria-hidden="true" />
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.section>
        ))}
      </main>

      <footer className="v3-gallery__footer">
        <div className="v3-shell">
          <p>想进一步了解这些企业项目？</p>
          <button type="button" onClick={copyEmail} className="v3-capsule" aria-live="polite">
            {copied ? "已复制" : "邮箱 · nc0032@qq.com"}
            {copied ? <Check size={13} /> : <Copy size={13} />}
          </button>
        </div>
      </footer>

      {modalProject && (
        <UniversalModal
          isOpen
          onClose={() => setModalId(null)}
          title={modalProject.title || indexProjects[modalIndex]?.title || "项目"}
          images={modalProject.behanceSlices ?? []}
          hasPrev={modalIndex > 0}
          hasNext={modalIndex < indexProjects.length - 1}
          onPrev={() => changeModal(-1)}
          onNext={() => changeModal(1)}
          projectId={modalId as string}
          nextTitle={indexProjects[modalIndex + 1]?.title}
          isCompanyProject
          resources={getProjectResources(modalId)}
        />
      )}
    </div>
  );
}
