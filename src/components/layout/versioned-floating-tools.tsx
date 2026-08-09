"use client";

import AICopilot from "@/components/ui/AICopilot";
import BgmPlayer from "@/components/ui/bgm-player";
import { usePathname } from "next/navigation";
import { useUIVersion } from "@/lib/ui-version-context";

export default function VersionedFloatingTools() {
  const { version } = useUIVersion();
  const pathname = usePathname();

  // UI 2.0 is deliberately content-first. The experimental music
  // player and AI companion remain available in the original UI 1.0 experience.
  if (version !== "1" || pathname.startsWith("/appbox")) return null;

  return (
    <>
      <BgmPlayer />
      <AICopilot />
    </>
  );
}
