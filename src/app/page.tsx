"use client";

import { useEffect, useState } from "react";
import {
  Moon, Eye, FlaskConical, Brain, Scroll, ChevronDown, Sparkles, Route, Skull,
  BookOpen, Crosshair, Ghost, Coffee,
} from "lucide-react";
import { PATHWAYS } from "@/lib/game/data";
import { ENDINGS, CHAPTER_TITLES, ALL_ENDING_IDS } from "@/lib/game/story";
import { sceneArt } from "@/lib/game/art";

interface EchoRow {
  name: string;
  pathway: string | null;
  seq: number | null;
  ending: string | null;
  chapter: number | null;
  updatedAt: string;
}

const FEATURES = [
  {
    icon: Route,
    title: "二十二途径 · 六选一",
    desc: "占卜家、不眠者、收尸人、窥秘人、猎人、读运者——饮下序列9魔药，沿着愚者、黑暗、永眠者、隐者、红祭司、门途径攀升，直至晋升序列8。",
  },
  {
    icon: FlaskConical,
    title: "扮演法 · 魔药消化",
    desc: "魔药的名称是钥匙。像序列之名描述的那样行事，魔药才会被消化——这是罗塞尔大帝日记里藏着的、不被力量反噬的唯一方法。",
  },
  {
    icon: Brain,
    title: "理智 · 失控边缘",
    desc: "直视超凡要付出代价。理智被知识、怨魂与禁忌蚕食殆尽时，你将不再是猎手，而是值夜者枪口下的「失控者」。",
  },
  {
    icon: Scroll,
    title: "廷根 · 五章冒险",
    desc: "从水仙花街的死而复生开始，加入值夜者，调查安提哥努斯笔记——直面密修会、钟楼回声、绯红假面舞会，直到灰雾之上的第二次邀约。",
  },
];

const PW_ICONS: Record<string, typeof Eye> = {
  seer: Eye, sleepless: Moon, collector: Skull, pryer: BookOpen, hunter: Crosshair,
};
const ENDING_ICONS: Record<string, typeof Ghost> = {
  fool: Sparkles, knowledge: BookOpen, shikong: Ghost, death: Skull, civilian: Coffee,
};

