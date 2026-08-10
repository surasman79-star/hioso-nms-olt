import { useAuthStore } from '../../store/authStore'
import { useNavigate } from 'react-router-dom'

export default function Header() {
  const { user, clearAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    clearAuth()
    navigate('/login')
  }

  return (
    <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-white text-sm font-medium">Monitoring OLT & Optik Fiber NMS</h2>
        <p className="text-slate-400 text-xs">System pengawasan real-time</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-white text-sm font-medium">{user?.username}</p>
          <p className="text-slate-400 text-xs">{user?.role}</p>
        </div>
        <button onClick={handleLogout} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm">Logout</button>
      </div>
    </header>
  )
}