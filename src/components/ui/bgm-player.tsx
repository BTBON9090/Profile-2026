// src/components/ui/bgm-player.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { usePathname } from "next/navigation"; // 👈 1. 引入路由钩子

// 定义你的播放列表 (请确保 public/music 下有这些文件)
const PLAYLIST =[
  "/music/张杰_天下_145913448.mp3",
  "/music/轻歌络翼 - 落英.mp3",
  // "/music/track-3.mp3",
];

// 👇 新增一个提取文件名的辅助函数
// 它会把 "/music/Interstellar_Theme.mp3" 变成 "Interstellar_Theme"
const getTrackName = (path: string) => {
  // 1. 获取最后一个 '/' 之后的内容
  const fileName = path.split("/").pop() || path;
  // 2. 去掉后缀名 (比如 .mp3, .ogg)
  return fileName.split(".")[0];
};

export default function BgmPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const[currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);
  
  // 👈 2. 获取当前路径
  const pathname = usePathname(); 

  useEffect(() => {
    const checkDevice = () => window.innerWidth >= 768;
    setIsDesktop(checkDevice());
    if (!checkDevice()) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(PLAYLIST[0]);
      audioRef.current.volume = 0.4;
    }
    const audio = audioRef.current;

    const handleEnded = () => {
      setCurrentTrackIndex((prev) => {
        const nextIndex = (prev + 1) % PLAYLIST.length;
        audio.src = PLAYLIST[nextIndex];
        safePlay(audio);
        return nextIndex;
      });
    };
    audio.addEventListener("ended", handleEnded);

    const safePlay = (audioElement: HTMLAudioElement) => {
      if (playPromiseRef.current !== null) return;
      const playPromise = audioElement.play();
      if (playPromise !== undefined) {
        playPromiseRef.current = playPromise;
        playPromise
          .then(() => { setIsPlaying(true); playPromiseRef.current = null; })
          .catch((error) => {
            if (error.name !== "AbortError") console.log("Autoplay blocked", error);
            setIsPlaying(false); playPromiseRef.current = null;
          });
      }
    };

    safePlay(audio);

    const unlockAudio = () => {
      if (audioRef.current && audioRef.current.paused) safePlay(audioRef.current);
      document.removeEventListener("click", unlockAudio);
      document.removeEventListener("keydown", unlockAudio);
    };

    document.addEventListener("click", unlockAudio);
    document.addEventListener("keydown", unlockAudio);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      document.removeEventListener("click", unlockAudio);
      document.removeEventListener("keydown", unlockAudio);
      audio.pause();
    };
  },[]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      playPromiseRef.current = null; 
    } else {
      if (playPromiseRef.current !== null) return;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromiseRef.current = playPromise;
        playPromise
          .then(() => { setIsPlaying(true); playPromiseRef.current = null; })
          .catch((e) => {
            if (e.name !== "AbortError") console.error("Play failed:", e);
            setIsPlaying(false); playPromiseRef.current = null;
          });
      }
    }
  };

  if (!isDesktop) return null;

  // ==============================================================
  // 🟢 3. 动态主题感知逻辑
  // 务必把你所有的“白底项目”的路径都加在这里（跟你 Navbar 里保持一致）
  // ==============================================================
  const isLightTheme = pathname === "/work/light-branding" || pathname === "/work/ciliju-xing";

  // 根据背景动态提取样式
  const btnBgClass = isLightTheme 
    ? "bg-black border-zinc-900 shadow-[0_8px_30px_rgba(0,0,0,0.4)]" // 白底：干净的白底灰边 + 柔和投影
    : "bg-black/50 border-white/30 shadow-[0_0_20px_rgba(0,0,0,0.8)]";   // 黑底：深邃的黑底发光

  const iconClass = isLightTheme 
    ? "text-zinc-500 group-hover:text-white"  // 白底：深灰图标
    : "text-zinc-500 group-hover:text-white"; // 黑底：浅灰图标

  const statusTextClass = isLightTheme ? "text-zinc-900" : "text-zinc-400";
  const trackTextClass = isLightTheme ? "text-zinc-500" : "text-zinc-500 opacity-80";

  // 👇 获取当前正在播放的真实曲目名
  const currentTrackName = getTrackName(PLAYLIST[currentTrackIndex]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 1 }}
      className="fixed bottom-8 left-8 z-50 hidden md:flex items-center gap-3"
    >
      <button
        onClick={togglePlay}
        className={`group relative flex items-center justify-center w-12 h-12 rounded-full backdrop-blur-xl border overflow-hidden transition-transform hover:scale-105 ${btnBgClass}`}
      >
        <div className={`absolute inset-0 bg-blue-500/10 blur-md transition-opacity ${isPlaying ? "opacity-100" : "opacity-0"}`}></div>
        
        {isPlaying ? (
          <div className="relative z-10 flex items-end gap-[3px] h-4">
            <motion.div animate={{ height:["4px", "14px", "4px"] }} transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }} className="w-1 bg-blue-400 rounded-sm"></motion.div>
            <motion.div animate={{ height:["12px", "4px", "16px", "12px"] }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }} className="w-1 bg-purple-400 rounded-sm"></motion.div>
            <motion.div animate={{ height:["6px", "16px", "6px"] }} transition={{ duration: 1.0, repeat: Infinity, ease: "easeInOut" }} className="w-1 bg-blue-400 rounded-sm"></motion.div>
          </div>
        ) : (
          <VolumeX className={`relative z-10 w-5 h-5 transition-colors ${iconClass}`} />
        )}
      </button>

      {/* 👇 动态渲染提取出的真实曲目名 */}
      <div className="font-mono text-[10px] uppercase tracking-widest flex flex-col">
        <span className={statusTextClass}>{isPlaying ? "Audio.Playing" : "Audio.Paused"}</span>
        <span className={`${trackTextClass} truncate max-w-[150px]`} title={currentTrackName}>
          {currentTrackName}
        </span>
      </div>
      
    </motion.div>
  );
}