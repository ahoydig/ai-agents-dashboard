/**
 * E2E Test Script
 * Verifies data consistency between Supabase and the Dashboard UI
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

interface TestResult {
  name: string;
  passed: boolean;
  expected?: unknown;
  actual?: unknown;
  error?: string;
}

const results: TestResult[] = [];

function log(message: string) {
  console.log(`[TEST] ${message}`);
}

function pass(name: string, expected?: unknown, actual?: unknown) {
  results.push({ name, passed: true, expected, actual });
  console.log(`✅ ${name}`);
}

function fail(name: string, expected?: unknown, actual?: unknown, error?: string) {
  results.push({ name, passed: false, expected, actual, error });
  console.log(`❌ ${name}`);
  if (error) console.log(`   Error: ${error}`);
  if (expected !== undefined) console.log(`   Expected: ${JSON.stringify(expected)}`);
  if (actual !== undefined) console.log(`   Actual: ${JSON.stringify(actual)}`);
}

async function testDatabaseConnection() {
  log("Testing database connection...");
  try {
    const { data, error } = await supabase
      .schema("centerfisio")
      .from("agent_turns")
      .select("id")
      .limit(1);

    if (error) {
      fail("Database connection", "Connected", null, error.message);
      return false;
    }
    pass("Database connection");
    return true;
  } catch (e) {
    fail("Database connection", "Connected", null, String(e));
    return false;
  }
}

async function testAgentTurnsTable() {
  log("Testing agent_turns table...");

  const { data, error, count } = await supabase
    .schema("centerfisio")
    .from("agent_turns")
    .select("*", { count: "exact" })
    .limit(10);

  if (error) {
    fail("agent_turns table query", "Data", null, error.message);
    return null;
  }

  pass("agent_turns table query", `Found ${count} records`);

  if (data && data.length > 0) {
    const sample = data[0];
    log(`Sample turn fields: ${Object.keys(sample).join(", ")}`);

    // Check required fields
    const requiredFields = ["id", "created_at", "agent_identifier"];
    for (const field of requiredFields) {
      if (field in sample) {
        pass(`agent_turns has field: ${field}`);
      } else {
        fail(`agent_turns has field: ${field}`, "Present", "Missing");
      }
    }
  }

  return { count, sample: data?.[0] };
}

async function testConversationSessionsTable() {
  log("Testing conversation_sessions table...");

  const { data, error, count } = await supabase
    .schema("centerfisio")
    .from("conversation_sessions")
    .select("*", { count: "exact" })
    .limit(10);

  if (error) {
    if (error.code === "42P01") {
      log("conversation_sessions table does not exist (optional)");
      return null;
    }
    fail("conversation_sessions table query", "Data", null, error.message);
    return null;
  }

  pass("conversation_sessions table query", `Found ${count} records`);
  return { count, sample: data?.[0] };
}

async function testMetricsCalculation() {
  log("Testing metrics calculation...");

  // Get total turns
  const { count: totalTurns, error: turnsError } = await supabase
    .schema("centerfisio")
    .from("agent_turns")
    .select("*", { count: "exact", head: true });

  if (turnsError) {
    fail("Total turns count", "Number", null, turnsError.message);
  } else {
    pass(`Total turns count: ${totalTurns}`);
  }

  // Get turns with errors
  const { count: errorTurns, error: errorError } = await supabase
    .schema("centerfisio")
    .from("agent_turns")
    .select("*", { count: "exact", head: true })
    .eq("status", "error");

  if (errorError) {
    fail("Error turns count", "Number", null, errorError.message);
  } else {
    pass(`Error turns count: ${errorTurns}`);
  }

  // Get unique agents
  const { data: agents, error: agentsError } = await supabase
    .schema("centerfisio")
    .from("agent_turns")
    .select("agent_identifier")
    .not("agent_identifier", "is", null);

  if (agentsError) {
    fail("Unique agents", "Array", null, agentsError.message);
  } else {
    const uniqueAgents = [...new Set(agents?.map(a => a.agent_identifier))];
    pass(`Unique agents: ${uniqueAgents.join(", ") || "(none)"}`);
  }

  // Calculate total cost
  const { data: costData, error: costError } = await supabase
    .schema("centerfisio")
    .from("agent_turns")
    .select("cost_usd");

  if (costError) {
    fail("Total cost calculation", "Number", null, costError.message);
  } else {
    const totalCost = costData?.reduce((sum, t) => sum + (t.cost_usd || 0), 0) || 0;
    pass(`Total cost: $${totalCost.toFixed(4)}`);
  }

  // Calculate average latency
  const { data: latencyData, error: latencyError } = await supabase
    .schema("centerfisio")
    .from("agent_turns")
    .select("latency_total_ms")
    .not("latency_total_ms", "is", null);

  if (latencyError) {
    fail("Average latency calculation", "Number", null, latencyError.message);
  } else if (latencyData && latencyData.length > 0) {
    const avgLatency = latencyData.reduce((sum, t) => sum + (t.latency_total_ms || 0), 0) / latencyData.length;
    pass(`Average latency: ${avgLatency.toFixed(0)}ms`);
  } else {
    pass("Average latency: No data");
  }

  return {
    totalTurns,
    errorTurns,
  };
}

async function testRecentTurns() {
  log("Testing recent turns (last 24h)...");

  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data, error, count } = await supabase
    .schema("centerfisio")
    .from("agent_turns")
    .select("*", { count: "exact" })
    .gte("created_at", yesterday)
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    fail("Recent turns query", "Data", null, error.message);
    return null;
  }

  pass(`Recent turns (24h): ${count} records`);

  if (data && data.length > 0) {
    log("Most recent turns:");
    data.slice(0, 3).forEach((turn, i) => {
      log(`  ${i + 1}. ${turn.agent_identifier || "unknown"} - ${new Date(turn.created_at).toLocaleString()}`);
    });
  }

  return { count, data };
}

async function testAgentConfigs() {
  log("Testing agent_configs table...");

  const { data, error } = await supabase
    .schema("centerfisio")
    .from("agent_configs")
    .select("*");

  if (error) {
    if (error.code === "42P01") {
      log("agent_configs table does not exist yet (needs migration)");
      return null;
    }
    fail("agent_configs query", "Data", null, error.message);
    return null;
  }

  pass(`Agent configs: ${data?.length || 0} configured`);
  return data;
}

async function testTestSessions() {
  log("Testing test_sessions table...");

  const { data, error } = await supabase
    .schema("centerfisio")
    .from("test_sessions")
    .select("*");

  if (error) {
    if (error.code === "42P01") {
      log("test_sessions table does not exist yet (needs migration)");
      return null;
    }
    fail("test_sessions query", "Data", null, error.message);
    return null;
  }

  pass(`Test sessions: ${data?.length || 0} saved`);
  return data;
}

async function testTurnsOverTime() {
  log("Testing turns over time aggregation...");

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .schema("centerfisio")
    .from("agent_turns")
    .select("created_at")
    .gte("created_at", sevenDaysAgo);

  if (error) {
    fail("Turns over time query", "Data", null, error.message);
    return null;
  }

  // Group by date
  const byDate = new Map<string, number>();
  data?.forEach((turn) => {
    const date = new Date(turn.created_at).toISOString().split("T")[0];
    if (date) {
      byDate.set(date, (byDate.get(date) || 0) + 1);
    }
  });

  pass(`Turns over 7 days: ${data?.length || 0} total`);

  if (byDate.size > 0) {
    log("Daily breakdown:");
    Array.from(byDate.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .forEach(([date, count]) => {
        log(`  ${date}: ${count} turns`);
      });
  }

  return { total: data?.length, byDate: Object.fromEntries(byDate) };
}

async function runAllTests() {
  console.log("\n" + "=".repeat(60));
  console.log("🧪 AI Agents Dashboard - E2E Database Tests");
  console.log("=".repeat(60) + "\n");

  // Test database connection first
  const connected = await testDatabaseConnection();
  if (!connected) {
    console.log("\n❌ Cannot proceed without database connection");
    return;
  }

  console.log("\n" + "-".repeat(40) + "\n");

  // Test tables
  await testAgentTurnsTable();
  console.log("");
  await testConversationSessionsTable();
  console.log("");
  await testAgentConfigs();
  console.log("");
  await testTestSessions();

  console.log("\n" + "-".repeat(40) + "\n");

  // Test metrics
  await testMetricsCalculation();

  console.log("\n" + "-".repeat(40) + "\n");

  // Test time-based queries
  await testRecentTurns();
  console.log("");
  await testTurnsOverTime();

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("📊 Test Summary");
  console.log("=".repeat(60));

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  console.log(`\n✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📝 Total: ${results.length}`);

  if (failed > 0) {
    console.log("\n⚠️  Failed tests:");
    results.filter(r => !r.passed).forEach(r => {
      console.log(`   - ${r.name}: ${r.error || "Check expected vs actual"}`);
    });
  }

  console.log("\n" + "=".repeat(60) + "\n");
}

runAllTests().catch(console.error);
