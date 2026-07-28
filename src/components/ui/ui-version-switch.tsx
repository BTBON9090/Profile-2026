"use client";

import { motion } from "framer-motion";
import { useUIVersion } from "@/lib/ui-version-context";

export default function UIVersionSwitch() {
  const { version, toggleVersion } = useUIVersion();
  const nextVersion = version === "1" ? "2.0" : "1.0";

  return (
    <button
      type="button"
      onClick={toggleVersion}
      className="ui-version-switch group"
      aria-label={`切换到 UI ${nextVersion}`}
      title={`切换到 UI ${nextVersion}`}
    >
      <span className="ui-version-switch__label">UI</span>
      <span className="ui-version-switch__track" aria-hidden="true">
        <motion.span
          className="ui-version-switch__thumb"
          animate={{ x: version === "2" ? 18 : 0 }}
          transition={{ type: "spring", stiffness: 430, damping: 30 }}
        />
      </span>
      <span className="ui-version-switch__value">{version}.0</span>
    </button>
  );
}
