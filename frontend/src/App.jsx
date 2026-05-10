import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AdminLayout, { RequireAdmin } from './components/AdminLayout'
import Home from './pages/Home'
import Stewardship from './pages/Stewardship'
import About from './pages/About'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminSprings from './pages/admin/AdminSprings'
import AdminParticipants from './pages/admin/AdminParticipants'
import AdminLogs from './pages/admin/AdminLogs'

export default function App() {
  return (
    <Routes>
      {/* Admin routes — no public navbar/footer */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/*" element={
        <RequireAdmin>
          <AdminLayout>
            <Routes>
              <Route index element={<AdminDashboard />} />
              <Route path="springs" element={<AdminSprings />} />
              <Route path="participants" element={<AdminParticipants />} />
              <Route path="logs" element={<AdminLogs />} />
            </Routes>
          </AdminLayout>
        </RequireAdmin>
      } />

      {/* Public routes */}
      <Route path="/*" element={
        <div className="app">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/stewardship" element={<Stewardship />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
          <Footer />
        </div>
      } />
    </Routes>
  )
}
