import type { Effect } from "./types";

// ============ 途径 PATHWAYS ============
export interface AbilityFx {
  dmg?: number;
  dmgAttr?: number; // 属性加成系数
  dmgAttrKey?: "physique" | "inspiration" | "will";
  healHp?: number;
  healSp?: number;
  healSanity?: number;
  shield?: number;
  dot?: { v: number; turns: number };
  eAtkDown?: number;
  eAtkTurns?: number;
  atkUp?: number;
  atkUpTurns?: number;
  dodgeUp?: number;
  dodgeTurns?: number;
  vuln?: number; // %
  vulnTurns?: number;
  undeadBonus?: number;
  crit?: number; // 额外暴击率
}

export interface Ability {
  key: string;
  name: string;
  desc: string;
  sp: number;
  sanity?: number;
  fx: AbilityFx;
  upName?: string; // 序列8升级名
  upDesc?: string;
  upFx?: Partial<AbilityFx>;
}

export interface Pathway {
  key: string;
  name: string; // 序列9名称
  seq8: string;
  road: string; // 途径归属
  motto: string; // 扮演法则
  desc: string;
  bonus: {
    maxHp?: number; maxSp?: number; maxSanity?: number;
    physique?: number; inspiration?: number; will?: number;
    sp?: number; hp?: number; sanity?: number; tag?: string;
  };
  passive: { name: string; desc: string };
  abilities: Ability[];
  drinkNode: string;
  flavor: string;
}

