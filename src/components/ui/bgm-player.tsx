// src/components/ui/bgm-player.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

// 定义你的播放列表 (请确保 public/music 下有这些文件)
const PLAYLIST =[
  "/music/张杰_天下_145913448.mp3",
  "/music/轻歌络翼 - 落英.mp3",
  // "/music/track-3.mp3",
];

export default function BgmPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const[currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 1. 客户端挂载后：检测设备 & 尝试自动播放
  useEffect(() => {
    // 仅在宽度 >= 768px (MD) 的桌面端启用该功能
    const checkDevice = () => window.innerWidth >= 768;
    setIsDesktop(checkDevice());

    if (!checkDevice()) return; // 移动端直接不初始化音频

    // 初始化 Audio 对象
    if (!audioRef.current) {
      audioRef.current = new Audio(PLAYLIST[0]);
      audioRef.current.volume = 0.4; // 默认音量 40%，舒缓不刺耳
    }

    const audio = audioRef.current;

    // 监听当前歌曲播放完毕，自动切下一首
    const handleEnded = () => {
      setCurrentTrackIndex((prev) => {
        const nextIndex = (prev + 1) % PLAYLIST.length;
        audio.src = PLAYLIST[nextIndex];
        audio.play().catch(console.error); // 继续播放下一首
        return nextIndex;
      });
    };

    audio.addEventListener("ended", handleEnded);

    // 核心：尝试自动播放
    // 浏览器可能会拦截，所以必须 catch DOMException
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true); // 自动播放成功
        })
        .catch((error) => {
          console.log("Autoplay blocked by browser. User interaction needed.", error);
          setIsPlaying(false); // 被拦截，等待用户手动点击
        });
    }

    // 监听全局用户的第一次交互（点击/按键），如果之前被拦截，则静默恢复播放
    const unlockAudio = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
      // 成功解锁后移除监听，节约性能
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

  // 2. 手动切换播放/暂停状态
  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(console.error);
    }
  };

  // 如果不是桌面端，直接不渲染 DOM
  if (!isDesktop) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 1 }}
      // 固定在左下角，避开左侧中间的侧边栏
      className="fixed bottom-8 left-8 z-50 hidden md:flex items-center gap-3"
    >
      <button
        onClick={togglePlay}
        className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-black/50 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden transition-transform hover:scale-105"
      >
        {/* 背景微光 */}
        <div className={`absolute inset-0 bg-blue-500/20 blur-md transition-opacity ${isPlaying ? "opacity-100" : "opacity-0"}`}></div>
        
        {isPlaying ? (
          // 播放状态：动态律动频谱 (Equalizer)
          <div className="relative z-10 flex items-end gap-[3px] h-4">
            <motion.div animate={{ height:["4px", "14px", "4px"] }} transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }} className="w-1 bg-blue-400 rounded-sm"></motion.div>
            <motion.div animate={{ height:["12px", "4px", "16px", "12px"] }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }} className="w-1 bg-purple-400 rounded-sm"></motion.div>
            <motion.div animate={{ height: ["6px", "16px", "6px"] }} transition={{ duration: 1.0, repeat: Infinity, ease: "easeInOut" }} className="w-1 bg-blue-400 rounded-sm"></motion.div>
          </div>
        ) : (
          // 暂停状态：静音图标
          <VolumeX className="relative z-10 w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
        )}
      </button>

      {/* 极客风格的状态提示文字 */}
      <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 flex flex-col">
        <span className="text-zinc-400">{isPlaying ? "Audio.Playing" : "Audio.Paused"}</span>
        <span className="opacity-50">Ambient_Track_{currentTrackIndex + 1}.mp3</span>
      </div>
    </motion.div>
  );
}