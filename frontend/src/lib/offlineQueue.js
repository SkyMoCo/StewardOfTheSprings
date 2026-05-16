// IndexedDB-backed queue for check-ins submitted while offline.
// The service worker also reads this same DB via background sync.

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('sos-db', 1)
    req.onupgradeneeded = () =>
      req.result.createObjectStore('queue', { keyPath: 'id', autoIncrement: true })
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function enqueue(payload) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('queue', 'readwrite')
    tx.objectStore('queue').add({ payload, queued_at: new Date().toISOString() })
    tx.oncomplete = resolve
    tx.onerror = () => reject(tx.error)
  })
}

export async function pendingCount() {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('queue', 'readonly')
    const req = tx.objectStore('queue').count()
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

// Try to flush queued submissions directly from the app (fallback when
// Background Sync API is not supported or as a manual retry).
export async function flushQueue() {
  const db = await openDB()

  const items = await new Promise((resolve, reject) => {
    const tx = db.transaction('queue', 'readonly')
    const req = tx.objectStore('queue').getAll()
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })

  let flushed = 0
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
        flushed++
      }
    } catch {
      break // still offline
    }
  }
  return flushed
}
