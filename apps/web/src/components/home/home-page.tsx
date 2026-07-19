"use client";

import { useAction, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "convex/_generated/api";
import type { ActiveDrop } from "@dragonfly/shared";
import { TermLink, TermPanel } from "@/components/terminal";
import { Countdown } from "@/components/ui/countdown";
import { formatDate } from "@/lib/utils";
import { site } from "@/lib/site";

export function HomePage() {
  const [now] = useState(() => Date.now());
  const catalog = useQuery(api.dropsQueries.list, { now });
  const bootstrapActiveDrop = useAction(api.dropsActions.bootstrapActiveDrop);

  useEffect(() => {
    void bootstrapActiveDrop({});
  }, [bootstrapActiveDrop]);

  const drops = (catalog?.drops ?? []) as ActiveDrop[];
  const activeDrops = drops.filter((d) => d.status === "active");
  const upcomingDrops = drops.filter((d) => d.status === "upcoming");
  const archivedDrops = drops.filter(
    (d) => d.status === "archived" || d.status === "closed",
  );

  return (
    <div className="space-y-6">
      <p className="max-w-xl font-mono text-sm text-[var(--fg-dim)]">
        {site.tagline}. Solve, prove privately, claim your Wing.
      </p>

      {!catalog ? (
        <p className="font-mono text-sm text-[var(--fg-dim)]">loading drops…</p>
      ) : (
        <TermPanel title="active">
          <ul className="divide-y divide-[var(--border)]">
            {activeDrops.map((drop) => (
              <li
                key={drop.id}
                className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 space-y-1">
                  <p className="font-terminal text-xl text-[var(--fg)]">
                    {drop.name}
                    {drop.id === "drop-003" ? (
                      <span className="ml-2 font-mono text-xs text-[var(--fg-warn)]">
                        recommended
                      </span>
                    ) : null}
                  </p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-[var(--fg-dim)]">
                    <span>{drop.difficulty}</span>
                    <Countdown target={drop.closesAt} label="closes in" />
                    <span>{drop.solverCount} solvers</span>
                  </div>
                </div>
                <TermLink href={`/drop/${drop.id}`} bracket={false}>
                  open
                </TermLink>
              </li>
            ))}
          </ul>
        </TermPanel>
      )}

      {upcomingDrops.length > 0 && (
        <TermPanel title="upcoming" plain>
          <ul className="space-y-2 font-mono text-sm text-[var(--fg-dim)]">
            {upcomingDrops.map((drop) => (
              <li key={drop.id}>
                {drop.name} · opens {formatDate(drop.opensAt)}
              </li>
            ))}
          </ul>
        </TermPanel>
      )}

      {archivedDrops.length > 0 && (
        <TermPanel title="archived" plain>
          <ul className="space-y-2 font-mono text-sm text-[var(--fg-dim)]">
            {archivedDrops.map((drop) => (
              <li key={drop.id}>
                {drop.name} · {drop.solverCount} solvers
              </li>
            ))}
          </ul>
        </TermPanel>
      )}
    </div>
  );
}
