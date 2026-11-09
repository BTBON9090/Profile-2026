// src/app/page.tsx
"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Hero from "@/components/sections/hero";
import ProfileSection from "@/components/sections/profile-section";
import WorkSnapshots from "@/components/sections/work-snapshots";
import SnowEcosystem from "@/components/sections/snow-ecosystem";
import AIPlugins from "@/components/sections/ai-plugins";
import Footer from "@/components/layout/footer";
import type { BlockWallConfig } from "@/components/ui/block-wall-types";
import HomeV3 from "@/components/v3/home-v3";
import { useUIVersion } from "@/lib/ui-version-context";

// three.js 必须 client-only，禁用 SSR
const BlockWall = dynamic(() => import("@/components/ui/block-wall"), {
  ssr: false,
});
const BlockWallPanel = dynamic(
  () => import("@/components/ui/block-wall-panel"),
  { ssr: false }
);

// 首页方块墙背景参数（来自调参面板导出的好值）
const HOME_BLOCK_WALL_CONFIG: BlockWallConfig = {
  scene: {
    bgColor: "#000000",
    fogColor: "#000000",
    fogNear: 25,
    fogFar: 35,
    cameraFov: 51,
    cameraZ: 29,
    parallaxAmt: 2.5,
    driftSpeed: 0.19,
    driftRange: 0,
  },
  grid: {
    cols: 26,
    rows: 16,
    cellSize: 4.3,
    gap: 0.045,
    depth: 4.0,
  },
  geometry: {
    bevelMode: "real",
    bevelRadius: 0.1,
    fakeBevelIntensity: 0.3,
  },
  material: {
    preset: "matteWall",
    blockColor: "#151a22",
    glowColor: "#91b7d4",
    glowDensity: 0.035,
    glowIntensity: 0.1,
    hoverBoost: 0.12,
    opacity: 1,
    transmission: 0,
    roughness: 0.62,
    metalness: 0.04,
    clearcoat: 0.24,
    ior: 1.4,
  },
  lighting: {
    ambientColor: "#c7d7ed",
    ambientIntensity: 0.7,
    keyColor: "#ffffff",
    keyIntensity: 1.55,
    keyX: 8.5,
    keyY: 12,
    keyZ: 20,
    rimColor: "#371a94",
    rimIntensity: 0.45,
    rimX: -10,
    rimY: -4,
    rimZ: 8,
    pointEnabled: false,
    pointColor: "#ffffff",
    pointIntensity: 1.55,
    pointX: 14.5,
    pointY: 5.5,
    pointZ: -0.5,
  },
  animation: {
    autoFlipEnabled: true,
    hoverEnabled: true,
    flipMaxConcurrent: 3,
    flipTriggerInterval: 0.45,
    flipDurationMin: 1,
    flipDurationMax: 3,
    hoverRetreat: 0.85,
    hoverScale: 0.06,
    flipRetreat: 0,
    flipScaleReduce: 0.18,
  },
};

export default function Home() {
  const { version } = useUIVersion();
  if (version === "2") return <HomeV3 />;
  return <HomeV1 />;
}

function HomeV1() {
  const [config, setConfig] = useState<BlockWallConfig>(
    () => structuredClone(HOME_BLOCK_WALL_CONFIG)
  );

  const handleReset = useCallback(() => {
    setConfig(structuredClone(HOME_BLOCK_WALL_CONFIG));
  }, []);

  return (
    <div className="min-h-screen selection:bg-blue-500/30 selection:text-blue-200">
      {/* 方块墙背景 —— 固定铺满视口（fixed），不随页面滚动。
          interactive=true 但 canvas pointerEvents:none 不拦截上层点击，
          通过 document 级监听计算 hover 命中，保留悬停凹陷效果 */}
      <BlockWall
        config={config}
        className="fixed inset-0 z-0"
        interactive
      />

      {/* 调参面板 —— 浮动在左上，可实时调整方块墙参数 */}
      <BlockWallPanel
        config={config}
        onChange={setConfig}
        onReset={handleReset}
      />

      {/* Act 1 - Hero 头部区域 */}
      <Hero />
      {/* Act 2 - Profile 个人简介 */}
      <ProfileSection />
      {/* Act 3 - 作品快照宫格展示 */}
      <WorkSnapshots />
      {/* Act 4 - 雪诺浏览器（重点case） */}
      <SnowEcosystem />
      {/* Act 5 - AI 插件双星（重点case） */}
      <AIPlugins />
      {/* Act 6 - Let's Talk 底部联系 */}
      <Footer />
    </div>
  );
}
