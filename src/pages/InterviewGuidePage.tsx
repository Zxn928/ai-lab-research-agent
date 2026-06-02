import { Loader2, Wand2 } from 'lucide-react';
import { useState } from 'react';
import { AgentProgress } from '../components/common/AgentProgress';
import { Button } from '../components/common/Button';
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
                  {loadingId === department.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="h-4 w-4" />
                  )}
                  {loadingId === department.id ? '生成中' : guide ? '重新生成' : '生成提纲'}
                </Button>
              }
            >
              <AgentProgress
                active={loadingId === department.id}
                title={`正在生成 ${department.name || '该部门'} 访谈提纲`}
                detail="Agent 正在结合企业画像、问卷反馈和部门重点生成问题清单。"
                steps={['整理部门上下文', '生成访谈目标', '设计专属问题', '补充深挖追问和资料清单']}
              />
              {guide ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <GuideBlock title="访谈目标" items={[guide.interviewGoal]} />
                  <GuideBlock title="部门专属问题" items={guide.departmentSpecificQuestions} />
                  <GuideBlock title="深挖追问" items={guide.deepDiveQuestions} />
                  <GuideBlock title="现场资料清单" items={guide.dataToCollect} />
                </div>
              ) : (
                <div className="text-sm text-muted">尚未生成该部门访谈提纲。</div>
              )}
            </Panel>
          );
        })}
        {!state.departments.length && <Panel title="提示">请先在组织架构页面维护部门清单。</Panel>}
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
