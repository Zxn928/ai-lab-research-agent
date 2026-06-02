export interface QuestionnaireRecord {
    id: string;
    department?: string;
    name?: string;
    role?: string;
    question: string;
    answer: string;
    submittedAt?: string;
    notes?: string;
}
export interface QuestionnaireFieldMap {
    department?: string;
    name?: string;
    role?: string;
    submittedAt?: string;
    notes?: string;
    question?: string;
    answer?: string;
    questionColumns?: string[];
}
export interface QuestionnairePreview {
    headers: string[];
    rows: Record<string, string>[];
    sheetNames?: string[];
}
export interface DepartmentQuestionnaireSummary {
    departmentName: string;
    recordCount: number;
    summary: string;
    keywords: string[];
    initialPainPoints: string[];
    aiScenarioClues: string[];
    questionsToVerify: string[];
}
