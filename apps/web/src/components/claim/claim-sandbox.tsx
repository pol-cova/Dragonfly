"use client";

import { useState } from "react";
import { TermButton, TermPanel } from "@/components/terminal";
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
    <div className="space-y-6">
      <TermPanel>
        <p className="font-terminal text-2xl text-[var(--fg)]">claim sandbox</p>
        <p className="mt-2 font-mono text-sm text-[var(--fg-dim)]">
          Client-side credential commitment and badge seed.
        </p>
      </TermPanel>
      <TermButton type="button" onClick={runSlice}>
        run slice
      </TermButton>
      {result && (
        <TermPanel>
          <p className="break-all font-mono text-xs text-[var(--fg-dim)]">
            {result}
          </p>
          <div className="mt-3">
            <WingPreview badgeSeed={result} size={160} />
          </div>
        </TermPanel>
      )}
    </div>
  );
}
