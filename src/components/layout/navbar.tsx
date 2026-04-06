// src/components/layout/navbar.tsx
"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation"; 
import { useI18n } from "@/lib/i18n";
import LanguageSwitcher from "@/components/ui/language-switcher"; 

export default function Navbar() {
  const pathname = usePathname();
  const { t } = useI18n();
  // ==============================================================
  // 1. 动态主题感知
  // 注意这里：如果是放在 project 路由下，记得加上 /project/ 前缀
  // ==============================================================
  const isLightTheme = pathname === "/project/light-branding" || pathname === "/work/light-branding";

  // 提取动态 CSS 变量
  const navBgClass = isLightTheme ? "bg-white/90 border-b border-zinc-200" : "bg-black/90 border-b border-white/5"; // 背景颜色
  const logoColorClass = isLightTheme ? "text-zinc-900 hover:text-black" : "text-zinc-300 hover:text-white/90"; // logo 颜色
  const dotColorClass = isLightTheme ? "text-blue-600" : "text-blue-600"; // 点颜色
  
  // 👇 提取激活和未激活的文字颜色变量
  const activeText = isLightTheme ? "text-zinc-900" : "text-white/90"; // 激活文字颜色
  const inactiveText = isLightTheme ? "text-zinc-500 hover:text-zinc-900" : "text-gray-400 hover:text-white/90"; // 未激活文字颜色


  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-8 py-4  transition-colors duration-500 ${navBgClass}`}
    >
      <Link 
        href="/" 
        className={`font-mono text-sm tracking-widest font-bold transition-colors ${logoColorClass} uppercase`}
      >
        AIDEN
        <span className={dotColorClass}>.</span>
        <span className={dotColorClass}>D</span>
        <span className={`${isLightTheme ? "text-blue-600" : "text-blue-600"} hidden md:inline`}>ESIGN</span>
      </Link>

      
      {/* 右侧导航与多语言 */}
      <div className="flex items-center gap-8">
        <div className="flex gap-8 font-mono text-sm">
          
          {/* 1. 首页 (Home) */}
          <Link 
            href="/" 
            // 使用动态变量 activeText 和 inactiveText
            className={`relative group transition-colors ${pathname === '/' ? activeText : inactiveText}`}
          >
            {t.nav.home} 
            <span className={`absolute -bottom-1 left-0 h-px bg-blue-500 transition-all ${pathname === '/' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
          </Link>

          {/* 2. 图库 (Work/Project) */}
          <Link 
            href="/work" 
            className={`relative group transition-colors ${
              pathname.startsWith('/work') || pathname.startsWith('/project') ? activeText : inactiveText
            }`}
          >
            {t.nav.project}
            <span className={`absolute -bottom-1 left-0 h-px bg-blue-500 transition-all ${
              pathname.startsWith('/work') || pathname.startsWith('/project') ? 'w-full' : 'w-0 group-hover:w-full'
            }`}></span>
          </Link>

          {/* 3. 关于我 (About) */}
          <Link 
            href="/about" 
            className={`relative group transition-colors ${pathname === '/about' ? activeText : inactiveText}`}
          >
            {t.nav.biography}
            <span className={`absolute -bottom-1 left-0 h-px bg-blue-500 transition-all ${pathname === '/about' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
          </Link>

        </div>
  
  <LanguageSwitcher />
</div>
    </motion.nav>
  );
}
