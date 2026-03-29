// src/components/ui/UniversalModal.tsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Download, Sparkles, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import AICopilot from "./AICopilot"; 

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  images: string[];
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  projectId: string;
  nextTitle?: string;
}

export default function UniversalModal({ isOpen, onClose, title, images, hasPrev, hasNext, onPrev, onNext, projectId, nextTitle }: ModalProps) {
  const [copied, setCopied] = useState(false);
  const [sparks, setSparks] = useState<{ id: number; x: number; y: number; symbol: string }[]>([]);
  const [mounted, setMounted] = useState(false);
  // 👇 1. 增加滚动容器的引用
  const scrollContainerRef = useRef<HTMLDivElement>(null); 
  
  // 👇 2. 监听 title 变化（切换项目时），瞬间回到顶部
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [title]);

  // 确保 Portal 只在客户端渲染，防止 Hydration 报错
  useEffect(() => {
    setMounted(true);
  },[]);

  // 弹窗打开时，彻底锁定底层网页的滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleCopy = () => {
    navigator.clipboard.writeText("hello@nicheng.com"); // 替换为你的邮箱
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fireSparks = () => {
    const symbols = ["✨", "</>", "🚀", "💡", "🔥"];
    const newSparks = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 200,
      y: (Math.random() - 1) * 200,
      symbol: symbols[Math.floor(Math.random() * symbols.length)]
    }));
    setSparks((prev) => [...prev, ...newSparks]);
    setTimeout(() => setSparks((prev) => prev.filter(s => !newSparks.includes(s))), 1000);
  };

  if (!mounted) return null;

  // 核心模态框结构
  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        // 外层主容器：绝对定位于视窗顶部，层级开到最高 [99999] 盖住所有导航栏
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[99999] flex justify-center"
        >
          {/* ========================================== */}
          {/* Layer 1: 全屏背景蒙版 (点击可关闭)           */}
          {/* ========================================== */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-[10px] cursor-alias" 
            onClick={onClose} 
          />

          {/* ========================================== */}
          {/* Layer 2: 独立的内容滚动区 (只有这里能上下滑)   */}
          {/* ========================================== */}
          <div 
          ref={scrollContainerRef}
          className="absolute inset-0 overflow-y-auto overflow-x-hidden custom-scrollbar cursor-zoom-out"
          onClick={onClose}
          >
            {/* 内容画布：严格控制宽度，上下留白，底部多留空间给翻页按钮 */}
            <div 
            className="w-full max-w-[1440px] mx-auto bg-[#0c0c0c] min-h-screen my-0 md:my-18 md:rounded-sm relative z-10 isolate cursor-default"
            onClick={(e) => e.stopPropagation()}
            >
              
              {/* 顶部标题栏 (可选，增加精致感) */}
              <div className="sticky top-0 z-20 w-full px-8 py-6 pointer-events-none flex items-center justify-between md:rounded-t-2xl">
                 <span className="font-mono text-sm text-white/60 backdrop-blur-md px-3 py-1 rounded-md bg-black/40">{title}</span>
              </div>

              {/* 纯净图片流，底部增加 pb-32 防止最后一张图被底部的按钮挡住 */}
              <div className="w-full flex flex-col pb-32">
                {images.map((img: string, idx: number) => (
                  <img 
                    key={idx} 
                    src={img} 
                    alt={`${title}-${idx}`} 
                    loading={idx === 0 ? "eager" : "lazy"} 
                    className="w-full h-auto block m-0 p-0" 
                  />
                ))}
              </div>
              <div className="w-full h-32 flex items-center justify-center pb-48">
                <div className="flex flex-col items-center gap-8">
                  <span className="text-zinc-500 text-sm tracking-widest uppercase">Next Project</span>
                  <span className="text-white/80 font-semibold text-4xl">{nextTitle || 'No More Projects'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================== */}
          {/* Layer 3: 绝对静止的悬浮控件层                */}
          {/* ========================================== */}
          <div className="absolute inset-0 pointer-events-none flex justify-center">
            
            {/* 关闭按钮 */}
            <button onClick={onClose} className="fixed top-8 right-8 z-[100000] w-14 h-14 bg-zinc-900/80 hover:bg-white text-zinc-400 hover:text-black rounded-full flex items-center justify-center transition-all border border-zinc-700 pointer-events-auto shadow-2xl">
              <X className="w-6 h-6" />
            </button>

            {/* 👇 2. 注入 AI 智能体！把你项目的 projectId 传给它 */}
            <AICopilot projectId={projectId} />

            {/* [独立控件 C] 底部上下页翻页：永远置底常驻 */}
            <motion.div 
              initial={{ y: 50, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ delay: 0.3 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 pointer-events-auto flex items-center bg-[#1a1a1a]/90 backdrop-blur-xl text-zinc-300 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-zinc-700/50 overflow-hidden"
            >
              <button 
                onClick={onPrev} 
                disabled={!hasPrev}
                className={`flex items-center gap-3 px-4 py-5 font-mono text-sm tracking-widest transition-colors ${hasPrev ? 'hover:bg-white hover:text-black' : 'opacity-30 cursor-not-allowed'}`}
              >
                <ChevronLeft className="w-5 h-5" /> PREV
              </button>
              
              <div className="w-px h-4 bg-zinc-700"></div>

              <button 
                onClick={onNext} 
                disabled={!hasNext}
                className={`flex items-center gap-3 px-4 py-5 font-mono text-sm tracking-widest transition-colors ${hasNext ? 'hover:bg-white hover:text-black' : 'opacity-30 cursor-not-allowed'}`}
              >
                NEXT <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>

          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );

  // 核心：使用 Portal 把这个巨大的弹窗直接挂载到 <body> 的末尾，彻底击碎组件嵌套层级限制！
  return createPortal(modalContent, document.body);
}