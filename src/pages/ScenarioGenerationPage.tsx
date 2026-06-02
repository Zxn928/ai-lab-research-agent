import { Wand2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { PageShell } from '../components/common/PageShell';
import { Panel } from '../components/common/Panel';
import { runAgent } from '../services/apiClient';
import type { AIScenario } from '../types/scenario';
import type { WorkspaceState } from '../types/workspace';

export function ScenarioGenerationPage({
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
      const response = await runAgent<{ scenarios: AIScenario[] }>({
        agentName: 'scenarioAgent',
        input: {
          painPoints: state.painPoints.filter((item) => ['accepted', 'pending'].includes(item.status)),
          departments: state.departments
        }
      });
      updateState({ scenarios: response.result.scenarios || [] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      title="AI场景生成"
      description="把已采纳或待确认的痛点转成 AI 场景卡片，并按 8 个维度评分。"
      eyebrow="访谈后诊断 / 11"
      actions={
        <Button onClick={run} disabled={loading}>
          <Wand2 className="h-4 w-4" /> {loading ? '生成中' : '生成场景'}
        </Button>
      }
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {state.scenarios.map((scenario) => (
          <Panel key={scenario.id} title={scenario.name}>
            <div className="space-y-3 text-sm leading-6 text-slate-700">
              <p>{scenario.currentProblem}</p>
              <p>AI解决思路：{scenario.aiSolution}</p>
              <p>业务价值：{scenario.businessValue}</p>
              <p>落地难度：{scenario.implementationDifficulty}</p>
              <p>评分：{scenario.score?.total} / 优先级：{scenario.priority}</p>
              <p>
                适配方向：
                {scenario.suitableForCourseDemo ? ' 课程Demo' : ''}
                {scenario.suitableForCompetition ? ' 赛马项目' : ''}
                {scenario.suitableForImplementation ? ' 陪跑落地' : ''}
              </p>
            </div>
          </Panel>
        ))}
        {!state.scenarios.length && <EmptyState title="尚未生成 AI 场景" description="审核痛点清单后，点击右上角按钮生成可评分的 AI 场景卡片。" />}
      </div>
    </PageShell>
  );
}
