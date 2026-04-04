// src/components/ui/AICopilot.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, X, Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// 定义所有的快捷指令池
const ALL_PROMPTS =[
  "解析该项目的核心交互难点",
  "1分钟商业价值速读",
  "重构前后的核心差异在哪",
  "该项目用到了哪些AI提效技术",
  "设计系统（Design System）是如何沉淀的",
  "作为主 R，你的核心贡献是什么",
  "项目中你是如何与团队合作的？",
  "设计过程中遇到过什么困难",
  "设计方法论",
  "你觉得还有哪里可以优化的",
  "你做的项目中做的好的地方",

];

interface AICopilotProps {
  projectId: string;
}

export default function AICopilot({ projectId }: AICopilotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [promptOffset, setPromptOffset] = useState(0);
  const [hasUsed, setHasUsed] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPromptOffset((prev) => (prev + 3) % ALL_PROMPTS.length);
    }, 6000);
    return () => clearInterval(interval);
  },[]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const visiblePrompts =[
    ALL_PROMPTS[promptOffset % ALL_PROMPTS.length],
    ALL_PROMPTS[(promptOffset + 1) % ALL_PROMPTS.length],
    ALL_PROMPTS[(promptOffset + 2) % ALL_PROMPTS.length],
  ];

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;
    
    setHasUsed(true);
    const userMsg = { role: "user", content: text };
    const newMessages =[...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setIsOpen(true);

    setMessages((prev) =>[...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, projectId }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let aiText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        
        for (const line of lines) {
          if (line.startsWith("data: ") && line !== "data:[DONE]") {
            try {
              const data = JSON.parse(line.slice(6));
              const content = data.choices[0]?.delta?.content || "";
              aiText += content;
              
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1].content = aiText;
                return updated;
              });
            } catch (e) {}
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].content = "网络似乎有点问题，请稍后再试。";
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 面板展开时，调整整体的定位，避免遮挡
    <div className={`fixed z-[100000] flex flex-row-reverse items-end md:items-center gap-6 pointer-events-auto transition-all duration-500 ${isOpen ? 'bottom-28 right-8 md:top-1/2 md:-translate-y-1/2' : 'bottom-28 right-12 md:top-1/2 md:-translate-y-1/2'}`}>
      
      {/* ========================================== */}
      {/* 1. 终极流体能量球 (The Fluid Energy Core)    */}
      {/* ========================================== */}
      <div className="relative group cursor-pointer w-16 h-16 flex items-center justify-center" onClick={() => setIsOpen(!isOpen)}>
        
        {/* 动态图层 1：紫蓝基底流转 */}
        <motion.div 
          animate={{ rotate: 360, scale:[1, 1.15, 1] }} 
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-20%] bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 rounded-[40%] blur-[16px] opacity-50 mix-blend-screen"
        />
        {/* 动态图层 2：粉色核心呼吸 (反向运动) */}
        <motion.div 
          animate={{ rotate: -360, scale:[0.9, 1.3, 0.9], x: [-5, 5, -5] }} 
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-[10%] bg-gradient-to-bl from-pink-500 to-cyan-400 rounded-full blur-[12px] opacity-50 mix-blend-screen"
        />
        {/* 动态图层 3：高光游离点 */}
        <motion.div 
          animate={{ y:[-8, 8, -8], x: [8, -8, 8] }} 
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-[20%] bg-white/40 rounded-full blur-[8px] mix-blend-overlay"
        />
        
        {/* 物理玻璃外壳 (Glass Shell) */}
        <div className="relative z-10 w-14 h-14 bg-black backdrop-blur-xl border-1 border-white/20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-105">
          <AnimatePresence mode="wait">
            {isOpen ? (
              // 展开状态：依然保留清晰的 X 用于关闭
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <X className="w-6 h-6 text-white/90" />
              </motion.div>
            ) : (
              // 收起状态：Siri/Gemini 风格的动态量子核心
              <motion.div 
                key="ai-core" 
                initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={{ duration: 0.3 }}
                className="relative w-6 h-6 flex items-center justify-center"
              >
                {/* 轨道粒子 1：蓝色顺时针 */}
                <motion.span
                  animate={{ rotate: 360, scale: [1, 1.4, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute w-3 h-3 bg-blue-400 rounded-full blur-[4px] mix-blend-screen origin-top-left"
                />
                {/* 轨道粒子 2：紫色逆时针 */}
                <motion.span
                  animate={{ rotate: -360, scale: [1.2, 0.8, 1.2] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute w-3 h-3 bg-purple-400 rounded-full blur-[1px] mix-blend-screen origin-bottom-right"
                />
                {/* 轨道粒子 3：青色快频游离 */}
                <motion.span
                  animate={{ rotate: 360, scale: [0.9, 1.5, 0.9] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                  className="absolute w-2.5 h-2.5 bg-cyan-300 rounded-full blur-[2px] mix-blend-screen origin-bottom-left"
                />
                {/* 中心稳定发光白矮星 */}
                <motion.span
                  animate={{ opacity:[0.4, 1, 0.4], scale:[0.8, 1.1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute w-2 h-2 bg-white rounded-full blur-[1.5px] z-10"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 微动提示词: 极简浮窗 */}
        {!isOpen && !hasUsed && (
          <motion.div 
            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2.5, duration: 0.6 }}
            className="absolute top-1/2 -translate-y-1/2 right-[130%] pointer-events-none whitespace-nowrap"
          >
            <div className="bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs font-mono px-4 py-2 rounded-full flex items-center gap-2 shadow-2xl">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Try Me
            </div>
          </motion.div>
        )}
      </div>

      {/* ========================================== */}
      {/* 2. 扩容版聊天面板 (Expanded Chat Panel)      */}
      {/* ========================================== */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, y: 20, scale: 0.95 }}
            transition={{ type:"decay", stiffness: 50, damping: 10 }}
            // 🔴 宽度从 360 升级到 480，高度自适应但最大 80vh
            className="w-[calc(100vw-32px)] md:w-[480px] h-[65vh] md:h-[75vh] max-h-[800px] bg-[#0c0c0c]/95 backdrop-blur-3xl border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)] rounded-3xl overflow-hidden flex flex-col"
          >
            {/* Header: 极简科技风 */}
            <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white tracking-wide">助手小八</div>
                  <div className="text-[10px] text-zinc-400 font-mono flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Volcengine Powered
                  </div>
                </div>
              </div>
            </div>

            {/* Chat History */}
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-6">
              {messages.length === 0 && (
                <div className="text-center mt-12 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-white/50" />
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed max-w-[85%]">
                    您好，我是倪城的 AI 设计助理。<br/>有关项目的业务逻辑、难点或设计思考，请随时向我提问。
                  </p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-blue-400" />
                    </div>
                  )}
                  <div className={`p-4 text-sm rounded-xl max-w-[85%] leading-relaxed ${
                    msg.role === "user" 
                      ? "bg-blue-600 text-white rounded-tr-sm shadow-md" 
                      : "bg-[#181818] border border-white/5 text-zinc-300 rounded-tl-sm shadow-sm"
                  }`}>
                    
                    {/* 🔴 核心重构：使用 ReactMarkdown 渲染排版 */}
                    {msg.role === "assistant" ? (
                      msg.content ? (
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({node, ...props}) => <p className="leading-7" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-semibold text-blue-300" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-1.5 text-zinc-400" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal pl-5 space-y-1.5 text-zinc-400" {...props} />,
                            li: ({node, ...props}) => <li className="marker:text-blue-500" {...props} />,
                            h1: ({node, ...props}) => <h1 className="text-white font-bold mt-2 mb-1" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-white font-bold mt-3 mb-1" {...props} />,
                            h3: ({node, ...props}) => <h3 className="text-white font-bold mt-4 mb-2" {...props} />,
                            h4: ({node, ...props}) => <h4 className="text-white font-bold mt-3 mb-1" {...props} />,
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      ) : (
                        <span className="w-2 h-4 bg-blue-500 inline-block animate-pulse"></span>
                      )
                    ) : (
                      <p>{msg.content}</p>
                    )}
                    
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Footer: Dynamic Prompts & Input */}
            <div className="p-4 bg-[#111] border-t border-white/5">
              {/* 垂直轮换的快捷指令 */}
              {messages.length === 0 && (
                <div className="mb-4 space-y-2 relative h-[148px] overflow-hidden">
                  <AnimatePresence mode="popLayout">
                    {visiblePrompts.map((prompt) => (
                      <motion.button
                        key={prompt}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        onClick={() => handleSend(prompt)}
                        className="block w-full text-left px-4 py-2.5 bg-white/5 hover:bg-white/10 text-zinc-300 text-xs md:text-sm rounded-full transition-colors truncate"
                      >
                        <span className="text-blue-400 mr-2">✦</span>
                        {prompt}
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* 高级输入框 */}
              <div className="relative flex items-center">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
                  placeholder="Ask anything..."
                  className="w-full bg-[#050505] border border-white/10 rounded-full pl-5 pr-12 py-3.5 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-zinc-600"
                />
                <button 
                  onClick={() => handleSend(input)}
                  className={`absolute right-2 p-2 rounded-full transition-colors ${input.trim() ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-white/10 text-zinc-500 cursor-not-allowed'}`}
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}