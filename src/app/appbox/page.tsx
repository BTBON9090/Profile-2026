"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Globe2,
  Heart,
  LayoutGrid,
  MessageCircle,
  Puzzle,
  Search,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  appBoxProducts,
  type AppBoxProduct,
} from "@/data/appbox";
import FeedbackBoard from "@/components/appbox/feedback-board";

import "./featured-stage.css";

import type { ProductRelease } from "@/lib/product-releases";

type ProductStat = {
  likeCount: number;
  commentCount: number;
  liked: boolean;
};

const catalogGroups = [
  { id: "app", label: "应用", description: "为桌面与手机打造的个人应用。", icon: LayoutGrid },
  { id: "web", label: "在线工具", description: "打开浏览器，直接开始使用。", icon: Globe2 },
  { id: "plugin", label: "插件", description: "在熟悉的工具里，少做一点重复工作。", icon: Puzzle },
  { id: "skill", label: "Skill", description: "可复用的设计方法与思考方式。", icon: Sparkles },
  { id: "game", label: "游戏", description: "工作之外，留一点时间给好玩。", icon: Boxes },
] as const;
const gameIds = new Set(["parking-master", "merge-slime"]);
const productGroup = (product: AppBoxProduct) => gameIds.has(product.id) ? "game" : product.kind;

const kindIcons = {
  app: LayoutGrid,
  web: Globe2,
  plugin: Puzzle,
  skill: Sparkles,
};

// 精选栏目轮播的产品顺序
const FEATURED_IDS = ["launchpad", "aura", "allinone"];

function ProductIcon({ product, large = false }: { product: AppBoxProduct; large?: boolean }) {
  return (
    <span
      className={`appbox-product-icon ${large ? "appbox-product-icon--large" : ""}`}
      data-tone={product.tone}
      data-product={product.id}
      data-has-image={product.icon ? "true" : "false"}
      aria-hidden="true"
    >
      {product.icon ? (
        <Image
          src={product.icon}
          alt=""
          fill
          unoptimized
          loading={large ? "eager" : "lazy"}
          sizes={large ? "160px" : "72px"}
        />
      ) : (
        <span>{product.mark}</span>
      )}
    </span>
  );
}

function FeaturedScene({ product }: { product: AppBoxProduct }) {
  return (
    <div className="appbox-stage__scene" data-product={product.id} aria-hidden="true">
      <div className="appbox-stage__halo" />
      <div className="appbox-stage__floor" />
      {product.id === "launchpad" ? (
        <div className="appbox-stage__launcher">
          <div className="appbox-stage__windowbar"><i /><i /><i /><span>LaunchPad</span></div>
          <div className="appbox-stage__search"><Search size={12} /> 搜索应用</div>
          <div className="appbox-stage__apps">
            {appBoxProducts.filter(p => p.icon && p.id !== "launchpad").slice(0, 8).map((item, index) => (
              <div key={item.id} style={{ animationDelay: `${index * 90}ms` }}>
                <ProductIcon product={item} /><span>{item.name}</span>
              </div>
            ))}
          </div>
          <div className="appbox-stage__pages"><i /><i /><i /></div>
        </div>
      ) : product.id === "aura" ? (
        <div className="appbox-stage__vault">
          <div className="appbox-stage__memory appbox-stage__memory--back"><span>只留给自己</span></div>
          <div className="appbox-stage__memory appbox-stage__memory--front"><span>PRIVATE COLLECTION</span><div className="appbox-stage__silk" /></div>
          <div className="appbox-stage__glass"><ProductIcon product={product} large /><span>你的影像，你的边界。</span></div>
        </div>
      ) : (
        <div className="appbox-stage__commands">
          <div className="appbox-stage__command-head"><ProductIcon product={product} /><span>AllinOne<small>让创作，更进一步</small></span><span className="appbox-stage__shortcut">⌘</span></div>
          <div className="appbox-stage__command"><span className="appbox-stage__symbol">Aa</span><span>多语言翻译<small>让设计跨越语言</small></span><ArrowRight size={15} /></div>
          <div className="appbox-stage__command"><span className="appbox-stage__symbol">✦</span><span>AI 说明书<small>把设计意图说明白</small></span><ArrowRight size={15} /></div>
          <div className="appbox-stage__command"><span className="appbox-stage__symbol">▦</span><span>图层管理<small>把时间留给创作</small></span><ArrowRight size={15} /></div>
        </div>
      )}
      <span className="appbox-stage__caption"><CheckCircle2 size={13} />{product.featureNotes?.[0] ?? product.platform}</span>
    </div>
  );
}

