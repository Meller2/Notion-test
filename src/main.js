import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const canvas = document.querySelector('#webgl')
const loaderEl = document.querySelector('#loader')
const progressEl = document.querySelector('#loadProgress')
const progressBar = document.querySelector('.progress span')
const cursorGlow = document.querySelector('.cursor-glow')

const isGithubPages = window.location.hostname.includes('github.io')
const viteBase = import.meta.env?.BASE_URL
const baseUrl = viteBase || (isGithubPages ? '/Notion-test/' : './')
const MODEL_URLS = [
  `${baseUrl}models/model.glb`,
  `${baseUrl}public/models/model.glb`,
  './public/models/model.glb',
].filter((value, index, array) => array.indexOf(value) === index)

const sizes = { width: window.innerWidth, height: window.innerHeight }
const pointer = new THREE.Vector2(0, 0)
const isNarrow = () => window.innerWidth < 760
const isMedium = () => window.innerWidth < 1120

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function splitText() {
  document.querySelectorAll('.split-lines').forEach((element) => {
    const html = element.innerHTML
    const chunks = html.split(/<br\s*\/?>/i)

    element.innerHTML = chunks.map((chunk) => {
      const temp = document.createElement('span')
      temp.innerHTML = chunk.trim()
      const text = temp.textContent || ''

      const words = text.split(/(\s+)/).map((part) => {
        if (/^\s+$/.test(part)) return '<span class="split-space"> </span>'
        const chars = [...part].map((char) => `<span class="split-char">${escapeHtml(char)}</span>`).join('')
        return `<span class="split-word">${chars}</span>`
      }).join('')

      return `<span class="split-line">${words}</span>`
    }).join('')
  })
}

splitText()

const scene = new THREE.Scene()
scene.fog = new THREE.FogExp2(0x070706, 0.043)

const camera = new THREE.PerspectiveCamera(34, sizes.width / sizes.height, 0.1, 160)
camera.position.set(0.2, 1.05, 7.25)
scene.add(camera)

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.08
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

const carRig = new THREE.Group()
const carPivot = new THREE.Group()
carRig.position.set(2.65, 0, -0.35)
carRig.add(carPivot)
scene.add(carRig)

const hemi = new THREE.HemisphereLight(0xf3ead8, 0x0a0a08, 0.85)
scene.add(hemi)

const key = new THREE.DirectionalLight(0xf1eadc, 4.2)
key.position.set(4.8, 5.2, 4.2)
key.castShadow = true
key.shadow.mapSize.set(2048, 2048)
scene.add(key)

const rim = new THREE.DirectionalLight(0xc6a15b, 4.7)
rim.position.set(-5.5, 2.4, -4.5)
scene.add(rim)

const accent = new THREE.PointLight(0x6e1f1a, 3.25, 10)
accent.position.set(2.4, 1.4, -2.8)
scene.add(accent)

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(42, 42, 48, 48),
  new THREE.MeshStandardMaterial({
    color: 0x0c0b09,
    metalness: 0.18,
    roughness: 0.38,
    transparent: true,
    opacity: 0.82,
  })
)
floor.rotation.x = -Math.PI / 2
floor.position.y = -1.08
floor.receiveShadow = true
scene.add(floor)

const grid = new THREE.GridHelper(42, 42, 0xc6a15b, 0x24221d)
grid.position.y = -1.055
grid.material.transparent = true
grid.material.opacity = 0.18
scene.add(grid)

