/*
 * 本地测试脚本：在 Node 里模拟 Operit 宿主的 complete() 调用。
 *
 * 用法：
 *   npm run build   # 先编译 src/*.ts -> dist/*.js
 *   npm test        # 再跑这个脚本
 *
 * 默认测 dist/yue_text_tools.js —— 那是 Operit 真正加载的文件。
 * 想测第一版 JS，设环境变量： TARGET=legacy npm test
 *
 * 说明：手机上真实运行时，complete() 由 Operit 提供；
 * 这里只是做个替身，让你不用连手机也能验证逻辑对不对。
 */

const path = require("path");

const target = process.env.TARGET === "legacy" ? "legacy/yue_text_tools.js" : "dist/yue_text_tools.js";
const modulePath = path.join(__dirname, "..", target);

let tools;
try {
  tools = require(modulePath);
} catch (error) {
  console.error(`加载失败：${modulePath}`);
  console.error(`原因：${error.message}`);
  console.error("\n如果测的是 dist，请先执行 npm run build");
  process.exit(1);
}

function runCapture(fnName, args) {
  return new Promise((resolve) => {
    let captured = null;
    global.complete = (result) => {
      captured = result;
    };
    Promise.resolve(tools[fnName](args)).then(() => {
      global.complete = undefined;
      resolve(captured);
    });
  });
}

async function main() {
  const cases = [
    ["text_stats", { text: "你好，济南！Hello Jinan.\n第二行" }],
    ["text_stats", { text: "" }],
    ["text_transform", { text: "  Hello  Yue  ", mode: "compact" }],
    ["text_transform", { text: "Operit Plugin", mode: "upper" }],
    ["text_transform", { text: "汀", mode: "reverse" }],
    ["text_transform", { text: "abc", mode: "explode" }],
  ];

  let failed = 0;
  for (const [fn, args] of cases) {
    const result = await runCapture(fn, args);
    const ok = result && typeof result.success === "boolean";
    if (!ok) failed++;
    const flag = ok ? "OK  " : "FAIL";
    console.log(`\n${flag} [${fn}] ${JSON.stringify(args)}`);
    console.log(`     -> ${JSON.stringify(result)}`);
  }

  console.log(`\n===== 目标：${target} =====`);
  console.log(`===== ${cases.length - failed}/${cases.length} 个用例返回了合法结构 =====`);
  if (failed > 0) process.exitCode = 1;
}

main();
