import { useEffect, useMemo, useState } from 'react';
import Papa from 'papaparse';
import Plot from 'react-plotly.js';
import './App.css';

type Row = Record<string, string>;

function useCsv(url: string) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
      .then((text) => {
        const parsed = Papa.parse<Row>(text, { header: true, dynamicTyping: true });
        setRows(parsed.data.filter((d: any) => Object.keys(d).length > 0));
        setLoading(false);
      })
      .catch((e) => {
        setError(String(e));
        setLoading(false);
      });
  }, [url]);

  return { rows, loading, error };
}

export default function App() {
  const { rows, loading, error } = useCsv('./data/all_music.csv');

  const byYear = useMemo(() => {
    const map = new Map<number, number>();
    for (const r of rows) {
      const y = Number((r as any)['year']);
      const ms = Number((r as any)['ms_played']);
      if (!Number.isFinite(y) || !Number.isFinite(ms)) continue;
      map.set(y, (map.get(y) ?? 0) + ms);
    }
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
  }, [rows]);

  if (loading) return <div style={{ padding: 24 }}>Loading…</div>;
  if (error) return <div style={{ padding: 24, color: 'crimson' }}>Error: {error}</div>;
  if (!rows.length) return <div style={{ padding: 24 }}>No data found.</div>;

  const years = byYear.map(([y]) => y.toString());
  const hours = byYear.map(([, ms]) => Math.round((ms / 1000 / 3600) * 10) / 10);

  return (
    <div style={{ padding: 24 }}>
      <h1>Suhani's Spotify Wrapped</h1>
      <p>A lightweight, static site version powered by React + Vite.</p>
      <Plot
        data={[{
          type: 'bar',
          x: years,
          y: hours,
          marker: { color: '#A23B72' },
        }]}
        layout={{
          title: 'Listening Hours by Year',
          xaxis: { title: 'Year' },
          yaxis: { title: 'Hours' },
          margin: { t: 60, r: 20, b: 60, l: 60 },
        }}
        style={{ width: '100%', height: 480 }}
        config={{ displayModeBar: false, responsive: true }}
      />
      <p style={{ marginTop: 16 }}>
        Data source: <code>data/all_music.csv</code>. This site can be extended with more pages
        (BTS Deep Dive, Extended History, Temporal Clusters) using the same CSVs.
      </p>
    </div>
  );
}
