"use client";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio, type LyricLine } from "@/lib/audio-context";

// ================================================================
// [调参] 所有可调参数集中在这里
// ================================================================

/** 每批图层数量 */
const LAYERS_PER_BATCH = 4;
/** 同时可见最大批次数（前景 + 中景 + 背景 = 3 批） */
const MAX_VISIBLE_BATCHES = 3;

// -- 随机位置 --
const X_RANGE = 150;          // [调参] X 偏移范围：0 ~ 这个值 px
const Y_RANGE = 16;          // [调参] Y 偏移范围：±(这个值的一半) px

// -- 随机外观 --
const SCALE_MIN = 0.8;       // [调参] 基础缩放最小值
const SCALE_MAX = 1.4;       // [调参] 基础缩放最大值
const OPACITY_MIN = 0.30;    // [调参] 基础透明度最小值（前景）
const OPACITY_MAX = 0.80;    // [调参] 基础透明度最大值（前景）
const BLUR_MAX = 1.9;          // [调参] 基础模糊最大值（前景，px）

// -- 漂移 --
const DRIFT_DIST_MIN = 20;   // [调参] 漂移总距离最小值 (px)
const DRIFT_DIST_MAX = 80;   // [调参] 漂移总距离最大值 (px)
const DRIFT_DUR_MIN = 22;    // [调参] 漂移时长最小值 (秒，越大越慢)
const DRIFT_DUR_MAX = 50;    // [调参] 漂移时长最大值 (秒)

// -- 三阶段视觉效果 --
const STAGE = [
  { opacityMod: 0,     blurAdd: 0,   scaleMod: 0    }, // 阶段 0：前景，最亮
  { opacityMod: -0.25, blurAdd: 1.9,   scaleMod: 0.08 }, // 阶段 1：中景，变暗变糊
  { opacityMod: -0.50, blurAdd: 4,   scaleMod: 0.18 }, // 阶段 2：背景，很暗很糊
];

// -- 动画时长 --
const ENTER_DURATION = 0.8;  // [调参] 入场动画时长 (秒)
const SETTLE_DURATION = 0.9; // [调参] 批次向后沉降的过渡时长 (秒)
const EXIT_DURATION = 1;   // [调参] 退场动画时长 (秒)

// ================================================================

function hash(n: number): number {
  let h = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return h - Math.floor(h);
}

interface BatchLayer {
  id: number;
  batchIndex: number;
  text: string;
  anchorX: number;
  anchorY: number;
  baseScale: number;
  baseOpacity: number;
  baseBlur: number;
  driftX: number;
  driftY: number;
  driftDuration: number;
}

function generateBatchLayers(
  batchIndex: number,
  side: "left" | "right",
  lyrics: LyricLine[]
): BatchLayer[] {
  if (batchIndex < 0 || batchIndex >= lyrics.length) return [];
  const rawText = lyrics[batchIndex].text;
  if (!rawText) return [];
  const chars = [...rawText];
  if (chars.length === 0) return [];

  const seed = batchIndex * 2 + (side === "right" ? 1 : 0);
  const layers: BatchLayer[] = [];

  for (let li = 0; li < LAYERS_PER_BATCH; li++) {
    const s = (k: number) => seed * 7 + li * 13 + k;

    let fragment = "";
    const fragLen = 2 + Math.floor(hash(s(8)) * 2); // [调参] 每层 2~3 字
    if (side === "left") {
      fragment = chars.slice(Math.max(0, chars.length - fragLen)).join("");
    } else {
      fragment = chars.slice(0, Math.min(fragLen, chars.length)).join("");
    }

    const anchorX = hash(s(3)) * X_RANGE;
    const anchorY = (hash(s(0)) - 0.5) * Y_RANGE;
    const baseScale = SCALE_MIN + hash(s(1)) * (SCALE_MAX - SCALE_MIN);
    const baseOpacity = OPACITY_MIN + hash(s(2)) * (OPACITY_MAX - OPACITY_MIN);
    const baseBlur = hash(s(4)) * BLUR_MAX;

    const angle = hash(s(5)) * Math.PI * 2;
    const dist = DRIFT_DIST_MIN + hash(s(6)) * (DRIFT_DIST_MAX - DRIFT_DIST_MIN);
    const driftX = Math.cos(angle) * dist;
    const driftY = Math.sin(angle) * dist * 0.6; // [调参] Y 漂移是 X 的一半

    const driftDuration = DRIFT_DUR_MIN + hash(s(7)) * (DRIFT_DUR_MAX - DRIFT_DUR_MIN);

    layers.push({
      id: batchIndex * 10 + li,
      batchIndex,
      text: fragment,
      anchorX: Math.round(anchorX * 10) / 10,
      anchorY: Math.round(anchorY * 10) / 10,
      baseScale: Math.round(baseScale * 100) / 100,
      baseOpacity: Math.round(baseOpacity * 100) / 100,
      baseBlur: Math.round(baseBlur * 10) / 10,
      driftX: Math.round(driftX * 10) / 10,
      driftY: Math.round(driftY * 10) / 10,
      driftDuration: Math.round(driftDuration * 10) / 10,
    });
  }
  return layers;
}

function makeSideLayers(
  currentIndex: number,
  side: "left" | "right",
  lyrics: LyricLine[]
): { layer: BatchLayer; stage: number }[] {
  const result: { layer: BatchLayer; stage: number }[] = [];
  for (let i = 0; i < MAX_VISIBLE_BATCHES; i++) {
    const idx = currentIndex - i;
    if (idx < 0) continue;
    const layers = generateBatchLayers(idx, side, lyrics);
    layers.forEach((l) => result.push({ layer: l, stage: i }));
  }
  return result;
}

