import { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL

function DashboardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="2" y="2" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <rect x="10" y="2" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <rect x="2" y="10" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <rect x="10" y="10" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

function AgentsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="6.5" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12.5" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2 16c0-2.5 2-4 4.5-4S11 13.5 11 16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M9 16c0-2.5 1.8-4 4-4s4 1.5 4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function ActionsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 2v14M9 2l-4 4M9 2l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 15h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function ViolationsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 2 2 15h14L9 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M9 7.5v3.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="9" cy="13" r="0.9" fill="currentColor" />
    </svg>
  )
}

function TraceIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="4" cy="3.5" r="1.7" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="14" cy="8.5" r="1.7" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="4" cy="14.5" r="1.7" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5.4 4.6 12.6 7.6M12.6 9.4 5.4 13.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

const navItems = [
  { to: '/dashboard', label: 'Dashboard', end: true, Icon: DashboardIcon },
  { to: '/agents', label: 'Agents', Icon: AgentsIcon },
  { to: '/actions', label: 'Actions', Icon: ActionsIcon },
  { to: '/violations', label: 'Violations', Icon: ViolationsIcon },
  { to: '/trace', label: 'Trace', Icon: TraceIcon },
]

function Layout() {
  const [dbStatus, setDbStatus] = useState('checking')
  const [navOpen, setNavOpen] = useState(true)

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then((res) => setDbStatus(res.ok ? 'connected' : 'unreachable'))
      .catch(() => setDbStatus('unreachable'))
  }, [])

  return (
    <div className="flex min-h-screen bg-ink font-body text-paper">
      <aside
        className={`flex shrink-0 flex-col border-r border-white/10 bg-ink/90 text-paper backdrop-blur-xl transition-all duration-300 ${
          navOpen ? 'w-60' : 'w-16'
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-6">
          {navOpen && (
            <div>
              <p className="font-display text-lg font-semibold tracking-tight">
                Agent Audit Trail
              </p>
              <p className="mt-1 text-xs text-white/50">Agent Governance Console</p>
            </div>
          )}
          <button
            onClick={() => setNavOpen((v) => !v)}
            aria-label={navOpen ? 'Collapse navigation' : 'Expand navigation'}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 4.5H16M2 9H16M2 13.5H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
          {navItems.map(({ to, label, end, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              title={!navOpen ? label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  navOpen ? '' : 'justify-center'
                } ${
                  isActive
                    ? 'border border-white/15 bg-white/10 text-paper shadow-sm backdrop-blur-md'
                    : 'text-white/60 hover:bg-white/5 hover:text-white/90'
                }`
              }
            >
              <Icon />
              {navOpen && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 px-4 py-4">
          <div className={`flex items-center gap-2 text-xs ${navOpen ? '' : 'justify-center'}`}>
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${
                dbStatus === 'connected'
                  ? 'bg-verified-teal'
                  : dbStatus === 'checking'
                    ? 'bg-white/30'
                    : 'bg-signal-amber'
              }`}
            />
            {navOpen && (
              <span className="text-white/50">
                {dbStatus === 'connected' && 'CognoDB connected'}
                {dbStatus === 'checking' && 'Checking connection…'}
                {dbStatus === 'unreachable' && 'Database unreachable'}
              </span>
            )}
          </div>
        </div>
      </aside>

      <div className="flex-1">
        <main className="mx-auto max-w-5xl px-10 py-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
