// Renders a single quest card with a checkbox and optional reflection
// Keeps the interaction gentle and non-judgmental

export function createQuestCard(quest, isCompleted, onToggle, reflectionText, onChangeReflection) {
  const wrapper = document.createElement('div')
  wrapper.className = 'quest-card'

  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.checked = isCompleted
  checkbox.className = 'quest-card__checkbox'
  checkbox.addEventListener('change', () => {
    onToggle(quest.id, checkbox.checked)
  })

  const content = document.createElement('div')
  content.className = 'quest-card__content'

  const emoji = document.createElement('span')
  emoji.className = 'quest-card__emoji'
  emoji.textContent = quest.emoji || '🍃'

  const title = document.createElement('div')
  title.className = 'quest-card__title'
  title.textContent = quest.title

  const desc = document.createElement('div')
  desc.className = 'quest-card__description'
  desc.textContent = quest.description

  const titleRow = document.createElement('div')
  titleRow.className = 'quest-card__title-row'
  titleRow.appendChild(emoji)
  titleRow.appendChild(title)

  content.appendChild(titleRow)
  content.appendChild(desc)

  const reflectionToggle = document.createElement('button')
  reflectionToggle.type = 'button'
  reflectionToggle.className = 'quest-card__reflect-button'
  reflectionToggle.textContent = reflectionText ? 'Edit reflection' : 'Add reflection'

  const reflectionWrap = document.createElement('div')
  reflectionWrap.className = 'quest-card__reflection'
  reflectionWrap.hidden = true

  const reflectionArea = document.createElement('textarea')
  reflectionArea.className = 'quest-card__reflection-input'
  reflectionArea.rows = 2
  reflectionArea.placeholder = 'A short note about how this felt…'
  reflectionArea.value = reflectionText || ''

  const saveBtn = document.createElement('button')
  saveBtn.type = 'button'
  saveBtn.className = 'quest-card__reflection-save'
  saveBtn.textContent = 'Save'

  reflectionToggle.addEventListener('click', () => {
    reflectionWrap.hidden = !reflectionWrap.hidden
    if (!reflectionWrap.hidden) {
      reflectionArea.focus()
    }
  })

  saveBtn.addEventListener('click', () => {
    if (onChangeReflection) {
      onChangeReflection(quest.id, reflectionArea.value.trim())
      reflectionToggle.textContent = reflectionArea.value.trim()
        ? 'Edit reflection'
        : 'Add reflection'
    }
  })

  reflectionWrap.appendChild(reflectionArea)
  reflectionWrap.appendChild(saveBtn)

  content.appendChild(reflectionToggle)
  content.appendChild(reflectionWrap)

  wrapper.appendChild(checkbox)
  wrapper.appendChild(content)

  if (isCompleted) {
    wrapper.classList.add('quest-card--completed')
  }

  return wrapper
}

