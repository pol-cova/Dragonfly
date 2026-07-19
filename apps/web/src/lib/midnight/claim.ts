import {
  computeBadgeSeed,
  computeCredentialCommitment,
  computeNullifier,
} from "@dragonfly/shared";

export {
  computeBadgeSeed,
  computeCredentialCommitment,
  computeNullifier,
};

export interface ClaimInputs {
  dropId: string;
  flightId: string;
  alias: string;
  completionCredential: string;
  privatePlayerSecret: string;
  credentialCommitment: string;
}

export function deriveClaimProof(inputs: ClaimInputs) {
  const derivedCommitment = computeCredentialCommitment(
    inputs.dropId,
    inputs.flightId,
    inputs.completionCredential,
  );

  if (derivedCommitment !== inputs.credentialCommitment) {
    throw new Error("Credential does not match registered commitment");
  }

  const nullifier = computeNullifier(
    inputs.dropId,
    inputs.privatePlayerSecret,
  );
  const badgeSeed = computeBadgeSeed(
    inputs.dropId,
    nullifier,
    inputs.credentialCommitment,
  );

  return { nullifier, badgeSeed, derivedCommitment };
}

export async function connectLaceWallet(): Promise<{
  address: string;
  connected: boolean;
}> {
  const midnight = (window as unknown as { midnight?: { enable?: () => Promise<{ name: string }> } }).midnight;
  if (midnight?.enable) {
    const api = await midnight.enable();
    return { address: api.name, connected: true };
  }

  return { address: "anonymous-session", connected: false };
}

export function submitMidnightClaim(
  _inputs: ClaimInputs,
  _proof: { badgeSeed: string; nullifier: string },
): { verified: boolean; mode: "chain" | "local-referee" } {
  return {
    verified: false,
    mode: "local-referee",
  };
}
