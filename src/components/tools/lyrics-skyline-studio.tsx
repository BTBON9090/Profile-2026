"use client";

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  Copy,
  Download,
  FastForward,
  Gauge,
  ListMusic,
  Pause,
  Play,
  Repeat,
  Rewind,
  RotateCcw,
  Shuffle,
  SkipBack,
  SkipForward,
  SlidersHorizontal,
  Sparkles,
  Waves,
} from "lucide-react";
import Image from "next/image";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { PLAYLIST } from "@/data/playlist";
import { useAudio, type LyricLine } from "@/lib/audio-context";

type LyricAlign = "left" | "center" | "right";
type FillMode = "gradient" | "solid";
type FontFamily = "sans" | "mono" | "songti";
type MotionAxis = "both" | "horizontal" | "vertical" | "still";
type BokehMotion = "float" | "horizontal" | "vertical" | "still";

type SkylineConfig = {
  width: number;
  randomSeed: number;
  layerCount: number;
  fontSize: number;
  fontFamily: FontFamily;
  fontWeight: number;
  foregroundBlur: number;
  backgroundBlur: number;
  horizontalScatter: number;
  verticalScatter: number;
  motionAxis: MotionAxis;
  motionX: number;
  motionY: number;
  motionSpeed: number;
  alignment: LyricAlign;
  fillMode: FillMode;
  color: string;
  colorCycle: boolean;
  horizonVisible: boolean;
  horizonWidth: number;
  flickerEnabled: boolean;
  flickerFrequency: number;
  flickerDuration: number;
  flickerIntensity: number;
  bokehEnabled: boolean;
  bokehCount: number;
  bokehMotion: BokehMotion;
  bokehX: number;
  bokehY: number;
  bokehFrequency: number;
  bokehDuration: number;
  bokehVariance: number;
  bokehBlur: number;
  gatherEnabled: boolean;
  gatherSpeed: number;
  gatherSpread: number;
  gatherWave: number;
  gatherTurbulence: number;
  particleSize: number;
  dissolveEnabled: boolean;
  dissolveSpeed: number;
  dissolveSpread: number;
  dissolveWave: number;
  dissolveTurbulence: number;
};

const DEFAULT_CONFIG: SkylineConfig = {
  width: 76,
  randomSeed: 43,
  layerCount: 26,
  fontSize: 27,
  fontFamily: "sans",
  fontWeight: 620,
  foregroundBlur: 0.5,
  backgroundBlur: 5.4,
  horizontalScatter: 72,
  verticalScatter: 112,
  motionAxis: "both",
  motionX: 18,
  motionY: 7,
  motionSpeed: 12,
  alignment: "center",
  fillMode: "gradient",
  color: "#78a4ff",
  colorCycle: false,
  horizonVisible: true,
  horizonWidth: 34,
  flickerEnabled: false,
  flickerFrequency: 5,
  flickerDuration: 90,
  flickerIntensity: 54,
  bokehEnabled: true,
  bokehCount: 7,
  bokehMotion: "float",
  bokehX: 24,
  bokehY: 14,
  bokehFrequency: 4,
  bokehDuration: 360,
  bokehVariance: 36,
  bokehBlur: 28,
  gatherEnabled: true,
  gatherSpeed: 1,
  gatherSpread: 210,
  gatherWave: 18,
  gatherTurbulence: 20,
  particleSize: 2,
  dissolveEnabled: true,
  dissolveSpeed: 1,
  dissolveSpread: 260,
  dissolveWave: 22,
  dissolveTurbulence: 28,
};

const DEMO_LYRICS: LyricLine[] = [
  { time: 0, text: "把声音放进一条会呼吸的天际线" },
  { time: 4, text: "前景清晰，远处的字慢慢散开" },
  { time: 8, text: "每一句歌词都有自己的空间" },
  { time: 12, text: "像素微尘重新凝聚成完整的文字" },
];

const FONT_STACKS: Record<FontFamily, string> = {
  sans: 'var(--font-sans), "PingFang SC", sans-serif',
  mono: 'var(--font-mono), "SFMono-Regular", monospace',
  songti: '"Songti SC", "STSong", serif',
};

const CANVAS_FONT_STACKS: Record<FontFamily, string> = {
  sans: 'system-ui, "PingFang SC", sans-serif',
  mono: '"SFMono-Regular", Menlo, monospace',
  songti: '"Songti SC", "STSong", serif',
};

