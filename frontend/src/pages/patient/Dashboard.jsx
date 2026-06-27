import { useAuth } from '../../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function PatientDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-600">DocAssign</h1>
        <button onClick={handleLogout} className="text-red-500 hover:text-red-700">Logout</button>
      </nav>
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Welcome, {user?.patientProfile?.name || 'Patient'}!</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/patient/upload-report" className="bg-indigo-600 text-white rounded-xl p-6 hover:bg-indigo-700 transition">
            <h3 className="text-xl font-bold mb-2">Upload Report</h3>
            <p className="opacity-80">Upload prescription or medical report for AI analysis</p>
          </Link>
          <Link to="/patient/reports" className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
            <h3 className="text-xl font-bold mb-2 text-gray-800">My Reports</h3>
            <p className="text-gray-500">View all your uploaded reports and doctor assignments</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
