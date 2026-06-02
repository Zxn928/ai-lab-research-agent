export interface OpportunityMapItem {
    scenarioId: string;
    scenarioName: string;
    businessValue: number;
    difficulty: number;
    quadrant: 'quick_win' | 'strategic' | 'practice' | 'defer';
}
export interface OpportunityMap {
    items: OpportunityMapItem[];
    markdown: string;
}
