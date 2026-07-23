"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Command,
  Download,
  Gauge,
  MousePointer2,
  MonitorUp,
  AppWindow,
  Zap,
  Search,
  LayoutGrid,
  Rows3,
  Grid2x2,
  FolderTree,
  Hand,
  Smartphone,
  Maximize2,
  Wallpaper,
  Palette,
  ArrowUpDown,
  BookOpen,
  ShieldCheck,
  RefreshCw,
  Cpu,
  Layers,
  HardDrive,
  MousePointerClick,
  Activity,
} from "lucide-react";
import ProductBackButton from "@/components/ui/product-back-button";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const DOWNLOAD_URL =
  "https://lightapp-1317980685.cos.ap-shanghai.myqcloud.com/launchpad/releases/1.1.7/LaunchPad-1.1.7-arm64.dmg";

/* 四种唤起方式 */
const triggers = [
  {
    key: "⌘⇧ Space",
    hint: "全局快捷键",
    icon: Command,
    perm: "无需权限",
    desc: "全局热键，随时唤起，不依赖当前焦点应用。默认开启。",
  },
  {
    key: "F4",
    hint: "功能键",
    icon: Zap,
    perm: "辅助功能 / 输入监控",
    desc: "延续 macOS 经典功能键，找回旧 MacBook 习惯。默认开启。",
  },
  {
    key: "四指上滑 / 五指捏合",
    hint: "触控板手势",
    icon: MousePointer2,
    perm: "辅助功能",
    desc: "私有 MultitouchSupport.framework 驱动，符号不可用时静默降级。默认四指上滑。",
  },
  {
    key: "屏幕四角",
    hint: "热区触发",
    icon: MonitorUp,
    perm: "无需权限",
    desc: "鼠标移入屏幕角落，热区即时响应。可选开启。",
  },
];

/* 七个智能分类 */
const categories = [
  { emoji: "🛠", name: "系统应用" },
  { emoji: "💻", name: "开发" },
  { emoji: "🎨", name: "设计" },
  { emoji: "📚", name: "效率" },
  { emoji: "💬", name: "通讯" },
  { emoji: "🎮", name: "娱乐" },
  { emoji: "🔧", name: "实用工具" },
];

/* 三种布局 */
const layouts = [
  {
    name: "分类网格",
    tag: "默认",
    icon: FolderTree,
    desc: "Finder 风格的可展开/折叠分组视图，支持组内与跨组拖拽。",
  },
  {
    name: "分页网格",
    tag: "经典",
    icon: LayoutGrid,
    desc: "每页固定行列数，左右翻页箭头 + 圆点指示器 + 键盘 ←/→ + 触控板横滑 + 滚轮翻页。",
  },
  {
    name: "纵向滚动",
    tag: "密集",
    icon: Rows3,
    desc: "单列 LazyVGrid 垂直滚动，适合应用极多的用户。",
  },
];

/* 拖拽整理能力 */
const dragFeatures = [
  { title: "组内拖拽", desc: "重新排序，拖拽占位符带虚线边框 + 缩放动画，落点不跳变。", icon: ArrowUpDown },
  { title: "跨组拖拽", desc: "移动到其他分类，单元格中心命中检测确保落点精准。", icon: FolderTree },
  { title: "应用叠放", desc: "把一个应用拖到另一个应用上，自动创建新分组。还原经典 LaunchPad 文件夹行为。", icon: Grid2x2 },
  { title: "长按多选", desc: "长按 0.48 秒进入多选模式（带触感反馈），支持批量移动 N 个应用到分组。", icon: Hand },
];

/* 四种排序 */
const sortModes = [
  { mode: "自定义", desc: "用户拖拽顺序，持久保存。切回即恢复。", icon: MousePointerClick },
  { mode: "名称", desc: "拼音 / 字母排序。", icon: ArrowUpDown },
  { mode: "安装时间", desc: "按 installDate 排列。", icon: Activity },
  { mode: "最近使用", desc: "按 lastOpenedDate 排列，未打开的排最后。", icon: Gauge },
];

