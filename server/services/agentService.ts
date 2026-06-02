import type { AgentRunResponse } from '../../src/types/api';
import type { Department } from '../../src/types/department';
import type { InterviewGuide, InterviewMaterial } from '../../src/types/interview';
import type { PainPoint } from '../../src/types/painPoint';
import type { QuestionnaireRecord } from '../../src/types/questionnaire';
import type { AIScenario } from '../../src/types/scenario';
import { generateJson, generateText, isOpenAIConfigured } from './openaiService';

const jsonSystem = [
  '你是AI创新实验室线下调研诊断Agent工作台中的专业咨询Agent。',
  '所有关键结论必须区分事实、判断、AI推测和待核实事项。',
  '不要把公网信息直接写成诊断结论，不要为了AI而AI。',
  '输出必须可编辑、可审核、可追溯。'
].join('\n');

export async function runAgent(agentName: string, input: unknown): Promise<AgentRunResponse> {
  if (!isOpenAIConfigured()) {
    return {
      result: {},
      markdown: '',
      warnings: ['OPENAI_API_KEY 未配置。请配置后运行真实 Agent。']
    };
  }

  switch (agentName) {
    case 'questionnaireAnalysisAgent':
      return runQuestionnaireAnalysis(input as { records: QuestionnaireRecord[] });
    case 'interviewGuideAgent':
      return runInterviewGuide(
        input as {
          department: Department;
          companyResearch?: string;
          questionnaireRecords?: QuestionnaireRecord[];
        }
      );
    case 'fieldworkPackageAgent':
      return runFieldworkPackage(input);
    case 'interviewMaterialStructuringAgent':
      return runInterviewMaterialStructuring(input as { material: InterviewMaterial });
    case 'coverageCheckAgent':
      return runCoverageCheck(input);
    case 'painPointDiagnosisAgent':
      return runPainPointDiagnosis(input);
    case 'scenarioAgent':
      return runScenarioGeneration(input as { painPoints: PainPoint[]; departments: Department[] });
    case 'opportunityMapAgent':
      return runOpportunityMap(input as { scenarios: AIScenario[] });
    case 'reportDraftAgent':
      return runReportDraft(input);
    default:
      throw new Error(`Unknown agent: ${agentName}`);
  }
}

async function runQuestionnaireAnalysis(input: { records: QuestionnaireRecord[] }) {
  const result = await generateJson({
    system: `${jsonSystem}\n你负责按部门分析线上问卷反馈。`,
    user: JSON.stringify({
      task:
        '请按部门聚合问卷反馈，输出 departmentSummaries 数组，每项包含 departmentName, recordCount, summary, keywords, initialPainPoints, aiScenarioClues, questionsToVerify。',
      records: input.records
    })
  });
  return { result, warnings: [] };
}

async function runInterviewGuide(input: {
  department: Department;
  companyResearch?: string;
  questionnaireRecords?: QuestionnaireRecord[];
}) {
  const result = await generateJson<InterviewGuide>({
    system: `${jsonSystem}\n你负责为单个部门生成咨询顾问型访谈提纲。`,
    user: JSON.stringify({
      task:
        '请为该部门生成访谈提纲 JSON，字段必须包含 id, departmentId, departmentName, interviewGoal, commonQuestions, departmentSpecificQuestions, deepDiveQuestions, dataToCollect, assumptionsToVerify, generatedAt。',
      department: input.department,
      companyResearch: input.companyResearch,
      questionnaireRecords: input.questionnaireRecords
    })
  });
  const markdown = interviewGuideToMarkdown(result);
  return { result, markdown, warnings: [] };
}

async function runFieldworkPackage(input: unknown) {
  const markdown = await generateText({
    system: `${jsonSystem}\n你负责生成线下调研现场资料包 Markdown。`,
    user: JSON.stringify({
      task:
        '请生成现场调研资料包 Markdown，包含项目基本信息、企业公网画像、组织架构、问卷初步分析、高层访谈提纲、各部门访谈提纲、待核实问题、资料清单和访谈记录模板。',
      input
    })
  });
  return { result: { markdown }, markdown, warnings: [] };
}

