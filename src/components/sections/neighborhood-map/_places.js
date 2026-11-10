// Coordinates and Google place IDs read from public Google Maps cards on 2026-11-09.
// Four user-supplied Google Maps links were checked and added on 2026-11-10.
// Current school and street names were cross-checked against primary local sources.
export const home = {
  name: 'Будинок «Заріччя»',
  address: 'вул. Героїв Небесної Сотні, 68',
  lat: 50.317114,
  lng: 31.445783,
};

export const categories = {
  education: { label: 'Освіта', color: '#6f3c68' },
  shopping: { label: 'Покупки', color: '#b64f3c' },
  health: { label: 'Здоров’я', color: '#326e70' },
  leisure: { label: 'Дозвілля', color: '#657e49' },
  transport: { label: 'Транспорт', color: '#816125' },
};

export const places = [
  {
    id: 'dentistry', name: 'Стоматологія', category: 'health',
    address: 'вул. Філатова', lat: 50.3168854, lng: 31.4537076,
    cid: '1680671920319708234',
    sourceUrl: 'https://maps.app.goo.gl/VaPKtZmhhCZmtMnr6',
  },
  {
    id: 'druzhba-stadium', name: 'Стадіон «Дружба»', category: 'leisure',
    address: 'Березань · стадіон', lat: 50.3111444, lng: 31.462271,
    cid: '6072857289878216093',
    sourceUrl: 'https://maps.app.goo.gl/aao5iX11nsLu2Ne88',
  },
  {
    id: 'lake', name: 'Озеро', category: 'leisure',
    address: 'Березань · точка біля води', lat: 50.304335, lng: 31.465251,
    sourceUrl: 'https://maps.app.goo.gl/NfZKPiYJkavzkNb5A',
  },
  {
    id: 'forest', name: 'Ліс', category: 'leisure',
    address: 'Березань · лісова локація', lat: 50.304094, lng: 31.432937,
    sourceUrl: 'https://maps.app.goo.gl/ZELoSTra6s3oAh4y5',
  },
  {
    id: 'gymnasium-2', name: 'Березанська гімназія №2', category: 'education',
    address: 'вул. Чернігівська, 3', lat: 50.3158064, lng: 31.450901,
    placeId: 'ChIJUxv629xV1EARvuZacmoSSHQ',
  },
  {
    id: 'hospital', name: 'Березанська міська лікарня', category: 'health',
    address: 'вул. Михайлівська, 50', lat: 50.3179664, lng: 31.4552683,
    cid: '3751790663430185973',
  },
  {
    id: 'romashka', name: 'Дитсадок «Ромашка»', category: 'education',
    address: 'вул. Комарова, 5', lat: 50.3119489, lng: 31.4556738,
    cid: '8477431226245108036',
  },
  {
    id: 'museum', name: 'Краєзнавчий музей', category: 'leisure',
    address: 'вул. Героїв Небесної Сотні, 22', lat: 50.3112009, lng: 31.4626979,
    placeId: 'ChIJ22cJQtBV1EARUVlv8zsJxl0',
  },
  {
    id: 'atb', name: 'АТБ-Маркет', category: 'shopping',
    address: 'вул. Шевченків Шлях, 156а', lat: 50.3122719, lng: 31.4684013,
    placeId: 'ChIJ6dNQF85V1EAR9K2LWWzm1wg',
  },
  {
    id: 'lyceum-1', name: 'Березанський ліцей №1', category: 'education',
    address: 'вул. Шевченків Шлях, 135', lat: 50.3112705, lng: 31.4672943,
    placeId: 'ChIJVVVVVdFV1EARTT3f0QFy6_g',
  },
  {
    id: 'fora', name: 'Фора', category: 'shopping',
    address: 'вул. Шевченків Шлях, 140а', lat: 50.3109126, lng: 31.4692336,
    placeId: 'ChIJf1a8AdJV1EARRvv0UtCWikA',
  },
  {
    id: 'veterans-park', name: 'Парк Ветеранів', category: 'leisure',
    address: 'Березань · точка на карті', lat: 50.3127715, lng: 31.4736923,
    placeId: 'ChIJ8ZPoOwBV1EARDX4AQH30RaY',
  },
  {
    id: 'slavy-park', name: 'Парк Слави', category: 'leisure',
    address: 'Березань · точка на карті', lat: 50.3191864, lng: 31.4800134,
    placeId: 'ChIJVVVVAcpV1EAROS9XzxYzX3I',
  },
  {
    id: 'station', name: 'Станція «Березань»', category: 'transport',
    address: 'Залізнична станція', lat: 50.327942, lng: 31.501872,
    placeId: 'ChIJq9WpRVNU1EARKrUX-eRgpnY',
  },
];

export function distanceFromHome(place) {
  const rad = value => value * Math.PI / 180;
  const latitude = rad(place.lat - home.lat);
  const longitude = rad(place.lng - home.lng);
  const a = Math.sin(latitude / 2) ** 2 + Math.cos(rad(home.lat)) *
    Math.cos(rad(place.lat)) * Math.sin(longitude / 2) ** 2;
  return 6371008.8 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(metres) {
  return metres < 1000 ? `≈ ${Math.round(metres / 50) * 50} м` :
    `≈ ${(metres / 1000).toLocaleString('uk-UA', { maximumFractionDigits: 1 })} км`;
}

export function mapsUrl(place, directions = false) {
  const coordinate = `${place.lat},${place.lng}`;
  if (directions) {
    const query = new URLSearchParams({ api: '1', origin: `${home.lat},${home.lng}`, destination: coordinate });
    if (place.placeId) query.set('destination_place_id', place.placeId);
    return `https://www.google.com/maps/dir/?${query}`;
  }
  if (place.cid) return `https://www.google.com/maps?cid=${place.cid}`;
  const query = new URLSearchParams({ api: '1', query: coordinate });
  if (place.placeId) query.set('query_place_id', place.placeId);
  return `https://www.google.com/maps/search/?${query}`;
}
