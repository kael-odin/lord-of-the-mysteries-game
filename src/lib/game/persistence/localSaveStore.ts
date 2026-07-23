// Local-first save layer: IndexedDB is the source of truth for game saves.
// Cloud sync (via /api/game) is an optional recoverable backup.
//
// Slot model: up to MAX_SLOTS manual slots + 1 auto slot. Each slot stores the
// full GameState plus a tiny header (name, pathway, seq, chapter, nodeId,
// ending, rounds, updatedAt). Corrupt saves are quarantined rather than
// clobbering good data.

import type { GameState } from "../types";

const DB_NAME = "lotm_saves";
const STORE = "slots";
const META_STORE = "meta";
const SCHEMA_VERSION = 1;
const MAX_SLOTS = 3;

export interface SaveSlot {
  id: string; // "auto" | "slot-1" | "slot-2" | "slot-3"
  state: GameState;
  updatedAt: number;
}

export interface SaveHeader {
  id: string;
  name: string;
  pathway: string | null;
  seq: number;
  chapter: number;
  nodeId: string;
  ending: string | null;
  rounds: number;
  updatedAt: number;
}

function headerOf(id: string, s: GameState): SaveHeader {
  return {
    id,
    name: s.name,
    pathway: s.pathway,
    seq: s.seq,
    chapter: s.chapter,
    nodeId: s.nodeId,
    ending: null,
    rounds: s.rounds,
    updatedAt: Date.now(),
  };
}

let dbPromise: Promise<IDBDatabase> | null = null;

function openDB(): Promise<IDBDatabase> {
  if (typeof indexedDB === "undefined") return Promise.reject(new Error("no indexeddb"));
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, SCHEMA_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(META_STORE)) {
        db.createObjectStore(META_STORE, { keyPath: "key" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

function tx<T>(
  store: string,
  mode: IDBTransactionMode,
  fn: (s: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return openDB().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const t = db.transaction(store, mode);
        const req = fn(t.objectStore(store));
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      }),
  );
}

function isValidState(s: unknown): s is GameState {
  if (!s || typeof s !== "object") return false;
  const o = s as Record<string, unknown>;
  return (
    typeof o.playerId === "string" &&
    typeof o.name === "string" &&
    typeof o.nodeId === "string" &&
    typeof o.hp === "number" &&
    typeof o.attrs === "object"
  );
}

export async function loadSlot(id: string): Promise<SaveSlot | null> {
  try {
    const raw = await tx<unknown>(STORE, "readonly", (s) => s.get(id));
    if (!raw) return null;
    const row = raw as { id: string; state: unknown; updatedAt: number };
    if (!isValidState(row.state)) {
      // Quarantine corrupt data under meta so we never clobber a good slot
      // silently, but don't crash the game either.
      await tx(META_STORE, "readwrite", (s) =>
        s.put({ key: `quarantine:${id}`, value: row, at: Date.now() }),
      );
      return null;
    }
    return { id, state: row.state, updatedAt: row.updatedAt };
  } catch {
    return null;
  }
}

export async function saveSlot(id: string, state: GameState): Promise<boolean> {
  try {
    await tx(STORE, "readwrite", (s) =>
      s.put({ id, state, updatedAt: Date.now() }),
    );
    return true;
  } catch {
    return false;
  }
}

export async function deleteSlot(id: string): Promise<void> {
  try {
    await tx(STORE, "readwrite", (s) => s.delete(id));
  } catch {
    /* ignore */
  }
}

export async function listSlots(): Promise<SaveHeader[]> {
  try {
    const all = await tx<unknown[]>(STORE, "readonly", (s) => s.getAll());
    const rows = (all || []) as { id: string; state: unknown; updatedAt: number }[];
    const out: SaveHeader[] = [];
    for (const r of rows) {
      if (!isValidState(r.state)) continue;
      const st = r.state as GameState;
      out.push(headerOf(r.id, { ...st, rounds: st.rounds }));
      // headerOf uses Date.now() for updatedAt; override with stored value:
      out[out.length - 1].updatedAt = r.updatedAt;
    }
    return out.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    return [];
  }
}

export async function getCurrentSlotId(): Promise<string | null> {
  try {
    const meta = await tx<{ key: string; value: string } | undefined>(
      META_STORE,
      "readonly",
      (s) => s.get("currentSlot"),
    );
    return meta?.value ?? null;
  } catch {
    return null;
  }
}

export async function setCurrentSlotId(id: string | null): Promise<void> {
  try {
    await tx(META_STORE, "readwrite", (s) => s.put({ key: "currentSlot", value: id }));
  } catch {
    /* ignore */
  }
}

// ---- Unlock / ending registry (for the ending gallery) ----

const UNLOCK_KEY = "endings_unlocked";

export function getUnlockedEndings(): string[] {
  if (typeof localStorage === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(UNLOCK_KEY) || "[]") as string[];
  } catch {
    return [];
  }
}

export function recordEnding(endingId: string): void {
  if (typeof localStorage === "undefined") return;
  const cur = getUnlockedEndings();
  if (!cur.includes(endingId)) {
    cur.push(endingId);
    localStorage.setItem(UNLOCK_KEY, JSON.stringify(cur));
  }
}

export function getSeenPathways(): string[] {
  if (typeof localStorage === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("pathways_seen") || "[]") as string[];
  } catch {
    return [];
  }
}

export function recordPathway(key: string): void {
  if (typeof localStorage === "undefined") return;
  const cur = getSeenPathways();
  if (!cur.includes(key)) {
    cur.push(key);
    localStorage.setItem("pathways_seen", JSON.stringify(cur));
  }
}

export { MAX_SLOTS };
