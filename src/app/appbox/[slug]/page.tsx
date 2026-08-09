import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, Download } from "lucide-react";
import FeedbackBoard from "@/components/appbox/feedback-board";
import ScrollReset from "@/components/ui/scroll-reset";
import { appBoxArticles } from "@/data/appbox-articles";
import { appBoxKindLabels, appBoxProducts } from "@/data/appbox";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return appBoxProducts.map((product) => ({ slug: product.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = appBoxProducts.find((item) => item.id === slug);
  if (!product) return {};
  return {
    title: `${product.name} 产品介绍 | AppBox`,
    description: product.description,
  };
}

export default async function AppBoxArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const product = appBoxProducts.find((item) => item.id === slug);
  const article = appBoxArticles[slug];
  if (!product || !article) notFound();

  const articlePath = `/appbox/${product.id}`;
  const detailHref = product.detailsHref
    ? `${product.detailsHref}?from=appbox&returnTo=${encodeURIComponent(articlePath)}`
    : "";
  const isOnlineTool = product.kind === "web";
  const hasPrimaryAction = Boolean(product.actionHref);
  const hasDetailAction = Boolean(detailHref);

  return (
    <div className="app-article-page">
      <ScrollReset />
      <main className="app-article">
        <Link href="/appbox" className="app-article__back">
          <ArrowLeft size={15} /> 返回 AppBox
        </Link>

        <header className="app-article__header">
          <div className="app-article__meta">
            <span>{appBoxKindLabels[product.kind]}</span>
            <span>{product.platform}</span>
            <span>{article.readingTime}</span>
          </div>
          <h1>{product.name}</h1>
          <p className="app-article__subtitle">{product.subtitle}</p>
          <p className="app-article__lead">{article.lead}</p>
          <div className="app-article__actions">
            {!isOnlineTool && hasPrimaryAction && (
              product.actionExternal ? (
                <a href={product.actionHref} target="_blank" rel="noopener noreferrer" className="app-article__primary">
                  <Download size={16} /> {product.actionLabel}
                </a>
              ) : (
                <Link href={product.actionHref} className="app-article__primary">
                  <Download size={16} /> {product.actionLabel}
                </Link>
              )
            )}
            {hasDetailAction && (
              <Link href={detailHref} className={isOnlineTool ? "app-article__primary" : "app-article__secondary"}>
                {isOnlineTool ? "在线打开" : "打开完整专题"}
                {isOnlineTool ? <ArrowUpRight size={15} /> : <ArrowRight size={15} />}
              </Link>
            )}
          </div>
          {article.downloadNote && <p className="app-article__download-note">{article.downloadNote}</p>}
        </header>

        {article.cover ? (
          <figure className="app-article__cover" data-tone={product.tone} data-fit={article.coverFit ?? "cover"}>
            <Image src={article.cover} alt={article.coverAlt ?? product.name} fill unoptimized sizes="(max-width: 900px) 100vw, 900px" priority />
          </figure>
        ) : (
          <div className="app-article__wordmark" data-tone={product.tone} aria-hidden="true">
            <span>{product.mark ?? product.name.slice(0, 2)}</span>
          </div>
        )}

        <article className="app-article__body">
          {article.sections.map((section) => (
            <section key={section.title}>
              <h2>{section.title}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.points && (
                <ul>
                  {section.points.map((point) => <li key={point}>{point}</li>)}
                </ul>
              )}
              {section.image && (
                <figure>
                  <span className="app-article__inline-image" data-fit={section.imageFit ?? "cover"}>
                    <Image src={section.image} alt={section.imageAlt ?? section.title} fill unoptimized sizes="(max-width: 900px) 100vw, 760px" />
                  </span>
                  {section.caption && <figcaption>{section.caption}</figcaption>}
                </figure>
              )}
            </section>
          ))}
        </article>

        {(hasPrimaryAction || hasDetailAction) && (
          <aside className="app-article__end-actions">
            <div>
              <h2>准备好使用了吗？</h2>
              <p>可以直接获取产品，也可以继续查看完整的交互专题。</p>
            </div>
            <div>
              {!isOnlineTool && product.actionExternal && hasPrimaryAction && (
                <a href={product.actionHref} target="_blank" rel="noopener noreferrer" className="app-article__primary">
                  {product.actionLabel} <ArrowUpRight size={15} />
                </a>
              )}
              {hasDetailAction && (
                <Link href={detailHref} className="app-article__secondary">
                  {isOnlineTool ? "在线打开" : "打开完整专题"} <ArrowRight size={15} />
                </Link>
              )}
            </div>
          </aside>
        )}

        <FeedbackBoard
          scope={`product:${product.id}`}
          title={`${product.name} 留言板`}
          description="记录使用问题、功能建议和改进意见。其他用户可以回复，也可以通过点赞表达同样的需求。"
        />
      </main>
    </div>
  );
}
