// src/components/ui/AICopilot.tsx
"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDraggableSnap } from "@/lib/use-draggable-snap";
import {
  Sparkles, Send, X, Trash2, ChevronDown, Zap, MessageSquare, Lightbulb,
  Copy, Check, Clock, Cpu, Activity, RefreshCw, AlertCircle, SlidersHorizontal, RotateCcw
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { usePathname } from "next/navigation";
import { useCopilotProject } from "@/lib/copilot-context";

// ==========================================
// 分类指令 — 严谨的结构化提示系统
// ==========================================
const PROMPT_CATEGORIES_PROJECT = [
  {
    icon: Zap,
    label: "核心价值",
    color: "blue",
    prompts: [
      "1分钟商业价值速读",
      "重构前后的核心差异在哪",
      "你做的项目中做的好的地方",
    ],
  },
  {
    icon: Lightbulb,
    label: "设计思考",
    color: "amber",
    prompts: [
      "解析该项目的核心交互难点",
      "设计系统（Design System）是如何沉淀的",
      "设计方法论",
    ],
  },
  {
    icon: MessageSquare,
    label: "团队协作",
    color: "emerald",
    prompts: [
      "作为主 R，你的核心贡献是什么",
      "项目中你是如何与团队合作的？",
      "设计过程中遇到过什么困难",
    ],
  },
];

// 首页 / 作品集 列表上下文的引导指令（简历 / 网站 / 作品统计）
const PROMPT_CATEGORIES_GLOBAL = [
  {
    icon: Zap,
    label: "作品总结",
    color: "blue",
    prompts: [
      "用三句话总结倪城的核心竞争力",
      "挑一个最能体现能力的作品聊聊",
      "近 10 年的职业主线是什么",
    ],
  },
  {
    icon: Lightbulb,
    label: "设计理念",
    color: "amber",
    prompts: [
      "你理解的设计系统是什么",
      "B 端和 C 端设计最大的区别",
      "AI 时代设计师怎么不被淘汰",
    ],
  },
  {
    icon: MessageSquare,
    label: "聊聊简历",
    color: "emerald",
    prompts: [
      "介绍一下这个网站用了哪些技术",
      "倪城的教育和工作经历",
      "怎么联系倪城",
    ],
  },
];

// 颜色映射 — 严谨的设计令牌
const COLOR_MAP = {
  blue: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20", dot: "bg-blue-500" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", dot: "bg-amber-500" },
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", dot: "bg-emerald-500" },
};

// ==========================================
// 动态引导语气泡 — 代替静态 "Ask AI"
// 简短、亲切、不重复打扰
// ==========================================
const GREETINGS = [
  "Hi 👋",
  "你好呀～",
  "来问问我吧",
  "聊聊天吗？",
  "点我，我有话说",
  "听听歌放松一下？",
  "好无聊啊，理理我嘛",
  "想了解这个项目吗？",
  "我是小八，认识一下？",
  "好奇就点我呀",
];

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  isStreaming?: boolean;
  error?: boolean;
}

