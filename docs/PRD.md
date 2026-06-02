可以，下面这份就是你可以直接丢给 Codex 的开发总提示词 / PRD 初稿。我已经把你说的报告模板、线下问卷 CSV、胜业电气 Demo 数据位置都预留好了。

OpenAI 这部分建议用 Responses API 做文本、图片输入和工具调用；官方文档说明 Responses API 支持文本/图像输入，并可扩展 web search、file search 等工具，web search 也可以通过 tools 数组启用。 ￼ 组织架构图识别可走 OpenAI 视觉能力，官方文档也说明 Responses API 支持图像输入分析。 ￼

Codex开发任务：AI创新实验室·线下调研诊断Agent工作台 V1.0

一、项目定位

请开发一个名为 AI创新实验室·线下调研诊断Agent工作台 的 Web 应用。

本项目不是通用聊天机器人，也不是简单问卷总结工具，而是面向“AI创新实验室”线下调研交付场景的多Agent诊断工作台。

系统核心目标是支持项目负责人和调研顾问完成两个阶段的工作：

1. 访谈前准备阶段
    根据企业名称、企业公网信息、组织架构图、线上调研问卷CSV/Excel，生成高层访谈提纲、各部门访谈提纲、具体问题、深挖追问问题和现场调研资料包。
2. 访谈后诊断阶段
    根据用户按部门导入的录音转写、会议纪要、项目负责人个人理解，生成结构化访谈纪要、问题覆盖度检查、部门痛点清单、跨部门共性问题、AI场景清单、AI机会地图和内部诊断报告Markdown初稿。

系统不做实时访谈助手，不做实时录音转写，不做多人协同，不做企业端账号系统。V1重点是“访谈前准备 + 访谈后诊断”。

⸻

二、技术架构

采用：

* 前端：React + TypeScript + Vite
* 后端：Node.js + Express 或 Fastify
* 样式：Tailwind CSS
* 本地数据：IndexedDB / localStorage
* 文件导入：CSV、Excel、图片、Markdown、TXT
* 文件导出：Markdown、JSON
* AI能力：OpenAI API
* 搜索能力：可插拔搜索服务

环境变量

请预留以下配置：

OPENAI_API_KEY=
OPENAI_TEXT_MODEL=
OPENAI_VISION_MODEL=
SEARCH_PROVIDER=openai
SEARCH_API_KEY=
PORT=3001

搜索服务需要设计为可插拔：

* OpenAI Web Search，优先
* Tavily Search，备用
* Bing Search API，备用
* 如果未配置搜索Key，则允许用户手动粘贴企业公开资料

⸻

三、核心业务流程

阶段一：访谈前准备

1. 项目初始化

用户输入：

* 项目名称
* 企业名称
* 行业，可选
* 调研时间，可选
* 项目背景，可选
* 项目备注，可选

示例：

项目名称：胜业电气AI创新实验室线下调研
企业名称：胜业电气股份有限公司
项目阶段：线下调研准备阶段

⸻

2. 企业信息自动收集

系统根据企业名称自动联网检索企业公网信息。

输出内容包括：

* 企业基本信息
* 主营业务
* 产品与服务
* 行业定位
* 官网资料
* 公开新闻
* 资质荣誉
* 招聘信息中反映出的组织能力
* 可能的业务流程
* 可能存在的AI应用假设

重要约束：

公网信息只能作为访谈前假设，不能作为最终诊断结论。
最终诊断结论必须以问卷反馈、组织架构、访谈材料和人工审核为准。

⸻

3. 组织架构图识别

用户上传组织架构图图片。

系统调用 OpenAI 视觉模型识别图片内容，输出：

* 部门清单
* 部门层级
* 部门类别
* 建议访谈部门
* 每个部门的访谈重点
* 建议访谈优先级

必须支持用户手动修正识别结果：

* 新增部门
* 删除部门
* 合并部门
* 修改部门名称
* 调整部门顺序

⸻

4. 线上问卷导入

用户上传线上调研问卷结果，优先支持 CSV，同时支持 Excel。

