import { useSyncExternalStore } from "react";

// Flips to true when a read from Supabase fails and demo data is shown instead.

let offline = false;
const listeners = new Set<() => void>();

export function setOffline(value: boolean) {
  if (offline === value) return;
  offline = value;
  listeners.forEach((listener) => listener());
}

export function isOffline() {
  return offline;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useOffline() {
  return useSyncExternalStore(subscribe, isOffline);
}
