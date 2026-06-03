import {
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  FileSearch,
  HelpCircle,
  ListChecks,
  Loader2,
  MessageSquareText,
  Target,
  Wand2
} from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';
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
  const [collapsedDepartments, setCollapsedDepartments] = useState<Record<string, boolean>>({});

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
          const isCollapsed = collapsedDepartments[department.id] ?? false;
          const questionTotal = guide
            ? 1 +
              safeList(guide.commonQuestions).length +
              safeList(guide.departmentSpecificQuestions).length +
              safeList(guide.deepDiveQuestions).length +
              safeList(guide.dataToCollect).length +
              safeList(guide.assumptionsToVerify).length
            : 0;
          return (
            <Panel
              key={department.id}
              title={
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span>{department.name || '未命名部门'}</span>
                      {guide && (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                          {questionTotal} 条内容
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm font-normal text-muted">
                      {guide
                        ? isCollapsed
                          ? compactText(guide.interviewGoal)
                          : '已生成访谈提纲，可收起该部门减少页面长度。'
                        : '尚未生成该部门访谈提纲。'}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-expanded={!isCollapsed}
                    onClick={() =>
                      setCollapsedDepartments((current) => ({
                        ...current,
                        [department.id]: !(current[department.id] ?? false)
                      }))
                    }
                    className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-md border border-line bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    {isCollapsed ? (
                      <>
                        <ChevronDown className="h-4 w-4" />
                        展开部门
                      </>
                    ) : (
                      <>
                        <ChevronUp className="h-4 w-4" />
                        收起部门
                      </>
                    )}
                  </button>
                </div>
              }
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
              {isCollapsed ? (
                <div className="rounded-md border border-dashed border-line bg-panel px-4 py-3 text-sm leading-6 text-muted">
                  {guide ? '该部门内容已收起。展开后可查看访谈目标、问题清单、追问和资料清单。' : '该部门尚未生成提纲，可点击下方按钮生成。'}
                </div>
              ) : (
                <>
                  <AgentProgress
                    active={loadingId === department.id}
                    title={`正在生成 ${department.name || '该部门'} 访谈提纲`}
                    detail="Agent 正在结合企业画像、问卷反馈和部门重点生成问题清单。"
                    steps={['整理部门上下文', '生成访谈目标', '设计专属问题', '补充深挖追问和资料清单']}
                  />
                  {guide ? (
                    <div className="space-y-4">
                      <GuideBlock
                        tone="sky"
                        icon={<Target className="h-5 w-5" />}
                        title="访谈目标"
                        description="本轮访谈要确认的核心判断和边界。"
                        items={[guide.interviewGoal].filter(Boolean)}
                        defaultExpanded
                        numbered={false}
                      />

                      <div className="grid gap-4 xl:grid-cols-2">
                        <GuideBlock
                          tone="brand"
                          icon={<MessageSquareText className="h-5 w-5" />}
                          title="通用访谈问题"
                          description="用于快速建立部门工作全貌和基础事实。"
                          items={safeList(guide.commonQuestions)}
                        />
                        <GuideBlock
                          tone="indigo"
                          icon={<ListChecks className="h-5 w-5" />}
                          title="部门专属问题"
                          description="围绕该部门职责、流程、系统和协同痛点展开。"
                          items={safeList(guide.departmentSpecificQuestions)}
                        />
                        <GuideBlock
                          tone="amber"
                          icon={<HelpCircle className="h-5 w-5" />}
                          title="深挖追问"
                          description="当受访者回答较泛时，用这些问题继续追证据和边界。"
                          items={safeList(guide.deepDiveQuestions)}
                        />
                        <GuideBlock
                          tone="emerald"
                          icon={<FileSearch className="h-5 w-5" />}
                          title="现场资料清单"
                          description="访谈后需要收集的表单、截图、流程资料和系统样例。"
                          items={safeList(guide.dataToCollect)}
                        />
                      </div>

                      <GuideBlock
                        tone="slate"
                        icon={<ClipboardCheck className="h-5 w-5" />}
                        title="待核实假设"
                        description="这些内容不能直接写成诊断结论，需要在现场访谈中确认。"
                        items={safeList(guide.assumptionsToVerify)}
                      />
                    </div>
                  ) : (
                    <div className="text-sm text-muted">尚未生成该部门访谈提纲。</div>
                  )}
                </>
              )}
            </Panel>
          );
        })}
        {!state.departments.length && <Panel title="提示">请先在组织架构页面维护部门清单。</Panel>}
      </div>
    </PageShell>
  );
}

