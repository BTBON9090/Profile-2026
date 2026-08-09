import { NextResponse } from "next/server";
import { appBoxProducts } from "@/data/appbox";
import { listProductStats, toggleProductLike } from "@/lib/feedback-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const productIds = appBoxProducts.map((product) => product.id);
const productIdSet = new Set(productIds);
const VISITOR_PATTERN = /^[a-zA-Z0-9-]{8,80}$/;
const rateBuckets = new Map<string, number[]>();

function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function isRateLimited(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const key = forwarded || request.headers.get("x-real-ip") || "local";
  const now = Date.now();
  const recent = (rateBuckets.get(key) ?? []).filter((time) => now - time < 60_000);
  if (recent.length >= 40) return true;
  recent.push(now);
  rateBuckets.set(key, recent);
  return false;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const visitorId = cleanText(url.searchParams.get("visitorId"), 80) || undefined;
  const requestedProductId = cleanText(url.searchParams.get("productId"), 60);
  const requestedIds = requestedProductId && productIdSet.has(requestedProductId)
    ? [requestedProductId]
    : productIds;
  const stats = await listProductStats(requestedIds, visitorId);
  return NextResponse.json({ stats }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  if (isRateLimited(request)) {
    return NextResponse.json({ error: "操作太频繁，请稍后再试" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const productId = cleanText(body.productId, 60);
    const visitorId = cleanText(body.visitorId, 80);
    if (!productIdSet.has(productId) || !VISITOR_PATTERN.test(visitorId)) {
      return NextResponse.json({ error: "无法识别本次认可" }, { status: 400 });
    }
    const stat = await toggleProductLike({ productId, visitorId });
    return NextResponse.json({ stat });
  } catch (error) {
    const message = error instanceof Error ? error.message : "认可保存失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
