// Main skill tree view: fullscreen tree with overlay UI
// Modular design for reuse in other projects
// Now accepts quests and config as parameters for flexibility

import {
  getState,
  loadProgress,
  toggleQuest,
  subscribe,
  clearProgress
} from '../state/progressStore.js'
import { createCharacterStats } from './CharacterStats.js'
import { createNodeModal } from './NodeModal.js'
import { renderSkillMap } from './SkillMap.js'
import { createListView } from './ListView.js'
import { createProgressStepper } from './ProgressStepper.js'
import { createSettingsMenu } from './SettingsMenu.js'

// Detect if mobile/vertical view
function isMobileView() {
  return window.innerWidth < 768 || window.innerHeight > window.innerWidth
}

export function mountSkillTree(root, { quests, config }) {
  // Ensure we have the latest progress from localStorage
  loadProgress()
  let nodeModal = null
  let mapInstance = null
  let currentView = isMobileView() ? 'list' : 'tree' // Default based on screen size

  function exportProgress() {
    const snapshot = {
      progress: getState(),
      quests,
      config,
      exportedAt: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
      type: 'application/json'
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${config?.appName?.toLowerCase().replace(/\s+/g, '-') || 'skill-tree'}-progress.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  function openNodeModal(quest) {
    // Close existing modal if open
    if (nodeModal) {
      closeNodeModal()
    }

    nodeModal = createNodeModal(quest, closeNodeModal, () => {
      // Re-render on update
      render()
    })
    root.appendChild(nodeModal)
  }

  function closeNodeModal() {
    if (nodeModal) {
      nodeModal.dispatchEvent(new Event('remove'))
      nodeModal.remove()
      nodeModal = null
    }
  }

  // Track if we need to recreate the view or just update
  let fullscreenContainer = root.querySelector('.fullscreen-container')
  let needsFullRender = true
  
  function render() {
    const { completedQuests } = getState()
    const totalCompleted = completedQuests.length
    const totalQuests = quests.length

    // Only recreate if switching views or initial render
    if (needsFullRender || !fullscreenContainer) {
      root.innerHTML = ''
      fullscreenContainer = document.createElement('div')
      fullscreenContainer.className = 'fullscreen-container'
      root.appendChild(fullscreenContainer)
      needsFullRender = false
      } else {
      // Just update stats and stepper, don't recreate views
      if (currentView === 'list') {
        // Update stats overlay
        const statsOverlay = fullscreenContainer.querySelector('.overlay-stats')
        if (statsOverlay) {
          // Rebuild header area with view toggle + settings menu
          statsOverlay.innerHTML = ''

          const viewToggle = document.createElement('button')
          viewToggle.className = 'view-toggle'
          viewToggle.setAttribute('aria-label', 'Toggle view')
          const toggleIcon = document.createElement('span')
          toggleIcon.className = 'view-toggle__icon'
          toggleIcon.textContent = currentView === 'tree' ? '☰' : '🌳'
          const toggleLabel = document.createElement('span')
          toggleLabel.className = 'view-toggle__label'
          toggleLabel.textContent = currentView === 'tree' ? 'List' : 'Tree'
          viewToggle.appendChild(toggleIcon)
          viewToggle.appendChild(toggleLabel)
          viewToggle.addEventListener('click', () => {
            currentView = currentView === 'tree' ? 'list' : 'tree'
            needsFullRender = true
            render()
          })

          const settingsMenu = createSettingsMenu(exportProgress, () => {
            clearProgress()
          })

          const headerControls = document.createElement('div')
          headerControls.className = 'character-stats__toggle'
          headerControls.appendChild(viewToggle)
          headerControls.appendChild(settingsMenu)

          const characterStats = createCharacterStats(totalCompleted, totalQuests, headerControls)
          statsOverlay.appendChild(characterStats)
        }
        
        // Update progress stepper
        const listContainer = fullscreenContainer.querySelector('.list-view-container')
        if (listContainer) {
          const oldStepper = listContainer.querySelector('.progress-stepper')
          if (oldStepper) {
            const newStepper = createProgressStepper(totalCompleted, totalQuests)
            oldStepper.replaceWith(newStepper)
          }
        }
        
        return // Don't recreate list view, just update what's needed
      } else if (currentView === 'tree') {
        // Update stats overlay for tree view
        const statsOverlay = fullscreenContainer.querySelector('.overlay-stats')
        if (statsOverlay) {
          // Rebuild header area with view toggle + settings menu
          statsOverlay.innerHTML = ''

          const viewToggle = document.createElement('button')
          viewToggle.className = 'view-toggle'
          viewToggle.setAttribute('aria-label', 'Toggle view')
          const toggleIcon = document.createElement('span')
          toggleIcon.className = 'view-toggle__icon'
          toggleIcon.textContent = currentView === 'tree' ? '☰' : '🌳'
          const toggleLabel = document.createElement('span')
          toggleLabel.className = 'view-toggle__label'
          toggleLabel.textContent = currentView === 'tree' ? 'List' : 'Tree'
          viewToggle.appendChild(toggleIcon)
          viewToggle.appendChild(toggleLabel)
          viewToggle.addEventListener('click', () => {
            currentView = currentView === 'tree' ? 'list' : 'tree'
            needsFullRender = true
            render()
          })

          const settingsMenu = createSettingsMenu(exportProgress, () => {
            clearProgress()
          })

          const headerControls = document.createElement('div')
          headerControls.className = 'character-stats__toggle'
          headerControls.appendChild(viewToggle)
          headerControls.appendChild(settingsMenu)

          const characterStats = createCharacterStats(totalCompleted, totalQuests, headerControls)
          statsOverlay.appendChild(characterStats)
        }
        
        // Don't recreate tree - just update the map instance if needed
        // The map will update itself via the subscribe handler
        const treeContainer = fullscreenContainer.querySelector('.tree-visual-fullscreen')
        if (treeContainer) {
          // Tree already exists, just update the map
          const canvasHolder = treeContainer.querySelector('.tree-visual__canvas-fullscreen')
          if (canvasHolder && mapInstance) {
            // Destroy old instance and create new one with updated data
            if (mapInstance.destroy) {
              mapInstance.destroy()
            }
            mapInstance = renderSkillMap(
              canvasHolder,
              completedQuests,
              (quest) => openNodeModal(quest),
              (quest, pos) => {
                const tooltip = treeContainer.querySelector('.tree-tooltip')
                if (tooltip && quest && pos) {
                  tooltip.style.display = 'block'
                  tooltip.textContent = `${quest.emoji || '🍃'} ${quest.title}`
                  const tooltipWidth = tooltip.offsetWidth || 150
                  let left = pos.x
                  if (left < tooltipWidth / 2) {
                    left = tooltipWidth / 2
                  } else if (left > treeContainer.clientWidth - tooltipWidth / 2) {
                    left = treeContainer.clientWidth - tooltipWidth / 2
                  }
                  tooltip.style.left = `${left}px`
                  tooltip.style.top = `${Math.max(pos.y - 8, 8)}px`
                }
              },
              () => {
                const tooltip = treeContainer.querySelector('.tree-tooltip')
                if (tooltip) tooltip.style.display = 'none'
              },
              quests // Pass quests array
            )
          }
        }
        
        return // Don't recreate tree view, just update what's needed
      }
    }

    // Character stats overlay - top center with view toggle
    let statsOverlay = fullscreenContainer.querySelector('.overlay-stats')
    if (!statsOverlay) {
      statsOverlay = document.createElement('div')
      statsOverlay.className = 'overlay-stats'
      fullscreenContainer.appendChild(statsOverlay)
    } else {
      statsOverlay.innerHTML = ''
    }
    
    // View toggle + settings cluster
    const viewToggle = document.createElement('button')
    viewToggle.className = 'view-toggle'
    viewToggle.setAttribute('aria-label', 'Toggle view')
    const toggleIcon = document.createElement('span')
    toggleIcon.className = 'view-toggle__icon'
    toggleIcon.textContent = currentView === 'tree' ? '☰' : '🌳'
    const toggleLabel = document.createElement('span')
    toggleLabel.className = 'view-toggle__label'
    toggleLabel.textContent = currentView === 'tree' ? 'List' : 'Tree'
    viewToggle.appendChild(toggleIcon)
    viewToggle.appendChild(toggleLabel)
    
    viewToggle.addEventListener('click', () => {
      currentView = currentView === 'tree' ? 'list' : 'tree'
      needsFullRender = true
      render()
    })
    
    const settingsMenu = createSettingsMenu(exportProgress, () => {
      clearProgress()
    })

    const headerControls = document.createElement('div')
    headerControls.className = 'character-stats__toggle'
    headerControls.appendChild(viewToggle)
    headerControls.appendChild(settingsMenu)

    // Create stats with toggle + settings integrated
    const characterStats = createCharacterStats(totalCompleted, totalQuests, headerControls)
    statsOverlay.appendChild(characterStats)

    // Render based on current view
    if (currentView === 'tree') {
      // Check if tree container already exists
      let treeContainer = fullscreenContainer.querySelector('.tree-visual-fullscreen')
      
      if (!treeContainer) {
        // Tree container - fullscreen (only create if it doesn't exist)
        treeContainer = document.createElement('section')
        treeContainer.className = 'tree-visual-fullscreen'
        const canvasHolder = document.createElement('div')
        canvasHolder.className = 'tree-visual__canvas-fullscreen'
        treeContainer.appendChild(canvasHolder)
        fullscreenContainer.appendChild(treeContainer)
        
        // Tooltip for hover (only create once)
        const tooltip = document.createElement('div')
        tooltip.className = 'tree-tooltip'
        tooltip.style.display = 'none'
        treeContainer.appendChild(tooltip)
      }
      
      // Get or create canvas holder
      let canvasHolder = treeContainer.querySelector('.tree-visual__canvas-fullscreen')
      if (!canvasHolder) {
        canvasHolder = document.createElement('div')
        canvasHolder.className = 'tree-visual__canvas-fullscreen'
        treeContainer.appendChild(canvasHolder)
      }

      // Get tooltip (should already exist)
      const tooltip = treeContainer.querySelector('.tree-tooltip')

      // Hover handler - simplified and more reliable
      function setHover(quest, pos) {
        if (tooltip) {
          if (quest && pos) {
            tooltip.style.display = 'block'
            tooltip.textContent = `${quest.emoji || '🍃'} ${quest.title}`
            // Position tooltip above the cursor, ensuring it stays within bounds
            const tooltipWidth = tooltip.offsetWidth || 150 // Estimate if not yet rendered
            let left = pos.x
            // Keep tooltip within container bounds
            if (left < tooltipWidth / 2) {
              left = tooltipWidth / 2
            } else if (left > treeContainer.clientWidth - tooltipWidth / 2) {
              left = treeContainer.clientWidth - tooltipWidth / 2
            }
            tooltip.style.left = `${left}px`
            tooltip.style.top = `${Math.max(pos.y - 8, 8)}px`
          } else {
            tooltip.style.display = 'none'
          }
        }
      }

      // Clean up existing map instance before creating new one
      if (mapInstance && mapInstance.destroy) {
        mapInstance.destroy()
        mapInstance = null
      }
      
      // Clear canvas holder before rendering new map
      canvasHolder.innerHTML = ''
      
      // Render skill map
      mapInstance = renderSkillMap(
        canvasHolder,
        completedQuests,
        (quest) => openNodeModal(quest), // onNodeClick
        (quest, pos) => setHover(quest, pos), // onHoverQuest
        () => setHover(null), // onLeaveQuest
        quests // Pass quests array
      )
    } else {
      // List view for mobile
      let listContainer = fullscreenContainer.querySelector('.list-view-container')
      
      if (!listContainer) {
        listContainer = document.createElement('section')
        listContainer.className = 'list-view-container'
        fullscreenContainer.appendChild(listContainer)
        
        // Progress stepper
        const stepper = createProgressStepper(totalCompleted, totalQuests)
        listContainer.appendChild(stepper)
        
        // List view - only create once, pass quests
        const listView = createListView((quest) => openNodeModal(quest), quests)
        listContainer.appendChild(listView)
      } else {
        // Just update the stepper, preserve list view
        const oldStepper = listContainer.querySelector('.progress-stepper')
        if (oldStepper) {
          const newStepper = createProgressStepper(totalCompleted, totalQuests)
          oldStepper.replaceWith(newStepper)
        }
      }
    }

    // Bottom overlay - instructions (only for tree view)
    if (currentView === 'tree') {
      const bottomOverlay = document.createElement('div')
      bottomOverlay.className = 'overlay-bottom'
      
      // Instructions
      const instructions = document.createElement('div')
      instructions.className = 'overlay-instructions'
      instructions.textContent = 'Scroll to zoom • Drag to pan • Click nodes for details'
      bottomOverlay.appendChild(instructions)

      fullscreenContainer.appendChild(bottomOverlay)
    }
  }

  // Handle window resize to switch views if needed
  const handleResize = () => {
    const shouldBeMobile = isMobileView()
    if (shouldBeMobile && currentView === 'tree') {
      currentView = 'list'
      render()
    } else if (!shouldBeMobile && currentView === 'list') {
      // Keep user's choice on desktop, don't auto-switch
    }
  }
  
  window.addEventListener('resize', handleResize)

  // Initial paint
  render()

  // Re-render whenever progress changes
  subscribe(render)

  // Cleanup on unmount
  return () => {
    window.removeEventListener('resize', handleResize)
    if (mapInstance && mapInstance.destroy) {
      mapInstance.destroy()
    }
    if (nodeModal) {
      closeNodeModal()
    }
  }
}
