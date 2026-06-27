import { useAuth } from '../../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function DoctorDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-600">DocAssign</h1>
        <button onClick={() => { logout(); navigate('/login') }} className="text-red-500">Logout</button>
      </nav>
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-2">Dr. {user?.doctorProfile?.name}</h2>
        <p className="text-indigo-600 mb-6">{user?.doctorProfile?.category}</p>
        <Link to="/doctor/assigned-reports" className="block bg-indigo-600 text-white rounded-xl p-6 hover:bg-indigo-700 transition max-w-sm">
          <h3 className="text-xl font-bold mb-2">Assigned Reports</h3>
          <p className="opacity-80">View and review patient reports assigned to you</p>
        </Link>
      </div>
    </div>
  )
}