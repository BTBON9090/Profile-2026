export type AppBoxKind = "app" | "web" | "plugin";

export type AppBoxProduct = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  kind: AppBoxKind;
  platform: string;
  version: string;
  icon?: string;
  mark?: string;
  tone: "blue" | "violet" | "figma" | "indigo" | "graphite";
  detailsHref: string;
  actionHref: string;
  actionLabel: string;
  actionExternal?: boolean;
  tags: string[];
  featured?: boolean;
};

export const appBoxProducts: AppBoxProduct[] = [
  {
    id: "launchpad",
    name: "LaunchPad",
    subtitle: "macOS 原生启动台",
    description: "为 macOS 找回熟悉的应用启动体验，支持快捷键、F4、触控板手势与触发角。",
    kind: "app",
    platform: "macOS",
    version: "2026",
    icon: "/product-assets/launchpad-icon.png",
    tone: "blue",
    detailsHref: "/work/launchpad",
    actionHref: "https://lightapp-1317980685.cos.ap-shanghai.myqcloud.com/launchpad/LaunchPad-latest.dmg",
    actionLabel: "下载应用",
    actionExternal: true,
    tags: ["SwiftUI", "原生应用", "效率"],
    featured: true,
  },
  {
    id: "aura",
    name: "Aura",
    subtitle: "本地优先的私密图片画廊",
    description: "用物理隔离、入口伪装与秘密解锁，保护只想留给自己的影像。",
    kind: "app",
    platform: "Android",
    version: "2026",
    icon: "/product-assets/aura-logo.png",
    tone: "violet",
    detailsHref: "/work/aura",
    actionHref: "https://mobileapp-1317980685.cos.ap-shanghai.myqcloud.com/aura/aura-release.bin",
    actionLabel: "下载 Aura",
    actionExternal: true,
    tags: ["Flutter", "隐私", "本地优先"],
  },
  {
    id: "allinone",
    name: "AllinOne",
    subtitle: "Figma 全能效率插件",
    description: "把 AI 说明书、多语言翻译、图层管理与 30+ 高频动作收进一个插件。",
    kind: "plugin",
    platform: "Figma",
    version: "V2",
    icon: "/allinone-site/Frame 21.png",
    tone: "figma",
    detailsHref: "/work/all-in-one-v2",
    actionHref: "https://www.figma.com/community/plugin/1579115225697225019/allinone",
    actionLabel: "在 Figma 获取",
    actionExternal: true,
    tags: ["Figma", "AI", "设计效率"],
  },
  {
    id: "ai-translate",
    name: "AI Translate",
    subtitle: "沉浸式 AI 翻译插件",
    description: "支持自定义 AI 模型、双语对照与划词翻译，让阅读过程尽量不被打断。",
    kind: "plugin",
    platform: "Chrome",
    version: "V2.0",
    icon: "/translate-site/icon128.png",
    tone: "indigo",
    detailsHref: "/work/ai-translate",
    actionHref: "https://lightapp-1317980685.cos.ap-shanghai.myqcloud.com/AI-Translate/AI-Translate-v2.0.0.zip",
    actionLabel: "下载安装包",
    actionExternal: true,
    tags: ["Chrome", "AI", "翻译"],
  },
  {
    id: "block-wall",
    name: "BlockWall",
    subtitle: "三维方块墙生成器",
    description: "在浏览器里实时调整材质、倒角、灯光和翻转动效，快速生成 3D 视觉背景。",
    kind: "web",
    platform: "Web",
    version: "Live",
    icon: "/product-assets/blockwall-icon.png",
    tone: "graphite",
    detailsHref: "/work/block-wall",
    actionHref: "/work/block-wall",
    actionLabel: "在线打开",
    tags: ["Three.js", "WebGL", "生成器"],
  },
  {
    id: "lyrics-skyline",
    name: "Lyric Skyline",
    subtitle: "可调参歌词天际屏播放器",
    description: "实时调整歌词层次、字体、模糊、离散与粒子效果，并导出可复用的视觉方案。",
    kind: "web",
    platform: "Web",
    version: "Studio",
    icon: "/product-assets/lyrics-skyline-icon.png",
    tone: "blue",
    detailsHref: "/tools/lyrics-skyline",
    actionHref: "/tools/lyrics-skyline",
    actionLabel: "在线打开",
    tags: ["音乐可视化", "歌词动效", "可导出"],
  },
  {
    id: "offer-guard",
    name: "薪算器",
    subtitle: "Offer 薪资结构拆解与比较工具",
    description: "把月薪、奖金、绩效和社保公积金整理成清晰结构，帮助你更从容地比较 Offer 与理解预计收入。",
    kind: "web",
    platform: "Web",
    version: "2026",
    icon: "/product-assets/offer-icon-option-01.png",
    tone: "blue",
    detailsHref: "/tools/offer-guard",
    actionHref: "/tools/offer-guard",
    actionLabel: "在线打开",
    tags: ["求职", "Offer", "薪资测算"],
  },
];

export const appBoxKindLabels: Record<AppBoxKind, string> = {
  app: "应用",
  web: "在线工具",
  plugin: "插件",
};