export const PATHWAYS: Record<string, Pathway> = {
  seer: {
    key: "seer",
    name: "占卜家",
    seq8: "小丑",
    road: "愚者途径",
    motto: "「扮演占卜师，敬畏命运，却不臣服于命运。」",
    desc: "窥视命运长河的人。擅长灵视与占卜，能提前嗅到危险的气息。代价是——知道的越多，死得越快。",
    bonus: { inspiration: 3, will: 1, maxSp: 8, sp: 8, maxSanity: 4 },
    passive: { name: "灵视", desc: "永久被动：战斗中敌人闪避率降低，剧情中解锁隐藏选项。" },
    drinkNode: "c2_drink_seer",
    flavor: "佔卜家的魔药像一杯凝固的星空，靛蓝色液体里浮沉着眼珠大小的银白光点。",
    abilities: [
      {
        key: "spirit_eye", name: "灵视解析", desc: "看穿敌人的「灵」，攻击+3、闪避+25%，持续2回合",
        sp: 4, fx: { atkUp: 3, atkUpTurns: 2, dodgeUp: 25, dodgeTurns: 2 },
        upName: "危机直觉", upDesc: "小丑的直觉：攻击+4、闪避+35%，持续3回合",
        upFx: { atkUp: 4, atkUpTurns: 3, dodgeUp: 35, dodgeTurns: 3 },
      },
      {
        key: "spirit_fire", name: "仪式·灵焰", desc: "以灵性点燃无形之火，造成 8+灵感×1.2 伤害，对亡灵额外+6",
        sp: 6, fx: { dmg: 8, dmgAttr: 1.2, dmgAttrKey: "inspiration", undeadBonus: 6 },
        upName: "纸牌飞刀", upDesc: "造成 12+灵感×1.4 伤害，20% 暴击（×1.6）",
        upFx: { dmg: 12, dmgAttr: 1.4, crit: 20 },
      },
    ],
  },
  sleepless: {
    key: "sleepless",
    name: "不眠者",
    seq8: "午夜诗人",
    road: "黑暗途径",
    motto: "「守护长夜，直到黎明。不眠即是职责。」",
    desc: "黑夜的眷属。夜越深，力量越强，精神如打磨过的刀。黑夜女神教会值夜者的中坚序列。",
    bonus: { physique: 2, will: 2, maxHp: 10, hp: 10, maxSp: 6, sp: 6 },
    passive: { name: "夜之眷顾", desc: "被动：每次进入战斗额外回复2点灵性；夜晚剧情判定获得加值。" },
    drinkNode: "c2_drink_sleepless",
    flavor: "不眠者的魔药是纯粹的漆黑，像把一小段午夜装进了玻璃管，喝下去时喉间一片冰凉。",
    abilities: [
      {
        key: "mind_scalpel", name: "精神穿刺", desc: "意志凝成尖刺，造成 7+意志×1.2 伤害",
        sp: 5, fx: { dmg: 7, dmgAttr: 1.2, dmgAttrKey: "will" },
        upName: "安魂诗篇", upDesc: "11+意志×1.4 伤害，并使敌人攻击-3，持续2回合",
        upFx: { dmg: 11, dmgAttr: 1.4, eAtkDown: 3, eAtkTurns: 2 },
      },
      {
        key: "night_mend", name: "夜幕回复", desc: "汲取夜色修复自身，回复 12 点生命",
        sp: 4, fx: { healHp: 12 },
        upName: "深夜庇护", upDesc: "回复 16 生命并获得 8 点护盾",
        upFx: { healHp: 16, shield: 8 },
      },
    ],
  },
  collector: {
    key: "collector",
    name: "收尸人",
    seq8: "掘墓人",
    road: "永眠者途径",
    motto: "「直面死亡，但不能爱上死亡。」",
    desc: "与尸体和亡灵同行的人。能沟通死者、安抚怨魂，自身也愈发接近「死」的一侧——理智却意外地稳固。",
    bonus: { physique: 2, inspiration: 2, maxHp: 6, hp: 6, maxSanity: 8, sanity: 8 },
    passive: { name: "亡者之友", desc: "被动：亡灵类敌人对你造成的伤害降低30%；剧情中可通灵问讯。" },
    drinkNode: "c2_drink_collector",
    flavor: "收尸人的魔药苍白如骨灰，带着雨后墓园的泥土气息，入口的瞬间你听见了遥远的哭声。",
    abilities: [
      {
        key: "dead_touch", name: "亡者之抚", desc: "冰冷的手抚过敌人，6点伤害+每回合3点凋零，持续3回合（对亡灵+5）",
        sp: 5, fx: { dmg: 6, dot: { v: 3, turns: 3 }, undeadBonus: 5 },
        upName: "掘墓之铲", upDesc: "14+体魄×1.2 伤害+凋零4点×3回合",
        upFx: { dmg: 14, dmgAttr: 1.2, dmgAttrKey: "physique", dot: { v: 4, turns: 3 } },
      },
      {
        key: "soul_shield", name: "通灵护盾", desc: "聚拢哀魂形成屏障：10点护盾，并回复3点理智",
        sp: 4, fx: { shield: 10, healSanity: 3 },
        upName: "万魂壁垒", upDesc: "16点护盾，回复5点理智",
        upFx: { shield: 16, healSanity: 5 },
      },
    ],
  },
  pryer: {
    key: "pryer",
    name: "窥秘人",
    seq8: "格斗学者",
    road: "隐者途径",
    motto: "「为窥见隐秘付出对等的代价——这就是公平。」",
    desc: "追逐隐秘知识的人。知识就是力量，字面意义上的。但每一页不该被阅读的纸，都在蚕食你的自我。",
    bonus: { inspiration: 4, maxSp: 12, sp: 12, maxSanity: -4 },
    passive: { name: "博闻强识", desc: "被动：灵性上限更高；能力消耗的理智-1（知识替代自我损耗）；判定时知识可替代部分灵感（剧情加成）。" },
    drinkNode: "c2_drink_pryer",
    flavor: "窥秘人的魔药是旋转的暗紫色，表面不断浮现又破裂的符文气泡，盯着看太久会流鼻血。",
    abilities: [
      {
        key: "arcane_rune", name: "秘术符文", desc: "燃烧一段知识：9+灵感×1.3 伤害，代价2点理智",
        sp: 6, sanity: 2, fx: { dmg: 9, dmgAttr: 1.3, dmgAttrKey: "inspiration" },
        upName: "学者斗技", upDesc: "13+灵感×1.5 伤害，代价2点理智",
        upFx: { dmg: 13, dmgAttr: 1.5 },
      },
      {
        key: "knowledge_gaze", name: "知识窥视", desc: "解析敌人的弱点：受到伤害+30%，其攻击-2，持续3回合。代价2理智",
        sp: 3, sanity: 2, fx: { vuln: 30, vulnTurns: 3, eAtkDown: 2, eAtkTurns: 3 },
        upName: "解构之视", upDesc: "受伤+40%，敌攻-3，持续3回合。代价2理智",
        upFx: { vuln: 40, vulnTurns: 3, eAtkDown: 3, eAtkTurns: 3 },
      },
    ],
  },
  hunter: {
    key: "hunter",
    name: "猎人",
    seq8: "挑衅者",
    road: "红祭司途径",
    motto: "「最强大的猎人，往往以猎物的姿态出现。」",
    desc: "荒野与阴谋的宠儿。追踪、设伏、一击致命。对陷阱与杀意的嗅觉无人能及——正面战斗中的王者。",
    bonus: { physique: 3, inspiration: 1, maxHp: 12, hp: 12 },
    passive: { name: "猎手直觉", desc: "被动：无法被伏击（剧情）；基础攻击力+1。" },
    drinkNode: "c2_drink_hunter",
    flavor: "猎人的魔药是灼热的铁锈红色，像咽下了一口烧红的刀尖，血腥味在口腔里炸开。",
    abilities: [
      {
        key: "hunt_mark", name: "猎杀标记", desc: "标记猎物：其受到的伤害+25%，持续3回合",
        sp: 3, fx: { vuln: 25, vulnTurns: 3 },
        upName: "挑衅烙印", upDesc: "受伤+35%，持续3回合，且敌攻-2",
        upFx: { vuln: 35, vulnTurns: 3, eAtkDown: 2, eAtkTurns: 3 },
      },
      {
        key: "lethal_shot", name: "致命射击", desc: "瞄准要害：9+体魄×1.3 伤害，25% 暴击（×1.6）",
        sp: 6, fx: { dmg: 9, dmgAttr: 1.3, dmgAttrKey: "physique", crit: 25 },
        upName: "獠牙一击", upDesc: "13+体魄×1.5 伤害，30% 暴击（×1.6）",
        upFx: { dmg: 13, dmgAttr: 1.5, crit: 30 },
      },
    ],
  },
  reader: {
    key: "reader",
    name: "读运者",
    seq8: "盗火者",
    road: "门途径",
    motto: "「所有的门，本质都是一道等待被读出的咒语。」",
    desc: "能读懂空间「门」之韵律的人。墙、窗、上锁的抽屉——只要有边界，就有门。代价是：你越习惯穿行，越分不清哪一边才是「真实」的那一侧。",
    bonus: { inspiration: 2, will: 2, physique: 1, maxSp: 10, sp: 10, maxSanity: 4 },
    passive: { name: "穿门之识", desc: "被动：剧情中可识破并打开隐藏的「门」；战斗首回合闪避+20%。" },
    drinkNode: "c2_drink_reader",
    flavor: "读运者的魔药像一汪倒映着无数门扉的银水，每一滴里都映着一扇不同的门——有的通往你熟悉的地方，有的通往你不该去的地方。",
    abilities: [
      {
        key: "phantom_step", name: "虚相穿门", desc: "化作一缕银雾穿过敌人防御：8+灵感×1.1 伤害（无视闪避），并令自身闪避+20%，2回合",
        sp: 5, fx: { dmg: 8, dmgAttr: 1.1, dmgAttrKey: "inspiration", dodgeUp: 20, dodgeTurns: 2 },
        upName: "裂隙穿梭", upDesc: "12+灵感×1.4 伤害（无视闪避），闪避+30%/2回合",
        upFx: { dmg: 12, dmgAttr: 1.4, dodgeUp: 30, dodgeTurns: 2 },
      },
      {
        key: "pilfer_flame", name: "盗火", desc: "从敌人身上「偷」走一缕生命之火：回复8生命、4灵性，并使敌人攻击-3，2回合",
        sp: 4, fx: { healHp: 8, healSp: 4, eAtkDown: 3, eAtkTurns: 2 },
        upName: "窃运之火", upDesc: "回复12生命、6灵性，敌攻-4/2回合，并对其造成凋零3×2回合",
        upFx: { healHp: 12, healSp: 6, eAtkDown: 4, eAtkTurns: 2, dot: { v: 3, turns: 2 } },
      },
    ],
  },
};

