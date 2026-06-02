import { Router } from 'express';
import { config } from '../services/config';
import { isOpenAIConfigured } from '../services/openaiService';
export const openaiRouter = Router();
openaiRouter.get('/status', (_req, res) => {
    res.json({
        configured: isOpenAIConfigured(),
        textModel: config.openaiTextModel,
        visionModel: config.openaiVisionModel,
        searchProvider: config.searchProvider
    });
});
