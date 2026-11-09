"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Maximize2, X } from "lucide-react";
import UniversalModal from "@/components/ui/UniversalModal";
import snownewtabData from "@/data/work/snownewtab";
import "./snow-ecosystem.css";

const VIDEO_SRC = "https://cdn.btbon.cn/home/newt.mov";
// Extracted from the first decoded frame of VIDEO_SRC, not from the case-study artwork.
const VIDEO_POSTER = "/video-posters/snow-browser-first-frame.jpg";

function VideoDialog({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!previousFocusRef.current && document.activeElement instanceof HTMLElement) previousFocusRef.current = document.activeElement;
    const bodyOverflow = document.body.style.overflow;
    const rootOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    if (dialog && !dialog.open) dialog.showModal();
    return () => {
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = rootOverflow;
      requestAnimationFrame(() => previousFocusRef.current?.focus());
    };
  }, []);

  return (
    <dialog ref={dialogRef} onClose={onClose} aria-label="Snow Browser 视频" className="fixed inset-0 m-auto h-full max-h-none w-full max-w-none bg-transparent p-4 md:p-12 backdrop:bg-black/90" onClick={(event) => { if (event.target === event.currentTarget) event.currentTarget.close(); }}>
      <div className="relative mx-auto flex h-full max-w-6xl items-center" onClick={(event) => { if (event.target === event.currentTarget) dialogRef.current?.close(); }}>
        <button autoFocus type="button" onClick={() => dialogRef.current?.close()} aria-label="关闭视频" className="absolute right-0 top-0 z-10 rounded-full bg-zinc-900 p-3 text-white focus-visible:outline-2 focus-visible:outline-blue-400"><X /></button>
        <video src={VIDEO_SRC} poster={VIDEO_POSTER} controls autoPlay playsInline className="w-full max-h-[80vh] bg-black rounded-2xl" />
      </div>
    </dialog>
  );
}

export default function SnowEcosystem() {
  const [showProject, setShowProject] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  return (
    <>
      <section id="snow-ecosystem" className="w-full bg-[rgba(10,10,10,0.9)] relative z-10 py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex items-center gap-4 mb-12 md:mb-16"><span className="font-mono text-xs text-blue-500 tracking-widest">04</span><span className="h-px w-12 bg-zinc-800"/><span className="font-mono text-xs text-zinc-500 tracking-[0.2em] uppercase">KEY CASE / SNOWTECH</span></div>
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-black text-zinc-100 tracking-tight leading-[1.05] mb-6">Snow Browser <span className="text-blue-400">&amp;</span><br/>Enterprise Secure Workspace<span className="text-blue-500">.</span></h2>
              <p className="text-zinc-400 leading-relaxed max-w-xl">以浏览器为安全入口，连接企业应用与工作空间，让安全办公更轻便。</p>
              <dl className="snow-design-points">
                <div><dt>双端体验<span>Browser × Admin</span></dt><dd>从浏览器入口到管理后台，梳理应用、权限与策略的操作路径。</dd></div>
                <div><dt>组件体系<span>Figma Variables</span></dt><dd>维护双端组件库，用统一 Token 连接视觉规范与交互状态。</dd></div>
              </dl>
              <div className="flex flex-wrap gap-3 mt-8"><button onClick={() => setShowProject(true)} className="px-5 py-3 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-400 transition-colors">查看项目</button><a href="https://www.snowtech.com.cn/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-zinc-700 text-zinc-300 hover:border-zinc-500">访问官网 <ArrowUpRight className="w-4 h-4"/></a></div>
            </div>
            <button type="button" onClick={() => setShowVideo(true)} aria-label="放大观看 Snow Browser 视频" className="relative w-full overflow-hidden rounded-3xl bg-zinc-900 group focus-visible:outline-2 focus-visible:outline-blue-400">
              <Image src={VIDEO_POSTER} alt="Snow Browser 演示视频首帧" width={1600} height={872} unoptimized className="block aspect-video w-full object-contain" />
              <span className="absolute inset-0 grid place-items-center bg-black/20 group-hover:bg-black/35 transition-colors"><span className="flex items-center gap-2 rounded-full bg-black/65 px-5 py-3 text-sm text-white"><Maximize2 className="w-4 h-4"/>放大观看</span></span>
            </button>
          </div>
        </div>
      </section>
      {showVideo && <VideoDialog onClose={() => setShowVideo(false)} />}
      {showProject && <UniversalModal isOpen onClose={() => setShowProject(false)} title="雪诺企业安全浏览器" images={snownewtabData.behanceSlices} hasPrev={false} hasNext={false} onPrev={() => {}} onNext={() => {}} projectId="snownewtab" isCompanyProject />}
    </>
  );
}
