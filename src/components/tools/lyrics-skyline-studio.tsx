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
  Palette,
  Pause,
  Play,
  Repeat,
  Repeat1,
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
import { AnimatePresence, motion } from "framer-motion";
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
type FontFamily = "sans" | "mono" | "songti" | "playfair" | "notoSerif";
type NextFontFamily = "inherit" | FontFamily;
type MotionAxis = "both" | "horizontal" | "vertical" | "still";
type BokehMotion = "float" | "horizontal" | "vertical" | "still";
type GatherOrigin = "random" | "center" | "bottom" | "top" | "sides";
type BgMode = "solid" | "gradient";

type SkylineConfig = {
  width: number;
  randomSeed: number;
  layerCount: number;
  fontSize: number;
  fragmentFontSize: number;
  fontFamily: FontFamily;
  fontWeight: number;
  foregroundBlur: number;
  backgroundBlur: number;
  horizontalScatter: number;
  verticalScatter: number;
  centerGap: number;
  motionAxis: MotionAxis;
  motionX: number;
  motionY: number;
  motionSpeed: number;
  alignment: LyricAlign;
  fillMode: FillMode;
  color: string;
  colorCycle: boolean;
  gradientStart: string;
  gradientEnd: string;
  gradientStartAlpha: number;
  gradientEndAlpha: number;
  bgMode: BgMode;
  bgColor: string;
  bgColorEnd: string;
  horizonVisible: boolean;
  horizonWidth: number;
  lineGap: number;
  nextFontSize: number;
  nextFontFamily: NextFontFamily;
  entranceDuration: number;
  exitDuration: number;
  flickerEnabled: boolean;
  flickerFrequency: number;
  flickerDuration: number;
  flickerIntensity: number;
  bokehEnabled: boolean;
  bokehCount: number;
  bokehMotion: BokehMotion;
  bokehX: number;
  bokehY: number;
  bokehSizeRandom: number;
  bokehBlurRandom: number;
  bokehCenterY: number;
  bokehFrequency: number;
  bokehDuration: number;
  bokehVariance: number;
  bokehBlur: number;
  bokehSize: number;
  gatherEnabled: boolean;
  gatherSpeed: number;
  gatherSpread: number;
  gatherWave: number;
  gatherTurbulence: number;
  gatherOrigin: GatherOrigin;
  gatherFade: number;
  particleSize: number;
  particleGap: number;
  particleDensity: number;
  particleFlicker: number;
  particleSolid: boolean;
  particlesForAll: boolean;
  dissolveEnabled: boolean;
  dissolveSpeed: number;
  dissolveSpread: number;
  dissolveWave: number;
  dissolveTurbulence: number;
  dissolveFade: number;
  dissolveOrigin: GatherOrigin;
};

const DEFAULT_CONFIG: SkylineConfig = {
  width: 100,
  randomSeed: 43,
  layerCount: 57,
  fontSize: 61,
  fragmentFontSize: 24,
  fontFamily: "songti",
  fontWeight: 640,
  foregroundBlur: 0.5,
  backgroundBlur: 5.4,
  horizontalScatter: 51,
  verticalScatter: 40,
  centerGap: 15,
  motionAxis: "both",
  motionX: 140,
  motionY: 41,
  motionSpeed: 9,
  alignment: "center",
  fillMode: "gradient",
  color: "#78a4ff",
  colorCycle: false,
  gradientStart: "#f7ddab",
  gradientEnd: "#c07a4e",
  gradientStartAlpha: 100,
  gradientEndAlpha: 100,
  bgMode: "solid",
  bgColor: "#05070c",
  bgColorEnd: "#0d1526",
  horizonVisible: true,
  horizonWidth: 65,
  lineGap: 20,
  nextFontSize: 13,
  nextFontFamily: "inherit",
  entranceDuration: 1,
  exitDuration: 0.6,
  flickerEnabled: true,
  flickerFrequency: 6,
  flickerDuration: 90,
  flickerIntensity: 54,
  bokehEnabled: true,
  bokehCount: 56,
  bokehMotion: "float",
  bokehX: 90,
  bokehY: 120,
  bokehSizeRandom: 100,
  bokehBlurRandom: 100,
  bokehCenterY: 52,
  bokehFrequency: 7,
  bokehDuration: 360,
  bokehVariance: 79,
  bokehBlur: 43,
  bokehSize: 74,
  gatherEnabled: true,
  gatherSpeed: 2.3,
  gatherSpread: 108,
  gatherWave: 13,
  gatherTurbulence: 100,
  gatherOrigin: "random",
  gatherFade: 100,
  particleSize: 1.3,
  particleGap: 0,
  particleDensity: 57,
  particleFlicker: 79,
  particleSolid: false,
  particlesForAll: false,
  dissolveEnabled: false,
  dissolveSpeed: 2.5,
  dissolveSpread: 95,
  dissolveWave: 22,
  dissolveTurbulence: 28,
  dissolveFade: 100,
  dissolveOrigin: "random",
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
  playfair: 'var(--font-playfair), "Playfair Display", var(--font-noto-serif-sc), "Noto Serif SC", "Songti SC", serif',
  notoSerif: 'var(--font-noto-serif-sc), "Noto Serif SC", "Songti SC", serif',
};

const CANVAS_FONT_STACKS: Record<FontFamily, string> = {
  sans: 'system-ui, "PingFang SC", sans-serif',
  mono: '"SFMono-Regular", Menlo, monospace',
  songti: '"Songti SC", "STSong", serif',
  playfair: '"Playfair Display", "Noto Serif SC", "Songti SC", serif',
  notoSerif: '"Noto Serif SC", "Songti SC", serif',
};

const FONT_FAMILY_LABELS: Record<FontFamily, string> = {
  sans: "现代无衬线",
  mono: "等宽字体",
  songti: "宋体",
  playfair: "Playfair 英文衬线",
  notoSerif: "思源宋体",
};

const GRADIENT_PRESETS = [
  { name: "冷月银霜", start: "#eef4ff", end: "#8ba7cc" },
  { name: "暮金远山", start: "#f7ddab", end: "#c07a4e" },
  { name: "青瓷薄雾", start: "#ddf3ec", end: "#57a79e" },
  { name: "绯樱夜", start: "#ffdbe3", end: "#c05c7a" },
  { name: "烛火暖橙", start: "#ffdc9e", end: "#d8763e" },
  { name: "紫藤月下", start: "#e6dcff", end: "#8f77cf" },
  { name: "落日熔金", start: "#fa709a", end: "#fee140" },
  { name: "星河入梦", start: "#a18cd1", end: "#fbc2eb" },
  { name: "熔岩核心", start: "#f83600", end: "#f9d423" },
  { name: "冰川纪", start: "#8ec5fc", end: "#e0c3fc" },
  { name: "祖母绿", start: "#11998e", end: "#38ef7d" },
  { name: "电光紫", start: "#da22ff", end: "#9733ee" },
  { name: "深海萤火", start: "#6fe3c4", end: "#155e63" },
  { name: "空山新雨", start: "#b4dcbf", end: "#2f6353" },
  { name: "夜航星海", start: "#a6c0ff", end: "#2b3f6e" },
  { name: "残阳如血", start: "#ff9d76", end: "#66243a" },
  { name: "雾港孤灯", start: "#f4e3b2", end: "#5a4a58" },
  { name: "松间明月", start: "#f2f7de", end: "#5c7a52" },
];

