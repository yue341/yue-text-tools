/*
 * 本地测试脚本：在 Node 里模拟 Operit 宿主的 complete() 调用。
 * 用法：
 *   node test/run-local.js
 *
 * 说明：手机上真实运行时，complete() 由 Operit 提供；
 * 这里只是做个替身，让你不用连手机也能验证逻辑对不对。
 */

const path = require("path");
const tools = require(path.join(__dirname, "..", "yue_text_tools.js"));

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
    console.log(`\n[${fn}] ${JSON.stringify(args)}`);
    console.log(`  -> ${JSON.stringify(result, null, 2).replace(/\n/g, "\n  ")}`);
  }

  console.log(`\n===== ${cases.length - failed}/${cases.length} 个用例返回了合法结构 =====`);
  if (failed > 0) process.exitCode = 1;
}

main();
