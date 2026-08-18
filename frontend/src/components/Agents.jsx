import { useEffect, useState } from 'react'
import { getAgents } from '../api'

function Agents() {
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getAgents()
      .then((data) => setAgents(data.agents))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-slate-muted">Loading agents…</p>
  if (error) return <p className="text-signal-amber">Error: {error}</p>

  return (
    <>
      <h2 className="text-3xl font-semibold text-paper">AI Agents</h2>
      <p className="mt-2 text-slate-muted">
        Every agent in the system, who authorized it, and how much it has done.
      </p>

      {agents.length === 0 && (
        <p className="mt-6 text-sm text-slate-muted">No agents found.</p>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="rounded-lg border border-hairline bg-ink-raised p-5 transition hover:border-slate-muted"
          >
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-paper">{agent.name}</h3>
              <span
                className={`rounded-full border px-3 py-1 text-xs font-medium ${
                  agent.status === 'active'
                    ? 'border-verified-teal/30 bg-verified-teal-soft text-verified-teal'
                    : 'border-hairline bg-ink text-slate-muted'
                }`}
              >
                {agent.status}
              </span>
            </div>

            <p className="mt-1 font-mono text-xs text-slate-muted">{agent.type}</p>
            <p className="mt-4 text-sm text-slate-muted">Authorized by: <span className="text-paper">{agent.authorizedBy}</span></p>
            <p className="mt-1 text-sm text-slate-muted">Actions: <span className="text-paper">{agent.actionCount}</span></p>
          </div>
        ))}
      </div>
    </>
  )
}

export default Agents
