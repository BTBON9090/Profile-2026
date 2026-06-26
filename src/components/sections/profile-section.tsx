// src/components/sections/profile-section.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Layers, Terminal, FileText, MapPin, Briefcase, GraduationCap, Clock, ChevronRight, Award } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { getBrandIcon } from "@/components/ui/brand-icons";

export default function ProfileSection() {
  const { t } = useI18n();
  const [hoveredExp, setHoveredExp] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number; rowHeight: number }>({ top: 0, left: 0, rowHeight: 0 });
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
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

  const updateTooltipPos = (index: number) => {
    const row = rowRefs.current[index];
    if (!row) return;
    const rect = row.getBoundingClientRect();
    // 用视口坐标 + position:fixed，避免被祖先 section 的定位上下文影响
    setTooltipPos({
      top: rect.top,
      left: rect.left,
      rowHeight: rect.height,
    });
  };

  return (
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
            className="relative rounded-xl overflow-hidden bg-black"
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

            {/* 编号标签 */}
            <span className="absolute top-4 left-4 z-10 font-mono text-[10px] text-zinc-400 border border-white/10 rounded px-2 py-0.5 bg-black/40">01</span>

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
                <p className="text-sm text-zinc-300 mt-4 leading-relaxed drop-shadow">
                  {t.about.hero.subtitle}
                </p>

                {/* 中部 — 关键信息网格（icon 与正文垂直居中对齐） */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-6 md:mt-8">
                  <div className="flex items-center gap-2.5">
                    <Briefcase className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                      <div className="text-xs text-zinc-200 mt-0.5">{t.about.hero.role}</div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                      <div className="text-xs text-zinc-200 mt-0.5">{t.about.hero.experience}</div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                      <div className="text-xs text-zinc-200 mt-0.5">{t.about.hero.education}</div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                      <div className="text-xs text-zinc-200 mt-0.5">{t.about.hero.location}</div>
                  </div>
                </div>

                {/* 底部 — 学校 + 弱化的下载按钮 */}
                <div className="flex items-center justify-between mt-6 pt-5 border-t border-white/10">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-0.5">School</div>
                    <div className="text-xs text-zinc-300">{t.about.hero.school}</div>
                  </div>
                  {/* 弱化的下载简历按钮 — 从醒目的白色实心改为幽灵按钮 */}
                  <a
                    href="https://cdn.btbon.cn/UI设计-倪城-2026.pdf"
                    download="UI设计-倪城-2026.pdf"
                    className="group inline-flex items-center gap-1.5 px-3 py-1.5 border border-zinc-600 text-zinc-300 rounded-full hover:border-white/50 hover:text-white hover:bg-white/5 transition-all duration-300 text-[11px] font-mono tracking-wider"
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

        {/* 设计哲学陈述 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12 md:mb-16 max-w-4xl"
        >
          <h2 className="text-2xl md:text-4xl font-black text-zinc-100 tracking-tight leading-[1.2] mb-5">
            设计不止于交付<span className="text-blue-500">.</span>
            <br />
            <span className="text-zinc-600">是逻辑的可视化与落地的预演</span>
          </h2>
          <p className="text-sm md:text-base text-zinc-400 leading-relaxed max-w-2xl">
            在 AI 重塑生产力的 2026 年，单纯的"视觉交付"已不再是设计终点。
            我将<span className="text-blue-400">工程思维</span>前置到设计阶段——
            利用 Vibe Coding 构建可交互原型与提效工具，在开发介入前验证技术可行性，
            将设计稿到代码的<span className="text-blue-400">翻译损耗降至最低</span>。
          </p>
        </motion.div>

        {/* 技术栈与工具库 — Bento Grid 重设计 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          {/* 区块标题 — 移动端文字与图标阵列上下两行 */}
          <div className="flex flex-col gap-3 mb-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-blue-500">$</span>
              <span className="font-mono text-xs text-zinc-400 tracking-[0.15em] uppercase">{t.about.techStack}</span>
            </div>
            {/* 工具链 — 彩色徽标阵列，极简留白，hover 浮层显示名称 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="col-span-12 relative"
            >

              {/* 图标阵列 — 品牌色原生呈现，hover 浮层名称 */}
              <div className="relative flex flex-wrap gap-1.5">
                {t.about.techStackData.tools.items.map((item: string, i: number) => {
                  const Icon = getBrandIcon(item);
                  return (
                    <div
                      key={i}
                      className="group/tool relative inline-flex items-center justify-center p-2 rounded-lg border border-transparent hover:border-zinc-700/50 hover:bg-zinc-900/30 active:border-zinc-700/50 active:bg-zinc-900/30 transition-all duration-200 cursor-default select-none"
                      title={item}
                    >
                      <Icon className="w-4 h-4 transition-transform duration-200 group-hover/tool:scale-110 group-active/tool:scale-110 opacity-60 group-hover/tool:opacity-100 group-active/tool:opacity-100" title={item} />
                      {/* hover / 长按浮层名称 */}
                      <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover/tool:opacity-100 group-active/tool:opacity-100 pointer-events-none whitespace-nowrap px-2.5 py-1 rounded-md bg-zinc-950 border border-zinc-800 text-[10px] font-mono text-zinc-300 transition-opacity duration-200 z-20">
                        {item}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Bento Grid 容器 */}
          <div className="grid grid-cols-12 gap-3 md:gap-4">
            {/* 核心能力 1 — 设计系统架构 (大卡片，跨6列) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="col-span-12 md:col-span-6 row-span-2 relative border border-zinc-900/80 rounded-xl p-6 bg-gradient-to-br from-blue-500/[0.03] to-transparent hover:border-blue-500/30 transition-all duration-300 group overflow-hidden"
            >
              {/* 装饰光晕 */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full group-hover:bg-blue-500/10 transition-colors duration-500"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Layers className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="font-mono text-[10px] text-zinc-700">01</span>
                </div>
                <h3 className="text-base font-bold text-zinc-200 mb-2 leading-snug">
                  {t.about.capabilities.systemArchitect.title}
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                  {t.about.capabilities.systemArchitect.description}
                </p>
                {/* 核心能力标签 */}
                <div className="flex flex-wrap gap-1.5">
                  {t.about.techStackData.coreCompetency.items.map((item: string, i: number) => (
                    <span key={i} className="px-2 py-1 bg-blue-500/5 border border-blue-500/20 rounded text-[10px] font-mono text-blue-300/80">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* 核心能力 2 — Vibe Coding (大卡片，跨6列) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="col-span-12 md:col-span-6 row-span-2 relative border border-zinc-900/80 rounded-xl p-6 bg-gradient-to-br from-purple-500/[0.03] to-transparent hover:border-purple-500/30 transition-all duration-300 group overflow-hidden"
            >
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-purple-500/5 blur-3xl rounded-full group-hover:bg-purple-500/10 transition-colors duration-500"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Terminal className="w-5 h-5 text-purple-400" />
                  </div>
                  <span className="font-mono text-[10px] text-zinc-700">02</span>
                </div>
                <h3 className="text-base font-bold text-zinc-200 mb-2 leading-snug">
                  {t.about.capabilities.aiEngineer.title}
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                  {t.about.capabilities.aiEngineer.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {t.about.techStackData.techEmpoweredWorkflow.items.map((item: string, i: number) => (
                    <span key={i} className="px-2 py-1 bg-purple-500/5 border border-purple-500/20 rounded text-[10px] font-mono text-purple-300/80">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* 下半区 — 工作经历（紧凑表格） */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex-1 flex flex-col"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-blue-500">$</span>
              <span className="font-mono text-xs text-zinc-400 tracking-[0.15em] uppercase">{t.profile.experienceLabel}</span>
            </div>
            <span className="font-mono text-[10px] text-zinc-700">{t.about.experience.items.length} entries</span>
          </div>

          {/* 表头 */}
          <div className="hidden md:grid grid-cols-[130px_minmax(200px,1fr)_160px_1fr] gap-8 px-6 py-3 border-b border-zinc-800 font-mono text-[10px] text-zinc-600 uppercase tracking-widest">
            <span>Time</span>
            <span>Company</span>
            <span>Role</span>
            <span>Tags</span>
          </div>

          {/* 经历列表 */}
          <div className="flex-1">
            {t.about.experience.items.map((exp: any, index: number) => (
              <motion.div
                key={exp.id}
                ref={(el) => { rowRefs.current[index] = el; }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                onMouseEnter={() => { setHoveredExp(index); updateTooltipPos(index); }}
                onMouseLeave={() => setHoveredExp(null)}
                className="group grid grid-cols-1 md:grid-cols-[130px_minmax(200px,1fr)_160px_1fr] gap-6 md:gap-8 px-6 py-4 border-b border-zinc-900 hover:bg-white/[0.03] transition-colors cursor-default relative"
              >
                <span className="font-mono text-xs text-zinc-500 tracking-wider whitespace-nowrap flex items-center">{exp.time}</span>
                <div className="flex items-center gap-2">
                  {exp.logo && (
                    <img src={exp.logo} alt={exp.company} className="w-5 h-5 rounded object-cover flex-shrink-0" />
                  )}
                  <span className="text-sm text-zinc-200 font-medium group-hover:text-blue-400 transition-colors">
                    {exp.company}
                  </span>
                  {/* hover 提示图标 */}
                  <ChevronRight className={`w-3 h-3 text-zinc-600 transition-all duration-300 ${hoveredExp === index ? 'translate-x-0 opacity-100' : '-translate-x-1 opacity-0 group-hover:opacity-60 group-hover:translate-x-0'}`} />
                </div>
                <span className="text-xs text-zinc-400 flex items-center">{exp.role}</span>
                <div className="flex flex-wrap gap-1.5">
                  {exp.tech.slice(0, 4).map((tag: string, i: number) => (
                    <span key={i} className="h-auto flex px-2 py-1 bg-zinc-900/80 border border-zinc-800 rounded text-[10px] font-mono text-zinc-500 leading-normal">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 工作经历 Tooltip — 浮动定位，不受 overflow 影响 */}
      <AnimatePresence>
        {hoveredExp !== null && t.about.experience.items[hoveredExp] && (
          <WorkTooltip
            exp={t.about.experience.items[hoveredExp]}
            position={tooltipPos}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

// 工作经历 Tooltip 组件 — 只展示公司名称 + 做过的事，极简
function WorkTooltip({ exp, position }: { exp: any; position: { top: number; left: number; rowHeight: number } }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      style={{
        position: "fixed",
        top: `${position.top + position.rowHeight + 8}px`,
        left: `${position.left}px`,
        zIndex: 9999,
      }}
      className="w-[380px] max-w-[calc(100vw-32px)] pointer-events-none"
    >
      <div className="rounded-lg border border-zinc-800 bg-zinc-950/95 backdrop-blur-sm p-3 shadow-xl">
        <div className="text-xs font-semibold text-zinc-100 mb-1.5">{exp.company}</div>
        <ul className="space-y-1">
          {exp.description.map((desc: string, i: number) => (
            <li key={i} className="text-[11px] text-zinc-400 leading-relaxed flex gap-1.5">
              <span className="text-zinc-600 mt-0.5">·</span>
              <span>{desc}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
