# M0 Reproducible Baseline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the imported prototype into a reproducible, testable, locally playable and safely publishable baseline without pretending that the six-chapter rebuild is already implemented.

**Architecture:** Keep the current Next.js application and story prototype, but put deterministic validation, IndexedDB autosave, explicit offline behavior, deliverable database configuration and CI around it. Disable the insecure legacy cloud API until the signed-session cloud design is implemented in a later milestone, and fix only the prototype regressions that block honest baseline play.

**Tech Stack:** Next.js 16, React 19, TypeScript 5.9, Vitest, Playwright, Zod, idb, fake-indexeddb, Drizzle ORM, PostgreSQL, GitHub Actions.

---

## Scope Split

The approved design spans several independently testable subsystems. It is deliberately split into milestone plans:

- **This plan, M0:** package reproducibility, tests, content validation, critical prototype fixes, local autosave, explicit offline mode, visual assets, database delivery files, CI and smoke QA.
- **M1:** pure reducer, typed content actions, seeded RNG, selectors, save migrations and signed-session cloud synchronization.
- **M2:** new shell, evidence board, map, first two rewritten chapters and five pathway acquisition flows.
- **M3:** city schedule, relationships, organizations, sealed artifacts, chapters three and four, acting and sequence 8 progression.
- **M4:** chapters five and six, route finales, ending gallery, second-run features and full balance pass.
- **M5:** release candidate security, privacy, accessibility, performance, deployment and five-route manual acceptance.

M0 must leave working software. It must not introduce temporary domain abstractions that M1 would immediately delete.

## File Responsibility Map

### Repository and tooling

- `.gitattributes`: stable LF text behavior and binary asset declarations.
- `package.json`: scripts and declared test/runtime dependencies.
- `package-lock.json`: exact npm dependency graph.
- `vitest.config.ts`: unit/content test configuration and `@` alias.
- `playwright.config.ts`: browser smoke configuration and local web server.
- `src/test/setup.ts`: fake IndexedDB setup and shared test cleanup.
- `.github/workflows/ci.yml`: install, static analysis, unit tests, build and browser smoke gate.

### Content correctness

- `src/lib/game/validation/storyGraph.ts`: pure story graph validator.
- `src/lib/game/validation/storyGraph.test.ts`: synthetic and real-content graph tests.
- `src/lib/game/progression.test.ts`: critical progression and combat regressions.
- `src/lib/game/story1.ts`: revolver acquisition correction.
- `src/lib/game/story2.ts`: prototype time-skip digestion correction.
- `src/lib/game/engine.ts`: damage log correction only; larger engine work belongs to M1.

### Local persistence

- `src/lib/game/persistence/saveSchema.ts`: runtime schema and versioned save envelope.
- `src/lib/game/persistence/localSaveStore.ts`: IndexedDB CRUD and corrupt-save quarantine.
- `src/lib/game/persistence/localSaveStore.test.ts`: save round-trip and quarantine tests.
- `src/lib/game/persistence/usePrototypeAutosave.ts`: current-prototype autosave hook and visible status.
- `src/app/game/page.tsx`: load local autosave, use the hook and render truthful save status.
- `src/app/page.tsx`: detect a local autosave instead of a stale `localStorage` player ID.

### Delivery and explicit offline behavior

- `.env.example`: optional database configuration with no credentials.
- `drizzle.config.ts`: environment-driven Drizzle Kit configuration.
- `drizzle.config.json`: removed because it embeds a local connection string.
- `drizzle/0000_initial_lotm_saves.sql`: generated reproducible initial schema.
- `drizzle/meta/_journal.json`: Drizzle migration journal generated with the SQL.
- `drizzle/meta/0000_snapshot.json`: schema snapshot generated with the SQL.
- `src/db/index.ts`: lazy optional database construction.
- `src/app/api/game/route.ts`: legacy cloud endpoint returns `410 legacy_cloud_disabled`.
- `src/app/api/game/recent/route.ts`: explicit unavailable response with an empty list.
- `src/app/api/health/route.ts`: health response distinguishes app health and cloud configuration.
- `src/app/api/api-contract.test.ts`: API status and payload regression tests.
- `README.md`: local, database and verification instructions.

### Visual baseline

- `public/images/bg-city.png`: original Tingen gaslight street scene.
- `public/images/bg-fog-palace.png`: original dreamlike occult chamber used only by the imported prototype.
- `public/images/bg-ritual.png`: original ritual cellar scene.
- `public/images/tarot.png`: original vertical occult paper texture.
- `src/lib/game/assets.ts`: single asset manifest.
- `src/lib/game/assets.test.ts`: all manifest files exist and are nontrivial bitmap files.
- `src/app/page.tsx`, `src/app/game/page.tsx`, `src/components/game/EndingScreen.tsx`, `src/components/game/PathwaySelect.tsx`: consume the manifest.

## Task 1: Establish the Reproducible Toolchain

**Files:**
- Create: `.gitattributes`
- Create: `package-lock.json` through npm
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `src/test/setup.ts`
- Create: `src/lib/game/engine.smoke.test.ts`
- Modify: `package.json`

- [ ] **Step 1: Install declared runtime and development dependencies**

Run:

```powershell
npm.cmd install idb zod
npm.cmd install --save-dev vitest @vitest/coverage-v8 fake-indexeddb @playwright/test
```

Expected: `package-lock.json` is created; npm exits `0`; no dependency is installed globally.

- [ ] **Step 2: Add exact verification scripts to `package.json`**

Set the package name to `embers-in-the-fog` and replace the `scripts` object with:

