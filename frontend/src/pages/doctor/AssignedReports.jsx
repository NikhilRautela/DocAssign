import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function AssignedReports() {
  const [assignments, setAssignments] = useState([])
  const { token } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    axios.get('https://docassign-backend.onrender.com/api/doctor/reports', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setAssignments(res.data))
  }, [])

  const markReviewed = async (reportId) => {
    await axios.patch(`https://docassign-backend.onrender.com/api/doctor/reports/${reportId}/mark-reviewed`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const res = await axios.get('https://docassign-backend.onrender.com/api/doctor/reports', { headers: { Authorization: `Bearer ${token}` } })
    setAssignments(res.data)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-600">DocAssign</h1>
        <button onClick={() => navigate('/doctor/dashboard')} className="text-gray-500">← Back</button>
      </nav>
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Assigned Reports</h2>
        {assignments.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No reports assigned yet.</div>
        ) : (
          <div className="space-y-4">
            {assignments.map(a => (
              <div key={a.id} className="bg-white rounded-xl shadow p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold">{a.report?.patientProfile?.name}</p>
                    <p className="text-sm text-gray-500">{a.report?.symptoms}</p>
                    <p className="text-xs text-gray-400">{new Date(a.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${a.status === 'REVIEWED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {a.status}
                  </span>
                </div>
                {a.report?.aiAnalysis && (
                  <div className="bg-indigo-50 rounded-lg p-3 mb-3">
                    <p className="text-sm font-medium text-indigo-700">AI Routing: {a.report.aiAnalysis.suggestedCategory}</p>
                    <p className="text-xs text-indigo-500">{a.report.aiAnalysis.reason}</p>
                  </div>
                )}
                {a.report?.transcript && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-xs font-medium text-gray-500 mb-1">Report Transcript</p>
                    <p className="text-sm text-gray-700">{a.report.transcript}</p>
                  </div>
                )}
                {a.status !== 'REVIEWED' && (
                  <button onClick={() => markReviewed(a.report.id)} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700">
                    Mark as Reviewed
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
