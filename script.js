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

// ================================
// Effet scroll global sur toutes les pages
// ================================

const revealSelectors = `
  .page-title,
  .page-intro,
  .section-head,
  .section-head h2,
  .section-subtitle,
  .feature-block,
  .feature-content,
  .feature-content h2,
  .card,
  .blog-card,
  .photo-card,
  .partner,
  .partner strong,
  .social-link,
  .info-card,
  .story-block,
  .story-block h2,
  .story-block p,
  .mission-block,
  .mission-block h2,
  .mission-block p,
  .mission-block li,
  .approach-card,
  .approach-card h3,
  .panenka-quote,
  .contact-form,
  .contact-side,
  .contact-side h2,
  .article-title,
  .article-hero,
  .article-body,
  .footer-grid,
  .footer-bottom
`;

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-visible");
      }
    });
  },
  { threshold: 0.12 }
);

function initRevealAnimations(scope = document) {
  const items = scope.querySelectorAll(revealSelectors);

  items.forEach((item) => {
    if (item.classList.contains("reveal-item")) return;

    item.classList.add("reveal-item");
    revealObserver.observe(item);
  });
}

// Lance l’animation sur les éléments déjà présents
initRevealAnimations();

// Relance automatiquement quand du contenu est ajouté avec fetch()
// Exemple : blog, photos, article
const revealMutationObserver = new MutationObserver(() => {
  initRevealAnimations();
});

revealMutationObserver.observe(document.body, {
  childList: true,
  subtree: true
});