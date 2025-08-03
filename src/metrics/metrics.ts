import fs from 'fs';

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
console.log(`CTR@1: ${ctr1.toFixed(2)}%`);
