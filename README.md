# yue-text-tools

我的第一个 Operit AI 脚本包，用 **TypeScript** 写。两个小工具：文本统计、文本转换。

## 目录结构

```
yue-text-tools/
├── src/
│   └── yue_text_tools.ts   # 插件源码（含 METADATA 声明 + 完整类型提示）
├── types/                  # Operit 官方类型定义（从 RockySteveJobs/Operit 拉取）
│   └── index.d.ts
├── dist/
│   └── yue_text_tools.js   # 编译产物，Operit 实际加载这个文件
├── legacy/
│   └── yue_text_tools.js   # 纯 JS 初版（参考用，已不再更新）
├── test/
│   └── run-local.js        # Node 本地测试替身
├── tsconfig.json
├── package.json
└── README.md
```

## 本地验证（不用连手机）

```bash
# 1. 安装依赖（只需一次）
npm install

# 2. 编译
npm run build        # 等价于 ./node_modules/.bin/tsc

# 3. 跑测试（测的是编译后的 dist/，最贴近真机）
node test/run-local.js
```

输出末尾显示 `6/6 个用例返回了合法结构` 就说明逻辑没问题。

## 装到手机上

1. 手机开启开发者选项 → USB 调试
2. 用数据线连电脑，或同一局域网下 `adb connect 手机IP:5555`
3. 打开 Operit AI
4. 把 `dist/yue_text_tools.js` 通过 Operit 的脚本包导入入口导入
5. 在聊天里 @ 这个工具包，或者直接让它「统计一段文字的字数」

> 注意：手机加载的是 `dist/` 里的编译产物，不是 `src/` 源码。改完源码记得先 `npm run build`。

## 三个必须对上的名字

Operit 靠三处同名来发现工具，少一处都不行：

| 位置 | 例子 |
| --- | --- |
| `METADATA.tools[].name` | `"text_stats"` |
| 实现函数名 | `async function text_stats(params)` |
| 导出语句 | `exports.text_stats = text_stats` |

## 关于返回值

**不要用 `return` 返回结果**。宿主要的是 `complete(...)`：

```ts
complete({ success: true, data: { ... }, message: "给人看的一句话" });
complete({ success: false, message: "失败原因" });
```

`complete` 是泛型、返回 `void`——这就是必须用它的原因，`return` 出来的值没有任何地方接。
每条结束路径都要调，且只调一次。`return` 只用来做本地流程控制。

## 类型提示怎么来的

`types/index.d.ts` 是 Operit 官方仓库的类型定义，声明了 `complete`、`exports`、`METADATA` 等。
在 VSCode 里打开 `src/yue_text_tools.ts`，顶部那行：

```ts
/// <reference path="../types/index.d.ts" />
```

让编辑器知道 `complete` 的签名，写参数时有自动补全，改错地方会飘红。

## 下一步

- 加更多工具：在 `METADATA.tools` 里加一项，写对应函数，`exports` 导出即可
- 想带 UI / 资源 / 生命周期钩子 → 升级成 ToolPkg，需要 `manifest.json` + `main.ts` + `packages/`
