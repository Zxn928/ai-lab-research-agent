export type ProjectStage = 'pre_interview' | 'post_interview' | 'report_draft';
export interface Project {
    id: string;
    name: string;
    companyName: string;
    industry?: string;
    stage: ProjectStage;
    researchDate?: string;
    background?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}
