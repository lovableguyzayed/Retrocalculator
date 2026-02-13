# Retro Robot Calculator

## Overview

A retro-themed quantity and price calculator built as a single-page React application. It features an animated robot assistant character, sound effects, haptic feedback, and unit conversions for weight and volume. The app has a boot-up splash screen with retro terminal aesthetics, then presents a multi-step calculator workflow: category selection → base rate configuration → price/quantity calculations. The entire UI uses a dark retro/cyberpunk visual theme with custom fonts (Orbitron, Russo One, Share Tech Mono) and Tailwind CSS styling.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend-Only SPA
- **Framework**: React 19 with TypeScript, bundled by Vite
- **Styling**: Tailwind CSS loaded via CDN (`<script src="https://cdn.tailwindcss.com">`) with custom theme config defined inline in `index.html`. Custom CSS animations and retro styling are also in `index.html`.
- **No backend or database**: This is a purely client-side application. All logic runs in the browser. There is no server, API, or data persistence layer.
- **Dev server**: Vite runs on port 5000, bound to `0.0.0.0`

### Component Architecture
All components live as flat `.tsx` files in the project root (no `src/` directory):

- **`index.tsx`** — Entry point, mounts `<App />` to the DOM
- **`App.tsx`** — Main orchestrator component. Manages global state: app start, robot state, online/offline detection, calculator step state, notification states. Provides haptic feedback utility.
- **`SplashScreen.tsx`** — Boot-up animation with fake terminal logs and progress bar. Shown before the main app.
- **`Robot.tsx`** — Animated robot character with multiple visual states (`idle`, `excited`, `thinking`, `calculating`, `celebrating`, etc.). Displays current rate info when in calculator step.
- **`LogicCalculation.tsx`** — Core calculator logic component. Manages the multi-step calculator flow (category → base-rate → calculator). Handles unit selection, price/quantity conversions, and syncs state back to parent.
- **`ErrorNotification.tsx`** — Modal error dialog with retro styling
- **`ResultNotification.tsx`** — Auto-dismissing result notification modal (4-second timeout)

### State Management
- All state is managed via React `useState` hooks — no external state management library
- Parent-child state sync pattern: `LogicCalculation` syncs its internal state (step, unit rate, base unit) up to `App` via an `onSyncState` callback, so `Robot` can display relevant info

### Calculator Flow
1. **Category Selection** — User picks weight or volume
2. **Base Rate Setup** — User enters a base price and quantity to establish a unit rate (e.g., ₹/kg)
3. **Calculator** — Two modes: price-to-quantity and quantity-to-price conversions using the established rate

### Build & Path Configuration
- TypeScript path alias: `@/*` maps to project root
- Vite config injects `GEMINI_API_KEY` env var (referenced in README but not visibly used in the calculator components — may be for future AI features)
- No `src/` directory convention — all source files are in root

### Notable Patterns
- **Haptic feedback**: Uses `navigator.vibrate()` API with configurable intensity levels
- **Online/offline monitoring**: Tracks network status via window events
- **Sound effects system**: Components receive a `playRetroSound` function prop supporting multiple sound types (beep, confirm, calculate, success, etc.)
- **Robot animation system**: Robot visual state is controlled via CSS classes (`robot-${state}`) applied to the robot container

## External Dependencies

### NPM Packages
- **react** / **react-dom** (v19.2.3) — UI framework
- **vite** (v6.2.0) — Build tool and dev server
- **@vitejs/plugin-react** — React support for Vite
- **typescript** (~5.8.2) — Type checking

### CDN Resources
- **Tailwind CSS** — Loaded via CDN script tag (not installed as npm package)
- **Font Awesome 6.4.0** — Icon library loaded via CDN
- **Google Fonts** — Inter, Orbitron, Russo One, Share Tech Mono

### Environment Variables
- `GEMINI_API_KEY` — Referenced in vite config and README, injected as `process.env.API_KEY` and `process.env.GEMINI_API_KEY`. Not visibly consumed by current components but may be intended for AI features.

### No Backend Services
- No database, no server-side API, no authentication
- No third-party API calls visible in current codebase