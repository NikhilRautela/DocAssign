import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, form)
      login(res.data.user, res.data.token)
      const role = res.data.user.role
      if (role === 'PATIENT') navigate('/patient/dashboard')
      else if (role === 'ADMIN') navigate('/admin/dashboard')
      else navigate('/doctor/dashboard')
    } catch (e) {
      setError('Invalid email or password')
    }
    setLoading(false)
  }

  const fillCredentials = (email, password) => {
    setForm({ email, password })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-500 rounded-2xl mb-4 shadow-lg">
            <span className="text-2xl">🏥</span>
          </div>
          <h1 className="text-3xl font-bold text-white">DocAssign</h1>
          <p className="text-indigo-300 mt-1">AI Doctor Routing System</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-1">Sign in</h2>
          <p className="text-gray-400 text-sm mb-6">Enter your credentials to continue</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                type="email"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800"
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-center mt-4 text-gray-500 text-sm">
            New patient?{' '}
            <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
              Create account
            </Link>
          </p>

          {/* Test Credentials */}
          <div className="mt-6 border-t border-gray-100 pt-4">
            <p className="text-xs text-gray-400 text-center mb-3">Test credentials</p>
            <div className="space-y-2">
              {[
                { role: 'Admin', email: 'admin@docassign.com', password: 'admin123', color: 'indigo' },
                { role: 'Doctor', email: 'ortho@docassign.com  ', password: 'doctor123', color: 'green' },
                { role: 'Patient', email: 'patient@docassign.com', password: 'patient123', color: 'blue' },
              ].map(({ role, email, password, color }) => (
                <button
                  key={role}
                  onClick={() => fillCredentials(email, password)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-${color}-100 text-${color}-700`}>
                      {role}
                    </span>
                    <span className="text-xs text-gray-500">{email}</span>
                  </div>
                  <span className="text-xs text-gray-400">{password}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
