"use client";

// 每一屏底部的下一页入口，以及始终反映当前位置的分屏导航。

import { useEffect, useState } from "react";

const sections = [
  { id: "hero", label: "首页" },
  { id: "selected-work", label: "精选项目" },
  { id: "profile", label: "关于我" },
  { id: "footer", label: "联系" },
];

export default function ScrollHint({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <a href={href} className="v3-scroll-hint" aria-label={`向下滚动到${label}`}>
      <span aria-hidden="true" />
    </a>
  );
}

export function SectionNavigator() {
  const [activeId, setActiveId] = useState("hero");

  useEffect(() => {
    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => Boolean(element));

    const observer = new IntersectionObserver(
      (entries) => {
        const active = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (active?.target.id) setActiveId(active.target.id);
      },
      { rootMargin: "-34% 0px -34% 0px", threshold: [0, 0.25, 0.5, 0.75] }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="v3-section-nav" aria-label="首页分屏导航">
      <div className="v3-section-nav__steps">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={activeId === section.id ? "is-active" : undefined}
            aria-current={activeId === section.id ? "page" : undefined}
            aria-label={`前往${section.label}`}
          >
            <span aria-hidden="true" />
            <b>{section.label}</b>
          </a>
        ))}
      </div>
    </nav>
  );
}
