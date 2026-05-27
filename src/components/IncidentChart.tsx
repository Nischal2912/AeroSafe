import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { Incident } from '@/src/data/incidents';

interface IncidentChartProps {
  data: Incident[];
  type: 'severity' | 'trend' | 'phase';
}

export default function IncidentChart({ data, type }: IncidentChartProps) {
  if (type === 'severity') {
    const severityData = [
      { name: 'Fatal', value: data.filter(i => i.severity === 'Fatal').length, color: '#ef4444' },
      { name: 'Non-Fatal', value: data.filter(i => i.severity === 'Non-Fatal').length, color: '#f59e0b' },
      { name: 'Incident', value: data.filter(i => i.severity === 'Incident').length, color: '#10b981' },
    ].filter(d => d.value > 0);

    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={severityData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={60}
            paddingAngle={5}
            dataKey="value"
          >
            {severityData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', fontSize: '10px', fontFamily: 'monospace' }}
            itemStyle={{ color: '#fff' }}
          />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'trend') {
    // Group by year
    const yearCounts = data.reduce((acc: any, curr) => {
      const year = curr.date.substring(0, 4);
      acc[year] = (acc[year] || 0) + 1;
      return acc;
    }, {});

    const trendData = Object.keys(yearCounts).sort().map(year => ({
      year,
      count: yearCounts[year]
    }));

    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={trendData}>
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
          <XAxis 
            dataKey="year" 
            stroke="#666" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
          />
          <YAxis 
            stroke="#666" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', fontSize: '10px', fontFamily: 'monospace' }}
          />
          <Area type="monotone" dataKey="count" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCount)" />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'phase') {
    const phaseCounts = data.reduce((acc: any, curr) => {
      acc[curr.phase] = (acc[curr.phase] || 0) + 1;
      return acc;
    }, {});

    const phaseData = Object.keys(phaseCounts).map(phase => ({
      name: phase,
      value: phaseCounts[phase]
    })).sort((a, b) => b.value - a.value);

    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={phaseData} layout="vertical">
          <XAxis type="number" hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            stroke="#666" 
            fontSize={9} 
            width={80}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', fontSize: '10px', fontFamily: 'monospace' }}
          />
          <Bar dataKey="value" fill="#3b82f6" radius={[0, 2, 2, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return null;
}
