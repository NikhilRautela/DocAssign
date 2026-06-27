import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'

export default function UploadReport() {
  const [form, setForm] = useState({ symptoms: '', manualTranscript: '' })
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const { token } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('symptoms', form.symptoms)
      formData.append('manualTranscript', form.manualTranscript)
      if (file) formData.append('report', file)
      const res = await axios.post('https://docassign-backend.onrender.com/api/reports/upload', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      })
      setResult(res.data)
    } catch (e) {
      setError(e.response?.data?.error || 'Upload failed')
    }
    setLoading(false)
  }

  if (result) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-800">Report Analyzed!</h2>
        </div>
        <div className="bg-indigo-50 rounded-xl p-4 mb-4">
          <p className="text-sm text-gray-500">Suggested Doctor</p>
          <p className="text-xl font-bold text-indigo-600">{result.analysis?.suggestedCategory}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <p className="text-sm text-gray-500">Reason</p>
          <p className="text-gray-700">{result.analysis?.reason}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/patient/reports')} className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700">
            View Reports
          </button>
          <button onClick={() => { setResult(null); setFile(null); setForm({ symptoms: '', manualTranscript: '' }) }} className="flex-1 border border-gray-200 py-3 rounded-lg font-semibold hover:bg-gray-50">
            Upload Another
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-600">DocAssign</h1>
        <button onClick={() => navigate('/patient/dashboard')} className="text-gray-500 hover:text-gray-700">← Back</button>
      </nav>
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Upload Medical Report</h2>
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms Description *</label>
            <textarea
              placeholder="Describe your symptoms..."
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 h-24"
              value={form.symptoms}
              onChange={e => setForm({...form, symptoms: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Report (PDF/Image)</label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={e => setFile(e.target.files[0])}
              className="w-full border border-gray-200 rounded-lg px-4 py-3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Or Paste Report Text Manually</label>
            <textarea
              placeholder="Paste report text here..."
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 h-24"
              value={form.manualTranscript}
              onChange={e => setForm({...form, manualTranscript: e.target.value})}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Upload & Analyze'}
          </button>
        </form>
      </div>
    </div>
  )
}
