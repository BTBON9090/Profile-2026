import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { validAnalyticsEvent } from "@/lib/analytics";
import { readAnalytics, recordAnalytics } from "@/lib/analytics-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
let minute = 0;
let requests = 0;

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return new Response(null, { status: 403 });
  if (Number(request.headers.get("content-length")) > 512) return new Response(null, { status: 413 });
  const now = Math.floor(Date.now() / 60_000);
  if (minute !== now) { minute = now; requests = 0; }
  if (++requests > 600) return new Response(null, { status: 429 });
  try {
    const raw = await request.text();
    if (raw.length > 512) return new Response(null, { status: 413 });
    const body = JSON.parse(raw);
    if (!body || Object.keys(body).some(key => key !== "event" && key !== "target") || !validAnalyticsEvent(body.event, body.target)) {
      return NextResponse.json({ error: "Invalid event" }, { status: 400 });
    }
    await recordAnalytics(body.event, body.target);
    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof SyntaxError) return new Response(null, { status: 400 });
    return NextResponse.json({ error: "Statistics storage is not available" }, { status: 503 });
  }
}

export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    const expected = process.env.ANALYTICS_READ_TOKEN;
    const actual = request.headers.get("authorization")?.replace(/^Bearer /, "");
    if (!expected || !actual || Buffer.byteLength(expected) !== Buffer.byteLength(actual) || !timingSafeEqual(Buffer.from(expected), Buffer.from(actual))) {
      return new Response(null, { status: 401 });
    }
  }
  const requested = new URL(request.url).searchParams.get("days") || "7";
  const count = Math.max(1, Math.min(31, Number.parseInt(requested, 10) || 7));
  const days = Array.from({ length: count }, (_, i) => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(Date.now() - i * 86400000)));
  try {
    return NextResponse.json({ unit: "events", days: await readAnalytics(days) }, { headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ error: "Statistics storage is not available" }, { status: 503 }); }
}
