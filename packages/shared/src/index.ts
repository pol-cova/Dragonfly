import {
  BADGE_DOMAIN,
  CREDENTIAL_DOMAIN,
  NULLIFIER_DOMAIN,
} from "./schemas";
import { bytesToHex, hexToBytes } from "./bytes";
import {
  hexToBytes32,
  padBytes32,
  persistentHashVector,
  stringToBytes32,
} from "./hash-compact";

export { bytesToHex, hexToBytes } from "./bytes";

export function randomHex(bytes = 32): string {
  const arr = new Uint8Array(bytes);
  globalThis.crypto.getRandomValues(arr);
  return bytesToHex(arr);
}

export function computeCredentialCommitment(
  dropId: string,
  flightId: string,
  completionCredential: string,
): string {
  return persistentHashVector([
    padBytes32(CREDENTIAL_DOMAIN),
    stringToBytes32(dropId),
    stringToBytes32(flightId),
    hexToBytes32(completionCredential),
  ]);
}

export function computeNullifier(
  dropId: string,
  privatePlayerSecret: string,
): string {
  return persistentHashVector([
    padBytes32(NULLIFIER_DOMAIN),
    stringToBytes32(dropId),
    hexToBytes32(privatePlayerSecret),
  ]);
}

export function computeBadgeSeed(
  dropId: string,
  nullifier: string,
  credentialCommitment: string,
): string {
  return persistentHashVector([
    padBytes32(BADGE_DOMAIN),
    stringToBytes32(dropId),
    hexToBytes32(nullifier),
    hexToBytes32(credentialCommitment),
  ]);
}

export * from "./schemas";
export * from "./hash-compact";
