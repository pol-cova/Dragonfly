"use client";

import { generateWingSvg } from "@dragonfly/wing-generator";
import { useMemo } from "react";

export function WingPreview({
  badgeSeed,
  size = 120,
  className,
}: {
  badgeSeed: string;
  size?: number;
  className?: string;
}) {
  const svg = useMemo(
    () => generateWingSvg(badgeSeed || "preview-seed", size),
    [badgeSeed, size],
  );

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: svg }}
      aria-label="Wing preview"
    />
  );
}
