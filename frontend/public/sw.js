const CACHE = 'sos-v1'

// ── Install: pre-cache the app shell entry point ──────────────────────────────
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.add('/'))
      .then(() => self.skipWaiting())
  )
})

// ── Activate: remove stale caches ────────────────────────────────────────────
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

// ── Fetch: cache-first for app shell, pass-through for API ───────────────────
self.addEventListener('fetch', e => {
  const { request } = e
  const url = new URL(request.url)

  // Never intercept API calls
  if (url.pathname.startsWith('/api/')) return

  // Navigation: try network (to get updates), fall back to cached index.html
  if (request.mode === 'navigate') {
    e.respondWith(
      fetch(request)
        .then(res => {
          if (res.ok) {
            const clone = res.clone()
            caches.open(CACHE).then(c => c.put(request, clone))
          }
          return res
        })
        .catch(() => caches.match('/') || caches.match('/index.html'))
    )
    return
  }

  // Static assets (JS, CSS, images): cache-first, cache on miss
  e.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached
      return fetch(request).then(res => {
        if (res.ok && res.type !== 'opaque') {
          const clone = res.clone()
          caches.open(CACHE).then(c => c.put(request, clone))
        }
        return res
      })
    })
  )
})

// ── Background Sync: flush queued check-ins when back online ─────────────────
self.addEventListener('sync', e => {
  if (e.tag === 'sync-checkins') {
    e.waitUntil(syncCheckins())
  }
})

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('sos-db', 1)
    req.onupgradeneeded = () =>
      req.result.createObjectStore('queue', { keyPath: 'id', autoIncrement: true })
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function syncCheckins() {
  const db = await openDB()

  const items = await new Promise((resolve, reject) => {
    const tx = db.transaction('queue', 'readonly')
    const req = tx.objectStore('queue').getAll()
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })

  for (const item of items) {
    try {
      const res = await fetch('/api/checkins/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item.payload),
      })
      if (res.ok) {
        await new Promise((resolve, reject) => {
          const tx = db.transaction('queue', 'readwrite')
          tx.objectStore('queue').delete(item.id)
          tx.oncomplete = resolve
          tx.onerror = () => reject(tx.error)
        })
      }
    } catch {
      break // still offline — stop and wait for next sync event
    }
  }
}
