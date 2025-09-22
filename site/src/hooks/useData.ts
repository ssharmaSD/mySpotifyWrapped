import { useEffect, useMemo, useState } from 'react';
import Papa from 'papaparse';

type Row = Record<string, string>;

export function useCsv(url: string) {
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

export function useSpotifyData() {
  const { rows: allMusic, loading: musicLoading, error: musicError } = useCsv('/mySpotifyWrapped/data/all_music.csv');
  const { rows: clusters, loading: clustersLoading, error: clustersError } = useCsv('/mySpotifyWrapped/data/clustered_sessions.csv');

  const byYear = useMemo(() => {
    const map = new Map<number, number>();
    for (const r of allMusic) {
      const y = Number((r as any)['year']);
      const ms = Number((r as any)['ms_played']);
      if (!Number.isFinite(y) || !Number.isFinite(ms)) continue;
      map.set(y, (map.get(y) ?? 0) + ms);
    }
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
  }, [allMusic]);

  const btsData = useMemo(() => {
    return allMusic.filter((r: any) => 
      r.artist && r.artist.toLowerCase().includes('bts')
    );
  }, [allMusic]);

  const topArtists = useMemo(() => {
    const artistCounts = new Map<string, number>();
    for (const r of allMusic) {
      const artist = (r as any)['artist'];
      if (artist) {
        artistCounts.set(artist, (artistCounts.get(artist) ?? 0) + 1);
      }
    }
    return Array.from(artistCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  }, [allMusic]);

  const topSongs = useMemo(() => {
    const songCounts = new Map<string, number>();
    for (const r of allMusic) {
      const song = (r as any)['track'];
      if (song) {
        songCounts.set(song, (songCounts.get(song) ?? 0) + 1);
      }
    }
    return Array.from(songCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  }, [allMusic]);

  return {
    allMusic,
    clusters,
    byYear,
    btsData,
    topArtists,
    topSongs,
    loading: musicLoading || clustersLoading,
    error: musicError || clustersError,
  };
}
