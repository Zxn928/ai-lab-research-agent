import { Router } from 'express';
import { asDownloadMarkdown } from '../services/markdownExportService';

export const exportRouter = Router();

exportRouter.post('/markdown', (req, res) => {
  const { title = 'export', markdown = '' } = req.body;
  res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${encodeURIComponent(title)}.md"`
  );
  res.send(asDownloadMarkdown(title, markdown));
});
