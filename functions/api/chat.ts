import { buildCopilotPrompt, sanitizeChatMessages } from "../../src/lib/copilot-prompt";

async function chat(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const messages = sanitizeChatMessages(body.messages);
    if (!messages) return Response.json({ error: "问题内容无效或过长" }, { status: 400 });
    if (!process.env.DEEPSEEK_API_KEY) return Response.json({ error: "AI 助手暂不可用，请稍后再试。" }, { status: 503 });
    const projectId = typeof body.projectId === "string" && /^[a-z0-9-]{1,80}$/.test(body.projectId) ? body.projectId : undefined;
    let context = "";
    if (projectId) {
      try {
        const result = await fetch(`https://cdn.btbon.cn/md/${projectId}.md`, { signal: AbortSignal.timeout(5000) });
        if (result.ok) context = await result.text();
      } catch { /* Missing background must not prevent general answers. */ }
    }
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}` },
      body: JSON.stringify({ model: "deepseek-v4-pro", messages: [{ role: "system", content: buildCopilotPrompt(context, projectId) }, ...messages], stream: true }),
      signal: req.signal,
    });
    if (!response.ok) return Response.json({ error: "AI 模型暂时不可用，请稍后重试。" }, { status: 502 });
    return new Response(response.body, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" } });
  } catch {
    return Response.json({ error: "请求未完成，请稍后重试。" }, { status: 500 });
  }
}
export const config = { runtime: "edge" };
export default async function handler(req: Request) {
  if (req.method !== "POST") return new Response(null, { status: 405, headers: { Allow: "POST" } });
  return chat(req);
}
