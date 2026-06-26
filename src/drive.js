import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const style = document.createElement('style')
style.textContent = `
  .drive-world {
    position: fixed;
    inset: 0;
    z-index: 2;
    pointer-events: none;
    opacity: 0;
    transition: opacity .35s ease;
    overflow: hidden;
    perspective: 760px;
  }
  body.drive-active .drive-world { opacity: 1; }
  body.drive-active { --drive-intensity: 1; }

  .drive-world::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 50% 58%, rgba(226,199,130,.16), transparent 19vw),
      radial-gradient(circle at 52% 100%, rgba(110,31,26,.28), transparent 34vw),
      linear-gradient(180deg, rgba(7,7,6,.08), rgba(7,7,6,.74));
    opacity: .9;
  }

  .drive-road {
    position: absolute;
    left: 50%;
    bottom: -26vh;
    width: min(980px, 86vw);
    height: 128vh;
    transform: translateX(-50%) rotateX(68deg);
    transform-origin: bottom center;
    background:
      linear-gradient(90deg, transparent 0 10%, rgba(226,199,130,.26) 10.2% 10.45%, transparent 10.8% 48%, rgba(226,199,130,.75) 49.6% 50.4%, transparent 52% 89%, rgba(226,199,130,.26) 89.55% 89.8%, transparent 90.2%),
      repeating-linear-gradient(180deg, rgba(241,234,220,.34) 0 52px, transparent 52px 150px),
      linear-gradient(90deg, rgba(4,4,4,.05), rgba(20,17,12,.9) 20%, rgba(8,8,7,.98) 50%, rgba(20,17,12,.9) 80%, rgba(4,4,4,.05));
    border-left: 1px solid rgba(226,199,130,.18);
    border-right: 1px solid rgba(226,199,130,.18);
    box-shadow: 0 -30px 120px rgba(226,199,130,.13), inset 0 0 90px rgba(0,0,0,.65);
    animation: roadFlow .34s linear infinite;
  }
  body.drive-boost .drive-road { animation-duration: .18s; filter: brightness(1.18); }
  @keyframes roadFlow { to { background-position: 0 150px, 0 150px, 0 0; } }

  .drive-vanish {
    position: absolute;
    left: 50%;
    top: 39%;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: rgba(226,199,130,.78);
    box-shadow: 0 0 80px 34px rgba(226,199,130,.18), 0 0 160px 72px rgba(110,31,26,.1);
    transform: translate(-50%, -50%);
  }

  .drive-lamps {
    position: absolute;
    inset: 0;
    transform-style: preserve-3d;
  }
  .drive-lamp {
    position: absolute;
    top: 42%;
    left: 50%;
    width: 4px;
    height: 28vh;
    margin-left: -2px;
    transform-origin: 50% 100%;
    background: linear-gradient(180deg, rgba(226,199,130,0), rgba(226,199,130,.72), rgba(110,31,26,.08));
    box-shadow: 0 0 22px rgba(226,199,130,.45);
    opacity: .58;
  }
  .drive-lamp::before {
    content: "";
    position: absolute;
    top: -8px;
    left: 50%;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    transform: translateX(-50%);
    background: #e2c782;
    box-shadow: 0 0 38px rgba(226,199,130,.75), 0 0 92px rgba(110,31,26,.35);
  }

  .drive-lightstream {
    position: absolute;
    inset: 0;
    opacity: .8;
    mix-blend-mode: screen;
    mask-image: radial-gradient(circle at 50% 54%, black, transparent 67%);
  }
  .drive-lightstream i {
    position: absolute;
    top: 46%;
    left: 50%;
    width: 46vw;
    height: 1px;
    transform-origin: left center;
    background: linear-gradient(90deg, rgba(226,199,130,.72), transparent);
    animation: tunnelStreak .42s ease-out infinite;
  }
  .drive-lightstream i:nth-child(1) { transform: rotate(18deg); animation-delay: 0s; }
  .drive-lightstream i:nth-child(2) { transform: rotate(-18deg); animation-delay: .05s; }
  .drive-lightstream i:nth-child(3) { transform: rotate(32deg); animation-delay: .1s; }
  .drive-lightstream i:nth-child(4) { transform: rotate(-32deg); animation-delay: .15s; }
  .drive-lightstream i:nth-child(5) { transform: rotate(7deg); animation-delay: .2s; }
  .drive-lightstream i:nth-child(6) { transform: rotate(-7deg); animation-delay: .25s; }
  @keyframes tunnelStreak {
    from { opacity: 0; width: 8vw; }
    18% { opacity: .85; }
    to { opacity: 0; width: 78vw; transform: translateX(-34vw) scaleX(1.6) rotate(var(--r, 0deg)); }
  }

  .drive-fog {
    position: absolute;
    inset: -20%;
    background:
      radial-gradient(circle at 24% 56%, rgba(226,199,130,.13), transparent 28vw),
      radial-gradient(circle at 76% 48%, rgba(110,31,26,.16), transparent 32vw),
      repeating-linear-gradient(90deg, transparent 0 120px, rgba(241,234,220,.025) 121px 122px);
    filter: blur(10px);
    opacity: .78;
    animation: fogDrift 5.5s ease-in-out infinite alternate;
  }
  @keyframes fogDrift { to { transform: translate3d(-3vw, 2vh, 0) scale(1.04); } }

  .drive-hud {
    position: fixed;
    left: 50%;
    top: clamp(92px, 14vh, 150px);
    z-index: 9;
    transform: translateX(-50%) translateY(12px);
    display: grid;
    gap: 4px;
    min-width: min(420px, 86vw);
    padding: 12px 18px;
    border: 1px solid rgba(226,199,130,.18);
    border-radius: 999px;
    color: #f1eadc;
    background: rgba(7,7,6,.42);
    backdrop-filter: blur(16px);
    text-align: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity .28s ease, transform .28s ease;
  }
  body.drive-active .drive-hud { opacity: 1; transform: translateX(-50%) translateY(0); }
  .drive-hud strong { font-size: 12px; letter-spacing: .22em; text-transform: uppercase; color: #e2c782; }
  .drive-hud span { color: rgba(241,234,220,.68); font-size: 12px; }

  .drive-speed {
    position: fixed;
    left: clamp(18px, 5vw, 72px);
    top: 118px;
    z-index: 9;
    color: rgba(241,234,220,.92);
    opacity: 0;
    pointer-events: none;
    transition: opacity .28s ease;
  }
  body.drive-active .drive-speed { opacity: 1; }
  .drive-speed b { display: block; font: 950 clamp(46px, 5vw, 76px)/.82 Inter, system-ui, sans-serif; letter-spacing: -.08em; }
  .drive-speed span { color: #e2c782; font: 900 11px/1 Inter, system-ui, sans-serif; letter-spacing: .18em; text-transform: uppercase; }

  @media (max-width: 760px) {
    .drive-hud, .drive-speed { display: none; }
    .drive-road { width: 116vw; }
  }
`
document.head.appendChild(style)