```json
"name": "embers-in-the-fog"
```

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint .",
  "typecheck": "tsc --noEmit",
  "test": "vitest",
  "test:run": "vitest run",
  "test:coverage": "vitest run --coverage",
  "test:e2e": "playwright test",
  "verify": "npm run lint && npm run typecheck && npm run test:run && npm run build",
  "db:generate": "drizzle-kit generate",
  "db:migrate": "drizzle-kit migrate"
}
```

- [ ] **Step 3: Create `.gitattributes`**

```gitattributes
* text=auto eol=lf
*.png binary
*.jpg binary
*.jpeg binary
*.webp binary
*.woff2 binary
```

- [ ] **Step 4: Create the Vitest configuration**

Create `vitest.config.ts`:

```ts
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "html"],
      include: ["src/lib/game/**/*.ts"],
      exclude: ["src/lib/game/**/*.test.ts", "src/lib/game/story*.ts"],
    },
  },
});
```

Create `src/test/setup.ts`:

```ts
import "fake-indexeddb/auto";
```

- [ ] **Step 5: Write the first smoke test**

Create `src/lib/game/engine.smoke.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { makeInitialState } from "./engine";

describe("makeInitialState", () => {
  it("creates a bounded ordinary investigator state", () => {
    const state = makeInitialState("艾琳", "run_test");

    expect(state.name).toBe("艾琳");
    expect(state.nodeId).toBe("c1_wake");
    expect(state.pathway).toBeNull();
    expect(state.hp).toBe(state.maxHp);
    expect(state.sp).toBe(state.maxSp);
    expect(state.sanity).toBe(state.maxSanity);
  });
});
```

- [ ] **Step 6: Run the smoke test and static checks**

Run:

```powershell
npm.cmd run test:run -- src/lib/game/engine.smoke.test.ts
npm.cmd run typecheck
```

Expected: one test passes; TypeScript exits `0`.

- [ ] **Step 7: Create the Playwright configuration without running browsers yet**

Create `playwright.config.ts`:

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://127.0.0.1:3100",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "desktop-chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chromium", use: { ...devices["Pixel 5"] } },
  ],
  webServer: {
    command: "npm run dev -- --hostname 127.0.0.1 --port 3100",
    url: "http://127.0.0.1:3100/api/health",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

- [ ] **Step 8: Commit the toolchain**

```powershell
git add .gitattributes package.json package-lock.json vitest.config.ts playwright.config.ts src/test/setup.ts src/lib/game/engine.smoke.test.ts
git commit -m "build: add reproducible test toolchain"
```

## Task 2: Add Story Graph Validation

**Files:**
- Create: `src/lib/game/validation/storyGraph.ts`
- Create: `src/lib/game/validation/storyGraph.test.ts`

- [ ] **Step 1: Write failing synthetic and real-content tests**

Create `src/lib/game/validation/storyGraph.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { PATHWAYS, PATHWAY_ORDER } from "../data";
import { ALL_NODES } from "../story";
import type { StoryNode } from "../types";
import { validateStoryGraph } from "./storyGraph";

