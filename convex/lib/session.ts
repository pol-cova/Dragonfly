import { v } from "convex/values";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const MAX_ACTIVE_FLIGHTS_PER_SESSION = 3;

export function assertValidWalletSessionId(walletSessionId: string): void {
  if (walletSessionId === "server") return;
  if (!UUID_RE.test(walletSessionId)) {
    throw new Error("Invalid wallet session");
  }
}

export function assertFlightOwner(
  flight: { walletSessionId: string },
  walletSessionId: string,
): void {
  assertValidWalletSessionId(walletSessionId);
  if (flight.walletSessionId !== walletSessionId) {
    throw new Error("Unauthorized");
  }
}
