import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
// 👇 1. 引入刚刚写的 BGM 播放器
import BgmPlayer from "@/components/ui/bgm-player"; 
import DotMatrixBackground from "@/components/visual/dot-matrix";
// ⏸️ 暂时隐藏全局点阵交互背景，首页改用方块墙作为视觉背景
//   需要恢复时把 <DotMatrixBackground /> 重新放回下方即可
const SHOW_DOT_MATRIX = false;
import { I18nProvider } from "@/lib/i18n";
import { AudioProvider } from "@/lib/audio-context";
import BackToTop from "@/components/ui/back-to-top";
import AICopilot from "@/components/ui/AICopilot";
import { CopilotProjectProvider } from "@/lib/copilot-context";

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans" });
const jetbrainsMono = localFont({
  src: [
    {
      path: "../../public/fonts/JetBrainsMono-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/JetBrainsMono-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "倪城 | 10 年 B 端产品 UI/UX 设计师",
  description: "设计系统构建 0-1. 设计工程化思维. AI 赋能. SaaS. Native.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} font-sans bg-[#000] text-white antialiased overflow-x-clip selection:bg-blue-500/30 selection:text-blue-200`}>
        <I18nProvider>
          <AudioProvider>
            <CopilotProjectProvider>
              {SHOW_DOT_MATRIX && <DotMatrixBackground />}
              <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar />
                <Sidebar />
                <BgmPlayer />
                <main className="relative z-10">
                  {children}
                </main>
              </div>
              <BackToTop />
              {/* 全局 AI 助手 — 常驻悬浮于所有界面与弹窗最上层（z-[2147483000]） */}
              <AICopilot />
            </CopilotProjectProvider>
          </AudioProvider>
        </I18nProvider>
      </body>
    </html>
  );
}