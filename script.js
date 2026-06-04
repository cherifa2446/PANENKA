// ================================
// PANENKA — Interactions globales
// ================================

const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

// Crée un overlay backdrop pour fermer le menu en cliquant dehors
let overlay = document.createElement('div');
overlay.className = 'nav-overlay';
document.body.appendChild(overlay);

function openMenu() {
  navLinks.classList.add('open');
  menuToggle.classList.add('active');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  navLinks.classList.remove('open');
  menuToggle.classList.remove('active');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    if (navLinks.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Ferme au clic sur un lien
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Ferme au clic sur l'overlay
  overlay.addEventListener('click', closeMenu);

  // Ferme si on resize vers desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1050) closeMenu();
  });
}

// Lightbox pour la page photos
const photoCards = document.querySelectorAll('[data-lightbox]');
const lightbox = document.querySelector('.lightbox');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxContent = document.querySelector('.lightbox-content');

photoCards.forEach((card) => {
  card.addEventListener('click', () => {
    const theme = card.dataset.theme || 'green';
    if (!lightbox || !lightboxContent) return;
    lightboxContent.className = `lightbox-content ${theme}`;
    lightbox.classList.add('active');
  });
});

if (lightboxClose && lightbox) {
  lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('active');
  });
}

if (lightbox) {
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      lightbox.classList.remove('active');
    }
  });
}

// Effet scroll sur les cartes
const revealItems = document.querySelectorAll(
  '.partner, .social-link, .info-card, .feature-block, .story-block, .mission-block'
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  },
  { threshold: 0.12 }
);

revealItems.forEach((item) => {
  item.style.opacity = '0';
  item.style.transform = 'translateY(14px)';
  item.style.transition = 'opacity 0.45s ease, transform 0.45s ease, border-color 0.25s ease';
  observer.observe(item);
});