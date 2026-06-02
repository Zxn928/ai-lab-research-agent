import type { SearchResult } from '../types/server';
export declare function researchCompany({ companyName, industry }: {
    companyName: string;
    industry?: string;
}): Promise<SearchResult>;
