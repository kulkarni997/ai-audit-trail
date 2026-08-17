import { useEffect, useState } from 'react'
import { getActions, getAgents, getViolations } from './api'

function App() {
  const [agents, setAgents] = useState([])
  const [actions, setActions] = useState([])
  const [violations, setViolations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([getAgents(), getActions(), getViolations()])
      .then(([agentsData, actionsData, violationsData]) => {
        setAgents(agentsData.agents)
        setActions(actionsData.actions)
        setViolations(violationsData.violations)
      })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <h1 className="text-2xl font-semibold text-slate-900">
            WEXA Audit Trail
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            AI Agent Governance & Accountability
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <h2 className="text-xl font-semibold text-slate-900">
          Audit Dashboard
        </h2>

        <p className="mt-2 text-slate-500">
          Monitor AI agents, actions, data access, and policy violations.
        </p>

        {loading && (
          <p className="mt-8 text-slate-500">Loading dashboard...</p>
        )}

        {error && (
          <p className="mt-8 text-red-600">
            Error: {error}
          </p>
        )}

        {!loading && !error && (
          <>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Total Agents</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                  {agents.length}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Total Actions</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                  {actions.length}
                </p>
              </div>

              <div className="rounded-xl border border-red-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Policy Violations</p>
                <p className="mt-2 text-3xl font-semibold text-red-600">
                  {violations.length}
                </p>
              </div>
            </div>

            <section className="mt-10">
              <h2 className="text-xl font-semibold text-slate-900">
                AI Agents
              </h2>

              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <h3 className="font-semibold text-slate-900">
                      {agent.name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {agent.type}
                    </p>

                    <p className="mt-4 text-sm text-slate-600">
                      Authorized by: {agent.authorizedBy}
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      Actions: {agent.actionCount}
                    </p>

                    <span className="mt-4 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                      {agent.status}
                    </span>
                  </div>
                ))}
              </div>
            </section>
                        <section className="mt-10">
              <h2 className="text-xl font-semibold text-slate-900">
                Recent Policy Violations
              </h2>

              <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                {violations.length === 0 && (
                  <p className="p-5 text-sm text-slate-500">
                    No policy violations found.
                  </p>
                )}
                {violations.map((violation) => (
                  <div
                    key={violation.actionId}
                    className="border-b border-slate-100 p-5 last:border-b-0"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {violation.agentName}
                        </h3>

                        <p className="mt-1 text-sm text-slate-600">
                          {violation.actionType} → {violation.dataName}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Policy: {violation.policyName}
                        </p>
                      </div>

                      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                        {violation.severity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export default App