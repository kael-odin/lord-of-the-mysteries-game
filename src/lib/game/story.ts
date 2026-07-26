import type { StoryNode } from "./types";
import { STORY_1 } from "./story1";
import { STORY_2 } from "./story2";
import { STORY_3 } from "./story3";
import { STORY_4 } from "./story4";
import { STORY_5 } from "./story5";
import { STORY_6 } from "./story6";
import { STORY_7 } from "./story7";
import { STORY_8 } from "./story8";
import { STORY_9 } from "./story9";
import { STORY_10 } from "./story10";
import { STORY_11 } from "./story11";
import { STORY_12 } from "./story12";
import { STORY_13 } from "./story13";
import { STORY_14 } from "./story14";
import { STORY_15 } from "./story15";
import { STORY_16 } from "./story16";
import { STORY_17 } from "./story17";
import { STORY_18 } from "./story18";
import { STORY_19 } from "./story19";
import { STORY_20 } from "./story20";
import { STORY_21 } from "./story21";
import { STORY_22 } from "./story22";
import { STORY_23 } from "./story23";
import { STORY_24 } from "./story24";
import { STORY_25 } from "./story25";
import { STORY_26 } from "./story26";
import { STORY_27 } from "./story27";
import { STORY_28 } from "./story28";

export const ALL_NODES: StoryNode[] = [...STORY_1, ...STORY_2, ...STORY_3, ...STORY_4, ...STORY_5, ...STORY_6, ...STORY_7, ...STORY_8, ...STORY_9, ...STORY_10, ...STORY_11, ...STORY_12, ...STORY_13, ...STORY_14, ...STORY_15, ...STORY_16, ...STORY_17, ...STORY_18, ...STORY_19, ...STORY_20, ...STORY_21, ...STORY_22, ...STORY_23, ...STORY_24, ...STORY_25, ...STORY_26, ...STORY_27, ...STORY_28];

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
  // 第七章新结局
  fogbreaker: { title: "破雾者", tone: "gold", hint: "三日大雾的源头被你斩断，灰雾之上第一次朝你致意。第二十三张椅子，为你拉开。" },
  // 第八章新结局
  chair_seated: { title: "第二十三张椅子", tone: "gold", hint: "你坐稳了那张椅子。灰雾之上，塔罗会，正式有了你的代号。" },
  // 第九章新结局
  tidebreaker: { title: "破潮者", tone: "gold", hint: "你停了海里那东西。两枚铜币并排在扶手上——塔罗会，开始记住你了。" },
  // 第十章新结局
  namekeeper: { title: "守名者", tone: "gold", hint: "你停了北陆那东西。三枚铜币并排在扶手上——塔罗会，开始信任你了。" },
  // 第十一章新结局
  waykeeper: { title: "守向者", tone: "gold", hint: "你停了南港那东西。四枚铜币并排在扶手上——塔罗会，开始托付你了。" },
  // 第十二章新结局
  rootkeeper: { title: "守根者", tone: "gold", hint: "你停了旧都那东西。五枚铜币并排在扶手上——塔罗会，开始依靠你了。" },
  // 第十三章新结局
  personkeeper: { title: "守人者", tone: "gold", hint: "你停了骨冢那东西。六枚铜币并排在扶手上——塔罗会，开始倚仗你了。" },
  // 第十四章新结局（第三卷·合）
  truthkeeper: { title: "守真者", tone: "gold", hint: "你停了镜心冢那东西。七枚铜币并排在扶手上——塔罗会，开始引路你了。第三卷，合。" },
  // 第十五章新结局（第四卷·开）
  homekeeper: { title: "守归者", tone: "gold", hint: "你停了归墟那东西。八枚铜币并排在扶手上——塔罗会的椅子，开始自己引路你了。第四卷，开。" },
  // 第十六章新结局（第四卷·承）
  namehomekeeper: { title: "守归名者", tone: "gold", hint: "你停了归名冢那东西。九枚铜币并排在扶手上——塔罗会的椅子，替你记归名了。第四卷，承。" },
  // 第十七章新结局（第四卷·转）——变奏章：无差事的一程，椅子在你没走路的时候也记你
  memorykeeper: { title: "守忆者", tone: "gold", hint: "你回廷根忆了三段旧。十枚铜币并排在扶手上——塔罗会的椅子，在你没走路的时候，也，记你一枚。第四卷，转。" },
  // 第十八章新结局（第四卷·合）——变奏章：此刻章，把此刻记成归处
  momentkeeper: { title: "守此刻者", tone: "gold", hint: "你回贝克兰德守了四个当下。十一枚铜币并排在扶手上——塔罗会的椅子，把你停的此刻，记成，你的归处。第四卷，合。" },
  // 第十九章新结局（第五卷·开）——变奏章：行路章，走自己的路
  roadwalker: { title: "行路者", tone: "gold", hint: "你从贝克兰德出发自选一条旧道走完第一程。十二枚铜币并排在扶手上——塔罗会的椅子，替你，记你自己走的路。第五卷，开。" },
  // 第二十章新结局（第五卷·承）——变奏章：同路章，与同路人同走一段
  samepath: { title: "同路者", tone: "gold", hint: "你与塔罗会同路人在岔口认出彼此同走一程共同认完一桩没散尽的余烬。十三枚铜币并排在扶手上——塔罗会的椅子，替你，记你与同路人同走的那段路。第五卷，承。" },
  // 第二十一章新结局（第五卷·转）——变奏章：各自章，与同路人分别后各自走一段
  eachpath: { title: "各自者", tone: "gold", hint: "你与塔罗会同路人在岔口分别后一个人自走一条没走过的旧道独自认完一桩没散尽的余烬。十四枚铜币并排在扶手上——塔罗会的椅子，替你，记你各自走的那段路。第五卷，转。" },
  // 第二十二章新结局（第五卷·合）——变奏章：自定章，自己定往何处去并认完一桩余烬
  selfpath: { title: "自定者", tone: "gold", hint: "你在塔罗会之外被派的差事之外自己定了往何处去独自认完一桩自己定要认的没散尽的余声。十五枚铜币并排在扶手上——塔罗会的椅子，替你，记你自己定的那段路。第五卷，合。" },
  // 第二十三章新结局（第六卷·开）——变奏章：认章，自己认出一桩灰雾里没被认出过的东西
  knowpath: { title: "认者", tone: "gold", hint: "你在塔罗会之外被派的差事之外走完定完的路之外自己认出一桩灰雾里没被叫出名字的没被认出过的东西。十六枚铜币并排在扶手上——塔罗会的椅子，替你，记你自己认出来的那张脸。第六卷，开。" },
  // 第二十四章新结局（第六卷·承）——变奏章：认名章，自己认出一个被忘了的名字
  nameknower: { title: "认名者", tone: "gold", hint: "你在塔罗会之外被派的差事之外走完定完的路之外认出没被叫出名字的东西之外自己认出一个被忘了名字的旧物重新叫出它的名字。十七枚铜币并排在扶手上——塔罗会的椅子，替你，记你认出来的那个名字。第六卷，承。" },
  // 第二十五章新结局（第六卷·转）——变奏章：认人章，自己认出一个被藏起来的人
  personknower: { title: "认人者", tone: "gold", hint: "你在塔罗会之外被派的差事之外走完定完的路之外认出没被叫出名字的东西之外认名被忘了名字的之外自己认出一个被藏起来的人把他认出来。十八枚铜币并排在扶手上——塔罗会的椅子，替你，记你认出来的那个人。第六卷，转。" },
  // 第二十六章新结局（第六卷·合）——变奏章：认心章，自己认出一颗被藏起来的心；主位合上第六卷
  heartknower: { title: "认心者", tone: "gold", hint: "你在塔罗会之外被派的差事之外走完定完的路之外认出没被叫出名字的东西之外认名被忘了名字的之外认人被藏起来的人之外自己认出一颗被藏起来的心把它认出来。十九枚铜币并排在扶手上——塔罗会的椅子，替你，记你认出来的那颗心。第六卷，合。" },
  // 第二十七章新结局（第七卷·开）——变奏章：留章，自己往灰雾里留一笔自己的；玩家自己翻开第七卷空白封皮
  leaver: { title: "留者", tone: "gold", hint: "你在塔罗会之外被派的差事之外走完定完的路之外认出没被叫出名字的东西之外认名被忘了名字的之外认人被藏起来的人之外认心被藏起来的心之外自己往灰雾里留一笔自己的把它留下。二十枚铜币并排在扶手上——塔罗会的椅子，替你，记你留下来的那一笔。第七卷，开。" },
  // 第二十八章新结局（第七卷·承）——变奏章：留名章，自己往灰雾里留一个名字
  nameleaver: { title: "留名者", tone: "gold", hint: "你在塔罗会之外被派的差事之外走完定完的路之外认出没被叫出名字的东西之外认名被忘了名字的之外认人被藏起来的人之外认心被藏起来的心之外留下一笔你的之外自己往灰雾里留一个名字把它留下。二十一枚铜币并排在扶手上——塔罗会的椅子，替你，记你留下来的那个名字。第七卷，承。" },
  roadleaver: { title: "留路者", tone: "gold", hint: "你在塔罗会之外被派的差事之外走完定完的路之外认出没被叫出名字的东西之外认名被忘了名字的之外认人被藏起来的人之外认心被藏起来的心之外留下一笔你的之外留下一个名字之外自己往灰雾里留一段路把它留下。二十二枚铜币并排在扶手上——塔罗会的椅子，替你，记你留下来的那段路。第七卷，转。" },
};

