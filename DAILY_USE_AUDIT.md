# DAILY-USE READINESS AUDIT — Retro Robot Calculator (2026)

> Read-only audit. No production code changed. Every claim cites a file.
> Target user: average Indian Android user, mid/low-end device, patchy 4G,
> more comfortable in Hindi, lives in WhatsApp + UPI.

---

## PHASE 0 — WHAT EXISTS TODAY

### 0.1 Tech stack (auto-detected)

| Layer | What's actually there | Evidence |
|---|---|---|
| Frontend | React 19 + TypeScript, bundled by Vite 6 | `package.json` deps; `src/index.tsx` |
| Styling | Tailwind CSS compiled locally + custom CSS/animations | `tailwind.config.js`, `postcss.config.js`, `src/index.css`, `src/index.html` `<style>` |
| Fonts/Icons | Font Awesome (solid) + 4 web fonts, **self-hosted** (offline) | `src/index.tsx` imports; `package.json` `@fortawesome/*`, `@fontsource/*` |
| Mobile shell | Apache Cordova → Android APK | `cordova/app/config.xml` |
| **Backend** | **None** | no server code anywhere in repo |
| **Database** | **None** | no DB/ORM/SQL references in `src/` |
| **Auth** | **None** | no login/OTP/session code |
| **Storage / persistence** | **None — not even `localStorage`** | grep for `localStorage/indexedDB/persist` in `src/` = 0 hits |
| **Payments** | **None** | no UPI/gateway code |
| **Network** | **None** (deliberately offline-first) | no `fetch`/XHR/axios in `src/` |
| Analytics / crash reporting | **None** | no SDKs present |
| i18n | **None** — English only | `src/index.html:2` `<html lang="en">`; all strings hardcoded in components |

**One line:** a React SPA wrapped in Cordova; entirely client-side, stateless, English-only.

### 0.2 Every screen, feature, "route", table

**Screens / components** (`src/components/`, 7 files, ~2,000 LOC):
1. `SplashScreen.tsx` — boot animation (fake terminal logs + progress bar), ~2.5 s, then a manual **"INITIALIZE SYSTEM"** button.
2. `App.tsx` — orchestrator: top chat header, offline badge, robot pane, logic pane, custom number pad, error/result modals.
3. `Robot.tsx` — animated mascot (decorative); fit-to-container scaler.
4. `LogicCalculation.tsx` — **the actual product**: 3-step flow → `category` → `base-rate` → `calculator` (with two sub-modes: price→quantity, quantity→price). 876 LOC.
5. `NumberPad.tsx` — custom on-screen numeric keypad.
6. `ErrorNotification.tsx` — modal dialog.
7. `ResultNotification.tsx` — auto-dismiss result modal.

**Features:** category select (weight/volume) · base-rate setup (price ÷ quantity → unit rate) · price→quantity calc with auto unit conversion (`LogicCalculation.tsx:480–590`) · quantity→price calc (`:750–810`) · unit conversions (g/kg/quintal/ton, ml/l/gallon) · retro sound effects via Web Audio (`App.tsx:106–228`) · haptics via `navigator.vibrate` (`App.tsx:80`) · offline indicator (`App.tsx`) · robot animations.

**API routes:** none. **DB tables:** none. **Persisted state:** none — every value is React state that dies on app close (`LogicCalculation.tsx` `useState`; nothing written to disk).

### 0.3 Core value (one sentence)

> Given a base price-per-unit, it tells you either **"how much you get for ₹X"** or **"what ₹ you pay for Y quantity"**, converting across weight/volume units — a price↔quantity unit-rate calculator.

### 0.4 How often does a real user actually NEED this? — **RARELY**

Honest verdict: **rarely / episodic, need-driven.** Even the best-fit user (a small trader, shopkeeper, or careful buyer) opens it only *during* a specific price/quantity conversion, and mental math or the stock calculator often suffices. There is **nothing that pulls a user back on a day they have no calculation to do.** As-is, daily-habit pull ≈ 0. **This single fact drives the whole roadmap: to earn daily opens, the app must add ambient value that exists independent of a one-off calculation.**

---

## PHASE 1 — THE DAILY-HABIT GAP

### 1.1 Trigger → Action → Reward → Investment loop

