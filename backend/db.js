// db.js
// Central place that creates and exports the CognoDB (Bolt/Neo4j-compatible) driver.
// CognoDB speaks openCypher over Bolt, so the official neo4j-driver package works
// against it with zero code changes - we just point it at the CognoDB URI.

const neo4j = require('neo4j-driver');
require('dotenv').config();

const { COGNODB_URI, COGNODB_USER, COGNODB_PASSWORD } = process.env;

if (!COGNODB_URI || !COGNODB_USER || !COGNODB_PASSWORD) {
  console.error(
    'Missing CognoDB credentials. Copy backend/.env.example to backend/.env ' +
    'and fill in COGNODB_URI, COGNODB_USER, COGNODB_PASSWORD.'
  );
  process.exit(1);
}

const driver = neo4j.driver(
  COGNODB_URI,
  neo4j.auth.basic(COGNODB_USER, COGNODB_PASSWORD)
);

// Verifies the DB is actually reachable. Used at server startup so we fail
// fast/clearly instead of the app silently misbehaving on the first request.
async function verifyConnection() {
  try {
    await driver.verifyConnectivity();
    console.log('[db] Connected to CognoDB successfully.');
    return true;
  } catch (err) {
    console.error('[db] Failed to connect to CognoDB:', err.message);
    return false;
  }
}

// Helper used everywhere queries are run. Always opens and closes its own
// session, and always uses parameters ($paramName in Cypher) rather than
// string concatenation, per the assignment's parameterized-query requirement.
async function runQuery(cypher, params = {}) {
  const session = driver.session();
  try {
    const result = await session.run(cypher, params);
    return result.records;
  } finally {
    await session.close();
  }
}

async function closeDriver() {
  await driver.close();
}

module.exports = { driver, runQuery, verifyConnection, closeDriver };