function hash(seed: number) {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function easeOutQuint(value: number) {
  return 1 - Math.pow(1 - value, 5);
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const rest = Math.floor(seconds % 60);
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

function hexToRgb(hex: string) {
  const value = hex.replace("#", "");
  const normalized = value.length === 3
    ? value.split("").map((character) => character + character).join("")
    : value.padEnd(6, "f");
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

function variedColor(hex: string, amount: number) {
  const rgb = hexToRgb(hex);
  const channel = (value: number) => Math.round(clamp(value + amount, 0, 255));
  return `rgb(${channel(rgb.r)} ${channel(rgb.g)} ${channel(rgb.b)})`;
}

function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function buildTemplate(config: SkylineConfig) {
  const serialized = JSON.stringify(config).replace(/</g, "\\u003c");
  return `<!doctype html>
<html lang="zh-CN">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Lyric Skyline</title>
<style>
  :root{color-scheme:dark}*{box-sizing:border-box}body{margin:0;min-height:100dvh;display:grid;place-items:center;overflow:hidden;background:#05070c;color:${config.color};font-family:system-ui,sans-serif}.stage{position:relative;width:100vw;height:100dvh;display:grid;place-items:center;overflow:hidden}.skyline{position:relative;width:${config.width}%;height:72%;display:grid;place-items:center;overflow:hidden}.line{font-size:${config.fontSize}px;font-weight:${config.fontWeight};text-align:${config.alignment};opacity:0;filter:blur(12px);animation:reveal 1.2s cubic-bezier(.16,1,.3,1) forwards}.horizon{position:absolute;top:55%;left:50%;width:${config.horizonVisible ? config.horizonWidth : 0}%;height:1px;transform:translateX(-50%);background:linear-gradient(90deg,transparent,currentColor,transparent);opacity:.28}@keyframes reveal{to{opacity:1;filter:blur(0)}}@media(prefers-reduced-motion:reduce){*{animation:none!important}.line{opacity:1;filter:none}}
</style>
<main class="stage"><div class="skyline"><div class="line">在这里替换当前歌词</div></div><div class="horizon"></div></main>
<script>window.LYRIC_SKYLINE_CONFIG=${serialized};</script>
</html>`;
}

type FragmentStyle = CSSProperties & {
  "--sky-x": string;
  "--sky-y": string;
  "--sky-drift-x": string;
  "--sky-drift-y": string;
  "--sky-delay": string;
  "--sky-blur": string;
  "--sky-motion-duration": string;
  "--sky-flicker-duration": string;
  "--sky-flicker-delay": string;
  "--sky-scale": string;
  "--sky-opacity": string;
};

type BokehStyle = CSSProperties & {
  "--bokeh-x": string;
  "--bokeh-y": string;
  "--bokeh-size": string;
  "--bokeh-blur": string;
  "--bokeh-color": string;
  "--bokeh-alpha": string;
  "--bokeh-delay": string;
  "--bokeh-motion-duration": string;
  "--bokeh-flash-duration": string;
  "--bokeh-travel-x": string;
  "--bokeh-travel-y": string;
};

type Particle = {
  targetX: number;
  targetY: number;
  startX: number;
  startY: number;
  exitX: number;
  exitY: number;
  phase: number;
  opacity: number;
};

function ParticleTextCanvas({
  text,
  nextTime,
  currentTime,
  isPlaying,
  config,
}: {
  text: string;
  nextTime: number | null;
  currentTime: number;
  isPlaying: boolean;
  config: SkylineConfig;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const clockRef = useRef({ currentTime, updatedAt: 0, isPlaying });
  const particleConfig = useMemo(() => ({
    alignment: config.alignment,
    color: config.color,
    colorCycle: config.colorCycle,
    dissolveEnabled: config.dissolveEnabled,
    dissolveSpeed: config.dissolveSpeed,
    dissolveSpread: config.dissolveSpread,
    dissolveTurbulence: config.dissolveTurbulence,
    dissolveWave: config.dissolveWave,
    fillMode: config.fillMode,
    fontFamily: config.fontFamily,
    fontSize: config.fontSize,
    fontWeight: config.fontWeight,
    gatherEnabled: config.gatherEnabled,
    gatherSpeed: config.gatherSpeed,
    gatherSpread: config.gatherSpread,
    gatherTurbulence: config.gatherTurbulence,
    gatherWave: config.gatherWave,
    particleSize: config.particleSize,
    randomSeed: config.randomSeed,
  }), [
    config.alignment,
    config.color,
    config.colorCycle,
    config.dissolveEnabled,
    config.dissolveSpeed,
    config.dissolveSpread,
    config.dissolveTurbulence,
    config.dissolveWave,
    config.fillMode,
    config.fontFamily,
    config.fontSize,
    config.fontWeight,
    config.gatherEnabled,
    config.gatherSpeed,
    config.gatherSpread,
    config.gatherTurbulence,
    config.gatherWave,
    config.particleSize,
    config.randomSeed,
  ]);

  useEffect(() => {
    clockRef.current = {
      currentTime,
      updatedAt: performance.now(),
      isPlaying,
    };
  }, [currentTime, isPlaying]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let particles: Particle[] = [];
    let cssWidth = 0;
    let cssHeight = 0;
    let dpr = 1;
    let bornAt = performance.now();
    let resizeTimer = 0;

    const rebuild = () => {
      const rect = canvas.getBoundingClientRect();
      cssWidth = Math.max(1, rect.width);
      cssHeight = Math.max(1, rect.height);
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(cssWidth * dpr);
      canvas.height = Math.round(cssHeight * dpr);

      const mask = document.createElement("canvas");
      mask.width = Math.round(cssWidth);
      mask.height = Math.round(cssHeight);
      const maskContext = mask.getContext("2d", { willReadFrequently: true });
      if (!maskContext) return;

      let fontSize = particleConfig.fontSize;
      const font = () => `${particleConfig.fontWeight} ${fontSize}px ${CANVAS_FONT_STACKS[particleConfig.fontFamily]}`;
      maskContext.font = font();
      const maxLineWidth = cssWidth * 0.84;
      while (fontSize > 13 && maskContext.measureText(text).width > maxLineWidth) {
        fontSize -= 1;
        maskContext.font = font();
      }
      maskContext.textAlign = particleConfig.alignment;
      maskContext.textBaseline = "middle";
      maskContext.fillStyle = "#fff";
      const x = particleConfig.alignment === "left" ? cssWidth * 0.08 : particleConfig.alignment === "right" ? cssWidth * 0.92 : cssWidth / 2;
      maskContext.fillText(text, x, cssHeight / 2);

      const pixels = maskContext.getImageData(0, 0, mask.width, mask.height).data;
      let sampleStep = Math.max(2, Math.round(particleConfig.particleSize * 1.7));
      const estimated = Math.max(1, Math.floor((cssWidth * cssHeight) / (sampleStep * sampleStep)));
      if (estimated > 90000) sampleStep += 1;
      const nextParticles: Particle[] = [];

      for (let y = 0; y < mask.height; y += sampleStep) {
        for (let xPosition = 0; xPosition < mask.width; xPosition += sampleStep) {
          const alpha = pixels[(y * mask.width + xPosition) * 4 + 3];
          if (alpha < 72) continue;
          const seed = particleConfig.randomSeed * 131 + xPosition * 7 + y * 11;
          const startAngle = hash(seed + 1) * Math.PI * 2;
          const exitAngle = hash(seed + 2) * Math.PI * 2;
          const startDistance = particleConfig.gatherSpread * (0.35 + hash(seed + 3) * 0.65);
          const exitDistance = particleConfig.dissolveSpread * (0.35 + hash(seed + 4) * 0.65);
          nextParticles.push({
            targetX: xPosition,
            targetY: y,
            startX: xPosition + Math.cos(startAngle) * startDistance,
            startY: y + Math.sin(startAngle) * startDistance,
            exitX: xPosition + Math.cos(exitAngle) * exitDistance,
            exitY: y + Math.sin(exitAngle) * exitDistance,
            phase: hash(seed + 5) * Math.PI * 2,
            opacity: 0.48 + hash(seed + 6) * 0.52,
          });
          if (nextParticles.length >= 2600) break;
        }
        if (nextParticles.length >= 2600) break;
      }
      particles = nextParticles;
      bornAt = performance.now();
    };

    const draw = (now: number) => {
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, cssWidth, cssHeight);

      const entryDuration = 2700 / Math.max(0.35, particleConfig.gatherSpeed);
      const entryProgress = reducedMotion || !particleConfig.gatherEnabled
        ? 1
        : easeOutQuint(clamp((now - bornAt) / entryDuration, 0, 1));
      const clock = clockRef.current;
      const audioTime = clock.currentTime + (clock.isPlaying ? Math.max(0, now - clock.updatedAt) / 1000 : 0);
      const exitDuration = 2.7 / Math.max(0.35, particleConfig.dissolveSpeed);
      const exitProgress = particleConfig.dissolveEnabled && clock.isPlaying && nextTime !== null && nextTime > audioTime
        ? easeOutQuint(clamp(1 - (nextTime - audioTime) / exitDuration, 0, 1))
        : 0;
      const time = now / 1000;
      const baseRgb = hexToRgb(particleConfig.color);
      const cyclingHue = (time * 8 + particleConfig.randomSeed * 13) % 360;

      for (const particle of particles) {
        const gatherX = particle.startX + (particle.targetX - particle.startX) * entryProgress;
        const gatherY = particle.startY + (particle.targetY - particle.startY) * entryProgress;
        const waveIn = Math.sin(particle.targetY * 0.055 + time * 3 + particle.phase) * particleConfig.gatherWave * (1 - entryProgress);
        const turbulenceIn = Math.sin(time * 7 + particle.phase * 2.7) * particleConfig.gatherTurbulence * 0.12 * (1 - entryProgress);
        const waveOut = Math.sin(particle.targetX * 0.035 + time * 4 + particle.phase) * particleConfig.dissolveWave * exitProgress;
        const turbulenceOut = Math.cos(time * 8 + particle.phase * 3.2) * particleConfig.dissolveTurbulence * 0.14 * exitProgress;
        const x = gatherX + waveIn + turbulenceIn + (particle.exitX - particle.targetX) * exitProgress + waveOut + turbulenceOut;
        const y = gatherY + Math.cos(particle.phase + time * 2.4) * particleConfig.gatherWave * 0.25 * (1 - entryProgress) + (particle.exitY - particle.targetY) * exitProgress;
        const verticalFade = particleConfig.fillMode === "gradient" ? clamp(1.18 - particle.targetY / Math.max(1, cssHeight), 0.16, 1) : 1;
        const alpha = particle.opacity * entryProgress * (1 - exitProgress) * verticalFade;
        if (alpha <= 0.01) continue;
        context.globalAlpha = alpha;
        context.fillStyle = particleConfig.colorCycle
          ? `hsl(${cyclingHue} 78% 72%)`
          : `rgb(${baseRgb.r} ${baseRgb.g} ${baseRgb.b})`;
        const size = particleConfig.particleSize * (0.72 + particle.opacity * 0.34);
        context.fillRect(x, y, size, size);
      }
      context.globalAlpha = 1;
      frame = window.requestAnimationFrame(draw);
    };

    rebuild();
    const observer = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(rebuild, 90);
    });
    observer.observe(canvas);
    frame = window.requestAnimationFrame(draw);
    return () => {
      observer.disconnect();
      window.clearTimeout(resizeTimer);
      window.cancelAnimationFrame(frame);
    };
  }, [nextTime, particleConfig, text]);

  return (
    <>
      <canvas ref={canvasRef} className="lyrics-workbench__particle-canvas" aria-hidden="true" />
      <span className="sr-only">{text}</span>
    </>
  );
}

