import type {
  AttrKey, Choice, CombatState, Effect, GameState, Req, StoryNode, Check,
} from "./types";
import { ENEMIES, ITEMS, PATHWAYS } from "./data";

export const ENDING_SHIKONG = "ending_shikong";
export const ENDING_DEATH = "ending_death";

export function uid() {
  return "p_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function makeInitialState(name: string, playerId: string): GameState {
  return {
    playerId,
    name: name.trim() || "无名者",
    pathway: null,
    seq: 9,
    hp: 28, sp: 18, sanity: 50,
    maxHp: 28, maxSp: 18, maxSanity: 50,
    digestion: 0,
    pounds: 4,
    luck: 0,
    attrs: { physique: 5, inspiration: 5, will: 5 },
    inv: {},
    flags: {},
    nodeId: "c1_wake",
    chapter: 1,
    rounds: 0,
  };
}

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

/** 理智损失减免：黑狗护符 -1；罗塞尔的锚 减半（最低1） */
function sanityLossShield(s: GameState, loss: number) {
  if (loss >= 0) return loss;
  if (s.inv["charm_anchor"]) return Math.min(Math.round(loss / 2), -1);
  const shielded = s.inv["charm_dog"] ? loss + 1 : loss;
  return Math.min(shielded, -1);
}

export function applyEffects(s: GameState, effects: Effect[]): { state: GameState; notes: string[] } {
  const st: GameState = { ...s, attrs: { ...s.attrs }, inv: { ...s.inv }, flags: { ...s.flags } };
  const notes: string[] = [];
  for (const e of effects) {
    switch (e.t) {
      case "hp": {
        st.hp = clamp(st.hp + e.v, 0, st.maxHp);
        notes.push(`生命 ${e.v > 0 ? "+" : ""}${e.v}`);
        break;
      }
      case "sp": {
        st.sp = clamp(st.sp + e.v, 0, st.maxSp);
        notes.push(`灵性 ${e.v > 0 ? "+" : ""}${e.v}`);
        break;
      }
      case "sanity": {
        const v = e.v < 0 ? sanityLossShield(st, e.v) : e.v;
        st.sanity = clamp(st.sanity + v, 0, st.maxSanity);
        notes.push(`理智 ${v > 0 ? "+" : ""}${v}`);
        break;
      }
      case "digestion": {
        const before = st.digestion;
        st.digestion = clamp(st.digestion + e.v, 0, 100);
        if (e.v > 0) notes.push(`魔药消化 +${e.v}%`);
        if (before < 100 && st.digestion >= 100) {
          notes.push("魔药已完全消化！可前往值夜者据点申请晋升仪式。");
          st.flags["canAdvance"] = 1;
        }
        break;
      }
      case "pounds": {
        st.pounds = Math.max(0, st.pounds + e.v);
        notes.push(`金镑 ${e.v > 0 ? "+" : ""}${e.v}`);
        break;
      }
      case "luck": {
        st.luck += e.v;
        notes.push(`幸运 +${e.v}`);
        break;
      }
      case "item": {
        if (!e.k) break;
        st.inv[e.k] = (st.inv[e.k] || 0) + e.v;
        if (st.inv[e.k] <= 0) delete st.inv[e.k];
        const item = ITEMS[e.k];
        if (item && e.v > 0) notes.push(`获得物品：${item.name}×${e.v}`);
        if (item && e.v < 0) notes.push(`失去物品：${item.name}×${-e.v}`);
        break;
      }
      case "flag": {
        if (!e.k) break;
        st.flags[e.k] = (st.flags[e.k] || 0) + e.v;
        break;
      }
      case "attr": {
        if (!e.k) break;
        const k = e.k as AttrKey;
        st.attrs[k] = Math.max(1, st.attrs[k] + e.v);
        const NAMES: Record<AttrKey, string> = { physique: "体魄", inspiration: "灵感", will: "意志" };
        notes.push(`${NAMES[k]} ${e.v > 0 ? "+" : ""}${e.v}`);
        break;
      }
      case "maxHp": {
        st.maxHp += e.v; st.hp = clamp(st.hp + e.v, 0, st.maxHp);
        notes.push(`生命上限 +${e.v}`);
        break;
      }
      case "maxSp": {
        st.maxSp += e.v; st.sp = clamp(st.sp + e.v, 0, st.maxSp);
        notes.push(`灵性上限 +${e.v}`);
        break;
      }
      case "maxSanity": {
        st.maxSanity += e.v; st.sanity = clamp(st.sanity + Math.max(e.v, 0), 0, st.maxSanity);
        notes.push(`理智上限 +${e.v}`);
        break;
      }
    }
  }
  return { state: st, notes };
}

export function checkReq(s: GameState, req?: Req): { ok: boolean; reason?: string } {
  if (!req) return { ok: true };
  if (req.flag !== undefined) {
    const val = s.flags[req.flag] || 0;
    const need = req.flagVal ?? 1;
    if (req.flagVal === 0) { if (val !== 0) return { ok: false, reason: req.hint }; }
    else if (val < need) return { ok: false, reason: req.hint };
  }
  if (req.item && !(s.inv[req.item] > 0)) return { ok: false, reason: req.hint || `需要物品：${ITEMS[req.item]?.name || req.item}` };
  if (req.pathway && s.pathway !== req.pathway) return { ok: false, reason: req.hint || "当前途径无法选择" };
  if (req.attr && s.attrs[req.attr.k] < req.attr.min) return { ok: false, reason: req.hint };
  if (req.minPounds !== undefined && s.pounds < req.minPounds) return { ok: false, reason: req.hint || `需要 ${req.minPounds} 金镑` };
  if (req.seq !== undefined && s.seq !== req.seq) return { ok: false, reason: req.hint };
  return { ok: true };
}

export interface CheckResult {
  roll: number; bonus: number; total: number; dc: number; success: boolean;
  next: string; effects: Effect[]; label: string; attrLabel: string;
}

export function rollCheck(s: GameState, c: Check): CheckResult {
  let bonus: number;
  let attrLabel: string;
  if (c.attr === "luck") {
    bonus = s.luck * 2;
    attrLabel = "幸运";
  } else {
    bonus = s.attrs[c.attr];
    attrLabel = { physique: "体魄", inspiration: "灵感", will: "意志" }[c.attr];
  }
  // 占卜家灵视：灵感判定+2
  if (c.attr !== "luck" && c.attr === "inspiration" && s.pathway === "seer") bonus += 2;
  // 窥秘人「博闻强识」：博学可替代部分灵感，灵感判定+1
  if (c.attr !== "luck" && c.attr === "inspiration" && s.pathway === "pryer") bonus += 1;
  if (c.attr !== "luck") bonus += Math.floor(s.luck / 2);
  const roll = 1 + Math.floor(Math.random() * 20);
  const total = roll + bonus;
  const success = total >= c.dc;
  return {
    roll, bonus, total, dc: c.dc, success,
    next: success ? c.pass : c.fail,
    effects: success ? c.passEffects || [] : c.failEffects || [],
    label: c.label, attrLabel,
  };
}

/** 选择某个选项后，返回 {state, notes, combatKey?, combatWin?, combatLose?} */
export function resolveChoice(
  s: GameState,
  node: StoryNode,
  choice: Choice,
): { state: GameState; notes: string[] } {
  let st = { ...s, rounds: s.rounds + 1 };
  const notes: string[] = [];
  if (choice.once) st.flags = { ...st.flags, [choice.once]: 1 };
  if (choice.effects) {
    const r = applyEffects(st, choice.effects);
    st = r.state; notes.push(...r.notes);
  }
  if (choice.next) {
    st.nodeId = choice.next;
  }
  return { state: st, notes };
}

