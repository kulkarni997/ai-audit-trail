# Agent Audit Trail

A graph-based governance and audit trail application for tracking AI agent actions, data access, policy violations, and accountability using CognoDB.

**Live Demo:** https://wexa-audit-trail.vercel.app/  (Note : The backend is hosted on Render's free tier and may take a short time to wake after inactivity.)
**Repository:** (https://github.com/kulkarni997/wexa-audit-trail.git) 
**Screen Recording:** (https://www.loom.com/share/069c0c9dc158419cbb00c5203fe3fa83)

---

## What it does?

AI agents can perform actions on behalf of humans and interact with organizational data. When something needs to be investigated, it is important to understand not only what happened, but how the action is connected to the agent, the data involved, and the human who authorized the agent.

**Agent Audit Trail** is a demonstration application for investigating these relationships.

It allows users to:

- Browse AI agents and their authorizers
- View recorded actions performed by agents
- See which data resources were accessed
- Trace a data resource back to the agent and authorizing human
- View recorded policy violations
- Identify agents that share data access with a policy-violating agent

The application is intended as a demonstration of graph-based AI agent governance, not as a production security or compliance system.

---

## 2. Why a Graph Database?

The important information in an agent audit trail is the relationships between entities.

For example, answering:

> Who is accountable for an action that accessed this data?

requires traversing:

```text
User → Agent → Action → DataResource

---
## 3. Graph Model

                         ┌──────────┐
                         │   User   │
                         └────┬─────┘
                              │
                         AUTHORIZED
                              │
                              ▼
                         ┌──────────┐
                         │  Agent   │
                         └────┬─────┘
                              │
                          EXECUTED
                              │
                              ▼
                         ┌──────────┐
                         │  Action  │
                         └────┬─────┘
                              │
                 ┌────────────┼─────────────┐
                 │            │             │
             ACCESSED   CHECKED_AGAINST   VIOLATED
                 │            │             │
                 ▼            ▼             ▼
          ┌────────────┐ ┌─────────┐   ┌─────────┐
          │DataResource│ │ Policy  │   │ Policy  │
          └────────────┘ └─────────┘   └─────────┘

Nodes
User — human who authorizes an agent
Agent — AI agent operating on behalf of a user
Action — recorded activity performed by an agent
DataResource — data accessed by an action
Policy — policy associated with an action

Relationships
User -[:AUTHORIZED]-> Agent
Agent -[:EXECUTED]-> Action
Action -[:ACCESSED]-> DataResource
Action -[:CHECKED_AGAINST]-> Policy
Action -[:VIOLATED]-> Policy

## 4. Key Graph Queries
Multi-Hop Accountability Trace

The accountability query traces a data resource through the action that accessed it, the agent that performed the action, and the human who authorized that agent.

Exposed Agents Query

This query identifies agents that accessed data also accessed by an agent that violated a policy.

## 5. Features
Dashboard - Provides an overview of:

Total agents
Total recorded actions
Policy violations
Recent actions
Agents

Shows:
Agent name
Agent type
Status
Authorizing user
Number of recorded actions
Actions

Shows recorded agent actions and supports filtering by:
All
Success
Flagged
Failed

Actions also provide a direct Trace accountability action.

Accountability Trace - 

Given a data resource ID, the application displays its accountability chain:

User
 ↓ authorized
Agent
 ↓ executed
Action
 ↓ accessed
DataResource

Policy Violations -

Shows recorded actions associated with policy violations, including the relevant agent, action, data resource, policy, and severity.

Exposed Agents -

Shows agents that share data access with an agent associated with a policy violation.

## 6. Tech Stack
Frontend
React
Vite
JavaScript / JSX
React Router
Tailwind CSS
Backend
Node.js
Express
neo4j-driver
Zod
express-rate-limit
CORS
Database
CognoDB
Bolt protocol
openCypher
Deployment
Vercel — frontend
Render — backend
CognoDB — graph database

## 7. Architecture
┌──────────────────────────┐
│       React + Vite       │
│        Frontend          │
└────────────┬─────────────┘
             │ REST API
             ▼
┌──────────────────────────┐
│     Node.js + Express    │
│         Backend          │
└────────────┬─────────────┘
             │
             │ neo4j-driver
             │ Bolt
             ▼
┌──────────────────────────┐
│         CognoDB          │
│   Graph Database         │
└──────────────────────────┘

8. Setup & Running Locally
Prerequisites
Node.js
npm
Git
CognoDB instance
Create a CognoDB Instance

Create an instance through the CognoDB console:

https://console.cognodb.com/signup

Copy the Bolt connection details provided by CognoDB.

Backend Setup

Create:

backend/.env
COGNODB_URI=<your-cognodb-bolt-uri>
COGNODB_USER=<your-cognodb-user>
COGNODB_PASSWORD=<your-cognodb-password>
PORT=4000
FRONTEND_URL=http://localhost:5173

Install dependencies:

cd backend
npm install
Seed the Database

The project includes a repeatable seed script:

node scripts/seed.js

The seed dataset contains:

5 Users
10 Agents
15 DataResources
8 Policies
30 Actions

Start Backend
npm start

Backend:http://localhost:4000

Health check:http://localhost:4000/api/health

Frontend Setup

Open another terminal:

cd frontend
npm install

Create:
frontend/.env
VITE_API_URL=http://localhost:4000/api

Start the frontend:

npm run dev

Frontend:http://localhost:5173


9. Engineering & Security
Parameterized Cypher

External values are passed to Cypher queries as parameters rather than being directly interpolated.

Example:

MATCH (data:DataResource {id: $dataId})

with:

{ dataId: req.params.dataId }
Input Validation

Route parameters are validated before being used by the backend. Invalid IDs return a 400 response.

Rate Limiting

The API uses rate limiting because the demonstration application does not implement authentication.

Current limit:

100 requests / 15 minutes / IP
CORS

The backend uses the FRONTEND_URL environment variable to restrict cross-origin requests in production.

Credentials

CognoDB credentials are stored in environment variables and are not committed to the repository.

The frontend only receives the public backend API URL through VITE_API_URL.

## Screenshots

### Landing Page
![alt text](Landing.png)

### Dashboard

![alt text](dashboard.png)

### Actions & Accountability Trace

![alt text](actions.png)

### Policy Violations & Exposed Agents
![alt text](violations.png)

###Accountability trace
![alt text](ac-trace.png)
