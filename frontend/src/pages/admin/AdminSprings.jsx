import { useEffect, useState } from 'react'

const empty = { name: '', region: '', latitude: '', longitude: '', description: '', status: 'active' }

export default function AdminSprings() {
  const [springs, setSprings] = useState([])
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)

  function load() {
    fetch('/api/springs/').then(r => r.json()).then(setSprings)
  }

  useEffect(load, [])

  async function handleSubmit(e) {
    e.preventDefault()
    const body = { ...form, latitude: form.latitude ? parseFloat(form.latitude) : null, longitude: form.longitude ? parseFloat(form.longitude) : null }
    const url = editing ? `/api/springs/${editing}` : '/api/springs/'
    const method = editing ? 'PATCH' : 'POST'
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    setForm(empty); setEditing(null); setShowForm(false); load()
  }

  async function handleDelete(id) {
    if (!confirm('Delete this spring?')) return
    await fetch(`/api/springs/${id}`, { method: 'DELETE' })
    load()
  }

  function startEdit(s) {
    setForm({ name: s.name, region: s.region || '', latitude: s.latitude || '', longitude: s.longitude || '', description: s.description || '', status: s.status })
    setEditing(s.id); setShowForm(true)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={h1}>Springs</h1>
        <button className="btn btn-teal" onClick={() => { setForm(empty); setEditing(null); setShowForm(true) }}>+ Add Spring</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
          <h2 style={{ color: 'var(--teal-dark)', marginBottom: '1rem', fontSize: '1.1rem' }}>{editing ? 'Edit Spring' : 'New Spring'}</h2>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <label style={{ gridColumn: '1/-1' }}>
              <span style={lbl}>Spring Name *</span>
              <input style={inp} required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </label>
            <label>
              <span style={lbl}>Region</span>
              <input style={inp} value={form.region} onChange={e => setForm({ ...form, region: e.target.value })} />
            </label>
            <label>
              <span style={lbl}>Status</span>
              <select style={inp} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="monitoring">Monitoring</option>
              </select>
            </label>
            <label>
              <span style={lbl}>Latitude</span>
              <input style={inp} type="number" step="any" value={form.latitude} onChange={e => setForm({ ...form, latitude: e.target.value })} />
            </label>
            <label>
              <span style={lbl}>Longitude</span>
              <input style={inp} type="number" step="any" value={form.longitude} onChange={e => setForm({ ...form, longitude: e.target.value })} />
            </label>
            <label style={{ gridColumn: '1/-1' }}>
              <span style={lbl}>Description</span>
              <textarea style={{ ...inp, height: 80, resize: 'vertical' }} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </label>
            <div style={{ gridColumn: '1/-1', display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-teal" type="submit">{editing ? 'Save Changes' : 'Add Spring'}</button>
              <button className="btn" type="button" style={{ background: 'var(--cream)', color: 'var(--teal-dark)' }} onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--cream)' }}>
              {['Name', 'Region', 'Status', 'Coordinates', 'Actions'].map(h => (
                <th key={h} style={th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {springs.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>No springs yet. Add one above.</td></tr>
            )}
            {springs.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={td}><strong>{s.name}</strong></td>
                <td style={td}>{s.region || '—'}</td>
                <td style={td}><span style={badge(s.status)}>{s.status}</span></td>
                <td style={td}>{s.latitude ? `${s.latitude}, ${s.longitude}` : '—'}</td>
                <td style={td}>
                  <button onClick={() => startEdit(s)} style={actionBtn}>Edit</button>
                  <button onClick={() => handleDelete(s.id)} style={{ ...actionBtn, color: '#c0392b' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const h1 = { fontSize: '1.6rem', color: 'var(--teal-dark)' }
const lbl = { display: 'block', fontWeight: 600, marginBottom: '0.3rem', fontSize: '0.85rem' }
const inp = { width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #cdd8dc', borderRadius: '6px', fontSize: '0.95rem', fontFamily: 'inherit' }
const th = { padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 600 }
const td = { padding: '0.85rem 1rem', fontSize: '0.9rem', verticalAlign: 'middle' }
const actionBtn = { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--teal)', fontWeight: 600, fontSize: '0.85rem', marginRight: '0.5rem' }
const badge = status => ({
  padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 600,
  background: status === 'active' ? '#d4efdf' : status === 'monitoring' ? '#fdebd0' : '#f2f3f4',
  color: status === 'active' ? '#1e8449' : status === 'monitoring' ? '#ca6f1e' : '#666',
})
