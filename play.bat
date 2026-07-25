@echo off
chcp 65001 >nul 2>&1
setlocal

REM ============================================================
REM  《诡秘之主》非官方、非商业粉丝同人游戏 · 双击即玩启动器
REM  双击本文件即可：检测 Node → 装依赖（若缺）→ 启动 → 开浏览器
REM  关掉弹出的这个窗口，即可停止服务器。
REM ============================================================

title 雾中余烬 · 启动器

cd /d "%~dp0"

REM ---- 检测 Node ----
where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo  ------------------------------------------------------------
  echo   没有检测到 Node.js —— 这游戏需要 Node 才能跑起来。
  echo   请先安装 Node.js 的 LTS 版本（一路下一步即可）：
  echo.
  echo     https://nodejs.org/zh-cn/download
  echo.
  echo   装完后重新双击本文件就行。
  echo  ------------------------------------------------------------
  echo.
  pause
  exit /b 1
)

REM ---- 检测 npm ----
where npm >nul 2>nul
if errorlevel 1 (
  echo.
  echo  未检测到 npm，请确认 Node.js 安装完整后重试。
  echo.
  pause
  exit /b 1
)

REM ---- 跑跨平台启动器 ----
node "%~dp0play.mjs"

REM 异常退出时别一闪而过
if errorlevel 1 (
  echo.
  echo  启动遇到问题。上面若有报错信息，请截图反馈。
  echo.
  pause
)

endlocal
