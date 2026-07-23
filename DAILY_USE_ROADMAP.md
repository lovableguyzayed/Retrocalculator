# DAILY-USE ROADMAP — Retro Robot Calculator (2026)

> Prioritised from `DAILY_USE_AUDIT.md`. **Read-only proposal — no code written yet.**
> Guiding idea: turn a one-off calculator into a **daily price companion** for the
> Indian mass market. Impact H/M/L · Effort S/M/L · Priority P0 (launch-blocker) →
> P2 (later) · Ship phase Now / Next / Later.

## Prioritised feature table

| # | Feature | Category | Why it drives DAILY use | Impact | Effort | Priority | Ship |
|---|---|---|---|---|---|---|---|
| 1 | **Local persistence** (last base rate + saved items via a stored data layer) | Retention / foundation | Kills re-entering the rate every time; the base every other daily feature stands on | H | S–M | **P0** | Now |
| 2 | **Quick-calc + remove splash gate** (direct calc on open; auto-skip boot) | Time-to-value | Cuts ~15–25 taps / 40–70 s down toward ≤3 taps / ≤30 s | H | S | **P0** | Now |
| 3 | **Hindi + language switcher** (in-app, not device locale) | Language | Core audience reads Hindi; English labels block first use | H | M | **P0** | Now |
| 4 | **Indian number formatting** (`en-IN`, ₹ + lakh/crore grouping) | Language | `1,23,456.00` vs `123456` — trust & readability, ~1 file | M | S | **P0** | Now |
| 5 | **Android back-button handling** (Cordova `backbutton`) | Modern baseline | Back currently exits abruptly; basic correctness | M | S | **P0** | Now |
| 6 | **Crash reporting + analytics** (e.g. Firebase Crashlytics + GA4) | Baseline | You're blind on real low-end failures & usage; needed to steer the rest | M | S–M | **P0** | Now |
| 7 | **Share result to WhatsApp** (+ deep link back) | Virality | Free distribution where the audience lives | M | S | **P1** | Now |
| 8 | **Saved items + rate history** (price diary + sparkline) | Daily habit | One-off calcs become a returning "did my rate change?" check | H | M | **P1** | Next |
| 9 | **Today's Rates feed** (mandi/market prices; tap → prefill) | Ambient value | The single strongest reason to open with *no* calc to do | H | L | **P1** | Next |
| 10 | **Home-screen widget** (top-3 saved rates) | Ambient value | Value without opening the app; daily glance | H | L | **P1** | Later |
| 11 | **Voice / natural-language calc** ("2.5 kilo aata kitne ka?") | AI (effort removal) | Removes typing + English + steps for low-literacy users | H | M–L | **P1** | Next |
| 12 | **Push nudge** (FCM: "today's rates are in"), quiet hours, categories | Retention | Re-engagement trigger — carefully, opt-in, not spam | M–H | M | **P1** | Next |
| 13 | **Streak / weekly price-pulse summary** | Daily habit | Gives a reason to check back + logging motivation | M | M | **P2** | Later |
| 14 | **Accessibility pass** (real `<button>`s, labels; soften `textFit` font override) | Baseline | Inclusivity + `textFit.ts` currently fights OS font size | M | S–M | **P1** | Next |
| 15 | **GST / profit-margin modes** (shopkeeper utility) | Utility breadth | More reasons to reach for it during the day | M | M | **P2** | Next |
| 16 | **Scan-to-fill (OCR)** price tag / bill → base rate | AI (effort removal) | Removes manual entry | M | L | **P2** | Later |
| 17 | **DPDP: privacy note + in-app account deletion** (when accounts/sync added) | Compliance | **Mandatory** for Play once any data is collected | M | S–M | **P1** | Next |
| 18 | **In-app update prompt** + Help/FAQ + contact | Baseline | Keeps users current; a support path | L–M | S | **P2** | Later |

## Top 5 — MUST SHIP before public launch
1. **Local persistence** (#1) — without "remember my rate", nothing else matters.
2. **Quick-calc + kill the splash gate** (#2) — hit ≤3 taps / ≤30 s to first value.
3. **Hindi switcher + Indian number formatting** (#3, #4) — table-stakes for this audience.
4. **Back-button handling + crash reporting/analytics** (#5, #6) — don't ship broken or blind.
5. **WhatsApp share + a short DPDP privacy note** (#7, #17) — cheap trust + free distribution.

## Top 5 — DAILY HABIT BUILDERS
1. **Today's Rates feed** (#9) — the reason to open on a no-calc day.
2. **Saved items + rate history** (#8) — a personal price diary that accrues value.
3. **Home-screen widget** (#10) — ambient value without opening the app.
4. **Push nudge for today's rates** (#12) — the trigger that restarts the loop (opt-in, quiet hours).
5. **Streak / weekly price pulse** (#13) — a light reason to check back + log.

## REMOVE / fix — things that add friction today
- **Forced 3 s splash + manual "INITIALIZE SYSTEM" tap** (`cordova/app/config.xml` `SplashScreenDelay=3000`; `src/components/SplashScreen.tsx:121–139`) — auto-advance; delaying value with zero benefit is the #1 first-use killer.
- **Mandatory full base-rate setup before ANY calc** (`src/components/LogicCalculation.tsx` `category → base-rate → calculator`) — offer a direct quick calc; keep saved rates for repeat users.
- **OS font-scale neutralisation** (`src/textFit.ts`) — it overrides users who enlarge system fonts; **clamp** the scale instead of fully cancelling it, so accessibility still works.
- **Always-on heavy robot animations** — on low-end/battery, respect `prefers-reduced-motion` and pause when off-screen (soften, not delete — the mascot is part of the identity).

---

**STOP — awaiting your approval of Phase 3 before any Phase 4 implementation.**
Tell me which items to build (and in what order) and I'll implement them one at a
time on a feature branch, following the existing architecture, with a test plan
per feature and an `IMPLEMENTATION_LOG.md`.
