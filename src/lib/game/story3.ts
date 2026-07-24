import type { StoryNode } from "./types";

// ============ 第四章：钟楼失踪案 ============
export const STORY_3: StoryNode[] = [
  {
    id: "c4_start",
    chapter: 4,
    art: "city",
    title: "钟楼的沉默",
    text: [
      "安提哥努斯事件后的第十一天，廷根下了一场带着铁锈味的雨。",
      "邓恩把你叫进办公室，桌上摊着一份让全队都皱眉的卷宗：圣莲娜大教堂旁的旧钟楼，已经三十年没敲响过。可这一周以来，每到午夜，附近居民都听见了钟声——沉闷的、像是隔着一层水面传来的钟声。而且，钟声响起的同时，铁匠街的铜匠奥古斯都失踪了。",
      "「不止他。」邓恩的灰眸沉了沉，「前后七天，钟楼周边失踪了三个人。全都和『铜』有关——铜匠、钟表匠、收铜料的货郎。司钟人三十年前就上报病故了，钟绳早就烂断。这案子，是冲着那口钟去的。」",
      "「卡尔，这是你独立带队的第一案。伦纳德和弗莱被抽调去贝克兰德增援了，你能调动的，只有你自己。」他按了按眉心，又问，「我刚才说到哪了？」",
    ],
    choices: [
      { text: "「说到我只能调动我自己。」", sub: "邓恩的记忆，一如既往地选择性工作", next: "c4_brief" },
    ],
  },
  {
    id: "c4_brief",
    chapter: 4,
    art: "city",
    title: "案情简报",
    text: [
      "邓恩把三份失踪人口档案推到你面前。死者的共同点除了「与铜打交道」，还有一个更隐秘的细节——三人在失踪前一周，都曾向教堂捐献过一口小型铜钟，作为「还愿」。捐献的钟，第二天就不翼而飞。",
      "「钟楼里那口大钟，是第四纪的遗物。」老尼尔不知何时站在门边，手里攥着一本发黄的册子，「我查了——它原本不属于圣莲娜教堂，是被『搬』进去的。三十年前司钟人上报病故后，教廷就把它封了。封印的代价，是司钟人自己吊死在钟绳上，做了『锚』。」",
      "「现在有人想唤醒它。」老尼尔的声音压得很低，「唤醒一口第四纪的钟，需要的不只是铜——还需要『回声』。三条人命的回声。」",
    ],
    choices: [
      { text: "先去整备，再赴钟楼", sub: "万全之策", next: "c4_hub" },
      { text: "直接去钟楼现场勘察", sub: "兵贵神速", next: "c4_scene" },
      {
        text: "「邓恩队长，铁十字街那条线……」", sub: "missing_solved：旧案的回响",
        hidden: { flag: "missing_solved", flagVal: 1, hint: " " },
        once: "missing_recalled",
        next: "c4_brief_recall", effects: [{ t: "item", k: "potion_heal", v: 1 }, { t: "digestion", v: 4 }],
      },
    ],
  },
  {
    id: "c4_brief_recall",
    chapter: 4,
    art: "city",
    text: [
      "「铁十字街那条线，你办得干净。」邓恩翻档案的手顿了顿，灰眸里掠过一丝少见的赞许，「没让一个泥瓦匠的失控，变成一整条街的失踪。这次也稳着点。」",
      "他从抽屉里摸出一瓶备用圣水推给你：「拿着。办过那种案子的人，不该在铜钟底下空着手。」",
      "老尼尔在门边嘟囔：「上次那个墙缝里的玩意儿，跟这口钟是一个味道——都是把活人当『回声』收。你这鼻子，比我们灵。」",
    ],
    choices: [
      { text: "收好圣水，整装备战", next: "c4_hub" },
      { text: "直接去钟楼现场", next: "c4_scene" },
    ],
  },
  // ---------- 中心 ----------
  {
    id: "c4_hub",
    chapter: 4,
    art: "city",
    title: "临钟整备",
    text: [
      "黑荆棘公司的窗外，旧钟楼的尖顶在雾里若隐若现，像一根插进天空的生锈针。你需要在动身前，把状态调到最佳。",
    ],
    choices: [
      {
        text: "申请晋升序列8的仪式", sub: "消化度100%后可进行",
        hidden: { flag: "canAdvance", flagVal: 1, hint: "魔药尚未完全消化" },
        req: { seq: 9, hint: "你已完成晋升" },
        next: "c4_promote",
      },
      {
        text: "去恶龙酒吧的地下黑市采买", sub: "对抗第四纪的钟，备点硬货",
        next: "c4_shop",
      },
      {
        text: "去圣赛琳娜教堂祈祷", sub: "捐献1镑，理智+14",
        req: { minPounds: 1, hint: "捐献1镑" },
        next: "c4_hub", effects: [{ t: "pounds", v: -1 }, { t: "sanity", v: 14 }],
      },
      {
        text: "研究老尼尔的第四纪古籍", sub: "灵感判定：找到钟的弱点", once: "studied_bell",
        check: {
          attr: "inspiration", dc: 14, label: "研读古籍",
          pass: "c4_study_pass", passEffects: [{ t: "flag", k: "bell_lore", v: 1 }, { t: "digestion", v: 6 }],
          fail: "c4_study_fail", failEffects: [{ t: "sanity", v: -4 }],
        },
      },
      {
        text: "以窥秘人之法，解构古籍的咒文层", sub: "【窥秘人专属扮演】你天生读得懂禁忌",
        hidden: { pathway: "pryer" }, once: "studied_bell",
        next: "c4_study_pryer", effects: [{ t: "flag", k: "bell_lore", v: 1 }, { t: "digestion", v: 10 }],
      },
      { text: "动身前往钟楼（主线）", sub: "夜幕降临前抵达", next: "c4_scene" },
      {
        text: "「队长，我想到灰河下水道走一趟。」", sub: "可选支线：失踪铜匠的最后一单货，交在下水道口",
        once: "took_sewer_case", next: "c4_sewer_start",
      },
    ],
  },
  {
    id: "c4_study_pass",
    chapter: 4,
    art: "city",
    text: [
      "泛黄的书页在你指下沙沙作响。你拼凑出一段残缺的记载：这口钟名为「回声」，是第四纪某个侍奉「堕落真理」的家族铸造的器皿。它不敲响时间，它敲响「记忆」——被它收容的回声，会成为它的一部分。",
      "弱点也写在字缝里：「钟惧于『新声』。一个它从未听过的、不属于任何亡者的声音，能让它的回声溃散。」",
      "你合上书，心里有了计较。",
    ],
    choices: [{ text: "动身去钟楼", next: "c4_scene", effects: [{ t: "flag", k: "bell_lore", v: 1 }] }],
  },
  {
    id: "c4_study_fail",
    chapter: 4,
    art: "city",
    text: [
      "那些第四纪的符号在你眼前扭曲、游动，仿佛文字本身在拒绝被理解。你读得越久，太阳穴跳得越凶，耳边隐约响起了一声不该存在的钟鸣。",
      "老尼尔啪地合上书：「够了，再读下去你就要变成它的回声了。走吧，到现场再想办法。」",
    ],
    choices: [{ text: "揉着太阳穴起身", next: "c4_hub" }],
  },
  {
    id: "c4_study_pryer",
    chapter: 4,
    art: "city",
    title: "咒文的解剖图",
    text: [
      "你没有顺着文字去「读」它——你把它倒过来，拆成一层层咒文的结构，像在解剖一具标本。",
      "窥秘人的本能让你看见了别人看不见的东西：书页边缘那些看似装饰的花体，其实是一圈圈叠套的「封缄咒」，用来把某段声音锁进钟里。三层封缄，最内一层已经被磨损得只剩残痕——三十年前，有人从内部把它磨断过。",
      "「钟惧于『新声』。」你喃喃念出弱点，又补上老尼尔都没查到的一行注释，「……而且它已经被磨过一次。再磨，就不用三条命，一条就够。」",
      "魔药在你体内满意地翻涌——你「扮演」了一回合格的窥秘人：不是去知道，而是去解构「知道」本身。",
    ],
    choices: [{ text: "合上书，动身去钟楼", next: "c4_scene", effects: [{ t: "flag", k: "bell_lore", v: 1 }, { t: "flag", k: "bell_weak", v: 1 }] }],
  },
  {
    id: "c4_promote",
    chapter: 4,
    art: "ritual",
    title: "晋升仪式",
    text: [
      "炼金室深处，黑夜圣徽的光辉如水漫过你的全身。你饮下序列8的魔药，力量如温热的潮水冲刷四肢百骸——意识深处，一道新的门轰然洞开。",
      "邓恩站在圣徽旁，难得地露出欣慰：「去吧。带着新的力量，去敲碎那口钟。」",
    ],
    choices: [{ text: "感受新的力量", next: "c4_hub" }],
  },
  // ---------- 黑市 ----------
  {
    id: "c4_shop",
    chapter: 4,
    art: "city",
    title: "恶龙酒吧·地下黑市",
    text: [
      "老头见你来，金牙一闪，从柜台下摸出几样压箱底的货：「对付第四纪的玩意，这些比圣水管用。原价卖你——老头子我对回头客有良心。」",
      "（黑狗安静地趴着，尾巴摇了摇。）",
    ],
    choices: [
      {
        text: "购买【治疗圣水】×1（3镑）", sub: "回复14生命",
        req: { minPounds: 3, hint: "还差些金镑" },
        next: "c4_shop", effects: [{ t: "pounds", v: -3 }, { t: "item", k: "potion_heal", v: 1 }],
      },
      {
        text: "购买【宁神药剂】×1（3镑）", sub: "回复10理智",
        req: { minPounds: 3, hint: "还差些金镑" },
        next: "c4_shop", effects: [{ t: "pounds", v: -3 }, { t: "item", k: "potion_mind", v: 1 }],
      },
      {
        text: "购买【净化子弹】×2（6镑）", sub: "对亡灵有奇效",
        req: { minPounds: 6, hint: "还差些金镑" },
        next: "c4_shop", effects: [{ t: "pounds", v: -6 }, { t: "item", k: "bullet_purify", v: 2 }],
      },
      {
        text: "购买【仪式灰烬】×1（4镑）", sub: "战斗抛洒：18伤害，对亡灵+10",
        req: { minPounds: 4, hint: "还差些金镑" },
        next: "c4_shop", effects: [{ t: "pounds", v: -4 }, { t: "item", k: "ritual_dust", v: 1 }],
      },
      {
        text: "购买【罗塞尔的「锚」】（10镑）", sub: "被动：理智损失减半+上限+10（限购）", once: "bought_anchor",
        req: { minPounds: 10, hint: "这东西值这个价" },
        next: "c4_shop", effects: [{ t: "pounds", v: -10 }, { t: "item", k: "charm_anchor", v: 1 }, { t: "maxSanity", v: 10 }, { t: "sanity", v: 10 }],
      },
      {
        text: "购买【命运金币】（6镑）", sub: "幸运+1（限购）", once: "bought_coin",
        req: { minPounds: 6, hint: "还差些金镑" },
        next: "c4_shop", effects: [{ t: "pounds", v: -6 }, { t: "luck", v: 1 }],
      },
      {
        text: "淘换【封印左轮】（14镑）", sub: "战斗基础攻击+6（替代银匕/左轮，限购）", once: "bought_sealrev",
        req: { minPounds: 14, hint: "还差不少金镑" },
        next: "c4_shop", effects: [{ t: "pounds", v: -14 }, { t: "item", k: "seal_revolver", v: 1 }],
      },
      { text: "离开黑市", next: "c4_hub" },
    ],
  },
  // ---------- 现场 ----------
  {
    id: "c4_scene",
    chapter: 4,
    art: "city",
    title: "铁匠街·旧钟楼",
    text: [
      "旧钟楼蹲在圣莲娜教堂的阴影里，藤蔓爬满了半边塔身，像一只攥紧的绿色手掌。塔顶的铜钟罩在铁锈色的雾气中，看不见钟舌，却感觉它正在「注视」每一个走近的人。",
      "钟楼的木门虚掩着，门缝里渗出一丝若有若无的、带着回声的凉气。地上有几枚铜屑——失踪的铜匠奥古斯都，最后留下的痕迹。",
    ],
    choices: [
      {
        text: "蹲下检查铜屑与脚印", sub: "灵感判定：追踪失踪者",
        check: {
          attr: "inspiration", dc: 12, label: "勘察入口",
          pass: "c4_entrance_pass", passEffects: [{ t: "flag", k: "trail", v: 1 }],
          fail: "c4_entrance_fail", failEffects: [{ t: "sanity", v: -2 }],
        },
      },
      {
        text: "用猎人的方式嗅闻杀意的来路", sub: "【猎人专属扮演】消化度+10",
        req: { pathway: "hunter", hint: "需要猎人的嗅觉" },
        next: "c4_entrance_hunter", effects: [{ t: "digestion", v: 10 }, { t: "flag", k: "trail", v: 1 }],
      },
      { text: "直接推门进入钟楼", sub: "时间不等人", next: "c4_foyer" },
    ],
  },
  {
    id: "c4_entrance_pass",
    chapter: 4,
    art: "city",
    text: [
      "你趴在地上，借着煤气灯的微光辨认。铜屑从门口一直延伸到塔内，中间有几处被「拖拽」抹开的痕迹——失踪者是活着走进去的，但中途失去了行走能力。",
      "更重要的是，铜屑在门槛处形成了一个不自然的弧形——那是某种「邀请」的仪式痕迹。钟楼在「请」铜匠进来。",
    ],
    choices: [{ text: "握紧枪，推门而入", next: "c4_foyer" }],
  },
  {
    id: "c4_entrance_fail",
    chapter: 4,
    art: "city",
    text: [
      "你在地上摸索了半天，除了铜屑什么也没找到。倒是抬头时，瞥见钟楼顶层那口铜钟似乎「偏」了一下——像是刚才正低着头看你，被你撞见才装作不动。",
      "你打了个寒颤。",
    ],
    choices: [{ text: "推门而入", next: "c4_foyer" }],
  },
  {
    id: "c4_entrance_hunter",
    chapter: 4,
    art: "city",
    text: [
      "你闭上眼，让猎人苏醒的嗅觉接管鼻腔。血锈、陈年蜂蜡、还有一种甜腻的、像腐坏铜锈发酵后的气味——那是「杀意」残留的味道，从塔内向外辐射，像蛛网。",
      "猎人的本能告诉你：这不是伏击。这是「引诱」。塔里的东西，正在饿着。你锁定了气味最浓的来路——塔楼东北侧的一条暗梯。",
      "魔药在体内满意地翻涌。",
    ],
    choices: [{ text: "循着气味，找暗梯入口", next: "c4_foyer", effects: [{ t: "flag", k: "hunter_route", v: 1 }] }],
  },
  {
    id: "c4_foyer",
    chapter: 4,
    art: "ritual",
    title: "钟楼底层",
    text: [
      "推开门的瞬间，一声叹息般的钟鸣在你颅骨内炸开——但你的耳朵什么也没听见。只有骨头在响。",
      "钟楼底层堆满了断裂的钟绳、锈蚀的齿轮、和几十口大大小小的铜钟残骸。墙上钉着一张三十年前的日历，停在某一日。空气中飘着铜锈与陈血的混合气味。",
      "楼梯盘旋而上，消失在黑暗里。每一级台阶上，都凝着一层薄薄的、会「回响」的霜。",
    ],
    choices: [
      {
        text: "稳住心神，拾级而上", sub: "意志判定：抵抗颅内的钟鸣",
        check: {
          attr: "will", dc: 12, label: "抵御回声",
          pass: "c4_stairs_pass", passEffects: [{ t: "sanity", v: 2 }],
          fail: "c4_stairs_fail", failEffects: [{ t: "sanity", v: -5 }],
        },
      },
      {
        text: "占卜塔上的命运，预知危险", sub: "【占卜家专属扮演】消化度+10",
        req: { pathway: "seer", hint: "需要占卜家的灵视" },
        next: "c4_stairs_seer", effects: [{ t: "digestion", v: 10 }, { t: "flag", k: "foreseen", v: 1 }],
      },
      {
        text: "查看墙角那堆铜钟残骸", sub: "也许藏着线索", next: "c4_bells",
      },
      {
        text: "推开底层杂物间的侧门", sub: "里头有东西在嘎吱作响", once: "c4_puppet_seen", next: "c4_puppet",
      },
    ],
  },
  {
    id: "c4_puppet",
    chapter: 4,
    art: "ritual",
    title: "杂物间的发条秘偶",
    text: [
      "侧门后是一间堆满断裂钟绳与齿轮的杂物间。你刚迈进半步，角落里一具木与铜丝扎成的人偶自行站起，关节嘎吱作响。它没有脸，胸口嵌着一枚锈蚀的齿轮，像还在跳的心。",
      "它显然是某次被放弃的钟楼仪式留下的残骸——但残骸认得活人的气息，也会伤人。",
    ],
    choices: [
      { text: "击倒这具残骸", sub: "发条秘偶", combat: "puppet", winNext: "c4_puppet_win", loseNext: "c4_puppet_lose" },
      { text: "绕开它，不去招惹", sub: "多一事不如少一事", next: "c4_foyer", effects: [{ t: "sanity", v: -1 }] },
    ],
  },
  {
    id: "c4_puppet_win",
    chapter: 4,
    art: "ritual",
    text: [
      "发条秘偶散成一堆木片与铜丝，胸口那枚齿轮还在「咔哒、咔哒」空转了几下才停。你把齿轮收进证据袋——这种锈蚀程度，足以证明钟楼的仪式已经偷偷跑了至少三十年。",
      "魔药在你骨血里翻涌了一下：又一个像样的值夜者之举。",
    ],
    onEnter: [{ t: "digestion", v: 6 }, { t: "flag", k: "puppet_gear", v: 1 }, { t: "pounds", v: 2 }],
    choices: [{ text: "退出杂物间，继续向上", next: "c4_foyer" }],
  },
  {
    id: "c4_puppet_lose",
    chapter: 4,
    art: "ritual",
    text: [
      "铜丝缠住你的手腕，齿轮拳砸得你退出杂物间。你撑着门框把秘偶关回去——它没追出来，似乎被困在这一小间里。但你的肋骨抗议得厉害。",
    ],
    onEnter: [{ t: "hp", v: -5 }],
    choices: [{ text: "按着肋骨，继续向上", next: "c4_foyer" }],
  },
  {
    id: "c4_bells",
    chapter: 4,
    art: "ritual",
    text: [
      "你在铜钟残骸里翻找，指尖触到一口拇指大的小钟，冰凉得不像金属。你凑近——小钟里传来一声极轻的、属于奥古斯都铜匠的呼救。",
      "你猛地松手，小钟滚进角落。原来失踪者不是被「带走」，而是被「收容」进了铜里。这三口还愿小钟，是钟楼大钟的「食粮」。",
    ],
    choices: [
      { text: "收起小钟作为证物", sub: "它也许能在关键时刻成为「媒介」", next: "c4_foyer", effects: [{ t: "item", k: "ritual_dust", v: 1 }, { t: "flag", k: "bell_clue", v: 1 }] },
    ],
  },
  {
    id: "c4_stairs_pass",
    chapter: 4,
    art: "ritual",
    text: [
      "钟鸣在你颅骨内撞击，你咬紧牙关，把意志凝成一道闸。回声撞在闸上，碎成齑粉。你踏上了螺旋楼梯，每一步都比上一步更冷。",
    ],
    choices: [{ text: "继续向上", next: "c4_mid" }],
  },
  {
    id: "c4_stairs_fail",
    chapter: 4,
    art: "ritual",
    text: [
      "钟鸣撕开了你的防线，幻象涌入：你看见自己吊在钟绳上，脖子以不自然的角度歪着，三十年如一日地为那口钟做「锚」。你分不清这是幻觉，还是钟在「预演」你的结局。",
      "等你回过神，冷汗已浸透衣领，鼻腔渗出一缕血丝。",
    ],
    choices: [{ text: "踉跄着继续向上", next: "c4_mid" }],
  },
  {
    id: "c4_stairs_seer",
    chapter: 4,
    art: "ritual",
    text: [
      "你取出怀表链充作灵摆，闭眼让灵视漫上楼梯。命运的画面碎片掠过：一头被仪式扭曲的看门兽、一个与钟融为一体的守塔人、以及——顶层铜钟下方，一道被囚禁的、属于活人的「新声」正在枯萎。",
      "占卜家最重要的不是看见，而是「知道哪里不能看」。你睁开眼，避开了楼梯上一处会吞噬灵性的死角，从容而上。",
    ],
    choices: [{ text: "从容拾级而上", next: "c4_mid" }],
  },
  // ---------- 中层：看门兽 ----------
  {
    id: "c4_mid",
    chapter: 4,
    art: "ritual",
    title: "钟楼中层",
    text: [
      "楼梯在中层断成一段悬空的栈道。栈道尽头，一口倒塌的大钟后，伏着那头东西——",
      "瘦骨嶙峋的黑犬，脸上没有眼鼻，只有一张咧到耳根的、布满人齿的嘴。它是被三十年前的回声喂大的、钟的看门兽。",
      "它抬起头，「认出」了你身上的活人气息，无声地咧嘴笑了。",
    ],
    choices: [
      { text: "拔枪迎战", sub: "先解决看门兽", combat: "hound", winNext: "c4_after_hound" },
    ],
  },
  {
    id: "c4_after_hound",
    chapter: 4,
    art: "ritual",
    text: [
      "月影犬化为一摊混着人齿的黑水，渗进栈道的木缝。栈道尽头，通往顶层的活板门在风里轻晃。",
      "你刚要上前，门里传出一个苍老的、仿佛隔了三十年水雾的声音：「……别上来……孩子……它已经……是我了……」",
      "那是司钟人的声音——三十年没下过钟楼的守塔人，他还「活着」，以一种不该被称作活着的方式。",
    ],
    choices: [
      { text: "「我上来，就是为了让你解脱。」", sub: "推开活板门", next: "c4_top" },
    ],
  },
  // ---------- 顶层：司钟人 + 大钟 ----------
  {
    id: "c4_top",
    chapter: 4,
    art: "ritual",
    title: "铜钟之下",
    text: [
      "顶层豁然开朗。巨大的铜钟「回声」悬于正中，钟舌是一截干枯的人腿骨。钟绳从钟舌垂下，勒进一个吊在半空的枯瘦人形的脖颈——那就是司钟人。他与钟融为一体，三十年没有下来。",
      "你进门时，司钟人缓缓睁眼，瞳孔里倒映着一座不属于这个世界的钟楼。他张嘴，铜锈从嘴角簌簌而落：「……太迟了……三个回声已经喂饱了它……它要醒了……」",
      "铜钟嗡地震动起来。那不是物理的震动——是「记忆」的震动。你听见自己的、韦尔奇的、卡尔的、无数死者的声音，正从钟壁里往外渗。",
    ],
    choices: [
      {
        text: "先击倒被钟操控的司钟人", sub: "解放守塔人，才能动那口钟",
        combat: "bellkeeper", winNext: "c4_bell_choice",
      },
      {
        text: "先「读」出活板门与钟架的结构破绽", sub: "【读运者专属扮演】你天生读得懂门与缝",
        req: { pathway: "reader", hint: "需要读运者的「门」之识" },
        once: "read_top",
        next: "c4_top", effects: [{ t: "digestion", v: 10 }, { t: "flag", k: "read_top", v: 1 }],
      },
    ],
  },
  {
    id: "c4_bell_choice",
    chapter: 4,
    art: "ritual",
    onEnter: [{ t: "sanity", v: -4 }],
    title: "沉默的钟",
    text: [
      "司钟人倒在钟绳下，脖颈终于从那道勒了三十年的沟壑里解脱。他咽气前，用最后的力气指了指钟舌——那截人腿骨。",
      "「……它怕……新声……」",
      "铜钟震得越来越剧烈，钟壁上无数张被收容的人脸正一张张睁开眼睛。它要醒了——一旦它完全苏醒，整个廷根的「记忆」都会被它收容。",
      "你只有一次出手的机会。你打算怎么做？",
    ],
    choices: [
      {
        text: "用「新声」震散它的回声", sub: "需要 bell_lore：唱出一段它从未听过的旋律",
        hidden: { flag: "bell_lore", flagVal: 1, hint: "你还没找到它的弱点" },
        next: "c4_newvoice", effects: [{ t: "flag", k: "bell_solved", v: 1 }, { t: "digestion", v: 12 }],
      },
      {
        text: "以磨断第三层封缄的方式，让一段「残声」反噬它", sub: "需要 bell_weak：你解构过它的咒文层",
        hidden: { flag: "bell_weak", flagVal: 1, hint: "你尚未看穿它的封缄结构" },
        next: "c4_newvoice", effects: [{ t: "flag", k: "bell_solved", v: 1 }, { t: "sanity", v: -4 }, { t: "digestion", v: 14 }],
      },
      {
        text: "祭出还愿小钟，以「旧声」引「新声」", sub: "需要 bell_clue：用证物作媒介，分担反噬",
        hidden: { flag: "bell_clue", flagVal: 1, hint: "你没有可作媒介的证物" },
        next: "c4_newvoice", effects: [{ t: "flag", k: "bell_solved", v: 1 }, { t: "sanity", v: -2 }, { t: "digestion", v: 12 }],
      },
      {
        text: "用净化子弹与圣徽强行封印", sub: "需要净化子弹×1：代价是理智",
        req: { item: "bullet_purify", hint: "需要净化子弹（圣徽媒介）" },
        next: "c4_seal", effects: [{ t: "item", k: "bullet_purify", v: -1 }, { t: "sanity", v: -8 }, { t: "flag", k: "bell_solved", v: 1 }, { t: "digestion", v: 10 }],
      },
      {
        text: "用收尸人的方式，安抚钟中亡魂", sub: "【收尸人专属扮演】为它们诵安魂咒",
        req: { pathway: "collector", hint: "需要收尸人的通灵" },
        next: "c4_collector_bell", effects: [{ t: "digestion", v: 14 }, { t: "flag", k: "bell_solved", v: 1 }],
      },
      {
        text: "用爆破把它彻底炸毁", sub: "体魄判定：暴力但有效",
        check: {
          attr: "physique", dc: 15, label: "引爆钟楼",
          pass: "c4_boom_pass", passEffects: [{ t: "hp", v: -10 }, { t: "flag", k: "bell_solved", v: 1 }, { t: "flag", k: "bell_destroyed", v: 1 }, { t: "digestion", v: 8 }],
          fail: "c4_boom_fail", failEffects: [{ t: "hp", v: -16 }, { t: "sanity", v: -6 }],
        },
      },
      {
        text: "接下钟绳，自愿成为新的「司钟人」", sub: "需要意志≥8：把自己钉成新的锚，让钟永不复响",
        req: { attr: { k: "will", min: 8 }, hint: "你的意志还不够坚定，会被钟反噬（意志≥8）" },
        next: "c4_anchor_choice", effects: [{ t: "sanity", v: -12 }],
      },
    ],
  },
  {
    id: "c4_anchor_choice",
    chapter: 4,
    art: "ritual",
    onEnter: [{ t: "sanity", v: -6 }],
    title: "钟绳之下",
    text: [
      "你没有选「新声」，也没有选炸药。你走到钟舌之下，抬头看着那截勒了司钟人三十年的钟绳——它在等下一个自愿的脖子。",
      "你伸手，把钟绳绕上自己的手腕。",
      "剧痛。不是肉体的痛——是「记忆」被钟强行抽走的痛。它要你做它的锚，用你的存在，换它永久的沉默。司钟人临终的话在你耳边响起：「……它怕……新声……」你懂了——最锋利的「新声」，是你这一辈子再也不可能发出的声音。",
      "你咬碎舌尖，把最后一丝清明凝成一个决定。",
    ],
    choices: [
      { text: "「让钟，与我同寂。」", sub: "成为新的司钟人，永镇回声", next: "ending_bellkeeper", effects: [{ t: "flag", k: "became_bellkeeper", v: 1 }] },
      { text: "……不，我还不能停下。松开钟绳", sub: "回头另想办法", next: "c4_bell_choice" },
    ],
  },
  {
    id: "c4_newvoice",
    chapter: 4,
    art: "ritual",
    text: [
      "你深吸一口气，唱出了那段它从未听过的旋律——一首来自你「上辈子」的、这个世界不存在的童谣。",
      "「新声」灌入铜钟。钟壁上那些张开的眼睛猛地瞪圆，然后一张张溃散成光点——它们听不懂，也无法收容这段不属于任何亡者的记忆。回声的堤坝，被一首童谣冲垮了。",
      "铜钟发出一声解脱般的长鸣，轰然裂成两半。无数被收容的回声化作流萤，从裂缝里涌出，升向廷根的夜空——那里面有奥古斯都，有铜匠，有所有被它吃掉的人。",
      "你瘫坐在地，看着最后一点流萤消散。廷根的钟楼，终于沉默了。",
    ],
    choices: [{ text: "天，快亮了", next: "c4_end" }],
  },
  {
    id: "c4_seal",
    chapter: 4,
    art: "ritual",
    text: [
      "你把最后一枚净化子弹按进枪膛，对准铜钟的「心脏」——钟舌处那截人腿骨。圣徽的光辉在子弹上凝聚，你扣下扳机。",
      "子弹击中钟舌的瞬间，铜钟发出一声近乎惨叫的鸣响，钟壁上的脸全部僵住，然后被一层银白色的封印纹覆盖。它没有死，但它被重新「钉」住了。",
      "你喘着气，知道这只是权宜之计——封印会衰减。但至少，今晚的廷根保住了。",
    ],
    choices: [{ text: "在晨光中撤离钟楼", next: "c4_end", effects: [{ t: "flag", k: "bell_sealed", v: 1 }] }],
  },
  {
    id: "c4_collector_bell",
    chapter: 4,
    art: "ritual",
    text: [
      "你跪在铜钟前，以血为引、圣徽为媒，低声诵念安魂咒。收尸人的力量让你听见了钟里每一缕回声的故事——它们大多是普通人，铜匠、钟表匠、货郎，只是想还个愿，却被吃成了钟的一部分。",
      "「走吧。」你轻声说，「钟楼不需要你们守了。」",
      "回声们安静下来，一个接一个化作温润的光点，从钟壁渗出，升向夜空。失去回声的铜钟，变得只是一口普通的、生锈的旧钟。",
      "魔药在你体内深深融解——你践行了收尸人最本分的职责：直面死亡，但不爱上死亡；送每一个亡者，安息。",
    ],
    choices: [{ text: "在晨光中起身", next: "c4_end", effects: [{ t: "flag", k: "bell_pacified", v: 1 }] }],
  },
  {
    id: "c4_boom_pass",
    chapter: 4,
    art: "ritual",
    text: [
      "你把所有能找到的火药塞进钟座，拉出引线，头也不回地冲下楼梯。一声巨响震得整条铁匠街的玻璃碎成齑粉，旧钟楼的顶层在火光中塌了半边。",
      "铜钟连同它所有的回声，在烈火里熔成了一滩扭曲的铜水。简单，粗暴，但有效——它再也不会响了。",
      "邓恩后来在报销单上看着「钟楼重建费」的数字，沉默了很久。",
    ],
    choices: [{ text: "在废墟的烟尘里咳嗽着离开", next: "c4_end" }],
  },
  {
    id: "c4_boom_fail",
    chapter: 4,
    art: "ritual",
    text: [
      "引线点燃的瞬间，铜钟似乎「察觉」了你的意图——钟鸣陡然拔高，你被一股无形的力量掀飞，撞在墙上。火药只炸毁了一半，铜钟裂开大口，回声从裂缝里狂涌而出，在你耳边尖叫。",
      "你忍着剧痛，连滚带爬地冲下楼梯，身后是轰然坍塌的顶层。钟毁了，但那些溢出的回声，让整个铁匠街的居民做了一整周的噩梦。",
      "这是个胜利，但代价不菲。",
    ],
    choices: [{ text: "踉跄着撤离", next: "c4_end", effects: [{ t: "flag", k: "bell_destroyed", v: 1 }] }],
  },
  {
    id: "ending_bellkeeper",
    type: "ending",
    endingId: "bellkeeper",
    endingTitle: "第三十一年",
    endingDesc: "你接下了钟绳，把自己钉成了新的锚。钟楼再没响过——因为代价是你。",
    art: "ritual",
    text: [
      "你收紧手腕上的钟绳，纵身一跃，让自己吊在了钟舌之下。",
      "世界在你眼里急速后退，像被一只手从画面里抽走。你听见自己的骨头在钟绳上发出与司钟人当年一模一样的「咔」响——然后，钟，沉默了。",
      "它不是被封印，也不是被摧毁。它只是有了一个新的、活着的锚。你的存在，从此等于它的沉默。廷根的钟楼，会再安静三十年——只要你还在上面吊着。",
      "邓恩带人冲上顶层时，看见的是一个吊在钟舌下、呼吸平稳、却再也不会说话的身影。他想把你放下来，你的眼睛却清明地看了他一眼，摇了摇头——你还能用眼神「说话」，但喉咙已经不属于你了。",
      "「……记入最高密级档案。」邓恩摘下礼帽，声音沙哑，「代号『司钟人』。第三十一任。」他对身后赶来收尾的老尼尔低声补了一句，「告诉贝克兰德——这一任，是自愿的。」",
      "老尼尔没接话，只是把你腰间那本还没写完的值夜者日志，轻轻塞进了你垂落的手里。",
      "钟楼之外，廷根的天亮了。蒸汽、汽笛、面包房的铃铛——人间烟火如故。只有铁匠街的居民偶尔会在午夜路过钟楼时，听见塔顶传来一声极轻的、像是有人在替他们守夜的、平稳的呼吸。",
      "你的故事停在了第四章。但廷根的夜，因你而完整。",
      "（第四章·完。最大的承担，是把自己变成永远。——你成为了「钟」，让钟不再是钟。）",
    ],
    choices: [],
  },
  // ============ 支线：灰河下水道的守墓人 ============
  {
    id: "c4_sewer_start",
    chapter: 4,
    art: "city",
    title: "灰河口·最后一单货",
    text: [
      "失踪的铜匠奥古斯都，最后一单货交在灰河下水道的铁闸口——那里是廷根地下排污的尽头，老司钟人三十年前常用的「清钟灰」的秘密抛料点。",
      "卷宗上写着：交付当夜，有人听见下水道深处传来一阵极轻的铜铃声，像在给什么人点名。第二天，奥古斯都就没再回家。",
      "你站在铁闸口。污浊的河水从黑漆漆的拱洞里淌出来，带着一股铁锈与陈年香灰混在一起的味道——这不是寻常下水道的气味。",
    ],
    choices: [
      { text: "举灯深入下水道", sub: "沿铜铃声摸过去", next: "c4_sewer_mouth" },
      { text: "先去闸口值守的老司炉打听", sub: "花1镑买消息", next: "c4_sewer_gossip", effects: [{ t: "pounds", v: -1 }] },
    ],
  },
  {
    id: "c4_sewer_gossip",
    chapter: 4,
    art: "city",
    text: [
      "老司炉蹲在铁闸边的石墩上，旱烟锅子一明一灭。你递过去一镑，他咧嘴笑了，露出缺了门牙的豁口：",
      "「奥古斯都那晚下来，是替人清一炉『钟灰』——就是旧钟楼换下来的香灰与铜屑，按老规矩得倒进灰河深处。可那晚他没倒成。」",
      "「下水道里，有人——不，是『有东西』，在用铜铃点名收人。点一个，水面就浮一具。三天两头，灰河的水都是黏的。」他压低嗓门，「警官，那东西见不得『新声』。你若非要下去，嘴里千万——别出声。」",
      "「见不得新声」——和老尼尔那本第四纪古籍上的话，一字不差。",
    ],
    choices: [{ text: "记下这条线索，举灯深入", next: "c4_sewer_mouth", effects: [{ t: "flag", k: "husk_clue", v: 1 }] }],
  },
  {
    id: "c4_sewer_mouth",
    chapter: 4,
    art: "ritual",
    title: "蓄水池·点名铃",
    text: [
      "下水道在第七个岔口后豁然开阔，汇入一座砖砌的蓄水池。池水黑得发亮，水面漂着一层香灰与铜屑的薄膜。",
      "池边立着一根锈蚀的铁柱，柱顶拴着一串铜铃——铃舌早已不在，却被什么人用一截人骨顶替。你刚一靠近，铜铃无风自响，叮的一声，在拱顶里来回撞。",
      "水面应声翻涌。七八具被铁链串成一串的尸骸，从黑水里缓缓立了起来。它们脖颈上都挂着同款的铜铃，每一具的腐烂程度都不同——最早的，怕是死了三十年；最近的，手腕上还戴着铜匠的护腕。",
      "守墓人——不，守墓「们」——齐齐转向你。它们的嘴一开一合，像在替谁清点亡魂。",
    ],
    choices: [
      {
        text: "屏息凝神，辨认串起尸骸的「钟铃之线」", sub: "灵感判定：看清牵引之线",
        check: {
          attr: "inspiration", dc: 14, label: "辨铃",
          pass: "c4_sewer_clue_pass", passEffects: [{ t: "flag", k: "husk_clue", v: 1 }, { t: "sanity", v: -2 }],
          fail: "c4_sewer_clue_fail", failEffects: [{ t: "sanity", v: -4 }],
        },
      },
      {
        text: "「这水里有门。」——以读运者之法读出下水道的「出口」", sub: "【读运者专属扮演】你天生懂「门」",
        req: { pathway: "reader", hint: "需要读运者对「门」的识见" },
        next: "c4_sewer_reader", effects: [{ t: "digestion", v: 10 }, { t: "flag", k: "husk_clue", v: 1 }],
      },
      {
        text: "叩池壁三下，与水里被串起的亡者低语", sub: "【收尸人专属扮演】你听得懂死者的话",
        req: { pathway: "collector", hint: "需要收尸人的通灵" },
        next: "c4_sewer_collector", effects: [{ t: "digestion", v: 12 }, { t: "sanity", v: -3 }, { t: "flag", k: "husk_clue", v: 1 }],
      },
      { text: "拔枪正面强攻", sub: "体魄判定：硬碰", check: { attr: "physique", dc: 12, label: "强攻", pass: "c4_sewer_bashpass", fail: "c4_sewer_bashfail", failEffects: [{ t: "hp", v: -4 }] } },
    ],
  },
  {
    id: "c4_sewer_clue_pass",
    chapter: 4,
    art: "ritual",
    text: [
      "你的灵视在水汽里聚焦。蓄水池的铁柱是锚，柱顶那串铜铃是钥匙——一根肉眼几乎看不见的、由「钟声」凝成的细线，从铃舌串起水里每一具尸骸的咽喉。",
      "只要斩断那根线，守墓人就会散成一池不会再被点名的、真正的亡者。",
      "但你得先让它从水里出来，正面够得着。",
    ],
    choices: [
      { text: "叩柱引它现身，再断其线", sub: "灰河守墓人", combat: "sewer_husk", winNext: "c4_sewer_resolve", loseNext: "c4_sewer_retreat" },
    ],
  },
  {
    id: "c4_sewer_reader",
    chapter: 4,
    art: "ritual",
    text: [
      "你没有去看那根钟铃之线——你去看水。灰河的水在你眼中重新排列：这座蓄水池的出水口被人用一道拙劣的「闭门咒」焊死了一半，水才积成了这副死样子。",
      "而水底那根串尸的线，本质就是一道半开的「门」——旧钟楼在用它把亡者一只只「读」进来。",
      "你只动了出水口上三个符文，焊缝轰然洞开——不是放水，是把门「反锁」。水底那根线骤然绷紧，又被反锁的门绞得发颤。守墓人怒吼着从黑水里整个立起，直面你——它再也无法顺着水「游」回钟楼了。",
    ],
    choices: [
      { text: "趁它被困于门，正面收拾", sub: "灰河守墓人已被削弱", combat: "sewer_husk", winNext: "c4_sewer_resolve", loseNext: "c4_sewer_retreat" },
    ],
  },
  {
    id: "c4_sewer_collector",
    chapter: 4,
    art: "ritual",
    text: [
      "你曲起指节，在蓄水池边沿叩了三下——收尸人与夹缝里亡魂打交道的旧礼。",
      "黑水翻涌了一下。一个比铜铃声还细的声音，从水面渗进你的颅骨：『……别……让它……再点名……了……我……做不完的钟……做不完……』",
      "你听懂了。水里最早的亡者，是三十年前「病故」的老司钟人——他没真死，是被旧钟「点名」收进了灰河，活成了守墓人的「骨架」。后来的铜匠、钟表匠、货郎，都是被旧钟顺着他的怨，一个一个点名拽下来的。",
      "你低声许诺：会替他断铃、散魂，让他真正地死。老司钟人的残念颤了颤，把守墓人那根钟铃之线的弱点——铁柱根部的那道锈裂——连同他最后一丝怨毒，一起交给了你。",
    ],
    choices: [
      { text: "循残念指引，劈柱断铃", sub: "灰河守墓人已无退路", combat: "sewer_husk", winNext: "c4_sewer_resolve", loseNext: "c4_sewer_retreat" },
    ],
  },
  {
    id: "c4_sewer_clue_fail",
    chapter: 4,
    art: "ritual",
    text: [
      "水汽太重，你的灵视在水面上糊成一片。等你回过神，铜铃声已经齐齐响过一遍——守墓人知道了你的位置，正朝你淌水过来。",
      "没时间再辨认那根线了。只能硬碰。",
    ],
    choices: [
      { text: "拔枪应战", sub: "灰河守墓人", combat: "sewer_husk", winNext: "c4_sewer_resolve", loseNext: "c4_sewer_retreat" },
    ],
  },
  {
    id: "c4_sewer_bashpass",
    chapter: 4,
    art: "ritual",
    text: [
      "你一脚踹翻池边的铁柱，锈蚀的柱根「咔」地裂开半截——串尸的那根钟铃之线骤然一松，守墓人整个身形歪了一歪，少了一截身躯的协调。",
    ],
    choices: [
      { text: "趁它失衡，正面收拾", sub: "出其不意", combat: "sewer_husk", winNext: "c4_sewer_resolve", loseNext: "c4_sewer_retreat" },
    ],
  },
  {
    id: "c4_sewer_bashfail",
    chapter: 4,
    art: "ritual",
    text: [
      "铁柱纹丝不动，你倒被反震得手腕发麻。守墓人已经整个立出水面，铜铃齐鸣，朝你压了过来。",
    ],
    choices: [
      { text: "硬着头皮迎战", sub: "灰河守墓人", combat: "sewer_husk", winNext: "c4_sewer_resolve", loseNext: "c4_sewer_retreat" },
    ],
  },
  {
    id: "c4_sewer_resolve",
    chapter: 4,
    art: "city",
    title: "灰河归静",
    text: [
      "守墓人散成了一池不会再被点名的亡者。铜铃的线断了，水面的香灰与铜屑慢慢沉了下去，露出黑水下几十年积下的、一具又一具终于能安息的尸骨。",
      "你在铁柱根部找到了老司钟人三十年前刻下的一行小字：「钟不止，铃不歇。愿点名者，终被点名。」——他早知道会有这一天。",
      "你把铁柱上的铜铃取下，塞进了证物袋。回去的路上，灰河的水，第一次不那么黏了。",
      "魔药在你体内满意地翻涌——你又「扮演」了一回合格的值夜者：把不该被牵连的亡者，从钟声里解出来。",
    ],
    onEnter: [{ t: "pounds", v: 5 }, { t: "digestion", v: 8 }, { t: "sanity", v: 3 }, { t: "flag", k: "sewer_solved", v: 1 }, { t: "flag", k: "case_closed", v: 1 }],
    choices: [{ text: "从铁闸口返回地面", next: "c4_hub" }],
  },
  {
    id: "c4_sewer_retreat",
    chapter: 4,
    art: "city",
    text: [
      "守墓人太重，你没能拿下。你趁铜铃一记空响的间隙，顺着读出的「门」退回了铁闸口，把栅栏哐地拉上。黑水那头传来一声非人的闷吼，却没追出来——它被这道「门」暂时隔在了灰河深处。",
      "你没结了这桩案子，但至少拦住了它再点名拽人的路数。短时间内，灰河的水，不会再变黏了。",
      "邓恩听完只叹了口气：「有些案子，能压住就算赢。回头让弗莱带一队人，把铁闸焊死。」",
      "你心里清楚，这一回扮演得不算圆满——魔药也消化得慢了些。",
    ],
    onEnter: [{ t: "pounds", v: 2 }, { t: "sanity", v: -2 }],
    choices: [{ text: "带着遗憾回公司", next: "c4_hub" }],
  },
  {
    id: "c4_end",
    chapter: 4,
    art: "city",
    title: "钟声之后",
    text: [
      "钟楼事件的善后花了你整整三天。邓恩在结案报告上签字时，难得地多看了你两眼：「独立处理B级事件，还保住了三条人命（的灵魂）。卡尔，你比你表现出来的，更像一个值夜者了。」",
      "他顿了顿，灰眸里闪过一丝复杂的情绪：「但这件事不简单。唤醒第四纪的钟，需要专门的『仪式结构』。廷根有人，或者有什么组织，正在系统性地复苏这些古老的东西。」",
      "「密修会。」你说。",
      "「也许不止。」邓恩戴上礼帽，「贝克兰德来了份密电——一周后，廷根将举办一场由贵族牵头的『绯红假面舞会』，邀请了半数以上的非凡者名流。密修会的人，很可能就藏在面具后面。」",
      "「你的任务是：混进去，找出他们。这一次，你不是一个人——但能信的人，也未必是看着像盟友的那些。」",
    ],
    choices: [
      {
        text: "申请晋升序列8的仪式（最后机会）", sub: "消化度100%后可进行",
        hidden: { flag: "canAdvance", flagVal: 1, hint: "魔药尚未完全消化" },
        req: { seq: 9, hint: "你已完成晋升" },
        next: "c4_promote_late",
      },
      { text: "「我会准时赴约。」", sub: "舞会前先整备", next: "c5_start" },
    ],
  },
  {
    id: "c4_promote_late",
    chapter: 4,
    art: "ritual",
    title: "舞会前的晋升",
    text: [
      "没有时间举行完整仪式了。邓恩亲自护法，你在炼金室的圣徽前饮下序列8魔药。力量在血管里炸开，疼痛与清醒同时抵达顶点。",
      "「欢迎正式成为『怪物』。」邓恩把礼帽戴正，「虽然按照规定，我应该再说一次『死亡率不低』。但这次，我相信你会是那不死的多数。」",
    ],
    choices: [{ text: "带着新的力量，赴舞会", next: "c5_start" }],
  },
];