function createParticles() {
  const count = 300
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 22
    positions[i * 3 + 1] = Math.random() * 7 - 1
    positions[i * 3 + 2] = (Math.random() - 0.5) * 18
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const material = new THREE.PointsMaterial({
    size: 0.022,
    color: 0xc6a15b,
    transparent: true,
    opacity: 0.28,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  return new THREE.Points(geometry, material)
}
const particles = createParticles()
scene.add(particles)

function makeFallbackCar() {
  const group = new THREE.Group()
  const paint = new THREE.MeshStandardMaterial({ color: 0x14130f, metalness: 0.72, roughness: 0.24 })
  const glass = new THREE.MeshStandardMaterial({ color: 0x4a473d, metalness: 0.1, roughness: 0.05, transparent: true, opacity: 0.5 })
  const rubber = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.52 })
  const lamp = new THREE.MeshStandardMaterial({ color: 0xe2c782, emissive: 0xc6a15b, emissiveIntensity: 1.15 })

  const body = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.42, 1.18), paint)
  body.position.y = 0.18
  body.castShadow = true
  group.add(body)

  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.48, 0.92), glass)
  cabin.position.set(-0.18, 0.64, 0)
  cabin.castShadow = true
  group.add(cabin)

  const hood = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.12, 1.05), paint)
  hood.position.set(0.82, 0.46, 0)
  group.add(hood)

  for (const x of [-0.9, 0.9]) {
    for (const z of [-0.63, 0.63]) {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.22, 36), rubber)
      wheel.rotation.z = Math.PI / 2
      wheel.position.set(x, -0.06, z)
      wheel.castShadow = true
      group.add(wheel)
    }
  }

  const light = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.12, 0.86), lamp)
  light.position.set(1.39, 0.28, 0)
  group.add(light)

  return group
}

function frameModel(object) {
  const box = new THREE.Box3().setFromObject(object)
  const size = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())
  object.position.sub(center)
  const maxAxis = Math.max(size.x, size.y, size.z) || 1
  object.scale.setScalar(2.72 / maxAxis)
  object.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true
      child.receiveShadow = true
      if (child.material) {
        child.material.envMapIntensity = 0.95
        child.material.needsUpdate = true
      }
    }
  })
}

let car = null
let loaded = false
let timedOut = false
const gltfLoader = new GLTFLoader()

function revealCar(object) {
  car = object
  frameModel(car)
  carPivot.add(car)
  loaded = true
  hideLoader()
  gsap.fromTo(carPivot.scale, { x: 0.18, y: 0.18, z: 0.18 }, { x: 1, y: 1, z: 1, duration: 1.35, ease: 'expo.out' })
  gsap.fromTo(carPivot.rotation, { y: -Math.PI * 0.7 }, { y: -0.18, duration: 1.45, ease: 'power4.out' })
}

function loadModelFromList(index = 0) {
  const url = MODEL_URLS[index]
  if (!url || timedOut) {
    console.warn('[E30 Nocturne] GLB не загрузился, показываю fallback-машину.')
    revealCar(makeFallbackCar())
    return
  }

  gltfLoader.load(
    url,
    (gltf) => revealCar(gltf.scene),
    (event) => {
      const percent = event.total ? Math.round((event.loaded / event.total) * 100) : Math.min(95, 12 + index * 28)
      progressEl.textContent = `${Math.min(percent, 99)}%`
    },
    (error) => {
      console.warn(`[E30 Nocturne] Не удалось загрузить модель по пути ${url}`, error)
      loadModelFromList(index + 1)
    }
  )
}

function hideLoader() {
  progressEl.textContent = '100%'
  window.setTimeout(() => loaderEl.classList.add('is-hidden'), 220)
}

loadModelFromList()

window.setTimeout(() => {
  if (!loaded) {
    timedOut = true
    progressEl.textContent = 'fallback'
    revealCar(makeFallbackCar())
  }
}, 4500)

const intro = gsap.timeline({ defaults: { ease: 'power4.out' }, delay: 0.15 })
intro
  .from('.brand, .nav', { y: -26, opacity: 0, duration: 0.9, stagger: 0.08 })
  .from('.hero__meta', { y: 28, opacity: 0, duration: 0.8 }, '-=.55')
  .from('.hero .split-char', { yPercent: 115, rotate: 5, opacity: 0, duration: 0.95, stagger: 0.012 }, '-=.45')
  .from('.hero__lead, .hero__actions', { y: 34, opacity: 0, duration: 0.9, stagger: 0.12 }, '-=.55')

