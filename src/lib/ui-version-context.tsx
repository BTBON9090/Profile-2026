"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type UIVersion = "1" | "2";

type UIVersionContextValue = {
  version: UIVersion;
  isV2: boolean;
  setVersion: (version: UIVersion) => void;
  toggleVersion: () => void;
};

const UIVersionContext = createContext<UIVersionContextValue | null>(null);
const UI_VERSION_KEY = "btbon-ui-version";
const UI_VERSION_EVENT = "btbon-ui-version-change";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(UI_VERSION_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(UI_VERSION_EVENT, callback);
  };
}

function getSnapshot(): UIVersion {
  return window.localStorage.getItem(UI_VERSION_KEY) === "2" ? "2" : "1";
}

function getServerSnapshot(): UIVersion {
  return "1";
}

export function UIVersionProvider({ children }: { children: ReactNode }) {
  // UI 1.0 intentionally remains the server and fresh-visitor default.
  const version = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    document.documentElement.dataset.uiVersion = version;
  }, [version]);

  const setVersion = useCallback((nextVersion: UIVersion) => {
    window.localStorage.setItem(UI_VERSION_KEY, nextVersion);
    window.dispatchEvent(new Event(UI_VERSION_EVENT));
  }, []);

  const toggleVersion = useCallback(() => {
    setVersion(version === "1" ? "2" : "1");
  }, [setVersion, version]);

  return (
    <UIVersionContext.Provider
      value={{ version, isV2: version === "2", setVersion, toggleVersion }}
    >
      {children}
    </UIVersionContext.Provider>
  );
}

export function useUIVersion() {
  const context = useContext(UIVersionContext);
  if (!context) {
    throw new Error("useUIVersion must be used inside UIVersionProvider");
  }
  return context;
}
