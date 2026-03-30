// src/components/ui/bgm-player.tsx
"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { VolumeX, SkipForward } from "lucide-react";
import { usePathname } from "next/navigation"; 

// ==========================================
// 1. 云端播放列表 (CDN 数据源)
// ==========================================
const CDN_BASE = "https://cdn.btbon.cn/music";

// 以后加歌，只需要在这里加一行对象即可
const PLAYLIST =[
  { url: `${CDN_BASE}/BLACKPINK_As_If_It’s_Your_Last.mp3`, title: "As If It's Your Last", artist: "BLACKPINK" },
  { url: `${CDN_BASE}/BLACKPINK_DDU_DU_DDU_DU.mp3`, title: "DDU DU DDU DU", artist: "BLACKPINK" },
  { url: `${CDN_BASE}/BLACKPINK_Kill_This_Love.mp3`, title: "Kill This Love", artist: "BLACKPINK" },
  { url: `${CDN_BASE}/Bruno_Mars_I_Just_Might.mp3`, title: "I Just Might", artist: "Bruno Mars" },
  { url: `${CDN_BASE}/G.E.M._邓紫棋_桃花诺.mp3`, title: "桃花诺", artist: "G.E.M. 邓紫棋" },
  { url: `${CDN_BASE}/Jessie_J_u0026Ariana_Grande_u0026Nicki_Minaj_Bang_Bang.mp3`, title: "Bang Bang", artist: "Jessie J, Ariana Grande, Nicki Minaj" },
  { url: `${CDN_BASE}/Justin_Bieber_Ludacris_Baby.mp3`, title: "Baby", artist: "Justin Bieber, Ludacris" },
  { url: `${CDN_BASE}/Lady_Gaga_u0026Bruno_Mars_Die_With_A_Smile.mp3`, title: "Die With A Smile", artist: "Lady Gaga, Bruno Mars" },
  { url: `${CDN_BASE}/Lil_Nas_X_STAR_WALKIN_apos;.mp3`, title: "STAR WALKIN'", artist: "Lil Nas X" },
  { url: `${CDN_BASE}/Linkin_Park_Heavy_Is_the_Crown.mp3`, title: "Heavy Is the Crown", artist: "Linkin Park" },
  { url: `${CDN_BASE}/Luis_Fonsi_u0026Daddy_Yankee_u0026Justin_Bieber_Despacito.mp3`, title: "Despacito", artist: "Luis Fonsi, Daddy Yankee, Justin Bieber" },
  { url: `${CDN_BASE}/NewJeans-登神-GODS.mp3`, title: "登神 (GODS)", artist: "NewJeans" },
  { url: `${CDN_BASE}/Rachid_Boutaicha_Midnight_Whisper.mp3`, title: "Midnight Whisper", artist: "Rachid Boutaicha" },
  { url: `${CDN_BASE}/STARS.mp3`, title: "POP/STARS", artist: "K/DA" },
  { url: `${CDN_BASE}/Supaderb_Neon_Nights.mp3`, title: "Neon Nights", artist: "Supaderb" },
  { url: `${CDN_BASE}/Taylor_Swift_Blank_Space_(Taylor_apos;s_Version).mp3`, title: "Blank Space (Taylor's Version)", artist: "Taylor Swift" },
  { url: `${CDN_BASE}/Taylor_Swift_I_Knew_You_Were_Trouble.mp3`, title: "I Knew You Were Trouble", artist: "Taylor Swift" },
  { url: `${CDN_BASE}/Taylor_Swift_Love_Story.mp3`, title: "Love Story", artist: "Taylor Swift" },
  { url: `${CDN_BASE}/Taylor_Swift_Opalite.mp3`, title: "Opalite", artist: "Taylor Swift" },
  { url: `${CDN_BASE}/Taylor_Swift_Shake_It_Off.mp3`, title: "Shake It Off", artist: "Taylor Swift" },
  { url: `${CDN_BASE}/Taylor_Swift_Style.mp3`, title: "Style", artist: "Taylor Swift" },
  { url: `${CDN_BASE}/Taylor_Swift_The_Fate_of_Ophelia.mp3`, title: "The Fate of Ophelia", artist: "Taylor Swift" },
  { url: `${CDN_BASE}/The_Kid_LAROI_u0026Justin_Bieber_STAY.mp3`, title: "STAY (Explicit)", artist: "The Kid LAROI, Justin Bieber" },
  { url: `${CDN_BASE}/The_Weeknd_After_Hours.mp3`, title: "After Hours", artist: "The Weeknd" },
  { url: `${CDN_BASE}/X_u0026EJAE_u0026AUDREY_NUNA_u0026REI_AMI_u0026KPop_Demon_Hunters_Cast_Golden.mp3`, title: "KPop", artist: "X, JAE, AUDREY NUNA, REL AMI" },
  { url: `${CDN_BASE}/周杰伦_菊花台.mp3`, title: "菊花台", artist: "周杰伦" },
  { url: `${CDN_BASE}/周深_璀璨冒险人.mp3`, title: "璀璨冒险人", artist: "周深" },
  { url: `${CDN_BASE}/张芸京_偏爱.mp3`, title: "偏爱", artist: "张芸京" },
  { url: `${CDN_BASE}/胡歌_六月的雨.mp3`, title: "六月的雨", artist: "胡歌" },
  { url: `${CDN_BASE}/胡歌_忘记时间.mp3`, title: "忘记时间", artist: "胡歌" },
  { url: `${CDN_BASE}/胡歌_逍遥叹.mp3`, title: "逍遥叹", artist: "胡歌" },
  { url: `${CDN_BASE}/英雄联盟_u0026G.E.M._邓紫棋_Sacrifice_(争).mp3`, title: "Sacrifice (争)", artist: "英雄联盟, G.E.M. 邓紫棋" },
  { url: `${CDN_BASE}/英雄联盟_u0026MAX_u0026Jeremy_McKinnon_u0026HENRY刘宪华_Take_Over.mp3`, title: "Physically Electric", artist: "英雄联盟, MAX, Jeremy McKinnon, HENRY 刘宪华" },
  { url: `${CDN_BASE}/英雄联盟_不可阻挡_(Burn_It_All_Down).mp3`, title: "不可阻挡 (Burn It All Down)", artist: "英雄联盟" },
  { url: `${CDN_BASE}/英雄联盟_涅槃_(Phoenix).mp3`, title: "涅槃 (Phoenix)", artist: "英雄联盟" },
  { url: `${CDN_BASE}/阿桑_一直很安静.mp3`, title: "一直很安静", artist: "阿桑" },
  { url: `${CDN_BASE}/陈子晴_偏向.mp3`, title: "偏向", artist: "陈子晴" },
  { url: `${CDN_BASE}/青鸟飞鱼_此生不换.mp3`, title: "此生不换", artist: "青鸟飞鱼" },
];

