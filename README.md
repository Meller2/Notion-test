# NOVA 3D — Vite + Three.js + GSAP

Интерактивная 3D-витрина со скроллителлингом. Загружает твою `.glb` модель и вращает её по скроллу. Собрано 🐾 Алексом прямо из Notion.

## Стек
- **Vite** — сборка и dev-сервер
- **Three.js** — WebGL, GLTFLoader
- **GSAP + ScrollTrigger** — анимация по скроллу

## Запуск

```bash
npm install
npm run dev
```

Открой http://localhost:5173

## Своя 3D-модель

Положи файл сюда:

```
public/models/model.glb
```

Пока файла нет — показывается заглушка. Чтобы поменять имя/путь — отредактируй `MODEL_URL` в `src/main.js`.

## Сборка

```bash
npm run build
npm run preview
```

## Структура

```
├─ index.html
├─ vite.config.js
├─ package.json
├─ public/
│  └─ models/        # сюда кладёшь model.glb
└─ src/
   ├─ main.js        # сцена Three.js + GSAP
   └─ style.css
```
