"use client";

import { useEffect, useState } from "react";
import { X, BookOpen, Scroll, Lock } from "lucide-react";
import { PATHWAYS, PATHWAY_ORDER } from "@/lib/game/data";
import { ENDINGS, ALL_ENDING_IDS, CHAPTER_TITLES } from "@/lib/game/story";
import { getUnlockedEndings, getSeenPathways } from "@/lib/game/persistence/localSaveStore";
import { Emblem } from "@/components/game/Emblem";
import type { PathwayKey } from "@/lib/game/emblems";

const TONE_COLOR: Record<string, string> = {
  gold: "text-[#c9a86a] border-[#c9a86a]/40",
  red: "text-red-300 border-red-400/40",
  gray: "text-white/50 border-white/20",
  green: "text-emerald-300 border-emerald-400/40",
  purple: "text-purple-300 border-purple-400/40",
};

type Tab = "endings" | "pathways" | "guide";

export default function CodexModal({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<Tab>("endings");
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [seen, setSeen] = useState<string[]>([]);

  useEffect(() => {
    setUnlocked(getUnlockedEndings());
    setSeen(getSeenPathways());
  }, []);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#c9a86a]/30 bg-[#0a0b12]/95">
        {/* header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-[#c9a86a]" />
            <h2 className="font-display text-xl tracking-[0.3em] text-[#e7d9b8]">秘典</h2>
          </div>
          <button onClick={onClose} className="rounded-full border border-white/15 p-1.5 text-white/60 transition hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* tabs */}
        <div className="flex gap-1 border-b border-white/10 px-4 py-2">
          {([
            ["endings", "结局回廊"],
            ["pathways", "二十二途径"],
            ["guide", "守夜须知"],
          ] as [Tab, string][]).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`rounded-lg px-3 py-1.5 text-xs transition ${
                tab === k ? "bg-[#c9a86a]/15 text-[#e7d9b8]" : "text-white/45 hover:text-white/70"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {tab === "endings" && (
            <div className="space-y-2">
              <p className="mb-3 text-[11px] text-white/40">
                已揭示 {unlocked.length} / {ALL_ENDING_IDS.length} 种结局。未达成的结局将以封缄之雾遮蔽。
              </p>
              {ALL_ENDING_IDS.map((id) => {
                const e = ENDINGS[id];
                const seen = unlocked.includes(id);
                return (
                  <div
                    key={id}
                    className={`rounded-lg border p-3 ${seen ? TONE_COLOR[e.tone] : "border-white/8 text-white/30"}`}
                  >
                    <div className="flex items-center gap-2">
                      {seen ? <Scroll className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                      <span className="text-sm font-medium">{seen ? e.title : "？？？ 未揭示的结局"}</span>
                    </div>
                    {seen && e.hint && <p className="mt-1 text-[11px] text-white/45">{e.hint}</p>}
                    {!seen && <p className="mt-1 text-[11px] text-white/25">封缄之雾遮蔽着它的轮廓。</p>}
                  </div>
                );
              })}
            </div>
          )}

          {tab === "pathways" && (
            <div className="space-y-3">
              {PATHWAY_ORDER.map((key) => {
                const p = PATHWAYS[key];
                const isSeen = seen.includes(key);
                return (
                  <div key={key} className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <span style={{ ["--ember-color" as string]: "#c9a86a" } as React.CSSProperties} className="inline-block">
                        <Emblem k={key as PathwayKey} size={20} />
                      </span>
                      <span className="font-display text-base tracking-[0.2em] text-[#e7d9b8]">{p.name}</span>
                      <span className="text-[11px] text-white/40">→ 序列8 · {p.seq8}</span>
                      <span className="text-[10px] text-white/30">· {p.road}</span>
                    </div>
                    <p className="text-[12px] leading-relaxed text-white/55">{p.desc}</p>
                    <p className="mt-2 text-[11px] italic text-[#c9a86a]/70">{p.motto}</p>
                    <p className="mt-1 text-[11px] text-white/40">【被动】{p.passive.name}：{p.passive.desc}</p>
                    {isSeen && (
                      <p className="mt-1 text-[10px] text-emerald-300/60">✓ 已在此轮回中饮下</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {tab === "guide" && (
            <div className="space-y-4 text-[13px] leading-relaxed text-white/65">
              <div>
                <h3 className="mb-1 font-display tracking-[0.2em] text-[#e7d9b8]">三属性</h3>
                <p><span className="text-rose-300">体魄</span>：影响近战伤害、威慑判定、生命上限。</p>
                <p><span className="text-indigo-300">灵感</span>：影响占卜、勘察、灵视判定，是窥探隐秘的钥匙。</p>
                <p><span className="text-emerald-300">意志</span>：影响抵抗恐惧、谎言掩饰、直面超凡的判定。</p>
              </div>
              <div>
                <h3 className="mb-1 font-display tracking-[0.2em] text-[#e7d9b8]">魔药消化</h3>
                <p>魔药之名是消化的钥匙。做出符合途径「扮演法则」的选择、完成战斗与事件，都会提升消化度。消化度达 100% 后，可在对应章节据点申请晋升序列8。</p>
              </div>
              <div>
                <h3 className="mb-1 font-display tracking-[0.2em] text-[#e7d9b8]">理智与失控</h3>
                <p>直视超凡会损耗理智。理智归零即「失控」——成为值夜者枪口下的目标。可在教堂祈祷、使用宁神药剂、佩戴黑狗护符/罗塞尔的锚来缓解。</p>
              </div>
              <div>
                <h3 className="mb-1 font-display tracking-[0.2em] text-[#e7d9b8]">判定</h3>
                <p>D20 + 属性加成 + 途径/幸运修正，需达到 DC。失败不会卡死，但会推进到不同（通常更危险）的分支。</p>
              </div>
              <div>
                <h3 className="mb-1 font-display tracking-[0.2em] text-[#e7d9b8]">章节</h3>
                <p>{Object.values(CHAPTER_TITLES).join(" · ")}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
