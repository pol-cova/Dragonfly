import { sha256 } from "@noble/hashes/sha2.js";
import {
  BADGE_DOMAIN,
  CREDENTIAL_DOMAIN,
  NULLIFIER_DOMAIN,
} from "./schemas";

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function hexToBytes(hex: string): Uint8Array {
  const normalized = hex.startsWith("0x") ? hex.slice(2) : hex;
  const bytes = new Uint8Array(normalized.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(normalized.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

export function randomHex(bytes = 32): string {
  const arr = new Uint8Array(bytes);
  globalThis.crypto.getRandomValues(arr);
  return bytesToHex(arr);
}

export function domainHash(domain: string, parts: string[]): string {
  const payload = [domain, ...parts].join("|");
  return bytesToHex(sha256(new TextEncoder().encode(payload)));
}

export function computeCredentialCommitment(
  dropId: string,
  flightId: string,
  completionCredential: string,
): string {
  return domainHash(CREDENTIAL_DOMAIN, [
    dropId,
    flightId,
    completionCredential,
  ]);
}

export function computeNullifier(
  dropId: string,
  privatePlayerSecret: string,
): string {
  return domainHash(NULLIFIER_DOMAIN, [dropId, privatePlayerSecret]);
}

export function computeBadgeSeed(
  dropId: string,
  nullifier: string,
  credentialCommitment: string,
): string {
  return domainHash(BADGE_DOMAIN, [dropId, nullifier, credentialCommitment]);
}

export * from "./schemas";
