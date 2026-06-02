import {
  BarChart3,
  Binary,
  Boxes,
  Building2,
  ClipboardCheck,
  FileDown,
  FileSpreadsheet,
  FileText,
  FolderPlus,
  GitBranch,
  Map,
  MessageSquareText,
  Search
} from 'lucide-react';

export const navGroups = [
  {
    title: '访谈前准备',
    items: [
      { path: '/', label: '项目初始化', icon: FolderPlus },
      { path: '/company-research', label: '企业信息收集', icon: Search },
      { path: '/org-structure', label: '组织架构解析', icon: GitBranch },
      { path: '/questionnaire', label: '问卷反馈导入', icon: FileSpreadsheet },
      { path: '/interview-guide', label: '访谈提纲生成', icon: MessageSquareText },
      { path: '/fieldwork-package', label: '现场资料包导出', icon: FileDown }
    ]
  },
  {
    title: '访谈后诊断',
    items: [
      { path: '/materials', label: '访谈材料导入', icon: FileText },
      { path: '/structuring', label: '访谈纪要结构化', icon: Boxes },
      { path: '/coverage', label: '问题覆盖度检查', icon: ClipboardCheck },
      { path: '/pain-points', label: '痛点诊断', icon: Binary },
      { path: '/scenarios', label: 'AI场景生成', icon: BarChart3 },
      { path: '/opportunity-map', label: '机会地图', icon: Map },
      { path: '/report', label: '内部诊断报告', icon: Building2 }
    ]
  }
];
