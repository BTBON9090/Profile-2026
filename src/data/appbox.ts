export type AppBoxKind = "app" | "web" | "plugin" | "skill";

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
  /** 精选卡片右侧的两条标注文案 */
  featureNotes?: [string, string];
};

export const appBoxProducts: AppBoxProduct[] = [
  {
    id: "parking-master",
    name: "老司机是怎样炼成的",
    subtitle: "低多边形开放驾驶游戏",
    description: "24 种座驾，从城市与山路开到矿场和环线高速。挑战三层地库与综合驾驶试验场，支持画质选择、键鼠与横屏触控。",
    kind: "app",
    platform: "Android · iOS · iPad",
    version: "0.32.0",
    icon: "/parking-master/assets/icon.png",
    tone: "graphite",
    detailsHref: "/appbox/parking-master",
    actionHref: "/parking-master/index.html#download",
    actionLabel: "选择设备下载",
    tags: ["驾驶游戏", "低多边形", "在线体验"],
    featureNotes: ["九张自由驾驶地图", "横屏触控与画质调节"],
  },
  {
    id: "launchpad",
    name: "LaunchPad",
    subtitle: "macOS 原生启动台",
    description: "为 macOS 找回熟悉的应用启动体验，支持快捷键、F4、触控板手势与触发角。",
    kind: "app",
    platform: "macOS",
    version: "1.1.15",
    icon: "/product-assets/launchpad-icon.png",
    tone: "blue",
    detailsHref: "/work/launchpad",
    actionHref: "https://lightapp-1317980685.cos.ap-shanghai.myqcloud.com/launchpad/LaunchPad-latest.dmg",
    actionLabel: "下载应用",
    actionExternal: true,
    tags: ["SwiftUI", "原生应用", "效率"],
    featured: true,
    featureNotes: ["Native SwiftUI", "Ready to download"],
  },
  {
    id: "aura",
    name: "Aura",
    subtitle: "本地优先的私密图片画廊",
    description: "用物理隔离、入口伪装与秘密解锁，保护只想留给自己的影像。",
    kind: "app",
    platform: "Android",
    version: "3.0.2",
    icon: "/product-assets/aura-logo.png",
    tone: "violet",
    detailsHref: "/work/aura",
    actionHref: "https://mobileapp-1317980685.cos.ap-shanghai.myqcloud.com/aura/aura-release.bin",
    actionLabel: "下载 Aura",
    actionExternal: true,
    tags: ["Flutter", "隐私", "本地优先"],
    featureNotes: ["Flutter 本地优先", "隐私物理隔离"],
  },
  {
    id: "allinone",
    name: "AllinOne",
    subtitle: "Figma 全能效率插件",
    description: "把 AI 说明书、多语言翻译、图层管理与 30+ 高频动作收进一个插件。",
    kind: "plugin",
    platform: "Figma",
    version: "4.4.6 开发版",
    icon: "/allinone-site/Frame 21.png",
    tone: "figma",
    detailsHref: "/work/all-in-one-v2",
    actionHref: "https://www.figma.com/community/plugin/1579115225697225019/allinone",
    actionLabel: "在 Figma 获取",
    actionExternal: true,
    tags: ["Figma", "AI", "设计效率"],
    featureNotes: ["Figma 社区上架", "30+ 高频动作"],
  },
  {
    id: "ai-translate",
    name: "AI Translate",
    subtitle: "沉浸式 AI 翻译插件",
    description: "支持自定义 AI 模型、双语对照与划词翻译，让阅读过程尽量不被打断。",
    kind: "plugin",
    platform: "Chrome",
    version: "2.1.2",
    icon: "/translate-site/icon128.png",
    tone: "indigo",
    detailsHref: "/work/ai-translate",
    actionHref: "https://ai-translate-release-1317980685.cos.ap-shanghai.myqcloud.com/releases/AI-Translate-v2.1.2.zip",
    actionLabel: "下载安装包",
    actionExternal: true,
    tags: ["Chrome", "AI", "翻译"],
  },
  {
    id: "eaglecp",
    name: "EagleCP",
    subtitle: "Eagle 本地图片批量压缩与对比插件",
    description: "把 Eagle 选区中的图片批量压缩为 WebP、AVIF、JPEG XL 等现代格式，并提供宫格、分割与闪烁三种细节对比，全部在本地完成。",
    kind: "plugin",
    platform: "Eagle",
    version: "2.4.0",
    icon: "/product-assets/eaglecp-icon.png",
    tone: "indigo",
    detailsHref: "",
    actionHref: "https://lightapp-1317980685.cos.ap-shanghai.myqcloud.com/EagleCP/EagleCP-2.4.0.eagleplugin",
    actionLabel: "下载插件",
    actionExternal: true,
    tags: ["Eagle 插件", "批量压缩", "本地处理"],
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
  {
    id: "merge-slime",
    name: "合成史莱姆",
    subtitle: "把小小的快乐，合成大大的",
    description: "投下一只软乎乎的史莱姆，让同级伙伴相遇、合成，收集巨型大福。还有异能伙伴与十关循环，随时玩一局。",
    kind: "web", platform: "Web", version: "1.8.2",
    icon: "/merge-slime/assets/brand/icon.png",
    tone: "violet", detailsHref: "/merge-slime/index.html", actionHref: "/merge-slime/index.html",
    actionLabel: "在线玩", tags: ["休闲游戏", "软体物理", "在线玩"],
  },
  {
    id: "zhesi", name: "哲思", subtitle: "把现实困惑，变成有依据的判断",
    description: "从哲学与社会科学出发，澄清事实、解释与价值取舍，梳理职场、人际关系和人生选择中的行动方向。",
    kind: "skill", platform: "AI Skill", version: "1.0.1", mark: "思", tone: "graphite",
    detailsHref: "", actionHref: "/skills/zhesi.zip", actionLabel: "下载 Skill",
    tags: ["哲学", "决策", "思维训练"],
  },
  {
    id: "btdesign", name: "btdesign", subtitle: "从设计判断，到可用的作品",
    description: "覆盖界面、交互、动效、品牌与版式的设计 skill。从真实内容与约束出发，把设计方向落到具体实现和验证。",
    kind: "skill", platform: "AI Skill", version: "2026.10", mark: "bt", tone: "blue",
    detailsHref: "", actionHref: "/skills/btdesign.zip", actionLabel: "下载 Skill",
    tags: ["UI / UX", "视觉设计", "vibe coding"],
  },

];

export const appBoxKindLabels: Record<AppBoxKind, string> = {
  app: "应用",
  web: "在线工具",
  plugin: "插件",
  skill: "Skill",
};