/** 浅色背景下可见度更高的深色系渐变 */
const LIGHT_GRADIENT_PRESETS = [
  { name: "深海蓝", start: "#1e40af", end: "#0ea5e9" },
  { name: "森林绿", start: "#15803d", end: "#65a30d" },
  { name: "葡萄紫", start: "#7e22ce", end: "#c026d3" },
  { name: "胭脂红", start: "#be123c", end: "#f97316" },
  { name: "靛蓝夜", start: "#3730a3", end: "#6366f1" },
  { name: "翡翠深", start: "#0f766e", end: "#14b8a6" },
  { name: "咖啡豆", start: "#78350f", end: "#d97706" },
  { name: "品红潮", start: "#a21caf", end: "#ec4899" },
  { name: "钢青", start: "#155e75", end: "#0891b2" },
  { name: "暗金", start: "#92400e", end: "#ca8a04" },
  { name: "午夜灰", start: "#1e293b", end: "#475569" },
  { name: "玫瑰红", start: "#9f1239", end: "#e11d48" },
];

const BG_PRESETS = [
  { name: "夜空", color: "#05070c", end: "#05070c" },
  { name: "深空蓝", color: "#0a1128", end: "#04060f" },
  { name: "暗夜紫", color: "#120a1f", end: "#06030c" },
  { name: "墨绿", color: "#081712", end: "#030a07" },
  { name: "酒红夜", color: "#180a10", end: "#0a0408" },
  { name: "炭黑", color: "#101014", end: "#000000" },
  { name: "深海", color: "#06202e", end: "#020a10" },
  { name: "暮棕", color: "#171008", end: "#0a0703" },
];

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

