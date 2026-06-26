// src/components/ui/UniversalModal.tsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Image as ImageIcon, Layers } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useCopilotProject } from "@/lib/copilot-context";

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
  isCompanyProject?: boolean;
}

export default function UniversalModal({
  isOpen,
  onClose,
  title,
  images,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  projectId,
  nextTitle,
  isCompanyProject
}: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState<Record<number, boolean>>({});
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [thumbnailsRendered, setThumbnailsRendered] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const thumbnailStripRef = useRef<HTMLDivElement>(null);

  // 向全局 AI 助手推送当前项目上下文（modal 作用域，优先级高于详情页）
  // 弹窗挂载时推送，卸载时清除——实现"打开弹窗即聚焦该项目"
  const { setProjectId } = useCopilotProject();
  useEffect(() => {
    setProjectId(projectId, "modal");
    return () => setProjectId(null, "modal");
  }, [projectId, setProjectId]);

  // 切换项目时重置状态
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "instant" });
      setCurrentImageIndex(0);
      setImageLoaded({});
      setThumbnailsRendered(false);
    }
  }, [title]);

  // 延迟渲染 thumbnails — 优化性能
  useEffect(() => {
    if (showThumbnails && !thumbnailsRendered) {
      // 延迟 100ms 后才渲染 thumbnails，避免卡顿
      const timer = setTimeout(() => setThumbnailsRendered(true), 100);
      return () => clearTimeout(timer);
    }
  }, [showThumbnails, thumbnailsRendered]);

  // 底部控件消失时（滚动到底部），自动关闭 thumbnails
  useEffect(() => {
    if (isAtBottom && showThumbnails) {
      setShowThumbnails(false);
    }
  }, [isAtBottom, showThumbnails]);

  // 滚动监听 — 计算当前图片索引
  useEffect(() => {
    if (!isOpen || images.length === 0) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    const initObserver = () => {
      let ticking = false;
      const handleScroll = () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            const scrollTop = container.scrollTop;
            const viewportHeight = container.clientHeight;
            const viewportCenter = scrollTop + viewportHeight / 2;

            let closestIndex = 0;
            let closestDistance = Infinity;

            imageRefs.current.forEach((ref, idx) => {
              if (!ref) return;
              const rect = ref.getBoundingClientRect();
              const containerRect = container.getBoundingClientRect();
              const elementTop = rect.top - containerRect.top + scrollTop;
              const elementCenter = elementTop + rect.height / 2;
              const distance = Math.abs(viewportCenter - elementCenter);

              if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = idx;
              }
            });

            setCurrentImageIndex(closestIndex);

            // 检测是否滚动到底部（距离底部 200px 内视为底部）
            const scrollHeight = container.scrollHeight;
            const maxScroll = scrollHeight - viewportHeight;
            const distanceToBottom = maxScroll - scrollTop;
            setIsAtBottom(distanceToBottom < 600);

            ticking = false;
          });
          ticking = true;
        }
      };

      container.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll();
      return () => container.removeEventListener("scroll", handleScroll);
    };

    const timeoutId = setTimeout(initObserver, 100);
    return () => clearTimeout(timeoutId);
  }, [isOpen, images, mounted]);

  // Portal 客户端渲染
  useEffect(() => {
    setMounted(true);
  }, []);

  // 锁定底层滚动 — 同时锁定 html 和 body
  useEffect(() => {
    if (isOpen) {
      const originalHtmlOverflow = document.documentElement.style.overflow;
      const originalBodyOverflow = document.body.style.overflow;
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      return () => {
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.style.overflow = originalBodyOverflow;
      };
    }
  }, [isOpen]);

  // 键盘导航 — 严谨的快捷键支持
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && hasPrev) {
        e.preventDefault();
        onPrev();
      } else if (e.key === "ArrowRight" && hasNext) {
        e.preventDefault();
        onNext();
      } else if (e.key === "t" || e.key === "T") {
        setShowThumbnails(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, hasPrev, hasNext, onClose, onPrev, onNext]);

  // 跳转到指定图片
  const scrollToImage = useCallback((index: number) => {
    const target = imageRefs.current[index];
    const container = scrollContainerRef.current;
    if (target && container) {
      container.scrollTo({
        top: target.offsetTop - 80,
        behavior: "smooth"
      });
    }
  }, []);

  if (!mounted) return null;

  const totalImages = images.length;
  const progressPercent = totalImages > 0 ? ((currentImageIndex + 1) / totalImages) * 100 : 0;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[99999] flex justify-center"
        >
          {/* ========================================== */}
          {/* Layer 1: 全屏背景蒙版 — 严谨的层级隔离      */}
          {/* ========================================== */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm cursor-pointer"
            onClick={onClose}
            aria-label="关闭弹窗"
          />

          {/* ========================================== */}
          {/* Layer 2: 内容滚动区                          */}
          {/* ========================================== */}
          <div
            ref={scrollContainerRef}
            className="absolute inset-0 overflow-y-auto overflow-x-hidden custom-scrollbar cursor-zoom-out"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label={`${title} 作品详情`}
          >
            {/* 内容画布 — 严谨的宽度和边距控制 */}
            <div
              className="w-full max-w-[1440px] mx-auto bg-[#0a0a0a] min-h-screen my-0 md:my-16 relative z-10 isolate cursor-default border border-zinc-800/60 shadow-[0_0_120px_rgba(0,0,0,0.9)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 顶部进度条 — 始终贴顶，置于标题栏之上 */}
              <div className="sticky top-0 z-40 w-full h-0.5 bg-zinc-900 pointer-events-none">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </div>
              
              {/* ========================================== */}
              {/* 顶部标题栏 — 严谨的算色对比                  */}
              {/* ========================================== */}
              <div className="sticky top-0.5 z-30 w-full px-4 py-3 md:px-8 md:py-4 pointer-events-none flex items-center justify-between bg-zinc-950/80 backdrop-blur-md">
                {/* 左侧：项目标题 */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="min-w-0">
                    <div className="font-mono text-[10px] font-bold text-blue-400 tracking-[0.2em] uppercase mb-0.5">
                      PROJECT
                    </div>
                    <h2 className="font-semibold text-sm md:text-base text-zinc-50 truncate max-w-[60vw] md:max-w-[400px]">
                      {title}
                    </h2>
                  </div>
                </div>

                {/* 右侧：进度指示器 */}
                {totalImages > 1 && (
                  <div className="flex items-center gap-3">
                    {/* 数字计数器 — 算色：黑底白字 */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10">
                      <span className="font-mono text-xs text-white font-semibold tabular-nums">
                        {String(currentImageIndex + 1).padStart(2, "0")}
                      </span>
                      <span className="font-mono text-[10px] text-zinc-500">/</span>
                      <span className="font-mono text-[10px] text-zinc-400 tabular-nums">
                        {String(totalImages).padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              

              {/* ========================================== */}
              {/* 图片流 — 严谨的加载状态和序号水印            */}
              {/* ========================================== */}
              <div className="w-full flex flex-col pb-32">
                {images.map((img: string, idx: number) => (
                  <div
                    key={idx}
                    ref={(el) => {
                      imageRefs.current[idx] = el;
                    }}
                    className="relative bg-zinc-950"
                  >
                    {/* 骨架屏 — 严谨的加载状态 */}
                    {!imageLoaded[idx] && (
                      <div className="absolute inset-0 flex items-center justify-center min-h-[400px] bg-gradient-to-br from-zinc-900 via-zinc-800/30 to-zinc-900">
                        <div className="flex flex-col items-center gap-3">
                          <div className="relative w-12 h-12">
                            <div className="absolute inset-0 rounded-full border-2 border-zinc-800"></div>
                            <div className="absolute inset-0 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
                          </div>
                          <span className="font-mono text-[10px] text-zinc-600 tracking-wider uppercase">
                            Loading {String(idx + 1).padStart(2, "0")} / {String(totalImages).padStart(2, "0")}
                          </span>
                        </div>
                      </div>
                    )}

                    <img
                      src={img}
                      alt={`${title} - 第 ${idx + 1} 张`}
                      loading={idx === 0 ? "eager" : "lazy"}
                      onLoad={() => setImageLoaded(prev => ({ ...prev, [idx]: true }))}
                      className="w-full h-auto block m-0 p-0 transition-opacity duration-500"
                      style={{ opacity: imageLoaded[idx] ? 1 : 0 }}
                    />

                    {/* 序号水印 — 胶囊型，文字垂直居中 */}
                    <div className="absolute bottom-4 right-4 pointer-events-none">
                      <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/10">
                        <span className="font-mono text-[10px] text-zinc-200 tracking-wider font-medium tabular-nums leading-none">
                          {String(idx + 1).padStart(2, "0")} / {String(totalImages).padStart(2, "0")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ========================================== */}
              {/* 底部引流块 — 严谨的视觉引导                  */}
              {/* ========================================== */}
              <div className="relative w-full py-32 md:py-40 flex flex-col items-center justify-center border-t border-white/[0.06] bg-gradient-to-b from-black/40 via-black/60 to-black/90 overflow-hidden">

                <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-5xl px-6 text-center">
                  {/* 状态标签 */}
                  <div className="flex items-center gap-3">
                    <span className="h-px w-12 bg-gradient-to-r from-transparent to-blue-500/60" />
                    <span className="font-mono text-[11px] text-blue-400 tracking-[0.3em] uppercase font-medium">
                      {hasNext ? "Up Next" : isCompanyProject ? "Section End" : "Gallery End"}
                    </span>
                    <span className="h-px w-12 bg-gradient-to-l from-transparent to-blue-500/60" />
                  </div>

                  {/* 主标题 */}
                  <h3 className="text-white font-bold text-3xl md:text-5xl lg:text-6xl tracking-tight leading-[1.1] max-w-2xl">
                    {hasNext ? (
                      nextTitle || "下一个项目"
                    ) : isCompanyProject ? (
                      "企业项目已结束"
                    ) : (
                      "没有更多作品了"
                    )}
                  </h3>

                  {/* 副标题 */}
                  {!hasNext && (
                    <p className="text-zinc-400 text-sm md:text-base max-w-md leading-relaxed">
                      {isCompanyProject
                        ? "等等，还没完，下面还有更多个人作品哟！"
                        : "已浏览全部作品，感谢你的观看"}
                    </p>
                  )}

                  {/* CTA 按钮组 — 统一样式，箭头方向相反 */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
                    {hasPrev && (
                      <button
                        onClick={onPrev}
                        className="group relative flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white/[0.03] border border-white/15 text-zinc-200 font-medium text-sm overflow-hidden transition-all duration-300 hover:border-white/40 hover:bg-white/[0.08] hover:text-white hover:-translate-y-0.5 active:translate-y-0"
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        <ChevronLeft className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:-translate-x-0.5" />
                        <span className="relative z-10">上一个项目</span>
                      </button>
                    )}

                    {hasNext ? (
                      <button
                        onClick={onNext}
                        className="group relative flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white/[0.03] border border-white/15 text-zinc-200 font-medium text-sm overflow-hidden transition-all duration-300 hover:border-white/40 hover:bg-white/[0.08] hover:text-white hover:-translate-y-0.5 active:translate-y-0"
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        <span className="relative z-10">下一个项目</span>
                        <ChevronRight className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </button>
                    ) : (
                      <button
                        onClick={onClose}
                        className="group relative flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white/[0.03] border border-white/15 text-zinc-200 font-medium text-sm overflow-hidden transition-all duration-300 hover:border-white/40 hover:bg-white/[0.08] hover:text-white hover:-translate-y-0.5 active:translate-y-0"
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        <span className="relative z-10">返回作品列表</span>
                        <X className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:rotate-90" />
                      </button>
                    )}
                  </div>

                  {/* 键盘提示 */}
                  <div className="flex items-center gap-4 mt-8 text-zinc-600">
                    
                    {hasPrev && (
                      <div className="flex items-center gap-2">
                        <kbd className="font-mono text-[10px] text-zinc-400 px-2 py-1 rounded bg-zinc-800/80 border border-zinc-700">←</kbd>
                        <span className="font-mono text-[10px] tracking-wider uppercase">Prev</span>
                      </div>
                    )}
                    {hasNext && (
                      <div className="flex items-center gap-2">
                        <kbd className="font-mono text-[10px] text-zinc-400 px-2 py-1 rounded bg-zinc-800/80 border border-zinc-700">→</kbd>
                        <span className="font-mono text-[10px] tracking-wider uppercase">Next</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <kbd className="font-mono text-[10px] text-zinc-400 px-2 py-1 rounded bg-zinc-800/80 border border-zinc-700">ESC</kbd>
                      <span className="font-mono text-[10px] tracking-wider uppercase">Close</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================== */}
          {/* Layer 3: 悬浮控件层                          */}
          {/* ========================================== */}
          <div className="absolute inset-0 pointer-events-none flex justify-center">
            {/* 关闭按钮 — 严谨的交互状态 */}
            <button
              onClick={onClose}
              aria-label="关闭弹窗 (ESC)"
              title="关闭 (ESC)"
              className="fixed top-20 right-4 md:top-24 md:right-8 z-[100000] w-11 h-11 md:w-12 md:h-12 bg-zinc-900/80 backdrop-blur-xl hover:bg-white text-zinc-300 hover:text-zinc-950 rounded-full flex items-center justify-center transition-all duration-300 border border-zinc-700/50 hover:border-white pointer-events-auto shadow-2xl hover:scale-110 hover:rotate-90 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <X className="w-4 h-4 md:w-5 md:h-5" />
            </button>

            {/* AI 智能体已常驻全局（layout.tsx），通过 CopilotProjectContext 自动感知本项目，此处不再内嵌 */}

            {/* 底部翻页控件 — 严谨的控件设计 */}
            {(hasPrev || hasNext) && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: isAtBottom ? 100 : 0, opacity: isAtBottom ? 0 : 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto flex items-center bg-zinc-900/90 backdrop-blur-xl text-zinc-300 rounded-full shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-zinc-700/50 overflow-hidden"
              >
                <button
                  onClick={onPrev}
                  disabled={!hasPrev}
                  aria-label="上一个项目"
                  className={`flex items-center gap-2 px-5 py-4 md:py-5 font-mono text-xs md:text-sm tracking-widest transition-all duration-300 focus:outline-none ${
                    hasPrev
                      ? "hover:bg-white hover:text-zinc-950 cursor-pointer"
                      : "opacity-30 cursor-not-allowed"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="hidden sm:inline">PREV</span>
                </button>

                <div className="w-px h-5 bg-zinc-700"></div>

                {/* 中间：缩略图切换按钮 */}
                {totalImages > 1 && (
                  <>
                    <button
                      onClick={() => setShowThumbnails(!showThumbnails)}
                      aria-label={showThumbnails ? "隐藏缩略图" : "显示缩略图"}
                      aria-pressed={showThumbnails}
                      className={`flex items-center gap-2 px-4 py-4 md:py-5 font-mono text-xs tracking-widest transition-all duration-300 focus:outline-none ${
                        showThumbnails
                          ? "bg-blue-500/20 text-blue-400"
                          : "hover:bg-white/5 text-zinc-400"
                      }`}
                      title="切换缩略图导航 (T)"
                    >
                      <Layers className="w-4 h-4" />
                      <span className="hidden sm:inline">{String(currentImageIndex + 1).padStart(2, "0")}/{String(totalImages).padStart(2, "0")}</span>
                    </button>
                    <div className="w-px h-5 bg-zinc-700"></div>
                  </>
                )}

                <button
                  onClick={onNext}
                  disabled={!hasNext}
                  aria-label="下一个项目"
                  className={`flex items-center gap-2 px-5 py-4 md:py-5 font-mono text-xs md:text-sm tracking-widest transition-all duration-300 focus:outline-none ${
                    hasNext
                      ? "hover:bg-white hover:text-zinc-950 cursor-pointer"
                      : "opacity-30 cursor-not-allowed"
                  }`}
                >
                  <span className="hidden sm:inline">NEXT</span>
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </motion.div>
            )}

            {/* 缩略图导航条 — 严谨的章节快速跳转 */}
            <AnimatePresence>
              {showThumbnails && totalImages > 1 && (
                <motion.div
                  initial={{ y: 80, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 80, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-28 left-1/2 -translate-x-1/2 z-40 pointer-events-auto"
                >
                  <div className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-3 shadow-2xl max-w-[90vw]">
                    <div className="flex items-center gap-2 px-2 pb-2 mb-2 border-b border-zinc-700/50">
                      <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                      <span className="font-mono text-[10px] text-zinc-400 tracking-widest uppercase">Thumbnails</span>
                      <span className="ml-auto font-mono text-[10px] text-zinc-600">{totalImages} images</span>
                      <button
                        onClick={() => setShowThumbnails(false)}
                        aria-label="关闭缩略图"
                        className="ml-1 w-6 h-6 rounded-full flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/10 transition-all duration-200"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div
                      ref={thumbnailStripRef}
                      className="flex gap-2 overflow-x-auto max-w-[80vw] md:max-w-[600px] pb-1 custom-scrollbar"
                    >
                      {images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            scrollToImage(idx);
                            setShowThumbnails(false);
                          }}
                          aria-label={`跳转到第 ${idx + 1} 张图片`}
                          className={`relative flex-shrink-0 w-20 h-14 md:w-24 md:h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                            idx === currentImageIndex
                              ? "border-blue-500 ring-2 ring-blue-500/30"
                              : "border-zinc-700 hover:border-zinc-500 opacity-60 hover:opacity-100"
                          }`}
                        >
                          {thumbnailsRendered ? (
                            <Image
                              src={img}
                              alt={`缩略图 ${idx + 1}`}
                              fill
                              unoptimized
                              sizes="96px"
                              className="object-cover"
                              loading={idx < 5 ? "eager" : "lazy"}
                            />
                          ) : (
                            <div className="w-full h-full bg-zinc-800" />
                          )}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent">
                            <span className="block text-center font-mono text-[9px] text-white py-0.5">
                              {String(idx + 1).padStart(2, "0")}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
