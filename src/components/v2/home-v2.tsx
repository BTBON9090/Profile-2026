"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  Copy,
  Download,
  Mail,
} from "lucide-react";
import { useState } from "react";

const projects = [
  {
    index: "01",
    title: "雪诺企业安全浏览器",
    en: "Snow Enterprise Browser",
    description: "从访问入口重构企业安全体验，让零信任不再成为用户负担。",
    meta: "Product strategy · UX/UI · 2024—26",
    image: "https://cdn.btbon.cn/snownewtab/AI-NEWTAB.webp",
    href: "/work?project=snownewtab",
    shape: "wide",
  },
  {
    index: "02",
    title: "AllinOne",
    en: "Figma power plugin",
    description: "把 30+ 高频动作收进一个设计师真正愿意每天打开的工具。",
    meta: "Solo product · AI · 2025",
    image: "https://cdn.btbon.cn/images/ALO.webp",
    href: "/work/all-in-one-v2",
    shape: "portrait",
  },
  {
    index: "03",
    title: "磁力聚星",
    en: "Kwai creator marketing",
    description: "重组达人营销全链路，老用户下单效率提升 22%。",
    meta: "Redesign · Growth · 2024",
    image: "https://cdn.btbon.cn/Kwai-磁力聚星/them03-01.webp",
    href: "/work?project=kwai-magnetic-star",
    shape: "square",
  },
  {
    index: "04",
    title: "AI Translate",
    en: "Browser extension",
    description: "沉浸式双语对照与局部翻译，尽量不打断阅读。",
    meta: "Side project · AI · 2024",
    image: "https://cdn.btbon.cn/images/aitran.webp",
    href: "/work/ai-translate",
    shape: "wide",
  },
];

const experience = [
  ["2024—NOW", "雪诺科技", "UI/UX 设计专家"],
  ["2023—2024", "快手", "体验设计师"],
  ["2020—2023", "度小满", "高级 UI 设计师"],
  ["2017—2020", "中科曙光", "高级 UI 设计师"],
];

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.16 },
  transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] as const },
};

export default function HomeV2() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.35,
  });
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    await navigator.clipboard.writeText("nc0032@qq.com");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="v2-home">
      <motion.div
        className="v2-scroll-progress"
        style={{ scaleX: progress }}
        aria-hidden="true"
      />

      <section id="hero" className="v2-hero">
        <div className="v2-shell v2-hero__inner">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="v2-eyebrow"
          >
            <span>Ni Cheng / Product designer</span>
            <span>Beijing · 2026</span>
          </motion.div>

          <div className="v2-hero__grid">
            <motion.div
              initial={{ opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="v2-kicker">10 年 B 端产品设计</p>
              <h1>
                把复杂的事，
                <br />
                设计得<span>简单耐用。</span>
              </h1>
            </motion.div>

            <motion.aside
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.75, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="v2-hero__note"
            >
              <span className="v2-note-mark">※</span>
              <p>
                我是倪城，一名能把设计做到上线的产品设计师。关注设计系统、
                AI 工具与复杂业务体验。
              </p>
              <a href="#selected-work">
                看精选项目 <ArrowDown size={15} />
              </a>
            </motion.aside>
          </div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="v2-hero__rule"
          />

          <div className="v2-hero__footer">
            <span>Product thinking</span>
            <span>Systems craft</span>
            <span>Design engineering</span>
          </div>
        </div>
        <div className="v2-hero__edition" aria-hidden="true">
          <span>Portfolio</span>
          <strong>02</strong>
        </div>
      </section>

      <main>
        <section id="selected-work" className="v2-work">
          <div className="v2-shell">
            <motion.header {...reveal} className="v2-section-head">
              <div>
                <span className="v2-section-index">01</span>
                <h2>Selected work</h2>
              </div>
              <p>四个项目，四种不同尺度的问题。点击进入完整案例。</p>
            </motion.header>

            <div className="v2-projects">
              {projects.map((project, index) => (
                <motion.article
                  key={project.title}
                  {...reveal}
                  transition={{ ...reveal.transition, delay: index * 0.06 }}
                  className={`v2-project v2-project--${project.shape}`}
                >
                  <Link href={project.href} className="v2-project__visual">
                    <Image
                      src={project.image}
                      alt={`${project.title} 项目封面`}
                      fill
                      unoptimized
                      sizes="(max-width: 800px) 100vw, 70vw"
                      className="v2-project__image"
                    />
                    <span className="v2-project__open">
                      View case <ArrowUpRight size={16} />
                    </span>
                  </Link>
                  <div className="v2-project__body">
                    <span className="v2-project__index">{project.index}</span>
                    <div>
                      <p className="v2-project__en">{project.en}</p>
                      <h3>{project.title}</h3>
                      <p className="v2-project__description">{project.description}</p>
                    </div>
                    <p className="v2-project__meta">{project.meta}</p>
                  </div>
                </motion.article>
              ))}
            </div>

            <motion.div {...reveal} className="v2-all-work">
              <Link href="/work">
                浏览全部项目
                <span>17 projects</span>
                <ArrowUpRight size={20} />
              </Link>
            </motion.div>
          </div>
        </section>

        <section id="profile" className="v2-profile">
          <div className="v2-shell">
            <motion.header {...reveal} className="v2-section-head">
              <div>
                <span className="v2-section-index">02</span>
                <h2>About &amp; practice</h2>
              </div>
              <p>不追求漂亮的交付物，追求经得起使用的解决方案。</p>
            </motion.header>

            <div className="v2-profile__grid">
              <motion.div {...reveal} className="v2-profile__statement">
                <p>
                  我擅长进入<strong>复杂、模糊、约束多</strong>的业务，
                  先找到真正的问题，再建立清晰的系统。
                </p>
                <div className="v2-profile__principles">
                  <span>01 / 先理解，再表达</span>
                  <span>02 / 系统一致，局部有趣</span>
                  <span>03 / 设计负责到上线</span>
                </div>
              </motion.div>

              <motion.div {...reveal} className="v2-experience">
                {experience.map(([year, company, role]) => (
                  <div key={company} className="v2-experience__row">
                    <span>{year}</span>
                    <strong>{company}</strong>
                    <span>{role}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div {...reveal} className="v2-numbers">
              <div><strong>10</strong><span>年产品设计经验</span></div>
              <div><strong>6</strong><span>年 B 端深度实践</span></div>
              <div><strong>30+</strong><span>上线功能与项目</span></div>
              <div><strong>340+</strong><span>个人产品用户</span></div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer id="footer" className="v2-footer">
        <div className="v2-shell">
          <motion.div {...reveal} className="v2-footer__headline">
            <span>有合适的机会，或只是想聊聊设计</span>
            <h2>一起做点好东西。</h2>
          </motion.div>
          <div className="v2-footer__actions">
            <button type="button" onClick={copyEmail}>
              <Mail size={17} />
              nc0032@qq.com
              <Copy size={14} />
              <span aria-live="polite">{copied ? "已复制" : "复制"}</span>
            </button>
            <a href="https://cdn.btbon.cn/UI设计-倪城-2026.pdf" download>
              <Download size={17} />
              下载简历
            </a>
          </div>
          <div className="v2-footer__base">
            <span>© {new Date().getFullYear()} Ni Cheng</span>
            <span>Designed with clarity &amp; care.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
