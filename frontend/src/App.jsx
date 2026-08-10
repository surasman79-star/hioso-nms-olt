import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Layout from './components/Layout/Layout'
import Dashboard from './pages/Dashboard'
import OLTManagement from './pages/OLTManagement'
import Login from './pages/Login'

function App() {
  const { token } = useAuthStore()

  return (
    <Router>
      <Routes>
        {!token ? (
          <Route path="/login" element={<Login />} />
        ) : (
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/olt" element={<OLTManagement />} />
          </Route>
        )}
        <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  )
}

export default App