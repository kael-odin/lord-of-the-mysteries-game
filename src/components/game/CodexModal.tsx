"use client";

import { useEffect, useState } from "react";
import { X, BookOpen, Scroll, Lock, FolderOpen } from "lucide-react";
import { PATHWAYS, PATHWAY_ORDER } from "@/lib/game/data";
import { ENDINGS, ALL_ENDING_IDS, CHAPTER_TITLES } from "@/lib/game/story";
import { getUnlockedEndings, getSeenPathways } from "@/lib/game/persistence/localSaveStore";
import { Emblem } from "@/components/game/Emblem";
import type { PathwayKey } from "@/lib/game/emblems";
import type { GameState } from "@/lib/game/types";

const TONE_COLOR: Record<string, string> = {
  gold: "text-[#c9a86a] border-[#c9a86a]/40",
  red: "text-red-300 border-red-400/40",
  gray: "text-white/50 border-white/20",
  green: "text-emerald-300 border-emerald-400/40",
  purple: "text-purple-300 border-purple-400/40",
};
const TONE_GLOW: Record<string, string> = {
  gold: "shadow-[0_8px_30px_-12px_rgba(201,168,106,0.45)] bg-[#c9a86a]/[0.04]",
  red: "shadow-[0_8px_30px_-12px_rgba(248,113,113,0.35)] bg-red-500/[0.04]",
  gray: "shadow-none bg-white/[0.02]",
  green: "shadow-[0_8px_30px_-12px_rgba(110,231,183,0.3)] bg-emerald-500/[0.04]",
  purple: "shadow-[0_8px_30px_-12px_rgba(216,180,254,0.3)] bg-purple-500/[0.04]",
};

// 结局按章节归档，便于在「灰雾长桌」上分组陈列。
const ENDING_GROUPS: { label: string; ids: string[] }[] = [
  { label: "第一章 · 安提哥努斯之影", ids: ["fool", "knowledge"] },
  { label: "失控与长眠", ids: ["shikong", "death", "civilian"] },
  { label: "第四章 · 钟楼回声", ids: ["bellkeeper"] },
  { label: "第五章 · 绯红假面舞会", ids: ["fool2", "usurper", "survivor", "anchor", "hunter_legend", "martyr", "nightwatcher"] },
];

type Tab = "endings" | "pathways" | "dossier" | "guide";