describe("validateStoryGraph", () => {
  it("reports duplicate ids, missing targets, unreachable nodes and dead ends", () => {
    const nodes: StoryNode[] = [
      { id: "start", text: ["start"], choices: [{ text: "go", next: "missing" }] },
      { id: "start", text: ["duplicate"], choices: [] },
      { id: "orphan", text: ["orphan"], choices: [{ text: "loop", next: "orphan" }] },
    ];

    expect(validateStoryGraph(nodes, "start").map((issue) => issue.code)).toEqual(
      expect.arrayContaining([
        "duplicate-node",
        "missing-target",
        "unreachable-node",
        "dead-end",
      ]),
    );
  });

  it("accepts the imported prototype graph", () => {
    const implicitTargets = {
      c2_choose: PATHWAY_ORDER.map((key) => PATHWAYS[key].drinkNode),
    };

    expect(validateStoryGraph(ALL_NODES, "c1_wake", implicitTargets)).toEqual([]);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```powershell
npm.cmd run test:run -- src/lib/game/validation/storyGraph.test.ts
```

Expected: FAIL because `./storyGraph` does not exist.

- [ ] **Step 3: Implement the pure validator**

Create `src/lib/game/validation/storyGraph.ts`:

```ts
import type { Choice, StoryNode } from "../types";

export type StoryGraphIssueCode =
  | "duplicate-node"
  | "missing-start"
  | "missing-target"
  | "unreachable-node"
  | "dead-end";

export interface StoryGraphIssue {
  code: StoryGraphIssueCode;
  nodeId: string;
  targetId?: string;
}

function choiceTargets(choice: Choice): string[] {
  return [
    choice.next,
    choice.check?.pass,
    choice.check?.fail,
    choice.winNext,
    choice.loseNext,
  ].filter((value): value is string => Boolean(value));
}

export function validateStoryGraph(
  nodes: readonly StoryNode[],
  startId: string,
  implicitTargets: Readonly<Record<string, readonly string[]>> = {},
): StoryGraphIssue[] {
  const issues: StoryGraphIssue[] = [];
  const counts = new Map<string, number>();

  for (const node of nodes) {
    counts.set(node.id, (counts.get(node.id) ?? 0) + 1);
  }

  for (const [nodeId, count] of counts) {
    if (count > 1) issues.push({ code: "duplicate-node", nodeId });
  }

  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  const nodeTargets = (node: StoryNode) => [
    ...node.choices.flatMap(choiceTargets),
    ...(implicitTargets[node.id] ?? []),
  ];
  if (!nodeMap.has(startId)) {
    issues.push({ code: "missing-start", nodeId: startId });
    return issues;
  }

  for (const node of nodes) {
    const targets = nodeTargets(node);
    if (node.type !== "ending" && targets.length === 0) {
      issues.push({ code: "dead-end", nodeId: node.id });
    }
    for (const targetId of targets) {
      if (!nodeMap.has(targetId)) {
        issues.push({ code: "missing-target", nodeId: node.id, targetId });
      }
    }
  }

  const reachable = new Set<string>();
  const queue = [startId];
  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    if (reachable.has(nodeId)) continue;
    reachable.add(nodeId);
    const node = nodeMap.get(nodeId);
    if (!node) continue;
    for (const targetId of nodeTargets(node)) {
      if (nodeMap.has(targetId) && !reachable.has(targetId)) queue.push(targetId);
    }
  }

  for (const node of nodes) {
    if (!reachable.has(node.id)) {
      issues.push({ code: "unreachable-node", nodeId: node.id });
    }
  }

  return issues.sort((a, b) =>
    `${a.code}:${a.nodeId}:${a.targetId ?? ""}`.localeCompare(
      `${b.code}:${b.nodeId}:${b.targetId ?? ""}`,
    ),
  );
}
```

- [ ] **Step 4: Run the validator test**

Run:

```powershell
npm.cmd run test:run -- src/lib/game/validation/storyGraph.test.ts
```

Expected: two tests pass. If the real-content assertion reveals an actual orphan, fix its intended incoming transition in the relevant story module; do not suppress or allowlist the orphan.

- [ ] **Step 5: Commit graph validation**

```powershell
git add src/lib/game/validation/storyGraph.ts src/lib/game/validation/storyGraph.test.ts src/lib/game/story1.ts src/lib/game/story2.ts
git commit -m "test: validate story graph integrity"
```

## Task 3: Fix Critical Prototype Progression Regressions

**Files:**
- Create: `src/lib/game/progression.test.ts`
- Modify: `src/lib/game/story1.ts`
- Modify: `src/lib/game/story2.ts`
- Modify: `src/lib/game/engine.ts`

- [ ] **Step 1: Write failing progression tests**

Create `src/lib/game/progression.test.ts`:

```ts
import { afterEach, describe, expect, it, vi } from "vitest";
import { getNode } from "./story";
import {
  enterNode,
  makeInitialState,
  newCombat,
  playerAct,
} from "./engine";

afterEach(() => vi.restoreAllMocks());

describe("prototype progression regressions", () => {
  it("always grants the revolver when the player enters the gun scene", () => {
    const initial = makeInitialState("测试者", "run_test");
    const result = enterNode(initial, getNode("c1_gun"), () => 1);

    expect(result.state.inv.old_revolver).toBe(1);
  });

  it("completes sequence 9 digestion during the chapter-three time skip", () => {
    const initial = {
      ...makeInitialState("测试者", "run_test"),
      pathway: "seer",
      digestion: 62,
      chapter: 2,
    };
    const result = enterNode(initial, getNode("c3_start"), () => 3);

    expect(result.state.digestion).toBe(100);
    expect(result.state.flags.canAdvance).toBe(1);
  });

  it("logs the damage that is actually applied after vulnerability", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    const state = makeInitialState("测试者", "run_test");
    const combat = {
      ...newCombat("thug", state, "win", "lose"),
      vuln: 50,
      vulnTurns: 2,
    };
    const result = playerAct(state, combat, { kind: "attack" });
    const playerLog = result.cs.log.slice().reverse().find((entry) => entry.side === "player");

    expect(playerLog?.text).toContain("15 点伤害");
    expect(result.cs.ehp).toBe(5);
  });
});
```

- [ ] **Step 2: Run the tests to verify all three failures**

Run:

```powershell
npm.cmd run test:run -- src/lib/game/progression.test.ts
```

Expected: three failing assertions for missing revolver, digestion below 100 and a stale damage log.

- [ ] **Step 3: Move revolver acquisition to the gun node**

In the `c1_wake` choice that jumps directly to `c1_gun`, remove this effect:

```ts
effects: [{ t: "item", k: "old_revolver", v: 1 }],
```

Add this property to the `c1_gun` node:

```ts
onEnter: [{ t: "item", k: "old_revolver", v: 1 }],
```

This makes both routes receive exactly one revolver.

- [ ] **Step 4: Make the existing half-month time skip complete prototype digestion**

Add this property to the `c3_start` node:

```ts
onEnter: [{ t: "digestion", v: 100 }],
```

`applyEffects` clamps digestion to 100 and sets `canAdvance`; do not lower the advancement requirement.

- [ ] **Step 5: Apply vulnerability before composing damage log text**

In each player damage branch in `playerAct`, apply the existing modifier immediately after damage calculation:

```ts
if (dmg > 0 && c.vuln > 0 && c.vulnTurns > 0) {
  dmg = Math.round(dmg * (1 + c.vuln / 100));
}
```

Place it before the attack log, ability `parts.push(...)`, and combat-item log respectively. Remove the later shared block:

```ts
if (dmg > 0 && c.vuln > 0 && c.vulnTurns > 0) {
  dmg = Math.round(dmg * (1 + c.vuln / 100));
}
```

The remaining shared damage application stays unchanged:

```ts
if (dmg > 0) {
  c.ehp = Math.max(0, c.ehp - dmg);
  c.shake = 1;
}
```

- [ ] **Step 6: Run focused and full unit tests**

Run:

```powershell
npm.cmd run test:run -- src/lib/game/progression.test.ts
npm.cmd run test:run
```

Expected: all tests pass with no snapshots or expectations weakened.

- [ ] **Step 7: Commit the prototype correctness fixes**

```powershell
git add src/lib/game/progression.test.ts src/lib/game/story1.ts src/lib/game/story2.ts src/lib/game/engine.ts
git commit -m "fix: restore prototype progression guarantees"
```

## Task 4: Build the Versioned IndexedDB Save Store

**Files:**
- Create: `src/lib/game/persistence/saveSchema.ts`
- Create: `src/lib/game/persistence/localSaveStore.ts`
- Create: `src/lib/game/persistence/localSaveStore.test.ts`

- [ ] **Step 1: Write failing local save tests**

Create `src/lib/game/persistence/localSaveStore.test.ts`:

```ts
import { beforeEach, describe, expect, it } from "vitest";
import { makeInitialState } from "../engine";
import {
  deleteLocalSaveDatabase,
  getLocalSave,
  getQuarantinedSaves,
  putLocalSave,
  putRawSaveForTest,
} from "./localSaveStore";

beforeEach(async () => {
  await deleteLocalSaveDatabase();
});

describe("localSaveStore", () => {
  it("round-trips a versioned save and increments its revision", async () => {
    const state = makeInitialState("艾琳", "run_test");
    const first = await putLocalSave("autosave", state);
    const second = await putLocalSave("autosave", { ...state, pounds: 9 });

    expect(first.revision).toBe(1);
    expect(second.revision).toBe(2);
    await expect(getLocalSave("autosave")).resolves.toMatchObject({
      schemaVersion: 1,
      revision: 2,
      state: { name: "艾琳", pounds: 9 },
    });
  });

  it("quarantines an invalid record instead of deleting it silently", async () => {
    await putRawSaveForTest({ slotId: "autosave", broken: true });

    await expect(getLocalSave("autosave")).resolves.toBeNull();
    await expect(getQuarantinedSaves()).resolves.toHaveLength(1);
  });
});
```

- [ ] **Step 2: Run the tests to verify missing modules fail**

Run:

```powershell
npm.cmd run test:run -- src/lib/game/persistence/localSaveStore.test.ts
```

Expected: FAIL because `localSaveStore` does not exist.

- [ ] **Step 3: Define the runtime save schema**

Create `src/lib/game/persistence/saveSchema.ts`:

```ts
import { z } from "zod";

const attrsSchema = z.object({
  physique: z.number().int().min(1),
  inspiration: z.number().int().min(1),
  will: z.number().int().min(1),
});

export const gameStateSchema = z.object({
  playerId: z.string().min(1).max(128),
  name: z.string().min(1).max(24),
  pathway: z.string().nullable(),
  seq: z.number().int().min(0).max(9),
  hp: z.number().int().min(0),
  sp: z.number().int().min(0),
  sanity: z.number().int().min(0),
  maxHp: z.number().int().positive(),
  maxSp: z.number().int().positive(),
  maxSanity: z.number().int().positive(),
  digestion: z.number().int().min(0).max(100),
  pounds: z.number().int().min(0),
  luck: z.number().int(),
  attrs: attrsSchema,
  inv: z.record(z.string(), z.number().int().positive()),
  flags: z.record(z.string(), z.number().int()),
  nodeId: z.string().min(1),
  chapter: z.number().int().positive(),
  rounds: z.number().int().min(0),
});

export const saveEnvelopeSchema = z.object({
  schemaVersion: z.literal(1),
  slotId: z.string().regex(/^[a-z0-9_-]{1,32}$/),
  revision: z.number().int().positive(),
  savedAt: z.string().datetime(),
  state: gameStateSchema,
});

export type SaveEnvelope = z.infer<typeof saveEnvelopeSchema>;
```

- [ ] **Step 4: Implement IndexedDB CRUD and quarantine**

Create `src/lib/game/persistence/localSaveStore.ts`:

```ts
import { deleteDB, openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { GameState } from "../types";
import { saveEnvelopeSchema, type SaveEnvelope } from "./saveSchema";

const DATABASE_NAME = "lotm-game";
const DATABASE_VERSION = 1;

interface LotmDatabase extends DBSchema {
  saves: { key: string; value: unknown };
  quarantine: { key: number; value: { quarantinedAt: string; raw: unknown } };
}

let databasePromise: Promise<IDBPDatabase<LotmDatabase>> | null = null;

function getDatabase() {
  databasePromise ??= openDB<LotmDatabase>(DATABASE_NAME, DATABASE_VERSION, {
    upgrade(database) {
      database.createObjectStore("saves");
      database.createObjectStore("quarantine", { autoIncrement: true });
    },
  });
  return databasePromise;
}

export async function putLocalSave(slotId: string, state: GameState) {
  const current = await getLocalSave(slotId);
  const envelope: SaveEnvelope = {
    schemaVersion: 1,
    slotId,
    revision: (current?.revision ?? 0) + 1,
    savedAt: new Date().toISOString(),
    state,
  };
  saveEnvelopeSchema.parse(envelope);
  await (await getDatabase()).put("saves", structuredClone(envelope), slotId);
  return envelope;
}

export async function getLocalSave(slotId: string): Promise<SaveEnvelope | null> {
  const database = await getDatabase();
  const raw = await database.get("saves", slotId);
  if (raw === undefined) return null;
  const parsed = saveEnvelopeSchema.safeParse(raw);
  if (parsed.success) return parsed.data;

  const transaction = database.transaction(["saves", "quarantine"], "readwrite");
  await transaction.objectStore("quarantine").add({
    quarantinedAt: new Date().toISOString(),
    raw: structuredClone(raw),
  });
  await transaction.objectStore("saves").delete(slotId);
  await transaction.done;
  return null;
}

export async function hasLocalSave(slotId: string) {
  return (await getLocalSave(slotId)) !== null;
}

export async function getQuarantinedSaves() {
  return (await getDatabase()).getAll("quarantine");
}

export async function putRawSaveForTest(raw: Record<string, unknown>) {
  const slotId = String(raw.slotId ?? "autosave");
  await (await getDatabase()).put("saves", raw, slotId);
}

export async function deleteLocalSaveDatabase() {
  const database = databasePromise ? await databasePromise : null;
  database?.close();
  databasePromise = null;
  await deleteDB(DATABASE_NAME);
}
```

- [ ] **Step 5: Run persistence tests and typecheck**

Run:

```powershell
npm.cmd run test:run -- src/lib/game/persistence/localSaveStore.test.ts
npm.cmd run typecheck
```

Expected: two persistence tests pass; TypeScript exits `0`.

- [ ] **Step 6: Commit the local save store**

```powershell
git add src/lib/game/persistence/saveSchema.ts src/lib/game/persistence/localSaveStore.ts src/lib/game/persistence/localSaveStore.test.ts
git commit -m "feat: add versioned local save store"
```

## Task 5: Integrate Truthful Prototype Autosave

**Files:**
- Create: `src/lib/game/persistence/usePrototypeAutosave.ts`
- Modify: `src/app/game/page.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Write the autosave status hook**

Create `src/lib/game/persistence/usePrototypeAutosave.ts`:

```ts
"use client";

import { useEffect, useRef, useState } from "react";
import type { GameState } from "../types";
import { putLocalSave } from "./localSaveStore";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export function usePrototypeAutosave(
  state: GameState | null,
  enabled: boolean,
): SaveStatus {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const generation = useRef(0);
  const writeQueue = useRef<Promise<unknown>>(Promise.resolve());

  useEffect(() => {
    if (!enabled || !state) return;
    const currentGeneration = ++generation.current;
    setStatus("saving");
    const timer = window.setTimeout(() => {
      writeQueue.current = writeQueue.current
        .catch(() => undefined)
        .then(() => putLocalSave("autosave", state))
        .then(() => {
          if (generation.current === currentGeneration) setStatus("saved");
        })
        .catch(() => {
          if (generation.current === currentGeneration) setStatus("error");
        });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [enabled, state]);

  return status;
}
```

- [ ] **Step 2: Replace cloud boot loading with local loading**

In `src/app/game/page.tsx`, import:

```ts
import { getLocalSave } from "@/lib/game/persistence/localSaveStore";
import { usePrototypeAutosave } from "@/lib/game/persistence/usePrototypeAutosave";
```

Replace the boot effect with:

```ts
useEffect(() => {
  let cancelled = false;
  void getLocalSave("autosave")
    .then((save) => {
      if (cancelled) return;
      if (save?.state.nodeId) {
        setGsState(save.state);
        setPhase("play");
      } else {
        setPhase("name");
      }
    })
    .catch(() => {
      if (!cancelled) setPhase("name");
    });
  return () => {
    cancelled = true;
  };
}, []);
```

Remove the existing debounced `/api/game` autosave effect and its `saveTimer` ref.

- [ ] **Step 3: Connect the truthful save status**

After state declarations, add:

```ts
const saveStatus = usePrototypeAutosave(gs, phase === "play");
```

Add this label map outside the component:

```ts
const SAVE_STATUS_LABEL = {
  idle: "本地存档待命",
  saving: "正在保存到本机…",
  saved: "已保存到本机",
  error: "本地保存失败，请导出进度后检查浏览器存储权限",
} as const;
```

Replace the unconditional cloud-sync sentence with:

```tsx
<p
  aria-live="polite"
  className={`mt-16 text-center text-[10px] tracking-[0.2em] ${
    saveStatus === "error" ? "text-red-300" : "text-white/30"
  }`}
>
  {SAVE_STATUS_LABEL[saveStatus]}
</p>
```

Remove writes to `localStorage.lotm_player_id` from `startGame` and `rebirth`. Keep `uid()` as the imported prototype run identifier until M1 replaces identity semantics.

- [ ] **Step 4: Make the landing page detect IndexedDB autosave**

In `src/app/page.tsx`, import `hasLocalSave` and replace the localStorage check inside the mount effect:

```ts
void hasLocalSave("autosave")
  .then(setCanContinue)
  .catch(() => setCanContinue(false));
```

Remove the `/api/game/recent` fetch from this effect. Set `echoes` to an empty array until the opt-in public echo design is implemented; do not display a fake network success state.

Replace the existing echoes state declaration with:

```ts
const echoes: EchoRow[] = [];
```

- [ ] **Step 5: Add component-level persistence coverage**

Extend `src/lib/game/persistence/localSaveStore.test.ts` with:

```ts
it("reports no autosave when the store is empty", async () => {
  await expect(hasLocalSave("autosave")).resolves.toBe(false);
});
```

Add `hasLocalSave` to that test file's imports.

- [ ] **Step 6: Run tests, lint and typecheck**

Run:

```powershell
npm.cmd run test:run
npm.cmd run lint
npm.cmd run typecheck
```

Expected: all commands exit `0`; no lint suppression is added for the new effects.

- [ ] **Step 7: Commit local-first integration**

```powershell
git add src/lib/game/persistence/usePrototypeAutosave.ts src/lib/game/persistence/localSaveStore.test.ts src/app/game/page.tsx src/app/page.tsx
git commit -m "feat: make prototype saves local first"
```

## Task 6: Deliver Explicit Offline APIs and Database Setup

**Files:**
- Create: `.env.example`
- Create: `drizzle.config.ts`
- Delete: `drizzle.config.json`
- Create: `drizzle/0000_initial_lotm_saves.sql`
- Modify: `src/db/index.ts`
- Modify: `src/app/api/game/route.ts`
- Modify: `src/app/api/game/recent/route.ts`
- Modify: `src/app/api/health/route.ts`
- Create: `src/app/api/api-contract.test.ts`
- Create: `README.md`

- [ ] **Step 1: Write failing API contract tests**

Create `src/app/api/api-contract.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { GET as getLegacySave, POST as postLegacySave } from "./game/route";
import { GET as getRecent } from "./game/recent/route";
import { GET as getHealth } from "./health/route";

describe("M0 API contract", () => {
  it("disables insecure legacy cloud saves explicitly", async () => {
    const getResponse = await getLegacySave();
    const postResponse = await postLegacySave();

    expect(getResponse.status).toBe(410);
    expect(postResponse.status).toBe(410);
    await expect(getResponse.json()).resolves.toMatchObject({
      error: { code: "legacy_cloud_disabled" },
    });
  });

  it("marks public echoes unavailable instead of fabricating data", async () => {
    const response = await getRecent();
    await expect(response.json()).resolves.toEqual({
      available: false,
      recent: [],
    });
  });

  it("keeps application health independent from optional cloud storage", async () => {
    const response = await getHealth();
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      persistence: { local: true },
    });
  });
});
```

- [ ] **Step 2: Run the contract tests to verify failure**

Run:

```powershell
npm.cmd run test:run -- src/app/api/api-contract.test.ts
```

Expected: FAIL because the current handlers require request arguments, import a mandatory database and return different statuses.

- [ ] **Step 3: Disable insecure legacy cloud routes explicitly**

Replace `src/app/api/game/route.ts` with:

```ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function legacyCloudDisabled() {
  return NextResponse.json(
    {
      ok: false,
      error: {
        code: "legacy_cloud_disabled",
        message: "Cloud saves are disabled until signed save ownership is available.",
      },
    },
    { status: 410 },
  );
}

export async function GET() {
  return legacyCloudDisabled();
}

export async function POST() {
  return legacyCloudDisabled();
}
```

Replace `src/app/api/game/recent/route.ts` with:

```ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ available: false, recent: [] });
}
```

Replace `src/app/api/health/route.ts` with:

```ts
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    ok: true,
    persistence: {
      local: true,
      cloudConfigured: Boolean(process.env.DATABASE_URL),
      cloudEnabled: false,
    },
  });
}
```

- [ ] **Step 4: Make database construction optional and lazy**

Replace `src/db/index.ts` with:

```ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

