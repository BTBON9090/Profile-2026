// src/components/ui/bgm-player.tsx
"use client";
import { useState, useEffect, useRef, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, SkipBack, SkipForward, Repeat, Repeat1,
  ListMusic, X, Music,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useAudio } from "@/lib/audio-context";
import { PLAYLIST } from "@/data/playlist";
import { useDraggableSnap } from "@/lib/use-draggable-snap";

type PlayerMode = "minimized" | "expanded";

// 展开面板宽度（吸附宽度基准，确保左右贴边展开均完整可见）
const EXPANDED_W = 320;
const MINIMIZED_W = 48;

/**
 * PlayerProgress — 高频更新隔离组件
 * 单独订阅 currentTime / duration，避免整个播放器每帧重渲染（拖拽时不卡）。
 */
const PlayerProgress = memo(function PlayerProgress({
  currentTime,
  duration,
  seek,
  isLightTheme,
  mutedTextClass,
}: {
  currentTime: number;
  duration: number;
  seek: (t: number) => void;
  isLightTheme: boolean;
  mutedTextClass: string;
}) {
  const formatTime = (s: number) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="px-4 pb-2">
      <div
        className="relative h-1 rounded-full bg-white/8 cursor-pointer group/progress"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const percent = (e.clientX - rect.left) / rect.width;
          seek(percent * duration);
        }}
      >
        <div
          className="absolute top-0 left-0 h-full rounded-full bg-zinc-200/90"
          style={{ width: `${progressPercent}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-sm opacity-0 group-hover/progress:opacity-100 transition-opacity"
          style={{ left: `${progressPercent}%` }}
        />
      </div>
      <div className="flex justify-between mt-1.5">
        <span className={`text-[9px] font-mono tabular-nums ${mutedTextClass}`}>
          {formatTime(currentTime)}
        </span>
        <span className={`text-[9px] font-mono tabular-nums ${isLightTheme ? "text-zinc-400" : "text-zinc-600"}`}>
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
});

export default function BgmPlayer() {
  const {
    isPlaying,
    isDesktop,
    currentTrack,
    currentTime,
    duration,
    currentTrackIndex,
    repeatMode,
    togglePlay,
    playNextTrack,
    playPrevTrack,
    seek,
    toggleRepeatMode,
    selectTrack,
  } = useAudio();
  const pathname = usePathname();

  const [mode, setMode] = useState<PlayerMode>("minimized");
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const [hoveredTrack, setHoveredTrack] = useState<number | null>(null);

  const autoMinimizeTimer = useRef<NodeJS.Timeout | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef(false);

  // ==========================================
  // 拖拽贴边 — 吸附宽度由 hook 动态读取元素实际 offsetWidth
  // ==========================================
  const playerRef = useRef<HTMLDivElement>(null);
  const hasWindow = typeof window !== "undefined";
  const drag = useDraggableSnap(
    playerRef,
    hasWindow ? 1 : 0,
    hasWindow ? window.innerHeight - 240 : 0, // 默认靠下，距离底部 240px
  );

  const onLeftSide = drag.snapSide === "left";
  // 拖拽中→圆形；贴边态→半圆半方（贴边侧方角、外侧圆角）
  const bubbleShapeClass = drag.isDragging
    ? "rounded-full"
    : onLeftSide
      ? "rounded-r-full"
      : "rounded-l-full";

  // ==========================================
  // Auto-minimize：hover 时不自动收起，离开后 3s 收起
  // ==========================================
  const clearAutoMinimize = useCallback(() => {
    if (autoMinimizeTimer.current) {
      clearTimeout(autoMinimizeTimer.current);
      autoMinimizeTimer.current = null;
    }
  }, []);

  const scheduleAutoMinimize = useCallback(() => {
    clearAutoMinimize();
    autoMinimizeTimer.current = setTimeout(() => {
      setMode("minimized");
    }, 3000);
  }, [clearAutoMinimize]);

  useEffect(() => {
    return () => clearAutoMinimize();
  }, [clearAutoMinimize]);

  // Close playlist on outside click
  useEffect(() => {
    if (!playlistOpen) return;
    const onClick = (e: MouseEvent) => {
      if (listRef.current && !listRef.current.contains(e.target as Node)) {
        setPlaylistOpen(false);
      }
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [playlistOpen]);

  if (!isDesktop) return null;
  if (!currentTrack) return null;

  const isLightTheme = pathname === "/work/light-branding" || pathname === "/work/ciliju-xing";

  const accentClass = isLightTheme ? "text-zinc-800" : "text-zinc-100";
  const mutedTextClass = isLightTheme ? "text-zinc-500" : "text-zinc-400";
  const panelBgClass = isLightTheme
    ? "bg-white/90 border-zinc-200"
    : "bg-zinc-950/95 border-white/10";
  const hoverBtnClass = isLightTheme
    ? "hover:bg-zinc-100 text-zinc-600"
    : "hover:bg-white/8 text-zinc-400";

  // 播放列表位置（触边自适应）：
  // - 水平：放在播放器外侧（贴左→列表在右；贴右→列表在左）
  // - 垂直：与播放器顶部对齐，根据剩余空间 clamp
  const PLAYLIST_W = 320;
  const PLAYLIST_GAP = 12;
  const playerW = mode === "minimized" ? MINIMIZED_W : EXPANDED_W;
  let playlistLeft: number;
  if (onLeftSide) {
    playlistLeft = drag.position.x + playerW + PLAYLIST_GAP;
  } else {
    playlistLeft = drag.position.x - PLAYLIST_W - PLAYLIST_GAP;
  }
  if (hasWindow) {
    const vw = window.innerWidth;
    if (playlistLeft + PLAYLIST_W > vw - 16) playlistLeft = vw - PLAYLIST_W - 16;
    if (playlistLeft < 16) playlistLeft = 16;
  }

  const PLAYLIST_H = 420;
  const playerTop = drag.position.y;
  let playlistTop: number;
  if (hasWindow) {
    const vh = window.innerHeight;
    let top = playerTop;
    if (top + PLAYLIST_H > vh - 16) top = vh - PLAYLIST_H - 16;
    if (top < 16) top = 16;
    playlistTop = top;
  } else {
    playlistTop = playerTop;
  }

  return (
    <>
      {/* 全局 CSS 动画 */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes vinyl-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .animate-vinyl { animation: vinyl-spin 4s linear infinite; }
        .animate-vinyl.paused { animation-play-state: paused; }
        @keyframes scroll-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-25%); }
        }
        .animate-marquee { animation: scroll-marquee 12s linear infinite; }
      ` }} />

      {/* Playlist overlay */}
      {playlistOpen && (
        <div
          className="fixed inset-0 z-[99997] bg-black/20 backdrop-blur-[2px]"
          onClick={() => setPlaylistOpen(false)}
        />
      )}

      {/* Playlist */}
      <AnimatePresence>
        {playlistOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            ref={listRef}
            className="fixed z-[99998] w-80 max-h-[420px] flex flex-col rounded-2xl border bg-zinc-950/95 border-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden"
            style={{
              top: `${playlistTop}px`,
              left: `${playlistLeft}px`,
            }}
          >
            {/* Playlist header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <ListMusic className={`w-4 h-4 ${accentClass}`} />
                <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                  Playlist
                </span>
                <span className="text-[10px] font-mono text-zinc-600">
                  {PLAYLIST.length} tracks
                </span>
              </div>
              <button
                onClick={() => setPlaylistOpen(false)}
                className="p-1 rounded hover:bg-white/10 text-zinc-400 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Playlist items */}
            <div className="flex-1 overflow-y-auto p-2">
              {PLAYLIST.map((track, i) => {
                const isActive = i === currentTrackIndex;
                return (
                  <button
                    key={i}
                    onClick={() => { selectTrack(i); setPlaylistOpen(false); }}
                    onMouseEnter={() => setHoveredTrack(i)}
                    onMouseLeave={() => setHoveredTrack(null)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-white/10 text-white"
                        : hoveredTrack === i
                          ? "bg-white/5 text-zinc-200"
                          : mutedTextClass
                    }`}
                  >
                    <div className="w-6 flex-shrink-0 flex items-center justify-center">
                      {isActive && isPlaying ? (
                        <div className="flex items-end gap-0.5 h-3">
                          <div className="w-0.5 h-2 bg-zinc-300 animate-pulse" />
                          <div className="w-0.5 h-3 bg-zinc-300 animate-pulse" style={{ animationDelay: "0.2s" }} />
                          <div className="w-0.5 h-1.5 bg-zinc-300 animate-pulse" style={{ animationDelay: "0.4s" }} />
                        </div>
                      ) : (
                        <span className={`text-[10px] font-mono ${isActive ? accentClass : "text-zinc-600"}`}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      )}
                    </div>

                    <div className="relative w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 border border-white/5">
                      <img
                        src={track.cover}
                        alt={track.title}
                        draggable={false}
                        className="w-full h-full object-cover pointer-events-none select-none"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    </div>

                    <div className="flex-1 min-w-0 text-left">
                      <div className={`text-xs font-medium truncate ${isActive ? "" : "text-zinc-300"}`}>
                        {track.title}
                      </div>
                      <div className="text-[10px] truncate text-zinc-500">
                        {track.artist}
                      </div>
                    </div>

                    {isActive && (
                      <div className="w-1 h-1 rounded-full bg-zinc-300 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Playlist footer */}
            <div className="px-4 py-2 border-t border-white/5 flex items-center justify-between">
              <span className="text-[9px] font-mono text-zinc-600">
                Repeat: {repeatMode === "none" ? "Off" : repeatMode === "one" ? "One" : "All"}
              </span>
              <span className="text-[9px] font-mono text-zinc-600">
                {currentTrackIndex + 1} / {PLAYLIST.length}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== 主播放器（可拖拽） ==================== */}
      <motion.div
        ref={playerRef}
        onPointerDown={drag.onPointerDown}
        // 位置完全由 MotionValue 驱动（见 use-draggable-snap），拖拽期间 set 不触发重渲染，
        // 彻底避免 Framer 用旧 state 复位 transform 导致"拖拽时不动"。
        style={{
          x: drag.x,
          y: drag.y,
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 99999,
          touchAction: "none",
          cursor: drag.isDragging ? "grabbing" : "grab",
          userSelect: "none",
          willChange: "transform",
        }}
        onMouseEnter={() => {
          hoverRef.current = true;
          clearAutoMinimize();
        }}
        onMouseLeave={() => {
          hoverRef.current = false;
          if (mode === "expanded" && !playlistOpen) {
            scheduleAutoMinimize();
          }
        }}
      >
        <AnimatePresence mode="wait">
          {mode === "minimized" ? (
            /* ========== MINIMIZED ========== */
            <motion.button
              key="min"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMode("expanded")}
              className={`relative flex items-center justify-center w-12 h-12 ${bubbleShapeClass} bg-zinc-950/95 border border-white/10 shadow-2xl backdrop-blur-xl transition-transform duration-300 active:scale-95`}
              title="点击展开播放器"
            >
              {/* 唱盘封面 */}
              <div className={`relative w-9 h-9 rounded-full overflow-hidden ${isPlaying ? "animate-vinyl" : "animate-vinyl paused"}`}>
                <img
                  src={currentTrack.cover}
                  alt={currentTrack.title}
                  draggable={false}
                  className="w-full h-full object-cover pointer-events-none select-none"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </div>
            </motion.button>
          ) : (
            /* ========== EXPANDED ========== */
            <motion.div
              key="exp"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`flex flex-col w-80 rounded-2xl border ${panelBgClass} backdrop-blur-2xl shadow-2xl overflow-hidden`}
            >
              {/* Top bar — Now Playing + 收起 */}
              <div className={`flex items-center justify-between px-4 py-2 border-b ${isLightTheme ? "border-zinc-200" : "border-white/5"}`}>
                <div className="flex items-center gap-2">
                  <Music className={`w-3 h-3 ${accentClass}`} />
                  <span className={`text-[9px] font-mono uppercase tracking-widest ${mutedTextClass}`}>
                    {isPlaying ? "Now Playing" : "Paused"}
                  </span>
                </div>
                <button
                  onClick={() => setMode("minimized")}
                  className={`p-1 rounded ${hoverBtnClass} transition-colors`}
                  title="收起"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Album art + track info */}
              <div className="flex items-center gap-3 p-4">
                <button
                  onClick={togglePlay}
                  className="relative flex-shrink-0 w-14 h-14 rounded-full overflow-hidden group/cover"
                  title={isPlaying ? "暂停" : "播放"}
                >
                  <div className={`w-full h-full ${isPlaying ? "animate-vinyl" : "animate-vinyl paused"}`}>
                    <img
                      src={currentTrack.cover}
                      alt={currentTrack.title}
                      draggable={false}
                      className="w-full h-full object-cover pointer-events-none select-none"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>
                  <div className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity ${isPlaying ? "opacity-0 group-hover/cover:opacity-100" : "opacity-100"}`}>
                    {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white ml-0.5" />}
                  </div>
                </button>

                <div className="flex-1 min-w-0">
                  <div className="relative overflow-hidden">
                    <div className="flex w-max animate-marquee">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-center">
                          <span className={`text-sm font-bold whitespace-nowrap ${isLightTheme ? "text-zinc-900" : "text-zinc-100"}`}>
                            {currentTrack.title}
                          </span>
                          <span className={`mx-2 ${isLightTheme ? "text-zinc-300" : "text-zinc-700"}`}>·</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={`text-[11px] font-mono ${mutedTextClass} truncate`}>
                    {currentTrack.artist}
                  </div>
                </div>
              </div>

              {/* Progress bar — 高频更新隔离 */}
              <PlayerProgress
                currentTime={currentTime}
                duration={duration}
                seek={seek}
                isLightTheme={isLightTheme}
                mutedTextClass={mutedTextClass}
              />

              {/* Main controls */}
              <div className="flex items-center justify-center gap-2 px-4 py-3">
                {/* Repeat */}
                <button
                  onClick={toggleRepeatMode}
                  className={`p-2 rounded-full transition-all duration-300 ${hoverBtnClass} ${repeatMode !== "none" ? accentClass : ""}`}
                  title={`Repeat: ${repeatMode}`}
                >
                  {repeatMode === "one" ? <Repeat1 className="w-3.5 h-3.5" /> : <Repeat className="w-3.5 h-3.5" />}
                </button>

                {/* Previous */}
                <button
                  onClick={playPrevTrack}
                  className={`p-2 rounded-full transition-all duration-300 ${hoverBtnClass}`}
                  title="Previous"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                {/* Play / Pause — main */}
                <button
                  onClick={togglePlay}
                  className={`flex items-center justify-center w-10 h-10 rounded-full mx-1 transition-all duration-300 hover:scale-110 ${
                    isLightTheme
                      ? "bg-zinc-900 text-white hover:bg-zinc-800"
                      : "bg-white text-zinc-900 hover:bg-zinc-200"
                  }`}
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>

                {/* Next */}
                <button
                  onClick={playNextTrack}
                  className={`p-2 rounded-full transition-all duration-300 ${hoverBtnClass}`}
                  title="Next"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

                {/* Playlist toggle */}
                <button
                  onClick={() => setPlaylistOpen(!playlistOpen)}
                  className={`p-2 rounded-full transition-all duration-300 ${hoverBtnClass} ${playlistOpen ? accentClass : ""}`}
                  title="Playlist"
                >
                  <ListMusic className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
