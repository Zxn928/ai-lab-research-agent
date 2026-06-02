import { ArrowRight, MoveUpRight, Wand2 } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { PageShell } from '../components/common/PageShell';
import { Panel } from '../components/common/Panel';
import { runAgent } from '../services/apiClient';
import type { OpportunityMap } from '../types/opportunityMap';
import type { WorkspaceState } from '../types/workspace';

export function OpportunityMapPage({
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
      const response = await runAgent<OpportunityMap>({
        agentName: 'opportunityMapAgent',
        input: { scenarios: state.scenarios }
      });
      updateState({ opportunityMap: response.result });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      title="机会地图"
      description="生成业务价值 x 落地难度四象限，辅助判断优先落地、战略攻坚、课程练习和暂缓推进。"
      eyebrow="访谈后诊断 / 12"
      actions={
        <Button onClick={run} disabled={loading}>
          <Wand2 className="h-4 w-4" /> {loading ? '生成中' : '生成机会地图'}
        </Button>
      }
    >
      <Panel title="AI机会四象限" description="横轴为业务价值，纵轴为落地难度。每个场景由前序诊断结果自动归位。" badge={<Badge tone="info">{state.opportunityMap?.items.length || 0} 个场景</Badge>}>
        <div className="mb-3 flex items-center justify-between text-xs font-semibold text-muted">
          <span>落地难度</span>
          <span className="flex items-center gap-1">业务价值 <ArrowRight className="h-3.5 w-3.5" aria-hidden /></span>
        </div>
        <div className="relative grid gap-3 md:grid-cols-2">
          {['quick_win', 'strategic', 'practice', 'defer'].map((quadrant) => (
            <div key={quadrant} className={`min-h-52 rounded-lg border p-4 ${quadrantStyles[quadrant]}`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-bold text-ink">{quadrantLabels[quadrant].title}</div>
                  <div className="mt-1 text-xs text-muted">{quadrantLabels[quadrant].description}</div>
                </div>
                <MoveUpRight className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
              </div>
              <div className="mt-4 space-y-2">
                {state.opportunityMap?.items
                  .filter((item) => item.quadrant === quadrant)
                  .map((item) => (
                    <div key={item.scenarioId} className="rounded-md border border-white/80 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                      {item.scenarioName}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
        {!state.opportunityMap?.items.length && (
          <div className="mt-4">
            <EmptyState title="尚未生成机会地图" description="完成痛点诊断和 AI 场景生成后，点击右上角按钮生成四象限。" />
          </div>
        )}
      </Panel>
    </PageShell>
  );
}

const quadrantLabels: Record<string, { title: string; description: string }> = {
  quick_win: { title: '优先落地', description: '高价值 · 低难度' },
  strategic: { title: '战略攻坚', description: '高价值 · 高难度' },
  practice: { title: '快速改善 / 课程练习', description: '低价值 · 低难度' },
  defer: { title: '暂缓推进', description: '低价值 · 高难度' }
};

const quadrantStyles: Record<string, string> = {
  quick_win: 'border-emerald-200 bg-emerald-50/70',
  strategic: 'border-amber-200 bg-amber-50/70',
  practice: 'border-sky-200 bg-sky-50/70',
  defer: 'border-slate-200 bg-slate-50'
};
