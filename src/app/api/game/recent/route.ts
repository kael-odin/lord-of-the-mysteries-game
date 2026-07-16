import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { lotmSaves } from "@/db/schema";

export const dynamic = "force-dynamic";

// GET /api/game/recent —— 灰雾回响：最近苏醒的旅人们
export async function GET() {
  try {
    const rows = await db
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
    return NextResponse.json({ recent: [] });
  }
}