export default function CodexModal({ onClose, gs }: { onClose: () => void; gs: GameState | null }) {
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
            ["dossier", "廷根卷宗"],
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
            <div className="space-y-6">
              <div className="border-b border-white/8 pb-3">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-sm tracking-[0.25em] text-[#e7d9b8]">灰雾长桌</h3>
                  <span className="text-[11px] text-[#c9a86a]/80">{unlocked.length} / {ALL_ENDING_IDS.length} 椅已落座</span>
                </div>
                <p className="mt-1.5 text-[11px] leading-relaxed text-white/40">
                  长桌尽头，第二十三张椅子一直空着——祂为每一段走完的旅程留了位置。未达成的结局，椅背隐入雾中，只余轮廓。
                </p>
              </div>
              {ENDING_GROUPS.map((group) => {
                const seenInGroup = group.ids.filter((id) => unlocked.includes(id)).length;
                return (
                  <section key={group.label} className="space-y-2">
                    <div className="flex items-center gap-2 px-0.5">
                      <span className="font-display text-[11px] tracking-[0.2em] text-[#c9a86a]/70">{group.label}</span>
                      <span className="h-px flex-1 bg-gradient-to-r from-[#c9a86a]/20 to-transparent" />
                      <span className="text-[10px] text-white/30">{seenInGroup}/{group.ids.length}</span>
                    </div>
                    <div className="grid gap-2">
                      {group.ids.map((id) => {
                        const e = ENDINGS[id];
                        const isSeen = unlocked.includes(id);
                        return (
                          <div
                            key={id}
                            className={`relative overflow-hidden rounded-lg border p-3 transition ${
                              isSeen
                                ? `${TONE_COLOR[e.tone]} ${TONE_GLOW[e.tone]}`
                                : "border-white/8 bg-white/[0.015] text-white/25"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {/* 椅背图标：已揭示则染色，未揭示则雾中 */}
                              <span
                                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center font-display text-[13px] ${
                                  isSeen ? "opacity-90" : "opacity-30"
                                }`}
                                aria-hidden
                              >
                                {isSeen ? "☾" : "·"}
                              </span>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  {isSeen ? (
                                    <Scroll className="h-3.5 w-3.5 shrink-0" />
                                  ) : (
                                    <Lock className="h-3.5 w-3.5 shrink-0" />
                                  )}
                                  <span className="text-sm font-medium tracking-wide">
                                    {isSeen ? e.title : "封缄之雾"}
                                  </span>
                                </div>
                                {isSeen && e.hint ? (
                                  <p className="mt-1.5 text-[11px] leading-relaxed text-white/55">{e.hint}</p>
                                ) : (
                                  <p className="mt-1.5 text-[11px] italic leading-relaxed text-white/20">
                                    椅背没入雾中，尚不可辨。
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
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

          {tab === "dossier" && (
            <DossierTab gs={gs} />
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

// ============ 廷根卷宗：实时读取当前存档的 flags，把玩家的积累可视化 ============

// 卷宗条目：flag → 标题/描述。已点亮的条目会染金，未点亮的留雾。
type DossierEntry = { flag: string; title: string; desc: string };
type DossierSection = { label: string; entries: DossierEntry[] };

const DOSSIER: DossierSection[] = [
  {
    label: "已结之案",
    entries: [
      { flag: "c2_narcissus_solved", title: "水仙花街窃影案", desc: "那面凭空消失的穿衣镜，连同镜里的东西，被你从「映」里拽了回来。" },
      { flag: "sewer_solved", title: "灰河守墓人", desc: "下水道蓄水池里那具被钟声串起的聚合亡者，被你斩断了钟铃之线。" },
      { flag: "puppet_down", title: "钟楼发条秘偶", desc: "钟楼二层那具被遗弃的人偶仪式残骸，停在了它回忆自己的那一刻。" },
      { flag: "plate_down", title: "旧铺的活铠", desc: "附在仪仗铠甲里的百年戾气散了，留下一枚旧骑士的徽记与一句未竟之诫。" },
      { flag: "wraith_down", title: "铁十字街怨魂", desc: "凶宅里那脖子歪折的怨魂，被你值夜者的封缄送去了该去的地方。" },
      { flag: "husk_down", title: "守墓人之铃", desc: "灰河尽头的铜铃不再为旧钟清点亡魂——你替它们按下了休止符。" },
      { flag: "courier_down", title: "雾纹断线", desc: "码头区验关亭里那只密修会遣来的暗哨，被你拔了——连同他掌心那张半封的密信。" },
      { flag: "drifter_down", title: "雾散·归人", desc: "贝克兰德雾深处那团偷人「最近几天」的失控残骸，被你斩断了书脊般的裂缝。三位被挖走记忆的归人，醒了过来。" },
    ],
  },
  {
    label: "同僚之谊",
    entries: [
      { flag: "rapport_leonard", title: "伦纳德·米切尔", desc: "窗边的诗人赠你一首押错韵的十四行诗，并提醒你：神秘学家最忌多看一眼。" },
      { flag: "rapport_frye", title: "弗莱", desc: "沉默的收尾人教给你一条规矩：别让死者睁着眼。眼睛关上了，才算真的结束。" },
      { flag: "rapport_neil", title: "老尼尔", desc: "队里的活化石在红茶杯底压了一枚铜便士，又絮叨了一遍：他的报销单，一个字都别签。" },
    ],
  },
  {
    label: "街头线索",
    entries: [
      { flag: "patrol_clue", title: "巡逻见闻", desc: "你在夜间巡逻与街头奇遇中，记下了不止一条值得立案的线索。" },
      { flag: "lamp_decoded", title: "会说话的灯", desc: "铁十字街口那盏路灯的明灭，被你破译成一句从地下传来的求救。" },
      { flag: "notebook_clue", title: "安提哥努斯笔记", desc: "那本让韦尔奇丧命的笔记，你已隐约触到它「不该被读」的边缘。" },
    ],
  },
  {
    label: "寻常一夜",
    entries: [
      { flag: "duty_done", title: "值夜同僚", desc: "你在某个雾夜主动留队，与同僚共度了一夜平安归来的巡夜。" },
      { flag: "took_duty", title: "主动请值", desc: "你向邓恩开口，说今晚留在队里——值夜者不全是案子，也有这样的夜。" },
    ],
  },
];

function DossierTab({ gs }: { gs: GameState | null }) {
  if (!gs) {
    return (
      <div className="py-10 text-center text-[12px] leading-relaxed text-white/35">
        <FolderOpen className="mx-auto mb-3 h-6 w-6 opacity-40" />
        卷宗空空如也。<br />开始一段新的轮回，你的积累将自动归档于此。
      </div>
    );
  }
  const flags = gs.flags || {};
  const allEntries = DOSSIER.flatMap((s) => s.entries);
  const litCount = allEntries.filter((e) => flags[e.flag]).length;

  return (
    <div className="space-y-6">
      <div className="border-b border-white/8 pb-3">
        <div className="flex items-baseline justify-between">
          <h3 className="font-display text-sm tracking-[0.25em] text-[#e7d9b8]">廷根卷宗</h3>
          <span className="text-[11px] text-[#c9a86a]/80">{litCount} / {allEntries.length} 条已归档</span>
        </div>
        <p className="mt-1.5 text-[11px] leading-relaxed text-white/40">
          邓恩桌角的牛皮纸夹。你在廷根走过的每一步、结的每一桩、识的每一个人，都被悄悄记在这本卷宗里——只对你自己可见。
        </p>
      </div>

      {/* 在办状态：当前途径/序列/回合数 */}
      <div className="rounded-lg border border-[#c9a86a]/20 bg-[#c9a86a]/[0.03] p-3">
        <div className="flex items-center gap-2">
          <span style={{ ["--ember-color" as string]: "#c9a86a" } as React.CSSProperties} className="inline-block">
            <Emblem k={gs.pathway as PathwayKey} size={18} />
          </span>
          <span className="font-display text-sm tracking-[0.15em] text-[#e7d9b8]">
            {gs.pathway ? `${PATHWAYS[gs.pathway]?.name} · 序列${gs.seq}` : "凡人"}
          </span>
          <span className="ml-auto text-[10px] text-white/35">在办 · 第 {gs.chapter} 章 · 第 {gs.rounds} 步</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-white/45">
          <span>生命 {gs.hp}/{gs.maxHp}</span>
          <span>灵性 {gs.sp}/{gs.maxSp}</span>
          <span>理智 {gs.sanity}/{gs.maxSanity}</span>
          <span>消化 {gs.digestion}%</span>
          <span>金镑 {gs.pounds}</span>
          <span>体魄 {gs.attrs.physique} · 灵感 {gs.attrs.inspiration} · 意志 {gs.attrs.will}</span>
        </div>
      </div>

      {DOSSIER.map((section) => {
        const litInGroup = section.entries.filter((e) => flags[e.flag]).length;
        return (
          <section key={section.label} className="space-y-2">
            <div className="flex items-center gap-2 px-0.5">
              <span className="font-display text-[11px] tracking-[0.2em] text-[#c9a86a]/70">{section.label}</span>
              <span className="h-px flex-1 bg-gradient-to-r from-[#c9a86a]/20 to-transparent" />
              <span className="text-[10px] text-white/30">{litInGroup}/{section.entries.length}</span>
            </div>
            <div className="grid gap-2">
              {section.entries.map((e) => {
                const lit = !!flags[e.flag];
                return (
                  <div
                    key={e.flag}
                    className={`relative overflow-hidden rounded-lg border p-3 transition ${
                      lit
                        ? "border-[#c9a86a]/40 bg-[#c9a86a]/[0.04] shadow-[0_8px_30px_-12px_rgba(201,168,106,0.35)]"
                        : "border-white/8 bg-white/[0.015] text-white/25"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center font-display text-[13px] ${lit ? "opacity-90 text-[#c9a86a]" : "opacity-30"}`} aria-hidden>
                        {lit ? "✓" : "·"}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          {lit ? <Scroll className="h-3.5 w-3.5 shrink-0 text-[#c9a86a]/70" /> : <Lock className="h-3.5 w-3.5 shrink-0" />}
                          <span className="text-sm font-medium tracking-wide">{lit ? e.title : "尚未归档"}</span>
                        </div>
                        {lit ? (
                          <p className="mt-1.5 text-[11px] leading-relaxed text-white/55">{e.desc}</p>
                        ) : (
                          <p className="mt-1.5 text-[11px] italic leading-relaxed text-white/20">这条目还空着，等一段经历来填满它。</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
