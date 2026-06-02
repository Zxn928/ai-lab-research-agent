# AI创新实验室·线下调研诊断Agent工作台

面向 AI创新实验室线下调研交付场景的多 Agent 诊断工作台。V1 聚焦访谈前准备和访谈后诊断，不做实时录音转写、多人协同和企业端账号系统。

## 技术栈

- 前端：React + TypeScript + Vite + Tailwind CSS
- 后端：Node.js + Express
- 本地数据：IndexedDB，轻量设置使用 localStorage 预留
- 文件导入：Excel、CSV、图片、Markdown、TXT
- 文件导出：Markdown、JSON
- AI 能力：OpenAI Responses API

## 启动

```bash
npm install
cp .env.example .env
npm run dev
```

前端默认运行在 http://localhost:3000，后端默认运行在 http://localhost:3001。

## 必填环境变量

```bash
OPENAI_API_KEY=
OPENAI_TEXT_MODEL=gpt-5.5
OPENAI_VISION_MODEL=gpt-5.5
SEARCH_PROVIDER=openai
SEARCH_API_KEY=
PORT=3001
```

## 用户后续放入文件的位置

- 诊断报告模板：`public/templates/report-template.md`
- 报告章节结构：`src/references/report-structure.md`
- AI报告生成模板：`src/prompts/templates/internal-diagnosis-report.md`
- 胜业电气线上问卷：`public/demo/shengye-electric/questionnaire-sample.xlsx` 或 `questionnaire-sample.csv`
- 问卷字段映射：`public/demo/shengye-electric/questionnaire-field-map.json`
- 胜业电气组织架构图：`public/demo/shengye-electric/org-structure-image.png`
- 组织架构解析结果：`public/demo/shengye-electric/org-structure-parsed.json`

如果真实文件尚未放入，页面会提示用户上传或补充，不生成虚构 Demo 数据。

## V1 数据口径

系统内部统一使用 JSON 保存和流转，Markdown 仅用于导出和报告初稿。问卷优先支持 Excel，并兼容 CSV；宽表问卷会转换为一行一个问题答案的统一记录。
