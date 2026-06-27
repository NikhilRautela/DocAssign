import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '', name: '', age: '', gender: 'Male', phone: '' })
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', { ...form, role: 'PATIENT' })
      login(res.data.user, res.data.token)
      navigate('/patient/dashboard')
    } catch (e) {
      setError(e.response?.data?.error || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600">DocAssign</h1>
          <p className="text-gray-500 mt-2">Create Patient Account</p>
        </div>
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Full Name" className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <input type="email" placeholder="Email" className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          <input type="password" placeholder="Password" className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
          <input type="number" placeholder="Age" className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400" value={form.age} onChange={e => setForm({...form, age: e.target.value})} />
          <select className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          <input type="tel" placeholder="Phone" className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
            Register
          </button>
        </form>
        <p className="text-center mt-4 text-gray-500">
          Already have account? <Link to="/login" className="text-indigo-600 font-semibold">Login</Link>
        </p>
      </div>
    </div>
  )
}