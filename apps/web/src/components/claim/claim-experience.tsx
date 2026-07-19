"use client";

import { useAction, useMutation } from "convex/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "convex/_generated/api";
import { WingPreview } from "@/components/wing/wing-preview";
import {
  connectLaceWallet,
  deriveClaimProof,
  submitMidnightClaim,
} from "@/lib/midnight/claim";
import { getWalletSessionId } from "@/lib/utils";

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
  const [walletConnected, setWalletConnected] = useState(false);

  async function handleClaim() {
    setStatus("wallet");
    setMessage(null);
    try {
      const wallet = await connectLaceWallet();
      setWalletConnected(wallet.connected || wallet.address !== "anonymous-session");
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
          ? "Wing already claimed for this Flight."
          : "Claim verified. Credential never published.",
      );
    } catch (e) {
      setStatus("error");
      setMessage(e instanceof Error ? e.message : "Claim failed");
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-8 text-center">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-amber-400">
          Private Claim
        </p>
        <h1 className="mt-3 font-display text-4xl text-cyan-50">
          Prove & Claim
        </h1>
        <p className="mt-4 text-slate-400">
          Midnight verifies you possess the completion credential without
          revealing it publicly. Your puzzle answers stay private.
        </p>
      </div>

      {status === "idle" && (
        <button
          type="button"
          onClick={handleClaim}
          className="rounded-full bg-amber-500 px-10 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-950"
        >
          Prove and Claim Wing
        </button>
      )}

      {status !== "idle" && status !== "done" && status !== "error" && (
        <p className="animate-pulse text-cyan-300">
          {status === "wallet" && "Connecting wallet..."}
          {status === "credential" && "Releasing credential privately..."}
          {status === "proving" && "Verifying credential commitment..."}
        </p>
      )}

      {message && (
        <p className={status === "error" ? "text-red-400" : "text-emerald-400"}>
          {message}
        </p>
      )}

      {badgeSeed && (
        <div className="flex flex-col items-center gap-6">
          <WingPreview badgeSeed={badgeSeed} size={200} />
          <button
            type="button"
            onClick={() => router.push(`/wing/${params.flightId}`)}
            className="text-cyan-300 underline"
          >
            Reveal Wing
          </button>
        </div>
      )}

      {!walletConnected && status === "done" && (
        <p className="text-xs text-slate-500">
          Lace unavailable — claim verified with local proof matching contract
          logic. Connect Lace + deploy contract for on-chain verification.
        </p>
      )}

      <Link href="/" className="block text-sm text-slate-500 hover:text-cyan-300">
        ← Back to Drop
      </Link>
    </div>
  );
}