function GuideBlock({
  title,
  description,
  items,
  icon,
  tone,
  defaultExpanded,
  numbered
}: {
  title: string;
  description: string;
  items: string[];
  icon: ReactNode;
  tone: 'sky' | 'brand' | 'indigo' | 'amber' | 'emerald' | 'slate';
  defaultExpanded?: boolean;
  numbered?: boolean;
}) {
  const styles = guideToneStyles[tone];
  const [expanded, setExpanded] = useState(defaultExpanded ?? false);
  const preview = items[0] || '暂无内容。';

  return (
    <section className={`overflow-hidden rounded-lg border bg-white ${styles.border}`}>
      <div className={`border-b px-4 py-3 ${styles.header}`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${styles.icon}`}>
            {icon}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-sm font-bold text-ink">{title}</div>
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${styles.badge}`}>
                {items.length} 条
              </span>
            </div>
            <p className="mt-1 text-xs leading-5 text-slate-600">{description}</p>
            {!expanded && (
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-700">
                {preview}
              </p>
            )}
          </div>
          <button
            type="button"
            aria-expanded={expanded}
            onClick={() => setExpanded((current) => !current)}
            className={[
              'inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-md border px-3 text-sm font-semibold transition',
              styles.button
            ].join(' ')}
          >
            {expanded ? (
              <>
                <ChevronUp className="h-4 w-4" />
                收起
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                展开
              </>
            )}
          </button>
        </div>
      </div>
      {expanded && (
        items.length > 0 ? (
          <ol className="divide-y divide-slate-100">
            {items.map((item, index) => (
              <li key={index} className="flex gap-3 px-4 py-3 text-sm leading-6 text-slate-700">
                {numbered !== false && (
                  <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${styles.badge}`}>
                    {index + 1}
                  </span>
                )}
                <span>{item}</span>
              </li>
            ))}
          </ol>
        ) : (
          <div className="px-4 py-4 text-sm text-muted">暂无内容。</div>
        )
      )}
    </section>
  );
}

function safeList(items?: string[]) {
  return Array.isArray(items) ? items : [];
}

function compactText(text?: string) {
  const value = text?.trim();
  if (!value) return '已生成访谈提纲，展开后可查看完整内容。';
  return value.length > 80 ? `${value.slice(0, 80)}...` : value;
}

const guideToneStyles = {
  sky: {
    border: 'border-sky-100',
    header: 'border-sky-100 bg-sky-50',
    icon: 'bg-sky-600 text-white',
    badge: 'bg-sky-100 text-sky-700',
    button: 'border-sky-200 bg-white text-sky-700 hover:bg-sky-100'
  },
  brand: {
    border: 'border-teal-100',
    header: 'border-teal-100 bg-teal-50',
    icon: 'bg-brand text-white',
    badge: 'bg-teal-100 text-brand',
    button: 'border-teal-200 bg-white text-brand hover:bg-teal-100'
  },
  indigo: {
    border: 'border-indigo-100',
    header: 'border-indigo-100 bg-indigo-50',
    icon: 'bg-indigo-600 text-white',
    badge: 'bg-indigo-100 text-indigo-700',
    button: 'border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-100'
  },
  amber: {
    border: 'border-amber-100',
    header: 'border-amber-100 bg-amber-50',
    icon: 'bg-amber-500 text-white',
    badge: 'bg-amber-100 text-amber-700',
    button: 'border-amber-200 bg-white text-amber-700 hover:bg-amber-100'
  },
  emerald: {
    border: 'border-emerald-100',
    header: 'border-emerald-100 bg-emerald-50',
    icon: 'bg-emerald-600 text-white',
    badge: 'bg-emerald-100 text-emerald-700',
    button: 'border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-100'
  },
  slate: {
    border: 'border-slate-200',
    header: 'border-slate-200 bg-slate-50',
    icon: 'bg-slate-700 text-white',
    badge: 'bg-slate-100 text-slate-700',
    button: 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
  }
} as const;
