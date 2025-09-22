import { useSpotifyData } from '../hooks/useData';
import Plot from 'react-plotly.js';

export default function Overview() {
  const { byYear, topArtists, topSongs, loading, error } = useSpotifyData();

  if (loading) return <div style={{ padding: 24 }}>Loading…</div>;
  if (error) return <div style={{ padding: 24, color: 'crimson' }}>Error: {error}</div>;

  const years = byYear.map(([y]) => y.toString());
  const hours = byYear.map(([, ms]) => Math.round((ms / 1000 / 3600) * 10) / 10);

  return (
    <div style={{ padding: 24 }}>
      <h1>🧭 Overview</h1>
      <p>Quick snapshot of total listening time, top artists and songs, and how my listening has changed by year.</p>
      
      <div style={{ marginBottom: 32 }}>
        <h2>Listening Hours by Year</h2>
        <p>This chart shows how my total listening time has changed over the years, giving insight into my music consumption patterns.</p>
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
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 32 }}>
        <div>
          <h2>Top Artists</h2>
          <p>My most-played artists based on total track plays.</p>
          <Plot
            data={[{
              type: 'bar',
              x: topArtists.map(([, count]) => count),
              y: topArtists.map(([artist]) => artist),
              orientation: 'h',
              marker: { color: '#A23B72' },
            }]}
            layout={{
              title: 'Top 10 Artists',
              xaxis: { title: 'Plays' },
              yaxis: { title: 'Artist' },
              margin: { t: 60, r: 20, b: 60, l: 120 },
            }}
            style={{ width: '100%', height: 400 }}
            config={{ displayModeBar: false, responsive: true }}
          />
        </div>

        <div>
          <h2>Top Songs</h2>
          <p>My most-played individual tracks.</p>
          <Plot
            data={[{
              type: 'bar',
              x: topSongs.map(([, count]) => count),
              y: topSongs.map(([song]) => song.length > 30 ? song.substring(0, 30) + '...' : song),
              orientation: 'h',
              marker: { color: '#A23B72' },
            }]}
            layout={{
              title: 'Top 10 Songs',
              xaxis: { title: 'Plays' },
              yaxis: { title: 'Song' },
              margin: { t: 60, r: 20, b: 60, l: 120 },
            }}
            style={{ width: '100%', height: 400 }}
            config={{ displayModeBar: false, responsive: true }}
          />
        </div>
      </div>
    </div>
  );
}
