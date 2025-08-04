import express from 'express';
import { searchRouter } from './api/search';
import { analyticsRouter } from './api/analytics';
import { suggestRouter } from './api/suggest';//extra
import { client } from './config/elastic';
import { getMetricsData } from './metrics/metrics-json'; //extra dash
import { metricsRouter } from './api/metrics';
import 'dotenv/config';
import cors from 'cors';


const app = express();

app.use(express.json());
app.use(cors());

//integração (middleware) para verificar conexão com elasticsearch
app.use(async (req, res, next) => {
  try {
    await client.ping();
    next();
  } catch (err) {
    res.status(503).json({ error: 'Service Unavailable - Elasticsearch não conectado' });
  }
});

app.use('/search', searchRouter);
app.use('/analytics', analyticsRouter);
app.use('/suggest', suggestRouter); //extra

app.use('/metrics', metricsRouter);
/*app.get('/metrics/json', (req, res) => {
  const metrics = getMetricsData();
  res.json(metrics);
});*/
app.get('/api/v1/metrics/json', (req, res) => {
  const metrics = getMetricsData();
  res.json({
    ...metrics,
    _metadata: {
      generatedAt: new Date().toISOString(),
      version: 'v1'
    }
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado' });
});

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
});