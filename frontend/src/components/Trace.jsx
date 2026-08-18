import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { traceData } from '../api'

function Trace() {
  const [searchParams] = useSearchParams()
  const initialDataId = searchParams.get('dataId') || ''

  const [dataId, setDataId] = useState(initialDataId)
  const [trace, setTrace] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function runTrace(id) {
    if (!id) return
    setLoading(true)
    setError(null)
    traceData(id)
      .then((data) => setTrace(data))
      .catch((err) => {
        setError(err.message)
        setTrace(null)
      })
      .finally(() => setLoading(false))
  }

  // Auto-run when arriving from an Action's "Trace accountability" link.
  useEffect(() => {
    if (initialDataId) {
      runTrace(initialDataId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <h2 className="text-xl font-semibold text-slate-900">Accountability Trace</h2>
      <p className="mt-2 text-slate-500">
        Given a data resource, trace back through every action that touched it,
        the agent that executed each action, and the human who authorized that agent.
      </p>

      <div className="mt-6 flex gap-2">
        <input
          type="text"
          value={dataId}
          onChange={(e) => setDataId(e.target.value)}
          placeholder="e.g. d6"
          className="w-64 rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
        <button
          onClick={() => runTrace(dataId)}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Trace
        </button>
      </div>
      <p className="mt-2 text-xs text-slate-400">
        Tip: data resource IDs are visible in the Actions list (e.g. d1–d15), or click
        "Trace accountability" directly from an action.
      </p>

      {loading && <p className="mt-8 text-slate-500">Tracing...</p>}
      {error && <p className="mt-8 text-red-600">Error: {error}</p>}

      {!loading && !error && !trace && (
        <p className="mt-8 text-sm text-slate-500">
          Enter a data resource ID above to see its accountability chain.
        </p>
      )}

      {trace && (
        <div className="mt-8 rounded-xl border border-hairline bg-ink-raised p-6">
          <div>
            <p className="text-sm text-slate-500">Data Resource</p>
            <p className="mt-1 font-semibold text-slate-900">{trace.dataName}</p>
            <span className="mt-2 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {trace.sensitivity}
            </span>
          </div>

          <div className="mt-6">
            <p className="text-sm text-slate-500">
              Accountability chain ({trace.chainLength} action{trace.chainLength === 1 ? '' : 's'})
            </p>

            <div className="mt-4 space-y-4">
              {trace.trace.map((item) => (
                <div
                  key={item.actionId}
                  className="rounded-lg border border-slate-100 bg-slate-50 p-4"
                >
                  <p className="font-medium text-slate-900">
                    {item.accountableUser}
                    <span className="ml-2 text-xs font-normal text-slate-500">
                      {item.userRole}
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    authorized → {item.agentName}
                    {item.agentStatus !== 'active' && (
                      <span className="ml-2 rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-600">
                        {item.agentStatus}
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {item.actionType} → {trace.dataName}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Trace
