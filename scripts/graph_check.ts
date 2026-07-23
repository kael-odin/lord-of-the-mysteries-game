// 一次性图完整性检查：所有 next / check.pass / check.fail / combat.winNext / combat.loseNext 目标必须解析到存在的节点。
import { ALL_NODES, STORY_MAP } from "../src/lib/game/story";
import { ENEMIES } from "../src/lib/game/data";

const nodeIds = new Set(Object.keys(STORY_MAP));
const unresolved: string[] = [];
let checked = 0;

for (const n of ALL_NODES) {
  for (const c of n.choices) {
    if (c.next) {
      checked++;
      if (!nodeIds.has(c.next)) unresolved.push(`${n.id}.choice.next -> ${c.next}`);
    }
    if (c.check) {
      checked++;
      if (!nodeIds.has(c.check.pass)) unresolved.push(`${n.id}.check.pass -> ${c.check.pass}`);
      checked++;
      if (!nodeIds.has(c.check.fail)) unresolved.push(`${n.id}.check.fail -> ${c.check.fail}`);
    }
    if (c.combat) {
      checked++;
      if (!ENEMIES[c.combat]) unresolved.push(`${n.id}.combat enemy -> ${c.combat}`);
      if (c.winNext) { checked++; if (!nodeIds.has(c.winNext)) unresolved.push(`${n.id}.winNext -> ${c.winNext}`); }
      // loseNext 可选，缺省走 ending_death，但若显式给出则必须存在
      if (c.loseNext) { checked++; if (!nodeIds.has(c.loseNext)) unresolved.push(`${n.id}.loseNext -> ${c.loseNext}`); }
    }
  }
}

console.log(`Nodes: ${ALL_NODES.length} | Resolved targets checked: ${checked} | Unresolved: ${unresolved.length}`);
if (unresolved.length) {
  console.log("UNRESOLVED:");
  for (const u of unresolved) console.log("  " + u);
  process.exit(1);
}
console.log("OK: graph integrity verified.");
