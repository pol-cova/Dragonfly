"use client";

import { generateWingSvg } from "@dragonfly/wing-generator";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

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
      className={cn("pixel-crisp inline-block text-[var(--fg)]", className)}
      dangerouslySetInnerHTML={{ __html: svg }}
      aria-label="Wing preview"
    />
  );
}
