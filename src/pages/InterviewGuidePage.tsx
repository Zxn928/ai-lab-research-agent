import { Wand2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { PageShell } from '../components/common/PageShell';
import { Panel } from '../components/common/Panel';
import { runAgent } from '../services/apiClient';
import type { InterviewGuide } from '../types/interview';
import type { WorkspaceState } from '../types/workspace';

export function InterviewGuidePage({
  state,
  updateState
}: {
  state: WorkspaceState;
  updateState: (next: Partial<WorkspaceState>) => void;
}) {
  const [loadingId, setLoadingId] = useState<string>();

  const generate = async (departmentId: string) => {
    const department = state.departments.find((item) => item.id === departmentId);
    if (!department) return;
    setLoadingId(departmentId);
    try {
      const response = await runAgent<InterviewGuide>({
        agentName: 'interviewGuideAgent',
        input: {
          department,
          companyResearch: state.companyResearch?.publicResearch,
          questionnaireRecords: state.questionnaireRecords.filter(
            (record) => record.department === department.name
          )
        }
      });
      const guide = response.result;
      updateState({
        interviewGuides: [
          ...state.interviewGuides.filter((item) => item.departmentId !== departmentId),
          guide
        ]
      });
    } finally {
      setLoadingId(undefined);
    }
  };

  return (
    <PageShell
      title="访谈提纲生成"
      description="按部门逐个生成，避免上下文过长。每个部门的问题会围绕流程、数据、系统、异常、协同、成本、质量和交付展开。"
      eyebrow="访谈前准备 / 05"
    >
      <div className="grid gap-4">
        {state.departments.map((department) => {
          const guide = state.interviewGuides.find((item) => item.departmentId === department.id);
          return (
            <Panel
              key={department.id}
              title={department.name || '未命名部门'}
              footer={
                <Button onClick={() => generate(department.id)} disabled={loadingId === department.id}>
                  <Wand2 className="h-4 w-4" />
                  {loadingId === department.id ? '生成中' : guide ? '重新生成' : '生成提纲'}
                </Button>
              }
            >
              {guide ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <GuideBlock title="访谈目标" items={[guide.interviewGoal]} />
                  <GuideBlock title="部门专属问题" items={guide.departmentSpecificQuestions} />
                  <GuideBlock title="深挖追问" items={guide.deepDiveQuestions} />
                  <GuideBlock title="现场资料清单" items={guide.dataToCollect} />
                </div>
              ) : (
                <EmptyState title="尚未生成提纲" description="点击下方按钮，为该部门生成访谈目标、专属问题和现场资料清单。" />
              )}
            </Panel>
          );
        })}
        {!state.departments.length && <EmptyState title="暂无可访谈部门" description="请先在组织架构解析页面上传架构图或手动维护部门清单。" />}
      </div>
    </PageShell>
  );
}

function GuideBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="mb-2 text-sm font-semibold text-ink">{title}</div>
      <ul className="space-y-2 text-sm leading-6 text-slate-700">
        {items.map((item, index) => (
          <li key={index}>- {item}</li>
        ))}
      </ul>
    </div>
  );
}
