import { Router } from 'express';
import multer from 'multer';
import { parseOrgStructureImage } from '../services/visionService';

const upload = multer({ storage: multer.memoryStorage() });

export const visionRouter = Router();

visionRouter.post('/org-structure', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'image is required' });
      return;
    }
    const result = await parseOrgStructureImage(req.file);
    res.json(result);
  } catch (error) {
    next(error);
  }
});
