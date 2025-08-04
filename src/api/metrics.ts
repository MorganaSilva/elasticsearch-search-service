import { Router } from 'express';
import { promises as fs } from 'fs';
import path from 'path';

export const metricsRouter = Router();

metricsRouter.get('/json', async (_, res) => {
  const { getMetricsData } = await import('../metrics/metrics-json');
  res.json(getMetricsData());
});

metricsRouter.get('/logs', async (_, res) => {
  const file = path.resolve(__dirname, '../../logs/search_logs.jsonl');
  try {
    const data = await fs.readFile(file, 'utf-8');
    const lines = data.split('\n').filter(Boolean).map((l) => JSON.parse(l));
    res.json(lines);
  } catch {
    res.json([]);
  }
});
