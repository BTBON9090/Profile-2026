import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aura — 私密图片画廊 | BTBON.Design",
  description: "本地优先的私密图片画廊：标签整理、物理隔离、沉浸幻灯片与入口伪装。",
};

export default function AuraLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
