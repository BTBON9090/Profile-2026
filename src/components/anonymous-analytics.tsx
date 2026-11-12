"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { appBoxProducts } from "@/data/appbox";
import { analyticsPages, trackAnonymousEvent } from "@/lib/analytics";

const onlineRoutes: Record<string, string> = {
  "/work/block-wall": "block-wall", "/tools/lyrics-skyline": "lyrics-skyline", "/tools/offer-guard": "offer-guard",
};

export default function AnonymousAnalytics() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);
  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    if (analyticsPages.has(pathname)) trackAnonymousEvent("page_view", pathname);
    if (onlineRoutes[pathname]) trackAnonymousEvent("product_open", onlineRoutes[pathname]);
  }, [pathname]);

  useEffect(() => {
    const trackClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button > 0) return;
      const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const url = new URL(anchor.href, location.origin);
      const product = appBoxProducts.find(item => item.id === anchor.dataset.productAction) || appBoxProducts.find(item => {
        const action = new URL(item.actionHref, location.origin);
        return action.origin === url.origin && action.pathname === url.pathname;
      });
      if (!product) return;
      if (/\.(?:dmg|apk|exe|msi|zip|bin|eagleplugin)$/i.test(url.pathname)) trackAnonymousEvent("download", product.id);
      else if (url.origin !== location.origin) trackAnonymousEvent("product_open", product.id);
      // Same-origin web tools and standalone games record an open when their page loads.
    };
    document.addEventListener("click", trackClick);
    return () => document.removeEventListener("click", trackClick);
  }, []);
  return null;
}
