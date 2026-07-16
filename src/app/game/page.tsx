"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronRight, Lock, Feather, Moon } from "lucide-react";
import type { Choice, GameState } from "@/lib/game/types";
import {
  applyEffects,
  applyPathway,
  applyPromotion,
  checkReq,
  enterNode,
  makeInitialState,
  resolveChoice,
  uid,
  ENDING_DEATH,
  ENDING_SHIKONG,
  type CheckResult,
} from "@/lib/game/engine";
import { getNode, CHAPTER_TITLES } from "@/lib/game/story";
import { PATHWAYS, ITEMS } from "@/lib/game/data";
import Hud from "@/components/game/Hud";
import DiceOverlay from "@/components/game/DiceOverlay";
import CombatPanel from "@/components/game/CombatPanel";
import PathwaySelect from "@/components/game/PathwaySelect";
import EndingScreen from "@/components/game/EndingScreen";

const ART: Record<string, string> = {
  city: "/images/bg-city.jpg",
  fog: "/images/bg-fog-palace.jpg",
  ritual: "/images/bg-ritual.jpg",
};

const WHISPERS = [
  "……听……墙里的声音……",
  "……你早就死了，我们在你的尸体里开会……",
  "……月亮在看你，别回头……",
  "……扮演得很好，再多一点，你就是它了……",
  "……二十二张椅子，有一张刻着你的名字……",
];

type Phase = "boot" | "name" | "play";