/** 进入节点：应用 onEnter、危机判定 */
export function enterNode(s: GameState, node: StoryNode, chapterOf: (id: string, node: StoryNode) => number): { state: GameState; notes: string[] } {
  let st = { ...s };
  const notes: string[] = [];
  if (node.onEnter) {
    const r = applyEffects(st, node.onEnter);
    st = r.state; notes.push(...r.notes);
  }
  st.chapter = chapterOf(node.id, node);
  // 理智崩溃 → 失控
  if (st.sanity <= 0 && node.id !== ENDING_SHIKONG) {
    st.sanity = 0;
    st.nodeId = ENDING_SHIKONG;
  } else if (st.hp <= 0 && node.id !== ENDING_DEATH && node.type !== "ending") {
    st.hp = 0;
    st.nodeId = ENDING_DEATH;
  }
  return { state: st, notes };
}

// ============ 途径应用 ============
export function applyPathway(s: GameState, key: string): { state: GameState; notes: string[] } {
  const p = PATHWAYS[key];
  if (!p) return { state: s, notes: [] };
  const st: GameState = { ...s, attrs: { ...s.attrs }, inv: { ...s.inv }, flags: { ...s.flags } };
  st.pathway = key;
  st.seq = 9;
  const b = p.bonus;
  const effs: Effect[] = [];
  if (b.maxHp) effs.push({ t: "maxHp", v: b.maxHp });
  if (b.maxSp) effs.push({ t: "maxSp", v: b.maxSp });
  if (b.maxSanity) effs.push({ t: "maxSanity", v: b.maxSanity });
  if (b.physique) effs.push({ t: "attr", k: "physique", v: b.physique });
  if (b.inspiration) effs.push({ t: "attr", k: "inspiration", v: b.inspiration });
  if (b.will) effs.push({ t: "attr", k: "will", v: b.will });
  if (b.sanity) effs.push({ t: "sanity", v: b.sanity });
  effs.push({ t: "digestion", v: 15 });
  const r = applyEffects(st, effs);
  return { state: { ...r.state, pathway: key }, notes: r.notes };
}

export function applyPromotion(s: GameState): { state: GameState; notes: string[] } {
  const r = applyEffects({ ...s, seq: 8, digestion: 0 }, [
    { t: "maxHp", v: 8 },
    { t: "maxSp", v: 6 },
    { t: "maxSanity", v: 6 },
    { t: "attr", k: "physique", v: 1 },
    { t: "attr", k: "inspiration", v: 1 },
    { t: "attr", k: "will", v: 1 },
    { t: "hp", v: 8 },
    { t: "sp", v: 6 },
  ]);
  return r;
}

// ============ 战斗引擎 ============
const rnd = (min: number, max: number) => min + Math.random() * (max - min);

