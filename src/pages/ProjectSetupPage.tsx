import { Download, RotateCcw, Save } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../components/common/Button';
import { Field, Input, Textarea } from '../components/common/Field';
import { PageShell } from '../components/common/PageShell';
import { Panel } from '../components/common/Panel';
import type { Project } from '../types/project';
import type { WorkspaceState } from '../types/workspace';
import { downloadJson } from '../utils/file';

export function ProjectSetupPage({
  state,
  updateState,
  resetState
}: {
  state: WorkspaceState;
  updateState: (next: Partial<WorkspaceState>) => void;
  resetState: () => void;
}) {
  const [form, setForm] = useState<Project>(
    state.project || {
      id: crypto.randomUUID(),
      name: '胜业电气AI创新实验室线下调研',
      companyName: '胜业电气股份有限公司',
      industry: '电气设备制造',
      stage: 'pre_interview',
      researchDate: '',
      background: '',
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  );

  const save = () => {
    updateState({
      project: {
        ...form,
        updatedAt: new Date().toISOString()
      }
    });
  };

  return (
    <PageShell
      title="项目初始化"
      description="建立项目基本信息，后续企业研究、问卷分析、访谈提纲和诊断报告都会引用这里的项目上下文。"
      actions={
        <>
          <Button variant="secondary" onClick={() => downloadJson('ai-lab-workspace.json', state)}>
            <Download className="h-4 w-4" /> 导出项目JSON
          </Button>
          <Button variant="ghost" onClick={resetState}>
            <RotateCcw className="h-4 w-4" /> 清空本地项目
          </Button>
        </>
      }
    >
      <Panel
        title="输入区"
        footer={
          <Button onClick={save}>
            <Save className="h-4 w-4" /> 保存项目
          </Button>
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="项目名称">
            <Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          </Field>
          <Field label="企业名称">
            <Input
              value={form.companyName}
              onChange={(event) => setForm({ ...form, companyName: event.target.value })}
            />
          </Field>
          <Field label="行业">
            <Input
              value={form.industry || ''}
              onChange={(event) => setForm({ ...form, industry: event.target.value })}
            />
          </Field>
          <Field label="调研时间">
            <Input
              type="date"
              value={form.researchDate || ''}
              onChange={(event) => setForm({ ...form, researchDate: event.target.value })}
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="项目背景">
              <Textarea
                value={form.background || ''}
                onChange={(event) => setForm({ ...form, background: event.target.value })}
              />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field label="项目备注">
              <Textarea
                value={form.notes || ''}
                onChange={(event) => setForm({ ...form, notes: event.target.value })}
              />
            </Field>
          </div>
        </div>
      </Panel>
    </PageShell>
  );
}
