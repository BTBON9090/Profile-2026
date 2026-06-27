// src/components/sections/snow-ecosystem.tsx
"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Globe, Play, Eye, Shield, Layers } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import UniversalModal from "@/components/ui/UniversalModal";
import snownewtabData from "@/data/work/snownewtab";

export default function SnowEcosystem() {
  const { t } = useI18n();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const seekToPosition = useCallback((clientX: number) => {
    if (!videoRef.current || !progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const percent = Math.max(0, Math.min(1, clickX / rect.width));
    videoRef.current.currentTime = percent * duration;
    setProgress(percent * 100);
    setCurrentTime(percent * duration);
  }, [duration]);

  const handleProgressMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    seekToPosition(e.clientX);
  };

  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      seekToPosition(e.clientX);
    };
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, seekToPosition]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.duration && !isDragging) {
        setProgress((video.currentTime / video.duration) * 100);
        setCurrentTime(video.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("ended", handleEnded);
    };
  }, [isDragging]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const highlights = [
    {
      icon: Shield,
      label: "终端轻量 · 业务免改造",
      desc: "Chromium 内核无需驱动 · 正向代理业务零改造 · 静默安装推广零成本",
    },
    {
      icon: Layers,
      label: "双端组件库",
      desc: "原生浏览器端 + 浏览器后台 Web 端 · Figma Variables 统一 Design Token",
    },
  ];

  return (
    <>
      <section id="snow-ecosystem" className="min-h-screen w-full bg-[rgba(10,10,10,0.9)] backdrop-blur-[2px] relative z-10 overflow-hidden py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 relative z-10">
          {/* 章节标题 */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-12 md:mb-16"
          >
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-blue-500 tracking-widest">04</span>
              <span className="h-px w-12 bg-zinc-800"></span>
              <span className="font-mono text-xs text-zinc-500 tracking-[0.2em] uppercase">KEY CASE / SNOW</span>
            </div>
            <span className="font-mono text-[10px] text-zinc-700 tracking-widest hidden md:block">2024 — 2026</span>
          </motion.div>

          {/* 标题区 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 md:mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                <span className="text-blue-400 font-mono text-xs tracking-wider uppercase">
                  {t.snowEcosystem.badge}
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-zinc-100 tracking-tight leading-[0.9] mb-6">
                {t.snowEcosystem.title}<span className="text-blue-500">.</span>
                <br />
                <span className="text-zinc-600 mt-2 block">{t.snowEcosystem.titleSuffix}</span>
              </h2>
              <p className="text-sm md:text-base text-zinc-400 leading-relaxed max-w-xl mb-8">
                {t.snowEcosystem.description}
              </p>

              {/* CTA 按钮组 */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setShowModal(true)}
                  className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 hover:border-blue-500/50 transition-all duration-300 cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-mono font-bold text-blue-300 group-hover:text-white uppercase tracking-wider">
                    查看项目
                  </span>
                </button>
                <a
                  href="https://www.snowtech.com.cn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800 transition-all duration-300 cursor-pointer"
                >
                  <Globe className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm font-mono font-bold text-zinc-300 group-hover:text-white uppercase tracking-wider">
                    {t.snowEcosystem.visitWebsite}
                  </span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </motion.div>

            {/* 右侧 - 核心数据 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-6 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="group relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 border border-zinc-800/50 hover:border-blue-500/40 transition-all duration-500"
                >
                  {/* 背景装饰 - 大号序号 */}
                  <span className="absolute -top-2 -right-2 text-[5rem] font-black text-white/[0.03] select-none pointer-events-none group-hover:text-blue-500/[0.05] transition-colors duration-500">
                    0{idx + 1}
                  </span>

                  {/* 顶部渐变线 */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden md:block" />

                  <div className="relative p-4 md:p-5">
                    {/* 图标 + 标签 */}
                    <div className="flex items-center justify-between mb-8 md:mb-12">
                      <div className="relative">
                        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                          <item.icon className="w-5 h-5 text-blue-400" />
                        </div>
                      </div>
                    </div>

                    {/* 标题 */}
                    <h3 className="text-2xl font-bold text-zinc-100 mb-4 group-hover:text-white transition-colors">
                      {item.label}
                    </h3>

                    {/* 底部装饰线 */}
                    <div className="mt-4 mb-4 h-px bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 w-0 group-hover:w-full transition-all duration-500 hidden md:block" />

                    {/* 描述 */}
                    <p className="text-sm text-zinc-500 font-mono leading-relaxed group-hover:text-zinc-400 transition-colors">
                      {item.desc}
                    </p>

                    
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* 视频展示区 - 全宽无浏览器头部 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative rounded-[8px] md:rounded-2xl overflow-hidden border border-zinc-800/40 bg-black">
              {/* 视频区域 - 不用object-cover，让视频自适应 */}
              <div className="relative w-full bg-zinc-950">
                <video
                  ref={videoRef}
                  src="https://cdn.btbon.cn/home/newt.mov"
                  muted
                  playsInline
                  loop
                  className="w-full h-auto block"
                />

                {/* 播放按钮 - 仅在暂停时显示 */}
                {!isPlaying && (
                  <button
                    onClick={togglePlay}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors group"
                  >
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-black/10 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-white/20 transition-transform duration-300">
                      <Play className="w-7 h-7 md:w-8 md:h-8 text-white ml-1" />
                    </div>
                  </button>
                )}

                {/* 点击视频暂停 */}
                {isPlaying && (
                  <button
                    onClick={togglePlay}
                    className="absolute inset-0 cursor-pointer opacity-0 hover:opacity-100 transition-opacity duration-300"
                  >
                    <div className="absolute inset-0 bg-black/10"></div>
                  </button>
                )}
              </div>

              {/* 进度条 - 白色，实时拖动 */}
              <div className="relative bg-zinc-900 px-4 py-3 flex items-center gap-3">
                <span className="font-mono text-[10px] text-zinc-500 w-10 text-right">{formatTime(currentTime)}</span>
                <div
                  ref={progressRef}
                  onMouseDown={handleProgressMouseDown}
                  className="flex-1 h-1 bg-zinc-800 rounded-full cursor-pointer group/progress relative"
                >
                  <div
                    className="h-full bg-white rounded-full"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity"></div>
                  </div>
                </div>
                <span className="font-mono text-[10px] text-zinc-500 w-10">{formatTime(duration)}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Project Modal */}
      {showModal && (
        <UniversalModal
          isOpen={true}
          onClose={() => setShowModal(false)}
          title="雪诺企业安全浏览器"
          images={snownewtabData.behanceSlices}
          hasPrev={false}
          hasNext={false}
          onPrev={() => {}}
          onNext={() => {}}
          projectId="snownewtab"
          isCompanyProject={true}
        />
      )}
    </>
  );
}
