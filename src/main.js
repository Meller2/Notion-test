import './style.css'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ↓↓↓ ПОЛОЖИ СВОЮ МОДЕЛЬ СЮДА: public/models/model.glb ↓↓↓
const MODEL_URL = './models/model.glb'

const canvas = document.querySelector('#webgl')
const scene = new THREE.Scene()
const sizes = { width: window.innerWidth, height: window.innerHeight }

const camera = new THREE.PerspectiveCamera(42, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0.4, 6)
scene.add(camera)

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.1

// свет
const key = new THREE.DirectionalLight(0xffffff, 3.2); key.position.set(4, 5, 4); scene.add(key)
const rim = new THREE.DirectionalLight(0x7c8cff, 2.4); rim.position.set(-5, 2, -4); scene.add(rim)
scene.add(new THREE.AmbientLight(0xffffff, 0.45))

const group = new THREE.Group()
scene.add(group)

function frameModel(obj) {
  const box = new THREE.Box3().setFromObject(obj)
  const size = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())
  obj.position.sub(center)
  const maxAxis = Math.max(size.x, size.y, size.z) || 1
  obj.scale.setScalar(2.4 / maxAxis)
}

let loaded = null
const loader = new GLTFLoader()
loader.load(
  MODEL_URL,
  (gltf) => { loaded = gltf.scene; frameModel(loaded); group.add(loaded) },
  undefined,
  () => {
    // заглушка, пока нет реальной модели
    const geo = new THREE.TorusKnotGeometry(1, 0.34, 220, 32)
    const mat = new THREE.MeshStandardMaterial({ color: 0x6366f1, metalness: 0.55, roughness: 0.18 })
    loaded = new THREE.Mesh(geo, mat)
    group.add(loaded)
    console.warn('[NOVA] Модель не найдена. Залей файл в public/models/model.glb — пока показываю заглушку.')
  }
)

// скролл-анимация: вращение + камера
gsap.to(group.rotation, {
  y: Math.PI * 3,
  ease: 'none',
  scrollTrigger: { trigger: '.overlay', start: 'top top', end: 'bottom bottom', scrub: 1 },
})
gsap.to(camera.position, {
  z: 4, y: -0.6,
  ease: 'none',
  scrollTrigger: { trigger: '.overlay', start: 'top top', end: 'bottom bottom', scrub: 1 },
})

// появление текста панелей
gsap.utils.toArray('.panel > div').forEach((el) => {
  gsap.from(el, { opacity: 0, y: 40, duration: 1, scrollTrigger: { trigger: el, start: 'top 80%' } })
})

const clock = new THREE.Clock()
function tick() {
  const t = clock.getElapsedTime()
  group.rotation.x = Math.sin(t * 0.3) * 0.08
  if (loaded) loaded.position.y = Math.sin(t * 0.8) * 0.06
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
})
