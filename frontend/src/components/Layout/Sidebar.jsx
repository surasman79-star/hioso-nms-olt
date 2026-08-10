import { Link, useLocation } from 'react-router-dom'

const menuItems = [
  {label: 'Dashboard', path: '/dashboard'},
  {label: 'Perangkat OLT', path: '/olt'},
  {label: 'Manajemen ONU/ONT', path: '/onu'},
  {label: 'Alarm & Kejadian', path: '/alarms'},
  {label: 'AI Diagnosa', path: '/ai-diagnosis'}
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="w-64 bg-slate-800 border-r border-slate-700 p-6 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><span>📡</span> NetMonitor</h1>
        <p className="text-slate-400 text-xs mt-1">OLT NMS v3.2</p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition duration-200 ${isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`}>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}