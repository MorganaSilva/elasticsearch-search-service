/*import fs from 'fs';

const logs = fs.readFileSync('logs/search_logs.jsonl', 'utf-8')
  .split('\n')
  .filter(Boolean)
  .map(line => JSON.parse(line));

const total = logs.length;
const clicks = logs.filter(l => l.rank !== undefined);
const ctr = (clicks.length / total) * 100;
const ctr1 = (clicks.filter(l => l.rank === 1).length / total) * 100;

console.log(`Total de buscas: ${total}`);
console.log(`CTR Geral: ${ctr.toFixed(2)}%`);
console.log(`CTR@1: ${ctr1.toFixed(2)}%`);*/

import { getMetricsData } from './metrics-json';
import express from 'express';
import fs from 'fs';
import path from 'path';

function printMetrics() {
  try {
    const metrics = getMetricsData();
    
    console.log('\nMétricas da Busca');
    console.log('---------------------');
    console.log(`Total de buscas: ${metrics.total}`);
    console.log(`CTR Geral: ${metrics.ctr.toFixed(2)}%`);
    console.log(`CTR@1: ${metrics.ctr1.toFixed(2)}%`);
    console.log('---------------------');
    
    return metrics;
  } catch (error) {
    console.error('Erro ao gerar métricas:', error);
    return null;
  }
}

const metricsRouter = express.Router();

metricsRouter.get('/metrics', (req, res) => {
  try {
    const metrics = printMetrics();
    res.json({
      success: true,
      data: metrics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao processar métricas'
    });
  }
});

metricsRouter.get('/metrics/logs', (req, res) => {
  try {
    const logPath = path.join(__dirname, '../../logs/search_logs.jsonl');
    const logs = fs.readFileSync(logPath, 'utf-8')
      .split('\n')
      .filter(line => line.trim())
      .map(line => JSON.parse(line));
    
    res.json({
      success: true,
      count: logs.length,
      logs: logs.slice(-100)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao ler logs'
    });
  }
});

export default metricsRouter;

export { printMetrics };