import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { lotmSaves } from "@/db/schema";

export const dynamic = "force-dynamic";

// GET /api/game/recent —— 灰雾回响：最近苏醒的旅人们（可选；DB 不可用时返回空）
export async function GET() {
  try {
    const database = getDb();
    if (!database) return NextResponse.json({ recent: [], offline: true });
    const rows = await database
      .select({
        name: lotmSaves.name,
        pathway: lotmSaves.pathway,
        seq: lotmSaves.seq,
        ending: lotmSaves.ending,
        chapter: lotmSaves.chapter,
        updatedAt: lotmSaves.updatedAt,
      })
      .from(lotmSaves)
      .orderBy(desc(lotmSaves.updatedAt))
      .limit(10);
    return NextResponse.json({ recent: rows });
  } catch (e) {
    console.error("recent failed", e);
    return NextResponse.json({ recent: [], offline: true });
  }
}
