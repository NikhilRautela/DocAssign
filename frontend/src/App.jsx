import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import PatientDashboard from './pages/patient/Dashboard'
import UploadReport from './pages/patient/UploadReport'
import MyReports from './pages/patient/MyReports'
import AdminDashboard from './pages/admin/Dashboard'
import AdminReports from './pages/admin/Reports'
import AdminDoctors from './pages/admin/Doctors'
import DoctorDashboard from './pages/doctor/Dashboard'
import AssignedReports from './pages/doctor/AssignedReports'
import AdminPatients from './pages/admin/Patients'

function ProtectedRoute({ children, roles }) {
  const { user, token } = useAuth()
  if (!token) return <Navigate to="/login" />
  if (roles && !roles.includes(user?.role)) return <Navigate to="/login" />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/patient/dashboard" element={<ProtectedRoute roles={['PATIENT']}><PatientDashboard /></ProtectedRoute>} />
      <Route path="/patient/upload-report" element={<ProtectedRoute roles={['PATIENT']}><UploadReport /></ProtectedRoute>} />
      <Route path="/patient/reports" element={<ProtectedRoute roles={['PATIENT']}><MyReports /></ProtectedRoute>} />
      
      <Route path="/admin/dashboard" element={<ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute roles={['ADMIN']}><AdminReports /></ProtectedRoute>} />
      <Route path="/admin/doctors" element={<ProtectedRoute roles={['ADMIN']}><AdminDoctors /></ProtectedRoute>} />
      
      <Route path="/doctor/dashboard" element={<ProtectedRoute roles={['DOCTOR']}><DoctorDashboard /></ProtectedRoute>} />
      <Route path="/doctor/assigned-reports" element={<ProtectedRoute roles={['DOCTOR']}><AssignedReports /></ProtectedRoute>} />
      <Route path="/admin/patients" element={<ProtectedRoute roles={['ADMIN']}><AdminPatients /></ProtectedRoute>} />
    </Routes>
  )
}