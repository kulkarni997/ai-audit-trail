// routes/agents.js
const express = require('express');
const { runQuery } = require('../db');
const { validateParam } = require('../validation');
const router = express.Router();

// GET /api/agents
// List all agents with the user who authorized them and a count of actions executed.
router.get('/', async (req, res, next) => {
  try {
    const records = await runQuery(
      `MATCH (u:User)-[:AUTHORIZED]->(a:Agent)
       OPTIONAL MATCH (a)-[:EXECUTED]->(action:Action)
       RETURN a.id AS id, a.name AS name, a.type AS type, a.status AS status,
              u.name AS authorizedBy, count(action) AS actionCount
       ORDER BY a.name`
    );

    const agents = records.map((r) => ({
      id: r.get('id'),
      name: r.get('name'),
      type: r.get('type'),
      status: r.get('status'),
      authorizedBy: r.get('authorizedBy'),
      actionCount: r.get('actionCount').toNumber(),
    }));

    res.json({ agents });
  } catch (err) {
    next(err);
  }
});

// GET /api/agents/:id
// Detail view: agent info + every action it executed, with the data it touched.
router.get('/:id', validateParam('id'), async (req, res, next) => {
  try {
    const records = await runQuery(
      `MATCH (u:User)-[:AUTHORIZED]->(a:Agent {id: $id})
       OPTIONAL MATCH (a)-[:EXECUTED]->(action:Action)-[:ACCESSED]->(data:DataResource)
       RETURN a.id AS id, a.name AS name, a.type AS type, a.status AS status,
              u.name AS authorizedBy,
              collect({
                actionId: action.id, actionType: action.type, status: action.status,
                timestamp: action.timestamp, dataName: data.name, dataSensitivity: data.sensitivity
              }) AS actions`,
      { id: req.params.id }
    );

    if (records.length === 0) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const r = records[0];
    res.json({
      id: r.get('id'),
      name: r.get('name'),
      type: r.get('type'),
      status: r.get('status'),
      authorizedBy: r.get('authorizedBy'),
      actions: r.get('actions').filter((a) => a.actionId !== null),
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;