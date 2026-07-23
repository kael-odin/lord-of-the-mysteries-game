# 雾中余烬 · 诡秘之主同人互动冒险

以爱潜水的乌贼《诡秘之主》为蓝本的**非官方、非商业粉丝同人**在线文字冒险游戏。在蒸汽与煤气灯的廷根死而复生，饮下魔药、扮演序列、守住理智——直到灰雾之上的注视降临。

> 本项目为粉丝同人作品，与原作者及出版方无任何隶属关系。原作版权归作者所有。

## 玩法

- **五大章节**：苏醒 → 值夜者 → 安提哥努斯的阴影 → 钟楼失踪案 → 绯红假面舞会
- **二十二途径（五选一）**：占卜家、不眠者、收尸人、窥秘人、猎人，从序列9攀升至序列8
- **扮演法·魔药消化**：做出符合途径「扮演法则」的选择可加速魔药消化，消化满100%可申请晋升
- **三属性 D20 判定**：体魄 / 灵感 / 意志 + 途径修正 + 幸运，失败会推进到不同的（通常更危险的）分支
- **回合制战斗**：攻击 / 途径能力 / 物品 / 冥想，含护盾、易伤、凋零、暴击等机制
- **理智与失控**：直视超凡损耗理智，归零即失控结局；可通过教堂祈祷、药剂、护符缓解
- **11 种结局**：从灰雾之邀到篡夺者、殉锚、廷根之狼……

## 存档

- **本地优先**：以浏览器 IndexedDB 为权威存档来源，离线亦可游玩
- **多存档位**：1 个自动位 + 3 个手动位，可随时新建 / 读取 / 删除
- **可选云端备份**：若配置了 PostgreSQL（`DATABASE_URL`），存档会异步备份到云端；未配置时游戏照常运行
- **结局回廊**：已达成的结局会在秘典中揭示，未达成的以封缄之雾遮蔽

## 开发

```bash
npm install      # 安装依赖
npm run dev      # 开发服务器（http://localhost:3000）
npm run build    # 生产构建（无需 DATABASE_URL 即可构建）
npm run typecheck
npm run lint
```

构建与运行**不依赖数据库**——PostgreSQL 仅在配置了 `DATABASE_URL` 时启用，用于可选的云端存档备份与「灰雾回响」公开列表。

## 技术栈

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Drizzle ORM · PostgreSQL（可选）· lucide-react

## 目录结构

```
src/
  app/                      Next.js App Router
    page.tsx                落地页
    game/page.tsx           主游戏循环
    api/game/               可选云端存档 API
  components/game/          游戏组件（Hud / CombatPanel / PathwaySelect / EndingScreen / SaveSlotsPanel / CodexModal / DiceOverlay）
  lib/game/
    types.ts engine.ts      核心引擎与类型
    data.ts                 途径 / 物品 / 敌人
    story1.ts story2.ts     第一~三章
    story3.ts story4.ts     第四~五章 + 新结局
    art.ts                  原创 SVG 场景背景
    persistence/            本地优先存档（IndexedDB）
  db/                       Drizzle schema（可选 Postgres）
```

## 非目标与版权

- 不收录小说全文、官方/动画/同人画作、未授权音乐
- 对白、叙事、场景美术均为重新创作；仅使用极少量的标志性短语
- 非商业、无广告、无内购
