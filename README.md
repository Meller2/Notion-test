# E30 Nocturne — Cinematic WebGL Study

Сдержанный 3D-лендинг на **Vite + Three.js + GSAP**. Проект показывает BMW E30 в тёмной automotive-сцене с управляемой камерой, scroll-driven движением автомобиля и аккуратной типографикой.

## Визуальное направление

- **Palette:** graphite black, warm bone, muted brass, oxblood accent.
- **Composition:** автомобиль уходит на свободную сторону экрана, чтобы не перекрывать текст.
- **Motion:** GSAP ScrollTrigger двигает камеру, свет и автомобиль по секциям.
- **Fallback:** если GLB не загрузился, сцена открывается с простой fallback-машиной.

## Стек

- **Three.js** — 3D-сцена, GLTFLoader, свет, тени, частицы.
- **GSAP + ScrollTrigger** — анимации текста и scroll timeline.
- **Vite** — сборка и локальный dev-сервер.
- **GitHub Pages workflow** — деплой собранной папки `dist`.

## Запуск

```bash
npm install
npm run dev
```

Открой `http://localhost:5173`.

## Сборка

```bash
npm run build
npm run preview
```

## 3D-модель

Модель лежит здесь:

```txt
public/models/model.glb
```

В коде она грузится через base-path, который корректно работает и локально, и на GitHub Pages.

## Деплой

Проект настроен под GitHub Pages:

```js
base: '/Notion-test/'
```

После пуша в `main` GitHub Actions собирает проект и публикует `dist`.
