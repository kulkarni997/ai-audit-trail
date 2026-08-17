import { NavLink, Outlet } from 'react-router-dom'

const navLinkClass = ({ isActive }) =>
  `rounded-lg px-4 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-slate-900 text-white'
      : 'text-slate-600 hover:bg-slate-100'
  }`

function Layout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <h1 className="text-2xl font-semibold text-slate-900">
            WEXA Audit Trail
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            AI Agent Governance & Accountability
          </p>
        </div>

        <nav className="mx-auto flex max-w-7xl gap-2 px-6 pb-4">
          <NavLink to="/" end className={navLinkClass}>Dashboard</NavLink>
          <NavLink to="/agents" className={navLinkClass}>Agents</NavLink>
          <NavLink to="/actions" className={navLinkClass}>Actions</NavLink>
          <NavLink to="/violations" className={navLinkClass}>Violations</NavLink>
          <NavLink to="/trace" className={navLinkClass}>Trace</NavLink>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout