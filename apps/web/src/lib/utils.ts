import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCountdown(ms: number): string {
  if (ms <= 0) return "00:00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  if (days > 0) return `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function formatDate(ts: number): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(ts));
}

export function getWalletSessionId(): string {
  if (typeof window === "undefined") return "server";
  const key = "dragonfly-wallet-session";
  let session = localStorage.getItem(key);
  if (!session) {
    session = crypto.randomUUID();
    localStorage.setItem(key, session);
  }
  return session;
}

export function getFlightStorageKey(flightId: string): string {
  return `dragonfly-flight-${flightId}`;
}

export function saveActiveFlightId(flightId: string, dropId?: string) {
  localStorage.setItem("dragonfly-active-flight", flightId);
  if (dropId) {
    localStorage.setItem(`dragonfly-active-flight:${dropId}`, flightId);
  }
}

export function getActiveFlightId(dropId?: string): string | null {
  if (dropId) {
    return localStorage.getItem(`dragonfly-active-flight:${dropId}`);
  }
  return localStorage.getItem("dragonfly-active-flight");
}
