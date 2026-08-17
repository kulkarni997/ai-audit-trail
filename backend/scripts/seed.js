// scripts/seed.js
//
// Wipes and repopulates the graph with realistic sample data for the
// AI Agent Audit Trail use case.
//
// Run with: npm run seed   (from the backend/ directory)

const { runQuery, verifyConnection, closeDriver } = require('../db');

// ---------------------------------------------------------------------------
// Seed data (kept small and realistic — well within CognoDB's free c0 tier)
// ---------------------------------------------------------------------------

const users = [
  { id: 'u1', name: 'Priya Nair', role: 'Compliance Officer', department: 'Governance' },
  { id: 'u2', name: 'Rahul Mehta', role: 'Engineering Manager', department: 'Engineering' },
  { id: 'u3', name: 'Ananya Rao', role: 'Support Lead', department: 'Customer Support' },
  { id: 'u4', name: 'David Chen', role: 'Finance Analyst', department: 'Finance' },
  { id: 'u5', name: 'Fatima Sheikh', role: 'HR Manager', department: 'Human Resources' },
];

const agents = [
  { id: 'a1', name: 'Email Responder Agent', type: 'email-responder', status: 'active' },
  { id: 'a2', name: 'Ticket Triage Agent', type: 'support-triage', status: 'active' },
  { id: 'a3', name: 'Invoice Approval Agent', type: 'finance-approval', status: 'active' },
  { id: 'a4', name: 'Candidate Screening Agent', type: 'hr-screening', status: 'active' },
  { id: 'a5', name: 'Data Sync Agent', type: 'data-pipeline', status: 'active' },
  { id: 'a6', name: 'Refund Processing Agent', type: 'finance-approval', status: 'deauthorized' },
  { id: 'a7', name: 'Contract Review Agent', type: 'document-analysis', status: 'active' },
  { id: 'a8', name: 'Employee Onboarding Agent', type: 'hr-workflow', status: 'active' },
  { id: 'a9', name: 'Fraud Flag Agent', type: 'finance-monitoring', status: 'active' },
  { id: 'a10', name: 'Report Generator Agent', type: 'analytics', status: 'active' },
];

const dataResources = [
  { id: 'd1', name: 'Customer_Emails_Inbox', sensitivity: 'internal', type: 'document' },
  { id: 'd2', name: 'Support_Ticket_Queue', sensitivity: 'internal', type: 'record' },
  { id: 'd3', name: 'Q3_Invoice_Batch', sensitivity: 'confidential', type: 'record' },
  { id: 'd4', name: 'Candidate_Resume_DB', sensitivity: 'confidential', type: 'database' },
  { id: 'd5', name: 'Customer_Payment_Records', sensitivity: 'confidential', type: 'database' },
  { id: 'd6', name: 'Refund_Ledger', sensitivity: 'confidential', type: 'record' },
  { id: 'd7', name: 'Vendor_Contracts', sensitivity: 'confidential', type: 'document' },
  { id: 'd8', name: 'Employee_Records_DB', sensitivity: 'confidential', type: 'database' },
  { id: 'd9', name: 'Transaction_Logs', sensitivity: 'confidential', type: 'database' },
  { id: 'd10', name: 'Quarterly_Analytics_Report', sensitivity: 'internal', type: 'document' },
  { id: 'd11', name: 'Public_FAQ_Content', sensitivity: 'public', type: 'document' },
  { id: 'd12', name: 'Employee_Salary_Data', sensitivity: 'confidential', type: 'record' },
  { id: 'd13', name: 'Support_Chat_Transcripts', sensitivity: 'internal', type: 'document' },
  { id: 'd14', name: 'Vendor_Payment_Bank_Details', sensitivity: 'confidential', type: 'record' },
  { id: 'd15', name: 'Marketing_Campaign_Data', sensitivity: 'internal', type: 'record' },
];

