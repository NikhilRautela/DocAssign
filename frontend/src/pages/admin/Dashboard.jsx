import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'
import axios from 'axios'
import AdminLayout from '../../components/AdminLayout'

export default function AdminDashboard() {
  const { token } = useAuth()
  const [stats, setStats] = useState({ patients: 0, reports: 0, assigned: 0, pending: 0 })
  const [reports, setReports] = useState([])

  useEffect(() => {
    axios.get('https://docassign-backend.onrender.com/api/admin/reports', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        const data = res.data
        setReports(data.slice(0, 5))
        setStats(s => ({
          ...s,
          reports: data.length,
          assigned: data.filter(r => r.status === 'ASSIGNED').length,
          pending: data.filter(r => r.status === 'PENDING').length,
        }))
      })
    axios.get('https://docassign-backend.onrender.com/api/admin/patients', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setStats(s => ({ ...s, patients: res.data.length })))
  }, [])

  const statusColor = (s) => ({
    PENDING: 'bg-yellow-100 text-yellow-700',
    ASSIGNED: 'bg-blue-100 text-blue-700',
    REVIEWED: 'bg-green-100 text-green-700'
  }[s] || 'bg-gray-100 text-gray-700')

  const urgencyColor = (u) => ({
    LOW: 'text-green-600',
    MEDIUM: 'text-yellow-600',
    HIGH: 'text-red-600'
  }[u] || 'text-gray-600')

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-gray-400 text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <Link to="/admin/reports" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700">
          View all reports →
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Patients', value: stats.patients, icon: '👥' },
          { label: 'Total Reports', value: stats.reports, icon: '📋' },
          { label: 'Assigned', value: stats.assigned, icon: '✅' },
          { label: 'Pending Review', value: stats.pending, icon: '⏳' },
        ].map(({ label, value, icon }) => (
          <div key={label} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="text-2xl mb-3">{icon}</div>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
            <p className="text-sm text-gray-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent Reports Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">Recent Reports</h3>
          <Link to="/admin/reports" className="text-sm text-indigo-600 hover:underline">View all →</Link>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-xs text-gray-400 uppercase border-b border-gray-100">
              <th className="text-left pb-3">Patient</th>
              <th className="text-left pb-3">Category</th>
              <th className="text-left pb-3">Status</th>
              <th className="text-left pb-3">Urgency</th>
              <th className="text-left pb-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {reports.map(r => (
              <tr key={r.id} className="text-sm">
                <td className="py-3">
                  <p className="font-medium text-gray-800">{r.patientProfile?.name}</p>
                  <p className="text-xs text-gray-400">{r.filePath?.split('\\').pop() || 'Manual entry'}</p>
                </td>
                <td className="py-3 text-indigo-600 font-medium">{r.aiAnalysis?.suggestedCategory || 'Pending'}</td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(r.status)}`}>{r.status}</span>
                </td>
                <td className="py-3">
                  <span className={`text-xs font-medium ${urgencyColor(r.aiAnalysis?.urgency)}`}>• {r.aiAnalysis?.urgency || 'N/A'}</span>
                </td>
                <td className="py-3 text-gray-400 text-xs">{new Date(r.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {reports.length === 0 && (
              <tr><td colSpan={5} className="py-8 text-center text-gray-400">No reports yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Manage Patients', desc: 'View all patient profiles and reports', path: '/admin/patients', icon: '👥' },
          { label: 'Manage Doctors', desc: 'Add, edit and configure doctor profiles', path: '/admin/doctors', icon: '🩺' },
          { label: 'All Reports', desc: 'Review, reassign and manage every report', path: '/admin/reports', icon: '📋' },
        ].map(({ label, desc, path, icon }) => (
          <Link key={path} to={path} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition">
            <span className="text-2xl mb-2 block">{icon}</span>
            <p className="font-semibold text-gray-800 text-sm">{label}</p>
            <p className="text-xs text-gray-400 mt-1">{desc}</p>
          </Link>
        ))}
      </div>
    </AdminLayout>
  )
}
