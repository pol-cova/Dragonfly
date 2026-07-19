import { cn } from "@/lib/utils";

export function TermStatus({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-mono text-sm text-[var(--fg-dim)]",
        className,
      )}
    >
      {label} <span className="text-[var(--fg)]">{value}</span>
    </span>
  );
}
