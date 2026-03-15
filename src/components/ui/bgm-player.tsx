// src/components/ui/bgm-player.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { usePathname } from "next/navigation"; 

// ==========================================
// 1. 播放列表与辅助函数
// ==========================================
const PLAYLIST =[
  "/music/张杰_天下_145913448.mp3",
  "/music/轻歌络翼 - 落英.mp3",
];

const getTrackName = (path: string) => {
  const fileName = path.split("/").pop() || path;
  return fileName.split(".")[0];
};

// ==========================================
// 2. 主播放器组件
// ==========================================
export default function BgmPlayer() {
  // --- 状态管理 ---
  const [isPlaying, setIsPlaying] = useState(false);
  const[currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  
  const pathname = usePathname(); 
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // --- 核心播放引擎 ---
  useEffect(() => {
    // 检测是否为桌面端
    const checkDevice = () => window.innerWidth >= 768;
    setIsDesktop(checkDevice());
    if (!checkDevice()) return;

    // 单例模式：只在第一次挂载时初始化 Audio 对象
    if (!audioRef.current) {
      audioRef.current = new Audio(PLAYLIST[0]);
      audioRef.current.volume = 0.4;
    }

    const audio = audioRef.current;

    // 👇 极其干净的原生事件监听器 (让 Audio 告诉 React 到底在干嘛)
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    
    // 👇 完美的自动切歌逻辑
    const handleEnded = () => {
      setCurrentTrackIndex((prev) => {
        const nextIndex = (prev + 1) % PLAYLIST.length;
        audio.src = PLAYLIST[nextIndex];
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(console.error);
        }
        return nextIndex;
      });
    };

    // 绑定原生事件
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    // 尝试静默自动播放
    audio.play().catch(() => {
      // 如果被浏览器拦截，开启“幽灵解锁”监听
      console.log("Autoplay blocked, waiting for user interaction...");
      const unlockAudio = () => {
        audio.play().catch(() => {});
        document.removeEventListener("click", unlockAudio);
        document.removeEventListener("keydown", unlockAudio);
      };
      document.addEventListener("click", unlockAudio);
      document.addEventListener("keydown", unlockAudio);
    });

    // 卸载组件时清理事件监听
    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      // 注意：千万不要在这里写 audio.pause()！否则在 Next.js Strict Mode 下会自动停播！
    };
  },[]);

  // --- 控制开关 ---
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    // 直接操作物理对象，原生事件监听器会自动去修改 isPlaying 状态！
    if (audio.paused) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  };

  if (!isDesktop) return null;

  // ==============================================================
  // 3. 动态主题感知逻辑 (保留你的完美设计)
  // ==============================================================
  const isLightTheme = pathname === "/work/light-branding" || pathname === "/work/ciliju-xing";

  const btnBgClass = isLightTheme 
    ? "bg-white border-zinc-200 shadow-[0_8px_30px_rgba(0,0,0,0.1)] hover:bg-zinc-50" 
    : "bg-black/50 border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-xl hover:bg-black/80";

  const iconClass = isLightTheme 
    ? "text-zinc-600 group-hover:text-black"  
    : "text-zinc-500 group-hover:text-white"; 

  const statusTextClass = isLightTheme ? "text-zinc-800" : "text-zinc-400";
  const trackTextClass = isLightTheme ? "text-zinc-500" : "text-zinc-500 opacity-80";

  const currentTrackName = getTrackName(PLAYLIST[currentTrackIndex]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 1 }}
      className="fixed bottom-8 left-8 z-[99999] hidden md:flex items-center gap-3"
    >
      <button
        onClick={togglePlay}
        className={`group relative flex items-center justify-center w-12 h-12 rounded-full border overflow-hidden transition-all duration-300 hover:scale-105 ${btnBgClass}`}
      >
        <div className={`absolute inset-0 bg-blue-500/10 blur-md transition-opacity duration-500 ${isPlaying ? "opacity-100" : "opacity-0"}`}></div>
        
        {isPlaying ? (
          <div className="relative z-10 flex items-end gap-[3px] h-4">
            <motion.div animate={{ height:["4px", "14px", "4px"] }} transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }} className={`w-1 rounded-sm ${isLightTheme ? "bg-blue-500" : "bg-blue-400"}`}></motion.div>
            <motion.div animate={{ height:["12px", "4px", "16px", "12px"] }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }} className={`w-1 rounded-sm ${isLightTheme ? "bg-indigo-500" : "bg-purple-400"}`}></motion.div>
            <motion.div animate={{ height:["6px", "16px", "6px"] }} transition={{ duration: 1.0, repeat: Infinity, ease: "easeInOut" }} className={`w-1 rounded-sm ${isLightTheme ? "bg-blue-500" : "bg-blue-400"}`}></motion.div>
          </div>
        ) : (
          <VolumeX className={`relative z-10 w-5 h-5 transition-colors ${iconClass}`} />
        )}
      </button>

      <div className="font-mono text-[10px] uppercase tracking-widest flex flex-col justify-center">
        <span className={`font-semibold ${statusTextClass}`}>{isPlaying ? "Audio.Playing" : "Audio.Paused"}</span>
        <span className={`${trackTextClass} truncate max-w-[160px]`} title={currentTrackName}>
          {currentTrackName}
        </span>
      </div>
      
    </motion.div>
  );
}