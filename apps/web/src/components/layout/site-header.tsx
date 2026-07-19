"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

const links = [
  { href: "/", label: "home" },
  { href: "/solvers", label: "solvers" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="relative z-20 border-b border-[var(--border)]">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="font-terminal text-2xl text-[var(--fg)]">
          {site.name}
        </Link>
        <nav className="flex items-center gap-4 font-mono text-sm">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                prefetch
                className={cn(
                  active ? "text-[var(--fg)]" : "text-[var(--fg-dim)]",
                  "hover:text-[var(--fg-bright)]",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
