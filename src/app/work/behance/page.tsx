// src/app/work/behance/page.tsx
"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// ==========================================
// 🎨 配置区：在这里修改你的作品信息
// ==========================================
const projectConfig = {
  title: "磁力聚星",
  
  // 主题开关：改成 "light" 就是白底模板，改成 "dark" 就是黑底模板
  theme: "dark", 
  
  // 你的切片长图路径 (请确保 public/images/ 目录下有这些图片)
  images:[
    "/images/cili-project/Desk-03.jpg", 
    "/images/cili-project/Desk-04.jpg",
    "/images/cili-project/Desk-06.jpg",
    "/images/cili-project/Desk-06-1.jpg",
    "/images/cili-project/Desk-07.jpg",
    "/images/cili-project/Desk-08.jpg",
    "/images/cili-project/Desk-09.jpg",
    "/images/cili-project/Desk-10.jpg",
    "/images/cili-project/Desk-11.jpg",
  ],
  
  // 下一个项目的跳转链接 (可选)
  nextProject: {
    name: "SNOW Ecosystem",
    link: "/work/snow-ecosystem" // 指向你其他的作品页
  }
};

export default function BehanceStylePage() {
  const isDark = projectConfig.theme === "dark";

  // ==========================================
  // 💅 样式变量提取 (根据 theme 自动适配黑白模式)
  // ==========================================
  const bgClass = isDark ? "bg-[#050505]" : "bg-white";
  const textClass = isDark ? "text-zinc-100" : "text-zinc-900";
  const selectionClass = isDark 
    ? "selection:bg-white/20 selection:text-white" 
    : "selection:bg-black/10 selection:text-black";
  
  const btnClass = isDark 
    ? "bg-black/50 border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800 shadow-[0_0_30px_rgba(0,0,0,0.8)]" 
    : "bg-white/80 border-zinc-200 text-zinc-600 hover:text-black hover:bg-zinc-50 shadow-[0_0_30px_rgba(0,0,0,0.1)]";

  const footerClass = isDark
    ? "bg-[#020202] hover:bg-zinc-900 border-zinc-900"
    : "bg-zinc-50 hover:bg-zinc-100 border-zinc-200";

  return (
    <div className={`min-h-screen ${bgClass} ${textClass} ${selectionClass}`}>
      
      {/* ----------------------------------------------------------------- */}
      {/* 1. 悬浮返回按钮 */}
      {/* ----------------------------------------------------------------- */}
      <Link 
        href="/work" 
        className={`fixed top-8 left-8 z-50 w-12 h-12 backdrop-blur-md border rounded-full flex items-center justify-center transition-all group ${btnClass}`}
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
      </Link>

      {/* ----------------------------------------------------------------- */}
      {/* 2. 核心 Behance 画布 (严控尺寸，无缝拼接) */}
      {/* ----------------------------------------------------------------- */}
      {/* 极客细节：min-w-[375px] max-w-[1400px] 保证了在带鱼屏不畸变，在手机端不溢出 */}
      <div className={`w-full min-w-[375px] max-w-[1400px] mx-auto flex flex-col ${bgClass}`}>
        {projectConfig.images.map((imgUrl, index) => (
          <img 
            key={index} 
            src={imgUrl} 
            alt={`${projectConfig.title} - slice ${index + 1}`} 
            // 首图立即加载防止闪烁，后续图片原生懒加载节省性能
            loading={index === 0 ? "eager" : "lazy"} 
            // block, m-0, p-0 是消除两张图片上下 1px 白边缝隙的终极奥义
            className="w-full h-auto block m-0 p-0" 
          />
        ))}
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* 3. 底部跳转区域 */}
      {/* ----------------------------------------------------------------- */}
      {projectConfig.nextProject && (
        <Link 
          href={projectConfig.nextProject.link} 
          className={`block w-full py-32 transition-colors text-center border-t group ${footerClass}`}
        >
          <div className={`text-sm font-mono tracking-widest uppercase mb-4 transition-colors ${isDark ? 'text-zinc-600 group-hover:text-blue-400' : 'text-zinc-400 group-hover:text-blue-600'}`}>
            Next Project
          </div>
          <h2 className="text-4xl md:text-6xl font-bold transition-transform duration-500 group-hover:translate-y-2">
            {projectConfig.nextProject.name}
          </h2>
        </Link>
      )}
      
    </div>
  );
}