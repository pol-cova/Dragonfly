"use client";

import { useMutation, useQuery } from "convex/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "convex/_generated/api";
import { Countdown } from "@/components/ui/countdown";
import {
  StageCore,
  StageCrypto,
  StageRecon,
} from "@/components/puzzles/stage-panels";
import type { StageContent } from "@dragonfly/shared";
import {
  getWalletSessionId,
  saveActiveFlightId,
} from "@/lib/utils";

export function FlightExperience({ dropId }: { dropId: string }) {
  const router = useRouter();
  const [now] = useState(() => Date.now());
  const drop = useQuery(api.dropsQueries.getActive, { now });
  const createFlight = useMutation(api.flights.create);
  const submitStage = useMutation(api.flights.submitStage);
  const [flightId, setFlightId] = useState<string | null>(null);
  const flight = useQuery(
    api.flights.get,
    flightId ? { flightId, now } : "skip",
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("dragonfly-active-flight");
      if (saved) {
        setFlightId(saved);
        setStarted(true);
      }
    }
  }, []);

  async function beginFlight() {
    setLoading(true);
    setError(null);
    try {
      const result = await createFlight({
        dropId,
        walletSessionId: getWalletSessionId(),
      });
      setFlightId(result.flightId);
      saveActiveFlightId(result.flightId);
      setStarted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start Flight");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(answer: string) {
    if (!flightId || !flight?.stage) return;
    setLoading(true);
    setError(null);
    try {
      const result = await submitStage({
        flightId,
        walletSessionId: getWalletSessionId(),
        stage: flight.stage.number,
        answer,
      });
      if (!result.correct) {
        setError(result.message ?? "The signal does not match.");
        return;
      }
      if (result.claimReady) {
        router.push(`/claim/${flightId}`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submission failed");
    } finally {
      setLoading(false);
    }
  }

  if (drop === undefined) {
    return <p className="text-slate-400">Loading Drop...</p>;
  }

  if (!drop) {
    return (
      <p className="text-slate-400">
        Drop unavailable. Run{" "}
        <code className="text-cyan-300">npx convex dev</code> and start a Flight
        to initialize.
      </p>
    );
  }

  const isClosed = drop.status === "closed";

  if (!started && !flightId) {
    return (
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-amber-400">
            Flight Briefing
          </p>
          <h1 className="mt-3 font-display text-4xl text-cyan-50">
            {drop.name}
          </h1>
          <p className="mt-4 text-slate-300">{drop.story}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6 text-sm text-slate-400">
          <p>• Your puzzle variation is unique to this Flight.</p>
          <p>• Answers and credentials are never published.</p>
          <p>• Prove completion privately on Midnight to claim your Wing.</p>
        </div>
        {isClosed ? (
          <p className="text-amber-400">This Drop has closed.</p>
        ) : (
          <button
            type="button"
            onClick={beginFlight}
            disabled={loading}
            className="rounded-full bg-amber-500 px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-950"
          >
            Begin Flight
          </button>
        )}
        {error && <p className="text-red-400">{error}</p>}
      </div>
    );
  }

  if (!flight) {
    return <p className="text-slate-400">Restoring Flight...</p>;
  }

  const stage = flight.stage as StageContent | undefined;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">
            {flight.alias}
          </p>
          <h2 className="mt-2 text-2xl text-cyan-50">
            Stage {flight.currentStage} — {stage?.title}
          </h2>
        </div>
        <Countdown target={drop.closesAt} label="Drop closes in" />
      </div>

      {stage && (
        <div className="space-y-4">
          <p className="text-slate-300">{stage.narrative}</p>
          <p className="text-sm text-amber-300/80">{stage.objective}</p>
          {stage.hint && (
            <details className="text-sm text-slate-500">
              <summary className="cursor-pointer text-cyan-400/80">
                Hint
              </summary>
              <p className="mt-2">{stage.hint}</p>
            </details>
          )}
        </div>
      )}

      {stage?.number === 1 && (
        <StageRecon stage={stage} onSubmit={handleSubmit} loading={loading} />
      )}
      {stage?.number === 2 && (
        <StageCrypto stage={stage} onSubmit={handleSubmit} loading={loading} />
      )}
      {stage?.number === 3 && (
        <StageCore stage={stage} onSubmit={handleSubmit} loading={loading} />
      )}

      <div className="flex gap-2">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className={`h-2 flex-1 rounded-full ${
              flight.completedStages.includes(n)
                ? "bg-amber-400"
                : flight.currentStage === n
                  ? "bg-cyan-400"
                  : "bg-slate-800"
            }`}
          />
        ))}
      </div>

      {error && <p className="text-red-400">{error}</p>}

      {flight.status === "claimed" && (
        <Link href={`/wing/${flight.flightId}`} className="text-cyan-300 underline">
          View your Wing
        </Link>
      )}
    </div>
  );
}
