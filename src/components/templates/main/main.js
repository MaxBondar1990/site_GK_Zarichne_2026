import './main.scss';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animateCards } from '../../../js/common/card-motion.js';

gsap.registerPlugin(ScrollTrigger);

// GSAP owns and reverts inline animation styles when the motion preference changes.
const motion = gsap.matchMedia();
motion.add('(prefers-reduced-motion: no-preference)', () => {
  const intro = document.querySelector('.intro');
  if (intro) {
    const entrance = gsap.timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: { trigger: intro, start: 'top bottom', end: 'bottom top',
        toggleActions: 'play reset restart reset' }
    });
    entrance.from('.intro__image', { scale: 1.12, duration: 1.6 }, 0)
      .from('.intro__content > .kicker', { x: -65, opacity: 0, duration: 0.85 }, 0.25)
      .from('.intro__content > h1', { x: -100, opacity: 0, duration: 1.1 }, 0.4)
      .from('.intro__content > p:not(.kicker)', { x: 65, opacity: 0, duration: 0.95 }, 0.6)
      .from('.intro__card', { x: 100, opacity: 0, duration: 1.05 }, 0.7)
      // Start the primary action only after every other entrance has finished.
      .from('.intro__content > .button', {
        y: 35, scale: 0.96, opacity: 0, duration: 0.75
      }, '>+0.12');
  }

  const groups = document.querySelectorAll(
    '.residence section:not(.intro):not(.features), .page-heading, .building__hero, ' +
    '.building__benefits, .building__photos, .contacts__layout'
  );
  const animations = [];
  groups.forEach(group => {
    const elements = group.querySelectorAll(
      ':scope > .kicker, :scope > .section-heading > *, ' +
      ':scope > .residence__container > .kicker, ' +
      ':scope > .residence__container > .section-heading > *, ' +
      ':scope > .story__grid > *, :scope > .life__grid > *, ' +
      ':scope > .trust__links > *, :scope > .residence__container > .chooser'
    );
    const targets = elements.length ? [...elements] : [...group.children];
    targets.forEach((element, index) => {
      // Apartment cards use their own horizontal stagger animation.
      if (element.matches('.life__card')) return;
      const animation = gsap.from(element, {
        y: 60, opacity: 0, duration: 1.05,
        delay: (index % 3) * 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element, start: 'top 92%', end: 'bottom top',
          toggleActions: 'play reset restart reset'
        }
      });
      animations.push({ element, animation });
    });
  });

  // Reveal immediately when reached using the keyboard.
  const showFocused = event => {
    animations.forEach(({ element, animation }) => {
      if (element.contains(event.target)) animation.progress(1);
    });
  };
  document.addEventListener('focusin', showFocused);
  const refresh = () => ScrollTrigger.refresh();
  if (document.readyState === 'complete') refresh();
  else window.addEventListener('load', refresh, { once: true });
  document.fonts?.ready.then(refresh);
  return () => {
    document.removeEventListener('focusin', showFocused);
    window.removeEventListener('load', refresh);
  };
});

document.querySelectorAll('.life__grid').forEach(animateCards);
