'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function SpacetimeBackground() {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const animationRef = useRef<number | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const fabricRef = useRef<THREE.Group | null>(null)
  const frameState = useRef({
    width: 0,
    height: 0,
    reducedMotion: false,
  })

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateReducedMotion = () => {
      frameState.current.reducedMotion = reduceMotionQuery.matches
    }
    updateReducedMotion()
    reduceMotionQuery.addEventListener?.('change', updateReducedMotion)

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#0D0D0D')
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
    camera.position.set(0, 0.3, 12)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8))
    renderer.setClearColor(0x000000, 0)
    rendererRef.current = renderer
    mount.appendChild(renderer.domElement)

    const group = new THREE.Group()
    scene.add(group)
    fabricRef.current = group

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xf2f2f2,
      transparent: true,
      opacity: 0.28,
    })

    const accentMaterial = new THREE.LineBasicMaterial({
      color: 0xf7b904,
      transparent: true,
      opacity: 0.2,
    })

    const createGrid = (segments: number, yOffset: number, zOffset: number, pitch: number, material: THREE.LineBasicMaterial) => {
      const geometry = new THREE.BufferGeometry()
      const positions: number[] = []

      for (let i = -segments; i <= segments; i += 1) {
        const x = i * pitch
        const xWave = Math.sin(i * 0.35) * 0.26
        const zWave = Math.cos(i * 0.42) * 0.22

        positions.push(x + xWave, -2.5 + yOffset, zOffset + zWave)
        positions.push(x + xWave, 2.5 + yOffset, zOffset + zWave)

        const y = i * pitch
        const yWave = Math.sin(i * 0.4) * 0.3
        const zOffsetWave = Math.cos(i * 0.5) * 0.25

        positions.push(-2.5 + xWave, y + yWave, zOffsetWave)
        positions.push(2.5 + xWave, y + yWave, zOffsetWave)
      }

      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
      return new THREE.LineSegments(geometry, material)
    }

    const gridA = createGrid(22, 0.65, -1.4, 0.42, lineMaterial)
    const gridB = createGrid(18, -0.9, 1.0, 0.5, accentMaterial)
    const gridC = createGrid(12, 0.2, -2.4, 0.7, lineMaterial)

    const warpCurve = new THREE.Mesh(
      new THREE.TorusKnotGeometry(2.4, 0.09, 160, 24, 2, 3),
      new THREE.MeshBasicMaterial({
        color: 0xf2f2f2,
        transparent: true,
        opacity: 0.12,
        wireframe: true,
      })
    )

    warpCurve.rotation.x = Math.PI / 2.3
    warpCurve.rotation.y = 0.7
    warpCurve.position.z = -0.8

    group.add(gridA, gridB, gridC, warpCurve)

    const handleResize = () => {
      const { innerWidth, innerHeight } = window
      const width = Math.max(innerWidth, 320)
      const height = Math.max(innerHeight, 240)
      frameState.current.width = width
      frameState.current.height = height

      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
    }

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)

      if (frameState.current.reducedMotion) {
        group.rotation.x = -0.68
        group.rotation.y = 0.1
        group.position.y = 0
        renderer.render(scene, camera)
        return
      }

      const t = performance.now() * 0.00045
      group.rotation.x = -0.68 + Math.sin(t * 1.1) * 0.12
      group.rotation.y = t * 0.9
      group.rotation.z = Math.sin(t) * 0.08
      group.position.y = Math.sin(t * 1.8) * 0.25
      warpCurve.rotation.z += 0.003
      warpCurve.rotation.x += 0.0015

      const gridPulse = Math.sin(t * 2.6) * 0.15
      gridA.position.z = -1.8 + gridPulse
      gridB.position.z = 1.0 + Math.cos(t * 1.8) * 0.12
      gridC.position.z = -2.8 + Math.sin(t * 1.4) * 0.15

      renderer.render(scene, camera)
    }

    handleResize()
    animate()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      reduceMotionQuery.removeEventListener?.('change', updateReducedMotion)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)

      group.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose()
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose())
          } else {
            object.material.dispose()
          }
        }

        if (object instanceof THREE.LineSegments) {
          object.geometry.dispose()
          object.material.dispose()
        }
      })

      renderer.dispose()
      mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-90"
    />
  )
}