系统需要提供字段映射页面，允许用户将CSV/Excel列映射为：

* 部门
* 姓名，可选
* 岗位，可选
* 问题
* 回答
* 提交时间，可选
* 备注，可选

问卷分析Agent输出：

* 各部门反馈摘要
* 高频问题关键词
* 初步痛点假设
* 疑似AI场景线索
* 需要线下访谈核实的问题
* 部门之间的共性问题线索

⸻

5. 逐部门生成访谈提纲

系统按部门逐个生成调研访谈提纲，避免一次性生成全部导致上下文过长。

每个部门访谈提纲包括：

1. 访谈目标
2. 部门职责确认问题
3. 当前核心流程问题
4. 高频重复工作问题
5. 当前主要痛点问题
6. 数据与系统现状问题
7. 跨部门协同问题
8. 异常处理机制问题
9. AI可切入方向问题
10. 深挖追问问题
11. 现场需补充资料清单

要求：

* 通用结构可以统一
* 每个部门必须生成部门专属问题
* 问题风格为“咨询顾问型 + 痛点深挖型”
* 不要只问“有没有AI需求”
* 要围绕流程、数据、系统、效率、异常、协同、成本、质量、交付等维度设计问题

⸻

6. 生成现场调研资料包

系统生成一份可导出的 Markdown 现场调研资料包。

资料包包含：

1. 项目基本信息
2. 企业公网画像
3. 组织架构识别结果
4. 问卷反馈初步分析
5. 高层访谈提纲
6. 各部门访谈提纲
7. 每个部门的深挖追问问题
8. 需要现场核实的问题
9. 需要企业补充的资料清单
10. 访谈记录模板

支持：

* 一键导出总Markdown
* 单部门单独导出Markdown

⸻

阶段二：访谈后诊断

1. 按部门导入访谈材料

用户在线下访谈结束后，按部门导入材料。

每个部门一个独立输入区，包括：

* 录音转写
* 会议纪要
* 项目负责人个人理解
* 补充资料说明

注意：

项目负责人个人理解必须单独输入，不要和企业原始表达混在一起。

系统输出时必须区分：

* 企业明确反馈
* 会议纪要归纳
* 项目负责人判断
* AI推测
* 待核实事项

⸻

2. 访谈材料结构化

系统按部门整理访谈材料，输出：

* 部门基本情况
* 核心流程
* 主要工作内容
* 高频重复工作
* 关键痛点
* 当前做法
* 涉及系统
* 涉及数据
* 跨部门协同问题
* 潜在AI机会
* 证据来源

⸻

3. 问题覆盖度检查

系统对照访谈前生成的提纲，检查每个部门的问题覆盖情况。

输出：

* 已覆盖问题
* 部分覆盖问题
* 未覆盖问题
* 回答过浅的问题
* 缺少证据的问题
* 不适合直接写入报告的结论
* 可写入报告但需要弱化表达的结论

由于线下访谈只有一次，每个部门约1小时，系统不要提示“下一轮访谈”，而是要提示：

在现有材料不足的情况下，该结论可信度较低，报告中应降低表达强度。

覆盖度检查示例：

原问题	是否覆盖	覆盖质量	处理建议
当前报价流程耗时多久？	部分覆盖	低	报告中只能表述为“存在报价效率提升诉求”，不能写具体耗时
是否有历史报价库？	已覆盖	中	可作为智能报价助手依据
是否有结构化数据？	未覆盖	低	AI场景数据条件标记为待确认

⸻

4. 痛点诊断

痛点诊断Agent从所有材料中提炼：

* 部门痛点
* 跨部门共性痛点
* 痛点证据链
* 痛点强度
* 是否适合AI解决
* 如果不适合AI，应归类为流程优化、数据治理、组织机制或信息化系统问题

每个痛点需要包含：

* 痛点名称
* 所属部门
* 痛点描述
* 当前做法
* 影响范围
* 证据来源
* 可信度
* 审核状态

审核状态包括：

* 待确认
* 已采纳
* 需补充
* 暂不推进
* 已转入课程Demo
* 已转入赛马项目
* 已转入陪跑落地

