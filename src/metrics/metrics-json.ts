import fs from 'fs';
import path from 'path';

export function getMetricsData() {
  const filePath = path.resolve('logs/search_logs.jsonl');

  if (!fs.existsSync(filePath)) {
    return { total: 0, ctr: 0, ctr1: 0 };
  }

  const lines = fs.readFileSync(filePath, 'utf-8')
    .split('\n')
    .filter(Boolean)
    .map(line => JSON.parse(line));

  const total = lines.length;
  const clicks = lines.filter(l => l.rank !== undefined);
  const ctr = total ? (clicks.length / total) * 100 : 0;
  const ctr1 = total ? (clicks.filter(l => l.rank === 1).length / total) * 100 : 0;

  return {
    total,
    ctr: parseFloat(ctr.toFixed(2)),
    ctr1: parseFloat(ctr1.toFixed(2))
  };
}
