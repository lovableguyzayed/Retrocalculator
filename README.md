# Retro Robot Calculator

A retro-themed quantity & price calculator with an animated robot assistant,
sound effects, haptics, and weight/volume unit conversions. It is an
offline-first single-page app, packaged for Android with Apache Cordova.

## Tech stack

- React 19 + TypeScript, bundled by Vite 6
- Tailwind CSS compiled locally; Font Awesome and web fonts self-hosted so the
  app works fully offline (no CDNs at runtime)
- Apache Cordova (Android) wrapper in `cordova/app/`

## Run locally (web)

Prerequisites: Node.js 18+

```bash
npm install
npm run dev     # dev server on http://localhost:5000
npm run build   # production build -> dist/
```

## Build the Android APK

The APK is built automatically in CI (GitHub Actions -> "Build Android APK");
the signed debug `app-debug.apk` is attached to each run as an artifact.

To build locally you need the Android SDK and JDK 17:

```bash
npm run build
rm -rf cordova/app/www/assets
cp -r dist/assets cordova/app/www/assets
cp dist/index.html cordova/app/www/index.html
cd cordova/app
cordova platform add android
cordova build android   # -> platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

## Project layout

- `src/` — React app (components, entry point, styles)
- `cordova/app/` — Cordova Android project (`config.xml`, `www/`, `res/`)
- `vite.config.ts`, `tailwind.config.js`, `postcss.config.js` — build config
