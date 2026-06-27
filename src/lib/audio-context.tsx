"use client";
import { createContext, useContext, useRef, useState, useCallback, useEffect, useMemo, type ReactNode } from "react";
import { PLAYLIST, type Track } from "@/data/playlist";

export interface LyricLine {
  time: number;
  text: string;
}

const ADJUST_STEP = 1;
const LRC_TIME_RE = /\[(\d{2}):(\d{2})[.:](\d{2,3})\](.*)/;

function parseLRC(raw: string): LyricLine[] {
  const lines: LyricLine[] = [];
  for (const line of raw.split("\n")) {
    const m = line.match(LRC_TIME_RE);
    if (!m) continue;
    const min = parseInt(m[1], 10);
    const sec = parseInt(m[2], 10);
    const ms = parseInt(m[3], 10) * (m[3].length === 2 ? 10 : 1);
    const time = min * 60 + sec + ms / 1000;
    const text = m[4].trim();
    if (text) lines.push({ time, text });
  }
  return lines;
}

function rebuildLRC(raw: string, lyrics: LyricLine[]): string {
  const lines = raw.split("\n");
  let idx = 0;
  return lines
    .map((line) => {
      const m = line.match(LRC_TIME_RE);
      if (!m || !m[4].trim()) return line;
      if (idx >= lyrics.length) return line;
      const l = lyrics[idx++];
      const min = Math.floor(l.time / 60);
      const sec = Math.floor(l.time % 60);
      const cs = Math.round((l.time % 1) * 100);
      return `[${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}.${cs.toString().padStart(2, "0")}] ${l.text}`;
    })
    .join("\n");
}

interface AudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  currentTrack: Track | null;
  currentTrackIndex: number;
  isDesktop: boolean;
  playbackRate: number;
  repeatMode: 'none' | 'one' | 'all';
  lyrics: LyricLine[];
  currentLyricIndex: number;
  togglePlay: () => void;
  playNextTrack: () => void;
  playPrevTrack: () => void;
  replayTrack: () => void;
  seekBackward: () => void;
  seek: (time: number) => void;
  togglePlaybackRate: () => void;
  toggleRepeatMode: () => void;
  selectTrack: (index: number) => void;
  adjustLyricLeft: () => void;
  adjustLyricRight: () => void;
}

const AudioCtx = createContext<AudioState | null>(null);

