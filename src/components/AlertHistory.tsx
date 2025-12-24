import { RiskAlert } from '../lib/supabase';
import { Clock, AlertTriangle } from 'lucide-react';

interface AlertHistoryProps {
  alerts: RiskAlert[];
}

export function AlertHistory({ alerts }: AlertHistoryProps) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRiskBadge = (level: string) => {
    const colors = {
      HIGH: 'bg-red-500/20 text-red-400 border-red-500/50',
      MEDIUM: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      LOW: 'bg-green-500/20 text-green-400 border-green-500/50',
    };
    return colors[level as keyof typeof colors] || colors.LOW;
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 shadow-xl overflow-hidden">
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">Alert History</h3>
        </div>
      </div>

      <div className="divide-y divide-slate-700/50">
        {alerts.length === 0 ? (
          <div className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500">No alerts recorded yet</p>
            <p className="text-slate-600 text-sm mt-1">Start the simulation to begin monitoring</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className="p-4 hover:bg-slate-700/30 transition">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRiskBadge(alert.risk_level)}`}>
                      {alert.risk_level}
                    </span>
                    <span className="text-sm text-slate-400">{formatTime(alert.created_at)}</span>
                  </div>
                  <p className="text-slate-300 text-sm">{alert.alert_message}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-white">{alert.risk_score.toFixed(0)}</div>
                  <div className="text-xs text-slate-500">score</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
