"use client";

import AICopilot from "@/components/ui/AICopilot";
import BgmPlayer from "@/components/ui/bgm-player";
import { useUIVersion } from "@/lib/ui-version-context";

export default function VersionedFloatingTools() {
  const { version } = useUIVersion();

  // UI 3.0 is deliberately content-first. The experimental music
  // player and AI companion remain available in the original UI 1.0 experience.
  if (version !== "1") return null;

  return (
    <>
      <BgmPlayer />
      <AICopilot />
    </>
  );
}
