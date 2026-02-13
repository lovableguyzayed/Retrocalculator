# Retro Robot Calculator

## Overview

A retro-themed quantity and price calculator built as a single-page React application. It features an animated robot assistant character, sound effects, haptic feedback, and unit conversions for weight and volume units. The app is designed to work both as a web application and as a Cordova Android build. The calculator follows a three-step flow: (1) select a category (weight or volume), (2) set a base rate by entering price and quantity, (3) perform price-to-quantity or quantity-to-price conversions using the established rate. The UI uses a retro/cyberpunk aesthetic with custom fonts, glow effects, and scanline overlays.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend-Only SPA (No Backend)

- **Framework**: React 19 with TypeScript, bundled by Vite
- **Styling**: Tailwind CSS loaded via CDN (`<script src="https://cdn.tailwindcss.com">`) with a custom theme config defined inline in `index.html`. Custom CSS animations and retro styling are also defined in `index.html`.
- **Icons**: Font Awesome 6.4 loaded via CDN
- **Fonts**: Google Fonts — Orbitron, Russo One, Share Tech Mono, Inter
- **No backend or database**: This is a purely client-side application. All logic runs in the browser. There is no server, API, or data persistence layer.
- **Dev server**: Vite runs on port 5000, bound to `0.0.0.0`

### Directory Structure

The project has a deeply nested directory structure due to repeated zipping. The actual source code lives at:

`retro-robot-calculator-2zipzip-2zipzipzip/retro-robot-calculator-2zipzip-2zipzip/retro-robot-calculator-2zipzip-2zip/`

Within that directory:
- **`src/index.html`** — HTML entry point with Tailwind config, custom CSS, font imports, and the `#root` mount point
- **`src/index.tsx`** — React entry point, mounts `<App />` to the DOM
- **`src/components/App.tsx`** — Main orchestrator component. Manages global state: app start, robot state, online/offline detection, calculator step state, notification states, custom number pad state, sound playback, and haptic feedback.
- **`src/components/SplashScreen.tsx`** — Boot-up animation with fake terminal logs and progress bar, shown before the main app
- **`src/components/Robot.tsx`** — Animated robot character with multiple visual states (`idle`, `excited`, `thinking`, `calculating`, `celebrating`, `confused`, `amazed`, `morphing`, `exploding`, etc.). Displays current rate info when in the calculator step.
- **`src/components/LogicCalculation.tsx`** — Core calculator logic component. Manages the multi-step calculator flow (category → base-rate → calculator). Handles unit selection, price/quantity conversions, and syncs state to parent.
- **`src/components/NumberPad.tsx`** — Custom on-screen number pad for mobile/Cordova input. Grid layout with number keys, decimal, delete, clear, and done buttons.
- **`src/components/ErrorNotification.tsx`** — Modal error dialog with retro styling
- **`src/components/ResultNotification.tsx`** — Auto-dismissing result notification modal (4-second timeout)
- **`vite.config.ts`** — Vite configuration with `src/` as root, `./` as base path for Cordova compatibility, and `cordova.js` marked as external in Rollup
- **`cordova/app/`** — Cordova project directory with its own `package.json` (app ID: `com.retro.calculator`) and `www/` directory containing built assets

### State Management

- All state is managed via React `useState` hooks — no external state management library (no Redux, Zustand, etc.)
- Parent-child state sync pattern: `LogicCalculation` syncs its internal state (step, unit rate, base unit) up to `App` via an `onSyncState` callback, so `Robot` can display relevant info
- Custom number pad state is managed in `App.tsx` with `activeInputId`, `inputValue`, and `onInputChange` callback pattern

### Calculator Flow

1. **Category Selection** — User picks weight or volume
2. **Base Rate Setup** — User enters a base price and quantity to establish a unit rate (e.g., ₹/kg)
3. **Calculator** — Two tabs: price-to-quantity and quantity-to-price conversions using the established rate

### Build & Path Configuration

- TypeScript path alias: `@/*` maps to `src/`
- Vite config: root is `src/`, base is `./` (relative paths for Cordova file:// protocol), build output goes to `../dist`
- `cordova.js` is marked as external in Rollup config so it doesn't get bundled but resolves at runtime in the Cordova environment
- Built output from `dist/` gets copied to `cordova/app/www/` for Android builds

### Cordova / Android Build

- Cordova project is at `cordova/app/` with app ID `com.retro.calculator`
- The web build uses relative asset paths (`base: './'`) which is required for Cordova's `file://` protocol
- Key concerns documented in attached assets: sound reliability in Android WebView, input field visibility, performance optimization for low-end devices

### Notable Patterns

- **Sound effects system**: A `playRetroSound` function is passed as a prop to components, supporting multiple sound types (beep, confirm, calculate, success, select, error, swoosh, digital, laser, coin, power, reset). Known issue: sound stops playing after repeated use — needs audio reset/reuse logic instead of creating multiple audio instances.
- **Haptic feedback**: Uses `navigator.vibrate()` API with configurable intensity levels (light, medium, heavy)
- **Online/offline monitoring**: Tracks network status via window events
- **Robot animation system**: Robot visual state is controlled via CSS classes (`robot-${state}`) applied to the robot container, driven by `RobotState` type
- **Custom number pad**: Replaces native keyboard for mobile/Cordova environments, with full input management in App.tsx

### Known Issues to Address

1. **Sound stops after repeated use** — Audio instances need reset/reuse logic; preload sound files; ensure Android WebView compatibility
2. **Tab visibility** — Price and Quantity calculation tabs have text/labels getting cut off; need full visibility for all values and results
3. **Performance** — Minimize re-renders, compress assets, use hardware acceleration for smooth experience on low-end Android devices

## External Dependencies

- **React 19** + **React DOM 19** — UI framework
- **Vite 6** — Build tool and dev server
- **TypeScript 5.8** — Type checking
- **@vitejs/plugin-react** — React support for Vite
- **Tailwind CSS** — Loaded via CDN (not installed as npm package)
- **Font Awesome 6.4** — Icon library loaded via CDN
- **Google Fonts** — Orbitron, Russo One, Share Tech Mono, Inter loaded via CDN
- **Apache Cordova** — Mobile app wrapper for Android builds (project in `cordova/app/`)
- No backend services, databases, or APIs are used
- No external state management libraries