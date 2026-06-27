import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import AdminLayout from '../../components/AdminLayout'

export default function AdminReports() {
  const [reports, setReports] = useState([])
  const [doctors, setDoctors] = useState([])
  const { token } = useAuth()

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/reports', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setReports(res.data))
    axios.get('http://localhost:5000/api/doctors', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setDoctors(res.data))
  }, [])

  const assignDoctor = async (reportId, doctorProfileId) => {
    await axios.patch(`http://localhost:5000/api/admin/reports/${reportId}/assign-doctor`,
      { doctorProfileId }, { headers: { Authorization: `Bearer ${token}` } })
    const res = await axios.get('http://localhost:5000/api/admin/reports', { headers: { Authorization: `Bearer ${token}` } })
    setReports(res.data)
  }

  const statusColor = (s) => ({
    PENDING: 'bg-yellow-100 text-yellow-700',
    ASSIGNED: 'bg-blue-100 text-blue-700',
    REVIEWED: 'bg-green-100 text-green-700'
  }[s] || 'bg-gray-100 text-gray-700')

  return (
    <AdminLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">All Reports</h2>
        <p className="text-gray-400 text-sm">{reports.length} total reports</p>
      </div>
      <div className="space-y-4">
        {reports.map(report => (
          <div key={report.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-bold">{report.patientProfile?.name?.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-bold text-gray-800">{report.patientProfile?.name}</p>
                  <p className="text-sm text-gray-400">{report.symptoms}</p>
                  <p className="text-xs text-gray-300">{new Date(report.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(report.status)}`}>
                {report.status}
              </span>
            </div>

            {report.aiAnalysis && (
              <div className="bg-indigo-50 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold text-indigo-700">🤖 AI: {report.aiAnalysis.suggestedCategory}</p>
                    <p className="text-xs text-indigo-500 mt-1">{report.aiAnalysis.reason}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-indigo-400">Confidence</p>
                    <p className="text-sm font-bold text-indigo-700">{Math.round(report.aiAnalysis.confidence * 100)}%</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">Source: {report.aiAnalysis.source}</p>
              </div>
            )}

            <div className="flex items-center gap-3">
              <select
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                onChange={e => e.target.value && assignDoctor(report.id, e.target.value)}
                defaultValue=""
              >
                <option value="">Manually assign doctor...</option>
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>{d.name} — {d.category}</option>
                ))}
              </select>
              {report.assignment?.doctor && (
                <span className="text-sm text-green-600 font-medium bg-green-50 px-3 py-2 rounded-lg">
                  ✓ {report.assignment.doctor.name}
                </span>
              )}
            </div>
          </div>
        ))}
        {reports.length === 0 && (
          <div className="text-center py-12 text-gray-400 bg-white rounded-2xl">No reports yet.</div>
        )}
      </div>
    </AdminLayout>
  )
}