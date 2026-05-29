import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const { lrcPath, content } = await req.json();

    if (!lrcPath || typeof lrcPath !== "string" || !content || typeof content !== "string") {
      return NextResponse.json({ error: "缺少 lrcPath 或 content" }, { status: 400 });
    }

    if (!lrcPath.startsWith("/music/lyrics/") || !lrcPath.endsWith(".lrc")) {
      return NextResponse.json({ error: "非法路径" }, { status: 403 });
    }

    const resolved = lrcPath.replace(/\.\./g, "");
    const filePath = path.join(process.cwd(), "public", resolved);

    await writeFile(filePath, content, "utf-8");

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Lyrics API Error:", error);
    return NextResponse.json({ error: "写入失败" }, { status: 500 });
  }
}
