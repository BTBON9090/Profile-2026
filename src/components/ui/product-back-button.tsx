"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProductBackButton({ light = false }: { light?: boolean }) {
  const router = useRouter();

  const handleBack = () => {
    const returnTo = new URLSearchParams(window.location.search).get("returnTo");
    if (returnTo?.startsWith("/appbox/")) {
      router.push(returnTo);
      return;
    }
    if (window.history.length > 1) router.back();
    else router.push("/appbox");
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`fixed left-4 top-20 z-[90] inline-flex h-11 items-center gap-2 rounded-full border px-4 text-xs font-semibold backdrop-blur-xl transition-all md:left-8 md:top-24 ${
        light
          ? "border-black/10 bg-white/75 text-zinc-700 hover:bg-white hover:text-black"
          : "border-white/10 bg-black/40 text-white/70 hover:border-white/25 hover:bg-white/10 hover:text-white"
      }`}
      aria-label="返回上一页"
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="hidden sm:inline">返回</span>
    </button>
  );
}
