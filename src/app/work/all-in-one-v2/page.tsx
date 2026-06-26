// src/app/work/all-in-one-v2/page.tsx
"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, useInView, AnimatePresence, type Variants } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { ToolDemo, type DemoType, DemoActiveProvider } from "./tool-demos";

/* ==========================================================================
   AllinOne V2 · Snap-Scroll Product Page
   ========================================================================== */
const serif = { fontFamily: "'Songti SC', 'Noto Serif SC', 'STSong', serif" };
const mono  = { fontFamily: "'SF Mono', 'JetBrains Mono', 'Consolas', monospace" };
const URL   = "https://www.figma.com/community/plugin/1579115225697225019/allinone";

const reviews = [
  {avatar:"🎨",name:"小雨",text:"用了 AllinOne 后效率直接翻倍！超级选择器太好用了，以前找图层找半天，现在一秒筛选。"},
  {avatar:"💻",name:"阿杰",text:"AI 组件集说明书简直是团队协作救星，新人接手项目不用再问东问西，文档直接生成。"},
  {avatar:"💼",name:"Lisa",text:"PPT 导出功能省了我无数时间，周五下午的汇报从来没这么从容过。强烈推荐！"},
  {avatar:"✨",name:"大熊",text:"时空信标太有创意了，以前大型画布里找位置找到崩溃，现在一键跳回。"},
  {avatar:"🔧",name:"老陈",text:"等轴形变工具让 icon 从 2D 飞跃到 2.5D，客户都说更专业了。"},
  {avatar:"📚",name:"Mia",text:"免费 + 30+ 功能 + 持续更新，这插件是设计师的良心之作，已推荐给全组。"},
  {avatar:"🌐",name:"Ryan",text:"AI 多语言翻译帮省了翻译外包的钱，直接绑定 Text Variables，多语言项目必备。"},
  {avatar:"🎤",name:"小鹿",text:"从 V1 用到 V2，看着它从简单工具箱变成 AI 驱动的全能平台，真的很惊喜。"},
  {avatar:"🚀",name:"老徐",text:"组件清洗器解决了我多年的命名洁癖，一键规范所有组件名，强迫症狂喜。"},
  {avatar:"🔬",name:"Emma",text:"Clean Hidden Layers 清理了几百个隐藏图层，文件瞬间瘦身 40%，太好用了。"},
  {avatar:"🏭",name:"阿涛",text:"100% AI 生成代码，一个设计师做出这种插件，只能说太强了，向团队推广中。"},
  {avatar:"🎯",name:"小峰",text:"日常用矩转框和移除 AL 最多，布局调整效率提升明显，已成为必备插件。"},
  {avatar:"🎓",name:"小艺",text:"像素对齐功能救了我的设计稿，再也不用担心半像素导致的模糊问题了。"},
  {avatar:"⭐",name:"阿星",text:"匹配样式功能太好用了，一键把裸奔的属性绑定到样式库，设计规范落地神速。"},
  {avatar:"🏫",name:"老周",text:"解散全部编组 + 解锁全部，这两个是我每天打开 Figma 用的第一个工具。"},
  {avatar:"🖥",name:"Yuki",text:"AI 语义命名太聪明了，批量重命名几百个图层只要几秒钟，命名恐惧症痊愈。"},
  {avatar:"⚙️",name:"阿飞",text:"从 V1 追到 V2，每个版本都有惊喜更新，这插件已经是我工作流的一部分。"},
  {avatar:"🖌",name:"Ray",text:"互换 Fill/Stroke 和重置图片比例，细节功能但用起来真的顺手，推荐。"},
  {avatar:"🎭",name:"小乔",text:"拆分文本功能太好用了，做多语言排版时拆分后逐个调整，效率翻倍。"},
  {avatar:"📋",name:"大刘",text:"添加自动布局一键包裹，响应式设计的神器。强烈推荐给所有 UI 设计师。"},
  {avatar:"📊",name:"Mark",text:"用了三个月，设计效率提升至少 30%。关键是免费，良心插件。"},
  {avatar:"🔩",name:"阿玲",text:"合并文本功能拯救了我的设计系统文档，批量整理文本从未如此简单。"},
  {avatar:"🌱",name:"小胖",text:"移除自动布局保持视觉不变，这个细节做得太好了，其他插件做不到。"},
  {avatar:"🍳",name:"大厨",text:"向上一层和移至顶层，配合快捷键使用，图层管理快到飞起。"},
  {avatar:"✈️",name:"Captain",text:"作为设计团队的 Lead，我要求全组安装 AllinOne，标准化了我们的工作流。"},
  {avatar:"⚖️",name:"法官",text:"按可见度排序这个功能很实用，清理文件时一目了然哪些图层该删了。"},
  {avatar:"🌾",name:"农夫",text:"内容重命名让图层列表从 Rectangle 123 变成有意义的名称，强迫症福音。"},
  {avatar:"🚒",name:"消防员",text:"剥离全部实例帮我重构了整套组件库，断开几百个实例一键搞定。"},
  {avatar:"🎄",name:"圣诞",text:"创建样式和匹配样式配合使用，设计规范落地从两周缩短到两天。"},
  {avatar:"🛩",name:"机长",text:"我做了 15 年设计，AllinOne 是近三年最让我惊喜的 Figma 插件，没有之一。"},
  {avatar:"💊",name:"医生",text:"交换位置功能在排列布局时太好用了，两个元素互换不用手动拖半天。"},
  {avatar:"📖",name:"学霸",text:"作为设计学生，AllinOne 帮我建立了规范的图层管理习惯，感谢开发者。"},
  {avatar:"🧪",name:"科学家",text:"设计理论助手内置的规范参考非常实用，做 B 端设计时经常查阅。"},
  {avatar:"⌨️",name:"Cathy",text:"AI 智能填充生成的文案比 Lorem Ipsum 真实多了，客户沟通时更有说服力。"},
  {avatar:"🎸",name:"摇滚",text:"V2 的 UI 比 V1 好看太多了，这种干净统一的设计风格我很喜欢。"},
  {avatar:"🎹",name:"钢琴家",text:"矩转框是我最常用的功能，保留样式转换 Frame，做组件库时必备。"},
  {avatar:"🎺",name:"小号",text:"框转矩提取内部元素的功能太巧妙了，重构设计稿时经常用到。"},
  {avatar:"🎻",name:"吉他",text:"第一次用时被功能数量震惊了，30+ 工具而且全部免费，太良心了。"},
  {avatar:"🪕",name:"提琴",text:"等 Figma 原生出这些功能等了五年，AllinOne 直接全给了。"},
  {avatar:"🎪",name:"射手",text:"精准选择 + 批量操作，以前加班做的事现在喝杯咖啡的时间就搞定了。"},
  {avatar:"🏹",name:"弓箭",text:"时空信标跨页面记忆这个设计太棒了，大型项目里跳来跳去终于有救了。"},
  {avatar:"🥷",name:"忍者",text:"等轴形变预设保存让我做 2.5D 图标效率提升 10 倍，强烈推荐。"},
  {avatar:"🍜",name:"主厨",text:"每天开工第一件事就是打开 AllinOne，已经成了肌肉记忆的一部分。"},
  {avatar:"🖼",name:"插画师",text:"插件不卡顿不崩溃，稳定性比很多收费插件都好，作者真的很用心。"},
  {avatar:"🏄",name:"冲浪",text:"用 AllinOne 半年了，见证了从 V1 到 V2 的进化。每次更新都有惊喜。"},
  {avatar:"🚴",name:"骑行",text:"推荐给身边所有用 Figma 的朋友，没有一个说不好的，真心好用。"},
  {avatar:"🤸",name:"体操",text:"作为自由设计师，AllinOne 帮我节省的时间可以直接转化为收入。"},
  {avatar:"🤹",name:"马戏",text:"AI 组件说明书让我的设计交付物专业度提升了一个档次。"},
  {avatar:"🎬",name:"导演",text:"PPT 导出质量超出预期，字体和图片完美保留，客户都问我用的什么工具。"},
  {avatar:"📸",name:"摄影师",text:"清理隐藏图层帮我在交稿前清理了 200 多个无用图层，文件清爽多了。"},
  {avatar:"🎮",name:"玩家",text:"插件响应速度很快，不像有些插件点一下等半天。效率工具就该这样。"},
  {avatar:"🎲",name:"赌神",text:"AllinOne + Figma 就是设计界的黄金搭档，没有之一。"},
  {avatar:"♟",name:"棋手",text:"超级选择器的嵌套实例定位救了我无数次，大型设计系统里找实例太痛苦了。"},
  {avatar:"🎱",name:"台球",text:"语言切换功能对中英文混用的团队太友好了，一键切换毫无压力。"},
  {avatar:"💇",name:"红发",text:"做了一款竞品分析 PPT，导出效果比手动截图拼凑好一百倍。"},
  {avatar:"🦱",name:"卷发",text:"AI 批量重命名基于内容语义而不是简单序号，这个智能程度出乎意料。"},
  {avatar:"👴",name:"白发",text:"用 Figma 十年了，AllinOne 是我见过功能最全、体验最好的免费插件。"},
  {avatar:"🦲",name:"光头",text:"解散编组到最底层，递归解散设计得很彻底，不留任何嵌套。"},
  {avatar:"🦯",name:"盲人",text:"插件的无障碍设计也做得不错，键盘操作流畅，给开发者点赞。"},
  {avatar:"🦼",name:"轮椅",text:"感谢作者持续更新，V2 的 AI 功能让我对未来充满期待。"},
];

