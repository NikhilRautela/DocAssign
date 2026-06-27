import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'

export default function MyReports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    axios.get('https://docassign-backend.onrender.com/api/reports/my', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => { setReports(res.data); setLoading(false) })
  }, [])

  const statusColor = (s) => ({
    PENDING: 'bg-yellow-100 text-yellow-700',
    ASSIGNED: 'bg-blue-100 text-blue-700',
    REVIEWED: 'bg-green-100 text-green-700'
  }[s] || 'bg-gray-100 text-gray-700')

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-600">DocAssign</h1>
        <button onClick={() => navigate('/patient/dashboard')} className="text-gray-500 hover:text-gray-700">← Back</button>
      </nav>
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">My Reports</h2>
        {loading ? <p>Loading...</p> : reports.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No reports yet. Upload your first report!</div>
        ) : (
          <div className="space-y-4">
            {reports.map(report => (
              <div key={report.id} className="bg-white rounded-xl shadow p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-gray-800">{report.symptoms}</p>
                    <p className="text-sm text-gray-400">{new Date(report.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor(report.status)}`}>
                    {report.status}
                  </span>
                </div>
                {report.aiAnalysis && (
                  <div className="bg-indigo-50 rounded-lg p-3 mb-3">
                    <p className="text-sm font-medium text-indigo-700">AI Suggested: {report.aiAnalysis.suggestedCategory}</p>
                    <p className="text-xs text-indigo-500">{report.aiAnalysis.reason}</p>
                  </div>
                )}
                {report.assignment?.doctor && (
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-sm font-medium text-green-700">Assigned Doctor: {report.assignment.doctor.name}</p>
                    <p className="text-xs text-green-500">{report.assignment.doctor.specialization}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
