"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/solvers", label: "Solvers" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-cyan-500/10 bg-[#020617]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-lg text-cyan-300">
            ✦
          </span>
          <div>
            <p className="font-display text-xl tracking-[0.2em] text-cyan-100">
              DRAGONFLY
            </p>
            <p className="text-[10px] uppercase tracking-[0.35em] text-amber-400/80">
              Private CTF Drops
            </p>
          </div>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "uppercase tracking-[0.2em] transition-colors",
                pathname === link.href
                  ? "text-amber-300"
                  : "text-slate-400 hover:text-cyan-200",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
