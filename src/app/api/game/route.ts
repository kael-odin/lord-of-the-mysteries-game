import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { lotmSaves } from "@/db/schema";

export const dynamic = "force-dynamic";

// GET /api/game?playerId=xxx —— 读取存档
export async function GET(req: NextRequest) {
  try {
    const playerId = req.nextUrl.searchParams.get("playerId");
    if (!playerId) return NextResponse.json({ save: null });
    const rows = await db.select().from(lotmSaves).where(eq(lotmSaves.playerId, playerId)).limit(1);
    return NextResponse.json({ save: rows[0] ?? null });
  } catch (e) {
    console.error("load save failed", e);
    return NextResponse.json({ save: null });
  }
}

// POST /api/game —— 保存/更新存档
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { playerId, name, pathway, seq, chapter, nodeId, ending, digestion, rounds, state } = body ?? {};
    if (!playerId || !name || !state) {
      return NextResponse.json({ ok: false, error: "invalid payload" }, { status: 400 });
    }
    await db
      .insert(lotmSaves)
      .values({ playerId, name, pathway, seq, chapter, nodeId, ending, digestion, rounds, state, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: lotmSaves.playerId,
        set: { name, pathway, seq, chapter, nodeId, ending, digestion, rounds, state, updatedAt: new Date() },
      });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("save failed", e);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
