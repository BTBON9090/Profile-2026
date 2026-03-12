// src/components/ui/back-to-top.tsx
"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

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

  return (
    // AnimatePresence 用于让组件在卸载时（消失）也能播放退出动画
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.8 }} // 初始状态：透明、靠下、缩小
          animate={{ opacity: 1, y: 0, scale: 1 }}    // 出现状态：完全不透明、归位、正常大小
          exit={{ opacity: 0, y: 20, scale: 0.8 }}    // 消失状态：透明、降下、缩小
          whileHover={{ scale: 1.1 }}                 // 悬停时：物理弹性放大
          whileTap={{ scale: 0.9 }}                   // 点击时：物理凹陷
          onClick={scrollToTop}
          // 极致的 UI 质感：黑底毛玻璃、发光边框、微光阴影
          className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-colors cursor-pointer"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}