export default function LandingPage() {
  const [echoes, setEchoes] = useState<EchoRow[]>([]);
  const [canContinue, setCanContinue] = useState(false);

  useEffect(() => {
    setCanContinue(!!localStorage.getItem("lotm_player_id"));
    fetch("/api/game/recent")
      .then((r) => r.json())
      .then((d) => setEchoes(d.recent || []))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#05060a] text-[#d8d3c8]">
      {/* ================= HERO ================= */}
      <section className="relative flex min-h-screen flex-col overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: sceneArt("city") }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#05060a]/60 via-[#05060a]/40 to-[#05060a]" />
        <div className="fog-layer" />
        <div className="fog-layer fog-layer-slow" />

        <nav className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-2">
            <Moon className="h-5 w-5 text-[#c9a86a]" />
            <span className="font-display text-lg tracking-[0.4em] text-[#e7d9b8]">诡秘之主</span>
          </div>
          <span className="hidden text-[10px] tracking-[0.3em] text-white/35 md:block">
            灰雾之上 · 非凡之路 · 粉丝同人互动小说
          </span>
        </nav>

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 text-center">
          <p className="mb-5 text-[11px] tracking-[0.7em] text-[#c9a86a]/80" style={{ animation: "fadeUp 1s ease both" }}>
            LORD OF MYSTERIES · 在线文字冒险
          </p>
          <h1
            className="font-display text-7xl leading-none tracking-[0.15em] text-[#eee5cf] drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)] md:text-9xl"
            style={{ animation: "fadeUp 1s ease both", animationDelay: "0.15s" }}
          >
            诡秘之主
          </h1>
          <p
            className="mt-6 max-w-xl text-sm leading-relaxed text-white/60 md:text-base"
            style={{ animation: "fadeUp 1s ease both", animationDelay: "0.3s" }}
          >
            穿越雾与灰的边界，在蒸汽与煤气灯的时代死而复生。
            <br />
            饮下魔药，扮演命运——直到你在灰雾之上，听见那个声音。
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4" style={{ animation: "fadeUp 1s ease both", animationDelay: "0.45s" }}>
            <a
              href="/game"
              className="group relative rounded-full border border-[#c9a86a]/70 bg-[#c9a86a]/15 px-10 py-4 text-sm tracking-[0.5em] text-[#e7d9b8] transition-all duration-300 hover:bg-[#c9a86a]/30 hover:shadow-[0_0_50px_rgba(201,168,106,0.35)]"
            >
              苏 醒
              <span className="absolute inset-0 -z-10 rounded-full bg-[#c9a86a]/10 blur-xl transition group-hover:bg-[#c9a86a]/25" />
            </a>
            {canContinue && (
              <a
                href="/game"
                className="rounded-full border border-white/25 px-10 py-4 text-sm tracking-[0.4em] text-white/70 transition hover:border-white/50 hover:text-white"
              >
                继续轮回
              </a>
            )}
          </div>

          <p className="mt-6 text-[10px] tracking-[0.2em] text-white/30" style={{ animation: "fadeUp 1s ease both", animationDelay: "0.6s" }}>
            本地存档 · 五大章节 · {ALL_ENDING_IDS.length} 种结局 · 六条途径攀升至序列8
          </p>
        </div>

        <div className="relative z-10 flex justify-center pb-8">
          <ChevronDown className="h-5 w-5 animate-bounce text-white/40" />
        </div>
      </section>

      {/* ================= 特性 ================= */}
      <section className="relative mx-auto max-w-6xl px-6 py-24">
        <div className="mb-14 text-center">
          <p className="mb-3 text-[10px] tracking-[0.5em] text-[#c9a86a]/70">THE RULES OF THE BEYOND</p>
          <h2 className="font-display text-4xl tracking-[0.3em] text-[#e7d9b8]">非凡世界的法则</h2>
          <div className="mx-auto mt-5 h-px w-32 bg-gradient-to-r from-transparent via-[#c9a86a]/60 to-transparent" />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0c14]/70 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-[#c9a86a]/40"
            >
              <div
                className="absolute inset-0 bg-cover bg-center opacity-0 transition-opacity duration-700 group-hover:opacity-15"
                style={{ backgroundImage: sceneArt("ritual") }}
              />
              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#c9a86a]/30 bg-[#c9a86a]/10">
                  <f.icon className="h-5 w-5 text-[#c9a86a]" />
                </div>
                <h3 className="font-display mb-2 text-xl tracking-[0.2em] text-[#e7d9b8]">{f.title}</h3>
                <p className="text-[13px] leading-relaxed text-white/55">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 灰雾回响 ================= */}
      <section className="relative border-t border-white/5 py-24">
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: sceneArt("fog") }}
        />
        <div className="relative mx-auto max-w-4xl px-6">
          <div className="mb-12 text-center">
            <p className="mb-3 text-[10px] tracking-[0.5em] text-[#c9a86a]/70">ECHOES ABOVE THE GRAY FOG</p>
            <h2 className="font-display text-4xl tracking-[0.3em] text-[#e7d9b8]">灰雾回响</h2>
            <p className="mt-4 text-xs text-white/40">最近苏醒的旅人们，他们的轮回已被灰雾铭记</p>
          </div>

          {echoes.length === 0 ? (
            <p className="rounded-2xl border border-white/10 bg-[#0b0c14]/60 py-14 text-center text-sm text-white/35">
              灰雾之上尚无回响——成为第一个苏醒的旅人。
            </p>
          ) : (
            <div className="space-y-2.5">
              {echoes.map((e, i) => {
                const pw = e.pathway ? PATHWAYS[e.pathway] : null;
                const PwIcon = pw ? PW_ICONS[e.pathway!] || Eye : Moon;
                const EndIcon = e.ending ? ENDING_ICONS[e.ending] || Ghost : null;
                const endMeta = e.ending ? ENDINGS[e.ending] : null;
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-3 rounded-xl border border-white/8 bg-[#0b0c14]/70 px-5 py-3.5 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5">
                        <PwIcon className="h-4 w-4 text-[#c9a86a]" />
                      </div>
                      <div>
                        <p className="text-sm text-[#e9e0c9]">{e.name}</p>
                        <p className="text-[10px] text-white/35">
                          {pw ? `${pw.road} · 序列${e.seq}${e.seq === 8 ? `（${pw.seq8}）` : `（${pw.name}）`}` : "凡人一段"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {endMeta && EndIcon ? (
                        <p className="flex items-center justify-end gap-1.5 text-xs text-[#c9a86a]">
                          <EndIcon className="h-3.5 w-3.5" /> 结局 · {endMeta.title}
                        </p>
                      ) : (
                        <p className="text-xs text-white/40">{CHAPTER_TITLES[e.chapter || 1]}</p>
                      )}
                      <p className="mt-0.5 text-[10px] text-white/25">
                        {new Date(e.updatedAt).toLocaleString("zh-CN", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-12 text-center">
            <a
              href="/game"
              className="inline-block rounded-full border border-[#c9a86a]/60 bg-[#c9a86a]/10 px-10 py-3.5 text-sm tracking-[0.4em] text-[#e7d9b8] transition hover:bg-[#c9a86a]/25"
            >
              让灰雾记住你的名字
            </a>
          </div>
        </div>
      </section>

      {/* ================= 页脚 ================= */}
      <footer className="border-t border-white/5 py-10">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="text-xs text-white/30">
            《诡秘之主》同人互动游戏 · 非官方粉丝作品 · 原作：爱潜水的乌贼
          </p>
          <p className="mt-2 text-[10px] text-white/20">
            「我们拯救不了所有人，但我们至少可以拯救廷根。」—— 愿每一位旅人都能守住自己的锚
          </p>
        </div>
      </footer>
    </div>
  );
}
