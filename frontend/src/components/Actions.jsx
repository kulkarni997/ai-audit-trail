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

  if (loading) {
    return <p className="mt-8 text-slate-500">Loading actions...</p>
  }

  if (error) {
    return <p className="mt-8 text-red-600">Error: {error}</p>
  }

  const visibleActions =
    filter === 'all' ? actions : actions.filter((a) => a.status === filter)

  return (
    <>
      <h2 className="text-xl font-semibold text-slate-900">All Actions</h2>
      <p className="mt-2 text-slate-500">
        Every logged action taken by an agent. Click one to trace accountability.
      </p>

      <div className="mt-6 flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition ${
              filter === f
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {visibleActions.length === 0 && (
          <p className="p-5 text-sm text-slate-500">No actions match this filter.</p>
        )}
        {visibleActions.map((action) => (
          <div
            key={action.id}
            className="flex items-center justify-between gap-4 border-b border-slate-100 p-5 last:border-b-0"
          >
            <div>
              <h3 className="font-medium text-slate-900">{action.agentName}</h3>

              <button
                type="button"
                onClick={() => navigate(`/trace?dataId=${action.dataId}`)}
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
    </>
  )
}

export default Actions