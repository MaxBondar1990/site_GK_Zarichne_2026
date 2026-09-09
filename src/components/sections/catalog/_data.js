const source = import.meta.glob(['../../../assets/img/full_img/full_0r8naxb3.jpg', '../../../assets/img/full_img/full_6kaClyoj.jpg', '../../../assets/img/full_img/full_7iz5icI2.jpg', '../../../assets/img/full_img/full_AVB8iNW4.jpg', '../../../assets/img/full_img/full_Blg629NR.jpg', '../../../assets/img/full_img/full_GiIRcI7K.jpg', '../../../assets/img/full_img/full_PpQT8vmt.jpg', '../../../assets/img/full_img/full_eXu0vvHh.jpg', '../../../assets/img/full_img/full_kS6tI2i7.jpg', '../../../assets/img/full_img/full_pMNOPfY9.jpg'], {
  eager: true,
  query: '?url',
  import: 'default'
});
export const asset = name => source[`../../../assets/img/full_img/${name}`];
export const apartments = [{
    id: '01',
    rooms: 1,
    area: 34,
    plan: 'full_eXu0vvHh.jpg',
    model: 'full_7iz5icI2.jpg'
  },
  {
    id: '02',
    rooms: 1,
    area: 34.1,
    plan: 'full_6kaClyoj.jpg',
    model: 'full_AVB8iNW4.jpg'
  },
  {
    id: '03',
    rooms: 1,
    area: 34.6,
    plan: 'full_Blg629NR.jpg',
    model: 'full_PpQT8vmt.jpg'
  },
  {
    id: '04',
    rooms: 1,
    area: 37.6,
    plan: 'full_pMNOPfY9.jpg',
    model: 'full_0r8naxb3.jpg'
  },
  {
    id: '05',
    rooms: 2,
    area: 51.5,
    plan: 'full_GiIRcI7K.jpg',
    model: 'full_kS6tI2i7.jpg'
  }
];
export const format = n => n.toLocaleString('uk-UA');
export const card = a =>
  `<article class="apartment-card"><a class="apartment-card__picture" href="apartment.html?id=${a.id}"><img class="apartment-card__image" src="${asset(a.plan)}" alt="Планування ${a.id}" loading="lazy" width="420" height="320"></a><div class="apartment-card__body"><h3 class="apartment-card__title">Планування ${a.id}</h3><p class="apartment-card__meta">${a.rooms}-кімнатна · ${format(a.area)} м²</p><p class="apartment-card__meta">Поверх — уточнюється</p><a class="text-link" href="apartment.html?id=${a.id}">Переглянути →</a></div></article>`;
