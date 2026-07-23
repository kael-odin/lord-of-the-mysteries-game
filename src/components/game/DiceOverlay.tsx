"use client";

import { useEffect, useRef, useState } from "react";
import { Dices } from "lucide-react";
import type { Check, GameState } from "@/lib/game/types";
import { rollCheck, type CheckResult } from "@/lib/game/engine";

export default function DiceOverlay({
  gs,
  check,
  onDone,
}: {
  gs: GameState;
  check: Check;
  onDone: (r: CheckResult) => void;
}) {
  const [face, setFace] = useState(20);
  const [result, setResult] = useState<CheckResult | null>(null);

  useEffect(() => {
    // Roll once after a brief spin. Cleanup clears both timers so a
    // StrictMode remount (or unmount) cancels the in-flight roll and the
    // next mount schedules a fresh one — no stuck "spinning forever" state.
    const timer = setInterval(() => setFace(1 + Math.floor(Math.random() * 20)), 70);
    const stop = setTimeout(() => {
      clearInterval(timer);
      setResult(rollCheck(gs, check));
    }, 1400);
    return () => {
      clearInterval(timer);
      clearTimeout(stop);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Once the result is in, let keyboard players dismiss with Enter/Space
  // without tabbing to the button, and announce the outcome to assistive tech.
  useEffect(() => {
    if (!result) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        onDone(result);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  const continueBtnRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    // Move focus to 继续 so screen readers announce the outcome, and
    // keyboard players can press Enter again (the window listener also fires).
    continueBtnRef.current?.focus();
  }, [result]);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 backdrop-blur-sm">
      <div className="w-[min(90vw,420px)] rounded-2xl border border-[#c9a86a]/30 bg-[#0c0d16]/95 p-8 text-center shadow-[0_0_80px_rgba(201,168,106,0.15)]">
        <div className="mb-2 flex items-center justify-center gap-2 text-[#c9a86a]">
          <Dices className={`h-5 w-5 ${!result ? "animate-spin" : ""}`} />
          <span className="font-display tracking-[0.4em]">命运判定</span>
        </div>
        <p className="mb-6 text-sm text-white/60">
          {check.label} · {result ? result.attrLabel : "……"}检定（难度 {check.dc}）
        </p>

        <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center">
          <div
            className={`flex h-24 w-24 items-center justify-center rounded-xl border-2 transition-all duration-500 ${
              result
                ? result.success
                  ? "border-[#c9a86a] bg-[#c9a86a]/10 shadow-[0_0_40px_rgba(201,168,106,0.4)]"
                  : "border-red-500/70 bg-red-500/10 shadow-[0_0_40px_rgba(239,68,68,0.35)]"
                : "border-white/20 bg-white/5"
            }`}
          >
            <span className={`font-display text-5xl tabular-nums ${result ? (result.success ? "text-[#e7d9b8]" : "text-red-300") : "text-white/80"}`}>
              {result ? result.roll : face}
            </span>
          </div>
        </div>

        {result ? (
          <div className="animate-[fadeUp_0.5s_ease]">
            <p className="mb-1 text-sm text-white/60">
              d20=<span className="text-white">{result.roll}</span> + {result.attrLabel}补正
              <span className="text-white">{result.bonus}</span> ={" "}
              <span className={`font-bold ${result.success ? "text-[#e7d9b8]" : "text-red-300"}`}>{result.total}</span> / {result.dc}
            </p>
            <p
              className={`font-display mb-6 text-3xl tracking-[0.5em] ${
                result.success ? "text-[#c9a86a]" : "text-red-400"
              }`}
            >
              {result.success ? "成 功" : "失 败"}
            </p>
            <button
              ref={continueBtnRef}
              onClick={() => onDone(result)}
              className="w-full rounded-lg border border-[#c9a86a]/50 bg-[#c9a86a]/10 py-2.5 text-sm tracking-[0.3em] text-[#e7d9b8] transition hover:bg-[#c9a86a]/25"
            >
              继续
            </button>
            <p className="sr-only" role="status" aria-live="assertive">
              {result.success
                ? `${check.label}判定成功，掷出 ${result.roll}，加补正 ${result.bonus}，合计 ${result.total}，超过难度 ${result.dc}。按回车继续。`
                : `${check.label}判定失败，掷出 ${result.roll}，加补正 ${result.bonus}，合计 ${result.total}，未达难度 ${result.dc}。按回车继续。`}
            </p>
          </div>
        ) : (
          <p className="animate-pulse text-xs tracking-[0.4em] text-white/40">骰面旋转，命运未定……</p>
        )}
      </div>
    </div>
  );
}
