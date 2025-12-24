import { LucideIcon } from 'lucide-react';

interface SensorCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: 'red' | 'yellow' | 'green' | 'slate';
}

export function SensorCard({ title, value, icon: Icon, color }: SensorCardProps) {
  const colorConfig = {
    red: {
      bg: 'from-red-500 to-rose-600',
      border: 'border-red-500/50',
      glow: 'shadow-red-500/20',
    },
    yellow: {
      bg: 'from-yellow-500 to-orange-600',
      border: 'border-yellow-500/50',
      glow: 'shadow-yellow-500/20',
    },
    green: {
      bg: 'from-green-500 to-emerald-600',
      border: 'border-green-500/50',
      glow: 'shadow-green-500/20',
    },
    slate: {
      bg: 'from-slate-600 to-slate-700',
      border: 'border-slate-500/50',
      glow: 'shadow-slate-500/20',
    },
  };

  const config = colorConfig[color];

  return (
    <div className={`bg-slate-800/50 backdrop-blur-xl rounded-xl border ${config.border} shadow-xl ${config.glow} overflow-hidden transition-all hover:scale-105`}>
      <div className={`bg-gradient-to-r ${config.bg} p-4`}>
        <div className="flex items-center justify-between">
          <div className="bg-white/20 p-2 rounded-lg">
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium text-slate-400 mb-2">{title}</h3>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}
