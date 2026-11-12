import { appBoxProducts } from "@/data/appbox";

export type AnalyticsEvent = "page_view" | "download" | "product_open";
export const analyticsProducts = new Set(appBoxProducts.map(product => product.id));
export const analyticsPages = new Set([
  "/", "/work", "/appbox", "/work/all-in-one", "/work/all-in-one-v2",
  "/work/ai-translate", "/work/aura", "/work/launchpad", "/work/block-wall",
  "/tools/lyrics-skyline", "/tools/offer-guard", "/parking-master/index.html",
  "/merge-slime/index.html", ...appBoxProducts.map(product => `/appbox/${product.id}`),
  ...["snow-ecosystem", "light-branding", "enterplorer", "avic", "kwai-magnetic-star", "amazeui", "studio", "others", "snownewtab", "snowspace"].map(slug => `/work/${slug}`),
]);

export function validAnalyticsEvent(event: unknown, target: unknown): event is AnalyticsEvent {
  if (typeof target !== "string") return false;
  if (event === "page_view") return analyticsPages.has(target);
  return (event === "download" || event === "product_open") && analyticsProducts.has(target);
}

export function trackAnonymousEvent(event: AnalyticsEvent, target: string) {
  if (!validAnalyticsEvent(event, target)) return;
  // Deliberately omit credentials, query strings, referrers and visitor identifiers.
  void fetch("/api/analytics", {
    method: "POST", credentials: "omit", referrerPolicy: "no-referrer", keepalive: true,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, target }),
  }).catch(() => {});
}
