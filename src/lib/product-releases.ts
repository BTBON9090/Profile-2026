import { appBoxProducts } from "@/data/appbox";

export type ProductRelease = { version: string; downloadUrl: string };
export const releaseManifests: Record<string, string> = {
  "ai-translate": "https://ai-translate-release-1317980685.cos.ap-shanghai.myqcloud.com/update_manifest.json",
  launchpad: "https://lightapp-1317980685.cos.ap-shanghai.myqcloud.com/launchpad/latest.json",
  aura: "https://mobileapp-1317980685.cos.ap-shanghai.myqcloud.com/aura/update_manifest.json",
  eaglecp: "https://lightapp-1317980685.cos.ap-shanghai.myqcloud.com/EagleCP/update_manifest.json",
};

// Keep the version and URL together. A failed manifest falls back to a verified release.
export async function getProductReleases(): Promise<Record<string, ProductRelease>> {
  return Object.fromEntries(await Promise.all(appBoxProducts.filter(p => p.kind !== "web").map(async product => {
    let release = { version: product.version, downloadUrl: product.actionHref };
    const manifestUrl = releaseManifests[product.id];
    if (manifestUrl) {
      try {
        const response = await fetch(manifestUrl, { cache: "no-store", signal: AbortSignal.timeout(5000) });
        if (!response.ok) throw new Error("Release unavailable");
        const data = await response.json();
        const url = new URL(data.versionedUrl || data.downloadUrl);
        const source = new URL(manifestUrl);
        if (!/^\d+\.\d+\.\d+(?:[-+][\w.-]+)?$/.test(data.version) || url.origin !== source.origin || !url.pathname.startsWith(source.pathname.slice(0, source.pathname.lastIndexOf("/") + 1))) throw new Error("Invalid release");
        // Cache-bust mutable installer names, preserving the manifest's version pairing.
        url.searchParams.set("version", data.version);
        release = { version: data.version, downloadUrl: url.href };
      } catch { /* A verified fallback remains usable during COS outages. */ }
    }
    return [product.id, release];
  })));
}