async function runInterviewMaterialStructuring(input: { material: InterviewMaterial }) {
  const result = await generateJson({
    system: `${jsonSystem}\n你负责将单部门访谈材料结构化，必须区分企业明确反馈、会议纪要归纳、项目负责人判断、AI推测、待核实事项。`,
    user: JSON.stringify({
      task:
        '请输出结构化部门纪要 JSON：id, departmentId, departmentName, basicSituation, coreProcesses, mainWork, repetitiveWork, painPoints, currentApproach, systems, data, collaborationIssues, aiOpportunities, evidenceSources。',
      material: input.material
    })
  });
  return { result, warnings: [] };
}

async function runCoverageCheck(input: unknown) {
  const result = await generateJson({
    system: `${jsonSystem}\n你负责对照访谈前提纲做覆盖度检查。不要提示下一轮访谈，要提示报告表达强度。`,
    user: JSON.stringify({
      task:
        '请输出 coverageItems 数组：originalQuestion, coverage(covered|partially_covered|not_covered), quality(high|medium|low), suggestion。',
      input
    })
  });
  return { result, warnings: [] };
}

async function runPainPointDiagnosis(input: unknown) {
  const result = await generateJson({
    system: `${jsonSystem}\n你负责痛点诊断，必须提供证据链和可信度，区分AI适合问题、流程、数据治理、组织机制、信息化问题。`,
    user: JSON.stringify({
      task: '请输出 painPoints 数组，字段符合 PainPoint 类型。',
      input
    })
  });
  return { result, warnings: [] };
}

async function runScenarioGeneration(input: { painPoints: PainPoint[]; departments: Department[] }) {
  const result = await generateJson({
    system: `${jsonSystem}\n你负责把已采纳或待确认痛点转成AI场景卡片，并按8维度100分制评分。`,
    user: JSON.stringify({
      task: '请输出 scenarios 数组，字段符合 AIScenario 类型。',
      input
    })
  });
  return { result, warnings: [] };
}

async function runOpportunityMap(input: { scenarios: AIScenario[] }) {
  const result = await generateJson({
    system: `${jsonSystem}\n你负责生成业务价值 x 落地难度四象限机会地图。`,
    user: JSON.stringify({
      task:
        '请输出 items 数组和 markdown。quadrant 使用 quick_win, strategic, practice, defer。',
      input
    })
  });
  return { result, markdown: (result as { markdown?: string }).markdown, warnings: [] };
}

async function runReportDraft(input: unknown) {
  const markdown = await generateText({
    system: `${jsonSystem}\n你负责生成内部诊断报告 Markdown 初稿，必须遵循事实-判断-建议，不夸大，不硬套AI。`,
    user: JSON.stringify({
      task:
        '请生成内部诊断报告 Markdown 初稿，面向项目团队内部使用，可复制进Word继续润色。',
      input
    })
  });
  return {
    result: { title: '内部诊断报告初稿', markdown, generatedAt: new Date().toISOString() },
    markdown,
    warnings: []
  };
}

function interviewGuideToMarkdown(guide: InterviewGuide) {
  const list = (items: string[]) => items.map((item) => `- ${item}`).join('\n');
  return [
    `# ${guide.departmentName}访谈提纲`,
    '',
    `## 访谈目标`,
    guide.interviewGoal,
    '',
    '## 通用问题',
    list(guide.commonQuestions),
    '',
    '## 部门专属问题',
    list(guide.departmentSpecificQuestions),
    '',
    '## 深挖追问',
    list(guide.deepDiveQuestions),
    '',
    '## 现场需补充资料',
    list(guide.dataToCollect),
    '',
    '## 需核实假设',
    list(guide.assumptionsToVerify)
  ].join('\n');
}
