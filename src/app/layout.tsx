import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
// 👇 1. 引入刚刚写的 BGM 播放器
import BgmPlayer from "@/components/ui/bgm-player"; 
import DotMatrixBackground from "@/components/visual/dot-matrix";
import { I18nProvider } from "@/lib/i18n";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
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
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} ${jetbrainsMono.variable} bg-black text-white antialiased overflow-x-hidden selection:bg-blue-500/30 selection:text-blue-200`}>
        <I18nProvider>
          <DotMatrixBackground />
          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            <Sidebar />
            {/* 👇 2. 渲染 BGM 播放器 */}
            <BgmPlayer /> 
            <main className="relative z-10">
              {children}
            </main>

          </div>
        </I18nProvider>
      </body>
    </html>
  );
}