function SkylineStage({
  config,
  lyrics,
  lyricIndex,
  currentTime,
  isPlaying,
  panelOpen,
  onPanelToggle,
  onRandomize,
}: {
  config: SkylineConfig;
  lyrics: LyricLine[];
  lyricIndex: number;
  currentTime: number;
  isPlaying: boolean;
  panelOpen: boolean;
  onPanelToggle: () => void;
  onRandomize: () => void;
}) {
  const safeIndex = lyricIndex >= 0 ? lyricIndex % lyrics.length : 0;
  const current = lyrics[safeIndex] ?? DEMO_LYRICS[0];
  const next = lyrics[(safeIndex + 1) % lyrics.length] ?? DEMO_LYRICS[1];
  const nextTime = safeIndex + 1 < lyrics.length ? lyrics[safeIndex + 1]?.time ?? null : null;

  const fragments = useMemo(() => Array.from({ length: config.layerCount }, (_, index) => {
    const source = [...current.text];
    const seed = config.randomSeed * 97 + safeIndex * 31 + index * 13;
    const length = 1 + Math.floor(hash(seed + 1) * 3);
    const start = Math.floor(hash(seed + 2) * Math.max(1, source.length - length));
    const side = index % 2 === 0 ? -1 : 1;
    const depth = index % 3;
    const x = side * (16 + hash(seed + 3) * Math.max(8, config.horizontalScatter - 16));
    const y = (hash(seed + 4) - 0.5) * config.verticalScatter;
    const driftX = config.motionAxis === "both" || config.motionAxis === "horizontal"
      ? (hash(seed + 5) - 0.5) * config.motionX
      : 0;
    const driftY = config.motionAxis === "both" || config.motionAxis === "vertical"
      ? (hash(seed + 6) - 0.5) * config.motionY
      : 0;
    const blur = config.foregroundBlur + (depth / 2) * (config.backgroundBlur - config.foregroundBlur);
    return {
      id: `${safeIndex}-${index}`,
      text: source.slice(start, start + length).join("") || current.text.slice(0, 2),
      opacity: Math.max(0.08, 0.7 - depth * 0.21 - hash(seed + 7) * 0.1),
      scale: 0.72 + hash(seed + 8) * 0.62 + depth * 0.07,
      flicker: config.flickerEnabled && hash(seed + 9) > 1 - Math.min(0.8, config.flickerFrequency / 15),
      style: {
        "--sky-x": `${x.toFixed(1)}%`,
        "--sky-y": `${y.toFixed(1)}px`,
        "--sky-drift-x": `${driftX.toFixed(1)}px`,
        "--sky-drift-y": `${driftY.toFixed(1)}px`,
        "--sky-delay": `${(-hash(seed + 10) * 8).toFixed(2)}s`,
        "--sky-blur": `${blur.toFixed(1)}px`,
        "--sky-motion-duration": `${Math.max(3.5, config.motionSpeed + hash(seed + 11) * 7).toFixed(2)}s`,
        "--sky-flicker-duration": `${Math.max(0.8, config.flickerDuration / 50 + hash(seed + 12) * (13 / Math.max(1, config.flickerFrequency))).toFixed(2)}s`,
        "--sky-flicker-delay": `${(-hash(seed + 13) * 8).toFixed(2)}s`,
        "--sky-scale": `${(0.72 + hash(seed + 8) * 0.62 + depth * 0.07).toFixed(2)}`,
        "--sky-opacity": `${Math.max(0.08, 0.7 - depth * 0.21 - hash(seed + 7) * 0.1).toFixed(2)}`,
        fontSize: `${Math.max(9, config.fontSize * (0.36 + hash(seed + 14) * 0.2))}px`,
        zIndex: 6 - depth,
        filter: `blur(${blur.toFixed(1)}px)`,
      } as FragmentStyle,
    };
  }), [config, current.text, safeIndex]);

  const bokeh = useMemo(() => Array.from({ length: config.bokehCount }, (_, index) => {
    const seed = config.randomSeed * 173 + index * 23;
    const x = 8 + hash(seed + 1) * 84;
    const y = 57 + hash(seed + 2) * 34;
    const directionX = config.bokehMotion === "float" || config.bokehMotion === "horizontal" ? config.bokehX : 0;
    const directionY = config.bokehMotion === "float" || config.bokehMotion === "vertical" ? config.bokehY : 0;
    const variance = (hash(seed + 3) - 0.5) * config.bokehVariance * 2.2;
    return {
      id: `bokeh-${index}`,
      style: {
        "--bokeh-x": `${x.toFixed(1)}%`,
        "--bokeh-y": `${y.toFixed(1)}%`,
        "--bokeh-size": `${(18 + hash(seed + 4) * 62).toFixed(1)}px`,
        "--bokeh-blur": `${(config.bokehBlur + hash(seed + 5) * config.bokehBlur * 0.65).toFixed(1)}px`,
        "--bokeh-color": variedColor(config.color, variance),
        "--bokeh-alpha": `${(0.08 + hash(seed + 6) * 0.18).toFixed(2)}`,
        "--bokeh-delay": `${(-hash(seed + 7) * 7).toFixed(2)}s`,
        "--bokeh-motion-duration": `${(8 + hash(seed + 8) * 10).toFixed(2)}s`,
        "--bokeh-flash-duration": `${Math.max(config.bokehDuration / 100, 60 / Math.max(1, config.bokehFrequency)).toFixed(2)}s`,
        "--bokeh-travel-x": `${((hash(seed + 9) - 0.5) * directionX).toFixed(1)}px`,
        "--bokeh-travel-y": `${((hash(seed + 10) - 0.5) * directionY).toFixed(1)}px`,
      } as BokehStyle,
    };
  }), [config]);

  const viewportStyle = {
    width: `${config.width}%`,
    color: config.color,
    fontFamily: FONT_STACKS[config.fontFamily],
    "--sky-font-size": `${config.fontSize}px`,
    "--sky-font-weight": String(config.fontWeight),
    "--horizon-width": `${config.horizonWidth}%`,
    "--flicker-intensity": String(config.flickerIntensity / 100),
  } as CSSProperties;

  return (
    <section className={`lyrics-workbench__stage ${config.colorCycle ? "is-color-cycling" : ""}`} aria-label="可调参数歌词天际屏">
      <div className="lyrics-workbench__stage-toolbar">
        <div>
          <Waves size={14} />
          <span>LYRIC SKYLINE</span>
          <small>{config.gatherEnabled ? "像素凝聚" : "柔和显现"}</small>
        </div>
        <div>
          <button type="button" onClick={onRandomize} title="重新生成随机分布"><Shuffle size={14} /><span>随机</span></button>
          <button type="button" onClick={onPanelToggle} data-active={panelOpen} title={panelOpen ? "收起调参面板" : "展开调参面板"}><SlidersHorizontal size={14} /><span>{panelOpen ? "收起面板" : "调参面板"}</span></button>
        </div>
      </div>

      <div className="lyrics-workbench__viewport" data-align={config.alignment} data-fill={config.fillMode} style={viewportStyle}>
        {config.bokehEnabled && (
          <div className="lyrics-workbench__bokeh" data-motion={config.bokehMotion} aria-hidden="true">
            {bokeh.map((item) => <i key={item.id} style={item.style} />)}
          </div>
        )}

        <div className="lyrics-workbench__fragments" aria-hidden="true">
          {fragments.map((fragment) => (
            <span
              className="lyrics-workbench__fragment"
              data-flicker={fragment.flicker ? "true" : "false"}
              key={fragment.id}
              style={fragment.style}
            >
              {fragment.text}
            </span>
          ))}
        </div>

        <div className="lyrics-workbench__line-wrap">
          <div className="lyrics-workbench__line" key={`${safeIndex}-${config.gatherEnabled}`} data-flicker={config.flickerEnabled ? "true" : "false"}>
            {config.gatherEnabled ? (
              <ParticleTextCanvas
                text={current.text}
                nextTime={nextTime}
                currentTime={currentTime}
                isPlaying={isPlaying}
                config={config}
              />
            ) : current.text}
          </div>
          {config.horizonVisible && <div className="lyrics-workbench__horizon" aria-hidden="true" />}
          <div className="lyrics-workbench__next-line">{next.text}</div>
        </div>
      </div>

      <div className="lyrics-workbench__stage-status" aria-hidden="true">
        <span>{config.width}%</span>
        <span>{config.layerCount} LAYERS</span>
        <span>{config.particleSize}px PARTICLE</span>
      </div>
    </section>
  );
}

