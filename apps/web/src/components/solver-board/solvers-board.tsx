"use client";

import { useQuery } from "convex/react";
import Link from "next/link";
import type { SolverEntry } from "@dragonfly/shared";
import { api } from "convex/_generated/api";
import { WingPreview } from "@/components/wing/wing-preview";
import { formatDate } from "@/lib/utils";

export function SolversBoard() {
  const data = useQuery(api.solvers.list, { dropId: "drop-001" });

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-6 py-16">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-amber-400">
          Anonymous Solver Board
        </p>
        <h1 className="mt-3 font-display text-4xl text-cyan-50">
          Verified Wings
        </h1>
        <p className="mt-3 text-slate-400">
          Aliases and Wings only — no answers, attempts, or wallet details.
        </p>
      </div>

      {!data && <p className="text-slate-500">Loading solvers...</p>}

      {data && data.solvers.length === 0 && (
        <p className="text-slate-500">No verified solvers yet. Be the first.</p>
      )}

      <div className="grid gap-4">
        {data?.solvers.map((solver: SolverEntry) => (
          <div
            key={`${solver.alias}-${solver.claimedAt}`}
            className="flex items-center gap-6 rounded-2xl border border-slate-800 bg-slate-950/50 p-4"
          >
            <WingPreview badgeSeed={solver.badgeSeed} size={72} />
            <div>
              <p className="font-mono text-cyan-200">{solver.alias}</p>
              <p className="text-sm text-slate-500">
                Verified {formatDate(solver.claimedAt)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Link href="/" className="text-cyan-400 hover:underline">
        ← Back home
      </Link>
    </div>
  );
}
