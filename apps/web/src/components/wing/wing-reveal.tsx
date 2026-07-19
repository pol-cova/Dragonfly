"use client";

import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { api } from "convex/_generated/api";
import { TermLink, TermPanel, TermStatus } from "@/components/terminal";
import { WingPreview } from "@/components/wing/wing-preview";

export function WingReveal() {
  const params = useParams<{ flightId: string }>();
  const [now] = useState(() => Date.now());
  const flight = useQuery(api.flights.get, {
    flightId: params.flightId,
    now,
  });

  if (!flight) {
    return <p className="font-mono text-sm text-[var(--fg-dim)]">loading…</p>;
  }

  const badgeSeed = flight.badgeSeed ?? flight.credentialCommitment;

  return (
    <div className="space-y-5">
      <TermPanel>
        <p className="font-terminal text-2xl text-[var(--fg)]">your wing</p>
        <div className="mt-4">
          <WingPreview badgeSeed={badgeSeed} size={200} />
        </div>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
          <TermStatus label="drop" value={flight.dropId} />
          <TermStatus label="alias" value={flight.alias} />
        </div>
      </TermPanel>

      <TermLink href="/solvers">solvers</TermLink>
    </div>
  );
}
