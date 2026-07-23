"use client";

import { useState } from "react";
import { Heart, Sparkles, Brain, FlaskConical, Coins, Package, Moon, BookOpen, Save, CloudOff, Check } from "lucide-react";
import type { GameState } from "@/lib/game/types";
import { ITEMS, PATHWAYS } from "@/lib/game/data";
import type { Item } from "@/lib/game/data";

// 可读的机械效果标签：把数值字段翻译成玩家能一眼看懂的收益。
function effectTag(item: Item): string | null {
  if (item.passive === "atk2") return "攻击 +2";
  if (item.passive === "atk4") return "攻击 +4";
  if (item.passive === "atk6") return "攻击 +6";
  if (item.passive === "sanityShield") return "理智损失 -1";
  if (item.passive === "anchor") return "理智减半·上限+10";
  if (item.usable === "healHp") return `生命 +${item.v}`;
  if (item.usable === "healSp") {
    const base = `灵性 +${item.v}`;
    return item.also ? `${base}·理智 +${item.also.v}` : base;
  }
  if (item.usable === "healSanity") return `理智 +${item.v}`;
  if (item.usable === "combatDmg") {
    const base = `伤害 ${item.v}`;
    return item.undeadBonus ? `${base}·亡灵 +${item.undeadBonus}` : base;
  }
  if (item.usable === "combatBuff" && item.buff) {
    const b = item.buff;
    if (b.vuln) return `敌易伤 +${b.vuln}%`;
    if (b.dodgeUp) return `闪避 +${b.dodgeUp}%`;
    if (b.atkUp) return `攻击 +${b.atkUp}`;
  }
  return null;
}

