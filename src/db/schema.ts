import { pgTable, text, integer, jsonb, timestamp } from "drizzle-orm/pg-core";

// 《诡秘之主》游戏存档表
export const lotmSaves = pgTable("lotm_saves", {
  playerId: text("player_id").primaryKey(),
  name: text("name").notNull(),
  pathway: text("pathway"),
  seq: integer("seq").default(9),
  chapter: integer("chapter").default(1),
  nodeId: text("node_id").default("c1_wake"),
  ending: text("ending"),
  digestion: integer("digestion").default(0),
  state: jsonb("state").notNull(),
  rounds: integer("rounds").default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