export default function AICopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [showCategoryPanel, setShowCategoryPanel] = useState(false);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [copiedMessageIdx, setCopiedMessageIdx] = useState<number | null>(null);
  const [greeting, setGreeting] = useState<string | null>(null);

  // ==========================================
  // 拟人化眼睛系统
  // ==========================================
  const [expression, setExpression] = useState<Expression>("idle");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isFocused, setIsFocused] = useState(true);
  const triggerRef = useRef<HTMLDivElement>(null);
  const lastInteractionRef = useRef(Date.now());
  const targetOffsetRef = useRef({ x: 0, y: 0 });
  const autonomousTargetRef = useRef({ x: 0, y: 0 });
  const centerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wanderTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const greetingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const greetedRef = useRef(false);

  // ==========================================
  // 表情调参面板（开发调试用）
  // ==========================================
  // showTuning: 面板是否打开
  // tuningExpr: 面板当前预览/编辑的表情（独立于实际 expression，便于对照）
  // tuningOverrides: 被手动覆盖过的参数字段（未覆盖的沿用 EXPRESSION_PARAMS 默认）
  // tuningEnabled: 是否将调参结果应用到触发气泡（关闭时气泡回到自动状态机驱动）
  const [showTuning, setShowTuning] = useState(false);
  const [tuningExpr, setTuningExpr] = useState<Expression>("idle");
  const [tuningOverrides, setTuningOverrides] = useState<Partial<EyeParams>>({});
  const [tuningEnabled, setTuningEnabled] = useState(true);
  // 气泡（触发器外壳）尺寸：调参面板可调，影响眼睛整体大小
  const [bubbleSize, setBubbleSize] = useState(64);

  // ==========================================
  // 上下文感知：路由 + 项目 id
  // ==========================================
  const pathname = usePathname() ?? "/";
  const { projectId } = useCopilotProject();

  // 路由 → 上下文类型
  const contextType: "project-detail" | "global" = useMemo(() => {
    // 项目详情页（含 [slug]）或弹窗已推送 projectId
    if (projectId) return "project-detail";
    if (pathname.startsWith("/work/")) return "project-detail";
    return "global"; // 首页 / 作品集列表 / 简历 / 关于
  }, [projectId, pathname]);

  const currentProjectId = projectId ?? null;

  // 标题/副标题随上下文变化
  const headerTitle = contextType === "project-detail" ? "项目助理 · 小八" : "全站助理 · 小八";
  const placeholder = contextType === "project-detail" ? "问问这个项目的设计思考..." : "问网站、问简历、问作品...";

  const promptCategories = contextType === "project-detail" ? PROMPT_CATEGORIES_PROJECT : PROMPT_CATEGORIES_GLOBAL;

  // 空状态文案随上下文变化
  const emptyHint =
    contextType === "project-detail"
      ? "关于这个项目的业务逻辑、设计难点或思考过程，请随时提问。"
      : "可以问我网站信息、倪城的简历、作品统计与总结，也可以聊聊设计。";

  // ==========================================
  // 浏览器失焦检测
  // ==========================================
  useEffect(() => {
    const onFocus = () => setIsFocused(true);
    const onBlur = () => setIsFocused(false);
    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);
    setIsFocused(document.hasFocus());
    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  // 鼠标追踪 + 互动时间
  // 从长静止突然恢复操作 → 打寒颤（脑袋左右晃、眼珠左右颠）
  const shiverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // 记录恢复操作前的静默时长，用于判断是否触发 shiver
      const idleBefore = Date.now() - lastInteractionRef.current;
      lastInteractionRef.current = Date.now();
      setMousePos({ x: e.clientX, y: e.clientY });
      // 静默超过 30s 后突然动 → 60% 概率打寒颤（仅在非对话、非调参接管时）
      if (idleBefore > 30000 && !isOpen && !(showTuning && tuningEnabled)) {
        setExpression((prev) => {
          // 已在 shiver/shock 等短暂表情中则不打断
          if (prev === "shiver" || prev === "shock" || prev === "blink") return prev;
          return "shiver";
        });
        if (shiverTimerRef.current) clearTimeout(shiverTimerRef.current);
        shiverTimerRef.current = setTimeout(() => {
          setExpression((prev) => (prev === "shiver" ? "idle" : prev));
        }, 1400);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (shiverTimerRef.current) clearTimeout(shiverTimerRef.current);
    };
  }, [isOpen, showTuning, tuningEnabled]);

  // 眼珠自主游荡
  useEffect(() => {
    const scheduleWander = () => {
      const delay = 1200 + Math.random() * 2800;
      wanderTimerRef.current = setTimeout(() => {
        if (Math.random() < 0.3) {
          autonomousTargetRef.current = { x: 0, y: 0 };
        } else {
          const angle = Math.random() * Math.PI * 2;
          const radius = 0.6 + Math.random() * 1.4;
          autonomousTargetRef.current = {
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
          };
        }
        scheduleWander();
      }, delay);
    };
    const scheduleCenter = () => {
      const delay = 5000 + Math.random() * 5000;
      centerTimerRef.current = setTimeout(() => {
        targetOffsetRef.current = { x: 0, y: 0 };
        scheduleCenter();
      }, delay);
    };
    scheduleWander();
    scheduleCenter();
    return () => {
      if (wanderTimerRef.current) clearTimeout(wanderTimerRef.current);
      if (centerTimerRef.current) clearTimeout(centerTimerRef.current);
    };
  }, []);

  // 眨眼 + 表情状态机
  useEffect(() => {
    if (isOpen) return; // 打开对话时不眨眼（避免遮挡交互注意力）
    // 调参面板开启并应用时，表情由面板接管，停止自动状态机
    if (showTuning && tuningEnabled) return;

    let blinkTimer: ReturnType<typeof setTimeout>;
    const pendingTimers: ReturnType<typeof setTimeout>[] = [];

    const doSingleBlink = (onDone: () => void) => {
      setExpression("blink");
      const t = setTimeout(() => {
        setExpression("idle");
        onDone();
      }, 130);
      pendingTimers.push(t);
    };

    const scheduleBlink = () => {
      const delay = 2500 + Math.random() * 3500;
      blinkTimer = setTimeout(() => {
        const idleTime = Date.now() - lastInteractionRef.current;
        if (idleTime > 45000 && Math.random() < 0.5) {
          setExpression("bored");
          const t1 = setTimeout(() => {
            setExpression("blink");
            const t2 = setTimeout(() => {
              setExpression("bored");
              const t3 = setTimeout(() => {
                setExpression("idle");
                scheduleBlink();
              }, 600);
              pendingTimers.push(t3);
            }, 200);
            pendingTimers.push(t2);
          }, 500);
          pendingTimers.push(t1);
          return;
        }
        doSingleBlink(() => {
          if (Math.random() < 0.18) {
            const t = setTimeout(() => doSingleBlink(() => scheduleBlink()), 180);
            pendingTimers.push(t);
          } else {
            scheduleBlink();
          }
        });
      }, delay);
    };

    let expressionTimer: ReturnType<typeof setTimeout>;
    const scheduleIdleExpression = () => {
      const delay = 8000 + Math.random() * 7000;
      expressionTimer = setTimeout(() => {
        const idleTime = Date.now() - lastInteractionRef.current;
        if (idleTime > 30000) {
          // 长时间无操作 → 困倦系列：哈欠 / 无聊 / 困倦
          const sleepyExprs: Expression[] = ["yawn", "bored", "sleepy"];
          const pick = sleepyExprs[Math.floor(Math.random() * sleepyExprs.length)];
          setExpression(pick);
          const t = setTimeout(() => {
            setExpression("idle");
            scheduleIdleExpression();
          }, 6000);
          pendingTimers.push(t);
        } else {
          // 活跃期：按"场景组"随机播放，让闲时表现更丰富
          // thinking→happy：思考后恍然大悟
          // nod→happy：认同点头
          // wink：俏皮眨眼
          // dizzy→blink：眩晕后回神
          // silly：偶尔装傻
          const scenarios: { seq: Expression[]; dur: number[] }[] = [
            { seq: ["thinking", "happy"], dur: [1800, 1200] },
            { seq: ["nod", "happy"], dur: [1200, 1000] },
            { seq: ["wink"], dur: [900] },
            { seq: ["dizzy", "blink"], dur: [1600, 300] },
            { seq: ["silly"], dur: [1800] },
          ];
          const sc = scenarios[Math.floor(Math.random() * scenarios.length)];
          let i = 0;
          const playNext = () => {
            if (i >= sc.seq.length) {
              const t = setTimeout(() => {
                setExpression("idle");
                scheduleIdleExpression();
              }, 600);
              pendingTimers.push(t);
              return;
            }
            setExpression(sc.seq[i]);
            const t = setTimeout(playNext, sc.dur[i] ?? 1000);
            pendingTimers.push(t);
            i += 1;
          };
          playNext();
        }
      }, delay);
    };

    const scheduleShock = () => {
      const delay = 20000 + Math.random() * 30000;
      const t = setTimeout(() => {
        setExpression("shock");
        const t2 = setTimeout(() => {
          setExpression("idle");
          scheduleShock();
        }, 1200 + Math.random() * 800);
        pendingTimers.push(t2);
      }, delay);
      pendingTimers.push(t);
    };

    const MOODS: Expression[] = ["wink", "love", "money", "disdain", "arrogant", "pitiful", "angry", "happy", "nod"];
    const MOOD_DURATION: Record<string, number> = {
      // love / money 属于高情绪表达，至少停留 4 秒，保证情绪被感知到
      // angry：怒目而视，停留 2.2s 让眉毛旋转下压感被看清
      wink: 900, love: 4000, money: 4000, disdain: 1500, arrogant: 1800, pitiful: 1700, angry: 2200, happy: 1200, nod: 1400,
    };
    const scheduleMood = () => {
      const delay = 15000 + Math.random() * 25000;
      const t = setTimeout(() => {
        const mood = MOODS[Math.floor(Math.random() * MOODS.length)];
        setExpression(mood);
        const dur = (MOOD_DURATION[mood] ?? 1500) + Math.random() * 400;
        const t2 = setTimeout(() => {
          setExpression("idle");
          scheduleMood();
        }, dur);
        pendingTimers.push(t2);
      }, delay);
      pendingTimers.push(t);
    };

    scheduleBlink();
    scheduleIdleExpression();
    scheduleShock();
    scheduleMood();

    return () => {
      clearTimeout(blinkTimer);
      clearTimeout(expressionTimer);
      pendingTimers.forEach(clearTimeout);
    };
  }, [isOpen, showTuning, tuningEnabled]);

  // 加载状态 → thinking
  // 用 ref 读取 expression，避免把它写进依赖（否则表情每次变化都会重启定时器）
  const expressionRef = useRef(expression);
  expressionRef.current = expression;
  useEffect(() => {
    if (isLoading) {
      setExpression("thinking");
    } else if (expressionRef.current === "thinking") {
      setExpression("happy");
      const t = setTimeout(() => setExpression("idle"), 1500);
      return () => clearTimeout(t);
    }
  }, [isLoading]);

  // 触发器位置
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);
  useEffect(() => {
    if (!triggerRef.current) return;
    const update = () => setTriggerRect(triggerRef.current?.getBoundingClientRect() ?? null);
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, []);

  const baseParams = EXPRESSION_PARAMS[expression];
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "connecting" | "connected" | "error">("idle");

  // 调参面板打开时：强制 expression 跟随 tuningExpr，并用 overrides 覆盖参数
  const currentParams: EyeParams = showTuning && tuningEnabled
    ? { ...EXPRESSION_PARAMS[tuningExpr], ...tuningOverrides }
    : baseParams;

  // 切换 tuningExpr 时清空 overrides，避免上一个表情的残留参数污染新表情
  const selectTuningExpr = useCallback((expr: Expression) => {
    setTuningExpr(expr);
    setTuningOverrides({});
    setExpression(expr);
  }, []);

  const updateTuning = useCallback(<K extends keyof EyeParams>(key: K, value: EyeParams[K]) => {
    setTuningOverrides((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetTuning = useCallback(() => {
    setTuningOverrides({});
  }, []);
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const [shockOffsetL, setShockOffsetL] = useState({ x: 0, y: 0 });
  const [shockOffsetR, setShockOffsetR] = useState({ x: 0, y: 0 });
  const lastSnappedRef = useRef("0,0");
  const lastShockLRef = useRef("0,0");
  const lastShockRRef = useRef("0,0");
  // dizzy 真圆周：用时间相位驱动，不依赖鼠标
  const [dizzyPhase, setDizzyPhase] = useState(0);

  // dizzy 用独立 RAF 计时器驱动相位（圆周运动）
  useEffect(() => {
    if (expression !== "dizzy") return;
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      // 一圈约 900ms，营造快速眩晕感
      setDizzyPhase(((now - start) / 900) * Math.PI * 2);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [expression]);

  useEffect(() => {
    const compute = () => {
      if (expression === "shock") {
        const lx = Math.round((Math.random() * 2 - 1) * 2.2);
        const ly = Math.round((Math.random() * 2 - 1) * 2.2);
        const lKey = `${lx},${ly}`;
        if (lKey !== lastShockLRef.current) {
          lastShockLRef.current = lKey;
          setShockOffsetL({ x: lx, y: ly });
        }
        const rx = Math.round((Math.random() * 2 - 1) * 2.2);
        const ry = Math.round((Math.random() * 2 - 1) * 2.2);
        const rKey = `${rx},${ry}`;
        if (rKey !== lastShockRRef.current) {
          lastShockRRef.current = rKey;
          setShockOffsetR({ x: rx, y: ry });
        }
        return;
      }

      if (expression === "thinking") {
        const target = { x: currentParams.pupilOffsetX, y: currentParams.pupilOffsetY };
        const key = `${target.x},${target.y}`;
        if (key !== lastSnappedRef.current) {
          lastSnappedRef.current = key;
          setPupilOffset(target);
        }
        return;
      }

      let rawX = 0, rawY = 0;
      const mouseIdle = Date.now() - lastInteractionRef.current > 3000;
      // 实时读取触发器位置（拖拽/吸附后位置会变，不能依赖缓存的 rect）
      const liveRect = triggerRef.current?.getBoundingClientRect() ?? triggerRect;
      if (liveRect && isFocused && !mouseIdle) {
        const centerX = liveRect.left + liveRect.width / 2;
        const centerY = liveRect.top + liveRect.height / 2;
        const dx = mousePos.x - centerX;
        const dy = mousePos.y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const rawMax = 2;
        if (dist > 0) {
          rawX = (dx / dist) * Math.min(rawMax, dist / 40);
          rawY = (dy / dist) * Math.min(rawMax, dist / 40);
        }
      } else {
        rawX = autonomousTargetRef.current.x;
        rawY = autonomousTargetRef.current.y;
      }

      const target = targetOffsetRef.current;
      const baseX = target.x !== 0 || target.y !== 0 ? target.x : rawX;
      const baseY = target.x !== 0 || target.y !== 0 ? target.y : rawY;

      const snapX = Math.round(baseX);
      const snapY = Math.round(baseY);
      const finalX = snapX + currentParams.pupilOffsetX;
      const finalY = snapY + currentParams.pupilOffsetY;

      const key = `${finalX},${finalY}`;
      if (key !== lastSnappedRef.current) {
        lastSnappedRef.current = key;
        setPupilOffset({ x: finalX, y: finalY });
      }
    };
    const timer = setInterval(compute, 140);
    compute();
    return () => clearInterval(timer);
  }, [triggerRect, isFocused, mousePos, expression, currentParams]);

  // ==========================================
  // 动态引导气泡 — 节制地出现，绝不打扰心流
  // 规则：
  //   1. 仅在未打开、无消息时显示
  //   2. 进站 6s 后首次问候一次
  //   3. 之后每 90-150s 随机闪现一句（用户活跃时也尊重——只 25% 概率弹出）
  //   4. 用户交互（移动鼠标/点击触发器）会立即消隐，并延后下次
  // ==========================================
  const hideGreeting = useCallback(() => {
    setGreeting(null);
  }, []);

  // 引导气泡显示后至少停留 10s 才自动消失；期间用户点击触发器才立即消隐
  const greetingAutoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scheduleGreetingAutoHide = useCallback(() => {
    if (greetingAutoTimerRef.current) clearTimeout(greetingAutoTimerRef.current);
    greetingAutoTimerRef.current = setTimeout(() => setGreeting(null), 10000);
  }, []);

  useEffect(() => {
    if (isOpen || messages.length > 0) {
      setGreeting(null);
      return;
    }

    // 首次问候
    if (!greetedRef.current) {
      greetedRef.current = true;
      greetingTimerRef.current = setTimeout(() => {
        setGreeting(GREETINGS[Math.floor(Math.random() * GREETINGS.length)]);
      }, 6000);
    }

    // 周期性低频闪现
    const cycle = () => {
      const delay = 90000 + Math.random() * 60000; // 90-150s
      greetingTimerRef.current = setTimeout(() => {
        // 用户正在活跃（近 5s 内有鼠标移动）→ 仅 25% 概率打扰，保护心流
        const isActive = Date.now() - lastInteractionRef.current < 5000;
        if (!isActive || Math.random() < 0.25) {
          setGreeting(GREETINGS[Math.floor(Math.random() * GREETINGS.length)]);
          // 自动消隐（至少停留 10s，而不是原先的 6s）
          scheduleGreetingAutoHide();
        }
        cycle();
      }, delay);
    };
    cycle();

    return () => {
      if (greetingTimerRef.current) clearTimeout(greetingTimerRef.current);
      if (greetingAutoTimerRef.current) clearTimeout(greetingAutoTimerRef.current);
    };
  }, [isOpen, messages.length, scheduleGreetingAutoHide]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      hideGreeting();
      setTimeout(() => inputRef.current?.focus(), 300);
    } else {
      setShowCategoryPanel(false);
      setActiveCategory(null);
    }
  }, [isOpen, hideGreeting]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  const handleCopy = useCallback(async (content: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageIdx(idx);
      setTimeout(() => setCopiedMessageIdx(null), 2000);
    } catch (err) {
      console.error("复制失败:", err);
    }
  }, []);

  const handleClear = useCallback(() => {
    setMessages([]);
    setConnectionStatus("idle");
  }, []);

  const handleSend = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: text.trim(), timestamp: Date.now() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setShowCategoryPanel(false);
    setActiveCategory(null);
    setIsLoading(true);
    setIsThinking(true);
    setConnectionStatus("connecting");
    setIsOpen(true);

    setMessages((prev) => [...prev, { role: "assistant", content: "", timestamp: Date.now(), isStreaming: true }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, projectId: currentProjectId, contextType }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "未知错误" }));
        throw new Error(errorData.error || `请求失败 (${res.status})`);
      }

      if (!res.body) throw new Error("No response body");

      setConnectionStatus("connected");
      setIsThinking(false);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let aiText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ") && line !== "data:[DONE]") {
            try {
              const data = JSON.parse(line.slice(6));
              const content = data.choices[0]?.delta?.content || "";
              aiText += content;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = { ...updated[updated.length - 1], content: aiText, isStreaming: true };
                return updated;
              });
            } catch {
              /* ignore parse errors */
            }
          }
        }
      }

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { ...updated[updated.length - 1], isStreaming: false };
        return updated;
      });
    } catch (error) {
      console.error("Chat error:", error);
      setIsThinking(false);
      setConnectionStatus("error");
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: error instanceof Error ? error.message : "网络似乎有点问题，请稍后再试。",
          timestamp: Date.now(),
          isStreaming: false,
          error: true,
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, currentProjectId, contextType]);

  const handleRetry = useCallback(() => {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    if (lastUserMsg) {
      setMessages((prev) => prev.slice(0, -1));
      handleSend(lastUserMsg.content);
    }
  }, [messages, handleSend]);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
  };

  // ==========================================
  // 拖拽贴边
  // ==========================================
  // SSR 安全：服务端用占位值，hook 内部会在 mount 后修正
  const hasWindow = typeof window !== "undefined";
  const copilotRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelPos, setPanelPos] = useState<{ left: number; top: number } | null>(null);
  const drag = useDraggableSnap(
    copilotRef,
    hasWindow ? window.innerWidth - 56 : 0, // 左上角语义：留出 56px 触发器宽度
    hasWindow ? window.innerHeight - 240 : 0, // 默认靠下，距离底部 240px
  );

  // 触发器视觉中心（仅用于语义参考，当前未直接消费）
  // const triggerCenterX = drag.position.x + 32;

  // 聊天面板定位：脱离 transform 容器，独立 fixed，智能选择左右翻向
  // 触发器贴右侧 → 面板展开到触发器左边；贴左侧 → 展开到右边
  useEffect(() => {
    if (!isOpen) {
      setPanelPos(null);
      return;
    }
    const compute = () => {
      const PANEL_W = 480;
      const GAP = 14;
      const isMobile = window.innerWidth < 768;
      const MOBILE_W = window.innerWidth - 32;
      const panelW = isMobile ? MOBILE_W : PANEL_W;
      const triggerW = copilotRef.current?.offsetWidth ?? 56;

      let left: number;
      if (isMobile) {
        left = 16; // 移动端居左，留 16px
      } else if (drag.snapSide === "right") {
        // 贴右：面板展开到触发器左侧
        left = drag.position.x - panelW - GAP;
        if (left < 16) left = Math.max(16, drag.position.x + triggerW + GAP); // 不够空间则换右侧
      } else {
        // 贴左：面板展开到触发器右侧
        left = drag.position.x + triggerW + GAP;
        if (left + panelW > window.innerWidth - 16) {
          left = Math.max(16, drag.position.x - panelW - GAP);
        }
      }

      // 垂直：面板与触发器顶部对齐，上下 clamp
      const panelH = isMobile ? Math.min(window.innerHeight * 0.7, 600) : Math.min(window.innerHeight * 0.75, 700);
      let top = drag.position.y;
      // 当触发器被拖拽到屏幕偏下时，面板顶部若与触发器对齐会让底部输入框被视口底部遮挡。
      // 此时让面板底部对齐视口底部安全区，确保输入框始终可见。
      const maxTop = window.innerHeight - panelH - 16;
      if (top > maxTop) top = maxTop;
      if (top < 16) top = 16;
      setPanelPos({ left, top });
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [isOpen, drag.position.x, drag.position.y, drag.snapSide]);

  // 点击触发器：消隐气泡 + 打开/关闭
  // 注意：移动端拖拽松手后浏览器会补发一个 click 事件，若不抑制会导致"拖一下就误打开/关闭面板"。
  // useDraggableSnap 在拖拽结束时会把 justDraggedRef 置 true（50ms 后复位），此处据此过滤。
  const handleToggle = useCallback(() => {
    if (drag.justDraggedRef.current) return;
    hideGreeting();
    setIsOpen((v) => !v);
    lastInteractionRef.current = Date.now();
  }, [hideGreeting, drag.justDraggedRef]);

  return (
    <>
    {/* ========================================== */}
    {/* 1. 触发器（可拖拽气泡）— 独立 fixed，仅承载拖拽 */}
    {/* ========================================== */}
    <motion.div
      ref={copilotRef}
      onPointerDown={drag.onPointerDown}
      // 位置完全由 MotionValue 驱动（见 use-draggable-snap），拖拽期间 set 不触发重渲染，
      // 彻底避免 Framer 用旧 state 复位 transform 导致"拖拽时气泡不动"。
      // hydration 安全：mounted=false 时保持与 SSR 一致的初始状态（不可见、不定位），
      // 避免 useLayoutEffect 提前写入 MotionValue 触发 hydration mismatch，
      // 进而导致 React 放弃该子树事件绑定（点击/hover 全失灵）。
      style={{
        x: drag.mounted ? drag.x : 0,
        y: drag.mounted ? drag.y : 0,
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 2147483000,
        touchAction: "none",
        cursor: drag.isDragging ? "grabbing" : undefined,
        pointerEvents: drag.mounted ? "auto" : "none",
        userSelect: "none",
        width: bubbleSize,
        height: bubbleSize,
        willChange: "transform",
        visibility: drag.mounted ? "visible" : "hidden",
      }}
    >
      {/* 拟人化眼睛触发器 */}
      <div
        ref={triggerRef}
        className="relative group cursor-pointer flex items-center justify-center"
        style={{ width: bubbleSize, height: bubbleSize }}
        onClick={handleToggle}
        onMouseEnter={hideGreeting}
        role="button"
        tabIndex={0}
        aria-label={isOpen ? "关闭 AI 助手" : "打开 AI 助手"}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggle();
          }
        }}
      >
        {/* 外层光晕 */}
        <motion.div
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-[-20%] bg-gradient-to-tr from-blue-500/30 via-indigo-500/20 to-purple-500/30 rounded-full blur-[18px]"
        />

        {/* 玻璃外壳 — 呼吸浮动，随气泡尺寸缩放 */}
        <motion.div
          animate={{ y: [0, -currentParams.breatheAmplitude, 0] }}
          transition={{ duration: currentParams.breatheDuration, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 bg-zinc-950/95 backdrop-blur-2xl border border-white/15 rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:border-white/30 group-hover:shadow-[0_8px_40px_rgba(59,130,246,0.3)] group-focus:ring-2 group-focus:ring-blue-500/50"
          style={{ width: Math.round(bubbleSize * 0.875), height: Math.round(bubbleSize * 0.875) }}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-5 h-5 text-white/90" />
              </motion.div>
            ) : (
              <motion.div
                key="eyes"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.25 }}
                className="relative flex items-center"
                style={{ gap: `${currentParams.eyeGap}px` }}
              >
                <Eye
                  expression={expression}
                  pupilOffset={pupilOffset}
                  shockOffset={shockOffsetL}
                  side="left"
                  params={currentParams}
                  dizzyPhase={dizzyPhase}
                />
                <Eye
                  expression={expression}
                  pupilOffset={pupilOffset}
                  shockOffset={shockOffsetR}
                  side="right"
                  params={currentParams}
                  dizzyPhase={dizzyPhase}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 动态引导气泡 — 方向跟随贴边侧翻转 */}
        <AnimatePresence>
          {!isOpen && greeting && (
            <motion.button
              key={greeting}
              type="button"
              onClick={handleToggle}
              initial={{ opacity: 0, x: drag.snapSide === "right" ? -10 : 10, scale: 0.85 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: drag.snapSide === "right" ? -10 : 10, scale: 0.85 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              className={`absolute top-1/2 -translate-y-1/2 whitespace-nowrap cursor-pointer ${
                drag.snapSide === "right" ? "right-[130%]" : "left-[130%]"
              }`}
            >
              <div className="bg-zinc-900/90 backdrop-blur-md border border-zinc-700/50 text-zinc-200 text-xs font-medium px-4 py-2 rounded-full flex items-center gap-2 shadow-2xl hover:border-blue-500/50 transition-colors">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span className="tracking-wide">{greeting}</span>
              </div>
            </motion.button>
          )}
        </AnimatePresence>

        {/* 连接状态指示器 */}
        {connectionStatus === "connected" && (
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-black"></div>
        )}
        {connectionStatus === "error" && (
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-black"></div>
        )}

        {/* 表情调参面板 — 切换按钮（小齿轮，固定在触发器左上）
            暂时隐藏（保留代码，需要时把 hidden 去掉即可恢复） */}
        <button
          type="button"
          hidden
          onClick={(e) => {
            e.stopPropagation();
            setShowTuning((v) => !v);
          }}
          aria-label="表情调参面板"
          title="表情调参面板"
          className="absolute -top-1 -left-1 z-20 w-5 h-5 rounded-full bg-zinc-900/95 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-blue-400 hover:border-blue-500/50 transition-colors"
        >
          <SlidersHorizontal className="w-2.5 h-2.5" />
        </button>
      </div>
    </motion.div>

    {/* ========================================== */}
    {/* 1.5 表情调参面板 — 独立 fixed，脱离拖拽容器 */}
    {/* 开发调试用：实时调整每个表情的眼部参数，大范围滑块 */}
    {/* 贴在触发器旁侧展开，与头像气泡保持邻近 */}
    {/* ========================================== */}
    <AnimatePresence>
      {showTuning && (
        <ExpressionTuningPanel
          tuningExpr={tuningExpr}
          tuningOverrides={tuningOverrides}
          tuningEnabled={tuningEnabled}
          currentExpression={expression}
          pupilOffset={pupilOffset}
          bubbleSize={bubbleSize}
          onSelectExpr={selectTuningExpr}
          onUpdate={updateTuning}
          onReset={resetTuning}
          onToggleEnabled={(v) => setTuningEnabled(v)}
          onClose={() => setShowTuning(false)}
          onUpdateBubbleSize={setBubbleSize}
          snapSide={drag.snapSide}
          triggerX={drag.position.x}
          triggerY={drag.position.y}
          triggerW={copilotRef.current?.offsetWidth ?? 56}
        />
      )}
    </AnimatePresence>

    {/* ========================================== */}
    {/* 2. 聊天面板 — 独立 fixed，脱离拖拽 transform 容器 */}
    {/* ========================================== */}
    <AnimatePresence>
      {isOpen && panelPos && (
          <motion.div
            ref={panelRef}
            onPointerMove={(e) => {
              // 窗口内鼠标移动也更新眼珠跟踪位置（window mousemove 在 z-index 更高的面板上仍会触发，
              // 但 pointer 事件更稳，双保险确保窗口内鼠标位置被捕获）
              setMousePos({ x: e.clientX, y: e.clientY });
              lastInteractionRef.current = Date.now();
            }}
            onMouseMove={(e) => {
              // 兜底：某些浏览器对 pointermove 合并/节流，mousemove 更可靠
              setMousePos({ x: e.clientX, y: e.clientY });
              lastInteractionRef.current = Date.now();
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed z-[2147483600] w-[calc(100vw-32px)] md:w-[480px] h-[70vh] md:h-[75vh] max-h-[800px] bg-zinc-950/95 backdrop-blur-3xl border border-zinc-800/80 shadow-[0_0_80px_rgba(0,0,0,0.8)] rounded-3xl overflow-hidden flex flex-col"
            style={{ top: `${panelPos.top}px`, left: `${panelPos.left}px` }}
            role="dialog"
            aria-label="AI 助手对话"
          >
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-zinc-800/80 bg-gradient-to-r from-zinc-900/60 via-zinc-900/30 to-transparent flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MiniAvatar
                  expression={expression}
                  pupilOffset={pupilOffset}
                  shockOffsetL={shockOffsetL}
                  shockOffsetR={shockOffsetR}
                  params={currentParams}
                  dizzyPhase={dizzyPhase}
                  connectionStatus={connectionStatus}
                />
                <div>
                  <div className="text-sm font-bold text-zinc-100 tracking-wide flex items-center gap-2">
                    {headerTitle}
                    <span className="px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[9px] font-mono text-blue-400 font-medium">AI</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono flex items-center gap-1.5 mt-0.5">
                    <Activity className="w-2.5 h-2.5" />
                    {connectionStatus === "error" ? "连接异常" :
                     connectionStatus === "connected" ? "DeepSeek · 在线" :
                     connectionStatus === "connecting" ? "连接中..." :
                     "DeepSeek Powered · 就绪"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={handleClear}
                    className="p-2 rounded-lg hover:bg-zinc-800/60 text-zinc-500 hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    aria-label="清空对话"
                    title="清空对话"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-zinc-800/60 text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  aria-label="关闭"
                  title="关闭"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat History */}
            <div className="relative flex-1 min-h-0">
              {/* 顶部渐变遮罩 — 滚动时首条消息淡入感 */}
              <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-zinc-950/95 to-transparent z-10 pointer-events-none" />
              <div className="h-full p-4 md:p-5 overflow-y-auto custom-scrollbar space-y-4">
              {messages.length === 0 ? (
                <div className="text-center mt-8 flex flex-col items-center">
                  <div className="relative w-20 h-20 mb-5 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-500/20 blur-xl animate-pulse"></div>
                    <Sparkles className="relative w-8 h-8 text-blue-400" />
                  </div>
                  <p className="text-zinc-200 text-sm font-semibold mb-1.5">您好，我是倪城的 AI 设计助理</p>
                  <p className="text-zinc-500 text-xs leading-relaxed max-w-[85%]">{emptyHint}</p>
                  <div className="flex flex-wrap gap-1.5 mt-4 justify-center">
                    {(contextType === "project-detail"
                      ? ["业务价值", "设计思考", "团队协作"]
                      : ["网站介绍", "简历经历", "作品总结"]
                    ).map((tag) => (
                      <span key={tag} className="px-2 py-0.5 text-[10px] font-mono text-zinc-500 bg-zinc-900/60 border border-zinc-800 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-3 group/msg ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                        <MiniAvatar
                          expression={expression}
                          pupilOffset={pupilOffset}
                          shockOffsetL={shockOffsetL}
                          shockOffsetR={shockOffsetR}
                          params={currentParams}
                          dizzyPhase={dizzyPhase}
                          connectionStatus={connectionStatus}
                          size="sm"
                        />
                      </div>
                    )}
                    <div className={`max-w-[85%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                      <div className={`relative px-4 py-3 text-sm rounded-2xl leading-relaxed ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white rounded-tr-md shadow-md shadow-blue-600/20"
                          : msg.error
                          ? "bg-red-950/40 border border-red-800/40 text-red-200 rounded-tl-md"
                          : "bg-zinc-900/80 border border-zinc-800 text-zinc-200 rounded-tl-md"
                      }`}>
                        {msg.role === "assistant" ? (
                          msg.content ? (
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                p: (props) => <p className="leading-7 first:mt-0 last:mb-0" {...props} />,
                                strong: (props) => <strong className="font-semibold text-blue-300" {...props} />,
                                ul: (props) => <ul className="list-disc pl-5 space-y-1.5 text-zinc-300 my-2" {...props} />,
                                ol: (props) => <ol className="list-decimal pl-5 space-y-1.5 text-zinc-300 my-2" {...props} />,
                                li: (props) => <li className="marker:text-blue-500" {...props} />,
                                h1: (props) => <h1 className="text-white font-bold text-base mt-3 mb-1.5" {...props} />,
                                h2: (props) => <h2 className="text-white font-bold text-sm mt-3 mb-1" {...props} />,
                                h3: (props) => <h3 className="text-white font-bold text-sm mt-2 mb-1" {...props} />,
                                h4: (props) => <h4 className="text-white font-semibold text-xs mt-2 mb-1" {...props} />,
                                code: ({ className, ...props }) => {
                                  const isBlock = className?.includes("language-");
                                  if (isBlock) {
                                    return (
                                      <div className="relative my-2 group/code">
                                        <pre className="bg-black/60 border border-zinc-800 rounded-lg p-3 overflow-x-auto">
                                          <code className="text-xs font-mono text-blue-300" {...props} />
                                        </pre>
                                      </div>
                                    );
                                  }
                                  return <code className="px-1.5 py-0.5 rounded bg-black/40 text-blue-300 text-xs font-mono" {...props} />;
                                },
                                blockquote: (props) => (
                                  <blockquote className="border-l-2 border-blue-500/50 pl-3 italic text-zinc-400 my-2" {...props} />
                                ),
                                a: (props) => (
                                  <a className="text-blue-400 hover:text-blue-300 underline underline-offset-2" target="_blank" rel="noopener noreferrer" {...props} />
                                ),
                              }}
                            >
                              {msg.content}
                            </ReactMarkdown>
                          ) : isThinking ? (
                            <div className="flex items-center gap-2 py-1">
                              <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                              </div>
                              <span className="text-xs text-zinc-500 font-mono">思考中...</span>
                            </div>
                          ) : (
                            <span className="w-2 h-4 bg-blue-500 inline-block animate-pulse"></span>
                          )
                        ) : (
                          <p>{msg.content}</p>
                        )}
                        {msg.isStreaming && msg.content && (
                          <span className="inline-block w-1.5 h-4 bg-blue-500 ml-0.5 animate-pulse align-middle"></span>
                        )}
                      </div>

                      <div className={`flex items-center gap-2 px-1 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <span className="text-[9px] font-mono text-zinc-600 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {formatTime(msg.timestamp)}
                        </span>
                        {msg.role === "assistant" && msg.content && !msg.isStreaming && (
                          <>
                            <button
                              onClick={() => handleCopy(msg.content, i)}
                              className="opacity-0 group-hover/msg:opacity-100 transition-opacity p-1 rounded hover:bg-zinc-800 text-zinc-600 hover:text-zinc-400"
                              aria-label="复制消息"
                              title="复制"
                            >
                              {copiedMessageIdx === i ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                            {msg.error && (
                              <button
                                onClick={handleRetry}
                                className="opacity-0 group-hover/msg:opacity-100 transition-opacity p-1 rounded hover:bg-zinc-800 text-zinc-600 hover:text-zinc-400 flex items-center gap-1"
                                aria-label="重试"
                                title="重试"
                              >
                                <RefreshCw className="w-3 h-3" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
              <div ref={chatEndRef} />
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 bg-gradient-to-t from-zinc-950 via-zinc-950/95 to-zinc-950/80 border-t border-zinc-800/80 space-y-3">
              <AnimatePresence>
                {showCategoryPanel && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-3 gap-2 p-1">
                      {promptCategories.map((cat, idx) => {
                        const Icon = cat.icon;
                        const colors = COLOR_MAP[cat.color as keyof typeof COLOR_MAP];
                        const isActive = activeCategory === idx;
                        return (
                          <div key={idx} className="space-y-1.5">
                            <button
                              onClick={() => setActiveCategory(isActive ? null : idx)}
                              className={`flex items-center gap-1.5 px-2 py-1.5 w-full rounded-lg border transition-all ${
                                isActive
                                  ? `${colors.bg} ${colors.border}`
                                  : "bg-zinc-900/40 border-zinc-800 hover:bg-zinc-800/40"
                              }`}
                            >
                              <Icon className={`w-3 h-3 ${isActive ? colors.text : "text-zinc-500"}`} />
                              <span className={`text-[10px] font-mono uppercase tracking-wider ${
                                isActive ? colors.text : "text-zinc-500"
                              }`}>{cat.label}</span>
                            </button>
                            {(isActive || activeCategory === null) && cat.prompts.map((p, i) => (
                              <button
                                key={i}
                                onClick={() => handleSend(p)}
                                className="block w-full text-left px-2 py-1.5 bg-zinc-900/40 hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 text-[11px] rounded-lg transition-colors leading-snug border border-transparent hover:border-zinc-700"
                              >
                                {p}
                              </button>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {messages.length === 0 && (
                <button
                  onClick={() => setShowCategoryPanel(!showCategoryPanel)}
                  className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-mono text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/30 rounded"
                  aria-pressed={showCategoryPanel}
                >
                  <ChevronDown className={`w-3 h-3 transition-transform ${showCategoryPanel ? "rotate-180" : ""}`} />
                  {showCategoryPanel ? "收起分类" : "查看所有分类指令"}
                </button>
              )}

              <div className="relative flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
                    placeholder={placeholder}
                    aria-label="输入问题"
                    className="w-full bg-zinc-900/80 border border-zinc-800 rounded-full pl-5 pr-14 py-3 text-sm text-zinc-100 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-zinc-600"
                  />
                  <button
                    onClick={() => handleSend(input)}
                    disabled={!input.trim() || isLoading}
                    aria-label="发送消息"
                    className={`absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                      input.trim() && !isLoading
                        ? "bg-blue-600 text-white hover:bg-blue-500 hover:scale-110"
                        : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                    }`}
                  >
                    <Send className="w-4 h-4 ml-0.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-mono text-zinc-700 tracking-wider flex items-center gap-1">
                    <kbd className="px-1 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-500">ENTER</kbd>
                    发送
                  </span>
                </div>
                {isLoading ? (
                  <span className="text-[9px] font-mono text-blue-400 tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                    生成中
                  </span>
                ) : connectionStatus === "error" ? (
                  <span className="text-[9px] font-mono text-red-400 tracking-wider flex items-center gap-1.5">
                    <AlertCircle className="w-2.5 h-2.5" />
                    连接异常
                  </span>
                ) : (
                  <span className="text-[9px] font-mono text-zinc-700 tracking-wider flex items-center gap-1">
                    由 DeepSeek 驱动
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ==========================================
// MiniAvatar — 窗口内的小型 AI 动态气泡头像（复用 Eye 系统，按比例缩放）
// 在 Header / 空状态 / 消息列表中作为助手标识，与外部触发气泡视觉同源。
// ==========================================
const MINI_PRESETS = {
  md: { wrap: 40, eye: 14, gap: 2, glow: 0.35 },
  sm: { wrap: 32, eye: 11, gap: 2, glow: 0.3 },
  lg: { wrap: 64, eye: 18, gap: 3, glow: 0.45 },
} as const;

function MiniAvatar({
  expression,
  pupilOffset,
  shockOffsetL,
  shockOffsetR,
  params,
  dizzyPhase,
  connectionStatus,
  size = "md",
}: {
  expression: Expression;
  pupilOffset: { x: number; y: number };
  shockOffsetL: { x: number; y: number };
  shockOffsetR: { x: number; y: number };
  params: EyeParams;
  dizzyPhase: number;
  connectionStatus: "idle" | "connecting" | "connected" | "error";
  size?: keyof typeof MINI_PRESETS;
}) {
  const preset = MINI_PRESETS[size];
  // 按比例缩放眼白尺寸，保持与外部触发器一致的视觉语言
  const scale = preset.eye / params.eyeWhiteW;
  const miniParams: EyeParams = {
    ...params,
    eyeWhiteW: Math.round(params.eyeWhiteW * scale),
    eyeWhiteH: Math.round(params.eyeWhiteH * scale),
    pupilW: Math.round(params.pupilW * scale),
    pupilH: Math.round(params.pupilH * scale),
    eyeGap: preset.gap,
    // 呼吸幅度按比例缩小，避免在小尺寸下抖动过大
    breatheAmplitude: Math.max(2, params.breatheAmplitude * scale * 0.6),
  };
  return (
    <div className={`relative flex items-center justify-center rounded-full bg-zinc-950/95 border border-white/15 shadow-[0_4px_18px_rgba(0,0,0,0.45)]`}
      style={{ width: preset.wrap, height: preset.wrap }}
    >
      {/* 外层光晕 */}
      <motion.div
        animate={{ opacity: [preset.glow * 0.7, preset.glow, preset.glow * 0.7] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-[-25%] bg-gradient-to-tr from-blue-500/30 via-indigo-500/20 to-purple-500/30 rounded-full blur-[10px] pointer-events-none"
      />
      {/* 玻璃外壳 — 呼吸浮动 */}
      <motion.div
        animate={{ y: [0, -miniParams.breatheAmplitude, 0] }}
        transition={{ duration: miniParams.breatheDuration, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 flex items-center"
        style={{ gap: `${miniParams.eyeGap}px` }}
      >
        <Eye
          expression={expression}
          pupilOffset={pupilOffset}
          shockOffset={shockOffsetL}
          side="left"
          params={miniParams}
          dizzyPhase={dizzyPhase}
        />
        <Eye
          expression={expression}
          pupilOffset={pupilOffset}
          shockOffset={shockOffsetR}
          side="right"
          params={miniParams}
          dizzyPhase={dizzyPhase}
        />
      </motion.div>
      {/* 连接状态指示器 */}
      {size !== "sm" && (
        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-zinc-950 ${
          connectionStatus === "error" ? "bg-red-500" :
          connectionStatus === "connected" ? "bg-emerald-500" :
          "bg-amber-500 animate-pulse"
        }`}></div>
      )}
    </div>
  );
}

// ==========================================
// Eye 组件 — 拟人化眼睛
// ==========================================
type Expression =
  | "idle" | "blink" | "happy" | "yawn" | "bored" | "sleepy" | "dizzy" | "thinking" | "shock"
  | "wink" | "angry" | "money" | "disdain" | "arrogant" | "pitiful" | "love" | "nod"
  | "silly" | "shiver";

interface EyeParams {
  eyeWhiteW: number;
  eyeWhiteH: number;
  pupilW: number;
  pupilH: number;
  eyeGap: number;
  pupilOffsetX: number;
  pupilOffsetY: number;
  blinkScaleY: number;
  blinkDuration: number;
  halfClosedScaleY: number;
  breatheAmplitude: number;
  breatheDuration: number;
  pupilScale: number;
  // 眼白跟随眼珠偏移的比例（0=不跟随，1=完全同步），建议 0.3~0.4
  eyeWhiteFollowRatio: number;
  // 上眼皮旋转角度（幅度，度）。仅对"情绪化"表情生效（可怜/生气/轻蔑/傲慢/傻），
  // 困倦系列（哈欠/无聊/困倦）不旋转，故面板对其隐藏此项。
  eyelidRotate: number;
}

const BASE_PARAMS: EyeParams = {
  eyeWhiteW: 18, // 基础眼白宽度，建议 18px 左右，根据实际需求调整
  eyeWhiteH: 23, // 基础眼白高度，建议 23px 左右，根据实际需求调整
  pupilW: 16, // 基础瞳孔宽度，建议 16px 左右，根据实际需求调整
  pupilH: 20, // 基础瞳孔高度，建议 20px 左右，根据实际需求调整
  eyeGap: 3, // 基础眼白+瞳孔间距，建议 3px 左右，根据实际需求调整
  pupilOffsetX: 0, // 基础瞳孔水平偏移，建议 0 左右，根据实际需求调整
  pupilOffsetY: 0, // 基础瞳孔垂直偏移，建议 0 左右，根据实际需求调整
  blinkScaleY: 0.2, // 基础眨眼高度缩放，建议 0.2 左右，根据实际需求调整
  blinkDuration: 80, // 基础眨眼持续时间，建议 80ms 左右，根据实际需求调整
  halfClosedScaleY: 0.4, // 基础半闭眼高度缩放，建议 0.4 左右，根据实际需求调整
  breatheAmplitude: 8, // 基础呼吸幅度，建议 8px 左右，根据实际需求调整
  breatheDuration: 2, // 基础呼吸持续时间，建议 2s 左右，根据实际需求调整
  pupilScale: 1, // 基础瞳孔缩放，建议 1 左右，根据实际需求调整
  eyeWhiteFollowRatio: 1, // 基础眼白跟随眼珠偏移的比例，建议 0.3~0.4
  eyelidRotate: 0, // 基础眼皮旋转角度，建议 0 度，根据实际需求调整
};

const EXPRESSION_PARAMS: Record<Expression, EyeParams> = {// 情绪化参数参数
  idle:     { ...BASE_PARAMS, blinkScaleY: 0.65 },// 空闲状态：眨眼高度缩放 0.65，半闭眼高度缩放 0.4
  blink:    { ...BASE_PARAMS, blinkScaleY: 1 },// 眨眼状态：眨眼高度缩放 1，半闭眼高度缩放 0.4
  happy:    { ...BASE_PARAMS, eyeWhiteW: 13.5, eyeWhiteH: 14, eyeGap: 4 },// 快乐状态：眼白宽 13.5，眼白高 14，眼间距 4
  yawn:     { ...BASE_PARAMS, blinkScaleY: 1, halfClosedScaleY: 0.68 },// 哈欠状态：眨眼高度缩放 1，半闭眼高度缩放 0.68
  bored:    { ...BASE_PARAMS, blinkScaleY: 1, halfClosedScaleY: 0.24 },// 无聊状态：眨眼高度缩放 1，半闭眼高度缩放 0.24
  sleepy:   { ...BASE_PARAMS, blinkScaleY: 1, halfClosedScaleY: 0.72 },// 疲倦状态：眨眼高度缩放 1，半闭眼高度缩放 0.72
  dizzy:    { ...BASE_PARAMS, eyeWhiteW: 17, eyeGap: 2 },// 候晕状态：眨眼高度缩放 0.2，半闭眼高度缩放 0.4
  thinking: { ...BASE_PARAMS, pupilOffsetX: 1, pupilOffsetY: -4, breatheAmplitude: 12, breatheDuration: 2 },// 思考状态：瞳孔水平偏移 1px，垂直偏移 -2px，呼吸幅度 12px，呼吸持续时间 2s
  shock:    { ...BASE_PARAMS, eyeWhiteW: 27, eyeWhiteH: 41, eyeGap: 2,  pupilScale: 0.6 },// 惊险状态：瞳孔缩放 0.6
  wink:     { ...BASE_PARAMS },// 亲吻状态：眨眼高度缩放 0.2，半闭眼高度缩放 0.4
  angry:    { ...BASE_PARAMS, halfClosedScaleY: 0.56, eyelidRotate: 11 },// 怒目而视状态：半闭眼高度缩放 0.56，眉毛旋转角度 11 度
  money:    { ...BASE_PARAMS, eyeWhiteW: 24, eyeWhiteH: 31, pupilScale: 0.9 },// 金钱状态：瞳孔缩放 0.9
  disdain:  { ...BASE_PARAMS, pupilOffsetY: -3, halfClosedScaleY: 0.4, },// 轻蔑状态：瞳孔垂直偏移 -3px，半闭眼高度缩放 0.4，眉毛旋转角度 8 度
  arrogant: { ...BASE_PARAMS, pupilOffsetY: 2, halfClosedScaleY: 0.55, },// 傲慢状态：瞳孔垂直偏移 2px，半闭眼高度缩放 0.55，眉毛旋转角度 6 度
  pitiful:  { ...BASE_PARAMS, pupilScale: 1.1, halfClosedScaleY: 0.35, eyelidRotate: 12 },// 可怜状态：瞳孔缩放 1.1，半闭眼高度缩放 0.35，眉毛旋转角度 12 度
  love:     { ...BASE_PARAMS, eyeWhiteW: 24, eyeWhiteH: 31, pupilScale: 0.7 },// 爱状态：瞳孔缩放 0.7
  silly:    { ...BASE_PARAMS, halfClosedScaleY: 0.3, eyelidRotate: 4 },// 傲慢状态：半闭眼高度缩放 0.3，眉毛旋转角度 4 度
  shiver:   { ...BASE_PARAMS },// 惊险状态：瞳孔缩放 0.5
  nod:      { ...BASE_PARAMS },// 点头状态：眨眼高度缩放 0.2，半闭眼高度缩放 0.4
};

function Eye({
  expression,
  pupilOffset,
  shockOffset,
  side,
  params,
  dizzyPhase,
}: {
  expression: Expression;
  pupilOffset: { x: number; y: number };
  shockOffset: { x: number; y: number };
  side: "left" | "right";
  params: EyeParams;
  dizzyPhase: number;
}) {
  const { eyeWhiteW, eyeWhiteH, pupilW, pupilH, blinkScaleY, blinkDuration, halfClosedScaleY, pupilScale, eyeWhiteFollowRatio, eyelidRotate } = params;

  const isBlinking = expression === "blink";
  const isYawn = expression === "yawn";
  const isBored = expression === "bored";
  const isSleepy = expression === "sleepy";
  const isHalfClosed = isYawn || isBored || isSleepy || expression === "angry"
    || expression === "disdain" || expression === "arrogant" || expression === "pitiful" || expression === "silly";
  const isHappy = expression === "happy";
  const isDizzy = expression === "dizzy";
  const isShock = expression === "shock";
  const isWink = expression === "wink";
  const isAngry = expression === "angry";
  const isPitifulExpr = expression === "pitiful";
  const isNod = expression === "nod";
  const isThinking = expression === "thinking";
  const isSilly = expression === "silly";
  const isShiver = expression === "shiver";

  const eyelidCoverage = isBlinking ? blinkScaleY : isHalfClosed ? halfClosedScaleY : 0;

  // 开心笑眼弧线：正确的笑眼是「两端在上、中间在下」的 U 形
  // 从左下→控制点在下方中点→右下，画出一个向下凸出的弧 (闭眼笑 ^_^ 是弧线在下)
  // 这里用 viewBox 坐标：y 越大越往下。控制点 y < 端点 y → 弧线向上凸 = ⌒ 上弧 = 笑眼
  // 注意：之前的 bug 是控制点放错了导致翻转。这里严格定义笑眼为"上凸弧"
  const drawSmileArc = (w: number, h: number) => {
    const sx = 2, sy = h * 0.62;
    const ex = w - 2, ey = h * 0.62;
    const cx = w / 2, cy = h * 0.18; // 控制点在上方 → 弧线上凸 → 笑眼
    return `M${sx} ${sy} Q${cx} ${cy} ${ex} ${ey}`;
  };

  // 开心 — 两只眼都是笑弧
  if (isHappy) {
    const w = eyeWhiteW + 6;
    const h = eyeWhiteH + 4;
    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
        <motion.path
          d={drawSmileArc(w, h)}
          fill="none"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3 }}
        />
      </svg>
    );
  }

  // 抛媚眼 — side === "right" 时右眼眯成笑弧（用户视角：闭右眼）
  // 关键：弧线必须完整画完，不能只画一半
  if (isWink && side === "right") {
    const w = eyeWhiteW + 6;
    const h = eyeWhiteH + 4;
    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
        <motion.path
          d={drawSmileArc(w, h)}
          fill="none"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3 }}
        />
      </svg>
    );
  }

  // 花痴 — 心形瞳孔，跳动频率更快
  if (expression === "love") {
    const w = eyeWhiteW;
    const h = eyeWhiteH;
    const heartSize = Math.min(pupilW, pupilH) * pupilScale;
    return (
      <div
        className="relative bg-white rounded-full overflow-hidden flex items-center justify-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]"
        style={{ width: `${w}px`, height: `${h}px` }}
      >
        <motion.svg
          width={heartSize}
          height={heartSize}
          viewBox="0 0 24 24"
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.3, 0.92, 1.22, 1] }}
          transition={{ duration: 0.35, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M12 21s-7-4.5-9.5-9C1 9 2.5 5.5 6 5.5c2 0 3 1 6 3.5 3-2.5 4-3.5 6-3.5 3.5 0 5 3.5 3.5 6.5C19 16.5 12 21 12 21z"
            fill="#ec4899"
          />
        </motion.svg>
      </div>
    );
  }

  // 见钱眼开 — 金币瞳孔，抖动 + 缩放频率更快
  if (expression === "money") {
    const w = eyeWhiteW;
    const h = eyeWhiteH;
    const coin = Math.min(pupilW, pupilH) * pupilScale;
    return (
      <div
        className="relative bg-white rounded-full overflow-hidden flex items-center justify-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]"
        style={{ width: `${w}px`, height: `${h}px` }}
      >
        <motion.div
          className="rounded-full flex items-center justify-center font-bold"
          style={{
            width: `${coin}px`,
            height: `${coin}px`,
            background: "linear-gradient(135deg, #fde047, #f59e0b)",
            border: "1px solid #b45309",
            color: "#92400e",
            fontSize: `${coin * 0.7}px`,
            lineHeight: 1,
          }}
          animate={{ rotate: [0, -14, 14, -10, 10, 0], scale: [1, 1.18, 0.9, 1.15, 1] }}
          transition={{ duration: 0.62, repeat: Infinity, ease: "easeInOut" }}
        >
          $
        </motion.div>
      </div>
    );
  }

  // 头晕 — 眼珠沿眼白内圈做圆周运动（时间相位驱动，不依赖鼠标）
  if (isDizzy) {
    const orbitRx = (eyeWhiteW - pupilW) / 2 - 3;
    const orbitRy = (eyeWhiteH - pupilH) / 2 - 3;
    // 两眼对称：右眼相位偏移 π，做出"双眼画 8 字"的眩晕错位感
    const phase = side === "left" ? dizzyPhase : dizzyPhase + Math.PI;
    const ox = Math.cos(phase) * orbitRx;
    const oy = Math.sin(phase) * orbitRy;
    return (
      <div
        className="relative bg-white rounded-full overflow-hidden flex items-center justify-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]"
        style={{ width: `${eyeWhiteW}px`, height: `${eyeWhiteH}px` }}
      >
        <motion.div
          className="bg-zinc-950 rounded-full"
          style={{ width: `${pupilW}px`, height: `${pupilH}px` }}
          animate={{ x: ox, y: oy }}
          transition={{ duration: 0.06, ease: "linear" }}
        />
      </div>
    );
  }

  // 正常眼睛 — 竖胶囊型眼白 + 瞳孔 + 上眼皮
  const offset = isShock ? shockOffset : pupilOffset;

  // ─── 思考：瞳孔先向左看再向右看，来回扫视 + 快速连眨 (thinking) ───
  // 两只眼瞳孔同向往左、再往右（不是斗鸡眼），配合快速眨眼显得在思索
  if (isThinking) {
    const lookX = 3; // 左右张望幅度
    const eyelidFull = eyeWhiteH;
    return (
      <div
        className="relative bg-white rounded-full overflow-hidden flex items-center justify-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]"
        style={{ width: `${eyeWhiteW}px`, height: `${eyeWhiteH}px` }}
      >
        {/* 瞳孔：同向 左→右→左 来回扫视 */}
        <motion.div
          className="bg-zinc-950 rounded-full relative"
          style={{ width: `${pupilW}px`, height: `${pupilH}px` }}
          animate={{ x: [-lookX, lookX, -lookX], y: pupilOffset.y, scale: pupilScale }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", times: [0, 0.5, 1] }}
        >
          <span className="absolute rounded-full bg-white/45" style={{ width: "25%", height: "25%", top: "18%", left: "22%" }} />
        </motion.div>
        {/* 上眼皮：快速连眨两次 —— 落下→抬起→落下→抬起，时长缩短到 0.7s */}
        <motion.div
          className="absolute top-0 left-[-2px] right-[-2px] bg-zinc-950 rounded-t-full"
          style={{ transformOrigin: "50% 0%" }}
          animate={{ height: [0, eyelidFull, 0, eyelidFull, 0] }}
          transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut", times: [0, 0.15, 0.3, 0.45, 0.6] }}
        />
      </div>
    );
  }

  // ─── 斗鸡眼向下看 + 脑袋侧倾的傻样 (silly) ───
  // 两只眼的瞳孔都向内 + 向下聚拢（斗鸡），眼皮半闭显得呆滞
  if (isSilly) {
    // 左眼瞳孔偏右下，右眼瞳孔偏左下 → 向中间鼻尖处汇聚
    const crossX = side === "left" ? 3 : -3;
    const crossY = 3;
    return (
      <motion.div
        className="relative bg-white rounded-full overflow-hidden flex items-center justify-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]"
        style={{ width: `${eyeWhiteW}px`, height: `${eyeWhiteH}px` }}
        // 脑袋侧倾：左眼逆时针、右眼顺时针，整体歪头感
        animate={{ rotate: side === "left" ? -8 : 8 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <motion.div
          className="bg-zinc-950 rounded-full relative"
          style={{ width: `${pupilW}px`, height: `${pupilH}px` }}
          initial={{ x: crossX, y: crossY, opacity: 0.7 }}
          animate={{ x: crossX, y: crossY, opacity: 0.7 }}
          transition={{ type: "tween", duration: 0.12, ease: "linear" }}
        >
          <span className="absolute rounded-full bg-white/45" style={{ width: "25%", height: "25%", top: "18%", left: "22%" }} />
        </motion.div>
        <motion.div
          className="absolute top-0 left-[-2px] right-[-2px] bg-zinc-950 rounded-t-full"
          style={{ transformOrigin: "50% 0%" }}
          animate={{ height: eyeWhiteH * halfClosedScaleY }}
          transition={{ duration: blinkDuration / 1000, ease: "easeInOut" }}
        />
      </motion.div>
    );
  }

  // ─── 打寒颤：眼白 + 眼珠左右快速颠动 (shiver) ───
  // 像小猫打寒颤，整个眼睛（眼白框 + 瞳孔一起）左右快速晃动
  if (isShiver) {
    return (
      <motion.div
        className="relative bg-white rounded-full overflow-hidden flex items-center justify-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]"
        style={{ width: `${eyeWhiteW}px`, height: `${eyeWhiteH}px` }}
        animate={{ x: [-2, 2, -2, 2, -1, 1, 0] }}
        transition={{ duration: 0.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          className="bg-zinc-950 rounded-full relative"
          style={{ width: `${pupilW}px`, height: `${pupilH}px` }}
          animate={{ x: offset.x, y: offset.y }}
          transition={{ type: "tween", duration: 0.12, ease: "linear" }}
        >
          <span className="absolute rounded-full bg-white/45" style={{ width: "25%", height: "25%", top: "18%", left: "22%" }} />
        </motion.div>
      </motion.div>
    );
  }

  // 上眼皮旋转方向（修正版）：
  //   可怜（眼皮耷拉、外角下垂）：外角下垂 →
  //     左眼（用户视角左）：外角在左 → 逆时针旋转 -7°（左低右高翻转：这里外角即左侧角往下）
  //     实际：rotate 以 transformOrigin 顶部中心，正角度顺时针。
  //     左眼外侧（左侧）下垂 = 左端低 → 顺时针无法直接表达，用 -7°（逆时针）使左侧下沉。
  //   生气（与可怜相反，内角下垂）：
  //     左眼内侧（右侧）下垂 = 右端低 → 顺时针 +7°
  // 关键修正：之前代码把可怜/生生的 deg 数值弄反了，导致旋转方向错误。
  // 增大角度到 ±12° 让情绪更明显。
  // 旋转幅度由 params.eyelidRotate 提供（可在调参面板调整），方向由表情语义决定：
  //   可怜/轻蔑：外角下垂；生气：内角下垂；傲慢/傻：轻微下垂。
  //   困倦系列（yawn/bored/sleepy）eyelidRotate=0，不旋转。
  let eyelidRotateSigned = 0;
  if (eyelidRotate > 0) {
    if (isPitifulExpr || expression === "disdain" || expression === "arrogant") {
      // 外角下垂：左眼 -、右眼 +
      eyelidRotateSigned = side === "left" ? -eyelidRotate : eyelidRotate;
    } else if (isAngry) {
      // 内角下垂：左眼 +、右眼 -
      eyelidRotateSigned = side === "left" ? eyelidRotate : -eyelidRotate;
    }
  }

  // 打哈欠 / 无聊：眼皮颤动 —— 顶部永远固定在眼白顶部（top:0），
  // 颤动只通过 height 上下拉伸/收缩实现，避免 y 平移导致顶部脱离、暴露眼白。
  const eyelidBaseH = eyeWhiteH * eyelidCoverage;
  const eyelidBounce = (isYawn || isBored)
    ? { height: [eyelidBaseH, eyelidBaseH + 2.5, eyelidBaseH - 1, eyelidBaseH + 1.5, eyelidBaseH] }
    : undefined;

  // 眼白跟随眼珠同向偏移（幅度更小）+ 整体下移 3px（不居中于头部）
  // nod：点头时眼白与眼珠整体上下运动（先向下点再回弹）
  const followX = offset.x * eyeWhiteFollowRatio;
  const followY = offset.y * eyeWhiteFollowRatio;
  const shiftDownY = 1;
  const nodMotion = isNod
    ? { y: [shiftDownY, shiftDownY - 3, shiftDownY + 2, shiftDownY], x: followX }
    : { y: followY + shiftDownY, x: followX };

  return (
    <motion.div
      className="relative bg-white rounded-full overflow-hidden flex items-center justify-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]"
      style={{ width: `${eyeWhiteW}px`, height: `${eyeWhiteH}px` }}
      animate={nodMotion}
      transition={isNod
        ? { duration: 1.4, repeat: Infinity, ease: "easeInOut" }
        : { type: "tween", duration: 0.12, ease: "linear" }}
    >
      <motion.div
        key={`p-${offset.x}-${offset.y}`}
        className="bg-zinc-950 rounded-full relative"
        style={{ width: `${pupilW}px`, height: `${pupilH}px` }}
        initial={{ x: offset.x, y: offset.y, opacity: isHalfClosed ? 0.7 : 1, scale: pupilScale }}
        animate={{ x: offset.x, y: offset.y, opacity: isHalfClosed ? 0.7 : 1, scale: pupilScale }}
        transition={{ type: "tween", duration: 0.12, ease: "linear" }}
      >
        <span className="absolute rounded-full bg-white/45" style={{ width: "25%", height: "25%", top: "18%", left: "22%" }} />
      </motion.div>
      <motion.div
        className="absolute top-0 left-[-2px] right-[-2px] bg-zinc-950 rounded-t-full"
        style={{ transformOrigin: "50% 0%" }}
        animate={{
          height: eyelidBounce ? undefined : eyeWhiteH * eyelidCoverage,
          rotate: eyelidRotateSigned,
          ...(eyelidBounce ?? {}),
        }}
        transition={eyelidBounce
          ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
          : { duration: blinkDuration / 1000, ease: "easeInOut" }}
      />
      {/* 委屈泪滴：pitiful 外眼角挂一颗泪，从眼皮下缘滑落 */}
      {isPitifulExpr && (
        <motion.span
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${Math.max(2.5, eyeWhiteW * 0.18)}px`,
            height: `${Math.max(2.5, eyeWhiteW * 0.18)}px`,
            background: "radial-gradient(circle at 35% 30%, #bfdbfe, #60a5fa 70%, #3b82f6)",
            boxShadow: "0 0 2px rgba(59,130,246,0.5)",
            // 外眼角：左眼贴左下、右眼贴右下
            [side === "left" ? "left" : "right"]: `${eyeWhiteW * 0.06}px`,
            top: `${eyeWhiteH * 0.5}px`,
          }}
          initial={{ y: -2, opacity: 0, scaleY: 0.6 }}
          animate={{ y: [0, eyeWhiteH * 0.45, eyeWhiteH * 0.6], opacity: [0, 1, 0.85], scaleY: [0.6, 1, 1.25] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeIn", repeatDelay: 0.8 }}
        />
      )}
    </motion.div>
  );
}

// ==========================================
// 表情调参面板 ExpressionTuningPanel
// 开发调试用：浮动在屏幕一侧，实时调整表情的眼部参数
// ==========================================

// 滑块定义：每个 EyeParams 字段的可调范围、步长、单位与说明
type SliderDef = {
  key: keyof EyeParams;
  label: string;
  min: number;
  max: number;
  step: number;
  hint: string;
};

const TUNING_SLIDERS: SliderDef[] = [
  { key: "eyeWhiteW",        label: "眼白宽",       min: 8,   max: 40,  step: 0.5, hint: "眼白椭圆的宽度" },
  { key: "eyeWhiteH",        label: "眼白高",       min: 10,  max: 48,  step: 0.5, hint: "眼白椭圆的高度" },
  { key: "pupilW",           label: "瞳孔宽",       min: 4,   max: 36,  step: 0.5, hint: "瞳孔宽度" },
  { key: "pupilH",           label: "瞳孔高",       min: 5,   max: 40,  step: 0.5, hint: "瞳孔高度" },
  { key: "eyeGap",           label: "眼间距",       min: 0,   max: 16,  step: 0.5, hint: "两眼之间的水平间距" },
  { key: "pupilOffsetX",     label: "瞳孔偏移 X",   min: -10, max: 10,  step: 0.5, hint: "瞳孔水平固定偏移" },
  { key: "pupilOffsetY",     label: "瞳孔偏移 Y",   min: -10, max: 10,  step: 0.5, hint: "瞳孔垂直固定偏移" },
  { key: "blinkScaleY",      label: "眨眼覆盖",     min: 0,   max: 1,   step: 0.02, hint: "眨眼时眼皮高度占比 (0=全闭,1=不闭)" },
  { key: "blinkDuration",    label: "眨眼时长",     min: 20,  max: 500, step: 5,   hint: "单次眨眼动画时长 (ms)" },
  { key: "halfClosedScaleY", label: "半闭眼皮",     min: 0,   max: 1,   step: 0.02, hint: "半闭表情下眼皮高度占比" },
  { key: "eyelidRotate",     label: "眼皮旋转",     min: 0,   max: 30,  step: 1,    hint: "上眼皮旋转角度（幅度，度）" },
  { key: "breatheAmplitude", label: "呼吸幅度",     min: 0,   max: 24,  step: 0.5, hint: "整体上下浮动的幅度 (px)" },
  { key: "breatheDuration",  label: "呼吸周期",     min: 0.3, max: 6,   step: 0.1, hint: "一次呼吸循环的时长 (s)" },
  { key: "pupilScale",       label: "瞳孔缩放",     min: 0.2, max: 2.5, step: 0.05, hint: "瞳孔整体缩放系数" },
  { key: "eyeWhiteFollowRatio", label: "眼白跟随",  min: 0,   max: 1,   step: 0.01, hint: "眼白跟随瞳孔偏移的比例" },
];

// 差异化调参：不同表情适用的滑块子集。未列入的字段该表情下隐藏，
// 让面板更聚焦、不被无关项干扰（如困倦不旋转、纯弧线表情无瞳孔等）。
const SLIDERS_BY_EXPR: Record<Expression, (keyof EyeParams)[]> = {
  // 基础：眼白/瞳孔尺寸、间距、偏移、呼吸、跟随
  idle:     ["eyeWhiteW","eyeWhiteH","pupilW","pupilH","eyeGap","pupilOffsetX","pupilOffsetY","blinkScaleY","blinkDuration","breatheAmplitude","breatheDuration","pupilScale","eyeWhiteFollowRatio"],
  blink:    ["eyeWhiteW","eyeWhiteH","pupilW","pupilH","eyeGap","blinkScaleY","blinkDuration","pupilScale"],
  happy:    ["eyeWhiteW","eyeWhiteH","eyeGap","breatheAmplitude","breatheDuration"], // 笑弧无瞳孔
  // 困倦系列：半闭眼皮 + 颤动，无旋转
  yawn:     ["eyeWhiteW","eyeWhiteH","pupilW","pupilH","eyeGap","pupilOffsetX","pupilOffsetY","blinkDuration","halfClosedScaleY","breatheAmplitude","breatheDuration","pupilScale","eyeWhiteFollowRatio"],
  bored:    ["eyeWhiteW","eyeWhiteH","pupilW","pupilH","eyeGap","pupilOffsetX","pupilOffsetY","blinkDuration","halfClosedScaleY","breatheAmplitude","breatheDuration","pupilScale","eyeWhiteFollowRatio"],
  sleepy:   ["eyeWhiteW","eyeWhiteH","pupilW","pupilH","eyeGap","pupilOffsetX","pupilOffsetY","blinkDuration","halfClosedScaleY","breatheAmplitude","breatheDuration","pupilScale","eyeWhiteFollowRatio"],
  dizzy:    ["eyeWhiteW","eyeWhiteH","pupilW","pupilH","eyeGap","breatheAmplitude","breatheDuration","pupilScale"],
  thinking: ["eyeWhiteW","eyeWhiteH","pupilW","pupilH","eyeGap","pupilOffsetX","pupilOffsetY","blinkScaleY","blinkDuration","breatheAmplitude","breatheDuration","pupilScale","eyeWhiteFollowRatio"],
  shock:    ["eyeWhiteW","eyeWhiteH","pupilW","pupilH","eyeGap","blinkScaleY","blinkDuration","pupilScale"],
  wink:     ["eyeWhiteW","eyeWhiteH","eyeGap","breatheAmplitude","breatheDuration"],
  // 情绪化：含旋转
  angry:    ["eyeWhiteW","eyeWhiteH","pupilW","pupilH","eyeGap","pupilOffsetX","pupilOffsetY","halfClosedScaleY","eyelidRotate","breatheAmplitude","breatheDuration","pupilScale","eyeWhiteFollowRatio"],
  money:    ["eyeWhiteW","eyeWhiteH","pupilW","pupilH","eyeGap","breatheAmplitude","breatheDuration","pupilScale"],
  disdain:  ["eyeWhiteW","eyeWhiteH","pupilW","pupilH","eyeGap","pupilOffsetX","pupilOffsetY","halfClosedScaleY","eyelidRotate","breatheAmplitude","breatheDuration","pupilScale","eyeWhiteFollowRatio"],
  arrogant: ["eyeWhiteW","eyeWhiteH","pupilW","pupilH","eyeGap","pupilOffsetX","pupilOffsetY","halfClosedScaleY","eyelidRotate","breatheAmplitude","breatheDuration","pupilScale","eyeWhiteFollowRatio"],
  pitiful:  ["eyeWhiteW","eyeWhiteH","pupilW","pupilH","eyeGap","pupilOffsetX","pupilOffsetY","halfClosedScaleY","eyelidRotate","breatheAmplitude","breatheDuration","pupilScale","eyeWhiteFollowRatio"],
  love:     ["eyeWhiteW","eyeWhiteH","pupilW","pupilH","eyeGap","breatheAmplitude","breatheDuration","pupilScale"],
  nod:      ["eyeWhiteW","eyeWhiteH","pupilW","pupilH","eyeGap","pupilOffsetX","pupilOffsetY","blinkScaleY","blinkDuration","breatheAmplitude","breatheDuration","pupilScale","eyeWhiteFollowRatio"],
  silly:    ["eyeWhiteW","eyeWhiteH","pupilW","pupilH","eyeGap","pupilOffsetX","pupilOffsetY","halfClosedScaleY","eyelidRotate","breatheAmplitude","breatheDuration","pupilScale","eyeWhiteFollowRatio"],
  shiver:   ["eyeWhiteW","eyeWhiteH","pupilW","pupilH","eyeGap","pupilOffsetX","pupilOffsetY","breatheAmplitude","breatheDuration","pupilScale"],
};

const EXPRESSION_LIST: Expression[] = [
  "idle", "blink", "happy", "yawn", "bored", "sleepy", "dizzy", "thinking", "shock",
  "wink", "angry", "money", "disdain", "arrogant", "pitiful", "love", "nod",
  "silly", "shiver",
];

function ExpressionTuningPanel({
  tuningExpr,
  tuningOverrides,
  tuningEnabled,
  currentExpression,
  pupilOffset,
  bubbleSize,
  onSelectExpr,
  onUpdate,
  onReset,
  onToggleEnabled,
  onClose,
  onUpdateBubbleSize,
  snapSide,
  triggerX,
  triggerY,
  triggerW,
}: {
  tuningExpr: Expression;
  tuningOverrides: Partial<EyeParams>;
  tuningEnabled: boolean;
  currentExpression: Expression;
  pupilOffset: { x: number; y: number };
  bubbleSize: number;
  onSelectExpr: (expr: Expression) => void;
  onUpdate: <K extends keyof EyeParams>(key: K, value: EyeParams[K]) => void;
  onReset: () => void;
  onToggleEnabled: (v: boolean) => void;
  onClose: () => void;
  onUpdateBubbleSize: (v: number) => void;
  snapSide: "left" | "right";
  triggerX: number;
  triggerY: number;
  triggerW: number;
}) {
  const PANEL_W = 300;
  const GAP = 12;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const panelH = Math.min(vh - 32, 560);

  // 面板紧贴触发器对侧展开（触发器靠右 → 面板出现在触发器左边）
  const isRight = snapSide === "right";
  let left: number;
  if (isRight) {
    left = triggerX - PANEL_W - GAP;
    if (left < 8) left = Math.min(8, triggerX + triggerW + GAP);
  } else {
    left = triggerX + triggerW + GAP;
    if (left + PANEL_W > (typeof window !== "undefined" ? window.innerWidth : 1200) - 8) {
      left = Math.max(8, triggerX - PANEL_W - GAP);
    }
  }
  // 垂直与触发器顶部对齐，并 clamp 到视口
  const top = Math.min(Math.max(triggerY, 16), vh - panelH - 16);

  return (
    <motion.div
      initial={{ opacity: 0, x: isRight ? -12 : 12, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: isRight ? -12 : 12, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 280, damping: 26 }}
      className="fixed w-[300px] bg-zinc-950/95 backdrop-blur-2xl border border-zinc-700/70 rounded-2xl shadow-[0_12px_60px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden"
      style={{ top: `${top}px`, left: `${left}px`, height: `${panelH}px`, zIndex: 2147483000, pointerEvents: "auto" }}
    >
      {/* 头部 */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-zinc-800/80 bg-gradient-to-r from-zinc-900/60 to-transparent flex-shrink-0">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-xs font-semibold text-zinc-100">表情调参</span>
          <label className="flex items-center gap-1 ml-1 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={tuningEnabled}
              onChange={(e) => onToggleEnabled(e.target.checked)}
              className="w-3 h-3 accent-blue-500"
            />
            <span className="text-[9px] font-mono text-zinc-500">应用</span>
          </label>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onReset}
            title="重置当前表情参数"
            className="p-1 rounded text-zinc-500 hover:text-amber-400 hover:bg-zinc-800/60 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={onClose}
            title="关闭"
            className="p-1 rounded text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 表情标签 — 横向滚动 chip，不占高度 */}
      <div className="px-3 py-2 border-b border-zinc-800/60 flex-shrink-0">
        <div className="flex flex-wrap gap-1">
          {EXPRESSION_LIST.map((expr) => (
            <button
              key={expr}
              type="button"
              onClick={() => onSelectExpr(expr)}
              className={`px-2 py-0.5 text-[10px] font-mono rounded-full transition-colors ${
                tuningExpr === expr
                  ? "bg-blue-500/20 border border-blue-500/50 text-blue-300"
                  : "bg-zinc-900/60 border border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
              }`}
            >
              {expr}
            </button>
          ))}
        </div>
        {/* 实时调试信息 */}
        <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[9px] font-mono text-zinc-600">
          <span>预览: <span className="text-blue-400">{tuningExpr}</span></span>
          <span>实际: <span className="text-zinc-400">{currentExpression}</span></span>
          <span>偏移: <span className="text-zinc-400">{pupilOffset.x},{pupilOffset.y}</span></span>
        </div>
      </div>

      {/* 滑块列表 — 唯一可滚动区，flex-1 撑满剩余高度 */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-3 py-2 space-y-2">
        {/* 气泡大小：始终可见，与具体表情无关 */}
        <div className="rounded-md bg-zinc-900/40 border border-zinc-800/60 px-2 py-1.5">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[10px] text-amber-300/90 flex items-center gap-1">气泡大小</span>
            <span className="text-[9px] font-mono text-zinc-300 tabular-nums">{bubbleSize}</span>
          </div>
          <input
            type="range"
            min={40}
            max={120}
            step={1}
            value={bubbleSize}
            onChange={(e) => onUpdateBubbleSize(Number(e.target.value))}
            className="w-full h-1 accent-amber-500 cursor-pointer"
            title="触发气泡整体尺寸（px），影响眼睛显示大小"
          />
          <div className="flex justify-between text-[8px] font-mono text-zinc-700">
            <span>40</span>
            <span className="text-zinc-600">触发器整体尺寸</span>
            <span>120</span>
          </div>
        </div>

        {/* 表情差异化参数：仅展示当前表情适用的滑块 */}
        {TUNING_SLIDERS
          .filter((s) => SLIDERS_BY_EXPR[tuningExpr].includes(s.key))
          .map((s) => {
          const baseVal = EXPRESSION_PARAMS[tuningExpr][s.key];
          const val = tuningOverrides[s.key] ?? baseVal;
          const isOverridden = tuningOverrides[s.key] !== undefined;
          return (
            <div key={s.key}>
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                  {s.label}
                  {isOverridden && <span className="w-1 h-1 rounded-full bg-amber-400" title="已手动覆盖" />}
                </span>
                <span className="text-[9px] font-mono text-zinc-300 tabular-nums">
                  {Number.isInteger(val) ? val : val.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min={s.min}
                max={s.max}
                step={s.step}
                value={val}
                onChange={(e) => onUpdate(s.key, Number(e.target.value) as EyeParams[typeof s.key])}
                className="w-full h-1 accent-blue-500 cursor-pointer"
                title={s.hint}
              />
              <div className="flex justify-between text-[8px] font-mono text-zinc-700">
                <span>{s.min}</span>
                <span className="text-zinc-600">{s.hint}</span>
                <span>{s.max}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 底部：覆盖字段数 */}
      <div className="px-3 py-2 border-t border-zinc-800/80 text-[9px] font-mono text-zinc-600 flex items-center justify-between flex-shrink-0">
        <span>已覆盖 {Object.keys(tuningOverrides).length} 项</span>
        <span className="text-zinc-700">调参面板 · {SLIDERS_BY_EXPR[tuningExpr].length} 项可调</span>
      </div>
    </motion.div>
  );
}

