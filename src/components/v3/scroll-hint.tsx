// src/components/v3/scroll-hint.tsx
// 每一屏底部居中的下滑引导：细轨道 + 循环下落的小圆点 + 下一屏名称。

export default function ScrollHint({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <a href={href} className="v3-scroll-hint" aria-label={`向下滚动到${label}`}>
      <span className="v3-scroll-hint__track" aria-hidden="true">
        <i />
      </span>
      <span className="v3-scroll-hint__label">{label}</span>
    </a>
  );
}
