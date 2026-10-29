import './residence.scss';
import { planIllustration } from '../../../js/common/plan-illustration.js';
import { animateCards } from '../../../js/common/card-motion.js';
import {apartments, asset, format} from '../catalog/_data.js';
const root=document.querySelector('[data-fls-residence]');
let room='all';
const range=root.querySelector('#area-limit');
const detail=root.querySelector('.plan-detail');
const draw=()=>{
 const list=apartments.filter(a=>(room==='all'||a.rooms===Number(room))&&a.area<=Number(range.value));
 root.querySelector('#area-output').textContent=format(Number(range.value));
 root.querySelector('.chooser__count').textContent=`Знайдено планувань: ${list.length}`;
 root.querySelector('.building-view__plans').innerHTML=list.map(a=>`<button data-plan="${a.id}"><span>${a.rooms}-кімнатна</span><strong>${format(a.area)} м²</strong><span>План ${a.id}</span></button>`).join('')||'<p class="chooser__empty">Змініть параметри пошуку</p>';
 root.querySelector('.plans-view').innerHTML=list.map(a=>`<button class="plan-preview" data-plan="${a.id}"><img src="${asset(a.plan)}" alt="Планування ${a.id}" loading="lazy"><strong>${a.rooms}-кімнатна</strong><span class="plan-preview__area">${format(a.area)} м²</span><span>Переглянути план ${a.id}</span></button>`).join('')||'<p class="chooser__empty">За цими параметрами планувань немає. Спробуйте скинути фільтри.</p>';
 animateCards(root.querySelector('.building-view__plans'));
 animateCards(root.querySelector('.plans-view'));
};
root.addEventListener('click',e=>{
 const v=e.target.closest('[data-view]');
 if(v){root.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b===v)));root.querySelector('.building-view').hidden=v.dataset.view!=='building';root.querySelector('.plans-view').hidden=v.dataset.view!=='plans';animateCards(root.querySelector(v.dataset.view==='plans'?'.plans-view':'.building-view__plans'));}
 const r=e.target.closest('[data-room]');
 if(r){room=r.dataset.room;root.querySelectorAll('[data-room]').forEach(b=>b.setAttribute('aria-pressed',String(b===r)));draw();}
 const p=e.target.closest('[data-plan]');
 if(p){const a=apartments.find(a=>a.id===p.dataset.plan);detail.querySelector('.plan-detail__body').innerHTML=`${planIllustration(a)}<div><p class="kicker">ВАШ МАЙБУТНІЙ ПРОСТІР</p><h2 id="plan-detail-title">${a.rooms}-кімнатна<br><span class="plan-detail__area">${format(a.area)} м²</span></h2><p>Планування ${a.id}</p><p class="note">Поверх, ціна та наявність уточнюються. Ілюстрацію потрібно звірити з актуальною квартирографією.</p><a class="button" href="apartment.html?id=${a.id}">Детальніше про квартиру</a></div>`;detail.showModal();}
});
range.addEventListener('input',draw);
root.querySelector('.chooser__reset').onclick=()=>{range.value=52;root.querySelector('[data-room="all"]').click();};
root.querySelector('.plan-detail__close').onclick=()=>detail.close();
detail.addEventListener('click',e=>{if(e.target===detail){const r=detail.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)detail.close();}});
draw();
