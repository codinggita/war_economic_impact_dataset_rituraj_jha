import { useEffect, useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import api from '../services/api';
import { DollarSign, TrendingDown, Activity, AlertTriangle } from 'lucide-react';

const AnalyticsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/conflicts/analytics');
        setStats(response.data);
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading analytics...</div>;
  }

  // Helper for compact currency formatting
  const formatCompact = (value) => {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: 1
    }).format(value);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold font-display tracking-tight text-foreground bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent w-max">Analytics Overview</h1>
        <p className="text-muted-foreground text-lg">Aggregated economic impact metrics by region.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-2xl shadow-sm border border-border/50 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 p-4 opacity-10 transform group-hover:scale-110 transition-transform">
            <DollarSign size={64} />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-primary/10 text-primary rounded-lg">
              <DollarSign size={24} />
            </div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Global War Cost</h3>
          </div>
          <div className="text-4xl font-bold text-foreground">
            ${stats ? formatCompact(stats.reduce((acc, curr) => acc + (curr.totalCostOfWar || 0), 0)) : 0}
          </div>
        </div>
        
        <div className="bg-card p-6 rounded-2xl shadow-sm border border-border/50 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 p-4 opacity-10 transform group-hover:scale-110 transition-transform">
            <TrendingDown size={64} />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-destructive/10 text-destructive rounded-lg">
              <TrendingDown size={24} />
            </div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Total GDP Impact</h3>
          </div>
          <div className="text-4xl font-bold text-foreground">
            {stats ? formatCompact(Math.abs(stats.reduce((acc, curr) => acc + (curr.totalGdpLoss || 0), 0))) : 0}% <span className="text-sm font-normal text-muted-foreground ml-1">cumulative loss</span>
          </div>
        </div>

        <div className="bg-card p-6 rounded-2xl shadow-sm border border-border/50 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 p-4 opacity-10 transform group-hover:scale-110 transition-transform">
            <AlertTriangle size={64} />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-lg">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Reconstruction</h3>
          </div>
          <div className="text-4xl font-bold text-foreground">
            ${stats ? formatCompact(stats.reduce((acc, curr) => acc + (curr.totalReconstructionCost || 0), 0)) : 0}
          </div>
        </div>
      </div>

      <div className="h-[450px] bg-card rounded-2xl border border-border/50 p-6 mt-8 shadow-sm">
        <h3 className="text-xl font-bold mb-6 text-foreground">Economic Toll by Region</h3>
        {stats && stats.length > 0 ? (
          <ResponsiveBar
            data={stats}
            keys={['totalCostOfWar']}
            indexBy="region"
            margin={{ top: 20, right: 30, bottom: 60, left: 80 }}
            padding={0.4}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={['#ef4444']} // Use destructive color for impact
            borderRadius={6}
            theme={{
              axis: {
                ticks: { text: { fill: 'var(--muted-foreground)', fontSize: 12, fontFamily: 'inherit' } },
                legend: { text: { fill: 'var(--foreground)', fontSize: 13, fontWeight: 600 } }
              },
              grid: { line: { stroke: 'var(--border)', strokeDasharray: '4 4' } },
              tooltip: {
                container: {
                  background: 'var(--card)',
                  color: 'var(--foreground)',
                  fontSize: 13,
                  borderRadius: 8,
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }
              }
            }}
            axisBottom={{
              tickSize: 0,
              tickPadding: 15,
              tickRotation: 0,
              legend: 'Geographic Region',
              legendPosition: 'middle',
              legendOffset: 45
            }}
            axisLeft={{
              tickSize: 0,
              tickPadding: 10,
              tickRotation: 0,
              legend: 'Total Cost',
              legendPosition: 'middle',
              legendOffset: -65,
              format: v => `$${formatCompact(v)}`
            }}
            label={d => `$${formatCompact(d.value)}`}
            labelSkipWidth={40}
            labelSkipHeight={20}
            labelTextColor="#ffffff"
            animate={true}
            motionConfig="wobbly"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground flex-col gap-4">
            <Activity size={48} className="opacity-20" />
            <p>No conflict data available to visualize.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
