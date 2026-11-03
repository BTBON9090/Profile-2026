"use client";
import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import type { AppBoxProduct } from "@/data/appbox";
import type { ProductRelease } from "@/lib/product-releases";

export default function DownloadButton({ product }: { product: AppBoxProduct }) {
  const [release, setRelease] = useState<ProductRelease>({ version: product.version, downloadUrl: product.actionHref });
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/releases", { cache: "no-store", signal: controller.signal })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.[product.id]) setRelease(data[product.id]); })
      .catch(() => {});
    return () => controller.abort();
  }, [product.id]);
  return <a href={release.downloadUrl} className="app-article__primary">
    <Download size={16} /> {product.actionLabel}{product.kind !== "skill" && <> · {/^v/i.test(release.version) ? release.version : `v${release.version}`}</>}
  </a>;
}
