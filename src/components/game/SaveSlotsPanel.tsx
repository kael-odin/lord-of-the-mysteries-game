"use client";

import { useEffect, useState } from "react";
import { Moon, Save, Trash2, Play, Plus, X } from "lucide-react";
import type { SaveHeader } from "@/lib/game/persistence/localSaveStore";
import { PATHWAYS } from "@/lib/game/data";
import { ENDINGS, CHAPTER_TITLES } from "@/lib/game/story";

const SLOT_LABELS: Record<string, string> = {
  auto: "自动",
  "slot-1": "存档 一",
  "slot-2": "存档 二",
  "slot-3": "存档 三",
};

const PW_COLORS: Record<string, string> = {
  seer: "text-indigo-300",
  sleepless: "text-sky-300",
  collector: "text-emerald-300",
  pryer: "text-purple-300",
  hunter: "text-rose-300",
};

export default function SaveSlotsPanel({
  slots,
  nameInput,
  setNameInput,
  maxSlots,
  currentSlotId,
  embedded,
  onRefresh,
  onNewInSlot,
  onLoad,
  onDelete,
  onQuickStart,
  onClose,
}: {
  slots: SaveHeader[];
  nameInput: string;
  setNameInput: (s: string) => void;
  maxSlots: number;
  currentSlotId?: string;
  embedded?: boolean;
  onRefresh: () => Promise<SaveHeader[]>;
  onNewInSlot: (id: string, name: string) => void | Promise<void>;
  onLoad: (id: string) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
  onQuickStart?: () => void | Promise<void>;
  onClose?: () => void;
}) {
  const [creating, setCreating] = useState<string | null>(null);
  const [localName, setLocalName] = useState(nameInput);

  useEffect(() => setLocalName(nameInput), [nameInput]);

  const slotIds = ["auto", ...Array.from({ length: maxSlots }, (_, i) => `slot-${i + 1}`)];
  const byId = new Map(slots.map((s) => [s.id, s]));

  const auto = byId.get("auto");
  const canQuickStart = !!onQuickStart && !auto;

  const card = (id: string) => {
    const h = byId.get(id);
    const isCurrent = currentSlotId === id;
    const pw = h?.pathway ? PATHWAYS[h.pathway] : null;
    const endMeta = h?.ending ? ENDINGS[h.ending] : null;
    return (
      <div
        key={id}
        className={`relative rounded-xl border p-4 ${
          isCurrent
            ? "border-[#c9a86a]/60 bg-[#13141f]/90"
            : "border-white/10 bg-[#0b0c14]/80"
        }`}
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="flex items-center gap-2 text-[11px] tracking-[0.3em] text-[#c9a86a]">
            <Save className="h-3 w-3" /> {SLOT_LABELS[id] || id}
            {isCurrent && <span className="rounded-full bg-[#c9a86a]/20 px-2 py-0.5 text-[9px] text-[#e7d9b8]">当前</span>}
          </span>
          {h && (
            <span className="text-[10px] text-white/35">
              {new Date(h.updatedAt).toLocaleString("zh-CN", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </div>

        {h ? (
          <>
            <div className="mb-1 flex items-center gap-2">
              <span className="text-sm text-[#e9e0c9]">{h.name}</span>
              {pw && (
                <span className={`text-[11px] ${PW_COLORS[h.pathway!]}`}>
                  {pw.road} · 序列{h.seq}
                </span>
              )}
            </div>
            <p className="text-[11px] text-white/45">
              {endMeta ? `结局：${endMeta.title}` : CHAPTER_TITLES[h.chapter] || `第 ${h.rounds} 步`}
            </p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => onLoad(id)}
                className="flex items-center gap-1.5 rounded-lg border border-[#c9a86a]/40 bg-[#c9a86a]/10 px-3 py-1.5 text-[11px] text-[#e7d9b8] transition hover:bg-[#c9a86a]/25"
              >
                <Play className="h-3 w-3" /> {endMeta ? "重温结局" : "继续"}
              </button>
              <button
                onClick={() => onDelete(id)}
                className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-[11px] text-white/50 transition hover:border-red-400/40 hover:text-red-300"
                title="删除存档"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </>
        ) : id === "auto" ? (
          <p className="py-3 text-[11px] text-white/30">灰雾尚未铭记你的轮回。</p>
        ) : (
          <div className="py-1">
            {creating === id ? (
              <div className="flex gap-2">
                <input
                  value={localName}
                  onChange={(e) => {
                    setLocalName(e.target.value);
                    setNameInput(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onNewInSlot(id, localName.trim() || "无名者");
                      setCreating(null);
                    }
                  }}
                  maxLength={12}
                  placeholder="你的名字"
                  className="w-full rounded border border-white/15 bg-black/40 px-2 py-1.5 text-xs text-[#e7d9b8] outline-none focus:border-[#c9a86a]/60"
                  autoFocus
                />
                <button
                  onClick={() => {
                    onNewInSlot(id, localName.trim() || "无名者");
                    setCreating(null);
                  }}
                  className="rounded border border-[#c9a86a]/40 bg-[#c9a86a]/15 px-3 py-1.5 text-[11px] text-[#e7d9b8]"
                >
                  开始
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCreating(id)}
                className="flex items-center gap-1.5 rounded-lg border border-dashed border-white/20 px-3 py-2 text-[11px] text-white/45 transition hover:border-[#c9a86a]/50 hover:text-[#e7d9b8]"
              >
                <Plus className="h-3 w-3" /> 开启新的轮回
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  const body = (
    <div className={embedded ? "" : "min-h-screen"}>
      <div className="mx-auto max-w-3xl px-5 py-12">
        <div className="mb-8 text-center">
          <p className="mb-2 flex items-center justify-center gap-2 text-[10px] tracking-[0.5em] text-[#c9a86a]/70">
            <Moon className="h-3 w-3" /> REGISTRY OF THE FOG
          </p>
          <h1 className="font-display text-4xl tracking-[0.3em] text-[#e7d9b8]">灰雾存档</h1>
          <p className="mt-3 text-xs text-white/40">你的每一次轮回，都被本地留存于灰雾之中。</p>
        </div>

        <div className="mb-6 space-y-3">
          {slotIds.map((id) => card(id))}
        </div>

        {canQuickStart && (
          <div className="text-center">
            <button
              onClick={onQuickStart}
              className="rounded-full border border-[#c9a86a]/60 bg-[#c9a86a]/10 px-8 py-3 text-sm tracking-[0.4em] text-[#e7d9b8] transition hover:bg-[#c9a86a]/25"
            >
              苏 醒（自动存档）
            </button>
          </div>
        )}

        <div className="mt-10 text-center">
          <a href="/" className="text-[11px] text-white/30 transition hover:text-white/60">
            返回灰雾之门
          </a>
        </div>
      </div>
    </div>
  );

  if (embedded) {
    return (
      <div className="fixed inset-0 z-[80] overflow-y-auto bg-[#05060a]/95 backdrop-blur-sm">
        <div className="sticky top-0 flex justify-end px-5 pt-4">
          <button onClick={onClose} className="rounded-full border border-white/15 bg-[#0a0b12]/80 p-2 text-white/60 transition hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
        {body}
      </div>
    );
  }
  return <div className="bg-[#05060a] text-[#d8d3c8]">{body}</div>;
}
