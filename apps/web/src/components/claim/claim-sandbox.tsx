"use client";

import { useState } from "react";
import { WingPreview } from "@/components/wing/wing-preview";
import {
  computeCredentialCommitment,
  deriveClaimProof,
} from "@/lib/midnight/claim";

export function ClaimSandbox() {
  const [result, setResult] = useState<string | null>(null);

  async function runSlice() {
    const dropId = "drop-001";
    const flightId = crypto.randomUUID();
    const credential = "a".repeat(64);
    const secret = "b".repeat(64);
    const commitment = computeCredentialCommitment(
      dropId,
      flightId,
      credential,
    );
    const proof = deriveClaimProof({
      dropId,
      flightId,
      alias: "DRGN-TEST",
      completionCredential: credential,
      privatePlayerSecret: secret,
      credentialCommitment: commitment,
    });
    setResult(proof.badgeSeed);
  }

  return (
    <div className="mx-auto max-w-lg space-y-6 px-6 py-16 text-center">
      <h1 className="text-2xl text-cyan-100">Midnight Claim Sandbox</h1>
      <p className="text-sm text-slate-400">
        Client-side credential commitment + badge seed derivation (mirrors
        dragonfly.compact).
      </p>
      <button
        type="button"
        onClick={runSlice}
        className="rounded-full bg-amber-500 px-6 py-3 text-slate-950"
      >
        Run vertical slice
      </button>
      {result && (
        <>
          <p className="font-mono text-xs text-cyan-300 break-all">{result}</p>
          <WingPreview badgeSeed={result} size={160} />
        </>
      )}
    </div>
  );
}
