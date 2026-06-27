import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import AdminLayout from '../../components/AdminLayout'

const CATEGORIES = ['General Physician', 'Cardiologist', 'Dermatologist', 'Orthopedic']

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', category: 'General Physician', specialization: '', experience: '' })
  const [loading, setLoading] = useState(false)
  const { token } = useAuth()

  useEffect(() => {
    axios.get('https://docassign-backend.onrender.com/api/doctors', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setDoctors(res.data))
  }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post('https://docassign-backend.onrender.com/api/doctors', form, { headers: { Authorization: `Bearer ${token}` } })
      const res = await axios.get('https://docassign-backend.onrender.com/api/doctors', { headers: { Authorization: `Bearer ${token}` } })
      setDoctors(res.data)
      setForm({ name: '', email: '', password: '', category: 'General Physician', specialization: '', experience: '' })
      setShowForm(false)
    } catch (e) { alert(e.response?.data?.error || 'Failed') }
    setLoading(false)
  }

  const categoryColor = (c) => ({
    'General Physician': 'bg-blue-100 text-blue-700',
    'Cardiologist': 'bg-red-100 text-red-700',
    'Dermatologist': 'bg-pink-100 text-pink-700',
    'Orthopedic': 'bg-orange-100 text-orange-700',
  }[c] || 'bg-gray-100 text-gray-700')

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Doctors</h2>
          <p className="text-gray-400 text-sm">{doctors.length} doctors registered</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700"
        >
          + Add Doctor
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h3 className="font-bold text-gray-800 mb-4">Add New Doctor</h3>
          <form onSubmit={handleAdd} className="grid grid-cols-2 gap-4">
            <input placeholder="Doctor Name" className="border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            <input placeholder="Email" type="email" className="border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            <input placeholder="Password" type="password" className="border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
            <select className="border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <input placeholder="Specialization" className="border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400" value={form.specialization} onChange={e => setForm({...form, specialization: e.target.value})} required />
            <input placeholder="Experience (years)" type="number" className="border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400" value={form.experience} onChange={e => setForm({...form, experience: e.target.value})} required />
            <div className="col-span-2 flex gap-3">
              <button type="submit" disabled={loading} className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50">
                {loading ? 'Adding...' : 'Add Doctor'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 border border-gray-200 rounded-lg font-semibold text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {doctors.map(d => (
          <div key={d.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-teal-700 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">{d.name?.split(' ').map(n => n[0]).join('').slice(0,2)}</span>
              </div>
              <div>
                <p className="font-bold text-gray-800">{d.name}</p>
                <p className="text-xs text-gray-400">MBBS</p>
              </div>
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase ${categoryColor(d.category)}`}>
              {d.category}
            </span>
            <div className="mt-3 space-y-1 text-sm text-gray-500">
              <div className="flex justify-between">
                <span>Experience</span>
                <span className="font-medium">{d.experience} yrs</span>
              </div>
              <div className="flex justify-between">
                <span>Specialization</span>
                <span className="font-medium text-right text-xs">{d.specialization}</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-50">
              <span className={`text-xs px-2 py-1 rounded-full ${d.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {d.available ? '● Available' : '○ Unavailable'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  )
}
