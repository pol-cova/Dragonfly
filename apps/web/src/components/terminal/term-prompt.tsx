import { cn } from "@/lib/utils";

export function TermPrompt({
  user = "dragonfly",
  host = "midnight",
  path = "~",
  className,
}: {
  user?: string;
  host?: string;
  path?: string;
  className?: string;
}) {
  return (
    <span className={cn("term-prompt text-lg md:text-xl", className)}>
      <span className="text-[var(--fg)]">
        {user}@{host}
      </span>
      <span className="text-[var(--fg-dim)]">:</span>
      <span className="text-[var(--fg-warn)]">{path}</span>
      <span className="text-[var(--fg)]">$ </span>
    </span>
  );
}
