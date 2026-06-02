import type { QuestionnaireFieldMap } from '../../src/types/questionnaire';
export declare function parseExcelPreview(buffer: Buffer, sheetName?: string): Promise<{
    headers: string[];
    rows: {
        [k: string]: string;
    }[];
    sheetNames: string[];
}>;
export declare function parseExcelRecords(buffer: Buffer, fieldMap: QuestionnaireFieldMap, sheetName?: string): Promise<import("../../src/types/questionnaire").QuestionnaireRecord[]>;
