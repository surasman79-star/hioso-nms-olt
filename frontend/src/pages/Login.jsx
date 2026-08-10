import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import authService from '../services/auth'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setToken, setUser } = useAuthStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await authService.login({ username, password })
      setToken(response.token)
      setUser(response.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">NetMonitor OLT NMS</h1>
            <p className="text-slate-400">Login ke sistem monitoring</p>
          </div>

          {error && <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded text-red-200 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" required />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg">{loading ? 'Logging in...' : 'Login'}</button>
          </form>
        </div>
      </div>
    </div>
  )
}