// ============ 核心类型 ============
export type AttrKey = "physique" | "inspiration" | "will";

export interface Attrs {
  physique: number; // 体魄
  inspiration: number; // 灵感
  will: number; // 意志
}

// 效果指令：t=作用对象 v=数值 k=目标(item/flag/attr名)
export interface Effect {
  t: "hp" | "sp" | "sanity" | "digestion" | "pounds" | "item" | "flag" | "attr" | "maxHp" | "maxSp" | "maxSanity" | "luck";
  v: number;
  k?: string;
}

export interface Req {
  flag?: string;
  flagVal?: number;
  item?: string;
  pathway?: string;
  attr?: { k: AttrKey; min: number };
  minPounds?: number;
  seq?: number;
  hint?: string; // 未满足时显示的提示
}

export interface Check {
  attr: AttrKey | "luck";
  dc: number;
  pass: string;
  passEffects?: Effect[];
  fail: string;
  failEffects?: Effect[];
  label: string;
}

export interface Choice {
  text: string;
  sub?: string;
  next?: string;
  effects?: Effect[];
  check?: Check;
  combat?: string; // 敌人key
  winNext?: string; // 战斗胜利后节点
  loseNext?: string; // 战败节点（默认 ending_death）
  req?: Req;
  once?: string; // flag名：选过后隐藏
  hidden?: Req; // 满足才显示
}

export type NodeType = "story" | "pathway" | "ending";

export interface StoryNode {
  id: string;
  chapter?: number;
  title?: string;
  art?: "city" | "fog" | "ritual" | "none";
  text: string[]; // 支持 {name} 占位
  onEnter?: Effect[];
  choices: Choice[];
  type?: NodeType;
  endingId?: string;
  endingTitle?: string;
  endingDesc?: string;
}

export interface GameState {
  playerId: string;
  name: string;
  pathway: string | null;
  seq: number;
  hp: number;
  sp: number;
  sanity: number;
  maxHp: number;
  maxSp: number;
  maxSanity: number;
  digestion: number; // 0-100
  pounds: number;
  luck: number;
  attrs: Attrs;
  inv: Record<string, number>;
  flags: Record<string, number>;
  nodeId: string;
  chapter: number;
  rounds: number; // 经历节点数（存档展示）
}

// ============ 战斗 ============
export interface CombatLogEntry {
  side: "player" | "enemy" | "sys";
  text: string;
}

export interface CombatState {
  enemyKey: string;
  winNext: string;
  loseNext: string;
  ehp: number;
  ehpMax: number;
  shield: number;
  atkUp: number;
  atkUpTurns: number;
  dodgeUp: number;
  dodgeTurns: number;
  vuln: number; // 敌人受到的伤害+%
  vulnTurns: number;
  eAtkDown: number;
  eAtkTurns: number;
  dot: number;
  dotTurns: number;
  pDot: number; // 玩家受到的持续流血
  pDotTurns: number;
  guard: number; // 防御下回合提供的额外闪避%
  playerHp: number;
  playerSp: number;
  playerSanity: number;
  turn: number;
  over: boolean;
  won: boolean;
  log: CombatLogEntry[];
  shake: number; // 用于触发动画
}
