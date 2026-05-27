import { Incident } from '@/src/data/incidents';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, MapPin, Plane, Users, Info, ExternalLink } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface IncidentDetailsProps {
  incident: Incident | null;
  onClose: () => void;
}

export default function IncidentDetails({ incident, onClose }: IncidentDetailsProps) {
  return (
    <AnimatePresence>
      {incident && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-panel border-l border-border shadow-2xl z-50 flex flex-col"
          >
            <div className="p-6 border-b border-border flex items-center justify-between">
              <span className="label-mono">Incident Report {incident.id}</span>
              <button 
                onClick={onClose}
                className="hover:rotate-90 transition-transform p-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              <div className="space-y-4">
                <span className={cn(
                  "text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider",
                  incident.severity === 'Fatal' ? "bg-fatal text-white" :
                  incident.severity === 'Non-Fatal' ? "bg-nonfatal text-white" :
                  "bg-incident text-white"
                )}>
                  {incident.severity} Level
                </span>
                <h2 className="text-3xl font-bold tracking-tighter leading-none font-serif italic">
                  {incident.location}
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <span className="label-mono flex items-center gap-2"><Calendar className="w-3 h-3" /> Date</span>
                  <p className="text-sm font-mono">{incident.date}</p>
                </div>
                <div className="space-y-1">
                  <span className="label-mono flex items-center gap-2"><MapPin className="w-3 h-3" /> Area</span>
                  <p className="text-sm">{incident.continent}</p>
                </div>
                <div className="space-y-1">
                  <span className="label-mono flex items-center gap-2"><Users className="w-3 h-3" /> Occupants</span>
                  <p className="text-sm font-mono">{incident.occupants}</p>
                </div>
                <div className="space-y-1">
                  <span className="label-mono flex items-center gap-2"><Info className="w-3 h-3" /> Fatalities</span>
                  <p className={cn("text-sm font-mono font-bold", incident.fatalities > 0 ? "text-fatal" : "text-incident")}>
                    {incident.fatalities}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <span className="label-mono flex items-center gap-2"><Plane className="w-3 h-3" /> Aircraft & Operator</span>
                <div className="bg-bg p-4 border border-border">
                  <p className="font-bold text-accent">{incident.operator}</p>
                  <p className="text-sm text-gray-400">{incident.aircraftType}</p>
                  <div className="mt-2 text-[10px] uppercase font-mono text-gray-500">
                    Phase: {incident.phase}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <span className="label-mono">Mission Summary</span>
                <p className="font-serif text-lg leading-relaxed text-gray-300">
                  {incident.summary}
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-border bg-bg/50 mt-auto">
              <button className="w-full py-4 bg-accent hover:bg-accent/90 transition-colors rounded font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-2">
                Investigate Further <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