const policies = [
  { id: 'p1', name: 'PII Access Control', rule: 'Agents must not access PII without explicit authorization scope', severity: 'high' },
  { id: 'p2', name: 'Financial Approval Threshold', rule: 'Transactions over $10,000 require human co-signature', severity: 'high' },
  { id: 'p3', name: 'Data Retention Compliance', rule: 'Agents must not access records past their retention window', severity: 'medium' },
  { id: 'p4', name: 'Cross-Department Access', rule: 'Agents may only access data within their assigned department scope', severity: 'medium' },
  { id: 'p5', name: 'Deauthorized Agent Lockout', rule: 'Deauthorized agents must not execute any further actions', severity: 'high' },
  { id: 'p6', name: 'Salary Data Restriction', rule: 'Only HR-scoped agents may access salary data', severity: 'high' },
  { id: 'p7', name: 'Bank Detail Handling', rule: 'Bank account details may only be read, never written, by automated agents', severity: 'high' },
  { id: 'p8', name: 'Audit Log Completeness', rule: 'Every agent action must produce a corresponding audit log entry', severity: 'low' },
];

// Each action: which agent executed it, which data it accessed, which policy
// it was checked against, and whether it violated that policy.
// Timestamps are spread across the last 5 days for realistic filtering.
const actions = [
  { id: 'ac1', agentId: 'a1', dataId: 'd1', policyId: 'p8', type: 'READ', status: 'success', violated: false, daysAgo: 0, hour: 9 },
  { id: 'ac2', agentId: 'a1', dataId: 'd11', policyId: 'p8', type: 'WRITE', status: 'success', violated: false, daysAgo: 0, hour: 9 },
  { id: 'ac3', agentId: 'a2', dataId: 'd2', policyId: 'p4', type: 'READ', status: 'success', violated: false, daysAgo: 0, hour: 10 },
  { id: 'ac4', agentId: 'a2', dataId: 'd13', policyId: 'p4', type: 'READ', status: 'success', violated: false, daysAgo: 1, hour: 11 },
  { id: 'ac5', agentId: 'a3', dataId: 'd3', policyId: 'p2', type: 'APPROVE', status: 'flagged', violated: true, daysAgo: 1, hour: 14 },
  { id: 'ac6', agentId: 'a3', dataId: 'd5', policyId: 'p1', type: 'READ', status: 'success', violated: false, daysAgo: 1, hour: 14 },
  { id: 'ac7', agentId: 'a4', dataId: 'd4', policyId: 'p1', type: 'READ', status: 'success', violated: false, daysAgo: 2, hour: 8 },
  { id: 'ac8', agentId: 'a5', dataId: 'd9', policyId: 'p3', type: 'WRITE', status: 'success', violated: false, daysAgo: 2, hour: 9 },
  { id: 'ac9', agentId: 'a5', dataId: 'd5', policyId: 'p1', type: 'READ', status: 'success', violated: false, daysAgo: 2, hour: 9 },
  { id: 'ac10', agentId: 'a6', dataId: 'd6', policyId: 'p5', type: 'APPROVE', status: 'flagged', violated: true, daysAgo: 3, hour: 15 },
  { id: 'ac11', agentId: 'a6', dataId: 'd5', policyId: 'p5', type: 'READ', status: 'flagged', violated: true, daysAgo: 3, hour: 15 },
  { id: 'ac12', agentId: 'a7', dataId: 'd7', policyId: 'p4', type: 'READ', status: 'success', violated: false, daysAgo: 3, hour: 10 },
  { id: 'ac13', agentId: 'a7', dataId: 'd7', policyId: 'p8', type: 'WRITE', status: 'success', violated: false, daysAgo: 3, hour: 10 },
  { id: 'ac14', agentId: 'a8', dataId: 'd8', policyId: 'p6', type: 'WRITE', status: 'success', violated: false, daysAgo: 4, hour: 9 },
  { id: 'ac15', agentId: 'a8', dataId: 'd12', policyId: 'p6', type: 'READ', status: 'flagged', violated: true, daysAgo: 4, hour: 9 },
  { id: 'ac16', agentId: 'a9', dataId: 'd9', policyId: 'p3', type: 'READ', status: 'success', violated: false, daysAgo: 0, hour: 12 },
  { id: 'ac17', agentId: 'a9', dataId: 'd5', policyId: 'p1', type: 'READ', status: 'success', violated: false, daysAgo: 0, hour: 12 },
  { id: 'ac18', agentId: 'a9', dataId: 'd6', policyId: 'p1', type: 'READ', status: 'success', violated: false, daysAgo: 0, hour: 13 },
  { id: 'ac19', agentId: 'a10', dataId: 'd10', policyId: 'p8', type: 'WRITE', status: 'success', violated: false, daysAgo: 1, hour: 16 },
  { id: 'ac20', agentId: 'a10', dataId: 'd9', policyId: 'p3', type: 'READ', status: 'success', violated: false, daysAgo: 1, hour: 16 },
  { id: 'ac21', agentId: 'a3', dataId: 'd14', policyId: 'p7', type: 'WRITE', status: 'flagged', violated: true, daysAgo: 2, hour: 15 },
  { id: 'ac22', agentId: 'a1', dataId: 'd1', policyId: 'p8', type: 'READ', status: 'success', violated: false, daysAgo: 2, hour: 9 },
  { id: 'ac23', agentId: 'a2', dataId: 'd2', policyId: 'p4', type: 'WRITE', status: 'success', violated: false, daysAgo: 3, hour: 11 },
  { id: 'ac24', agentId: 'a4', dataId: 'd4', policyId: 'p1', type: 'WRITE', status: 'success', violated: false, daysAgo: 3, hour: 8 },
  { id: 'ac25', agentId: 'a5', dataId: 'd15', policyId: 'p4', type: 'READ', status: 'success', violated: false, daysAgo: 4, hour: 10 },
  { id: 'ac26', agentId: 'a7', dataId: 'd7', policyId: 'p4', type: 'READ', status: 'success', violated: false, daysAgo: 4, hour: 11 },
  { id: 'ac27', agentId: 'a9', dataId: 'd14', policyId: 'p7', type: 'READ', status: 'success', violated: false, daysAgo: 0, hour: 13 },
  { id: 'ac28', agentId: 'a6', dataId: 'd3', policyId: 'p5', type: 'APPROVE', status: 'flagged', violated: true, daysAgo: 4, hour: 15 },
  { id: 'ac29', agentId: 'a8', dataId: 'd8', policyId: 'p6', type: 'READ', status: 'success', violated: false, daysAgo: 1, hour: 9 },
  { id: 'ac30', agentId: 'a10', dataId: 'd10', policyId: 'p8', type: 'READ', status: 'success', violated: false, daysAgo: 2, hour: 16 },
];

