"use client";

import { useQuery } from "convex/react";
import { useState } from "react";
import type { SolverEntry } from "@dragonfly/shared";
import { api } from "convex/_generated/api";
import { TermButton, TermLink, TermPanel } from "@/components/terminal";
import { WingPreview } from "@/components/wing/wing-preview";
import { formatDate } from "@/lib/utils";

export function SolversBoard() {
  const [now] = useState(() => Date.now());
  const catalog = useQuery(api.dropsQueries.list, { now });
  const drops = catalog?.drops ?? [];
  const defaultDropId =
    drops.find((d) => d.status === "active")?.id ?? drops[0]?.id ?? "drop-001";
  const [dropId, setDropId] = useState<string | null>(null);
  const selectedDropId = dropId ?? defaultDropId;
  const data = useQuery(api.solvers.list, { dropId: selectedDropId });
  const selected = drops.find((d) => d.id === selectedDropId);

  return (
    <div className="space-y-5">
      <TermPanel>
        <p className="font-terminal text-2xl text-[var(--fg)]">solvers</p>
        <p className="mt-2 font-mono text-sm text-[var(--fg-dim)]">
          Aliases and wings only — no answers or wallet details.
        </p>
      </TermPanel>

      {drops.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {drops.map((drop) => {
            const active = selectedDropId === drop.id;
            return (
              <TermButton
                key={drop.id}
                type="button"
                bracket={false}
                onClick={() => setDropId(drop.id)}
                className={
                  active
                    ? "bg-[var(--fg)] text-[var(--bg)] hover:bg-[var(--fg)] hover:text-[var(--bg)]"
                    : undefined
                }
              >
                {drop.name}
              </TermButton>
            );
          })}
        </div>
      )}

      {!data && (
        <p className="font-mono text-sm text-[var(--fg-dim)]">loading…</p>
      )}

      {data && data.solvers.length === 0 && (
        <p className="font-mono text-sm text-[var(--fg-dim)]">
          No verified solvers yet{selected ? ` for ${selected.name}` : ""}.
        </p>
      )}

      {data && data.solvers.length > 0 && (
        <TermPanel plain>
          <ul className="divide-y divide-[var(--border)]">
            {data.solvers.map((solver: SolverEntry) => (
              <li
                key={`${solver.alias}-${solver.claimedAt}`}
                className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
              >
                <WingPreview badgeSeed={solver.badgeSeed} size={56} />
                <div>
                  <p className="font-mono text-[var(--fg)]">{solver.alias}</p>
                  <p className="font-mono text-xs text-[var(--fg-dim)]">
                    {formatDate(solver.claimedAt)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </TermPanel>
      )}

      <TermLink href="/">home</TermLink>
    </div>
  );
}
