import { useState, useMemo } from 'react';
import { aviationIncidents, Incident } from './data/incidents';
import Sidebar from './components/Sidebar';
import MetricCard from './components/MetricCard';
import IncidentChart from './components/IncidentChart';
import IncidentTable from './components/IncidentTable';
import AISummary from './components/AISummary';
import IncidentDetails from './components/IncidentDetails';
import { Activity, ShieldAlert, Users, TrendingUp, HelpCircle } from 'lucide-react';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    severity: '',
    continent: '',
    aircraft: ''
  });
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const filteredData = useMemo(() => {
    return aviationIncidents.filter(i => {
      const matchesSearch = 
        i.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.operator.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.summary.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSeverity = !filters.severity || i.severity === filters.severity;
      const matchesContinent = !filters.continent || i.continent === filters.continent;
      const matchesAircraft = !filters.aircraft || i.aircraftType.includes(filters.aircraft);

      return matchesSearch && matchesSeverity && matchesContinent && matchesAircraft;
    });
  }, [searchQuery, filters]);

  const stats = useMemo(() => {
    const total = filteredData.length;
    const fatalities = filteredData.reduce((acc, curr) => acc + curr.fatalities, 0);
    const fatalIncidents = filteredData.filter(i => i.severity === 'Fatal').length;
    const survivability = total > 0 ? (((total - fatalIncidents) / total) * 100).toFixed(1) : 0;

    return { total, fatalities, fatalIncidents, survivability };
  }, [filteredData]);

  const availableTypes = Array.from(new Set(aviationIncidents.map(i => i.aircraftType.split(' ')[0]))).sort();
  const availableContinents = Array.from(new Set(aviationIncidents.map(i => i.continent))).sort();

  return (
    <div className="flex min-h-screen bg-bg selection:bg-accent/40 selection:text-white">
      <Sidebar 
        onSearch={setSearchQuery} 
        onFilterChange={setFilters} 
        activeFilters={filters}
        availableTypes={availableTypes}
        availableContinents={availableContinents}
      />

      <main className="flex-1 flex flex-col min-w-0">
        {/* Header Stats */}
        <header className="p-8 pb-4 grid grid-cols-4 gap-6">
          <MetricCard 
            label="Vector Count" 
            value={stats.total} 
            icon={<Activity className="w-4 h-4" />} 
            trend="+12% from prev" 
          />
          <MetricCard 
            label="Cumulative Fatalities" 
            value={stats.fatalities} 
            icon={<Users className="w-4 h-4" />} 
            color="text-fatal"
          />
          <MetricCard 
            label="Fatal Incident Rate" 
            value={`${((stats.fatalIncidents / stats.total) * 100).toFixed(1)}%`} 
            icon={<ShieldAlert className="w-4 h-4" />} 
          />
          <MetricCard 
            label="Mission Survival" 
            value={`${stats.survivability}%`} 
            icon={<TrendingUp className="w-4 h-4" />} 
            color="text-incident"
          />
        </header>

        <div className="flex-1 p-8 grid grid-cols-12 gap-6 overflow-hidden">
          {/* Main Visuals */}
          <div className="col-span-8 space-y-6 flex flex-col min-h-0 overflow-y-auto pr-2">
            <div className="grid grid-cols-3 gap-6 h-64 shrink-0">
              <div className="bg-panel border border-border p-4 flex flex-col">
                <span className="label-mono mb-4 flex items-center justify-between">
                  Severity Distribution <HelpCircle className="w-3 h-3 opacity-30" />
                </span>
                <div className="flex-1">
                  <IncidentChart data={filteredData} type="severity" />
                </div>
              </div>
              <div className="bg-panel border border-border p-4 flex flex-col">
                <span className="label-mono mb-4">Historical Trend</span>
                <div className="flex-1">
                  <IncidentChart data={filteredData} type="trend" />
                </div>
              </div>
              <div className="bg-panel border border-border p-4 flex flex-col">
                <span className="label-mono mb-4">Flight Phase Factors</span>
                <div className="flex-1">
                  <IncidentChart data={filteredData} type="phase" />
                </div>
              </div>
            </div>

            <div className="bg-panel border border-border flex flex-col min-h-[400px]">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="font-serif italic text-xl tracking-tight text-accent/80">Flight Incident Registry</h2>
                <div className="flex gap-4">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-fatal" />
                    <span className="text-[8px] font-mono text-gray-500">FATAL</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-nonfatal" />
                    <span className="text-[8px] font-mono text-gray-500">SURVIVED</span>
                  </div>
                </div>
              </div>
              <IncidentTable 
                incidents={filteredData} 
                onSelect={setSelectedIncident} 
              />
            </div>
          </div>

          {/* AI Columns */}
          <div className="col-span-4 flex flex-col min-h-0">
            <AISummary filteredData={filteredData} activeFilters={filters} />
          </div>
        </div>
      </main>

      <IncidentDetails 
        incident={selectedIncident} 
        onClose={() => setSelectedIncident(null)} 
      />
    </div>
  );
}
