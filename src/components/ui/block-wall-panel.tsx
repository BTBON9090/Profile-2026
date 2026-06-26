// src/components/ui/block-wall-panel.tsx
"use client";

/**
 * BlockWallPanel — BlockWall 的浮动可折叠调参面板
 *
 * 右上角悬浮，自身可折叠；内部分组（Scene / Grid / Geometry / Material / Lighting / Animation），
 * 每组也可独立折叠。支持颜色、滑块、下拉、开关、按钮组等控件。
 * 通过 config + onChange 受控，调用方负责把变更写回 state。
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal,
  ChevronDown,
  RotateCcw,
  X,
  Copy,
  Check,
} from "lucide-react";
import type {
  BlockWallConfig,
  BevelMode,
  MaterialPreset,
} from "./block-wall-types";
import { DEFAULT_CONFIG, PRESET_MATERIAL } from "./block-wall-types";

/* ------------------------------------------------------------------ */
/* 小工具：受控字段的 set                                               */
/* ------------------------------------------------------------------ */
function setVal<T, K extends string>(obj: T, path: K, value: unknown): T {
  const keys = path.split(".");
  const next: Record<string, unknown> = JSON.parse(JSON.stringify(obj));
  let cur: Record<string, unknown> = next;
  for (let i = 0; i < keys.length - 1; i++) {
    cur[keys[i]] = { ...(cur[keys[i]] as object) };
    cur = cur[keys[i]] as Record<string, unknown>;
  }
  cur[keys[keys.length - 1]] = value;
  return next as T;
}

