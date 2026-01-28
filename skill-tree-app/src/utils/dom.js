// Small DOM helper utilities to keep components simple and consistent.
// These are intentionally tiny so they can be reused across vanilla JS modules
// without pulling in a framework.

export function createEl(tag, className = '', textContent = '') {
  const el = document.createElement(tag)
  if (className) el.className = className
  if (textContent) el.textContent = textContent
  return el
}

export function createButton(className = '', textContent = '') {
  const btn = createEl('button', className, textContent)
  btn.type = 'button'
  return btn
}

export function createSpan(className = '', textContent = '') {
  return createEl('span', className, textContent)
}

