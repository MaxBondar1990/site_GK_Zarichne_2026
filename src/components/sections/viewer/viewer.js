import './viewer.scss';
const dialog = document.querySelector('.viewer');
let items = [],
  index = 0;

function render() {
  const a = items[index];
  dialog.querySelector('.viewer__image').src = a.href;
  dialog.querySelector('.viewer__image').alt = a.dataset.caption;
  dialog.querySelector('.viewer__title').textContent = a.dataset.caption;
  dialog.querySelector('.viewer__original').href = a.href;
  dialog.querySelector('.viewer__count').textContent = `${index+1} / ${items.length}`;
  dialog.querySelectorAll('[data-view-prev],[data-view-next]').forEach(b => b.hidden = items.length < 2)
}
document.addEventListener('click', e => {
  const a = e.target.closest('[data-lightbox]');
  if (!a) return;
  e.preventDefault();
  items = [...document.querySelectorAll('[data-lightbox]')].filter(x => x.dataset.lightbox === a.dataset
    .lightbox && !x.closest('[hidden]'));
  index = items.indexOf(a);
  render();
  dialog.showModal()
});
dialog.querySelector('.viewer__close').onclick = () => dialog.close();
const move = n => {
  index = (index + n + items.length) % items.length;
  render()
};
dialog.querySelector('[data-view-prev]').onclick = () => move(-1);
dialog.querySelector('[data-view-next]').onclick = () => move(1);
dialog.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') move(1);
  if (e.key === 'ArrowLeft') move(-1)
});
