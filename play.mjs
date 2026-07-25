#!/usr/bin/env node
// 双击即玩启动器 · 跨平台（Windows / macOS / Linux）
// 做的事：检测 Node → 缺依赖就 npm install → 启动 npm run dev → 自动开浏览器到 http://localhost:3000
// 用法：
//   - Windows: 双击 play.bat（它会调用本文件）
//   - 任意系统命令行: node play.mjs
//
// 这是《诡秘之主》非官方、非商业粉丝同人游戏的本地启动脚本。
// 不连数据库、不需要环境变量，跑起来就能玩。

import { spawn, spawnSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "node:net";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = 3000;
const URL = `http://localhost:${PORT}`;

// ---------- 工具：带颜色的输出 ----------
const isTTY = process.stdout.isTTY;
const c = (code, s) => (isTTY ? `\x1b[${code}m${s}\x1b[0m` : s);
const amber = (s) => c("33", s);   // 雾中灯火色
const dim = (s) => c("2;37", s);
const green = (s) => c("32", s);
const red = (s) => c("31", s);
const bold = (s) => c("1", s);

function log(msg) { process.stdout.write(msg + "\n"); }

// ---------- 1. 检测 Node 版本 ----------
const major = Number.parseInt(process.versions.node.split(".")[0], 10);
if (major < 18) {
  log(red("✗ 需要 Node.js 18 或更高版本（当前 " + process.versions.node + "）。"));
  log(dim("  请到 https://nodejs.org/ 下载安装 LTS 版本后重试。"));
  process.exit(1);
}

// ---------- 2. 缺依赖就装 ----------
// Windows 上 npm 实际是 npm.cmd，spawn 不带 shell 时无法直接解析它。
// 用 cmd /c 包一层：参数以数组形式传给 cmd.exe，由 cmd 内部解析 npm，
// 既不触发 Node 的 DEP0190（args + shell:true）警告，也无需手动解析 PATH。
const isWin = process.platform === "win32";
// win32: ["cmd","/c","npm",...args]；其它平台: ["npm",...args]
// 返回 { cmd, args }，供 spawn / spawnSync 使用（命令与参数分离）
const npmSpawn = (args) =>
  isWin ? { cmd: "cmd", args: ["/c", "npm", ...args] } : { cmd: "npm", args };

const nodeModules = join(__dirname, "node_modules");
const pkgJson = join(__dirname, "package.json");
if (!existsSync(pkgJson)) {
  log(red("✗ 没有找到 package.json——请确认你是把整个仓库都下载下来了，而不是只下了部分文件。"));
  process.exit(1);
}
let needInstall = !existsSync(nodeModules);
if (!needInstall) {
  // node_modules 存在，但若是空壳（比如解压不全），也补装
  try {
    if (statSync(nodeModules).size === 0) needInstall = true;
  } catch { needInstall = true; }
}

if (needInstall) {
  log(amber("◇ 首次运行，正在安装依赖（只需一次，请稍候）……"));
  const { cmd: instCmd, args: instArgs } = npmSpawn(["install", "--no-audit", "--no-fund"]);
  const install = spawnSync(instCmd, instArgs, {
    cwd: __dirname,
    stdio: "inherit",
  });
  if (install.status !== 0) {
    log(red("✗ 依赖安装失败。请手动运行：npm install"));
    process.exit(1);
  }
  log(green("✓ 依赖就绪。"));
}

// ---------- 3. 检查端口是否已被占用（占用就提示，避免起第二个） ----------
function isPortTaken(port) {
  return new Promise((resolve) => {
    const tester = createServer();
    tester.once("error", () => resolve(true));
    tester.once("listening", () => {
      tester.close(() => resolve(false));
    });
    tester.listen(port, "127.0.0.1");
  });
}

// ---------- 4. 启动 dev 服务器 ----------
log(amber("◇ 启动开发服务器（首次编译需要几秒到十几秒）……"));
log(dim(`  ${URL}  即将打开\n`));

const { cmd: devCmd, args: devArgs } = npmSpawn(["run", "dev"]);
const dev = spawn(devCmd, devArgs, {
  cwd: __dirname,
  stdio: "inherit",
});

// 捕获 Ctrl-C，把信号转给子进程，避免孤儿 next 进程
process.on("SIGINT", () => dev.kill("SIGINT"));
process.on("SIGTERM", () => dev.kill("SIGTERM"));

// ---------- 5. 等 ready 后开浏览器 ----------
let opened = false;
async function waitForReady() {
  // Next 在 stdout 打印 "Ready" 或 "Local:"；这里轮询端口更稳
  for (let i = 0; i < 120; i++) {
    // 每 500ms 探测一次，最多 60 秒
    if (await isPortTaken(PORT)) {
      if (!opened) {
        opened = true;
        log(green(`\n✓ 服务器已就绪，正在打开浏览器 → ${URL}`));
        openBrowser(URL);
        log(dim(`  （若浏览器没自动弹出，请手动访问：${URL}）`));
        log(dim(`  玩够了，关掉这个窗口即可停止服务器。\n`));
      }
      return;
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  if (!opened) {
    log(amber(`\n◇ 启动似乎花了点时间。若浏览器没自动弹出，请手动访问：${URL}`));
  }
}

function openBrowser(url) {
  const plat = process.platform;
  try {
    if (plat === "win32") {
      spawn("cmd", ["/c", "start", "", url], { detached: true, stdio: "ignore" }).unref();
    } else if (plat === "darwin") {
      spawn("open", [url], { detached: true, stdio: "ignore" }).unref();
    } else {
      spawn("xdg-open", [url], { detached: true, stdio: "ignore" }).unref();
    }
  } catch {
    /* 静默失败，已用文字提示 */
  }
}

waitForReady();

// ---------- 6. dev 进程退出 → 整个脚本一起退 ----------
dev.on("exit", (code) => process.exit(code ?? 0));
