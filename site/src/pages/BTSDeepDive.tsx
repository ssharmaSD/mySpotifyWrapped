import { useSpotifyData } from '../hooks/useData';
import Plot from 'react-plotly.js';
import { useMemo } from 'react';

export default function BTSDeepDive() {
  const { btsData, loading, error } = useSpotifyData();

  const btsSongs = useMemo(() => {
    const songCounts = new Map<string, number>();
    for (const r of btsData) {
      const song = (r as any)['track'];
      if (song) {
        songCounts.set(song, (songCounts.get(song) ?? 0) + 1);
      }
    }
    return Array.from(songCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15);
  }, [btsData]);

  const btsAlbums = useMemo(() => {
    const albumCounts = new Map<string, number>();
    for (const r of btsData) {
      const album = (r as any)['album'];
      if (album) {
        albumCounts.set(album, (albumCounts.get(album) ?? 0) + 1);
      }
    }
    return Array.from(albumCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  }, [btsData]);

  const btsByYear = useMemo(() => {
    const map = new Map<number, number>();
    for (const r of btsData) {
      const y = Number((r as any)['year']);
      const ms = Number((r as any)['ms_played']);
      if (!Number.isFinite(y) || !Number.isFinite(ms)) continue;
      map.set(y, (map.get(y) ?? 0) + ms);
    }
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
  }, [btsData]);

  if (loading) return <div style={{ padding: 24 }}>Loading…</div>;
  if (error) return <div style={{ padding: 24, color: 'crimson' }}>Error: {error}</div>;

  const years = btsByYear.map(([y]) => y.toString());
  const hours = btsByYear.map(([, ms]) => Math.round((ms / 1000 / 3600) * 10) / 10);

  return (
    <div style={{ padding: 24 }}>
      <h1>🎧 BTS Deep Dive</h1>
      <p>A focused look at my BTS listening — most-played tracks and albums, plus how my BTS listening has evolved over time.</p>
      
      <div style={{ marginBottom: 32 }}>
        <h2>BTS Listening Hours by Year</h2>
        <p>This shows how much time I've spent listening to BTS each year, revealing my fandom journey.</p>
        <Plot
          data={[{
            type: 'bar',
            x: years,
            y: hours,
            marker: { color: '#A23B72' },
          }]}
          layout={{
            title: 'BTS Listening Hours by Year',
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
          <h2>Top BTS Songs</h2>
          <p>My most-played BTS tracks, showing which songs I keep coming back to.</p>
          <Plot
            data={[{
              type: 'bar',
              x: btsSongs.map(([, count]) => count),
              y: btsSongs.map(([song]) => song.length > 25 ? song.substring(0, 25) + '...' : song),
              orientation: 'h',
              marker: { color: '#A23B72' },
            }]}
            layout={{
              title: 'Top 15 BTS Songs',
              xaxis: { title: 'Plays' },
              yaxis: { title: 'Song' },
              margin: { t: 60, r: 20, b: 60, l: 150 },
            }}
            style={{ width: '100%', height: 500 }}
            config={{ displayModeBar: false, responsive: true }}
          />
        </div>

        <div>
          <h2>Top BTS Albums</h2>
          <p>My most-played BTS albums, showing which eras I've listened to most.</p>
          <Plot
            data={[{
              type: 'bar',
              x: btsAlbums.map(([, count]) => count),
              y: btsAlbums.map(([album]) => album.length > 20 ? album.substring(0, 20) + '...' : album),
              orientation: 'h',
              marker: { color: '#A23B72' },
            }]}
            layout={{
              title: 'Top 10 BTS Albums',
              xaxis: { title: 'Plays' },
              yaxis: { title: 'Album' },
              margin: { t: 60, r: 20, b: 60, l: 150 },
            }}
            style={{ width: '100%', height: 500 }}
            config={{ displayModeBar: false, responsive: true }}
          />
        </div>
      </div>

      <div style={{ backgroundColor: '#f8f9fa', padding: 16, borderRadius: 8 }}>
        <h3>BTS Listening Stats</h3>
        <p>Total BTS plays: <strong>{btsData.length.toLocaleString()}</strong></p>
        <p>Total BTS listening time: <strong>{Math.round(btsData.reduce((sum, r) => sum + Number((r as any)['ms_played'] || 0), 0) / 1000 / 3600 * 10) / 10} hours</strong></p>
        <p>Unique BTS songs: <strong>{btsSongs.length}</strong></p>
        <p>Unique BTS albums: <strong>{btsAlbums.length}</strong></p>
      </div>
    </div>
  );
}
