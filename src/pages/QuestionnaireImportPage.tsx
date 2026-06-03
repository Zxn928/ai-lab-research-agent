import { CheckCircle2, FileSpreadsheet, Loader2, XCircle, Wand2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AgentProgress } from '../components/common/AgentProgress';
import { Button } from '../components/common/Button';
import { Field } from '../components/common/Field';
import { PageShell } from '../components/common/PageShell';
import { Panel } from '../components/common/Panel';
import { parseQuestionnaire, previewQuestionnaire, runAgent } from '../services/apiClient';
import type { QuestionnaireFieldMap, QuestionnairePreview } from '../types/questionnaire';
import type { WorkspaceState } from '../types/workspace';

export function QuestionnaireImportPage({
  state,
  updateState
}: {
  state: WorkspaceState;
  updateState: (next: Partial<WorkspaceState>) => void;
}) {
  const [file, setFile] = useState<File>();
  const [files, setFiles] = useState<File[]>([]);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [preview, setPreview] = useState<QuestionnairePreview>();
  const [sheetName, setSheetName] = useState<string>();
  const [fieldMap, setFieldMap] = useState<QuestionnaireFieldMap>({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: 'idle' | 'previewing' | 'parsing' | 'analyzing' | 'success' | 'warning' | 'error';
    message: string;
  }>({ type: 'idle', message: '' });

  const previewHeaders = preview?.headers ?? [];
  const previewRows = preview?.rows ?? [];
  const previewSheetNames = preview?.sheetNames ?? [];
  const previewing = status.type === 'previewing';
  const busy = loading || previewing;

  const questionColumns = useMemo(() => {
    const fixed = new Set([
      fieldMap.department,
      fieldMap.name,
      fieldMap.role,
      fieldMap.submittedAt,
      fieldMap.notes,
      fieldMap.question,
      fieldMap.answer
    ]);
    return previewHeaders.filter((header) => !fixed.has(header));
  }, [fieldMap, previewHeaders]);

  const onSelectFiles = async (targets?: FileList | null) => {
    const selected = Array.from(targets || []);
    if (!selected.length) return;
    setFiles(selected);
    setActiveFileIndex(0);
    try {
      await loadPreview(selected[0], true);
    } catch (error) {
      setPreview(undefined);
      setFieldMap({});
      setStatus({ type: 'error', message: getUploadErrorMessage(error) });
    }
  };

  const loadPreview = async (target: File, resetMapping = false) => {
    setFile(target);
    setStatus({ type: 'previewing', message: `正在读取 ${target.name} 的字段预览...` });
    const result = normalizePreview(await previewQuestionnaire(target));
    setPreview(result);
    setSheetName(result.sheetNames?.[0] ?? '');
    if (resetMapping) {
      setFieldMap({
        department: guess(result.headers, ['部门', '所属部门']),
        name: guess(result.headers, ['姓名', '名字']),
        role: guess(result.headers, ['岗位', '职位', '职务']),
        submittedAt: guess(result.headers, ['提交时间', '时间']),
        notes: guess(result.headers, ['备注']),
        questionColumns: result.headers.filter((header) => !isMetadataColumn(header))
      });
    }
    setStatus({ type: 'idle', message: `${target.name} 预览完成。` });
  };

  const selectActiveFile = async (index: number) => {
    const next = files[index];
    if (!next) return;
    setActiveFileIndex(index);
    try {
      await loadPreview(next);
    } catch (error) {
      setPreview(undefined);
      setStatus({ type: 'error', message: getUploadErrorMessage(error) });
    }
  };

  const parse = async () => {
    const targets = files.length ? files : file ? [file] : [];
    if (!targets.length) return;
    setLoading(true);
    try {
      setStatus({ type: 'parsing', message: `正在解析 ${targets.length} 个文件...` });
      const parsedResults = [];
      for (const [index, target] of targets.entries()) {
        setStatus({ type: 'parsing', message: `正在解析 ${index + 1}/${targets.length}：${target.name}` });
        parsedResults.push(await parseQuestionnaire(target, fieldMap, sheetName));
      }
      const records = parsedResults.flatMap((result) => result.records);
      updateState({
        questionnaireRecords: records,
        questionnaireSummaries: []
      });
      setStatus({ type: 'analyzing', message: `已解析 ${records.length} 条问卷记录，正在进行 AI 分析...` });

      try {
        const agentResult = await runAgent<{ departmentSummaries: WorkspaceState['questionnaireSummaries'] }>({
          agentName: 'questionnaireAnalysisAgent',
          input: { records }
        });
        const summaries = agentResult.result.departmentSummaries || [];
        updateState({
          questionnaireRecords: records,
          questionnaireSummaries: summaries
        });
        setStatus({
          type: 'success',
          message: `完成：已解析 ${targets.length} 个文件、${records.length} 条记录，生成 ${summaries.length} 个部门摘要。`
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'AI 分析失败';
        setStatus({
          type: 'warning',
          message: `已解析 ${targets.length} 个文件、${records.length} 条记录，但 AI 分析失败：${message}`
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : '解析失败';
      setStatus({ type: 'error', message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      title="问卷反馈导入"
      description="P0 优先支持 Excel，也兼容 CSV。真实问卷常见的一行一人、多列问题答案会被转换成统一 JSON 记录。"
      actions={
        <Button onClick={parse} disabled={!file || busy}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
          {previewing ? '读取预览中' : loading ? '解析分析中' : files.length > 1 ? `批量解析 ${files.length} 个文件` : '解析并分析'}
        </Button>
      }
    >
      <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
        <Panel title="输入区">
          <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-line bg-panel px-4 text-center text-sm text-muted">
            <FileSpreadsheet className="mb-3 h-8 w-8 text-brand" />
            {file ? file.name : '批量上传 Excel 或 CSV'}
            <input
              className="sr-only"
              type="file"
              accept=".xlsx,.xls,.csv"
              multiple
              onChange={(event) => onSelectFiles(event.target.files)}
            />
          </label>
          <p className="mt-3 text-sm leading-6 text-muted">
            支持一次选择多个 Excel/CSV。字段映射会应用到本次选择的所有文件，适合多份同结构问卷。
          </p>
          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              <div className="text-sm font-semibold text-slate-700">已选择文件</div>
              {files.map((item, index) => (
                <button
                  key={`${item.name}-${item.size}-${index}`}
                  type="button"
                  onClick={() => selectActiveFile(index)}
                  className={[
                    'w-full rounded-md border px-3 py-2 text-left text-sm transition',
                    index === activeFileIndex
                      ? 'border-brand bg-teal-50 text-brand'
                      : 'border-line bg-white text-slate-700 hover:bg-slate-50'
                  ].join(' ')}
                >
                  <span className="font-semibold">{index + 1}. </span>
                  {item.name}
                </button>
              ))}
            </div>
          )}
          {status.message && (
            <div
              className={[
                'mt-4 flex gap-2 rounded-md border px-3 py-2 text-sm leading-6',
                status.type === 'success'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : status.type === 'warning'
                    ? 'border-amber-200 bg-amber-50 text-amber-800'
                    : status.type === 'error'
                      ? 'border-red-200 bg-red-50 text-red-700'
                      : 'border-line bg-panel text-slate-700'
              ].join(' ')}
            >
              {status.type === 'success' ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              ) : status.type === 'error' ? (
                <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
              ) : busy ? (
                <Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin" />
              ) : null}
              <span>{status.message}</span>
            </div>
          )}
        </Panel>
        <Panel title="字段映射 / AI分析区">
          {preview ? (
            <div className="space-y-5">
              <AgentProgress
                active={busy}
                title="正在处理问卷数据"
                detail={status.message || '正在解析文件并进行 AI 分析，请稍等。'}
                steps={['读取 Excel/CSV', '转换为统一 JSON', '按部门聚合反馈', '生成痛点与核实问题']}
              />
              {previewSheetNames.length > 0 && (
                <Field label="工作表">
                  <select
                    className="min-h-11 w-full rounded-md border border-line px-3"
                    value={sheetName || previewSheetNames[0] || ''}
                    onChange={(event) => setSheetName(event.target.value)}
                  >
                    {previewSheetNames.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </Field>
              )}
              <div className="grid gap-3 md:grid-cols-3">
                {(['department', 'name', 'role', 'submittedAt', 'notes'] as const).map((key) => (
                  <Field key={key} label={fieldLabels[key]}>
                    <select
                      className="min-h-11 w-full rounded-md border border-line px-3"
                      value={fieldMap[key] || ''}
                      onChange={(event) => setFieldMap({ ...fieldMap, [key]: event.target.value })}
                    >
                      <option value="">不映射</option>
                      {previewHeaders.map((header) => (
                        <option key={header}>{header}</option>
                      ))}
                    </select>
                  </Field>
                ))}
              </div>
              <div>
                <div className="mb-2 text-sm font-semibold text-slate-700">问题列</div>
                <div className="grid gap-2 md:grid-cols-2">
                  {questionColumns.map((header) => {
                    const selected = fieldMap.questionColumns?.includes(header) ?? false;
                    return (
                      <label key={header} className="flex items-center gap-2 rounded-md border border-line bg-panel px-3 py-2 text-sm">
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={(event) => {
                            const current = fieldMap.questionColumns || [];
                            setFieldMap({
                              ...fieldMap,
                              questionColumns: event.target.checked
                                ? [...current, header]
                                : current.filter((item) => item !== header)
                            });
                          }}
                        />
                        <span>{header}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
              <div className="overflow-auto rounded-md border border-line">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-panel text-xs font-semibold text-muted">
                    <tr>
                      {previewHeaders.map((header) => (
                        <th key={header} className="whitespace-nowrap px-3 py-2">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.slice(0, 5).map((row, index) => (
                      <tr key={index} className="border-t border-line">
                        {previewHeaders.map((header) => (
                          <td key={header} className="max-w-64 truncate px-3 py-2">
                            {row[header]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-md border border-line bg-panel px-3 py-2">
                  <div className="text-xs font-semibold text-muted">已导入记录</div>
                  <div className="mt-1 text-lg font-bold text-ink">{state.questionnaireRecords.length}</div>
                </div>
                <div className="rounded-md border border-line bg-panel px-3 py-2">
                  <div className="text-xs font-semibold text-muted">部门摘要</div>
                  <div className="mt-1 text-lg font-bold text-ink">{state.questionnaireSummaries.length}</div>
                </div>
                <div className="rounded-md border border-line bg-panel px-3 py-2">
                  <div className="text-xs font-semibold text-muted">已选问题列</div>
                  <div className="mt-1 text-lg font-bold text-ink">{fieldMap.questionColumns?.length || 0}</div>
                </div>
              </div>
              {state.questionnaireSummaries.length > 0 && (
                <div className="space-y-3">
                  <div className="text-sm font-semibold text-slate-700">AI 分析结果</div>
                  {state.questionnaireSummaries.map((summary) => (
                    <div key={summary.departmentName} className="rounded-md border border-line bg-panel p-3 text-sm leading-6 text-slate-700">
                      <div className="font-semibold text-ink">{summary.departmentName}</div>
                      <p className="mt-1">{summary.summary}</p>
                      {summary.initialPainPoints?.length > 0 && (
                        <p className="mt-2 text-muted">初步痛点：{summary.initialPainPoints.join('；')}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-muted">请先上传真实问卷文件。</div>
          )}
        </Panel>
      </div>
    </PageShell>
  );
}

const fieldLabels = {
  department: '部门',
  name: '姓名',
  role: '岗位',
  submittedAt: '提交时间',
  notes: '备注'
};

function guess(headers: string[], keys: string[]) {
  return headers.find((header) => keys.some((key) => header.includes(key)));
}

function normalizePreview(result: QuestionnairePreview): QuestionnairePreview {
  const headers = Array.isArray(result.headers)
    ? result.headers.filter((header): header is string => typeof header === 'string' && header.length > 0)
    : [];
  const rows = Array.isArray(result.rows)
    ? result.rows.map((row) => {
        if (!row || typeof row !== 'object') return {};
        return Object.fromEntries(
          Object.entries(row).map(([key, value]) => [key, String(value ?? '')])
        );
      })
    : [];
  const sheetNames = Array.isArray(result.sheetNames)
    ? result.sheetNames.filter((name): name is string => typeof name === 'string' && name.length > 0)
    : undefined;

  return { headers, rows, sheetNames };
}

function getUploadErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : '文件读取失败';
  if (/\.xls\b/i.test(message)) {
    return '暂不支持老式 .xls 文件，请先另存为 .xlsx 或 CSV 后再上传。';
  }
  return `文件预览失败：${message}`;
}

function isMetadataColumn(header: string) {
  return [
    '部门',
    '所属部门',
    '姓名',
    '名字',
    '岗位',
    '职位',
    '职务',
    '提交时间',
    '答卷时间',
    '所用时间',
    '来源',
    '来源详情',
    '备注'
  ].some((key) => header.includes(key));
}
