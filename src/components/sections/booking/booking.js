import './booking.scss';
const dialog = document.querySelector('.booking');
document.addEventListener('click', e => {
  const trigger = e.target.closest('[data-booking]');
  if (!trigger) return;
  const text = trigger.dataset.booking;
  const selected = dialog.querySelector('.booking__selection');
  selected.hidden = !text;
  selected.textContent = text ? `Планування ${text}` : '';
  dialog.showModal()
});
dialog.querySelector('.booking__close').onclick = () => dialog.close();
dialog.addEventListener('click', e => {
  if (e.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog
      .close()
  }
});
document.querySelectorAll('[data-request-form]').forEach(form => {
  const phone = form.elements.phone;
  phone.addEventListener('input', () => {
    const n = phone.value.replace(/\D/g, '').length;
    phone.setCustomValidity(n >= 10 && n <= 15 ? '' : 'Введіть від 10 до 15 цифр')
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    form.querySelector('[role=status]').textContent =
      'Дякуємо! Це демонстрація запису. Заявку не надіслано — відділ продажу ще не підключено.'
  })
});
