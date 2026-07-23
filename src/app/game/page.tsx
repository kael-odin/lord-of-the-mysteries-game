"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronRight, Lock, Feather, Moon, BookOpen, Settings } from "lucide-react";
import type { Choice, Effect, GameState } from "@/lib/game/types";
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
import { sceneArt } from "@/lib/game/art";
import {
  loadSlot,
  saveSlot,
  deleteSlot,
  listSlots,
  getCurrentSlotId,
  setCurrentSlotId,
  recordEnding,
  recordPathway,
  MAX_SLOTS,
  type SaveHeader,
} from "@/lib/game/persistence/localSaveStore";
import Hud from "@/components/game/Hud";
import DiceOverlay from "@/components/game/DiceOverlay";
import CombatPanel from "@/components/game/CombatPanel";
import PathwaySelect from "@/components/game/PathwaySelect";
import EndingScreen from "@/components/game/EndingScreen";
import SaveSlotsPanel from "@/components/game/SaveSlotsPanel";
import CodexModal from "@/components/game/CodexModal";

const WHISPERS = [
  "……听……墙里的声音……",
  "……你早就死了，我们在你的尸体里开会……",
  "……月亮在看你，别回头……",
  "……扮演得很好，再多一点，你就是它了……",
  "……二十二张椅子，有一张刻着你的名字……",
  "……第三支舞，你跳得很好……",
  "……回声需要一个新的家，你的骨头很合适……",
];

type Phase = "boot" | "name" | "slots" | "play";

