// routes/trace.js
//
// This is the assignment's REQUIRED multi-hop traversal query (4 hops):
//   User -[:AUTHORIZED]-> Agent -[:EXECUTED]-> Action -[:ACCESSED]-> DataResource
//
// Given a DataResource, answer: "who is ultimately accountable for every
// action that touched this piece of data?" - walking backward from the data
// through the action, the agent that performed it, all the way to the human
// who authorized that agent.
//
// This is the core "governance" query - the whole point of an audit trail
// is being able to answer exactly this question quickly.

const express = require('express');
const { runQuery } = require('../db');
const { validateParam } = require('../validation');
const router = express.Router();

// GET /api/trace/data/:dataId
router.get('/data/:dataId', validateParam('dataId'), async (req, res, next) => {
  try {
    const records = await runQuery(
      `MATCH (u:User)-[:AUTHORIZED]->(agent:Agent)-[:EXECUTED]->(action:Action)-[:ACCESSED]->(data:DataResource {id: $dataId})
       RETURN data.name AS dataName, data.sensitivity AS sensitivity,
              u.name AS accountableUser, u.role AS userRole,
              agent.name AS agentName, agent.status AS agentStatus,
              action.id AS actionId, action.type AS actionType,
              action.status AS actionStatus, action.timestamp AS timestamp
       ORDER BY action.timestamp DESC`,
      { dataId: req.params.dataId }
    );

    if (records.length === 0) {
      return res.status(404).json({ error: 'No trace found for this data resource' });
    }

    const trace = records.map((r) => ({
      accountableUser: r.get('accountableUser'),
      userRole: r.get('userRole'),
      agentName: r.get('agentName'),
      agentStatus: r.get('agentStatus'),
      actionId: r.get('actionId'),
      actionType: r.get('actionType'),
      actionStatus: r.get('actionStatus'),
      timestamp: r.get('timestamp'),
    }));

    res.json({
      dataName: records[0].get('dataName'),
      sensitivity: records[0].get('sensitivity'),
      chainLength: trace.length,
      trace,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;