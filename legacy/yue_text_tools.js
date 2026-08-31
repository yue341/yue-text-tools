/*
METADATA
{
  "name": "yue_text_tools",
  "description": {
    "zh": "文本统计与转换工具",
    "en": "Text statistics and transformation tools"
  },
  "category": "Utility",
  "tools": [
    {
      "name": "text_stats",
      "description": {
        "zh": "统计文本的字符数、中文字数、英文词数和行数",
        "en": "Count characters, CJK characters, English words and lines"
      },
      "parameters": [
        {
          "name": "text",
          "description": {
            "zh": "要统计的文本",
            "en": "The text to analyse"
          },
          "type": "string",
          "required": true
        }
      ]
    },
    {
      "name": "text_transform",
      "description": {
        "zh": "对文本做大小写、去空白、反转等转换",
        "en": "Transform text with upper, lower, trim, reverse or compact"
      },
      "parameters": [
        {
          "name": "text",
          "description": {
            "zh": "要转换的文本",
            "en": "The text to transform"
          },
          "type": "string",
          "required": true
        },
        {
          "name": "mode",
          "description": {
            "zh": "转换模式：upper / lower / trim / compact / reverse",
            "en": "Transform mode: upper, lower, trim, compact or reverse"
          },
          "type": "string",
          "required": false
        }
      ]
    }
  ]
}
*/

const TRANSFORM_MODES = ["upper", "lower", "trim", "compact", "reverse"];

async function text_stats(params) {
  try {
    const text = params && typeof params.text === "string" ? params.text : "";
    if (!text) {
      complete({ success: false, message: "参数 text 不能为空" });
      return;
    }

    const chars = Array.from(text);
    const cjk = chars.filter((ch) => /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/.test(ch)).length;
    const englishWords = (text.match(/[A-Za-z]+(?:'[A-Za-z]+)?/g) || []).length;
    const lines = text.split(/\r\n|\r|\n/).length;

    complete({
      success: true,
      data: {
        characters: chars.length,
        charactersNoSpace: chars.filter((ch) => !/\s/.test(ch)).length,
        cjkCharacters: cjk,
        englishWords: englishWords,
        lines: lines,
      },
      message: `共 ${chars.length} 个字符，其中中文 ${cjk} 个，英文单词 ${englishWords} 个，${lines} 行`,
    });
  } catch (error) {
    complete({
      success: false,
      message: String(error && error.message ? error.message : error),
    });
  }
}

async function text_transform(params) {
  try {
    const text = params && typeof params.text === "string" ? params.text : "";
    if (!text) {
      complete({ success: false, message: "参数 text 不能为空" });
      return;
    }

    const mode = String((params && params.mode) || "trim").toLowerCase();
    if (TRANSFORM_MODES.indexOf(mode) === -1) {
      complete({
        success: false,
        message: `不支持的模式 ${mode}，可选：${TRANSFORM_MODES.join(" / ")}`,
      });
      return;
    }

    let result = text;
    if (mode === "upper") result = text.toUpperCase();
    if (mode === "lower") result = text.toLowerCase();
    if (mode === "trim") result = text.trim();
    if (mode === "compact") result = text.replace(/\s+/g, "");
    if (mode === "reverse") result = Array.from(text).reverse().join("");

    complete({
      success: true,
      data: { mode: mode, result: result },
      message: `已按 ${mode} 转换，结果长度 ${Array.from(result).length}`,
    });
  } catch (error) {
    complete({
      success: false,
      message: String(error && error.message ? error.message : error),
    });
  }
}

exports.text_stats = text_stats;
exports.text_transform = text_transform;
