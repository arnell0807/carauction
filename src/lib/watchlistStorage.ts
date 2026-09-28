const WATCHLIST_KEY = "revbid.watchlist.v1";

export function readWatchlist(): string[] {
  try {
    const raw = localStorage.getItem(WATCHLIST_KEY);
    const ids: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(ids) ? ids : [];
  } catch {
    return [];
  }
}

export function writeWatchlist(ids: string[]) {
  try {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(ids));
  } catch (error) {
    console.warn("Couldn't save watchlist", error);
  }
}
