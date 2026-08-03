"use client";

import { useEffect, useState } from "react";

// 北京时间的实时时钟（每秒跳动），仅客户端渲染，避免 hydration 不一致
export function useBeijingTime() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("zh-CN", {
          timeZone: "Asia/Shanghai",
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return time;
}
