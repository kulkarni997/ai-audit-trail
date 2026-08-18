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

  if (loading) return <p className="text-slate-muted">Loading violations…</p>
  if (error) return <p className="text-signal-amber">Error: {error}</p>

  return (
    <>
      <h2 className="text-3xl font-semibold text-paper">Policy Violations</h2>
      <p className="mt-2 text-slate-muted">Actions flagged for breaking a compliance policy.</p>

      <div className="mt-6 overflow-hidden rounded-lg border border-hairline bg-ink-raised">
        {violations.length === 0 && (
          <p className="p-5 text-sm text-slate-muted">No policy violations found.</p>
        )}
        {violations.map((violation) => (
          <div key={violation.actionId} className="border-b border-hairline p-5 last:border-b-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-paper">{violation.agentName}</h3>
                <p className="mt-1 text-sm text-slate-muted">
                  <span className="font-mono text-xs">{violation.actionType}</span> → {violation.dataName}
                </p>
                <p className="mt-1 text-sm text-slate-muted">Policy: {violation.policyName}</p>
              </div>
              <span className="rounded-full border border-signal-amber/30 bg-signal-amber-soft px-3 py-1 text-xs font-medium text-signal-amber">
                {violation.severity}
              </span>
            </div>
          </div>
        ))}
      </div>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-paper">Exposed Agents</h2>
        <p className="mt-1 text-sm text-slate-muted">
          Agents that accessed data also touched by a policy-violating agent — even if
          they never violated a policy themselves. This is the "shared exposure" pattern
          a relational join would struggle to express cleanly.
        </p>

        <div className="mt-6 overflow-hidden rounded-lg border border-hairline bg-ink-raised">
          {exposedAgents.length === 0 && (
            <p className="p-5 text-sm text-slate-muted">
              No agents share data exposure with a violating agent.
            </p>
          )}
          {exposedAgents.map((exposed) => (
            <div key={exposed.agentId} className="border-b border-hairline p-5 last:border-b-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-paper">{exposed.agentName}</h3>
                  <p className="mt-1 text-sm text-slate-muted">
                    Shared data: {exposed.sharedDataResources.join(', ')}
                  </p>
                  <p className="mt-1 text-sm text-slate-muted">
                    Connected to violator(s): {exposed.connectedViolators.join(', ')}
                  </p>
                </div>
                <span className="rounded-full border border-hairline bg-ink px-3 py-1 text-xs font-medium text-slate-muted">
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