export function useAudio() {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error("useAudio must be used within AudioProvider");
  return ctx;
}

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none');
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const trackIndexRef = useRef(0);
  const rafRef = useRef(0);
  const lrcRawRef = useRef("");
  const lrcUrlRef = useRef("");
  const adjustingLyricIndexRef = useRef<number | null>(null);
  const repeatModeRef = useRef<'none' | 'one' | 'all'>('none');

  // Keep ref in sync with state for use in event handlers
  useEffect(() => {
    repeatModeRef.current = repeatMode;
  }, [repeatMode]);

  const currentLyricIndex = useMemo(() => {
    if (lyrics.length === 0) return -1;
    if (adjustingLyricIndexRef.current !== null) {
      return adjustingLyricIndexRef.current;
    }
    let idx = -1;
    for (let i = 0; i < lyrics.length; i++) {
      if (currentTime >= lyrics[i].time) idx = i;
      else break;
    }
    return idx;
  }, [lyrics, currentTime]);

  const fetchLyrics = useCallback((track: Track) => {
    if (!track.lrc || lrcUrlRef.current === track.lrc) return;
    lrcUrlRef.current = track.lrc;
    setLyrics([]);
    fetch(`/api/lyrics-proxy?url=${encodeURIComponent(track.lrc)}`)
      .then((r) => r.text())
      .then((raw) => {
        lrcRawRef.current = raw;
        setLyrics(parseLRC(raw));
      })
      .catch(() => {
        lrcRawRef.current = "";
        setLyrics([]);
      });
  }, []);

  const playNextTrack = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || PLAYLIST.length === 0) return;
    adjustingLyricIndexRef.current = null;
    const nextIndex = (trackIndexRef.current + 1) % PLAYLIST.length;
    trackIndexRef.current = nextIndex;
    const track = PLAYLIST[nextIndex];
    setCurrentTrack(track);
    audio.src = track.url;
    audio.load();
    audio.play().catch(() => {});
    fetchLyrics(track);
  }, [fetchLyrics]);

  const playPrevTrack = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || PLAYLIST.length === 0) return;
    adjustingLyricIndexRef.current = null;
    // If more than 3 seconds in, restart current track
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    const prevIndex = (trackIndexRef.current - 1 + PLAYLIST.length) % PLAYLIST.length;
    trackIndexRef.current = prevIndex;
    const track = PLAYLIST[prevIndex];
    setCurrentTrack(track);
    audio.src = track.url;
    audio.load();
    audio.play().catch(() => {});
    fetchLyrics(track);
  }, [fetchLyrics]);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    adjustingLyricIndexRef.current = null;
    audio.currentTime = Math.max(0, Math.min(time, audio.duration || 0));
    setCurrentTime(audio.currentTime);
  }, []);

  const toggleRepeatMode = useCallback(() => {
    setRepeatMode((prev) => {
      if (prev === 'none') return 'all';
      if (prev === 'all') return 'one';
      return 'none';
    });
  }, []);

  const replayTrack = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    adjustingLyricIndexRef.current = null;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }, []);

  const seekBackward = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    adjustingLyricIndexRef.current = null;
    audio.currentTime = Math.max(0, audio.currentTime - 5);
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    adjustingLyricIndexRef.current = null;
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, []);

  const togglePlaybackRate = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    let newRate = 1;
    if (playbackRate === 1) newRate = 2;
    else if (playbackRate === 2) newRate = 3;
    else if (playbackRate === 3) newRate = 4;
    else if (playbackRate === 4) newRate = 10;
    else newRate = 1;
    audio.playbackRate = newRate;
    setPlaybackRate(newRate);
  }, [playbackRate]);

  const selectTrack = useCallback(
    (index: number) => {
      const audio = audioRef.current;
      if (!audio || index < 0 || index >= PLAYLIST.length) return;
      adjustingLyricIndexRef.current = null;
      trackIndexRef.current = index;
      const track = PLAYLIST[index];
      setCurrentTrack(track);
      audio.src = track.url;
      audio.load();
      audio.play().catch(() => {});
      fetchLyrics(track);
    },
    [fetchLyrics]
  );

  const adjustLyric = useCallback(
    (delta: number) => {
      const audio = audioRef.current;
      if (!audio || !currentTrack) return;
      if (currentLyricIndex < 0 || currentLyricIndex >= lyrics.length) return;
      audio.pause();
      if (adjustingLyricIndexRef.current === null) {
        adjustingLyricIndexRef.current = currentLyricIndex;
      }
      const targetIndex = adjustingLyricIndexRef.current;
      const updated = lyrics.map((l, i) =>
        i >= targetIndex ? { ...l, time: Math.max(0, +(l.time + delta).toFixed(2)) } : l
      );
      setLyrics(updated);
    },
    [currentTrack, currentLyricIndex, lyrics]
  );

  const adjustLyricLeft = useCallback(() => adjustLyric(-ADJUST_STEP), [adjustLyric]);
  const adjustLyricRight = useCallback(() => adjustLyric(ADJUST_STEP), [adjustLyric]);

  useEffect(() => {
    const checkDevice = () => setIsDesktop(window.innerWidth >= 768);
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  useEffect(() => {
    if (PLAYLIST.length === 0) return;

    const initialIndex = Math.floor(Math.random() * PLAYLIST.length);
    trackIndexRef.current = initialIndex;
    const track = PLAYLIST[initialIndex];
    setCurrentTrack(track);
    // 歌词仅在桌面端拉取（移动端隐藏歌词组件，无需请求）
    if (isDesktop) fetchLyrics(track);

    const audio = new Audio(track.url);
    audio.volume = 0.4;
    audioRef.current = audio;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      const mode = repeatModeRef.current;
      if (mode === 'one') {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else if (mode === 'all') {
        playNextTrack();
      } else {
        // none — play next anyway (like a normal playlist)
        playNextTrack();
      }
    };
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.pause();
      audio.src = "";
      audioRef.current = null;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isDesktop, playNextTrack, fetchLyrics]);

  return (
    <AudioCtx.Provider
      value={{
        isPlaying,
        currentTime,
        duration,
        currentTrack,
        currentTrackIndex: trackIndexRef.current,
        isDesktop,
        playbackRate,
        repeatMode,
        lyrics,
        currentLyricIndex,
        togglePlay,
        playNextTrack,
        playPrevTrack,
        replayTrack,
        seekBackward,
        seek,
        togglePlaybackRate,
        toggleRepeatMode,
        selectTrack,
        adjustLyricLeft,
        adjustLyricRight,
      }}
    >
      {children}
    </AudioCtx.Provider>
  );
}
