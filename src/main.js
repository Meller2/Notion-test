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

function splitText() {
  document.querySelectorAll('.split-lines').forEach((element) => {
    const html = element.innerHTML
    const chunks = html.split(/<br\s*\/?>/i)
    element.innerHTML = chunks.map((chunk) => {
      const temp = document.createElement('span')
      temp.innerHTML = chunk.trim()
      const text = temp.textContent || ''
      const chars = [...text].map((char) => {
        if (char === ' ') return '<span class="split-char">&nbsp;</span>'
        return `<span class="split-char">${char}</span>`
      }).join('')
      return `<span class="split-line"><span class="split-word">${chars}</span></span>`
    }).join('')
  })
}

splitText()

const scene = new THREE.Scene()
scene.fog = new THREE.FogExp2(0x05060f, 0.045)

const camera = new THREE.PerspectiveCamera(38, sizes.width / sizes.height, 0.1, 160)
camera.position.set(0.2, 1.05, 6.6)
scene.add(camera)

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.25
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

const carRig = new THREE.Group()
const carPivot = new THREE.Group()
carRig.add(carPivot)
scene.add(carRig)

const hemi = new THREE.HemisphereLight(0xdde8ff, 0x070713, 1.1)
scene.add(hemi)

const key = new THREE.DirectionalLight(0xffffff, 4.8)
key.position.set(4.8, 5.2, 4.2)
key.castShadow = true
key.shadow.mapSize.set(2048, 2048)
scene.add(key)

const rim = new THREE.DirectionalLight(0x39dfff, 5.2)
rim.position.set(-5.5, 2.4, -4.5)
scene.add(rim)

const magenta = new THREE.PointLight(0xff3d9a, 4.5, 10)
magenta.position.set(2.4, 1.4, -2.8)
scene.add(magenta)

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(38, 38, 48, 48),
  new THREE.MeshStandardMaterial({
    color: 0x080a12,
    metalness: 0.25,
    roughness: 0.32,
    transparent: true,
    opacity: 0.78,
  })
)
floor.rotation.x = -Math.PI / 2
floor.position.y = -1.08
floor.receiveShadow = true
scene.add(floor)

const grid = new THREE.GridHelper(38, 38, 0x2be7ff, 0x20253f)
grid.position.y = -1.055
grid.material.transparent = true
grid.material.opacity = 0.28
scene.add(grid)

function createParticles() {
  const count = 420
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 22
    positions[i * 3 + 1] = Math.random() * 7 - 1
    positions[i * 3 + 2] = (Math.random() - 0.5) * 18
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const material = new THREE.PointsMaterial({
    size: 0.028,
    color: 0x75ecff,
    transparent: true,
    opacity: 0.44,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  return new THREE.Points(geometry, material)
}
const particles = createParticles()
scene.add(particles)

function makeFallbackCar() {
  const group = new THREE.Group()
  const paint = new THREE.MeshStandardMaterial({ color: 0x171b2e, metalness: 0.72, roughness: 0.22 })
  const glass = new THREE.MeshStandardMaterial({ color: 0x1ee8ff, metalness: 0.1, roughness: 0.04, transparent: true, opacity: 0.45 })
  const rubber = new THREE.MeshStandardMaterial({ color: 0x050507, roughness: 0.5 })
  const neon = new THREE.MeshStandardMaterial({ color: 0x2be7ff, emissive: 0x2be7ff, emissiveIntensity: 1.6 })

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

  const light = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.12, 0.86), neon)
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
  object.scale.setScalar(3.35 / maxAxis)
  object.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true
      child.receiveShadow = true
      if (child.material) {
        child.material.envMapIntensity = 1.25
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
  gsap.fromTo(carPivot.rotation, { y: -Math.PI * 0.7 }, { y: -0.22, duration: 1.45, ease: 'power4.out' })
}

function loadModelFromList(index = 0) {
  const url = MODEL_URLS[index]
  if (!url || timedOut) {
    console.warn('[NOVA] GLB не загрузился, показываю fallback-машину.')
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
      console.warn(`[NOVA] Не удалось загрузить модель по пути ${url}`, error)
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
  .from('.hero .split-char', { yPercent: 115, rotate: 8, opacity: 0, duration: 0.95, stagger: 0.012 }, '-=.45')
  .from('.hero__lead, .hero__actions', { y: 34, opacity: 0, duration: 0.9, stagger: 0.12 }, '-=.55')

function setupScroll() {
  gsap.utils.toArray('.copy-panel, .showcase-panel, .final-panel').forEach((section) => {
    gsap.from(section.querySelectorAll('.split-char'), {
      yPercent: 112,
      opacity: 0,
      rotate: 5,
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

  sceneTl
    .to(carRig.rotation, { y: Math.PI * 0.55, x: 0.08, ease: 'none' }, 0)
    .to(carRig.position, { x: -1.1, y: -0.05, z: -0.25, ease: 'none' }, 0)
    .to(camera.position, { x: -0.85, y: 0.7, z: 5.25, ease: 'none' }, 0)
    .to(rim, { intensity: 8.5, ease: 'none' }, 0.18)
    .to(magenta.position, { x: -2.5, y: 1.9, z: 2.1, ease: 'none' }, 0.22)
    .to(carRig.rotation, { y: Math.PI * 1.25, x: -0.03, ease: 'none' }, 0.42)
    .to(carRig.position, { x: 1.05, y: -0.08, z: -0.35, ease: 'none' }, 0.42)
    .to(camera.position, { x: 1.05, y: 1.22, z: 4.45, ease: 'none' }, 0.42)
    .to(carRig.rotation, { y: Math.PI * 2.05, x: 0, ease: 'none' }, 0.74)
    .to(carRig.position, { x: 0, y: 0, z: 0.15, ease: 'none' }, 0.74)
    .to(camera.position, { x: 0, y: 1.45, z: 5.85, ease: 'none' }, 0.74)

  gsap.to('.aurora-a', { x: '22vw', y: '16vh', scrollTrigger: { trigger: '.page', scrub: 1 } })
  gsap.to('.aurora-b', { x: '-18vw', y: '-20vh', scrollTrigger: { trigger: '.page', scrub: 1 } })
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
  const parallaxX = pointer.x * 0.18
  const parallaxY = pointer.y * 0.12

  carRig.rotation.x += (parallaxY - carRig.rotation.x) * 0.025
  carRig.position.y = Math.sin(elapsed * 0.9) * 0.055
  carPivot.rotation.z = Math.sin(elapsed * 0.7) * 0.018

  camera.lookAt(parallaxX, 0.18 + parallaxY, 0)
  particles.rotation.y = elapsed * 0.025
  particles.position.y = Math.sin(elapsed * 0.35) * 0.12
  grid.material.opacity = 0.22 + Math.sin(elapsed * 1.4) * 0.055

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
