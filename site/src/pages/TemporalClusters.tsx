import { useSpotifyData } from '../hooks/useData';
import Plot from 'react-plotly.js';
import { useMemo } from 'react';

export default function TemporalClusters() {
  const { clusters, loading, error } = useSpotifyData();

  const clusterData = useMemo(() => {
    if (!clusters.length) return null;
    
    const clusterCounts = new Map<number, number>();
    const clusterDurations = new Map<number, number[]>();
    const clusterHours = new Map<number, number[]>();
    const clusterDays = new Map<number, string[]>();

    for (const r of clusters) {
      const cluster = Number((r as any)['cluster']);
      const duration = Number((r as any)['duration_minutes']);
      const hour = Number((r as any)['hour']);
      const day = (r as any)['day_of_week'];

      if (Number.isFinite(cluster)) {
        clusterCounts.set(cluster, (clusterCounts.get(cluster) ?? 0) + 1);
        
        if (Number.isFinite(duration)) {
          if (!clusterDurations.has(cluster)) clusterDurations.set(cluster, []);
          clusterDurations.get(cluster)!.push(duration);
        }
        
        if (Number.isFinite(hour)) {
          if (!clusterHours.has(cluster)) clusterHours.set(cluster, []);
          clusterHours.get(cluster)!.push(hour);
        }
        
        if (day) {
          if (!clusterDays.has(cluster)) clusterDays.set(cluster, []);
          clusterDays.get(cluster)!.push(day);
        }
      }
    }

    return {
      clusterCounts: Array.from(clusterCounts.entries()).sort((a, b) => a[0] - b[0]),
      clusterDurations,
      clusterHours,
      clusterDays,
    };
  }, [clusters]);

  if (loading) return <div style={{ padding: 24 }}>Loading…</div>;
  if (error) return <div style={{ padding: 24, color: 'crimson' }}>Error: {error}</div>;
  if (!clusterData) return <div style={{ padding: 24 }}>No cluster data available. Run the clustering analysis in the notebook first.</div>;

  const { clusterCounts, clusterDurations, clusterHours, clusterDays } = clusterData;

  const clusterLabels = clusterCounts.map(([cluster]) => `Cluster ${cluster}`);
  const clusterSizes = clusterCounts.map(([, count]) => count);

  // Create duration vs hour scatter plot
  const scatterData = clusterCounts.map(([cluster]) => {
    const durations = clusterDurations.get(cluster) || [];
    const hours = clusterHours.get(cluster) || [];
    return {
      x: hours,
      y: durations,
      mode: 'markers',
      type: 'scatter',
      name: `Cluster ${cluster}`,
      marker: { size: 8, opacity: 0.6 },
    };
  });

  // Day distribution by cluster
  const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dayDistribution = clusterCounts.map(([cluster]) => {
    const days = clusterDays.get(cluster) || [];
    const dayCounts = dayOrder.map(day => days.filter(d => d === day).length);
    return {
      x: dayOrder,
      y: dayCounts,
      type: 'bar',
      name: `Cluster ${cluster}`,
      marker: { color: `hsl(${cluster * 60}, 70%, 50%)` },
    };
  });

  return (
    <div style={{ padding: 24 }}>
      <h1>⏱️ Temporal Clusters</h1>
      <p>Groups of similar "listening sessions" by time of day and duration to reveal patterns (e.g., quick evening sessions vs. longer weekend sessions).</p>
      
      <div style={{ marginBottom: 32 }}>
        <h2>Cluster Distribution</h2>
        <p>How many sessions fall into each cluster, showing the balance of different listening patterns.</p>
        <Plot
          data={[{
            type: 'pie',
            labels: clusterLabels,
            values: clusterSizes,
            marker: { colors: clusterLabels.map((_, i) => `hsl(${i * 60}, 70%, 50%)`) },
          }]}
          layout={{
            title: 'Session Distribution by Cluster',
            margin: { t: 60, r: 20, b: 60, l: 60 },
          }}
          style={{ width: '100%', height: 480 }}
          config={{ displayModeBar: false, responsive: true }}
        />
      </div>

      <div style={{ marginBottom: 32 }}>
        <h2>Session Duration vs. Hour of Day</h2>
        <p>This scatter plot shows how session duration relates to the time of day, revealing different listening behaviors.</p>
        <Plot
          data={scatterData}
          layout={{
            title: 'Session Duration vs. Hour of Day by Cluster',
            xaxis: { title: 'Hour of Day (24h format)' },
            yaxis: { title: 'Session Duration (minutes)' },
            margin: { t: 60, r: 20, b: 60, l: 60 },
          }}
          style={{ width: '100%', height: 480 }}
          config={{ displayModeBar: false, responsive: true }}
        />
      </div>

      <div style={{ marginBottom: 32 }}>
        <h2>Day Distribution by Cluster</h2>
        <p>Which days of the week are most common for each cluster type, showing weekly patterns.</p>
        <Plot
          data={dayDistribution}
          layout={{
            title: 'Day of Week Distribution by Cluster',
            xaxis: { title: 'Day of Week' },
            yaxis: { title: 'Number of Sessions' },
            barmode: 'group',
            margin: { t: 60, r: 20, b: 60, l: 60 },
          }}
          style={{ width: '100%', height: 480 }}
          config={{ displayModeBar: false, responsive: true }}
        />
      </div>

      <div style={{ backgroundColor: '#f8f9fa', padding: 16, borderRadius: 8 }}>
        <h3>Cluster Insights</h3>
        {clusterCounts.map(([cluster, count]) => {
          const durations = clusterDurations.get(cluster) || [];
          const avgDuration = durations.length > 0 ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length * 10) / 10 : 0;
          const hours = clusterHours.get(cluster) || [];
          const avgHour = hours.length > 0 ? Math.round(hours.reduce((a, b) => a + b, 0) / hours.length * 10) / 10 : 0;
          
          return (
            <div key={cluster} style={{ marginBottom: 12 }}>
              <h4>Cluster {cluster}</h4>
              <p>Sessions: {count} | Avg Duration: {avgDuration} min | Avg Hour: {avgHour}:00</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