function createDatabase(pool: Pool) {
  return drizzle(pool);
}

type Database = ReturnType<typeof createDatabase>;

const globalForDb = globalThis as typeof globalThis & {
  __lotmPool?: Pool;
  __lotmDb?: Database;
};

export function getDb(): Database | null {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return null;
  if (globalForDb.__lotmDb) return globalForDb.__lotmDb;

  const pool = globalForDb.__lotmPool ?? new Pool({ connectionString: databaseUrl });
  const database = createDatabase(pool);
  globalForDb.__lotmPool = pool;
  globalForDb.__lotmDb = database;

  return database;
}
```

- [ ] **Step 5: Replace the hardcoded Drizzle configuration**

Delete `drizzle.config.json`.

Create `.env.example`:

```dotenv
# Optional in M0. The game remains playable with IndexedDB when omitted.
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/lotm_game
```

Create `drizzle.config.ts`:

```ts
import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });
config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required for database migration commands");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: { url: process.env.DATABASE_URL },
});
```

Generate the SQL, journal and schema snapshot from `src/db/schema.ts`:

```powershell
$env:DATABASE_URL='postgresql://postgres:postgres@127.0.0.1:5432/lotm_game'
npm.cmd run db:generate -- --name initial_lotm_saves
Remove-Item Env:DATABASE_URL
```

Expected: Drizzle creates `drizzle/0000_initial_lotm_saves.sql`, `drizzle/meta/_journal.json` and `drizzle/meta/0000_snapshot.json`. Inspect the SQL and confirm it creates all columns from `src/db/schema.ts`. This migration preserves the imported table for later controlled migration; it does not re-enable insecure endpoints.

- [ ] **Step 6: Write the delivery README**

Create `README.md` with these exact sections and commands:

````markdown
# 雾中余烬

非官方、非商业的《诡秘之主》同人互动冒险。当前 `main` 保存导入原型与分阶段重建基线。

## Requirements

- Node.js 22 or newer
- npm 10 or newer
- PostgreSQL 16 or newer only when running database migrations

## Local Development

```powershell
npm.cmd ci
npm.cmd run dev
```

Open `http://127.0.0.1:3000`. M0 stores progress in browser IndexedDB and does not require PostgreSQL.

