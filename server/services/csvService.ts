import Papa from 'papaparse';
import type { QuestionnaireFieldMap, QuestionnaireRecord } from '../../src/types/questionnaire';

export function parseCsvPreview(buffer: Buffer) {
  const text = buffer.toString('utf8');
  const parsed = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true
  });
  const rows = parsed.data.slice(0, 20);
  return {
    headers: parsed.meta.fields || Object.keys(rows[0] || {}),
    rows
  };
}

export function parseCsvRecords(buffer: Buffer, fieldMap: QuestionnaireFieldMap) {
  const text = buffer.toString('utf8');
  const parsed = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true
  });
  return normalizeQuestionnaireRows(parsed.data, fieldMap);
}

export function normalizeQuestionnaireRows(
  rows: Record<string, unknown>[],
  fieldMap: QuestionnaireFieldMap
): QuestionnaireRecord[] {
  const get = (row: Record<string, unknown>, key?: string) =>
    key && row[key] != null ? String(row[key]).trim() : undefined;

  const records: QuestionnaireRecord[] = [];

  rows.forEach((row, rowIndex) => {
    const base = {
      department: get(row, fieldMap.department),
      name: get(row, fieldMap.name),
      role: get(row, fieldMap.role),
      submittedAt: get(row, fieldMap.submittedAt),
      notes: get(row, fieldMap.notes)
    };

    if (fieldMap.question && fieldMap.answer) {
      const question = get(row, fieldMap.question);
      const answer = get(row, fieldMap.answer);
      if (question && answer) {
        records.push({
          id: `q-${rowIndex}-${records.length}`,
          ...base,
          question,
          answer
        });
      }
      return;
    }

    const questionColumns = fieldMap.questionColumns || [];
    questionColumns.forEach((column, columnIndex) => {
      const answer = get(row, column);
      if (!answer) return;
      records.push({
        id: `q-${rowIndex}-${columnIndex}`,
        ...base,
        question: column,
        answer
      });
    });
  });

  return records;
}
