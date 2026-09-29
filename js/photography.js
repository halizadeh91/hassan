const links = Array.from(document.querySelectorAll('[data-photo]'));
const dialog = document.querySelector('.lightbox');
const viewerImage = dialog.querySelector('.viewer-image');
const count = dialog.querySelector('.viewer-count');
const caption = dialog.querySelector('.viewer-caption');
let current = 0;
let opener;

function showPhoto(index) {
  current = (index + links.length) % links.length;
  const link = links[current];
  viewerImage.src = link.href;
  viewerImage.alt = link.querySelector('img').alt;
  caption.textContent = link.closest('figure').querySelector('figcaption span').textContent;
  count.textContent = `${String(current + 1).padStart(2, '0')} / ${String(links.length).padStart(2, '0')}`;
}
links.forEach((link, index) => link.addEventListener('click', event => {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  opener = link;
  showPhoto(index);
  dialog.showModal();
  document.body.classList.add('viewer-open');
  dialog.querySelector('.viewer-close').focus();
}));
dialog.querySelector('.viewer-prev').addEventListener('click', () => showPhoto(current - 1));
dialog.querySelector('.viewer-next').addEventListener('click', () => showPhoto(current + 1));
dialog.querySelector('.viewer-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    showPhoto(current + (event.key === 'ArrowRight' ? 1 : -1));
  }
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('viewer-open');
  opener?.focus({ preventScroll: true });
});

// Prepare offscreen photos before they can paint; never hide a visible photo.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
if (!motionPreference.matches && 'IntersectionObserver' in window) {
  const pending = new Set();
  const activeAnimations = new Map();
  function showImmediately(card) {
    pending.delete(card);
    card.classList.remove('reveal-pending');
    activeAnimations.get(card)?.finish();
    activeAnimations.delete(card);
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(async entry => {
      if (!entry.isIntersecting) return;
      const card = entry.target;
      observer.unobserve(card);
      let timeout;
      try {
        await Promise.race([
          card.querySelector('img').decode(),
          new Promise(resolve => { timeout = setTimeout(resolve, 4000); })
        ]);
        if (!pending.has(card)) return;
        const bounds = card.getBoundingClientRect();
        if (motionPreference.matches || bounds.bottom <= 0 || bounds.top >= innerHeight) {
          showImmediately(card);
          return;
        }
        const animation = card.animate([
          { opacity: 0, transform: 'translateY(22px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 900, easing: 'cubic-bezier(.2,.8,.2,1)' });
        activeAnimations.set(card, animation);
        animation.addEventListener('finish', () => activeAnimations.delete(card), { once: true });
        pending.delete(card);
        card.classList.remove('reveal-pending');
      } catch {
        showImmediately(card);
      } finally {
        clearTimeout(timeout);
      }
    });
  }, { threshold: 0 });
  document.querySelectorAll('.photo-card').forEach(card => {
    if (card.getBoundingClientRect().top < innerHeight) return;
    pending.add(card);
    card.classList.add('reveal-pending');
    observer.observe(card);
    card.addEventListener('focusin', () => {
      observer.unobserve(card);
      showImmediately(card);
    });
  });
  motionPreference.addEventListener('change', () => {
    if (!motionPreference.matches) return;
    observer.disconnect();
    [...pending, ...activeAnimations.keys()].forEach(showImmediately);
  });
}