const fadeUp: Variants = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16,1,0.3,1] } } };
const scaleIn: Variants = { hidden: { opacity: 0, scale: 0.96 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.16,1,0.3,1] } } };

function Tag({ n }: { n: string }) {
  return <span className="text-[10px] tracking-[0.22em] uppercase text-neutral-400" style={mono}>{n}</span>;
}
/* ── Progress dots ── */
function Dots({ total, active, on }: { total: number; active: number; on: (i: number) => void }) {
  return (
    <div className="fixed right-3 md:right-8 top-1/2 -translate-y-1/2 z-[200] flex flex-col gap-2 md:gap-3">
      {Array.from({ length: total }).map((_, i) => (
        <button key={i} onClick={() => on(i)} className="group relative flex items-center py-1" aria-label={`Slide ${i+1}`}>
          <motion.span layout animate={{ height: i===active?28:6, opacity: i===active?1:0.3 }} transition={{ type:"spring", stiffness:400, damping:30 }}
            className="block w-1.5 rounded-full bg-neutral-700" />
          <span className="absolute left-6 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-neutral-400 whitespace-nowrap pointer-events-none" style={mono}>{String(i+1).padStart(2,"0")}</span>
        </button>
      ))}
    </div>
  );
}

/* ==========================================================================
   Shared Carousel — used by FeatureSwitcher & AI section
   ========================================================================== */
