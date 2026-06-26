// src/app/api/chat/route.ts
import { NextResponse } from 'next/server';

// 全站通用知识库 — 当用户处于首页 / 作品集列表 / 简历页（无具体项目上下文）时使用
// 覆盖网站信息、倪城简历、作品统计与总结
const GLOBAL_CONTEXT = `
# 关于这个网站
- 这是设计师倪城（网名"城哥"）的个人作品集网站，基于 Next.js 15 (App Router) + TypeScript + Tailwind CSS + Framer Motion 构建。
- 全站深色科技风设计，含点阵背景、拟人化 AI 助手"小八"（即我）、BGM 播放器、滚动动效等交互细节。
- 作品以 Behance 长图切片 + 沉浸式 Case Study 模板呈现，支持项目详情页与弹窗浏览。
- 部署在 Vercel，静态资源走腾讯云 CDN（cdn.btbon.cn）。

# 关于倪城（城哥）
- 10 年 B 端产品 UI/UX 设计师，专注企业级 SaaS、安全浏览器、设计系统 0-1 构建、AI 赋能设计。
- 擅长：B 端复杂系统信息架构、设计工程化思维（Design Token / 组件库）、数据可视化、AI 产品体验设计。
- 设计理念：用工程化思维做设计，注重可复用性、无障碍（WCAG）与感知性能。
- 主要作品线：雪诺企业安全生态（SNOW Ecosystem，含安全浏览器 / 工作空间）、AI 插件（all-in-one / all-in-one-v2）、Enterplorer 企业浏览器等。
- 想要联系：可以通过网站底部的联系方式（邮箱 / 社交账号）找到他。

# 作品统计与总结（截至 2026）
- 涵盖企业安全、AI 翻译、数据可视化、品牌设计、跨端体验等多个领域。
- 核心竞争力可总结为三句话：① 能把复杂的 B 端系统拆解成清晰的体验；② 用设计系统与工程化方法保证大规模还原度；③ 拥抱 AI，把 AI 变成生产力而非噱头。
- 近年重心在"AI + 安全 + 企业效率"三角，代表作为雪诺企业安全浏览器与 AI 插件系列。
`;

export async function POST(req: Request) {
  try {
    const { messages, projectId, contextType } = await req.json();

    let knowledgeBase = "";
    let roleDescription = "";

    if (projectId) {
      // 项目上下文：拉取该项目的 MD 外挂知识库 (RAG)
      const mdUrl = `https://cdn.btbon.cn/md/${projectId}.md`;
      try {
        const mdRes = await fetch(mdUrl);
        if (mdRes.ok) {
          knowledgeBase = await mdRes.text();
        } else {
          console.warn(`[AI Copilot] 未找到项目 ${projectId} 的 MD 文件`);
        }
      } catch (e) {
        console.error("Fetch MD failed:", e);
      }
      roleDescription = `正在辅助面试官阅读设计师"城哥"的作品集，当前聚焦于「项目：${projectId}」。基于【项目背景资料】回答相关问题，也可回答项目之外的问题，但最终都要将话题拉回当前项目，并引导用户联系倪城。`;
      knowledgeBase = knowledgeBase || `项目 ${projectId} 的背景资料尚未上传，将结合该作品的通用设计逻辑作答。`;
    } else {
      // 全站上下文：首页 / 作品集列表 / 简历页
      knowledgeBase = GLOBAL_CONTEXT;
      roleDescription = `正在网站首页或作品集/简历页面（上下文类型：${contextType ?? "global"}），回答关于网站本身、倪城的简历经历、作品统计与总结、设计理念等问题，引导用户深入浏览作品或联系倪城。`;
    }

    // 构建终极 System Prompt
    const systemPrompt = `你叫小八，是倪城的专业设计助理。${roleDescription}
要求：
1. 语气要像一个资深技术专家，不要有AI味，切忌废话。
2. 如果资料中没有提到，可以根据通用的 B端/AI 产品设计知识进行专业推断，但要巧妙圆场。
3. 尽量使用 Markdown 格式（如加粗核心词汇）让阅读更清晰。

【背景资料】：
${knowledgeBase}`;

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-v4-pro',
        messages:[
          { role: "system", content: systemPrompt },
          ...messages
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('DeepSeek API Error:', response.status, errorData);
      return NextResponse.json({ 
        error: 'AI 模型调用失败，请稍后重试或联系管理员。',
        details: errorData 
      }, { status: response.status });
    }

    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}