export const PATHWAY_ORDER = ["seer", "sleepless", "collector", "pryer", "hunter", "reader"];

// ============ 物品 ============
export interface Item {
  id: string;
  name: string;
  desc: string;
  price?: number;
  usable?: "healHp" | "healSp" | "healSanity" | "combatDmg" | "combatBuff";
  v?: number;
  undeadBonus?: number;
  passive?: string;
  /** 途径限定：仅该途径可在战斗中激发此物的「扮演」效果。 */
  pathway?: string;
  /** 战斗增益：使用后赋予玩家的临时状态（路径专属消耗品用）。 */
  buff?: { dodgeUp?: number; dodgeTurns?: number; atkUp?: number; atkUpTurns?: number; shield?: number; vuln?: number; vulnTurns?: number; sanityCost?: number };
  /** 次要效果：物品同时附带的第二段效果（如静谧香膏的理智回复）。 */
  also?: { t: "hp" | "sp" | "sanity"; v: number };
}

export const ITEMS: Record<string, Item> = {
  old_revolver: { id: "old_revolver", name: "老式左轮手枪", desc: "卡尔·文森留下的遗物。战斗基础攻击+2。", passive: "atk2" },
  potion_heal: { id: "potion_heal", name: "治疗圣水", desc: "战斗中或平时使用，回复14点生命。", price: 3, usable: "healHp", v: 14 },
  potion_calm: { id: "potion_calm", name: "安眠香膏", desc: "老尼尔调配的膏剂，回复12点灵性。", price: 2, usable: "healSp", v: 12 },
  potion_mind: { id: "potion_mind", name: "宁神药剂", desc: "稳定濒临崩溃的心智，回复10点理智。", price: 3, usable: "healSanity", v: 10 },
  bullet_purify: { id: "bullet_purify", name: "净化子弹", desc: "铭刻太阳圣徽的子弹：战斗中造成14点伤害，对亡灵+8。", price: 4, usable: "combatDmg", v: 14, undeadBonus: 8 },
  charm_dog: { id: "charm_dog", name: "黑狗护符", desc: "被动：每次理智损失-1（最低1点）。传闻黑狗是黑夜的眷属。", price: 5, passive: "sanityShield" },
  coin_luck: { id: "coin_luck", name: "命运金币", desc: "购买后幸运+1。它永远以字面那一面朝上。", price: 6 },
  // ---- 新增物品 ----
  potion_full: { id: "potion_full", name: "司钟人的余烬药剂", desc: "钟楼仪式残余调配的稀有药剂：回复30点生命。", price: 6, usable: "healHp", v: 30 },
  potion_focus: { id: "potion_focus", name: "静谧香膏", desc: "教会秘方：回复20点灵性与6点理智。", price: 5, usable: "healSp", v: 20, also: { t: "sanity", v: 6 } },
  charm_anchor: { id: "charm_anchor", name: "罗塞尔的「锚」", desc: "被动：理智上限+10，且每次进入战斗理智损失减半（最低1）。穿越者前辈的告诫。", price: 10, passive: "anchor" },
  seal_card: { id: "seal_card", name: "封印物·零号封缄", desc: "战斗中使用：对敌人造成40点真实伤害（无视闪避），并令其易伤50%持续2回合。一次性的高阶封印弹药。", price: 9, usable: "combatDmg", v: 40, buff: { vuln: 50, vulnTurns: 2 } },
  ritual_dust: { id: "ritual_dust", name: "仪式灰烬", desc: "战斗中抛洒：对敌人造成18点伤害，对亡灵额外+10。浸血的钟楼灰烬。", price: 4, usable: "combatDmg", v: 18, undeadBonus: 10 },
  // ---- 武器进阶：序列越高，凡俗兵器越不够用 ----
  silver_dagger: { id: "silver_dagger", name: "银十字匕首", desc: "铭刻太阳圣徽的近战短兵。战斗基础攻击+4（替代左轮的+2）。对付亡灵更称手。", price: 7, passive: "atk4" },
  seal_revolver: { id: "seal_revolver", name: "封印左轮", desc: "教会密库调拨的封印武器，枪管刻满赫密斯语。战斗基础攻击+6（替代前两者）。", price: 12, passive: "atk6" },
  // ---- 途径专属消耗品：扮演的具象 ----
  seer_tarot: { id: "seer_tarot", name: "占卜塔罗·命运之轮", desc: "【占卜家专属】战斗中翻开：预知敌招，闪避+35%持续2回合。占卜的本质是先一步看见。", price: 5, usable: "combatBuff", pathway: "seer", buff: { dodgeUp: 35, dodgeTurns: 2 } },
  hunter_trap: { id: "hunter_trap", name: "猎人陷阱·缚兽索", desc: "【猎人专属】战斗中布下：敌人进入易伤+40%持续3回合。最强大的猎人，以猎物姿态出现。", price: 5, usable: "combatBuff", pathway: "hunter", buff: { vuln: 40, vulnTurns: 3 } },
  reader_scroll: { id: "reader_scroll", name: "门之卷轴·折返", desc: "【读运者专属】战斗中展开：自身闪避+25%持续2回合，并获得8点护盾。门在你身后折叠。", price: 5, usable: "combatBuff", pathway: "reader", buff: { dodgeUp: 25, dodgeTurns: 2, shield: 8 } },
  sleepless_incense: { id: "sleepless_incense", name: "不眠安息香", desc: "【不眠者专属】战斗中点燃：灵性充盈，自身攻击+4持续3回合，并获得6点护盾。守夜者从不需要真正睡着。", price: 5, usable: "combatBuff", pathway: "sleepless", buff: { atkUp: 4, atkUpTurns: 3, shield: 6 } },
  collector_ward: { id: "collector_ward", name: "收尸人的镇魂符", desc: "【收尸人专属】战斗中贴出：敌人易伤+30%持续3回合；若敌人是不亡者，额外引发凋零（每回合6点，持续2回合）。死亡是收尸人的本行。", price: 5, usable: "combatBuff", pathway: "collector", buff: { vuln: 30, vulnTurns: 3 } },
  pryer_grimoire: { id: "pryer_grimoire", name: "窥秘人的禁忌书页", desc: "【窥秘人专属】战斗中诵读：以知识为刃，自身攻击+5持续2回合，代价是理智-4。知识就是力量，字面意义上。", price: 5, usable: "combatBuff", pathway: "pryer", buff: { atkUp: 5, atkUpTurns: 2, sanityCost: 4 } },
};