## Verification

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run test:run
npm.cmd run build
npm.cmd run test:e2e
```

## Optional Database Setup

Copy `.env.example` to `.env.local`, change the local credentials, then run:

```powershell
npm.cmd run db:migrate
```

Cloud synchronization remains disabled until signed session ownership is implemented.

## Reference Material

`docs/诡秘之主.txt` is local research material and is intentionally ignored by Git. Do not add novel text, official artwork, animation captures or unlicensed music to commits or releases.
````

- [ ] **Step 7: Run API, unit and build verification without `DATABASE_URL`**

Run in a shell where `DATABASE_URL` is unset:

```powershell
npm.cmd run test:run -- src/app/api/api-contract.test.ts
npm.cmd run typecheck
npm.cmd run build
```

Expected: API tests pass; typecheck passes; Next build exits `0` without a database URL.

- [ ] **Step 8: Commit delivery and offline behavior**

```powershell
git add .env.example drizzle.config.ts drizzle README.md src/db/index.ts src/app/api/game/route.ts src/app/api/game/recent/route.ts src/app/api/health/route.ts src/app/api/api-contract.test.ts
git rm drizzle.config.json
git commit -m "feat: make offline mode explicit and reproducible"
```

## Task 7: Add Original Visual Assets and a Manifest

**Files:**
- Create: `public/images/bg-city.png`
- Create: `public/images/bg-fog-palace.png`
- Create: `public/images/bg-ritual.png`
- Create: `public/images/tarot.png`
- Create: `src/lib/game/assets.ts`
- Create: `src/lib/game/assets.test.ts`
- Modify: `src/app/page.tsx`
- Modify: `src/app/game/page.tsx`
- Modify: `src/components/game/EndingScreen.tsx`
- Modify: `src/components/game/PathwaySelect.tsx`

- [ ] **Step 1: Write the failing asset manifest test**

Create `src/lib/game/assets.test.ts`:

```ts
import { stat } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ART_ASSETS } from "./assets";

