import { RiskAlert } from '../lib/supabase';
import { AlertTriangle, CheckCircle, AlertOctagon } from 'lucide-react';

interface RiskIndicatorProps {
  alert: RiskAlert | null;
}

export function RiskIndicator({ alert }: RiskIndicatorProps) {
  const getRiskConfig = () => {
    if (!alert) {
      return {
        level: 'NO DATA',
        color: 'slate',
        icon: CheckCircle,
        bgGradient: 'from-slate-600 to-slate-700',
        borderColor: 'border-slate-500',
        textColor: 'text-slate-300',
        message: 'Waiting for sensor data...',
      };
    }

    switch (alert.risk_level) {
      case 'HIGH':
        return {
          level: 'HIGH RISK',
          color: 'red',
          icon: AlertOctagon,
          bgGradient: 'from-red-600 to-rose-700',
          borderColor: 'border-red-500',
          textColor: 'text-red-100',
          message: alert.alert_message,
        };
      case 'MEDIUM':
        return {
          level: 'MEDIUM RISK',
          color: 'yellow',
          icon: AlertTriangle,
          bgGradient: 'from-yellow-500 to-orange-600',
          borderColor: 'border-yellow-500',
          textColor: 'text-yellow-50',
          message: alert.alert_message,
        };
      case 'LOW':
        return {
          level: 'LOW RISK',
          color: 'green',
          icon: CheckCircle,
          bgGradient: 'from-green-500 to-emerald-600',
          borderColor: 'border-green-500',
          textColor: 'text-green-50',
          message: alert.alert_message,
        };
    }
  };

  const config = getRiskConfig();
  const Icon = config.icon;

  return (
    <div className={`bg-slate-800/50 backdrop-blur-xl rounded-xl border ${config.borderColor} shadow-2xl overflow-hidden`}>
      <div className={`bg-gradient-to-r ${config.bgGradient} p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">{config.level}</h3>
              <p className={`${config.textColor} text-sm`}>Current Threat Assessment</p>
            </div>
          </div>
          {alert && (
            <div className="text-right">
              <div className="text-4xl font-bold text-white mb-1">{alert.risk_score.toFixed(0)}</div>
              <div className="text-white/80 text-xs">Risk Score</div>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        <p className="text-slate-300 mb-4">{config.message}</p>

        {alert && Object.keys(alert.factors).length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-slate-400 mb-3">Contributing Factors</h4>
            <div className="space-y-2">
              {alert.factors.motion && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-slate-300">Unauthorized motion detected</span>
                </div>
              )}
              {alert.factors.sound && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-slate-300">Abnormal sound level: {alert.factors.sound} dB</span>
                </div>
              )}
              {alert.factors.gas && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-slate-300">Gas/smoke detected: {alert.factors.gas} ppm</span>
                </div>
              )}
              {alert.factors.temperature && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-slate-300">High temperature: {typeof alert.factors.temperature === 'number' ? alert.factors.temperature.toFixed(1) : alert.factors.temperature}°C</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
