import { Wand2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../components/common/Button';
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
      actions={
        <Button onClick={run} disabled={loading}>
          <Wand2 className="h-4 w-4" /> {loading ? '生成中' : '生成机会地图'}
        </Button>
      }
    >
      <Panel title="可视化数据 / Markdown">
        <div className="grid gap-4 md:grid-cols-2">
          {['quick_win', 'strategic', 'practice', 'defer'].map((quadrant) => (
            <div key={quadrant} className="min-h-40 rounded-lg border border-line bg-panel p-4">
              <div className="mb-3 text-sm font-semibold text-ink">{quadrantLabels[quadrant]}</div>
              <ul className="space-y-2 text-sm text-slate-700">
                {state.opportunityMap?.items
                  .filter((item) => item.quadrant === quadrant)
                  .map((item) => <li key={item.scenarioId}>- {item.scenarioName}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </Panel>
    </PageShell>
  );
}

const quadrantLabels: Record<string, string> = {
  quick_win: '高价值低难度：优先落地',
  strategic: '高价值高难度：战略攻坚',
  practice: '低价值低难度：快速改善/课程练习',
  defer: '低价值高难度：暂缓推进'
};
