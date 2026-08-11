// src/components/v3/illustrations.tsx
// UI 2.0 的动态背景。一整面窗、柔和的丁达尔光、远处飞鸟与落叶，
// 桌面上的电脑和键盘共享同一条接触面。动画离开首屏后会暂停。

export function WindowScene({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMaxYMid slice"
      aria-hidden="true"
      className={className}
    >
      <defs>
        {/* 光束沿出射方向自然衰减，边缘保持柔软但不使用大面积矩形模糊。 */}
        <linearGradient id="v3-ray-a" x1="0.72" y1="0" x2="0.22" y2="1">
          <stop offset="0" stopColor="#f4d49f" stopOpacity="0.5" />
          <stop offset="0.52" stopColor="#f3cd92" stopOpacity="0.26" />
          <stop offset="1" stopColor="#f3cd92" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="v3-ray-b" x1="0.62" y1="0" x2="0.34" y2="1">
          <stop offset="0" stopColor="#f7dcae" stopOpacity="0.42" />
          <stop offset="0.58" stopColor="#f3cd92" stopOpacity="0.2" />
          <stop offset="1" stopColor="#f3cd92" stopOpacity="0" />
        </linearGradient>
        <filter id="v3-ray-soft" x="-15%" y="-15%" width="130%" height="130%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id="v3-blur-md" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        {/* 窗外世界（天空、飞鸟、落叶）只出现在窗玻璃范围内 */}
        <clipPath id="v3-window-clip">
          <rect x="948" y="128" width="344" height="364" rx="10" />
        </clipPath>
      </defs>

      {/* 丁达尔光束使用弧形轮廓，避免僵硬的矩形雾块。 */}
      <path
        className="v3-ray v3-ray--a"
        d="M952 100 C1008 130 1054 168 1078 216 C1004 450 864 660 584 842 L376 842 C684 610 844 358 952 100 Z"
        fill="url(#v3-ray-a)"
        filter="url(#v3-ray-soft)"
      />
      <path
        className="v3-ray v3-ray--b"
        d="M1086 128 C1160 166 1230 224 1286 298 C1224 514 1110 690 928 848 L690 848 C914 630 1036 400 1086 128 Z"
        fill="url(#v3-ray-b)"
        filter="url(#v3-ray-soft)"
      />

      {/* 窗整体上移 48，底边与 iMac 顶部留出间距，不再穿插重叠；
          clipPath 与鸟/叶动画坐标都在此局部坐标系内，随之整体平移 */}
      <g transform="translate(0, -48)">
      {/* 窗 */}
      <rect x="930" y="110" width="380" height="400" rx="18" fill="#e9dcc1" />
      <rect x="948" y="128" width="344" height="364" rx="10" fill="#f8ecd4" />

      {/* 窗外：偶尔飞过的小鸟、飘落的叶子（均被窗玻璃裁切） */}
      <g clipPath="url(#v3-window-clip)">
        <g className="v3-bird v3-bird--1" fill="#8f7956">
          <path d="M0 8 C5 2 10 1 15 5 C20 0 27 1 33 7 C26 4 20 5 15 9 C10 5 5 5 0 8 Z" />
          <path d="M14.3 8.2 C15.8 7.2 17.3 7.2 18.8 8.4 C17.2 9.8 15.7 9.7 14.3 8.2 Z" opacity="0.72" />
        </g>
        <g className="v3-bird v3-bird--2" fill="#968162">
          <path d="M0 7 C4 2 8 1 12 4.5 C16 0.5 22 1 27 6.5 C21 4 16 4.8 12 8 C8 4.8 4 4.6 0 7 Z" />
        </g>
        <g className="v3-leaf v3-leaf--1">
          <path d="M1 1 C9 -3 16 1 14 9 C12 16 5 17 2 11 C0 7 0 3 1 1 Z" fill="#bda36d" />
          <path d="M2.5 10.5 C6.5 8 9 5.5 13 1.8" fill="none" stroke="#8f774d" strokeWidth="0.8" />
        </g>
        <g className="v3-leaf v3-leaf--2">
          <path d="M1 1 C8 -2 14 1 12 8 C10 14 4 15 2 10 C0 6 0 3 1 1 Z" fill="#b2945c" />
          <path d="M2.2 9.8 C5.6 7.8 8.2 4.8 11.5 1.7" fill="none" stroke="#856d45" strokeWidth="0.75" />
        </g>
        <g className="v3-leaf v3-leaf--3">
          <path d="M1 1 C8 -3 15 1 13 8 C11 15 4 16 2 10 C0 6 0 3 1 1 Z" fill="#c3aa72" />
          <path d="M2.3 9.8 C6 7.8 9 4.7 12.4 1.6" fill="none" stroke="#92784d" strokeWidth="0.8" />
        </g>
      </g>

      {/* 窗棂（四格） */}
      <rect x="1112" y="128" width="12" height="364" fill="#e9dcc1" />
      <rect x="948" y="300" width="344" height="12" fill="#e9dcc1" />
      </g>

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
      {/* 键盘底边贴合桌面，使用轻微透视而不是悬浮圆条。 */}
      <path d="M1020 697 H1220 L1228 706 H1012 Z" fill="#e7dcc4" />
      <path d="M1032 700 H1208" fill="none" stroke="#d6c8ad" strokeWidth="1.5" strokeLinecap="round" />

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
