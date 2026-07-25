#!/usr/bin/env bash
# 《诡秘之主》非官方、非商业粉丝同人游戏 · macOS/Linux 启动器
# 用法：终端里  ./play.sh   或双击（若文件管理器支持）
set -e
cd "$(dirname "$0")"

if ! command -v node >/dev/null 2>&1; then
  echo "------------------------------------------------------------"
  echo " 没有检测到 Node.js —— 这游戏需要 Node 才能跑起来。"
  echo " 请先安装 Node.js 的 LTS 版本："
  echo "   https://nodejs.org/zh-cn/download"
  echo " 装完后重新运行本脚本即可。"
  echo "------------------------------------------------------------"
  exit 1
fi

exec node "$(dirname "$0")/play.mjs"
