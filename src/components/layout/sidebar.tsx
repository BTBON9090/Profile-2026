// src/components/layout/sidebar.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const homeSections =[
  { id: "hero", label: "00 Hero" },
  { id: "all-in-one", label: "01 Figma Plugin" },
  { id: "ai-translate", label: "02 Chrome Extension" },
  { id: "snow-ecosystem", label: "03 Snowtech Ecosystem" },
  { id: "about", label: "04 About Me" },
  { id: "footer", label: "05 Contact" },
  // 暂时注释掉 footer，因为 footer 通常不够高，容易导致滚动监听乱跳
  // { id: "footer", label: "05 // Contact" }, 
];
const workSections =[
  { id: "company", label: "01 Company" },
  { id: "personal", label: "02 Personal" },
  { id: "others", label: "03 Others" },
];
// 👇 新增：About 页面的锚点导航
const aboutSections =[
  { id: "profile", label: "01 Profile & Contact" },
  { id: "experience", label: "02 Experience" },
];

export default function Sidebar() {
  const pathname = usePathname(); // 获取当前路由路径
  // 👇 新增：如果是 /about 页面，直接返回 null (不渲染侧边栏)
  //if (pathname === "/about") { return null;}

  if (pathname.startsWith("/work/")) { 
    return null; 
  }
  // 2. 动态决定当前使用哪套导航
  const currentSections = 
    pathname === "/work" ? workSections : // 工作页面
    pathname === "/about" ? aboutSections : // About 页面
    homeSections;
  
  // 默认激活当前路由的第一个 section
  const [activeSection, setActiveSection] = useState(currentSections[0]?.id || "");

  // 新增：点击防抖锁，防止点击平滑滚动时，沿途的模块疯狂触发监听
  const isClickScrolling = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    // 切换页面时，重置激活状态为新页面的第一个模块
    setActiveSection(currentSections[0]?.id || "");
    // 优化：降低 threshold 阈值。因为 B 端项目展示区通常很长（超出屏幕）
    // 如果 threshold 太高，会导致很长的区域无法触发 active 状态
    const observer = new IntersectionObserver(
      (entries) => {
        // 如果正在因为点击而发生平滑滚动，则暂时挂起监听器，防止乱跳
        if (isClickScrolling.current) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { 
        // 核心修复机制：
        // 把屏幕上下各削去 40%，只留中间 20% 的“瞄准区”。
        // threshold 设为 0（只要有任何像素进入中间这个瞄准区，就算激活）。
        // 这样无论 Ecosystem 模块有几万像素高，依然能被完美捕获！
        rootMargin: "-40% 0px -40% 0px", 
        threshold: 0 
      } 
    );

    // 3. 异步挂载监听器 (重要避坑：防止 Next.js 页面切换瞬间 DOM 尚未渲染完成)
    const timeoutId = setTimeout(() => {
      currentSections.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) observer.observe(element);
      });
    }, 100); // 100ms 延迟足以确保 DOM 就绪

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [pathname]); // 4. 依赖项改为 pathname，路由一旦变化，就销毁旧监听并重启新监听

  const scrollToSection = (id: string) => {
    // 1. 立即点亮点击的导航项，提供秒级反馈
    setActiveSection(id);
    
    // 2. 上锁：告诉系统“我现在是手动强行滚动，别给我瞎判定”
    isClickScrolling.current = true;

    // 3. 执行平滑滚动
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }

    // 4. 清理上一次的定时器并设置解锁倒计时 (假设滚动耗时约 1000ms)
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      isClickScrolling.current = false;
    }, 1000); // 1秒后解锁监听器
  };

  return (
    <motion.div 
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ ease: "easeOut", duration: 0.6 }}
      // 增加热区宽度，并加入一条极细的轨道线增加架构感
      className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden xl:flex flex-col items-start py-4"
    >
      {/* 背景轨道线 */}
      <div className="absolute left-[11.5px] top-0 bottom-0 w-px bg-zinc-500/20 z-0"></div>

      {currentSections.map((section) => {
        const isActive = activeSection === section.id;

        return (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            // group 和 py-3 增加了极大的垂直点击热区
            className="group relative flex items-center py-3 pr-10 cursor-pointer z-10"
          >
            {/* 锚点指示器容器 */}
            <div className="relative flex items-center justify-center w-6 h-8">
              {/* 默认的灰色小点 */}
              <div 
                className={`absolute w-1.5 h-1.5 rounded-full bg-zinc-700 transition-all duration-300 group-hover:bg-zinc-400 group-hover:scale-150 ${
                  isActive ? "opacity-0 scale-0" : "opacity-100"
                }`}
              />

              {/* 激活状态的丝滑跟踪发光条 (Framer Motion 魔法) */}
              {isActive && (
                <motion.div
                  layoutId="activeSidebarIndicator" // 关键：共享布局动画
                  className="absolute w-1 h-full bg-white rounded-full shadow-[0_0_12px_rgba(59,130,246,0.6)]"
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 30 
                  }}
                />
              )}
            </div>

            {/* 悬浮/激活时浮现的文字标签 */}
            <div 
              className={`absolute left-8 font-mono text-[10px] tracking-widest uppercase whitespace-nowrap transition-all duration-300 ${
                isActive 
                  ? "text-white opacity-100 translate-x-0" 
                  : "text-zinc-500 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:-translate-x-2"
              }`}
            >
              {section.label}
            </div>
          </button>
        );
      })}
    </motion.div>
  );
}