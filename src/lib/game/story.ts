import type { StoryNode } from "./types";
import { STORY_1 } from "./story1";
import { STORY_2 } from "./story2";

export const ALL_NODES: StoryNode[] = [...STORY_1, ...STORY_2];

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

export const ENDINGS: Record<string, { title: string; tone: "gold" | "red" | "gray" | "green" }> = {
  fool: { title: "灰雾之邀", tone: "gold" },
  knowledge: { title: "博学的代价", tone: "gray" },
  shikong: { title: "失控", tone: "red" },
  death: { title: "长眠", tone: "gray" },
  civilian: { title: "平凡即坟墓", tone: "green" },
};

export const CHAPTER_TITLES: Record<number, string> = {
  1: "第一章 · 苏醒",
  2: "第二章 · 值夜者",
  3: "第三章 · 安提哥努斯的阴影",
};
