import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Loader2, RefreshCcw } from "lucide-react";
import { Incident } from "@/src/data/incidents";
import ReactMarkdown from "react-markdown";

interface AISummaryProps {
  filteredData: Incident[];
  activeFilters: any;
}

export default function AISummary({ filteredData, activeFilters }: AISummaryProps) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filteredData,
          query: `Analyze trends for: ${JSON.stringify(activeFilters)}`
        }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setAnalysis(data.analysis);
    } catch (err) {
      setError("Failed to generate AI analysis. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-panel border border-border overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between bg-accent/5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="label-mono text-accent">AI Safety Review</span>
        </div>
        <button 
          onClick={generateAnalysis}
          disabled={loading}
          className="hover:text-accent transition-colors disabled:opacity-50"
          title="Refresh Analysis"
        >
          <RefreshCcw className={cn("w-4 h-4", loading && "animate-spin")} />
        </button>
      </div>
      
      <div className="flex-1 p-6 relative overflow-y-auto">
        <AnimatePresence mode="wait">
          {!analysis && !loading && !error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center text-center space-y-4"
            >
              <p className="text-gray-500 font-serif italic">
                Ready for AI analysis of current dataset.
              </p>
              <button 
                onClick={generateAnalysis}
                className="bg-accent hover:bg-accent/90 px-6 py-2 rounded-full font-bold uppercase text-[10px] tracking-widest transition-all"
              >
                Launch Analysis
              </button>
            </motion.div>
          )}

          {loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center text-gray-500 font-mono text-[10px]"
            >
              <Loader2 className="w-8 h-8 animate-spin mb-4" />
              <span>SCANNING INCIDENT VECTORS...</span>
            </motion.div>
          )}

          {error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-fatal font-mono text-[11px]"
            >
              {error}
            </motion.div>
          )}

          {analysis && !loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="prose prose-invert prose-sm max-w-none prose-headings:font-serif prose-headings:italic prose-headings:text-accent/80"
            >
              <ReactMarkdown>{analysis}</ReactMarkdown>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

import { cn } from "@/src/lib/utils";
