import { Search } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../components/common/Button';
import { Textarea } from '../components/common/Field';
import { PageShell } from '../components/common/PageShell';
import { Panel } from '../components/common/Panel';
import { researchCompany } from '../services/apiClient';
import type { WorkspaceState } from '../types/workspace';

export function CompanyResearchPage({
  state,
  updateState
}: {
  state: WorkspaceState;
  updateState: (next: Partial<WorkspaceState>) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [manualText, setManualText] = useState(state.companyResearch?.publicResearch || '');

  const run = async () => {
    if (!state.project?.companyName) return;
    setLoading(true);
    try {
      const result = await researchCompany({
        companyName: state.project.companyName,
        industry: state.project.industry
      });
      setManualText(result.publicResearch);
      updateState({ companyResearch: result });
    } finally {
      setLoading(false);
    }
  };

  const saveManual = () => {
    updateState({
      companyResearch: {
        companyName: state.project?.companyName || '',
        publicResearch: manualText,
        sources: [],
        assumptions: [],
        generatedAt: new Date().toISOString()
      }
    });
  };

  return (
    <PageShell
      title="企业信息收集"
      description="公网信息只作为访谈前假设，后续报告不会把它直接写成诊断结论。未配置搜索服务时，可以直接粘贴真实公开资料。"
      actions={
        <Button onClick={run} disabled={loading || !state.project?.companyName}>
          <Search className="h-4 w-4" /> {loading ? '收集中' : '自动收集'}
        </Button>
      }
    >
      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <Panel title="输入区 / AI分析区">
          <Textarea value={manualText} onChange={(event) => setManualText(event.target.value)} />
          <div className="mt-4">
            <Button variant="secondary" onClick={saveManual}>
              保存公开资料
            </Button>
          </div>
        </Panel>
        <Panel title="人工审核区">
          <div className="space-y-3 text-sm leading-6 text-slate-700">
            <p>资料用途：访谈前假设、问题设计、资料清单。</p>
            <p>诊断结论必须以问卷、组织架构、访谈材料和人工审核为准。</p>
            <p>来源数量：{state.companyResearch?.sources.length || 0}</p>
          </div>
        </Panel>
      </div>
    </PageShell>
  );
}
