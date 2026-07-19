import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function TermLink({
  href,
  children,
  className,
  bracket = true,
  prefetch = true,
  ...props
}: Omit<ComponentProps<typeof Link>, "children"> & {
  children: ReactNode;
  bracket?: boolean;
}) {
  const label =
    typeof children === "string" && bracket ? `[ ${children} ]` : children;

  return (
    <Link
      href={href}
      prefetch={prefetch}
      className={cn(
        "term-btn-instant inline-flex items-center justify-center border border-[var(--border)] px-3 py-2 font-mono text-sm text-[var(--fg)]",
        "hover:bg-[var(--fg)] hover:text-[var(--bg)]",
        "focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--fg)]",
        className,
      )}
      {...props}
    >
      {label}
    </Link>
  );
}
