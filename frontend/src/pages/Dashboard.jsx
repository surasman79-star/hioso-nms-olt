import { useEffect, useState } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import monitoringService from '../services/monitoring'
import StatCard from '../components/Dashboard/StatCard'

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null)
  const [trafficData, setTrafficData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [dashboard, traffic] = await Promise.all([
        monitoringService.getDashboard(),
        monitoringService.getTraffic()
      ])
      setDashboardData(dashboard)
      setTrafficData(traffic)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div></div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Monitoring OLT & Optik Fiber NMS</h1>
        <p className="text-slate-400">System pengawasan status OLT, SFP Transceiver, Redaman Optik ONU secara real-time</p>
      </div>

      {dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <StatCard title="Total Perangkat OLT" value={dashboardData.totalOlts} subtitle={`${dashboardData.onlineOlts} Online`} />
          <StatCard title="ONU/ONT Pelanggan" value={dashboardData.totalOnus} subtitle={`${dashboardData.onlineOnus} Online`} />
          <StatCard title="Traffic OLT Total" value="3.46 Gbps" subtitle="Uplink 10GE" />
          <StatCard title="Alarm Aktif" value={dashboardData.activeAlarms} subtitle="Events" />
          <StatCard title="Status" value="LIVE" subtitle={new Date().toLocaleTimeString()} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <h2 className="text-xl font-bold text-white mb-4">Grafik Traffic Bandwidth OLT (24 Jam)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{backgroundColor: '#1e293b', border: 'none'}} />
              <Legend />
              <Line type="monotone" dataKey="download_mbps" stroke="#3b82f6" name="Download" strokeWidth={2} />
              <Line type="monotone" dataKey="upload_mbps" stroke="#a855f7" name="Upload" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold text-white mb-4">Kualitas Sinyal Optik ONU</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={[{name: 'Good', value: 8}, {name: 'Warning', value: 1}]} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value">
                <Cell fill="#10b981" />
                <Cell fill="#f59e0b" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 text-center">
            <div className="text-3xl font-bold text-green-400">9</div>
            <div className="text-slate-400">Total ONU</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold text-white mb-4">Daftar Perangkat ONU/ONT & Parameter Optik</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="px-4 py-3 text-left text-slate-300">INDEX</th>
                <th className="px-4 py-3 text-left text-slate-300">STATUS</th>
                <th className="px-4 py-3 text-center text-slate-300">RX POWER</th>
                <th className="px-4 py-3 text-center text-slate-300">TX POWER</th>
                <th className="px-4 py-3 text-center text-slate-300">TEMP</th>
                <th className="px-4 py-3 text-center text-slate-300">VOLTAGE</th>
              </tr>
            </thead>
            <tbody>
              {[{index: '1.1.1', status: 'online', rx: '-16.2', tx: '2.89', temp: '53.7', voltage: '3.32'}, {index: '1.1.2', status: 'online', rx: '-18.96', tx: '2.83', temp: '29.0', voltage: '3.22'}].map((row) => (
                <tr key={row.index} className="border-b border-slate-700">
                  <td className="px-4 py-3 text-blue-400">{row.index}</td>
                  <td className="px-4 py-3"><span className="badge badge-success">{row.status}</span></td>
                  <td className="px-4 py-3 text-center text-orange-400">{row.rx} dBm</td>
                  <td className="px-4 py-3 text-center text-green-400">{row.tx} dBm</td>
                  <td className="px-4 py-3 text-center">{row.temp}°C</td>
                  <td className="px-4 py-3 text-center">{row.voltage}V</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}