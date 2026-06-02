import ExcelJS from 'exceljs';
import type { QuestionnaireFieldMap } from '../../src/types/questionnaire';
import { normalizeQuestionnaireRows } from './csvService';

export async function parseExcelPreview(buffer: Buffer, sheetName?: string) {
  const workbook = await loadWorkbook(buffer);
  const sheet = selectWorksheet(workbook, sheetName);
  const rows = worksheetToRows(sheet);

  return {
    headers: rows.length ? Object.keys(rows[0]) : [],
    rows: rows.slice(0, 20).map((row) =>
      Object.fromEntries(Object.entries(row).map(([key, value]) => [key, String(value ?? '')]))
    ),
    sheetNames: workbook.worksheets.map((worksheet) => worksheet.name)
  };
}

export async function parseExcelRecords(
  buffer: Buffer,
  fieldMap: QuestionnaireFieldMap,
  sheetName?: string
) {
  const workbook = await loadWorkbook(buffer);
  const sheet = selectWorksheet(workbook, sheetName);
  return normalizeQuestionnaireRows(worksheetToRows(sheet), fieldMap);
}

async function loadWorkbook(buffer: Buffer) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer as unknown as ExcelJS.Buffer);
  return workbook;
}

function selectWorksheet(workbook: ExcelJS.Workbook, sheetName?: string) {
  const sheet = sheetName ? workbook.getWorksheet(sheetName) || workbook.worksheets[0] : workbook.worksheets[0];
  if (!sheet) throw new Error('Excel 文件中没有可读取的工作表。');
  return sheet;
}

function worksheetToRows(sheet: ExcelJS.Worksheet) {
  const headerRow = sheet.getRow(1);
  const headerValues = Array.isArray(headerRow.values) ? headerRow.values.slice(1) : [];
  const headers = headerValues.map(
    (value: ExcelJS.CellValue, index: number) => cellText(value) || `未命名列${index + 1}`
  );

  const rows: Record<string, unknown>[] = [];
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const record = Object.fromEntries(
      headers.map((header: string, index: number) => [header, cellText(row.getCell(index + 1).value)])
    );
    if (Object.values(record).some(Boolean)) rows.push(record);
  });
  return rows;
}

function cellText(value: ExcelJS.CellValue | undefined) {
  if (value == null) return '';
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'object') {
    if ('text' in value) return String(value.text);
    if ('result' in value) return String(value.result ?? '');
    if ('richText' in value) return value.richText.map((item) => item.text).join('');
    if ('hyperlink' in value) {
      const hyperlink = value as unknown as { text?: string; hyperlink?: string };
      return String(hyperlink.text || hyperlink.hyperlink || '');
    }
  }
  return String(value);
}
