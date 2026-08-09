"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { WindowScene } from "@/components/v3/illustrations";
import ScrollHint, { SectionNavigator } from "@/components/v3/scroll-hint";
import { useBeijingTime } from "@/components/v3/use-beijing-time";

// 项目时间与 UI 1.0 对齐
const featuredProjects = [
  {
    index: "01",
    title: "雪诺企业安全浏览器",
    en: "Snow Enterprise Browser",
    description: "从访问入口重构企业安全体验，让零信任不再成为用户的负担。",
    meta: "2024-2026",
    image: "https://cdn.btbon.cn/snownewtab/AI-NEWTAB.webp",
    href: "/work?project=snownewtab",
  },
  {
    index: "02",
    title: "AllinOne",
    en: "Figma Power Plugin",
    description: "把 30+ 高频动作收进一个设计师真正愿意每天打开的工具。",
    meta: "2024-2025",
    image: "https://cdn.btbon.cn/images/ALO.webp",
    href: "/work/all-in-one-v2",
  },
  {
    index: "03",
    title: "磁力聚星",
    en: "Kwai Creator Marketing",
    description: "重组达人营销全链路，老用户下单效率提升 22%。",
    meta: "2024",
    image: "https://cdn.btbon.cn/Kwai-磁力聚星/them03-01.webp",
    href: "/work?project=kwai-magnetic-star",
  },
  {
    index: "04",
    title: "AI Translate",
    en: "Browser Extension",
    description: "沉浸式双语对照与局部翻译，尽量不打断阅读。",
    meta: "2024",
    image: "https://cdn.btbon.cn/images/aitran.webp",
    href: "/work/ai-translate",
  },
];

// 真实职业经历（与 UI 1.0 一致，按用户确认的四段归纳）
const experience = [
  ["2024-NOW", "雪诺科技", "产品设计师"],
  ["2021-2023", "快手 · 商业化（磁力聚星）", "产品设计师"],
  ["2018-2021", "中航金网（航空工业）", "体验设计师"],
  ["2016-2018", "云适配（云生互联）", "UI 设计师"],
];

const capabilities = [
  {
    index: "01",
    title: "设计系统 × 业务解构",
    description:
      "把复杂业务拆成原子组件，用 Variables 统一 Token，一个人也能维护 Web 与桌面双端组件库。",
  },
  {
    index: "02",
    title: "Vibe Coding × AI 原生",
    description:
      "用 AI 把原型做到可交互，独立上架 Figma / Chrome 两款插件，设计阶段就验证技术可行性。",
  },
];

const stats = [
  ["10", "年产品设计经验"],
  ["B/C/G", "多端产品项目经验"],
  ["AI", "Coding 与辅助设计能力"],
  ["360+", "累计服务用户"],
];

const EMAIL = "nc0032@qq.com";
const WECHAT = "Aiden0032";
const XHS_URL = "https://xhslink.com/m/78jWEdnemBP";

const reveal = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
};

