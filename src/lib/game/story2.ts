import type { StoryNode } from "./types";

// ============ 第三章：安提哥努斯的阴影 / 结局 ============
export const STORY_2: StoryNode[] = [
  {
    id: "c3_start",
    chapter: 3,
    art: "city",
    title: "风暴前夜",
    text: [
      "之后的半个月，你在值夜者的岗位上飞速成长。几起不大不小的超凡案件、无数次有意识的「扮演」，让魔药的消化度稳步攀升——你能感觉到，那道通往序列8的门，已经隐约可见。",
      "这天清晨，警署转来的一份口供让整个小队绷紧了神经：码头区一名走私犯落网后离奇暴毙于拘留所，尸体旁用血画着一圈环状的雾纹。",
      "邓恩把全小队召集到办公室，声音少见的凝重：「密修会——就是追查笔记的那个隐秘组织——已经潜进廷根了。他们的目标只有一个：安提哥努斯笔记。而笔记最后的线索……在你身上。」",
      "「今晚之前，我要全城的眼线都动起来。卡尔，你负责去码头区见我的线人『老鼠莫里』。其他人——」他揉了揉眉心，「我刚才说到哪了？」",
      "「说到全城眼线。」你、伦纳德和弗莱异口同声。",
    ],
    choices: [
      { text: "先去整备物资，再赴码头", sub: "磨刀不误砍柴工", next: "c3_hub" },
      { text: "直接动身去码头区", sub: "兵贵神速", next: "c3_informant" },
      {
        text: "「队长，那枚雾纹袖标……我早就见过。」", sub: "cuff_mark / bar_rumor：旧线索串上了",
        hidden: { flag: "cuff_mark", flagVal: 1, hint: " " },
        once: "fog_recalled",
        next: "c3_start", effects: [{ t: "digestion", v: 4 }, { t: "flag", k: "fog_recalled", v: 1 }],
      },
    ],
  },
  {
    id: "c3_hub",
    chapter: 3,
    art: "city",
    title: "临战整备",
    text: [
      "黑荆棘公司的空气里飘着红茶与枪油混合的气味。大战在即，你需要让状态与装备都达到巅峰——尤其是，如果魔药已经完全消化，序列8的大门就在眼前。",
    ],
    choices: [
      {
        text: "申请晋升序列8的仪式", sub: "消化度100%后可进行",
        hidden: { flag: "canAdvance", flagVal: 1, hint: "魔药尚未完全消化" },
        req: { seq: 9, hint: "你已完成晋升" },
        next: "c3_promote",
      },
      {
        text: "去恶龙酒吧的地下黑市采买", sub: "囤积保命物资",
        next: "c3_shop",
      },
      {
        text: "去圣赛琳娜教堂祈祷", sub: "捐献1镑，理智+14",
        req: { minPounds: 1, hint: "捐献1镑" },
        next: "c3_church", effects: [{ t: "pounds", v: -1 }, { t: "sanity", v: 14 }],
      },
      {
        text: "服用物资休整一番", sub: "喝一口邓恩的红茶：生命+8、灵性+6（一次）", once: "rested3",
        next: "c3_hub", effects: [{ t: "hp", v: 8 }, { t: "sp", v: 6 }],
      },
      {
        text: "接下「铁十字街连环失踪案」", sub: "可选支线：三条人命，一堵会吃人的墙", once: "took_missing_case",
        next: "arc_missing_start",
      },
      { text: "动身前往码头区（主线）", sub: "去见线人莫里", next: "c3_informant" },
    ],
  },
  {
    id: "c3_church",
    chapter: 3,
    art: "city",
    text: [
      "圣赛琳娜教堂依旧安静如深海。你在圣徽前端坐良久，感受着狂乱边缘的心智一点点落回平地。临走前，你对黑夜女神的圣徽无声道了个谢——虽然你还不太确定，自己该向哪一位祈祷。",
    ],
    choices: [{ text: "回到公司", next: "c3_hub" }],
  },
  {
    id: "c3_shop",
    chapter: 3,
    art: "city",
    title: "恶龙酒吧·地下黑市",
    text: [
      "戴单片眼镜的老摊主还认得你，金牙一闪：「哟，回头客！最近外头可不太平，老头子我的存货都被扫了一半——要买趁早。」",
    ],
    choices: [
      {
        text: "购买【治疗圣水】×1（3镑）", sub: "回复14点生命",
        req: { minPounds: 3, hint: "还差些金镑" },
        next: "c3_shop", effects: [{ t: "pounds", v: -3 }, { t: "item", k: "potion_heal", v: 1 }],
      },
      {
        text: "购买【安眠香膏】×1（2镑）", sub: "回复12点灵性",
        req: { minPounds: 2, hint: "还差些金镑" },
        next: "c3_shop", effects: [{ t: "pounds", v: -2 }, { t: "item", k: "potion_calm", v: 1 }],
      },
      {
        text: "购买【宁神药剂】×1（3镑）", sub: "回复10点理智",
        req: { minPounds: 3, hint: "还差些金镑" },
        next: "c3_shop", effects: [{ t: "pounds", v: -3 }, { t: "item", k: "potion_mind", v: 1 }],
      },
      {
        text: "购买【净化子弹】×1（4镑）", sub: "对亡灵有奇效",
        req: { minPounds: 4, hint: "还差些金镑" },
        next: "c3_shop", effects: [{ t: "pounds", v: -4 }, { t: "item", k: "bullet_purify", v: 1 }],
      },
      {
        text: "购买【黑狗护符】（5镑）", sub: "被动：理智损失-1（限购）", once: "bought_dog",
        req: { minPounds: 5, hint: "还差些金镑" },
        next: "c3_shop", effects: [{ t: "pounds", v: -5 }, { t: "item", k: "charm_dog", v: 1 }],
      },
      {
        text: "购买【命运金币】（6镑）", sub: "幸运+1（限购）", once: "bought_coin",
        req: { minPounds: 6, hint: "还差些金镑" },
        next: "c3_shop", effects: [{ t: "pounds", v: -6 }, { t: "luck", v: 1 }],
      },
      {
        text: "购买【银十字匕首】（7镑）", sub: "战斗基础攻击+4（替代左轮，限购）", once: "bought_dagger",
        req: { minPounds: 7, hint: "还差些金镑" },
        next: "c3_shop", effects: [{ t: "pounds", v: -7 }, { t: "item", k: "silver_dagger", v: 1 }],
      },
      {
        text: "购买【占卜塔罗·命运之轮】（5镑）", sub: "占卜家专属：战斗闪避+35%",
        hidden: { pathway: "seer" }, req: { minPounds: 5, hint: "还差些金镑" },
        next: "c3_shop", effects: [{ t: "pounds", v: -5 }, { t: "item", k: "seer_tarot", v: 1 }],
      },
      {
        text: "购买【猎人陷阱·缚兽索】（5镑）", sub: "猎人专属：敌易伤+40%",
        hidden: { pathway: "hunter" }, req: { minPounds: 5, hint: "还差些金镑" },
        next: "c3_shop", effects: [{ t: "pounds", v: -5 }, { t: "item", k: "hunter_trap", v: 1 }],
      },
      {
        text: "购买【门之卷轴·折返】（5镑）", sub: "读运者专属：闪避+25%并获护盾",
        hidden: { pathway: "reader" }, req: { minPounds: 5, hint: "还差些金镑" },
        next: "c3_shop", effects: [{ t: "pounds", v: -5 }, { t: "item", k: "reader_scroll", v: 1 }],
      },
      {
        text: "购买【不眠安息香】（5镑）", sub: "不眠者专属：攻击+4、护盾6",
        hidden: { pathway: "sleepless" }, req: { minPounds: 5, hint: "还差些金镑" },
        next: "c3_shop", effects: [{ t: "pounds", v: -5 }, { t: "item", k: "sleepless_incense", v: 1 }],
      },
      {
        text: "购买【收尸人的镇魂符】（5镑）", sub: "收尸人专属：亡灵易伤+50%（符面通用+25%）",
        hidden: { pathway: "collector" }, req: { minPounds: 5, hint: "还差些金镑" },
        next: "c3_shop", effects: [{ t: "pounds", v: -5 }, { t: "item", k: "collector_ward", v: 1 }],
      },
      {
        text: "购买【窥秘人的禁忌书页】（5镑）", sub: "窥秘人专属：攻击+5，代价理智-4",
        hidden: { pathway: "pryer" }, req: { minPounds: 5, hint: "还差些金镑" },
        next: "c3_shop", effects: [{ t: "pounds", v: -5 }, { t: "item", k: "pryer_grimoire", v: 1 }],
      },
      { text: "离开黑市", next: "c3_hub" },
    ],
  },
  {
    id: "c3_promote",
    chapter: 3,
    art: "ritual",
    title: "晋升仪式",
    text: [
      "你向邓恩提交了晋升申请。队长凝视你良久，灰眸里罕见地透出欣慰：「消化得这么快……长老们说得对，扮演法的时代回来了。」",
      "当夜，在黑荆棘公司地下最深处的炼金室里，黑夜圣徽的光辉如水漫过你的全身。你依照仪式，诵念、静立、然后饮下那支从教会密库中调拨来的序列8魔药。",
      "力量如温热的潮水冲刷四肢百骸。意识深处，一道新的门轰然洞开——",
      "你踏上了新的序列。",
    ],
    choices: [{ text: "感受新的力量", next: "c3_hub" }],
  },
  {
    id: "c3_informant",
    chapter: 3,
    art: "city",
    title: "老鼠莫里",
    text: [
      "码头区后巷的「盐鳍鱼」酒馆，空气里永远飘着炸鱼和劣质啤酒的酸味。线人莫里缩在最角落的卡座上，獐头鼠目，见到你赶紧招手。",
      "「长官，您可来了！」他左右张望，声音压得比耗子叫还低，「那帮戴雾袖标的，就藏在——」",
      "他的话只说了一半。因为你浑身的汗毛，毫无预兆地竖了起来。",
    ],
    choices: [
      {
        text: "顺着危机直觉猛然侧扑", sub: "灵感判定：杀意来自身后",
        check: {
          attr: "inspiration", dc: 13, label: "危机预感",
          pass: "c3_dodge", passEffects: [{ t: "flag", k: "ambush_seen", v: 1 }],
          fail: "c3_ambushed", failEffects: [{ t: "hp", v: -4 }],
        },
      },
    ],
  },
  {
    id: "c3_dodge",
    chapter: 3,
    art: "city",
    text: [
      "你拽着莫里向旁侧扑倒。几乎同一瞬间，一柄涂着墨绿毒液的匕首钉进你刚才坐的位置，尾翼还在嗡嗡轻颤。",
      "酒馆后门的阴影里，一个斗篷男人缓步走出，手里把玩着第二柄匕首。他拍了拍手，像在为你的反应鼓掌：「不错的直觉。不愧是『那具尸体』里爬出来的幸运儿。」",
      "「可惜，情报到此为止。」",
    ],
    choices: [
      { text: "拔枪迎战", combat: "cultist", winNext: "c3_deacon_info" },
    ],
  },
  {
    id: "c3_ambushed",
    chapter: 3,
    art: "city",
    text: [
      "你发觉迟了半拍——剧痛在腰侧炸开，一柄匕首擦着肋骨划过，所幸莫里吓得翻倒卡座，连带撞歪了杀手的第二击。",
      "斗篷男从阴影里踱出，毫无失手后的懊恼：「命真大。不过也没关系，反正——你今晚要交代在这里。」",
    ],
    choices: [
      { text: "忍痛反击", combat: "cultist", winNext: "c3_deacon_info" },
    ],
  },
  {
    id: "c3_deacon_info",
    chapter: 3,
    art: "city",
    title: "死亡供词",
    text: [
      "杀手倒下后，你从他怀里搜出一枚雾纹袖标、一张手绘地图，以及一小瓶还温着的血——地图标注的目的地是：北郊，霍克老宅。",
      "莫里瘫在桌子底下，哆哆嗦嗦地补充了最关键的半截话：「他、他们要买通看坟人……要在……要在月满之夜，用活人祭把『老祖宗的笔记』接引回来！」",
      "你抬头看了一眼窗外。绯红之月，今夜正圆。",
      "你用最快的速度赶回黑荆棘公司。邓恩听完，霍然起身：「伦纳德，弗莱，集结。卡尔——」他的灰眸定定地看着你，「你说的那个晋升申请，如果还没完成，have one last chance。满月之前，我们要么晋升，要么送命。」",
    ],
    choices: [
      {
        text: "申请晋升序列8的仪式", sub: "消化度100%后可进行",
        hidden: { flag: "canAdvance", flagVal: 1, hint: " " },
        req: { seq: 9, hint: " " },
        next: "c3_promote_late",
      },
      { text: "「出发。趁月亮还没升到最高处。」", next: "c3_mansion" },
    ],
  },
  {
    id: "c3_promote_late",
    chapter: 3,
    art: "ritual",
    title: "火焰旁的晋升",
    text: [
      "没有时间举行完整的仪式了。邓恩亲自为你护法，在炼金室的圣徽前，你饮下那支序列8的魔药，任由力量在血管里炸开——",
      "疼痛与狂喜同时抵达顶点。你睁开眼，世界已经换了一副模样。",
      "「走了。」伦纳德把子弹一枚枚按进枪膛，冲你勾了勾嘴角，「欢迎正式成为『怪物』，菜鸟。」",
    ],
    choices: [{ text: "出发，霍克老宅", next: "c3_mansion" }],
  },
  {
    id: "c3_mansion",
    chapter: 3,
    art: "ritual",
    title: "霍克老宅",
    text: [
      "北郊的霍克老宅已经荒废了六十年。爬满藤蔓的轮廓在绯红月光下像一具趴伏的巨兽骸骨。",
      "弗莱在宅外布下了封锁仪式，伦纳德负责两翼策应，而突入地下室——邪祭气息最浓的地方——的任务，落在你身上。邓恩在最后一刻按住你的肩：",
      "「记住，无论看见什么，都别直视太久。给我活着回来报销弹药费。」他顿了顿，「……这句是老尼尔让我转告的。我自己要说的是：多加小心。」",
      "你推开吱呀作响的黑色木门，一路下到宅邸最深处。血腥味越来越浓，石阶尽头透出摇曳的红光——笔架形的祭坛上，一本古旧的羊皮笔记悬浮在血色的法阵中央。祭坛前，一个戴着面具的灰袍人正高举双手诵念。",
      "听见你的脚步，他缓缓回头，声音像砂纸摩擦：「值夜者？来晚了一步。接引仪式已经完成了七成——」",
      "「那就用你的人头，补剩下三成。」",
    ],
    choices: [
      { text: "打断仪式", combat: "deacon", winNext: "c3_ritual_mid" },
      {
        text: "熄灭灯火，以不眠者之眼摸黑突入", sub: "【不眠者专属扮演】你本就属于长夜",
        req: { pathway: "sleepless", hint: "需要不眠者的夜视与耐性" },
        next: "c3_mansion_sleepless", effects: [{ t: "digestion", v: 10 }, { t: "sanity", v: 4 }, { t: "flag", k: "night_stalker", v: 1 }],
      },
    ],
  },
  {
    id: "c3_mansion_sleepless",
    chapter: 3,
    art: "ritual",
    text: [
      "你吹熄了手里最后一根火柴。对别人，这是把自己交给了黑暗；对你，黑暗才是最熟悉的同伴。",
      "不眠者的双眼在无光中自成光源。你贴着墙根滑行，避开了三道本会触发警报的符文，从执事诵念的死角绕到了祭坛侧后——他直到你拔枪的瞬间，才意识到屋里多了一个人。",
      "「你……什么时候——」",
      "「在你诵完第三遍的时候。」",
    ],
    choices: [
      { text: "趁其惊愕，一击破阵", sub: "执事已被夺先机", combat: "deacon", winNext: "c3_ritual_mid" },
    ],
  },
  {
    id: "c3_ritual_mid",
    chapter: 3,
    art: "ritual",
    title: "残影苏醒",
    onEnter: [{ t: "sanity", v: -4 }],
    text: [
      "执事倒在了祭坛之下，面具滑落，露出一张爬满灰色雾纹的脸。他咽气前死死盯着你，喉咙里挤出破碎的笑声：「你……以为……结束了吗……祭品……从来不是……我……」",
      "「是……你……们……」",
      "他咽气了。而法阵中的笔记，自行翻开了第一页。",
      "空气骤然凝固。书页上方的黑暗里，一双、十双、上百双浑浊的眼睛同时睁开。无数重叠的人脸在阴影中汇聚成形——那是安提哥努斯家族百年亡灵的缝合体，被仪式污染、被疯狂支配的「守卫」。",
      "几百个声音同时在你颅骨内侧响起：「把……笔记……留……下……」",
    ],
    choices: [
      { text: "直面家族的怨念", combat: "shadow", winNext: "c3_finale" },
    ],
  },
  {
    id: "c3_finale",
    chapter: 3,
    art: "ritual",
    title: "摊开的笔记",
    text: [
      "缝合的残影溃散为一地飞灰。地下室安静下来，只剩血阵的余温「滋滋」地蒸腾。",
      "安提哥努斯的笔记掉在祭坛边缘，摊开着。泛黄的书页上，古老的花体字在黑暗中微微发光，仿佛有生命般轻声呼吸。你能感觉到它在「招呼」你——只需要看一眼，就一眼，家谱的秘密、途径的隐秘、第四纪的真相，都将属于你。",
      "邓恩的声音从楼梯上方传来，还很遥远。此刻，这里只有你，和这本笔记。",
    ],
    choices: [
      {
        text: "用黑夜圣徽将笔记封印装匣", sub: "直面诱惑，恪守职责",
        next: "ending_fool", effects: [{ t: "flag", k: "sealed", v: 1 }],
      },
      {
        text: "忍不住，读上一页", sub: "需要灵感≥6……以及承担后果的勇气",
        req: { attr: { k: "inspiration", min: 6 }, hint: "灵感不足，你甚至读不懂它（这也许是好事）" },
        next: "ending_knowledge", effects: [{ t: "sanity", v: -15 }, { t: "attr", k: "inspiration", v: 2 }, { t: "flag", k: "forbidden", v: 1 }],
      },
      {
        text: "把它丢进祭火，彻底烧掉", sub: "意志判定：摧毁一件超凡物品",
        check: {
          attr: "will", dc: 14, label: "抵抗它的「挽留」",
          pass: "c3_burn_pass", passEffects: [{ t: "flag", k: "burned", v: 1 }],
          fail: "c3_burn_fail", failEffects: [{ t: "sanity", v: -20 }, { t: "hp", v: -6 }],
        },
      },
    ],
  },
  {
    id: "c3_burn_pass",
    chapter: 3,
    art: "ritual",
    text: [
      "你抓起笔记，在它能「蛊惑」你之前，狠狠按进了祭坛的血火。火焰轰然窜起三米高，书页间爆发出上百个声音重叠的凄厉尖啸——",
      "你咬紧牙关，一步不退，直到最后一页羊皮蜷曲成灰。",
      "尖啸止息。法阵的光芒彻底熄灭。你瘫坐在地，大口呼吸着没有疯狂的空气——你做到了，你亲手终结了这条害死卡尔、韦尔奇、娜娅和无数人的死亡链条。",
    ],
    choices: [{ text: "天，快亮了", next: "ending_fool" }],
  },
  {
    id: "c3_burn_fail",
    chapter: 3,
    art: "ritual",
    text: [
      "笔记入火的瞬间，一声直接来自颅骨内部的尖啸将你掀翻在地。幻象铺天盖地：燃烧的城堡、戴王冠的无面人、一条往天空延伸的灰雾长廊……",
      "你不知道自己是怎么撑过来的。等邓恩冲下石阶把你扶起时，笔记已经烧尽，而你的鼻腔和耳道里，都渗着细细的血线。",
      "「结束了。」队长把大衣披在你肩上，声音罕见地温和，「你做得很好，孩子。我们该回家了。」",
    ],
    choices: [{ text: "在队友的搀扶下走出黑暗", next: "ending_fool" }],
  },

  // ============ 结局 ============
  {
    id: "ending_fool",
    type: "ending",
    endingId: "fool",
    endingTitle: "灰雾之邀",
    endingDesc: "你守护了廷根，也守住了自己。而灰雾之上的存在，记住了你。",
    art: "fog",
    text: [
      "安提哥努斯事件后的第三个夜晚，你又梦到了那片灰雾。",
      "这一次，雾气为你让开了一条路——一直通向那座古老宫殿的青铜长桌。二十二张高背椅依然空着，唯有长桌尽头的主位上，不知何时坐着一道被层层灰雾包裹的模糊身影。",
      "祂的姿态慵懒而遥远，像一位翻阅过千万年时光的神明，正在随手翻看一页有趣的插图。",
      "「处理得不错。」祂的声音在你心底响起，温和中藏着玩味，「一个有趣的灵魂……而且，是『同类』的气息。」",
      "「记住这片灰雾吧。当廷根的迷雾再次升起，命运召唤你的时候——欢迎随时回来做客。到那时，这张桌子前，或许会坐满和你一样『有趣』的家伙。」",
      "你在黎明中醒来，掌心躺着一枚冰凉的、灰雾凝成的印记。窗外的廷根正在被晨光唤醒，蒸汽、汽笛、面包房开门的铃铛——人间烟火如故。",
      "只有你知道，自己的故事，才刚刚翻开扉页。",
      "（第一章·完。感谢你守护了廷根。）",
    ],
    choices: [],
  },
  {
    id: "ending_knowledge",
    type: "ending",
    endingId: "knowledge",
    endingTitle: "博学的代价",
    endingDesc: "你窥见了不该窥见的一页。知识烙进了你的灵魂，连同疯狂一起。",
    art: "fog",
    text: [
      "你没能忍住。",
      "那一页上记载的是安提哥努斯家族的「序列」图谱，以及一段关于「愚者」的、残缺不全的传说。文字入目的瞬间，它们像滚烫的烙铁印在你的灵魂上——你获得了知识，也获得了知识附赠的、永不愈合的伤口。",
      "邓恩找到你时，你正抱着笔记坐在祭坛边喃喃自语，念出一段段没人能破译的音节。队长用了一个星期，才把你从疯狂的边缘一点点拉回来。",
      "值夜者的档案里，你被记为「受到B级污染，观察中」。可某个深夜，当你望着镜中自己双眼深处那缕挥之不去的灰白时，你忽然听见一个温和的声音，从很远、又很近的地方响起：",
      "「你知道得太多，又不够多。有趣。」",
      "「等你『消化』完这一页——如果你还活得下来的话——再来找我聊聊吧。」",
      "你不寒而栗地回头。窗外，雾气正浓。",
      "（第一章·完。知识的滋味，从此如附骨之疽。）",
    ],
    choices: [],
  },
  {
    id: "ending_shikong",
    type: "ending",
    endingId: "shikong",
    endingTitle: "失控",
    endingDesc: "理智的堤坝崩塌了。你从猎手，变成了被猎杀的东西。",
    art: "none",
    text: [
      "理智的最后一根弦，断了。",
      "世界在你眼中碎裂成亿万片蠕动的光斑。你听见自己的骨骼在皮肤下拔节、转位，听见血液变成某种粘稠的、歌唱着的东西。那些你一直小心「扮演」、努力「消化」的魔药，此刻终于露出了獠牙——",
      "它不再是你的一部分。你成了它的一部分。",
      "最后的最后，是人间的画面穿透疯狂传来的一瞬：邓恩·史密斯站在街角，礼帽压得很低，举枪的手稳如磐石。他的灰眸里，是你从未见过的悲哀。",
      "「对不起，孩子。」",
      "枪声响起。绯红的月色，是你作为「人」看见的最后一样东西。",
      "（失控——每一位非凡者悬在头顶的达摩克利斯之剑。愿下一个轮回里，你更敬畏这份力量。）",
    ],
    choices: [],
  },
  {
    id: "ending_death",
    type: "ending",
    endingId: "death",
    endingTitle: "长眠",
    endingDesc: "你倒在了守护廷根的路上。值夜者的墓碑很小，但足够干净。",
    art: "none",
    text: [
      "黑暗漫过意识的最后一刻，你倒不算太后悔。",
      "穿越者的人生从来短暂而炽烈——你见过灰雾之上的宫殿，饮下过星辰凝成的魔药，替无数沉睡者守过漫长的夜。这样的一生，值回票价。",
      "三天后，廷根北郊墓园下过一场小雨。黑荆棘安保公司全体成员出席了你的葬礼。邓恩在你的墓碑前站了很久，最后只刻了一行字：",
      "「他/她看见了真相，代价是生命。愿女神引他/她的灵，归于黑夜深处安宁的眠。」",
      "某个没人注意的角落，老尼尔把一朵白玫瑰放在碑前，老泪纵横；而伦纳德靠着墓碑坐了一整夜，写了一首终于押对了韵的诗。",
      "（死亡不是故事的终点——只是这一位旅人的。来生，灰雾再见。）",
    ],
    choices: [],
  },
  // ============ 支线：铁十字街连环失踪案 ============
  {
    id: "arc_missing_start",
    chapter: 3,
    art: "city",
    title: "铁十字街·第三具尸体",
    text: [
      "卷宗上写着：短短十日，铁十字街同一街区失踪三人，皆是独居的工匠。第三具尸体昨晚被发现——没有伤痕，没有挣扎，整个人像被「抽干」了什么，干瘪地贴在自己家的墙上，仿佛成了墙皮的一部分。",
      "邓恩把案子压在主线之下，低声嘱咐你「有空就看看」。法医的报告里有一行被红笔圈出的小字：三户人家的临街墙面，内侧都发现了「不属于这栋房子的、极细的湿痕」。",
      "你站在铁十字街街口。暮色里，那排联排红砖房沉默地立着，像一排紧闭的嘴。",
    ],
    choices: [
      { text: "去第三具尸体的现场——7号屋", sub: "实地勘察", next: "arc_scene" },
      { text: "先向街坊打听三人生前的人际关系", sub: "平凡但扎实的调查", next: "arc_gossip" },
    ],
  },
  {
    id: "arc_gossip",
    chapter: 3,
    art: "city",
    text: [
      "杂货铺老板、送奶工、扫街的老约翰——你用一镑的打探费换来了一个共同点：三人失踪前一周，都在装修自家临街的那面墙，雇的是同一个沉默寡言的泥瓦匠——那人左手缺了小指，干完活就没再出现过。",
      "「那泥瓦匠干活时，」杂货铺老板压低声音，「我亲眼看见他把一根银针钉进了墙缝里——嘴里念叨着什么『把门缝读出来』。我当时以为他是疯子。」",
      "「把门缝读出来」——这句话让你的脊背一凉。只有懂得「门」的人，才会用这样的措辞。",
    ],
    choices: [{ text: "直奔7号屋的墙", next: "arc_scene", effects: [{ t: "pounds", v: -1 }, { t: "flag", k: "arc_gossip", v: 1 }] }],
  },
  {
    id: "arc_scene",
    chapter: 3,
    art: "ritual",
    title: "7号屋·临街的墙",
    text: [
      "7号屋的临街墙面已经被法医撬开过一块。你凑近那道豁口，借着煤气灯的光，看清了墙皮内侧：那道「湿痕」不是水渍，而是一行用极淡银水写就的、密密麻麻的符文——某种「门」的咒文，正在缓慢地、自我消耗式地闭合。",
      "更糟的是，你听见墙里传来一阵极轻的、指甲刮砖的声响。有什么东西，还在墙的另一侧——「墙的那一边」。",
    ],
    choices: [
      {
        text: "以灵视/通灵辨识墙后的存在", sub: "灵感判定：看清墙后",
        check: {
          attr: "inspiration", dc: 13, label: "辨识墙后",
          pass: "arc_scene_pass", passEffects: [{ t: "flag", k: "arc_clue", v: 1 }, { t: "sanity", v: -2 }],
          fail: "arc_scene_fail", failEffects: [{ t: "sanity", v: -4 }],
        },
      },
      {
        text: "「读」出墙上那行咒文的破绽", sub: "【读运者专属扮演】你天生就懂门",
        req: { pathway: "reader", hint: "需要读运者途径的「门」之识" },
        next: "arc_scene_reader", effects: [{ t: "digestion", v: 10 }, { t: "flag", k: "arc_clue", v: 1 }],
      },
      {
        text: "叩墙三下，与夹层里的残魂低语", sub: "【收尸人专属扮演】你听得懂死者的话",
        req: { pathway: "collector", hint: "需要收尸人的通灵" },
        next: "arc_scene_collector", effects: [{ t: "digestion", v: 12 }, { t: "sanity", v: -3 }, { t: "flag", k: "arc_clue", v: 1 }],
      },
      { text: "拆开这面墙，硬碰", sub: "体魄判定：体力活",
        check: { attr: "physique", dc: 12, label: "破墙", pass: "arc_scene_bashpass", fail: "arc_scene_bashfail", failEffects: [{ t: "hp", v: -4 }] },
      },
    ],
  },
  {
    id: "arc_scene_pass",
    chapter: 3,
    art: "ritual",
    text: [
      "你的灵性在瞳孔里聚焦。墙后并不是空心的砖石——它后面连着一条极窄的、不属于这栋房子的「夹层」，夹层里蜷着一个由湿痕与银灰符文拼成的、勉强维持人形的东西。",
      "它察觉到你的注视，墙皮内侧的咒文骤然亮起——它在逃跑，想顺着墙「游」到隔壁去。",
    ],
    choices: [
      { text: "追进夹层，堵住它", sub: "直面雾影窃贼", combat: "mistthief", winNext: "arc_catch", loseNext: "arc_escape" },
    ],
  },
  {
    id: "arc_scene_reader",
    chapter: 3,
    art: "ritual",
    text: [
      "你抬手抚上墙面。银色的韵文在你眼中重新排列——这扇「门」被人用拙劣的手法焊死了一半，是为了困住墙后的东西，但困得并不牢。",
      "你只改动了三个符文，那道错误的「焊缝」就轰然洞开——不是放它出来，而是把门「反锁」，让墙后的东西再也无法顺着墙游走。",
      "墙后传来一声又惊又怒的、非人的嘶鸣。然后，它从7号屋另一侧的豁口「挤」了出来，直面你——它别无选择了。",
    ],
    choices: [
      { text: "趁它被困，正面收拾它", sub: "雾影窃贼已被削弱", combat: "mistthief", winNext: "arc_catch", loseNext: "arc_escape" },
    ],
  },
  {
    id: "arc_scene_collector",
    chapter: 3,
    art: "ritual",
    text: [
      "你没有去读墙上的咒文，而是曲起指节，在湿痕最浓的地方叩了三下——这是收尸人与夹缝里亡魂打交道的旧礼。",
      "墙后的刮擦声顿了顿。然后，一个比鼠叫还细的声音，从砖缝里渗进你的颅骨：『……别……别让它……把我……缝进去……它……把门……焊死……我出不去……也死不了……』",
      "你听懂了。墙后那东西不是凶手——它是最初的受害者之一，被「泥瓦匠」缝进了夹层，活成了这面墙的「眼睛」。凶手借着它看路、借着它游走。",
      "你低声许诺：会把它「取」出来，让它真正地死。残魂颤了颤，把凶手的去向——9号屋后墙——连同它最后一点怨毒，一起交给了你。",
    ],
    choices: [
      { text: "循着残魂指引，直扑9号屋", sub: "雾影窃贼已无藏身处", combat: "mistthief", winNext: "arc_catch", loseNext: "arc_escape" },
    ],
  },
  {
    id: "arc_scene_fail",
    chapter: 3,
    art: "ritual",
    text: [
      "你看得不够深。墙皮内侧的咒文趁你愣神的工夫自我闭合，等你回过神，墙后的刮擦声已经远去——它顺着墙「游」到别处去了。",
      "但你记下了它逃走的方向。",
    ],
    choices: [{ text: "循着痕迹追下去", next: "arc_chase" }],
  },
  {
    id: "arc_scene_bashpass",
    chapter: 3,
    art: "ritual",
    text: [
      "你抡起铁镐，连砸三下，红砖与灰泥崩落——墙后露出了那条潮湿的夹层，和里面一团蠕动的人形湿影。它没料到有人会用这么「凡人」的方式破开门。",
    ],
    choices: [
      { text: "逮住它", sub: "出其不意", combat: "mistthief", winNext: "arc_catch", loseNext: "arc_escape" },
    ],
  },
  {
    id: "arc_scene_bashfail",
    chapter: 3,
    art: "ritual",
    text: [
      "你砸偏了几下，手腕震得发麻。等你拆开豁口，墙后的东西已经顺着夹层溜走了——只留下一道淡淡的银水湿痕，指向隔壁。",
    ],
    choices: [{ text: "循痕追击", next: "arc_chase" }],
  },
  {
    id: "arc_chase",
    chapter: 3,
    art: "city",
    title: "墙缝追逐",
    text: [
      "你沿着湿痕追过三户人家的后院。银色的痕迹在9号屋的后墙汇聚、变浓——它就缩在9号屋的墙缝里，喘着不属于活物的气。",
      "这一次，它无处可「游」了。",
    ],
    choices: [
      { text: "把它从墙缝里逼出来", sub: "雾影窃贼", combat: "mistthief", winNext: "arc_catch", loseNext: "arc_escape" },
    ],
  },
  {
    id: "arc_catch",
    chapter: 3,
    art: "city",
    title: "案结",
    text: [
      "雾影窃贼在9号屋后院溃散成一摊银灰色的湿痕。你从那摊湿痕里捻出一枚缺了小指的、银质的指套——那是「泥瓦匠」留下的工具，一件拙劣的、被改造过的门途径封印物。",
      "它本是某个低阶门途径非凡者用来「读门缝」窃取民居财物的下作手段，失控之后，开始连人带命一起「偷」。",
      "邓恩看了你的报告，难得地露出赞许：「案子结了。这条街能安生睡几晚了。」他顿了顿，「至于那个泥瓦匠……恐怕早成了墙皮的一部分。这种事，别深想。」",
      "魔药在你体内满意地翻涌了一下——你又「扮演」了一回合格的值夜者。",
    ],
    onEnter: [{ t: "pounds", v: 5 }, { t: "digestion", v: 8 }, { t: "flag", k: "missing_solved", v: 1 }],
    choices: [{ text: "凯旋回公司", next: "c3_hub" }],
  },
  {
    id: "arc_escape",
    chapter: 3,
    art: "city",
    text: [
      "雾影窃贼从你指缝间滑走，溶进墙缝，再也找不到了。你没能结案，但至少那东西受了重创，短时间内不敢再在这条街作案。",
      "邓恩没说什么重话，只拍了拍你的肩：「有些案子，能压住就算赢。回去歇着吧。」",
      "你心里清楚，这一回，扮演得不算圆满——魔药也因此消化得慢了些。",
    ],
    onEnter: [{ t: "pounds", v: 2 }, { t: "sanity", v: -2 }],
    choices: [{ text: "带着遗憾回公司", next: "c3_hub" }],
  },
];
