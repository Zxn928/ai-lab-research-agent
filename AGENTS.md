# AGENTS.md

## 项目目标

构建 AI创新实验室·线下调研诊断Agent工作台，帮助项目负责人在访谈前问对问题，在访谈后把真实材料转化为诊断结论和 AI 场景。

## 多Agent协作总览

Orchestrator Agent 根据项目阶段和资料完整度调度企业研究、组织架构识别、问卷分析、访谈提纲、现场资料包、访谈纪要结构化、覆盖度检查、痛点诊断、AI场景、机会地图和报告草稿 Agent。

## 各Agent职责

- Company Research Agent：整理企业公网画像，标注公开事实、来源和访谈前假设。
- Org Structure Agent：识别组织架构图并生成部门清单、层级、访谈重点和优先级。
- Questionnaire Analysis Agent：解析 Excel/CSV，按部门聚合反馈，提炼痛点假设和待核实问题。
- Interview Guide Agent：按部门逐个生成访谈提纲和深挖追问。
- Fieldwork Package Agent：汇总访谈前材料并生成现场资料包 Markdown。
- Interview Material Structuring Agent：区分企业明确反馈、会议纪要归纳、项目负责人判断、AI推测和待核实事项。
- Coverage Check Agent：对照访谈前提纲检查覆盖度，并给出报告表达强度建议。
- Pain Point Diagnosis Agent：提炼部门痛点和共性痛点，标注证据链、可信度和问题类型。
- AI Scenario Agent：将痛点转为 AI 场景卡片，生成技术路线、数据条件、评分和优先级。
- Opportunity Map Agent：生成业务价值 x 落地难度四象限。
- Report Draft Agent：生成内部诊断报告 Markdown 初稿，遵循事实、判断、建议。

## 输入输出格式

所有 Agent 内部输出优先使用结构化 JSON。展示和导出层再将 JSON 转为 Markdown。关键结论必须包含来源或可信度。

## 两阶段工作流

访谈前：项目初始化 -> 企业信息收集 -> 组织架构解析 -> 问卷反馈导入 -> 访谈提纲生成 -> 现场资料包导出。

访谈后：访谈材料导入 -> 访谈纪要结构化 -> 问题覆盖度检查 -> 痛点诊断 -> AI场景生成 -> 机会地图 -> 内部诊断报告。

## 调用顺序

后续 Agent 应优先引用前序 Agent 的结构化输出。访谈后诊断必须引用访谈材料、问卷反馈和人工输入，不能只依赖公网资料。

## 失败处理

当 OpenAI、搜索或视觉识别失败时，系统保留人工输入入口，并提示用户补充真实资料。不得编造 Demo 内容。

## 人工审核节点

部门、问卷字段映射、访谈提纲、痛点、AI场景、机会地图和报告均必须可人工审核。痛点与场景支持审核状态修改。

## 输出结构化要求

关键对象包括 Project、Department、QuestionnaireRecord、InterviewGuide、InterviewMaterial、PainPoint、Evidence、AIScenario、ScenarioScore、OpportunityMap 和 DiagnosisReport。

## 禁止事项

1. 不允许把公网信息直接写成诊断结论。
2. 不允许把AI推测写成企业事实。
3. 不允许在材料不足时强行生成确定性结论。
4. 不允许看到问题就硬套AI场景。
5. 不允许忽略项目负责人个人理解。
6. 不允许生成无法追溯来源的关键痛点。
7. 不允许输出过度营销化、空泛化报告。