const driveWorld = document.createElement('div')
driveWorld.className = 'drive-world'
driveWorld.innerHTML = `
  <div class="drive-fog"></div>
  <div class="drive-vanish"></div>
  <div class="drive-road"></div>
  <div class="drive-lamps"></div>
  <div class="drive-lightstream"><i></i><i></i><i></i><i></i><i></i><i></i></div>
`
document.body.appendChild(driveWorld)

const driveHud = document.createElement('div')
driveHud.className = 'drive-hud'
driveHud.innerHTML = '<strong>Night run sequence</strong><span>road lines · brass tunnel · scroll throttle</span>'
document.body.appendChild(driveHud)

const driveSpeed = document.createElement('div')
driveSpeed.className = 'drive-speed'
driveSpeed.innerHTML = '<b>000</b><span>km/h virtual</span>'
document.body.appendChild(driveSpeed)

const lamps = driveWorld.querySelector('.drive-lamps')
for (let i = 0; i < 24; i += 1) {
  const lampLeft = document.createElement('i')
  const lampRight = document.createElement('i')
  lampLeft.className = 'drive-lamp'
  lampRight.className = 'drive-lamp'
  const z = i * -88
  lampLeft.style.transform = `translate3d(-${170 + i * 18}px, ${i * 12}px, ${z}px) scale(${1 + i * 0.05})`
  lampRight.style.transform = `translate3d(${170 + i * 18}px, ${i * 12}px, ${z}px) scale(${1 + i * 0.05})`
  lampLeft.style.animation = `lampRush ${0.9 + i * 0.015}s linear infinite`
  lampRight.style.animation = `lampRush ${0.9 + i * 0.015}s linear infinite`
  lampLeft.style.animationDelay = `${i * -0.06}s`
  lampRight.style.animationDelay = `${i * -0.06}s`
  lamps.append(lampLeft, lampRight)
}

const lampStyle = document.createElement('style')
lampStyle.textContent = `
  @keyframes lampRush {
    from { filter: blur(0); opacity: .08; }
    25% { opacity: .72; }
    to { transform: translate3d(var(--lamp-x, 0), 70vh, 220px) scale(2.8); opacity: 0; filter: blur(3px); }
  }
`
document.head.appendChild(lampStyle)

const speedValue = driveSpeed.querySelector('b')
let driveProgress = 0
let lastBoost = false

ScrollTrigger.create({
  trigger: '#night-run',
  start: 'top 82%',
  end: 'bottom 18%',
  scrub: true,
  onEnter: () => document.body.classList.add('drive-active', 'is-letterbox'),
  onEnterBack: () => document.body.classList.add('drive-active', 'is-letterbox'),
  onLeave: () => document.body.classList.remove('drive-active', 'is-letterbox', 'drive-boost'),
  onLeaveBack: () => document.body.classList.remove('drive-active', 'is-letterbox', 'drive-boost'),
  onUpdate: (self) => {
    driveProgress = self.progress
    const boosted = self.progress > 0.22 && self.progress < 0.74
    document.body.classList.toggle('drive-boost', boosted)
    if (boosted && !lastBoost) {
      document.body.classList.add('is-speeding', 'is-impact')
      window.setTimeout(() => document.body.classList.remove('is-speeding', 'is-impact'), 420)
    }
    lastBoost = boosted

    const kmh = Math.round(42 + self.progress * 178 + Math.sin(self.progress * Math.PI * 4) * 18)
    speedValue.textContent = String(Math.max(0, kmh)).padStart(3, '0')
    driveWorld.style.setProperty('--drive-progress', self.progress.toFixed(3))
  }
})

gsap.to('.drive-world', {
  filter: 'brightness(1.2) contrast(1.1)',
  scrollTrigger: { trigger: '#night-run', start: 'top bottom', end: 'bottom top', scrub: true }
})

gsap.to('.drive-vanish', {
  y: '-6vh',
  scale: 1.35,
  scrollTrigger: { trigger: '#night-run', start: 'top bottom', end: 'bottom top', scrub: true }
})

gsap.ticker.add(() => {
  if (!document.body.classList.contains('drive-active')) return
  const wobble = Math.sin(performance.now() * 0.012) * (lastBoost ? 8 : 3)
  driveWorld.style.transform = `translate3d(${wobble}px, ${Math.cos(performance.now() * 0.009) * 3}px, 0)`
})
