'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export function SpacetimeBackground() {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100)
    camera.position.set(0, 0.3, 9.8)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6))
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.pointerEvents = 'none'
    renderer.domElement.style.filter = 'blur(8px) saturate(1.25) brightness(0.9)'
    renderer.domElement.style.opacity = '0.9'
    renderer.domElement.style.transform = 'scale(1.08)'
    mount.appendChild(renderer.domElement)

    const ambient = new THREE.AmbientLight(0xffffff, 1.5)
    scene.add(ambient)

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2)
    keyLight.position.set(-4, 5, 8)
    scene.add(keyLight)

    let modelGroup: THREE.Group | null = null
    const artGroup = new THREE.Group()
    scene.add(artGroup)

    const loadModel = async () => {
      const loader = new GLTFLoader()
      const result = await loader.loadAsync('/spiral-background/assets/spiral-lite.glb')
      modelGroup = result.scene
      modelGroup.traverse((child) => {
        if ('isMesh' in child && child.isMesh) {
          child.castShadow = false
          child.receiveShadow = false
        }
      })

      const box = new THREE.Box3().setFromObject(modelGroup)
      const center = box.getCenter(new THREE.Vector3())
      modelGroup.position.sub(center)
      modelGroup.rotation.set(-0.7, 0.5, 0.2)
      artGroup.add(modelGroup)
      renderScene()
    }

    const group = new THREE.Group()
    scene.add(group)

    const createBackdrop = () => {
      const geometry = new THREE.IcosahedronGeometry(4.8, 1)
      const material = new THREE.MeshBasicMaterial({
        color: 0x05120d,
        transparent: true,
        opacity: 0.12,
        wireframe: true,
      })
      const mesh = new THREE.Mesh(geometry, material)
      mesh.rotation.set(0.6, 1.1, 0.3)
      group.add(mesh)
      return mesh
    }

    const backdrop = createBackdrop()

    const handleResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      const halfViewHeight = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z
      const halfViewWidth = halfViewHeight * camera.aspect
      const scale = Math.min(1.15, Math.max(0.7, width / 1400))
      group.scale.setScalar(scale)
      artGroup.position.set(halfViewWidth * 0.42, camera.position.y - halfViewHeight * 0.38, 0)
      artGroup.scale.setScalar(scale)
      renderScene()
    }

    const renderScene = () => {
      if (!reduceMotionQuery.matches) {
        const t = performance.now() * 0.0005
        const breathe = 1 + Math.sin(t * 3.2) * 0.08
        const scale = Math.min(1.15, Math.max(0.7, window.innerWidth / 1400)) * breathe
        const halfViewHeight = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z
        const halfViewWidth = halfViewHeight * camera.aspect

        group.rotation.x = -0.65 + Math.sin(t * 1.2) * 0.12
        group.rotation.y = t * 0.5
        group.rotation.z = Math.sin(t * 0.9) * 0.08
        group.position.y = Math.sin(t * 1.7) * 0.2
        group.scale.setScalar(scale)
        artGroup.rotation.set(-0.7 + Math.sin(t * 1.2) * 0.08, t * 0.5, 0.2 + Math.sin(t * 0.9) * 0.05)
        artGroup.position.set(
          halfViewWidth * 0.42,
          camera.position.y - halfViewHeight * 0.38 + Math.sin(t * 1.7) * 0.12,
          0
        )
        artGroup.scale.setScalar(scale * breathe)
        backdrop.rotation.x += 0.0012
        backdrop.rotation.y += 0.0014
      }
      renderer.render(scene, camera)
    }

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)
      renderScene()
    }

    handleResize()
    animate()
    void loadModel()

    const onResize = () => handleResize()
    window.addEventListener('resize', onResize)
    reduceMotionQuery.addEventListener?.('change', handleResize)

    return () => {
      window.removeEventListener('resize', onResize)
      reduceMotionQuery.removeEventListener?.('change', handleResize)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)

      modelGroup?.traverse((object) => {
        if ('isMesh' in object && object.isMesh) {
          const mesh = object as THREE.Mesh
          mesh.geometry.dispose()

          const material = mesh.material
          if (Array.isArray(material)) {
            material.forEach((entry) => entry.dispose())
          } else if (material) {
            material.dispose()
          }
        }

        if ('isLineSegments' in object && object.isLineSegments) {
          const line = object as THREE.LineSegments
          line.geometry.dispose()
          const material = line.material
          if (Array.isArray(material)) {
            material.forEach((entry) => entry.dispose())
          } else if (material) {
            material.dispose()
          }
        }
      })

      renderer.dispose()
      mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        ref={mountRef}
        aria-hidden="true"
        className="absolute inset-0"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(3,5,5,0.12),_rgba(3,5,5,0.3)_38%,_rgba(3,5,5,0.62)_82%)]" />
      <div className="absolute inset-0 backdrop-blur-[3px]" />
    </div>
  )
}
