// Character stats display component - modular and reusable
// Shows character stats at top center of screen
// Now uses dynamic stat types from config

import { getStats, getTotalPoints, getStatTypes, getStatTypeNames } from '../state/progressStore.js'

export function createCharacterStats(totalCompleted, totalQuests, toggleButton = null) {
  const stats = getStats()
  const totalPoints = getTotalPoints()
  const percentage = totalQuests ? Math.round((totalCompleted / totalQuests) * 100) : 0

  const container = document.createElement('div')
  container.className = 'character-stats'

  // Toggle button area (replaces emoji icon)
  if (toggleButton) {
    const toggleArea = document.createElement('div')
    toggleArea.className = 'character-stats__toggle'
    toggleArea.appendChild(toggleButton)
    container.appendChild(toggleArea)
  }

  // Horizontal stats bar
  const statsBar = document.createElement('div')
  statsBar.className = 'character-stats__bar'

  // Overall completion - compact
  const completionStat = document.createElement('div')
  completionStat.className = 'character-stats__stat'
  const completionValue = document.createElement('span')
  completionValue.className = 'character-stats__value'
  completionValue.textContent = `${totalCompleted}/${totalQuests}`
  const completionLabel = document.createElement('span')
  completionLabel.className = 'character-stats__label'
  completionLabel.textContent = 'Nodes'
  completionStat.appendChild(completionValue)
  completionStat.appendChild(completionLabel)
  statsBar.appendChild(completionStat)

  // Individual stat points - horizontal
  const statTypeNames = getStatTypeNames()
  Object.entries(stats).forEach(([statType, value]) => {
    const statEl = document.createElement('div')
    statEl.className = 'character-stats__stat'
    const valueEl = document.createElement('span')
    valueEl.className = 'character-stats__value'
    valueEl.textContent = `+${value}`
    const label = document.createElement('span')
    label.className = 'character-stats__label'
    label.textContent = statTypeNames[statType] || statType
    statEl.appendChild(valueEl)
    statEl.appendChild(label)
    statsBar.appendChild(statEl)
  })

  // Total points - compact
  const totalStat = document.createElement('div')
  totalStat.className = 'character-stats__stat character-stats__stat--total'
  const totalValue = document.createElement('span')
  totalValue.className = 'character-stats__value'
  totalValue.textContent = totalPoints
  const totalLabel = document.createElement('span')
  totalLabel.className = 'character-stats__label'
  totalLabel.textContent = 'Total'
  totalStat.appendChild(totalValue)
  totalStat.appendChild(totalLabel)
  statsBar.appendChild(totalStat)

  container.appendChild(statsBar)

  return container
}
