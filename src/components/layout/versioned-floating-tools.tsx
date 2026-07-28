"use client";

import AICopilot from "@/components/ui/AICopilot";
import BgmPlayer from "@/components/ui/bgm-player";
import { useUIVersion } from "@/lib/ui-version-context";

export default function VersionedFloatingTools() {
  const { isV2 } = useUIVersion();

  // UI 2.0 is deliberately content-first. The experimental music player and
  // AI companion remain available in the original UI 1.0 experience.
  if (isV2) return null;

  return (
    <>
      <BgmPlayer />
      <AICopilot />
    </>
  );
}
