import { Download, Wand2 } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Textarea } from '../components/common/Field';
import { PageShell } from '../components/common/PageShell';
import { Panel } from '../components/common/Panel';
import { exportMarkdown, runAgent } from '../services/apiClient';
import type { WorkspaceState } from '../types/workspace';
import { buildLocalFieldworkPackage } from '../utils/markdown';

export function FieldworkPackagePage({
  state,
  updateState
}: {
  state: WorkspaceState;
  updateState: (next: Partial<WorkspaceState>) => void;
}) {
  const generate = async () => {
    const response = await runAgent({
      agentName: 'fieldworkPackageAgent',
      input: state
    });
    updateState({
      fieldworkPackageMarkdown: response.markdown || buildLocalFieldworkPackage(state)
    });
  };

  const markdown = state.fieldworkPackageMarkdown || buildLocalFieldworkPackage(state);

  return (
    <PageShell
      title="现场资料包导出"
      description="汇总访谈前材料，支持总 Markdown 导出。AI 未配置时也会用当前 JSON 数据生成基础资料包。"
      actions={
        <>
          <Button variant="secondary" onClick={generate}>
            <Wand2 className="h-4 w-4" /> 生成资料包
          </Button>
          <Button onClick={() => exportMarkdown('现场调研资料包', markdown)}>
            <Download className="h-4 w-4" /> 导出Markdown
          </Button>
        </>
      }
    >
      <Panel title="导出区">
        <Textarea value={markdown} onChange={(event) => updateState({ fieldworkPackageMarkdown: event.target.value })} />
      </Panel>
    </PageShell>
  );
}
