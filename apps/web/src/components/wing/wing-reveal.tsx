"use client";

import { useQuery } from "convex/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { api } from "convex/_generated/api";
import { WingPreview } from "@/components/wing/wing-preview";

export function WingReveal() {
  const params = useParams<{ flightId: string }>();
  const [now] = useState(() => Date.now());
  const flight = useQuery(api.flights.get, {
    flightId: params.flightId,
    now,
  });

  if (!flight) {
    return <p className="p-16 text-slate-400">Loading Wing...</p>;
  }

  const badgeSeed = flight.badgeSeed ?? flight.credentialCommitment;

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-8 px-6 py-20 text-center">
      <p className="text-xs uppercase tracking-[0.35em] text-amber-400">
        Wing Acquired
      </p>
      <WingPreview badgeSeed={badgeSeed} size={260} />
      <div>
        <h1 className="font-display text-3xl text-cyan-50">The Silent Signal</h1>
        <p className="mt-2 font-mono text-cyan-300">{flight.alias}</p>
        <p className="mt-4 inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1 text-sm text-emerald-300">
          Verified
        </p>
      </div>
      <Link href="/solvers" className="text-cyan-400 hover:underline">
        View solver board →
      </Link>
    </div>
  );
}