// ================================================================
// 主组件
// ================================================================
export default function LyricsDisplay() {
  const { currentTime, currentTrack, isDesktop, togglePlay, lyrics, currentLyricIndex } = useAudio();

  const { currentLine, nextLine } = useMemo(() => {
    if (lyrics.length === 0)
      return { currentLine: null, nextLine: null };
    return {
      currentLine: currentLyricIndex >= 0 ? lyrics[currentLyricIndex] : null,
      nextLine: currentLyricIndex + 1 < lyrics.length ? lyrics[currentLyricIndex + 1] : null,
    };
  }, [lyrics, currentLyricIndex]);

  const leftLayers = useMemo(
    () => makeSideLayers(currentLyricIndex, "left", lyrics),
    [currentLyricIndex, lyrics]
  );
  const rightLayers = useMemo(
    () => makeSideLayers(currentLyricIndex, "right", lyrics),
    [currentLyricIndex, lyrics]
  );

  if (!isDesktop) return null;
  if (!currentTrack) return null;
  if (lyrics.length === 0) return null;
  if (!currentLine) return null;

  return (
    <div
      className="hidden lg:grid items-start select-none cursor-pointer"
      style={{ gridTemplateColumns: "100px 360px 100px" }}
      onClick={togglePlay}
    >
      {/* 左列 */}
      <div className="relative h-14 self-center overflow-visible">
        <AnimatePresence>
          {leftLayers.map(({ layer, stage }) => (
            <DriftLayer key={layer.id} layer={layer} side="left" stage={stage} />
          ))}
        </AnimatePresence>
      </div>

      {/* 中间列 */}
      <div className="relative h-14 w-full overflow-hidden">
        <div className="absolute inset-0">
          <AnimatePresence mode="sync">
            <motion.span
              key={currentLyricIndex}
              className="absolute top-1/2 left-1/2 text-[13px] font-medium text-white whitespace-nowrap"
              initial={{ x: "-50%", y: 8, scale: 0.85, opacity: 0.3 }}
              animate={{ x: "-50%", y: -10, scale: 1.06, opacity: 0.75 }}
              exit={{ x: "-50%", y: -14, scale: 1.2, opacity: 0, filter: "blur(6px)" }}
              transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
            >
              {currentLine.text}
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-5">
          <AnimatePresence mode="sync">
            {nextLine && (
              <motion.span
                key={`next-${currentLyricIndex}`}
                className="absolute top-1/2 left-1/2 text-[10px] text-white/35 whitespace-nowrap"
                initial={{ x: "-50%", y: "-30%", opacity: 0 }}
                animate={{ x: "-50%", y: "-50%", opacity: 0.6, scale: 1 }}
                exit={{ x: "-50%", y: "-70%", opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {nextLine.text}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 右列 */}
      <div className="relative h-14 self-center overflow-visible">
        <AnimatePresence>
          {rightLayers.map(({ layer, stage }) => (
            <DriftLayer key={layer.id} layer={layer} side="right" stage={stage} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ================================================================
// DriftLayer：两层结构
//   外层 (motion.div) — Framer Motion 控制 opacity/scale/filter
//   内层 (span)      — CSS transition 控制匀速漂移
// ================================================================
function DriftLayer({
  layer,
  side,
  stage,
}: {
  layer: BatchLayer;
  side: "left" | "right";
  stage: number;
}) {
  const xBase = side === "left" ? "right" : "left";
  const anchorX = side === "left" ? -layer.anchorX : layer.anchorX;
  const anchorY = layer.anchorY;

  // 漂移在 50ms 后开始，避免与入场动画冲突
  const [driftOn, setDriftOn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDriftOn(true), 50);
    return () => clearTimeout(t);
  }, []);

  // 当前阶段外观
  const cfg = STAGE[Math.min(stage, 2)];
  const targetOpacity = Math.max(0.02, layer.baseOpacity + cfg.opacityMod);
  const targetBlur = layer.baseBlur + cfg.blurAdd;
  const targetScale = layer.baseScale + cfg.scaleMod;

  // 入场起始
  const fromOpacity = 0;
  const fromBlur = targetBlur + 6;
  const fromScale = targetScale - 0.12;

  // 退场终点
  const exitScale = targetScale + 0.25;
  const exitBlur = targetBlur + 10;

  return (
    <motion.div
      className="absolute"
      style={{ [xBase]: 0, top: "50%", zIndex: 10 - stage }}
      initial={{ opacity: fromOpacity, scale: fromScale, filter: `blur(${fromBlur}px)` }}
      animate={{
        opacity: targetOpacity,
        scale: targetScale,
        filter: `blur(${targetBlur}px)`,
      }}
      exit={{
        opacity: 0,
        scale: exitScale,
        filter: `blur(${exitBlur}px)`,
        transition: {
          duration: EXIT_DURATION,
          ease: [0.4, 0, 1, 1],
        },
      }}
      transition={{
        duration: stage === 0 ? ENTER_DURATION : SETTLE_DURATION,
        ease: [0.22, 0.61, 0.36, 1],
      }}
    >
      <span
        className="block text-[10px] whitespace-nowrap font-medium"
        style={{
          color: stage === 0 ? "rgba(255,255,255,0.85)" : undefined,
          transform: driftOn
            ? `translate(${anchorX + layer.driftX}px, ${anchorY + layer.driftY}px)`
            : `translate(${anchorX}px, ${anchorY}px)`,
          transition: driftOn
            ? `transform ${layer.driftDuration}s linear`
            : "none",
        }}
      >
        {layer.text}
      </span>
    </motion.div>
  );
}
