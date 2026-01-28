// 2D skill-tree style map rendered as SVG.
// Each quest is a "leaf" node that can be hovered and clicked.
// Supports scroll-to-zoom functionality
// Now accepts quests as parameter for modularity

// Renders the SVG tree into a container and returns the <svg> element.
// onHoverQuest is called with (quest, { x, y }) in container coordinates.
// onNodeClick is called with (quest) when a node is clicked.
// quests: array of quest objects to render
export function renderSkillMap(container, completedIds, onNodeClick, onHoverQuest, onLeaveQuest, quests = []) {
  const completedSet = new Set(completedIds)
  container.innerHTML = ''

  // Use container dimensions, fallback to viewport size for fullscreen
  let width = container.clientWidth || window.innerWidth || 1000
  let height = container.clientHeight || window.innerHeight || 800

  const svgNS = 'http://www.w3.org/2000/svg'
  const svg = document.createElementNS(svgNS, 'svg')
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
  svg.setAttribute('class', 'skill-map')
  
  // Zoom state
  let currentZoom = 100
  const minZoom = 50
  const maxZoom = 300
  const zoomStep = 5

  // Compute unique tiers dynamically and sort
  const tierValues = Array.from(new Set(quests.map((q) => q.tier))).sort(
    (a, b) => a - b
  )

  // Center of the radial layout
  const centerX = width / 2
  const centerY = height / 2
  const minDim = Math.min(width, height)
  const baseRadius = minDim * 0.18
  const ringStep = minDim * 0.16

  // Dynamic node radius: try to make nodes as large as possible
  // without overlapping neighbors on any ring, while keeping them
  // within a reasonable size range.
  const maxNodeRadius = minDim * 0.045
  const minNodeRadius = 6
  let nodeRadius = maxNodeRadius

  // Precompute node positions in a radial (concentric circles) layout
  const nodes = []

  tierValues.forEach((tier, ringIndex) => {
    const radius = baseRadius + ringIndex * ringStep
    const tierQuests = quests.filter((q) => q.tier === tier)
    const count = tierQuests.length || 1
    const angleStep = (Math.PI * 2) / count
    const startAngle = -Math.PI / 2 // start at top

    // Compute candidate radius for this ring based on spacing
    if (count > 1) {
      const theta = (Math.PI * 2) / count
      const chord = 2 * radius * Math.sin(theta / 2) // distance between neighbors
      const candidate = Math.max(minNodeRadius, Math.min(maxNodeRadius, (chord * 0.6) / 2))
      nodeRadius = Math.min(nodeRadius, candidate)
    }

    tierQuests.forEach((q, index) => {
      const angle = startAngle + angleStep * index
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)
      nodes.push({ quest: q, x, y, tier })
    })
  })

  // Render nodes as circles on rings (no branch lines)
  nodes.forEach(({ quest, x, y }) => {
    const circle = document.createElementNS(svgNS, 'circle')
    circle.setAttribute('cx', String(x))
    circle.setAttribute('cy', String(y))
    // Dynamic radius based on spacing between nodes
    circle.setAttribute('r', String(nodeRadius))
    circle.setAttribute('data-id', quest.id)
    circle.setAttribute('data-title', quest.title)
    circle.setAttribute('data-description', quest.description)

    const isCompleted = completedSet.has(quest.id)
    circle.setAttribute(
      'class',
      isCompleted ? 'skill-map__node skill-map__node--completed' : 'skill-map__node'
    )

    circle.addEventListener('click', (e) => {
      e.stopPropagation()
      if (onNodeClick) {
        onNodeClick(quest)
      }
    })

    // Simple, reliable hover handling using mouse coordinates
    circle.addEventListener('mouseenter', (e) => {
      if (onHoverQuest) {
        // Use actual mouse position from the event
        const containerBox = container.getBoundingClientRect()
        const pos = {
          x: e.clientX - containerBox.left,
          y: e.clientY - containerBox.top
        }
        onHoverQuest(quest, pos)
      }
    })

    circle.addEventListener('mouseleave', () => {
      if (onLeaveQuest) onLeaveQuest()
    })
    
    // Also track mouse move on the circle for better positioning
    circle.addEventListener('mousemove', (e) => {
      if (onHoverQuest) {
        const containerBox = container.getBoundingClientRect()
        const pos = {
          x: e.clientX - containerBox.left,
          y: e.clientY - containerBox.top
        }
        onHoverQuest(quest, pos)
      }
    })

    const label = document.createElementNS(svgNS, 'text')
    label.setAttribute('x', String(x))
    // Slight downward offset so the emoji visually centers in the circle
    label.setAttribute('y', String(y + nodeRadius * 0.15))
    label.setAttribute('class', 'skill-map__emoji')
    // Scale emoji with node size
    label.setAttribute('font-size', String(nodeRadius * 1.2))
    label.setAttribute('data-id', quest.id)
    label.textContent = quest.emoji || '🍃'

    svg.appendChild(circle)
    svg.appendChild(label)
  })

  container.appendChild(svg)

  // Pan state
  let isPanning = false
  let panStart = { x: 0, y: 0 }
  let panOffset = { x: 0, y: 0 }
  let currentPan = { x: 0, y: 0 }

  // Scroll-to-zoom functionality
  const handleWheel = (e) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -zoomStep : zoomStep
    currentZoom = Math.max(minZoom, Math.min(maxZoom, currentZoom + delta))
    updateTransform()
  }

  // Pan functionality - drag to pan
  const handleMouseDown = (e) => {
    // Pan on middle mouse button, right-click, or space + left-click
    if (e.button === 1 || e.button === 2 || (e.button === 0 && spaceKey)) {
      e.preventDefault()
      isPanning = true
      panStart = { x: e.clientX - currentPan.x, y: e.clientY - currentPan.y }
      container.style.cursor = 'grabbing'
    }
  }

  const handleMouseMove = (e) => {
    if (isPanning) {
      currentPan = {
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      }
      updateTransform()
    }
  }

  const handleMouseUp = () => {
    isPanning = false
    container.style.cursor = 'grab'
  }

  const updateTransform = () => {
    const scale = currentZoom / 100
    svg.style.transform = `translate(${currentPan.x}px, ${currentPan.y}px) scale(${scale})`
    svg.style.transformOrigin = 'center center'
  }

  // Track space key for panning
  let spaceKey = false
  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Space') {
      spaceKey = true
      container.style.cursor = 'grab'
    }
  }
  const handleKeyUp = (e) => {
    if (e.key === ' ' || e.key === 'Space') {
      spaceKey = false
      container.style.cursor = ''
    }
  }

  container.addEventListener('wheel', handleWheel, { passive: false })
  container.addEventListener('mousedown', handleMouseDown)
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
  
  // Prevent context menu on right-click drag
  container.addEventListener('contextmenu', (e) => {
    if (isPanning) {
      e.preventDefault()
    }
  })
  
  // Set initial cursor
  container.style.cursor = 'grab'

  // Handle resize - properly recalculate everything
  const handleResize = () => {
    width = container.clientWidth || window.innerWidth || 1000
    height = container.clientHeight || window.innerHeight || 800

    // Update viewBox
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
    svg.setAttribute('width', String(width))
    svg.setAttribute('height', String(height))

    const newCenterX = width / 2
    const newCenterY = height / 2
    const newMinDim = Math.min(width, height)
    const newBaseRadius = newMinDim * 0.18
    const newRingStep = newMinDim * 0.16

    // Recalculate node positions on concentric circles
    tierValues.forEach((tier, ringIndex) => {
      const radius = newBaseRadius + ringIndex * newRingStep
      const tierQuests = quests.filter((q) => q.tier === tier)
      const count = tierQuests.length || 1
      const angleStep = (Math.PI * 2) / count
      const startAngle = -Math.PI / 2

      tierQuests.forEach((quest, index) => {
        const angle = startAngle + angleStep * index
        const newX = newCenterX + radius * Math.cos(angle)
        const newY = newCenterY + radius * Math.sin(angle)

        // Update circle
        const circle = svg.querySelector(`circle[data-id="${quest.id}"]`)
        if (circle) {
          circle.setAttribute('cx', String(newX))
          circle.setAttribute('cy', String(newY))
        }

        // Update label position (keep same offset used at creation)
        const label = svg.querySelector(`text[data-id="${quest.id}"]`)
        if (label) {
          label.setAttribute('x', String(newX))
          label.setAttribute('y', String(newY + 3))
        }
      })
    })
  }
  
  // Use ResizeObserver for better performance
  const resizeObserver = new ResizeObserver(handleResize)
  resizeObserver.observe(container)
  window.addEventListener('resize', handleResize)

  // Return cleanup function
  return {
    svg,
    setZoom: (zoom) => {
      currentZoom = Math.max(minZoom, Math.min(maxZoom, zoom))
      svg.style.transform = `scale(${currentZoom / 100})`
      svg.style.transformOrigin = 'center center'
    },
    getZoom: () => currentZoom,
    destroy: () => {
      container.removeEventListener('wheel', handleWheel)
      container.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('resize', handleResize)
      resizeObserver.disconnect()
    }
  }
}

