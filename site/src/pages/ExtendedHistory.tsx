import { useSpotifyData } from '../hooks/useData';
import Plot from 'react-plotly.js';
import { useMemo } from 'react';

export default function ExtendedHistory() {
  const { allMusic, loading, error } = useSpotifyData();

  const byMonth = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of allMusic) {
      const year = (r as any)['year'];
      const month = (r as any)['month'];
      const ms = Number((r as any)['ms_played']);
      if (year && month && Number.isFinite(ms)) {
        const key = `${year}-${String(month).padStart(2, '0')}`;
        map.set(key, (map.get(key) ?? 0) + ms);
      }
    }
    return Array.from(map.entries()).sort();
  }, [allMusic]);

  const byHour = useMemo(() => {
    const map = new Map<number, number>();
    for (const r of allMusic) {
      const hour = Number((r as any)['hour']);
      const ms = Number((r as any)['ms_played']);
      if (Number.isFinite(hour) && Number.isFinite(ms)) {
        map.set(hour, (map.get(hour) ?? 0) + ms);
      }
    }
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
  }, [allMusic]);

  const byDayOfWeek = useMemo(() => {
    const map = new Map<string, number>();
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    for (const r of allMusic) {
      const day = (r as any)['day_of_week'];
      const ms = Number((r as any)['ms_played']);
      if (day && Number.isFinite(ms)) {
        map.set(day, (map.get(day) ?? 0) + ms);
      }
    }
    return dayOrder.map(day => [day, map.get(day) || 0] as [string, number]);
  }, [allMusic]);

  if (loading) return <div style={{ padding: 24 }}>Loading…</div>;
  if (error) return <div style={{ padding: 24, color: 'crimson' }}>Error: {error}</div>;

  const months = byMonth.map(([month]) => month);
  const monthHours = byMonth.map(([, ms]) => Math.round((ms / 1000 / 3600) * 10) / 10);

  const hours = byHour.map(([hour]) => hour);
  const hourHours = byHour.map(([, ms]) => Math.round((ms / 1000 / 3600) * 10) / 10);

  const days = byDayOfWeek.map(([day]) => day);
  const dayHours = byDayOfWeek.map(([, ms]) => Math.round((ms / 1000 / 3600) * 10) / 10);

  return (
    <div style={{ padding: 24 }}>
      <h1>📈 Extended History</h1>
      <p>Longer-term trends across years and detailed patterns of when I listen to music.</p>
      
      <div style={{ marginBottom: 32 }}>
        <h2>Listening Hours by Month</h2>
        <p>This timeline shows my listening patterns month by month, revealing seasonal trends and life changes.</p>
        <Plot
          data={[{
            type: 'scatter',
            x: months,
            y: monthHours,
            mode: 'lines+markers',
            line: { color: '#A23B72', width: 3 },
            marker: { color: '#A23B72', size: 6 },
          }]}
          layout={{
            title: 'Listening Hours by Month',
            xaxis: { title: 'Month' },
            yaxis: { title: 'Hours' },
            margin: { t: 60, r: 20, b: 60, l: 60 },
          }}
          style={{ width: '100%', height: 480 }}
          config={{ displayModeBar: false, responsive: true }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 32 }}>
        <div>
          <h2>Listening by Hour of Day</h2>
          <p>When do I listen to music most? This shows my daily listening patterns.</p>
          <Plot
            data={[{
              type: 'bar',
              x: hours,
              y: hourHours,
              marker: { color: '#A23B72' },
            }]}
            layout={{
              title: 'Listening Hours by Hour of Day',
              xaxis: { title: 'Hour (24h format)' },
              yaxis: { title: 'Hours' },
              margin: { t: 60, r: 20, b: 60, l: 60 },
            }}
            style={{ width: '100%', height: 400 }}
            config={{ displayModeBar: false, responsive: true }}
          />
        </div>

        <div>
          <h2>Listening by Day of Week</h2>
          <p>Which days do I listen to music most? This reveals my weekly patterns.</p>
          <Plot
            data={[{
              type: 'bar',
              x: days,
              y: dayHours,
              marker: { color: '#A23B72' },
            }]}
            layout={{
              title: 'Listening Hours by Day of Week',
              xaxis: { title: 'Day' },
              yaxis: { title: 'Hours' },
              margin: { t: 60, r: 20, b: 60, l: 60 },
            }}
            style={{ width: '100%', height: 400 }}
            config={{ displayModeBar: false, responsive: true }}
          />
        </div>
      </div>

      <div style={{ backgroundColor: '#f8f9fa', padding: 16, borderRadius: 8 }}>
        <h3>Listening Insights</h3>
        <p>Peak listening hour: <strong>{hours[hourHours.indexOf(Math.max(...hourHours))]}:00</strong></p>
        <p>Most active day: <strong>{days[dayHours.indexOf(Math.max(...dayHours))]}</strong></p>
        <p>Total listening time: <strong>{Math.round(allMusic.reduce((sum, r) => sum + Number((r as any)['ms_played'] || 0), 0) / 1000 / 3600 * 10) / 10} hours</strong></p>
        <p>Data span: <strong>{months[0]} to {months[months.length - 1]}</strong></p>
      </div>
    </div>
  );
}
