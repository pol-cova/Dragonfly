import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function TermButton({
  children,
  className,
  bracket = true,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  bracket?: boolean;
}) {
  const label =
    typeof children === "string" && bracket
      ? `[ ${children} ]`
      : children;

  return (
    <button
      className={cn(
        "term-btn-instant inline-flex items-center justify-center border border-[var(--border)] bg-transparent px-3 py-2 font-mono text-sm text-[var(--fg)]",
        "hover:bg-[var(--fg)] hover:text-[var(--bg)]",
        "disabled:cursor-not-allowed disabled:text-[var(--fg-dim)] disabled:hover:bg-transparent",
        "focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--fg)]",
        className,
      )}
      type="button"
      {...props}
    >
      {label}
    </button>
  );
}
