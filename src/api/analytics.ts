import express from 'express';
import fs from 'fs';
import path from 'path';

export const analyticsRouter = express.Router();

const LOG_FILE = path.join(__dirname, '../../logs/search_logs.jsonl');

analyticsRouter.post('/click', (req, res) => {
  const { query_id, doc_id, rank } = req.body;

  if (!query_id || !doc_id || rank === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const log = {
    query_id,
    doc_id,
    rank,
    timestamp: new Date().toISOString(),
    userAgent: req.headers['user-agent'],
    ip: req.ip
  };

  fs.appendFileSync(LOG_FILE, JSON.stringify(log) + '\n');
  res.sendStatus(200);
});