⸻

5. AI场景生成

AI场景生成Agent将已采纳或待确认的痛点转化为AI场景卡片。

每个场景卡片包含：

* 场景名称
* 适用部门
* 关联痛点
* 当前问题
* AI解决思路
* 可能技术路线
* 所需数据
* 所需系统接口
* 业务价值
* 落地难度
* 风险与前置条件
* 是否适合课程Demo
* 是否适合赛马项目
* 是否适合陪跑落地
* 评分
* 优先级
* 审核状态

场景审核状态包括：

* 待确认
* 已采纳
* 需补充
* 暂不推进
* 已转入课程Demo
* 已转入赛马项目
* 已转入陪跑落地

⸻

6. AI场景评分体系

采用100分制，8个维度：

维度	权重	说明
业务价值	20%	是否影响效率、成本、质量、交付、收入
痛点强度	15%	是否高频、刚性、影响范围大
技术可行性	15%	现有AI/RPA/知识库/数据分析是否可实现
数据可获得性	15%	是否有数据、文档、系统记录、历史样本
流程清晰度	10%	业务规则是否明确、流程是否可标准化
组织配合度	10%	是否有负责人、是否愿意试点
一个月可见成效	10%	是否能在AI创新实验室陪跑周期内看到结果
示范复制性	5%	是否适合作为标杆案例复制

评分结果：

总分	结论
80分以上	优先落地
65-79分	重点培育
50-64分	谨慎推进
50分以下	暂缓推进

⸻

7. AI机会地图

生成“业务价值 × 落地难度”四象限。

横轴：业务价值，低 → 高
纵轴：落地难度，低 → 高

四象限：

象限	策略
高价值低难度	优先落地
高价值高难度	战略攻坚
低价值低难度	快速改善/课程练习
低价值高难度	暂缓推进

⸻

8. 内部诊断报告生成

生成内部诊断报告Markdown初稿。

报告定位：

项目团队内部诊断报告初稿，可经人工润色后转化为企业汇报版。

报告生成必须遵循：

事实 — 判断 — 建议

示例：

* 事实：生产部门反馈当前异常处理主要依赖人工沟通和事后统计。
* 判断：该问题反映出订单交付过程中的异常预警和闭环机制仍有提升空间。
* 建议：可优先探索订单交付督办Agent，实现异常识别、责任提醒和闭环追踪。

报告结构后续由用户放入仓库中的模板文件决定。

请在项目中预留以下位置：

src/references/report-structure.md
src/prompts/templates/internal-diagnosis-report.md
public/templates/report-template.md

如果模板不存在，则使用默认结构：

1. 项目背景与调研说明
2. 企业基本情况
3. 调研范围与访谈对象
4. 各部门问题梳理
5. 跨部门共性问题
6. AI应用机会地图
7. 重点AI场景建议
8. 场景优先级与落地路径
9. 课程Demo与赛马方向建议
10. 后续工作建议
11. 附录：访谈材料与证据链

⸻

四、多Agent设计

1. Orchestrator Agent

文件：

src/agents/orchestratorAgent.ts
src/prompts/system/orchestrator.md

职责：

* 判断当前项目阶段
* 调度其他Agent
* 检查资料完整度
* 管理工作流状态
* 汇总各Agent输出
* 提醒用户下一步操作

⸻

2. Company Research Agent

文件：

src/agents/companyResearchAgent.ts
src/prompts/system/company-research.md

职责：

* 根据企业名称自动联网检索
* 输出企业公网画像
* 标注信息来源
* 区分公开事实和AI推测
* 生成访谈前假设

⸻

3. Org Structure Agent

文件：

src/agents/orgStructureAgent.ts
src/prompts/system/org-structure.md

职责：

* 识别组织架构图图片
* 提取部门
* 判断部门类型
* 输出访谈部门建议
* 允许用户修正识别结果

⸻

4. Questionnaire Analysis Agent

文件：

src/agents/questionnaireAnalysisAgent.ts
src/prompts/system/questionnaire-analysis.md

