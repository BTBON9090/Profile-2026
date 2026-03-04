// src/components/layout/navbar.tsx
"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation"; 

const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

export default function Navbar() {
  const pathname = usePathname();
  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-8 py-6 bg-black/50 backdrop-blur-md border-b border-white/5"
    >
      {/* 左侧 Logo：点击永远回到首页 */}
      <Link href="/" className="font-mono text-sm tracking-widest font-bold text-zinc-300 hover:text-white transition-colors">
        YOUR NAME<span className="text-blue-500">.</span>DESIGN
      </Link>

      {/* 右侧导航 */}
      <div className="flex gap-8 font-mono text-sm">
        <Link 
          href="/" 
          className={`relative group transition-colors ${pathname === '/' ? 'text-white' : 'text-zinc-500 hover:text-white'}`}
        >
          HOME
          {/* 如果当前在首页，底部线条常亮 */}
          <span className={`absolute -bottom-1 left-0 h-px bg-blue-500 transition-all ${pathname === '/' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
        </Link>
        <Link 
          href="/work" 
          className={`relative group transition-colors ${pathname === '/work' ? 'text-white' : 'text-zinc-500 hover:text-white'}`}
        >
          Gallery
          {/* 如果当前在 /work 页面，底部线条常亮 */}
          <span className={`absolute -bottom-1 left-0 h-px bg-blue-500 transition-all ${pathname === '/work' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
        </Link>
        <Link 
          href="/about" 
          className={`relative group transition-colors ${pathname === '/about' ? 'text-white' : 'text-zinc-500 hover:text-white'}`}
        >
          ABOUT
          {/* 如果当前在 /about 页面，底部线条常亮 */}
          <span className={`absolute -bottom-1 left-0 h-px bg-blue-500 transition-all ${pathname === '/about' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
        </Link>
      </div>
    </motion.nav>
  );
}
