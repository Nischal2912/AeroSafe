import { Search, Filter, X } from 'lucide-react';
import { Incident } from '@/src/data/incidents';

interface SidebarProps {
  onSearch: (q: string) => void;
  onFilterChange: (filters: any) => void;
  activeFilters: any;
  availableTypes: string[];
  availableContinents: string[];
}

export default function Sidebar({ onSearch, onFilterChange, activeFilters, availableTypes, availableContinents }: SidebarProps) {
  return (
    <div className="w-80 border-r border-border h-screen sticky top-0 flex flex-col bg-panel/30">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-accent rounded-sm flex items-center justify-center font-bold font-mono">AS</div>
          <div>
            <h1 className="font-bold tracking-tighter leading-tight">AeroSafe</h1>
            <p className="label-mono text-[8px]">Intelligence Dashboard</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search location, operator..."
            className="w-full bg-panel border border-border py-2 pl-10 pr-4 text-xs font-mono focus:outline-none focus:border-accent transition-colors"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="label-mono">Severity Level</span>
            <Filter className="w-3 h-3 text-gray-600" />
          </div>
          <div className="space-x-1 flex">
            {['Fatal', 'Non-Fatal', 'Incident'].map(s => (
              <button
                key={s}
                onClick={() => onFilterChange({ ...activeFilters, severity: activeFilters.severity === s ? '' : s })}
                className={cn(
                  "px-2 py-1 text-[9px] font-bold border transition-all uppercase tracking-tighter",
                  activeFilters.severity === s 
                    ? "bg-accent border-accent text-white" 
                    : "border-border text-gray-500 hover:border-gray-400"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <span className="label-mono">Region</span>
          <div className="flex flex-wrap gap-1">
            {availableContinents.map(c => (
              <button
                key={c}
                onClick={() => onFilterChange({ ...activeFilters, continent: activeFilters.continent === c ? '' : c })}
                className={cn(
                  "px-2 py-1 text-[9px] border transition-all uppercase font-mono",
                  activeFilters.continent === c 
                    ? "bg-white text-black border-white" 
                    : "border-border text-gray-500 hover:border-gray-400"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <span className="label-mono">Aircraft Type</span>
          <select 
            className="w-full bg-panel border border-border p-2 text-[10px] font-mono focus:outline-none"
            value={activeFilters.aircraft}
            onChange={(e) => onFilterChange({ ...activeFilters, aircraft: e.target.value })}
          >
            <option value="">ALL SYSTEMS</option>
            {availableTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </section>
      </div>

      <div className="p-6 border-t border-border bg-panel/50">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-incident rounded-full animate-pulse" />
          <span className="label-mono text-[9px]">Live Data System Active</span>
        </div>
      </div>
    </div>
  );
}

import { cn } from '@/src/lib/utils';
