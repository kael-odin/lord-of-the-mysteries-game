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
  { label: "第十二章 · 旧都·回声", ids: ["rootkeeper"] },
  { label: "第十三章 · 灰原骨冢·先人回响", ids: ["personkeeper"] },
  { label: "第十四章 · 灰雾深处·真我", ids: ["truthkeeper"] },
  { label: "第十五章 · 灰雾最深处·归处", ids: ["homekeeper"] },
  { label: "第十六章 · 灰雾更深处·归名", ids: ["namehomekeeper"] },
  { label: "第十七章 · 灰雾之上·忆归", ids: ["memorykeeper"] },
  { label: "第十八章 · 灰雾之上·归处", ids: ["momentkeeper"] },
  { label: "第十九章 · 灰雾之下·行路", ids: ["roadwalker"] },
  { label: "第二十章 · 灰雾之下·同路", ids: ["samepath"] },
  { label: "第二十一章 · 灰雾之下·各自", ids: ["eachpath"] },
  { label: "第二十二章 · 灰雾之下·自定", ids: ["selfpath"] },
  { label: "第二十三章 · 灰雾之下·认", ids: ["knowpath"] },
  { label: "第二十四章 · 灰雾之下·认名", ids: ["nameknower"] },
  { label: "第二十五章 · 灰雾之下·认人", ids: ["personknower"] },
  { label: "第二十六章 · 灰雾之下·认心", ids: ["heartknower"] },
  { label: "第二十七章 · 灰雾之下·留", ids: ["leaver"] },
  { label: "第二十八章 · 灰雾之下·留名", ids: ["nameleaver"] },
  { label: "第二十九章 · 灰雾之下·留路", ids: ["roadleaver"] },
  { label: "第三十章 · 灰雾之下·留心", ids: ["heartleaver"] },
  { label: "第三十一章 · 灰雾之下·等", ids: ["waiter"] },
  { label: "第三十二章 · 灰雾之下·等名", ids: ["namewaiter"] },
  { label: "第三十三章 · 灰雾之下·等路", ids: ["roadwaiter"] },
  { label: "第三十四章 · 灰雾之下·等心", ids: ["heartwaiter"] },
  { label: "第三十五章 · 灰雾之下·放", ids: ["releaser"] },
  { label: "第三十六章 · 灰雾之下·放名", ids: ["namereleaser"] },
  { label: "第三十七章 · 灰雾之下·放路", ids: ["roadreleaser"] },
  { label: "第三十八章 · 灰雾之下·放心", ids: ["heartreleaser"] },
  { label: "第三十九章 · 灰雾之下·承", ids: ["bearer"] },
  { label: "第四十章 · 灰雾之下·承名", ids: ["bearername"] },
  { label: "第四十一章 · 灰雾之下·承路", ids: ["bearerroad"] },
  { label: "第四十二章 · 灰雾之下·承心", ids: ["bearerheart"] },
  { label: "第四十三章 · 灰雾之下·递", ids: ["passer"] },
  { label: "第四十四章 · 灰雾之下·递名", ids: ["passername"] },
  { label: "第四十五章 · 灰雾之下·递路", ids: ["passerroad"] },
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
      { flag: "drifter_aspect_down", title: "漫游聚合体·向归", desc: "南港沉船巷下旧航道遗址腔室里，那团由太多「没人再去过的地方」长成、终于咬合成一个会自我漂移的漫游之物，被你停了转。南港人停了半月的「要去哪儿」，重新被拨了回来。" },
      { flag: "pilot_down", title: "芮恩森·向锚·补", desc: "巷尾废领航塔底，芮恩·芮恩森五十年前用自己「去向」钉下的那道「向之锚」，被你用铜币的温热，补了一层。沉船巷，认你了。" },
      { flag: "culler12_down", title: "塌缩·偷根者·门脸碎", desc: "旧都瑟塔尔断柱残宫的风沙里，塌缩学派遣来收根的暗哨，那面磨平的门脸，被你碎成了几瓣。每一瓣里，都映着一个被偷走的、不属于自己的「来处」。" },
      { flag: "hearth_down", title: "故土聚合体·根归", desc: "旧都残卷阁下旧王宫遗址腔室里，那团由太多「没人再回去过的地方」长成、终于咬合成一个会自我塌缩的故土之物，被你停了转。旧都人停了半月的「从哪儿来」，重新被夯了回来。" },
      { flag: "archivist_down", title: "赫斯森·根锚·补", desc: "残卷阁深处废档塔底，赫斯·赫斯森五十年前用自己「来处」钉下的那道「根之锚」，被你用铜币的温热，补了一层。残卷阁，认你了。" },
      { flag: "culler13_down", title: "空壳·偷人者·壳脸碎", desc: "灰原骨冢先人石冢林的风沙里，空壳学派遣来收人的暗哨，那面磨平的壳脸，被你碎成了几瓣。每一瓣里，都映着一个被偷走的、不属于自己的「为人」。" },
      { flag: "husk_aspect_down", title: "空壳聚合体·人归", desc: "骨冢残碑阁下旧先人冢室腔里，那团由太多「没人再是人」长成、终于咬合成一个会自我退壳的空壳之物，被你停了转。骨冢人停了半月的「是不是人」，重新被认了回来。" },
      { flag: "herald_down", title: "赫丝森·人锚·补", desc: "残碑阁深处废碑塔底，赫丝·赫丝森五十年前用自己「为人」钉下的那道「人之锚」，被你用铜币的温热，补了一层。残碑阁，认你了。" },
      { flag: "culler14_down", title: "镜我·偷我者·镜脸碎", desc: "灰雾深处镜心冢雾镜林里，镜我学派遣来收我的暗哨，那面磨平的凹镜脸，被你碎成了几瓣。每一瓣里，都映着一个被偷走的、不属于自己的「真我」。" },
      { flag: "mirror_down", title: "真我聚合体·我归", desc: "残映阁下旧镜心冢腔里，那团由太多「没人再是我」长成、终于咬合成一个会自我映穿的镜我之物，被你停了转。镜心冢人停了半月的「是不是真我」，重新被映了回来。" },
      { flag: "reflection_down", title: "灰森·我锚·补", desc: "残映阁深处废映塔底，灰·灰森五十年前用自己「真我」钉下的那道「我之锚」，被你用铜币的温热，补了一层。残映阁，认你了。" },
      { flag: "culler15_down", title: "归墟·夺归者·门环碎", desc: "灰雾最深处归墟门环林里，归墟学派遣来收归念的暗哨，那面磨平的门环脸，被你碎成了几瓣。每一瓣里，都半掩着一个被夺走的、不属于任何处的「归处」。" },
      { flag: "home_down", title: "归念聚合体·归回", desc: "残归阁下旧归墟腔里，那团由太多「没人再归得回」长成、终于咬合成一个会自我归穿的门环之物，被你停了转。归墟人停了半月的「该回哪儿」，重新被归了回来。" },
      { flag: "wayfarer_down", title: "雾森·归锚·补", desc: "残归阁深处废归塔底，雾·雾森五十年前用自己「归念」钉下的那道「归之锚」，被你用八枚铜币的温热，补了一层。残归阁，认你了。" },
      { flag: "culler16_down", title: "归名·夺名者·门环磨平", desc: "灰雾更深处归名冢无名林里，归名派遣来收归名的暗哨，那面磨平了门环的脸，被你碎成了几瓣。每一瓣里，都半掩着一个被夺走的、不归于任何「谁」的「归名」。" },
      { flag: "name_down", title: "归名聚合体·名归", desc: "残名阁下旧归名冢腔里，那团由太多「没人再归于谁」长成、终于咬合成一个会自我归穿的归名之物，被你停了转。归名冢人停了半月的「是谁的归人」，重新被归了回来。" },
      { flag: "anchor16_down", title: "雾名·名锚·补", desc: "残名阁深处废名塔底，雾·雾名五十年前用自己「归名」钉下的那道「名之锚」，被你用九枚铜币的温热，补了一层。残名阁，认你了。" },
      { flag: "echo_down", title: "廷根·老钟的余声·补", desc: "廷根钟楼那口老钟里，某位旧守钟人临终前怕听钟的人以为天不再亮、特意没敲完的、最后一声，被你在钟楼下坐到天亮，认了出来。廷根的雾，又被晨光，拨淡了一寸。" },
      { flag: "anchor_down", title: "灰河桥·老水手那船·靠", desc: "贝克兰德灰河桥栏边，老水手姓锚的、他「还惦记着」等了半辈子的那条船，被你在桥栏边望到天黑，望了过来——一艘旧得不能再旧的、小渔船，船头挂着一盏比煤气灯暖一档的灯。船自己靠了过来，把老水手，接走了。" },
      { flag: "road_down", title: "旧道·没走完的那一段·走完", desc: "你自选的那条旧道深处，某位旧脚夫怕走他这条路的人以为路不再有人走、特意没散尽的、最后一段，被你在旧道上走到天亮，认了出来。雾都城外的雾，又被晨光，拨淡了一寸。" },
      { flag: "samepath_down2", title: "同路·没走完的那一段·走完", desc: "你与同路人同走的那段旧道深处，另一位旧脚夫怕走他这条路的人以为路不再有人同走、特意没散尽的、最后一段，被你把铜币与同路人对过的那点温热贴在旧路碑上，认了出来。雾都城外的雾，又被晨光，拨淡了一寸。" },
      { flag: "eachpath_down2", title: "各自·没走完的那一段·走完", desc: "你一个人走的那段旧道深处，另一位旧脚夫怕走他这条路的人以为路不再有人独自走、特意没散尽的、最后一段，被你把铜币与同路人对过的那点温热贴在旧路碑上，认了出来。雾都城外的雾，又被晨光，拨淡了一寸。" },
      { flag: "selfpath_down2", title: "自定·没走完的那一段·走完", desc: "你自己定要走的那段路上，另一位旧人怕走那条路的人以为路不再有人自己定要走、特意没散尽的、最后一段，被你把铜币与同路人对过的那点温热贴在那条路的旧物上，认了出来。雾都城外的雾，又被晨光，拨淡了一寸。" },
      { flag: "knowpath_down2", title: "认·没认出的那一段·认完", desc: "你走过的旧地方里，另一位旧人守到磨平、叫不出名字的、最后一段，被你把铜币与印记对过的那点温热贴在旧地方深处的旧物上、叫出了名字。旧地方，认你了。雾都城外的雾，又被晨光，拨淡了一寸。" },
      { flag: "nameknower_down2", title: "认名·没认出的那一段·认名完", desc: "你走过的旧地方里，另一位旧人守到忘了、叫不出名字的、最后一段，被你把铜币与印记对过的那点温热贴在旧地方深处的旧物上、重新叫出了名字。旧地方，认你了。雾都城外的雾，又被晨光，拨淡了一寸。" },
      { flag: "personknower_down2", title: "认人·没认出的那一段·认人完", desc: "你走过的旧地方里，另一位旧人守到藏起来、连他自己也认不出自己的、最后一段，被你把铜币与印记对过的那点温热贴在旧地方深处的旧物上、把那个被藏起来的人认了出来。旧地方，认你了。雾都城外的雾，又被晨光，拨淡了一寸。" },
      { flag: "heartknower_down2", title: "认心·没认出的那一段·认心完", desc: "你走过的旧地方里，另一位旧人守到藏起来、连他自己也认不出那颗心的、最后一段，被你把铜币与印记对过的那点温热贴在旧地方深处的旧物上、把那颗被藏起来的心认了出来。旧地方，认你了。雾都城外的雾，又被晨光，拨淡了一寸。" },
      { flag: "leaver_down2", title: "留·没留下的那一段·留完", desc: "你走过的旧地方里，另一位旧人怕走他这条旧地方的人以为那段不再需要被走、特意没留下过一笔的、最后一段，被你把铜币与印记对过的那点温热贴在旧地方深处的旧物上、把那一笔留了下来。旧地方，记你了。下回，走那地方的人，会，看见，你那一笔。雾都城外的雾，又被晨光，拨淡了一寸。" },
      { flag: "nameleaver_down2", title: "留名·没留下的那一段·留名完", desc: "你走过的旧地方里，另一位旧人怕走他这条旧地方的人以为那名字不再需要被叫、特意没留下过名字的、最后一段，被你把铜币与印记对过的那点温热贴在旧地方深处的旧物上、把那个名字留了下来。旧地方，记你了。下回，走那地方的人，会，看见，你留下的那名字。雾都城外的雾，又被晨光，拨淡了一寸。" },
      { flag: "roadleaver_down2", title: "留路·没留下的那一段·留路完", desc: "你走过的旧道里，另一位旧人怕走他这条旧道的人以为那段不再需要被走、特意没留下过路的、最后一段，被你把铜币与印记对过的那点温热贴在旧道深处的旧物上、把那段路留了下来。旧道，记你了。下回，走那旧道的人，会，看见，你留下的那段路。雾都城外的雾，又被晨光，拨淡了一寸。" },
      { flag: "heartleaver_down2", title: "留心·没留下的那一段·留心完", desc: "你走过的旧地方里，另一位旧人怕到他这旧地方的人以为那颗不再需要被有、特意没留下过心的、最后一处，被你把铜币与印记对过的那点温热贴在旧地方深处的旧物上、把那颗心留了下来。旧地方，记你了。下回，到那旧地方的人，会，看见，你留下的那颗心。雾都城外的雾，又被晨光，拨淡了一寸。" },
      { flag: "waiter_down2", title: "等·没等下来的那一程·等完", desc: "你走过的旧地方里，另一位旧人怕到他这旧地方的人以为那一程不再需要被等、特意没等下来的、最后一处，被你把铜币与印记对过的那点温热贴在旧地方深处的旧物上、把那一程等了下来。旧地方，记你了。下回，到那旧地方的人，会，看见，你等下来的那一程。雾都城外的雾，又被晨光，拨淡了一寸。" },
      { flag: "namewaiter_down2", title: "等名·没等名下来的那一个名字·等名完", desc: "你走过的旧地方里，另一位旧人怕到他这旧地方的人以为那个名字不再需要被等、特意没等名下来的、最后一处，被你把铜币与印记对过的那点温热贴在旧地方深处的旧物上、把那个名字等名了下来。旧地方，记你了。下回，到那旧地方的人，会，看见，你等名下来的那个名字。雾都城外的雾，又被晨光，拨淡了一寸。" },
    ],
  },
  {
    label: "结案录 · 一程一结",
    entries: [
      { flag: "case12_closed", title: "旧都·故土案", desc: "塌缩学派收根的暗哨碎了门脸，故土聚合体停了转。旧都那截断了的「从哪儿来」，被你重新夯了回来。" },
      { flag: "case13_closed", title: "骨冢·先人案", desc: "空壳学派收人的暗哨碎了壳脸，空壳聚合体退了壳。骨冢那截断了的「是不是人」，被你重新认了回来。" },
      { flag: "case14_closed", title: "镜心·真我案", desc: "镜我学派收我的暗哨碎了镜脸，真我聚合体映穿了。镜心冢那截断了的「是不是真我」，被你重新映了回来。" },
      { flag: "case15_closed", title: "归墟·归处案", desc: "归墟学派夺归的暗哨碎了门环，归念聚合体归穿了。归墟那截断了的「该回哪儿」，被你重新归了回来。" },
      { flag: "case16_closed", title: "归名冢·归名案", desc: "归名暗哨的门环脸磨平了，归名聚合体停了转。归名冢那截断了的「是谁的归人」，被你重新归了回来。" },
      { flag: "case17_closed", title: "廷根·老钟余声案", desc: "廷根钟楼那口老钟里、旧守钟人临终前没敲完的最后一声，被你在钟楼下坐到天亮，认了出来。" },
      { flag: "case18_closed", title: "贝克兰德·老水手那船案", desc: "灰河桥栏边、老水手等了半辈子的那条船，被你望到天黑望了过来。船自己靠了岸，把老水手接走了。" },
      { flag: "case19_closed", title: "旧道·行路案", desc: "你自选的那条旧道深处、旧脚夫没散尽的最后一段，被你走到天亮认了出来。雾都城外的雾，拨淡了一寸。" },
      { flag: "case20_closed", title: "同路·同走案", desc: "你与同路人同走的那段旧道、另一位旧脚夫没散尽的最后一段，被你把铜币与同路人对过的温热贴在路碑上，认了出来。" },
      { flag: "case21_closed", title: "各自·自走案", desc: "你一个人走的那段旧道、另一位旧脚夫没散尽的最后一段，被你把铜币与同路人对过的温热贴在路碑上，认了出来。" },
      { flag: "case22_closed", title: "自定·自定案", desc: "你自己定要走的那段路、另一位旧人没散尽的最后一段，被你把铜币与同路人对过的温热贴在旧物上，认了出来。" },
      { flag: "case23_closed", title: "认·没认出案", desc: "你走过的旧地方、另一位旧人守到磨平叫不出名字的最后一段，被你把铜币与印记对过的温热贴在旧物上、叫出了名字。" },
      { flag: "case24_closed", title: "认名·没认出名案", desc: "你走过的旧地方、另一位旧人守到忘了的最后一段，被你把铜币与印记对过的温热贴在旧物上、重新叫出了名字。" },
      { flag: "case25_closed", title: "认人·没认出人案", desc: "你走过的旧地方、另一位旧人守到藏起来连自己也认不出自己的最后一段，被你把铜币与印记对过的温热贴在旧物上、把那个人认了出来。" },
      { flag: "case26_closed", title: "认心·没认出心案", desc: "你走过的旧地方、另一位旧人守到藏起来连那颗心也认不出的最后一处，被你把铜币与印记对过的温热贴在旧物上、把那颗心认了出来。" },
      { flag: "case27_closed", title: "留·没留下案", desc: "你走过的旧地方、另一位旧人没留下过一笔的最后一处，被你把铜币与印记对过的温热贴在旧物上、把那一笔留了下来。" },
      { flag: "case28_closed", title: "留名·没留下名案", desc: "你走过的旧地方、另一位旧人没留下过名字的最后一处，被你把铜币与印记对过的温热贴在旧物上、把那个名字留了下来。" },
      { flag: "case29_closed", title: "留路·没留下路案", desc: "你走过的旧道、另一位旧人没留下过路的最后一段，被你把铜币与印记对过的温热贴在旧道深处的旧物上、把那段路留了下来。" },
      { flag: "case30_closed", title: "留心·没留下心案", desc: "你走过的旧地方、另一位旧人没留下过心的最后一处，被你把铜币与印记对过的温热贴在旧物上、把那颗心留了下来。" },
      { flag: "case31_closed", title: "等·没等下案", desc: "你走过的旧地方、另一位旧人没等下来的最后一处，被你把铜币与印记对过的温热贴在旧物上、把那一程等了下来。" },
      { flag: "case32_closed", title: "等名·没等下名案", desc: "你走过的旧地方、另一位旧人没等名下来的最后一处，被你把铜币与印记对过的温热贴在旧物上、把那个名字等名了下来。" },
      { flag: "case33_closed", title: "等路·没等下路案", desc: "你走过的旧道、另一位旧人没等路下来的最后一段，被你把铜币与印记对过的温热贴在旧物上、把那段路等了下来。" },
      { flag: "case34_closed", title: "等心·没等下心案", desc: "你走过的旧地方、另一位旧人没等心下来的最后一颗，被你把铜币与印记对过的温热贴在旧物上、把那颗心等了下来。" },
      { flag: "case35_closed", title: "放·没放下案", desc: "你走过的旧地方、另一位旧人没放下来的最后一笔，被你把铜币与印记对过的温热贴在旧物上、把那一笔放了下来并松了手。" },
      { flag: "case36_closed", title: "放名·没放名案", desc: "你走过的旧地方、另一位旧人没放名下来的最后一个名字，被你把铜币与印记对过的温热贴在旧物上、把那个名字放了下来并松了手。" },
      { flag: "case37_closed", title: "放路·没放路案", desc: "你走过的旧道、另一位旧人没放下来的最后一段路，被你把铜币与印记对过的温热贴在旧物上、把那段路放了下来并松了手。" },
      { flag: "case38_closed", title: "放心·没放心案", desc: "你走过的旧地方、另一位旧人没放下来的最后一颗心，被你把铜币与印记对过的温热贴在旧物上、把那颗心放了下来并松了手。" },
      { flag: "case39_closed", title: "承·没承案", desc: "你走过的旧地方、另一位旧人没承下来的最后一笔，被你把铜币与印记对过的温热搁在掌心、把空着的手心朝上接住了那一笔落下来的、承了下来又让它过去。" },
      { flag: "case40_closed", title: "承名·没承名案", desc: "你走过的旧地方、另一位旧人没承下来的最后一个名字，被你把铜币与印记对过的温热搁在掌心、把空着的手心朝上接住了那个名字落下来的、承了下来又让它过去。" },
      { flag: "case41_closed", title: "承路·没承路案", desc: "你走过的旧道里、另一位旧人没承下来的最后一段路，被你把铜币与印记对过的温热贴在旧道上、把空着的手心朝上接住了那段路落下来的、承了下来又让它过去。" },
      { flag: "case42_closed", title: "承心·没承心案", desc: "你走过的旧地方里、另一位旧人没承下来的最后一颗心，被你把铜币与印记对过的温热贴在旧地方上、把空着的手心朝上接住了那颗心落下来的、承了下来又让它过去。" },
      { flag: "case43_closed", title: "递·没递下案", desc: "你走过的旧地方里、另一位空着手心的旧人没承到的一笔该到他手里的，被你把铜币与印记对过的温热贴在你承下来的那一笔上、往他空着的手心里递了过去、又让他接稳了再让它往下一程去。" },
      { flag: "case44_closed", title: "递名·没递名案", desc: "你走过的旧地方里、另一位空着手心的旧人没承到的一个名字该到他手里的，被你把铜币与印记对过的温热贴在你承下来的那个名字上、往他空着的手心里递了过去、又让他接稳了再让它往下一程去。" },
      { flag: "case45_closed", title: "递路·没递路案", desc: "你走过的旧道里、另一位空着手心的旧人没承到的一段路该到他手里的，被你把铜币与印记对过的温热贴在你承下来的那段路上、往他空着的手心里递了过去、又让他接稳了再让它往下一程去。" },
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
