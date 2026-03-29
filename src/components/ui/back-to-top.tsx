// src/components/ui/back-to-top.tsx
"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { usePathname } from "next/navigation";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname(); 

  // 监听滚动事件
  useEffect(() => {
    const toggleVisibility = () => {
      // 只要页面向下滚动超过 400px，按钮就会浮现
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  },[]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // 丝滑滚动
    });
  };

  // ==============================================================
  // 🟢 动态主题感知逻辑 (与 BgmPlayer 保持绝对的视觉统一)
  // ==============================================================
  const isLightTheme = pathname === "/work/light-branding" || pathname === "/work/ciliju-xing";

  // 极致大厂质感的背景与边框
  const btnClass = isLightTheme 
    ? "bg-white/80 border-zinc-200 text-zinc-500 hover:text-black hover:bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)]" 
    : "bg-zinc-900/80 border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800 shadow-[0_0_30px_rgba(0,0,0,0.3)]";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          // 去掉了丑陋的 mix-blend-difference，加上了深度的 backdrop-blur-xl
          className={`fixed bottom-8 right-8 z-[99999] w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-colors backdrop-blur-xl border ${btnClass}`}
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}