export function newCombat(enemyKey: string, s: GameState, winNext: string, loseNext: string): CombatState {
  const e = ENEMIES[enemyKey];
  const log: CombatState["log"] = [
    { side: "sys", text: e.intro },
  ];
  let sanity = s.sanity;
  if (e.sanitySight) {
    const loss = sanityLossShield(s, -e.sanitySight);
    sanity = clamp(sanity + loss, 0, s.maxSanity);
    log.push({ side: "sys", text: `目睹超凡生物的颤栗攫住了你的心脏（理智 ${loss}）` });
  }
  if (s.pathway === "sleepless") {
    log.push({ side: "sys", text: "【夜之眷顾】灵性 +2" });
  }
  // c4/c5: 玩家若以途径扮演或前期证据「看穿」了敌人的位置/仪式底座，
  // 在对应战斗中抢占先机——敌人开局已受伤。
  let ehp = e.hp;
  const preemptFlags: Record<string, { flag: string; ratio: number; label: string }> = {
    master: { flag: "master_foreseen", ratio: 0.15, label: "他仪式的「底座」仍在塑形" },
    hound: { flag: "foreseen", ratio: 0.2, label: "你已预知它的伏击点位" },
    deacon: { flag: "night_stalker", ratio: 0.18, label: "你从诵念的死角绕到了他身后" },
    bellkeeper: { flag: "read_top", ratio: 0.12, label: "你读出了钟架的结构破绽" },
  };
  const pf = preemptFlags[enemyKey];
  const houndAmbush = enemyKey === "hound" && (s.flags?.foreseen || s.flags?.hunter_route);
  if ((pf && s.flags?.[pf.flag]) || houndAmbush) {
    const ratio = enemyKey === "hound" ? 0.2 : pf.ratio;
    const label = enemyKey === "hound"
      ? (s.flags?.hunter_route ? "你从暗梯绕到它身后" : "你已预知它的伏击点位")
      : pf.label;
    const preempt = Math.max(1, Math.round(e.hp * ratio));
    ehp = Math.max(1, e.hp - preempt);
    log.push({ side: "player", text: `${label}——抢得先机，一击削去 ${preempt} 点生命。` });
  }
  // c2 子夜歌声：意志判定决定谁抢得先机。
  // 通过 → 玩家镇定反杀，开局削去怨魂一截生命；失败 → 怨魂先发制人，玩家开局即受伤。
  let pHp = s.hp;
  if (enemyKey === "wraith" && s.flags?.wraith_steadied) {
    const preempt = Math.max(2, Math.round(e.hp * 0.2));
    ehp = Math.max(1, e.hp - preempt);
    log.push({ side: "player", text: `你趁着它迟疑的半秒率先开火——削去 ${preempt} 点生命。` });
  } else if (enemyKey === "wraith" && s.flags?.wraith_ambush) {
    const hurt = Math.max(2, Math.round(e.atk * 0.8));
    pHp = Math.max(1, s.hp - hurt);
    log.push({ side: "enemy", text: `幻象散去时它已扑到身前——你硬吃了一记 ${hurt} 点伤害才稳住阵脚。` });
  }
  // c3 老鼠莫里：灵感判定决定伏击的走向。
  // 通过 → 玩家已瞥见杀手方位，开局先手；失败 → 杀手先发制人，玩家开局受伤。
  if (enemyKey === "cultist" && s.flags?.ambush_seen) {
    const preempt = Math.max(2, Math.round(e.hp * 0.18));
    ehp = Math.max(1, e.hp - preempt);
    log.push({ side: "player", text: `你早一步瞥见他的方位——抢上一枪，削去 ${preempt} 点生命。` });
  } else if (enemyKey === "cultist" && s.flags?.cultist_ambush) {
    const hurt = Math.max(2, Math.round(e.atk * 0.7));
    pHp = Math.max(1, s.hp - hurt);
    log.push({ side: "enemy", text: `他第二柄匕首顺势补到——你又挨了 ${hurt} 点伤害才拉开距离。` });
  }
  return {
    enemyKey, winNext, loseNext,
    ehp, ehpMax: e.hp,
    shield: 0,
    atkUp: 0, atkUpTurns: 0,
    dodgeUp: 0, dodgeTurns: 0,
    vuln: 0, vulnTurns: 0,
    eAtkDown: 0, eAtkTurns: 0,
    dot: 0, dotTurns: 0,
    pDot: 0, pDotTurns: 0,
    guard: 0,
    playerHp: pHp,
    playerSp: s.pathway === "sleepless" ? clamp(s.sp + 2, 0, s.maxSp) : s.sp,
    playerSanity: sanity,
    turn: 1,
    over: false, won: false,
    log,
    shake: 0,
  };
}

export function playerBaseAtk(s: GameState): number {
  let atk = 5 + s.attrs.physique;
  // 武器进阶：高阶武器覆盖低阶（只取所持最高一档）
  if (s.inv["seal_revolver"]) atk += 6;
  else if (s.inv["silver_dagger"]) atk += 4;
  else if (s.inv["old_revolver"]) atk += 2;
  if (s.pathway === "hunter") atk += 1;
  return atk;
}

export interface PlayerAction {
  kind: "attack" | "ability" | "item" | "meditate" | "defend";
  key?: string;
}

