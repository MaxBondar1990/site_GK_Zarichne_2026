import './features.scss';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
const root = document.querySelector('[data-fls-features]');
root.addEventListener('click', event => {
  const button = event.target.closest('.feature-tile__toggle');
  if (!button) return;
  const panel = document.getElementById(button.getAttribute('aria-controls'));
  const open = button.getAttribute('aria-expanded') !== 'true';
  button.setAttribute('aria-expanded', String(open));
  panel.hidden = !open;
  ScrollTrigger.refresh();
});
const media = gsap.matchMedia();
media.add('(prefers-reduced-motion: no-preference)', () => {
  const tiles = root.querySelectorAll('.feature-tile');
  const animations = [];
  [...tiles].forEach((tile, index) => {
    animations.push({ tile, tween: gsap.from(tile, {
      x: index % 2 ? 55 : -55, y: 35, opacity: 0, duration: 0.9,
      delay: (index % 3) * 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: tile, start: 'top 92%', end: 'bottom top', toggleActions: 'play reset restart reset' }
    }) });
  });
  const focus = event => animations.forEach(({ tile, tween }) => {
    if (tile.contains(event.target)) tween.progress(1);
  });
  root.addEventListener('focusin', focus);
  return () => root.removeEventListener('focusin', focus);
});
media.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
  const cleanups = [];
  root.querySelectorAll('.feature-tile').forEach(tile => {
    const surface = tile.querySelector('.feature-tile__surface');
    const move = event => {
      const box = tile.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      surface.style.setProperty('--tilt-x', `${-y * 5}deg`);
      surface.style.setProperty('--tilt-y', `${x * 5}deg`);
    };
    const reset = () => {
      surface.style.removeProperty('--tilt-x');
      surface.style.removeProperty('--tilt-y');
    };
    tile.addEventListener('pointermove', move);
    tile.addEventListener('pointerleave', reset);
    cleanups.push(() => {
      tile.removeEventListener('pointermove', move);
      tile.removeEventListener('pointerleave', reset);
      reset();
    });
  });
  return () => cleanups.forEach(cleanup => cleanup());
});
