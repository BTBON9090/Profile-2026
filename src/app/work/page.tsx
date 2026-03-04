// src/app/work/page.tsx
"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

// 1. 结构化你的作品数据 (方便以后随时增删改)
const projects = [
  {
    sectionId: "company",
    category: "Company Projects",
    items:[
      {
        id: "snow-ecosystem",
        title: "SnowTech Ecosystem",
        subtitle: "B-End System & Browser",
        description: "主导雪诺企业零信任安全生态，包含管理后台长表单重构与 AI 浏览器跨端体验设计。",
        date: "2024 - 2026",
        image: "/images/snow-admin.png", // 替换为你的封面图
        link: "/#snow-ecosystem", // 点击后跳转到首页的对应锚点
      },
      {
        id: "snow-ecosystem",
        title: "SnowTech Ecosystem",
        subtitle: "B-End System & Browser",
        description: "主导雪诺企业零信任安全生态，包含管理后台长表单重构与 AI 浏览器跨端体验设计。",
        date: "2024 - 2026",
        image: "/images/snow-admin.png", // 替换为你的封面图
        link: "/#snow-ecosystem", // 点击后跳转到首页的对应锚点
      },
      {
        id: "snow-ecosystem",
        title: "SnowTech Ecosystem",
        subtitle: "B-End System & Browser",
        description: "主导雪诺企业零信任安全生态，包含管理后台长表单重构与 AI 浏览器跨端体验设计。",
        date: "2024 - 2026",
        image: "/images/snow-admin.png", // 替换为你的封面图
        link: "/#snow-ecosystem", // 点击后跳转到首页的对应锚点
      },
      {
        id: "snow-ecosystem",
        title: "SnowTech Ecosystem",
        subtitle: "B-End System & Browser",
        description: "主导雪诺企业零信任安全生态，包含管理后台长表单重构与 AI 浏览器跨端体验设计。",
        date: "2024 - 2026",
        image: "/images/snow-admin.png", // 替换为你的封面图
        link: "/#snow-ecosystem", // 点击后跳转到首页的对应锚点
      },
      {
        id: "snow-ecosystem",
        title: "SnowTech Ecosystem",
        subtitle: "B-End System & Browser",
        description: "主导雪诺企业零信任安全生态，包含管理后台长表单重构与 AI 浏览器跨端体验设计。",
        date: "2024 - 2026",
        image: "/images/snow-admin.png", // 替换为你的封面图
        link: "/#snow-ecosystem", // 点击后跳转到首页的对应锚点
      },
      {
        id: "snow-ecosystem",
        title: "SnowTech Ecosystem",
        subtitle: "B-End System & Browser",
        description: "主导雪诺企业零信任安全生态，包含管理后台长表单重构与 AI 浏览器跨端体验设计。",
        date: "2024 - 2026",
        image: "/images/snow-admin.png", // 替换为你的封面图
        link: "/#snow-ecosystem", // 点击后跳转到首页的对应锚点
      },
    ]
  },
  {
    sectionId: "personal",
    category: "Personal Projects",
    items:[
      {
        id: "all-in-one",
        title: "AllinOne Plugin",
        subtitle: "Figma Productivity Tool",
        description: "100% 由 AI 辅助生成的 Figma 提效插件，集成 20+ 功能，累计服务 180+ 真实设计师。",
        date: "2025",
        image: "/images/plugin-ui.png",
        link: "/#all-in-one",
      },
      {
        id: "ai-translate",
        title: "AI Translate",
        subtitle: "Browser Extension",
        description: "支持 BYOK 模型配置的极简悬浮翻译插件，提供沉浸式双语对照与划词翻译体验。",
        date: "2026",
        image: "/images/ai-translate.png",
        link: "/#ai-translate",
      },
      {
        id: "all-in-one",
        title: "AllinOne Plugin",
        subtitle: "Figma Productivity Tool",
        description: "100% 由 AI 辅助生成的 Figma 提效插件，集成 20+ 功能，累计服务 180+ 真实设计师。",
        date: "2025",
        image: "/images/plugin-ui.png",
        link: "/#all-in-one",
      },
      {
        id: "ai-translate",
        title: "AI Translate",
        subtitle: "Browser Extension",
        description: "支持 BYOK 模型配置的极简悬浮翻译插件，提供沉浸式双语对照与划词翻译体验。",
        date: "2026",
        image: "/images/ai-translate.png",
        link: "/#ai-translate",
      },
    ]
  },
  {
    sectionId: "others",
    category: "Others & Infrastructure",
    items:[
      {
        id: "design-system",
        title: "Snow Design System",
        subtitle: "UI Components & Tokens",
        description: "建立并维护桌面端与 Web 端两套独立组件库，保障全域产品视觉基因统一。",
        date: "Ongoing",
        image: "/images/snow-system.png",
        link: "/#snow-ecosystem", // 也可以指向关于组件库的锚点
      },
      {
        id: "design-system",
        title: "Snow Design System",
        subtitle: "UI Components & Tokens",
        description: "建立并维护桌面端与 Web 端两套独立组件库，保障全域产品视觉基因统一。",
        date: "Ongoing",
        image: "/images/snow-system.png",
        link: "/#snow-ecosystem", // 也可以指向关于组件库的锚点
      },
      {
        id: "design-system",
        title: "Snow Design System",
        subtitle: "UI Components & Tokens",
        description: "建立并维护桌面端与 Web 端两套独立组件库，保障全域产品视觉基因统一。",
        date: "Ongoing",
        image: "/images/snow-system.png",
        link: "/#snow-ecosystem", // 也可以指向关于组件库的锚点
      },
      // 未来你可以继续在这里添加 Logo 设计、宣传册等
    ]
  }
];