function withAlpha(hex: string, alphaPct: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgb(${r} ${g} ${b} / ${(clamp(alphaPct, 0, 100) / 100).toFixed(3)})`;
}

function isLightColor(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55;
}

function easeInCubic(value: number) {
  return value * value * value;
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
  const stageBackground = config.bgMode === "gradient"
    ? `linear-gradient(180deg,${config.bgColor},${config.bgColorEnd})`
    : config.bgColor;
  const lyricColor = config.fillMode === "gradient" ? config.gradientStart : config.color;
  return `<!doctype html>
<html lang="zh-CN">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Lyric Skyline</title>
<style>
  :root{color-scheme:dark}*{box-sizing:border-box}body{margin:0;min-height:100dvh;display:grid;place-items:center;overflow:hidden;background:${stageBackground};color:${lyricColor};font-family:system-ui,sans-serif}.stage{position:relative;width:100vw;height:100dvh;display:grid;place-items:center;overflow:hidden}.skyline{position:relative;width:${config.width}%;height:72%;display:grid;place-items:center;overflow:hidden}.line{font-size:${config.fontSize}px;font-weight:${config.fontWeight};text-align:${config.alignment};opacity:0;filter:blur(12px);animation:reveal 1.2s cubic-bezier(.16,1,.3,1) forwards}.horizon{position:absolute;top:55%;left:50%;width:${config.horizonVisible ? config.horizonWidth : 0}%;height:1px;transform:translateX(-50%);background:linear-gradient(90deg,transparent,currentColor,transparent);opacity:.28}@keyframes reveal{to{opacity:1;filter:blur(0)}}@media(prefers-reduced-motion:reduce){*{animation:none!important}.line{opacity:1;filter:none}}
</style>
<main class="stage"><div class="skyline"><div class="line">在这里替换当前歌词</div></div><div class="horizon"></div></main>
<script>window.LYRIC_SKYLINE_CONFIG=${serialized};</script>
</html>`;
}

type FragmentStyle = CSSProperties & {
  "--sky-drift-x": string;
  "--sky-drift-y": string;
  "--sky-delay": string;
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

type Fragment = {
  id: string;
  text: string;
  opacity: number;
  flicker: boolean;
  xPct: number;
  yPx: number;
  driftX: number;
  driftY: number;
  motionDuration: number;
  motionDelay: number;
  fontSizePx: number;
  blur: number;
  depth: number;
  enterDelay: number;
  innerStyle: FragmentStyle;
};

type ParticleLayer = {
  key: string;
  text: string;
  fontSize: number;
  fontWeight: number;
  fontFamily: FontFamily;
  align: CanvasTextAlign;
  centerXPct: number;
  centerYOffset: number;
  opacity: number;
  driftX: number;
  driftY: number;
  driftDuration: number;
  driftDelay: number;
  shrinkToFit: boolean;
  boxHeight: number;
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
  layerOpacity: number;
  normY: number;
  driftX: number;
  driftY: number;
  driftDuration: number;
  driftDelay: number;
  enterStagger: number;
  exitStagger: number;
};

function SkylineParticlesCanvas({
  layers,
  nextTime,
  currentTime,
  isPlaying,
  config,
}: {
  layers: ParticleLayer[];
  nextTime: number | null;
  currentTime: number;
  isPlaying: boolean;
  config: SkylineConfig;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const clockRef = useRef({ currentTime, updatedAt: 0, isPlaying });
  const particleConfig = useMemo(() => ({
    color: config.color,
    colorCycle: config.colorCycle,
    fillMode: config.fillMode,
    gradientStart: config.gradientStart,
    gradientEnd: config.gradientEnd,
    gradientStartAlpha: config.gradientStartAlpha,
    gradientEndAlpha: config.gradientEndAlpha,
    dissolveEnabled: config.dissolveEnabled,
    dissolveSpeed: config.dissolveSpeed,
    dissolveSpread: config.dissolveSpread,
    dissolveTurbulence: config.dissolveTurbulence,
    dissolveWave: config.dissolveWave,
    dissolveFade: config.dissolveFade,
    dissolveOrigin: config.dissolveOrigin,
    gatherEnabled: config.gatherEnabled,
    gatherSpeed: config.gatherSpeed,
    gatherSpread: config.gatherSpread,
    gatherTurbulence: config.gatherTurbulence,
    gatherWave: config.gatherWave,
    gatherOrigin: config.gatherOrigin,
    gatherFade: config.gatherFade,
    particleSize: config.particleSize,
    particleGap: config.particleGap,
    particleDensity: config.particleDensity,
    particleFlicker: config.particleFlicker,
    particleSolid: config.particleSolid,
    randomSeed: config.randomSeed,
  }), [
    config.color,
    config.colorCycle,
    config.fillMode,
    config.gradientStart,
    config.gradientEnd,
    config.gradientStartAlpha,
    config.gradientEndAlpha,
    config.dissolveEnabled,
    config.dissolveSpeed,
    config.dissolveSpread,
    config.dissolveTurbulence,
    config.dissolveWave,
    config.dissolveFade,
    config.dissolveOrigin,
    config.gatherEnabled,
    config.gatherSpeed,
    config.gatherSpread,
    config.gatherTurbulence,
    config.gatherWave,
    config.gatherOrigin,
    config.gatherFade,
    config.particleSize,
    config.particleGap,
    config.particleDensity,
    config.particleFlicker,
    config.particleSolid,
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
    let disposed = false;

    const solid = particleConfig.particleSolid;
    // 实心模式靠逐像素填充，非实心模式提高上限让高密度粒子能真正填满文字
    const particleCap = solid ? 50000 : 24000;
    let currentStep = 1;

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

      // 采样步长只由间隙与密度决定（与粒子绘制尺寸解耦）：间隙拉开粒子间距，密度越高采样越细
      const densityScale = clamp(particleConfig.particleDensity, 25, 400) / 100;
      const sampleStep = solid
        ? 1
        : Math.max(1, Math.round((1 + particleConfig.particleGap) / densityScale));
      currentStep = sampleStep;

      const nextParticles: Particle[] = [];

      for (const layer of layers) {
        if (nextParticles.length >= particleCap) break;
        if (!layer.text) continue;
        let fontSize = layer.fontSize;
        const font = () => `${layer.fontWeight} ${fontSize}px ${CANVAS_FONT_STACKS[layer.fontFamily]}`;
        maskContext.font = font();
        let metrics = maskContext.measureText(layer.text);
        if (layer.shrinkToFit) {
          const maxLineWidth = cssWidth * 0.77;
          const maxLineHeight = layer.boxHeight * 0.96;
          while (fontSize > 13 && (
            metrics.width > maxLineWidth
            || metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent > maxLineHeight
          )) {
            fontSize -= 1;
            maskContext.font = font();
            metrics = maskContext.measureText(layer.text);
          }
        }

        const cx = (cssWidth * layer.centerXPct) / 100;
        const cy = cssHeight / 2 + layer.centerYOffset;
        maskContext.textAlign = layer.align;
        maskContext.textBaseline = "middle";
        maskContext.fillStyle = "#fff";
        maskContext.clearRect(0, 0, mask.width, mask.height);
        maskContext.fillText(layer.text, cx, cy);

        const textWidth = metrics.width;
        const rawHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        const textHeight = rawHeight > 0 ? rawHeight : fontSize * 1.4;
        const left = layer.align === "left" ? cx : layer.align === "right" ? cx - textWidth : cx - textWidth / 2;
        const top = cy - textHeight / 2;
        const pad = 4;
        const sx = Math.max(0, Math.floor(left - pad));
        const sy = Math.max(0, Math.floor(top - pad));
        const sw = Math.min(mask.width - sx, Math.ceil(textWidth + pad * 2));
        const sh = Math.min(mask.height - sy, Math.ceil(textHeight + pad * 2));
        if (sw <= 0 || sh <= 0) continue;

        const pixels = maskContext.getImageData(sx, sy, sw, sh).data;
        for (let y = 0; y < sh; y += sampleStep) {
          for (let xPosition = 0; xPosition < sw; xPosition += sampleStep) {
            const alpha = pixels[(y * sw + xPosition) * 4 + 3];
            if (alpha < 72) continue;
            const globalX = sx + xPosition;
            const globalY = sy + y;
            const seed = particleConfig.randomSeed * 131 + globalX * 7 + globalY * 11 + layer.key.length * 17;
            const spreadDistance = particleConfig.gatherSpread * (0.35 + hash(seed + 3) * 0.65);
            const exitDistance = particleConfig.dissolveSpread * (0.35 + hash(seed + 4) * 0.65);
            let startX: number;
            let startY: number;
            switch (particleConfig.gatherOrigin) {
              case "center":
                startX = cssWidth / 2 + (hash(seed + 1) - 0.5) * particleConfig.gatherSpread * 0.5;
                startY = cssHeight / 2 + (hash(seed + 5) - 0.5) * particleConfig.gatherSpread * 0.5;
                break;
              case "bottom":
                startX = globalX + (hash(seed + 1) - 0.5) * particleConfig.gatherSpread * 0.9;
                startY = cssHeight + spreadDistance * (0.3 + hash(seed + 5) * 1.2);
                break;
              case "top":
                startX = globalX + (hash(seed + 1) - 0.5) * particleConfig.gatherSpread * 0.9;
                startY = -spreadDistance * (0.3 + hash(seed + 5) * 1.2);
                break;
              case "sides": {
                const direction = globalX < cssWidth / 2 ? -1 : 1;
                startX = globalX + direction * spreadDistance;
                startY = globalY + (hash(seed + 1) - 0.5) * particleConfig.gatherSpread * 0.8;
                break;
              }
              default: {
                const startAngle = hash(seed + 1) * Math.PI * 2;
                startX = globalX + Math.cos(startAngle) * spreadDistance;
                startY = globalY + Math.sin(startAngle) * spreadDistance;
              }
            }
            let exitX: number;
            let exitY: number;
            switch (particleConfig.dissolveOrigin) {
              case "center":
                exitX = cssWidth / 2 + (hash(seed + 8) - 0.5) * particleConfig.dissolveSpread * 0.6;
                exitY = cssHeight / 2 + (hash(seed + 9) - 0.5) * particleConfig.dissolveSpread * 0.4;
                break;
              case "bottom":
                exitX = globalX + (hash(seed + 8) - 0.5) * particleConfig.dissolveSpread * 0.9;
                exitY = cssHeight + exitDistance * (0.3 + hash(seed + 9) * 1.2);
                break;
              case "top":
                exitX = globalX + (hash(seed + 8) - 0.5) * particleConfig.dissolveSpread * 0.9;
                exitY = -exitDistance * (0.3 + hash(seed + 9) * 1.2);
                break;
              case "sides": {
                const direction = globalX < cssWidth / 2 ? -1 : 1;
                exitX = globalX + direction * exitDistance;
                exitY = globalY + (hash(seed + 8) - 0.5) * particleConfig.dissolveSpread * 0.8;
                break;
              }
              default: {
                const exitAngle = hash(seed + 2) * Math.PI * 2;
                exitX = globalX + Math.cos(exitAngle) * exitDistance;
                exitY = globalY + Math.sin(exitAngle) * exitDistance;
              }
            }
            nextParticles.push({
              targetX: globalX,
              targetY: globalY,
              startX,
              startY,
              exitX,
              exitY,
              phase: hash(seed + 5) * Math.PI * 2,
              opacity: 0.48 + hash(seed + 6) * 0.52,
              layerOpacity: layer.opacity,
              normY: clamp((globalY - top) / Math.max(1, textHeight), 0, 1),
              driftX: layer.driftX,
              driftY: layer.driftY,
              driftDuration: layer.driftDuration,
              driftDelay: layer.driftDelay,
              enterStagger: hash(seed + 7) * 0.38,
              exitStagger: hash(seed + 10) * 0.32,
            });
            if (nextParticles.length >= particleCap) break;
          }
          if (nextParticles.length >= particleCap) break;
        }
      }
      particles = nextParticles;
      bornAt = performance.now();
    };

    const gradientStops = (() => {
      const start = hexToRgb(particleConfig.gradientStart);
      const end = hexToRgb(particleConfig.gradientEnd);
      const stops: { fill: string; alpha: number }[] = [];
      for (let index = 0; index <= 64; index += 1) {
        const t = index / 64;
        stops.push({
          fill: `rgb(${Math.round(start.r + (end.r - start.r) * t)} ${Math.round(start.g + (end.g - start.g) * t)} ${Math.round(start.b + (end.b - start.b) * t)})`,
          alpha: (particleConfig.gradientStartAlpha + (particleConfig.gradientEndAlpha - particleConfig.gradientStartAlpha) * t) / 100,
        });
      }
      return stops;
    })();

    const draw = (now: number) => {
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, cssWidth, cssHeight);

      const entryDuration = 2700 / Math.max(0.35, particleConfig.gatherSpeed);
      const rawEntry = reducedMotion || !particleConfig.gatherEnabled
        ? 1
        : clamp((now - bornAt) / entryDuration, 0, 1);
      const clock = clockRef.current;
      const audioTime = clock.currentTime + (clock.isPlaying ? Math.max(0, now - clock.updatedAt) / 1000 : 0);
      const exitDuration = 4.5 / Math.max(0.1, particleConfig.dissolveSpeed);
      const rawExit = particleConfig.dissolveEnabled && clock.isPlaying && nextTime !== null && nextTime > audioTime
        ? clamp(1 - (nextTime - audioTime) / exitDuration, 0, 1)
        : 0;
      const time = now / 1000;
      const baseRgb = hexToRgb(particleConfig.color);
      const cyclingHue = (time * 8 + particleConfig.randomSeed * 13) % 360;
      const solidFill = particleConfig.particleSolid;
      const flickerAmount = particleConfig.particleFlicker / 100;

      for (const particle of particles) {
        // 每粒子时序错落：凝聚像烟雾汇拢，而非整行文字同时移动
        const entryProgress = easeOutQuint(clamp((rawEntry - particle.enterStagger) / (1 - particle.enterStagger), 0, 1));
        // 弥散前慢后快（easeInCubic 消除突变），且在入场完成前被压制，保证先凝聚后湮灭
        const exitProgress = easeInCubic(clamp((rawExit - particle.exitStagger) / (1 - particle.exitStagger), 0, 1)) * rawEntry;
        const gatherX = particle.startX + (particle.targetX - particle.startX) * entryProgress;
        const gatherY = particle.startY + (particle.targetY - particle.startY) * entryProgress;
        const waveIn = Math.sin(particle.targetY * 0.055 + time * 3 + particle.phase) * particleConfig.gatherWave * (1 - entryProgress);
        const turbulenceIn = Math.sin(time * 7 + particle.phase * 2.7) * particleConfig.gatherTurbulence * 0.12 * (1 - entryProgress);
        const waveOut = Math.sin(particle.targetX * 0.035 + time * 4 + particle.phase) * particleConfig.dissolveWave * exitProgress;
        const turbulenceOut = Math.cos(time * 8 + particle.phase * 3.2) * particleConfig.dissolveTurbulence * 0.14 * exitProgress;
        let driftOffsetX = 0;
        let driftOffsetY = 0;
        if (particle.driftX !== 0 || particle.driftY !== 0) {
          const driftT = (time / Math.max(1, particle.driftDuration)) * Math.PI * 2 + particle.driftDelay;
          driftOffsetX = particle.driftX * Math.sin(driftT);
          driftOffsetY = particle.driftY * Math.sin(driftT * 0.83 + 1.3);
        }
        const x = gatherX + waveIn + turbulenceIn + (particle.exitX - particle.targetX) * exitProgress + waveOut + turbulenceOut + driftOffsetX;
        const y = gatherY + Math.cos(particle.phase + time * 2.4) * particleConfig.gatherWave * 0.25 * (1 - entryProgress) + (particle.exitY - particle.targetY) * exitProgress + driftOffsetY;

        let fill: string;
        let gradientAlpha = 1;
        if (particleConfig.colorCycle) {
          fill = `hsl(${cyclingHue} 78% 72%)`;
        } else if (particleConfig.fillMode === "gradient") {
          const stop = gradientStops[Math.round(particle.normY * 64)];
          fill = stop.fill;
          gradientAlpha = stop.alpha;
        } else {
          fill = `rgb(${baseRgb.r} ${baseRgb.g} ${baseRgb.b})`;
        }

        const fadeInAlpha = 1 - (particleConfig.gatherFade / 100) * (1 - entryProgress);
        const fadeOutAlpha = 1 - (particleConfig.dissolveFade / 100) * exitProgress;
        let alpha = particle.opacity * particle.layerOpacity * fadeInAlpha * fadeOutAlpha * gradientAlpha;
        if (flickerAmount > 0) {
          const wave = Math.sin(time * 9 + particle.phase * 4) > 0 ? 1 : 0.3;
          alpha *= 1 - flickerAmount * (1 - wave);
        }
        if (alpha <= 0.01) continue;
        context.globalAlpha = alpha;
        context.fillStyle = fill;
        // 绘制尺寸只受“粒子大小”控制：实心时铺满采样网格，普通模式按设定大小绘制
        const jitteredSize = particleConfig.particleSize * (0.8 + particle.opacity * 0.32);
        const size = solidFill
          ? currentStep + 0.6
          : Math.max(0.4, jitteredSize);
        context.fillRect(x, y, size, size);
      }
      context.globalAlpha = 1;
      frame = window.requestAnimationFrame(draw);
    };

    rebuild();
    if (document.fonts?.ready) {
      void document.fonts.ready.then(() => {
        if (!disposed) rebuild();
      });
    }
    const observer = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(rebuild, 90);
    });
    observer.observe(canvas);
    frame = window.requestAnimationFrame(draw);
    return () => {
      disposed = true;
      observer.disconnect();
      window.clearTimeout(resizeTimer);
      window.cancelAnimationFrame(frame);
    };
  }, [nextTime, particleConfig, layers]);

  return (
    <>
      <canvas ref={canvasRef} className="lyrics-workbench__skyline-canvas" aria-hidden="true" />
      <span className="sr-only">{layers[0]?.text ?? ""}</span>
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
  const allParticles = config.gatherEnabled && config.particlesForAll;
  // 减弱动效环境下 CSS 动画被禁用，入场位移会让歌词永远藏在蒙版外，退化为纯淡入
  const [reducedMotion] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const entranceOffset = reducedMotion ? 0 : config.fontSize * 1.65 + config.lineGap;

  const fragments = useMemo<Fragment[]>(() => Array.from({ length: config.layerCount }, (_, index) => {
    const source = [...current.text];
    const seed = config.randomSeed * 97 + safeIndex * 31 + index * 13;
    const length = 1 + Math.floor(hash(seed + 1) * 3);
    const start = Math.floor(hash(seed + 2) * Math.max(1, source.length - length));
    // 左对齐时离散文字只出现在右侧，右对齐时只出现在左侧，居中则两侧分布
    const side = config.alignment === "left" ? 1 : config.alignment === "right" ? -1 : index % 2 === 0 ? -1 : 1;
    const depth = index % 3;
    const innerGap = Math.min(config.centerGap, config.horizontalScatter - 8);
    const x = side * (innerGap + hash(seed + 3) * Math.max(8, config.horizontalScatter - innerGap));
    const y = (hash(seed + 4) - 0.5) * config.verticalScatter;
    const driftX = config.motionAxis === "both" || config.motionAxis === "horizontal"
      ? (hash(seed + 5) - 0.5) * config.motionX
      : 0;
    const driftY = config.motionAxis === "both" || config.motionAxis === "vertical"
      ? (hash(seed + 6) - 0.5) * config.motionY
      : 0;
    const blur = config.foregroundBlur + (depth / 2) * (config.backgroundBlur - config.foregroundBlur);
    const opacity = Math.max(0.08, 0.7 - depth * 0.21 - hash(seed + 7) * 0.1);
    const scale = 0.72 + hash(seed + 8) * 0.62 + depth * 0.07;
    const flicker = config.flickerEnabled && hash(seed + 9) > 1 - Math.min(0.8, config.flickerFrequency / 15);
    const motionDuration = Math.max(3.5, config.motionSpeed + hash(seed + 11) * 7);
    const motionDelay = -hash(seed + 10) * 8;
    // 离散字号独立于主歌词，围绕设定值做 0.7~1.3 倍的随机起伏
    const fontSizePx = Math.max(7, config.fragmentFontSize * (0.7 + hash(seed + 14) * 0.6));
    // 入场时序错落，让离散文字有烟雾般的渐显层次
    const enterDelay = index * 0.02 + hash(seed + 15) * 0.18;
    return {
      id: `${safeIndex}-${index}`,
      text: source.slice(start, start + length).join("") || current.text.slice(0, 2),
      opacity,
      flicker,
      xPct: x,
      yPx: y,
      driftX,
      driftY,
      motionDuration,
      motionDelay,
      fontSizePx,
      blur,
      depth,
      enterDelay,
      innerStyle: {
        "--sky-drift-x": `${driftX.toFixed(1)}px`,
        "--sky-drift-y": `${driftY.toFixed(1)}px`,
        "--sky-delay": `${motionDelay.toFixed(2)}s`,
        "--sky-motion-duration": `${motionDuration.toFixed(2)}s`,
        "--sky-flicker-duration": `${Math.max(0.8, config.flickerDuration / 50 + hash(seed + 12) * (13 / Math.max(1, config.flickerFrequency))).toFixed(2)}s`,
        "--sky-flicker-delay": `${(-hash(seed + 13) * 8).toFixed(2)}s`,
        "--sky-scale": `${scale.toFixed(2)}`,
        "--sky-opacity": `${opacity.toFixed(2)}`,
        fontSize: `${fontSizePx}px`,
      } as FragmentStyle,
    };
  }), [config, current.text, safeIndex]);

  const bokeh = useMemo(() => Array.from({ length: config.bokehCount }, (_, index) => {
    const seed = config.randomSeed * 173 + index * 23;
    const x = 8 + hash(seed + 1) * 84;
    const y = clamp(config.bokehCenterY + (hash(seed + 2) - 0.5) * 34, 4, 96);
    const directionX = config.bokehMotion === "float" || config.bokehMotion === "horizontal" ? config.bokehX : 0;
    const directionY = config.bokehMotion === "float" || config.bokehMotion === "vertical" ? config.bokehY : 0;
    const glowColor = config.fillMode === "gradient" ? config.gradientStart : config.color;
    const variance = (hash(seed + 3) - 0.5) * config.bokehVariance * 2.2;
    // 大小/模糊的随机幅度：0 时所有光斑一致，拉高后尺寸与模糊在设定值周围大幅起伏
    const sizeRand = config.bokehSizeRandom / 100;
    const blurRand = config.bokehBlurRandom / 100;
    const sizeScale = clamp(1 + (hash(seed + 4) - 0.5) * 2 * sizeRand * 1.6, 0.14, 2.6);
    const blurScale = clamp(1 + (hash(seed + 5) - 0.5) * 2 * blurRand * 1.4, 0.25, 2.4);
    return {
      id: `bokeh-${index}`,
      style: {
        "--bokeh-x": `${x.toFixed(1)}%`,
        "--bokeh-y": `${y.toFixed(1)}%`,
        "--bokeh-size": `${(config.bokehSize * sizeScale).toFixed(1)}px`,
        "--bokeh-blur": `${Math.max(1, config.bokehBlur * blurScale).toFixed(1)}px`,
        "--bokeh-color": variedColor(glowColor, variance),
        "--bokeh-alpha": `${(0.08 + hash(seed + 6) * 0.18).toFixed(2)}`,
        "--bokeh-delay": `${(-hash(seed + 7) * 7).toFixed(2)}s`,
        "--bokeh-motion-duration": `${(8 + hash(seed + 8) * 10).toFixed(2)}s`,
        "--bokeh-flash-duration": `${Math.max(config.bokehDuration / 100, 60 / Math.max(1, config.bokehFrequency)).toFixed(2)}s`,
        "--bokeh-travel-x": `${((hash(seed + 9) - 0.5) * directionX).toFixed(1)}px`,
        "--bokeh-travel-y": `${((hash(seed + 10) - 0.5) * directionY).toFixed(1)}px`,
      } as BokehStyle,
    };
  }), [config]);

  const particleLayers = useMemo<ParticleLayer[]>(() => {
    // 与 DOM 主歌词行盒的 4% 内边距保持一致，左右对齐时粒子文字不偏位
    const mainXPct = config.alignment === "left" ? 4 : config.alignment === "right" ? 96 : 50;
    const resolvedNextFamily: FontFamily = config.nextFontFamily === "inherit" ? config.fontFamily : config.nextFontFamily;
    const layers: ParticleLayer[] = [{
      key: "main",
      text: current.text,
      fontSize: config.fontSize,
      fontWeight: config.fontWeight,
      fontFamily: config.fontFamily,
      align: config.alignment,
      centerXPct: mainXPct,
      centerYOffset: 0,
      opacity: 1,
      driftX: 0,
      driftY: 0,
      driftDuration: 1,
      driftDelay: 0,
      shrinkToFit: true,
      boxHeight: config.fontSize * 1.65,
    }];
    if (allParticles) {
      for (const fragment of fragments) {
        layers.push({
          key: fragment.id,
          text: fragment.text,
          fontSize: fragment.fontSizePx,
          fontWeight: config.fontWeight,
          fontFamily: config.fontFamily,
          align: "center",
          centerXPct: 50 + fragment.xPct,
          centerYOffset: fragment.yPx,
          opacity: fragment.opacity,
          driftX: fragment.driftX,
          driftY: fragment.driftY,
          driftDuration: fragment.motionDuration,
          driftDelay: fragment.motionDelay,
          shrinkToFit: false,
          boxHeight: fragment.fontSizePx * 1.5,
        });
      }
      layers.push({
        key: "next",
        text: next.text,
        fontSize: config.nextFontSize,
        fontWeight: 450,
        fontFamily: resolvedNextFamily,
        align: config.alignment,
        centerXPct: mainXPct,
        centerYOffset: config.fontSize * 0.825 + config.lineGap * 1.55 + 1 + config.nextFontSize * 0.7,
        opacity: 0.4,
        driftX: 0,
        driftY: 0,
        driftDuration: 1,
        driftDelay: 0,
        shrinkToFit: false,
        boxHeight: config.nextFontSize * 1.5,
      });
    }
    return layers;
  }, [
    allParticles,
    config.alignment,
    config.fontSize,
    config.fontWeight,
    config.fontFamily,
    config.nextFontSize,
    config.nextFontFamily,
    config.lineGap,
    current.text,
    next.text,
    fragments,
  ]);

  const viewportStyle = {
    width: `${config.width}%`,
    color: config.color,
    fontFamily: FONT_STACKS[config.fontFamily],
    "--sky-font-size": `${config.fontSize}px`,
    "--sky-font-weight": String(config.fontWeight),
    "--horizon-width": `${config.horizonWidth}%`,
    "--flicker-intensity": String(config.flickerIntensity / 100),
    "--sky-gap": `${config.lineGap}px`,
    "--sky-next-size": `${config.nextFontSize}px`,
    "--sky-next-font": FONT_STACKS[config.nextFontFamily === "inherit" ? config.fontFamily : config.nextFontFamily],
    "--sky-grad-start": withAlpha(config.gradientStart, config.gradientStartAlpha),
    "--sky-grad-end": withAlpha(config.gradientEnd, config.gradientEndAlpha),
    "--sky-line-color": config.fillMode === "gradient" ? config.gradientStart : config.color,
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

        {!allParticles && (
          <div className="lyrics-workbench__fragments" aria-hidden="true">
            <AnimatePresence mode="sync">
              {fragments.map((fragment) => (
                <motion.span
                  className="lyrics-workbench__fragment-shell"
                  key={fragment.id}
                  style={{
                    left: `calc(50% + ${fragment.xPct.toFixed(1)}%)`,
                    top: `calc(50% + ${fragment.yPx.toFixed(1)}px)`,
                    zIndex: 6 - fragment.depth,
                  }}
                  initial={{ opacity: 0, scale: 0.88, filter: `blur(${(fragment.blur + 6).toFixed(1)}px)` }}
                  animate={{ opacity: 1, scale: 1, filter: `blur(${fragment.blur.toFixed(1)}px)` }}
                  exit={{
                    opacity: 0,
                    scale: 1.12,
                    filter: `blur(${(fragment.blur + 8).toFixed(1)}px)`,
                    transition: { duration: config.exitDuration, ease: [0.4, 0, 1, 1] },
                  }}
                  transition={{ duration: config.entranceDuration, delay: fragment.enterDelay, ease: [0.22, 0.61, 0.36, 1] }}
                >
                  <span
                    className="lyrics-workbench__fragment"
                    data-flicker={fragment.flicker ? "true" : "false"}
                    style={fragment.innerStyle}
                  >
                    {fragment.text}
                  </span>
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        )}

        {config.gatherEnabled ? (
          <SkylineParticlesCanvas
            layers={particleLayers}
            nextTime={nextTime}
            currentTime={currentTime}
            isPlaying={isPlaying}
            config={config}
          />
        ) : (
          <div className="lyrics-workbench__line-wrap">
            <div className="lyrics-workbench__line-mask">
              <AnimatePresence mode="sync">
                <motion.div
                  key={safeIndex}
                  className="lyrics-workbench__line"
                  // 从分割线上缘之下完全藏起，整体升起；位移随行盒高与行距自适应
                  initial={{ opacity: 0, y: entranceOffset }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    y: -12,
                    filter: "blur(6px)",
                    transition: { duration: config.exitDuration, ease: [0.4, 0, 1, 1] },
                  }}
                  transition={{ duration: config.entranceDuration, ease: [0.22, 0.61, 0.36, 1] }}
                >
                  {current.text}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}

        {config.horizonVisible && <div className="lyrics-workbench__horizon" aria-hidden="true" />}
        {!allParticles && (
          <AnimatePresence mode="sync">
            <motion.div
              key={`next-${safeIndex}`}
              className="lyrics-workbench__next-line"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6, transition: { duration: config.exitDuration * 0.7, ease: [0.4, 0, 1, 1] } }}
              transition={{ duration: config.entranceDuration * 0.7, delay: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
            >
              {next.text}
            </motion.div>
          </AnimatePresence>
        )}
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

function ColorControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [draft, setDraft] = useState(value);
  const [syncedValue, setSyncedValue] = useState(value);
  if (value !== syncedValue) {
    // 外部值变化时在渲染期同步草稿，避免 effect 级联渲染
    setSyncedValue(value);
    setDraft(value);
  }
  const commit = () => {
    const raw = draft.trim();
    if (/^#?[0-9a-fA-F]{3}$|^#?[0-9a-fA-F]{6}$/.test(raw)) {
      onChange(raw.startsWith("#") ? raw : `#${raw}`);
    } else {
      setDraft(value);
    }
  };
  return (
    <label className="lyrics-workbench-control__color">
      <span>{label}</span>
      <input type="color" value={value} onChange={(event) => onChange(event.target.value)} />
      <input
        type="text"
        value={draft}
        spellCheck={false}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => { if (event.key === "Enter") { commit(); event.currentTarget.blur(); } }}
      />
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
        {/* 图标与文字都随循环模式变化：单曲用 Repeat1，列表/单曲循环高亮，避免看不出当前状态 */}
        <button
          type="button"
          onClick={toggleRepeatMode}
          data-active={repeatMode !== "none"}
          title={repeatMode === "one" ? "单曲循环" : repeatMode === "all" ? "列表循环" : "不循环"}
        >
          {repeatMode === "one" ? <Repeat1 /> : <Repeat />}
          <span>{repeatMode === "one" ? "单曲" : repeatMode === "all" ? "列表" : "不循环"}</span>
        </button>
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

  const applyGradientPreset = (preset: { start: string; end: string }) => {
    setConfig((current) => ({ ...current, gradientStart: preset.start, gradientEnd: preset.end }));
  };

  const randomizeGradient = () => {
    // 浅色背景使用深色系预设，保证歌词可读性
    const presets = isLightColor(config.bgColor) ? LIGHT_GRADIENT_PRESETS : GRADIENT_PRESETS;
    const preset = presets[Math.floor(Math.random() * presets.length)];
    applyGradientPreset(preset);
  };

  const randomizeBackground = () => {
    const preset = BG_PRESETS[Math.floor(Math.random() * BG_PRESETS.length)];
    setConfig((current) => ({
      ...current,
      bgColor: preset.color,
      bgColorEnd: preset.end,
      bgMode: preset.color.toLowerCase() === preset.end.toLowerCase() ? "solid" : "gradient",
    }));
  };

  const backgroundValue = config.bgMode === "gradient"
    ? `linear-gradient(180deg, ${config.bgColor}, ${config.bgColorEnd})`
    : config.bgColor;

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--sky-page-bg", backgroundValue);
    return () => {
      root.style.removeProperty("--sky-page-bg");
    };
  }, [backgroundValue]);

  const copyConfig = async () => {
    await navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setCopyState("done");
    window.setTimeout(() => setCopyState("idle"), 1600);
  };

  return (
    <div
      className="lyrics-workbench"
      style={{
        background: backgroundValue,
        "--sky-bg": config.bgColor,
        "--sky-bg-end": config.bgMode === "gradient" ? config.bgColorEnd : config.bgColor,
        "--sky-glow": config.fillMode === "gradient" ? config.gradientStart : config.color,
      } as CSSProperties}
    >
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
            <PanelGroup title="颜色与背景" icon={<Palette size={14} />} open>
              <ColorControl label="歌词颜色" value={config.color} onChange={(value) => update("color", value)} />
              <div className="lyrics-workbench-control__segments" role="group" aria-label="歌词填充模式"><button type="button" data-active={config.fillMode === "gradient"} onClick={() => update("fillMode", "gradient")}>垂直渐变</button><button type="button" data-active={config.fillMode === "solid"} onClick={() => update("fillMode", "solid")}>纯色</button></div>
              {config.fillMode === "gradient" && (
                <>
                  <div className="lyrics-workbench-control__grid">
                    <ColorControl label="渐变起始色" value={config.gradientStart} onChange={(value) => update("gradientStart", value)} />
                    <ColorControl label="渐变末尾色" value={config.gradientEnd} onChange={(value) => update("gradientEnd", value)} />
                  </div>
                  <div className="lyrics-workbench-control__grid">
                    <RangeControl label="起始不透明度" value={config.gradientStartAlpha} min={0} max={100} suffix="%" onChange={(value) => update("gradientStartAlpha", value)} />
                    <RangeControl label="末尾不透明度" value={config.gradientEndAlpha} min={0} max={100} suffix="%" onChange={(value) => update("gradientEndAlpha", value)} />
                  </div>
                  <div className="lyrics-workbench-control__swatches" role="group" aria-label="渐变预设">
                    {(isLightColor(config.bgColor) ? LIGHT_GRADIENT_PRESETS : GRADIENT_PRESETS).map((preset) => (
                      <button
                        type="button"
                        key={preset.name}
                        title={preset.name}
                        aria-label={`应用渐变 ${preset.name}`}
                        data-active={config.gradientStart.toLowerCase() === preset.start.toLowerCase() && config.gradientEnd.toLowerCase() === preset.end.toLowerCase()}
                        style={{ background: `linear-gradient(135deg, ${preset.start}, ${preset.end})` }}
                        onClick={() => applyGradientPreset(preset)}
                      />
                    ))}
                  </div>
                  <button className="lyrics-workbench-control__wide-button" type="button" onClick={randomizeGradient}><Shuffle size={12} /> 随机渐变</button>
                </>
              )}
              <SwitchControl label="缓慢颜色轮换" hint="开启后覆盖上方颜色设置" checked={config.colorCycle} onChange={(value) => update("colorCycle", value)} />
              <div className="lyrics-workbench-control__segments" role="group" aria-label="背景模式"><button type="button" data-active={config.bgMode === "solid"} onClick={() => update("bgMode", "solid")}>纯色背景</button><button type="button" data-active={config.bgMode === "gradient"} onClick={() => update("bgMode", "gradient")}>渐变背景</button></div>
              <div className="lyrics-workbench-control__grid">
                <ColorControl label="背景色" value={config.bgColor} onChange={(value) => update("bgColor", value)} />
                {config.bgMode === "gradient"
                  ? <ColorControl label="背景末尾色" value={config.bgColorEnd} onChange={(value) => update("bgColorEnd", value)} />
                  : <span />}
              </div>
              <button className="lyrics-workbench-control__wide-button" type="button" onClick={randomizeBackground}><Shuffle size={12} /> 随机背景</button>
            </PanelGroup>

            <PanelGroup title="画面与文字" icon={<Waves size={14} />} open>
              <div className="lyrics-workbench-control__grid">
                <RangeControl label="展示宽度" value={config.width} min={36} max={100} suffix="%" onChange={(value) => update("width", value)} />
                <RangeControl label="离散图层" value={config.layerCount} min={6} max={72} onChange={(value) => update("layerCount", value)} />
                <RangeControl label="主歌词字号" value={config.fontSize} min={14} max={64} suffix="px" onChange={(value) => update("fontSize", value)} />
                <RangeControl label="字重" value={config.fontWeight} min={300} max={800} step={20} onChange={(value) => update("fontWeight", value)} />
                <RangeControl label="离散字号" value={config.fragmentFontSize} min={7} max={40} suffix="px" onChange={(value) => update("fragmentFontSize", value)} />
              </div>
              <label className="lyrics-workbench-control__select"><span>字体</span><select value={config.fontFamily} onChange={(event) => update("fontFamily", event.target.value as FontFamily)}>{(Object.keys(FONT_FAMILY_LABELS) as FontFamily[]).map((family) => <option value={family} key={family}>{FONT_FAMILY_LABELS[family]}</option>)}</select><ChevronDown size={12} /></label>
              <div className="lyrics-workbench-control__grid">
                <RangeControl label="行间距" value={config.lineGap} min={0} max={72} suffix="px" onChange={(value) => update("lineGap", value)} />
                <RangeControl label="下一句字号" value={config.nextFontSize} min={8} max={24} suffix="px" onChange={(value) => update("nextFontSize", value)} />
              </div>
              <label className="lyrics-workbench-control__select"><span>下一句字体</span><select value={config.nextFontFamily} onChange={(event) => update("nextFontFamily", event.target.value as NextFontFamily)}><option value="inherit">跟随主字体</option>{(Object.keys(FONT_FAMILY_LABELS) as FontFamily[]).map((family) => <option value={family} key={family}>{FONT_FAMILY_LABELS[family]}</option>)}</select><ChevronDown size={12} /></label>
              <div className="lyrics-workbench-control__grid">
                <RangeControl label="入场时长" value={config.entranceDuration} min={0.3} max={2} step={0.05} suffix="s" onChange={(value) => update("entranceDuration", value)} />
                <RangeControl label="出场时长" value={config.exitDuration} min={0} max={2} step={0.05} suffix="s" onChange={(value) => update("exitDuration", value)} />
              </div>
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
                <RangeControl label="中间间距" value={config.centerGap} min={8} max={45} suffix="%" onChange={(value) => update("centerGap", value)} />
                <RangeControl label="水平幅度" value={config.motionX} min={0} max={140} suffix="px" onChange={(value) => update("motionX", value)} />
                <RangeControl label="垂直幅度" value={config.motionY} min={0} max={120} suffix="px" onChange={(value) => update("motionY", value)} />
              </div>
              <RangeControl label="运动周期" value={config.motionSpeed} min={4} max={24} suffix="s" onChange={(value) => update("motionSpeed", value)} />
              <SwitchControl label="随机微闪" hint="仅作用于两侧离散文字，强度=变暗幅度" checked={config.flickerEnabled} onChange={(value) => update("flickerEnabled", value)} />
              {config.flickerEnabled && <div className="lyrics-workbench-control__grid"><RangeControl label="频率" value={config.flickerFrequency} min={1} max={12} suffix="/min" onChange={(value) => update("flickerFrequency", value)} /><RangeControl label="时长" value={config.flickerDuration} min={30} max={320} step={10} suffix="ms" onChange={(value) => update("flickerDuration", value)} /><RangeControl label="强度" value={config.flickerIntensity} min={10} max={100} suffix="%" onChange={(value) => update("flickerIntensity", value)} /></div>}
            </PanelGroup>

            <PanelGroup title="像素粒子入场" icon={<Sparkles size={14} />} open>
              <SwitchControl label="粒子凝聚" hint="从粒子云凝聚为整句歌词" checked={config.gatherEnabled} onChange={(value) => update("gatherEnabled", value)} />
              {config.gatherEnabled && (
                <>
                  <SwitchControl label="应用于所有歌词" hint="离散歌词与下一句同步粒子化" checked={config.particlesForAll} onChange={(value) => update("particlesForAll", value)} />
                  <SwitchControl label="完美填充" hint="逐像素实心填充，凝聚后看不到粒子间隙" checked={config.particleSolid} onChange={(value) => update("particleSolid", value)} />
                  <label className="lyrics-workbench-control__select"><span>入场形态</span><select value={config.gatherOrigin} onChange={(event) => update("gatherOrigin", event.target.value as GatherOrigin)}><option value="random">随机散布</option><option value="center">中心汇聚</option><option value="bottom">底部升起</option><option value="top">顶部落下</option><option value="sides">两侧收拢</option></select><ChevronDown size={12} /></label>
                  <div className="lyrics-workbench-control__grid">
                    <RangeControl label="凝聚速度" value={config.gatherSpeed} min={0.35} max={2.5} step={0.05} suffix="x" onChange={(value) => update("gatherSpeed", value)} />
                    <RangeControl label="弥散幅度" value={config.gatherSpread} min={40} max={520} suffix="px" onChange={(value) => update("gatherSpread", value)} />
                    <RangeControl label="波纹" value={config.gatherWave} min={0} max={80} suffix="px" onChange={(value) => update("gatherWave", value)} />
                    <RangeControl label="湍流" value={config.gatherTurbulence} min={0} max={100} onChange={(value) => update("gatherTurbulence", value)} />
                    <RangeControl label="粒子大小" value={config.particleSize} min={0.3} max={6} step={0.1} suffix="px" onChange={(value) => update("particleSize", value)} />
                    <RangeControl label="粒子间隙" value={config.particleGap} min={0} max={8} step={0.5} suffix="px" onChange={(value) => update("particleGap", value)} />
                    <RangeControl label="粒子密度" value={config.particleDensity} min={25} max={400} suffix="%" onChange={(value) => update("particleDensity", value)} />
                    <RangeControl label="粒子闪烁" value={config.particleFlicker} min={0} max={100} suffix="%" onChange={(value) => update("particleFlicker", value)} />
                    <RangeControl label="渐显" value={config.gatherFade} min={0} max={100} suffix="%" onChange={(value) => update("gatherFade", value)} />
                  </div>
                </>
              )}
            </PanelGroup>

            <PanelGroup title="像素粒子出场" icon={<Shuffle size={14} />}>
              <SwitchControl label="弥散湮灭" hint="整句歌词分解为像素粒子云" checked={config.dissolveEnabled} onChange={(value) => update("dissolveEnabled", value)} />
              {config.dissolveEnabled && <><label className="lyrics-workbench-control__select"><span>出场形态</span><select value={config.dissolveOrigin} onChange={(event) => update("dissolveOrigin", event.target.value as GatherOrigin)}><option value="random">随机散布</option><option value="center">中心消散</option><option value="bottom">向下飘落</option><option value="top">向上升腾</option><option value="sides">两侧飞散</option></select><ChevronDown size={12} /></label><div className="lyrics-workbench-control__grid"><RangeControl label="湮灭速度" value={config.dissolveSpeed} min={0.1} max={2.5} step={0.05} suffix="x" onChange={(value) => update("dissolveSpeed", value)} /><RangeControl label="弥散幅度" value={config.dissolveSpread} min={40} max={620} suffix="px" onChange={(value) => update("dissolveSpread", value)} /><RangeControl label="波纹" value={config.dissolveWave} min={0} max={80} suffix="px" onChange={(value) => update("dissolveWave", value)} /><RangeControl label="湍流" value={config.dissolveTurbulence} min={0} max={120} onChange={(value) => update("dissolveTurbulence", value)} /><RangeControl label="渐隐" value={config.dissolveFade} min={0} max={100} suffix="%" onChange={(value) => update("dissolveFade", value)} /></div></>}
            </PanelGroup>

            <PanelGroup title="动态光斑" icon={<Sparkles size={14} />}>
              <SwitchControl label="显示光斑" hint="画面中漂浮的模糊微光" checked={config.bokehEnabled} onChange={(value) => update("bokehEnabled", value)} />
              {config.bokehEnabled && <><label className="lyrics-workbench-control__select"><span>运动方式</span><select value={config.bokehMotion} onChange={(event) => update("bokehMotion", event.target.value as BokehMotion)}><option value="float">自由漂浮</option><option value="horizontal">仅横向</option><option value="vertical">仅垂直</option><option value="still">保持静止</option></select><ChevronDown size={12} /></label><div className="lyrics-workbench-control__grid"><RangeControl label="随机数量" value={config.bokehCount} min={0} max={56} onChange={(value) => update("bokehCount", value)} /><RangeControl label="光斑大小" value={config.bokehSize} min={10} max={120} suffix="px" onChange={(value) => update("bokehSize", value)} /><RangeControl label="大小随机" value={config.bokehSizeRandom} min={0} max={100} suffix="%" onChange={(value) => update("bokehSizeRandom", value)} /><RangeControl label="模糊" value={config.bokehBlur} min={8} max={70} suffix="px" onChange={(value) => update("bokehBlur", value)} /><RangeControl label="模糊随机" value={config.bokehBlurRandom} min={0} max={100} suffix="%" onChange={(value) => update("bokehBlurRandom", value)} /><RangeControl label="垂直位置" value={config.bokehCenterY} min={10} max={90} suffix="%" onChange={(value) => update("bokehCenterY", value)} /><RangeControl label="水平幅度" value={config.bokehX} min={0} max={90} suffix="px" onChange={(value) => update("bokehX", value)} /><RangeControl label="垂直幅度" value={config.bokehY} min={0} max={120} suffix="px" onChange={(value) => update("bokehY", value)} /><RangeControl label="闪动频率" value={config.bokehFrequency} min={1} max={12} suffix="/min" onChange={(value) => update("bokehFrequency", value)} /><RangeControl label="闪动时长" value={config.bokehDuration} min={80} max={900} step={20} suffix="ms" onChange={(value) => update("bokehDuration", value)} /><RangeControl label="明暗随机" value={config.bokehVariance} min={0} max={80} suffix="%" onChange={(value) => update("bokehVariance", value)} /></div></>}
            </PanelGroup>

            <PanelGroup title="导出" icon={<Download size={14} />}>
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
