import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: string;
  color?: string;
  icon?: React.ReactNode;
}

export default function MetricCard({ label, value, trend, color, icon }: MetricCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-panel border border-border p-4 h-full flex flex-col justify-between"
    >
      <div className="flex justify-between items-start">
        <span className="label-mono">{label}</span>
        {icon && <div className="text-gray-500">{icon}</div>}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <h3 className={cn("text-3xl font-bold font-mono tracking-tighter", color)}>
          {value}
        </h3>
        {trend && (
          <span className="text-[10px] text-gray-500 font-mono italic">
            {trend}
          </span>
        )}
      </div>
    </motion.div>
  );
}
