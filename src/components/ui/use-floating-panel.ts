"use client";

import { useEffect, useState } from "react";
import type { SnapSide } from "@/lib/use-draggable-snap";

/** Fixed panels stay inside the visible viewport, including the mobile keyboard. */
export function useFloatingPanel(open: boolean, x: number, y: number, side: SnapSide, triggerSize: number, width: number, height: number) {
  const [placement, setPlacement] = useState<{ left: number; top: number; width: number; height: number; mobile: boolean } | null>(null);
  useEffect(() => {
    if (!open) return;
    const update = () => {
      const viewport = window.visualViewport;
      const vw = viewport?.width ?? window.innerWidth;
      const vh = viewport?.height ?? window.innerHeight;
      const ox = viewport?.offsetLeft ?? 0;
      const oy = viewport?.offsetTop ?? 0;
      const mobile = vw < 640;
      const pad = mobile ? 12 : 20;
      const w = Math.min(width, vw - pad * 2);
      const h = Math.min(height, vh - pad * 2);
      const desiredLeft = side === "right" ? x - w - 12 : x + triggerSize + 12;
      setPlacement({
        left: mobile ? ox + (vw - w) / 2 : Math.max(ox + pad, Math.min(desiredLeft, ox + vw - w - pad)),
        top: mobile ? oy + vh - h - pad : Math.max(oy + pad, Math.min(y + triggerSize - h, oy + vh - h - pad)),
        width: w,
        height: h,
        mobile,
      });
    };
    update();
    window.addEventListener("resize", update);
    window.visualViewport?.addEventListener("resize", update);
    window.visualViewport?.addEventListener("scroll", update);
    return () => {
      window.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("scroll", update);
    };
  }, [open, x, y, side, triggerSize, width, height]);
  return placement;
}
