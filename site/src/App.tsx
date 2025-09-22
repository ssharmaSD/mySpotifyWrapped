import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Overview from './pages/Overview';
import BTSDeepDive from './pages/BTSDeepDive';
import ExtendedHistory from './pages/ExtendedHistory';
import TemporalClusters from './pages/TemporalClusters';
import { useSpotifyData } from './hooks/useData';
import Plot from 'react-plotly.js';
import './App.css';

function HomePage() {
  const { byYear, loading, error } = useSpotifyData();

  if (loading) return <div style={{ padding: 24 }}>Loading…</div>;
  if (error) return <div style={{ padding: 24, color: 'crimson' }}>Error: {error}</div>;

  const years = byYear.map(([y]) => y.toString());
  const hours = byYear.map(([, ms]) => Math.round((ms / 1000 / 3600) * 10) / 10);

  return (
    <div style={{ padding: 24 }}>
      <h1>Welcome to Suhani's Spotify Wrapped</h1>
      <p>Explore my personal Spotify listening story: highlights, deep dives, and temporal patterns.</p>
      
      <div style={{ marginBottom: 32 }}>
        <h2>Quick Overview</h2>
        <p>Here's a snapshot of my listening hours by year to get you started.</p>
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

      <div style={{ backgroundColor: '#f8f9fa', padding: 24, borderRadius: 8 }}>
        <h3>What's Available</h3>
        <p>Use the navigation above to explore different aspects of my listening data:</p>
        <ul>
          <li><strong>Overview</strong>: Quick snapshot of total listening time, top artists and songs</li>
          <li><strong>BTS Deep Dive</strong>: A focused look at my BTS listening — most-played tracks and albums</li>
          <li><strong>Extended History</strong>: Longer-term trends across years and detailed listening patterns</li>
          <li><strong>Temporal Clusters</strong>: Groups of similar "listening sessions" by time and duration</li>
        </ul>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div>
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/bts" element={<BTSDeepDive />} />
          <Route path="/extended" element={<ExtendedHistory />} />
          <Route path="/clusters" element={<TemporalClusters />} />
        </Routes>
      </div>
    </Router>
  );
}
