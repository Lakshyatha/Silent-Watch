import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SensorReading {
  id: string;
  user_id: string;
  timestamp: string;
  pir_motion: boolean;
  sound_level: number;
  temperature: number;
  humidity: number;
  gas_level: number;
  location: string;
  created_at: string;
}

export interface RiskAlert {
  id: string;
  user_id: string;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  risk_score: number;
  factors: {
    motion?: boolean;
    sound?: number;
    gas?: number;
    temperature?: number;
  };
  alert_message: string;
  resolved: boolean;
  created_at: string;
}
