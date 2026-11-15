/**
 * Manahil's Portfolio - Interactive Scripts
 * Handles Dark/Light Mode, Mobile Navigation, Scroll Observers, and Clipboard Actions
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileMenu();
  initScrollEffects();
  initActiveNavHighlight();
  initCopyEmail();
});

/* ==========================================================================
   THEME TOGGLE (Dark / Light Mode)
   ========================================================================== */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Retrieve saved theme preference or default to light
  const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
  applyTheme(savedTheme);

  if (!themeToggleBtn) return;

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
  });

  function applyTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      themeToggleBtn.setAttribute('title', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }
  }
}

/* ==========================================================================
   MOBILE HAMBURGER MENU
   ========================================================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const navLinks = document.querySelectorAll('.mobile-nav-link, .mobile-nav-footer a');

  if (!menuBtn || !mobileNav) return;

  function toggleMenu(isOpen) {
    const shouldOpen = typeof isOpen === 'boolean' ? isOpen : menuBtn.getAttribute('aria-expanded') !== 'true';
    menuBtn.setAttribute('aria-expanded', String(shouldOpen));
    
    if (shouldOpen) {
      mobileNav.removeAttribute('hidden');
    } else {
      mobileNav.setAttribute('hidden', '');
    }
  }

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close when clicking any nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMenu(false);
    });
  });

  // Close when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') {
      toggleMenu(false);
      menuBtn.focus();
    }
  });

  // Close when clicking outside of the header and mobile nav
  document.addEventListener('click', (e) => {
    if (!mobileNav.hasAttribute('hidden')) {
      const isClickInsideNav = mobileNav.contains(e.target);
      const isClickOnToggle = menuBtn.contains(e.target);
      if (!isClickInsideNav && !isClickOnToggle) {
        toggleMenu(false);
      }
    }
  });
}

/* ==========================================================================
   HEADER SHADOW & SCROLL TO TOP
   ========================================================================== */
function initScrollEffects() {
  const header = document.getElementById('header');
  const scrollTopBtn = document.getElementById('scroll-to-top');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY || window.pageYOffset;

    // Header elevation
    if (header) {
      if (scrollPos > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Scroll to Top Button Visibility
    if (scrollTopBtn) {
      if (scrollPos > 350) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }
  }, { passive: true });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

/* ==========================================================================
   ACTIVE NAV LINK HIGHLIGHTING VIA INTERSECTION OBSERVER
   ========================================================================== */
function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-nav .mobile-nav-link');

  if (!('IntersectionObserver' in window) || sections.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        setActiveLink(currentId);
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  function setActiveLink(sectionId) {
    desktopLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${sectionId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    mobileLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${sectionId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

/* ==========================================================================
   COPY EMAIL TO CLIPBOARD
   ========================================================================== */
function initCopyEmail() {
  const copyBtn = document.getElementById('copy-email-btn');
  const emailToCopy = 'naeemmanahil89@gmail.com';

  if (!copyBtn) return;

  const copyTextSpan = copyBtn.querySelector('.copy-text');
  const originalText = copyTextSpan ? copyTextSpan.textContent : 'Copy Email';

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(emailToCopy);
      if (copyTextSpan) {
        copyTextSpan.textContent = 'Copied!';
        copyBtn.style.borderColor = 'var(--accent-color)';
      }

      setTimeout(() => {
        if (copyTextSpan) {
          copyTextSpan.textContent = originalText;
          copyBtn.style.borderColor = '';
        }
      }, 2000);
    } catch (err) {
      // Fallback for clipboard if permission denied
      const tempInput = document.createElement('input');
      tempInput.value = emailToCopy;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);

      if (copyTextSpan) {
        copyTextSpan.textContent = 'Copied!';
        setTimeout(() => {
          copyTextSpan.textContent = originalText;
        }, 2000);
      }
    }
  });
}
