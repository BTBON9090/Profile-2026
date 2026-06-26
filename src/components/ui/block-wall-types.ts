// src/components/ui/block-wall-types.ts
// BlockWall 全量可调参数模型

export type BevelMode = "none" | "fake" | "real";

export type MaterialPreset =
  | "standard"
  | "acrylic"
  | "frostedGlass"
  | "plastic"
  | "matteWall"
  | "metal";

export interface BlockWallConfig {
  /* ---------------- Scene 场景 ---------------- */
  scene: {
    bgColor: string;
    fogColor: string;
    fogNear: number;
    fogFar: number;
    cameraFov: number;
    cameraZ: number;
    parallaxAmt: number;
    driftSpeed: number;
    driftRange: number;
  };

  /* ---------------- Grid 网格 ---------------- */
  grid: {
    cols: number;
    rows: number;
    cellSize: number;
    gap: number;
    depth: number;
  };

  /* ---------------- Geometry 倒角 ---------------- */
  geometry: {
    bevelMode: BevelMode;
    bevelRadius: number; // real 倒角圆角半径
    fakeBevelIntensity: number; // fake 倒角边缘高光强度 0~1
  };

  /* ---------------- Material 材质 ---------------- */
  material: {
    preset: MaterialPreset;
    blockColor: string;
    glowColor: string;
    glowDensity: number; // 高光方块比例 0~1
    glowIntensity: number; // 高光提亮幅度 0~1
    hoverBoost: number; // hover 提亮 0~1
    // 高级材质参数（preset 选定后自动填入，可手动微调）
    opacity: number; // 0~1
    transmission: number; // 0~1 透明材质透射
    roughness: number; // 0~1
    metalness: number; // 0~1
    clearcoat: number; // 0~1
    ior: number; // 1~2.5
  };

  /* ---------------- Lighting 灯光 ---------------- */
  lighting: {
    ambientColor: string;
    ambientIntensity: number;
    keyColor: string;
    keyIntensity: number;
    keyX: number;
    keyY: number;
    keyZ: number;
    rimColor: string;
    rimIntensity: number;
    rimX: number;
    rimY: number;
    rimZ: number;
    pointEnabled: boolean;
    pointColor: string;
    pointIntensity: number;
    pointX: number;
    pointY: number;
    pointZ: number;
  };

  /* ---------------- Animation 动画 ---------------- */
  animation: {
    autoFlipEnabled: boolean;
    hoverEnabled: boolean;
    flipMaxConcurrent: number;
    flipTriggerInterval: number; // s
    flipDurationMin: number; // s
    flipDurationMax: number; // s
    hoverRetreat: number; // z 后退量
    hoverScale: number; // 缩小量 0~1
    flipRetreat: number; // 翻转 z 后退量
    flipScaleReduce: number; // 翻转缩小量 0~1
  };
}

/* 各 preset 对应的材质参数默认值，供面板切换 preset 时填入 */
export const PRESET_MATERIAL: Record<
  MaterialPreset,
  Pick<
    BlockWallConfig["material"],
    | "opacity"
    | "transmission"
    | "roughness"
    | "metalness"
    | "clearcoat"
    | "ior"
  >
> = {
  standard: {
    opacity: 1,
    transmission: 0,
    roughness: 0.62,
    metalness: 0.01,
    clearcoat: 0,
    ior: 1.4,
  },
  acrylic: {
    opacity: 0.55,
    transmission: 0.6,
    roughness: 0.15,
    metalness: 0,
    clearcoat: 1,
    ior: 1.5,
  },
  frostedGlass: {
    opacity: 0.4,
    transmission: 0.5,
    roughness: 0.85,
    metalness: 0,
    clearcoat: 0.2,
    ior: 1.4,
  },
  plastic: {
    opacity: 1,
    transmission: 0,
    roughness: 0.35,
    metalness: 0,
    clearcoat: 0.8,
    ior: 1.4,
  },
  matteWall: {
    opacity: 1,
    transmission: 0,
    roughness: 0.95,
    metalness: 0,
    clearcoat: 0,
    ior: 1.4,
  },
  metal: {
    opacity: 1,
    transmission: 0,
    roughness: 0.3,
    metalness: 0.9,
    clearcoat: 0.3,
    ior: 1.4,
  },
};

export const DEFAULT_CONFIG: BlockWallConfig = {
  scene: {
    bgColor: "#000000",
    fogColor: "#000000",
    fogNear: 22,
    fogFar: 52,
    cameraFov: 45,
    cameraZ: 22,
    parallaxAmt: 1.8,
    driftSpeed: 0.08,
    driftRange: 0.6,
  },
  grid: {
    cols: 26,
    rows: 16,
    cellSize: 4.0,
    gap: 0.01,
    depth: 4,
  },
  geometry: {
    bevelMode: "fake",
    bevelRadius: 0.05,
    fakeBevelIntensity: 0.3,
  },
  material: {
    preset: "standard",
    blockColor: "#1a1a1a",
    glowColor: "#ffffff",
    glowDensity: 0.06,
    glowIntensity: 0.18,
    hoverBoost: 0.22,
    ...PRESET_MATERIAL.standard,
  },
  lighting: {
    ambientColor: "#ffffff",
    ambientIntensity: 0.55,
    keyColor: "#ffffff",
    keyIntensity: 1.1,
    keyX: 6,
    keyY: 10,
    keyZ: 14,
    rimColor: "#b0c4ff",
    rimIntensity: 0.45,
    rimX: -10,
    rimY: -4,
    rimZ: 8,
    pointEnabled: false,
    pointColor: "#ffffff",
    pointIntensity: 0.6,
    pointX: 0,
    pointY: 0,
    pointZ: 18,
  },
  animation: {
    autoFlipEnabled: true,
    hoverEnabled: true,
    flipMaxConcurrent: 3,
    flipTriggerInterval: 0.45,
    flipDurationMin: 1.1,
    flipDurationMax: 2.0,
    hoverRetreat: 0.55,
    hoverScale: 0.08,
    flipRetreat: 1.6,
    flipScaleReduce: 0.12,
  },
};
