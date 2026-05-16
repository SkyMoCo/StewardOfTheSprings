import { useState, useEffect } from 'react'
import { enqueue, pendingCount, flushQueue } from '../lib/offlineQueue'

const GUIDELINES = [
  {
    num: 1, title: 'Protect the Water',
    bullets: [
      'No glass at the springs.',
      'Keep soaps, detergents, oils, and lotions out of the water.',
      'Never wash dishes, clothes, or yourself in natural water sources.',
      'Always test water temperatures before entering.',
    ],
  },
  {
    num: 2, title: 'Respect the Springs',
    bullets: [
      'Do not alter pools, move rocks, or change plumbing.',
      'Leave valves or pipes as you found them.',
      'Avoid disturbing delicate microorganisms in and around the springs.',
    ],
  },
  {
    num: 3, title: 'Share the Space',
    bullets: [
      'Make room for others; rotate during busy times.',
      'Keep gear consolidated and away from the water\'s edge.',
      'Nudity may be present at natural hot springs.',
    ],
  },
  {
    num: 4, title: 'Protect the Place',
    bullets: [
      'Practice Digital Leave No Trace: avoid geotagging or sharing the exact location.',
      'These springs remain special because people protect them.',
    ],
  },
  {
    num: 5, title: 'Travel and Camp Responsibly',
    bullets: [
      'Stay on established trails and durable surfaces.',
      'Camp at least 200 ft from water sources, including hot springs.',
      'Use only established fire rings when allowed. No improvised fires.',
    ],
  },
  {
    num: 6, title: 'Pack it Out',
    bullets: [
      'Carry out all trash, food scraps, microtrash, and dog waste.',
      'Follow local rules for human waste. Use catholes at least 200 ft from water.',
    ],
  },
]

const ACTION_OPTIONS = [
  'Packed out trash or litter',
  'Reported an issue or maintenance need',
  'Educated other visitors about Leave No Trace',
  'Documented conditions with photos',
  'Checked spring health / conditions',
  'Other stewardship action',
]

const EMPTY = {
  spring: '',
  date: new Date().toISOString().slice(0, 10),
  actions: [],
  notes: '',
  name: '',
  email: '',
  is_issue: false,
}

