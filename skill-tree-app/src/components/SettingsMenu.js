// Settings menu component - hamburger menu with export/clear options
// and a loader for testing new config files at runtime.
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
  
  // Load config button - allows testing new config.json files without rebuilding
  const loadConfigBtn = document.createElement('button')
  loadConfigBtn.className = 'settings-menu__item'
  loadConfigBtn.textContent = 'Load config JSON'
  loadConfigBtn.addEventListener('click', () => {
    // Create a hidden file input for selecting a local JSON file
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    input.style.display = 'none'

    input.addEventListener('change', async () => {
      const file = input.files && input.files[0]
      if (!file) return

      try {
        const text = await file.text()
        const parsed = JSON.parse(text)

        if (!parsed.quests || !Array.isArray(parsed.quests)) {
          window.alert('Invalid config: missing "quests" array.')
          return
        }

        // Persist as custom config override and reload app
        window.localStorage.setItem('skill_tree_custom_config', text)
        window.location.reload()
      } catch (err) {
        console.error('Failed to load config JSON', err)
        window.alert('Failed to load config JSON. Please check the file format.')
      }
    })

    // Trigger file picker
    document.body.appendChild(input)
    input.click()

    // Clean up the input element after use
    input.addEventListener('blur', () => {
      input.remove()
    })

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
  menuDropdown.appendChild(loadConfigBtn)
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
