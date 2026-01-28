// Settings menu component - hamburger menu with export/clear options
// Modular and reusable

export function createSettingsMenu(onExport, onClear) {
  const container = document.createElement('div')
  container.className = 'settings-menu'
  
  const menuButton = document.createElement('button')
  menuButton.className = 'settings-menu__button'
  menuButton.setAttribute('aria-label', 'Settings menu')
  menuButton.setAttribute('aria-expanded', 'false')
  menuButton.textContent = '☰'
  
  const menuDropdown = document.createElement('div')
  menuDropdown.className = 'settings-menu__dropdown'
  menuDropdown.style.display = 'none'
  
  // Export button
  const exportBtn = document.createElement('button')
  exportBtn.className = 'settings-menu__item'
  exportBtn.textContent = 'Export JSON'
  exportBtn.addEventListener('click', () => {
    if (onExport) onExport()
    closeMenu()
  })
  
  // Clear button
  const clearBtn = document.createElement('button')
  clearBtn.className = 'settings-menu__item settings-menu__item--danger'
  clearBtn.textContent = 'Clear All'
  clearBtn.addEventListener('click', () => {
    if (window.confirm('Reset all completed quests and reflections?')) {
      if (onClear) onClear()
    }
    closeMenu()
  })
  
  menuDropdown.appendChild(exportBtn)
  menuDropdown.appendChild(clearBtn)
  
  function openMenu() {
    menuDropdown.style.display = 'block'
    menuButton.setAttribute('aria-expanded', 'true')
    menuButton.classList.add('settings-menu__button--active')
  }
  
  function closeMenu() {
    menuDropdown.style.display = 'none'
    menuButton.setAttribute('aria-expanded', 'false')
    menuButton.classList.remove('settings-menu__button--active')
  }
  
  menuButton.addEventListener('click', (e) => {
    e.stopPropagation()
    const isOpen = menuDropdown.style.display === 'block'
    if (isOpen) {
      closeMenu()
    } else {
      openMenu()
    }
  })
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!container.contains(e.target)) {
      closeMenu()
    }
  })
  
  container.appendChild(menuButton)
  container.appendChild(menuDropdown)
  
  return container
}
