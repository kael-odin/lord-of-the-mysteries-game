import type { StoryNode } from "./types";
import { STORY_1 } from "./story1";
import { STORY_2 } from "./story2";
import { STORY_3 } from "./story3";
import { STORY_4 } from "./story4";

export const ALL_NODES: StoryNode[] = [...STORY_1, ...STORY_2, ...STORY_3, ...STORY_4];

export const STORY_MAP: Record<string, StoryNode> = Object.fromEntries(
  ALL_NODES.map((n) => [n.id, n]),
);

export function getNode(id: string): StoryNode {
  const n = STORY_MAP[id];
  if (!n) {
    return {
      id: "missing",
      art: "city",
      title: "迷失之雾",
      text: [`雾气浓得化不开……（剧情节点 "${id}" 走丢了）`],
      choices: [{ text: "回到廷根的街头", next: "c2_hub" }],
    };
  }
  return n;
}

export const ENDINGS: Record<string, { title: string; tone: "gold" | "red" | "gray" | "green" | "purple"; hint?: string }> = {
  fool: { title: "灰雾之邀", tone: "gold", hint: "守护廷根，守住自己——祂记下了你的名字。" },
  knowledge: { title: "博学的代价", tone: "gray", hint: "你窥见了一页不该读的纸。知识烙进了灵魂。" },
  shikong: { title: "失控", tone: "red", hint: "理智的堤坝崩塌。你成了被猎杀的东西。" },
  death: { title: "长眠", tone: "gray", hint: "你倒在了守护廷根的路上。墓碑很小，但足够干净。" },
  civilian: { title: "平凡即坟墓", tone: "green", hint: "在成为非凡者之前，你已先被凡俗吞没。" },
  // 第四章专属结局
  bellkeeper: { title: "第三十一年", tone: "gray", hint: "你接下钟绳，把自己钉成了新的锚。" },
  // 第五章新结局
  fool2: { title: "灰雾的第二次邀约", tone: "gold", hint: "两次拒绝力量，两次守住职责。第二十三张椅子为你留着。" },
  usurper: { title: "篡夺者", tone: "purple", hint: "你收下了第四纪的力量。你是新的器皿。" },
  survivor: { title: "幸存者", tone: "green", hint: "不贪功，不揽险。活着，本身就是胜利。" },
  anchor: { title: "锚", tone: "gold", hint: "你用前辈的锚，把力量与灵魂绑定。你是廷根新的司钟人。" },
  hunter_legend: { title: "廷根之狼", tone: "red", hint: "以猎人之道，你猎杀了舞会上最强的存在。" },
  martyr: { title: "殉锚", tone: "purple", hint: "你的容器没能撑住三分钟。你碎了，廷根却保住了。" },
  nightwatcher: { title: "廷根的守夜人", tone: "gold", hint: "两桩悬案俱破，宾客存活。你把扮演刻进了骨血。" },
};

export const ALL_ENDING_IDS = Object.keys(ENDINGS);

export const CHAPTER_TITLES: Record<number, string> = {
  1: "第一章 · 苏醒",
  2: "第二章 · 值夜者",
  3: "第三章 · 安提哥努斯的阴影",
  4: "第四章 · 钟楼失踪案",
  5: "第五章 · 绯红假面舞会",
};
