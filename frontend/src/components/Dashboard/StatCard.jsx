export default function StatCard({title, value, subtitle}) {
  return (
    <div className="card bg-blue-900 border-blue-700">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-300 text-xs font-medium uppercase">{title}</p>
          <p className="text-2xl font-bold text-white mt-2">{value}</p>
          <p className="text-slate-400 text-xs mt-2">{subtitle}</p>
        </div>
      </div>
    </div>
  )
}