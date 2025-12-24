/*
  # Optimize RLS Performance and Remove Unused Indexes

  ## Changes Made
  
  ### Security Optimization
  - All RLS policies updated to use `(select auth.uid())` instead of `auth.uid()`
  - This prevents re-evaluation of auth functions for each row, improving query performance at scale
  - Fixes 8 RLS policy performance warnings
  
  ### Index Cleanup
  - Dropped unused indexes:
    - `sensor_readings_timestamp_idx` - Not used in query patterns
    - `risk_alerts_created_at_idx` - Not used in query patterns
    - `risk_alerts_resolved_idx` - Not used in query patterns
  - Retained user_id indexes as they are essential for RLS filtering
  
  ## Security Note
  Additional configuration recommendations (set in Supabase Dashboard):
  - Auth Connection Strategy: Switch to percentage-based allocation
  - Password Protection: Enable HaveIBeenPwned leak checking
*/

-- Drop and recreate policies for sensor_readings with optimized syntax
DROP POLICY IF EXISTS "Users can view own sensor readings" ON sensor_readings;
CREATE POLICY "Users can view own sensor readings"
  ON sensor_readings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own sensor readings" ON sensor_readings;
CREATE POLICY "Users can insert own sensor readings"
  ON sensor_readings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own sensor readings" ON sensor_readings;
CREATE POLICY "Users can update own sensor readings"
  ON sensor_readings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = (select auth.uid()))
  WITH CHECK (auth.uid() = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own sensor readings" ON sensor_readings;
CREATE POLICY "Users can delete own sensor readings"
  ON sensor_readings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = (select auth.uid()));

-- Drop and recreate policies for risk_alerts with optimized syntax
DROP POLICY IF EXISTS "Users can view own risk alerts" ON risk_alerts;
CREATE POLICY "Users can view own risk alerts"
  ON risk_alerts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own risk alerts" ON risk_alerts;
CREATE POLICY "Users can insert own risk alerts"
  ON risk_alerts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own risk alerts" ON risk_alerts;
CREATE POLICY "Users can update own risk alerts"
  ON risk_alerts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = (select auth.uid()))
  WITH CHECK (auth.uid() = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own risk alerts" ON risk_alerts;
CREATE POLICY "Users can delete own risk alerts"
  ON risk_alerts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = (select auth.uid()));

-- Drop unused indexes
DROP INDEX IF EXISTS sensor_readings_timestamp_idx;
DROP INDEX IF EXISTS risk_alerts_created_at_idx;
DROP INDEX IF EXISTS risk_alerts_resolved_idx;