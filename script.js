/**
 * THE ROYAL TANDOOR — script.js
 * All JavaScript functionality for the restaurant website
 * ─────────────────────────────────────────────────────
 * Sections:
 *  1. Config / Constants
 *  2. Page Loader
 *  3. Navbar (sticky shrink + active state)
 *  4. Scroll-to-Top Button
 *  5. WhatsApp Floating Button
 *  6. Menu Category Filter
 *  7. Gallery Lightbox (prev / next)
 *  8. Contact Form Validation
 *  9. Reservation Form Validation
 * 10. Scroll-triggered Animations (IntersectionObserver)
 */

/* ═══════════════════════════════════════════════════════════
   1. CONFIG
   ═══════════════════════════════════════════════════════════ */
const WHATSAPP_NUMBER  = '919876543210';                    // ← Change this to real number
const WHATSAPP_MESSAGE = 'Hello The Royal Tandoor! I would like to place an order.';
const WHATSAPP_URL     = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;


/* ═══════════════════════════════════════════════════════════
   2. PAGE LOADER
   ═══════════════════════════════════════════════════════════ */
const loader = document.getElementById('page-loader');

if (loader) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('loaded');
      setTimeout(() => loader.remove(), 600);
    }, 300);
  });
}


/* ═══════════════════════════════════════════════════════════
   3. NAVBAR — Shrink on scroll + Active state
   ═══════════════════════════════════════════════════════════ */
const mainNav = document.getElementById('mainNav');

if (mainNav) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      mainNav.classList.add('scrolled');
    } else {
      mainNav.classList.remove('scrolled');
    }
  }, { passive: true });

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = mainNav.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    if (
      href === currentPage ||
      (currentPage === '' && href === 'index.html') ||
      (currentPage === 'index.html' && href === 'index.html')
    ) {
      link.classList.add('active');
    }
  });
}

// Close mobile navbar when a link is clicked
document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
  link.addEventListener('click', () => {
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      const toggler = document.querySelector('.navbar-toggler');
      if (toggler) toggler.click();
    }
  });
});


/* ═══════════════════════════════════════════════════════════
   4. SCROLL-TO-TOP BUTTON
   ═══════════════════════════════════════════════════════════ */
const scrollTopBtn = document.getElementById('scrollTopBtn');

if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ═══════════════════════════════════════════════════════════
   5. WHATSAPP FLOATING BUTTON
   ═══════════════════════════════════════════════════════════ */
const whatsappBtn = document.getElementById('whatsappFloat');
if (whatsappBtn) {
  whatsappBtn.setAttribute('href', WHATSAPP_URL);
}


/* ═══════════════════════════════════════════════════════════
   6. MENU CATEGORY FILTER
   ═══════════════════════════════════════════════════════════ */
(function initMenuFilter() {
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const menuCards   = document.querySelectorAll('.menu-item-card');

  if (!filterBtns.length || !menuCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.dataset.filter;

      menuCards.forEach(card => {
        const cardCat = card.dataset.category;
        const match   = category === 'all' || cardCat === category;

        if (match) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px)';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          });
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
})();


/* ═══════════════════════════════════════════════════════════
   7. GALLERY LIGHTBOX
   ═══════════════════════════════════════════════════════════ */
(function initGallery() {
  const galleryItems  = document.querySelectorAll('.gallery-item[data-img]');
  const galleryModal  = document.getElementById('galleryModal');
  if (!galleryItems.length || !galleryModal) return;

  const modalImg     = document.getElementById('galleryModalImg');
  const modalCaption = document.getElementById('galleryModalCaption');
  const prevBtn      = document.getElementById('galleryPrev');
  const nextBtn      = document.getElementById('galleryNext');

  const images = [];
  galleryItems.forEach((item, idx) => {
    images.push({
      src:     item.dataset.img,
      caption: item.dataset.caption || ''
    });
    item.addEventListener('click', () => openModal(idx));
  });

  let currentIdx = 0;

  function openModal(idx) {
    currentIdx = idx;
    showImage(currentIdx);
    if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
      const bsModal = bootstrap.Modal.getOrCreateInstance(galleryModal);
      bsModal.show();
    }
  }

  function showImage(idx) {
    if (!modalImg) return;
    modalImg.src    = images[idx].src;
    modalImg.alt    = images[idx].caption;
    if (modalCaption) modalCaption.textContent = images[idx].caption;
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIdx = (currentIdx - 1 + images.length) % images.length;
      showImage(currentIdx);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIdx = (currentIdx + 1) % images.length;
      showImage(currentIdx);
    });
  }

  document.addEventListener('keydown', e => {
    if (!galleryModal.classList.contains('show')) return;
    if (e.key === 'ArrowLeft')  prevBtn && prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn && nextBtn.click();
  });
})();


