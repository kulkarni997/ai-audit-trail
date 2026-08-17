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

  if (loading) {
    return <p className="mt-8 text-slate-500">Loading agents...</p>
  }

  if (error) {
    return <p className="mt-8 text-red-600">Error: {error}</p>
  }

  return (
    <>
      <h2 className="text-xl font-semibold text-slate-900">AI Agents</h2>
      <p className="mt-2 text-slate-500">
        Every agent in the system, who authorized it, and how much it has done.
      </p>

      {agents.length === 0 && (
        <p className="mt-6 text-sm text-slate-500">No agents found.</p>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-slate-900">{agent.name}</h3>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  agent.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {agent.status}
              </span>
            </div>

            <p className="mt-1 text-sm text-slate-500">{agent.type}</p>
            <p className="mt-4 text-sm text-slate-600">Authorized by: {agent.authorizedBy}</p>
            <p className="mt-1 text-sm text-slate-600">Actions: {agent.actionCount}</p>
          </div>
        ))}
      </div>
    </>
  )
}

export default Agents