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

  if (loading) return <div className="loading">Loading your musical journey...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  const years = byYear.map(([y]) => y.toString());
  const hours = byYear.map(([, ms]) => Math.round((ms / 1000 / 3600) * 10) / 10);
  const totalHours = hours.reduce((sum, h) => sum + h, 0);

  return (
    <div>
      <div className="section">
        <h1>Welcome to Suhani's Spotify Wrapped</h1>
        <p style={{ textAlign: 'center', fontSize: '1.2rem', marginBottom: '2rem' }}>
          Explore my personal Spotify listening story: highlights, deep dives, and temporal patterns that reveal the soundtrack of my life.
        </p>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{totalHours.toLocaleString()}</div>
            <div className="stat-label">Total Hours</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{years.length}</div>
            <div className="stat-label">Years of Data</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{Math.round(totalHours / years.length)}</div>
            <div className="stat-label">Avg Hours/Year</div>
          </div>
        </div>
      </div>
      
      <div className="section">
        <h2>My Musical Journey Through Time</h2>
        <p>
          This chart shows how my total listening time has evolved over the years. Each bar represents the total hours 
          I spent listening to music in that year, giving insight into how my music consumption patterns have changed 
          throughout different phases of my life.
        </p>
        <div className="chart-container">
          <Plot
            data={[{
              type: 'bar',
              x: years,
              y: hours,
              marker: { 
                color: '#A23B72',
                line: { color: '#8a2c5a', width: 1 }
              },
            }]}
            layout={{
              title: 'Listening Hours by Year',
              xaxis: { 
                title: 'Year',
                tickmode: 'linear',
                tick0: 2018,
                dtick: 1
              },
              yaxis: { title: 'Hours' },
              margin: { t: 60, r: 20, b: 60, l: 60 },
              plot_bgcolor: 'rgba(0,0,0,0)',
              paper_bgcolor: 'rgba(0,0,0,0)',
            }}
            style={{ width: '100%', height: 480 }}
            config={{ displayModeBar: false, responsive: true }}
          />
        </div>
        <p style={{ fontStyle: 'italic', color: '#666' }}>
          Notice any interesting patterns? The peaks and valleys tell a story about different periods in my life 
          and how music has been a constant companion through it all.
        </p>
      </div>

      <div className="insights-box">
        <h3>🎵 What You Can Explore</h3>
        <p>Use the navigation above to dive deeper into different aspects of my listening data:</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginTop: '20px' }}>
          <div>
            <h4>🧭 Overview</h4>
            <p>Quick snapshot of total listening time, top artists and songs that define my musical taste.</p>
          </div>
          <div>
            <h4>🎧 BTS Deep Dive</h4>
            <p>A focused look at my BTS listening — most-played tracks and albums that show my fandom journey.</p>
          </div>
          <div>
            <h4>📈 Extended History</h4>
            <p>Longer-term trends across years and detailed patterns of when and how I listen to music.</p>
          </div>
          <div>
            <h4>⏱️ Temporal Clusters</h4>
            <p>Groups of similar "listening sessions" by time and duration revealing my listening behaviors.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div>
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/bts" element={<BTSDeepDive />} />
            <Route path="/extended" element={<ExtendedHistory />} />
            <Route path="/clusters" element={<TemporalClusters />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