describe("ART_ASSETS", () => {
  it.each(Object.values(ART_ASSETS))("ships a nontrivial bitmap at %s", async (asset) => {
    const file = join(process.cwd(), "public", asset.replace(/^\//, ""));
    const metadata = await stat(file);
    expect(metadata.size).toBeGreaterThan(50_000);
  });
});
```

- [ ] **Step 2: Create the manifest and verify the test fails on missing files**

Create `src/lib/game/assets.ts`:

```ts
export const ART_ASSETS = {
  city: "/images/bg-city.png",
  fog: "/images/bg-fog-palace.png",
  ritual: "/images/bg-ritual.png",
  tarot: "/images/tarot.png",
} as const;
```

Run:

```powershell
npm.cmd run test:run -- src/lib/game/assets.test.ts
```

Expected: four failures with `ENOENT`.

- [ ] **Step 3: Generate four original bitmap assets with the image generation skill**

Use these prompts and save the resulting bitmaps at the exact paths above:

1. `bg-city.png`, landscape 16:9, at least 1536px wide:

   > A readable wide establishing shot of a fictional 1890s industrial city street at blue hour, wet cobblestones, coal smoke, gas lamps, brick row houses, distant clock tower, a few small period pedestrians, restrained supernatural unease, cinematic painterly realism, no text, no logos, no recognizable copyrighted characters, clear midground details, usable as a full-screen game background.

2. `bg-fog-palace.png`, landscape 16:9, at least 1536px wide:

   > An original dreamlike occult archive chamber suspended in pale fog, weathered stone table, empty high-backed chairs kept mostly in silhouette, tarnished brass instruments, moonlit dust, mysterious but not depicting any specific existing franchise scene, cinematic painterly realism, no text, no symbols copied from existing works, clear focal depth, usable as a full-screen game background.

3. `bg-ritual.png`, landscape 16:9, at least 1536px wide:

   > A Victorian-era underground ritual cellar with brick arches, chalk geometry, candles, iron storage cabinets and a sealed wooden case, ominous crimson light balanced by cold moonlight, cinematic painterly realism, no people, no text, no logos, clear environmental storytelling, usable as a full-screen game background.

4. `tarot.png`, portrait 2:3, at least 1024px wide:

   > Original aged occult card-table texture, charcoal paper, faded botanical etching, brass compass marks and subtle ink constellations, no readable text, no copied tarot card, no logo, even edge detail suitable behind UI cards, painterly printmaking texture.

- [ ] **Step 4: Inspect every image before wiring it into the app**

Use `view_image` for all four files. Reject and regenerate any image that is blank, illegible, contains text artifacts, copied branding, dominant purple haze, or a focal subject that will be hidden by the main text column.

- [ ] **Step 5: Replace scattered paths with the manifest**

In the three components that define an `ART` object, import `ART_ASSETS` and use:

```ts
const ART: Record<string, string> = {
  city: ART_ASSETS.city,
  fog: ART_ASSETS.fog,
  ritual: ART_ASSETS.ritual,
};
```

In landing and pathway texture usages, replace `/images/tarot.jpg` with `ART_ASSETS.tarot`. Import the manifest from `@/lib/game/assets`.

- [ ] **Step 6: Run asset, type and build tests**

Run:

```powershell
npm.cmd run test:run -- src/lib/game/assets.test.ts
npm.cmd run typecheck
npm.cmd run build
```

Expected: four asset cases pass; TypeScript and build exit `0`; build output contains no missing local asset warning.

- [ ] **Step 7: Commit original visual assets**

```powershell
git add public/images src/lib/game/assets.ts src/lib/game/assets.test.ts src/app/page.tsx src/app/game/page.tsx src/components/game/EndingScreen.tsx src/components/game/PathwaySelect.tsx
git commit -m "feat: add original prototype visual assets"
```

## Task 8: Add Browser Smoke Tests and CI

**Files:**
- Create: `tests/e2e/smoke.spec.ts`
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Write the browser smoke test**

Create `tests/e2e/smoke.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(async () => {
    localStorage.clear();
    await new Promise<void>((resolve) => {
      const request = indexedDB.deleteDatabase("lotm-game");
      request.onsuccess = () => resolve();
      request.onerror = () => resolve();
      request.onblocked = () => resolve();
    });
  });
  await page.reload();
});

