"use client";

import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { api } from "convex/_generated/api";
import {
  TermButton,
  TermLink,
  TermPanel,
  TermStatus,
} from "@/components/terminal";
import { Countdown } from "@/components/ui/countdown";
import {
  StageCore,
  StageCrypto,
  StageRecon,
} from "@/components/puzzles/stage-panels";
import type { StageContent } from "@dragonfly/shared";
import { getWalletSessionId, saveActiveFlightId } from "@/lib/utils";

function readSavedFlightId(dropId: string): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(`dragonfly-active-flight:${dropId}`);
}

export function FlightExperience({ dropId }: { dropId: string }) {
  const router = useRouter();
  const [now] = useState(() => Date.now());
  const drop = useQuery(api.dropsQueries.getById, { dropId, now });
  const createFlight = useMutation(api.flights.create);
  const submitStage = useMutation(api.flights.submitStage);
  const [flightId, setFlightId] = useState<string | null>(() =>
    readSavedFlightId(dropId),
  );
  const flight = useQuery(
    api.flights.get,
    flightId ? { flightId, now } : "skip",
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [starting, setStarting] = useState(false);
  const [inputShake, setInputShake] = useState(false);
  const [started, setStarted] = useState(() => Boolean(readSavedFlightId(dropId)));

  useEffect(() => {
    if (flight?.currentStage === 3 && flightId) {
      router.prefetch(`/claim/${flightId}`);
    }
  }, [flight?.currentStage, flightId, router]);

  const flashInputError = useCallback(() => {
    setInputShake(true);
    window.setTimeout(() => setInputShake(false), 200);
  }, []);

  async function beginFlight() {
    setStarting(true);
    setError(null);
    try {
      const result = await createFlight({
        dropId,
        walletSessionId: getWalletSessionId(),
      });
      setFlightId(result.flightId);
      saveActiveFlightId(result.flightId, dropId);
      setStarted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start Flight");
    } finally {
      setStarting(false);
    }
  }

  const handleSubmit = useCallback(
    async (answer: string) => {
      if (!flightId || !flight?.stage || submitting) return;
      setSubmitting(true);
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
          flashInputError();
          return;
        }
        if (result.claimReady) {
          router.push(`/claim/${flightId}`);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Submission failed");
        flashInputError();
      } finally {
        setSubmitting(false);
      }
    },
    [flight?.stage, flightId, flashInputError, router, submitStage, submitting],
  );

  if (drop === undefined) {
    return <p className="font-mono text-sm text-[var(--fg-dim)]">loading…</p>;
  }

  if (!drop) {
    return (
      <p className="font-mono text-sm text-[var(--fg-err)]">
        drop unavailable — is convex dev running?
      </p>
    );
  }

  const isClosed = drop.status === "closed" || drop.status === "archived";

  if (!started && !flightId) {
    return (
      <div className="space-y-5">
        <TermPanel>
          <p className="font-terminal text-2xl text-[var(--fg)]">{drop.name}</p>
          <p className="mt-3 font-mono text-sm leading-relaxed text-[var(--fg-dim)]">
            {drop.story}
          </p>
        </TermPanel>
        {isClosed ? (
          <p className="font-mono text-sm text-[var(--fg-warn)]">drop closed</p>
        ) : (
          <TermButton type="button" onClick={beginFlight} disabled={starting}>
            {starting ? "starting…" : "begin flight"}
          </TermButton>
        )}
        {error && (
          <p className="font-mono text-sm text-[var(--fg-err)]">{error}</p>
        )}
      </div>
    );
  }

  if (!flight) {
    return (
      <p className="font-mono text-sm text-[var(--fg-dim)]">loading flight…</p>
    );
  }

  const stage = flight.stage as StageContent | undefined;
  const stageKey = `${flight.flightId}-${flight.currentStage}`;

  return (
    <div className="space-y-5">
      <TermPanel>
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <p className="font-terminal text-xl text-[var(--fg)]">
              stage {flight.currentStage} · {stage?.title}
            </p>
            <TermStatus label="alias" value={flight.alias} />
          </div>
          <Countdown target={drop.closesAt} label="closes" />
        </div>
        {stage && (
          <div className="mt-4 space-y-2 font-mono text-sm">
            <p className="text-[var(--fg-dim)]">{stage.narrative}</p>
            <p className="text-[var(--fg)]">{stage.objective}</p>
            {stage.hint && (
              <details className="text-[var(--fg-dim)]">
                <summary className="cursor-pointer hover:text-[var(--fg)]">
                  hint
                </summary>
                <p className="mt-2">{stage.hint}</p>
              </details>
            )}
          </div>
        )}
      </TermPanel>

      {submitting && (
        <p className="font-mono text-sm text-[var(--fg-dim)] term-pulse">
          verifying…
        </p>
      )}

      {stage?.number === 1 && (
        <StageRecon
          key={stageKey}
          stage={stage}
          onSubmit={handleSubmit}
          submitting={submitting}
          shake={inputShake}
        />
      )}
      {stage?.number === 2 && (
        <StageCrypto
          key={stageKey}
          stage={stage}
          onSubmit={handleSubmit}
          submitting={submitting}
          shake={inputShake}
        />
      )}
      {stage?.number === 3 && (
        <StageCore
          key={stageKey}
          stage={stage}
          onSubmit={handleSubmit}
          submitting={submitting}
          shake={inputShake}
        />
      )}

      {error && (
        <p className="font-mono text-sm text-[var(--fg-err)]">{error}</p>
      )}

      {flight.status === "claimed" && (
        <TermLink href={`/wing/${flight.flightId}`}>view wing</TermLink>
      )}
    </div>
  );
}
