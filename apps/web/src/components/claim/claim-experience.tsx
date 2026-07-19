"use client";

import { useAction, useMutation } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "convex/_generated/api";
import { TermButton, TermLink, TermPanel } from "@/components/terminal";
import { WingPreview } from "@/components/wing/wing-preview";
import {
  connectLaceWallet,
  deriveClaimProof,
  submitMidnightClaim,
} from "@/lib/midnight/claim";
import { getWalletSessionId } from "@/lib/utils";

const statusLabel: Record<string, string> = {
  wallet: "connecting wallet…",
  credential: "releasing credential…",
  proving: "verifying…",
};

export function ClaimExperience() {
  const params = useParams<{ flightId: string }>();
  const router = useRouter();
  const completeFlight = useAction(api.flights.complete);
  const recordClaim = useMutation(api.flights.recordClaim);
  const [status, setStatus] = useState<
    "idle" | "wallet" | "credential" | "proving" | "done" | "error"
  >("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [badgeSeed, setBadgeSeed] = useState<string | null>(null);

  async function handleClaim() {
    setStatus("wallet");
    setMessage(null);
    try {
      await connectLaceWallet();
      const walletSessionId = getWalletSessionId();

      setStatus("credential");
      const creds = await completeFlight({
        flightId: params.flightId,
        walletSessionId,
      });

      setStatus("proving");
      const proof = deriveClaimProof({
        dropId: creds.dropId,
        flightId: creds.flightId,
        alias: creds.alias,
        completionCredential: creds.completionCredential,
        privatePlayerSecret: creds.privatePlayerSecret,
        credentialCommitment: creds.credentialCommitment,
      });

      submitMidnightClaim(
        {
          dropId: creds.dropId,
          flightId: creds.flightId,
          alias: creds.alias,
          completionCredential: creds.completionCredential,
          privatePlayerSecret: creds.privatePlayerSecret,
          credentialCommitment: creds.credentialCommitment,
        },
        proof,
      );

      const result = await recordClaim({
        flightId: params.flightId,
        walletSessionId,
      });

      setBadgeSeed(result.badgeSeed);
      setStatus("done");
      setMessage(
        result.duplicate
          ? "Wing already claimed for this flight."
          : "Claim verified.",
      );
    } catch (e) {
      setStatus("error");
      setMessage(e instanceof Error ? e.message : "Claim failed");
    }
  }

  return (
    <div className="space-y-5">
      <TermPanel>
        <p className="font-terminal text-2xl text-[var(--fg)]">claim wing</p>
        <p className="mt-2 font-mono text-sm text-[var(--fg-dim)]">
          Prove completion without publishing your answers.
        </p>
      </TermPanel>

      {status === "idle" && (
        <TermButton type="button" onClick={handleClaim}>
          prove and claim
        </TermButton>
      )}

      {status !== "idle" && status !== "done" && status !== "error" && (
        <p className="font-mono text-sm text-[var(--fg-dim)] term-pulse">
          {statusLabel[status]}
        </p>
      )}

      {message && (
        <p
          className={`font-mono text-sm ${
            status === "error"
              ? "text-[var(--fg-err)]"
              : "text-[var(--fg)]"
          }`}
        >
          {message}
        </p>
      )}

      {badgeSeed && (
        <TermPanel>
          <div className="flex flex-col items-start gap-4">
            <WingPreview badgeSeed={badgeSeed} size={180} />
            <TermButton
              type="button"
              onClick={() => router.push(`/wing/${params.flightId}`)}
            >
              view wing
            </TermButton>
          </div>
        </TermPanel>
      )}

      <TermLink href="/">home</TermLink>
    </div>
  );
}
