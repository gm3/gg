// Simple Three.js wireframe tree that reacts to completion progress.
// Seed -> sapling -> small tree -> big glowing tree with "leaves" as deeds.

import * as THREE from 'three'

export function mountTreeScene(container, getCompletionRatio, getCompletedCount) {
  const width = container.clientWidth || 600
  const height = 260

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x020617)

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
  camera.position.set(0, 1.6, 4)

  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  container.appendChild(renderer.domElement)

  const ambient = new THREE.AmbientLight(0xffffff, 0.4)
  scene.add(ambient)
  const dir = new THREE.DirectionalLight(0xffffff, 0.6)
  dir.position.set(2, 4, 3)
  scene.add(dir)

  const trunkMaterial = new THREE.MeshBasicMaterial({
    color: 0x64748b,
    wireframe: true
  })

  const leafMaterial = new THREE.MeshBasicMaterial({
    color: 0x22c55e,
    wireframe: true
  })

  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0x4ade80
  })

  const trunkGeometry = new THREE.CylinderGeometry(0.08, 0.14, 1.6, 8, 1, true)
  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial)
  trunk.position.y = 0.8
  scene.add(trunk)

  const branches = new THREE.Group()
  scene.add(branches)

  const leafGroup = new THREE.Group()
  scene.add(leafGroup)

  function buildBranches(level) {
    branches.clear()
    if (level <= 0) return

    const branchGeo = new THREE.CylinderGeometry(0.02, 0.05, 0.9, 6, 1, true)
    const mat = new THREE.MeshBasicMaterial({
      color: 0x6b7280,
      wireframe: true
    })

    const count = level === 1 ? 2 : level === 2 ? 4 : 6
    for (let i = 0; i < count; i++) {
      const b = new THREE.Mesh(branchGeo, mat)
      const angle = (i / count) * Math.PI * 2
      b.position.set(Math.cos(angle) * 0.25, 1.1 + (i % 2) * 0.25, Math.sin(angle) * 0.25)
      b.rotation.z = (Math.random() - 0.5) * 0.8
      b.rotation.y = angle
      branches.add(b)
    }
  }

  function buildLeaves(totalLeaves, completedLeaves) {
    leafGroup.clear()
    if (totalLeaves <= 0) return

    const radius = 0.8
    for (let i = 0; i < totalLeaves; i++) {
      const t = i / totalLeaves
      const angle = t * Math.PI * 2
      const y = 1.1 + Math.sin(t * Math.PI) * 0.6
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius

      const geo = new THREE.SphereGeometry(0.07, 8, 8)
      const isCompletedLeaf = i < completedLeaves
      const mat = isCompletedLeaf ? glowMaterial : leafMaterial
      const leaf = new THREE.Mesh(geo, mat)
      leaf.position.set(x, y, z)
      leafGroup.add(leaf)
    }
  }

  function updateGrowth() {
    const ratio = getCompletionRatio()
    const completed = getCompletedCount()
    const totalLeaves = 24
    const completedLeaves = Math.min(totalLeaves, Math.round(totalLeaves * ratio))

    const level = ratio === 0 ? 0 : ratio < 0.25 ? 1 : ratio < 0.6 ? 2 : 3
    buildBranches(level)
    buildLeaves(totalLeaves, completedLeaves)

    const baseScale = 0.7 + ratio * 0.8
    trunk.scale.set(1, baseScale, 1)
    branches.scale.set(baseScale, baseScale, baseScale)
    leafGroup.scale.set(baseScale, baseScale, baseScale)
  }

  updateGrowth()

  let frameId
  function animate() {
    frameId = requestAnimationFrame(animate)
    const t = performance.now() * 0.00015
    trunk.rotation.y = t
    branches.rotation.y = t * 1.4
    leafGroup.rotation.y = t * 1.6
    renderer.render(scene, camera)
  }
  animate()

  function onResize() {
    const newWidth = container.clientWidth || width
    camera.aspect = newWidth / height
    camera.updateProjectionMatrix()
    renderer.setSize(newWidth, height)
  }

  window.addEventListener('resize', onResize)

  return {
    canvas: renderer.domElement,
    refresh: updateGrowth,
    destroy() {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      container.innerHTML = ''
    }
  }
}