/* ------------------------------------------------------------------ */
/* 控件                                                                 */
/* ------------------------------------------------------------------ */
function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  fmt,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  fmt?: (v: number) => string;
}) {
  return (
    <label className="block">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] font-mono text-zinc-400">{label}</span>
        <span className="text-[10px] font-mono text-zinc-500 tabular-nums">
          {fmt ? fmt(value) : value.toFixed(2)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-blue-500
                   [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                   [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-400
                   [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(59,130,246,0.6)]
                   [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full
                   [&::-moz-range-thumb]:bg-blue-400 [&::-moz-range-thumb]:border-0"
      />
    </label>
  );
}

function ColorRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-2">
      <span className="text-[10px] font-mono text-zinc-400">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-mono text-zinc-500 tabular-nums uppercase">
          {value}
        </span>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-6 h-6 rounded bg-transparent border border-zinc-700 cursor-pointer p-0"
          style={{ padding: 0 }}
        />
      </div>
    </label>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-[10px] font-mono text-zinc-400">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative w-8 h-4 rounded-full transition-colors ${
          value ? "bg-blue-500/80" : "bg-zinc-700"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform ${
            value ? "translate-x-4" : ""
          }`}
        />
      </button>
    </label>
  );
}

function Select<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <label className="block">
      <div className="text-[10px] font-mono text-zinc-400 mb-1">{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-[10px] font-mono text-zinc-200 outline-none focus:border-blue-500"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

/* ------------------------------------------------------------------ */
/* 可折叠分组                                                           */
/* ------------------------------------------------------------------ */
function Section({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-zinc-800/80 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-2 group"
      >
        <span className="text-[11px] font-mono font-bold text-zinc-300 tracking-wider group-hover:text-white">
          {title}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pb-3 space-y-2.5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 面板主体                                                             */
/* ------------------------------------------------------------------ */
export default function BlockWallPanel({
  config,
  onChange,
  onReset,
}: {
  config: BlockWallConfig;
  onChange: (next: BlockWallConfig) => void;
  onReset?: () => void;
}) {
  const [collapsed, setCollapsed] = useState(true);
  const [copied, setCopied] = useState(false);

  /** 复制当前全部参数（JSON）到剪贴板 */
  async function handleCopy() {
    try {
      const text = JSON.stringify(config, null, 2);
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // 兜底：用临时 textarea
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  /** 通用更新：path -> value */
  function update<K extends string>(path: K, value: unknown) {
    onChange(setVal(config, path, value));
  }

  /** preset 切换时同步填入对应材质参数 */
  function changePreset(preset: MaterialPreset) {
    const m = { ...config.material, preset, ...PRESET_MATERIAL[preset] };
    onChange({ ...config, material: m });
  }

  return (
    // 左侧、下移到导航下方，避开顶部 navbar
    <div className="fixed top-20 left-2 z-50 font-mono select-none">
      <motion.div
        initial={false}
        animate={{ width: collapsed ? 44 : 300 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="relative"
      >
        {/* 折叠态：仅一个按钮 */}
        {collapsed ? (
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="w-8 h-8 rounded-lg bg-zinc-900/85 flex items-center justify-center text-zinc-300 hover:text-white hover:border-blue-500/60 transition-colors"
            title="展开调参面板"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        ) : (
          <div className="rounded-lg bg-zinc-900/85 backdrop-blur-md border border-zinc-700/80 shadow-2xl shadow-black/50 overflow-hidden">
            {/* 标题栏 */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800/80 bg-zinc-950/40">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[11px] font-bold text-zinc-200 tracking-wider">
                  方块墙
                </span>
                <span className="text-[9px] text-zinc-600">调参</span>
              </div>
              <div className="flex items-center gap-1">
                {onReset && (
                  <button
                    type="button"
                    onClick={onReset}
                    className="p-1 rounded text-zinc-500 hover:text-blue-400 hover:bg-zinc-800/60 transition-colors"
                    title="重置为默认配置"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleCopy}
                  className={`p-1 rounded transition-colors ${
                    copied
                      ? "text-green-400 bg-green-500/10"
                      : "text-zinc-500 hover:text-blue-400 hover:bg-zinc-800/60"
                  }`}
                  title={copied ? "已复制全部参数到剪贴板" : "复制当前全部参数（JSON）"}
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setCollapsed(true)}
                  className="p-1 rounded text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors"
                  title="折叠面板"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 滚动区 */}
            <div className="max-h-[70vh] overflow-y-auto px-3 py-1
                            [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent
                            [&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-thumb]:rounded-full">
              {/* 场景 */}
              <Section title="场景" defaultOpen>
                <ColorRow
                  label="背景色"
                  value={config.scene.bgColor}
                  onChange={(v) => update("scene.bgColor", v)}
                />
                <ColorRow
                  label="雾色"
                  value={config.scene.fogColor}
                  onChange={(v) => update("scene.fogColor", v)}
                />
                <Slider
                  label="雾近端"
                  value={config.scene.fogNear}
                  min={0}
                  max={60}
                  step={1}
                  onChange={(v) => update("scene.fogNear", v)}
                  fmt={(v) => v.toFixed(0)}
                />
                <Slider
                  label="雾远端"
                  value={config.scene.fogFar}
                  min={0}
                  max={120}
                  step={1}
                  onChange={(v) => update("scene.fogFar", v)}
                  fmt={(v) => v.toFixed(0)}
                />
                <Slider
                  label="相机视场"
                  value={config.scene.cameraFov}
                  min={20}
                  max={90}
                  step={1}
                  onChange={(v) => update("scene.cameraFov", v)}
                  fmt={(v) => v.toFixed(0) + "°"}
                />
                <Slider
                  label="相机距离"
                  value={config.scene.cameraZ}
                  min={8}
                  max={40}
                  step={0.5}
                  onChange={(v) => update("scene.cameraZ", v)}
                  fmt={(v) => v.toFixed(1)}
                />
                <Slider
                  label="视差强度"
                  value={config.scene.parallaxAmt}
                  min={0}
                  max={6}
                  step={0.1}
                  onChange={(v) => update("scene.parallaxAmt", v)}
                />
                <Slider
                  label="漂移速度"
                  value={config.scene.driftSpeed}
                  min={0}
                  max={0.5}
                  step={0.01}
                  onChange={(v) => update("scene.driftSpeed", v)}
                />
                <Slider
                  label="漂移范围"
                  value={config.scene.driftRange}
                  min={0}
                  max={2}
                  step={0.05}
                  onChange={(v) => update("scene.driftRange", v)}
                />
              </Section>

              {/* 网格 */}
              <Section title="网格">
                <Slider
                  label="列数"
                  value={config.grid.cols}
                  min={4}
                  max={40}
                  step={1}
                  onChange={(v) => update("grid.cols", v)}
                  fmt={(v) => v.toFixed(0)}
                />
                <Slider
                  label="行数"
                  value={config.grid.rows}
                  min={3}
                  max={30}
                  step={1}
                  onChange={(v) => update("grid.rows", v)}
                  fmt={(v) => v.toFixed(0)}
                />
                <Slider
                  label="方块尺寸"
                  value={config.grid.cellSize}
                  min={1}
                  max={8}
                  step={0.1}
                  onChange={(v) => update("grid.cellSize", v)}
                />
                <Slider
                  label="间距"
                  value={config.grid.gap}
                  min={0}
                  max={1}
                  step={0.01}
                  onChange={(v) => update("grid.gap", v)}
                />
                <Slider
                  label="深度"
                  value={config.grid.depth}
                  min={0.5}
                  max={12}
                  step={0.5}
                  onChange={(v) => update("grid.depth", v)}
                  fmt={(v) => v.toFixed(1)}
                />
              </Section>

              {/* 倒角 */}
              <Section title="倒角">
                <Select<BevelMode>
                  label="倒角模式"
                  value={config.geometry.bevelMode}
                  options={[
                    { value: "none", label: "无倒角" },
                    { value: "fake", label: "假倒角（边缘高光）" },
                    { value: "real", label: "真圆角（耗性能）" },
                  ]}
                  onChange={(v) => update("geometry.bevelMode", v)}
                />
                {config.geometry.bevelMode === "real" && (
                  <Slider
                    label="圆角半径"
                    value={config.geometry.bevelRadius}
                    min={0.01}
                    max={0.5}
                    step={0.01}
                    onChange={(v) => update("geometry.bevelRadius", v)}
                  />
                )}
                {config.geometry.bevelMode === "fake" && (
                  <Slider
                    label="高光强度"
                    value={config.geometry.fakeBevelIntensity}
                    min={0}
                    max={1}
                    step={0.05}
                    onChange={(v) => update("geometry.fakeBevelIntensity", v)}
                  />
                )}
              </Section>

              {/* 材质 */}
              <Section title="材质" defaultOpen>
                <Select<MaterialPreset>
                  label="材质预设"
                  value={config.material.preset}
                  options={[
                    { value: "standard", label: "标准漫反射" },
                    { value: "acrylic", label: "亚克力" },
                    { value: "frostedGlass", label: "磨砂玻璃" },
                    { value: "plastic", label: "塑料" },
                    { value: "matteWall", label: "哑光墙" },
                    { value: "metal", label: "金属" },
                  ]}
                  onChange={changePreset}
                />
                <ColorRow
                  label="方块色"
                  value={config.material.blockColor}
                  onChange={(v) => update("material.blockColor", v)}
                />
                <ColorRow
                  label="高光色"
                  value={config.material.glowColor}
                  onChange={(v) => update("material.glowColor", v)}
                />
                <Slider
                  label="高光密度"
                  value={config.material.glowDensity}
                  min={0}
                  max={0.5}
                  step={0.01}
                  onChange={(v) => update("material.glowDensity", v)}
                />
                <Slider
                  label="高光强度"
                  value={config.material.glowIntensity}
                  min={0}
                  max={1}
                  step={0.02}
                  onChange={(v) => update("material.glowIntensity", v)}
                />
                <Slider
                  label="悬停提亮"
                  value={config.material.hoverBoost}
                  min={0}
                  max={1}
                  step={0.02}
                  onChange={(v) => update("material.hoverBoost", v)}
                />
                <Slider
                  label="不透明度"
                  value={config.material.opacity}
                  min={0}
                  max={1}
                  step={0.02}
                  onChange={(v) => update("material.opacity", v)}
                />
                <Slider
                  label="透射率"
                  value={config.material.transmission}
                  min={0}
                  max={1}
                  step={0.02}
                  onChange={(v) => update("material.transmission", v)}
                />
                <Slider
                  label="粗糙度"
                  value={config.material.roughness}
                  min={0}
                  max={1}
                  step={0.02}
                  onChange={(v) => update("material.roughness", v)}
                />
                <Slider
                  label="金属度"
                  value={config.material.metalness}
                  min={0}
                  max={1}
                  step={0.02}
                  onChange={(v) => update("material.metalness", v)}
                />
                <Slider
                  label="清漆层"
                  value={config.material.clearcoat}
                  min={0}
                  max={1}
                  step={0.02}
                  onChange={(v) => update("material.clearcoat", v)}
                />
                <Slider
                  label="折射率"
                  value={config.material.ior}
                  min={1}
                  max={2.5}
                  step={0.05}
                  onChange={(v) => update("material.ior", v)}
                />
              </Section>

              {/* 灯光 */}
              <Section title="灯光">
                <ColorRow
                  label="环境光色"
                  value={config.lighting.ambientColor}
                  onChange={(v) => update("lighting.ambientColor", v)}
                />
                <Slider
                  label="环境光强度"
                  value={config.lighting.ambientIntensity}
                  min={0}
                  max={3}
                  step={0.05}
                  onChange={(v) => update("lighting.ambientIntensity", v)}
                />
                <ColorRow
                  label="主光色"
                  value={config.lighting.keyColor}
                  onChange={(v) => update("lighting.keyColor", v)}
                />
                <Slider
                  label="主光强度"
                  value={config.lighting.keyIntensity}
                  min={0}
                  max={4}
                  step={0.05}
                  onChange={(v) => update("lighting.keyIntensity", v)}
                />
                <Slider
                  label="主光 X"
                  value={config.lighting.keyX}
                  min={-20}
                  max={20}
                  step={0.5}
                  onChange={(v) => update("lighting.keyX", v)}
                />
                <Slider
                  label="主光 Y"
                  value={config.lighting.keyY}
                  min={-20}
                  max={20}
                  step={0.5}
                  onChange={(v) => update("lighting.keyY", v)}
                />
                <Slider
                  label="主光 Z"
                  value={config.lighting.keyZ}
                  min={-20}
                  max={20}
                  step={0.5}
                  onChange={(v) => update("lighting.keyZ", v)}
                />
                <ColorRow
                  label="轮廓光色"
                  value={config.lighting.rimColor}
                  onChange={(v) => update("lighting.rimColor", v)}
                />
                <Slider
                  label="轮廓光强度"
                  value={config.lighting.rimIntensity}
                  min={0}
                  max={3}
                  step={0.05}
                  onChange={(v) => update("lighting.rimIntensity", v)}
                />
                <Slider
                  label="轮廓光 X"
                  value={config.lighting.rimX}
                  min={-20}
                  max={20}
                  step={0.5}
                  onChange={(v) => update("lighting.rimX", v)}
                />
                <Slider
                  label="轮廓光 Y"
                  value={config.lighting.rimY}
                  min={-20}
                  max={20}
                  step={0.5}
                  onChange={(v) => update("lighting.rimY", v)}
                />
                <Slider
                  label="轮廓光 Z"
                  value={config.lighting.rimZ}
                  min={-20}
                  max={20}
                  step={0.5}
                  onChange={(v) => update("lighting.rimZ", v)}
                />
                <Toggle
                  label="点光源"
                  value={config.lighting.pointEnabled}
                  onChange={(v) => update("lighting.pointEnabled", v)}
                />
                {config.lighting.pointEnabled && (
                  <>
                    <ColorRow
                      label="点光色"
                      value={config.lighting.pointColor}
                      onChange={(v) => update("lighting.pointColor", v)}
                    />
                    <Slider
                      label="点光强度"
                      value={config.lighting.pointIntensity}
                      min={0}
                      max={4}
                      step={0.05}
                      onChange={(v) => update("lighting.pointIntensity", v)}
                    />
                    <Slider
                      label="点光 X"
                      value={config.lighting.pointX}
                      min={-20}
                      max={20}
                      step={0.5}
                      onChange={(v) => update("lighting.pointX", v)}
                    />
                    <Slider
                      label="点光 Y"
                      value={config.lighting.pointY}
                      min={-20}
                      max={20}
                      step={0.5}
                      onChange={(v) => update("lighting.pointY", v)}
                    />
                    <Slider
                      label="点光 Z"
                      value={config.lighting.pointZ}
                      min={-20}
                      max={20}
                      step={0.5}
                      onChange={(v) => update("lighting.pointZ", v)}
                    />
                  </>
                )}
              </Section>

              {/* 动画 */}
              <Section title="动画">
                <Toggle
                  label="自动翻转"
                  value={config.animation.autoFlipEnabled}
                  onChange={(v) => update("animation.autoFlipEnabled", v)}
                />
                <Toggle
                  label="悬停响应"
                  value={config.animation.hoverEnabled}
                  onChange={(v) => update("animation.hoverEnabled", v)}
                />
                <Slider
                  label="最大并发翻转"
                  value={config.animation.flipMaxConcurrent}
                  min={1}
                  max={10}
                  step={1}
                  onChange={(v) => update("animation.flipMaxConcurrent", v)}
                  fmt={(v) => v.toFixed(0)}
                />
                <Slider
                  label="翻转触发间隔"
                  value={config.animation.flipTriggerInterval}
                  min={0.1}
                  max={3}
                  step={0.05}
                  onChange={(v) => update("animation.flipTriggerInterval", v)}
                />
                <Slider
                  label="翻转最短时长"
                  value={config.animation.flipDurationMin}
                  min={0.3}
                  max={3}
                  step={0.05}
                  onChange={(v) => update("animation.flipDurationMin", v)}
                />
                <Slider
                  label="翻转最长时长"
                  value={config.animation.flipDurationMax}
                  min={0.5}
                  max={5}
                  step={0.1}
                  onChange={(v) => update("animation.flipDurationMax", v)}
                />
                <Slider
                  label="悬停后退"
                  value={config.animation.hoverRetreat}
                  min={0}
                  max={2}
                  step={0.05}
                  onChange={(v) => update("animation.hoverRetreat", v)}
                />
                <Slider
                  label="悬停缩小"
                  value={config.animation.hoverScale}
                  min={0}
                  max={0.5}
                  step={0.02}
                  onChange={(v) => update("animation.hoverScale", v)}
                />
                <Slider
                  label="翻转后退"
                  value={config.animation.flipRetreat}
                  min={0}
                  max={4}
                  step={0.1}
                  onChange={(v) => update("animation.flipRetreat", v)}
                />
                <Slider
                  label="翻转缩小"
                  value={config.animation.flipScaleReduce}
                  min={0}
                  max={0.5}
                  step={0.02}
                  onChange={(v) => update("animation.flipScaleReduce", v)}
                />
              </Section>

              {/* 底部说明 */}
              <div className="py-2 text-[9px] text-zinc-600 leading-relaxed">
                切换材质预设 / 网格 / 倒角会重建几何体，可能短暂卡顿。灯光与动画参数实时生效。
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

/** 重新导出默认配置，方便调用方做 reset */
export { DEFAULT_CONFIG };
