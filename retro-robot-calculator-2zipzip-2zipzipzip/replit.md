# Retro Robot Calculator

## Overview

A retro-themed quantity and price calculator built as a single-page React application. It features an animated robot assistant character, sound effects, haptic feedback, and unit conversions for weight and volume measurements. The app uses Indian Rupee (₹) as its currency. It's designed to work both as a web app and as a Cordova-based Android application.

The calculator follows a three-step flow: (1) select a category (weight or volume), (2) set a base rate by entering price and quantity, (3) perform price-to-quantity or quantity-to-price conversions using the established rate.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend-Only SPA (No Backend)

- **Framework**: React 19 with TypeScript, bundled by Vite
- **Styling**: Tailwind CSS loaded via CDN (`<script src="https://cdn.tailwindcss.com">`) with a custom theme config defined inline in `index.html`. Custom CSS animations and retro styling are also defined in `index.html`. Custom fonts include Orbitron, Russo One, Share Tech Mono, and Inter via Google Fonts.
- **Icons**: Font Awesome 6.4 loaded via CDN
- **No backend or database**: This is a purely client-side application. All logic runs in the browser. There is no server, API, or data persistence layer.
- **Dev server**: Vite runs on port 5000, bound to `0.0.0.0`

### Directory Structure

The main project lives inside `retro-robot-calculator-2zipzip-2zip/`. There is a wrapper directory `retro-robot-calculator-2zipzip-2zipzip/` containing the inner project folder and attached assets. Source code is in `retro-robot-calculator-2zipzip-2zip/src/`:

- **`src/index.html`** — HTML entry point with Tailwind config, custom CSS, font imports, and the `#root` mount point
- **`src/index.tsx`** — React entry point, mounts `<App />` to the DOM
- **`src/components/App.tsx`** — Main orchestrator component. Manages global state: app start, robot state, online/offline detection, calculator step state, notification states, custom number pad state, sound effects, and haptic feedback
- **`src/components/SplashScreen.tsx`** — Boot-up animation with fake terminal logs and progress bar, shown before the main app
- **`src/components/Robot.tsx`** — Animated robot character with multiple visual states (`idle`, `excited`, `thinking`, `calculating`, `celebrating`, `confused`, `amazed`, `morphing`, `exploding`, etc.). Displays current rate info when in calculator step
- **`src/components/LogicCalculation.tsx`** — Core calculator logic component. Manages the multi-step calculator flow (category → base-rate → calculator). Handles unit selection, price/quantity conversions, and syncs state up to the parent
- **`src/components/NumberPad.tsx`** — Custom on-screen number pad for mobile/Cordova input. Grid layout with number keys, decimal, delete, clear, and done buttons
- **`src/components/ErrorNotification.tsx`** — Modal error dialog with retro styling
- **`src/components/ResultNotification.tsx`** — Auto-dismissing result notification modal (4-second timeout)

### State Management

- All state is managed via React `useState` hooks — no external state management library
- Parent-child state sync pattern: `LogicCalculation` syncs its internal state (step, unit rate, base unit) up to `App` via an `onSyncState` callback, so `Robot` can display relevant info
- Custom number pad state is managed in `App.tsx` with `activeInputId`, `inputValue`, and `onInputChange` callback pattern

### Calculator Flow

1. **Category Selection** — User picks weight or volume
2. **Base Rate Setup** — User enters a base price and quantity to establish a unit rate (e.g., ₹/kg)
3. **Calculator** — Two tabs: price-to-quantity and quantity-to-price conversions using the established rate

### Build & Path Configuration

- **Vite config** (`vite.config.ts`): Root is set to `src/`, base path is `'./'` (relative, required for Cordova file:// protocol), build output goes to `../dist`
- **TypeScript path alias**: `@/*` maps to `src/` directory
- **Cordova.js**: Marked as external in Vite's Rollup config so it doesn't get bundled but resolves at runtime
- Vite config loads `GEMINI_API_KEY` env var (referenced in README but not actively used in calculator components — may be for future AI features)

### Cordova / Android Build

- **Cordova project**: Located at `cordova/app/` with its own `package.json` (app ID: `com.retro.calculator`)
- **Build pipeline**: Vite builds to `dist/` directory, which gets copied to `cordova/app/www/` for the Cordova build
- **Known optimization priorities** (from attached requirements document):
  - Fix sound issues (WebView audio permissions/autoplay restrictions)
  - Restore missing input fields
  - Performance optimization (reduce lag, minimize re-renders, compress assets)
  - Native app experience improvements (WebView settings, loading delays)

### Notable Patterns

- **Haptic feedback**: Uses `navigator.vibrate()` API with configurable intensity levels (`light`, `medium`, `heavy`)
- **Online/offline monitoring**: Tracks network status via window events
- **Sound effects system**: Components receive a `playRetroSound` function prop supporting multiple sound types (`beep`, `confirm`, `calculate`, `success`, `select`, `error`, `swoosh`, `digital`, `laser`, `coin`, `power`, `reset`)
- **Robot animation system**: Robot visual state is controlled via CSS classes (`robot-${state}`) applied to the robot container
- **Custom number pad**: Intercepts input focus events to show a custom on-screen keypad instead of the native keyboard (important for Cordova mobile experience)

## External Dependencies

### CDN-loaded Libraries
- **Tailwind CSS** — Loaded via CDN script tag (not installed via npm)
- **Font Awesome 6.4** — Icon library loaded via CDN
- **Google Fonts** — Orbitron, Russo One, Share Tech Mono, Inter

### npm Dependencies
- **react** (^19.2.3) — UI framework
- **react-dom** (^19.2.3) — React DOM renderer
- **vite** (^6.2.0) — Build tool and dev server
- **@vitejs/plugin-react** (^5.0.0) — React support for Vite
- **typescript** (~5.8.2) — Type checking
- **@types/node** (^22.14.0) — Node.js type definitions

### Mobile Platform
- **Apache Cordova** — Used for wrapping the web app as an Android application. The Cordova project is at `cordova/app/` but Cordova itself is not an npm dependency in the main project — it's expected to be installed globally or managed separately.

### No Backend Services
- No database, no API server, no authentication system
- No external API integrations in the current codebase (GEMINI_API_KEY is loaded but not visibly used)