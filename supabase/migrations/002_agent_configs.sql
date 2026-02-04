-- Agent configurations table
CREATE TABLE IF NOT EXISTS centerfisio.agent_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_identifier TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  api_endpoint TEXT NOT NULL,
  default_model TEXT DEFAULT 'gpt-4',
  default_system_prompt TEXT,
  default_temperature DECIMAL(3,2) DEFAULT 0.7,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'error')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agent_configs_status ON centerfisio.agent_configs(status);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION centerfisio.update_agent_configs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS agent_configs_updated_at ON centerfisio.agent_configs;
CREATE TRIGGER agent_configs_updated_at
  BEFORE UPDATE ON centerfisio.agent_configs
  FOR EACH ROW
  EXECUTE FUNCTION centerfisio.update_agent_configs_updated_at();