职责：

* 解析CSV/Excel
* 执行字段映射
* 按部门聚合问卷反馈
* 提炼高频问题
* 生成访谈核实问题
* 识别AI场景线索

⸻

5. Interview Guide Agent

文件：

src/agents/interviewGuideAgent.ts
src/prompts/system/interview-guide.md

职责：

* 按部门逐个生成访谈提纲
* 生成高层访谈提纲
* 生成部门专属问题
* 生成深挖追问问题
* 生成现场资料补充清单

⸻

6. Fieldwork Package Agent

文件：

src/agents/fieldworkPackageAgent.ts
src/prompts/system/fieldwork-package.md

职责：

* 汇总访谈前所有材料
* 生成现场调研资料包
* 支持总Markdown导出
* 支持单部门Markdown导出

⸻

7. Interview Material Structuring Agent

文件：

src/agents/interviewMaterialStructuringAgent.ts
src/prompts/system/interview-material-structuring.md

职责：

* 按部门整理录音转写、会议纪要、个人理解
* 区分事实、判断、建议、推测、待核实
* 生成结构化部门纪要

⸻

8. Coverage Check Agent

文件：

src/agents/coverageCheckAgent.ts
src/prompts/system/coverage-check.md

职责：

* 对照访谈前提纲
* 检查问题覆盖度
* 判断材料是否足够支撑报告结论
* 标记低可信度内容
* 提醒报告中需要弱化表达的地方

⸻

9. Pain Point Diagnosis Agent

文件：

src/agents/painPointDiagnosisAgent.ts
src/prompts/system/pain-point-diagnosis.md

职责：

* 提炼部门痛点
* 归纳跨部门共性问题
* 标注证据链
* 判断是否适合AI解决
* 区分AI问题、流程问题、数据治理问题、组织机制问题、信息化问题

⸻

10. AI Scenario Agent

文件：

src/agents/scenarioAgent.ts
src/prompts/system/ai-scenario.md

职责：

* 将痛点转化为AI场景卡片
* 生成技术路线
* 评估数据条件
* 计算场景评分
* 生成优先级
* 标记适合课程Demo、赛马、陪跑的方向

⸻

11. Opportunity Map Agent

文件：

src/agents/opportunityMapAgent.ts
src/prompts/system/opportunity-map.md

职责：

* 根据AI场景生成四象限机会地图
* 输出Markdown表格
* 输出可视化数据结构

⸻

12. Report Draft Agent

文件：

src/agents/reportDraftAgent.ts
src/prompts/system/report-draft.md

职责：

* 根据报告模板生成内部诊断报告Markdown初稿
* 遵循事实—判断—建议结构
* 引用痛点、证据链、场景卡片
* 不夸大，不硬套AI
* 生成适合项目团队人工润色的报告初稿

⸻

五、项目目录结构

请按以下结构创建项目：

