import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// 👇 1. 改回标准引用 (Standard Import)
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import DotMatrixBackground from "@/components/visual/dot-matrix";

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
  title: "Your Name | Product & Engineering Designer",
  description: "Designing Systems. Building Tools. Empowered by AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} ${jetbrainsMono.variable} bg-black text-white antialiased overflow-x-hidden selection:bg-blue-500/30 selection:text-blue-200`}>
        {/* 全局点阵背景 (z-0) */}
        <DotMatrixBackground />
        {/* 确保主内容区域有更高的层级，使用 z-10 */}
        <div className="relative z-10 flex flex-col min-h-screen">
          {/* 👇 2. 直接使用组件 */}
          <Navbar />
          <Sidebar />
        
          <main className="relative z-10">
            {children}
          </main>

        </div>
      </body>
    </html>
  );
}