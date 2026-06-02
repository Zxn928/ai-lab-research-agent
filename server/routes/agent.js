import { Router } from 'express';
import { runAgent } from '../services/agentService';
export const agentRouter = Router();
agentRouter.post('/run', async (req, res, next) => {
    try {
        const { agentName, input } = req.body;
        if (!agentName) {
            res.status(400).json({ error: 'agentName is required' });
            return;
        }
        const result = await runAgent(agentName, input);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
});