type CarouselItem = { title: string; img?: string; demo?: DemoType };
function ImageCarousel({ items, active, dark, onPrev, onNext, sideFade = true }: {
  items: CarouselItem[]; active: number; dark?: boolean;
  onPrev: () => void; onNext: () => void; sideFade?: boolean;
}) {
  const max = items.length - 1;
  // Responsive sizing
  const [W, setW] = useState(420);
  const [H, setH] = useState(480);
  useEffect(() => {
    const u = () => {
      const w = window.innerWidth;
      setW(w >= 1024 ? 420 : w >= 640 ? 380 : 260);
      setH(w >= 1024 ? 480 : w >= 640 ? 400 : 340);
    };
    u();
    window.addEventListener("resize", u);
    return () => window.removeEventListener("resize", u);
  }, []);
  const G = -50;
  const step = W + G; // 330 / 270 / 210

  return (
    <div className="w-full">
      <div className="relative overflow-hidden" style={{ height: H }}>
        {/* Side fade masks（仅在多图轮播时显示，单图预览区关闭以免遮挡图片两侧） */}
        {sideFade && (
          <>
            <div className="absolute inset-y-0 left-0 w-20 z-30 pointer-events-none hidden sm:block"
              style={{ background: `linear-gradient(to right, ${dark ? "#171717" : "#F7F6F3"}, ${dark ? "rgba(23,23,23,0.6)" : "rgba(247,246,243,0.6)"} 30%, transparent)` }} />
            <div className="absolute inset-y-0 right-0 w-20 z-30 pointer-events-none hidden sm:block"
              style={{ background: `linear-gradient(to left, ${dark ? "#171717" : "#F7F6F3"}, ${dark ? "rgba(23,23,23,0.6)" : "rgba(247,246,243,0.6)"} 30%, transparent)` }} />
          </>
        )}

        {items.map((x, i) => {
          const o = i - active;
          const abs = Math.abs(o);
          const sign = Math.sign(o);
          const xPos = abs <= 1
            ? o * step
            : sign * (step + (abs - 1) * (W + 100) + 100);
          const isCenter = o === 0;
          const isSide  = abs === 1;

          return (
            <motion.div key={i} className="absolute inset-0 flex items-center justify-center"
              animate={{ x: xPos, y: isCenter ? 0 : 16, scale: isCenter ? 1 : 0.96, opacity: isCenter ? 1 : isSide ? 0.25 : 0 }}
              transition={{ duration: 0.55, ease: [0.33, 1, 0.68, 1] }}
              style={{ zIndex: isCenter ? 20 : isSide ? 5 : 0, pointerEvents: isCenter ? "auto" : "none" }}>
              <div className="relative h-full overflow-hidden border shadow-sm" style={{ width: W, borderRadius: 10, background: dark ? "#171717" : "#fff", borderColor: dark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)" }}>
                {x.demo ? (
                  <DemoActiveProvider value={isCenter}>
                    <ToolDemo type={x.demo} dark={dark} />
                  </DemoActiveProvider>
                ) : (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {/* 插件界面预览图 — 轮播展示各功能的 UI 截图，fallback 为默认插件界面 */}
                    <img src={x.img||"https://cdn.btbon.cn/images/plugin-ui.png"} alt={x.title}
                      className="w-full h-full object-cover" loading="lazy" />
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-2 mt-3">
        <button onClick={onPrev} disabled={active===0}
          className={`w-9 h-9 flex items-center justify-center border transition-all disabled:opacity-25 disabled:cursor-not-allowed ${dark ? "border-white/15 text-white/60 hover:border-white/40" : "border-neutral-200 text-neutral-400 hover:border-neutral-400 hover:text-neutral-900"}`}
          style={{borderRadius:4}}>
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className={`text-[11px] tracking-wider ${dark?"text-white/30":"text-neutral-300"}`} style={mono}>{active+1}/{max+1}</span>
        <button onClick={onNext} disabled={active===max}
          className={`w-9 h-9 flex items-center justify-center border transition-all disabled:opacity-25 disabled:cursor-not-allowed ${dark ? "border-white/15 text-white/60 hover:border-white/40" : "border-neutral-200 text-neutral-400 hover:border-neutral-400 hover:text-neutral-900"}`}
          style={{borderRadius:4}}>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/* ==========================================================================
   FeatureSwitcher (for slides 2 & 3)
   ========================================================================== */
type F = { icon: string; title: string; desc: string; img?: string; demo?: DemoType };
function FeatureSwitcher({ items, dark = false, reverse = false }: { items: F[]; dark?: boolean; reverse?: boolean }) {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const max = items.length - 1;
  const f = items[active];

  useEffect(() => { itemRefs.current[active]?.scrollIntoView({ block: "nearest", behavior: "smooth" }); }, [active]);

  const prev = () => setActive((p) => Math.max(0, p - 1));
  const next = () => setActive((p) => Math.min(max, p + 1));
  const actC = (on: boolean) => dark
    ? (on ? "border-white bg-white/8" : "border-transparent hover:bg-white/5")
    : (on ? "border-neutral-900 bg-neutral-100/80" : "border-transparent hover:bg-neutral-50");

  const list = (
    <div ref={listRef} className={`overflow-y-auto flex flex-col border ${dark ? "border-white/10" : "border-neutral-200/60"} h-[340px] max-h-[340px] sm:h-[400px] sm:max-h-[400px] lg:h-[480px] lg:max-h-[480px]`}
      style={{ scrollbarWidth: "thin" }}>
      {items.map((x, i) => {
        const on = i === active;
        return (
          <button key={x.title} ref={(el) => { itemRefs.current[i] = el; }} onClick={() => setActive(i)}
            className={`group text-left px-4 py-4 border-l-2 transition-all duration-200 ${actC(on)}`}>
            <div className="flex items-start gap-3">
              <span className="text-base flex-shrink-0 mt-0.5">{x.icon}</span>
              <div className="min-w-0">
                <h4 className={`text-[18px] leading-snug font-bold ${on ? (dark?"text-white":"text-neutral-900") : (dark?"text-neutral-400":"text-neutral-500")}`} style={serif}>{x.title}</h4>
                <p className={`text-[13px] leading-relaxed transition-all duration-300 ${dark ? "text-neutral-400" : "text-neutral-500"} ${on ? "opacity-100 max-h-24 mt-1" : "opacity-0 max-h-0 overflow-hidden"}`}>{x.desc}</p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );

  const img = (
    <ImageCarousel items={items} active={active} dark={dark} onPrev={prev} onNext={next} />
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
      <div className={`lg:col-span-6 ${reverse?"lg:order-2":"lg:order-1"}`}>{list}</div>
      <div className={`lg:col-span-6 ${reverse?"lg:order-1":"lg:order-2"} w-full`}>{img}</div>
    </div>
  );
}

/* ==========================================================================
   PAGE
   ========================================================================== */
export default function AllInOneV2Page() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const TOTAL = 6;

  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);

  // Force scroll container to top — disable snap during reset to prevent override
  const resetScroll = useCallback(() => {
    const c = containerRef.current; if (!c) return;
    c.style.scrollSnapType = "none";
    c.scrollTop = 0;
    requestAnimationFrame(() => { c.style.scrollSnapType = ""; });
  }, []);
  useEffect(() => {
    resetScroll();
    const c = containerRef.current; if (!c) return;
    const ro = new ResizeObserver(() => resetScroll());
    ro.observe(c);
    const t = setTimeout(resetScroll, 1000);
    return () => { ro.disconnect(); clearTimeout(t); };
  }, [resetScroll]);

  // IntersectionObserver for slide tracking
  useEffect(() => {
    const c = containerRef.current; if (!c) return;
    const slides = c.querySelectorAll("[data-slide]");
    const ob = new IntersectionObserver((es) => { es.forEach(e => { if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.slide)); }); }, { threshold: 0.55, root: c });
    slides.forEach(s => ob.observe(s));
    return () => ob.disconnect();
  }, []);

  const go = useCallback((i: number) => {
    containerRef.current?.querySelector(`[data-slide="${i}"]`)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key==="ArrowDown"||e.key===" ") { e.preventDefault(); go(Math.min(active+1,TOTAL-1)); }
      else if (e.key==="ArrowUp") { e.preventDefault(); go(Math.max(active-1,0)); }
    };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [active, go]);

  return (
    <div ref={containerRef}
      className="fixed inset-0 z-[100] overflow-y-scroll overflow-x-hidden text-neutral-900"
      style={{ scrollSnapType: "y mandatory", WebkitOverflowScrolling: "touch", background: "#F7F6F3" }}>
      {/* bg */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-25"
        style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.016) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.016) 1px,transparent 1px)", backgroundSize: "72px 72px" }} />
      <div className="fixed top-0 right-0 w-[60vw] h-[60vh] pointer-events-none z-0 opacity-[0.025]"
        style={{ background: "radial-gradient(circle at 80% 20%, #7C3AED, transparent 70%)" }} />

      {/* Back */}
      <button onClick={() => router.back()} className="fixed top-4 left-3 md:top-8 md:left-8 z-[200] w-10 h-10 flex items-center justify-center text-neutral-400 hover:text-neutral-900 transition-colors duration-300 group">
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
      </button>

      <Dots total={TOTAL} active={active} on={go} />

      {/* Scroll hint */}
      <AnimatePresence>
        {active===0 && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{delay:2.5,duration:0.6}}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] text-neutral-300 text-[11px] tracking-[0.25em] pointer-events-none" style={mono}>
            ↓ SCROLL
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════
          1 · HERO
          ═══════════════════════════════════════════════ */}
      <section data-slide={0} className="min-h-[100vh] flex items-center px-4 sm:px-6 md:px-16 snap-start relative overflow-hidden py-20 md:py-0" style={{ scrollSnapStop: "always" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background:"radial-gradient(ellipse at 20% 45%, rgba(124,58,237,0.025) 0%, transparent 55%), radial-gradient(ellipse at 80% 55%, rgba(0,0,0,0.01) 0%, transparent 55%)" }} />
        <span className="absolute top-1/2 right-[5%] -translate-y-1/2 pointer-events-none select-none font-black text-transparent hidden sm:block"
          style={{ ...serif, fontSize:"min(30vw,420px)", lineHeight:1, WebkitTextStroke:"1px rgba(0,0,0,0.006)" }}>V2</span>
        <span className="absolute top-6 left-4 md:left-8 text-[10px] tracking-[0.14em] text-neutral-400 z-10" style={mono}>FIGMA PLUGIN</span>
        <span className="absolute top-6 right-6 md:right-10 text-[10px] tracking-[0.14em] text-neutral-400 z-10 flex items-center gap-2" style={mono}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-pulse" /> FREE
        </span>

        <div className="relative z-10 w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20 items-center">
          <motion.div initial="hidden" animate="visible" variants={{ hidden:{},visible:{transition:{staggerChildren:0.12}}}} className="lg:col-span-6">
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-8">
              {/* Logo — AllinOne 插件品牌图标 */}
              <img src="/allinone-site/Frame%2021.png" alt="A" width={44} height={44} />
              <span className="text-lg text-neutral-300">×</span>
              {/* Logo — Figma 官方图标，展示插件运行平台 */}
              <img src="/allinone-site/Figma.png" alt="F" width={44} height={44} />
              <span className="ml-2 px-3 py-1 border border-neutral-300 text-[10px] text-neutral-500 tracking-[0.08em]" style={mono}>✦ V2.0 · Free Forever</span>
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl sm:text-6xl lg:text-8xl font-black leading-[1.02] tracking-[-0.03em] mb-3" style={serif}>Allin<span className="text-[#7C3AED]">One</span></motion.h1>
            <motion.p variants={fadeUp} className="text-lg md:text-xl font-light text-neutral-500 mb-4">AI 驱动的 Figma 设计师提效工具集</motion.p>
            <motion.p variants={fadeUp} className="text-sm text-neutral-500 leading-relaxed mb-8 max-w-xl">四大新功能 + 30 余项经典工具。从 2D 到 2.5D，从单语到多语。</motion.p>
            <motion.div variants={fadeUp} className="flex gap-3 mb-8 max-w-md">
              {[{v:"30+",l:"FEATURES"},{v:"340+",l:"USERS"},{v:"V2",l:"VERSION"}].map(s=>(
                <div key={s.l} className="flex-1 py-3 border border-neutral-200 text-center"><div className="text-2xl font-black" style={serif}>{s.v}</div><div className="text-[10px] tracking-[0.1em] text-neutral-400 mt-1" style={mono}>{s.l}</div></div>
              ))}
            </motion.div>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-8 max-w-md">
              <a href={URL} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-neutral-900 text-white text-sm font-medium hover:bg-[#7C3AED] transition-colors duration-300 group">
                在 Figma 社区打开 <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
              <button onClick={() => router.back()} className="inline-flex items-center gap-2 px-8 py-4 text-sm text-neutral-500 hover:text-neutral-900 border border-neutral-300 transition-colors">
                <ArrowLeft className="w-4 h-4" /> 返回作品集
              </button>
            </motion.div>
          </motion.div>
          <motion.div initial={{opacity:0,scale:0.97}} animate={{opacity:1,scale:1}} transition={{duration:0.8,delay:0.2}} className="lg:col-span-6">
            <div className="relative w-full aspect-[7/8] max-w-[580px] mx-0 bg-white border border-neutral-200/70 shadow-[0_4px_32px_rgba(0,0,0,0.04)] overflow-hidden" style={{borderRadius:8}}>
              {/* iframe — 嵌入插件 UI 演示页面，展示真实插件界面 */}
              <iframe src="/allinone-site/ui_2.html" title="Plugin UI" className="w-full h-full border-none block" scrolling="no" onLoad={resetScroll} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          2 · 简单工具
          ═══════════════════════════════════════════════ */}
      <section data-slide={1} className="min-h-[100vh] flex items-center px-4 sm:px-6 md:px-16 snap-start relative py-20 md:py-0">
        <div className="max-w-[1400px] mx-auto w-full relative z-10">
          <div className="mb-12 md:mb-24 flex items-end justify-between">
            <div><Tag n="01 · Simple Tools" /><h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-[1.08] tracking-[-0.03em] mt-2" style={serif}>简单工具集</h2><p className="mt-2 text-sm text-neutral-500 max-w-lg">15 个高频快捷操作，覆盖布局、文本、层级、样式、整理五大场景。日常设计工作中最常见的重复劳动，一键搞定。</p></div>
            <span className="hidden lg:block text-7xl font-black text-neutral-200" style={serif}>01</span>
          </div>
          <motion.div initial="hidden" whileInView="visible" viewport={{once:true,margin:"-15%"}} variants={fadeUp}>
            <FeatureSwitcher items={[
              {icon:"🖼️",title:"矩转框",desc:"把选中的普通矩形原地升级为 Frame，保留填充、描边、圆角等所有视觉样式，使其获得容器属性、可容纳子元素。",demo:"to-frame"},
              {icon:"🧱",title:"框转矩",desc:"把选中的 Frame 或 Group 降维成普通矩形，保留视觉外观但剥离容器属性，内部子元素被提取出来。",demo:"to-rect"},
              {icon:"✂️",title:"段落行拆分",desc:"将一个带换行的多行文本框，按换行符拆成多个独立的单行文本层，各自可单独编辑、移动。",demo:"split-text"},
              {icon:"🔗",title:"文本拼合",desc:"把选中的多个独立文本图层按画布上的视觉位置排序，合并为一个带换行的多行文本框。",demo:"join-text"},
              {icon:"⛔️",title:"清除自动布局属性",desc:"移除选中图层及其所有子层级的 Auto Layout 属性，恢复为普通 Frame，子元素保留在原视觉位置不再自动排列。",demo:"remove-al"},
              {icon:"🍱",title:"外加自动布局Frame",desc:"给选中的每一个图层分别套上一层独立的自动布局 Frame 外套，各自成为响应式容器互不影响。",demo:"add-al-wrapper"},
              {icon:"📤",title:"逃逸一层",desc:"把选中图层从当前父级容器中移出，提升到上一级容器内，层级减一。",demo:"up-one"},
              {icon:"🚀",title:"完全逃逸",desc:"把选中图层直接移到页面最顶层（Root），跳过所有中间嵌套层级，原容器变浅。",demo:"up-all"},
              {icon:"💥",title:"解除所有Group",desc:"递归解散选中元素内部所有的 Group，虚线与标签消失，只保留 Frame 结构，元素本身位置不变。",demo:"ungroup-all"},
              {icon:"🔓",title:"解锁内部图层",desc:"递归解锁选中元素内部所有被锁定的图层，从父级到子级全部恢复可编辑，方便批量操作。",demo:"unlock-all"},
              {icon:"🔄",title:"交换填充描边",desc:"把选中图层的填充颜色与描边颜色互换，Fill 变 Stroke、Stroke 变 Fill。",demo:"swap-fs"},
              {icon:"⚖️",title:"重置图片比例",desc:"修复被拉伸变形的图片，恢复其原始长宽比例，消除失真。",demo:"reset-image"},
              {icon:"👁️",title:"按视觉排序图层",desc:"根据画布上的 X/Y 坐标重新排列图层列表顺序（从上到下、从左到右），再点一次可反向排列。",demo:"sort-layers"},
              {icon:"🏷️",title:"按内容重命名",desc:"自动把文本图层或含文本的 Frame 重命名为其文本内容，图层列表瞬间从 Rectangle 123 变成有意义名称。",demo:"rename-content"},
              {icon:"💔",title:"解绑所有实例",desc:"递归解绑选中图层下所有嵌套的组件实例（Instance），脱离母版变为普通 Frame，可自由修改。",demo:"detach-all"},
              {icon:"👻",title:"删除隐藏图层",desc:"递归删除所选范围内所有闭眼隐藏的图层，原可见图层不动，文件瘦身。",demo:"remove-hidden"},
              {icon:"🎯",title:"像素取整",desc:"把选中图层的 X、Y 坐标及宽高强制四舍五入为整数，严格对齐像素格，消除半像素杂边。",demo:"pixel-perfect"},
              {icon:"🔀",title:"交换位置",desc:"交换选中的两个图层的 X/Y 坐标，位置对调，但图层层级保持不变。",demo:"swap-positions"},
              {icon:"✨",title:"生成本地样式",desc:"把选中图层的颜色、文本、效果等属性提取为本地样式，自动检测重名，沉淀为可复用资产。",demo:"create-styles"},
              {icon:"💅",title:"匹配本地样式",desc:"扫描选中图层，将裸奔的颜色 / 字体属性与本地样式库重新绑定，规范落地一步到位。",demo:"match-styles"},
            ]} />
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          3 · 高级工具 (dark)
          ═══════════════════════════════════════════════ */}
      <section data-slide={2} className="min-h-[100vh] flex items-center px-4 sm:px-6 md:px-16 snap-start relative bg-neutral-900 text-neutral-100 overflow-hidden py-20 md:py-0">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] rounded-full blur-[180px] pointer-events-none" style={{background:"rgba(124,58,237,0.04)"}} />
        <div className="max-w-[1400px] mx-auto w-full relative z-10">
          <div className="mb-12 md:mb-24 flex items-end justify-between">
            <div><Tag n="02 · Advanced Tools" /><h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-[1.08] tracking-[-0.03em] text-white mt-2" style={serif}>高级工具集</h2><p className="mt-2 text-sm text-neutral-400 max-w-lg">深度操作 · 精准控制 · 效率进阶。超级选择器、等轴形变、时空信标等 7 大高级功能，满足复杂设计场景的专业需求。</p></div>
            <span className="hidden lg:block text-7xl font-black text-white/5" style={serif}>02</span>
          </div>
          <motion.div initial="hidden" whileInView="visible" viewport={{once:true,margin:"-15%"}} variants={fadeUp}>
            <FeatureSwitcher dark reverse items={[
              {icon:"🔍",title:"超级选择器",desc:"按属性、类型、实例多维度精准筛选图层。同属性选择、锁定图层筛选、嵌套实例定位，大型设计系统里也能秒级命中目标。",img:"https://cdn.btbon.cn/plugin/超级选择.png"},
              {icon:"📝",title:"查找替换",desc:"全局文本查找替换，支持正则表达式。配合字体统计、批量字号调整，多语言排版与文案修订一步到位。",img:"https://cdn.btbon.cn/plugin/文字替换.png"},
              {icon:"📊",title:"PPT 一键导出",desc:"将 Figma 中的多个 Frame 批量转换为可编辑的 PowerPoint。保留图层结构与样式，文字可二次编辑；图片需手动导入替换。",demo:"ppt-export"},
              {icon:"💎",title:"组件清洗器",desc:"智能清洗组件集命名：在 camelCase / PascalCase / snake_case 之间统一格式，支持组件名内查找替换，强迫症福音。",demo:"component-clean"},
              {icon:"🔷",title:"等轴形变工具",desc:"将 2D 图形或 Frame 倾斜为等轴测视图，一键从 2D 跃升 2.5D。可保存多个自定义预设，精确控制倾斜角度。",demo:"isometric-transform"},
              {icon:"📍",title:"时空信标",desc:"记录当前画布的编辑位置（视口 + 缩放）。切走去做别的事再回来，点击信标一键跳回原位，跨页面也能记忆。",demo:"space-beacon"},
              {icon:"🌐",title:"语言切换",desc:"两种用法：直接替换界面文本为另一语言；或生成新语言作为本地 Text Variables 模式，配合多语言项目长期维护。",demo:"language-switch"},
            ]} />
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          3 · AI 工具 — 可选中宫格 + 截图
          ═══════════════════════════════════════════════ */}
      <AIWithImage />

      {/* ══════════════════════════════════════════════════
          4 · 用户评价 (Bubble Cloud, auto-scroll)
          ═══════════════════════════════════════════════ */}
      <section data-slide={4} className="min-h-[100vh] flex flex-col items-center justify-center px-4 sm:px-6 md:px-16 snap-start relative overflow-hidden py-20 md:py-0">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(124,58,237,0.02) 0%, transparent 70%)" }} />
        <div className="max-w-[1200px] mx-auto w-full relative z-10 text-center mb-8">
          <Tag n="04 · Testimonials" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-[1.08] tracking-[-0.03em] mt-2" style={serif}>设计师们怎么说</h2>
          <p className="mt-2 text-sm text-neutral-500">来自 Figma 社区的真实反馈 · 340+ 设计师的日常提效选择</p>
        </div>

        {/* Row 1 — slow */}
        <div className="relative w-full overflow-hidden mb-6">
          <style>{`
            @keyframes scrollL { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
            .scroll-row { display:flex; gap:16px; width:max-content; animation:scrollL 640s linear infinite; }
            .scroll-row:hover { animation-play-state:paused; }
          `}</style>
          <div className="scroll-row">
            {[...reviews, ...reviews].map((t,i) => (
              <div key={i} className="w-72 flex-shrink-0 bg-white border border-neutral-200/60 p-5 hover:border-[#7C3AED]/30 transition-all" style={{borderRadius:16}}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl w-10 h-10 flex items-center justify-center bg-neutral-100 flex-shrink-0" style={{borderRadius:"50%"}}>{t.avatar}</span>
                  <span className="text-sm font-bold" style={serif}>{t.name}</span>
                </div>
                <p className="text-[13px] text-neutral-500 leading-relaxed">{t.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 — medium fast */}
        <div className="relative w-full overflow-hidden mb-6">
          <style>{`
            @keyframes scrollL2 { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
            .scroll-row-2 { display:flex; gap:16px; width:max-content; animation:scrollL2 560s linear infinite; }
            .scroll-row-2:hover { animation-play-state:paused; }
          `}</style>
          <div className="scroll-row-2">
            {[...reviews.slice(6), ...reviews.slice(6)].map((t,i) => (
              <div key={i} className="w-72 flex-shrink-0 bg-white border border-neutral-200/60 p-5 hover:border-[#7C3AED]/30 transition-all" style={{borderRadius:16}}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl w-10 h-10 flex items-center justify-center bg-neutral-100 flex-shrink-0" style={{borderRadius:"50%"}}>{t.avatar}</span>
                  <span className="text-sm font-bold" style={serif}>{t.name}</span>
                </div>
                <p className="text-[13px] text-neutral-500 leading-relaxed">{t.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Row 3 — fastest */}
        <div className="relative w-full overflow-hidden">
          <style>{`
            @keyframes scrollL3 { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
            .scroll-row-3 { display:flex; gap:16px; width:max-content; animation:scrollL3 480s linear infinite; }
            .scroll-row-3:hover { animation-play-state:paused; }
          `}</style>
          <div className="scroll-row-3">
            {[...reviews.slice(3).reverse(), ...reviews.slice(3).reverse()].map((t,i) => (
              <div key={i} className="w-72 flex-shrink-0 bg-white border border-neutral-200/60 p-5 hover:border-[#7C3AED]/30 transition-all" style={{borderRadius:16}}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl w-10 h-10 flex items-center justify-center bg-neutral-100 flex-shrink-0" style={{borderRadius:"50%"}}>{t.avatar}</span>
                  <span className="text-sm font-bold" style={serif}>{t.name}</span>
                </div>
                <p className="text-[13px] text-neutral-500 leading-relaxed">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          5 · CTA
          ═══════════════════════════════════════════════ */}
      <section data-slide={5} className="min-h-[100vh] flex items-center px-4 sm:px-6 md:px-16 snap-start relative py-20 md:py-0">
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-[50vw] h-[50vw] rounded-full blur-[200px]" style={{background:"rgba(124,58,237,0.03)"}} />
        </div>
        <motion.div initial="hidden" whileInView="visible" viewport={{once:true,margin:"-15%"}} variants={{hidden:{},visible:{transition:{staggerChildren:0.12}}}}
          className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div variants={fadeUp}><Tag n="05 · Install" /></motion.div>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-5xl lg:text-7xl font-black leading-[1.05] tracking-[-0.03em] mb-6" style={serif}>准备好<br />提升设计效率了吗？</motion.h2>
          <motion.p variants={fadeUp} className="text-lg text-neutral-500 mb-10">免费下载，30+ 功能，终身免费。</motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href={URL} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-10 py-4 bg-neutral-900 text-white text-base font-medium hover:bg-[#7C3AED] transition-colors duration-300 group">
              <Sparkles className="w-5 h-5" /> 前往 Figma 社区安装 <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
            <button onClick={() => router.back()} className="inline-flex items-center gap-2 px-8 py-4 text-sm text-neutral-500 hover:text-neutral-900 border border-neutral-300 transition-colors">
              <ArrowLeft className="w-4 h-4" /> 返回作品集
            </button>
          </motion.div>
          <motion.div variants={fadeUp} className="mt-16 pt-6 border-t border-neutral-200 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-neutral-400 tracking-[0.1em]" style={mono}>
            <span>ALLINONE V2 · FIGMA COMMUNITY PLUGIN</span>
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" /> 100% AI-CODED</span>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}

/* ==========================================================================
   AI 工具 — 可选中宫格 + 截图联动
   ========================================================================== */
function AIWithImage() {
  const [sel, setSel] = useState(0);
  const items = [
    {icon:"🤖",title:"AI 组件集说明书",desc:"选中任意组件集，AI 自动生成组件描述、使用说明和设计意图文档。让设计资产自带使用手册 — 团队协作零沟通成本。",img:"https://cdn.btbon.cn/plugin/sms.gif"},
    {icon:"🌐",title:"AI 多语言翻译",desc:"智能翻译文本图层为多语言并自动绑定为 Figma 本地 Text Variables。支持 20+ 语言，多语言适配从数小时缩短为数秒。",img:"https://cdn.btbon.cn/plugin/fy.gif"},
    {icon:"✨",title:"AI 智能填充",desc:"利用 AI 自动生成内容填充设计稿，告别 Lorem Ipsum。上下文感知生成贴合场景的真实文案与数据。",img:"https://cdn.btbon.cn/plugin/tc.gif"},
    {icon:"🔤",title:"AI 语义命名 + 设计理论",desc:"AI 理解图层语义自动生成规范命名，支持批量重命名。内置设计理论库，AI 辅助解读设计原则。",img:"https://cdn.btbon.cn/plugin/sjll.gif"},
  ];

  return (
    <section data-slide={3} className="min-h-[100vh] flex items-center px-4 sm:px-6 md:px-16 snap-start relative py-20 md:py-0">
      <div className="max-w-[1400px] mx-auto w-full relative z-10">
        <div className="mb-12 md:mb-24 flex items-end justify-between">
          <div><Tag n="03 · AI Powered" /><h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-[1.08] tracking-[-0.03em] mt-2" style={serif}>AI 智能工具</h2><p className="mt-2 text-sm text-neutral-500 max-w-lg">AI 驱动的智能设计工具，从组件文档自动生成到多语言一键翻译，从语义命名到智能内容填充。让 AI 接管繁琐的文档与本地化工作，专注创意本身。</p>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <span className="inline-flex items-center gap-1.5 text-[11px] text-neutral-400 bg-neutral-100 px-2.5 py-1 rounded-full" style={{fontFamily: "var(--font-mono)"}}>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="3" y="7" width="10" height="7" rx="1.5"/><path d="M5 7V5a3 3 0 116 0v2"/><circle cx="8" cy="10.5" r="0.8" fill="currentColor" stroke="none"/></svg>
                不获取 API 密钥
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] text-neutral-400 bg-neutral-100 px-2.5 py-1 rounded-full" style={{fontFamily: "var(--font-mono)"}}>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="8" cy="8" r="6"/><path d="M8 5v3.5l2.5 1.5"/></svg>
                设置仅本地保存
              </span>
            </div></div>
          <span className="hidden lg:block text-7xl font-black text-neutral-200" style={serif}>03</span>
        </div>

        <motion.div initial="hidden" whileInView="visible" viewport={{once:true,margin:"-15%"}} variants={{hidden:{},visible:{transition:{staggerChildren:0.1}}}}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-3">
            {items.map((f,i) => {
              const active = i === sel;
              return (
                <motion.button key={f.title} variants={scaleIn} onClick={() => setSel(i)}
                  className={`text-left relative bg-white border p-6 md:p-7 overflow-hidden transition-all duration-300 ${
                    active
                      ? "border-[#7C3AED] shadow-[0_0_0_1px_#7C3AED] scale-[1.03] bg-[#F8F6FF] z-10"
                      : "border-neutral-200/60 hover:border-neutral-300"
                  }`}
                  style={{borderRadius:6}}>
                  {active && <div className="absolute top-0 left-0 right-0 h-1 bg-[#7C3AED]" />}
                  <span className="text-3xl mb-3 block">{f.icon}</span>
                  <h3 className="text-lg font-black mb-2 leading-tight" style={serif}>{f.title}</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">{f.desc}</p>
                  <span className="inline-block mt-3 text-[10px] font-bold tracking-widest uppercase text-[#7C3AED]" style={mono}>★ NEW</span>
                </motion.button>
              );
            })}
          </div>

          <div className="lg:col-span-5 w-full">
            <ImageCarousel items={items} active={sel} sideFade={false}
              onPrev={() => setSel((p) => Math.max(0, p - 1))}
              onNext={() => setSel((p) => Math.min(items.length - 1, p + 1))} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