// ============ 敌人 ============
export interface EnemyMove {
  name: string;
  msg: string;
  dmg?: number;
  sanity?: number;
  bleed?: number; // 对玩家造成持续流血（每回合伤害）
  bleedTurns?: number;
  w: number; // 权重
  minTurn?: number;
  belowHalf?: boolean; // 半血后解锁
}

export interface Enemy {
  key: string;
  name: string;
  title: string;
  hp: number;
  atk: number;
  dodge: number; // 被击中率的反向（玩家miss率%）
  undead?: boolean;
  sanitySight?: number; // 初见理智损失
  intro: string;
  moves: EnemyMove[];
  loot: Effect[];
  digest: number; // 胜利后消化度
}

export const ENEMIES: Record<string, Enemy> = {
  thug: {
    key: "thug",
    name: "入室的黑影",
    title: "受雇的打手",
    hp: 20, atk: 5, dodge: 5,
    intro: "黑影从窗台翻入，蒙面布上方是一双贪婪而紧张的眼睛。他手里的短棍在月光下泛着汗光。",
    moves: [
      { name: "短棍横扫", msg: "黑影抡圆短棍横扫过来", dmg: 5, w: 3 },
      { name: "膝撞", msg: "他突然欺近，膝盖狠狠顶出", dmg: 7, w: 2 },
      { name: "犹豫", msg: "他警惕地后退半步，打量着你", w: 1 },
    ],
    loot: [{ t: "pounds", v: 2 }],
    digest: 4,
  },
  wraith: {
    key: "wraith",
    name: "徘徊的怨魂",
    title: "铁十字街凶宅的死者",
    hp: 26, atk: 6, dodge: 15, undead: true, sanitySight: 5,
    intro: "黑暗里浮起一个半透明的人形。它的脖子以不自然的角度歪着，眼球翻白，湿漉漉的怨气像雾一样淌下来。",
    moves: [
      { name: "怨念尖啸", msg: "怨魂发出直击灵魂的尖啸", dmg: 3, sanity: 4, w: 2 },
      { name: "冰冷抓挠", msg: "青白的手爪带着阴冷的风抓来", dmg: 7, w: 3 },
      { name: "附身失败", msg: "它试图钻进你的身体，被你的灵性弹开", sanity: 2, w: 1 },
    ],
    loot: [{ t: "pounds", v: 3 }, { t: "flag", k: "wraith_down", v: 1 }],
    digest: 8,
  },
  cultist: {
    key: "cultist",
    name: "密修会杀手",
    title: "隐秘组织的獠牙",
    hp: 32, atk: 7, dodge: 10,
    intro: "斗篷男人从阴影里站起身，指间一柄涂着墨绿毒液的匕首。他的眼神平静得像在祷告——为猎物祷告。",
    moves: [
      { name: "毒刃连刺", msg: "匕首化作两道绿光刺来", dmg: 7, w: 3 },
      { name: "淬毒一击", msg: "刀尖掠过伤口，毒素渗入血脉", dmg: 5, sanity: 2, bleed: 3, bleedTurns: 3, w: 2 },
      { name: "阴影滑步", msg: "他的身形忽然模糊，垫步侧移", w: 1 },
    ],
    loot: [{ t: "pounds", v: 5 }, { t: "item", k: "potion_heal", v: 1 }],
    digest: 8,
  },
  deacon: {
    key: "deacon",
    name: "密修会执事",
    title: "序列8的非凡者",
    hp: 40, atk: 8, dodge: 12, sanitySight: 4,
    intro: "面具人缓步走下祭坛，灰色的雾气在他周身缭绕。仅仅被他的目光扫过，你的太阳穴就突突作痛——他序列比你高。",
    moves: [
      { name: "灰雾鞭笞", msg: "灰雾凝成的长鞭抽裂空气", dmg: 9, w: 3 },
      { name: "诡秘低语", msg: "他念出一段不该存在的音节，你的耳膜嗡鸣", dmg: 4, sanity: 4, w: 2 },
      { name: "雾遁", msg: "他溶入灰雾，下一击将难以命中", w: 1 },
    ],
    loot: [{ t: "pounds", v: 8 }],
    digest: 10,
  },
  shadow: {
    key: "shadow",
    name: "安提哥努斯的残影",
    title: "被污染的古籍守卫",
    hp: 58, atk: 9, dodge: 18, undead: true, sanitySight: 10,
    intro: "笔记上方的空气扭曲起来。无数张重叠的人脸在黑暗里睁开，那是安提哥努斯家族百年来所有亡灵的缝合——它只有一句话，用几百个声音同时说：把……笔记……留下……",
    moves: [
      { name: "恐怖凝视", msg: "数百只眼睛同时看向你", dmg: 3, sanity: 6, w: 3 },
      { name: "暗影缝合", msg: "黑色的手臂从阴影里增生、抓挠", dmg: 10, w: 3 },
      { name: "怨灵狂潮", msg: "人脸组成的浪潮覆压而下", dmg: 7, sanity: 3, w: 2 },
      { name: "绝望喷发", msg: "它发出所有亡者生前的惨叫——那声音不是从耳朵，而是从骨头里响起的", dmg: 12, sanity: 5, w: 2, belowHalf: true },
    ],
    loot: [{ t: "flag", k: "boss_down", v: 1 }],
    digest: 14,
  },
  drunk: {
    key: "drunk",
    name: "码头的醉汉",
    title: "膝盖以下都是麻烦",
    hp: 14, atk: 4, dodge: 0,
    intro: "醉汉挥舞着半截酒瓶，满身劣质金酒的气味，舌头大得像个红鲱鱼：「外、外乡人！你的钱袋……嗝……看起来很孤单！」",
    moves: [
      { name: "酒瓶挥舞", msg: "他把碎酒瓶挥得呼呼作响", dmg: 4, w: 3 },
      { name: "踉跄扑击", msg: "他整个人带着酒气扑过来", dmg: 6, w: 1 },
      { name: "呕吐预警", msg: "他扶着墙干呕起来，露出了巨大破绽", w: 2 },
    ],
    loot: [{ t: "pounds", v: 1 }],
    digest: 2,
  },
  // ---- 第三章之后新增敌人 ----
  hound: {
    key: "hound",
    name: "月影犬",
    title: "被仪式扭曲的看门兽",
    hp: 30, atk: 7, dodge: 20, undead: true, sanitySight: 4,
    intro: "钟楼台阶上伏着一只瘦骨嶙峋的黑犬。它抬起头，脸上却没有眼鼻的位置——只有一张咧到耳根的、布满人齿的嘴。它「认出」了你身上的活人气息。",
    moves: [
      { name: "阴影撕咬", msg: "月影犬无声扑来，利齿咬住手臂", dmg: 8, w: 3 },
      { name: "哀嚎", msg: "它仰头发出不属于任何活物的嚎叫", dmg: 3, sanity: 5, w: 2 },
      { name: "诡影分身", msg: "它分裂成两道黑影绕行，你无法锁定真身", w: 1 },
    ],
    loot: [{ t: "pounds", v: 3 }, { t: "flag", k: "hound_down", v: 1 }],
    digest: 7,
  },
  bellkeeper: {
    key: "bellkeeper",
    name: "司钟人",
    title: "三十年未下钟楼的守塔人",
    hp: 44, atk: 8, dodge: 8, sanitySight: 6,
    intro: "钟楼顶层，一个枯瘦的人形吊在巨大的铜钟之下。他已经被钟绳勒进肉里，与钟融为一体。你进门时，他缓缓睁眼——瞳孔里倒映着一座不属于这个世界的钟楼。",
    moves: [
      { name: "铜钟震荡", msg: "他拉动钟绳，沉闷的钟声震得你耳膜渗血", dmg: 7, sanity: 4, w: 3 },
      { name: "绳索绞缠", msg: "浸血的钟绳如活蛇般缠向你的咽喉", dmg: 9, w: 2 },
      { name: "回溯之声", msg: "他用三十年前的声音喊出已死之人的名字", sanity: 6, w: 2, minTurn: 2 },
    ],
    loot: [{ t: "pounds", v: 6 }, { t: "item", k: "charm_dog", v: 1 }],
    digest: 10,
  },
  beast: {
    key: "beast",
    name: "绯红之兽",
    title: "舞会中央的活体仪式",
    hp: 70, atk: 10, dodge: 14, undead: false, sanitySight: 12,
    intro: "舞池正中，宾客们的绯红假面飘上半空，汇聚成一尊由无数面具拼成的兽形——鹿角、狮口、蝶翼，每一片鳞甲都是一张尖叫的人脸。这是密修会献祭整场舞会唤来的「器皿」。",
    moves: [
      { name: "面具风暴", msg: "数百张假面如刀片般旋转切割", dmg: 11, w: 3 },
      { name: "绯红凝视", msg: "兽首万千瞳孔同时锁住你", dmg: 5, sanity: 6, w: 2 },
      { name: "吞噬一舞", msg: "它张开狮口，将一名宾客的影子连皮带骨吞下", dmg: 8, sanity: 3, w: 2 },
      { name: "假面反噬", msg: "它体表的宾客发出齐声惨叫，力量反噬自身", dmg: 0, w: 1, belowHalf: true },
    ],
    loot: [{ t: "pounds", v: 10 }, { t: "flag", k: "beast_down", v: 1 }],
    digest: 16,
  },
  master: {
    key: "master",
    name: "密修会·雾衣大师",
    title: "序列6的秘偶操纵者",
    hp: 96, atk: 12, dodge: 18, sanitySight: 14,
    intro: "雾衣大师从假面兽的余烬中走出——不，是「滑」出来的，仿佛空间在他脚下折叠。他抬手，你的影子竟然违背你地动了一下。「了不起的小值夜者，」他的声音直接在颅骨内响起，「让我看看，你的线有多长。」",
    moves: [
      { name: "秘偶提线", msg: "你的影子被无形之线拉扯，四肢不受控地抽搐", dmg: 10, sanity: 5, w: 3 },
      { name: "雾刃千割", msg: "灰雾凝成无数薄刃，把你切成一幅血画", dmg: 13, bleed: 3, bleedTurns: 3, w: 2 },
      { name: "记忆窃取", msg: "他探进你的意识，偷走一段关于「家」的记忆", sanity: 8, w: 2, minTurn: 2 },
      { name: "同构", msg: "他试图让你也成为他的秘偶——你咬碎舌尖才挣脱", dmg: 6, sanity: 7, w: 1, belowHalf: true },
    ],
    loot: [{ t: "pounds", v: 14 }, { t: "flag", k: "master_down", v: 1 }, { t: "item", k: "potion_mind", v: 2 }],
    digest: 22,
  },
  // ---- 铁十字街连环失踪案 支线敌人 ----
  mistthief: {
    key: "mistthief",
    name: "雾影窃贼",
    title: "穿行于墙缝的影子",
    hp: 36, atk: 7, dodge: 28, sanitySight: 5,
    intro: "巷底，一团比夜色更浓的影子从墙缝里「渗」出来。它没有固定的形状，只在你眨眼的瞬间逼近半步——它想从你身上「偷」走什么，也许是钱袋，也许是更不该被偷走的东西。",
    moves: [
      { name: "影刃偷袭", msg: "影子凝成一片薄刃，从你最薄弱的角度切入", dmg: 8, w: 3 },
      { name: "穿身掠夺", msg: "它径直穿过你的身体，顺手牵走一缕气息", dmg: 4, sanity: 4, w: 2 },
      { name: "雾遁", msg: "它溶回墙缝，你几乎找不到它的轮廓", w: 2 },
      { name: "窃火反噬", msg: "它偷得太多，胸口那点偷来的火烫伤了它自己", dmg: 0, w: 1, belowHalf: true },
    ],
    loot: [{ t: "pounds", v: 4 }, { t: "flag", k: "thief_down", v: 1 }, { t: "item", k: "potion_calm", v: 1 }],
    digest: 9,
  },
  // ---- 第二章·值夜者巡逻偶遇敌人 ----
  mugger: {
    key: "mugger",
    name: "铁十字街的剪径贼",
    title: "趁夜行凶的小毛贼",
    hp: 18, atk: 5, dodge: 8,
    intro: "巷口窜出一个裹着破风衣的瘦子，手里攥着一把生锈的折刀。他显然没料到值夜者的制服在夜里也反着微光——刀尖抖了一下，却没退。",
    moves: [
      { name: "虚晃一刀", msg: "贼人腕子一抖，折刀虚虚划来", dmg: 4, w: 3 },
      { name: "贴身抢包", msg: "他猛地欺身，去拽你的钱袋", dmg: 3, w: 2 },
      { name: "夺路", msg: "他虚晃一招，转身要跑", w: 1 },
    ],
    loot: [{ t: "pounds", v: 2 }],
    digest: 3,
  },
  smuggler: {
    key: "smuggler",
    name: "码头的私盐贩子",
    title: "见不得光的运货人",
    hp: 24, atk: 6, dodge: 6,
    intro: "盐鳍鱼酒馆后栈道，一个肩头沾满盐霜的壮汉挡住去路。他手里是一截包铁的船桨，身后堆着几只不该出现在廷根港的木箱。「值夜者？今晚谁也别想看箱子里是什么。」",
    moves: [
      { name: "包铁横桨", msg: "船桨带着海腥气横扫腰间", dmg: 6, w: 3 },
      { name: "盐砂扬面", msg: "他抓起一把粗盐砂迎面撒来", dmg: 3, w: 2 },
      { name: "推箱阻挡", msg: "他把货箱一脚踹倒，挡在身前", w: 1 },
    ],
    loot: [{ t: "pounds", v: 3 }, { t: "item", k: "potion_heal", v: 1 }],
    digest: 5,
  },
  // ---- 第四章·钟楼支线敌人 ----
  puppet: {
    key: "puppet",
    name: "钟楼的发条秘偶",
    title: "被遗弃的人偶仪式残骸",
    hp: 34, atk: 7, dodge: 10, undead: true, sanitySight: 4,
    intro: "钟楼二层堆杂物的角落里，一具木与铜丝扎成的人偶自行站了起来，关节嘎吱作响。它没有脸，胸口却嵌着一枚锈蚀的齿轮——像一颗还在跳的心。它显然是某个被放弃的仪式留下的残骸，但残骸也会伤人。",
    moves: [
      { name: "齿轮拳击", msg: "人偶的铜拳带着机括声砸来", dmg: 7, w: 3 },
      { name: "发条缠绕", msg: "它胸口弹出更多铜丝，缠向你的手腕", dmg: 5, bleed: 2, bleedTurns: 3, w: 2 },
      { name: "残骸抽搐", msg: "它诡异地抽搐一下，仿佛在回忆自己曾是谁", w: 1 },
    ],
    loot: [{ t: "pounds", v: 4 }, { t: "flag", k: "puppet_down", v: 1 }],
    digest: 6,
  },
  // ---- 第五章·舞会宾客魔物 ----
  masquer: {
    key: "masquer",
    name: "失控的绯红宾客",
    title: "被舞会仪式裹挟的失控者",
    hp: 42, atk: 8, dodge: 12, sanitySight: 6,
    intro: "舞池边缘，一位戴着猩红长喙假面的宾客踉跄过来，礼服下伸出多余的、不属于人类的手臂。他还没完全失控——眼里残留着求救的光，但嘴已在念不属于他的祷词。",
    moves: [
      { name: "醉步扑击", msg: "宾客以舞步的节奏扑来，多余的手臂乱抓", dmg: 8, bleed: 2, bleedTurns: 2, w: 3 },
      { name: "假面低语", msg: "他的长喙假面里渗出一段祷词，你的太阳穴发紧", dmg: 3, sanity: 4, w: 2 },
      { name: "挣扎清醒", msg: "他猛地一颤，短暂夺回了自己的身体", w: 1 },
      { name: "彻底失控", msg: "最后的人性被吞没，他发出非人的嘶吼扑来", dmg: 10, w: 2, belowHalf: true },
    ],
    loot: [{ t: "pounds", v: 5 }, { t: "item", k: "potion_mind", v: 1 }],
    digest: 8,
  },
};
