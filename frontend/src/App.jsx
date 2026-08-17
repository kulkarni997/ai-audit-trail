import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import Agents from './components/Agents'
import Actions from './components/Actions'
import Violations from './components/Violations'
import Trace from './components/Trace'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="agents" element={<Agents />} />
        <Route path="actions" element={<Actions />} />
        <Route path="violations" element={<Violations />} />
        <Route path="trace" element={<Trace />} />
      </Route>
    </Routes>
  )
}

export default App