| Stage | Reality | Verdict |
|---|---|---|
| **Trigger** | External only — user already has a price/quantity question. No notification, no internal cue, no ambient reason. | ❌ broken |
| **Action** | Multi-step: category → full base-rate setup → pick calculator → enter value → calculate. High friction (see 1.3). | ⚠️ heavy |
| **Reward** | A single number. Fixed, not variable, no delight beyond a robot animation. Not saved. | ⚠️ thin |
| **Investment** | **Zero.** Nothing is stored — the user re-enters the base rate *every single time* (`LogicCalculation.tsx` state resets; no persistence). No saved items, no history, no memory. | ❌ broken |

**Where it breaks:** *Investment = 0* and *Trigger = external-only*. Because nothing accumulates in the app, there is never a reason to return, and no hook ever fires. The loop never closes.

### 1.2 Ambient value — 3 concrete features to earn a daily open

1. **Today's Rates (mandi / market prices).** A daily-refreshed list of local commodity/produce prices ("Aata ₹42/kg today, ▲₹2"). A buyer/trader checks *today's rate* as a habit; tapping a rate pre-fills the calculator's base rate. This is the strongest daily hook and directly feeds the existing calc.
2. **Saved Items + Rate History.** Let the user save "Rice ₹42/kg", "Milk ₹60/l"; show a tiny sparkline of how each rate moved over days. One-off calcs become a personal **price diary** → reason to reopen ("did my rate change?").
3. **Daily Price Pulse + Home-screen Widget.** A lightweight daily card ("5 items tracked · Rice ▲₹2 this week") plus an Android **widget** showing top-3 saved rates, so value appears *without even opening the app*. Add a gentle logging streak for stickiness.

### 1.3 Time-to-value (cold start → first real answer)

Measured against target **≤ 3 taps / ≤ 30 s**:

- Forced splash: `config.xml` `SplashScreenDelay=3000` **+** in-app `SplashScreen.tsx` boot (~2.5 s) **+ manual "INITIALIZE SYSTEM" tap**.
- Then: pick category (1 tap) → open base-price field, tap digits on NumberPad, Done → open quantity field, digits, Done → (unit dropdown) → **CONFIRM RATE** → pick a calculator → enter value, digits, Done → **CALCULATE**.

**Actual: ≈ 15–25 taps and ≈ 40–70 seconds** (incl. ~3 s forced splash). **Result: FAILS the target by a wide margin.** The splash gate and the mandatory full rate-setup before *any* answer are the biggest offenders.

### 1.4 Retention blockers

- **Day 1:** forced splash + manual init; long multi-step setup before the first result; English-only labels ("BASE RATE CONFIG", "CONFIRM RATE"); no "quick calc" path.
- **Day 7:** nothing is saved → user re-enters the base rate from scratch every visit; no history, no notification, no trigger — literally no reason to come back.
- **Day 30:** no accounts/sync (new phone = start over); no ambient value; no share/referral/WhatsApp loop to pull new or repeat users.

---

## PHASE 2 — 2026 INDIA READINESS CHECKLIST

Legend: ✅ present · ⚠️ partial · ❌ missing · N/A not applicable to current scope

### A. Access & Onboarding
- ✅ **Guest / browse-before-login** — no login wall exists at all (there are no accounts).
- ❌ **Mobile OTP / SMS auto-read / Google one-tap** — no auth of any kind.
- ⚠️ **Onboarding < 60 s, no dead-ends** — no signup forms (good), but the forced splash + manual "INITIALIZE SYSTEM" (`SplashScreen.tsx:121–139`) + full rate-setup delay the *first value* well past 60 s (see 1.3).

### B. Language & Literacy
- ❌ **In-app Hindi / regional switcher** — English only; strings hardcoded (`src/index.html:2`; component JSX).
- ❌ **Voice input / search** — none.
- ⚠️ **Icon-led UI** — buttons carry Font Awesome icons (`LogicCalculation.tsx`), but the flow depends on English text labels a low-literacy user can't read ("WEIGHT", "VOLUME", "CONFIRM RATE").
- ⚠️ **India currency/number/date formatting** — currency is ₹ (good), but outputs mostly use `toFixed()` (`LogicCalculation.tsx:564–576`) → plain `1234.56`, **not** Indian grouping (`1,234.56` / lakh–crore). One `toLocaleString(undefined,…)` (`:793`) leans on device locale rather than forcing `en-IN`. No dates in app.

