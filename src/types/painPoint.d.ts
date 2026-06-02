export interface Evidence {
    id: string;
    sourceType: 'public_info' | 'questionnaire' | 'transcript' | 'meeting_notes' | 'owner_understanding' | 'ai_inference';
    departmentName?: string;
    content: string;
    confidence: 'high' | 'medium' | 'low';
}
export type ReviewStatus = 'pending' | 'accepted' | 'need_more_info' | 'deferred' | 'course_demo' | 'competition' | 'implementation';
export interface PainPoint {
    id: string;
    title: string;
    departmentIds: string[];
    description: string;
    currentApproach?: string;
    impact?: string;
    evidence: Evidence[];
    confidence: 'high' | 'medium' | 'low';
    problemType: 'ai_suitable' | 'process' | 'data_governance' | 'organization' | 'it_system' | 'unclear';
    status: ReviewStatus;
}
