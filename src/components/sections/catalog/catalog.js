import './catalog.scss';
import {
  apartments,
  card
} from './_data.js';
const root = document.querySelector('[data-fls-catalog]');
const home = location.pathname.endsWith('/') || location.pathname.endsWith('index.html');
root.classList.toggle('catalog--home', home);
let rooms = 'all',
  page = 1;
const min = root.querySelector('[data-area-min]'),
  max = root.querySelector('[data-area-max]'),
  panel = root.querySelector('.catalog__filters');

function render() {
  const list = apartments.filter(a => (rooms === 'all' || a.rooms === +rooms) && (!min.value || a.area >= +min
    .value) && (!max.value || a.area <= +max.value));
  const size = home ? 3 : 4;
  const pages = Math.ceil(list.length / size);
  page = Math.max(1, Math.min(page, pages));
  root.querySelector('.catalog__grid').innerHTML = list.length ? list.slice((page - 1) * size, page * size)
    .map(card).join('') :
    '<p class="empty-state">За цими параметрами планувань немає. Спробуйте іншу площу або скиньте фільтри.</p>';
  root.querySelector('.catalog__count').textContent = `Знайдено планувань: ${list.length}`;
  root.querySelector('.catalog__pagination').innerHTML = Array.from({
    length: pages
  }, (_, i) => `<button data-page="${i+1}" ${page===i+1?'aria-current="page"':''}>${i+1}</button>`).join('')
}
root.addEventListener('click', e => {
  const chip = e.target.closest('[data-rooms]'),
    p = e.target.closest('[data-page]');
  if (chip) {
    rooms = chip.dataset.rooms;
    page = 1;
    root.querySelectorAll('[data-rooms]').forEach(b => {
      b.classList.toggle('catalog__chip--active', b === chip);
      b.setAttribute('aria-pressed', String(b === chip))
    });
    render()
  }
  if (p) {
    page = +p.dataset.page;
    render();
    root.scrollIntoView({
      block: 'start'
    })
  }
});
[min, max].forEach(el => el.addEventListener('input', () => {
  page = 1;
  render()
}));
const close = () => {
  panel.classList.remove('catalog__filters--open');
  document.body.style.overflow = '';
  root.querySelector('[data-filter-open]').focus()
};
root.querySelector('[data-filter-open]').onclick = () => {
  panel.classList.add('catalog__filters--open');
  document.body.style.overflow = 'hidden';
  root.querySelector('.catalog__close').focus()
};
root.querySelector('.catalog__close').onclick = close;
root.querySelector('.catalog__apply').onclick = close;
root.querySelector('.catalog__reset').onclick = () => {
  min.value = max.value = '';
  root.querySelector('[data-rooms="all"]').click()
};
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && panel.classList.contains('catalog__filters--open')) close()
});
render();
