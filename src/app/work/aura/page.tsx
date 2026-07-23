"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Download,
  EyeOff,
  Fingerprint,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  Film,
  Search,
  Trash2,
  Tags,
  Layers,
  Database,
  Sparkles,
  Grid3x3,
  Share2,
  Palette,
  RefreshCw,
  Wand2,
  Cpu,
} from "lucide-react";
import ProductBackButton from "@/components/ui/product-back-button";

const serif = {
  fontFamily: "'Songti SC', 'Noto Serif SC', 'STSong', serif",
} as const;

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const DOWNLOAD_URL =
  "https://mobileapp-1317980685.cos.ap-shanghai.myqcloud.com/aura/aura-release.bin";

/* 12 套拟真伪装皮肤 */
const disguiseSkins = [
  "轻听音乐", "阅读", "新闻简报", "天气",
  "计算器", "笔记", "日历", "财务",
  "健身", "菜谱", "文件", "时钟",
];

const unlockGestures = [
  "长按功能键 5 秒",
  "连续点按 5 次",
  "连续点按 8 次",
  "连续点按 10 次",
  "从屏幕右缘向左滑动",
];

const triggerModes = [
  { mode: "always", desc: "每次冷启动自动伪装" },
  { mode: "timed", desc: "指定时长内自动伪装，过期关闭" },
  { mode: "session", desc: "仅本次有效，杀进程即关" },
];

const privacyLayers = [
  {
    icon: LockKeyhole,
    label: "Physical isolation",
    title: "从系统相册搬走",
    body: "隔离模式下将图片移动到 Aura 私有沙盒，并从系统图库删除原文件。其他 App、系统搜索与通知中心都无法再访问这些影像。",
    details: ["引用模式 / 隔离模式双选", "事务安全：复制成功才删原图", "导出写入 .nomedia 阻止扫描"],
    color: "#925b82",
  },
  {
    icon: EyeOff,
    label: "Disguise skins",
    title: "看起来是另一款 App",
    body: "12 套可交互伪装界面，桌面图标和应用名称同步切换。即便有人拿到手机打开 Aura，看到的也只是一个普通的播放器或计算器。",
    details: ["activity-alias 动态切换", "皮肤轮换避免固定伪装", "安全侧倒：读取失败默认伪装"],
    color: "#6e82b4",
  },
  {
    icon: Fingerprint,
    label: "Secret gesture",
    title: "只有你知道入口",
    body: "长按、连续点击或滑动均可成为自定义解锁手势。入口不写在任何界面里，只有你本人知道如何唤醒真实相册。",
    details: ["5 种解锁手势可选", "3 种触发模式", "升级后自动恢复身份"],
    color: "#8b6d90",
  },
];

const transitions = {
  classic: ["Ken Burns", "交叉淡入", "推拉滑动", "缩放进入"],
  advanced: ["3D Y 轴翻转", "模糊溶解", "Cinema 黑边", "环绕镜头", "闪白", "慢动作溶解"],
  shader: ["百叶窗 blinds", "像素化 pixelate", "故障艺术 glitch", "波纹 ripple"],
};

