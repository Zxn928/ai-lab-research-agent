import { Wand2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../components/common/Button';
import { PageShell } from '../components/common/PageShell';
import { Panel } from '../components/common/Panel';
import { runAgent } from '../services/apiClient';
import type { CoverageItem } from '../types/interview';
import type { WorkspaceState } from '../types/workspace';

export function CoverageCheckPage({
  state,
  updateState
}: {
  state: WorkspaceState;
  updateState: (next: Partial<WorkspaceState>) => void;
}) {
  const [loadingId, setLoadingId] = useState<string>();

  const run = async (departmentId: string) => {
    setLoadingId(departmentId);
    try {
      const response = await runAgent<{ coverageItems: CoverageItem[] }>({
        agentName: 'coverageCheckAgent',
        input: {
          guide: state.interviewGuides.find((item) => item.departmentId === departmentId),
          notes: state.structuredNotes.find((item) => item.departmentId === departmentId),
          material: state.interviewMaterials.find((item) => item.departmentId === departmentId)
        }
      });
      updateState({
        coverageChecks: {
          ...state.coverageChecks,
          [departmentId]: response.result.coverageItems || []
        }
      });
    } finally {
      setLoadingId(undefined);
    }
  };

  return (
    <PageShell title="问题覆盖度检查" description="检查哪些访谈问题已覆盖、部分覆盖、未覆盖，并给出报告表达强度建议。">
      <div className="grid gap-4">
        {state.departments.map((department) => (
          <Panel
            key={department.id}
            title={department.name}
            footer={
              <Button onClick={() => run(department.id)} disabled={loadingId === department.id}>
                <Wand2 className="h-4 w-4" /> 检查覆盖度
              </Button>
            }
          >
            <div className="overflow-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-panel text-xs text-muted">
                  <tr>
                    <th className="px-3 py-2">原问题</th>
                    <th className="px-3 py-2">覆盖情况</th>
                    <th className="px-3 py-2">质量</th>
                    <th className="px-3 py-2">处理建议</th>
                  </tr>
                </thead>
                <tbody>
                  {(state.coverageChecks[department.id] || []).map((item, index) => (
                    <tr key={index} className="border-t border-line">
                      <td className="px-3 py-2">{item.originalQuestion}</td>
                      <td className="px-3 py-2">{item.coverage}</td>
                      <td className="px-3 py-2">{item.quality}</td>
                      <td className="px-3 py-2">{item.suggestion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        ))}
      </div>
    </PageShell>
  );
}
