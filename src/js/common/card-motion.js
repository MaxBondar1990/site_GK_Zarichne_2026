import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
const cardContexts = new WeakMap();

// Rebuild animation when filters replace the cards, without retaining detached nodes.
export function animateCards(container) {
  if (!container) return;
  cardContexts.get(container)?.revert();
  const cards = [...container.children].filter(element =>
    element.matches('.life__card, .apartment-card, .plan-preview, [data-plan]')
  );
  if (!cards.length || container.closest('[hidden]')) return;
  const media = gsap.matchMedia();
  cardContexts.set(container, media);
  media.add('(prefers-reduced-motion: no-preference)', () => {
    const tween = gsap.fromTo(cards,
      { x: 90, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 0.85,
        stagger: 0.16, ease: 'power3.out',
        scrollTrigger: {
          trigger: container, start: 'top 92%', end: 'bottom top',
          toggleActions: 'play reset restart reset'
        }
      }
    );
    const showFocused = event => {
      if (cards.some(card => card.contains(event.target))) tween.progress(1);
    };
    container.addEventListener('focusin', showFocused);
    return () => container.removeEventListener('focusin', showFocused);
  });
}
