import type { WorkspaceState } from '../types/workspace';

export function buildLocalFieldworkPackage(state: WorkspaceState) {
  const project = state.project;
  const lines = [
    `# ${project?.name || '现场调研资料包'}`,
    '',
    '## 项目基本信息',
    `- 企业名称：${project?.companyName || ''}`,
    `- 行业：${project?.industry || ''}`,
    `- 调研时间：${project?.researchDate || ''}`,
    '',
    '## 企业公网画像',
    state.companyResearch?.publicResearch || '尚未生成企业公网画像。',
    '',
    '## 组织架构识别结果',
    ...state.departments.map((department) => `- ${department.name}：${department.interviewFocus?.join('；') || ''}`),
    '',
    '## 问卷反馈初步分析',
    ...state.questionnaireSummaries.map(
      (summary) => `### ${summary.departmentName}\n${summary.summary}\n\n待核实：${summary.questionsToVerify.join('；')}`
    ),
    '',
    '## 各部门访谈提纲',
    ...state.interviewGuides.map(guideToMarkdown),
    '',
    '## 访谈记录模板',
    '- 企业明确反馈：',
    '- 会议纪要归纳：',
    '- 项目负责人判断：',
    '- AI推测：',
    '- 待核实事项：'
  ];
  return lines.join('\n');
}

function guideToMarkdown(guide: WorkspaceState['interviewGuides'][number]) {
  const list = (items: string[]) => items.map((item) => `- ${item}`).join('\n');
  return [
    `### ${guide.departmentName}`,
    `访谈目标：${guide.interviewGoal}`,
    '',
    '通用问题：',
    list(guide.commonQuestions),
    '',
    '部门专属问题：',
    list(guide.departmentSpecificQuestions),
    '',
    '深挖追问：',
    list(guide.deepDiveQuestions),
    ''
  ].join('\n');
}