test("starts a new local game with rendered artwork", async ({ page }) => {
  await page.goto("/game");
  await expect(page.getByRole("heading", { name: "报上你的名字" })).toBeVisible();
  await page.getByPlaceholder("周明瑞").fill("艾琳");
  await page.getByRole("button", { name: /睁\s*开\s*眼\s*睛/ }).click();

  await expect(page.getByRole("heading", { name: "水仙花街，清晨" })).toBeVisible();
  await expect(page.getByText(/保存到本机/)).toBeVisible();

  const cityResponse = await page.request.get("/images/bg-city.png");
  expect(cityResponse.ok()).toBe(true);
  expect((await cityResponse.body()).byteLength).toBeGreaterThan(50_000);
});

test("uses the mobile viewport without horizontal overflow", async ({ page }) => {
  await page.goto("/game");
  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(hasOverflow).toBe(false);
});

test("health remains green without cloud configuration", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.status()).toBe(200);
  expect(await response.json()).toMatchObject({
    ok: true,
    persistence: { local: true, cloudEnabled: false },
  });
});
```

- [ ] **Step 2: Install the Playwright Chromium runtime**

Run:

```powershell
npx.cmd playwright install chromium
```

Expected: Chromium installs successfully; no system-wide browser setting is changed.

- [ ] **Step 3: Run browser smoke tests on desktop and mobile projects**

Run:

```powershell
npm.cmd run test:e2e
```

Expected: six cases pass: three tests in each configured Chromium project.

- [ ] **Step 4: Create GitHub Actions CI**

Create `.github/workflows/ci.yml`:

```yaml
name: ci

