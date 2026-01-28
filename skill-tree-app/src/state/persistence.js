// Persistence abstraction layer
// - Default: localStorage (demo / static build)
// - Future: game platforms can replace the REMOTE implementations with API calls

export const PERSISTENCE_MODES = {
  LOCAL: 'local',
  REMOTE: 'remote'
}

let currentMode = PERSISTENCE_MODES.LOCAL

// Configure persistence from config.json (optional)
// Example in config:
// "persistence": { "mode": "remote" }
export function configurePersistence(config = {}) {
  const mode = config.persistence?.mode
  if (mode === PERSISTENCE_MODES.REMOTE) {
    currentMode = PERSISTENCE_MODES.REMOTE
  } else {
    currentMode = PERSISTENCE_MODES.LOCAL
  }
}

export function getPersistenceMode() {
  return currentMode
}

// Load snapshot for a given storage key.
// For REMOTE mode, game platforms can plug in an API call here.
export async function loadSnapshot(storageKey) {
  if (currentMode === PERSISTENCE_MODES.REMOTE) {
    // Placeholder for future integration:
    // return await fetch(`/api/progress?key=${encodeURIComponent(storageKey)}`).then(r => r.json())
    console.warn(
      '[persistence] REMOTE mode selected but no remote loader implemented; falling back to localStorage.'
    )
  }

  try {
    const raw = window.localStorage.getItem(storageKey)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

// Save snapshot for a given storage key.
// For REMOTE mode, game platforms can plug in an API call here.
export async function saveSnapshot(storageKey, snapshot) {
  if (currentMode === PERSISTENCE_MODES.REMOTE) {
    // Placeholder for future integration:
    // await fetch('/api/progress', { method: 'POST', body: JSON.stringify({ key: storageKey, snapshot }) })
    console.warn(
      '[persistence] REMOTE mode selected but no remote saver implemented; saving to localStorage instead.'
    )
  }

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(snapshot))
  } catch {
    // ignore localStorage errors to avoid breaking UX
  }
}

