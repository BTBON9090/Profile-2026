"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ProductBackButton({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/work#personal"
      onClick={() => sessionStorage.setItem("work-scroll-back", "1")}
      className={`fixed left-4 top-20 z-[90] inline-flex h-11 items-center gap-2 rounded-full border px-4 text-xs font-semibold backdrop-blur-xl transition-all md:left-8 md:top-24 ${
        light
          ? "border-black/10 bg-white/75 text-zinc-700 hover:bg-white hover:text-black"
          : "border-white/10 bg-black/40 text-white/70 hover:border-white/25 hover:bg-white/10 hover:text-white"
      }`}
      aria-label="返回个人作品列表"
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="hidden sm:inline">返回作品集</span>
    </Link>
  );
}
