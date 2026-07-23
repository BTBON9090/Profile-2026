import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LaunchPad — macOS 原生启动台 | BTBON.Design",
  description: "为 macOS 重新找回熟悉的应用启动体验。支持快捷键、F4、触控板手势与触发角唤起。",
};

export default function LaunchpadLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
