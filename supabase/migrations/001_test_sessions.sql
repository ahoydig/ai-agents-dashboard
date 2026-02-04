-- Test sessions table for playground
CREATE TABLE IF NOT EXISTS centerfisio.test_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  scenario TEXT CHECK (scenario IN ('happy_path', 'edge_case', 'expected_error', 'regression')),
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  agent_identifier TEXT NOT NULL,
  config JSONB NOT NULL,
  timeline JSONB NOT NULL DEFAULT '[]',
  github_issue_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_test_sessions_agent ON centerfisio.test_sessions(agent_identifier);
CREATE INDEX IF NOT EXISTS idx_test_sessions_scenario ON centerfisio.test_sessions(scenario);
CREATE INDEX IF NOT EXISTS idx_test_sessions_created ON centerfisio.test_sessions(created_at DESC);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION centerfisio.update_test_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS test_sessions_updated_at ON centerfisio.test_sessions;
CREATE TRIGGER test_sessions_updated_at
  BEFORE UPDATE ON centerfisio.test_sessions
  FOR EACH ROW
  EXECUTE FUNCTION centerfisio.update_test_sessions_updated_at();