// Which user authorized which agent(s). A user can authorize multiple agents;
// this is what makes the "trace accountability" query meaningful.
const authorizations = [
  { userId: 'u1', agentId: 'a9' },
  { userId: 'u2', agentId: 'a5' },
  { userId: 'u2', agentId: 'a10' },
  { userId: 'u3', agentId: 'a1' },
  { userId: 'u3', agentId: 'a2' },
  { userId: 'u4', agentId: 'a3' },
  { userId: 'u4', agentId: 'a6' },
  { userId: 'u5', agentId: 'a4' },
  { userId: 'u5', agentId: 'a8' },
  { userId: 'u2', agentId: 'a7' },
];

function timestampFor(daysAgo, hour) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

async function seed() {
  const ok = await verifyConnection();
  if (!ok) {
    console.error('Aborting seed: could not connect to CognoDB. Check backend/.env');
    process.exit(1);
  }

  console.log('[seed] Wiping existing graph...');
  await runQuery('MATCH (n) DETACH DELETE n');

  console.log('[seed] Creating uniqueness constraints...');
  await runQuery('CREATE CONSTRAINT user_id IF NOT EXISTS FOR (n:User) REQUIRE n.id IS UNIQUE');
  await runQuery('CREATE CONSTRAINT agent_id IF NOT EXISTS FOR (n:Agent) REQUIRE n.id IS UNIQUE');
  await runQuery('CREATE CONSTRAINT action_id IF NOT EXISTS FOR (n:Action) REQUIRE n.id IS UNIQUE');
  await runQuery('CREATE CONSTRAINT data_id IF NOT EXISTS FOR (n:DataResource) REQUIRE n.id IS UNIQUE');
  await runQuery('CREATE CONSTRAINT policy_id IF NOT EXISTS FOR (n:Policy) REQUIRE n.id IS UNIQUE');

  console.log(`[seed] Creating ${users.length} User nodes...`);
  await runQuery(
    `UNWIND $rows AS row
     CREATE (:User {id: row.id, name: row.name, role: row.role, department: row.department})`,
    { rows: users }
  );

  console.log(`[seed] Creating ${agents.length} Agent nodes...`);
  await runQuery(
    `UNWIND $rows AS row
     CREATE (:Agent {id: row.id, name: row.name, type: row.type, status: row.status})`,
    { rows: agents }
  );

  console.log(`[seed] Creating ${dataResources.length} DataResource nodes...`);
  await runQuery(
    `UNWIND $rows AS row
     CREATE (:DataResource {id: row.id, name: row.name, sensitivity: row.sensitivity, type: row.type})`,
    { rows: dataResources }
  );

  console.log(`[seed] Creating ${policies.length} Policy nodes...`);
  await runQuery(
    `UNWIND $rows AS row
     CREATE (:Policy {id: row.id, name: row.name, rule: row.rule, severity: row.severity})`,
    { rows: policies }
  );

  console.log(`[seed] Creating ${actions.length} Action nodes...`);
  const actionRows = actions.map((a) => ({
    ...a,
    timestamp: timestampFor(a.daysAgo, a.hour),
  }));
  await runQuery(
    `UNWIND $rows AS row
     CREATE (:Action {id: row.id, type: row.type, status: row.status, timestamp: row.timestamp})`,
    { rows: actionRows }
  );

  console.log(`[seed] Creating ${authorizations.length} AUTHORIZED relationships...`);
  await runQuery(
    `UNWIND $rows AS row
     MATCH (u:User {id: row.userId}), (a:Agent {id: row.agentId})
     CREATE (u)-[:AUTHORIZED]->(a)`,
    { rows: authorizations }
  );

  console.log(`[seed] Creating EXECUTED, ACCESSED, CHECKED_AGAINST (+ VIOLATED) relationships...`);
  await runQuery(
    `UNWIND $rows AS row
     MATCH (agent:Agent {id: row.agentId})
     MATCH (action:Action {id: row.id})
     MATCH (data:DataResource {id: row.dataId})
     MATCH (policy:Policy {id: row.policyId})
     CREATE (agent)-[:EXECUTED]->(action)
     CREATE (action)-[:ACCESSED]->(data)
     CREATE (action)-[:CHECKED_AGAINST]->(policy)
     WITH action, policy, row
     FOREACH (_ IN CASE WHEN row.violated THEN [1] ELSE [] END |
       CREATE (action)-[:VIOLATED]->(policy)
     )`,
    { rows: actionRows }
  );

  const counts = await runQuery(
    `MATCH (n) RETURN labels(n)[0] AS label, count(*) AS count ORDER BY label`
  );
  console.log('\n[seed] Done. Node counts:');
  counts.forEach((r) => console.log(`  ${r.get('label')}: ${r.get('count').toNumber()}`));

  await closeDriver();
}

seed().catch((err) => {
  console.error('[seed] Failed:', err);
  process.exit(1);
});
