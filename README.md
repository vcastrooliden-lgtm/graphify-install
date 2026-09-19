# Rutina Fit

App web (PWA) con la rutina diaria de ejercicio de 20 minutos: temporizador de circuito guiado, vista semanal y registro de peso. Diseñada para instalarse en la pantalla de inicio del iPhone como una app.

## Instalar en iPhone

1. Publica esta carpeta como sitio estático (por ejemplo con GitHub Pages: Settings → Pages → Deploy from branch, seleccionando esta rama y la carpeta raíz), o sírvela desde cualquier hosting estático (Netlify, Vercel, etc.). La app no tiene backend, son solo archivos estáticos.
2. Abre la URL publicada en **Safari** en el iPhone (no funciona el "Añadir a inicio" desde otros navegadores en iOS).
3. Toca el botón de compartir (□↑) y elige **"Añadir a pantalla de inicio"**.
4. Se creará un ícono en el iPhone que abre la app a pantalla completa, sin la barra de Safari, y funciona sin conexión gracias al service worker.

## Probar en local

```bash
python3 -m http.server 8000
```

Y abre `http://localhost:8000` (o esa IP de tu red local desde el iPhone, si está en la misma Wi-Fi).

## Estructura

- `index.html` — pantallas: Hoy, Semana, Peso, sesión guiada.
- `data.js` — datos de la rutina semanal (mismos datos que `rutina-diaria-ejercicio.md`).
- `app.js` — lógica: navegación, temporizador de circuito, registro de peso, rachas.
- `styles.css` — estilos con soporte para modo claro/oscuro y áreas seguras de iPhone.
- `manifest.webmanifest`, `sw.js`, `icons/` — configuración PWA para instalación y uso sin conexión.

El progreso (peso registrado y días completados) se guarda localmente en el dispositivo (`localStorage`), no se sincroniza entre dispositivos.
