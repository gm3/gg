// Data loader - loads everything from a single config.json file
// Makes the system modular and configurable with one file

let cachedConfig = null

// Load complete configuration from single JSON file
// Returns object with appName, statTypes, defaultStats, storageKey, and quests
export async function loadConfig() {
  if (cachedConfig) return cachedConfig
  
  try {
    let config = null

    // 1) Optional override: config loaded from Settings "Load config JSON"
    try {
      const overrideRaw = window.localStorage.getItem('skill_tree_custom_config')
      if (overrideRaw) {
        config = JSON.parse(overrideRaw)
      }
    } catch (e) {
      console.warn('Failed to parse custom config from localStorage, ignoring override', e)
      config = null
    }

    // 2) Fallback to bundled config.json if no override present
    if (!config) {
      // Use a relative path so it works both in dev and when hosted under a sub-path
      // (e.g. GitHub Pages repo sites where the app lives at /<repo>/)
      const response = await fetch('config.json')
      if (!response.ok) {
        throw new Error('Failed to load config.json')
      }
      config = await response.json()
    }
    
    // Validate required fields
    if (!config.quests || !Array.isArray(config.quests)) {
      console.warn('config.json missing quests array, using empty array')
      config.quests = []
    }
    
    if (!config.statTypes || typeof config.statTypes !== 'object') {
      console.warn('config.json missing statTypes, using defaults')
      config.statTypes = {
        goodness: 'Goodness',
        thoughtfulness: 'Thoughtfulness',
        kindness: 'Kindness',
        empathy: 'Empathy'
      }
    }
    
    if (!config.defaultStats || typeof config.defaultStats !== 'object') {
      console.warn('config.json missing defaultStats, initializing from statTypes')
      config.defaultStats = {}
      Object.keys(config.statTypes).forEach(key => {
        config.defaultStats[key] = 0
      })
    }
    
    cachedConfig = config
    return config
  } catch (error) {
    console.error('Failed to load config.json:', error)
    // Return default config if file doesn't exist
    return {
      appName: 'Skill Tree',
      statTypes: {
        goodness: 'Goodness',
        thoughtfulness: 'Thoughtfulness',
        kindness: 'Kindness',
        empathy: 'Empathy'
      },
      defaultStats: {
        goodness: 0,
        thoughtfulness: 0,
        kindness: 0,
        empathy: 0
      },
      storageKey: 'skill_tree_progress',
      quests: []
    }
  }
}

// Clear cache (useful for hot reloading during development)
export function clearCache() {
  cachedConfig = null
}
