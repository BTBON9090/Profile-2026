"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { SkipForward, RotateCcw, ChevronLeft, ChevronRight, List, Rewind } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAudio } from "@/lib/audio-context";
import { PLAYLIST } from "@/data/playlist";

export default function BgmPlayer() {
  const {
    isPlaying,
    isDesktop,
    currentTrack,
    currentTime,
    currentTrackIndex,
    playbackRate,
    lyrics,
    currentLyricIndex,
    togglePlay,
    playNextTrack,
    replayTrack,
    seekBackward,
    togglePlaybackRate,
    selectTrack,
    adjustLyricLeft,
    adjustLyricRight,
  } = useAudio();
  const pathname = usePathname();

  const [playlistOpen, setPlaylistOpen] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!playlistOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPlaylistOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (
        listRef.current &&
        !listRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setPlaylistOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [playlistOpen]);

  if (!isDesktop) return null;
  if (!currentTrack) return null;

  const isLightTheme = pathname === "/work/light-branding" || pathname === "/work/ciliju-xing";

  const statusTextClass = isLightTheme ? "text-zinc-800" : "text-zinc-400";
  const trackTextClass = isLightTheme ? "text-zinc-500" : "text-zinc-400 opacity-80";
  const nextBtnClass = isLightTheme
    ? "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
    : "text-zinc-500 hover:text-white hover:bg-white/10";

  const trackDisplayText = `${currentTrack.title} - ${currentTrack.artist}`;

  const min = Math.floor(currentTime / 60);
  const sec = Math.floor(currentTime % 60);
  const timeStr = `${min}:${sec.toString().padStart(2, "0")}`;

  const currentLyricLine = currentLyricIndex >= 0 && currentLyricIndex < lyrics.length
    ? lyrics[currentLyricIndex]
    : null;

  const currentLyricTime = currentLyricLine
    ? (() => {
        const m = Math.floor(currentLyricLine.time / 60);
        const s = Math.floor(currentLyricLine.time % 60);
        const ms = Math.floor((currentLyricLine.time % 1) * 100);
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
      })()
    : null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes vinyl-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes scroll-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-25%); }
        }
        @keyframes playlist-fade-in {
          from { opacity: 0; transform: translateY(8px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes playlist-overlay-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .animate-vinyl { animation: vinyl-spin 3s linear infinite; }
        .animate-vinyl.paused { animation-play-state: paused; }
        .animate-marquee { animation: scroll-marquee 10s linear infinite; }
        .group\\/player:hover .animate-marquee { animation-play-state: paused; }
        .animate-playlist-in { animation: playlist-fade-in 0.2s ease-out forwards; }
        .animate-playlist-overlay { animation: playlist-overlay-in 0.15s ease-out forwards; }
      ` }} />

      {/* 播放列表遮罩 */}
      {playlistOpen && (
        <div
          className="fixed inset-0 z-[99997] animate-playlist-overlay"
          onClick={() => setPlaylistOpen(false)}
        />
      )}

      {/* 播放列表弹窗 — 用原生 div 避免 Framer Motion transform 破坏 fixed 定位 */}
      {playlistOpen && (
        <div
          ref={listRef}
          className="fixed bottom-24 left-8 z-[99999] w-72 h-80 overflow-y-auto rounded-xl border border-white/10 bg-zinc-900/95 backdrop-blur-xl shadow-2xl p-2 font-mono text-[11px] animate-playlist-in"
        >
          <div className="px-3 py-2 text-[10px] uppercase tracking-widest text-zinc-500 border-b border-white/5 mb-1">
            Playlist &middot; {PLAYLIST.length}
          </div>
          {PLAYLIST.map((track, i) => {
            const isActive = i === currentTrackIndex;
            return (
              <button
                key={i}
                onClick={() => {
                  selectTrack(i);
                  setPlaylistOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-150 truncate ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                }`}
              >
                <span className={isActive ? "text-white" : "text-zinc-500"}>{i + 1}.</span>{" "}
                <span className="font-medium">{track.title}</span>
                <span className="text-zinc-500 ml-2 opacity-60">{track.artist}</span>
              </button>
            );
          })}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="fixed bottom-8 left-8 z-[99999] hidden md:flex items-center gap-2 group/player"
      >
        {/* 唱盘 */}
        <button
          onClick={togglePlay}
          className="relative flex items-center justify-center w-14 h-14 rounded-full p-0.5 bg-zinc-800/60 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:scale-105 transition-transform duration-300"
        >
          <div
            className={`w-full h-full rounded-full overflow-hidden bg-zinc-800 ${isPlaying ? "animate-vinyl" : "animate-vinyl paused"}`}
            style={{
              backgroundImage: `radial-gradient(circle at center, #27272a 0%, #27272a 20%, transparent 22%, transparent 35%, #3f3f46 37%, #27272a 39%, transparent 40%, transparent 53%, #3f3f46 55%, #27272a 57%, transparent 58%, transparent 72%, #3f3f46 74%, #27272a 76%)`,
            }}
          >
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="absolute inset-0 w-full h-full object-cover rounded-full"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
          <div className="absolute inset-[3px] rounded-full border border-white/10 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-zinc-900 border border-white/20 pointer-events-none" />
        </button>

        {/* 歌曲信息 */}
        <div className="font-mono text-[10px] uppercase tracking-widest flex flex-col justify-center">
          <span className={`font-semibold mb-0.5 ${statusTextClass}`}>
            {isPlaying ? "Audio.Playing" : "Audio.Paused"}
          </span>
          <div
            className="relative w-[120px] overflow-hidden whitespace-nowrap"
            style={{
              maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
              WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            }}
          >
            <div className="flex w-max animate-marquee">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <span className={trackTextClass}>{trackDisplayText}</span>
                  <span className="mx-3 text-zinc-600 opacity-50">•</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 播放时间 */}
        <span className="hidden font-mono text-[11px] text-zinc-500 tabular-nums ml-1">
          {timeStr}
        </span>

        {/* 播放列表按钮 */}
        <button
          ref={btnRef}
          onClick={() => setPlaylistOpen(!playlistOpen)}
          className={`p-2 rounded-full transition-all duration-300 ${
            playlistOpen
              ? isLightTheme
                ? "bg-zinc-200 text-zinc-800"
                : "bg-white/15 text-white"
              : `opacity-60 group-hover/player:opacity-100 ${nextBtnClass}`
          }`}
          title="Playlist"
        >
          <List className="w-4 h-4" />
        </button>

        {/* 后退 5 秒按钮 */}
        <button
          onClick={seekBackward}
          className={`hidden ml-1 p-2 rounded-full transition-all duration-300 opacity-60 group-hover/player:opacity-100 ${nextBtnClass}`} // 后退按钮：删除 className 中的 hidden即可
          title="Back 5s"
        >
          <Rewind className="w-4 h-4" />
        </button>

        {/* 重播按钮 */}
        <button
          onClick={replayTrack}
          className={`ml-1 p-2 rounded-full transition-all duration-300 opacity-60 group-hover/player:opacity-100 ${nextBtnClass}`}
          title="Replay"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* 切歌按钮 */}
        <button
          onClick={playNextTrack}
          className={`ml-1 p-2 rounded-full transition-all duration-300 opacity-60 group-hover/player:opacity-100 ${nextBtnClass}`}
          title="Next Track"
        >
          <SkipForward className="w-4 h-4" />
        </button>

        {/* 倍速按钮 */}
        <button
          onClick={togglePlaybackRate}
          className={`hidden ml-1 px-2 py-1 rounded text-[10px] font-mono font-bold transition-all duration-300 opacity-60 group-hover/player:opacity-100 ${
            playbackRate > 1
              ? isLightTheme
                ? "bg-zinc-800 text-white"
                : "bg-white text-zinc-900"
              : isLightTheme
                ? "text-zinc-400 hover:bg-zinc-100"
                : "text-zinc-500 hover:bg-white/10"
          }`}
          title={
            playbackRate === 1 ? "2x Speed" :
            playbackRate === 2 ? "3x Speed" :
            playbackRate === 3 ? "4x Speed" :
            playbackRate === 4 ? "10x Speed" :
            "1x Speed"
          }
        >
          {playbackRate}x
        </button>

        {/* 歌词校对器,删除 className 中的 hidden即可 */}
        {currentLyricLine && (
          <div className="hidden flex items-center gap-1 ml-1"> 
            <button
              onClick={adjustLyricLeft}
              className={`p-1 rounded transition-all duration-300 ${nextBtnClass}`}
              title="提前 (歌词早出现)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className={`text-[10px] font-mono tabular-nums ${isLightTheme ? "text-zinc-500" : "text-zinc-400"}`}>
              {currentLyricTime}
            </span>
            <button
              onClick={adjustLyricRight}
              className={`p-1 rounded transition-all duration-300 ${nextBtnClass}`}
              title="延迟 (歌词晚出现)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </motion.div>
    </>
  );
}
