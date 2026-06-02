import { Download, Wand2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../components/common/Button';
import { Textarea } from '../components/common/Field';
import { PageShell } from '../components/common/PageShell';
import { Panel } from '../components/common/Panel';
import { exportMarkdown, runAgent } from '../services/apiClient';
import type { DiagnosisReport } from '../types/report';
import type { WorkspaceState } from '../types/workspace';

export function ReportDraftPage({
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
      const response = await runAgent<DiagnosisReport>({
        agentName: 'reportDraftAgent',
        input: state
      });
      updateState({
        report: {
          id: crypto.randomUUID(),
          projectId: state.project?.id || '',
          title: response.result.title || '内部诊断报告初稿',
          markdown: response.markdown || response.result.markdown,
          generatedAt: new Date().toISOString()
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      title="内部诊断报告"
      description="生成项目团队内部诊断报告 Markdown 初稿。报告遵循事实、判断、建议，不把推测写成事实。"
      actions={
        <>
          <Button variant="secondary" onClick={run} disabled={loading}>
            <Wand2 className="h-4 w-4" /> {loading ? '生成中' : '生成报告'}
          </Button>
          <Button
            onClick={() => exportMarkdown(state.report?.title || '内部诊断报告初稿', state.report?.markdown || '')}
            disabled={!state.report?.markdown}
          >
            <Download className="h-4 w-4" /> 导出Markdown
          </Button>
        </>
      }
    >
      <Panel title="报告编辑区 / 导出区">
        <Textarea
          value={state.report?.markdown || ''}
          onChange={(event) =>
            updateState({
              report: {
                id: state.report?.id || crypto.randomUUID(),
                projectId: state.project?.id || '',
                title: state.report?.title || '内部诊断报告初稿',
                markdown: event.target.value,
                generatedAt: state.report?.generatedAt || new Date().toISOString()
              }
            })
          }
        />
      </Panel>
    </PageShell>
  );
}
