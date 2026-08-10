"use client";

import { Heart, MessageCircle, Send, Undo2 } from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";

type FeedbackEntry = {
  id: string;
  scope: string;
  parentId: string | null;
  author: string;
  content: string;
  createdAt: string;
  likeCount: number;
  liked: boolean;
  mine: boolean;
};

type FeedbackBoardProps = {
  scope: string;
  title?: string;
  description?: string;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

const guestNames = [
  "晨雾旅人", "星野山雀", "海盐水獭", "青柠小鹿",
  "松果访客", "云朵探索者", "木棉朋友", "蓝鲸同行者",
];

function createGuestName() {
  const index = crypto.getRandomValues(new Uint32Array(1))[0] % guestNames.length;
  const number = crypto.getRandomValues(new Uint32Array(1))[0] % 100;
  return `${guestNames[index]}${String(number).padStart(2, "0")}`;
}

function avatarStyle(name: string) {
  let hash = 0;
  for (let index = 0; index < name.length; index += 1) {
    hash = (hash * 31 + name.charCodeAt(index)) >>> 0;
  }
  const hue = hash % 360;
  return {
    backgroundColor: `hsl(${hue} 72% 90%)`,
    color: `hsl(${hue} 45% 36%)`,
  };
}

function Avatar({ name, small = false }: { name: string; small?: boolean }) {
  return (
    <span className={small ? "feedback-avatar feedback-avatar--small" : "feedback-avatar"} style={avatarStyle(name)} aria-hidden="true">
      {name.trim().slice(0, 1) || "客"}
    </span>
  );
}

export default function FeedbackBoard({
  scope,
  title = "留言与反馈",
  description = "记录问题、意见和想做的功能。点赞表示你也需要它。",
}: FeedbackBoardProps) {
  const [entries, setEntries] = useState<FeedbackEntry[]>([]);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [visitorId, setVisitorId] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const deleteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadEntries = useCallback(async (currentVisitorId: string) => {
    const response = await fetch(`/api/feedback?scope=${encodeURIComponent(scope)}&visitorId=${encodeURIComponent(currentVisitorId)}`, {
      cache: "no-store",
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "留言加载失败");
    setEntries(data.entries);
  }, [scope]);

  useEffect(() => {
    const savedVisitorId = localStorage.getItem("appbox-feedback-visitor") || crypto.randomUUID();
    const savedAuthor = localStorage.getItem("appbox-feedback-author") || createGuestName();
    localStorage.setItem("appbox-feedback-visitor", savedVisitorId);
    localStorage.setItem("appbox-feedback-author", savedAuthor);
    setVisitorId(savedVisitorId);
    setAuthor(savedAuthor);
    loadEntries(savedVisitorId)
      .catch((reason) => setError(reason instanceof Error ? reason.message : "留言加载失败"))
      .finally(() => setLoading(false));
    return () => {
      if (deleteTimer.current) clearTimeout(deleteTimer.current);
    };
  }, [loadEntries]);

  const threads = useMemo(() => entries.filter((entry) => !entry.parentId).reverse(), [entries]);
  const repliesByParent = useMemo(() => {
    return entries.reduce<Record<string, FeedbackEntry[]>>((result, entry) => {
      if (entry.parentId) (result[entry.parentId] ||= []).push(entry);
      return result;
    }, {});
  }, [entries]);

  const submitEntry = async (message: string, parentId: string | null) => {
    setSubmitting(true);
    setError("");
    try {
      const resolvedAuthor = author.trim() || createGuestName();
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scope, author: resolvedAuthor, content: message, parentId, visitorId, website: "" }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "留言保存失败");
      setAuthor(resolvedAuthor);
      localStorage.setItem("appbox-feedback-author", resolvedAuthor);
      await loadEntries(visitorId);
      window.dispatchEvent(new CustomEvent("appbox-feedback-updated", { detail: { scope } }));
      if (parentId) {
        setReplyContent("");
        setReplyingTo(null);
      } else {
        setContent("");
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "留言保存失败");
    } finally {
      setSubmitting(false);
    }
  };

  const submitMain = (event: FormEvent) => {
    event.preventDefault();
    void submitEntry(content, null);
  };

  const toggleLike = async (entry: FeedbackEntry) => {
    setEntries((current) => current.map((item) => item.id === entry.id
      ? { ...item, liked: !item.liked, likeCount: Math.max(0, item.likeCount + (item.liked ? -1 : 1)) }
      : item));
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle-like", scope, id: entry.id, visitorId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "点赞失败");
      setEntries((current) => current.map((item) => item.id === entry.id ? data.entry : item));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "点赞失败");
      void loadEntries(visitorId);
    }
  };

  const deleteEntry = async (entry: FeedbackEntry) => {
    setError("");
    setEntries((current) => current.filter((item) => item.id !== entry.id && item.parentId !== entry.id));
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", scope, id: entry.id, visitorId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "撤回失败");
      window.dispatchEvent(new CustomEvent("appbox-feedback-updated", { detail: { scope } }));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "撤回失败");
      void loadEntries(visitorId);
    }
  };

  const requestDelete = (entry: FeedbackEntry) => {
    if (confirmingDelete === entry.id) {
      if (deleteTimer.current) clearTimeout(deleteTimer.current);
      setConfirmingDelete(null);
      void deleteEntry(entry);
      return;
    }
    setConfirmingDelete(entry.id);
    if (deleteTimer.current) clearTimeout(deleteTimer.current);
    deleteTimer.current = setTimeout(() => setConfirmingDelete(null), 3000);
  };

  const renderActions = (entry: FeedbackEntry, replyTarget?: FeedbackEntry) => (
    <div className="feedback-thread__actions">
      <button type="button" aria-pressed={entry.liked} onClick={() => void toggleLike(entry)}>
        <Heart size={13} fill={entry.liked ? "currentColor" : "none"} /> {entry.likeCount || "点赞"}
      </button>
      {replyTarget && (
        <button type="button" onClick={() => { setReplyingTo(replyingTo === replyTarget.id ? null : replyTarget.id); setReplyContent(""); }}>
          <MessageCircle size={13} /> 回复{repliesByParent[replyTarget.id]?.length ? ` ${repliesByParent[replyTarget.id].length}` : ""}
        </button>
      )}
      {entry.mine && (
        <button
          type="button"
          className="feedback-action--danger"
          data-confirm={confirmingDelete === entry.id ? "" : undefined}
          onClick={() => requestDelete(entry)}
        >
          <Undo2 size={13} /> {confirmingDelete === entry.id ? "确认撤回？" : "撤回"}
        </button>
      )}
    </div>
  );

  return (
    <section className="feedback-board" aria-labelledby={`feedback-${scope.replace(":", "-")}`}>
      <header className="feedback-board__header">
        <div>
          <h2 id={`feedback-${scope.replace(":", "-")}`}>{title}</h2>
          <p>{description}</p>
        </div>
        {!loading && (
          <span className="feedback-board__count">
            <MessageCircle size={14} /> {entries.length} 条留言
          </span>
        )}
      </header>

      <form className="feedback-composer" onSubmit={submitMain}>
        <label>
          <span>你的称呼</span>
          <input value={author} onChange={(event) => setAuthor(event.target.value)} maxLength={24} placeholder="留空将自动使用随机称呼" />
        </label>
        <label>
          <span>留言内容</span>
          <textarea value={content} onChange={(event) => setContent(event.target.value)} maxLength={800} required placeholder="描述问题、建议，或者你希望出现的工具。" />
        </label>
        <input className="feedback-honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <div className="feedback-composer__footer">
          <small>{content.length}/800</small>
          <button type="submit" disabled={submitting || content.trim().length < 2}>
            <Send size={14} /> {submitting ? "保存中" : "发布留言"}
          </button>
        </div>
      </form>

      {error && <p className="feedback-board__error" role="alert">{error}</p>}

      <div className="feedback-threads" aria-live="polite">
        {loading ? (
          <div className="feedback-board__loading"><span /><span /></div>
        ) : threads.length === 0 ? (
          <div className="feedback-board__empty">
            <MessageCircle size={21} />
            <p>还没有留言。你可以写下第一条。</p>
          </div>
        ) : threads.map((entry) => (
          <article className="feedback-thread" key={entry.id}>
            <header className="feedback-thread__meta">
              <Avatar name={entry.author} />
              <div>
                <b>{entry.author}</b>
                <time dateTime={entry.createdAt}>{formatDate(entry.createdAt)}</time>
              </div>
            </header>
            <p className="feedback-thread__content">{entry.content}</p>
            {renderActions(entry, entry)}

            {repliesByParent[entry.id]?.length ? (
              <div className="feedback-thread__replies">
                {repliesByParent[entry.id].map((reply) => (
                  <div className="feedback-reply" key={reply.id}>
                    <header className="feedback-thread__meta">
                      <Avatar name={reply.author} small />
                      <div>
                        <b>{reply.author}</b>
                        <time dateTime={reply.createdAt}>{formatDate(reply.createdAt)}</time>
                      </div>
                    </header>
                    <p className="feedback-thread__content">{reply.content}</p>
                    {renderActions(reply)}
                  </div>
                ))}
              </div>
            ) : null}

            {replyingTo === entry.id && (
              <form className="feedback-reply-form" onSubmit={(event) => { event.preventDefault(); void submitEntry(replyContent, entry.id); }}>
                <label>
                  <span className="sr-only">回复 {entry.author}</span>
                  <textarea value={replyContent} onChange={(event) => setReplyContent(event.target.value)} maxLength={500} required placeholder={`回复 ${entry.author}`} />
                </label>
                <div>
                  <button type="button" onClick={() => setReplyingTo(null)}>取消</button>
                  <button type="submit" disabled={submitting || replyContent.trim().length < 2}>发布回复</button>
                </div>
              </form>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
