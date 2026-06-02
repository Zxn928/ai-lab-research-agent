export const createEmptyWorkspaceState = () => ({
    departments: [],
    questionnaireRecords: [],
    questionnaireSummaries: [],
    interviewGuides: [],
    interviewMaterials: [],
    structuredNotes: [],
    coverageChecks: {},
    painPoints: [],
    scenarios: [],
    updatedAt: new Date().toISOString()
});