/* 个性化设置 */
const personalization = [
  { title: "桌面壁纸", desc: "跟随当前桌面壁纸，实时抓取。", icon: Wallpaper },
  { title: "自定义图片", desc: "导入任意图片作为背景。", icon: Wallpaper },
  { title: "纯色背景", desc: "14 种命名配色：午夜、海洋、森林……", icon: Palette },
  { title: "高斯模糊", desc: "0-50px 可调。", icon: Layers },
  { title: "遮罩透明度", desc: "0-100% 可调。", icon: Maximize2 },
  { title: "图标与间距", desc: "图标 44-128px，网格间距 4-56px。", icon: Grid2x2 },
];

/* 技术亮点 */
const techHighlights = [
  {
    title: "原生性能，非 Electron",
    body: "Swift 6.0 + SwiftUI/AppKit 混合架构，Swift Package Manager 构建，无 storyboard/nib。LSUIElement = true 默认无 Dock 图标，菜单栏常驻。",
    icon: Cpu,
  },
  {
    title: "私有 MultitouchSupport.framework",
    body: "触控板手势通过 dlsym 运行时加载 Apple 私有多点触控框架（MTDeviceCreateList + MTRegisterContactFrameCallback），符号不可用时静默降级。",
    icon: Hand,
  },
  {
    title: "跨日自愈设计",
    body: "TriggerCoordinator 监听系统唤醒、屏幕解锁、显示器变更，自动重建所有事件触发器。CGEventTap 带健康检查与 0.2 秒防抖重建。睡一觉不会失灵。",
    icon: RefreshCw,
  },
  {
    title: "自适应布局引擎",
    body: "LayoutEngine 根据实际视口、图标大小、间距动态计算行列数，预留 48pt 安全边距，单元格中心命中检测确保拖拽落点精准不跳变。",
    icon: LayoutGrid,
  },
  {
    title: "前向兼容的设置持久化",
    body: "基于 GRDB/SQLite，设置采用逐字段 Decodable 回退。未来新增设置字段不会破坏现有安装。",
    icon: HardDrive,
  },
  {
    title: "带完整信任链的应用内更新",
    body: "架构校验 → SHA256 → hdiutil mount → ditto 暂存 → codesign --verify --deep --strict → Bundle ID 校验。zsh 辅助脚本等待父进程退出后备份、安装、重启。",
    icon: ShieldCheck,
  },
];

/* 四层架构 */
const architecture = [
  {
    layer: "UI Layer",
    stack: "SwiftUI",
    desc: "OverlayRootView · SettingsRootView · FirstLaunchGuideView · CategoryGridView · PagedGridView · ScrollGridView · AppIconCell · AppContextMenu · SearchBar",
    icon: AppWindow,
    color: "#22d3ee",
  },
  {
    layer: "Presentation Layer",
    stack: "SwiftUI + AppKit",
    desc: "WindowManager (KeyablePanel) · TriggerCoordinator",
    icon: MonitorUp,
    color: "#3b82f6",
  },
  {
    layer: "Domain Layer",
    stack: "Swift",
    desc: "AppItem · AppGroup · AppSettings · AppStore · SortEngine · LayoutEngine · UsageTracker · SettingsManager",
    icon: Layers,
    color: "#8b5cf6",
  },
  {
    layer: "Infrastructure Layer",
    stack: "Swift + C",
    desc: "PersistenceStore (GRDB) · FileSystemScanner · IconLoader · WallpaperManager · EventTapBridge · HotCornerMonitor · MultitouchBridge · UpdateManager",
    icon: HardDrive,
    color: "#6366f1",
  },
];

const techDeps = [
  "Swift 6.0", "SwiftUI", "AppKit", "Swift Package Manager",
  "GRDB.swift 6.29+", "KeyboardShortcuts 2.0+", "LaunchAtLogin-Modern 1.1+",
  "MultitouchSupport.framework", "CGEventTap", "CoreFoundation",
];

