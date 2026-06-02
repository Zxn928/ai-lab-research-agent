import { CheckCircle2, FileSpreadsheet, TableProperties, Wand2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
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
  const [preview, setPreview] = useState<QuestionnairePreview>();
  const [sheetName, setSheetName] = useState<string>();
  const [fieldMap, setFieldMap] = useState<QuestionnaireFieldMap>({});
  const [loading, setLoading] = useState(false);

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
    return (preview?.headers || []).filter((header) => !fixed.has(header));
  }, [fieldMap, preview]);

  const onSelectFile = async (target?: File) => {
    if (!target) return;
    setFile(target);
    const result = await previewQuestionnaire(target);
    setPreview(result);
    setSheetName(result.sheetNames?.[0]);
    setFieldMap({
      department: guess(result.headers, ['部门', '所属部门']),
      name: guess(result.headers, ['姓名', '名字']),
      role: guess(result.headers, ['岗位', '职位', '职务']),
      submittedAt: guess(result.headers, ['提交时间', '时间']),
      notes: guess(result.headers, ['备注']),
      questionColumns: result.headers.filter(
        (header) => !['部门', '所属部门', '姓名', '岗位', '职位', '职务', '提交时间', '时间', '备注'].some((key) => header.includes(key))
      )
    });
  };

  const parse = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const parsed = await parseQuestionnaire(file, fieldMap, sheetName);
      const agentResult = await runAgent<{ departmentSummaries: WorkspaceState['questionnaireSummaries'] }>({
        agentName: 'questionnaireAnalysisAgent',
        input: { records: parsed.records }
      });
      updateState({
        questionnaireRecords: parsed.records,
        questionnaireSummaries: agentResult.result.departmentSummaries || []
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      title="问卷反馈导入"
      description="P0 优先支持 Excel，也兼容 CSV。真实问卷常见的一行一人、多列问题答案会被转换成统一 JSON 记录。"
      eyebrow="访谈前准备 / 04"
      actions={
        <Button onClick={parse} disabled={!file || loading}>
          <Wand2 className="h-4 w-4" /> {loading ? '解析分析中' : '解析并分析'}
        </Button>
      }
    >
      <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
        <Panel title="问卷文件" description="推荐上传原始 Excel 文件，系统会统一转换为 JSON 记录。">
          <label className="flex min-h-44 flex-col items-center justify-center rounded-lg border border-dashed border-teal-200 bg-teal-50/50 px-4 text-center text-sm font-semibold text-brand transition hover:border-brand hover:bg-teal-50">
            <FileSpreadsheet className="mb-3 h-8 w-8" />
            {file ? file.name : '上传 Excel 或 CSV'}
            <span className="mt-1 text-xs font-normal text-muted">支持 .xlsx、.xls、.csv</span>
            <input
              className="sr-only"
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={(event) => onSelectFile(event.target.files?.[0])}
            />
          </label>
          <p className="mt-3 text-sm leading-6 text-muted">
            尚未检测到胜业电气问卷 Excel/CSV，请将文件放入 public/demo/shengye-electric/questionnaire-sample.csv 或在此上传。
          </p>
          {file && (
            <div className="mt-4 flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="h-4 w-4" aria-hidden />
              文件已读取，可继续检查字段映射
            </div>
          )}
        </Panel>
        <Panel
          title="字段映射"
          description="左侧基础信息列用于归属部门和人员识别，其余勾选列会作为问卷问题。"
          badge={preview && <Badge tone="info">{preview.headers.length} 个字段</Badge>}
        >
          {preview ? (
            <div className="space-y-5">
              {preview.sheetNames && (
                <Field label="工作表">
                  <select
                    className="min-h-11 w-full rounded-md border border-line bg-white px-3 text-sm shadow-sm transition hover:border-slate-300 focus:border-brand focus:ring-4 focus:ring-teal-600/10"
                    value={sheetName}
                    onChange={(event) => setSheetName(event.target.value)}
                  >
                    {preview.sheetNames.map((name) => (
                      <option key={name}>{name}</option>
                    ))}
                  </select>
                </Field>
              )}
              <div className="grid gap-3 md:grid-cols-3">
                {(['department', 'name', 'role', 'submittedAt', 'notes'] as const).map((key) => (
                  <Field key={key} label={fieldLabels[key]}>
                    <select
                      className="min-h-11 w-full rounded-md border border-line bg-white px-3 text-sm shadow-sm transition hover:border-slate-300 focus:border-brand focus:ring-4 focus:ring-teal-600/10"
                      value={fieldMap[key] || ''}
                      onChange={(event) => setFieldMap({ ...fieldMap, [key]: event.target.value })}
                    >
                      <option value="">不映射</option>
                      {preview.headers.map((header) => (
                        <option key={header}>{header}</option>
                      ))}
                    </select>
                  </Field>
                ))}
              </div>
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <TableProperties className="h-4 w-4 text-brand" aria-hidden />
                  问题列
                </div>
                <div className="grid gap-2 md:grid-cols-2">
                  {questionColumns.map((header) => {
                    const selected = fieldMap.questionColumns?.includes(header) ?? false;
                    return (
                      <label key={header} className="flex min-h-11 items-center gap-2 rounded-md border border-line bg-panel px-3 py-2 text-sm transition hover:border-teal-200 hover:bg-teal-50/40">
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
                  <thead className="bg-slate-100 text-xs font-semibold text-slate-600">
                    <tr>
                      {preview.headers.map((header) => (
                        <th key={header} className="whitespace-nowrap px-3 py-2">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.rows.slice(0, 5).map((row, index) => (
                      <tr key={index} className="border-t border-line">
                        {preview.headers.map((header) => (
                          <td key={header} className="max-w-64 truncate px-3 py-2">
                            {row[header]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <EmptyState title="等待问卷文件" description="上传真实 Excel 或 CSV 后，这里会显示字段映射和前 5 行数据预览。" />
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
