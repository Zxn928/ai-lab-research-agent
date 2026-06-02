import { Router } from 'express';
import { config } from '../services/config';
import { isOpenAIConfigured } from '../services/openaiService';

export const openaiRouter = Router();

openaiRouter.get('/status', (_req, res) => {
  res.json({
    configured: isOpenAIConfigured(),
    providerName: config.openaiProviderName,
    baseUrlConfigured: Boolean(config.openaiBaseUrl),
    textModel: config.openaiTextModel,
    visionModel: config.openaiVisionModel,
    webSearchEnabled: config.openaiEnableWebSearch,
    searchProvider: config.searchProvider
  });
});
