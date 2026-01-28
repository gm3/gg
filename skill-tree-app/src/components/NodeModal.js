// Modal/lightbox component for displaying node details
// Modular design for reuse in other projects

import { isQuestCompleted, toggleQuest, setReflection, getState, getStatTypeNames } from '../state/progressStore.js'

export function createNodeModal(quest, onClose, onUpdate) {
  const isCompleted = isQuestCompleted(quest.id)
  const modal = document.createElement('div')
  modal.className = 'node-modal'
  modal.setAttribute('role', 'dialog')
  modal.setAttribute('aria-modal', 'true')

  // Backdrop
  const backdrop = document.createElement('div')
  backdrop.className = 'node-modal__backdrop'
  backdrop.addEventListener('click', onClose)
  modal.appendChild(backdrop)

  // Content container
  const content = document.createElement('div')
  content.className = 'node-modal__content'

  // Header
  const header = document.createElement('div')
  header.className = 'node-modal__header'
  
  const titleRow = document.createElement('div')
  titleRow.className = 'node-modal__title-row'
  
  const emoji = document.createElement('span')
  emoji.className = 'node-modal__emoji'
  emoji.textContent = quest.emoji || '🍃'
  
  const title = document.createElement('h2')
  title.className = 'node-modal__title'
  title.textContent = quest.title
  
  titleRow.appendChild(emoji)
  titleRow.appendChild(title)
  header.appendChild(titleRow)

  const closeBtn = document.createElement('button')
  closeBtn.className = 'node-modal__close'
  closeBtn.textContent = '×'
  closeBtn.setAttribute('aria-label', 'Close modal')
  closeBtn.addEventListener('click', onClose)
  header.appendChild(closeBtn)

  content.appendChild(header)

  // Body
  const body = document.createElement('div')
  body.className = 'node-modal__body'

  // Description
  const description = document.createElement('p')
  description.className = 'node-modal__description'
  description.textContent = quest.description
  body.appendChild(description)

  // Category and tier info
  const meta = document.createElement('div')
  meta.className = 'node-modal__meta'
  const category = document.createElement('span')
  category.className = 'node-modal__category'
  category.textContent = `${quest.category} • Tier ${quest.tier}`
  meta.appendChild(category)
  body.appendChild(meta)

  // Points breakdown
  if (quest.points) {
    const pointsSection = document.createElement('div')
    pointsSection.className = 'node-modal__points'
    const pointsTitle = document.createElement('h3')
    pointsTitle.className = 'node-modal__points-title'
    pointsTitle.textContent = 'Points Awarded:'
    pointsSection.appendChild(pointsTitle)

    const pointsList = document.createElement('div')
    pointsList.className = 'node-modal__points-list'
    
    const statTypeNames = getStatTypeNames()
    Object.entries(quest.points).forEach(([statType, value]) => {
      if (value > 0) {
        const pointItem = document.createElement('div')
        pointItem.className = 'node-modal__point-item'
        const statName = document.createElement('span')
        statName.className = 'node-modal__point-label'
        statName.textContent = statTypeNames[statType] || statType
        const statValue = document.createElement('span')
        statValue.className = 'node-modal__point-value'
        statValue.textContent = `+${value}`
        pointItem.appendChild(statName)
        pointItem.appendChild(statValue)
        pointsList.appendChild(pointItem)
      }
    })

    pointsSection.appendChild(pointsList)
    body.appendChild(pointsSection)
  }

  // Completion toggle
  const toggleSection = document.createElement('div')
  toggleSection.className = 'node-modal__toggle'
  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.id = `quest-${quest.id}`
  checkbox.className = 'node-modal__checkbox'
  checkbox.checked = isCompleted
  checkbox.addEventListener('change', (e) => {
    const newState = e.target.checked
    toggleQuest(quest.id, newState, quest.points || {})
    if (onUpdate) onUpdate()
    // Update UI
    if (newState) {
      content.classList.add('node-modal__content--completed')
    } else {
      content.classList.remove('node-modal__content--completed')
    }
  })

  const checkboxLabel = document.createElement('label')
  checkboxLabel.htmlFor = `quest-${quest.id}`
  checkboxLabel.className = 'node-modal__checkbox-label'
  checkboxLabel.textContent = isCompleted ? 'Completed' : 'Mark as completed'

  toggleSection.appendChild(checkbox)
  toggleSection.appendChild(checkboxLabel)
  body.appendChild(toggleSection)

  // Reflection section (if completed)
  if (isCompleted) {
    const reflectionSection = document.createElement('div')
    reflectionSection.className = 'node-modal__reflection'
    const reflectionLabel = document.createElement('label')
    reflectionLabel.className = 'node-modal__reflection-label'
    reflectionLabel.textContent = 'Reflection (optional):'
    const reflectionTextarea = document.createElement('textarea')
    reflectionTextarea.className = 'node-modal__reflection-input'
    reflectionTextarea.placeholder = 'How did this feel? What did you learn?'
    reflectionTextarea.rows = 4
    // Load existing reflection if any
    const state = getState()
    if (state.reflections && state.reflections[quest.id]) {
      reflectionTextarea.value = state.reflections[quest.id]
    }
    reflectionTextarea.addEventListener('blur', () => {
      setReflection(quest.id, reflectionTextarea.value)
    })
    reflectionSection.appendChild(reflectionLabel)
    reflectionSection.appendChild(reflectionTextarea)
    body.appendChild(reflectionSection)
  }

  content.appendChild(body)
  modal.appendChild(content)

  // Add completed class if already completed
  if (isCompleted) {
    content.classList.add('node-modal__content--completed')
  }

  // Close on Escape key
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }
  document.addEventListener('keydown', handleEscape)
  modal.addEventListener('remove', () => {
    document.removeEventListener('keydown', handleEscape)
  })

  return modal
}