const featureMatrix = [
  {
    title: "画廊浏览",
    desc: "瀑布流 / 网格 / 紧凑列表 / 标准列表，2 至 16 列可切换。多维度排序与筛选，多选批量操作。",
    icon: Grid3x3,
    span: "lg:col-span-2",
  },
  {
    title: "Motion Photo 解析器",
    desc: "应用层解析小米 / 谷歌动态图片，从文件末尾反向搜索 ftyp box 提取内嵌 MP4。",
    icon: Film,
    span: "lg:col-span-1",
    highlight: true,
  },
  {
    title: "标签系统",
    desc: "自由标签、标签分组、常用标记，按标签快速筛选。",
    icon: Tags,
    span: "lg:col-span-1",
  },
  {
    title: "自定义相册",
    desc: "创建 / 重命名 / 删除 / 置顶，封面自动选取。",
    icon: Layers,
    span: "lg:col-span-1",
  },
  {
    title: "回收站",
    desc: "软删除进回收站，90 天可恢复，启动时自动清理过期项。",
    icon: Trash2,
    span: "lg:col-span-1",
  },
  {
    title: "智能搜索",
    desc: "多关键词 AND 匹配，拼音首字母 / 全拼模糊搜索。输入 fj 即可匹配「风景」。",
    icon: Search,
    span: "lg:col-span-2",
  },
  {
    title: "智能空间清理",
    desc: "SHA-256 字节判定 + RGB 直方图视觉签名，识别重新压缩后的视觉重复项。",
    icon: Wand2,
    span: "lg:col-span-2",
    highlight: true,
  },
  {
    title: "8 套主题色",
    desc: "幻影紫 / 丝袜褐 / 魅惑粉 / 高端黑等，亮暗独立色板。",
    icon: Palette,
    span: "lg:col-span-1",
  },
  {
    title: "零依赖分享",
    desc: "复用 FileProvider，不引入 share_plus，ACTION_SEND_MULTIPLE。",
    icon: Share2,
    span: "lg:col-span-1",
  },
  {
    title: "应用内更新",
    desc: "腾讯云 CDN 读取 manifest，流式下载 APK，覆盖升级不丢图片。",
    icon: RefreshCw,
    span: "lg:col-span-2",
  },
];

const techStack = [
  "Flutter", "Android 12+", "Isar 3.1", "photo_manager 3.0",
  "wechat_assets_picker 9.0", "extended_image", "flutter_staggered_grid_view",
  "video_player", "Fragment Shader (.frag)", "MethodChannel",
  "activity-alias", "lucide_icons (fork)",
];

const uniqueHighlights = [
  "伪装深度业内罕见：UI + 桌面图标 + 应用名称同步切换，activity-alias 动态实现",
  "4 种自研 Fragment Shader 转场：blinds / pixelate / glitch / ripple",
  "应用层 Motion Photo 解析：弥补 photo_manager 在安卓上的识别缺陷",
  "视觉签名重复检测：RGB 直方图 + 分区色彩布局，超越字节哈希",
  "零依赖分享引擎：复用 FileProvider，与项目瘦身策略一致",
  "COS CDN + GitHub Actions 双通道分发",
  "安全侧倒贯穿全链路：文件读取失败默认伪装，处处优先保护隐私",
];

const stats = [
  ["12 套", "伪装皮肤"],
  ["14 种", "幻灯片转场"],
  ["3 层", "隐私防护"],
  ["100%", "离线运行"],
];

/* ================================================================
   ScreenshotPlaceholder
   ================================================================ */
function ScreenshotPlaceholder({
  label,
  aspect = "16/10",
  className = "",
  rounded = "rounded-[20px]",
  dark = false,
}: {
  label: string;
  aspect?: string;
  className?: string;
  rounded?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${rounded} border ${dark ? "border-white/8 bg-white/[0.03]" : "border-[#2e2133]/8 bg-white/40"} ${className}`}
      style={{ aspectRatio: aspect }}
    >
      <div className={`absolute inset-0 opacity-[0.04] [background-image:linear-gradient(${dark ? "rgba(255,255,255,.6)" : "rgba(46,33,51,.6)"}_1px,transparent_1px),linear-gradient(90deg,${dark ? "rgba(255,255,255,.6)" : "rgba(46,33,51,.6)"}_1px,transparent_1px)] [background-size:28px_28px]`} />
      <div className="relative z-10 flex flex-col items-center gap-3 px-6 text-center">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${dark ? "border-[#d9a9cb]/15 bg-[#d9a9cb]/8 text-[#d9a9cb]/50" : "border-[#925b82]/15 bg-[#925b82]/8 text-[#925b82]/50"}`}>
          <ShieldCheck className="h-5 w-5" />
        </div>
        <p className={`font-mono text-[10px] uppercase tracking-[0.2em] ${dark ? "text-white/30" : "text-[#9a8296]"}`}>
          {label}
        </p>
      </div>
    </div>
  );
}

