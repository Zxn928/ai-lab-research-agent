import type { ReviewStatus } from './painPoint';
export interface ScenarioScore {
    businessValue: number;
    painIntensity: number;
    technicalFeasibility: number;
    dataAvailability: number;
    processClarity: number;
    organizationSupport: number;
    oneMonthImpact: number;
    replicability: number;
    total: number;
}
export interface AIScenario {
    id: string;
    name: string;
    departmentIds: string[];
    relatedPainPointIds: string[];
    currentProblem: string;
    aiSolution: string;
    technicalRoute: string[];
    requiredData: string[];
    requiredSystems?: string[];
    businessValue: string;
    implementationDifficulty: 'low' | 'medium' | 'high';
    risks: string[];
    prerequisites: string[];
    suitableForCourseDemo: boolean;
    suitableForCompetition: boolean;
    suitableForImplementation: boolean;
    score: ScenarioScore;
    priority: 'priority' | 'cultivate' | 'cautious' | 'deferred';
    status: ReviewStatus;
}
