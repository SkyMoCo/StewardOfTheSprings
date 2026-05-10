import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Invalid credentials')
      const data = await res.json()
      localStorage.setItem('admin_token', data.token)
      localStorage.setItem('admin_user', data.username)
      navigate('/admin')
    } catch {
      setError('Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)' }}>
      <div className="card" style={{ width: 360, padding: '2.5rem' }}>
        <h2 style={{ color: 'var(--teal-dark)', marginBottom: '0.25rem' }}>Admin Login</h2>
        <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Stewards of the Springs</p>
        {error && <div style={errorStyle}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label>
            <span style={labelStyle}>Username</span>
            <input style={inputStyle} type="text" required autoFocus
              value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
          </label>
          <label>
            <span style={labelStyle}>Password</span>
            <input style={inputStyle} type="password" required
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          </label>
          <button className="btn btn-teal" type="submit" disabled={loading} style={{ marginTop: '0.5rem' }}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

const labelStyle = { display: 'block', fontWeight: 600, marginBottom: '0.3rem', fontSize: '0.9rem' }
const inputStyle = { width: '100%', padding: '0.6rem 0.8rem', border: '1px solid #cdd8dc', borderRadius: '6px', fontSize: '1rem', fontFamily: 'inherit' }
const errorStyle = { background: '#fde8e8', color: '#c0392b', padding: '0.6rem 0.8rem', borderRadius: '6px', fontSize: '0.9rem', marginBottom: '0.5rem' }