export default function AuraStoryPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f0f5] text-[#211a25] selection:bg-[#9b5d86]/20">
      <ProductBackButton light />

      {/* ============================================ */}
      {/* §1 Hero                                       */}
      {/* ============================================ */}
      <section className="relative min-h-[100svh] overflow-hidden px-5 pb-24 pt-32 md:px-10 lg:px-16">
        <div className="absolute -left-32 top-40 h-96 w-96 rounded-full bg-[#d7c0e8]/45 blur-3xl" />
        <div className="absolute -right-20 top-10 h-[520px] w-[520px] rounded-full bg-[#ead4dc]/65 blur-3xl" />

        <div className="relative mx-auto grid max-w-[1450px] items-center gap-16 lg:grid-cols-[0.88fr_1.12fr]">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: EASE_OUT }}
          >
            <div className="mb-7 flex items-center gap-4">
              <Image
                src="/product-assets/aura-logo.png"
                alt="Aura 图标"
                width={72}
                height={72}
                className="h-[72px] w-[72px] rounded-[20px] shadow-[0_15px_40px_rgba(90,53,105,.18)]"
                priority
              />
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#925b82]">
                  Private gallery · Android · v1.2.8
                </p>
                <p className="mt-1 text-sm text-[#6d626d]">
                  Product design &amp; independent development
                </p>
              </div>
            </div>

            <p
              style={serif}
              className="text-[clamp(4.8rem,10vw,10rem)] leading-[0.78] tracking-[-0.07em] text-[#2e2133]"
            >
              Aura
            </p>

            <h1 className="mt-8 max-w-xl text-3xl font-semibold leading-[1.15] tracking-[-0.045em] md:text-5xl">
              看不见、找不到、拿不走。
            </h1>

            <p className="mt-6 max-w-lg text-base leading-8 text-[#746b75]">
              一款注重隐私、离线优先的本地图片画廊。12 套拟真伪装皮肤连桌面图标一起变脸，图片可物理移入私有沙盒从系统相册彻底消失，邀请码离线验签把访问权握在你手里。
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <motion.a
                href={DOWNLOAD_URL}
                download
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: EASE_OUT }}
                className="group inline-flex items-center gap-3 rounded-full bg-[#2e2133] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#563b58]"
              >
                <Download className="h-4 w-4" />
                下载 for Android
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </motion.a>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#2e2133]/10 bg-white/55 px-5 py-3.5 text-xs font-medium text-[#6f6371]">
                <ShieldCheck className="h-4 w-4 text-[#925b82]" /> Local-first · No cloud
              </div>
            </div>
          </motion.div>

          {/* 右栏：手机截图占位 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE_OUT }}
            className="relative flex justify-center"
          >
            <div className="absolute inset-0 bg-[#d7c0e8]/20 blur-3xl" />
            <ScreenshotPlaceholder
              label="Aura 主界面截图占位"
              aspect="9/16"
              rounded="rounded-[42px]"
              className="relative w-full max-w-sm border-[#2e2133]/10 shadow-[0_40px_100px_-30px_rgba(60,38,62,.3)]"
            />
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* §2 数据带                                     */}
      {/* ============================================ */}
      <section className="border-y border-[#2e2133]/8 bg-[#ebe5ed] px-5 py-10 md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-[1450px] grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map(([value, label]) => (
            <div key={label}>
              <p className="text-xl font-bold tracking-tight text-[#2e2133] md:text-2xl" style={serif}>
                {value}
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[#9a8296]">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================ */}
      {/* §3 深度伪装隐匿体系 (旗舰能力)                  */}
      {/* ============================================ */}
      <section className="px-5 py-28 md:px-10 md:py-36 lg:px-16">
        <div className="mx-auto max-w-[1450px]">
          <div className="grid gap-14 lg:grid-cols-[0.62fr_1.38fr]">
            {/* 左栏 sticky */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <h2 className="text-4xl font-semibold leading-[1.05] tracking-[-0.04em] md:text-6xl">
                深度伪装，
                <br />
                不止藏一个入口。
              </h2>
              <p className="mt-6 max-w-md text-base leading-8 text-[#746b75]">
                普通「隐藏相册」只是藏一个入口。Aura 把伪装做成完整的隐形身份系统：12 套可交互皮肤、桌面图标同步切换、5 种解锁手势、皮肤轮换与安全侧倒。
              </p>
              <ScreenshotPlaceholder
                label="伪装皮肤截图占位（如轻听音乐界面）"
                aspect="9/16"
                rounded="rounded-[24px]"
                className="mt-8 w-full max-w-[200px] border-[#2e2133]/8"
              />
            </div>

            {/* 右栏：12 皮肤网格 + 功能详情 */}
            <div className="space-y-10">
              {/* 12 套皮肤 */}
              <div>
                <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.2em] text-[#925b82]">
                  12 套拟真伪装皮肤
                </p>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {disguiseSkins.map((skin, i) => (
                    <motion.div
                      key={skin}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-10%" }}
                      transition={{ delay: i * 0.04, duration: 0.5, ease: EASE_OUT }}
                      className={`flex items-center justify-center rounded-xl border px-3 py-4 text-center text-xs font-medium ${i < 4 ? "border-[#925b82]/20 bg-[#925b82]/8 text-[#2e2133]" : "border-[#2e2133]/8 bg-white/40 text-[#6d626d]"}`}
                    >
                      {skin}
                    </motion.div>
                  ))}
                </div>
                <p className="mt-4 text-sm leading-6 text-[#746b75]">
                  每一套都是可交互的完整界面，不是截图贴皮。开启伪装后，桌面图标和应用名称也会变成对应皮肤。
                </p>
              </div>

              {/* 解锁手势 */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-[#925b82]">
                    5 种解锁手势
                  </p>
                  <ul className="space-y-3">
                    {unlockGestures.map((g) => (
                      <li key={g} className="flex items-start gap-3 text-sm text-[#5d525f]">
                        <Fingerprint className="mt-0.5 h-4 w-4 shrink-0 text-[#925b82]" />
                        {g}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-[#925b82]">
                    3 种触发模式
                  </p>
                  <div className="space-y-3">
                    {triggerModes.map((t) => (
                      <div key={t.mode} className="rounded-xl border border-[#2e2133]/8 bg-white/40 p-4">
                        <p className="font-mono text-xs font-bold text-[#2e2133]">{t.mode}</p>
                        <p className="mt-1 text-xs text-[#746b75]">{t.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 安全机制 */}
              <div className="rounded-2xl border border-[#925b82]/12 bg-[#925b82]/[0.04] p-6">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-[#925b82]" />
                  <p className="text-sm font-bold text-[#2e2133]">安全侧倒原则</p>
                </div>
                <p className="mt-3 text-sm leading-7 text-[#746b75]">
                  读取伪装配置失败时默认返回「已伪装」，宁可多伪装，绝不暴露真实相册。皮肤轮换机制在 App 进入后台时为下次冷启动切换身份，避免长期固定一种伪装被识破。升级后自动恢复用户选择的桌面身份，避免双图标或身份错乱。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* §4 隐私三层防护 (深色反差章节)                   */}
      {/* ============================================ */}
      <section className="border-y border-[#2e2133]/8 bg-[#2e2133] px-5 py-28 text-[#f9f6fa] md:px-10 md:py-40 lg:px-16">
        <div className="mx-auto max-w-[1450px]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.7, ease: EASE_OUT }}
            className="mb-16 max-w-3xl"
          >
            <h2 className="text-4xl font-semibold leading-[1.05] tracking-[-0.04em] md:text-6xl">
              隐私不是设置页里的
              <br />
              一个开关。
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/45">
              Aura 把「看不见」「拿不到」「猜不到」拆成三层体验：真实文件隔离、入口伪装与秘密解锁。每一层都是可感知的产品设计，而非隐藏的技术参数。
            </p>
          </motion.div>

          <div className="grid gap-px overflow-hidden rounded-3xl border border-white/8 bg-white/5 lg:grid-cols-3">
            {privacyLayers.map((layer, index) => (
              <motion.div
                key={layer.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ delay: index * 0.1, duration: 0.7, ease: EASE_OUT }}
                className="bg-[#2e2133] p-8 md:p-10"
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ background: `${layer.color}1a`, color: layer.color }}
                >
                  <layer.icon className="h-5 w-5" />
                </div>
                <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.22em] text-white/35">
                  {layer.label}
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">
                  {layer.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-white/45">{layer.body}</p>
                <ul className="mt-6 space-y-2">
                  {layer.details.map((d) => (
                    <li key={d} className="flex items-start gap-2 text-xs text-white/55">
                      <span className="mt-1 h-1 w-1 shrink-0 rounded-full" style={{ background: layer.color }} />
                      {d}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* §5 邀请码门禁                                 */}
      {/* ============================================ */}
      <section className="px-5 py-28 md:px-10 md:py-36 lg:px-16">
        <div className="mx-auto max-w-[1450px]">
          <div className="grid gap-14 lg:grid-cols-[0.55fr_1.45fr]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.7, ease: EASE_OUT }}
            >
              <h2 className="text-4xl font-semibold leading-[1.05] tracking-[-0.04em] md:text-5xl">
                邀请码门禁，
                <br />
                离线验签。
              </h2>
              <p className="mt-6 max-w-md text-base leading-8 text-[#746b75]">
                HMAC-SHA256 离线签名验证，无需联网，隐私零泄露。密钥编译时注入不进源码，每次读取激活记录都重新验签，常量时间比较防时序攻击。
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                {["永久码", "365 天码", "90 天码"].map((t) => (
                  <span key={t} className="rounded-full border border-[#925b82]/15 bg-[#925b82]/8 px-4 py-2 text-xs font-medium text-[#925b82]">
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* 验签流程图 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, ease: EASE_OUT }}
              className="rounded-3xl border border-[#2e2133]/8 bg-white/50 p-8 md:p-10"
            >
              <div className="space-y-6">
                {[
                  { step: "输入邀请码", desc: "粘贴 AURA- 开头的邀请码", icon: KeyRound },
                  { step: "HMAC-SHA256 验签", desc: "离线签名验证，密钥不进源码，编译时 --dart-define 注入", icon: LockKeyhole },
                  { step: "授权类型判定", desc: "永久 / 365 天 / 90 天，以验签后载荷为准，不信任派生缓存", icon: ShieldCheck },
                  { step: "访问许可", desc: "验签通过进入主界面，失败则停留在激活页", icon: Fingerprint },
                ].map((item, i) => (
                  <div key={item.step} className="flex items-start gap-5">
                    <div className="flex flex-col items-center">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#925b82]/15 bg-[#925b82]/8 text-[#925b82]">
                        <item.icon className="h-5 w-5" />
                      </div>
                      {i < 3 && <div className="mt-2 h-8 w-px bg-[#2e2133]/10" />}
                    </div>
                    <div className="pt-1.5">
                      <p className="font-mono text-xs font-bold text-[#2e2133]">{item.step}</p>
                      <p className="mt-1 text-sm text-[#746b75]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-xl border border-[#2e2133]/8 bg-[#f4f0f5] p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#9a8296]">
                  防时序攻击
                </p>
                <p className="mt-2 text-sm leading-6 text-[#746b75]">
                  常量时间字符串比较，杜绝通过响应耗时推断密钥。配套 CLI 工具支持 --permanent / --days N / --count N / --devices N 批量签发。
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* §6 电影级幻灯片                                */}
      {/* ============================================ */}
      <section className="bg-[#ebe5ed] px-5 py-28 md:px-10 md:py-36 lg:px-16">
        <div className="mx-auto max-w-[1450px]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.7, ease: EASE_OUT }}
            className="mb-14 max-w-2xl"
          >
            <h2 className="text-4xl font-semibold leading-[1.05] tracking-[-0.04em] md:text-6xl">
              14 种转场，
              <br />
              4 种自研 GPU Shader。
            </h2>
            <p className="mt-6 text-base leading-7 text-[#746b75]">
              双层 Stack 架构（非 PageView），画面特效与转场正交配置。图片与视频混合播放，把本地相册放映拉到电影级。
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.9, ease: EASE_OUT }}
          >
            <ScreenshotPlaceholder
              label="幻灯片放映截图占位（含 Shader 转场效果）"
              aspect="16/9"
              className="border-[#2e2133]/8 shadow-[0_40px_100px_-30px_rgba(60,38,62,.2)]"
            />
          </motion.div>

          {/* 转场分组列表 */}
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            <div>
              <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.2em] text-[#925b82]">
                经典 · 4 种
              </p>
              <ul className="space-y-2.5">
                {transitions.classic.map((t) => (
                  <li key={t} className="text-sm text-[#5d525f]">{t}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.2em] text-[#925b82]">
                高级 · 6 种
              </p>
              <ul className="space-y-2.5">
                {transitions.advanced.map((t) => (
                  <li key={t} className="text-sm text-[#5d525f]">{t}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-[#925b82]/15 bg-[#925b82]/[0.05] p-6">
              <div className="mb-5 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#925b82]" />
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#925b82]">
                  GPU Shader · 4 种
                </p>
              </div>
              <ul className="space-y-2.5">
                {transitions.shader.map((t) => (
                  <li key={t} className="text-sm font-medium text-[#2e2133]">{t}</li>
                ))}
              </ul>
              <p className="mt-5 text-xs leading-5 text-[#746b75]">
                自研 Fragment Shader（.frag）驱动，相册类应用中的顶级视觉实现。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* §7 完整功能矩阵 (Bento Grid)                   */}
      {/* ============================================ */}
      <section className="px-5 py-28 md:px-10 md:py-36 lg:px-16">
        <div className="mx-auto max-w-[1450px]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.7, ease: EASE_OUT }}
            className="mb-14 max-w-2xl"
          >
            <h2 className="text-4xl font-semibold leading-[1.05] tracking-[-0.04em] md:text-6xl">
              不只是看图工具。
            </h2>
            <p className="mt-6 text-base leading-7 text-[#746b75]">
              从画廊浏览到智能清理，从标签系统到应用内更新，Aura 是一款完整交付的 Android 应用，每个功能都经过真实设备验证。
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featureMatrix.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ delay: (index % 3) * 0.08, duration: 0.6, ease: EASE_OUT }}
                className={`rounded-2xl border p-6 ${feature.span} ${feature.highlight ? "border-[#925b82]/15 bg-[#925b82]/[0.05]" : "border-[#2e2133]/8 bg-white/40"}`}
              >
                <feature.icon className={`h-6 w-6 ${feature.highlight ? "text-[#925b82]" : "text-[#8c577b]"}`} />
                <h3 className="mt-5 text-lg font-semibold tracking-tight text-[#2e2133]">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#746b75]">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* §8 技术架构与设计亮点                           */}
      {/* ============================================ */}
      <section className="bg-[#ebe5ed] px-5 py-28 md:px-10 md:py-36 lg:px-16">
        <div className="mx-auto max-w-[1450px]">
          <div className="grid gap-14 lg:grid-cols-[0.5fr_1.5fr]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.7, ease: EASE_OUT }}
              className="lg:sticky lg:top-28 lg:self-start"
            >
              <h2 className="text-4xl font-semibold leading-[1.05] tracking-[-0.04em] md:text-5xl">
                从设计判断，
                <br />
                到可运行的产品。
              </h2>
              <p className="mt-6 max-w-sm text-base leading-8 text-[#746b75]">
                Aura 不是概念稿，而是完整交付的 Android 应用。覆盖本地数据库、自定义着色器、主题系统与伪装层，每一层都经过真实设备验证。
              </p>

              {/* 技术标签云 */}
              <div className="mt-8 flex flex-wrap gap-2">
                {techStack.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#2e2133]/10 bg-white/60 px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider text-[#6e5d70]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* 右栏：三层架构 + 设计亮点 */}
            <div className="space-y-4">
              {/* 三层架构 */}
              {[
                {
                  layer: "Disguise Layer",
                  desc: "12 套伪装皮肤 · activity-alias 动态切换 · 5 种解锁手势 · 皮肤轮换",
                  icon: EyeOff,
                  color: "#6e82b4",
                },
                {
                  layer: "Aura Core",
                  desc: "图库 · 相册 · 幻灯片 · 标签 · 搜索 · 清理 · 回收站",
                  icon: Cpu,
                  color: "#8c577b",
                },
                {
                  layer: "Sandbox Storage",
                  desc: "Isar 3.1 本地 NoSQL · 物理隔离沙盒 · .nomedia 隐蔽导出",
                  icon: Database,
                  color: "#8b6d90",
                },
              ].map((row, i) => (
                <motion.div
                  key={row.layer}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ delay: i * 0.1, duration: 0.6, ease: EASE_OUT }}
                  className="flex items-center gap-5 rounded-2xl border border-[#2e2133]/8 bg-white/50 p-6"
                >
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: `${row.color}1a`, color: row.color }}
                  >
                    <row.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-sm font-bold text-[#2e2133]">{row.layer}</p>
                    <p className="mt-1 text-sm text-[#746b75]">{row.desc}</p>
                  </div>
                  <span className="shrink-0 font-mono text-[10px] text-[#9a8296]">0{i + 1}</span>
                </motion.div>
              ))}

              {/* 独特设计亮点 */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.7, ease: EASE_OUT }}
                className="rounded-2xl border border-[#2e2133]/8 bg-white/40 p-6 md:p-8"
              >
                <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.2em] text-[#925b82]">
                  独特设计亮点
                </p>
                <ul className="space-y-4">
                  {uniqueHighlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#925b82]/10 font-mono text-[10px] font-bold text-[#925b82]">
                        {i + 1}
                      </span>
                      <span className="text-sm leading-6 text-[#5d525f]">{h}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* §9 下载引导                                   */}
      {/* ============================================ */}
      <section className="border-t border-[#2e2133]/8 bg-[#f4f0f5] px-5 py-28 md:px-10 md:py-32 lg:px-16">
        <div className="mx-auto flex max-w-[1450px] flex-col items-center gap-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.7, ease: EASE_OUT }}
          >
            <h2
              className="text-4xl font-semibold tracking-[-0.04em] md:text-6xl"
              style={serif}
            >
              把你的私密影像，
              <br />
              收进一个安静的空间。
            </h2>
          </motion.div>

          <motion.a
            href={DOWNLOAD_URL}
            download
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.7, ease: EASE_OUT }}
            className="group inline-flex items-center gap-4 rounded-full bg-gradient-to-r from-[#d9a9cb] to-[#925b82] px-8 py-4 text-sm font-bold text-[#2e2133] shadow-[0_20px_60px_-15px_rgba(217,169,203,0.5)] transition hover:shadow-[0_25px_70px_-15px_rgba(217,169,203,0.65)]"
          >
            <Download className="h-5 w-5" />
            下载 Aura for Android
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </motion.a>

          {/* 安装提示 */}
          <div className="mt-2 flex max-w-lg items-start gap-3 rounded-2xl border border-[#2e2133]/8 bg-white/50 px-5 py-4 text-left">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#925b82]/12 text-[11px] font-mono font-bold text-[#925b82]">
              !
            </span>
            <div className="text-xs leading-6 text-[#746b75]">
              <p>
                下载文件为 <span className="font-mono text-[#925b82]">.bin</span> 格式，请将后缀名重命名为
                <span className="font-mono text-[#925b82]"> .apk</span> 后再安装。
              </p>
              <p className="mt-2">
                首次安装需在系统设置中允许「安装未知来源应用」。覆盖升级不丢图片，直接用新版 APK 覆盖安装即可。
              </p>
            </div>
          </div>

          {/* 平台信息 */}
          <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.15em] text-[#9a8296]">
            <span>Android 12+</span>
            <span>ARM64</span>
            <span>v1.2.8</span>
            <span>~25 MB</span>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* §10 跨页引导 footer                            */}
      {/* ============================================ */}
      <section className="border-t border-[#2e2133]/8 bg-[#f4f0f5] px-5 py-20 md:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[1450px] flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#925b82]">
              Previous personal work
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
              上一个入口：为 macOS 重做启动台。
            </h2>
          </div>
          <Link
            href="/work/launchpad"
            className="group inline-flex items-center gap-3 rounded-full bg-[#2e2133] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#563b58]"
          >
            查看 LaunchPad
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </main>
  );
}
