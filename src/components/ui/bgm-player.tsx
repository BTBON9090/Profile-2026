"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, Repeat, Repeat1, ListMusic, X, Music } from "lucide-react";
import { useAudio } from "@/lib/audio-context";
import { PLAYLIST } from "@/data/playlist";
import { useDraggableSnap } from "@/lib/use-draggable-snap";
import { useFloatingPanel } from "./use-floating-panel";
import "./floating-tools.css";

function formatTime(value: number) {
  const seconds = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

export default function BgmPlayer() {
  const audio = useAudio();
  const { currentTrack, isPlaying, duration, currentTime, currentTrackIndex, repeatMode } = audio;
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const drag = useDraggableSnap(bubbleRef, 2, typeof window === "undefined" ? 0 : window.innerHeight - 180);
  const placement = useFloatingPanel(open, drag.position.x, drag.position.y, drag.snapSide, 48, 352, playlistOpen ? 590 : 380);
  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => closeRef.current?.focus({ preventScroll: true }), 100);
    const onPointer = (event: PointerEvent) => {
      if (!panelRef.current?.contains(event.target as Node) && !bubbleRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.stopPropagation(); close(); }
    };
    const onOtherPanel = () => setOpen(false);
    window.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    window.addEventListener("copilot-open", onOtherPanel);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("copilot-open", onOtherPanel);
    };
  }, [open, close]);

  if (!currentTrack) return null;
  const validDuration = Number.isFinite(duration) && duration > 0 ? duration : 0;
  const safeTime = Math.min(validDuration, Math.max(0, Number.isFinite(currentTime) ? currentTime : 0));
  const repeatLabel = repeatMode === "none" ? "顺序播放" : repeatMode === "one" ? "单曲循环" : "列表循环";

  return <>
    {/* Only the stable, 48px bubble is draggable. Controls never inherit drag gestures. */}
    <motion.div
      ref={bubbleRef}
      onPointerDown={drag.onPointerDown}
      className="music-dock"
      data-side={drag.snapSide}
      data-dragging={drag.isDragging}
      style={{ x: drag.mounted ? drag.x : 0, y: drag.mounted ? drag.y : 0, visibility: drag.mounted ? "visible" : "hidden" }}
    >
      <button
        ref={triggerRef}
        className="music-dock__button"
        aria-label={open ? "收起音乐播放器" : `打开音乐播放器：${currentTrack.title}`}
        aria-expanded={open}
        aria-controls="music-player-panel"
        onClick={() => {
          if (drag.justDraggedRef.current) return;
          if (!open) window.dispatchEvent(new Event("music-player-open"));
          setOpen(value => !value);
        }}
      >
        <span className="music-record" data-playing={isPlaying && !reduceMotion}>
          <img key={currentTrack.cover} src={currentTrack.cover} alt="" draggable={false} />
          <i />
        </span>
        <span className="music-dock__status" data-playing={isPlaying} aria-hidden="true" />
      </button>
    </motion.div>
    <AnimatePresence>
      {open && placement && <motion.div
        ref={panelRef}
        id="music-player-panel"
        role="dialog"
        aria-label="音乐播放器"
        className="music-panel"
        initial={{ opacity: 0, y: reduceMotion ? 0 : 8, scale: reduceMotion ? 1 : 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: reduceMotion ? 0 : 6 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        style={{ left: placement.left, top: placement.top, width: placement.width, maxHeight: placement.height, transformOrigin: drag.snapSide === "left" ? "bottom left" : "bottom right" }}
      >
        <header className="music-panel__header">
          <span><Music size={14} /> {isPlaying ? "正在播放" : "听一首歌"}</span>
          <button ref={closeRef} onClick={close} aria-label="收起音乐播放器"><X size={17} /></button>
        </header>
        <div className="music-panel__body">
          <div className="music-panel__track">
            <button className="music-panel__cover" onClick={audio.togglePlay} aria-label={isPlaying ? "暂停音乐" : "播放音乐"}>
              <img key={currentTrack.cover} src={currentTrack.cover} alt="" />
              <span>{isPlaying ? <Pause size={20} /> : <Play size={20} />}</span>
            </button>
            <div><h2>{currentTrack.title}</h2><p>{currentTrack.artist}</p></div>
          </div>
          <div className="music-progress">
            <input type="range" aria-label="播放进度" min={0} max={validDuration || 1} step={0.1} value={safeTime} disabled={!validDuration}
              onChange={event => audio.seek(Number(event.target.value))}
              style={{ background: `linear-gradient(to right, #c5d1ee ${validDuration ? safeTime / validDuration * 100 : 0}%, #ffffff18 0)` }} />
            <div><span>{formatTime(safeTime)}</span><span>{formatTime(validDuration)}</span></div>
          </div>
          <div className="music-panel__controls">
            <button onClick={audio.toggleRepeatMode} aria-label={`播放模式：${repeatLabel}`} title={repeatLabel} aria-pressed={repeatMode !== "none"}>{repeatMode === "one" ? <Repeat1 size={18} /> : <Repeat size={18} />}</button>
            <button onClick={audio.playPrevTrack} aria-label="上一首"><SkipBack size={20} /></button>
            <button className="music-panel__play" onClick={audio.togglePlay} aria-label={isPlaying ? "暂停音乐" : "播放音乐"}>{isPlaying ? <Pause size={22} /> : <Play size={22} />}</button>
            <button onClick={audio.playNextTrack} aria-label="下一首"><SkipForward size={20} /></button>
            <button onClick={() => setPlaylistOpen(value => !value)} aria-label="播放列表" aria-expanded={playlistOpen} aria-controls="music-track-list"><ListMusic size={18} /></button>
          </div>
          <div className="music-panel__settings">
            <label>歌词颜色轮换 <button type="button" role="switch" aria-label="歌词颜色轮换" aria-checked={audio.lyricColorCycle} onClick={audio.toggleLyricColorCycle}><i /></button></label>
            <div><span>歌词样式</span><div className="music-panel__segments" role="group" aria-label="歌词显示样式">{(["gradient", "solid"] as const).map(mode => <button key={mode} aria-pressed={audio.lyricFillMode === mode} onClick={() => audio.setLyricFillMode(mode)}>{mode === "gradient" ? "渐变" : "纯色"}</button>)}</div></div>
          </div>
          {playlistOpen && <div id="music-track-list" className="music-list" aria-label="播放列表">
            {PLAYLIST.map((track, index) => <button key={`${track.title}-${index}`} aria-current={index === currentTrackIndex ? "true" : undefined} onClick={() => audio.selectTrack(index)}>
              <span>{String(index + 1).padStart(2, "0")}</span><img src={track.cover} alt="" loading="lazy" />
              <span><strong>{track.title}</strong><small>{track.artist}</small></span>
              {index === currentTrackIndex && <span className="music-list__active">{isPlaying ? <Pause size={12} /> : <Play size={12} />}</span>}
            </button>)}
          </div>}
        </div>
      </motion.div>}
    </AnimatePresence>
  </>;
}
