export interface ResearchSource {
  title: string;
  url?: string;
  snippet?: string;
}

export interface CompanyResearch {
  companyName: string;
  publicResearch: string;
  sources: ResearchSource[];
  assumptions: string[];
  generatedAt: string;
}
