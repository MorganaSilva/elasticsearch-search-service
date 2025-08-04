import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import './index.css';

interface Metrics {
  total: number;
  ctr: number;
  ctr1: number;
}

interface ClickLog {
  doc_id: string;
  query_id: string;
  timestamp: string;
  userAgent?: string;
  ip?: string;
}

function App() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [logs, setLogs] = useState<ClickLog[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/metrics/json')
      .then((res) => res.json())
      .then((data) => setMetrics(data))
      .catch(() => setMetrics(null));

    fetch('http://localhost:3000/metrics/logs')
      .then((res) => res.json())
      .then((data) => setLogs(data))
      .catch(() => setLogs([]));
  }, []);

  return (
    <div className="app-container">
      <h1>Métricas da Busca</h1>

      {metrics ? (
        <div className="metrics-grid">
          <div className="metric-card">
            <h2 className="metric-title">Total de buscas</h2>
            <p className="metric-value">{metrics.total}</p>
          </div>
          <div className="metric-card">
            <h2 className="metric-title">CTR Geral</h2>
            <p className="metric-value">{metrics.ctr}%</p>
          </div>
          <div className="metric-card">
            <h2 className="metric-title">CTR@1</h2>
            <p className="metric-value">{metrics.ctr1}%</p>
          </div>
        </div>
      ) : (
        <p>Carregando ou erro ao obter métricas.</p>
      )}

      <h2>Cliques por Hora</h2>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={groupLogsByHour(logs)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="hour" stroke="#9ca3af" />
            <YAxis allowDecimals={false} stroke="#9ca3af" />
            <Tooltip />
            <Line type="monotone" dataKey="clicks" stroke="#818cf8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <h2>Últimos Cliques</h2>
      <table className="logs-table">
        <thead>
          <tr>
            <th>Documento</th>
            <th>ID de Busca</th>
            <th>Data</th>
            <th>IP</th>
          </tr>
        </thead>
        <tbody>
          {logs.slice(-10).reverse().map((log, idx) => (
            <tr key={idx}>
              <td>{log.doc_id}</td>
              <td>{log.query_id}</td>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
              <td>{log.ip}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function groupLogsByHour(logs: ClickLog[]) {
  const countByHour: Record<string, number> = {};
  logs.forEach((log) => {
    const date = new Date(log.timestamp);
    const hour = `${date.getHours()}:00`;
    countByHour[hour] = (countByHour[hour] || 0) + 1;
  });

  return Object.entries(countByHour).map(([hour, clicks]) => ({ hour, clicks }));
}

export default App;