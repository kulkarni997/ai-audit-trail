import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAgents, getActions, getViolations } from '../api'

function Dashboard() {
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
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-slate-muted">Loading dashboard…</p>
  if (error) return <p className="text-signal-amber">Error: {error}</p>

  return (
    <>
      <p className="font-mono text-xs uppercase tracking-widest text-slate-muted">Overview</p>
      <h2 className="mt-1 text-3xl font-semibold text-paper">Audit Dashboard</h2>
      <p className="mt-2 text-slate-muted">
        Monitor AI agents, actions, data access, and policy violations.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Link
          to="/agents"
          className="rounded-lg border border-hairline bg-ink-raised p-5 transition hover:border-slate-muted"
        >
          <p className="text-sm text-slate-muted">Total Agents</p>
          <p className="mt-2 text-3xl font-semibold text-paper">{agents.length}</p>
        </Link>

        <Link
          to="/actions"
          className="rounded-lg border border-hairline bg-ink-raised p-5 transition hover:border-slate-muted"
        >
          <p className="text-sm text-slate-muted">Total Actions</p>
          <p className="mt-2 text-3xl font-semibold text-paper">{actions.length}</p>
        </Link>

        <Link
          to="/violations"
          className="rounded-lg border border-hairline bg-ink-raised p-5 transition hover:border-slate-muted"
        >
          <p className="text-sm text-slate-muted">Policy Violations</p>
          <p className="mt-2 text-3xl font-semibold text-signal-amber">{violations.length}</p>
        </Link>
      </div>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-paper">Recent Actions</h3>
            <p className="mt-1 text-sm text-slate-muted">Latest activity across AI agents</p>
          </div>
          <Link to="/actions" className="text-sm font-medium text-verified-teal hover:underline">
            View all →
          </Link>
        </div>

        <div className="mt-6 overflow-hidden rounded-lg border border-hairline bg-ink-raised">
          {actions.length === 0 && (
            <p className="p-5 text-sm text-slate-muted">No actions recorded yet.</p>
          )}
          {actions.slice(0, 5).map((action) => (
            <div
              key={action.id}
              className="flex items-center justify-between gap-4 border-b border-hairline p-5 last:border-b-0"
            >
              <div>
                <h4 className="font-medium text-paper">{action.agentName}</h4>
                <p className="mt-1 text-sm text-slate-muted">
                  <span className="font-mono text-xs">{action.type}</span> → {action.dataName}
                </p>
                <p className="mt-1 font-mono text-xs text-slate-muted/70">
                  {new Date(action.timestamp).toLocaleString()}
                </p>
              </div>
              <span
                className={`rounded-full border px-3 py-1 text-xs font-medium ${
                  action.status === 'flagged'
                    ? 'border-signal-amber/30 bg-signal-amber-soft text-signal-amber'
                    : action.status === 'failed'
                      ? 'border-hairline bg-ink text-slate-muted'
                      : 'border-verified-teal/30 bg-verified-teal-soft text-verified-teal'
                }`}
              >
                {action.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default Dashboard
