// routes/actions.js
const express = require('express');
const { runQuery } = require('../db');

const router = express.Router();

// GET /api/actions?status=flagged&limit=20
// Recent actions feed, newest first. Optional ?status= filter (success/flagged/failed).
router.get('/', async (req, res, next) => {
  try {
    const { status, limit } = req.query;
    const cappedLimit = neo4jSafeLimit(limit);

    const cypher = status
      ? `MATCH (agent:Agent)-[:EXECUTED]->(action:Action {status: $status})-[:ACCESSED]->(data:DataResource)
         RETURN agent.name AS agentName, action.id AS id, action.type AS type,
                action.status AS status, action.timestamp AS timestamp,
                data.name AS dataName, data.sensitivity AS sensitivity
         ORDER BY action.timestamp DESC
         LIMIT $limit`
      : `MATCH (agent:Agent)-[:EXECUTED]->(action:Action)-[:ACCESSED]->(data:DataResource)
         RETURN agent.name AS agentName, action.id AS id, action.type AS type,
                action.status AS status, action.timestamp AS timestamp,
                data.name AS dataName, data.sensitivity AS sensitivity
         ORDER BY action.timestamp DESC
         LIMIT $limit`;

    const records = await runQuery(cypher, { status, limit: cappedLimit });

    const actions = records.map((r) => ({
      id: r.get('id'),
      agentName: r.get('agentName'),
      type: r.get('type'),
      status: r.get('status'),
      timestamp: r.get('timestamp'),
      dataName: r.get('dataName'),
      sensitivity: r.get('sensitivity'),
    }));

    res.json({ actions });
  } catch (err) {
    next(err);
  }
});

function neo4jSafeLimit(rawLimit) {
  const neo4j = require('neo4j-driver');
  const n = Number(rawLimit) || 20;
  const bounded = Math.min(Math.max(n, 1), 100);
  return neo4j.int(bounded);
}

module.exports = router;