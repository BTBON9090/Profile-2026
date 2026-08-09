import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AppBox | Independent Apps & Tools | BTBON.Design",
  description: "LaunchPad、Aura、AllinOne、AI Translate、offer 谈薪防坑计算器与更多独立开发应用和在线工具。",
};

export default function AppBoxLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