function setupScroll() {
  gsap.utils.toArray('.copy-panel, .showcase-panel, .final-panel').forEach((section) => {
    gsap.from(section.querySelectorAll('.split-char'), {
      yPercent: 112,
      opacity: 0,
      rotate: 4,
      duration: 0.9,
      ease: 'power4.out',
      stagger: 0.008,
      scrollTrigger: { trigger: section, start: 'top 68%' }
    })
    gsap.from(section.querySelectorAll('.reveal-line'), {
      y: 34,
      opacity: 0,
      duration: 0.85,
      ease: 'power3.out',
      stagger: 0.08,
      scrollTrigger: { trigger: section, start: 'top 70%' }
    })
  })

  const sceneTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.page',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.15,
      onUpdate: (self) => { progressBar.style.width = `${self.progress * 100}%` }
    }
  })

  const mobileScale = isNarrow() ? 0.5 : 0.82
  const side = isNarrow() ? 1.05 : isMedium() ? 2.3 : 3.15
  const heroSide = isNarrow() ? 0.75 : isMedium() ? 2.2 : 3.05
  const depth = isNarrow() ? -0.55 : -0.95

  sceneTl
    // Hero: text sits left, car lives on the far right.
    .to(carRig.rotation, { y: Math.PI * 0.42, x: 0.03, ease: 'none' }, 0)
    .to(carRig.position, { x: heroSide, y: -0.05, z: depth, ease: 'none' }, 0)
    .to(carPivot.scale, { x: mobileScale, y: mobileScale, z: mobileScale, ease: 'none' }, 0)
    .to(camera.position, { x: -0.5, y: 0.9, z: 7.05, ease: 'none' }, 0)

    // Motion panel: text is right, car is pushed hard left and slightly back.
    .to(carRig.rotation, { y: Math.PI * 0.95, x: 0.02, ease: 'none' }, 0.2)
    .to(carRig.position, { x: -side, y: -0.08, z: depth - 0.35, ease: 'none' }, 0.2)
    .to(camera.position, { x: 0.68, y: 0.98, z: 6.55, ease: 'none' }, 0.2)
    .to(rim, { intensity: 6.5, ease: 'none' }, 0.2)

    // Craft panel: text is left, car is pushed hard right.
    .to(carRig.rotation, { y: Math.PI * 1.58, x: -0.02, ease: 'none' }, 0.46)
    .to(carRig.position, { x: side, y: -0.08, z: depth - 0.4, ease: 'none' }, 0.46)
    .to(camera.position, { x: -0.72, y: 1.08, z: 6.2, ease: 'none' }, 0.46)
    .to(accent.position, { x: -2.5, y: 1.9, z: 2.1, ease: 'none' }, 0.46)

    // Showcase card is centered, so car stays as a side hero element, not under the card.
    .to(carRig.rotation, { y: Math.PI * 2.05, x: 0, ease: 'none' }, 0.68)
    .to(carRig.position, { x: side + 0.55, y: -0.08, z: depth - 0.25, ease: 'none' }, 0.68)
    .to(camera.position, { x: -0.55, y: 1.28, z: 6.35, ease: 'none' }, 0.68)

    // Final: content left, car remains right and lower in frame.
    .to(carRig.rotation, { y: Math.PI * 2.35, x: 0, ease: 'none' }, 0.84)
    .to(carRig.position, { x: side, y: -0.18, z: depth - 0.15, ease: 'none' }, 0.84)
    .to(camera.position, { x: -0.35, y: 1.32, z: 6.75, ease: 'none' }, 0.84)

  gsap.to('.ambient-a', { x: '18vw', y: '12vh', scrollTrigger: { trigger: '.page', scrub: 1 } })
  gsap.to('.ambient-b', { x: '-14vw', y: '-18vh', scrollTrigger: { trigger: '.page', scrub: 1 } })
}
setupScroll()

window.addEventListener('pointermove', (event) => {
  pointer.x = (event.clientX / sizes.width - 0.5) * 2
  pointer.y = -(event.clientY / sizes.height - 0.5) * 2
  cursorGlow.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`
})

const clock = new THREE.Clock()
function tick() {
  const elapsed = clock.getElapsedTime()
  const parallaxX = pointer.x * 0.1
  const parallaxY = pointer.y * 0.065

  carRig.rotation.x += (parallaxY - carRig.rotation.x) * 0.018
  carRig.position.y += ((Math.sin(elapsed * 0.78) * 0.035) - carRig.position.y) * 0.02
  carPivot.rotation.z = Math.sin(elapsed * 0.62) * 0.012

  camera.lookAt(parallaxX, 0.18 + parallaxY, 0)
  particles.rotation.y = elapsed * 0.018
  particles.position.y = Math.sin(elapsed * 0.3) * 0.09
  grid.material.opacity = 0.15 + Math.sin(elapsed * 1.1) * 0.035

  renderer.render(scene, camera)
  requestAnimationFrame(tick)
}
tick()

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  ScrollTrigger.refresh()
})
