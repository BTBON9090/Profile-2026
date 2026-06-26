// src/components/sections/work-snapshots.tsx
"use client";
import { motion } from "framer-motion";
import { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import UniversalModal from "@/components/ui/UniversalModal";
import { getProjectBySlug } from "@/data/projects";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: EASE },
  }),
};

const serif = { fontFamily: "'Songti SC', 'Noto Serif SC', 'STSong', serif" };
const mono = { fontFamily: "var(--font-mono), 'JetBrains Mono', monospace" };

/* ─── Project tile data (9 items)
   12-col grid, explicit placement.  gap: 1px.
   Visual order L→R, T→B:
     R1-4:  [1.雪诺浏览器 6×4] [2.Studio 3×3] [3.Enterplorer 3×4]
     R4-9:  [4.AllinOne 3×5] [5.AI翻译 3×3] [6.AmazeUI 3×3] [7.安全空间 3×2]
     R7-9:  [4 cont] [8.磁力聚星 3×2] [9.商网办公 6×3]
   Mobile: 6-col grid with custom layout.  ─── */
const TILES: { n: string; e: string; img: string; gc: string; gr: string; mobileGc: string; mobileGr: string; slug: string; icon: React.ReactNode }[] = [
  { n: "雪诺企业安全浏览器", e: "Snow Browser", img: "https://cdn.btbon.cn/images/nt2.png", gc: "1/7", gr: "1/5", mobileGc: "1/5", mobileGr: "1/4", slug: "snownewtab", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg> },
  { n: "AllinOne Figma 插件", e: "Figma Power Plugin", img: "https://cdn.btbon.cn/images/alov2.png", gc: "1/4", gr: "5/10", mobileGc: "5/7", mobileGr: "1/5", slug: "all-in-one", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg> },
  { n: "Enterplorer Studio", e: "Developer Tool", img: "https://cdn.btbon.cn/images/es.png", gc: "7/10", gr: "1/4", mobileGc: "1/3", mobileGr: "4/6", slug: "studio", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg> },
  { n: "Enterplorer 企业浏览器", e: "Enterprise Browser", img: "https://cdn.btbon.cn/images/ep2.png", gc: "10/13", gr: "1/5", mobileGc: "3/5", mobileGr: "4/6", slug: "enterplorer", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg> },
  { n: "企业安全工作空间", e: "SnowSpaces", img: "https://cdn.btbon.cn/images/kj2.png", gc: "10/13", gr: "5/7", mobileGc: "5/7", mobileGr: "4/6", slug: "snowspace", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg> },
  { n: "AI Translate 翻译插件", e: "AI Translation", img: "https://cdn.btbon.cn/images/at3.png", gc: "4/7", gr: "5/8", mobileGc: "1/3", mobileGr: "6/9", slug: "ai-translate", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15 15 0 014 10 15 15 0 01-4 10 15 15 0 01-4-10 15 15 0 014-10z" /></svg> },
  { n: "商网办公系统", e: "AVIC Shangwang", img: "https://cdn.btbon.cn/images/sw.png", gc: "7/13", gr: "7/10", mobileGc: "3/7", mobileGr: "6/9", slug: "avic", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 6h6M9 10h6M9 14h3" /></svg> },
  { n: "AmazeUI 设计系统", e: "Design System", img: "https://cdn.btbon.cn/images/am2.png", gc: "7/10", gr: "4/7", mobileGc: "1/5", mobileGr: "9/12", slug: "amazeui", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" /><rect x="2" y="14" width="20" height="8" rx="2" /></svg> },
  { n: "磁力聚星·达人平台", e: "Kwai Magnetic Star", img: "https://cdn.btbon.cn/images/cj2.png", gc: "4/7", gr: "8/10", mobileGc: "5/7", mobileGr: "9/12", slug: "kwai-magnetic-star", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg> },
];

/* ─── Cube-flip tile component ─── */
function FlipTile({ name, eng, img, icon, forceFlipped, onClick }: {
  name: string; eng: string; img: string; icon: React.ReactNode; forceFlipped: boolean;
  onClick: () => void;
}) {
  const [f, setF] = useState(false);
  useEffect(() => { setF(forceFlipped); }, [forceFlipped]);
  const enter = useCallback(() => setF(true), []);
  const leave = useCallback(() => setF(false), []);
  return (
    <div
      className="relative w-full h-full overflow-hidden cursor-pointer group"
      style={{ perspective: "800px" }}
      onPointerEnter={enter}
      onPointerLeave={leave}
      onClick={onClick}
    >
      <div
        className="relative w-full h-full transition-transform duration-700"
        style={{ transformStyle: "preserve-3d", transform: f ? "rotateX(-180deg)" : "rotateX(0deg)" }}
      >
        {/* front */}
        <div className="absolute inset-0 bg-neutral-300" style={{ backfaceVisibility: "hidden" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img} alt={name} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        </div>
        {/* back */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-1 md:gap-2 p-2 md:p-4 text-center bg-zinc-950/40 backdrop-blur-2xl text-white"
          style={{ backfaceVisibility: "hidden", transform: "rotateX(180deg)" }}
        >
          <span className="text-white/50 [&_svg]:w-4 [&_svg]:h-4 md:[&_svg]:w-6 md:[&_svg]:h-6">{icon}</span>
          <h3 className="text-xs md:text-base lg:text-lg font-bold leading-tight tracking-tight">{name}</h3>
          <p className="text-[10px] md:text-xs tracking-[0.08em] uppercase text-zinc-400 font-mono">{eng}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Auto-flip hook — only one tile flipped at a time ─── */
function useAutoFlip(intervalMs: number, tileCount: number) {
  const [flipped, setFlipped] = useState<number | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setFlipped((prev) => {
        if (prev !== null) return null; // unflip current
        return Math.floor(Math.random() * tileCount); // flip random
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, tileCount]);

  return flipped;
}

export default function WorkSnapshots() {
  const { t } = useI18n();
  const autoFlip = useAutoFlip(3000, TILES.length);
  const [modal, setModal] = useState<number | null>(null);
  const router = useRouter();

  // Open tile: plugin pages navigate, others open modal
  const openTile = useCallback((i: number) => {
    const slug = TILES[i].slug;
    if (slug === "all-in-one") { router.push("/work/all-in-one-v2"); return; }
    if (slug === "ai-translate") { router.push("/work/ai-translate"); return; }
    setModal(i);
  }, [router]);

  // Compute modal data from project registry
  const modalData = useMemo(() => {
    if (modal === null) return null;
    const tile = TILES[modal];
    const slug = tile.slug;
    if (slug === "all-in-one" || slug === "ai-translate") return null;
    const data = getProjectBySlug(slug);
    const images: string[] = data?.behanceSlices?.length ? data.behanceSlices : [tile.img];
    const nextTile = modal < TILES.length - 1 ? TILES[modal + 1] : null;
    return { tile, images, nextTitle: nextTile?.n };
  }, [modal]);

  return (
    <>
      <section id="work-snapshots" className="min-h-screen w-full bg-black/40 backdrop-blur-[2px] relative z-10 overflow-hidden py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 relative z-10">
          {/* 章节标题 */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-12 md:mb-16"
          >
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-blue-500 tracking-widest">03</span>
              <span className="h-px w-12 bg-zinc-800"></span>
              <span className="font-mono text-xs text-zinc-500 tracking-[0.2em] uppercase">WORK SNAPSHOTS</span>
            </div>
            <span className="font-mono text-[10px] text-zinc-700 tracking-widest hidden md:block">{TILES.length} PROJECTS</span>
          </motion.div>

          {/* 大标题 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 md:mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-black text-zinc-100 tracking-tight leading-[0.9] mb-4">
              FEATURED<span className="text-blue-500">.</span>
              <br />
              <span className="text-zinc-600">PROJECTS</span>
            </h2>
            <p className="text-sm md:text-base text-zinc-500 max-w-xl">
              悬停翻转查看项目，点击浏览完整案例
            </p>
          </motion.div>

          {/* 翻转宫格 - 直接搬首页2的布局 */}
          <div className="tile-grid-wrapper" style={{ containerType: "inline-size" }}>
            {/* Desktop/tablet: 12-col flip tiles */}
            <div className="tile-grid hidden min-[801px]:grid" style={{ gap: 1 }}>
              {TILES.map((tile, i) => (
                <motion.div
                  key={tile.n}
                  variants={fadeUp} initial="hidden" whileInView="visible"
                  viewport={{ once: true, amount: 0.15 }} custom={i * 0.5}
                  className="tile-cell"
                  style={{ "--gc": tile.gc, "--gr": tile.gr } as React.CSSProperties}
                >
                  <FlipTile name={tile.n} eng={tile.e} img={tile.img} icon={tile.icon} forceFlipped={autoFlip === i} onClick={() => openTile(i)} />
                </motion.div>
              ))}
            </div>

            {/* Mobile ≤800px: 6-col grid with all 9 tiles */}
            <div className="tile-grid-mobile min-[801px]:hidden" style={{ gap: 1 }}>
              {TILES.map((tile, i) => (
                <motion.div
                  key={"m-" + tile.n}
                  variants={fadeUp} initial="hidden" whileInView="visible"
                  viewport={{ once: true, amount: 0.15 }} custom={i * 0.5}
                  className="tile-cell-mobile"
                  style={{ "--m-gc": tile.mobileGc, "--m-gr": tile.mobileGr } as React.CSSProperties}
                >
                  <FlipTile name={tile.n} eng={tile.e} img={tile.img} icon={tile.icon} forceFlipped={autoFlip === i} onClick={() => openTile(i)} />
                </motion.div>
              ))}
            </div>

            <style>{`
              @media (min-width: 801px) {
                .tile-grid {
                  grid-template-columns: repeat(12, 1fr);
                  grid-auto-rows: calc(100cqw / 12);
                }
                .tile-cell {
                  grid-column: var(--gc);
                  grid-row: var(--gr);
                  box-shadow: 0 0 0 1px #09090b;
                }
              }
              @media (max-width: 800px) {
                .tile-grid-mobile {
                  display: grid;
                  grid-template-columns: repeat(6, 1fr);
                  grid-auto-rows: calc(100cqw / 8);
                }
                .tile-cell-mobile {
                  grid-column: var(--m-gc);
                  grid-row: var(--m-gr);
                  box-shadow: 0 0 0 1px #09090b;
                }
              }
            `}</style>
          </div>

          {/* 查看全部项目按钮 */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE }}
            className="flex justify-center mt-12 md:mt-16"
          >
            <Link
              href="/work"
              className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full border border-zinc-700 hover:border-white bg-transparent hover:bg-white/5 transition-all duration-300"
            >
              <span className="text-sm md:text-base font-medium text-zinc-200 group-hover:text-white tracking-wide transition-colors">
                {t.work.viewAllProjects}
              </span>
              <svg className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Modal */}
      {modalData && (
        <UniversalModal
          isOpen={true}
          onClose={() => setModal(null)}
          title={modalData.tile.n}
          images={modalData.images}
          hasPrev={modal !== null && modal > 0}
          hasNext={modal !== null && modal < TILES.length - 1}
          onPrev={() => setModal((m) => (m !== null && m > 0 ? m - 1 : m))}
          onNext={() => setModal((m) => (m !== null && m < TILES.length - 1 ? m + 1 : m))}
          projectId={modalData.tile.slug}
          nextTitle={modalData.nextTitle}
        />
      )}
    </>
  );
}
