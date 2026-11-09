// src/components/layout/sidebar.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import "@/components/ui/home-refinements.css";

const homeSections = [
  { id: "hero", label: "Hero", sub: "HOME" },
  { id: "profile", label: "Profile", sub: "个人简介" },
  { id: "work-snapshots", label: "Work", sub: "PROJECT" },
  { id: "snow-ecosystem", label: "Snowtech", sub: "雪诺生态" },
  { id: "ai-plugins", label: "Independent Products", sub: "独立产品" },
  { id: "footer", label: "Contact", sub: "联系" },
];
const workSections = [
  { id: "company", label: "Company", sub: "企业项目" },
  { id: "personal", label: "Personal", sub: "个人项目" },
  { id: "others", label: "Others", sub: "其他作品" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

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
      element.scrollIntoView({ behavior: reduceMotion ? "instant" : "smooth" });
    }
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      isClickScrolling.current = false;
    }, 1000);
  };

  if (pathname === "/work") { return null; }
  if (pathname.startsWith("/work/")) { return null; }
  if (pathname.startsWith("/project/")) { return null; }
  if (pathname.startsWith("/appbox")) { return null; }
  if (pathname.startsWith("/tools/")) { return null; }

  return (
    <motion.nav
      aria-label="首页章节"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="site-sidebar home-anchor-nav"
    >
      <div className="home-anchor-nav__progress" aria-label={`阅读进度 ${Math.round(scrollProgress)}%`}>
        <span>{String(Math.round(scrollProgress)).padStart(2, "0")}<small>%</small></span>
        <i><b style={{ transform: `scaleX(${scrollProgress / 100})` }} /></i>
      </div>
      <div className="home-anchor-nav__sections">
        {currentSections.map((section, index) => (
          <button
            key={section.id}
            aria-label={section.sub}
            aria-current={activeSection === section.id ? "location" : undefined}
            onClick={() => scrollToSection(section.id)}
          >
            <span className="home-anchor-nav__label">{section.sub}</span>
            <span className="home-anchor-nav__number">{String(index + 1).padStart(2, "0")}</span>
            <i />
          </button>
        ))}
      </div>
    </motion.nav>
  );
}
