import { useEffect, useState } from 'react';
import api from '../services/api';
import { ResponsiveRadar } from '@nivo/radar';

const ComparePage = () => {
  const [conflicts, setConflicts] = useState([]);
  const [conflict1, setConflict1] = useState('');
  const [conflict2, setConflict2] = useState('');
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchConflicts = async () => {
      try {
        const response = await api.get('/conflicts');
        setConflicts(response.data);
      } catch (err) {
        console.error('Failed to fetch conflicts', err);
      }
    };
    fetchConflicts();
  }, []);

  useEffect(() => {
    if (conflict1 && conflict2) {
      const c1 = conflicts.find(c => c._id === conflict1);
      const c2 = conflicts.find(c => c._id === conflict2);

      if (c1 && c2) {
        setData([
          {
            metric: "GDP Loss %",
            [c1.name]: c1.gdpLoss || 0,
            [c2.name]: c2.gdpLoss || 0,
          },
          {
            metric: "Inflation %",
            [c1.name]: c1.inflation ? Math.min(c1.inflation, 100) : 0, // Cap at 100 for radar scale
            [c2.name]: c2.inflation ? Math.min(c2.inflation, 100) : 0,
          },
          {
            metric: "Poverty %",
            [c1.name]: c1.poverty || 0,
            [c2.name]: c2.poverty || 0,
          },
          {
            metric: "Unemployment %",
            [c1.name]: c1.unemployment || 0,
            [c2.name]: c2.unemployment || 0,
          },
          {
            metric: "Food Insecurity %",
            [c1.name]: c1.foodInsecurity || 0,
            [c2.name]: c2.foodInsecurity || 0,
          }
        ]);
      }
    }
  }, [conflict1, conflict2, conflicts]);

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold font-display tracking-tight text-foreground">Compare Conflicts</h1>
        <p className="text-muted-foreground">Select two conflicts to compare their economic impact metrics.</p>
      </div>

      <div className="flex gap-4">
        <select 
          className="flex-1 p-3 rounded-md bg-card text-foreground border border-border focus:ring-2 focus:ring-primary outline-none"
          value={conflict1}
          onChange={(e) => setConflict1(e.target.value)}
        >
          <option value="">Select First Conflict</option>
          {conflicts.map(c => (
            <option key={`1-${c._id}`} value={c._id} disabled={c._id === conflict2}>{c.name}</option>
          ))}
        </select>
        <select 
          className="flex-1 p-3 rounded-md bg-card text-foreground border border-border focus:ring-2 focus:ring-primary outline-none"
          value={conflict2}
          onChange={(e) => setConflict2(e.target.value)}
        >
          <option value="">Select Second Conflict</option>
          {conflicts.map(c => (
            <option key={`2-${c._id}`} value={c._id} disabled={c._id === conflict1}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="flex-1 bg-card rounded-xl border border-border p-6 mt-4 min-h-[500px]">
        {data ? (
          <ResponsiveRadar
            data={data}
            keys={[
              conflicts.find(c => c._id === conflict1)?.name,
              conflicts.find(c => c._id === conflict2)?.name
            ]}
            indexBy="metric"
            maxValue="auto"
            margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
            curve="linearClosed"
            borderWidth={2}
            borderColor={{ from: 'color' }}
            gridLevels={5}
            gridShape="circular"
            gridLabelOffset={36}
            enableDots={true}
            dotSize={10}
            dotColor={{ theme: 'background' }}
            dotBorderWidth={2}
            dotBorderColor={{ from: 'color' }}
            enableDotLabel={true}
            dotLabel="value"
            dotLabelYOffset={-12}
            colors={{ scheme: 'nivo' }}
            fillOpacity={0.25}
            blendMode="multiply"
            animate={true}
            motionConfig="wobbly"
            theme={{
              axis: { ticks: { text: { fill: 'var(--foreground)', fontSize: 12 } } },
              grid: { line: { stroke: 'var(--border)' } },
              dots: { text: { fill: 'var(--foreground)' } }
            }}
            legends={[
              {
                anchor: 'top-left',
                direction: 'column',
                translateX: -50,
                translateY: -40,
                itemWidth: 80,
                itemHeight: 20,
                itemTextColor: 'var(--foreground)',
                symbolSize: 12,
                symbolShape: 'circle',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemTextColor: 'var(--primary)'
                    }
                  }
                ]
              }
            ]}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Please select two conflicts to see the comparison radar chart.
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparePage;
