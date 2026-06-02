import dotenv from 'dotenv';
import type { AppConfig } from '../types/server';

dotenv.config();

export const config: AppConfig = {
  openaiApiKey: process.env.OPENAI_API_KEY,
  openaiBaseUrl: process.env.OPENAI_BASE_URL,
  openaiProviderName: process.env.OPENAI_PROVIDER_NAME || 'OpenAI',
  openaiTextModel: process.env.OPENAI_TEXT_MODEL || 'gpt-5.5',
  openaiVisionModel: process.env.OPENAI_VISION_MODEL || 'gpt-5.5',
  openaiTemperature:
    process.env.OPENAI_TEMPERATURE !== undefined && process.env.OPENAI_TEMPERATURE !== ''
      ? Number(process.env.OPENAI_TEMPERATURE)
      : undefined,
  openaiEnableWebSearch: process.env.OPENAI_ENABLE_WEB_SEARCH !== 'false',
  searchProvider: (process.env.SEARCH_PROVIDER as AppConfig['searchProvider']) || 'openai',
  searchApiKey: process.env.SEARCH_API_KEY,
  port: Number(process.env.PORT || 3001)
};
