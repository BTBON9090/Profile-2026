// src/lib/copilot-context.tsx
"use client";
import { createContext, useContext, useState, useCallback, useRef, ReactNode } from "react";

/**
 * AI 助手全局上下文
 *
 * 由于 AICopilot 现已常驻在 layout.tsx（根层级），它无法直接拿到
 * UniversalModal / 项目详情页内部的 projectId。这里用一个轻量 Context
 * 作为"广播通道"：任何页面/弹窗在打开项目时，调用 setProjectId 推送
 * 当前项目 id；全局 AICopilot 订阅后自动切换知识库。
 *
 * 调用约定：
 *   const { setProjectId } = useCopilotProject();
 *   useEffect(() => { setProjectId(slug, true); return () => setProjectId(null, false); }, [slug]);
 *
 * scope 用于实现"栈式优先级"：弹窗 (scope="modal") 的 projectId 会覆盖
 * 详情页 (scope="page") 的 projectId，弹窗关闭后自动回退到详情页。
 */

type Scope = "page" | "modal";

interface CopilotProjectState {
  /** 当前生效的项目 id（page/modal 合并后的最终值） */
  projectId: string | null;
  /** 推送一个项目上下文。scope 高者覆盖低者；相同 scope 后者覆盖前者 */
  setProjectId: (id: string | null, scope?: Scope) => void;
}

const CopilotProjectContext = createContext<CopilotProjectState | null>(null);

export function CopilotProjectProvider({ children }: { children: ReactNode }) {
  // 分别保存两个作用域的 projectId，modal 优先级高于 page
  const pageRef = useRef<string | null>(null);
  const modalRef = useRef<string | null>(null);
  const [projectId, setProjectIdState] = useState<string | null>(null);

  const recompute = useCallback(() => {
    const next = modalRef.current ?? pageRef.current ?? null;
    setProjectIdState((prev) => (prev === next ? prev : next));
  }, []);

  const setProjectId = useCallback(
    (id: string | null, scope: Scope = "page") => {
      if (scope === "modal") modalRef.current = id;
      else pageRef.current = id;
      recompute();
    },
    [recompute]
  );

  return (
    <CopilotProjectContext.Provider value={{ projectId, setProjectId }}>
      {children}
    </CopilotProjectContext.Provider>
  );
}

export function useCopilotProject(): CopilotProjectState {
  const ctx = useContext(CopilotProjectContext);
  if (!ctx) {
    // 容错：Provider 未挂载时不报错，退化成无项目上下文
    return { projectId: null, setProjectId: () => {} };
  }
  return ctx;
}
