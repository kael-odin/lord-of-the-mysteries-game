"use client";

import { useState } from "react";
import { PATHWAYS, PATHWAY_ORDER } from "@/lib/game/data";
import { sceneArt } from "@/lib/game/art";
import { Emblem } from "@/components/game/Emblem";
import type { PathwayKey } from "@/lib/game/emblems";

export default function PathwaySelect({ onPick }: { onPick: (nodeId: string) => void }) {
  // Two-step confirm: first click selects a pathway and reveals a confirm
  // button; the second click (on confirm) actually commits. Prevents a
  // misclick from locking the pathway for the entire run.
  const [focus, setFocus] = useState<string | null>(null);
  const [picked, setPicked] = useState<string | null>(null);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {PATHWAY_ORDER.map((key, i) => {
        const p = PATHWAYS[key];
        const active = focus === key;
        const chosen = picked === key;
        const anotherChosen = picked && picked !== key;
        return (
          <div
            key={key}
            onMouseEnter={() => setFocus(key)}
            onMouseLeave={() => setFocus(null)}
            className={`group relative flex flex-col overflow-hidden rounded-xl border text-left transition-all duration-500 ${
              chosen ? "-translate-y-2" : anotherChosen ? "opacity-40" : "hover:-translate-y-2"
            }`}
            style={{
              animation: `fadeUp 0.8s ease both`,
              animationDelay: `${i * 0.08}s`,
              borderColor: chosen
                ? "rgba(201,168,106,0.9)"
                : active
                  ? "rgba(201,168,106,0.7)"
                  : "rgba(255,255,255,0.12)",
              boxShadow: chosen
                ? "0 24px 70px -15px rgba(201,168,106,0.45)"
                : active
                  ? "0 20px 60px -15px rgba(201,168,106,0.35)"
                  : "none",
            }}
          >
            {/* 卡面纹理 */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-25 transition-opacity duration-500 group-hover:opacity-45"
              style={{ backgroundImage: sceneArt("ritual") }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0b0c14]/60 via-[#0b0c14]/82 to-[#0b0c14]" />

            <div className="relative flex flex-1 flex-col p-5">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[10px] tracking-[0.3em] text-white/40">序列9</span>
                <span className="text-[10px] tracking-[0.2em] text-[#c9a86a]/70">{p.road}</span>
              </div>

              <div className="my-4 flex justify-center">
                <div
                  className={`flex h-20 w-20 items-center justify-center rounded-full border transition-all duration-500 ${
                    chosen
                      ? "border-[#c9a86a] bg-[#c9a86a]/15 shadow-[0_0_40px_rgba(201,168,106,0.5)]"
                      : active
                        ? "border-[#c9a86a] bg-[#c9a86a]/12 shadow-[0_0_34px_rgba(201,168,106,0.4)]"
                        : "border-white/15 bg-black/30"
                  }`}
                  style={
                    active || chosen
                      ? ({ ["--ember-color" as string]: "#e7d9b8" } as React.CSSProperties)
                      : ({ ["--ember-color" as string]: "#9aa0b0" } as React.CSSProperties)
                  }
                >
                  <Emblem k={key as PathwayKey} size={62} />
                </div>
              </div>

              <h3 className="font-display mb-1 text-center text-2xl tracking-[0.3em] text-[#e7d9b8]">{p.name}</h3>
              <p className="mb-3 text-center text-[10px] text-white/40">晋升序列8 · {p.seq8}</p>

              <p className="mb-3 flex-1 text-[11px] leading-relaxed text-white/60">{p.desc}</p>

              <div className="mb-3 rounded-lg border border-white/10 bg-black/40 p-2.5">
                <p className="text-[10px] italic leading-relaxed text-[#c9a86a]/90">{p.motto}</p>
                <p className="mt-1 text-right text-[9px] text-white/30">—— 扮演法则</p>
              </div>

              <div className="text-[10px] leading-relaxed text-white/45">
                <p>
                  <span className="text-emerald-300/80">{p.passive.name}</span>：{p.passive.desc}
                </p>
              </div>

              {chosen ? (
                <button
                  onClick={() => onPick(p.drinkNode)}
                  className="mt-4 rounded-lg border border-[#c9a86a] bg-[#c9a86a] py-2 text-center text-xs tracking-[0.4em] text-black transition-all duration-300 hover:bg-[#e7d9b8]"
                  aria-label={`确认饮下 ${p.name} 的魔药`}
                >
                  确认饮下
                </button>
              ) : (
                <button
                  onClick={() => setPicked(key)}
                  onFocus={() => setFocus(key)}
                  className={`mt-4 rounded-lg border py-2 text-center text-xs tracking-[0.4em] transition-all duration-300 ${
                    active ? "border-[#c9a86a] bg-[#c9a86a] text-black" : "border-white/20 text-white/60"
                  }`}
                  aria-label={`选择 ${p.name}（需再次确认）`}
                >
                  {picked ? "改选此项" : "饮下魔药"}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
