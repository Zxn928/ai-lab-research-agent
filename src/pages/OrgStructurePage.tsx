import { ImageUp, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { Field, Input, Textarea } from '../components/common/Field';
import { PageShell } from '../components/common/PageShell';
import { Panel } from '../components/common/Panel';
import { parseOrgStructure } from '../services/apiClient';
import type { Department } from '../types/department';
import type { WorkspaceState } from '../types/workspace';

export function OrgStructurePage({
  state,
  updateState
}: {
  state: WorkspaceState;
  updateState: (next: Partial<WorkspaceState>) => void;
}) {
  const [loading, setLoading] = useState(false);
  const departments = state.departments;

  const upload = async (file?: File) => {
    if (!file) return;
    setLoading(true);
    try {
      const result = await parseOrgStructure(file);
      updateState({ departments: result.departments || [] });
    } finally {
      setLoading(false);
    }
  };

  const updateDepartment = (id: string, patch: Partial<Department>) => {
    updateState({
      departments: departments.map((department) =>
        department.id === id ? { ...department, ...patch } : department
      )
    });
  };

  const addDepartment = () => {
    updateState({
      departments: [
        ...departments,
        {
          id: crypto.randomUUID(),
          name: '',
          interviewPriority: 'medium',
          interviewFocus: []
        }
      ]
    });
  };

  return (
    <PageShell
      title="组织架构解析"
      description="可上传真实组织架构图做视觉识别；识别失败或资料缺失时，也可以直接手动维护部门清单。"
      eyebrow="访谈前准备 / 03"
      actions={
        <Button variant="secondary" onClick={addDepartment}>
          <Plus className="h-4 w-4" /> 新增部门
        </Button>
      }
    >
      <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
        <Panel title="组织架构图" description="支持 PNG、JPG 等常见图片格式。">
          <label className="flex min-h-44 flex-col items-center justify-center rounded-lg border border-dashed border-teal-200 bg-teal-50/50 px-4 text-center text-sm font-semibold text-brand transition hover:border-brand hover:bg-teal-50">
            <ImageUp className="mb-3 h-8 w-8" />
            {loading ? '正在识别组织架构' : '上传组织架构图'}
            <span className="mt-1 text-xs font-normal text-muted">点击选择图片文件</span>
            <input
              className="sr-only"
              type="file"
              accept="image/*"
              onChange={(event) => upload(event.target.files?.[0])}
            />
          </label>
          <p className="mt-3 text-sm leading-6 text-muted">
            尚未检测到真实组织架构图时，请将文件放入 public/demo/shengye-electric/org-structure-image.png 或直接在右侧录入。
          </p>
        </Panel>
        <Panel title="部门清单" description="识别后请人工核对部门名称、层级和访谈重点。" badge={<Badge tone="info">{departments.length} 个部门</Badge>}>
          <div className="space-y-4">
            {departments.map((department) => (
              <div key={department.id} className="rounded-lg border border-line bg-panel p-4">
                <div className="grid gap-3 md:grid-cols-3">
                  <Field label="部门名称">
                    <Input
                      value={department.name}
                      onChange={(event) => updateDepartment(department.id, { name: event.target.value })}
                    />
                  </Field>
                  <Field label="上级部门">
                    <Input
                      value={department.parentName || ''}
                      onChange={(event) =>
                        updateDepartment(department.id, { parentName: event.target.value })
                      }
                    />
                  </Field>
                  <Field label="部门类别">
                    <Input
                      value={department.type || ''}
                      onChange={(event) => updateDepartment(department.id, { type: event.target.value })}
                    />
                  </Field>
                </div>
                <div className="mt-3">
                  <Field label="访谈重点">
                    <Textarea
                      value={department.interviewFocus?.join('\n') || ''}
                      onChange={(event) =>
                        updateDepartment(department.id, {
                          interviewFocus: event.target.value.split('\n').filter(Boolean)
                        })
                      }
                    />
                  </Field>
                </div>
                <div className="mt-3 flex justify-end">
                  <Button
                    variant="ghost"
                    onClick={() =>
                      updateState({
                        departments: departments.filter((item) => item.id !== department.id)
                      })
                    }
                  >
                    <Trash2 className="h-4 w-4" /> 删除
                  </Button>
                </div>
              </div>
            ))}
            {!departments.length && <EmptyState title="尚未录入部门" description="上传组织架构图自动识别，或使用右上角按钮手动新增部门。" />}
          </div>
        </Panel>
      </div>
    </PageShell>
  );
}