on:
  push:
    branches: [main]
  pull_request:

permissions:
  contents: read

jobs:
  verify:
    runs-on: ubuntu-latest
    timeout-minutes: 20
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test:run
      - run: npm run build

  browser-smoke:
    runs-on: ubuntu-latest
    timeout-minutes: 20
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e
```

- [ ] **Step 5: Run the complete fresh verification gate**

Run:

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run test:run
npm.cmd run build
npm.cmd run test:e2e
git diff --check
git status --short
```

Expected:

- lint exits `0` with no errors;
- typecheck exits `0`;
- every unit/content/API test passes;
- production build exits `0` with no `DATABASE_URL`;
- six Playwright smoke cases pass;
- `git diff --check` prints nothing;
- `git status --short` lists only the two intended CI/e2e files before commit.

- [ ] **Step 6: Commit CI and browser smoke coverage**

```powershell
git add .github/workflows/ci.yml tests/e2e/smoke.spec.ts
git commit -m "ci: verify baseline gameplay and build"
```

- [ ] **Step 7: Push the completed M0 checkpoint**

Run:

```powershell
git push origin main
```

Expected: remote `main` advances to the final M0 commit. Confirm with:

```powershell
git ls-remote origin refs/heads/main
git rev-parse HEAD
```

The two hashes must be identical.

## M0 Exit Evidence

M0 is complete only when the final execution report includes fresh evidence for all items below:

- `npm ci` can reconstruct dependencies from `package-lock.json`.
- `npm run lint`, `npm run typecheck`, `npm run test:run` and `npm run build` all exit `0` without `DATABASE_URL`.
- `npm run test:e2e` passes in desktop and mobile Chromium projects.
- All four bitmap files exist, exceed 50 KB, render nonblank and were visually inspected.
- The imported prototype grants the revolver on both entry paths and reaches sequence 8 after its documented time skip.
- Applied vulnerability damage equals combat log damage.
- IndexedDB round-trips a valid save and quarantines an invalid save.
- UI reports local save success or failure truthfully and makes no cloud-sync claim.
- Legacy unauthenticated cloud save routes return `410` and cannot read or overwrite data.
- Production build does not instantiate PostgreSQL at module import time.
- Git continues to ignore `docs/诡秘之主.txt`.
- Local `HEAD` and remote `main` match after the checkpoint push.

## Plan Self-Review

### Spec coverage

This plan covers every M0 requirement in the approved design: reproducible dependencies, repository delivery files, content validation, regression tests for imported P0/P1 defects, local-first save skeleton, honest error state, optional database construction, original visual assets, CI and browser smoke QA.

The six-chapter rewrite, pure domain reducer, signed cloud ownership, evidence board, five complete pathway arcs, sequence 8 material economy, ending gallery and release hardening are intentionally assigned to M1 through M5. Implementing them inside M0 would prevent this milestone from remaining independently reviewable and testable.

### Type consistency

- The save schema uses the existing `GameState` field names and a single `schemaVersion: 1` envelope.
- Every persistence caller uses slot id `autosave`.
- The manifest keys match the current `StoryNode.art` values: `city`, `fog` and `ritual`.
- API tests and implementations share `legacy_cloud_disabled`, `available` and `persistence` field names.
- Playwright uses the same IndexedDB database name, asset path and health payload defined earlier.

### Placeholder scan

The plan contains no unresolved implementation placeholder. Every future milestone reference is a declared scope boundary, not deferred work within M0.
