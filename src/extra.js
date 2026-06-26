import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ENGINE_AUDIO_URL = `${import.meta.env.BASE_URL}1-zvuk_motora_-_Zvuk_motora_(SkySound.cc).mp3`

const style = document.createElement('style')
style.textContent = `
  .engine-toggle {
    position: fixed;
    left: clamp(18px, 5vw, 72px);
    bottom: 38px;
    z-index: 12;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    min-height: 44px;
    padding: 0 16px;
    border: 1px solid rgba(241,234,220,.16);
    border-radius: 999px;
    color: #090806;
    background: linear-gradient(135deg, #e2c782, #f1eadc);
    font: 900 12px/1 Inter, system-ui, sans-serif;
    letter-spacing: .12em;
    text-transform: uppercase;
    cursor: pointer;
    box-shadow: 0 18px 70px rgba(198,161,91,.2);
  }
  .engine-toggle::before {
    content: "";
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: #6e1f1a;
    box-shadow: 0 0 18px rgba(110,31,26,.6);
  }
  body.engine-on .engine-toggle::before { background: #2f3b28; box-shadow: 0 0 18px rgba(226,199,130,.75); }

  .tach {
    position: fixed;
    right: clamp(18px, 5vw, 72px);
    top: 118px;
    z-index: 8;
    width: 156px;
    height: 156px;
    border-radius: 50%;
    border: 1px solid rgba(241,234,220,.14);
    background: radial-gradient(circle at 50% 55%, rgba(241,234,220,.08), rgba(7,7,6,.55) 58%, rgba(7,7,6,.2));
    backdrop-filter: blur(16px);
    box-shadow: 0 20px 80px rgba(0,0,0,.32);
    pointer-events: none;
    opacity: .92;
  }
  .tach::before {
    content: "";
    position: absolute;
    inset: 14px;
    border-radius: 50%;
    border: 1px dashed rgba(226,199,130,.24);
  }
  .tach__needle {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 48px;
    height: 2px;
    transform-origin: 0 50%;
    transform: rotate(-132deg);
    background: linear-gradient(90deg, #e2c782, #6e1f1a);
    box-shadow: 0 0 18px rgba(226,199,130,.55);
  }
  .tach__center {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 14px;
    height: 14px;
    margin: -7px 0 0 -7px;
    border-radius: 50%;
    background: #e2c782;
  }
  .tach__rpm {
    position: absolute;
    inset: auto 0 34px;
    text-align: center;
    color: #f1eadc;
    font: 900 20px/1 Inter, system-ui, sans-serif;
    letter-spacing: -.04em;
  }
  .tach__label {
    position: absolute;
    inset: auto 0 20px;
    text-align: center;
    color: rgba(241,234,220,.55);
    font: 800 9px/1 Inter, system-ui, sans-serif;
    letter-spacing: .18em;
    text-transform: uppercase;
  }
  .gearbox {
    position: fixed;
    right: clamp(18px, 5vw, 72px);
    top: 286px;
    z-index: 8;
    display: flex;
    gap: 7px;
    pointer-events: none;
  }
  .gearbox span {
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    border: 1px solid rgba(241,234,220,.12);
    border-radius: 10px;
    color: rgba(241,234,220,.45);
    background: rgba(7,7,6,.48);
    backdrop-filter: blur(12px);
    font: 900 11px/1 Inter, system-ui, sans-serif;
  }
  .gearbox span.is-active {
    color: #090806;
    background: #e2c782;
    box-shadow: 0 0 28px rgba(226,199,130,.25);
  }

  .cut-mark {
    position: fixed;
    z-index: 11;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) scale(.9);
    color: rgba(241,234,220,.9);
    font: 950 clamp(54px, 9vw, 150px)/.82 Inter, system-ui, sans-serif;
    letter-spacing: -.08em;
    text-transform: uppercase;
    pointer-events: none;
    opacity: 0;
    mix-blend-mode: screen;
    text-shadow: 0 18px 80px rgba(0,0,0,.48);
  }

  .road-lines {
    position: fixed;
    inset: 0;
    z-index: 2;
    pointer-events: none;
    opacity: .32;
    background:
      linear-gradient(90deg, transparent 0 48%, rgba(226,199,130,.2) 49% 51%, transparent 52% 100%),
      repeating-linear-gradient(90deg, transparent 0 7vw, rgba(241,234,220,.04) 7.08vw 7.12vw);
    transform: perspective(650px) rotateX(62deg) translateY(36vh) scaleX(1.2);
    transform-origin: bottom center;
    mask-image: linear-gradient(to top, black, transparent 68%);
  }
  body.is-warp .road-lines { animation: roadWarp .32s ease-out; }
  @keyframes roadWarp { 50% { transform: perspective(650px) rotateX(62deg) translateY(40vh) scaleX(1.36) scaleY(1.35); opacity: .58; } }

  .poster-stamp {
    position: fixed;
    z-index: 6;
    left: clamp(18px, 5vw, 72px);
    top: 50%;
    transform: translateY(-50%) rotate(-90deg);
    transform-origin: left center;
    color: rgba(226,199,130,.11);
    font: 950 clamp(84px, 12vw, 190px)/1 Inter, system-ui, sans-serif;
    letter-spacing: -.1em;
    pointer-events: none;
    opacity: 0;
  }
  body.poster-mode .poster-stamp { opacity: 1; }

  .micro-sparks {
    position: fixed;
    inset: 0;
    z-index: 6;
    pointer-events: none;
    overflow: hidden;
  }
  .spark {
    position: absolute;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: #e2c782;
    box-shadow: 0 0 14px rgba(226,199,130,.9);
  }

  @media (max-width: 760px) {
    .engine-toggle, .tach, .gearbox, .poster-stamp { display: none; }
  }
`
document.head.appendChild(style)

