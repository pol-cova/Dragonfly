import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type TermLogLevel = "info" | "ok" | "warn" | "err" | "sys" | "wait";

export type TermLogLine = {
  level?: TermLogLevel;
  text: string;
};

const levelClass: Record<TermLogLevel, string> = {
  info: "text-[var(--fg)]",
  ok: "text-[var(--fg)]",
  warn: "text-[var(--fg-warn)]",
  err: "text-[var(--fg-err)]",
  sys: "text-[var(--fg-dim)]",
  wait: "text-[var(--fg-dim)] term-pulse",
};

export function TermLog({
  lines,
  children,
  className,
}: {
  lines?: TermLogLine[];
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "space-y-1 font-mono text-sm leading-relaxed",
        className,
      )}
    >
      {lines?.map((line, index) => {
        const level = line.level ?? "info";
        return (
          <p
            key={`${index}-${line.text.slice(0, 24)}`}
            className={levelClass[level]}
          >
            {line.text}
          </p>
        );
      })}
      {children}
    </div>
  );
}
