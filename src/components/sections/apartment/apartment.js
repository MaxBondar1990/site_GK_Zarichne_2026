import './apartment.scss';
import {
  apartments,
  asset,
  format,
  card
} from '../catalog/_data.js';
import '../catalog/catalog.scss';
const id = new URLSearchParams(location.search).get('id') || '01',
  a = apartments.find(a => a.id === id),
  root = document.querySelector('.apartment__content');
if (!a) {
  root.innerHTML =
    '<h1>Планування не знайдено</h1><p>Поверніться до каталогу, щоб обрати квартиру.</p><a class="button" href="apartments.html">До квартир</a>'
} else {
  document.title = `Планування ${a.id} — ЖК Заріччя`;
  root.innerHTML =
    `<h1>${a.rooms===1?'Однокімнатна':'Двокімнатна'} квартира</h1><p>Планування ${a.id}</p><div class="apartment__layout"><div><img class="apartment__plan" src="${asset(a.plan)}" alt="Планування ${a.id}"><div class="apartment__tabs" role="group" aria-label="Вигляд квартири"><button data-mode="plan" aria-pressed="true">Планування</button><button data-mode="model" aria-pressed="false">3D</button><button data-mode="interior" aria-pressed="false">Інтер’єр</button></div><p class="note apartment__caption">Ілюстрація планування. Відповідність площі уточнюється.</p></div><div><div class="apartment__summary"><dl class="apartment__list"><div><dt>Площа за схемою</dt><dd>${format(a.area)} м²</dd></div><div><dt>Поверх</dt><dd>Уточнюється</dd></div><div><dt>Ціна</dt><dd>За запитом</dd></div></dl><button class="button" data-booking="${a.id}">Записатися на перегляд ↗</button></div><div class="apartment__rooms"><h3>Розташування приміщень</h3><dl class="apartment__list">${['Передпокій','Кухня','Кімната','Санвузол','Балкон / лоджія'].map(x=>`<div><dt>${x}</dt><dd>—</dd></div>`).join('')}</dl><p class="note">Демонстраційне зіставлення матеріалів. Точні характеристики та наявність уточнюються.</p></div></div></div><section class="apartment__interior"><h2>Уявіть свій майбутній дім</h2><p>Можливий варіант облаштування</p><img src="${asset(a.model)}" alt="Об’ємний приклад меблювання квартири" loading="lazy"><p class="note">Окремі візуалізації ремонту готуються. Меблі не визначають комплектацію квартири.</p></section><h2>Інші планування</h2><div class="apartment__related">${apartments.filter(x=>x.id!==a.id).slice(0,2).map(card).join('')}</div>`;
  root.querySelectorAll('[data-mode]').forEach(b => b.onclick = () => {
    root.querySelectorAll('[data-mode]').forEach(t => t.setAttribute('aria-pressed', String(t === b)));
    root.querySelector('.apartment__plan').src = asset(b.dataset.mode === 'plan' ? a.plan : a.model);
    root.querySelector('.apartment__caption').textContent = b.dataset.mode === 'interior' ?
      'Можливе облаштування. Нові візуалізації ремонту готуються.' : b.dataset.mode === 'model' ?
      'Об’ємна ілюстрація з меблями.' : 'Ілюстрація планування. Відповідність площі уточнюється.'
  });
}
