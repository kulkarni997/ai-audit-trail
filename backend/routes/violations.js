// routes/violations.js
//
// This is the assignment's REQUIRED "a relational database would find this
// awkward" query.
//
// Question: "Find all agents that accessed a piece of data that was ALSO
// accessed by an agent that violated a policy" - i.e. surface agents that
// share data exposure with a known bad actor, even if those agents never
// did anything wrong themselves. This is exactly the kind of "guilt by
// association through shared connections" question fraud/security graphs
// are built for.
//
// In SQL this requires: self-joining the actions table through a data table,
// filtering one side by a violation flag, excluding the violating agent
// itself, and de-duplicating - a multi-way join that gets uglier as more
// hops are added. In Cypher it's one readable pattern match.

const express = require('express');
const { runQuery } = require('../db');

const router = express.Router();

// GET /api/violations
// List all policy violations with full context.
router.get('/', async (req, res, next) => {
  try {
    const records = await runQuery(
      `MATCH (agent:Agent)-[:EXECUTED]->(action:Action)-[:VIOLATED]->(policy:Policy)
       MATCH (action)-[:ACCESSED]->(data:DataResource)
       RETURN agent.id AS agentId, agent.name AS agentName, agent.status AS agentStatus,
              action.id AS actionId, action.type AS actionType, action.timestamp AS timestamp,
              data.name AS dataName, data.sensitivity AS sensitivity,
              policy.name AS policyName, policy.severity AS severity
       ORDER BY action.timestamp DESC`
    );

    const violations = records.map((r) => ({
      agentId: r.get('agentId'),
      agentName: r.get('agentName'),
      agentStatus: r.get('agentStatus'),
      actionId: r.get('actionId'),
      actionType: r.get('actionType'),
      timestamp: r.get('timestamp'),
      dataName: r.get('dataName'),
      sensitivity: r.get('sensitivity'),
      policyName: r.get('policyName'),
      severity: r.get('severity'),
    }));

    res.json({ violations });
  } catch (err) {
    next(err);
  }
});

// GET /api/violations/exposed-agents
// THE required "SQL-awkward" query: agents that share data access with a
// violating agent, even though they themselves never violated a policy.
router.get('/exposed-agents', async (req, res, next) => {
  try {
    const records = await runQuery(
      `MATCH (violator:Agent)-[:EXECUTED]->(:Action)-[:VIOLATED]->(:Policy)
       MATCH (violator)-[:EXECUTED]->(:Action)-[:ACCESSED]->(sharedData:DataResource)
       MATCH (exposedAgent:Agent)-[:EXECUTED]->(:Action)-[:ACCESSED]->(sharedData)
       WHERE exposedAgent.id <> violator.id
       RETURN DISTINCT exposedAgent.id AS agentId, exposedAgent.name AS agentName,
              exposedAgent.status AS agentStatus,
              collect(DISTINCT sharedData.name) AS sharedDataResources,
              collect(DISTINCT violator.name) AS connectedViolators
       ORDER BY agentName`
    );

    const exposedAgents = records.map((r) => ({
      agentId: r.get('agentId'),
      agentName: r.get('agentName'),
      agentStatus: r.get('agentStatus'),
      sharedDataResources: r.get('sharedDataResources'),
      connectedViolators: r.get('connectedViolators'),
    }));

    res.json({ exposedAgents });
  } catch (err) {
    next(err);
  }
});

module.exports = router;