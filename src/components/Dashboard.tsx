import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase, SensorReading, RiskAlert } from '../lib/supabase';
import { SensorCard } from './SensorCard';
import { RiskIndicator } from './RiskIndicator';
import { AlertHistory } from './AlertHistory';
import { Shield, LogOut, Activity } from 'lucide-react';

export function Dashboard() {
  const { user, signOut } = useAuth();
  const [latestReading, setLatestReading] = useState<SensorReading | null>(null);
  const [currentAlert, setCurrentAlert] = useState<RiskAlert | null>(null);
  const [alerts, setAlerts] = useState<RiskAlert[]>([]);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!user) return;

    loadLatestData();

    const sensorInterval = setInterval(loadLatestData, 3000);

    return () => clearInterval(sensorInterval);
  }, [user]);

  const loadLatestData = async () => {
    if (!user) return;

    const { data: readings } = await supabase
      .from('sensor_readings')
      .select('*')
      .eq('user_id', user.id)
      .order('timestamp', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (readings) {
      setLatestReading(readings);
    }

    const { data: alertData } = await supabase
      .from('risk_alerts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (alertData) {
      setAlerts(alertData);
      const unresolved = alertData.find(a => !a.resolved);
      setCurrentAlert(unresolved || alertData[0] || null);
    }
  };

  const startSimulation = async () => {
    if (!user || isActive) return;
    setIsActive(true);

    const simulateData = async () => {
      const pirMotion = Math.random() > 0.7;
      const soundLevel = Math.floor(Math.random() * 1024);
      const temperature = 20 + Math.random() * 15;
      const humidity = 40 + Math.random() * 40;
      const gasLevel = Math.floor(Math.random() * 300);

      const { error } = await supabase
        .from('sensor_readings')
        .insert({
          user_id: user.id,
          pir_motion: pirMotion,
          sound_level: soundLevel,
          temperature,
          humidity,
          gas_level: gasLevel,
          location: 'Zone-A',
        });

      if (!error) {
        let riskScore = 0;
        let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
        const factors: Record<string, number | boolean> = {};

        if (pirMotion) {
          riskScore += 25;
          factors.motion = true;
        }
        if (soundLevel > 700) {
          riskScore += 30;
          factors.sound = soundLevel;
        }
        if (gasLevel > 200) {
          riskScore += 35;
          factors.gas = gasLevel;
        }
        if (temperature > 30) {
          riskScore += 10;
          factors.temperature = temperature;
        }

        if (riskScore >= 60) {
          riskLevel = 'HIGH';
        } else if (riskScore >= 30) {
          riskLevel = 'MEDIUM';
        }

        if (riskScore > 20) {
          const messages = {
            LOW: 'Minor environmental anomaly detected',
            MEDIUM: 'Suspicious activity detected - monitoring closely',
            HIGH: 'Critical threat detected - immediate attention required',
          };

          await supabase.from('risk_alerts').insert({
            user_id: user.id,
            risk_level: riskLevel,
            risk_score: riskScore,
            factors,
            alert_message: messages[riskLevel],
            resolved: false,
          });
        }
      }
    };

    await simulateData();
  };

  const stopSimulation = () => {
    setIsActive(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <nav className="relative z-10 bg-slate-800/50 backdrop-blur-xl border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Silent Watch</h1>
                <p className="text-xs text-slate-400">IoT Threat Detection</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-slate-300">{user?.email}</p>
                <p className="text-xs text-slate-500">System Operator</p>
              </div>
              <button
                onClick={signOut}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Live Monitoring</h2>
            <p className="text-slate-400 text-sm">Real-time sensor data and threat analysis</p>
          </div>
          <div className="flex gap-3">
            {!isActive ? (
              <button
                onClick={startSimulation}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all flex items-center gap-2"
              >
                <Activity className="w-4 h-4" />
                Start Simulation
              </button>
            ) : (
              <button
                onClick={stopSimulation}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white font-medium rounded-lg hover:from-red-600 hover:to-rose-700 transition-all"
              >
                Stop Simulation
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <RiskIndicator alert={currentAlert} />
          </div>
          <div className="lg:col-span-1">
            <SensorCard
              title="System Status"
              value={isActive ? 'ACTIVE' : 'IDLE'}
              icon={Activity}
              color={isActive ? 'green' : 'slate'}
            />
          </div>
        </div>

        {latestReading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <SensorCard
              title="Motion Detection"
              value={latestReading.pir_motion ? 'DETECTED' : 'CLEAR'}
              icon={Activity}
              color={latestReading.pir_motion ? 'red' : 'green'}
            />
            <SensorCard
              title="Sound Level"
              value={`${latestReading.sound_level} dB`}
              icon={Activity}
              color={latestReading.sound_level > 700 ? 'yellow' : 'green'}
            />
            <SensorCard
              title="Temperature"
              value={`${latestReading.temperature.toFixed(1)}°C`}
              icon={Activity}
              color={latestReading.temperature > 30 ? 'red' : 'green'}
            />
            <SensorCard
              title="Gas/Smoke"
              value={latestReading.gas_level > 200 ? 'ALERT' : 'NORMAL'}
              icon={Activity}
              color={latestReading.gas_level > 200 ? 'red' : 'green'}
            />
          </div>
        )}

        <AlertHistory alerts={alerts} />
      </main>
    </div>
  );
}
