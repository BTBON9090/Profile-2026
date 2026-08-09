"use client";

import AICopilot from "@/components/ui/AICopilot";
import BgmPlayer from "@/components/ui/bgm-player";
import { usePathname } from "next/navigation";
import { useUIVersion } from "@/lib/ui-version-context";

export default function VersionedFloatingTools() {
  const { version } = useUIVersion();
  const pathname = usePathname();

  // UI 2.0 remains content-first. AppBox keeps the UI 1.0 music experience,
  // while the AI companion stays out of product-reading and tool routes.
  if (version !== "1") return null;

  const isAppBoxExperience = pathname.startsWith("/appbox") || pathname.startsWith("/tools/");
  const hasDedicatedPlayer = pathname.startsWith("/tools/lyrics-skyline");

  return (
    <>
      {!hasDedicatedPlayer && <BgmPlayer />}
      {!isAppBoxExperience && <AICopilot />}
    </>
  );
}
