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
}
function go(index) {
  const next = (index + slides.length) % slides.length;
  track.scrollTo({ left: next * track.clientWidth, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
}
dots.forEach((dot, index) => dot.addEventListener('click', () => go(index)));
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
});
// Keep the selected slide aligned after a breakpoint or orientation change.
new ResizeObserver(() => {
  track.scrollTo({ left: active * track.clientWidth, behavior: 'instant' });
}).observe(track);
