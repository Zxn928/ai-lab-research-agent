import { Router } from 'express';
import { researchCompany } from '../services/searchService';
export const searchRouter = Router();
searchRouter.post('/company', async (req, res, next) => {
    try {
        const { companyName, industry } = req.body;
        if (!companyName) {
            res.status(400).json({ error: 'companyName is required' });
            return;
        }
        res.json(await researchCompany({ companyName, industry }));
    }
    catch (error) {
        next(error);
    }
});
