import { useSpotifyData } from '../hooks/useData';
import Plot from 'react-plotly.js';

export default function Overview() {
  const { byYear, topArtists, topSongs, loading, error } = useSpotifyData();

  if (loading) return <div className="loading">Loading your musical overview...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  const years = byYear.map(([y]) => y.toString());
  const hours = byYear.map(([, ms]) => Math.round((ms / 1000 / 3600) * 10) / 10);
  const totalHours = hours.reduce((sum, h) => sum + h, 0);

  return (
    <div>
      <div className="section">
        <h1>🧭 Overview</h1>
        <p style={{ textAlign: 'center', fontSize: '1.1rem' }}>
          A comprehensive snapshot of my musical journey, revealing the artists, songs, and patterns that define my listening experience.
        </p>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{totalHours.toLocaleString()}</div>
            <div className="stat-label">Total Hours</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{topArtists.length}</div>
            <div className="stat-label">Unique Artists</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{topSongs.length}</div>
            <div className="stat-label">Unique Songs</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{Math.round(totalHours / years.length)}</div>
            <div className="stat-label">Avg Hours/Year</div>
          </div>
        </div>
      </div>
      
      <div className="section">
        <h2>My Musical Timeline</h2>
        <p>
          This chart reveals the evolution of my listening habits over time. Each bar represents a year of musical discovery, 
          showing how my engagement with music has fluctuated through different life phases. The peaks often correspond to 
          periods of intense musical exploration or emotional significance.
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
          Can you spot the year when music became more important in my life? The data tells a story of growing 
          appreciation and deeper connection with the art form.
        </p>
      </div>

      <div className="section">
        <h2>Musical Taste Profile</h2>
        <p>
          These charts reveal the core of my musical identity. The artists and songs that appear here represent 
          not just what I listen to most, but what resonates with me on a deeper level. They're the soundtrack 
          to my daily life, my comfort zone, and my source of inspiration.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginTop: '24px' }}>
          <div className="chart-container">
            <h3>My Musical Companions</h3>
            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '16px' }}>
              These are the artists who have been with me through thick and thin, whose music I return to time and again.
            </p>
            <Plot
              data={[{
                type: 'bar',
                x: topArtists.map(([, count]) => count),
                y: topArtists.map(([artist]) => artist),
                orientation: 'h',
                marker: { 
                  color: '#A23B72',
                  line: { color: '#8a2c5a', width: 1 }
                },
              }]}
              layout={{
                title: 'Top 10 Artists',
                xaxis: { title: 'Total Plays' },
                yaxis: { title: 'Artist' },
                margin: { t: 40, r: 20, b: 60, l: 120 },
                plot_bgcolor: 'rgba(0,0,0,0)',
                paper_bgcolor: 'rgba(0,0,0,0)',
              }}
              style={{ width: '100%', height: 400 }}
              config={{ displayModeBar: false, responsive: true }}
            />
          </div>

          <div className="chart-container">
            <h3>My Anthems</h3>
            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '16px' }}>
              These songs have become part of my personal soundtrack, played so often they feel like old friends.
            </p>
            <Plot
              data={[{
                type: 'bar',
                x: topSongs.map(([, count]) => count),
                y: topSongs.map(([song]) => song.length > 30 ? song.substring(0, 30) + '...' : song),
                orientation: 'h',
                marker: { 
                  color: '#A23B72',
                  line: { color: '#8a2c5a', width: 1 }
                },
              }]}
              layout={{
                title: 'Top 10 Songs',
                xaxis: { title: 'Total Plays' },
                yaxis: { title: 'Song' },
                margin: { t: 40, r: 20, b: 60, l: 120 },
                plot_bgcolor: 'rgba(0,0,0,0)',
                paper_bgcolor: 'rgba(0,0,0,0)',
              }}
              style={{ width: '100%', height: 400 }}
              config={{ displayModeBar: false, responsive: true }}
            />
          </div>
        </div>
        
        <div className="insights-box">
          <h3>🎵 Key Insights</h3>
          <p>
            <strong>Musical Loyalty:</strong> The top artists show a pattern of deep engagement rather than casual listening. 
            When I find an artist I love, I really dive into their discography.
          </p>
          <p>
            <strong>Song Obsession:</strong> The top songs reveal my tendency to play favorites on repeat, suggesting 
            that certain tracks become emotional anchors in my life.
          </p>
          <p>
            <strong>Diverse Taste:</strong> The variety in both artists and songs shows an openness to different genres 
            and styles, though with clear preferences for certain sounds.
          </p>
        </div>
      </div>
    </div>
  );
}
