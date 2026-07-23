import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { lotmSaves } from "@/db/schema";

export const dynamic = "force-dynamic";

// GET /api/game?playerId=xxx —— 读取云端存档（可选；本地存档为权威来源）
export async function GET(req: NextRequest) {
  try {
    const playerId = req.nextUrl.searchParams.get("playerId");
    if (!playerId) return NextResponse.json({ save: null });
    const database = getDb();
    if (!database) return NextResponse.json({ save: null, offline: true });
    const rows = await database
      .select()
      .from(lotmSaves)
      .where(eq(lotmSaves.playerId, playerId))
      .limit(1);
    return NextResponse.json({ save: rows[0] ?? null });
  } catch (e) {
    console.error("load save failed", e);
    return NextResponse.json({ save: null, offline: true });
  }
}

// POST /api/game —— 保存/更新云端存档（可选备份）
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { playerId, name, pathway, seq, chapter, nodeId, ending, digestion, rounds, state } = body ?? {};
    if (!playerId || !name || !state) {
      return NextResponse.json({ ok: false, error: "invalid payload" }, { status: 400 });
    }
    const database = getDb();
    if (!database) return NextResponse.json({ ok: false, offline: true });
    await database
      .insert(lotmSaves)
      .values({ playerId, name, pathway, seq, chapter, nodeId, ending, digestion, rounds, state, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: lotmSaves.playerId,
        set: { name, pathway, seq, chapter, nodeId, ending, digestion, rounds, state, updatedAt: new Date() },
      });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("save failed", e);
    return NextResponse.json({ ok: false, offline: true }, { status: 200 });
  }
}
