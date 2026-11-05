/* History page: previous/next buttons for the photo strip. */
(() => {
  const strip = document.querySelector('.history-strip');
  if (!strip) return;
  document.querySelectorAll('[data-strip]').forEach((btn) => {
    btn.addEventListener('click', () => {
      strip.scrollBy({ left: Number(btn.dataset.strip) * strip.clientWidth * 0.8, behavior: 'smooth' });
    });
  });
})();
