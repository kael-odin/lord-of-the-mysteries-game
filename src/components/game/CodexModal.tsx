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
  { label: "第七章 · 大雾霾", ids: ["fogbreaker"] },
  { label: "第八章 · 灰雾之上·塔罗会", ids: ["chair_seated"] },
  { label: "第九章 · 海上之城", ids: ["tidebreaker"] },
  { label: "第十章 · 北陆·霜砚镇", ids: ["namekeeper"] },
  { label: "第十一章 · 南港归潮", ids: ["waykeeper"] },
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
      { flag: "puppet_down", title: "钟楼发条秘偶", desc: "钟楼二层那具被遗弃的人偶仪式残骸，停在了它回忆自己的那一刻。" },
      { flag: "sewer_solved", title: "灰河守墓人", desc: "下水道蓄水池里那具被钟声串起的聚合亡者，被你斩断了钟铃之线。" },
      { flag: "hound_down", title: "月影犬·断齿", desc: "钟楼台阶上那只被仪式扭曲的、脸上只有一张人齿嘴的看门兽，被你断了齿。" },
      { flag: "boss_down", title: "安提哥努斯·残影散", desc: "笔记上方那无数张重叠的、安提哥努斯家族百年亡灵的缝合残影，被你从「不该被读」的边缘，逼散了。" },
      { flag: "plate_down", title: "旧铺的活铠", desc: "附在仪仗铠甲里的百年戾气散了，留下一枚旧骑士的徽记与一句未竟之诫。" },
      { flag: "wraith_down", title: "铁十字街怨魂", desc: "凶宅里那脖子歪折的怨魂，被你值夜者的封缄送去了该去的地方。" },
      { flag: "husk_down", title: "守墓人之铃", desc: "灰河尽头的铜铃不再为旧钟清点亡魂——你替它们按下了休止符。" },
      { flag: "courier_down", title: "雾纹断线", desc: "码头区验关亭里那只密修会遣来的暗哨，被你拔了——连同他掌心那张半封的密信。" },
      { flag: "beast_down", title: "绯红之兽·面具碎", desc: "舞池正中那尊由无数宾客假面拼成的、鹿角狮口蝶翼的活体仪式，被你碎了面具。" },
      { flag: "master_down", title: "雾衣大师·线断", desc: "从假面兽余烬里滑出的、序列6的秘偶操纵者，那根提你影子的无形之线，被你断了。" },
      { flag: "drifter_down", title: "雾散·归人", desc: "贝克兰德雾深处那团偷人「最近几天」的失控残骸，被你斩断了书脊般的裂缝。三位被挖走记忆的归人，醒了过来。" },
      { flag: "chorister_down", title: "失序司仪·棒断", desc: "城东煤气储塔顶上那位戴破碎歌剧面具的司仪，被你逼停了合颂。他手里那根由十几段「最近」缠成的指挥棒，断了。" },
      { flag: "aspect_down", title: "三日大雾·根清", desc: "储塔碗底那团由太多被偷走的「惦记」长出了自己的聚合体，被你斩断了六十年的根。三日大雾，散了。" },
      { flag: "smuggler_down", title: "借雾倒货·根拔", desc: "码头区后巷那伙趁大雾倒腾灰土王国非凡货的混混，被你绑在了栈房柱子上。雾一散，自有巡警来收。" },
      { flag: "machinist_down", title: "机械信徒·义肢断", desc: "东区纺织厂那位半边身子是黄铜的玫瑰学派信徒，被你按倒。他那只嵌着别人灵性之心的黄铜义肢，断了。" },
      { flag: "clockwork_down", title: "发条心·停转", desc: "纺织厂地下那颗靠偷凡俗工人「累」「想家」喂成的、会自我运转的黄铜之心，被你停了转。几位没醒来的工人，醒了。" },
      { flag: "latenight_down", title: "门房·结案", desc: "纺织厂停工那夜被勒死的夜班门房，那条黄铜灭口线，被你替值夜者贝克兰德分部，摸到了。" },
      { flag: "alchemy_inner_down", title: "霍恩·手按住", desc: "心理炼金会私吞封存非凡物的二级会员霍恩，那只伸进封存柜的手，被你按在了柜门上。" },
      { flag: "reef_down", title: "海渊礁卫·珊瑚碎", desc: "风暴之海那夜攀上蓝鳕鱼号船舷的、海渊教会从沉船尸骸拼出的礁卫，被你碎了珊瑚。" },
      { flag: "abyss_down", title: "海渊合颂体·念归", desc: "海上之城下沉城废墟底那团由太多「还惦记着岸上的人」长成的海中之物，被你停了转。城东那排熄了半月的煤气灯，重新亮了。" },
      { flag: "lighthouse_down", title: "赫斯特之锚·补", desc: "城北废灯塔塔底，赫斯特三十年前钉下的那道「锚」，被你用塔罗会铜币的温热，补了一层。海上之城，认你了。" },
      { flag: "culler_down", title: "凛冬·偷名者·霜镜碎", desc: "北陆驿道第七座驿亭外，凛冬学派遣来收名的暗哨，那面磨平的镜脸，被你碎成了几瓣。每一瓣里，都映着一个被偷走的、不属于自己的名。" },
      { flag: "nameless_down", title: "无名聚合体·名归", desc: "霜砚镇下旧驿道遗址腔室里，那团由太多「没人再惦记的名字」长成、终于咬合成一个会自我沉浮的无名之物，被你停了转。镇民熄了半月的「叫什么」，重新被喊了回来。" },
      { flag: "inkmill_down", title: "赫斯特森·名锚·补", desc: "镇东废磨坊底，赫斯特·赫斯特森四十年前用自己「姓」钉下的那道「名之锚」，被你用铜币的温热，补了一层。霜砚镇，认你了。" },
      { flag: "warden_down", title: "漫游·偷向者·罗盘碎", desc: "南港栈桥尽头海雾里，漫游学派遣来收向的暗哨，那面磨平的罗盘脸，被你碎成了几瓣。每一瓣里，都映着一个被偷走的、不属于自己的「去向」。" },
      { flag: "drifter_down", title: "漫游聚合体·向归", desc: "南港沉船巷下旧航道遗址腔室里，那团由太多「没人再去过的地方」长成、终于咬合成一个会自我漂移的漫游之物，被你停了转。南港人停了半月的「要去哪儿」，重新被拨了回来。" },
      { flag: "pilot_down", title: "芮恩森·向锚·补", desc: "巷尾废领航塔底，芮恩·芮恩森五十年前用自己「去向」钉下的那道「向之锚」，被你用铜币的温热，补了一层。沉船巷，认你了。" },
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
    label: "灰雾之赐",
    entries: [
      { flag: "tarot_fool", title: "「愚者」之赐", desc: "你在灰雾之上选了「愚者」——一切的起点与终点。祂记下了你的名字，也添了你一缕幸运。" },
      { flag: "tarot_wheel", title: "「命运之轮」之赐", desc: "你在灰雾之上选了「命运之轮」——无常的轮转。你的心智，被拓宽了一道缝。" },
      { flag: "tarot_strength", title: "「力量」之赐", desc: "你在灰雾之上选了「力量」——驯服野兽之人。你的血脉，被锤实了一分。" },
    ],
  },
  {
    label: "街头线索",
    entries: [
      { flag: "patrol_clue", title: "巡逻见闻", desc: "你在夜间巡逻与街头奇遇中，记下了不止一条值得立案的线索。" },
      { flag: "lamp_decoded", title: "会说话的灯", desc: "铁十字街口那盏路灯的明灭，被你破译成一句从地下传来的求救。" },
      { flag: "notebook_clue", title: "安提哥努斯笔记", desc: "那本让韦尔奇丧命的笔记，你已隐约触到它「不该被读」的边缘。" },
      { flag: "dream_fog", title: "灰雾之梦", desc: "你记得自己死而复生那夜，梦里那片比贝克兰德任何雾都更古老的灰雾——与日后灰雾之上那张椅子，是同一片。" },
      { flag: "roselle", title: "罗塞尔日记残页", desc: "你在某处读到一页穿越者前辈的日记残页。它字迹潦草，却让你，莫名地，安心了一分。" },
      { flag: "bar_rumor", title: "酒馆夜话", desc: "你多花了一镑，让盐鳍鱼酒馆的老板娘今晚别打烊太早。换来的那句闲话，比一镑值钱。" },
      { flag: "dock_raided", title: "码头查私", desc: "你替值夜者查了一趟码头私货，记下了几条「不该出现在廷根港」的货路。" },
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
