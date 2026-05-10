import { useEffect, useState } from 'react'

const empty = { first_name: '', last_name: '', email: '', phone: '', status: 'active' }

export default function AdminParticipants() {
  const [participants, setParticipants] = useState([])
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)

  function load() {
    fetch('/api/participants/').then(r => r.json()).then(setParticipants)
  }

  useEffect(load, [])

  async function handleSubmit(e) {
    e.preventDefault()
    const url = editing ? `/api/participants/${editing}` : '/api/participants/'
    const method = editing ? 'PATCH' : 'POST'
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setForm(empty); setEditing(null); setShowForm(false); load()
  }

  async function handleDelete(id) {
    if (!confirm('Remove this participant?')) return
    await fetch(`/api/participants/${id}`, { method: 'DELETE' })
    load()
  }

  function startEdit(p) {
    setForm({ first_name: p.first_name, last_name: p.last_name, email: p.email, phone: p.phone || '', status: p.status })
    setEditing(p.id); setShowForm(true)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={h1}>Participants</h1>
        <button className="btn btn-teal" onClick={() => { setForm(empty); setEditing(null); setShowForm(true) }}>+ Add Participant</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
          <h2 style={{ color: 'var(--teal-dark)', marginBottom: '1rem', fontSize: '1.1rem' }}>{editing ? 'Edit Participant' : 'New Participant'}</h2>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <label>
              <span style={lbl}>First Name *</span>
              <input style={inp} required value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} />
            </label>
            <label>
              <span style={lbl}>Last Name *</span>
              <input style={inp} required value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} />
            </label>
            <label>
              <span style={lbl}>Email *</span>
              <input style={inp} type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </label>
            <label>
              <span style={lbl}>Phone</span>
              <input style={inp} type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </label>
            <label>
              <span style={lbl}>Status</span>
              <select style={inp} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
              <button className="btn btn-teal" type="submit">{editing ? 'Save Changes' : 'Add Participant'}</button>
              <button className="btn" type="button" style={{ background: 'var(--cream)', color: 'var(--teal-dark)' }} onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--cream)' }}>
              {['Name', 'Email', 'Phone', 'Status', 'Actions'].map(h => (
                <th key={h} style={th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {participants.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>No participants yet.</td></tr>
            )}
            {participants.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={td}><strong>{p.first_name} {p.last_name}</strong></td>
                <td style={td}>{p.email}</td>
                <td style={td}>{p.phone || '—'}</td>
                <td style={td}><span style={badge(p.status)}>{p.status}</span></td>
                <td style={td}>
                  <button onClick={() => startEdit(p)} style={actionBtn}>Edit</button>
                  <button onClick={() => handleDelete(p.id)} style={{ ...actionBtn, color: '#c0392b' }}>Delete</button>
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
  background: status === 'active' ? '#d4efdf' : '#f2f3f4',
  color: status === 'active' ? '#1e8449' : '#666',
})
