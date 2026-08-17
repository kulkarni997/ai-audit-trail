import { useEffect, useState } from 'react'
import { getViolations, getExposedAgents } from '../api'

function Violations() {
  const [violations, setViolations] = useState([])
  const [exposedAgents, setExposedAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([getViolations(), getExposedAgents()])
      .then(([violationsData, exposedData]) => {
        setViolations(violationsData.violations)
        setExposedAgents(exposedData.exposedAgents)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="mt-8 text-slate-500">Loading violations...</p>
  }

  if (error) {
    return <p className="mt-8 text-red-600">Error: {error}</p>
  }

  return (
    <>
      <h2 className="text-xl font-semibold text-slate-900">Policy Violations</h2>
      <p className="mt-2 text-slate-500">
        Actions flagged for breaking a compliance policy.
      </p>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {violations.length === 0 && (
          <p className="p-5 text-sm text-slate-500">No policy violations found.</p>
        )}
        {violations.map((violation) => (
          <div
            key={violation.actionId}
            className="border-b border-slate-100 p-5 last:border-b-0"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-slate-900">{violation.agentName}</h3>
                <p className="mt-1 text-sm text-slate-600">
                  {violation.actionType} → {violation.dataName}
                </p>
                <p className="mt-1 text-sm text-slate-500">Policy: {violation.policyName}</p>
              </div>
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                {violation.severity}
              </span>
            </div>
          </div>
        ))}
      </div>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-slate-900">Exposed Agents</h2>
        <p className="mt-1 text-sm text-slate-500">
          Agents that accessed data also touched by a policy-violating agent —
          even if they never violated a policy themselves. This is the
          "shared exposure" pattern a relational join would struggle to express cleanly.
        </p>

        <div className="mt-6 overflow-hidden rounded-xl border border-amber-200 bg-white shadow-sm">
          {exposedAgents.length === 0 && (
            <p className="p-5 text-sm text-slate-500">
              No agents share data exposure with a violating agent.
            </p>
          )}
          {exposedAgents.map((exposed) => (
            <div key={exposed.agentId} className="border-b border-slate-100 p-5 last:border-b-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-slate-900">{exposed.agentName}</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Shared data: {exposed.sharedDataResources.join(', ')}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Connected to violator(s): {exposed.connectedViolators.join(', ')}
                  </p>
                </div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                  {exposed.agentStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default Violations