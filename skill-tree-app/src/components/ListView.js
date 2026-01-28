// List View component for mobile-friendly display
// Shows collapsible tiers with expandable nodes
// Now accepts quests as parameter for modularity

import { isQuestCompleted, toggleQuest, getState, subscribe, getStatTypeNames } from '../state/progressStore.js'
import { createNodeModal } from './NodeModal.js'

// Create a collapsible tier section
function createTierSection(tierNumber, tierQuests, onNodeClick) {
  const tierSection = document.createElement('div')
  tierSection.className = 'list-tier'
  
  const tierHeader = document.createElement('button')
  tierHeader.className = 'list-tier__header'
  tierHeader.setAttribute('aria-expanded', 'true')
  
  const tierTitle = document.createElement('span')
  tierTitle.className = 'list-tier__title'
  const tierEmojis = { 1: '🌱', 2: '🌿', 3: '🌳' }
  tierTitle.textContent = `${tierEmojis[tierNumber] || '📋'} Tier ${tierNumber}`
  
  const tierCount = document.createElement('span')
  tierCount.className = 'list-tier__count'
  const completed = tierQuests.filter(q => isQuestCompleted(q.id)).length
  tierCount.textContent = `${completed}/${tierQuests.length}`
  
  const tierIcon = document.createElement('span')
  tierIcon.className = 'list-tier__icon'
  tierIcon.textContent = '▼'
  
  tierHeader.appendChild(tierTitle)
  tierHeader.appendChild(tierCount)
  tierHeader.appendChild(tierIcon)
  
  const tierContent = document.createElement('div')
  tierContent.className = 'list-tier__content'
  tierContent.style.display = 'block'
  
  // Sort quests: active first, then completed
  const sortedQuests = [...tierQuests].sort((a, b) => {
    const aCompleted = isQuestCompleted(a.id)
    const bCompleted = isQuestCompleted(b.id)
    if (aCompleted === bCompleted) return 0
    return aCompleted ? 1 : -1 // Active first
  })
  
  // Separate active and completed for visual grouping
  const activeQuests = sortedQuests.filter(q => !isQuestCompleted(q.id))
  const completedQuests = sortedQuests.filter(q => isQuestCompleted(q.id))
  
  // Add active quests
  activeQuests.forEach(quest => {
    const nodeItem = createNodeItem(quest, onNodeClick)
    tierContent.appendChild(nodeItem)
  })
  
  // Add separator if both active and completed exist
  if (activeQuests.length > 0 && completedQuests.length > 0) {
    const separator = document.createElement('div')
    separator.className = 'list-tier__separator'
    separator.textContent = 'Completed'
    tierContent.appendChild(separator)
  }
  
  // Add completed quests
  completedQuests.forEach(quest => {
    const nodeItem = createNodeItem(quest, onNodeClick)
    tierContent.appendChild(nodeItem)
  })
  
  // Toggle collapse
  tierHeader.addEventListener('click', () => {
    const isExpanded = tierContent.style.display !== 'none'
    tierContent.style.display = isExpanded ? 'none' : 'block'
    tierHeader.setAttribute('aria-expanded', !isExpanded)
    tierIcon.textContent = isExpanded ? '▶' : '▼'
    tierSection.classList.toggle('list-tier--collapsed', isExpanded)
  })
  
  tierSection.appendChild(tierHeader)
  tierSection.appendChild(tierContent)
  
  return tierSection
}

// Create a node item in the list
function createNodeItem(quest, onNodeClick) {
  const isCompleted = isQuestCompleted(quest.id)
  const item = document.createElement('div')
  item.className = `list-node ${isCompleted ? 'list-node--completed' : ''}`
  item.setAttribute('data-quest-id', quest.id)
  
  const nodeMain = document.createElement('button')
  nodeMain.className = 'list-node__main'
  
  const nodeLeft = document.createElement('div')
  nodeLeft.className = 'list-node__left'
  
  const nodeEmoji = document.createElement('span')
  nodeEmoji.className = 'list-node__emoji'
  nodeEmoji.textContent = quest.emoji || '🍃'
  
  const nodeInfo = document.createElement('div')
  nodeInfo.className = 'list-node__info'
  
  const nodeTitle = document.createElement('span')
  nodeTitle.className = 'list-node__title'
  nodeTitle.textContent = quest.title
  
  const nodeCategory = document.createElement('span')
  nodeCategory.className = 'list-node__category'
  nodeCategory.textContent = quest.category
  
  nodeInfo.appendChild(nodeTitle)
  nodeInfo.appendChild(nodeCategory)
  nodeLeft.appendChild(nodeEmoji)
  nodeLeft.appendChild(nodeInfo)
  
  const nodeRight = document.createElement('div')
  nodeRight.className = 'list-node__right'
  
  // Points display
  if (quest.points) {
    const pointsList = document.createElement('div')
    pointsList.className = 'list-node__points'
    Object.entries(quest.points).forEach(([statType, value]) => {
      if (value > 0) {
        const statTypeNames = getStatTypeNames()
        const statName = statTypeNames[statType] || statType
        const pointBadge = document.createElement('span')
        pointBadge.className = 'list-node__point'
        pointBadge.textContent = `+${value} ${statName.substring(0, 3)}`
        pointsList.appendChild(pointBadge)
      }
    })
    nodeRight.appendChild(pointsList)
  }
  
  const nodeCheckbox = document.createElement('input')
  nodeCheckbox.type = 'checkbox'
  nodeCheckbox.className = 'list-node__checkbox'
  nodeCheckbox.checked = isCompleted
  nodeCheckbox.addEventListener('change', (e) => {
    e.stopPropagation()
    // Save scroll position before state change
    const scrollContainer = item.closest('.list-view-container')
    const scrollPos = scrollContainer ? scrollContainer.scrollTop : 0
    
    toggleQuest(quest.id, e.target.checked, quest.points || {})
    item.classList.toggle('list-node--completed', e.target.checked)
    
    // Restore scroll position after state update
    if (scrollContainer && scrollPos > 0) {
      requestAnimationFrame(() => {
        scrollContainer.scrollTop = scrollPos
      })
    }
  })
  
  const expandIcon = document.createElement('span')
  expandIcon.className = 'list-node__expand'
  expandIcon.textContent = '▶'
  
  nodeRight.appendChild(nodeCheckbox)
  nodeRight.appendChild(expandIcon)
  
  nodeMain.appendChild(nodeLeft)
  nodeMain.appendChild(nodeRight)
  
  // Expandable details section
  const nodeDetails = document.createElement('div')
  nodeDetails.className = 'list-node__details'
  nodeDetails.style.display = 'none'
  
  const nodeDescription = document.createElement('p')
  nodeDescription.className = 'list-node__description'
  nodeDescription.textContent = quest.description
  
  const nodeActions = document.createElement('div')
  nodeActions.className = 'list-node__actions'
  
  const viewDetailsBtn = document.createElement('button')
  viewDetailsBtn.className = 'list-node__action-btn'
  viewDetailsBtn.textContent = 'View Details'
  viewDetailsBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    if (onNodeClick) onNodeClick(quest)
  })
  
  nodeActions.appendChild(viewDetailsBtn)
  nodeDetails.appendChild(nodeDescription)
  nodeDetails.appendChild(nodeActions)
  
  // Toggle expand
  nodeMain.addEventListener('click', () => {
    const isExpanded = nodeDetails.style.display !== 'none'
    nodeDetails.style.display = isExpanded ? 'none' : 'block'
    expandIcon.textContent = isExpanded ? '▶' : '▼'
    item.classList.toggle('list-node--expanded', !isExpanded)
  })
  
  item.appendChild(nodeMain)
  item.appendChild(nodeDetails)
  
  return item
}

