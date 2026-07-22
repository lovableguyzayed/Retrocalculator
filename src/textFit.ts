/*
 * Font-scale neutralizer + responsive root sizing.
 *
 * Problem: Android WebView (and iOS) multiply CSS text/rem sizes by the device's
 * system "Font size / Display size" (accessibility) setting. Because this whole
 * UI is rem-based, a user who has that set to Large sees the app "oversized" —
 * and it varies per device/user, so it looks random.
 *
 * Fix: measure the effective font-scale in the browser and set the root
 * font-size to (intended / scale). The platform then multiplies it back by
 * `scale`, so the *used* root size equals what we intended — the layout looks
 * the same no matter the system font setting. When there is no scaling
 * (scale ~= 1, the common case) this is a harmless no-op.
 *
 * It also owns the responsive root size: min(3.6vw, 2.15vh) clamped to
 * [12px, 17px], so the UI scales with BOTH screen width and height and never
 * grows taller than the viewport.
 */

// Measure the system text scale by comparing an em-based width (affected by the
// font scale) with a px-based width (not affected).
function detectFontScale(): number {
  try {
    if (!document.body) return 1;
    // A px-based width is NOT affected by the system font scale.
    const px = document.createElement('div');
    px.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;top:-9999px;left:-9999px;width:10000px;height:0;';
    // An em-based width IS multiplied by the system font scale. We use a large
    // base font-size (100px) so the platform's minimum-font-size (~8px on
    // Android WebView) can't clamp it and corrupt the measurement.
    const em = document.createElement('div');
    em.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;top:-9999px;left:-9999px;width:100em;height:0;font-size:100px;';
    document.body.appendChild(px);
    document.body.appendChild(em);
    const pxW = px.getBoundingClientRect().width;   // 10000
    const emW = em.getBoundingClientRect().width;    // 100 * 100 * scale = 10000 * scale
    px.remove();
    em.remove();
    if (!pxW || !emW) return 1;
    const scale = emW / pxW;
    return isFinite(scale) && scale > 0 ? scale : 1;
  } catch {
    return 1;
  }
}

// The size we WANT the root to be, independent of any system scaling.
function intendedRootPx(): number {
  const vw = document.documentElement.clientWidth || window.innerWidth || 360;
  const vh = document.documentElement.clientHeight || window.innerHeight || 640;
  const fluid = Math.min(0.036 * vw, 0.0215 * vh); // min(3.6vw, 2.15vh)
  return Math.max(12, Math.min(fluid, 17)); // clamp(12px, fluid, 17px)
}

function applyRootSize(): void {
  let scale = detectFontScale();
  // Ignore tiny deviations so normal devices are untouched (no jitter).
  if (scale > 0.97 && scale < 1.03) scale = 1;
  const target = intendedRootPx() / scale;
  const safe = Math.max(9, Math.min(target, 22)); // hard safety bounds
  document.documentElement.style.fontSize = safe + 'px';
}

let raf = 0;
function schedule(): void {
  if (raf) cancelAnimationFrame(raf);
  raf = requestAnimationFrame(applyRootSize);
}

export function initTextFit(): void {
  applyRootSize();
  window.addEventListener('resize', schedule);
  window.addEventListener('orientationchange', schedule);
  // Re-check after fonts settle, in case metrics shift the measurement.
  if ((document as any).fonts?.ready?.then) {
    (document as any).fonts.ready.then(applyRootSize).catch(() => {});
  }
}