function Bar({ value, max, color, glow }: { value: number; max: number; color: string; glow?: boolean }) {
  const pct = Math.max(0, Math.min(100, (value / Math.max(1, max)) * 100));
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
      <div
        className={`h-full rounded-full transition-all duration-700 ${color} ${glow ? "animate-pulse" : ""}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function Hud({ gs, onUseItem, onOpenSlots, onOpenCodex, saveStatus, onManualSave }: {
  gs: GameState;
  onUseItem: (id: string) => void;
  onOpenSlots?: () => void;
  onOpenCodex?: () => void;
  saveStatus?: "idle" | "saving" | "saved" | "offline";
  onManualSave?: () => void;
}) {
  const [invOpen, setInvOpen] = useState(false);
  const pw = gs.pathway ? PATHWAYS[gs.pathway] : null;
  const items = Object.entries(gs.inv);
  const lowSan = gs.sanity / gs.maxSanity < 0.4;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0a0b12]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-5 gap-y-2 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Moon className="h-4 w-4 text-[#c9a86a]" />
          <span className="font-display text-sm tracking-[0.3em] text-[#c9a86a]">诡秘之主</span>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
          <span className="text-[11px] text-white/50">{pw ? `${pw.road} · 序列${gs.seq}` : "普通人"}</span>
          <span className="text-xs font-semibold text-[#e7d9b8]">{pw ? (gs.seq === 8 ? pw.seq8 : pw.name) : gs.name}</span>
        </div>

        <div className="flex min-w-[200px] flex-1 flex-wrap items-center gap-x-4 gap-y-1.5 sm:min-w-[280px]">
          <div className="flex min-w-[110px] flex-1 items-center gap-2 sm:min-w-[120px]">
            <Heart className="h-3.5 w-3.5 shrink-0 text-rose-400" />
            <Bar value={gs.hp} max={gs.maxHp} color="bg-gradient-to-r from-rose-600 to-rose-400" />
            <span className="w-12 text-right text-[11px] tabular-nums text-white/60">{gs.hp}/{gs.maxHp}</span>
          </div>
          <div className="flex min-w-[110px] flex-1 items-center gap-2 sm:min-w-[120px]">
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-indigo-300" />
            <Bar value={gs.sp} max={gs.maxSp} color="bg-gradient-to-r from-indigo-600 to-indigo-300" />
            <span className="w-12 text-right text-[11px] tabular-nums text-white/60">{gs.sp}/{gs.maxSp}</span>
          </div>
          <div className="flex min-w-[110px] flex-1 items-center gap-2 sm:min-w-[120px]">
            <Brain className={`h-3.5 w-3.5 shrink-0 ${lowSan ? "animate-pulse text-red-400" : "text-emerald-300"}`} />
            <Bar value={gs.sanity} max={gs.maxSanity} color={lowSan ? "bg-gradient-to-r from-red-700 to-red-400" : "bg-gradient-to-r from-emerald-700 to-emerald-300"} glow={lowSan} />
            <span className="w-12 text-right text-[11px] tabular-nums text-white/60">{gs.sanity}/{gs.maxSanity}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <div className="flex items-center gap-1.5" title="魔药消化度">
            <FlaskConical className="h-3.5 w-3.5 text-[#c9a86a]" />
            <span className="text-[11px] tabular-nums text-[#e7d9b8]">{gs.digestion}%</span>
          </div>
          <div className="flex items-center gap-1.5" title="金镑">
            <Coins className="h-3.5 w-3.5 text-yellow-400" />
            <span className="text-[11px] tabular-nums text-white/70">{gs.pounds}镑</span>
          </div>
          <button
            onClick={() => setInvOpen(!invOpen)}
            className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] text-white/70 transition hover:border-[#c9a86a]/50 hover:text-[#e7d9b8]"
          >
            <Package className="h-3.5 w-3.5" /> 行囊
          </button>
          {onManualSave && (
            <button
              onClick={onManualSave}
              aria-label={saveStatus === "offline" ? "本地存档（云端未启用）" : saveStatus === "saved" ? "已留存，再次点击手动存档" : "手动存档"}
              title={saveStatus === "offline" ? "本地存档（云端未启用）" : saveStatus === "saved" ? "已留存" : "存档"}
              className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] transition ${
                saveStatus === "saved"
                  ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-200"
                  : saveStatus === "saving"
                    ? "border-[#c9a86a]/40 bg-[#c9a86a]/10 text-[#e7d9b8]"
                    : "border-white/15 bg-white/5 text-white/70 hover:border-[#c9a86a]/50 hover:text-[#e7d9b8]"
              }`}
            >
              {saveStatus === "offline" ? (
                <CloudOff className="h-3.5 w-3.5" />
              ) : saveStatus === "saved" ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Save className={`h-3.5 w-3.5 ${saveStatus === "saving" ? "animate-pulse" : ""}`} />
              )}
              {saveStatus === "saved" && <span className="hidden sm:inline">已留存</span>}
              {saveStatus === "saving" && <span className="hidden sm:inline">存档中</span>}
            </button>
          )}
          {onOpenCodex && (
            <button
              onClick={onOpenCodex}
              aria-label="打开秘典（结局与途径图鉴）"
              title="秘典"
              className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] text-white/70 transition hover:border-[#c9a86a]/50 hover:text-[#e7d9b8]"
            >
              <BookOpen className="h-3.5 w-3.5" />
            </button>
          )}
          {onOpenSlots && (
            <button
              onClick={onOpenSlots}
              aria-label="存档位管理（读取与覆盖存档槽）"
              title="存档槽"
              className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] text-white/70 transition hover:border-[#c9a86a]/50 hover:text-[#e7d9b8]"
            >
              <Moon className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {invOpen && (
        <div className="border-t border-white/10 bg-[#0c0d16]/95">
          <div className="mx-auto max-w-5xl px-4 py-3">
            {items.length === 0 ? (
              <p className="text-xs text-white/40">行囊空空如也。恶龙酒吧的地下黑市或许有些好东西。</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {items.map(([id, n]) => {
                  const item = ITEMS[id];
                  if (!item) return null;
                  const usable = !!item.usable && item.usable !== "combatDmg" && item.usable !== "combatBuff";
                  const tag = effectTag(item);
                  return (
                    <div key={id} className="group flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-[#e7d9b8]">
                          {item.name} <span className="text-white/40">×{n}</span>
                          {tag && (
                            <span className="rounded border border-[#c9a86a]/30 bg-[#c9a86a]/10 px-1.5 py-px text-[9px] tracking-wide text-[#c9a86a]">
                              {tag}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-white/40">{item.desc}</div>
                      </div>
                      {usable && (
                        <button
                          onClick={() => onUseItem(id)}
                          className="rounded border border-[#c9a86a]/40 px-2 py-0.5 text-[10px] text-[#c9a86a] transition hover:bg-[#c9a86a]/15"
                        >
                          使用
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
