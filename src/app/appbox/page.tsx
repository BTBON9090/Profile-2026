"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  Download,
  Globe2,
  PackageOpen,
  Plug,
  Search,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  appBoxKindLabels,
  appBoxProducts,
  type AppBoxKind,
  type AppBoxProduct,
} from "@/data/appbox";
import FeedbackBoard from "@/components/appbox/feedback-board";

type Filter = "all" | AppBoxKind;

const filters: { value: Filter; label: string; icon?: typeof Download }[] = [
  { value: "all", label: "全部" },
  { value: "app", label: "应用", icon: Download },
  { value: "web", label: "在线工具", icon: Globe2 },
  { value: "plugin", label: "插件", icon: Plug },
];

const kindIcons = {
  app: Download,
  web: Globe2,
  plugin: Plug,
};

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

export default function AppBoxPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const searchRef = useRef<HTMLInputElement>(null);
  const featured = appBoxProducts.find((product) => product.featured) ?? appBoxProducts[0];

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

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return appBoxProducts.filter((product) => {
      const matchesKind = filter === "all" || product.kind === filter;
      const searchText = [
        product.name,
        product.subtitle,
        product.description,
        product.platform,
        ...product.tags,
      ]
        .join(" ")
        .toLocaleLowerCase();
      return matchesKind && (!normalizedQuery || searchText.includes(normalizedQuery));
    });
  }, [filter, query]);

  return (
    <div className="appbox-page">
      <header className="appbox-hero">
        <div className="appbox-shell">
          <div className="appbox-hero__intro">
            <p className="appbox-kicker">
              <span><Sparkles size={13} /></span>
              Independent software · Made in Beijing
            </p>
            <h1>
              APP<span>BOX</span>
            </h1>
            <p className="appbox-hero__lead">
              这里汇集我为真实工作与日常需求构建的应用、插件和在线工具，
              帮助用户提升效率、保护隐私，并更顺畅地完成专业任务。
            </p>
          </div>

          <div className="appbox-distribution" aria-label="AppBox 支持的产品类型">
            <div>
              <Download size={17} />
              <span><b>下载使用</b><small>macOS / Android</small></span>
            </div>
            <div>
              <Globe2 size={17} />
              <span><b>在线打开</b><small>Web tools</small></span>
            </div>
            <div>
              <Plug size={17} />
              <span><b>安装插件</b><small>Figma / Chrome</small></span>
            </div>
          </div>

          <article className="appbox-feature" data-tone={featured.tone}>
            <div className="appbox-feature__copy">
              <span className="appbox-feature__eyebrow">
                <span>FEATURED DROP</span>
                <span>01 / {String(appBoxProducts.length).padStart(2, "0")}</span>
              </span>
              <ProductIcon product={featured} large />
              <div>
                <p>{featured.platform} · {featured.version}</p>
                <h2>{featured.name}</h2>
                <h3>{featured.subtitle}</h3>
              </div>
              <p className="appbox-feature__description">{featured.description}</p>
              <div className="appbox-feature__actions">
                <Link
                  href={`/appbox/${featured.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="appbox-button appbox-button--primary"
                >
                  阅读产品介绍 <ArrowRight size={14} />
                </Link>
              </div>
            </div>
            <div className="appbox-feature__visual" aria-hidden="true">
              <div className="appbox-orbit appbox-orbit--one" />
              <div className="appbox-orbit appbox-orbit--two" />
              <ProductIcon product={featured} large />
              <span className="appbox-feature__note appbox-feature__note--top">
                <CheckCircle2 size={13} /> Native SwiftUI
              </span>
              <span className="appbox-feature__note appbox-feature__note--bottom">
                <PackageOpen size={13} /> Ready to download
              </span>
            </div>
          </article>
        </div>
      </header>

      <main className="appbox-catalog">
        <div className="appbox-shell">
          <div className="appbox-catalog__heading">
            <div>
              <span className="appbox-section-index">02 / CATALOG</span>
              <h2>找到适合你的工具</h2>
              <p>按获取方式筛选，也可以直接搜索名称、平台或功能。</p>
            </div>
            <span className="appbox-catalog__count">
              {String(visibleProducts.length).padStart(2, "0")} products
            </span>
          </div>

          <div className="appbox-toolbar">
            <label className="appbox-search">
              <Search size={17} aria-hidden="true" />
              <span className="sr-only">搜索产品</span>
              <input
                ref={searchRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索应用、平台或功能"
              />
              <kbd>⌘ K</kbd>
            </label>
            <div className="appbox-filters" role="group" aria-label="按产品类型筛选">
              {filters.map((item) => {
                const Icon = item.icon;
                const count = item.value === "all"
                  ? appBoxProducts.length
                  : appBoxProducts.filter((product) => product.kind === item.value).length;
                return (
                  <button
                    key={item.value}
                    type="button"
                    aria-pressed={filter === item.value}
                    onClick={() => setFilter(item.value)}
                  >
                    {Icon && <Icon size={14} aria-hidden="true" />}
                    {item.label}<sup>{count}</sup>
                  </button>
                );
              })}
            </div>
          </div>

          {visibleProducts.length > 0 ? (
            <div className="appbox-grid">
              {visibleProducts.map((product, index) => {
                const KindIcon = kindIcons[product.kind];
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
                      <span><KindIcon size={13} /> {appBoxKindLabels[product.kind]}</span>
                    </div>
                    <div className="appbox-card__identity">
                      <ProductIcon product={product} />
                      <div>
                        <h3>{product.name}</h3>
                        <p>{product.subtitle}</p>
                      </div>
                    </div>
                    <p className="appbox-card__description">{product.description}</p>
                    <div className="appbox-card__tags">
                      {product.tags.map((tag) => <span key={tag}>{tag}</span>)}
                    </div>
                    <div className="appbox-card__footer">
                      <div className="appbox-card__meta">
                        <span>{product.platform}</span>
                        <span>{product.version}</span>
                      </div>
                      <div className="appbox-card__open">
                        阅读介绍 <ArrowRight size={14} />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="appbox-empty">
              <Boxes size={28} />
              <h3>暂时没有匹配的工具</h3>
              <p>换一个关键词，或查看全部产品。</p>
              <button type="button" onClick={() => { setQuery(""); setFilter("all"); }}>
                清除筛选
              </button>
            </div>
          )}

          <section className="appbox-community">
            <header className="appbox-community__header">
              <h2>AppBox 还会继续增加新工具。</h2>
              <p>告诉我你希望解决的问题，也可以回复或点赞其他人的建议。</p>
            </header>
            <FeedbackBoard
              scope="appbox"
              title="你希望新增什么工具？"
              description="留下具体需求。其他用户可以补充使用场景，也可以点赞支持。"
            />
          </section>
        </div>
      </main>
    </div>
  );
}