const roadLines = document.createElement('div')
roadLines.className = 'road-lines'
document.body.appendChild(roadLines)

const sparks = document.createElement('div')
sparks.className = 'micro-sparks'
document.body.appendChild(sparks)

const cutMark = document.createElement('div')
cutMark.className = 'cut-mark'
cutMark.textContent = 'CUT'
document.body.appendChild(cutMark)

const posterStamp = document.createElement('div')
posterStamp.className = 'poster-stamp'
posterStamp.textContent = 'NOCTURNE'
document.body.appendChild(posterStamp)

const engineButton = document.createElement('button')
engineButton.className = 'engine-toggle'
engineButton.type = 'button'
engineButton.textContent = 'Engine sound'
document.body.appendChild(engineButton)

const tach = document.createElement('div')
tach.className = 'tach'
tach.innerHTML = '<div class="tach__needle"></div><div class="tach__center"></div><div class="tach__rpm">900</div><div class="tach__label">RPM x10</div>'
document.body.appendChild(tach)

const gearbox = document.createElement('div')
gearbox.className = 'gearbox'
gearbox.innerHTML = '<span class="is-active">1</span><span>2</span><span>3</span><span>4</span><span>5</span>'
document.body.appendChild(gearbox)

const needle = tach.querySelector('.tach__needle')
const rpmText = tach.querySelector('.tach__rpm')
const gears = [...gearbox.querySelectorAll('span')]

const engineAudio = new Audio(encodeURI(ENGINE_AUDIO_URL))
engineAudio.loop = true
engineAudio.preload = 'auto'
engineAudio.volume = 0
engineAudio.playbackRate = 0.86

let currentRpm = 900
let targetVolume = 0
let currentVolume = 0

function updateEngineSound(rpm) {
  const isOn = document.body.classList.contains('engine-on')
  targetVolume = isOn ? 0.42 : 0

  const spike = Math.max(0, Math.min(1, (rpm - 2400) / 4200))
  const rate = 0.82 + Math.min(0.55, rpm / 9000) + spike * 0.08
  engineAudio.playbackRate = Math.max(0.75, Math.min(1.42, rate))
}

