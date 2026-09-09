import './header.scss';
const button = document.querySelector('.header__toggle'),
  nav = document.querySelector('.header__navigation');
const close = () => {
  nav.classList.remove('header__navigation--open');
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-label', 'Відкрити меню')
};
button.addEventListener('click', () => {
  const open = nav.classList.toggle('header__navigation--open');
  button.setAttribute('aria-expanded', String(open));
  button.setAttribute('aria-label', open ? 'Закрити меню' : 'Відкрити меню')
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    close();
    if (nav.contains(document.activeElement)) button.focus()
  }
});
matchMedia('(min-width:761px)').addEventListener('change', close);
const page = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.navigation__link').forEach(a => {
  if (a.getAttribute('href') === page) a.setAttribute('aria-current', 'page')
});
