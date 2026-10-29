import { asset, format } from '../../components/sections/catalog/_data.js';

// Zones trace the supplied illustration of plan 01; other layouts stay unmarked.
const zones = [
  ['bathroom', 'Санвузол', '317,190 491,190 491,407 317,407'],
  ['kitchen', 'Кухня', '509,214 1027,214 1027,497 509,497'],
  ['hall', 'Передпокій', '317,422 491,422 491,674 317,674'],
  ['living', 'Кімната', '509,512 1027,512 1027,824 509,824']
];
export function planIllustration(apartment) {
  const interactive = apartment.id === '01';
  return `<div class="plan-illustration"><span class="plan-illustration__area">${format(apartment.area)} м²</span><div class="plan-illustration__canvas"><img class="apartment__plan" src="${asset(apartment.plan)}" alt="Планування ${apartment.id}">${interactive ? `<svg class="plan-illustration__zones" viewBox="0 0 1300 1000" aria-label="Зони на ілюстрації планування">${zones.map(([id,label,points])=>`<polygon points="${points}" tabindex="0" role="button" aria-label="Підсвітити: ${label}" aria-pressed="${id==='living'}" data-plan-zone="${id}" data-zone-name="${label}"/>`).join('')}</svg>` : ''}</div>${interactive ? '<p class="plan-illustration__hint" role="status">Кімната · натисніть на іншу зону плану</p>' : ''}</div>`;
}
function selectZone(zone) {
  const illustration = zone.closest('.plan-illustration');
  illustration.querySelectorAll('[data-plan-zone]').forEach(item => item.setAttribute('aria-pressed', String(item === zone)));
  illustration.querySelector('.plan-illustration__hint').textContent = `${zone.dataset.zoneName} · ілюстративне виділення`;
}
document.addEventListener('click', event => {
  const zone = event.target.closest('[data-plan-zone]');
  if (zone) selectZone(zone);
});
document.addEventListener('keydown', event => {
  const zone = event.target.closest('[data-plan-zone]');
  if (!zone || !['Enter', ' '].includes(event.key)) return;
  event.preventDefault();
  selectZone(zone);
});
