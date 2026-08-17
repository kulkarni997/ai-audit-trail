import { useEffect, useState } from 'react'
import {
  getActions,
  getAgents,
  getViolations,
  traceData,
  getExposedAgents,
} from './api'

function App() {
  const [agents, setAgents] = useState([])
  const [actions, setActions] = useState([])
  const [violations, setViolations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedDataId, setSelectedDataId] = useState('')
  const [trace, setTrace] = useState(null)
  const [exposedAgents, setExposedAgents] = useState([])


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

    async function handleTrace() {
    if (!selectedDataId) return

    try {
      const data = await traceData(selectedDataId)
      setTrace(data)
    } catch (err) {
      setError(err.message)
    }
  }

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
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Recent Actions
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Latest activity across AI agents
                  </p>
                </div>
              </div>

              <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                {actions.slice(0, 8).map((action) => (
                  <div
                    key={action.id}
                    className="flex items-center justify-between gap-4 border-b border-slate-100 p-5 last:border-b-0"
                  >
                    <div>
                      <h3 className="font-medium text-slate-900">
                        {action.agentName}
                      </h3>

                      <button
  type="button"
  onClick={() => {
    setSelectedDataId(action.dataId)
    traceData(action.dataId)
      .then((data) => {
  console.log('TRACE DATA:', data)
  setTrace(data)
})
      .catch((err) => setError(err.message))
  }}
  className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800"
>
  Trace accountability →
</button>

                      <p className="mt-1 text-sm text-slate-600">
                        {action.type} → {action.dataName}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {new Date(action.timestamp).toLocaleString()}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        action.status === 'flagged'
                          ? 'bg-red-100 text-red-700'
                          : action.status === 'failed'
                            ? 'bg-slate-200 text-slate-700'
                            : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {action.status}
                    </span>
                  </div>
                ))}
              </div>
            </section>

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
                              {trace && (
              <section className="mt-10">
                <h2 className="text-xl font-semibold text-slate-900">
                  Accountability Trace
                </h2>

                <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div>
                    <p className="text-sm text-slate-500">Data Resource</p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {trace.dataName}
                    </p>
                  </div>

                  <div className="mt-6">
                    <p className="text-sm text-slate-500">
                      Accountability chain
                    </p>

                    <div className="mt-4 space-y-4">
                      {trace.trace.map((item) => (
                        <div
                          key={item.actionId}
                          className="rounded-lg border border-slate-100 bg-slate-50 p-4"
                        >
                          <p className="font-medium text-slate-900">
                            {item.accountableUser}
                          </p>

                          <p className="mt-1 text-sm text-slate-600">
                            authorized → {item.agentName}
                          </p>

                          <p className="mt-1 text-sm text-slate-600">
                            {item.actionType} → {trace.dataName}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

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