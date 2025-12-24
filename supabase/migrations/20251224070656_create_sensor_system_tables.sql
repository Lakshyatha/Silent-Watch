/*
  # Silent Watch IoT System Database Schema

  ## Overview
  Creates the database structure for the Silent Watch threat prediction system
  that combines IoT sensor data with AI risk analysis.

  ## New Tables
  
  ### `sensor_readings`
  Stores real-time data from IoT sensors (ESP32 + sensors)
  - `id` (uuid, primary key) - Unique identifier for each reading
  - `user_id` (uuid, foreign key) - Links to authenticated user
  - `timestamp` (timestamptz) - When the reading was captured
  - `pir_motion` (boolean) - PIR sensor motion detection
  - `sound_level` (integer) - Sound sensor reading (0-1024)
  - `temperature` (numeric) - DHT11 temperature in Celsius
  - `humidity` (numeric) - DHT11 humidity percentage
  - `gas_level` (integer) - MQ-2 gas/smoke detection (0-1024)
  - `location` (text) - Zone/location identifier
  - `created_at` (timestamptz) - Record creation time

  ### `risk_alerts`
  Stores AI-generated risk predictions based on sensor patterns
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key) - Links to authenticated user
  - `risk_level` (text) - LOW, MEDIUM, HIGH
  - `risk_score` (numeric) - Calculated risk score (0-100)
  - `factors` (jsonb) - Contributing factors (movement, sound, gas, etc.)
  - `alert_message` (text) - Human-readable alert description
  - `resolved` (boolean) - Whether alert has been acknowledged
  - `created_at` (timestamptz) - When alert was generated

  ## Security
  
  ### Row Level Security (RLS)
  - All tables have RLS enabled
  - Users can only access their own sensor readings and alerts
  - Authenticated users required for all operations
  
  ### Policies
  - Separate policies for SELECT, INSERT, UPDATE, DELETE operations
  - All policies verify user ownership via auth.uid()
*/

-- Create sensor_readings table
CREATE TABLE IF NOT EXISTS sensor_readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  timestamp timestamptz DEFAULT now() NOT NULL,
  pir_motion boolean DEFAULT false NOT NULL,
  sound_level integer DEFAULT 0 NOT NULL,
  temperature numeric(5,2) DEFAULT 0 NOT NULL,
  humidity numeric(5,2) DEFAULT 0 NOT NULL,
  gas_level integer DEFAULT 0 NOT NULL,
  location text DEFAULT 'Zone-A' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create risk_alerts table
CREATE TABLE IF NOT EXISTS risk_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  risk_level text DEFAULT 'LOW' NOT NULL CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH')),
  risk_score numeric(5,2) DEFAULT 0 NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  factors jsonb DEFAULT '{}' NOT NULL,
  alert_message text DEFAULT '' NOT NULL,
  resolved boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE sensor_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_alerts ENABLE ROW LEVEL SECURITY;

-- Policies for sensor_readings table
CREATE POLICY "Users can view own sensor readings"
  ON sensor_readings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sensor readings"
  ON sensor_readings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sensor readings"
  ON sensor_readings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own sensor readings"
  ON sensor_readings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for risk_alerts table
CREATE POLICY "Users can view own risk alerts"
  ON risk_alerts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own risk alerts"
  ON risk_alerts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own risk alerts"
  ON risk_alerts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own risk alerts"
  ON risk_alerts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS sensor_readings_user_id_idx ON sensor_readings(user_id);
CREATE INDEX IF NOT EXISTS sensor_readings_timestamp_idx ON sensor_readings(timestamp DESC);
CREATE INDEX IF NOT EXISTS risk_alerts_user_id_idx ON risk_alerts(user_id);
CREATE INDEX IF NOT EXISTS risk_alerts_created_at_idx ON risk_alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS risk_alerts_resolved_idx ON risk_alerts(resolved);