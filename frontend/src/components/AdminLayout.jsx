import { useAuth } from '../context/AuthContext'
import { useNavigate, Link, useLocation } from 'react-router-dom'

export default function AdminLayout({ children }) {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col fixed h-full">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">DA</span>
            </div>
            <div>
              <p className="font-bold text-gray-800">DocAssign</p>
              <p className="text-xs text-indigo-500">AI Doctor Routing</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <p className="text-xs font-semibold text-gray-400 uppercase px-3 mb-2">Navigation</p>
          {[
            { icon: '📊', label: 'Dashboard', path: '/admin/dashboard' },
            { icon: '👥', label: 'Patients', path: '/admin/patients' },
            { icon: '📋', label: 'Reports', path: '/admin/reports' },
            { icon: '🩺', label: 'Doctors', path: '/admin/doctors' },
          ].map(({ icon, label, path }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                location.pathname === path
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>{icon}</span>
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-600 font-bold text-sm">A</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Admin</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate('/login') }}
            className="w-full text-left text-sm text-red-500 hover:text-red-700 px-2 py-1"
          >
            → Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8">
        {children}
      </div>
    </div>
  )
}
