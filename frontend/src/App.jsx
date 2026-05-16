import { Routes, Route } from 'react-router-dom'
import AdminLayout, { RequireAdmin } from './components/AdminLayout'
import Home from './pages/Home'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminSprings from './pages/admin/AdminSprings'
import AdminParticipants from './pages/admin/AdminParticipants'
import AdminLogs from './pages/admin/AdminLogs'
import AdminCheckins from './pages/admin/AdminCheckins'

export default function App() {
  return (
    <Routes>
      {/* Admin routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/*" element={
        <RequireAdmin>
          <AdminLayout>
            <Routes>
              <Route index element={<AdminDashboard />} />
              <Route path="springs" element={<AdminSprings />} />
              <Route path="participants" element={<AdminParticipants />} />
              <Route path="logs" element={<AdminLogs />} />
              <Route path="checkins" element={<AdminCheckins />} />
            </Routes>
          </AdminLayout>
        </RequireAdmin>
      } />

      {/* Public check-in app */}
      <Route path="*" element={<Home />} />
    </Routes>
  )
}