ai-lab-research-agent/
├── AGENTS.md
├── README.md
├── package.json
├── .env.example
├── docs/
│   ├── PRD.md
│   ├── USER_FLOW.md
│   ├── DATA_SCHEMA.md
│   ├── PROMPT_DESIGN.md
│   ├── EXPORT_SPEC.md
│   └── ACCEPTANCE_CRITERIA.md
├── public/
│   ├── templates/
│   │   ├── report-template.md
│   │   ├── questionnaire-field-map-template.json
│   │   └── fieldwork-package-template.md
│   └── demo/
│       └── shengye-electric/
│           ├── README.md
│           ├── company-profile.json
│           ├── public-research.md
│           ├── org-structure-image.png
│           ├── org-structure-parsed.json
│           ├── questionnaire-sample.csv
│           ├── questionnaire-field-map.json
│           ├── pre-interview-package.md
│           ├── interview-notes-management.md
│           ├── interview-notes-production.md
│           ├── interview-notes-finance.md
│           ├── interview-notes-quality.md
│           └── expected-internal-report.md
├── server/
│   ├── index.ts
│   ├── routes/
│   │   ├── openai.ts
│   │   ├── search.ts
│   │   ├── upload.ts
│   │   └── export.ts
│   ├── services/
│   │   ├── openaiService.ts
│   │   ├── searchService.ts
│   │   ├── visionService.ts
│   │   ├── csvService.ts
│   │   ├── excelService.ts
│   │   └── markdownExportService.ts
│   └── types/
│       └── server.ts
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── routes.tsx
│   │   └── layout/
│   │       ├── Sidebar.tsx
│   │       ├── Header.tsx
│   │       └── WorkspaceLayout.tsx
│   ├── workflows/
│   │   ├── preInterviewWorkflow.ts
│   │   └── postInterviewWorkflow.ts
│   ├── agents/
│   │   ├── orchestratorAgent.ts
│   │   ├── companyResearchAgent.ts
│   │   ├── orgStructureAgent.ts
│   │   ├── questionnaireAnalysisAgent.ts
│   │   ├── interviewGuideAgent.ts
│   │   ├── fieldworkPackageAgent.ts
│   │   ├── interviewMaterialStructuringAgent.ts
│   │   ├── coverageCheckAgent.ts
│   │   ├── painPointDiagnosisAgent.ts
│   │   ├── scenarioAgent.ts
│   │   ├── opportunityMapAgent.ts
│   │   └── reportDraftAgent.ts
│   ├── prompts/
│   │   ├── system/
│   │   │   ├── orchestrator.md
│   │   │   ├── company-research.md
│   │   │   ├── org-structure.md
│   │   │   ├── questionnaire-analysis.md
│   │   │   ├── interview-guide.md
│   │   │   ├── fieldwork-package.md
│   │   │   ├── interview-material-structuring.md
│   │   │   ├── coverage-check.md
│   │   │   ├── pain-point-diagnosis.md
│   │   │   ├── ai-scenario.md
│   │   │   ├── opportunity-map.md
│   │   │   └── report-draft.md
│   │   └── templates/
│   │       ├── department-interview-guide.md
│   │       ├── fieldwork-package.md
│   │       ├── structured-interview-notes.md
│   │       ├── coverage-check.md
│   │       ├── pain-point-card.md
│   │       ├── scenario-card.md
│   │       ├── opportunity-map.md
│   │       └── internal-diagnosis-report.md
│   ├── references/
│   │   ├── ai-lab-methodology.md
│   │   ├── department-question-bank.md
│   │   ├── department-diagnosis-framework.md
│   │   ├── ai-scenario-taxonomy.md
│   │   ├── scoring-rubric.md
│   │   ├── report-structure.md
│   │   └── writing-style-guide.md
│   ├── services/
│   │   ├── apiClient.ts
│   │   ├── storageService.ts
│   │   ├── csvParserService.ts
│   │   ├── excelParserService.ts
│   │   ├── exportMarkdownService.ts
│   │   └── validationService.ts
│   ├── pages/
│   │   ├── ProjectSetupPage.tsx
│   │   ├── CompanyResearchPage.tsx
│   │   ├── OrgStructurePage.tsx
│   │   ├── QuestionnaireImportPage.tsx
│   │   ├── InterviewGuidePage.tsx
│   │   ├── FieldworkPackagePage.tsx
│   │   ├── InterviewMaterialImportPage.tsx
│   │   ├── InterviewStructuringPage.tsx
│   │   ├── CoverageCheckPage.tsx
│   │   ├── PainPointDiagnosisPage.tsx
│   │   ├── ScenarioGenerationPage.tsx
│   │   ├── OpportunityMapPage.tsx
│   │   └── ReportDraftPage.tsx
│   ├── components/
│   │   ├── common/
│   │   ├── project/
│   │   ├── research/
│   │   ├── org/
│   │   ├── questionnaire/
│   │   ├── interview/
│   │   ├── diagnosis/
│   │   ├── scenario/
│   │   ├── opportunityMap/
│   │   └── report/
│   ├── types/
│   │   ├── project.ts
│   │   ├── company.ts
│   │   ├── department.ts
│   │   ├── questionnaire.ts
│   │   ├── interview.ts
│   │   ├── painPoint.ts
│   │   ├── scenario.ts
│   │   ├── opportunityMap.ts
│   │   └── report.ts
│   ├── utils/
│   │   ├── markdown.ts
│   │   ├── scoring.ts
│   │   ├── file.ts
│   │   └── validation.ts
│   └── styles/
│       └── globals.css
└── tests/
    ├── sample-inputs/
    └── expected-outputs/

