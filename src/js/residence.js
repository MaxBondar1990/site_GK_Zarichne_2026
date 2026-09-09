const images = import.meta.glob(['../assets/img/full_img/full_0r8naxb3.jpg', '../assets/img/full_img/full_6kaClyoj.jpg', '../assets/img/full_img/full_7iz5icI2.jpg', '../assets/img/full_img/full_AVB8iNW4.jpg', '../assets/img/full_img/full_Blg629NR.jpg', '../assets/img/full_img/full_EwOlNUuf.jpg', '../assets/img/full_img/full_GiIRcI7K.jpg', '../assets/img/full_img/full_IMrgSG7q.jpeg', '../assets/img/full_img/full_MvuAnuVh.jpeg', '../assets/img/full_img/full_PpQT8vmt.jpg', '../assets/img/full_img/full_RpsjED99.jpg', '../assets/img/full_img/full_eXu0vvHh.jpg', '../assets/img/full_img/full_eeiGE6Jx.jpg', '../assets/img/full_img/full_kS6tI2i7.jpg', '../assets/img/full_img/full_l8icx8tn.jpg', '../assets/img/full_img/full_pMNOPfY9.jpg', '../assets/img/full_img/full_pRsfLtFA.jpg', '../assets/img/full_img/full_tAJklelC.jpg'], {eager:true, query:'?url', import:'default'});
const asset = name => images[`../assets/img/full_img/${name}`];
const apartments = [
 {id:'01',rooms:1,area:34,plan:'full_eXu0vvHh.jpg',model:'full_7iz5icI2.jpg'},
 {id:'02',rooms:1,area:34.1,plan:'full_6kaClyoj.jpg',model:'full_AVB8iNW4.jpg'},
 {id:'03',rooms:1,area:34.6,plan:'full_Blg629NR.jpg',model:'full_PpQT8vmt.jpg'},
 {id:'04',rooms:1,area:37.6,plan:'full_pMNOPfY9.jpg',model:'full_0r8naxb3.jpg'},
 {id:'05',rooms:2,area:51.5,plan:'full_GiIRcI7K.jpg',model:'full_kS6tI2i7.jpg'}
];
const galleries = [
 ['full_MvuAnuVh.jpeg','Фасад будинку · фото з архіву'],
 ['full_pRsfLtFA.jpg','Архітектурна візуалізація · денний ракурс'],
 ['full_l8icx8tn.jpg','Архітектурна візуалізація · вечірній ракурс'],
 ['full_IMrgSG7q.jpeg','Внутрішні роботи · фото з архіву'],
 ['full_eeiGE6Jx.jpg','Будівництво · фото з архіву']
];
const format = n => n.toLocaleString('uk-UA');
const grid = document.querySelector('#apartment-grid');
const dialog = document.querySelector('#viewer');
const content = document.querySelector('#viewer-content');
let filter = 'all', galleryIndex = 0;
function render(){
 const list = apartments.filter(a => filter==='all'||a.rooms===Number(filter)).sort((a,b)=>document.querySelector('#sort').value==='asc'?a.area-b.area:b.area-a.area);
 grid.innerHTML = list.map(a=>`<article class="apartment-card"><div class="card-top"><span class="card-tag">${a.rooms}-кімнатна</span><span>Тип ${a.id}</span></div><button class="card-image" data-apartment="${a.id}" aria-label="Переглянути планування ${format(a.area)} квадратних метрів"><img src="${asset(a.plan)}" alt="Ілюстрація планування типу ${a.id}" loading="lazy" width="400" height="300"></button><div class="card-bottom"><div><h3>${format(a.area)} <small>м²</small></h3><p>Вартість уточнюється</p></div><button class="card-arrow" data-apartment="${a.id}" aria-label="Деталі квартири типу ${a.id}">↗</button></div></article>`).join('');
 document.querySelector('#catalog-count').textContent = `Планувань у добірці: ${list.length}`;
}
function openDialog(title,html){document.querySelector('#viewer-title').textContent=title;content.innerHTML=html;if(!dialog.open)dialog.showModal();}
function showApartment(id){const a=apartments.find(a=>a.id===id);if(!a)return;
 openDialog(`${a.rooms}-кімнатна · ${format(a.area)} м²`, `<div class="viewer-tabs" role="group" aria-label="Вигляд квартири"><button data-apartment-view="plan" aria-pressed="true">Планування</button><button data-apartment-view="model" aria-pressed="false">3D із меблями</button></div><img class="viewer-image" id="apartment-view" src="${asset(a.plan)}" alt="Ілюстрація планування"><p class="viewer-description">Тип ${a.id} · Демонстраційне зіставлення площі та ілюстрацій. Планування, комплектація, поверх і наявність потребують підтвердження. Меблі показано для прикладу.</p><div class="viewer-actions"><button class="button primary" id="choose-apartment">Мене цікавить ця квартира ↗</button></div>`);
 content.querySelectorAll('[data-apartment-view]').forEach(b=>b.addEventListener('click',()=>{content.querySelectorAll('[data-apartment-view]').forEach(t=>t.setAttribute('aria-pressed',String(t===b)));document.querySelector('#apartment-view').src=asset(a[b.dataset.apartmentView]);}));
 document.querySelector('#choose-apartment').addEventListener('click',()=>{document.querySelector('#interest').value=`${a.rooms}-кімнатна квартира`;document.querySelector('#selected-apartment').value=a.id;const selection=document.querySelector('#selected-apartment-label');selection.hidden=false;selection.textContent=`Вибране планування: тип ${a.id} · ${format(a.area)} м²`;dialog.close();document.querySelector('#contacts').scrollIntoView({behavior:'smooth'});document.querySelector('[name=name]').focus({preventScroll:true});});
}
const documents={floor:['Схема житлового поверху','full_RpsjED99.jpg','Надана схема поверху. Фактичне розташування й нумерація квартир уточнюються.'],permit:['Дозвіл на будівництво','full_tAJklelC.jpg','Надано сторінку 1 із 5. Повний документ та актуальний статус уточнюються.'],expert:['Експертний звіт','full_EwOlNUuf.jpg','Надана сторінка експертного звіту за 2019 рік. Будинок №1, перша черга.']};
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{const [title,file,note]=documents[b.dataset.view];openDialog(title,`<img class="viewer-image" src="${asset(file)}" alt="${title}"><p class="viewer-description">${note}</p><a class="viewer-download" href="${asset(file)}" target="_blank" rel="noopener">Відкрити оригінал у новій вкладці ↗</a>`);}));
grid.addEventListener('click',e=>{const b=e.target.closest('[data-apartment]');if(b)showApartment(b.dataset.apartment);});
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(t=>{t.classList.toggle('selected',t===b);t.setAttribute('aria-pressed',String(t===b));});render();}));
document.querySelector('#sort').addEventListener('change',render);
document.querySelector('.close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
function updateGallery(){const [file,caption]=galleries[galleryIndex];document.querySelector('#gallery-image').src=asset(file);document.querySelector('#gallery-image').alt=caption;document.querySelector('#gallery-caption').textContent=caption;document.querySelector('#gallery-count').textContent=`${String(galleryIndex+1).padStart(2,'0')} / 05`;}
document.querySelector('#gallery-next').addEventListener('click',()=>{galleryIndex=(galleryIndex+1)%galleries.length;updateGallery();});
document.querySelector('#gallery-prev').addEventListener('click',()=>{galleryIndex=(galleryIndex+galleries.length-1)%galleries.length;updateGallery();});
document.querySelector('#gallery-open').addEventListener('click',()=>{const [file,caption]=galleries[galleryIndex];openDialog(caption,`<img class="viewer-image" src="${asset(file)}" alt="${caption}">`);});
const toggle=document.querySelector('.menu-toggle'), nav=document.querySelector('#navigation');
function closeMenu(){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Відкрити меню');}
toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Закрити меню':'Відкрити меню');});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
document.querySelector('#contact-form').addEventListener('submit',e=>{e.preventDefault();document.querySelector('#form-status').textContent='Дякуємо! Демонстраційну форму перевірено. Заявку не надіслано: відділ продажу ще не підключено.';});
document.querySelector('#year').textContent=new Date().getFullYear();
render();
// Optional agent access uses the same controls and data as the visible catalog.
if (document.modelContext?.registerTool) {
 const lifecycle = new AbortController();
 Promise.resolve(document.modelContext.registerTool({
  name:'filter_apartments', title:'Підібрати планування',
  description:'Filter the demo apartment catalog by number of rooms. Does not reserve apartments or submit contact data.',
  inputSchema:{type:'object',properties:{rooms:{type:'string',enum:['all','1','2']}},required:['rooms'],additionalProperties:false},
  annotations:{readOnlyHint:false},
  execute(input){
   if(!input || !['all','1','2'].includes(input.rooms))throw new Error('rooms must be all, 1 or 2');
   document.querySelector(`[data-filter="${input.rooms}"]`).click();
   return {demo:true,apartments:apartments.filter(a=>input.rooms==='all'||a.rooms===Number(input.rooms)).map(({id,rooms,area})=>({id,rooms,area}))};
  }
 },{signal:lifecycle.signal})).catch(()=>{});
 window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
}

const contactForm = document.querySelector('#contact-form');
const phoneInput = contactForm.elements.phone;
phoneInput.addEventListener('input', () => {
 const digits = phoneInput.value.replace(/\D/g, '');
 phoneInput.setCustomValidity(digits.length >= 10 && digits.length <= 15 ? '' : 'Введіть номер телефону: від 10 до 15 цифр.');
 document.querySelector('#form-status').textContent = '';
});
document.querySelector('#interest').addEventListener('change', () => {
 document.querySelector('#selected-apartment').value = '';
 document.querySelector('#selected-apartment-label').hidden = true;
});
matchMedia('(min-width: 761px)').addEventListener('change', closeMenu);
nav.addEventListener('keydown', e => { if(e.key === 'Escape') toggle.focus(); });