### C. Performance on real devices
- ✅ **Bundle/APK size** — JS 249 KB, CSS 113 KB (`cordova/app/www/assets/`), APK ~4 MB. Fine for 3 GB-RAM devices.
- ⚠️ **Cold-start feel** — small bundle, but the ~3 s forced splash + manual init hurts perceived speed.
- ✅ **Offline-first rendering** — fully local, no network dependency (made self-contained earlier).
- ❌ **Offline writes queued & synced** — N/A: nothing is stored or synced (no data layer).
- ✅ **Data/battery** — ~0 data; minor battery from continuous CSS animations + Web Audio + robot `ResizeObserver`.

### D. Money & Payments (India)
- ❌ UPI intent · ❌ Autopay/mandate · ❌ Cash tracking · ❌ Receipt/invoice/GST · ❌ Refund/dispute.
- **Whole category N/A today** — the app computes prices but transacts nothing. (If you later add "generate a bill/receipt for a shopkeeper", invoice + share become relevant.)

### E. Engagement & Retention  ← **the category that blocks daily use**
- ❌ **Push / FCM** — none.
- ❌ **Personalised triggers** — none (no data to personalise on).
- ❌ **Home-screen widget / app shortcuts** — none.
- ❌ **History / streaks / weekly summary** — nothing persists; results vanish on close.
- ❌ **WhatsApp share / referral / deep links** — a result can't even be shared.

### F. Trust & Safety
- N/A **KYC / ratings / report-block** — no users or marketplace.
- N/A **SOS / share-live-status** — not that kind of app.
- ✅ **Transparent pricing before commit** — nothing is sold; no hidden charges.

### G. Privacy & Compliance (DPDP Act)
- ⚠️ **Consent notice** — none, but the app collects **no** personal data, so exposure is currently near-zero.
- ⚠️ **Data-deletion / in-app account deletion** — none; N/A while there are no accounts, but **becomes mandatory for Play Store the moment you add accounts or cloud sync.**
- ⚠️ **Play Data Safety declaration** — must declare "no data collected/shared"; easy and clean today, but must be kept accurate as features are added.
- ✅ **Minimal permissions** — `config.xml` requests no dangerous permissions (only `allow-intent` http/https; vibration is auto-granted). Good baseline.

### H. Modern Baseline
- ⚠️ **Dark mode** — dark-**only** (a deliberate retro look), no light theme or toggle.
- ⚠️ **Accessibility / dynamic font** — no `aria-*`/roles/`tabindex` in markup (grep = 0); many tappable `div`s aren't real buttons; icon-only controls are unlabeled. Note: `src/textFit.ts` actively **neutralises the OS font-scale** — good for layout, but it *overrides* a user who enlarges system fonts (an a11y tension to revisit).
- ⚠️ **Edge-to-edge / predictive back** — `viewport-fit=cover` set (edge-to-edge-ish); **Android hardware/predictive back is not handled** (no Cordova `backbutton` listener) → back button can abruptly exit.
- ❌ **In-app update prompt** — none.
- ❌ **Crash reporting + product analytics** — none (you're flying blind on real-device failures and usage).
- ❌ **Help / FAQ / contact support** — none.

### I. AI Layer (2026 expectation) — where AI genuinely removes effort
- **None present today.** Worthwhile (effort-removing) candidates, in priority order:
  1. **Voice/natural-language calc** — "2.5 kilo aata kitne ka?" → answer. Removes typing + English + multi-step; huge for low-literacy Hindi users.
  2. **Scan-to-fill (OCR)** — point at a price tag / bill to auto-fill the base rate. Removes manual entry.
  3. **Smart unit auto-detect** — infer kg vs g from magnitude so users don't set units.
- **Reject as decoration:** a "talking" AI mascot / chit-chat bot (the robot is already decorative; adding an LLM chat adds cost + latency + data-use with no effort removed).

---

## Bottom line for Phase 0–2

The app is a **well-built but low-frequency utility**: technically clean, offline, tiny — but it **stores nothing, triggers nothing, shares nothing, and speaks only English.** Nothing here earns a daily open. To become daily-use it must (a) add **ambient value that exists without a calculation** (today's rates, saved items, history/widget), (b) collapse **time-to-value** to ≤3 taps, and (c) meet the **India baseline** (Hindi, Indian number formatting, share/WhatsApp). The prioritised plan is in `DAILY_USE_ROADMAP.md`.
