"use client";

import { RotateCcw, Home, Award, Route, FlaskConical, Coins, Footprints } from "lucide-react";
import type { GameState, StoryNode } from "@/lib/game/types";
import { ENDINGS } from "@/lib/game/story";
import { PATHWAYS } from "@/lib/game/data";
import { sceneArt } from "@/lib/game/art";

const TONE: Record<string, string> = {
  gold: "text-[#c9a86a]",
  red: "text-red-400",
  gray: "text-white/70",
  green: "text-emerald-400",
  purple: "text-purple-300",
};

export default function EndingScreen({
  node,
  gs,
  onRebirth,
}: {
  node: StoryNode;
  gs: GameState;
  onRebirth: () => void;
}) {
  const meta = ENDINGS[node.endingId || ""] || { title: node.endingTitle || "终局", tone: "gray" };
  const pw = gs.pathway ? PATHWAYS[gs.pathway] : null;

  return (
    <div className="relative min-h-screen">
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: sceneArt(node.art) }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-black/70 via-[#06070b]/85 to-[#06070b]" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-20 text-center">
        <p className="mb-3 text-[11px] tracking-[0.6em] text-white/40">终 局 · THE ENDING</p>
        <h1 className={`font-display mb-2 text-6xl tracking-[0.3em] md:text-7xl ${TONE[meta.tone]}`}>
          {node.endingTitle || meta.title}
        </h1>
        <p className="mb-10 text-sm text-white/50">{node.endingDesc || meta.title}</p>

        <div className="mb-10 w-full max-w-xl space-y-4 text-left">
          {node.text.map((t, i) => (
            <p
              key={i}
              className="text-[15px] leading-loose text-[#cec8ba]"
              style={{ animation: "fadeUp 0.9s ease both", animationDelay: `${0.2 + i * 0.15}s` }}
            >
              {t.replaceAll("{name}", gs.name || "无名者")}
            </p>
          ))}
        </div>

        <div className="mb-10 grid w-full max-w-xl grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { icon: Route, label: "途径", value: pw ? `${pw.road.replace("途径", "")} · 序列${gs.seq}` : "未入非凡" },
            { icon: FlaskConical, label: "最终消化度", value: `${gs.digestion}%` },
            { icon: Coins, label: "遗产", value: `${gs.pounds} 金镑` },
            { icon: Footprints, label: "旅程", value: `${gs.rounds} 次抉择` },
          ].map((s, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <s.icon className="mx-auto mb-2 h-4 w-4 text-[#c9a86a]" />
              <p className="text-[10px] text-white/40">{s.label}</p>
              <p className="mt-0.5 text-sm text-[#e7d9b8]">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onRebirth}
            className="group flex items-center gap-2 rounded-full border border-[#c9a86a]/60 bg-[#c9a86a]/10 px-8 py-3 text-sm tracking-[0.3em] text-[#e7d9b8] transition hover:bg-[#c9a86a]/25"
          >
            <RotateCcw className="h-4 w-4 transition-transform duration-500 group-hover:-rotate-180" />
            再入轮回
          </button>
          <a
            href="/"
            className="flex items-center gap-2 rounded-full border border-white/20 px-8 py-3 text-sm tracking-[0.3em] text-white/70 transition hover:border-white/50 hover:text-white"
          >
            <Home className="h-4 w-4" />
            回到灰雾
          </a>
        </div>

        <p className="mt-12 flex items-center gap-2 text-[10px] tracking-[0.2em] text-white/25">
          <Award className="h-3 w-3" />
          本次轮回已铭刻于灰雾回响之中
        </p>
      </div>
    </div>
  );
}
