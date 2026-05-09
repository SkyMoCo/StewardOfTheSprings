import { useState } from 'react'

const activities = [
  { icon: '🧹', title: 'Pack Out Trash', desc: 'Remove litter left by others. Leave the area cleaner than you found it.' },
  { icon: '📸', title: 'Photo Documentation', desc: 'Document conditions, erosion, or infrastructure damage with photos.' },
  { icon: '🚧', title: 'Report Issues', desc: 'Flag vandalism, unsafe conditions, or maintenance needs to land managers.' },
  { icon: '💬', title: 'Visitor Education', desc: 'Respectfully share Leave No Trace principles with other visitors.' },
  { icon: '🌿', title: 'Vegetation Protection', desc: 'Stay on established paths and protect fragile riparian vegetation.' },
  { icon: '♨️', title: 'Spring Health Check', desc: 'Note water clarity, flow, and any unusual changes to spring conditions.' },
]

export default function Stewardship() {
  const [form, setForm] = useState({ name: '', email: '', spring: '', date: '', notes: '', issue: false })
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    // TODO: wire to POST /api/logs
    setSubmitted(true)
  }

  return (
    <>
      <section className="page-hero">
        <h1>Stewardship</h1>
        <p>Every visitor can be a steward. Learn what you can do and log your contributions.</p>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Stewardship Activities</h2>
            <p>Simple actions that make a real difference to the health of our springs.</p>
          </div>
          <div className="card-grid">
            {activities.map(a => (
              <div key={a.title} className="card">
                <div className="card-icon">{a.icon}</div>
                <h3>{a.title}</h3>
                <p>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt" id="report">
        <div className="container" style={{ maxWidth: 640 }}>
          <div className="section-header">
            <h2>Stewardship Check‑In</h2>
            <p>Log your visit and any stewardship actions you took.</p>
          </div>
          {submitted ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
              <h3>Thank you for your stewardship!</h3>
              <p style={{ marginTop: '0.5rem' }}>Your check‑in has been recorded.</p>
            </div>
          ) : (
            <form className="card" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label>
                <span style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem' }}>Name</span>
                <input style={inputStyle} type="text" required
                  value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </label>
              <label>
                <span style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem' }}>Email</span>
                <input style={inputStyle} type="email" required
                  value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </label>
              <label>
                <span style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem' }}>Spring Visited</span>
                <input style={inputStyle} type="text" placeholder="e.g. Meadow Hot Spring"
                  value={form.spring} onChange={e => setForm({...form, spring: e.target.value})} />
              </label>
              <label>
                <span style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem' }}>Visit Date</span>
                <input style={inputStyle} type="date" required
                  value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
              </label>
              <label>
                <span style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem' }}>Stewardship Actions / Notes</span>
                <textarea style={{...inputStyle, height: 100, resize: 'vertical'}}
                  value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
              </label>
              <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.issue}
                  onChange={e => setForm({...form, issue: e.target.checked})} />
                <span>I am reporting an issue or maintenance need</span>
              </label>
              <button type="submit" className="btn btn-teal" style={{ alignSelf: 'flex-start' }}>
                Submit Check‑In
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}

const inputStyle = {
  width: '100%', padding: '0.6rem 0.8rem',
  border: '1px solid #cdd8dc', borderRadius: '6px',
  fontSize: '1rem', fontFamily: 'inherit',
}
