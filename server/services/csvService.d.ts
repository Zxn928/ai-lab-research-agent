import type { QuestionnaireFieldMap, QuestionnaireRecord } from '../../src/types/questionnaire';
export declare function parseCsvPreview(buffer: Buffer): {
    headers: string[];
    rows: Record<string, string>[];
};
export declare function parseCsvRecords(buffer: Buffer, fieldMap: QuestionnaireFieldMap): QuestionnaireRecord[];
export declare function normalizeQuestionnaireRows(rows: Record<string, unknown>[], fieldMap: QuestionnaireFieldMap): QuestionnaireRecord[];
