import { Wand2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { PageShell } from '../components/common/PageShell';
import { Panel } from '../components/common/Panel';
import { runAgent } from '../services/apiClient';
import type { PainPoint } from '../types/painPoint';
import type { WorkspaceState } from '../types/workspace';

export function PainPointDiagnosisPage({
  state,
  updateState
}: {
  state: WorkspaceState;
  updateState: (next: Partial<WorkspaceState>) => void;
}) {
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    try {
      const response = await runAgent<{ painPoints: PainPoint[] }>({
        agentName: 'painPointDiagnosisAgent',
        input: {
          project: state.project,
          questionnaireSummaries: state.questionnaireSummaries,
          structuredNotes: state.structuredNotes,
          coverageChecks: state.coverageChecks
        }
      });
      updateState({ painPoints: response.result.painPoints || [] });
    } finally {
      setLoading(false);
    }
  };

  const updatePainPoint = (id: string, patch: Partial<PainPoint>) => {
    updateState({
      painPoints: state.painPoints.map((painPoint) =>
        painPoint.id === id ? { ...painPoint, ...patch } : painPoint
      )
    });
  };

  return (
    <PageShell
      title="痛点诊断"
      description="从所有材料中提炼部门痛点和跨部门共性问题，所有关键痛点必须带证据链和可信度。"
      eyebrow="访谈后诊断 / 10"
      actions={
        <Button onClick={run} disabled={loading}>
          <Wand2 className="h-4 w-4" /> {loading ? '诊断中' : '生成痛点'}
        </Button>
      }
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {state.painPoints.map((painPoint) => (
          <Panel key={painPoint.id} title={painPoint.title}>
            <div className="space-y-3 text-sm leading-6 text-slate-700">
              <p>{painPoint.description}</p>
              <p>影响范围：{painPoint.impact || '待补充'}</p>
              <p>可信度：{painPoint.confidence}</p>
              <label className="block">
                <span className="mb-1 block font-semibold text-ink">审核状态</span>
                <select
                  className="min-h-11 w-full rounded-md border border-line px-3"
                  value={painPoint.status}
                  onChange={(event) => updatePainPoint(painPoint.id, { status: event.target.value as PainPoint['status'] })}
                >
                  {['pending', 'accepted', 'need_more_info', 'deferred', 'course_demo', 'competition', 'implementation'].map(
                    (status) => (
                      <option key={status}>{status}</option>
                    )
                  )}
                </select>
              </label>
              <div>
                <div className="font-semibold text-ink">证据链</div>
                <ul>
                  {painPoint.evidence?.map((evidence) => (
                    <li key={evidence.id}>- [{evidence.sourceType}] {evidence.content}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Panel>
        ))}
        {!state.painPoints.length && <EmptyState title="尚未生成痛点" description="完成访谈纪要结构化和覆盖度检查后，点击右上角按钮生成痛点清单。" />}
      </div>
    </PageShell>
  );
}
