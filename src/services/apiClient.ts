import type { AgentRunRequest, AgentRunResponse } from '../types/api';
import type { CompanyResearch } from '../types/company';
import type { QuestionnaireFieldMap, QuestionnairePreview, QuestionnaireRecord } from '../types/questionnaire';

const jsonHeaders = { 'Content-Type': 'application/json' };

export async function getOpenAIStatus() {
  const response = await fetch('/api/openai/status');
  return response.json() as Promise<{
    configured: boolean;
    textModel: string;
    visionModel: string;
    searchProvider: string;
  }>;
}

export async function researchCompany(input: {
  companyName: string;
  industry?: string;
}): Promise<CompanyResearch> {
  const response = await fetch('/api/research/company', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(input)
  });
  assertOk(response);
  const result = await response.json();
  return {
    companyName: input.companyName,
    publicResearch: result.publicResearch,
    sources: result.sources || [],
    assumptions: result.assumptions || [],
    generatedAt: new Date().toISOString()
  };
}

export async function previewQuestionnaire(file: File, sheetName?: string) {
  const form = new FormData();
  form.append('file', file);
  if (sheetName) form.append('sheetName', sheetName);
  const response = await fetch('/api/questionnaire/preview', {
    method: 'POST',
    body: form
  });
  assertOk(response);
  return response.json() as Promise<QuestionnairePreview>;
}

export async function parseQuestionnaire(
  file: File,
  fieldMap: QuestionnaireFieldMap,
  sheetName?: string
) {
  const form = new FormData();
  form.append('file', file);
  form.append('fieldMap', JSON.stringify(fieldMap));
  if (sheetName) form.append('sheetName', sheetName);
  const response = await fetch('/api/questionnaire/parse', {
    method: 'POST',
    body: form
  });
  assertOk(response);
  return response.json() as Promise<{ records: QuestionnaireRecord[] }>;
}

export async function parseOrgStructure(image: File) {
  const form = new FormData();
  form.append('image', image);
  const response = await fetch('/api/vision/org-structure', {
    method: 'POST',
    body: form
  });
  assertOk(response);
  return response.json();
}

export async function runAgent<TResult = unknown, TInput = unknown>(
  request: AgentRunRequest<TInput>
) {
  const response = await fetch('/api/agent/run', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(request)
  });
  assertOk(response);
  return response.json() as Promise<AgentRunResponse<TResult>>;
}

export async function exportMarkdown(title: string, markdown: string) {
  const response = await fetch('/api/export/markdown', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ title, markdown })
  });
  assertOk(response);
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

function assertOk(response: Response) {
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
}
