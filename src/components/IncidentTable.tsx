import { Incident } from '@/src/data/incidents';
import { cn } from '@/src/lib/utils';
import { AlertCircle, ArrowUpRight, Plane } from 'lucide-react';
import { motion } from 'motion/react';

interface IncidentTableProps {
  incidents: Incident[];
  onSelect: (incident: Incident) => void;
}

export default function IncidentTable({ incidents, onSelect }: IncidentTableProps) {
  return (
    <div className="overflow-hidden">
      <div className="grid grid-cols-[100px_1fr_120px_100px] gap-4 px-4 py-2 bg-panel/50 border-y border-border">
        <span className="label-mono">Date</span>
        <span className="label-mono">Location & Description</span>
        <span className="label-mono">Operator</span>
        <span className="label-mono">Severity</span>
      </div>
      <div className="max-h-[600px] overflow-y-auto">
        {incidents.length === 0 ? (
          <div className="p-12 text-center text-gray-600 font-serif italic">
            No incident records match the current filters.
          </div>
        ) : (
          incidents.map((incident, idx) => (
            <motion.div
              key={incident.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => onSelect(incident)}
              className="data-grid-item px-4 grid grid-cols-[100px_1fr_120px_100px] gap-4 items-center group"
            >
              <div className="font-mono text-xs text-gray-400">
                {incident.date}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm tracking-tight group-hover:text-accent transition-colors">
                    {incident.location}
                  </span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all text-accent" />
                </div>
                <p className="text-[11px] text-gray-500 line-clamp-1 italic font-serif">
                  {incident.summary}
                </p>
              </div>
              <div className="text-[11px] text-gray-400 truncate">
                {incident.operator}
              </div>
              <div>
                <span className={cn(
                  "text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter",
                  incident.severity === 'Fatal' ? "bg-fatal/10 text-fatal border border-fatal/30" :
                  incident.severity === 'Non-Fatal' ? "bg-nonfatal/10 text-nonfatal border border-nonfatal/30" :
                  "bg-incident/10 text-incident border border-incident/30"
                )}>
                  {incident.severity}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