// Main List View component
export function createListView(onNodeClick, quests = []) {
  const container = document.createElement('div')
  container.className = 'list-view'
  
  // Filter state: 'all', 'active', 'completed'
  let currentFilter = 'all'
  
  // Store scroll position
  let scrollPosition = 0
  const scrollContainer = container.closest('.list-view-container') || container.parentElement
  
  function saveScrollPosition() {
    if (scrollContainer) {
      scrollPosition = scrollContainer.scrollTop
    }
  }
  
  function restoreScrollPosition() {
    if (scrollContainer && scrollPosition > 0) {
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        scrollContainer.scrollTop = scrollPosition
      })
    }
  }
  
  function render() {
    // Save scroll position before clearing
    saveScrollPosition()
    
    container.innerHTML = ''
    
    // Create filter buttons
    const filterContainer = document.createElement('div')
    filterContainer.className = 'list-view__filters'
    
    const filterButtons = [
      { id: 'all', label: 'All' },
      { id: 'active', label: 'Active' },
      { id: 'completed', label: 'Completed' }
    ]
    
    filterButtons.forEach(filter => {
      const btn = document.createElement('button')
      btn.className = `list-view__filter ${currentFilter === filter.id ? 'list-view__filter--active' : ''}`
      btn.textContent = filter.label
      btn.addEventListener('click', () => {
        currentFilter = filter.id
        render()
      })
      filterContainer.appendChild(btn)
    })
    
    container.appendChild(filterContainer)
    
    // Group quests by tier
    const byTier = new Map()
    quests.forEach((q) => {
      if (!byTier.has(q.tier)) byTier.set(q.tier, [])
      byTier.get(q.tier).push(q)
    })
    
    const sortedTiers = Array.from(byTier.keys()).sort((a, b) => a - b)
    
    sortedTiers.forEach((tierNumber) => {
      const questsForTier = byTier.get(tierNumber)
      
      // Filter quests based on current filter
      let questsToShow = questsForTier
      if (currentFilter === 'active') {
        questsToShow = questsForTier.filter(q => !isQuestCompleted(q.id))
      } else if (currentFilter === 'completed') {
        questsToShow = questsForTier.filter(q => isQuestCompleted(q.id))
      }
      
      // Only show tier if it has quests after filtering (or if showing all)
      if (questsToShow.length > 0 || currentFilter === 'all') {
        // For 'all' filter, show all quests but sorted (active first)
        const questsForTierSection = currentFilter === 'all' ? questsForTier : questsToShow
        const tierSection = createTierSection(tierNumber, questsForTierSection, onNodeClick)
        container.appendChild(tierSection)
      }
    })
    
    // Restore scroll position after render
    restoreScrollPosition()
  }
  
  // Initial render
  render()
  
  // Subscribe to state changes - re-render to update sorting and filtering
  subscribe(() => {
    // Re-render to update sorting (active/completed order) and counts
    render()
  })
  
  // Update tier completion counts
  function updateTierCounts() {
    const tierHeaders = container.querySelectorAll('.list-tier__header')
    tierHeaders.forEach(header => {
      const tierContent = header.nextElementSibling
      if (tierContent) {
        const nodes = tierContent.querySelectorAll('.list-node')
        const completed = Array.from(nodes).filter(node => 
          node.classList.contains('list-node--completed')
        ).length
        const total = nodes.length
        const countEl = header.querySelector('.list-tier__count')
        if (countEl) {
          countEl.textContent = `${completed}/${total}`
        }
      }
    })
  }
  
  return container
}