function RangeControl({
  label,
  value,
  min,
  max,
  step = 1,
  suffix = "",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="lyrics-workbench-control__range">
      <span><b>{label}</b><output>{value}{suffix}</output></span>
      <input aria-label={label} type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function SwitchControl({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="lyrics-workbench-control__switch">
      <span><b>{label}</b>{hint && <small>{hint}</small>}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <i aria-hidden="true" />
    </label>
  );
}

function PanelGroup({ title, icon, children, open = false }: { title: string; icon: ReactNode; children: ReactNode; open?: boolean }) {
  return (
    <details className="lyrics-workbench-panel__group" open={open}>
      <summary>{icon}<span>{title}</span><ChevronRight size={13} /></summary>
      <div className="lyrics-workbench-panel__group-content">{children}</div>
    </details>
  );
}

function CompactPlayer({ alignment, onAlignmentChange }: { alignment: LyricAlign; onAlignmentChange: (value: LyricAlign) => void }) {
  const {
    isPlaying,
    currentTrack,
    currentTime,
    duration,
    currentTrackIndex,
    repeatMode,
    playbackRate,
    togglePlay,
    playNextTrack,
    playPrevTrack,
    seek,
    toggleRepeatMode,
    togglePlaybackRate,
    selectTrack,
    adjustLyricLeft,
    adjustLyricRight,
  } = useAudio();

  if (!currentTrack) return null;

  return (
    <section className="lyrics-workbench-player" aria-label="音乐播放器">
      <div className="lyrics-workbench-player__track">
        <Image src={currentTrack.cover} alt="" width={42} height={42} unoptimized />
        <div><strong>{currentTrack.title}</strong><span>{currentTrack.artist}</span></div>
        <label title="选择歌曲"><ListMusic size={14} /><select value={currentTrackIndex} onChange={(event) => selectTrack(Number(event.target.value))}>{PLAYLIST.map((track, index) => <option value={index} key={`${track.title}-${index}`}>{track.title}</option>)}</select><ChevronDown size={12} /></label>
      </div>

      <div className="lyrics-workbench-player__timeline">
        <span>{formatTime(currentTime)}</span>
        <input aria-label="播放进度" type="range" min={0} max={Math.max(1, duration)} step={0.1} value={Math.min(currentTime, Math.max(1, duration))} onChange={(event) => seek(Number(event.target.value))} />
        <span>{formatTime(duration)}</span>
      </div>

      <div className="lyrics-workbench-player__controls">
        <button type="button" onClick={playPrevTrack} title="上一首"><SkipBack /></button>
        <button type="button" onClick={() => seek(currentTime - 10)} title="后退 10 秒"><Rewind /></button>
        <button className="is-primary" type="button" onClick={togglePlay} title={isPlaying ? "暂停" : "播放"}>{isPlaying ? <Pause /> : <Play />}</button>
        <button type="button" onClick={() => seek(currentTime + 10)} title="前进 10 秒"><FastForward /></button>
        <button type="button" onClick={playNextTrack} title="下一首"><SkipForward /></button>
        <i aria-hidden="true" />
        <button type="button" onClick={adjustLyricLeft} title="歌词提前 1 秒"><Clock3 /><span>-1s</span></button>
        <button type="button" onClick={adjustLyricRight} title="歌词延后 1 秒"><Clock3 /><span>+1s</span></button>
        {([[
          "left", AlignLeft,
        ], ["center", AlignCenter], ["right", AlignRight]] as const).map(([value, Icon]) => <button type="button" key={value} data-active={alignment === value} onClick={() => onAlignmentChange(value)} title={`${value} 对齐`}><Icon /></button>)}
        <button type="button" onClick={togglePlaybackRate} title="播放速度"><Gauge /><span>{playbackRate}x</span></button>
        <button type="button" onClick={toggleRepeatMode} data-active={repeatMode !== "none"} title="循环模式"><Repeat /></button>
      </div>
    </section>
  );
}

export default function LyricsSkylineStudio() {
  const { lyrics, currentLyricIndex, currentTime, isPlaying } = useAudio();
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [panelOpen, setPanelOpen] = useState(true);
  const [copyState, setCopyState] = useState<"idle" | "done">("idle");
  const activeLyrics = lyrics.length ? lyrics : DEMO_LYRICS;
  const activeIndex = lyrics.length
    ? Math.max(0, currentLyricIndex)
    : Math.floor(currentTime / 4) % DEMO_LYRICS.length;

  const update = <K extends keyof SkylineConfig>(key: K, value: SkylineConfig[K]) => {
    setConfig((current) => ({ ...current, [key]: value }));
  };

  const copyConfig = async () => {
    await navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setCopyState("done");
    window.setTimeout(() => setCopyState("idle"), 1600);
  };

  return (
    <div className="lyrics-workbench">
      <SkylineStage
        config={config}
        lyrics={activeLyrics}
        lyricIndex={activeIndex}
        currentTime={currentTime}
        isPlaying={isPlaying}
        panelOpen={panelOpen}
        onPanelToggle={() => setPanelOpen((current) => !current)}
        onRandomize={() => update("randomSeed", Math.floor(Math.random() * 9999))}
      />

      {panelOpen && (
        <aside className="lyrics-workbench-panel" aria-label="天际屏调参面板">
          <header>
            <div><SlidersHorizontal size={15} /><span><b>实时调参</b><small>所有修改立即作用于画面</small></span></div>
            <button type="button" onClick={() => setPanelOpen(false)} aria-label="收起调参面板"><ChevronRight /></button>
          </header>

          <div className="lyrics-workbench-panel__scroll">
            <PanelGroup title="画面与文字" icon={<Waves size={14} />} open>
              <div className="lyrics-workbench-control__grid">
                <RangeControl label="展示宽度" value={config.width} min={36} max={100} suffix="%" onChange={(value) => update("width", value)} />
                <RangeControl label="离散图层" value={config.layerCount} min={6} max={48} onChange={(value) => update("layerCount", value)} />
                <RangeControl label="主歌词字号" value={config.fontSize} min={14} max={64} suffix="px" onChange={(value) => update("fontSize", value)} />
                <RangeControl label="字重" value={config.fontWeight} min={300} max={800} step={20} onChange={(value) => update("fontWeight", value)} />
              </div>
              <label className="lyrics-workbench-control__select"><span>字体</span><select value={config.fontFamily} onChange={(event) => update("fontFamily", event.target.value as FontFamily)}><option value="sans">现代无衬线</option><option value="mono">等宽字体</option><option value="songti">宋体</option></select><ChevronDown size={12} /></label>
              <div className="lyrics-workbench-control__grid">
                <RangeControl label="前景模糊" value={config.foregroundBlur} min={0} max={8} step={0.1} suffix="px" onChange={(value) => update("foregroundBlur", value)} />
                <RangeControl label="背景模糊" value={config.backgroundBlur} min={1} max={18} step={0.1} suffix="px" onChange={(value) => update("backgroundBlur", value)} />
              </div>
              <SwitchControl label="歌词基准线" hint="主歌词下方细线" checked={config.horizonVisible} onChange={(value) => update("horizonVisible", value)} />
              {config.horizonVisible && <RangeControl label="线宽" value={config.horizonWidth} min={12} max={68} suffix="%" onChange={(value) => update("horizonWidth", value)} />}
            </PanelGroup>

            <PanelGroup title="离散与微运动" icon={<Shuffle size={14} />} open>
              <label className="lyrics-workbench-control__select"><span>运动方向</span><select value={config.motionAxis} onChange={(event) => update("motionAxis", event.target.value as MotionAxis)}><option value="both">横向与垂直</option><option value="horizontal">仅横向</option><option value="vertical">仅垂直</option><option value="still">保持静止</option></select><ChevronDown size={12} /></label>
              <div className="lyrics-workbench-control__grid">
                <RangeControl label="水平离散" value={config.horizontalScatter} min={24} max={92} suffix="%" onChange={(value) => update("horizontalScatter", value)} />
                <RangeControl label="垂直离散" value={config.verticalScatter} min={20} max={260} suffix="px" onChange={(value) => update("verticalScatter", value)} />
                <RangeControl label="水平幅度" value={config.motionX} min={0} max={80} suffix="px" onChange={(value) => update("motionX", value)} />
                <RangeControl label="垂直幅度" value={config.motionY} min={0} max={60} suffix="px" onChange={(value) => update("motionY", value)} />
              </div>
              <RangeControl label="运动周期" value={config.motionSpeed} min={4} max={24} suffix="s" onChange={(value) => update("motionSpeed", value)} />
              <SwitchControl label="随机微闪" hint="随机作用于前景和背景文字" checked={config.flickerEnabled} onChange={(value) => update("flickerEnabled", value)} />
              {config.flickerEnabled && <div className="lyrics-workbench-control__grid"><RangeControl label="频率" value={config.flickerFrequency} min={1} max={12} suffix="/min" onChange={(value) => update("flickerFrequency", value)} /><RangeControl label="时长" value={config.flickerDuration} min={30} max={320} step={10} suffix="ms" onChange={(value) => update("flickerDuration", value)} /><RangeControl label="强度" value={config.flickerIntensity} min={10} max={100} suffix="%" onChange={(value) => update("flickerIntensity", value)} /></div>}
            </PanelGroup>

            <PanelGroup title="像素粒子入场" icon={<Sparkles size={14} />} open>
              <SwitchControl label="粒子凝聚" hint="从粒子云凝聚为整句歌词" checked={config.gatherEnabled} onChange={(value) => update("gatherEnabled", value)} />
              {config.gatherEnabled && <div className="lyrics-workbench-control__grid"><RangeControl label="凝聚速度" value={config.gatherSpeed} min={0.35} max={2.5} step={0.05} suffix="x" onChange={(value) => update("gatherSpeed", value)} /><RangeControl label="弥散幅度" value={config.gatherSpread} min={40} max={520} suffix="px" onChange={(value) => update("gatherSpread", value)} /><RangeControl label="波纹" value={config.gatherWave} min={0} max={80} suffix="px" onChange={(value) => update("gatherWave", value)} /><RangeControl label="湍流" value={config.gatherTurbulence} min={0} max={100} onChange={(value) => update("gatherTurbulence", value)} /><RangeControl label="粒径" value={config.particleSize} min={1} max={4} step={0.25} suffix="px" onChange={(value) => update("particleSize", value)} /></div>}
            </PanelGroup>

            <PanelGroup title="像素粒子出场" icon={<Shuffle size={14} />}>
              <SwitchControl label="弥散湮灭" hint="整句歌词分解为像素粒子云" checked={config.dissolveEnabled} onChange={(value) => update("dissolveEnabled", value)} />
              {config.dissolveEnabled && <div className="lyrics-workbench-control__grid"><RangeControl label="湮灭速度" value={config.dissolveSpeed} min={0.35} max={2.5} step={0.05} suffix="x" onChange={(value) => update("dissolveSpeed", value)} /><RangeControl label="弥散幅度" value={config.dissolveSpread} min={40} max={620} suffix="px" onChange={(value) => update("dissolveSpread", value)} /><RangeControl label="波纹" value={config.dissolveWave} min={0} max={80} suffix="px" onChange={(value) => update("dissolveWave", value)} /><RangeControl label="湍流" value={config.dissolveTurbulence} min={0} max={120} onChange={(value) => update("dissolveTurbulence", value)} /></div>}
            </PanelGroup>

            <PanelGroup title="动态光斑" icon={<Sparkles size={14} />}>
              <SwitchControl label="显示光斑" hint="画面下半部的模糊微光" checked={config.bokehEnabled} onChange={(value) => update("bokehEnabled", value)} />
              {config.bokehEnabled && <><label className="lyrics-workbench-control__select"><span>运动方式</span><select value={config.bokehMotion} onChange={(event) => update("bokehMotion", event.target.value as BokehMotion)}><option value="float">自由漂浮</option><option value="horizontal">仅横向</option><option value="vertical">仅垂直</option><option value="still">保持静止</option></select><ChevronDown size={12} /></label><div className="lyrics-workbench-control__grid"><RangeControl label="随机数量" value={config.bokehCount} min={0} max={18} onChange={(value) => update("bokehCount", value)} /><RangeControl label="模糊" value={config.bokehBlur} min={8} max={70} suffix="px" onChange={(value) => update("bokehBlur", value)} /><RangeControl label="水平幅度" value={config.bokehX} min={0} max={90} suffix="px" onChange={(value) => update("bokehX", value)} /><RangeControl label="垂直幅度" value={config.bokehY} min={0} max={70} suffix="px" onChange={(value) => update("bokehY", value)} /><RangeControl label="闪动频率" value={config.bokehFrequency} min={1} max={12} suffix="/min" onChange={(value) => update("bokehFrequency", value)} /><RangeControl label="闪动时长" value={config.bokehDuration} min={80} max={900} step={20} suffix="ms" onChange={(value) => update("bokehDuration", value)} /><RangeControl label="明暗随机" value={config.bokehVariance} min={0} max={80} suffix="%" onChange={(value) => update("bokehVariance", value)} /></div></>}
            </PanelGroup>

            <PanelGroup title="颜色与导出" icon={<Download size={14} />}>
              <label className="lyrics-workbench-control__color"><span>歌词颜色</span><input type="color" value={config.color} onChange={(event) => update("color", event.target.value)} /><output>{config.color}</output></label>
              <div className="lyrics-workbench-control__segments" role="group" aria-label="歌词填充模式"><button type="button" data-active={config.fillMode === "gradient"} onClick={() => update("fillMode", "gradient")}>垂直渐变</button><button type="button" data-active={config.fillMode === "solid"} onClick={() => update("fillMode", "solid")}>纯色</button></div>
              <SwitchControl label="缓慢颜色轮换" hint="关闭时使用当前单色" checked={config.colorCycle} onChange={(value) => update("colorCycle", value)} />
              <div className="lyrics-workbench-panel__exports"><button type="button" onClick={() => downloadFile("lyric-skyline-config.json", JSON.stringify(config, null, 2), "application/json")}><Download /> JSON</button><button type="button" onClick={() => downloadFile("lyric-skyline-template.html", buildTemplate(config), "text/html")}><Download /> HTML</button><button type="button" onClick={() => void copyConfig()}>{copyState === "done" ? <Check /> : <Copy />}{copyState === "done" ? "已复制" : "复制配置"}</button></div>
              <button className="lyrics-workbench-panel__reset" type="button" onClick={() => setConfig(DEFAULT_CONFIG)}><RotateCcw size={13} /> 恢复经典方案</button>
            </PanelGroup>
          </div>
        </aside>
      )}

      <CompactPlayer alignment={config.alignment} onAlignmentChange={(value) => update("alignment", value)} />
    </div>
  );
}