/* ═══════════════════════════════════════════════════════════
   8. CONTACT FORM VALIDATION
   ═══════════════════════════════════════════════════════════ */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;

    function setError(fieldId, msg) {
      const field = document.getElementById(fieldId);
      const err   = document.getElementById(fieldId + 'Error');
      if (!field) return;
      if (msg) {
        field.classList.add('is-invalid');
        if (err) err.textContent = msg;
        valid = false;
      } else {
        field.classList.remove('is-invalid');
        if (err) err.textContent = '';
      }
    }

    const name    = document.getElementById('contactName')?.value.trim();
    const phone   = document.getElementById('contactPhone')?.value.trim();
    const email   = document.getElementById('contactEmail')?.value.trim();
    const message = document.getElementById('contactMessage')?.value.trim();

    if (!name || name.length < 2) {
      setError('contactName', 'Please enter your full name (min. 2 characters).');
    } else {
      setError('contactName', '');
    }

    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      setError('contactPhone', 'Please enter a valid 10-digit Indian mobile number.');
    } else {
      setError('contactPhone', '');
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('contactEmail', 'Please enter a valid email address.');
    } else {
      setError('contactEmail', '');
    }

    if (!message || message.length < 10) {
      setError('contactMessage', 'Please write a message (min. 10 characters).');
    } else {
      setError('contactMessage', '');
    }

    if (valid) {
      showSuccessOverlay(
        'Message Sent!',
        'Thank you for reaching out. We\'ll get back to you within 24 hours.'
      );
      form.reset();
    }
  });
})();


/* ═══════════════════════════════════════════════════════════
   9. RESERVATION FORM VALIDATION
   ═══════════════════════════════════════════════════════════ */
(function initReservationForm() {
  const form     = document.getElementById('reservationForm');
  const dateInput = document.getElementById('resDate');
  if (!form) return;

  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;

    function setError(fieldId, msg) {
      const field = document.getElementById(fieldId);
      const err   = document.getElementById(fieldId + 'Error');
      if (!field) return;
      if (msg) {
        field.classList.add('is-invalid');
        if (err) err.textContent = msg;
        valid = false;
      } else {
        field.classList.remove('is-invalid');
        if (err) err.textContent = '';
      }
    }

    const name   = document.getElementById('resName')?.value.trim();
    const phone  = document.getElementById('resPhone')?.value.trim();
    const date   = document.getElementById('resDate')?.value;
    const time   = document.getElementById('resTime')?.value;
    const guests = document.getElementById('resGuests')?.value;

    if (!name || name.length < 2) {
      setError('resName', 'Please enter your full name.');
    } else { setError('resName', ''); }

    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      setError('resPhone', 'Please enter a valid 10-digit mobile number.');
    } else { setError('resPhone', ''); }

    if (!date) {
      setError('resDate', 'Please select a date.');
    } else {
      const selected = new Date(date);
      const today    = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        setError('resDate', 'Please select a future date.');
      } else {
        setError('resDate', '');
      }
    }

    if (!time) {
      setError('resTime', 'Please select a preferred time.');
    } else { setError('resTime', ''); }

    if (!guests || parseInt(guests) < 1 || parseInt(guests) > 30) {
      setError('resGuests', 'Please enter number of guests (1–30).');
    } else { setError('resGuests', ''); }

    if (valid) {
      const guestName  = document.getElementById('resName').value.trim();
      const guestCount = document.getElementById('resGuests').value;
      const bookDate   = new Date(document.getElementById('resDate').value).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' });
      const bookTime   = document.getElementById('resTime').value;

      showSuccessOverlay(
        'Table Reserved! 🎉',
        `Thank you, ${guestName}! Your table for ${guestCount} guest(s) has been reserved for ${bookDate} at ${bookTime}. We will confirm via call shortly.`
      );
      form.reset();
    }
  });
})();


/* ═══════════════════════════════════════════════════════════
   10. SUCCESS OVERLAY HELPER
   ═══════════════════════════════════════════════════════════ */
function showSuccessOverlay(title, message) {
  const overlay = document.getElementById('successOverlay');
  const titleEl = document.getElementById('successTitle');
  const textEl  = document.getElementById('successText');
  const closeEl = document.getElementById('successClose');

  if (!overlay) return;

  if (titleEl) titleEl.textContent = title;
  if (textEl)  textEl.textContent  = message;

  overlay.classList.add('show');
  document.body.style.overflow = 'hidden';

  function closeOverlay() {
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  if (closeEl) {
    closeEl.onclick = closeOverlay;
  }

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeOverlay();
  }, { once: true });
}


/* ═══════════════════════════════════════════════════════════
   11. SCROLL-TRIGGERED ANIMATIONS (IntersectionObserver)
   ═══════════════════════════════════════════════════════════ */
(function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  if (!elements.length || !('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  });

  elements.forEach(el => observer.observe(el));
})();


/* ═══════════════════════════════════════════════════════════
   12. HERO SCROLL INDICATOR
   ═══════════════════════════════════════════════════════════ */
const heroScroll = document.getElementById('heroScroll');
if (heroScroll) {
  heroScroll.addEventListener('click', () => {
    const nextSection = document.querySelector('#featured-dishes') || document.querySelector('section');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
}
