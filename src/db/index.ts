import { drizzle } from "drizzle-orm/node-postgres";
import type { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

// Lazy, optional Postgres pool. The game is local-first (IndexedDB) and must
// run even without a database configured. The pool is only constructed when a
// route actually requests it via `getDb()`.
let pool: Pool | null = null;

export function getDb() {
  if (!databaseUrl) return null;
  if (!pool) {
    // Lazy require so the `pg` driver is never imported at build time when no
    // DATABASE_URL is present — keeps `next build` hermetic.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Pool: PgPool } = require("pg") as typeof import("pg");
    pool = new PgPool({ connectionString: databaseUrl });
    if (process.env.NODE_ENV !== "production") {
      (globalThis as typeof globalThis & { __lotmPool?: Pool }).__lotmPool = pool;
    }
  }
  return drizzle(pool);
}

// Back-compat: legacy imports may reference `db` directly. It is null when no
// DATABASE_URL is set; new code must use `getDb()` instead.
export const db = getDb();