function tickAudioFade() {
  currentVolume += (targetVolume - currentVolume) * 0.08
  engineAudio.volume = Math.max(0, Math.min(0.55, currentVolume))
  requestAnimationFrame(tickAudioFade)
}
tickAudioFade()

engineButton.addEventListener('click', async () => {
  document.body.classList.toggle('engine-on')
  engineButton.textContent = document.body.classList.contains('engine-on') ? 'Engine on' : 'Engine sound'

  if (document.body.classList.contains('engine-on')) {
    try {
      await engineAudio.play()
    } catch (error) {
      console.warn('[E30 Nocturne] Браузер не дал включить звук.', error)
      document.body.classList.remove('engine-on')
      engineButton.textContent = 'Engine sound'
    }
  }

  updateEngineSound(currentRpm)
})

function burstSparks(amount = 18) {
  const originX = window.innerWidth * (0.35 + Math.random() * 0.35)
  const originY = window.innerHeight * (0.42 + Math.random() * 0.28)
  for (let i = 0; i < amount; i += 1) {
    const spark = document.createElement('i')
    spark.className = 'spark'
    spark.style.left = `${originX}px`
    spark.style.top = `${originY}px`
    sparks.appendChild(spark)
    gsap.to(spark, {
      x: (Math.random() - 0.5) * 360,
      y: (Math.random() - 0.6) * 220,
      opacity: 0,
      scale: Math.random() * 2.8 + 0.6,
      duration: Math.random() * 0.55 + 0.35,
      ease: 'power3.out',
      onComplete: () => spark.remove(),
    })
  }
}

function punch(label) {
  cutMark.textContent = label
  gsap.fromTo(cutMark, { opacity: 0, scale: 0.84, y: 20 }, { opacity: 0.9, scale: 1, y: 0, duration: 0.09, ease: 'power4.out' })
  gsap.to(cutMark, { opacity: 0, scale: 1.08, duration: 0.24, delay: 0.08, ease: 'power2.out' })
  document.body.classList.add('is-warp')
  window.setTimeout(() => document.body.classList.remove('is-warp'), 340)
  burstSparks(20)
}

function setGear(gear) {
  gears.forEach((item, index) => item.classList.toggle('is-active', index === gear - 1))
}

function updateTach(progress) {
  const peaks = [0.12, 0.18, 0.56]
  const spike = peaks.reduce((value, point) => Math.max(value, 1 - Math.min(1, Math.abs(progress - point) / 0.035)), 0)
  const cruising = 1100 + Math.sin(progress * Math.PI * 7) * 420 + progress * 1800
  currentRpm = Math.round(cruising + spike * 4200)
  const angle = -132 + Math.min(1, currentRpm / 7200) * 264
  needle.style.transform = `rotate(${angle}deg)`
  rpmText.textContent = String(Math.round(currentRpm / 10))
  updateEngineSound(currentRpm)

  if (progress < 0.18) setGear(1)
  else if (progress < 0.36) setGear(2)
  else if (progress < 0.58) setGear(3)
  else if (progress < 0.78) setGear(4)
  else setGear(5)
}

let lastZone = ''
ScrollTrigger.create({
  trigger: '.page',
  start: 'top top',
  end: 'bottom bottom',
  scrub: true,
  onUpdate: (self) => {
    const p = self.progress
    updateTach(p)
    document.body.classList.toggle('poster-mode', p > 0.72)

    const zone = p < 0.105 ? 'wide'
      : p < 0.16 ? 'RIM'
      : p < 0.235 ? 'HEADLIGHT'
      : p < 0.34 ? 'SWEEP'
      : p < 0.5 ? 'BODY'
      : p < 0.62 ? 'REAR'
      : p < 0.8 ? 'PULLBACK'
      : 'FINAL'

    if (zone !== lastZone) {
      lastZone = zone
      if (['RIM', 'HEADLIGHT', 'REAR'].includes(zone)) punch(zone)
    }
  }
})