export default function GamePage() {
  const [phase, setPhase] = useState<Phase>("boot");
  const [gs, setGsState] = useState<GameState | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [pendingCheck, setPendingCheck] = useState<Choice | null>(null);
  const [battle, setBattle] = useState<{ enemyKey: string; winNext: string; loseNext: string } | null>(null);
  const [notes, setNotes] = useState<{ id: number; text: string }[]>([]);
  const [banner, setBanner] = useState<number | null>(null);

  const gsRef = useRef<GameState | null>(null);
  gsRef.current = gs;
  const noteId = useRef(0);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevChapter = useRef(0);

  const node = gs ? getNode(gs.nodeId) : null;

  // ---------- 启动：尝试读取云端存档 ----------
  useEffect(() => {
    const pid = typeof window !== "undefined" ? localStorage.getItem("lotm_player_id") : null;
    if (!pid) {
      setPhase("name");
      return;
    }
    fetch(`/api/game?playerId=${encodeURIComponent(pid)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d?.save?.state?.nodeId) {
          setGsState(d.save.state as GameState);
          setPhase("play");
        } else {
          setPhase("name");
        }
      })
      .catch(() => setPhase("name"));
  }, []);

  // ---------- 自动存档 ----------
  useEffect(() => {
    if (phase !== "play" || !gs) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const nd = getNode(gs.nodeId);
      fetch("/api/game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerId: gs.playerId,
          name: gs.name,
          pathway: gs.pathway,
          seq: gs.seq,
          chapter: gs.chapter,
          nodeId: gs.nodeId,
          ending: nd.type === "ending" ? nd.endingId ?? null : null,
          digestion: gs.digestion,
          rounds: gs.rounds,
          state: gs,
        }),
      }).catch(() => {});
    }, 800);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [gs, phase]);

  // ---------- 章节横幅 ----------
  useEffect(() => {
    if (!gs) return;
    if (gs.chapter !== prevChapter.current) {
      prevChapter.current = gs.chapter;
      if (CHAPTER_TITLES[gs.chapter]) {
        setBanner(gs.chapter);
        const t = setTimeout(() => setBanner(null), 3000);
        return () => clearTimeout(t);
      }
    }
  }, [gs]);

  function pushNotes(list: string[]) {
    if (!list.length) return;
    const entries = list.map((text) => ({ id: ++noteId.current, text }));
    setNotes((ns) => [...ns.slice(-5), ...entries]);
    const ids = entries.map((e) => e.id);
    setTimeout(() => setNotes((ns) => ns.filter((n) => !ids.includes(n.id))), 2800);
  }

  // ---------- 节点跳转中枢 ----------
  function goto(nextNodeId: string, fromState: GameState, extraNotes: string[] = []) {
    let st: GameState = { ...fromState, nodeId: nextNodeId };
    const allNotes = [...extraNotes];

    const m = nextNodeId.match(/^c2_drink_(\w+)$/);
    if (m && PATHWAYS[m[1]] && st.pathway !== m[1]) {
      const r = applyPathway(st, m[1]);
      st = r.state;
      allNotes.push(...r.notes);
    }
    if ((nextNodeId === "c3_promote" || nextNodeId === "c3_promote_late") && st.seq === 9) {
      const r = applyPromotion(st);
      st = r.state;
      allNotes.push("晋升序列 8，新的大门已经洞开", ...r.notes);
    }

    const target = getNode(nextNodeId);
    const en = enterNode(st, target, (id, n) => n.chapter ?? st.chapter);
    st = en.state;
    allNotes.push(...en.notes);

    setGsState(st);
    pushNotes(allNotes.filter(Boolean));
  }

  function handleChoice(choice: Choice) {
    const cur = gsRef.current;
    if (!cur) return;
    const rc = checkReq(cur, choice.req);
    if (!rc.ok) return;

    if (choice.combat) {
      let st: GameState = { ...cur, rounds: cur.rounds + 1 };
      if (choice.once) st = { ...st, flags: { ...st.flags, [choice.once]: 1 } };
      if (choice.effects) {
        const r = applyEffects(st, choice.effects);
        st = r.state;
        pushNotes(r.notes);
      }
      setGsState(st);
      setBattle({
        enemyKey: choice.combat,
        winNext: choice.winNext || "c2_hub",
        loseNext: choice.loseNext || ENDING_DEATH,
      });
      return;
    }

    if (choice.check) {
      setPendingCheck(choice);
      return;
    }

    const nd = getNode(cur.nodeId);
    const r = resolveChoice(cur, nd, choice);
    if (choice.next) goto(choice.next, r.state, r.notes);
    else {
      setGsState(r.state);
      pushNotes(r.notes);
    }
  }

  function onDiceDone(res: CheckResult) {
    const choice = pendingCheck;
    setPendingCheck(null);
    const cur = gsRef.current;
    if (!choice || !cur) return;
    let st: GameState = { ...cur, rounds: cur.rounds + 1 };
    if (choice.once) st = { ...st, flags: { ...st.flags, [choice.once]: 1 } };
    const allNotes: string[] = [];
    if (choice.effects) {
      const r = applyEffects(st, choice.effects);
      st = r.state;
      allNotes.push(...r.notes);
    }
    if (res.effects.length) {
      const r = applyEffects(st, res.effects);
      st = r.state;
      allNotes.push(...r.notes);
    }
    goto(res.next, st, allNotes);
  }

  function onCombatFinish(gsAfter: GameState, won: boolean) {
    const b = battle;
    setBattle(null);
    if (!b) return;
    const target = won ? b.winNext : gsAfter.sanity <= 0 ? ENDING_SHIKONG : b.loseNext;
    goto(target, gsAfter, won ? ["战斗胜利，魔药在搏杀中进一步消化"] : []);
  }

  function useItem(id: string) {
    const cur = gsRef.current;
    if (!cur) return;
    const item = ITEMS[id];
    if (!item?.usable || item.usable === "combatDmg" || !(cur.inv[id] > 0)) return;
    let st: GameState = { ...cur, inv: { ...cur.inv, [id]: cur.inv[id] - 1 } };
    if (st.inv[id] <= 0) delete st.inv[id];
    const fx =
      item.usable === "healHp"
        ? [{ t: "hp" as const, v: item.v || 0 }]
        : item.usable === "healSp"
          ? [{ t: "sp" as const, v: item.v || 0 }]
          : [{ t: "sanity" as const, v: item.v || 0 }];
    const r = applyEffects(st, fx);
    setGsState(r.state);
    pushNotes([`使用了【${item.name}】`, ...r.notes]);
  }

  function startGame() {
    const pid = uid();
    localStorage.setItem("lotm_player_id", pid);
    const st = makeInitialState(nameInput, pid);
    setGsState(st);
    setPhase("play");
  }

  function rebirth() {
    const pid = uid();
    localStorage.setItem("lotm_player_id", pid);
    setGsState(null);
    setBattle(null);
    setPendingCheck(null);
    prevChapter.current = 0;
    setPhase("name");
  }

  // ================= 渲染 =================

  if (phase === "boot") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#05060a]">
        <Moon className="mb-6 h-8 w-8 animate-pulse text-[#c9a86a]" />
        <p className="font-display animate-pulse text-2xl tracking-[0.6em] text-[#c9a86a]">穿梭于灰雾之间</p>
        <p className="mt-3 text-xs tracking-[0.3em] text-white/30">正在唤醒你的轮回……</p>
      </div>
    );
  }

  if (phase === "name") {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#05060a]">
        <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: "url(/images/bg-fog-palace.jpg)" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#05060a]/60 via-[#05060a]/80 to-[#05060a]" />
        <div className="fog-layer" />
        <div className="relative z-10 w-[min(92vw,480px)] rounded-2xl border border-white/10 bg-[#0b0c14]/80 p-10 text-center backdrop-blur-md">
          <p className="mb-2 text-[10px] tracking-[0.5em] text-white/40">灵魂登记处 · REGISTRY OF SOULS</p>
          <h1 className="font-display mb-6 text-4xl tracking-[0.3em] text-[#e7d9b8]">报上你的名字</h1>
          <p className="mb-6 text-xs leading-relaxed text-white/50">
            在你坠入这具身体之前，你的名字是什么？
            <br />
            灰雾的回响名录上，将以此铭记你的轮回。
          </p>
          <input
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && startGame()}
            maxLength={12}
            placeholder="周明瑞"
            className="mb-4 w-full rounded-lg border border-white/15 bg-black/40 px-4 py-3 text-center text-lg tracking-[0.3em] text-[#e7d9b8] outline-none transition placeholder:text-white/20 focus:border-[#c9a86a]/60"
          />
          <button
            onClick={startGame}
            className="w-full rounded-lg border border-[#c9a86a]/60 bg-[#c9a86a]/15 py-3 text-sm tracking-[0.5em] text-[#e7d9b8] transition hover:bg-[#c9a86a]/30"
          >
            睁 开 眼 睛
          </button>
          <a href="/" className="mt-5 block text-[11px] text-white/30 transition hover:text-white/60">
            返回灰雾之门
          </a>
        </div>
      </div>
    );
  }

  if (!gs || !node) return null;

  if (node.type === "ending") {
    return <EndingScreen node={node} gs={gs} onRebirth={rebirth} />;
  }

  const lowSan = gs.sanity / gs.maxSanity < 0.4;
  const whisper = WHISPERS[gs.rounds % WHISPERS.length];
  const visibleChoices = node.choices.filter((c) => {
    if (c.hidden && !checkReq(gs, c.hidden).ok) return false;
    if (c.once && gs.flags[c.once]) return false;
    return true;
  });

  return (
    <div className="relative min-h-screen bg-[#05060a]">
      {/* 背景 */}
      <div
        key={node.art || "city"}
        className="fixed inset-0 bg-cover bg-center transition-opacity duration-1000"
        style={{ backgroundImage: `url(${ART[node.art || "city"]})` }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-[#05060a]/75 via-[#05060a]/55 to-[#05060a]" />
      <div className="fog-layer" />

      {/* 理智过低特效 */}
      {lowSan && (
        <>
          <div className="sanity-vignette pointer-events-none fixed inset-0 z-40" />
          <p className="pointer-events-none fixed bottom-24 left-1/2 z-40 -translate-x-1/2 animate-pulse text-center font-display text-lg tracking-[0.3em] text-red-300/70">
            {whisper}
          </p>
        </>
      )}

      <Hud gs={gs} onUseItem={useItem} />

      {/* 浮动提示 */}
      <div className="pointer-events-none fixed right-4 top-20 z-50 space-y-1.5">
        {notes.map((n) => (
          <p
            key={n.id}
            className="note-toast rounded-lg border border-[#c9a86a]/25 bg-[#0c0d16]/90 px-3 py-1.5 text-[11px] text-[#e7d9b8] shadow-lg"
          >
            {n.text}
          </p>
        ))}
      </div>

      {/* 章节横幅 */}
      {banner !== null && (
        <div className="chapter-banner fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-sm">
          <div className="text-center">
            <div className="mx-auto mb-6 h-px w-40 bg-gradient-to-r from-transparent via-[#c9a86a] to-transparent" />
            <h2 className="font-display text-5xl tracking-[0.5em] text-[#e7d9b8] md:text-6xl">{CHAPTER_TITLES[banner]}</h2>
            <div className="mx-auto mt-6 h-px w-40 bg-gradient-to-r from-transparent via-[#c9a86a] to-transparent" />
          </div>
        </div>
      )}

      {/* 正文 */}
      <main className="relative z-10 mx-auto max-w-3xl px-5 pb-40 pt-10 md:pt-16">
        {node.title && (
          <div key={`t-${node.id}`} className="mb-8" style={{ animation: "fadeUp 0.7s ease both" }}>
            <p className="mb-2 flex items-center gap-2 text-[10px] tracking-[0.5em] text-[#c9a86a]/70">
              <Feather className="h-3 w-3" /> {CHAPTER_TITLES[node.chapter || gs.chapter] || "番外"}
            </p>
            <h1 className="font-display text-3xl tracking-[0.2em] text-[#eee5cf] md:text-4xl">{node.title}</h1>
          </div>
        )}

        <div className="space-y-5" key={node.id}>
          {node.text.map((t, i) => (
            <p
              key={i}
              className="text-[15px] leading-loose text-[#d3ccbc] [text-shadow:0_1px_2px_rgba(0,0,0,0.8)] md:text-base md:leading-loose"
              style={{ animation: "fadeUp 0.8s ease both", animationDelay: `${0.15 + i * 0.22}s` }}
            >
              {t.replaceAll("{name}", gs.name)}
            </p>
          ))}
        </div>

        <p className="mt-8 text-sm text-white/50" style={{ animation: "fadeUp 0.8s ease both", animationDelay: `${0.2 + node.text.length * 0.22}s` }}>
          —— 你要怎么做？
        </p>

        {/* 选项 / 途径选择 */}
        {node.type === "pathway" ? (
          <div className="mt-6" style={{ animation: "fadeUp 0.8s ease both", animationDelay: "0.3s" }}>
            <PathwaySelect onPick={(nodeId) => goto(nodeId, gsRef.current!, [])} />
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {visibleChoices.map((c, i) => {
              const rc = checkReq(gs, c.req);
              return (
                <button
                  key={i}
                  disabled={!rc.ok}
                  onClick={() => handleChoice(c)}
                  className={`group flex w-full items-center justify-between gap-4 rounded-xl border p-4 text-left backdrop-blur-sm transition-all duration-300 ${
                    rc.ok
                      ? "border-white/12 bg-[#0b0c14]/70 hover:-translate-y-0.5 hover:border-[#c9a86a]/50 hover:bg-[#13141f]/85 hover:shadow-[0_12px_40px_-12px_rgba(201,168,106,0.3)]"
                      : "cursor-not-allowed border-white/5 bg-black/40 opacity-60"
                  }`}
                  style={{ animation: "fadeUp 0.7s ease both", animationDelay: `${0.3 + node.text.length * 0.22 + i * 0.08}s` }}
                >
                  <div>
                    <p className={`text-[15px] ${rc.ok ? "text-[#e9e0c9]" : "text-white/40"}`}>{c.text}</p>
                    {c.sub && <p className="mt-1 text-xs text-white/40">{c.sub}</p>}
                    {!rc.ok && rc.reason && rc.reason.trim() && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-red-300/80">
                        <Lock className="h-3 w-3" /> {rc.reason}
                      </p>
                    )}
                  </div>
                  {rc.ok ? (
                    <ChevronRight className="h-4 w-4 shrink-0 text-[#c9a86a]/50 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#c9a86a]" />
                  ) : (
                    <Lock className="h-4 w-4 shrink-0 text-white/20" />
                  )}
                </button>
              );
            })}
            {visibleChoices.length === 0 && (
              <p className="text-sm text-white/35">雾气遮蔽了前路……（没有可走的路，试试使用行囊中的物品，或刷新页面）</p>
            )}
          </div>
        )}

        <p className="mt-16 text-center text-[10px] tracking-[0.3em] text-white/20">
          存档已同步至灰雾之上 · 死亡与失控皆是命运的一部分
        </p>
      </main>

      {/* 判定层 */}
      {pendingCheck?.check && gsRef.current && (
        <DiceOverlay gs={gsRef.current} check={pendingCheck.check} onDone={onDiceDone} />
      )}

      {/* 战斗层 */}
      {battle && (
        <CombatPanel
          key={battle.enemyKey + gs.rounds}
          gs0={gs}
          enemyKey={battle.enemyKey}
          winNext={battle.winNext}
          loseNext={battle.loseNext}
          onFinish={onCombatFinish}
        />
      )}
    </div>
  );
}
