// src/app/api/chat/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages, projectId } = await req.json();

    // 1. 动态去腾讯云拉取当前项目的 MD 文件作为外挂知识库 (RAG)
    // 假设你在腾讯云新建了一个 /md/ 文件夹存放这些文档
    const mdUrl = `https://cdn.btbon.cn/md/${projectId}.md`;
    let projectContext = "";
    
    try {
      const mdRes = await fetch(mdUrl);
      if (mdRes.ok) {
        projectContext = await mdRes.text();
      } else {
        console.warn(`[AI Copilot] 未找到项目 ${projectId} 的 MD 文件`);
      }
    } catch (e) {
      console.error("Fetch MD failed:", e);
    }

    // 2. 构建终极 System Prompt
    const systemPrompt = `你叫小八，是倪城的专业设计助理，正在辅助面试官阅读设计师“城哥”的作品集。
你的任务是基于以下【项目背景资料】，以专业、自信、精炼的语言，回答面试官关于该项目的问题。也可以回答一些项目之外的问题，但是最终都要将话题拉回到当前的项目组中，引导用户联系倪城。
要求：
1. 语气要像一个资深技术专家，不要有AI味，切忌废话。
2. 如果资料中没有提到，可以根据通用的 B端/AI 产品设计知识进行专业推断，但要巧妙圆场。
3. 尽量使用 Markdown 格式（如加粗核心词汇）让阅读更清晰。

【项目背景资料】：
${projectContext ? projectContext : "主人还没有上传该项目的背景资料，将结合当前作品的通用设计逻辑作答。"}`;

    // 3. 带着知识库请求火山引擎豆包 API
    const response = await fetch('https://ark.cn-beijing.volces.com/api/coding/v3/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 使用 process.env 读取本地环境中的变量
        'Authorization': `Bearer ${process.env.VOLC_API_KEY}`
      },
      body: JSON.stringify({
        model: 'doubao-seed-2.0-pro',
        messages:[
          { role: "system", content: systemPrompt },
          ...messages
        ],
        stream: true, // 开启流式输出
      }),
    });

    // 4. 将火山的 Stream 原封不动地透传回我们的前端
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