"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Swords, Sparkles, Package, Wind, Heart, Brain, Ghost, ShieldPlus, Skull } from "lucide-react";
import type { CombatState, GameState } from "@/lib/game/types";
import { ENEMIES, ITEMS, PATHWAYS } from "@/lib/game/data";
import { newCombat, playerAct, playerBaseAtk, type PlayerAction } from "@/lib/game/engine";

export default function CombatPanel({
  gs0,
  enemyKey,
  winNext,
  loseNext,
  onFinish,
}: {
  gs0: GameState;
  enemyKey: string;
  winNext: string;
  loseNext: string;
  onFinish: (gs: GameState, won: boolean) => void;
}) {
  const [pair, setPair] = useState<{ gs: GameState; cs: CombatState }>(() => {
    const cs = newCombat(enemyKey, gs0, winNext, loseNext);
    return { gs: { ...gs0, sp: cs.playerSp, sanity: cs.playerSanity }, cs };
  });
  const [bagOpen, setBagOpen] = useState(false);
  const finishedRef = useRef(false);
  const logRef = useRef<HTMLDivElement>(null);
  const { gs, cs } = pair;
  const enemy = ENEMIES[enemyKey];
  const pw = gs.pathway ? PATHWAYS[gs.pathway] : null;

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [cs.log.length]);

  useEffect(() => {
    if (cs.over && !finishedRef.current) {
      finishedRef.current = true;
      const t = setTimeout(() => onFinish(gs, cs.won), 2400);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cs.over]);

  function act(a: PlayerAction) {
    if (pair.cs.over) return;
    setBagOpen(false);
    const r = playerAct(pair.gs, pair.cs, a);
    setPair({ gs: r.s, cs: r.cs });
  }

  const usableItems = useMemo(
    () =>
      Object.entries(gs.inv)
        .map(([id, n]) => ({ item: ITEMS[id], n, id }))
        .filter((x) => x.item?.usable),
    [gs.inv],
  );

  const ehpPct = (cs.ehp / cs.ehpMax) * 100;

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-[#05060a]/97 backdrop-blur-sm">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,30,40,0.18),transparent_55%)]" />

      {/* 敌方 */}
      <div className="relative mx-auto w-full max-w-3xl px-4 pt-6">
        <div
          className="rounded-2xl border border-red-900/50 bg-gradient-to-b from-[#17101a]/90 to-[#0c0a12]/90 p-5"
          style={cs.shake ? { animation: "shakeX 0.45s ease" } : undefined}
          key={`enemy-${cs.ehp}-${cs.turn}`}
        >
          <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <h2 className="font-display text-2xl tracking-[0.2em] text-red-200">{enemy.name}</h2>
              <p className="mt-0.5 flex items-center gap-2 text-[11px] text-white/40">
                {enemy.title}
                {enemy.undead && (
                  <span className="flex items-center gap-1 rounded-full border border-purple-400/30 px-2 py-0.5 text-[10px] text-purple-300">
                    <Ghost className="h-3 w-3" /> 亡灵
                  </span>
                )}
              </p>
            </div>
            <div className="text-right text-[11px] text-white/40">
              回合 <span className="text-lg text-red-200">{cs.turn}</span>
            </div>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-red-800 via-red-500 to-orange-400 transition-all duration-500"
              style={{ width: `${ehpPct}%` }}
            />
          </div>
          <p className="mt-1 text-right text-[11px] tabular-nums text-white/50">
            {cs.ehp} / {cs.ehpMax}
          </p>
          {(cs.vulnTurns > 0 || cs.eAtkTurns > 0 || cs.dotTurns > 0) && (
            <div className="mt-1 flex flex-wrap gap-2 text-[10px]">
              {cs.vulnTurns > 0 && <span className="rounded bg-red-500/15 px-2 py-0.5 text-red-300">易伤 +{cs.vuln}%（{cs.vulnTurns}回合）</span>}
              {cs.eAtkTurns > 0 && <span className="rounded bg-blue-500/15 px-2 py-0.5 text-blue-300">攻击 -{cs.eAtkDown}（{cs.eAtkTurns}回合）</span>}
              {cs.dotTurns > 0 && <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-emerald-300">凋零 {cs.dot}/回合（{cs.dotTurns}回合）</span>}
            </div>
          )}
        </div>
      </div>

      {/* 战斗日志 */}
      <div ref={logRef} className="relative mx-auto w-full max-w-3xl flex-1 space-y-2 overflow-y-auto px-4 py-4">
        {cs.log.map((l, i) => (
          <p
            key={i}
            className={`text-[13px] leading-relaxed ${
              l.side === "player" ? "text-[#e7d9b8]" : l.side === "enemy" ? "text-red-300/90" : "text-white/45 italic"
            }`}
            style={i === cs.log.length - 1 ? { animation: "fadeUp 0.35s ease" } : undefined}
          >
            {l.side === "player" ? "▸ " : l.side === "enemy" ? "◂ " : "· "}
            {l.text}
          </p>
        ))}
        {cs.over && (
          <p className={`font-display pt-3 text-center text-3xl tracking-[0.5em] ${cs.won ? "text-[#c9a86a]" : "text-red-400"}`}>
            {cs.won ? "胜  利" : "败  北"}
          </p>
        )}
      </div>

      {/* 玩家操作区 */}
      <div className="relative border-t border-white/10 bg-[#0a0b12]/95">
        <div className="mx-auto w-full max-w-3xl px-4 py-4">
          <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-white/60">
            <span className="flex items-center gap-1">
              <Heart className="h-3.5 w-3.5 text-rose-400" /> {cs.playerHp}/{gs.maxHp}
            </span>
            <span className="flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-indigo-300" /> {cs.playerSp}/{gs.maxSp}
            </span>
            <span className="flex items-center gap-1">
              <Brain className="h-3.5 w-3.5 text-emerald-300" /> {cs.playerSanity}/{gs.maxSanity}
            </span>
            {cs.shield > 0 && (
              <span className="flex items-center gap-1 text-sky-300">
                <ShieldPlus className="h-3.5 w-3.5" /> 护盾 {cs.shield}
              </span>
            )}
            {cs.atkUp > 0 && <span className="text-orange-300">攻击 +{cs.atkUp}（{cs.atkUpTurns}回合）</span>}
            {cs.dodgeUp > 0 && <span className="text-teal-300">闪避 +{cs.dodgeUp}%（{cs.dodgeTurns}回合）</span>}
          </div>

          {bagOpen && (
            <div className="mb-3 grid grid-cols-2 gap-2 md:grid-cols-3">
              {usableItems.length === 0 && <p className="col-span-full text-xs text-white/35">没有可用的物品。</p>}
              {usableItems.map(({ item, n, id }) => (
                <button
                  key={id}
                  onClick={() => act({ kind: "item", key: id })}
                  disabled={cs.over}
                  className="rounded-lg border border-white/15 bg-white/5 p-2 text-left transition hover:border-[#c9a86a]/50 disabled:opacity-40"
                >
                  <p className="text-xs text-[#e7d9b8]">{item.name} ×{n}</p>
                  <p className="text-[10px] text-white/40">{item.desc}</p>
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            <button
              onClick={() => act({ kind: "attack" })}
              disabled={cs.over}
              className="flex flex-col items-center gap-1 rounded-lg border border-[#c9a86a]/40 bg-[#c9a86a]/10 px-3 py-3 transition hover:bg-[#c9a86a]/25 disabled:opacity-40"
            >
              <span className="flex items-center gap-1.5 text-sm text-[#e7d9b8]">
                <Swords className="h-4 w-4" /> 攻击
              </span>
              <span className="text-[10px] text-white/40">约 {playerBaseAtk(gs) + cs.atkUp} 伤害 · 无消耗</span>
            </button>

            {pw?.abilities.map((ab) => {
              const up = gs.seq === 8;
              const name = up && ab.upName ? ab.upName : ab.name;
              const desc = up && ab.upDesc ? ab.upDesc : ab.desc;
              const aff = cs.playerSp >= ab.sp;
              return (
                <button
                  key={ab.key}
                  onClick={() => act({ kind: "ability", key: ab.key })}
                  disabled={cs.over || !aff}
                  className="flex flex-col items-center gap-1 rounded-lg border border-indigo-400/30 bg-indigo-500/10 px-3 py-3 transition hover:bg-indigo-500/25 disabled:opacity-40"
                  title={desc}
                >
                  <span className="flex items-center gap-1.5 text-xs text-indigo-200">
                    <Skull className="h-3.5 w-3.5" /> {name}
                  </span>
                  <span className="text-[10px] text-white/40">
                    灵性-{ab.sp}
                    {ab.sanity ? ` · 理智-${ab.sanity}` : ""}
                  </span>
                </button>
              );
            })}

            <button
              onClick={() => setBagOpen(!bagOpen)}
              disabled={cs.over}
              className="flex flex-col items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-3 py-3 transition hover:bg-white/15 disabled:opacity-40"
            >
              <span className="flex items-center gap-1.5 text-xs text-white/80">
                <Package className="h-4 w-4" /> 物品
              </span>
              <span className="text-[10px] text-white/40">{usableItems.reduce((a, x) => a + x.n, 0)} 件可用</span>
            </button>

            <button
              onClick={() => act({ kind: "meditate" })}
              disabled={cs.over}
              className="flex flex-col items-center gap-1 rounded-lg border border-teal-400/25 bg-teal-500/10 px-3 py-3 transition hover:bg-teal-500/20 disabled:opacity-40"
            >
              <span className="flex items-center gap-1.5 text-xs text-teal-200">
                <Wind className="h-4 w-4" /> 冥想调息
              </span>
              <span className="text-[10px] text-white/40">回复灵性与少许理智</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
