import type { CompanyResearch } from './company';
import type { Department } from './department';
import type {
  CoverageItem,
  InterviewGuide,
  InterviewMaterial,
  StructuredInterviewNotes
} from './interview';
import type { OpportunityMap } from './opportunityMap';
import type { PainPoint } from './painPoint';
import type { Project } from './project';
import type {
  DepartmentQuestionnaireSummary,
  QuestionnaireRecord
} from './questionnaire';
import type { DiagnosisReport } from './report';
import type { AIScenario } from './scenario';

export interface WorkspaceState {
  project?: Project;
  companyResearch?: CompanyResearch;
  departments: Department[];
  questionnaireRecords: QuestionnaireRecord[];
  questionnaireSummaries: DepartmentQuestionnaireSummary[];
  interviewGuides: InterviewGuide[];
  fieldworkPackageMarkdown?: string;
  interviewMaterials: InterviewMaterial[];
  structuredNotes: StructuredInterviewNotes[];
  coverageChecks: Record<string, CoverageItem[]>;
  painPoints: PainPoint[];
  scenarios: AIScenario[];
  opportunityMap?: OpportunityMap;
  report?: DiagnosisReport;
  updatedAt: string;
}

export const createEmptyWorkspaceState = (): WorkspaceState => ({
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
