import { Plus, Save, Trash2 } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Field, Textarea } from '../components/common/Field';
import { PageShell } from '../components/common/PageShell';
import { Panel } from '../components/common/Panel';
import type { InterviewMaterial } from '../types/interview';
import type { WorkspaceState } from '../types/workspace';

export function InterviewMaterialImportPage({
  state,
  updateState
}: {
  state: WorkspaceState;
  updateState: (next: Partial<WorkspaceState>) => void;
}) {
  const addMaterial = (departmentId: string, departmentName: string) => {
    updateState({
      interviewMaterials: [
        ...state.interviewMaterials,
        {
          id: crypto.randomUUID(),
          departmentId,
          departmentName,
          transcript: '',
          meetingNotes: '',
          projectOwnerUnderstanding: '',
          createdAt: new Date().toISOString()
        }
      ]
    });
  };

  const updateMaterial = (id: string, patch: Partial<InterviewMaterial>) => {
    updateState({
      interviewMaterials: state.interviewMaterials.map((material) =>
        material.id === id ? { ...material, ...patch } : material
      )
    });
  };

  return (
    <PageShell title="访谈材料导入" description="按部门分别录入录音转写、会议纪要和项目负责人个人理解，三类信息不混写。" eyebrow="访谈后诊断 / 07">
      <div className="grid gap-4">
        {state.departments.map((department) => {
          const material = state.interviewMaterials.find((item) => item.departmentId === department.id);
          return (
            <Panel
              key={department.id}
              title={department.name}
              footer={
                material ? (
                  <Button
                    variant="ghost"
                    onClick={() =>
                      updateState({
                        interviewMaterials: state.interviewMaterials.filter((item) => item.id !== material.id)
                      })
                    }
                  >
                    <Trash2 className="h-4 w-4" /> 删除材料
                  </Button>
                ) : (
                  <Button onClick={() => addMaterial(department.id, department.name)}>
                    <Plus className="h-4 w-4" /> 新增材料区
                  </Button>
                )
              }
            >
              {material ? (
                <div className="grid gap-4 lg:grid-cols-3">
                  <Field label="录音转写">
                    <Textarea
                      value={material.transcript || ''}
                      onChange={(event) => updateMaterial(material.id, { transcript: event.target.value })}
                    />
                  </Field>
                  <Field label="会议纪要">
                    <Textarea
                      value={material.meetingNotes || ''}
                      onChange={(event) => updateMaterial(material.id, { meetingNotes: event.target.value })}
                    />
                  </Field>
                  <Field label="项目负责人个人理解">
                    <Textarea
                      value={material.projectOwnerUnderstanding || ''}
                      onChange={(event) =>
                        updateMaterial(material.id, { projectOwnerUnderstanding: event.target.value })
                      }
                    />
                  </Field>
                </div>
              ) : (
                <div className="text-sm text-muted">尚未录入该部门访谈材料。</div>
              )}
            </Panel>
          );
        })}
        <div className="flex items-center gap-2 text-sm text-muted">
          <Save className="h-4 w-4" /> 内容会自动保存到本地 IndexedDB。
        </div>
      </div>
    </PageShell>
  );
}