export default function AppBoxPage() {
  const reduceMotion = useReducedMotion();
  const stageRef = useRef<HTMLElement>(null);
  const stageInView = useInView(stageRef, { amount: 0.2 });
  const [motionPaused, setMotionPaused] = useState(false);
  const [stageHovered, setStageHovered] = useState(false);
  const [stageFocused, setStageFocused] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const stagePaused = motionPaused || !!reduceMotion || !stageInView || !pageVisible;
  useEffect(() => {
    const update = () => setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  const [releases, setReleases] = useState<Record<string, ProductRelease>>({});
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/releases", { cache: "no-store", signal: controller.signal }).then(r => r.ok ? r.json() : {}).then(setReleases).catch(() => {});
    return () => controller.abort();
  }, []);
  const [query, setQuery] = useState("");
  const [productStats, setProductStats] = useState<Record<string, ProductStat>>({});
  const searchRef = useRef<HTMLInputElement>(null);
  const featuredProducts = useMemo(
    () => FEATURED_IDS
      .map((id) => appBoxProducts.find((product) => product.id === id))
      .filter((product): product is AppBoxProduct => Boolean(product)),
    [],
  );
  const [featuredIndex, setFeaturedIndex] = useState(0);
  // 手动切换后重置自动轮播计时，避免刚看完就被切走
  const [carouselCycle, setCarouselCycle] = useState(0);
  const featured = featuredProducts[featuredIndex % featuredProducts.length] ?? appBoxProducts[0];

  useEffect(() => {
    if (featuredProducts.length <= 1 || stagePaused || stageHovered || stageFocused) return;
    const timer = window.setInterval(() => {
      setFeaturedIndex((current) => (current + 1) % featuredProducts.length);
    }, 8000);
    return () => window.clearInterval(timer);
  }, [featuredProducts.length, carouselCycle, stagePaused, stageHovered, stageFocused]);

  const showFeatured = (index: number) => {
    setFeaturedIndex(((index % featuredProducts.length) + featuredProducts.length) % featuredProducts.length);
    setCarouselCycle((current) => current + 1);
  };

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  useEffect(() => {
    const visitorId = localStorage.getItem("appbox-feedback-visitor") || crypto.randomUUID();
    localStorage.setItem("appbox-feedback-visitor", visitorId);
    const loadStats = () => {
      fetch(`/api/appbox/stats?visitorId=${encodeURIComponent(visitorId)}`, { cache: "no-store" })
        .then(async (response) => {
          const data = await response.json();
          if (!response.ok) throw new Error(data.error || "互动数据加载失败");
          setProductStats(data.stats ?? {});
        })
        .catch(() => setProductStats({}));
    };
    const handleVisibility = () => {
      if (document.visibilityState === "visible") loadStats();
    };
    loadStats();
    window.addEventListener("focus", loadStats);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.removeEventListener("focus", loadStats);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return appBoxProducts.filter((product) => {
      const searchText = [
        product.name,
        product.subtitle,
        product.description,
        product.platform,
        ...product.tags,
      ]
        .join(" ")
        .toLocaleLowerCase();
      return !normalizedQuery || searchText.includes(normalizedQuery);
    });
  }, [query]);

  return (
    <div className="appbox-page">
      <header className="appbox-hero">
        <div className="appbox-shell">
          <div className="appbox-hero__intro">
            <h1>
              App<span>Box</span>
            </h1>
            <p className="appbox-hero__lead">
              一些解决问题的工具，一些让生活有趣的小玩意。
              应用、插件、Skill 和游戏，都是把想法做出来的尝试。
            </p>
          </div>

          <article
            ref={stageRef}
            className="appbox-stage"
            data-product={featured.id}
            data-paused={stagePaused}
            aria-label="精选产品"
            aria-roledescription="轮播"
            onMouseEnter={() => setStageHovered(true)}
            onMouseLeave={() => setStageHovered(false)}
            onFocusCapture={() => setStageFocused(true)}
            onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setStageFocused(false); }}
          >
            <div className="appbox-stage__topline"><span><i /> 精选作品</span><span>MADE TO BE USED.</span></div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={featured.id}
                className="appbox-stage__slide"
                initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
                transition={{ duration: reduceMotion ? 0 : 0.28 }}
                aria-roledescription="幻灯片"
                aria-label={`${featuredIndex + 1} / ${featuredProducts.length}：${featured.name}`}
              >
                <div className="appbox-stage__copy">
                  <span className="appbox-stage__platform">{featured.platform} <i /> {releases[featured.id]?.version ?? featured.version}</span>
                  <h2>{featured.name}</h2>
                  <h3>{featured.subtitle}</h3>
                  <p>{featured.description}</p>
                  <Link href={`/appbox/${featured.id}`} className="appbox-stage__link">探索 {featured.name}<ArrowRight size={17} /></Link>
                </div>
                <FeaturedScene product={featured} />
              </motion.div>
            </AnimatePresence>
            <div className="appbox-stage__footer">
              <div className="appbox-stage__tabs" aria-label="切换精选产品">
                {featuredProducts.map((product, index) => (
                  <button key={product.id} type="button" aria-pressed={index === featuredIndex % featuredProducts.length} onClick={() => showFeatured(index)}>
                    <span className="appbox-stage__tab-index">0{index + 1}</span><span>{product.name}</span><span className="appbox-stage__tab-line" />
                  </button>
                ))}
              </div>
              <div className="appbox-stage__controls">
                <button type="button" className="appbox-stage__pause" onClick={() => setMotionPaused(value => !value)} aria-pressed={motionPaused} disabled={!!reduceMotion} aria-label={motionPaused ? "播放动效与自动轮播" : "暂停动效与自动轮播"}>{reduceMotion ? "静态浏览" : motionPaused ? "播放" : "暂停"}</button>
                <button type="button" onClick={() => showFeatured(featuredIndex - 1)} aria-label="上一个精选产品"><ChevronLeft size={16} /></button>
                <button type="button" onClick={() => showFeatured(featuredIndex + 1)} aria-label="下一个精选产品"><ChevronRight size={16} /></button>
              </div>
            </div>
          </article>
        </div>
      </header>

      <section className="appbox-catalog" aria-labelledby="appbox-catalog-title">
        <div className="appbox-shell">
          <div className="appbox-catalog__heading">
            <div>
              <h2 id="appbox-catalog-title">发现实用，也发现好玩</h2>
              <p>按类别浏览，或搜索名称、平台与功能。</p>
            </div>
            <span className="appbox-catalog__count">
              {String(visibleProducts.length).padStart(2, "0")} products
            </span>
          </div>

          <div className="appbox-toolbar">
            <nav className="appbox-category-nav" aria-label="产品类别导航">
              <a href="#appbox-catalog-title">全部</a>
              {catalogGroups.filter(group => visibleProducts.some(product => productGroup(product) === group.id)).map(({ id, label, icon: Icon }) => (
                <a key={id} href={`#appbox-${id}`}>
                  <Icon size={16} aria-hidden="true" />{label}
                </a>
              ))}
            </nav>
            <label className="appbox-search">
              <Search size={17} aria-hidden="true" />
              <span className="sr-only">搜索产品</span>
              <input
                ref={searchRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索产品、Skill、平台或功能"
              />
              <kbd>⌘ K</kbd>
            </label>

          </div>

          {visibleProducts.length > 0 ? (
            <div id="appbox-products" className="appbox-groups">
              {catalogGroups.map((group) => {
                const products = visibleProducts.filter(product => productGroup(product) === group.id);
                if (!products.length) return null;
                return (
                  <section key={group.id} id={`appbox-${group.id}`} className="appbox-product-group" aria-labelledby={`appbox-${group.id}-title`}>
                    <header className="appbox-product-group__heading">
                      <h3 id={`appbox-${group.id}-title`}>{group.label}</h3>
                      <p>{group.description}</p>
                    </header>
                    <div className="appbox-grid">
                      {products.map((product, index) => {
                        const KindIcon = gameIds.has(product.id) ? Boxes : kindIcons[product.kind];
                        return (
                          <Link
                            href={`/appbox/${product.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="appbox-card"
                            data-tone={product.tone}
                            key={product.id}
                            aria-label={`阅读 ${product.name} 产品介绍`}
                          >
                            <div className="appbox-card__topline">
                              <span>{String(index + 1).padStart(2, "0")}</span>
                              <span><KindIcon size={13} /> {group.label}</span>
                    </div>
                    <div className="appbox-card__identity">
                      <ProductIcon product={product} />
                      <div>
                        <h4>{product.name}</h4>
                        <p>{product.subtitle}</p>
                      </div>
                    </div>
                    <p className="appbox-card__description">{product.description}</p>
                    <div className="appbox-card__tags">
                      {product.tags.map((tag) => <span key={tag}>{tag}</span>)}
                    </div>
                    <div className="appbox-card__footer">
                      <div className="appbox-card__signals" aria-label={`${product.name} 互动数据`}>
                        <span><Heart size={12} /> {productStats[product.id]?.likeCount ?? 0}</span>
                        <span><MessageCircle size={12} /> {productStats[product.id]?.commentCount ?? 0}</span>
                      </div>
                      <div className="appbox-card__meta">
                        <span>{product.platform}</span>
                        <span>{releases[product.id]?.version ?? product.version}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
                    </div>
                  </section>
                );
              })}
            </div>
          ) : (
            <div className="appbox-empty">
              <Boxes size={28} />
              <h3>暂时没有匹配的产品</h3>
              <p>换一个关键词，或查看全部产品。</p>
              <button type="button" onClick={() => setQuery("")}>
                清除筛选
              </button>
            </div>
          )}

          <section className="appbox-community">
            <header className="appbox-community__header">
              <h2>AppBox 还会有更多新点子。</h2>
              <p>告诉我你希望解决的问题，也可以回复或点赞其他人的建议。</p>
            </header>
            <FeedbackBoard
              scope="appbox"
              title="你希望下一个做什么？"
              description="留下具体需求。其他用户可以补充使用场景，也可以点赞支持。"
            />
          </section>
        </div>
      </section>
    </div>
  );
}