export function playerAct(s: GameState, cs: CombatState, act: PlayerAction): { s: GameState; cs: CombatState } {
  const e = ENEMIES[cs.enemyKey];
  const c: CombatState = { ...cs, log: [...cs.log] };
  const st: GameState = { ...s };
  const push = (side: "player" | "enemy" | "sys", text: string) => c.log.push({ side, text });
  c.shake = 0;

  let dmg = 0;
  let miss = false;

  const missChance = Math.max(0, e.dodge - (s.pathway === "seer" ? 8 : 0));

  if (act.kind === "attack") {
    if (Math.random() * 100 < missChance) {
      miss = true;
      push("enemy", `你一枪射去，${e.name}的身影诡异地一晃——未命中！`);
    } else {
      dmg = playerBaseAtk(s) + c.atkUp;
      const crit = Math.random() < 0.08 + s.luck * 0.01;
      if (crit) dmg = Math.round(dmg * 1.5);
      dmg = Math.max(1, Math.round(dmg * rnd(0.85, 1.2)));
      push("player", crit ? `命运站在了准星这一边——暴击 ${dmg} 点伤害！` : `你扣下扳机，造成 ${dmg} 点伤害。`);
    }
  } else if (act.kind === "ability" && act.key && s.pathway) {
    const p = PATHWAYS[s.pathway];
    const ab = p.abilities.find((a) => a.key === act.key)!;
    const upgraded = s.seq === 8;
    const fx = { ...ab.fx, ...(upgraded ? ab.upFx || {} : {}) };
    const name = upgraded && ab.upName ? ab.upName : ab.name;
    c.playerSp = clamp(c.playerSp - ab.sp, 0, st.maxSp);
    // 窥秘人「博闻强识」：能力消耗的理智-1（知识替代部分自我损耗）
    const sanityCost = s.pathway === "pryer" ? Math.max(0, (ab.sanity || 0) - 1) : (ab.sanity || 0);
    if (sanityCost) c.playerSanity = clamp(c.playerSanity - sanityCost, 0, st.maxSanity);
    let parts: string[] = [];
    if (fx.dmg !== undefined) {
      let raw = fx.dmg;
      if (fx.dmgAttr && fx.dmgAttrKey) raw += s.attrs[fx.dmgAttrKey] * fx.dmgAttr;
      if (e.undead && fx.undeadBonus) raw += fx.undeadBonus;
      raw += c.atkUp;
      const critChance = (fx.crit || 0) / 100 + s.luck * 0.01;
      const crit = Math.random() < critChance;
      if (crit) raw *= fx.crit ? 1.6 : 1.5;
      dmg = Math.max(1, Math.round(raw * rnd(0.9, 1.15)));
      parts.push(`${crit ? "暴击！" : ""}造成 ${dmg} 点伤害`);
    }
    if (fx.healHp) { c.playerHp = clamp(c.playerHp + fx.healHp, 0, st.maxHp); parts.push(`回复生命 ${fx.healHp}`); }
    if (fx.healSp) { c.playerSp = clamp(c.playerSp + fx.healSp, 0, st.maxSp); parts.push(`回复灵性 ${fx.healSp}`); }
    if (fx.healSanity) { c.playerSanity = clamp(c.playerSanity + fx.healSanity, 0, st.maxSanity); parts.push(`理智 +${fx.healSanity}`); }
    if (fx.shield) { c.shield += fx.shield; parts.push(`获得 ${fx.shield} 点护盾`); }
    if (fx.dot) { c.dot = fx.dot.v; c.dotTurns = fx.dot.turns; parts.push(`目标凋零（每回合 ${fx.dot.v}，持续 ${fx.dot.turns} 回合）`); }
    if (fx.eAtkDown) { c.eAtkDown = fx.eAtkDown; c.eAtkTurns = fx.eAtkTurns || 2; parts.push(`敌方攻击 -${fx.eAtkDown}`); }
    if (fx.atkUp) { c.atkUp = fx.atkUp; c.atkUpTurns = fx.atkUpTurns || 2; parts.push(`自身攻击 +${fx.atkUp}`); }
    if (fx.dodgeUp) { c.dodgeUp = fx.dodgeUp; c.dodgeTurns = fx.dodgeTurns || 2; parts.push(`闪避 +${fx.dodgeUp}%`); }
    if (fx.vuln) { c.vuln = fx.vuln; c.vulnTurns = fx.vulnTurns || 3; parts.push(`目标受到伤害 +${fx.vuln}%`); }
    push("player", `【${name}】${parts.join("，")}。`);
  } else if (act.kind === "item" && act.key) {
    const item = ITEMS[act.key];
    if (item && (st.inv[act.key] || 0) > 0 && item.usable && (!item.pathway || item.pathway === s.pathway)) {
      st.inv = { ...st.inv, [act.key]: st.inv[act.key] - 1 };
      if (st.inv[act.key] <= 0) delete st.inv[act.key];
      if (item.usable === "healHp") { c.playerHp = clamp(c.playerHp + (item.v || 0), 0, st.maxHp); push("player", `你饮下【${item.name}】，生命 +${item.v}。`); }
      if (item.usable === "healSp") { c.playerSp = clamp(c.playerSp + (item.v || 0), 0, st.maxSp); push("player", `你使用【${item.name}】，灵性 +${item.v}。`); }
      if (item.usable === "healSanity") { c.playerSanity = clamp(c.playerSanity + (item.v || 0), 0, st.maxSanity); push("player", `你服下【${item.name}】，翻涌的幻象平息了，理智 +${item.v}。`); }
      if (item.also) {
        if (item.also.t === "hp") c.playerHp = clamp(c.playerHp + item.also.v, 0, st.maxHp);
        if (item.also.t === "sp") c.playerSp = clamp(c.playerSp + item.also.v, 0, st.maxSp);
        if (item.also.t === "sanity") c.playerSanity = clamp(c.playerSanity + item.also.v, 0, st.maxSanity);
        push("player", `附带的药效：${item.also.t === "hp" ? "生命" : item.also.t === "sp" ? "灵性" : "理智"} +${item.also.v}。`);
      }
      if (item.usable === "combatDmg") {
        let raw = item.v || 10;
        if (e.undead && item.undeadBonus) raw += item.undeadBonus;
        dmg = Math.round(raw * rnd(0.95, 1.1));
        push("player", `你填入【${item.name}】击发——圣徽的辉光炸开，造成 ${dmg} 点伤害！`);
        // 零号封缄附带易伤
        if (item.buff?.vuln) { c.vuln = item.buff.vuln; c.vulnTurns = item.buff.vulnTurns || 2; push("sys", `封缄之力渗入：目标易伤 +${item.buff.vuln}%。`); }
      }
      if (item.usable === "combatBuff" && item.buff) {
        const b = item.buff;
        const parts2: string[] = [];
        if (b.dodgeUp) { c.dodgeUp = b.dodgeUp; c.dodgeTurns = b.dodgeTurns || 2; parts2.push(`闪避 +${b.dodgeUp}%（${b.dodgeTurns || 2}回合）`); }
        if (b.atkUp) { c.atkUp = b.atkUp; c.atkUpTurns = b.atkUpTurns || 2; parts2.push(`攻击 +${b.atkUp}（${b.atkUpTurns || 2}回合）`); }
        if (b.shield) { c.shield += b.shield; parts2.push(`护盾 +${b.shield}`); }
        if (b.vuln) { c.vuln = b.vuln; c.vulnTurns = b.vulnTurns || 3; parts2.push(`目标易伤 +${b.vuln}%（${b.vulnTurns || 3}回合）`); }
        if (b.sanityCost) { c.playerSanity = clamp(c.playerSanity - b.sanityCost, 0, st.maxSanity); parts2.push(`理智 -${b.sanityCost}`); }
        // 收尸人镇魂符对不亡者额外引发凋零
        if (act.key === "collector_ward" && e.undead) { c.dot = 6; c.dotTurns = 2; parts2.push(`不亡者凋零 6/回合（2回合）`); }
        push("player", `你祭出【${item.name}】——${parts2.join("，")}。`);
      }
    }
  } else if (act.kind === "defend") {
    // 防御：以逸待劳。护盾 = 4 + 意志/2（向上取整），本回合敌方攻击闪避 +35%，并止血（清除玩家流血）
    const shieldGain = 4 + Math.ceil(s.attrs.will / 2);
    c.shield += shieldGain;
    c.guard = 35;
    const parts3: string[] = [`护盾 +${shieldGain}`];
    if (c.pDotTurns > 0) {
      parts3.push(`止血（清除流血 ${c.pDot}×${c.pDotTurns}）`);
      c.pDot = 0; c.pDotTurns = 0;
    }
    push("player", `你沉肩举盾、压低重心——${parts3.join("，")}，本回合闪避 +35%。`);
  } else if (act.kind === "meditate") {
    const spGain = 4 + (s.pathway === "sleepless" ? 2 : 0);
    c.playerSp = clamp(c.playerSp + spGain, 0, st.maxSp);
    c.playerSanity = clamp(c.playerSanity + 2, 0, st.maxSanity);
    let medMsg = `你闭眼调息，默念赫密斯语咒文的反义折返……灵性 +${spGain}，理智 +2。`;
    if (c.pDotTurns > 0) {
      c.pDotTurns = Math.max(0, c.pDotTurns - 1);
      if (c.pDotTurns === 0) { c.pDot = 0; medMsg += "（调息止血，流血已止。）"; }
      else medMsg += `（调息止血，流血剩余 ${c.pDotTurns} 回合。）`;
    }
    push("player", medMsg);
  }

  // 计算易伤
  if (dmg > 0 && c.vuln > 0 && c.vulnTurns > 0) dmg = Math.round(dmg * (1 + c.vuln / 100));
  if (dmg > 0) {
    c.ehp = Math.max(0, c.ehp - dmg);
    c.shake = 1;
  }

  if (c.ehp <= 0) {
    c.over = true; c.won = true;
    push("sys", `${e.name} 倒下了。`);
    // 结算
    const econf = ENEMIES[c.enemyKey];
    const r = applyEffects({ ...st, hp: c.playerHp, sp: c.playerSp, sanity: c.playerSanity }, [
      ...econf.loot, { t: "digestion", v: econf.digest },
    ]);
    return { s: r.state, cs: c };
  }

  // ===== 敌方回合 =====
  enemyAct(s, c, push);

  // 回合末结算
  if (c.dotTurns > 0 && !c.over) {
    c.ehp = Math.max(0, c.ehp - c.dot);
    push("sys", `凋零侵蚀着敌人：-${c.dot} 生命。`);
    c.dotTurns -= 1;
    if (c.ehp <= 0) {
      c.over = true; c.won = true;
      push("sys", `${e.name} 在凋零中溃散了。`);
      const econf = ENEMIES[c.enemyKey];
      const r = applyEffects({ ...st, hp: c.playerHp, sp: c.playerSp, sanity: c.playerSanity }, [
        ...econf.loot, { t: "digestion", v: econf.digest },
      ]);
      return { s: r.state, cs: c };
    }
  }
  if (c.atkUpTurns > 0) { c.atkUpTurns -= 1; if (c.atkUpTurns === 0) c.atkUp = 0; }
  if (c.dodgeTurns > 0) { c.dodgeTurns -= 1; if (c.dodgeTurns === 0) c.dodgeUp = 0; }
  if (c.eAtkTurns > 0) { c.eAtkTurns -= 1; if (c.eAtkTurns === 0) c.eAtkDown = 0; }
  if (c.vulnTurns > 0) { c.vulnTurns -= 1; if (c.vulnTurns === 0) c.vuln = 0; }
  // 玩家流血结算（先扣血，再判断死亡）
  if (c.pDotTurns > 0 && !c.over) {
    c.playerHp = Math.max(0, c.playerHp - c.pDot);
    push("sys", `伤口流血不止：-${c.pDot} 生命。`);
    c.pDotTurns -= 1;
    if (c.pDotTurns === 0) c.pDot = 0;
  }
  // 防御架势仅持续到下回合开始
  c.guard = 0;
  c.turn += 1;

  // 玩家战败
  if (c.playerHp <= 0) {
    c.over = true; c.won = false;
    push("sys", "黑暗漫过你的意识边缘……你倒下了。");
    return { s: { ...st, hp: 0, sp: c.playerSp, sanity: c.playerSanity }, cs: c };
  }
  // 理智崩溃
  if (c.playerSanity <= 0) {
    c.over = true; c.won = false;
    push("sys", "理智的堤坝轰然崩塌。有什么东西……从你的皮肤下面苏醒了。");
    return { s: { ...st, hp: c.playerHp, sp: c.playerSp, sanity: 0 }, cs: c };
  }

  return { s: { ...st, hp: c.playerHp, sp: c.playerSp, sanity: c.playerSanity }, cs: c };
}

