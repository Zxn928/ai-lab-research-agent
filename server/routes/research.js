import { Router } from 'express';
import { researchCompany } from '../services/searchService';
export const researchRouter = Router();
researchRouter.post('/company', async (req, res, next) => {
    try {
        const { companyName, industry } = req.body;
        if (!companyName) {
            res.status(400).json({ error: 'companyName is required' });
            return;
        }
        const result = await researchCompany({ companyName, industry });
        res.json(result);
    }
    catch (error) {
        next(error);
    }
});
