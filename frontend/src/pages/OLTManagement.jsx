import { useState, useEffect } from 'react'
import oltService from '../services/olt'

export default function OLTManagement() {
  const [olts, setOlts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({hostname: '', ip_address: '', vendor: '', model: ''})

  useEffect(() => {
    fetchOLTs()
  }, [])

  const fetchOLTs = async () => {
    try {
      const data = await oltService.getAll()
      setOlts(data)
    } catch (error) {
      console.error('Failed to fetch OLTs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await oltService.create(formData)
      setFormData({hostname: '', ip_address: '', vendor: '', model: ''})
      setShowForm(false)
      fetchOLTs()
    } catch (error) {
      console.error('Failed to create OLT:', error)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Perangkat OLT</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">+ Tambah OLT</button>
      </div>

      {showForm && (
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Hostname" value={formData.hostname} onChange={(e) => setFormData({...formData, hostname: e.target.value})} className="px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white" required />
              <input type="text" placeholder="IP Address" value={formData.ip_address} onChange={(e) => setFormData({...formData, ip_address: e.target.value})} className="px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white" required />
              <input type="text" placeholder="Vendor" value={formData.vendor} onChange={(e) => setFormData({...formData, vendor: e.target.value})} className="px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white" />
              <input type="text" placeholder="Model" value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} className="px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white" />
            </div>
            <button type="submit" className="btn btn-primary">Save</button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {olts.map(olt => (
          <div key={olt.id} className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">{olt.hostname}</h3>
                <p className="text-slate-400 text-sm">{olt.ip_address}</p>
              </div>
              <span className={`badge ${olt.status === 'online' ? 'badge-success' : 'badge-warning'}`}>{olt.status}</span>
            </div>
            <div className="space-y-2 text-sm text-slate-400">
              <p><strong>Vendor:</strong> {olt.vendor || '-'}</p>
              <p><strong>Model:</strong> {olt.model || '-'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}