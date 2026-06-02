import type { AgentRunResponse } from '../../src/types/api';
import type { ResearchSource } from '../../src/types/company';
import type { QuestionnaireFieldMap, QuestionnairePreview } from '../../src/types/questionnaire';

export interface AppConfig {
  openaiApiKey?: string;
  openaiTextModel: string;
  openaiVisionModel: string;
  searchProvider: 'openai' | 'tavily' | 'bing';
  searchApiKey?: string;
  port: number;
}

export interface UploadedFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

export interface ParsedQuestionnaireRequest {
  fieldMap: QuestionnaireFieldMap;
  sheetName?: string;
}

export interface SearchResult {
  publicResearch: string;
  sources: ResearchSource[];
  assumptions: string[];
}

export interface RouteAgentResponse extends AgentRunResponse {}

export interface ParsePreviewResponse extends QuestionnairePreview {}
