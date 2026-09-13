/**
 * JURRE — Portfolio Interactie Script
 * Avans CMD | Collectief
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  highlightActiveNav();
  initContactForm();
  initEmailCopy();
});

/**
 * Mobiele menunavigatie
 */
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (!menuToggle || !mainNav) return;

  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    mainNav.classList.toggle('active');
    menuToggle.textContent = isExpanded ? 'Menu' : 'Sluit [✕]';
  });

  // Sluit menu als er buiten geklikt wordt
  document.addEventListener('click', (e) => {
    if (!mainNav.contains(e.target) && !menuToggle.contains(e.target) && mainNav.classList.contains('active')) {
      mainNav.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.textContent = 'Menu';
    }
  });
}

/**
 * Markeer huidige pagina in het navigatiemenu
 */
function highlightActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
}

/**
 * Contactformulier afhandeling met nette feedback
 */
function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;

    btn.disabled = true;
    btn.textContent = 'Verzenden...';

    setTimeout(() => {
      btn.textContent = '✓ Bericht verzonden!';
      btn.style.backgroundColor = 'var(--clay)';
      btn.style.borderColor = 'var(--clay)';

      const successNotice = document.createElement('div');
      successNotice.className = 'placeholder-notice';
      successNotice.style.marginTop = '1.5rem';
      successNotice.innerHTML = `
        <span class="notice-icon">★</span>
        <p class="notice-text"><strong>Bedankt voor je reactie!</strong> Ik neem zo snel mogelijk contact met je op om van gedachten te wisselen.</p>
      `;

      form.appendChild(successNotice);
      form.reset();

      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = originalText;
        btn.style.backgroundColor = '';
        btn.style.borderColor = '';
      }, 4000);
    }, 700);
  });
}

/**
 * Klik om e-mailadres te kopiëren
 */
function initEmailCopy() {
  const emailTriggers = document.querySelectorAll('[data-copy-email]');
  
  emailTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-copy-email') || btn.textContent.trim();
      
      navigator.clipboard.writeText(email).then(() => {
        const originalText = btn.innerHTML;
        btn.innerHTML = `${email} <span style="font-size:0.75rem; color:var(--red); font-family:var(--font-mono)">[Gekopieerd!]</span>`;
        setTimeout(() => {
          btn.innerHTML = originalText;
        }, 2200);
      }).catch(() => {
        window.location.href = `mailto:${email}`;
      });
    });
  });

  /* =========================================================
   PROJECT CAROUSEL
   ========================================================= */

const carousel = document.querySelector('.projects-carousel');

if (carousel) {
  const track = carousel.querySelector('.projects-grid');
  const cards = carousel.querySelectorAll('.project-card');
  const prevButton = carousel.querySelector('.carousel-prev');
  const nextButton = carousel.querySelector('.carousel-next');

  let currentIndex = 0;


  function getVisibleCards() {
    if (window.innerWidth <= 768) {
      return 1;
    }

    if (window.innerWidth <= 900) {
      return 2;
    }

    return 3;
  }


  function updateCarousel() {
    const visibleCards = getVisibleCards();
    const maxIndex = Math.max(0, cards.length - visibleCards);

    // Zorg dat de index niet buiten de beschikbare cards valt
    currentIndex = Math.min(currentIndex, maxIndex);

    if (cards.length === 0) {
      return;
    }

    const cardWidth = cards[0].offsetWidth;
    const gap = parseFloat(getComputedStyle(track).gap);

    const offset = currentIndex * (cardWidth + gap);

    track.style.transform = `translateX(-${offset}px)`;

    // Pijlen in-/uitschakelen
    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex >= maxIndex;
  }


  nextButton.addEventListener('click', () => {
    const visibleCards = getVisibleCards();
    const maxIndex = Math.max(0, cards.length - visibleCards);

    if (currentIndex < maxIndex) {
      currentIndex++;
      updateCarousel();
    }
  });


  prevButton.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });


  window.addEventListener('resize', updateCarousel);

  updateCarousel();
}
}
