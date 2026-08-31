# yue-text-tools

我的第一个 Operit AI 脚本包。两个小工具：文本统计、文本转换。

## 目录

```
yue-text-tools/
├── yue_text_tools.js     # 插件本体（含 METADATA 声明）
├── test/
│   └── run-local.js      # Node 本地测试替身
└── README.md
```

## 本地验证

不需要连手机，直接在终端跑：

```bash
node test/run-local.js
```

脚本会把 `complete(...)` 换成一个替身函数，捕获每次调用的返回值并打印出来。
只要输出末尾显示 `6/6 个用例返回了合法结构`，说明逻辑没问题。

## 装到手机上

1. 手机开启开发者选项 → USB 调试
2. 用数据线连电脑，或同一局域网下 `adb connect 手机IP:5555`
3. 打开 Operit AI
4. 把 `yue_text_tools.js` 通过 Operit 的脚本包导入入口导入
5. 在聊天里 @ 这个工具包，或者直接让它「统计一段文字的字数」

## 三个必须对上的名字

Operit 靠三处同名来发现工具，少一处都不行：

| 位置 | 例子 |
| --- | --- |
| `METADATA.tools[].name` | `"text_stats"` |
| 实现函数名 | `async function text_stats(params)` |
| 导出语句 | `exports.text_stats = text_stats` |

## 关于返回值

**不要用 `return` 返回结果**。宿主要的是 `complete(...)`：

```js
complete({ success: true, data: { ... }, message: "给人看的一句话" });
complete({ success: false, message: "失败原因" });
```

每条结束路径都要调，且只调一次。`return` 只用来做本地流程控制，后面记得跟 `;` 提前退出。

## 下一步

- 想加类型提示 → 复制 `.ts` 版本，加 `/// <reference path="./types/index.d.ts" />`
- 想带 UI / 资源 / 生命周期钩子 → 升级成 ToolPkg，需要 `manifest.json` + `main.ts` + `packages/`
