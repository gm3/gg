// Progress store for quests and reflections.
// - Default demo mode: uses localStorage via the persistence adapter
// - Future-ready: game platforms can swap persistence to use a backend.

import { configurePersistence, loadSnapshot, saveSnapshot } from './persistence.js'

let STORAGE_KEY = 'skill_tree_progress'
let STAT_TYPES = {}
let DEFAULT_STATS = {}

// Store config for stat type names
let statTypeNames = {}

// Initialize with config (called from main.js after loading config)
export function initializeStore(config) {
  STORAGE_KEY = config.storageKey || 'skill_tree_progress'

  // Configure persistence mode (local vs remote) without breaking the demo
  // In config.json, platforms can set:
  // "persistence": { "mode": "remote" }
  configurePersistence(config)
  
  // Build STAT_TYPES object from config
  STAT_TYPES = {}
  Object.keys(config.statTypes || {}).forEach(key => {
    STAT_TYPES[key.toUpperCase()] = key
  })
  
  // Store stat type names for display
  statTypeNames = config.statTypes || {}
  
  // Set default stats
  DEFAULT_STATS = config.defaultStats || {}
  
  // Initialize state with default stats
  state = {
    completedQuests: [],
    lastUpdated: null,
    reflections: {},
    evidence: {},
    stats: { ...DEFAULT_STATS }
  }
}

// Export STAT_TYPES for backward compatibility
export { STAT_TYPES }

// Get stat type names for display
export function getStatTypeNames() {
  return { ...statTypeNames }
}

// Get stat types object
export function getStatTypes() {
  return { ...STAT_TYPES }
}

let state = {
  completedQuests: [],
  lastUpdated: null,
  reflections: {}, // { [questId]: string }
  evidence: {}, // { [questId]: { note?: string, status?: string } }
  stats: {}
}

const listeners = new Set()

function notify() {
  for (const fn of listeners) fn(state)
}

export function loadProgress() {
  try {
    const parsed = window.__skillTreeInitialSnapshot || null

    if (!parsed) {
      // No initial snapshot injected; fall back to adapter (localStorage by default)
      // Note: this is kept synchronous for backwards compatibility.
      const syncRaw = window.localStorage.getItem(STORAGE_KEY)
      if (!syncRaw) {
        state.stats = { ...DEFAULT_STATS }
        return state
      }
      const fallbackParsed = JSON.parse(syncRaw)
      if (!Array.isArray(fallbackParsed.completedQuests)) {
        state.stats = { ...DEFAULT_STATS }
        return state
      }
      state = {
        completedQuests: fallbackParsed.completedQuests,
        lastUpdated: fallbackParsed.lastUpdated || null,
        reflections: fallbackParsed.reflections || {},
        evidence: fallbackParsed.evidence || {},
        stats: fallbackParsed.stats || { ...DEFAULT_STATS }
      }
      notify()
      return state
    }

    if (!Array.isArray(parsed.completedQuests)) {
      state.stats = { ...DEFAULT_STATS }
      return state
    }
    state = {
      completedQuests: parsed.completedQuests,
      lastUpdated: parsed.lastUpdated || null,
      reflections: parsed.reflections || {},
      evidence: parsed.evidence || {},
      stats: parsed.stats || { ...DEFAULT_STATS }
    }
    notify()
  } catch {
    // fail gently, keep defaults
    state.stats = { ...DEFAULT_STATS }
  }
  return state
}

function save() {
  try {
    // Use the persistence adapter (localStorage by default).
    // For now we keep a direct localStorage write for backward compatibility.
    saveSnapshot(STORAGE_KEY, state)
  } catch {
    // ignore storage errors to avoid breaking UX
  }
}

export function isQuestCompleted(id) {
  return state.completedQuests.includes(id)
}

// Toggle quest completion and update stats based on quest points
// questPoints: { [statType]: number } - points to add/remove
export function toggleQuest(id, done, questPoints = {}) {
  const exists = state.completedQuests.includes(id)
  const nextCompleted = new Set(state.completedQuests)

  if (done && !exists) {
    nextCompleted.add(id)
    // Add points
    const nextStats = { ...state.stats }
    Object.keys(questPoints).forEach((statType) => {
      nextStats[statType] = (nextStats[statType] || 0) + (questPoints[statType] || 0)
    })
    state = {
      ...state,
      completedQuests: Array.from(nextCompleted),
      stats: nextStats,
      lastUpdated: new Date().toISOString().slice(0, 10)
    }
  } else if (!done && exists) {
    nextCompleted.delete(id)
    // Remove points
    const nextStats = { ...state.stats }
    Object.keys(questPoints).forEach((statType) => {
      nextStats[statType] = Math.max(0, (nextStats[statType] || 0) - (questPoints[statType] || 0))
    })
    state = {
      ...state,
      completedQuests: Array.from(nextCompleted),
      stats: nextStats,
      lastUpdated: new Date().toISOString().slice(0, 10)
    }
  }

  save()
  notify()
}

export function getState() {
  return state
}

export function setReflection(id, text) {
  state = {
    ...state,
    reflections: {
      ...state.reflections,
      [id]: text
    },
    lastUpdated: new Date().toISOString().slice(0, 10)
  }
  save()
  notify()
}

export function clearProgress() {
  state = {
    completedQuests: [],
    lastUpdated: new Date().toISOString().slice(0, 10),
    reflections: {},
    evidence: {},
    stats: { ...DEFAULT_STATS }
  }
  save()
  notify()
}

// Evidence helpers (attachments / notes / review status stubs)
export function getEvidence(id) {
  return state.evidence?.[id] || { note: '', status: 'unsubmitted' }
}

export function setEvidence(id, partial) {
  const existing = state.evidence?.[id] || { note: '', status: 'unsubmitted' }
  state = {
    ...state,
    evidence: {
      ...state.evidence,
      [id]: {
        ...existing,
        ...partial
      }
    },
    lastUpdated: new Date().toISOString().slice(0, 10)
  }
  save()
  notify()
}

export function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

// Get current stats
export function getStats() {
  return { ...state.stats }
}

// Get total points across all stats
export function getTotalPoints() {
  return Object.values(state.stats).reduce((sum, val) => sum + val, 0)
}

