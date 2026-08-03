"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useUIVersion, type UIVersion } from "@/lib/ui-version-context";

const VERSION_OPTIONS: { value: UIVersion; label: string; hint: string }[] = [
  { value: "1", label: "UI 1.0", hint: "暗夜方块" },
  { value: "3", label: "UI 3.0", hint: "温润小品" },
];

export default function UIVersionSwitch() {
  const { version, setVersion } = useUIVersion();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div className="ui-version-switch" ref={rootRef}>
      <button
        type="button"
        className="ui-version-switch__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="切换界面版本"
        title="切换界面版本"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="ui-version-switch__label">UI</span>
        <span className="ui-version-switch__value">{version}.0</span>
        <ChevronDown
          size={12}
          strokeWidth={2}
          className="ui-version-switch__chevron"
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            className="ui-version-switch__menu"
            role="listbox"
            aria-label="选择界面版本"
            initial={{ opacity: 0, y: -5, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            {VERSION_OPTIONS.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={version === option.value}
                  className="ui-version-switch__option"
                  onClick={() => {
                    setVersion(option.value);
                    setOpen(false);
                  }}
                >
                  <span className="ui-version-switch__option-label">
                    {option.label}
                  </span>
                  <span className="ui-version-switch__option-hint">
                    {option.hint}
                  </span>
                  <span className="ui-version-switch__option-check" aria-hidden="true">
                    {version === option.value && <Check size={13} strokeWidth={2.5} />}
                  </span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
