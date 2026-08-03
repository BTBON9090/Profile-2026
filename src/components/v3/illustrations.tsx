// src/components/v3/illustrations.tsx
// UI 3.0 的动态背景 —— 面性几何块（无描边），一整面窗、丁达尔光、
// 窗外偶有飞鸟与落叶，桌面上一台空白屏幕的 iMac。只做氛围，不抢焦点。

export function WindowScene({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMaxYMid slice"
      aria-hidden="true"
      className={className}
    >
      <defs>
        {/* 三道光束各自的衰减渐变（沿出射方向） */}
        <linearGradient id="v3-ray-a" x1="0.72" y1="0" x2="0.22" y2="1">
          <stop offset="0" stopColor="#f3cd92" stopOpacity="0.55" />
          <stop offset="1" stopColor="#f3cd92" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="v3-ray-b" x1="0.62" y1="0" x2="0.34" y2="1">
          <stop offset="0" stopColor="#f3cd92" stopOpacity="0.45" />
          <stop offset="1" stopColor="#f3cd92" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="v3-ray-c" x1="0.6" y1="0" x2="0.42" y2="1">
          <stop offset="0" stopColor="#f3cd92" stopOpacity="0.5" />
          <stop offset="1" stopColor="#f3cd92" stopOpacity="0" />
        </linearGradient>
        <filter id="v3-blur-lg" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
        <filter id="v3-blur-md" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <filter id="v3-blur-sm" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
        {/* 窗外世界（天空、飞鸟、落叶）只出现在窗玻璃范围内 */}
        <clipPath id="v3-window-clip">
          <rect x="948" y="128" width="344" height="364" rx="10" />
        </clipPath>
      </defs>

      {/* 窗后的大片暖光晕（高斯模糊，铺氛围底） */}
      <ellipse
        cx="1120"
        cy="330"
        rx="350"
        ry="300"
        fill="#f3cd92"
        opacity="0.26"
        filter="url(#v3-blur-lg)"
      />

      {/* 丁达尔光束 —— 出发点铺满整个窗面，向左下方洒落 */}
      <polygon
        className="v3-ray v3-ray--a"
        points="960,150 1104,150 760,830 470,830"
        fill="url(#v3-ray-a)"
        filter="url(#v3-blur-lg)"
      />
      <polygon
        className="v3-ray v3-ray--b"
        points="1000,330 1246,330 1020,860 700,860"
        fill="url(#v3-ray-b)"
        filter="url(#v3-blur-lg)"
      />
      <polygon
        className="v3-ray v3-ray--c"
        points="1180,430 1290,430 1185,850 985,850"
        fill="url(#v3-ray-c)"
        filter="url(#v3-blur-md)"
      />

      {/* 窗 */}
      <rect x="930" y="110" width="380" height="400" rx="18" fill="#e9dcc1" />
      <rect x="948" y="128" width="344" height="364" rx="10" fill="#f8ecd4" />

      {/* 窗外：偶尔飞过的小鸟、飘落的叶子（均被窗玻璃裁切） */}
      <g clipPath="url(#v3-window-clip)">
        <g className="v3-bird v3-bird--1">
          <path
            d="M0 5 C5 -2 10 -2 14 4 C18 -2 23 -2 28 5 C19 1.5 9 1.5 0 5 Z"
            fill="#a3854f"
          />
        </g>
        <g className="v3-bird v3-bird--2">
          <path
            d="M0 4 C4 -1.5 8 -1.5 11 3 C14 -1.5 18 -1.5 22 4 C15 1 7 1 0 4 Z"
            fill="#a3854f"
          />
        </g>
        <g className="v3-leaf v3-leaf--1" filter="url(#v3-blur-sm)">
          <path
            d="M0 0 C7 -5 14 0 12 8 C10 14 3 14 1 8 C-1 4 -1 2 0 0 Z"
            fill="#c0a86e"
          />
        </g>
        <g className="v3-leaf v3-leaf--2" filter="url(#v3-blur-sm)">
          <path
            d="M0 0 C6 -4 12 0 10 7 C8 12 3 12 1 7 C-1 3 -1 1.5 0 0 Z"
            fill="#b89b5e"
          />
        </g>
        <g className="v3-leaf v3-leaf--3" filter="url(#v3-blur-sm)">
          <path
            d="M0 0 C7 -5 13 0 11 7 C9 13 3 13 1 7 C-1 3.5 -1 1.5 0 0 Z"
            fill="#c9b077"
          />
        </g>
      </g>

      {/* 窗棂（四格） */}
      <rect x="1112" y="128" width="12" height="364" fill="#e9dcc1" />
      <rect x="948" y="300" width="344" height="12" fill="#e9dcc1" />

      {/* 地面软影 */}
      <ellipse
        cx="1100"
        cy="806"
        rx="330"
        ry="24"
        fill="#e6d7b8"
        opacity="0.55"
        filter="url(#v3-blur-md)"
      />

      {/* 桌 */}
      <rect x="800" y="706" width="580" height="14" rx="7" fill="#e0cfb0" />
      <rect x="846" y="720" width="12" height="64" rx="4" fill="#d8c6a4" />
      <rect x="1322" y="720" width="12" height="64" rx="4" fill="#d8c6a4" />

      {/* iMac —— 极简面性几何，空白屏幕 */}
      <rect x="980" y="486" width="280" height="186" rx="14" fill="#ece3d0" />
      <rect x="992" y="498" width="256" height="148" rx="6" fill="#fbf7ec" />
      <path d="M1100 672 h40 l8 34 h-56 z" fill="#e0d4ba" />
      <rect x="1086" y="700" width="68" height="8" rx="4" fill="#d8c6a4" />
      <rect x="1014" y="690" width="212" height="9" rx="4.5" fill="#e7dcc4" />

      {/* 马克杯 */}
      <rect x="1306" y="676" width="32" height="30" rx="6" fill="#d3ba8e" />

      {/* 小盆栽 */}
      <ellipse
        cx="866"
        cy="662"
        rx="9"
        ry="17"
        fill="#b5a577"
        transform="rotate(-14 866 662)"
      />
      <ellipse
        cx="882"
        cy="658"
        rx="9"
        ry="20"
        fill="#ac9c6c"
        transform="rotate(12 882 658)"
      />
      <rect x="858" y="682" width="30" height="24" rx="5" fill="#cbb38f" />
    </svg>
  );
}
