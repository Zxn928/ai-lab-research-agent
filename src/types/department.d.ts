export interface Department {
    id: string;
    name: string;
    parentName?: string;
    type?: string;
    description?: string;
    interviewPriority?: 'high' | 'medium' | 'low';
    interviewFocus?: string[];
}
