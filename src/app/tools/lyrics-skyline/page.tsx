import type { Metadata } from "next";
import LyricsSkylineStudio from "@/components/tools/lyrics-skyline-studio";
import ProductBackButton from "@/components/ui/product-back-button";

export const metadata: Metadata = {
  title: "Lyric Skyline Studio | AppBox",
  description: "可完整调参、试听并导出的歌词天际屏音乐播放器。",
};

export default function LyricsSkylinePage() {
  return (
    <>
      <ProductBackButton />
      <LyricsSkylineStudio />
    </>
  );
}
