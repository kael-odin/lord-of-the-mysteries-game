"use client";

import { emblemSVG, type PathwayKey } from "@/lib/game/emblems";

/** React component: a pathway emblem sized in px, recolorable via className/`color`. */
export function Emblem({
  k,
  size = 64,
  className,
}: {
  k: PathwayKey;
  size?: number;
  className?: string;
}) {
  const svg = emblemSVG(k);
  return (
    <span
      role="img"
      aria-label={`${k} 徽记`}
      className={className}
      style={{
        display: "inline-block",
        width: size,
        height: size,
        color: "var(--ember-color, #e7d9b8)",
        lineHeight: 0,
      }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
