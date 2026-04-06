// src/app/work/ai-translate/page.tsx
"use client";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useEffect } from "react";

export default function TranslateStandalonePage() {
  const router = useRouter();
  
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  },[]);

  return (
    <div className="w-full h-screen bg-[#050505] overflow-hidden relative">
      
      {/* 🔴 全局悬浮返回按钮 */}
      <button 
        onClick={() => router.back()}
        className="fixed top-20 right-4 md:top-24 md:right-8 z-[100000] w-10 h-10 md:w-14 md:h-14 bg-black/50 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all shadow-[0_0_30px_rgba(0,0,0,0.3)] group"
      >
        <X className="w-4 h-4 md:w-6 md:h-6 text-white" />
      </button>
     

      {/* 🔴 核心黑科技：镶嵌 Translate 旧网站 */}
      {/* src 指向了刚才放在 public 目录下的 index.html */}
      <iframe 
        src="/translate-site/index.html" 
        className="w-full h-full border-none m-0 p-0 block bg-transparent"
        title="AI Translate Extension Site"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />

    </div>
  );
}