⸻

六、必须预留给用户后续放入的文件

用户后续会把“诊断报告模板”和“线下问卷CSV”放入开发仓库。

请务必预留以下路径，并在 README 中说明：

1. 诊断报告模板

public/templates/report-template.md
src/references/report-structure.md
src/prompts/templates/internal-diagnosis-report.md

用途：

* public/templates/report-template.md：用户可直接替换的外部模板
* src/references/report-structure.md：报告章节结构与写作要求
* src/prompts/templates/internal-diagnosis-report.md：AI生成报告时使用的Markdown模板

⸻

2. 胜业电气线上问卷CSV

public/demo/shengye-electric/questionnaire-sample.csv
public/demo/shengye-electric/questionnaire-field-map.json

用途：

* questionnaire-sample.csv：胜业电气线上问卷结果
* questionnaire-field-map.json：字段映射配置

⸻

3. 胜业电气组织架构图

public/demo/shengye-electric/org-structure-image.png
public/demo/shengye-electric/org-structure-parsed.json

用途：

* org-structure-image.png：用户后续放入组织架构图片
* org-structure-parsed.json：系统识别后的结构化结果

⸻

4. 胜业电气访谈后材料

public/demo/shengye-electric/interview-notes-management.md
public/demo/shengye-electric/interview-notes-production.md
public/demo/shengye-electric/interview-notes-finance.md
public/demo/shengye-electric/interview-notes-quality.md

后续可继续增加：

interview-notes-sales.md
interview-notes-technology.md
interview-notes-supply-chain.md
interview-notes-hr-admin.md
interview-notes-it.md

⸻

七、页面设计要求

整体风格：

* 咨询公司工作台 + 科技感AI产品
* 左侧导航
* 顶部显示当前项目
* 主区域为当前任务
* 每个页面要有“输入区—AI分析区—人工审核区—导出区”
* 所有AI输出都必须可编辑
* 所有关键结论都必须可人工确认

左侧导航分为两组：

访谈前准备

1. 项目初始化
2. 企业信息收集
3. 组织架构解析
4. 问卷反馈导入
5. 访谈提纲生成
6. 现场资料包导出

访谈后诊断

7. 访谈材料导入
8. 访谈纪要结构化
9. 问题覆盖度检查
10. 痛点诊断
11. AI场景生成
12. 机会地图
13. 内部诊断报告

⸻

八、数据结构要求

Project

