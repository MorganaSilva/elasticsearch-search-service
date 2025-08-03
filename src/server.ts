import express from 'express';
import { searchRouter } from './api/search';
import { analyticsRouter } from './api/analytics';
import { suggestRouter } from './api/suggest';//extra
import { client } from './config/elastic';
import 'dotenv/config';


const app = express();

app.use(express.json());
app.use('/suggest', suggestRouter); //extra

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

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
});