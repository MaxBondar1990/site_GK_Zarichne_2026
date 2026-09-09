import './location.scss';
const places = [
  ['shopping', 'Магазини та супермаркети', 'Продукти та товари для дому'],
  ['shopping', 'Кафе та сервіси', 'Щоденні справи поруч із домом'],
  ['education', 'Освіта', 'Навчальні заклади району'],
  ['rest', 'Парки та відпочинок', 'Місця для прогулянок'],
  ['all', 'Громадський транспорт', 'Сполучення з містом']
];

function render(key) {
  document.querySelector('.location__places').innerHTML = places.filter(p => key === 'all' || p[0] === key)
    .map(p => `<article class="location__place"><h3>${p[1]}</h3><p>${p[2]}</p></article>`).join('')
}
document.querySelectorAll('[data-location]').forEach(b => b.onclick = () => {
  document.querySelectorAll('[data-location]').forEach(t => t.setAttribute('aria-pressed', String(t ===
    b)));
  render(b.dataset.location)
});
render('all');
