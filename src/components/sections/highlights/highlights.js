import './highlights.scss';
const root = document.querySelector('[data-fls-highlights]');
const track = root.querySelector('.highlights__track');
const slides = [...track.children];
const dots = [...root.querySelectorAll('[data-highlight]')];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let active = 0;
let frame = 0;
function update() {
  const index = Math.max(0, Math.min(slides.length - 1, Math.round(track.scrollLeft / track.clientWidth)));
  if (index === active) return;
  active = index;
  slides.forEach((slide, i) => { slide.inert = i !== active; });
  dots.forEach((dot, i) => {
    if (i === active) dot.setAttribute('aria-current', 'true');
    else dot.removeAttribute('aria-current');
  });
  root.querySelector('.highlights__counter').textContent = `${String(active + 1).padStart(2, '0')} / 03`;
}
function go(index) {
  const next = (index + slides.length) % slides.length;
  track.scrollTo({ left: next * track.clientWidth, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
}
dots.forEach((dot, index) => dot.addEventListener('click', () => {
  go(index);
  scheduleRotation();
}));
track.addEventListener('scroll', () => {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(update);
}, { passive: true });
root.addEventListener('keydown', event => {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const index = event.key === 'Home' ? 0 : event.key === 'End' ? slides.length - 1 : active + (event.key === 'ArrowRight' ? 1 : -1);
  const next = (index + slides.length) % slides.length;
  if (track.contains(document.activeElement)) dots[next].focus();
  go(next);
  scheduleRotation();
});
// Keep the selected slide aligned after a breakpoint or orientation change.
new ResizeObserver(() => {
  track.scrollTo({ left: active * track.clientWidth, behavior: 'instant' });
}).observe(track);


// Rotate only while the banner is visible and the visitor is not interacting.
const rotationButton = root.querySelector('.highlights__rotation');
const counter = root.querySelector('.highlights__counter');
let rotationTimer;
let manuallyPaused = reducedMotion.matches;
let hovered = false;
let focused = false;
let pointerDown = false;
let inView = false;
function canRotate() {
  return !manuallyPaused && !hovered && !focused && !pointerDown && inView && !document.hidden;
}
function scheduleRotation() {
  clearTimeout(rotationTimer);
  counter.setAttribute('aria-live', canRotate() ? 'off' : 'polite');
  if (!canRotate()) return;
  rotationTimer = setTimeout(() => {
    go(active + 1);
    scheduleRotation();
  }, 3000);
}
function updateRotationButton() {
  rotationButton.textContent = manuallyPaused ? 'Продовжити' : 'Пауза';
  rotationButton.setAttribute('aria-label', manuallyPaused ? 'Увімкнути автоматичне гортання' : 'Призупинити автоматичне гортання');
}
rotationButton.addEventListener('click', () => {
  manuallyPaused = !manuallyPaused;
  updateRotationButton();
  scheduleRotation();
});
root.addEventListener('pointerenter', event => {
  if (event.pointerType !== 'mouse') return;
  hovered = true;
  scheduleRotation();
});
root.addEventListener('pointerleave', () => { hovered = false; scheduleRotation(); });
root.addEventListener('focusin', () => { focused = true; scheduleRotation(); });
root.addEventListener('focusout', event => {
  focused = root.contains(event.relatedTarget);
  scheduleRotation();
});
root.addEventListener('pointerdown', () => { pointerDown = true; scheduleRotation(); });
window.addEventListener('pointerup', () => { pointerDown = false; scheduleRotation(); }, { passive: true });
window.addEventListener('pointercancel', () => { pointerDown = false; scheduleRotation(); }, { passive: true });
track.addEventListener('scrollend', scheduleRotation);
document.addEventListener('visibilitychange', scheduleRotation);
new IntersectionObserver(entries => {
  inView = entries[0].isIntersecting;
  scheduleRotation();
}, { threshold: 0.25 }).observe(root);
reducedMotion.addEventListener('change', event => {
  manuallyPaused = event.matches;
  updateRotationButton();
  scheduleRotation();
});
window.addEventListener('pagehide', () => clearTimeout(rotationTimer));
window.addEventListener('pageshow', scheduleRotation);
updateRotationButton();
