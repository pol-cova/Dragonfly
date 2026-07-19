/**
 * Referee-compatible hashing for Convex + web.
 *
 * Uses BLAKE2b-256 via @noble/hashes so Convex isolates can run without
 * Midnight WASM. The Compact circuit uses Midnight `persistentHash` when the
 * on-chain claim path is wired; local-referee claims use this digest.
 */
import { blake2b } from "@noble/hashes/blake2.js";
import { bytesToHex, hexToBytes } from "./bytes";

export function padBytes32(value: string): Uint8Array {
  const out = new Uint8Array(32);
  const encoded = new TextEncoder().encode(value);
  out.set(encoded.subarray(0, 32));
  return out;
}

export function stringToBytes32(value: string): Uint8Array {
  return padBytes32(value);
}

export function hexToBytes32(hex: string): Uint8Array {
  const bytes = hexToBytes(hex);
  if (bytes.length > 32) {
    throw new Error("Value exceeds 32 bytes");
  }
  const out = new Uint8Array(32);
  out.set(bytes);
  return out;
}

export function persistentHashVector(parts: Uint8Array[]): string {
  for (const part of parts) {
    if (part.length !== 32) {
      throw new Error("persistentHashVector requires 32-byte parts");
    }
  }
  const concat = new Uint8Array(parts.length * 32);
  parts.forEach((part, index) => {
    concat.set(part, index * 32);
  });
  return bytesToHex(blake2b(concat, { dkLen: 32 }));
}
