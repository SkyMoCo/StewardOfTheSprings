import { useEffect, useState } from 'react'

export default function AdminLogs() {
  const [logs, setLogs] = useState([])

  useEffect(() => {
    fetch('/api/logs/').then(r => r.json()).then(setLogs)
  }, [])

  return (
    <div>
      <h1 style={h1}>Visit Logs</h1>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--cream)' }}>
              {['Date', 'Spring', 'Participant', 'Conditions', 'Notes'].map(h => (
                <th key={h} style={th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>No visit logs yet.</td></tr>
            )}
            {logs.map(l => (
              <tr key={l.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={td}>{l.visit_date}</td>
                <td style={td}>Spring #{l.spring_id}</td>
                <td style={td}>Participant #{l.participant_id}</td>
                <td style={td}>{l.conditions_observed || '—'}</td>
                <td style={{ ...td, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.notes || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const h1 = { fontSize: '1.6rem', color: 'var(--teal-dark)', marginBottom: '1.5rem' }
const th = { padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 600 }
const td = { padding: '0.85rem 1rem', fontSize: '0.9rem', verticalAlign: 'middle' }
