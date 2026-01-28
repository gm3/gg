import './styles/main.css'
import { mountSkillTree } from './components/SkillTree.js'
import { loadConfig } from './data/loadData.js'
import { initializeStore } from './state/progressStore.js'

// Initialize app by loading everything from a single config.json file
async function init() {
  const appRoot = document.querySelector('#app')
  
  if (!appRoot) {
    console.error('App root element not found')
    return
  }
  
  try {
    // Load complete configuration (includes quests) from single JSON file
    const config = await loadConfig()
    
    // Initialize the store with config
    initializeStore(config)
    
    // Extract quests from config
    const quests = config.quests || []
    
    if (quests.length === 0) {
      console.warn('No quests found in config.json')
      appRoot.innerHTML = '<div style="padding: 2rem; text-align: center; color: #e5e7eb;"><h2>No quests found</h2><p>Please ensure config.json contains a "quests" array with at least one quest.</p></div>'
      return
    }
    
    // Mount the skill tree with loaded data
    mountSkillTree(appRoot, { config, quests })
  } catch (error) {
    console.error('Failed to initialize app:', error)
    appRoot.innerHTML = '<div style="padding: 2rem; text-align: center; color: #e5e7eb;"><h2>Error loading app</h2><p>Please check the console for details.</p></div>'
  }
}

// Start the app
init()

