import cors from 'cors';
import express from 'express';
import { agentRouter } from './routes/agent';
import { exportRouter } from './routes/export';
import { openaiRouter } from './routes/openai';
import { researchRouter } from './routes/research';
import { searchRouter } from './routes/search';
import { uploadRouter } from './routes/upload';
import { visionRouter } from './routes/vision';
import { config } from './services/config';

const app = express();

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use('/api/research', researchRouter);
app.use('/api/search', searchRouter);
app.use('/api', uploadRouter);
app.use('/api/vision', visionRouter);
app.use('/api/agent', agentRouter);
app.use('/api/export', exportRouter);
app.use('/api/openai', openaiRouter);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const message = error instanceof Error ? error.message : 'Unknown error';
  res.status(500).json({ error: message });
});

app.listen(config.port, () => {
  console.log(`AI Lab Research Agent server listening on http://localhost:${config.port}`);
});
