import { Routes, Route } from 'react-router-dom'
import Landing from './components/Landing'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import Agents from './components/Agents'
import Actions from './components/Actions'
import Violations from './components/Violations'
import Trace from './components/Trace'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route element={<Layout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="agents" element={<Agents />} />
        <Route path="actions" element={<Actions />} />
        <Route path="violations" element={<Violations />} />
        <Route path="trace" element={<Trace />} />
      </Route>
    </Routes>
  )
}

export default App
