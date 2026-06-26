# NOVA 3D — BMW E30 Cinematic Landing

Кинематографичный 3D-лендинг на **Vite + Three.js + GSAP**. Проект показывает BMW E30 в WebGL-сцене с анимированной камерой, неоновым светом, scroll-driven движением автомобиля и эффектным появлением текста.

## Что внутри

- **Three.js** — 3D-сцена, GLTFLoader, свет, тени, частицы, fallback-модель.
- **GSAP + ScrollTrigger** — анимации текста, скролл-таймлайн автомобиля и камеры.
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

В коде она грузится через:

```js
const MODEL_URL = `${import.meta.env.BASE_URL}models/model.glb`
```

Так путь корректно работает и локально, и на GitHub Pages.

## Деплой

Проект настроен под GitHub Pages с base-path:

```js
base: '/Notion-test/'
```

После пуша в `main` GitHub Actions собирает проект и публикует `dist`.
