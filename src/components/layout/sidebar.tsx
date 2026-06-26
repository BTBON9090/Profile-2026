// src/components/layout/sidebar.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const homeSections = [
  { id: "hero", label: "Hero", sub: "HOME" },
  { id: "profile", label: "Profile", sub: "个人简介" },
  { id: "work-snapshots", label: "Work", sub: "PROJECT" },
  { id: "snow-ecosystem", label: "Snowtech", sub: "雪诺生态" },
  { id: "ai-plugins", label: "AI Plugins", sub: "AI 插件" },
  { id: "footer", label: "Contact", sub: "联系" },
];
const workSections = [
  { id: "company", label: "Company", sub: "企业项目" },
  { id: "personal", label: "Personal", sub: "个人项目" },
  { id: "others", label: "Others", sub: "其他作品" },
];

export default function Sidebar() {
  const pathname = usePathname();

  const currentSections =
    pathname === "/work" ? workSections : homeSections;

  const [activeSection, setActiveSection] = useState(currentSections[0]?.id || "");
  const [scrollProgress, setScrollProgress] = useState(0);
  const isClickScrolling = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  // 滚动进度追踪
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setActiveSection(currentSections[0]?.id || "");
    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickScrolling.current) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );

    const timeoutId = setTimeout(() => {
      currentSections.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) observer.observe(element);
      });
    }, 100);

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [pathname, currentSections]);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    isClickScrolling.current = true;
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      isClickScrolling.current = false;
    }, 1000);
  };

  if (pathname === "/work") { return null; }
  if (pathname.startsWith("/work/")) { return null; }
  if (pathname.startsWith("/project/")) { return null; }

  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ ease: "easeOut", duration: 0.6, delay: 0.3 }}
      className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden xl:flex flex-col items-end py-4"
    >
      {/* 顶部滚动进度环 */}
      <div className="relative w-10 h-10 mb-4 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
          <circle
            cx="18" cy="18" r="16" fill="none"
            stroke="rgba(59,130,246,0.6)" strokeWidth="1.5"
            strokeDasharray={`${2 * Math.PI * 16}`}
            strokeDashoffset={`${2 * Math.PI * 16 * (1 - scrollProgress / 100)}`}
            className="transition-all duration-150"
            strokeLinecap="round"
          />
        </svg>
        <span className="font-mono text-[9px] text-zinc-500 tabular-nums">
          {Math.round(scrollProgress)}%
        </span>
      </div>

      {/* 背景轨道线 */}
      <div className="absolute right-[11.5px] top-14 bottom-14 w-px bg-gradient-to-b from-transparent via-zinc-500/15 to-transparent z-0"></div>

      {currentSections.map((section, index) => {
        const isActive = activeSection === section.id;

        return (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className="group relative flex items-center py-2.5 pl-10 pr-2 cursor-pointer z-10"
          >
            {/* 悬浮文字标签 — 从右侧弹出 */}
            <div
              className={`absolute right-8 flex items-center gap-2 whitespace-nowrap transition-all duration-300 ${
                isActive
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
              }`}
            >
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md transition-colors duration-300 ${
                isActive
                  ? "bg-blue-500/10 border-blue-500/30"
                  : "bg-black/60 border-white/10 group-hover:border-white/20"
              }`}>
                <span className={`font-mono text-[10px] tracking-widest uppercase ${
                  isActive ? "text-blue-400" : "text-zinc-400"
                }`}>
                  {section.label}
                </span>
                <span className="text-[9px] text-zinc-600 font-mono">
                  {String(index).padStart(2, "0")}
                </span>
              </div>
            </div>

            {/* 锚点指示器 */}
            <div className="relative flex items-center justify-center w-6 h-6">
              {/* 默认状态 — 小点 */}
              <div
                className={`absolute w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? "opacity-0 scale-0"
                    : "bg-zinc-600 group-hover:bg-zinc-400 group-hover:scale-125 opacity-100"
                }`}
              />
              {/* 激活状态 — 发光指示条 */}
              {isActive && (
                <motion.div
                  layoutId="activeSidebarIndicator"
                  className="absolute w-1 h-5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </div>
          </button>
        );
      })}

      {/* 底部装饰 — 当前章节中文标签 */}
      <div className="mt-2 pr-2">
        <span className="font-mono text-[9px] text-zinc-700 tracking-wider">
          {currentSections.find(s => s.id === activeSection)?.sub || ""}
        </span>
      </div>
    </motion.div>
  );
}
