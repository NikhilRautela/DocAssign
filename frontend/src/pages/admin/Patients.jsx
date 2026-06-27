import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import AdminLayout from '../../components/AdminLayout'

export default function AdminPatients() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/patients', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => { setPatients(res.data); setLoading(false) })
  }, [])

  return (
    <AdminLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Patients</h2>
        <p className="text-gray-400 text-sm">{patients.length} patients registered</p>
      </div>
      {loading ? <p>Loading...</p> : patients.length === 0 ? (
        <div className="text-center py-12 text-gray-400 bg-white rounded-2xl">No patients yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {patients.map(p => (
            <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-bold">{p.name?.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-bold text-gray-800">{p.name}</p>
                  <p className="text-sm text-gray-400">{p.user?.email}</p>
                </div>
              </div>
              <div className="flex gap-4 text-sm text-gray-500 border-t border-gray-50 pt-3">
                <span>Age: <b>{p.age}</b></span>
                <span>Gender: <b>{p.gender}</b></span>
                <span>📞 {p.phone}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}