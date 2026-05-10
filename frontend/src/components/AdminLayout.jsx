import { NavLink, useNavigate, Navigate } from 'react-router-dom'

export function useAdmin() {
  return localStorage.getItem('admin_token')
}

export function RequireAdmin({ children }) {
  if (!localStorage.getItem('admin_token')) return <Navigate to="/admin/login" replace />
  return children
}

export default function AdminLayout({ children }) {
  const navigate = useNavigate()

  function logout() {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    navigate('/admin/login')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={sidebarStyle}>
        <div style={{ padding: '1.5rem 1rem 1rem' }}>
          <div style={{ color: 'var(--teal-light)', fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>
            SOS Admin
          </div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
            {localStorage.getItem('admin_user')}
          </div>
        </div>
        <nav style={{ flex: 1 }}>
          {navItems.map(({ to, label, icon }) => (
            <NavLink key={to} to={to} end={to === '/admin'}
              style={({ isActive }) => ({ ...navLinkStyle, background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent' })}>
              <span style={{ marginRight: '0.6rem' }}>{icon}</span>{label}
            </NavLink>
          ))}
        </nav>
        <button onClick={logout} style={logoutStyle}>Sign Out</button>
      </aside>
      <main style={{ flex: 1, padding: '2rem', background: '#f8fafa', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  )
}

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: '📊' },
  { to: '/admin/springs', label: 'Springs', icon: '♨️' },
  { to: '/admin/participants', label: 'Participants', icon: '👥' },
  { to: '/admin/logs', label: 'Visit Logs', icon: '📋' },
  { to: '/admin/milestones', label: 'Milestones', icon: '🏆' },
]

const sidebarStyle = {
  width: 220, background: 'var(--teal-dark)', color: 'white',
  display: 'flex', flexDirection: 'column', flexShrink: 0,
}
const navLinkStyle = {
  display: 'flex', alignItems: 'center', padding: '0.7rem 1.2rem',
  color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.95rem',
  transition: 'background 0.15s',
}
const logoutStyle = {
  margin: '1rem', padding: '0.5rem', background: 'transparent',
  border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px',
  color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '0.85rem',
}
