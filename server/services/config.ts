import dotenv from 'dotenv';
import type { AppConfig } from '../types/server';

dotenv.config();

export const config: AppConfig = {
  openaiApiKey: process.env.OPENAI_API_KEY,
  openaiTextModel: process.env.OPENAI_TEXT_MODEL || 'gpt-5-mini',
  openaiVisionModel: process.env.OPENAI_VISION_MODEL || 'gpt-5-mini',
  searchProvider: (process.env.SEARCH_PROVIDER as AppConfig['searchProvider']) || 'openai',
  searchApiKey: process.env.SEARCH_API_KEY,
  port: Number(process.env.PORT || 3001)
};