// ==========================================
// 2. 主播放器组件
// ==========================================
export default function BgmPlayer() {
  const[isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  
  const pathname = usePathname(); 
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const trackIndexRef = useRef(0); 

  // ==========================================
  // 核心逻辑：播放下一首
  // ==========================================
  const playNextTrack = useCallback(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    
    // 计算下一首的索引
    const nextIndex = (trackIndexRef.current + 1) % PLAYLIST.length;
    
    trackIndexRef.current = nextIndex;
    setCurrentTrackIndex(nextIndex);
    
    // 加载 CDN 的新资源
    audio.src = PLAYLIST[nextIndex].url;
    audio.load();
    audio.play().catch(console.error);
  },[]);

  // ==========================================
  // 核心播放引擎初始化
  // ==========================================
  useEffect(() => {
    const checkDevice = () => window.innerWidth >= 768;
    setIsDesktop(checkDevice());
    if (!checkDevice()) return;

    // 初始随机选歌
    const initialIndex = Math.floor(Math.random() * PLAYLIST.length);
    trackIndexRef.current = initialIndex;
    setCurrentTrackIndex(initialIndex);

    // 实例化 Audio
    if (!audioRef.current) {
      audioRef.current = new Audio(PLAYLIST[initialIndex].url);
      audioRef.current.volume = 0.4;
    } else {
      audioRef.current.src = PLAYLIST[initialIndex].url;
    }

    const audio = audioRef.current;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => playNextTrack();

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    // ========================================================
    // 🗑️ 请把下面这整段“静默自动播放”和“解锁”的代码全部删掉！
    // ========================================================
    /* 
    audio.play().catch(() => {
      const unlockAudio = () => {
        audio.play().catch(() => {});
        document.removeEventListener("click", unlockAudio);
        document.removeEventListener("keydown", unlockAudio);
      };
      document.addEventListener("click", unlockAudio);
      document.addEventListener("keydown", unlockAudio);
    });
    */
    // ================== 删掉上面这段 ==========================

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  },[playNextTrack]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  };

  if (!isDesktop) return null;

  // ==============================================================
  // 3. 动态主题与数据绑定
  // ==============================================================
  const isLightTheme = pathname === "/work/light-branding" || pathname === "/work/ciliju-xing";

  const btnBgClass = isLightTheme 
    ? "bg-white border-zinc-200 shadow-[0_8px_30px_rgba(0,0,0,0.1)] hover:bg-zinc-50" 
    : "bg-black/50 border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-xl hover:bg-black/80";

  const iconClass = isLightTheme ? "text-zinc-600 group-hover:text-black" : "text-zinc-500 group-hover:text-white"; 
  const statusTextClass = isLightTheme ? "text-zinc-800" : "text-zinc-400";
  const trackTextClass = isLightTheme ? "text-zinc-500" : "text-zinc-400 opacity-80";
  const nextBtnClass = isLightTheme ? "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100" : "text-zinc-500 hover:text-white hover:bg-white/10";

  // 获取当前播放的歌曲信息
  const currentTrack = PLAYLIST[currentTrackIndex];
  const trackDisplayText = `${currentTrack.title} - ${currentTrack.artist}`;

  return (
    <>
      {/* 🔴 核心黑科技：注入无缝滚动动画 CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scroll-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-25%); } /* 滚动 1/4 的总宽度 (因为我们复制了4份文本) */
        }
        .animate-marquee {
          animation: scroll-marquee 10s linear infinite;
        }
        /* 鼠标悬停时暂停滚动 */
        .group\\/player:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="fixed bottom-8 left-8 z-[99999] hidden md:flex items-center gap-3 group/player"
      >
        {/* 左侧：播放/暂停控制 */}
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

        {/* 中间：受控宽度的信息展示区 */}
        <div className="font-mono text-[10px] uppercase tracking-widest flex flex-col justify-center">
          <span className={`font-semibold mb-0.5 ${statusTextClass}`}>
            {isPlaying ? "Audio.Playing" : "Audio.Paused"}
          </span>
          
          {/* 🔴 跑马灯视窗 (固定最大宽度 120px，左右边缘羽化渐隐) */}
          <div 
            className="relative w-[120px] overflow-hidden whitespace-nowrap"
            style={{
              // 边缘羽化遮罩，让文字看起来是“淡出”而不是被生硬切断的
              maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
            }}
          >
            {/* 滚动的物理长带 */}
            <div className="flex w-max animate-marquee">
              {/* 复制 4 份确保跑马灯永远不会出现断层 */}
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <span className={`${trackTextClass}`}>{trackDisplayText}</span>
                  <span className="mx-3 text-zinc-600 opacity-50">•</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧：手动切歌按钮 */}
        <button
          onClick={playNextTrack}
          className={`ml-1 p-2 rounded-full transition-all duration-300 opacity-60 group-hover/player:opacity-100 ${nextBtnClass}`}
          title="Next Track"
        >
          <SkipForward className="w-4 h-4" />
        </button>
        
      </motion.div>
    </>
  );
}