import './gallery.scss';
const buttons = document.querySelectorAll('[data-category-filter]');
buttons.forEach(b => b.onclick = () => {
  buttons.forEach(t => t.setAttribute('aria-pressed', String(t === b)));
  document.querySelectorAll('.gallery__item').forEach(item => item.hidden = b.dataset.categoryFilter !==
    'all' && b.dataset.categoryFilter !== item.dataset.category)
});