export default function WorkGallery() {
  return (
    <div className="bg-black min-h-screen pt-32 pb-24 px-4 md:px-8 selection:bg-blue-500/30 selection:text-blue-200">
      <div className="max-w-7xl mx-auto">
        
        {/* 页面头部 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-20"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6">
            All <span className="text-zinc-600">Work.</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl font-light">
            A comprehensive gallery of my professional and independent endeavors. 
            From enterprise architecture to AI-empowered tools.
          </p>
        </motion.div>

        {/* 循环渲染分类与卡片 */}
        <div className="space-y-32">
          {projects.map((section, sectionIdx) => (
            // 2. 将 sectionId 绑定到外层 div，并加上 scroll-mt-32 留出顶部距离
            <div key={sectionIdx} id={section.sectionId} className="scroll-mt-32">
              {/* 分类标题 */}
              <div className="flex items-center gap-4 mb-10 border-b border-zinc-800 pb-4">
                <span className="text-4xl font-mono font-bold text-blue-500 tracking-widest uppercase">0{sectionIdx + 1}</span>
                <h2 className="text-2xl font-semibold text-white">{section.category}</h2>
              </div>

              {/* 网格卡片区 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {section.items.map((project, idx) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                  >
                    <Link href={project.link} className="block group">
                      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-600 transition-colors duration-300">
                        
                        {/* 1. 封面图区域 (支持 Hover 放大) */}
                        <div className="relative h-64 w-full bg-zinc-950 overflow-hidden">
                          <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            className="object-cover object-top opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                          />
                          {/* Hover 时右上角出现的箭头指示 */}
                          <div className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                            <ArrowUpRight className="w-5 h-5 text-white" />
                          </div>
                        </div>

                        {/* 2. 信息区域 */}
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                                {project.title}
                              </h3>
                              <p className="text-xs font-mono text-zinc-500 mt-1">
                                {project.subtitle}
                              </p>
                            </div>
                            <span className="text-xs font-mono text-zinc-600 bg-zinc-900 px-2 py-1 rounded">
                              {project.date}
                            </span>
                          </div>
                          <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3">
                            {project.description}
                          </p>
                        </div>

                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}