function enemyAct(s: GameState, c: CombatState, push: (side: "player" | "enemy" | "sys", text: string) => void) {
  const e = ENEMIES[c.enemyKey];
  const halfBelow = c.ehp <= c.ehpMax / 2;
  const pool = e.moves.filter((m) => (!m.belowHalf || halfBelow) && (!m.minTurn || c.turn >= m.minTurn));
  const total = pool.reduce((a, m) => a + m.w, 0);
  let roll = Math.random() * total;
  let mv = pool[0];
  for (const m of pool) { roll -= m.w; if (roll <= 0) { mv = m; break; } }

  if (!mv.dmg && !mv.sanity) {
    push("enemy", `${mv.msg}。`);
    return;
  }
  // 玩家闪避
  const dodgeChance = c.dodgeUp + c.guard + (s.pathway === "collector" && e.undead ? 15 : 0) + (s.pathway === "reader" && c.turn === 1 ? 20 : 0);
  if (mv.dmg && Math.random() * 100 < dodgeChance) {
    push("player", `你预感到危险的轨迹，侧身避开！（闪避成功）`);
    if (mv.sanity) {
      c.playerSanity = clamp(c.playerSanity - 1, 0, s.maxSanity);
    }
    return;
  }
  let dmg = mv.dmg ? Math.max(1, Math.round((mv.dmg - c.eAtkDown) * rnd(0.85, 1.2))) : 0;
  if (s.pathway === "collector" && e.undead) dmg = Math.max(1, Math.round(dmg * 0.7));
  // 护盾吸收
  if (dmg > 0 && c.shield > 0) {
    const absorbed = Math.min(c.shield, dmg);
    c.shield -= absorbed; dmg -= absorbed;
    if (absorbed > 0) push("sys", `护盾吸收了 ${absorbed} 点伤害。`);
  }
  const parts: string[] = [];
  if (dmg > 0) { c.playerHp = Math.max(0, c.playerHp - dmg); parts.push(`你受到 ${dmg} 点伤害`); }
  if (mv.sanity) {
    const loss = s.inv["charm_anchor"] ? Math.max(1, Math.round(mv.sanity / 2)) : s.inv["charm_dog"] ? Math.max(1, mv.sanity - 1) : mv.sanity;
    c.playerSanity = clamp(c.playerSanity - loss, 0, s.maxSanity);
    parts.push(`理智 -${loss}`);
  }
  if (mv.bleed) {
    c.pDot = Math.max(c.pDot, mv.bleed);
    c.pDotTurns = Math.max(c.pDotTurns, mv.bleedTurns || 2);
    parts.push(`流血 ${mv.bleed}/回合（${mv.bleedTurns || 2}回合）`);
  }
  push("enemy", `${mv.msg}！${parts.join("，")}。`);
}