export default function Home() {
  const [form, setForm] = useState(EMPTY)
  const [guidelinesOpen, setGuidelinesOpen] = useState(false)
  const [status, setStatus] = useState(null) // 'success' | 'offline' | 'error'
  const [pending, setPending] = useState(0)
  const [online, setOnline] = useState(navigator.onLine)

  useEffect(() => {
    pendingCount().then(setPending)

    const handleOnline = () => {
      setOnline(true)
      // Try background sync first; fall back to direct flush
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        navigator.serviceWorker.ready.then(reg => reg.sync.register('sync-checkins'))
      } else {
        flushQueue().then(n => { if (n > 0) pendingCount().then(setPending) })
      }
    }
    const handleOffline = () => setOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  function toggleAction(action) {
    setForm(f => ({
      ...f,
      actions: f.actions.includes(action)
        ? f.actions.filter(a => a !== action)
        : [...f.actions, action],
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const payload = { ...form, submitted_at: new Date().toISOString() }

    const saveOffline = async () => {
      await enqueue(payload)
      setPending(p => p + 1)
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        const reg = await navigator.serviceWorker.ready
        await reg.sync.register('sync-checkins')
      }
      setStatus('offline')
      setForm(EMPTY)
    }

    if (!online) {
      await saveOffline()
      return
    }

    try {
      const res = await fetch('/api/checkins/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        // After a successful submit, flush anything queued from previous offline visits
        flushQueue().then(n => { if (n > 0) pendingCount().then(setPending) })
        setStatus('success')
        setForm(EMPTY)
      } else {
        setStatus('error')
      }
    } catch {
      // navigator.onLine was true but request still failed (edge signal, etc.)
      await saveOffline()
    }
  }

  // ── Result screen ─────────────────────────────────────────────────────────
  if (status) {
    return (
      <div className="app-shell">
        <AppHeader online={online} pending={pending} />
        <main className="checkin-result">
          {status === 'offline' ? (
            <>
              <div className="result-icon">📶</div>
              <h2>Saved for Later</h2>
              <p>No service here — your check-in is saved on your device and will upload automatically when you're back in range.</p>
              {pending > 0 && (
                <p className="pending-note">{pending} check-in{pending !== 1 ? 's' : ''} queued for upload.</p>
              )}
            </>
          ) : status === 'success' ? (
            <>
              <div className="result-icon">✅</div>
              <h2>Thank You!</h2>
              <p>Your stewardship has been recorded. You've earned your Stamp of Stewardship for this spring.</p>
            </>
          ) : (
            <>
              <div className="result-icon">⚠️</div>
              <h2>Something Went Wrong</h2>
              <p>Please try submitting again.</p>
            </>
          )}
          <button className="btn-submit" style={{ marginTop: '1.5rem' }} onClick={() => setStatus(null)}>
            Log Another Visit
          </button>
        </main>
        <AppFooter />
      </div>
    )
  }

  // ── Main check-in screen ──────────────────────────────────────────────────
  return (
    <div className="app-shell">
      <AppHeader online={online} pending={pending} />

      <section className="guidelines-section">
        <button className="guidelines-toggle" onClick={() => setGuidelinesOpen(o => !o)}>
          <span>The 6 Guidelines</span>
          <span className="toggle-arrow">{guidelinesOpen ? '▲' : '▼'}</span>
        </button>
        {guidelinesOpen && (
          <div className="guidelines-list">
            {GUIDELINES.map(g => (
              <div key={g.num} className="guideline">
                <div className="guideline-title">{g.num}. {g.title}</div>
                <ul>
                  {g.bullets.map(b => <li key={b}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>

      <main className="form-section">
        <h2>Log Your Stewardship</h2>
        <p className="form-intro">Care for the spring and leave it better than you found it.</p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Spring Name <span className="required">*</span></label>
            <input
              type="text" required
              placeholder="e.g. Meadow Hot Spring"
              value={form.spring}
              onChange={e => setForm({ ...form, spring: e.target.value })}
            />
          </div>

          <div className="field">
            <label>Date of Visit <span className="required">*</span></label>
            <input
              type="date" required
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
            />
          </div>

          <div className="field">
            <label>Actions Taken</label>
            <div className="actions-list">
              {ACTION_OPTIONS.map(action => (
                <label key={action} className="action-item">
                  <input
                    type="checkbox"
                    checked={form.actions.includes(action)}
                    onChange={() => toggleAction(action)}
                  />
                  <span>{action}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="field">
            <label>Reporting an issue or maintenance need?</label>
            <label className="action-item">
              <input
                type="checkbox"
                checked={form.is_issue}
                onChange={e => setForm({ ...form, is_issue: e.target.checked })}
              />
              <span>Yes — flag this for land managers</span>
            </label>
          </div>

          <div className="field">
            <label>Notes <span className="optional">(optional)</span></label>
            <textarea
              placeholder="Describe what you did, conditions observed, or any concerns…"
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          <div className="field">
            <label>Your Name <span className="optional">(optional — for your Stamp of Stewardship)</span></label>
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="field">
            <label>Email <span className="optional">(optional)</span></label>
            <input
              type="email"
              placeholder="email@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <button type="submit" className="btn-submit">
            {online ? 'Submit Check-In' : 'Save for Later (Offline)'}
          </button>
        </form>
      </main>

      <AppFooter />
    </div>
  )
}

function AppHeader({ online, pending }) {
  return (
    <header className="app-header">
      <div className="header-inner">
        <img src="/icon.svg" alt="" className="header-icon" />
        <div>
          <h1 className="brand">Stewards of the Springs</h1>
          <p className="tagline">Preserving natural hot springs through community stewardship</p>
        </div>
      </div>
      {!online && (
        <div className="offline-banner">
          You're offline — check-ins will upload when service returns
        </div>
      )}
      {online && pending > 0 && (
        <div className="sync-banner">
          Uploading {pending} saved check-in{pending !== 1 ? 's' : ''}…
        </div>
      )}
    </header>
  )
}

function AppFooter() {
  return (
    <footer className="app-footer">
      <p>This stewardship program works in cooperation with land managers.</p>
    </footer>
  )
}
