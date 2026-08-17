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

  if (loading) {
    return <p className="mt-8 text-slate-500">Loading dashboard...</p>
  }

  if (error) {
    return <p className="mt-8 text-red-600">Error: {error}</p>
  }

  return (
    <>
      <h2 className="text-xl font-semibold text-slate-900">Audit Dashboard</h2>
      <p className="mt-2 text-slate-500">
        Monitor AI agents, actions, data access, and policy violations.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Link
          to="/agents"
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
        >
          <p className="text-sm text-slate-500">Total Agents</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{agents.length}</p>
        </Link>

        <Link
          to="/actions"
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
        >
          <p className="text-sm text-slate-500">Total Actions</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{actions.length}</p>
        </Link>

        <Link
          to="/violations"
          className="rounded-xl border border-red-200 bg-white p-5 shadow-sm transition hover:shadow-md"
        >
          <p className="text-sm text-slate-500">Policy Violations</p>
          <p className="mt-2 text-3xl font-semibold text-red-600">{violations.length}</p>
        </Link>
      </div>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Recent Actions</h2>
            <p className="mt-1 text-sm text-slate-500">Latest activity across AI agents</p>
          </div>
          <Link to="/actions" className="text-sm font-medium text-blue-600 hover:text-blue-800">
            View all →
          </Link>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {actions.length === 0 && (
            <p className="p-5 text-sm text-slate-500">No actions recorded yet.</p>
          )}
          {actions.slice(0, 5).map((action) => (
            <div
              key={action.id}
              className="flex items-center justify-between gap-4 border-b border-slate-100 p-5 last:border-b-0"
            >
              <div>
                <h3 className="font-medium text-slate-900">{action.agentName}</h3>
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
    </>
  )
}

export default Dashboard