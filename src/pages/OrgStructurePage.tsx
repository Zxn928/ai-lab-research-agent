import { ImageUp, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../components/common/Button';
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
      actions={
        <Button variant="secondary" onClick={addDepartment}>
          <Plus className="h-4 w-4" /> 新增部门
        </Button>
      }
    >
      <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
        <Panel title="输入区">
          <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-line bg-panel px-4 text-center text-sm text-muted">
            <ImageUp className="mb-3 h-8 w-8 text-brand" />
            {loading ? '识别中' : '上传组织架构图'}
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
        <Panel title="人工审核区">
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
            {!departments.length && <div className="text-sm text-muted">暂无部门，请上传图片或新增部门。</div>}
          </div>
        </Panel>
      </div>
    </PageShell>
  );
}
