// src/components/sections/profile-section.tsx
"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, FileText, MapPin, Briefcase, GraduationCap, Clock, ChevronRight, PanelsTopLeft, SquareCode } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import "./profile-section.css";
import WorkflowCanvas from "./workflow-canvas";

export default function ProfileSection() {
  const { t, locale } = useI18n();
  const [selectedExp, setSelectedExp] = useState(7);
  const isZh = locale === "zh";
  const experiences = t.about.experience.items.filter((exp) => exp.id !== 4);
  const selected = experiences.find((exp) => exp.id === selectedExp) ?? experiences[0];
  // 响应式：跟踪当前是否桌面端（≥768px），用于切换照片参数
  const [isDesktop, setIsDesktop] = useState(false);

  // ─────────────────────────────────────────────────────────────
  // 个人信息卡照片 — 像素级精调参数
  // 改这里即可，无需翻到 JSX 里找。所有数值同步作用于 <img> 的内联 style。
  //
  // 照片始终左边缘对齐：transform-origin 固定为 left center，
  // 缩放只改变右边缘和上下边缘，左边缘永不位移。
  //
  // ① scale：缩放倍数（1 = 原始尺寸，>1 放大显示更多细节）
  //    缩放原点在左边缘，所以放大→向右/上下扩展，左边始终贴边
  // ② objectPosition：照片在容器内的对齐点，格式 "水平% 垂直%"
  //    水平建议保持 0%（左对齐）；垂直 0%=最上 … 100%=最下
  // ③ translateY：像素级上下平移（px），正值下移，负值上移
  //    （水平方向由左对齐+缩放控制，无需 translateX）
  // ④ textWidth：桌面端文字区占卡片宽度的比例（移动端默认全宽）
  // ⑤ cardMinH：卡片最小高度（px）
  // ⑥ mobilePhotoH：移动端照片区高度占比（文字在下方）
  // ─────────────────────────────────────────────────────────────
  const PHOTO = {
    // 移动端（< 768px）— 照片占上半，文字在下方
    mobile: {
      scale: 1.05,              // ← 调我：移动端缩放
      objectPosition: "0% 15%", // ← 调我：水平% 垂直%（水平保持0%=左对齐）
      translateY: 0,            // ← 调我：上下平移 px（正=下 负=上）
    },
    // 桌面端（≥ 768px）— 照片铺满，文字叠加左侧靠下
    desktop: {
      scale: 1.4,               // ← 调我：桌面端缩放（从左边缘放大）
      objectPosition: "0% 65%", // ← 调我：水平% 垂直%（水平保持0%=左对齐）
      translateY: 0,            // ← 调我：上下平移 px（正=下 负=上）
    },
    textWidth: "50%",           // ← 调我：桌面端文字区宽度占比
    cardMinH: { mobile: 480, desktop: 400 }, // ← 调我：卡片高度
    mobilePhotoH: "50%",        // ← 调我：移动端照片区高度占比
  };

  // 根据视口宽度切换移动端/桌面端参数
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const photoCfg = isDesktop ? PHOTO.desktop : PHOTO.mobile;

  return (
    <>
    <section
      id="profile"
      className="min-h-screen w-full bg-zinc-950/70 backdrop-blur-lg relative z-10 flex flex-col"
    >

      <div className="flex-1 flex flex-col max-w-[1400px] mx-auto w-full px-6 md:px-12 py-24 md:py-28 relative z-10">
        {/* 章节标题 */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-12 md:mb-16"
        >
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-blue-500 tracking-widest">{t.profile.number}</span>
            <span className="h-px w-12 bg-zinc-800"></span>
            <span className="font-mono text-xs text-zinc-500 tracking-[0.2em] uppercase">{t.profile.label}</span>
          </div>
          <span className="font-mono text-[10px] text-zinc-700 tracking-widest hidden md:block">NICHENG / 2026</span>
        </motion.div>

        {/* 个人信息卡 — 全宽横幅式，照片+信息并排 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 md:mb-14"
        >
          <div
            className="profile-hero relative rounded-3xl overflow-hidden bg-black"
            style={{ minHeight: PHOTO.cardMinH[isDesktop ? "desktop" : "mobile"] }}
          >

            {/* 照片层 — 始终左边缘对齐 */}
            {/* 桌面端：照片铺满整张卡片作为背景 */}
            {/* 移动端：照片占上半部分，文字在下方 */}
            <div
              className="absolute left-0 right-0 top-0 md:bottom-0 overflow-hidden"
              style={isDesktop ? { bottom: 0 } : { height: PHOTO.mobilePhotoH }}
            >
              <img
                src="https://cdn.btbon.cn/images/head5.webp"
                alt="倪城 NI CHENG"
                className="w-full h-full object-cover"
                style={{
                  objectPosition: photoCfg.objectPosition,
                  transform: `translateY(${photoCfg.translateY}px) scale(${photoCfg.scale})`,
                  // 左边缘对齐：缩放原点固定在左中心
                  // 放大时只向右/上下扩展，左边缘永远贴边
                  transformOrigin: "left center",
                }}
              />
              {/* 桌面端：右→左渐变变黑，右侧可见人物，左侧变黑承载文字 */}
              <div className="absolute inset-0 bg-gradient-to-l from-black/10 via-zinc-950/70 to-zinc-950 md:via-zinc-950/60 md:to-zinc-950 hidden md:block"></div>
              {/* 移动端：上→下渐变变深，顶部可见人物，底部变深承载下方文字 */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/40 to-zinc-950 md:hidden"></div>
            </div>

            {/* 文字层
                桌面端：叠加在照片上，靠下排布（justify-end），左侧对齐
                移动端：放在照片下方，独立文字区 */}
            <div
              className="relative z-10 flex flex-col justify-end p-6 md:p-10"
              style={{
                minHeight: isDesktop
                  ? PHOTO.cardMinH.desktop
                  : PHOTO.cardMinH.mobile,
                paddingTop: isDesktop ? undefined : PHOTO.mobilePhotoH,
              }}
            >
              <div className="w-full" style={{ maxWidth: isDesktop ? PHOTO.textWidth : "100%" }}>
                {/* 顶部 — 姓名+头衔 */}
                <div>
                  <h3 className="text-3xl md:text-5xl font-black text-zinc-100 tracking-tight leading-none drop-shadow-lg">
                    {t.about.hero.title}
                  </h3>
                  <div className="flex items-baseline gap-3 mt-2">
                    <span className="text-xl md:text-2xl font-normal text-zinc-300">倪城</span>
                    <span className="text-xs text-zinc-400 font-mono">/ UI · UX Designer</span>
                  </div>
                </div>
                <p className="text-sm text-zinc-300 mt-12 md:mt-4 leading-relaxed drop-shadow">
                  {t.about.hero.subtitle}
                </p>

                {/* 中部 — 关键信息网格（icon 与正文垂直居中对齐） */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-12 md:mt-8">
                  <div className="flex items-center gap-2.5">
                    <Briefcase className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                      <div className="text-xs text-zinc-400 mt-0.5">{t.about.hero.role}</div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                      <div className="text-xs text-zinc-400 mt-0.5">{t.about.hero.experience}</div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                      <div className="text-xs text-zinc-400 mt-0.5">{t.about.hero.education}</div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                      <div className="text-xs text-zinc-400 mt-0.5">{t.about.hero.location}</div>
                  </div>
                </div>

                {/* 底部 — 学校 + 弱化的下载按钮 */}
                <div className="flex items-center justify-between mt-6 pt-5 border-t border-white/10">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-0.5">School</div>
                    <div className="text-xs text-zinc-400">{t.about.hero.school}</div>
                  </div>
                  {/* 弱化的下载简历按钮 — 从醒目的白色实心改为幽灵按钮 */}
                  <a
                    href="https://cdn.btbon.cn/UI设计-倪城-2026.pdf"
                    download="UI设计-倪城-2026.pdf"
                    className="group inline-flex items-center gap-1.5 px-3 py-1.5 border border-white/10 text-zinc-300 rounded-md hover:border-white/50 hover:text-white hover:bg-white/5 transition-all duration-300 text-[11px] font-mono tracking-wider"
                  >
                    <FileText className="w-3 h-3" />
                    <span className="uppercase">{t.profile.downloadResume}</span>
                    <Download className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-20 md:mb-24">
          <div className="mb-7 max-w-3xl">
            <h2 className="text-xl md:text-2xl font-bold text-zinc-100 mb-3">{isZh ? "我的工作方式" : "How I work"}</h2>
            <p className="text-sm md:text-base text-zinc-400 leading-relaxed">{isZh ? "从需求文档出发，结合设计 Skill 与 AI 探索方案，完成界面、交互、前端实现和交付。" : "Starting with a PRD, I use AI and my design skills to explore, implement, review and deliver interfaces."}</p>
          </div>
          <WorkflowCanvas isZh={isZh} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-20 md:mb-24">
          <h2 className="text-xl md:text-2xl font-bold text-zinc-100 mb-3">{isZh ? "工具" : "Tools"}</h2>
          <div className="profile-tools">
            {[
              { title: "Design System", variant: "design", icon: PanelsTopLeft, description: isZh ? "擅长用 Figma 构建设计组件库，统一设计语言。" : "Building design component libraries in Figma to unify the design language.", tools: ["Figma", "Sketch", "Photoshop", "Illustrator"] },
              { title: "Vibe Coding", variant: "coding", icon: SquareCode, description: isZh ? "借助先进模型探索多版设计方案，并实现前端功能。" : "Using advanced models to explore design alternatives and implement frontend features.", tools: ["DeepSeek harness", "Zcode", "Gemini", "Codex", "Trae", "Qoder"] },
            ].map((group) => (
              <div key={group.title} className={`profile-tools__group profile-tools__group--${group.variant}`}>
                <group.icon className="profile-tools__icon" aria-hidden="true" />
                <h3>{group.title}</h3>
                <p>{group.description}</p>
                <div className="profile-tools__list">{group.tools.map((tool) => <span key={tool}>{tool}</span>)}</div>
              </div>
            )).reduce<React.ReactNode[]>((nodes, group, index) => {
              if (index) nodes.push(<div className="profile-tools__connection" aria-hidden="true" key="connection"><span></span><span></span></div>);
              nodes.push(group);
              return nodes;
            }, [])}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex-1">
          <h2 className="text-xl md:text-2xl font-bold text-zinc-100 mb-6">{t.profile.experienceLabel}</h2>
          <div className="profile-experience">
            <div className="profile-experience__list" aria-label={isZh ? "选择工作经历" : "Select work experience"}>
              {experiences.map((exp) => (
                <button key={exp.id} type="button" onMouseEnter={() => setSelectedExp(exp.id)} onFocus={() => setSelectedExp(exp.id)} onClick={() => setSelectedExp(exp.id)} aria-pressed={selected.id === exp.id} className={selected.id === exp.id ? "is-selected" : ""}>
                  <span className="profile-experience__time">{exp.time}</span>
                  <span className="profile-experience__company">{exp.logo && <img src={exp.logo} alt="" className="profile-experience__list-logo" />}<span>{exp.company}</span></span>
                  <ChevronRight size={16} aria-hidden="true" className="profile-experience__chevron" />
                </button>
              ))}
            </div>
            <div className="profile-experience__detail" aria-live="polite">
              <div className="profile-experience__detail-heading"><div><span className="profile-experience__time">{selected.time}</span><h3>{selected.company}</h3><p>{selected.role}</p></div>{selected.logo && <img src={selected.logo} alt="" className="profile-experience__logo" />}</div>
              <div className="profile-experience__tags">{selected.tech.map((tag) => <span key={tag}>{tag}</span>)}</div>
              {selected.description.length > 0 ? <ul>{selected.description.map((desc) => <li key={desc}>{desc}</li>)}</ul> : selected.id === 7 ? <p className="profile-experience__summary">{isZh ? "围绕 AI 招聘 Agent 与灵活用工场景开展用户体验设计，结合 AI 和 Vibe Coding 探索、实现并迭代界面方案。" : "Designing user experiences for AI recruiting agents and flexible staffing, using AI and Vibe Coding to explore, implement and iterate on interfaces."}</p> : null}
              {({ 1: "https://cdn.btbon.cn/snowspace/ssth3.webp", 2: "https://cdn.btbon.cn/Kwai-磁力聚星/Project03-01.webp", 3: "https://cdn.btbon.cn/AVIC-商网/Project07-01.webp", 5: "https://cdn.btbon.cn/YSP-AmazeUI/Project05-01.webp" } as Record<number, string>)[selected.id] && <img className="profile-experience__image" src={({ 1: "https://cdn.btbon.cn/snowspace/ssth3.webp", 2: "https://cdn.btbon.cn/Kwai-磁力聚星/Project03-01.webp", 3: "https://cdn.btbon.cn/AVIC-商网/Project07-01.webp", 5: "https://cdn.btbon.cn/YSP-AmazeUI/Project05-01.webp" } as Record<number, string>)[selected.id]} alt={isZh ? `${selected.company} 项目展示` : `${selected.company} project`} />}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
    </>
  );
}
