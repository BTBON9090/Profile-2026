import { NextResponse } from "next/server";
import {
  createFeedback,
  deleteFeedback,
  listFeedback,
  toggleFeedbackLike,
} from "@/lib/feedback-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SCOPE_PATTERN = /^(appbox|product:[a-z0-9-]{1,60})$/;
const VISITOR_PATTERN = /^[a-zA-Z0-9-]{8,80}$/;
const rateBuckets = new Map<string, number[]>();

function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().replace(/\s{3,}/g, "  ").slice(0, maxLength) : "";
}

function createGuestName() {
  const names = ["晨雾旅人", "星野山雀", "海盐水獭", "青柠小鹿", "松果访客", "云朵探索者"];
  const suffix = Math.floor(Math.random() * 100).toString().padStart(2, "0");
  return `${names[Math.floor(Math.random() * names.length)]}${suffix}`;
}

function isRateLimited(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const key = forwarded || request.headers.get("x-real-ip") || "local";
  const now = Date.now();
  const recent = (rateBuckets.get(key) ?? []).filter((time) => now - time < 60_000);
  if (recent.length >= 30) return true;
  recent.push(now);
  rateBuckets.set(key, recent);
  return false;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const scope = url.searchParams.get("scope") ?? "";
  const visitorId = url.searchParams.get("visitorId") ?? undefined;
  if (!SCOPE_PATTERN.test(scope)) {
    return NextResponse.json({ error: "无效的留言板范围" }, { status: 400 });
  }
  try {
    const entries = await listFeedback(scope, visitorId);
    return NextResponse.json({ entries }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "留言加载失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (isRateLimited(request)) {
    return NextResponse.json({ error: "操作太频繁，请稍后再试" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const scope = cleanText(body.scope, 80);
    if (!SCOPE_PATTERN.test(scope)) {
      return NextResponse.json({ error: "无效的留言板范围" }, { status: 400 });
    }

    if (body.action === "toggle-like") {
      const id = cleanText(body.id, 80);
      const visitorId = cleanText(body.visitorId, 80);
      if (!id || !VISITOR_PATTERN.test(visitorId)) {
        return NextResponse.json({ error: "无法识别本次点赞" }, { status: 400 });
      }
      const entry = await toggleFeedbackLike({ scope, id, visitorId });
      return NextResponse.json({ entry });
    }

    if (body.action === "delete") {
      const id = cleanText(body.id, 80);
      const visitorId = cleanText(body.visitorId, 80);
      if (!id || !VISITOR_PATTERN.test(visitorId)) {
        return NextResponse.json({ error: "无法识别本次操作" }, { status: 400 });
      }
      try {
        await deleteFeedback({ scope, id, visitorId });
        return NextResponse.json({ ok: true });
      } catch (error) {
        const message = error instanceof Error ? error.message : "留言删除失败";
        const status = message === "只能撤回自己的留言" ? 403 : 500;
        return NextResponse.json({ error: message }, { status });
      }
    }

    if (cleanText(body.website, 120)) {
      return NextResponse.json({ error: "提交失败" }, { status: 400 });
    }
    const author = cleanText(body.author, 24) || createGuestName();
    const content = cleanText(body.content, 800);
    const parentId = cleanText(body.parentId, 80) || null;
    if (content.length < 2) {
      return NextResponse.json({ error: "请填写至少两个字的留言" }, { status: 400 });
    }
    const rawVisitorId = cleanText(body.visitorId, 80);
    const visitorId = VISITOR_PATTERN.test(rawVisitorId) ? rawVisitorId : undefined;
    const entry = await createFeedback({ scope, parentId, author, content, visitorId });
    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "留言保存失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