export default function GamePage() {
  const [phase, setPhase] = useState<Phase>("boot");
  const [gs, setGsState] = useState<GameState | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [pendingCheck, setPendingCheck] = useState<Choice | null>(null);
  const [battle, setBattle] = useState<{ enemyKey: string; winNext: string; loseNext: string } | null>(null);
  const [notes, setNotes] = useState<{ id: number; text: string }[]>([]);
  const [banner, setBanner] = useState<number | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "offline">("idle");
  const [slots, setSlots] = useState<SaveHeader[]>([]);
  const [showSlots, setShowSlots] = useState(false);
  const [showCodex, setShowCodex] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const gsRef = useRef<GameState | null>(null);
  gsRef.current = gs;
  const noteId = useRef(0);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevChapter = useRef(0);
  const slotIdRef = useRef<string>("auto");

  const node = gs ? getNode(gs.nodeId) : null;

  // ---------- reduced motion ----------
  useEffect(() => {
    try {
      const stored = localStorage.getItem("lotm_reduced_motion");
      if (stored !== null) {
        setReducedMotion(stored === "1");
      } else if (typeof window !== "undefined" && window.matchMedia) {
        setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (reducedMotion) document.documentElement.dataset.reducedMotion = "1";
    else delete document.documentElement.dataset.reducedMotion;
  }, [reducedMotion]);

  const refreshSlots = useCallback(async () => {
    const list = await listSlots();
    setSlots(list);
    return list;
  }, []);

  // ---------- 启动：本地优先读取 ----------
  useEffect(() => {
    (async () => {
      const cur = await getCurrentSlotId();
      if (cur) {
        const slot = await loadSlot(cur);
        if (slot && slot.state?.nodeId) {
          slotIdRef.current = cur;
          setGsState(slot.state);
          setPhase("play");
          return;
        }
      }
      setPhase("slots");
    })().catch(() => setPhase("slots"));
  }, []);

  // ---------- 自动存档（本地优先；云端可选备份） ----------
  useEffect(() => {
    if (phase !== "play" || !gs) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaveStatus("saving");
    saveTimer.current = setTimeout(async () => {
      const ok = await saveSlot(slotIdRef.current, gs);
      setSaveStatus(ok ? "saved" : "offline");
      // 可选云端备份：失败不影响本地
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
          ending: node?.type === "ending" ? node.endingId ?? null : null,
          digestion: gs.digestion,
          rounds: gs.rounds,
          state: gs,
        }),
      }).catch(() => {});
    }, 800);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [gs, phase, node]);

  // ---------- 章节横幅 ----------
  useEffect(() => {
    if (!gs) return;
    if (gs.chapter !== prevChapter.current) {
      prevChapter.current = gs.chapter;
      if (CHAPTER_TITLES[gs.chapter]) {
        setBanner(gs.chapter);
        const t = setTimeout(() => setBanner(null), reducedMotion ? 900 : 3000);
        return () => clearTimeout(t);
      }
    }
  }, [gs, reducedMotion]);

  // ---------- 记录途径 ----------
  useEffect(() => {
    if (gs?.pathway) recordPathway(gs.pathway);
  }, [gs?.pathway]);

  // ---------- 记录结局 ----------
  useEffect(() => {
    if (node?.type === "ending" && node.endingId) recordEnding(node.endingId);
  }, [node?.endingId, node?.type]);

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
    if ((nextNodeId === "c3_promote" || nextNodeId === "c3_promote_late" || nextNodeId === "c4_promote" || nextNodeId === "c4_promote_late" || nextNodeId === "c5_promote") && st.seq === 9) {
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
    if (!item?.usable || item.usable === "combatDmg" || item.usable === "combatBuff" || !(cur.inv[id] > 0)) return;
    let st: GameState = { ...cur, inv: { ...cur.inv, [id]: cur.inv[id] - 1 } };
    if (st.inv[id] <= 0) delete st.inv[id];
    const fx: Effect[] =
      item.usable === "healHp"
        ? [{ t: "hp", v: item.v || 0 }]
        : item.usable === "healSp"
          ? [{ t: "sp", v: item.v || 0 }]
          : [{ t: "sanity", v: item.v || 0 }];
    if (item.also) fx.push({ t: item.also.t, v: item.also.v });
    const r = applyEffects(st, fx);
    setGsState(r.state);
    pushNotes([`使用了【${item.name}】`, ...r.notes]);
  }

  async function startGame() {
    const pid = uid();
    const st = makeInitialState(nameInput, pid);
    slotIdRef.current = "auto";
    await setCurrentSlotId("auto");
    await saveSlot("auto", st);
    setGsState(st);
    setPhase("play");
  }

  async function startInSlot(id: string, name: string) {
    const pid = uid();
    const st = makeInitialState(name, pid);
    slotIdRef.current = id;
    await setCurrentSlotId(id);
    await saveSlot(id, st);
    setGsState(st);
    setPhase("play");
  }

  async function loadSlotById(id: string) {
    const slot = await loadSlot(id);
    if (slot && slot.state?.nodeId) {
      slotIdRef.current = id;
      await setCurrentSlotId(id);
      setGsState(slot.state);
      setPhase("play");
    }
  }

  async function deleteSlotById(id: string) {
    await deleteSlot(id);
    await refreshSlots();
  }

  function rebirth() {
    setGsState(null);
    setBattle(null);
    setPendingCheck(null);
    prevChapter.current = 0;
    setPhase("slots");
    refreshSlots();
  }

  async function manualSave() {
    if (!gs) return;
    setSaveStatus("saving");
    const ok = await saveSlot(slotIdRef.current, gs);
    setSaveStatus(ok ? "saved" : "offline");
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

  if (phase === "slots") {
    return (
      <SaveSlotsPanel
        slots={slots}
        nameInput={nameInput}
        setNameInput={setNameInput}
        maxSlots={MAX_SLOTS}
        onRefresh={refreshSlots}
        onNewInSlot={startInSlot}
        onLoad={loadSlotById}
        onDelete={deleteSlotById}
        onQuickStart={startGame}
      />
    );
  }

  if (phase === "name") {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#05060a]">
        <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: sceneArt("fog") }} />
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
            placeholder="无名者"
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
        style={{ backgroundImage: sceneArt(node.art) }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-[#05060a]/78 via-[#05060a]/58 to-[#05060a]" />
      {!reducedMotion && <div className="fog-layer" />}

      {/* 理智过低特效 */}
      {lowSan && (
        <>
          <div className="sanity-vignette pointer-events-none fixed inset-0 z-40" />
          <p className="pointer-events-none fixed bottom-24 left-1/2 z-40 -translate-x-1/2 animate-pulse text-center font-display text-lg tracking-[0.3em] text-red-300/70">
            {whisper}
          </p>
        </>
      )}

      <Hud gs={gs} onUseItem={useItem} onOpenSlots={() => setShowSlots(true)} onOpenCodex={() => setShowCodex(true)} saveStatus={saveStatus} onManualSave={manualSave} />

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

      {/* 右上工具栏 */}
      <div className="fixed right-4 top-2 z-50 flex gap-2">
        <button
          onClick={() => setReducedMotion((v) => !v)}
          title={reducedMotion ? "动效已减弱（点击开启）" : "点击减弱动效"}
          className="flex items-center gap-1.5 rounded-full border border-white/15 bg-[#0a0b12]/80 px-2.5 py-1 text-[10px] text-white/60 backdrop-blur-sm transition hover:border-[#c9a86a]/50 hover:text-[#e7d9b8]"
        >
          <Settings className="h-3 w-3" /> {reducedMotion ? "动效·简" : "动效"}
        </button>
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

        <p className="mt-16 flex items-center justify-center gap-2 text-center text-[10px] tracking-[0.3em] text-white/20">
          {saveStatus === "saving" ? "灰雾正在铭记你的轮回……" : saveStatus === "saved" ? "存档已留存于灰雾之上" : saveStatus === "offline" ? "本地存档（云端未启用）" : "死亡与失控皆是命运的一部分"}
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

      {/* 存档面板 */}
      {showSlots && (
        <SaveSlotsPanel
          embedded
          slots={slots}
          nameInput={nameInput}
          setNameInput={setNameInput}
          maxSlots={MAX_SLOTS}
          currentSlotId={slotIdRef.current}
          onRefresh={refreshSlots}
          onNewInSlot={async (id, name) => {
            await startInSlot(id, name);
            setShowSlots(false);
          }}
          onLoad={async (id) => {
            await loadSlotById(id);
            setShowSlots(false);
          }}
          onDelete={deleteSlotById}
          onClose={() => setShowSlots(false)}
        />
      )}

      {/* 秘典 */}
      {showCodex && <CodexModal onClose={() => setShowCodex(false)} />}
    </div>
  );
}
