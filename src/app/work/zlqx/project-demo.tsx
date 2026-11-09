'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const DEMO_URL = 'https://zhipin-qianxun.netlify.app/';

export default function ProjectDemo() {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current?.showModal();
    return () => { document.body.style.overflow = previous; };
  }, [open]);
  function close() { dialog.current?.close(); setOpen(false); trigger.current?.focus(); }
  return <>
    <div className="zhipin-project__actions">
      <button ref={trigger} type="button" onClick={() => setOpen(true)}>进入交互原型 <span aria-hidden="true">↗</span></button>
      <a href={DEMO_URL} target="_blank" rel="noopener noreferrer">在新窗口打开 ↗</a>
    </div>
    <button className="zhipin-project__preview" type="button" onClick={() => setOpen(true)} aria-label="体验智聘千寻交互原型">
      <Image src="/project-assets/zhipin-qianxun.jpg" alt="智聘千寻工作台：AI 招聘简报、招聘漏斗与待办" width={1440} height={810} priority unoptimized />
      <span>点击进入 · 完整交互体验 ↗</span>
    </button>
    {open && <dialog ref={dialog} className="zhipin-demo" aria-label="智聘千寻交互原型" onCancel={close} onClose={() => setOpen(false)}>
      <header><strong>智聘千寻 <small>交互原型</small></strong><nav><a href={DEMO_URL} target="_blank" rel="noopener noreferrer">新窗口打开 ↗</a><button type="button" autoFocus onClick={close}>返回作品集 ×</button></nav></header>
      <p>如预览未加载，或浏览器限制了演示数据存储，可以在新窗口打开。</p>
      <iframe title="智聘千寻 AI 招聘工作台" src={DEMO_URL} referrerPolicy="no-referrer" sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads" />
    </dialog>}
  </>;
}
