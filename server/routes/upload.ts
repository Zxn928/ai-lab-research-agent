import { Router } from 'express';
import multer from 'multer';
import { parseCsvPreview, parseCsvRecords } from '../services/csvService';
import { parseExcelPreview, parseExcelRecords } from '../services/excelService';

const upload = multer({ storage: multer.memoryStorage() });

export const uploadRouter = Router();

uploadRouter.post('/questionnaire/preview', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'file is required' });
      return;
    }
    const sheetName = req.body.sheetName as string | undefined;
    const preview = isExcel(req.file.originalname)
      ? await parseExcelPreview(req.file.buffer, sheetName)
      : parseCsvPreview(req.file.buffer);
    res.json(preview);
  } catch (error) {
    next(error);
  }
});

uploadRouter.post('/questionnaire/parse', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'file is required' });
      return;
    }
    const fieldMap = JSON.parse(req.body.fieldMap || '{}');
    const sheetName = req.body.sheetName as string | undefined;
    const records = isExcel(req.file.originalname)
      ? await parseExcelRecords(req.file.buffer, fieldMap, sheetName)
      : parseCsvRecords(req.file.buffer, fieldMap);
    res.json({ records });
  } catch (error) {
    next(error);
  }
});

function isExcel(fileName: string) {
  return /\.(xlsx|xls)$/i.test(fileName);
}
