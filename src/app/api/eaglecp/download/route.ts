import { createHash, createHmac } from "crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// EagleCP（Eagle Image Studio）安装包目录：始终重定向到该目录下最新上传的安装包，
// 新版本只需上传到 COS，无需改动代码。
// 安装包固定托管在 lightapp 桶（与 LaunchPad 下载同桶），不复用 feedback 的 COS_BUCKET。
const EAGLECP_BUCKET = "lightapp-1317980685";
const EAGLECP_REGION = "ap-shanghai";
const PREFIX = "EagleCP/";
const INSTALLER_EXTENSIONS = [".eagleplugin", ".zip", ".dmg", ".pkg", ".exe", ".msi"];

type CosConfig = {
  SecretId: string;
  SecretKey: string;
  Bucket: string;
  Region: string;
};

function getCosConfig(): CosConfig | null {
  const SecretId = process.env.COS_SECRET_ID;
  const SecretKey = process.env.COS_SECRET_KEY;
  const Bucket = process.env.COS_BUCKET;
  const Region = process.env.COS_REGION;
  if (!SecretId || !SecretKey || !Bucket || !Region) return null;
  return { SecretId, SecretKey, Bucket, Region };
}

// 与 feedback-store 相同的自签名逻辑，额外把 URL 查询参数纳入签名
function cosAuthorization(
  config: CosConfig,
  method: string,
  pathName: string,
  host: string,
  params: Record<string, string>,
) {
  const paramKeys = Object.keys(params).sort();
  const httpParameters = paramKeys
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join("&");
  const now = Math.floor(Date.now() / 1000);
  const keyTime = `${now - 60};${now + 600}`;
  const signKey = createHmac("sha1", config.SecretKey).update(keyTime).digest("hex");
  const httpString = `${method.toLowerCase()}\n${pathName}\n${httpParameters}\nhost=${host}\n`;
  const stringToSign = `sha1\n${keyTime}\n${createHash("sha1").update(httpString).digest("hex")}\n`;
  const signature = createHmac("sha1", signKey).update(stringToSign).digest("hex");
  return `q-sign-algorithm=sha1&q-ak=${config.SecretId}&q-sign-time=${keyTime}&q-key-time=${keyTime}&q-header-list=host&q-url-param-list=${paramKeys.join(";")}&q-signature=${signature}`;
}

type CosObject = { Key: string; LastModified: string; Size: string };

async function listInstallers(config: CosConfig): Promise<CosObject[]> {
  const host = `${EAGLECP_BUCKET}.cos.${EAGLECP_REGION}.myqcloud.com`;
  const params = { prefix: PREFIX, "max-keys": "200" };
  const query = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");
  const response = await fetch(`https://${host}/?${query}`, {
    headers: {
      Host: host,
      Authorization: cosAuthorization(config, "GET", "/", host, params),
    },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`COS 列表响应 ${response.status}`);
  const xml = await response.text();
  const contents = xml.match(/<Contents>[\s\S]*?<\/Contents>/g) ?? [];
  return contents
    .map((block) => ({
      Key: block.match(/<Key>([^<]*)<\/Key>/)?.[1] ?? "",
      LastModified: block.match(/<LastModified>([^<]*)<\/LastModified>/)?.[1] ?? "",
      Size: block.match(/<Size>([^<]*)<\/Size>/)?.[1] ?? "0",
    }))
    .filter((item) => {
      const lowerKey = item.Key.toLowerCase();
      return Number(item.Size) > 0 && INSTALLER_EXTENSIONS.some((ext) => lowerKey.endsWith(ext));
    });
}

export async function GET() {
  const config = getCosConfig();
  if (!config) {
    return NextResponse.json({ error: "下载服务未配置，请稍后再试" }, { status: 503 });
  }

  let installers: CosObject[];
  try {
    installers = await listInstallers(config);
  } catch (error) {
    console.error("[eaglecp-download] 获取安装包列表失败", error);
    return NextResponse.json({ error: "下载服务暂时不可用，请稍后再试" }, { status: 502 });
  }

  if (installers.length === 0) {
    return new NextResponse(
      "<!doctype html><meta charset=\"utf-8\"><title>Eagle Image Studio</title>" +
        "<body style=\"font-family:sans-serif;display:grid;place-items:center;min-height:100vh;margin:0;background:#f6f7fb;color:#1c2130\">" +
        "<div style=\"text-align:center\"><h1 style=\"font-size:1.2rem\">安装包尚未发布</h1>" +
        "<p style=\"color:#6b7280;font-size:0.9rem\">请稍后再试，或在留言板反馈。</p></div></body>",
      { status: 404, headers: { "content-type": "text/html; charset=utf-8" } },
    );
  }

  const latest = installers.sort(
    (a, b) => new Date(b.LastModified).getTime() - new Date(a.LastModified).getTime(),
  )[0];
  const host = `${EAGLECP_BUCKET}.cos.${EAGLECP_REGION}.myqcloud.com`;
  const encodedKey = latest.Key.split("/").map(encodeURIComponent).join("/");
  const target = `https://${host}/${encodedKey}`;

  const redirect = NextResponse.redirect(target, 302);
  redirect.headers.set("cache-control", "no-store");
  return redirect;
}
