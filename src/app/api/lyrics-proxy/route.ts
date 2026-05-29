import { NextRequest, NextResponse } from "next/server";

const ALLOWED_ORIGIN = "https://cdn.btbon.cn/music/lyrics/";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url || !url.startsWith(ALLOWED_ORIGIN)) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }
  try {
    const res = await fetch(url);
    if (!res.ok) return NextResponse.json({ error: "Fetch failed" }, { status: res.status });
    const text = await res.text();
    return new NextResponse(text, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}
