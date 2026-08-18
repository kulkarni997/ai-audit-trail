import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getActions } from '../api'

const FILTERS = ['all', 'success', 'flagged', 'failed']

function Actions() {
  const [actions, setActions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')
  const navigate = useNavigate()

  useEffect(() => {
    getActions()
      .then((data) => setActions(data.actions))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-slate-muted">Loading actions…</p>
  if (error) return <p className="text-signal-amber">Error: {error}</p>

  const visibleActions = filter === 'all' ? actions : actions.filter((a) => a.status === filter)

  return (
    <>
      <h2 className="text-3xl font-semibold text-paper">All Actions</h2>
      <p className="mt-2 text-slate-muted">
        Every logged action taken by an agent. Click one to trace accountability.
      </p>

      <div className="mt-6 flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium capitalize transition ${
              filter === f
                ? 'border-paper bg-paper text-ink'
                : 'border-hairline bg-ink-raised text-slate-muted hover:border-slate-muted'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-hairline bg-ink-raised">
        {visibleActions.length === 0 && (
          <p className="p-5 text-sm text-slate-muted">No actions match this filter.</p>
        )}
        {visibleActions.map((action) => (
          <div
            key={action.id}
            className="flex items-center justify-between gap-4 border-b border-hairline p-5 last:border-b-0"
          >
            <div>
              <h3 className="font-medium text-paper">{action.agentName}</h3>

              <button
                type="button"
                onClick={() => navigate(`/trace?dataId=${action.dataId}`)}
                className="mt-2 text-sm font-medium text-verified-teal hover:underline"
              >
                Trace accountability →
              </button>

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
    </>
  )
}

export default Actions