/* 适合谁用 */
const targetUsers = [
  { icon: MonitorUp, title: "macOS 26 升级用户", desc: "找回被移除的 LaunchPad，肌肉记忆无缝衔接。" },
  { icon: Search, title: "中文 macOS 用户", desc: "双语 UI + 拼音搜索，输入 wx 找微信。" },
  { icon: Zap, title: "效率工具重度用户", desc: "应用太多需要分类、多选、批量整理。" },
  { icon: Hand, title: "触控板用户", desc: "四指上滑 / 五指捏合唤起，不用碰键盘。" },
  { icon: MonitorUp, title: "多屏用户", desc: "覆盖层出现在鼠标所在屏幕，全屏模式正确铺满。" },
  { icon: Cpu, title: "开发者 / 设计师", desc: "首次扫描即自动归入「开发」「设计」分组。" },
];

const stats = [
  ["Swift 6.0", "原生技术栈"],
  ["4 种", "唤起方式"],
  ["3 语", "搜索支持"],
  ["120 Hz", "动效目标"],
];

/* ================================================================
   ScreenshotPlaceholder
   ================================================================ */
function ScreenshotPlaceholder({
  label,
  aspect = "16/10",
  className = "",
  rounded = "rounded-2xl",
}: {
  label: string;
  aspect?: string;
  className?: string;
  rounded?: string;
}) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${rounded} border border-white/8 bg-gradient-to-br from-white/[0.04] to-white/[0.01] ${className}`}
      style={{ aspectRatio: aspect }}
    >
      <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="relative z-10 flex flex-col items-center gap-3 px-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/8 text-cyan-300/60">
          <AppWindow className="h-5 w-5" />
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
          {label}
        </p>
      </div>
    </div>
  );
}

export default function LaunchpadStoryPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#030713] text-white selection:bg-cyan-300/30">
      <ProductBackButton />

      {/* ============================================ */}
      {/* §1 Hero                                       */}
      {/* ============================================ */}
      <section className="relative flex min-h-[100svh] items-center overflow-hidden px-5 pb-20 pt-28 md:px-10 lg:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_25%,rgba(56,189,248,0.18),transparent_35%),radial-gradient(circle_at_35%_88%,rgba(124,58,237,0.20),transparent_32%)]" />
        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.7)_1px,transparent_1px)] [background-size:48px_48px]" />

        <div className="relative mx-auto grid w-full max-w-[1500px] items-center gap-14 lg:grid-cols-[0.82fr_1.18fr]">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: EASE_OUT }}
          >
            <div className="mb-8 flex items-center gap-4">
              <Image
                src="/product-assets/launchpad-icon.png"
                alt="LaunchPad 图标"
                width={72}
                height={72}
                className="h-[72px] w-[72px] drop-shadow-[0_12px_38px_rgba(50,170,255,.4)]"
                priority
              />
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cyan-300">
                  Native macOS utility · v1.1.1
                </p>
                <p className="mt-1 text-sm text-white/40">
                  Product design &amp; independent development
                </p>
              </div>
            </div>

            <h1 className="text-[clamp(4rem,8.5vw,8.4rem)] font-black leading-[0.8] tracking-[-0.075em]">
              Launch
              <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                Pad.
              </span>
            </h1>

            <p className="mt-8 max-w-lg text-lg font-medium leading-relaxed text-white/70 md:text-xl">
              macOS 26 移除了启动台。我们把它找回来，还补上了当年缺的能力。
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <motion.a
                href={DOWNLOAD_URL}
                download
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: EASE_OUT }}
                className="group inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-[#071022] transition hover:bg-cyan-200"
              >
                <Download className="h-4 w-4" />
                下载 for macOS
                <span className="font-mono text-[11px] opacity-50">.dmg</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </motion.a>
              <a
                href="#triggers"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3.5 text-sm text-white/65 transition hover:border-white/35 hover:text-white"
              >
                了解产品
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE_OUT }}
            className="relative"
          >
            <div className="absolute -inset-8 rounded-[60px] bg-cyan-400/8 blur-3xl" />
            <ScreenshotPlaceholder
              label="LaunchPad 主界面截图占位"
              aspect="16/11"
              className="relative border-white/12 shadow-[0_60px_140px_-40px_rgba(0,0,0,.9)]"
            />
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* §2 数据带                                     */}
      {/* ============================================ */}
      <section className="border-y border-white/8 bg-white/[0.025] px-5 py-10 md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-[1500px] grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map(([value, label]) => (
            <div key={label}>
              <p className="text-xl font-bold tracking-tight text-white md:text-2xl">
                {value}
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================ */}
      {/* §3 四种唤起方式 + 跨日自愈                      */}
      {/* ============================================ */}
      <section id="triggers" className="px-5 py-28 md:px-10 md:py-36 lg:px-16">
        <div className="mx-auto max-w-[1500px]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.7, ease: EASE_OUT }}
            className="mb-16 max-w-2xl"
          >
            <h2 className="text-4xl font-black leading-[1.05] tracking-[-0.04em] md:text-6xl">
              四种唤起方式，
              <br />
              总有一种符合你的肌肉记忆。
            </h2>
            <p className="mt-6 text-base leading-7 text-white/45">
              快捷键、功能键、触控板手势、屏幕触发角。所有基于事件的触发器均支持「再按一次关闭」，并由 TriggerCoordinator 统一协调。
            </p>
          </motion.div>

          <div className="grid gap-px overflow-hidden rounded-3xl border border-white/8 bg-white/4 sm:grid-cols-2 lg:grid-cols-4">
            {triggers.map((trigger, index) => (
              <motion.div
                key={trigger.hint}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ delay: index * 0.08, duration: 0.7, ease: EASE_OUT }}
                className="group relative bg-[#030713] p-7 transition-colors duration-300 hover:bg-white/[0.03]"
              >
                <div className="mb-6 flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition group-hover:border-cyan-300/30 group-hover:bg-cyan-300/10 group-hover:text-cyan-200">
                    <trigger.icon className="h-5 w-5" />
                  </span>
                  <span className="font-mono text-[10px] text-white/25">0{index + 1}</span>
                </div>
                <p className="font-mono text-lg font-bold text-white">{trigger.key}</p>
                <p className="mt-1 text-xs font-medium text-cyan-300/70">{trigger.hint}</p>
                <p className="mt-4 text-sm leading-6 text-white/40">{trigger.desc}</p>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-white/25">
                  {trigger.perm}
                </p>
              </motion.div>
            ))}
          </div>

          {/* 跨日自愈说明 */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.7, ease: EASE_OUT }}
            className="mt-6 flex flex-col gap-4 rounded-3xl border border-cyan-300/15 bg-cyan-300/[0.03] p-8 md:flex-row md:items-center md:gap-8"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-300">
              <RefreshCw className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300/70">
                跨日自愈
              </p>
              <h3 className="mt-2 text-xl font-bold tracking-tight">
                睡一觉也不会失灵。
              </h3>
              <p className="mt-2 text-sm leading-7 text-white/45">
                系统休眠唤醒、屏幕解锁、显示器变更后，所有基于事件的触发器（F4、热区、手势）会自动重建。TriggerCoordinator 在 applicationDidBecomeActive 时调用 recoverAfterSystemEventReset，CGEventTap 带健康检查与 0.2 秒防抖重建。第二天打开电脑依然可用。
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* §4 智能分类 + 三语搜索                          */}
      {/* ============================================ */}
      <section className="border-t border-white/8 bg-white/[0.015] px-5 py-28 md:px-10 md:py-36 lg:px-16">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid gap-14 lg:grid-cols-[0.5fr_1.5fr]">
            {/* 左栏 sticky */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <h2 className="text-4xl font-black leading-[1.05] tracking-[-0.04em] md:text-5xl">
                首次扫描，
                <br />
                就整理好了。
              </h2>
              <p className="mt-6 max-w-md text-base leading-7 text-white/45">
                LaunchPad 根据应用关键词自动归入 7 个内置分类。未识别的归入「其他」，未使用的内置分类自动隐藏，你创建的自定义分类即使为空也会保留。
              </p>
              <ScreenshotPlaceholder
                label="智能分类网格截图占位"
                aspect="4/3"
                className="mt-8 border-white/8"
              />
            </div>

            {/* 右栏 */}
            <div className="space-y-12">
              {/* 7 个分类 */}
              <div>
                <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-300/70">
                  7 个内置分类
                </p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {categories.map((cat, i) => (
                    <motion.div
                      key={cat.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-10%" }}
                      transition={{ delay: i * 0.05, duration: 0.5, ease: EASE_OUT }}
                      className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-4"
                    >
                      <span className="text-xl">{cat.emoji}</span>
                      <span className="text-sm font-medium text-white/80">{cat.name}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* 三语搜索 */}
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/8 text-cyan-300">
                    <Search className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300/70">
                      三语搜索
                    </p>
                    <h3 className="mt-1 text-xl font-bold">中文 / 英文 / 拼音</h3>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-7 text-white/45">
                  基于 CFStringTransform 的拼音转换覆盖本地化名称、显示名称与 Bundle ID，中英文混输均可。
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    { input: "wx", result: "微信" },
                    { input: "shezhi", result: "系统设置" },
                    { input: "xcode", result: "Xcode" },
                  ].map((ex) => (
                    <div key={ex.input} className="rounded-xl border border-white/8 bg-[#030713] p-4">
                      <p className="font-mono text-xs text-cyan-300/60">输入</p>
                      <p className="mt-1 font-mono text-sm font-bold text-white">{ex.input}</p>
                      <p className="mt-3 font-mono text-xs text-white/30">匹配</p>
                      <p className="mt-1 text-sm text-white/70">{ex.result}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* §5 三种布局 + 拖拽整理                          */}
      {/* ============================================ */}
      <section className="px-5 py-28 md:px-10 md:py-36 lg:px-16">
        <div className="mx-auto max-w-[1500px]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.7, ease: EASE_OUT }}
            className="mb-14 max-w-2xl"
          >
            <h2 className="text-4xl font-black leading-[1.05] tracking-[-0.04em] md:text-6xl">
              三种布局，
              <br />
              像原生一样自然。
            </h2>
            <p className="mt-6 text-base leading-7 text-white/45">
              分类网格、分页网格、纵向滚动。无论你习惯经典 LaunchPad 还是 Finder 风格分组，都能找到熟悉的节奏。
            </p>
          </motion.div>

          {/* 布局截图占位 */}
          <div className="grid gap-5 lg:grid-cols-3">
            {layouts.map((layout, index) => (
              <motion.div
                key={layout.name}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ delay: index * 0.1, duration: 0.7, ease: EASE_OUT }}
              >
                <ScreenshotPlaceholder
                  label={`${layout.name}截图占位`}
                  aspect="4/3"
                  className="border-white/8"
                />
                <div className="mt-4 flex items-center gap-3">
                  <layout.icon className="h-5 w-5 text-cyan-300/70" />
                  <h3 className="text-lg font-bold tracking-tight">{layout.name}</h3>
                  <span className="rounded-full border border-cyan-300/20 bg-cyan-300/8 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-cyan-300/70">
                    {layout.tag}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-white/40">{layout.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* 拖拽整理能力 */}
          <div className="mt-20">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.7, ease: EASE_OUT }}
              className="mb-10"
            >
              <h3 className="text-3xl font-black tracking-[-0.03em] md:text-4xl">
                拖拽整理，还原经典。
              </h3>
              <p className="mt-4 max-w-xl text-base leading-7 text-white/45">
                组内排序、跨组移动、应用叠放建组、长按多选批处理。拖拽占位符带虚线边框与缩放动画，落点不跳变。
              </p>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {dragFeatures.map((feat, index) => (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ delay: index * 0.08, duration: 0.6, ease: EASE_OUT }}
                  className="rounded-2xl border border-white/8 bg-white/[0.03] p-6"
                >
                  <feat.icon className="h-6 w-6 text-cyan-300/70" />
                  <h4 className="mt-5 text-base font-bold tracking-tight">{feat.title}</h4>
                  <p className="mt-3 text-sm leading-6 text-white/40">{feat.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* §6 窗口模式 + 个性化 + 排序                     */}
      {/* ============================================ */}
      <section className="border-t border-white/8 bg-white/[0.015] px-5 py-28 md:px-10 md:py-36 lg:px-16">
        <div className="mx-auto max-w-[1500px]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.7, ease: EASE_OUT }}
            className="mb-14 max-w-2xl"
          >
            <h2 className="text-4xl font-black leading-[1.05] tracking-[-0.04em] md:text-6xl">
              全屏沉浸，
              <br />
              或悬浮窗。
            </h2>
            <p className="mt-6 text-base leading-7 text-white/45">
              两种窗口模式均支持 120Hz 高刷新率动画（可选开启），在 ProMotion 屏幕上过渡更顺滑。
            </p>
          </motion.div>

          {/* 窗口模式截图 */}
          <div className="grid gap-5 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, ease: EASE_OUT }}
            >
              <ScreenshotPlaceholder
                label="全屏模式截图占位"
                aspect="16/10"
                className="border-white/8"
              />
              <div className="mt-4 flex items-center gap-3">
                <Maximize2 className="h-5 w-5 text-cyan-300/70" />
                <h3 className="text-lg font-bold tracking-tight">全屏模式</h3>
              </div>
              <p className="mt-2 text-sm leading-6 text-white/40">
                覆盖菜单栏，自动隐藏 Dock 与菜单栏，沉浸式体验。
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE_OUT }}
            >
              <ScreenshotPlaceholder
                label="悬浮模式截图占位"
                aspect="16/10"
                className="border-white/8"
              />
              <div className="mt-4 flex items-center gap-3">
                <AppWindow className="h-5 w-5 text-cyan-300/70" />
                <h3 className="text-lg font-bold tracking-tight">悬浮模式</h3>
              </div>
              <p className="mt-2 text-sm leading-6 text-white/40">
                居中浮动窗口（圆角 22pt、可拖拽、带阴影），尺寸可调。
              </p>
            </motion.div>
          </div>

          {/* 个性化 + 排序 */}
          <div className="mt-20 grid gap-14 lg:grid-cols-2">
            {/* 个性化 */}
            <div>
              <div className="mb-8 flex items-center gap-3">
                <Palette className="h-6 w-6 text-cyan-300/70" />
                <h3 className="text-2xl font-bold tracking-tight">壁纸与外观个性化</h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {personalization.map((item) => (
                  <div key={item.title} className="rounded-xl border border-white/8 bg-white/[0.03] p-5">
                    <item.icon className="h-5 w-5 text-cyan-300/60" />
                    <h4 className="mt-4 text-sm font-bold tracking-tight">{item.title}</h4>
                    <p className="mt-1.5 text-xs leading-5 text-white/40">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 排序 */}
            <div>
              <div className="mb-8 flex items-center gap-3">
                <ArrowUpDown className="h-6 w-6 text-cyan-300/70" />
                <h3 className="text-2xl font-bold tracking-tight">四种排序方式</h3>
              </div>
              <div className="space-y-3">
                {sortModes.map((sort, i) => (
                  <motion.div
                    key={sort.mode}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ delay: i * 0.08, duration: 0.6, ease: EASE_OUT }}
                    className="flex items-center gap-5 rounded-2xl border border-white/8 bg-white/[0.03] p-5"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-300/15 bg-cyan-300/8 text-cyan-300">
                      <sort.icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-sm font-bold text-white">{sort.mode}</p>
                      <p className="mt-1 text-sm text-white/40">{sort.desc}</p>
                    </div>
                    {i === 0 && (
                      <span className="shrink-0 rounded-full border border-cyan-300/20 bg-cyan-300/8 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-cyan-300/70">
                        默认
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
              <p className="mt-5 text-sm leading-6 text-white/35">
                切换排序模式不会丢失自定义顺序，切回「自定义」即恢复。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* §7 完整应用管理 + 首次引导                       */}
      {/* ============================================ */}
      <section className="px-5 py-28 md:px-10 md:py-36 lg:px-16">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid gap-14 lg:grid-cols-[1fr_0.85fr]">
            {/* 左栏：完整应用管理 */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-15%" }}
                transition={{ duration: 0.7, ease: EASE_OUT }}
              >
                <h2 className="text-4xl font-black leading-[1.05] tracking-[-0.04em] md:text-5xl">
                  完整的应用管理。
                </h2>
                <p className="mt-6 max-w-md text-base leading-7 text-white/45">
                  右键菜单提供完整的应用生命周期管理，不只是启动。
                </p>
              </motion.div>

              <div className="mt-10 space-y-px overflow-hidden rounded-2xl border border-white/8">
                {[
                  { action: "打开", desc: "启动应用" },
                  { action: "在 Finder 中显示", desc: "定位到原始文件" },
                  { action: "重命名", desc: "单元格内联编辑，仅影响 LaunchPad 内显示名" },
                  { action: "移动到分组", desc: "单个或批量移动" },
                  { action: "隐藏此应用", desc: "从网格移除，可在设置中恢复" },
                  { action: "卸载", desc: "终止进程 → 移至废纸篓 → 删除记录（系统应用不可卸载）" },
                ].map((item, i) => (
                  <motion.div
                    key={item.action}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-5%" }}
                    transition={{ delay: i * 0.05, duration: 0.5, ease: EASE_OUT }}
                    className="flex items-center gap-6 bg-white/[0.02] px-6 py-4 transition hover:bg-white/[0.04]"
                  >
                    <span className="w-28 shrink-0 text-sm font-bold text-white">{item.action}</span>
                    <span className="text-sm text-white/40">{item.desc}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* 右栏：首次引导 */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.7, ease: EASE_OUT }}
              className="lg:sticky lg:top-28 lg:self-start"
            >
              <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/8 text-cyan-300">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300/70">
                      首次引导
                    </p>
                    <h3 className="mt-1 text-xl font-bold">零门槛上手</h3>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-7 text-white/45">
                  5 页交互式引导（可在设置中重播），包含可交互的整理演示与权限申请。
                </p>
                <ol className="mt-6 space-y-3">
                  {[
                    "欢迎页",
                    "唤起方式介绍",
                    "可交互的整理演示（拖拽、长按、新建分组）",
                    "功能总览",
                    "权限申请（辅助功能 + 输入监控，0.5 秒轮询直至授权）",
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/8 font-mono text-[10px] font-bold text-cyan-300">
                        {i + 1}
                      </span>
                      <span className="pt-0.5 text-sm text-white/55">{step}</span>
                    </li>
                  ))}
                </ol>
                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider text-white/40">
                    简体中文
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider text-white/40">
                    English
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* §8 技术亮点                                    */}
      {/* ============================================ */}
      <section className="border-t border-white/8 bg-white/[0.015] px-5 py-28 md:px-10 md:py-36 lg:px-16">
        <div className="mx-auto max-w-[1500px]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.7, ease: EASE_OUT }}
            className="mb-14 max-w-2xl"
          >
            <h2 className="text-4xl font-black leading-[1.05] tracking-[-0.04em] md:text-6xl">
              原生性能，
              <br />
              不是 Electron 套壳。
            </h2>
            <p className="mt-6 text-base leading-7 text-white/45">
              私有框架、跨日自愈、自适应布局、信任链更新。每一个技术决策都服务于「让你感觉它从未离开」。
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {techHighlights.map((tech, index) => (
              <motion.div
                key={tech.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ delay: (index % 3) * 0.08, duration: 0.6, ease: EASE_OUT }}
                className="rounded-2xl border border-white/8 bg-white/[0.03] p-6"
              >
                <tech.icon className="h-6 w-6 text-cyan-300/70" />
                <h3 className="mt-5 text-base font-bold tracking-tight">{tech.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/40">{tech.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* §9 架构概览                                    */}
      {/* ============================================ */}
      <section className="px-5 py-28 md:px-10 md:py-36 lg:px-16">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid gap-14 lg:grid-cols-[0.5fr_1.5fr]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.7, ease: EASE_OUT }}
              className="lg:sticky lg:top-28 lg:self-start"
            >
              <h2 className="text-4xl font-black leading-[1.05] tracking-[-0.04em] md:text-5xl">
                四层架构，
                <br />
                各司其职。
              </h2>
              <p className="mt-6 max-w-sm text-base leading-7 text-white/45">
                从 SwiftUI UI 层到基础设施层，每一层都有清晰的职责边界。Swift Package Manager 构建，无 storyboard/nib。
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                {techDeps.map((dep) => (
                  <span
                    key={dep}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider text-white/40"
                  >
                    {dep}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* 右栏：四层架构 */}
            <div className="space-y-4">
              {architecture.map((arch, i) => (
                <motion.div
                  key={arch.layer}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ delay: i * 0.1, duration: 0.6, ease: EASE_OUT }}
                  className="rounded-2xl border border-white/8 bg-white/[0.03] p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                        style={{ background: `${arch.color}1a`, color: arch.color }}
                      >
                        <arch.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-mono text-sm font-bold text-white">{arch.layer}</p>
                        <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-white/30">
                          {arch.stack}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] text-white/20">0{i + 1}</span>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-white/40">{arch.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* §10 适合谁用                                   */}
      {/* ============================================ */}
      <section className="border-t border-white/8 bg-white/[0.015] px-5 py-28 md:px-10 md:py-36 lg:px-16">
        <div className="mx-auto max-w-[1500px]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.7, ease: EASE_OUT }}
            className="mb-14 max-w-2xl"
          >
            <h2 className="text-4xl font-black leading-[1.05] tracking-[-0.04em] md:text-5xl">
              适合谁用。
            </h2>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {targetUsers.map((user, index) => (
              <motion.div
                key={user.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ delay: (index % 3) * 0.08, duration: 0.6, ease: EASE_OUT }}
                className="flex items-start gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-6"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-300/15 bg-cyan-300/8 text-cyan-300">
                  <user.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold tracking-tight">{user.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/40">{user.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* §11 下载引导                                   */}
      {/* ============================================ */}
      <section className="relative overflow-hidden border-t border-white/8 px-5 py-28 md:px-10 md:py-32 lg:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(99,102,241,.22),transparent_45%)]" />
        <div className="relative mx-auto flex max-w-[1500px] flex-col items-center gap-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.7, ease: EASE_OUT }}
          >
            <h2 className="text-4xl font-black tracking-[-0.04em] md:text-6xl">
              让经典启动台，
              <br />
              以更好的姿态回归。
            </h2>
          </motion.div>

          <motion.a
            href={DOWNLOAD_URL}
            download
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.7, ease: EASE_OUT }}
            className="group inline-flex items-center gap-4 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-8 py-4 text-sm font-bold text-[#071022] shadow-[0_20px_60px_-15px_rgba(34,211,238,0.5)] transition hover:shadow-[0_25px_70px_-15px_rgba(34,211,238,0.65)]"
          >
            <Download className="h-5 w-5" />
            下载 LaunchPad for macOS
            <span className="font-mono text-[11px] opacity-60">.dmg</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </motion.a>

          {/* 安装提示 */}
          <div className="mt-2 flex max-w-lg items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-4 text-left">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-300/12 font-mono text-[11px] font-bold text-cyan-300">
              !
            </span>
            <div className="text-xs leading-6 text-white/45">
              <p>
                当前为 ad-hoc 签名，首次打开需<span className="font-mono text-cyan-300"> 右键 → 打开 </span>。
                后续将替换为 Developer ID 公证签名，下载链接不变。
              </p>
              <p className="mt-2">
                安装步骤：打开 DMG → 拖入应用程序 → 右键打开 → 授权辅助功能与输入监控 → 开始使用 ⌘⇧Space 唤起。
              </p>
            </div>
          </div>

          {/* 平台信息 */}
          <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.15em] text-white/30">
            <span>macOS 14.0+</span>
            <span>Apple Silicon (arm64)</span>
            <span>v1.1.1</span>
            <span>简体中文 / English</span>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* §12 跨页引导 footer                            */}
      {/* ============================================ */}
      <section className="border-t border-white/8 px-5 py-20 md:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[1500px] flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cyan-300/50">
              Next personal work
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] md:text-4xl">
              另一个入口，
              <br />
              通往你的私密影像。
            </h2>
          </div>
          <Link
            href="/work/aura"
            className="group inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-bold transition hover:border-violet-300/50 hover:bg-violet-300/10"
          >
            查看 Aura <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </main>
  );
}
