"use client";

import { Heart, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

type ProductStat = {
  likeCount: number;
  commentCount: number;
  liked: boolean;
};

const emptyStat: ProductStat = { likeCount: 0, commentCount: 0, liked: false };

export default function ProductLikeButton({ productId }: { productId: string }) {
  const [visitorId, setVisitorId] = useState("");
  const [stat, setStat] = useState<ProductStat>(emptyStat);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("appbox-feedback-visitor") || crypto.randomUUID();
    localStorage.setItem("appbox-feedback-visitor", id);
    setVisitorId(id);
    const loadStat = () => {
      fetch(`/api/appbox/stats?productId=${encodeURIComponent(productId)}&visitorId=${encodeURIComponent(id)}`, { cache: "no-store" })
        .then(async (response) => {
          const data = await response.json();
          if (!response.ok) throw new Error(data.error || "认可数据加载失败");
          setStat(data.stats?.[productId] ?? emptyStat);
        })
        .catch((reason) => setError(reason instanceof Error ? reason.message : "认可数据加载失败"))
        .finally(() => setLoading(false));
    };
    const handleFeedbackUpdated = (event: Event) => {
      const detail = (event as CustomEvent<{ scope?: string }>).detail;
      if (detail?.scope === `product:${productId}`) loadStat();
    };
    loadStat();
    window.addEventListener("appbox-feedback-updated", handleFeedbackUpdated);
    return () => window.removeEventListener("appbox-feedback-updated", handleFeedbackUpdated);
  }, [productId]);

  const toggleLike = async () => {
    if (!visitorId || saving) return;
    const previous = stat;
    const optimistic = {
      ...stat,
      liked: !stat.liked,
      likeCount: Math.max(0, stat.likeCount + (stat.liked ? -1 : 1)),
    };
    setStat(optimistic);
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/appbox/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, visitorId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "认可保存失败");
      setStat(data.stat);
    } catch (reason) {
      setStat(previous);
      setError(reason instanceof Error ? reason.message : "认可保存失败");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="app-article__approval" aria-label="产品认可">
      <button type="button" aria-pressed={stat.liked} onClick={() => void toggleLike()} disabled={loading || saving}>
        <span className="app-article__approval-icon"><Heart fill={stat.liked ? "currentColor" : "none"} /></span>
        <span className="app-article__approval-copy">
          <b>{stat.liked ? "感谢你的认可" : "认可这个产品"}</b>
          <small>{stat.liked ? "你的认可已经记录" : "如果它对你有帮助，可以点一下"}</small>
        </span>
        <strong>{loading ? "-" : stat.likeCount}</strong>
      </button>
      <span className="app-article__approval-comments"><MessageCircle size={15} /> {stat.commentCount} 条留言</span>
      {error && <p role="alert">{error}</p>}
    </section>
  );
}
