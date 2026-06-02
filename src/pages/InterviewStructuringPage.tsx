import { Wand2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../components/common/Button';
import { PageShell } from '../components/common/PageShell';
import { Panel } from '../components/common/Panel';
import { runAgent } from '../services/apiClient';
import type { StructuredInterviewNotes } from '../types/interview';
import type { WorkspaceState } from '../types/workspace';

export function InterviewStructuringPage({
  state,
  updateState
}: {
  state: WorkspaceState;
  updateState: (next: Partial<WorkspaceState>) => void;
}) {
  const [loadingId, setLoadingId] = useState<string>();

  const run = async (materialId: string) => {
    const material = state.interviewMaterials.find((item) => item.id === materialId);
    if (!material) return;
    setLoadingId(materialId);
    try {
      const response = await runAgent<StructuredInterviewNotes>({
        agentName: 'interviewMaterialStructuringAgent',
        input: { material }
      });
      updateState({
        structuredNotes: [
          ...state.structuredNotes.filter((item) => item.departmentId !== material.departmentId),
          response.result
        ]
      });
    } finally {
      setLoadingId(undefined);
    }
  };

  return (
    <PageShell title="访谈纪要结构化" description="把部门材料整理为事实、判断、推测和待核实事项可区分的结构化纪要。" eyebrow="访谈后诊断 / 08">
      <div className="grid gap-4">
        {state.interviewMaterials.map((material) => {
          const notes = state.structuredNotes.find((item) => item.departmentId === material.departmentId);
          return (
            <Panel
              key={material.id}
              title={material.departmentName}
              footer={
                <Button onClick={() => run(material.id)} disabled={loadingId === material.id}>
                  <Wand2 className="h-4 w-4" /> {loadingId === material.id ? '结构化中' : '生成结构化纪要'}
                </Button>
              }
            >
              {notes ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <Block title="核心流程" items={notes.coreProcesses} />
                  <Block title="关键痛点" items={notes.painPoints} />
                  <Block title="涉及系统" items={notes.systems} />
                  <Block title="潜在AI机会" items={notes.aiOpportunities} />
                </div>
              ) : (
                <div className="text-sm text-muted">尚未生成结构化纪要。</div>
              )}
            </Panel>
          );
        })}
      </div>
    </PageShell>
  );
}

function Block({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="mb-2 text-sm font-semibold text-ink">{title}</div>
      <ul className="space-y-2 text-sm leading-6 text-slate-700">
        {items?.map((item, index) => <li key={index}>- {item}</li>)}
      </ul>
    </div>
  );
}
