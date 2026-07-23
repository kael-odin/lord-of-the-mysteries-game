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

export const ENDINGS: Record<string, { title: string; tone: "gold" | "red" | "gray" | "green" | "purple" }> = {
  fool: { title: "灰雾之邀", tone: "gold" },
  knowledge: { title: "博学的代价", tone: "gray" },
  shikong: { title: "失控", tone: "red" },
  death: { title: "长眠", tone: "gray" },
  civilian: { title: "平凡即坟墓", tone: "green" },
  // 第五章新结局
  fool2: { title: "灰雾的第二次邀约", tone: "gold" },
  usurper: { title: "篡夺者", tone: "purple" },
  survivor: { title: "幸存者", tone: "green" },
  anchor: { title: "锚", tone: "gold" },
  hunter_legend: { title: "廷根之狼", tone: "red" },
  martyr: { title: "殉锚", tone: "purple" },
};

export const ALL_ENDING_IDS = Object.keys(ENDINGS);

export const CHAPTER_TITLES: Record<number, string> = {
  1: "第一章 · 苏醒",
  2: "第二章 · 值夜者",
  3: "第三章 · 安提哥努斯的阴影",
  4: "第四章 · 钟楼失踪案",
  5: "第五章 · 绯红假面舞会",
};
