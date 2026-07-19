import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function TermPanel({
  title,
  children,
  className,
  plain,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
  plain?: boolean;
}) {
  return (
    <section
      className={cn(
        plain ? "space-y-3" : "term-panel p-4 md:p-5",
        className,
      )}
    >
      {title ? (
        <p className="font-mono text-xs text-[var(--fg-dim)]">{title}</p>
      ) : null}
      <div className={cn(title ? "mt-2" : undefined)}>{children}</div>
    </section>
  );
}