export const ALL_ENDING_IDS = Object.keys(ENDINGS);

export const CHAPTER_TITLES: Record<number, string> = {
  1: "第一章 · 苏醒",
  2: "第二章 · 值夜者",
  3: "第三章 · 安提哥努斯的阴影",
  4: "第四章 · 钟楼失踪案",
  5: "第五章 · 绯红假面舞会",
  6: "第六章 · 贝克兰德的雾",
  7: "第七章 · 大雾霾",
  8: "第八章 · 灰雾之上·塔罗会",
  9: "第九章 · 海上之城",
  10: "第十章 · 北陆·霜砚镇",
  11: "第十一章 · 南港归潮",
  12: "第十二章 · 旧都·回声",
  13: "第十三章 · 灰原骨冢·先人回响",
  14: "第十四章 · 灰雾深处·真我",
  15: "第十五章 · 灰雾最深处·归处",
  16: "第十六章 · 灰雾更深处·归名",
  17: "第十七章 · 灰雾之上·忆归",
  18: "第十八章 · 灰雾之上·归处",
  19: "第十九章 · 灰雾之下·行路",
  20: "第二十章 · 灰雾之下·同路",
  21: "第二十一章 · 灰雾之下·各自",
  22: "第二十二章 · 灰雾之下·自定",
  23: "第二十三章 · 灰雾之下·认",
  24: "第二十四章 · 灰雾之下·认名",
  25: "第二十五章 · 灰雾之下·认人",
  26: "第二十六章 · 灰雾之下·认心",
  27: "第二十七章 · 灰雾之下·留",
  28: "第二十八章 · 灰雾之下·留名",
  29: "第二十九章 · 灰雾之下·留路",
};
