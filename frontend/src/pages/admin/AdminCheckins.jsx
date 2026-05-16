import { useEffect, useState } from 'react'

export default function AdminCheckins() {
  const [checkins, setCheckins] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [issueOnly, setIssueOnly] = useState(false)

  useEffect(() => {
    fetch('/api/checkins/')
      .then(r => r.json())
      .then(data => { setCheckins(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = checkins
    .filter(c => !issueOnly || c.is_issue)
    .filter(c =>
      !filter ||
      c.spring_name.toLowerCase().includes(filter.toLowerCase()) ||
      (c.visitor_name || '').toLowerCase().includes(filter.toLowerCase())
    )

  return (
    <div>
      <h1 style={h1}>Public Check-ins</h1>

      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <input
          style={filterInput}
          placeholder="Filter by spring or visitor name…"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={issueOnly} onChange={e => setIssueOnly(e.target.checked)}
            style={{ accentColor: 'var(--teal)', width: 16, height: 16 }} />
          Issues only
        </label>
        <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          {filtered.length} record{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading…</p>
        ) : filtered.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No check-ins found.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Spring</th>
                  <th>Visitor</th>
                  <th>Actions</th>
                  <th>Issue</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id} style={c.is_issue ? { background: '#fff8f0' } : {}}>
                    <td style={{ whiteSpace: 'nowrap' }}>{c.visit_date}</td>
                    <td style={{ fontWeight: 500 }}>{c.spring_name}</td>
                    <td>{c.visitor_name || <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                    <td style={{ fontSize: '0.82rem', maxWidth: 220 }}>
                      {c.actions?.length ? c.actions.join(', ') : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                    </td>
                    <td>{c.is_issue ? '⚠️ Yes' : '—'}</td>
                    <td style={{ maxWidth: 200, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {c.notes || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

const h1 = { fontSize: '1.6rem', color: 'var(--teal-dark)', marginBottom: '1.5rem' }
const filterInput = {
  padding: '0.5rem 0.75rem',
  border: '1px solid #cdd8dc',
  borderRadius: 6,
  width: 280,
  fontSize: '0.9rem',
  fontFamily: 'inherit',
}
