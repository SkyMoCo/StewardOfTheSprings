import { useEffect, useState } from 'react'

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ springs: '-', participants: '-', logs: '-', milestones: '-', checkins: '-' })

  useEffect(() => {
    Promise.all([
      fetch('/api/springs/').then(r => r.json()),
      fetch('/api/participants/').then(r => r.json()),
      fetch('/api/logs/').then(r => r.json()),
      fetch('/api/milestones/').then(r => r.json()),
      fetch('/api/checkins/').then(r => r.json()),
    ]).then(([springs, participants, logs, milestones, checkins]) => {
      setCounts({
        springs: springs.length,
        participants: participants.length,
        logs: logs.length,
        milestones: milestones.length,
        checkins: checkins.length,
      })
    }).catch(() => {})
  }, [])

  const stats = [
    { label: 'Check-ins', value: counts.checkins, icon: '✅', color: 'var(--teal)' },
    { label: 'Springs', value: counts.springs, icon: '♨️', color: 'var(--green)' },
    { label: 'Participants', value: counts.participants, icon: '👥', color: '#8e44ad' },
    { label: 'Visit Logs', value: counts.logs, icon: '📋', color: '#e67e22' },
  ]

  return (
    <div>
      <h1 style={h1}>Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {stats.map(s => (
          <div key={s.label} className="card" style={{ borderTop: `4px solid ${s.color}`, padding: '1.5rem' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{s.icon}</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div className="card" style={{ padding: '1.5rem' }}>
        <h2 style={{ color: 'var(--teal-dark)', marginBottom: '0.75rem', fontSize: '1.1rem' }}>Quick Links</h2>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <a href="/admin/checkins" style={quickLink}>View Check-ins</a>
          <a href="/admin/springs" style={quickLink}>+ Add Spring</a>
          <a href="/admin/participants" style={quickLink}>+ Add Participant</a>
          <a href="/api/docs" target="_blank" rel="noreferrer" style={quickLink}>API Docs ↗</a>
        </div>
      </div>
    </div>
  )
}

const h1 = { fontSize: '1.6rem', color: 'var(--teal-dark)', marginBottom: '1.5rem' }
const quickLink = {
  padding: '0.5rem 1rem', background: 'var(--cream)', borderRadius: '6px',
  textDecoration: 'none', color: 'var(--teal-dark)', fontSize: '0.9rem', fontWeight: 600,
}
