import { Download, FileCheck2, RotateCcw, Save, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../components/common/Badge';
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
      eyebrow="访谈前准备 / 01"
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
      <div className="grid gap-5 xl:grid-cols-[1fr_300px]">
        <Panel
          title="项目基本信息"
          description="这些信息将作为所有 Agent 的基础上下文。"
          badge={<Badge tone="info">自动保存</Badge>}
          footer={
            <Button onClick={save}>
              <Save className="h-4 w-4" /> 保存项目
            </Button>
          }
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="项目名称" hint="建议包含企业简称和本次调研阶段。">
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
              <Field label="项目背景" hint="写清本次调研的业务目标、范围和已知约束。">
                <Textarea
                  placeholder="例如：围绕生产、品质、供应链等核心部门识别可落地的 AI 场景。"
                  value={form.background || ''}
                  onChange={(event) => setForm({ ...form, background: event.target.value })}
                />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="项目备注">
                <Textarea
                  placeholder="补充项目负责人需要保留的内部信息。"
                  value={form.notes || ''}
                  onChange={(event) => setForm({ ...form, notes: event.target.value })}
                />
              </Field>
            </div>
          </div>
        </Panel>
        <aside className="space-y-4">
          <div className="rounded-lg border border-line bg-white p-5 shadow-panel">
            <div className="flex items-center gap-2 text-sm font-bold text-ink">
              <FileCheck2 className="h-4 w-4 text-brand" aria-hidden />
              项目数据口径
            </div>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <li>企业公网资料仅作为访谈前假设。</li>
              <li>问卷、访谈材料和人工判断分开记录。</li>
              <li>关键结论需经过人工审核后进入报告。</li>
            </ul>
          </div>
          <div className="rounded-lg border border-teal-200 bg-teal-50 p-5">
            <div className="flex items-center gap-2 text-sm font-bold text-teal-900">
              <ShieldCheck className="h-4 w-4" aria-hidden />
              本地数据
            </div>
            <p className="mt-2 text-sm leading-6 text-teal-800">项目内容保存在当前浏览器 IndexedDB，可通过 JSON 导出备份。</p>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