export default function HomeV3() {
  const time = useBeijingTime();
  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState<"email" | "wechat" | null>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => hero.classList.toggle("is-scene-active", entry.isIntersecting),
      { threshold: 0.08 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  const sectionReveal = reduceMotion
    ? { initial: false as const }
    : reveal;

  const copyText = async (text: string, field: "email" | "wechat") => {
    await navigator.clipboard.writeText(text);
    setCopied(field);
    window.setTimeout(() => setCopied(null), 1800);
  };

  return (
    <div className="v3-home">
      <SectionNavigator />
      {/* ── 第一屏 · Hero ─────────────────────────────── */}
      <section id="hero" ref={heroRef} className="v3-hero is-scene-active">
        {/* 动态背景：整面窗、丁达尔光、窗外的鸟与落叶、桌上的 iMac */}
        <div className="v3-hero__scene" aria-hidden="true">
          <WindowScene />
        </div>

        <div className="v3-shell">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="v3-hero__eyebrow"
          >
            <span className="v3-hero__status">
              <i aria-hidden="true" />
              欢迎新的工作机会
            </span>
            <span className="v3-hero__clock">
              北京朝阳&nbsp;·&nbsp;{time || "00:00:00"}
            </span>
          </motion.div>

          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            设计不止于交付，
            <br />
            是逻辑的可视化，与落地的<em>预演</em>。
          </motion.h1>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="v3-hero__intro"
          >
            我是倪城，B 端产品设计师，在这行第十年。
            我相信视觉只是结果。先把业务逻辑想清楚，
            再用可交互的原型验证一遍，设计才算完成。
            这里收录的，就是那些想清楚、也做成了的东西。
          </motion.p>
        </div>

        <ScrollHint href="#selected-work" label="精选项目" />
      </section>

      <main>
        {/* ── 第二屏 · 精选项目 ────────────────────────── */}
        <section id="selected-work" className="v3-section">
          <div className="v3-shell">
            <motion.header {...sectionReveal} className="v3-section-head">
              <h2>精选项目</h2>
              <p>四个项目，四种不同尺度的问题</p>
            </motion.header>

            <div className="v3-projects">
              {featuredProjects.map((project) => (
                <div
                  key={project.title}
                >
                  <Link href={project.href} className="v3-project">
                    <span className="v3-project__index">{project.index}</span>
                    <span className="v3-project__thumb">
                      <Image
                        src={project.image}
                        alt={`${project.title} 项目封面`}
                        fill
                        unoptimized
                        loading="eager"
                        sizes="(max-width: 800px) 96px, 132px"
                      />
                    </span>
                    <span className="v3-project__body">
                      <span className="v3-project__title">
                        {project.title}
                        <em>{project.en}</em>
                      </span>
                      <span className="v3-project__desc">
                        {project.description}
                      </span>
                    </span>
                    <span className="v3-project__aside">
                      <time>{project.meta}</time>
                      <ArrowUpRight size={15} aria-hidden="true" />
                    </span>
                  </Link>
                </div>
              ))}
            </div>

            <motion.div {...sectionReveal} className="v3-all-work">
              <Link href="/work" className="v3-link">
                浏览全部项目
                <ArrowUpRight size={13} />
              </Link>
            </motion.div>
          </div>

          <ScrollHint href="#profile" label="关于我" />
        </section>

        {/* ── 第三屏 · 关于我 ─────────────────────────── */}
        <section id="profile" className="v3-section">
          <div className="v3-shell">
            <motion.header {...sectionReveal} className="v3-section-head">
              <h2>关于我</h2>
              <p>设计观与职业经历</p>
            </motion.header>

            <div className="v3-about">
              <motion.div {...sectionReveal} className="v3-about__overview">
                <p className="v3-about__label">设计观</p>
                <div className="v3-about__overview-copy">
                  <p className="v3-about__statement">
                    设计不止于交付，是<strong>逻辑的可视化</strong>，
                    也是<strong>落地的预演</strong>。
                  </p>
                  <p className="v3-about__sub">
                    我把工程思维前置到设计阶段，用 AI 快速搭出可交互原型，
                    在开发介入前验证逻辑，减少设计稿到代码之间的损耗。
                  </p>
                </div>
              </motion.div>

              <div className="v3-about__details">
                <motion.div {...sectionReveal} className="v3-about__strengths">
                  <p className="v3-about__label">两点优势</p>
                  <div className="v3-cap">
                    {capabilities.map((cap) => (
                      <div key={cap.index} className="v3-cap__item">
                        <span>{cap.index}</span>
                        <div>
                          <strong>{cap.title}</strong>
                          <p>{cap.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div {...sectionReveal} className="v3-about__career">
                  <p className="v3-about__label">职业经历</p>
                  <div className="v3-exp">
                    {experience.map(([year, company, role]) => (
                      <div key={company} className="v3-exp__row">
                        <span>{year}</span>
                        <strong>{company}</strong>
                        <em>{role}</em>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>

            <motion.div {...sectionReveal} className="v3-stats">
              {stats.map(([value, label]) => (
                <div key={label}>
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <ScrollHint href="#footer" label="联系我" />
        </section>
      </main>

      {/* ── 第四屏 · 联系 ────────────────────────────── */}
      <footer id="footer" className="v3-footer">
        <div className="v3-shell">
          <motion.header {...sectionReveal} className="v3-section-head">
            <h2>联系</h2>
            <p>有合适的机会，或只是想聊聊设计</p>
          </motion.header>

          <motion.p {...sectionReveal} className="v3-footer__line">
            一起做点经得起用的好东西。
          </motion.p>

          <motion.div {...sectionReveal} className="v3-footer__actions">
            <button
              type="button"
              onClick={() => copyText(EMAIL, "email")}
              className="v3-capsule"
              aria-live="polite"
            >
              {copied === "email" ? "已复制" : `邮箱 · ${EMAIL}`}
              {copied === "email" ? <Check size={13} /> : <Copy size={13} />}
            </button>
            <button
              type="button"
              onClick={() => copyText(WECHAT, "wechat")}
              className="v3-capsule"
              aria-live="polite"
            >
              {copied === "wechat" ? "已复制" : `微信 · ${WECHAT}`}
              {copied === "wechat" ? <Check size={13} /> : <Copy size={13} />}
              <span className="v3-footer__qr" aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://cdn.btbon.cn/images/wechat-qr.webp"
                  alt=""
                  loading="lazy"
                />
              </span>
            </button>
            <a
              href="https://cdn.btbon.cn/UI设计-倪城-2026.pdf"
              download
              className="v3-capsule"
            >
              下载简历
              <ArrowUpRight size={13} />
            </a>
          </motion.div>

          <div className="v3-footer__base">
            <span>© {new Date().getFullYear()} 倪城 · 北京</span>
            <a
              href={XHS_URL}
              target="_blank"
              rel="noreferrer"
              className="v3-xhs"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/%E5%B0%8F%E7%BA%A2%E4%B9%A6.png" alt="" />
              在小红书关注我
              <ArrowUpRight size={12} />
            </a>
            <span>Songti SC / Plus Jakarta Sans / JetBrains Mono</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
