"use client";
import { useRef, useState, type PointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { appBoxProducts } from "@/data/appbox";
import { appBoxArticles } from "@/data/appbox-articles";
import "./ai-plugins-carousel.css";

const groups = [
  { title: "生产力工具", ids: ["allinone", "ai-translate"] },
  { title: "个人应用", ids: ["aura", "launchpad"] },
  { title: "游戏", ids: ["parking-master", "merge-slime"] },
];
const products = groups.flatMap(group => group.ids.map(id => appBoxProducts.find(product => product.id === id))).filter((product): product is (typeof appBoxProducts)[number] => Boolean(product));

export default function AIPlugins() {
  const stripRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ startX: 0, startScroll: 0, pointerId: -1, moved: false });
  const [active, setActive] = useState(0);

  const goTo = (index: number, focusCard = false) => {
    const strip = stripRef.current;
    const items = strip?.querySelectorAll<HTMLElement>("[data-product-card]");
    const target = items?.[Math.max(0, Math.min(index, products.length - 1))];
    if (!strip || !items?.[0] || !target) return;
    if (focusCard) target.focus({ preventScroll: true });
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    strip.scrollTo({ left: target.offsetLeft - items[0].offsetLeft, behavior: reduced ? "instant" : "smooth" });
  };

  const updateActive = () => {
    const strip = stripRef.current;
    if (!strip) return;
    const items = Array.from(strip.querySelectorAll<HTMLElement>("[data-product-card]"));
    if (!items.length) return;
    const firstLeft = items[0].offsetLeft;
    const nearest = items.reduce((best, item, index) => Math.abs(item.offsetLeft - firstLeft - strip.scrollLeft) < Math.abs(items[best].offsetLeft - firstLeft - strip.scrollLeft) ? index : best, 0);
    setActive(nearest);
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragRef.current.moved = false;
    if (event.pointerType === "touch" || event.button !== 0) return;
    dragRef.current = { startX: event.clientX, startScroll: event.currentTarget.scrollLeft, pointerId: event.pointerId, moved: false };
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (drag.pointerId !== event.pointerId) return;
    const distance = event.clientX - drag.startX;
    if (!drag.moved && Math.abs(distance) > 6) {
      drag.moved = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      event.currentTarget.dataset.dragging = "true";
    }
    if (drag.moved) {
      event.preventDefault();
      event.currentTarget.scrollLeft = drag.startScroll - distance;
    }
  };
  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (dragRef.current.pointerId !== event.pointerId) return;
    dragRef.current.pointerId = -1;
    delete event.currentTarget.dataset.dragging;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return (
    <section id="ai-plugins" className="product-carousel-section w-full bg-black/40 relative z-10 py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="flex items-center gap-4 mb-12 md:mb-16"><span className="font-mono text-xs text-blue-500 tracking-widest">05</span><span className="h-px w-12 bg-zinc-800"/><span className="font-mono text-xs text-zinc-500 tracking-[0.2em] uppercase">VIBE CODING</span></div>
        <h2 className="text-4xl md:text-6xl font-black text-zinc-100 tracking-tight mb-4">从想法到产品<span className="text-blue-500">.</span></h2>
        <p className="text-zinc-500 mb-10">用设计与 Vibe Coding，探索工作和生活中的小问题。</p>
        <div className="product-carousel__toolbar">
          <div className="product-carousel__groups" aria-label="产品分类">
            {groups.map((group, index) => <button type="button" key={group.title} onClick={() => goTo(index * 2)} aria-pressed={Math.floor(active / 2) === index}>{group.title}</button>)}
          </div>

        </div>
        <div className="product-carousel__viewport">
          <button className="product-carousel__arrow product-carousel__arrow--previous" type="button" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="上一个产品"><ArrowLeft size={18}/></button>
          <button className="product-carousel__arrow product-carousel__arrow--next" type="button" onClick={() => goTo(active + 1)} disabled={active === products.length - 1} aria-label="下一个产品"><ArrowRight size={18}/></button>
          <span className="sr-only" aria-live="polite">当前产品：{products[active]?.name}</span>
        <div ref={stripRef} className="product-carousel__strip" role="region" aria-label="产品列表，可左右滚动" tabIndex={0} onScroll={updateActive} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={endDrag} onPointerCancel={(event) => { endDrag(event); dragRef.current.moved = false; }} onPointerLeave={(event) => { if (!dragRef.current.moved) endDrag(event); }} onDragStart={(event) => event.preventDefault()} onKeyDown={(event) => { if (!event.altKey && !event.ctrlKey && !event.metaKey && (event.key === "ArrowRight" || event.key === "ArrowLeft")) { event.preventDefault(); const cards = Array.from(event.currentTarget.querySelectorAll<HTMLElement>("[data-product-card]")); const focusedIndex = cards.findIndex(card => card.contains(event.target as Node)); goTo((focusedIndex >= 0 ? focusedIndex : active) + (event.key === "ArrowRight" ? 1 : -1), true); } }} onClickCapture={(event) => { if (dragRef.current.moved && event.detail !== 0) { event.preventDefault(); event.stopPropagation(); dragRef.current.moved = false; } }}>
          {products.map((product) => {
            const article = appBoxArticles[product.id];
            const useCover = product.id === "allinone" || product.id === "ai-translate";
            const image = useCover ? article?.cover : product.icon;
            return <Link data-product-card key={product.id} href={product.detailsHref} className={`product-carousel__card product-carousel__card--${product.id}`} draggable={false}>
              <div className={`product-carousel__art ${useCover ? "is-cover" : "is-icon"}`}>{image && <Image src={image} alt="" fill unoptimized draggable={false} sizes="(max-width: 640px) 78vw, 420px" className="product-carousel__image"/>}<span className="product-carousel__art-platform">{product.platform}</span></div>
              <div className="product-carousel__body"><div className="product-carousel__title"><h3>{product.name}</h3><ArrowUpRight size={19} aria-hidden="true"/></div><p>{product.description}</p></div>
            </Link>;
          })}
          <div className="product-carousel__end" aria-hidden="true" />
        </div>
        </div>
      </div>
    </section>
  );
}
