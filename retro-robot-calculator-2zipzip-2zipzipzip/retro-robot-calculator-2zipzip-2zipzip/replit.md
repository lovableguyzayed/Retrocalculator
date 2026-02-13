# Retro Robot Calculator

## Overview

A retro-themed quantity and price calculator built as a single-page React application. It features an animated robot assistant character, sound effects, haptic feedback, and unit conversions for weight and volume measurements. The app is designed to run both as a web app and as a Cordova-based Android application (via WebView). The calculator follows a multi-step flow: category selection → base rate setup → price/quantity conversions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend-Only SPA
- **Framework**: React 19 with TypeScript, bundled by Vite
- **Styling**: Tailwind CSS loaded via CDN (`<script src="https://cdn.tailwindcss.com">`) with custom theme config defined inline in `index.html`. Custom CSS animations and retro styling are also defined in `index.html` `<style>` blocks. Custom fonts include Orbitron, Russo One, Share Tech Mono, and Inter via Google Fonts CDN.
- **Icons**: Font Awesome 6.4 loaded via CDN
- **No backend or database**: This is a purely client-side application. All logic runs in the browser. There is no server, API, or data persistence layer.
- **Dev server**: Vite runs on port 5000, bound to `0.0.0.0`

### Directory Structure
The project lives inside `retro-robot-calculator-2zipzip-2zip/`. Source code is in the `src/` directory:

- **`src/index.html`** — HTML entry point with Tailwind config, custom CSS, and font imports
- **`src/index.tsx`** — React entry point, mounts `<App />` to the DOM
- **`src/components/App.tsx`** — Main orchestrator component. Manages global state: app start, robot state, online/offline detection, calculator step state, notification states, custom number pad state. Provides haptic feedback and sound utilities.
- **`src/components/SplashScreen.tsx`** — Boot-up animation with fake terminal logs and progress bar. Shown before the main app.
- **`src/components/Robot.tsx`** — Animated robot character with multiple visual states (`idle`, `excited`, `thinking`, `calculating`, `celebrating`, etc.). Displays current rate info when in calculator step.
- **`src/components/LogicCalculation.tsx`** — Core calculator logic component. Manages the multi-step calculator flow (category → base-rate → calculator). Handles unit selection, price/quantity conversions, and syncs state to parent.
- **`src/components/NumberPad.tsx`** — Custom on-screen number pad for mobile/Cordova input. Grid layout with number keys, decimal, delete, clear, and done buttons.
- **`src/components/ErrorNotification.tsx`** — Modal error dialog with retro styling
- **`src/components/ResultNotification.tsx`** — Auto-dismissing result notification modal (4-second timeout)

### Cordova / Android Build
- **Cordova project**: Located at `cordova/app/` with its own `package.json` (app ID: `com.retro.calculator`)
- **Build output**: Vite builds to `dist/` directory (configured via `build.outDir: '../dist'`), which gets copied to `cordova/app/www/` for the Cordova build
- **Cordova.js handling**: `cordova.js` is marked as external in Vite's Rollup config so it doesn't get bundled but is resolved at runtime by Cordova
- **Base path**: Vite uses `base: './'` for relative asset paths, which is required for Cordova's file:// protocol
- **Optimization concerns**: The attached requirements document (`attached_assets/`) lists priorities for Cordova: fixing sound issues (WebView audio permissions/autoplay), restoring input fields, performance optimization (reducing lag, DOM updates, hardware acceleration), and native app feel

### State Management
- All state is managed via React `useState` hooks — no external state management library
- Parent-child state sync pattern: `LogicCalculation` syncs its internal state (step, unit rate, base unit) up to `App` via an `onSyncState` callback, so `Robot` can display relevant info
- Custom number pad state is managed in `App.tsx` with `activeInputId`, `inputValue`, and `onInputChange` callback pattern

### Calculator Flow
1. **Category Selection** — User picks weight or volume
2. **Base Rate Setup** — User enters a base price and quantity to establish a unit rate (e.g., ₹/kg)
3. **Calculator** — Two tabs: price-to-quantity and quantity-to-price conversions using the established rate

### Build & Path Configuration
- **Vite root**: Set to `src/` directory (`root: 'src'` in vite.config.ts)
- TypeScript path alias: `@/*` maps to `./src/*`
- Vite config references `GEMINI_API_KEY` env var (from AI Studio origin, not actively used in calculator logic)

### Notable Patterns
- **Haptic feedback**: Uses `navigator.vibrate()` API with configurable intensity levels (`light`, `medium`, `heavy`)
- **Online/offline monitoring**: Tracks network status via window events
- **Sound effects system**: Components receive a `playRetroSound` function prop supporting multiple sound types (`beep`, `confirm`, `calculate`, `success`, `select`, `error`, `swoosh`, `digital`, `laser`, `coin`, `power`, `reset`). Sound is generated programmatically (likely via Web Audio API oscillators, not audio files).
- **Robot animation system**: Robot visual state is controlled via CSS classes (`robot-${state}`) applied to the robot container. States include: `idle`, `excited`, `wave`, `thinking`, `calculating`, `celebrating`, `nodding`, `scanning`, `processing`, `energizing`, `confused`, `amazed`, `morphing`, `exploding`
- **Custom NumberPad**: Replaces native keyboard for consistent mobile/Cordova experience. Components register input focus via `onInputFocus` callback, and the number pad renders at screen bottom when active.

## External Dependencies

### Runtime CDN Dependencies
- **Tailwind CSS** — Loaded via CDN script tag (not installed as npm package)
- **Font Awesome 6.4** — Icon library via CDN
- **Google Fonts** — Orbitron, Russo One, Share Tech Mono, Inter

### NPM Dependencies
- **react** (^19.2.3) — UI framework
- **react-dom** (^19.2.3) — React DOM renderer

### Dev Dependencies
- **vite** (^6.2.0) — Build tool and dev server
- **@vitejs/plugin-react** (^5.0.0) — React support for Vite
- **typescript** (~5.8.2) — Type checking
- **@types/node** (^22.14.0) — Node.js type definitions

### Cordova (Android Build)
- Apache Cordova framework for wrapping the web app as an Android APK
- No Cordova plugins are explicitly listed in the available config, but audio/vibration features may require plugins like `cordova-plugin-media` or native WebView permissions

### No Backend Services
- No database, no API server, no authentication
- No external API calls (the GEMINI_API_KEY reference is vestigial from the AI Studio template)