export interface Project {
  id: string;
  name: string;
  companyName: string;
  industry?: string;
  stage: 'pre_interview' | 'post_interview' | 'report_draft';
  researchDate?: string;
  background?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

Department

export interface Department {
  id: string;
  name: string;
  parentName?: string;
  type?: string;
  description?: string;
  interviewPriority?: 'high' | 'medium' | 'low';
  interviewFocus?: string[];
}

QuestionnaireRecord

export interface QuestionnaireRecord {
  id: string;
  department?: string;
  name?: string;
  role?: string;
  question: string;
  answer: string;
  submittedAt?: string;
  notes?: string;
}

InterviewGuide

export interface InterviewGuide {
  id: string;
  departmentId: string;
  departmentName: string;
  interviewGoal: string;
  commonQuestions: string[];
  departmentSpecificQuestions: string[];
  deepDiveQuestions: string[];
  dataToCollect: string[];
  assumptionsToVerify: string[];
  generatedAt: string;
}

InterviewMaterial

export interface InterviewMaterial {
  id: string;
  departmentId: string;
  departmentName: string;
  transcript?: string;
  meetingNotes?: string;
  projectOwnerUnderstanding?: string;
  attachments?: string[];
  createdAt: string;
}

PainPoint

export interface PainPoint {
  id: string;
  title: string;
  departmentIds: string[];
  description: string;
  currentApproach?: string;
  impact?: string;
  evidence: Evidence[];
  confidence: 'high' | 'medium' | 'low';
  problemType: 'ai_suitable' | 'process' | 'data_governance' | 'organization' | 'it_system' | 'unclear';
  status: 'pending' | 'accepted' | 'need_more_info' | 'deferred' | 'course_demo' | 'competition' | 'implementation';
}

Evidence

export interface Evidence {
  id: string;
  sourceType: 'public_info' | 'questionnaire' | 'transcript' | 'meeting_notes' | 'owner_understanding' | 'ai_inference';
  departmentName?: string;
  content: string;
  confidence: 'high' | 'medium' | 'low';
}

AIScenario

export interface AIScenario {
  id: string;
  name: string;
  departmentIds: string[];
  relatedPainPointIds: string[];
  currentProblem: string;
  aiSolution: string;
  technicalRoute: string[];
  requiredData: string[];
  requiredSystems?: string[];
  businessValue: string;
  implementationDifficulty: 'low' | 'medium' | 'high';
  risks: string[];
  prerequisites: string[];
  suitableForCourseDemo: boolean;
  suitableForCompetition: boolean;
  suitableForImplementation: boolean;
  score: ScenarioScore;
  priority: 'priority' | 'cultivate' | 'cautious' | 'deferred';
  status: 'pending' | 'accepted' | 'need_more_info' | 'deferred' | 'course_demo' | 'competition' | 'implementation';
}

ScenarioScore

export interface ScenarioScore {
  businessValue: number;
  painIntensity: number;
  technicalFeasibility: number;
  dataAvailability: number;
  processClarity: number;
  organizationSupport: number;
  oneMonthImpact: number;
  replicability: number;
  total: number;
}

⸻

九、Prompt和Reference要求

请在 src/references/ 中创建以下文件，并写入初始内容：

ai-lab-methodology.md

描述AI创新实验室方法论：

* 企业调研
* 线上问卷
* 线下访谈
* AI诊断报告
* 线下课程
* 场景赛马
* 陪跑落地
* AI场景转化逻辑

department-question-bank.md

制造业部门问题库，至少包括：

* 高层管理
* 销售/市场
* 财务
* 研发/技术
* 生产制造
* 品质管理
* 采购/供应链
* 仓储物流
* 设备安环
* IT/信息化
* 人资行政
* 董办/战略

department-diagnosis-framework.md

部门诊断通用框架：

* 业务流程
* 关键任务
* 高频重复工作
* 异常问题
* 数据来源
* 使用系统
* 协同部门
* 规则标准
* 管理指标
* AI机会

ai-scenario-taxonomy.md

AI场景分类：

* 知识库问答类
* 文档生成类
* 数据分析类
* 流程督办类
* 报表自动化类
* 智能报价类
* 质量分析类
* 设备运维类
* 供应商分析类
* 合同合规类
* 视觉检测类
* 研发辅助类
* RPA自动化类
* 决策推演类

scoring-rubric.md

写入8维度评分体系。

report-structure.md

预留报告结构。用户后续会替换或补充。

writing-style-guide.md

全局写作风格：

* 咨询顾问风格
* 制造业务实表达
* 不堆概念
* 不空泛拔高
* 先问题后方案
* 适合复制进Word
* 段落清晰
* 表格可读
* 不使用过多AI黑话
* 不把推测写成事实
* 不为了AI而AI

⸻

十、AGENTS.md要求

请在根目录创建 AGENTS.md，必须包含：

1. 项目目标
2. 多Agent协作总览
3. 各Agent职责
4. 各Agent输入输出格式
5. 两阶段工作流
6. 调用顺序
7. 失败处理
8. 人工审核节点
9. 输出结构化要求
10. 禁止事项

禁止事项包括：

1. 不允许把公网信息直接写成诊断结论。
2. 不允许把AI推测写成企业事实。
3. 不允许在材料不足时强行生成确定性结论。
4. 不允许看到问题就硬套AI场景。
5. 不允许忽略项目负责人个人理解。
6. 不允许生成无法追溯来源的关键痛点。
7. 不允许输出过度营销化、空泛化报告。

⸻

十一、后端API建议

企业信息收集

POST /api/research/company

输入：

{
  "companyName": "胜业电气股份有限公司",
  "industry": "电气设备制造"
}

输出：

{
  "publicResearch": "...",
  "sources": [],
  "assumptions": []
}

⸻

组织架构识别

POST /api/vision/org-structure

输入：

* image file

输出：

{
  "departments": [],
  "rawText": "",
  "confidence": "medium"
}

⸻

问卷解析

POST /api/questionnaire/parse

输入：

* csv/xlsx file
* field map

输出：

{
  "records": [],
  "departmentSummaries": [],
  "initialPainPoints": []
}

⸻

Agent调用

POST /api/agent/run

输入：

{
  "agentName": "interviewGuideAgent",
  "projectId": "xxx",
  "input": {}
}

输出：

{
  "result": {},
  "markdown": "",
  "warnings": []
}

⸻

Markdown导出

POST /api/export/markdown

⸻

十二、验收标准

V1完成后必须满足以下验收标准：

访谈前

* 可以创建项目
* 可以输入企业名称并自动联网收集公网信息
* 可以上传组织架构图片并识别部门
* 可以手动修正部门
* 可以上传CSV问卷
* 可以做字段映射
* 可以按部门分析问卷反馈
* 可以逐部门生成访谈提纲
* 可以导出现场调研资料包Markdown

访谈后

* 可以按部门导入录音转写、会议纪要、项目负责人理解
* 可以生成结构化访谈纪要
* 可以对照访谈前提纲做覆盖度检查
* 可以生成部门痛点和共性痛点
* 可以生成AI场景卡片
* 可以对AI场景评分
* 可以生成机会地图
* 可以生成内部诊断报告Markdown初稿

人工审核

* 痛点可编辑
* 痛点可修改状态
* AI场景可编辑
* AI场景可修改状态
* 报告内容可复制和导出
* 所有AI关键结论必须显示来源或可信度

Demo

* 项目中必须包含“加载胜业电气Demo数据”的入口
* Demo数据路径为：

public/demo/shengye-electric/

如果用户尚未放入真实CSV或模板，页面需要显示友好提示：

尚未检测到胜业电气问卷CSV，请将文件放入 public/demo/shengye-electric/questionnaire-sample.csv
尚未检测到诊断报告模板，请将模板放入 public/templates/report-template.md

⸻

十三、开发优先级

P0 必须完成

1. React + Node基础项目
2. 项目初始化
3. OpenAI API封装
4. 搜索服务封装
5. 组织架构图片识别
6. CSV问卷导入与字段映射
7. 逐部门访谈提纲生成
8. 现场调研资料包Markdown导出
9. 按部门访谈材料导入
10. 痛点诊断
11. AI场景生成
12. 内部诊断报告Markdown生成
13. 胜业电气Demo目录预留

P1 可增强

1. Excel解析
2. AI机会地图可视化
3. 本地IndexedDB持久化
4. 导入/导出项目JSON
5. 报告模板可替换
6. 场景评分可手动调整

暂不开发

1. 实时访谈助手
2. 实时录音转写
3. 多人协同
4. 企业端账号
5. 权限系统
6. 自动生成PPT
7. 自动生成Word
8. 飞书/钉钉集成

⸻

十四、最终要求

请优先保证业务流程准确、数据结构清晰、Agent职责边界清楚，不要为了炫技做复杂交互。

这个系统的核心价值是：

访谈前帮项目负责人问对问题；
访谈后帮项目负责人把材料转化成诊断结论和AI场景。

所有输出必须可编辑、可审核、可追溯、可导出。

你可以直接把这份发给Codex。等你把诊断报告模板和胜业电气问卷CSV放进仓库后，下一步让Codex优先实现 P0，尤其是目录结构、Demo数据加载、问卷字段映射和逐部门访谈提纲生成。