/**
 * Hossam Hassan - Portfolio Core JavaScript
 * Modern Developer Experience & Mascot Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbar();
  initMobileMenu();
  initStatCounters();
  initProjectModals();
  initGitHubRepos();
  initWordPressSlider();
  initContactForm();
});

/* ==========================================
   1. Theme Management (Clean White Mode)
   ========================================== */
function initTheme() {
  // Pure clean white theme
  applyTheme('light');
  localStorage.setItem('hossam_theme', 'light');
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const icon = document.getElementById('theme-toggle-icon');
  if (icon) {
    if (theme === 'dark') {
      // Sun icon for dark mode (to switch to light)
      icon.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
    } else {
      // Moon icon for light mode (to switch to dark)
      icon.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    }
  }
}

/* ==========================================
   2. Sticky Navbar & Robust Scroll Spy
   ========================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const desktopNavLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const allNavLinks = [...desktopNavLinks, ...mobileNavLinks];

  // Tracked navigation sections in logical page order
  const trackedSectionIds = [
    'home',
    'about',
    'experience',
    'skills',
    'projects',
    'wordpress',
    'contact'
  ];

  const trackedSections = trackedSectionIds
    .map(id => ({ id, el: document.getElementById(id) }))
    .filter(item => item.el !== null);

  function updateActiveNavLink() {
    // 1. Add shadow when scrolled
    if (window.scrollY > 20) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // 2. Determine active section
    let activeId = 'home';

    // If near the bottom of the page, activate Contact
    const isAtBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 80);
    if (isAtBottom) {
      activeId = 'contact';
    } else {
      const navbarHeight = navbar ? navbar.offsetHeight : 72;
      const threshold = navbarHeight + 80;

      for (let i = 0; i < trackedSections.length; i++) {
        const rect = trackedSections[i].el.getBoundingClientRect();
        if (rect.top <= threshold) {
          activeId = trackedSections[i].id;
        } else {
          break;
        }
      }
    }

    // 3. Update active classes
    allNavLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${activeId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Throttle with requestAnimationFrame for smooth 60fps performance
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateActiveNavLink();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Update immediately on page load, hash change, and resize
  updateActiveNavLink();
  window.addEventListener('load', updateActiveNavLink);
  window.addEventListener('resize', updateActiveNavLink, { passive: true });
  window.addEventListener('hashchange', () => {
    setTimeout(updateActiveNavLink, 40);
  });

  // Smooth click instant active state
  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      const targetHref = link.getAttribute('href');
      if (targetHref && targetHref.startsWith('#')) {
        allNavLinks.forEach(l => l.classList.remove('active'));
        allNavLinks.filter(l => l.getAttribute('href') === targetHref).forEach(l => l.classList.add('active'));
      }
    });
  });
}

/* ==========================================
   3. Mobile Menu Drawer
   ========================================== */
function initMobileMenu() {
  const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileToggleBtn && mobileDrawer) {
    mobileToggleBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileToggleBtn.innerHTML = isOpen
        ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
        : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileToggleBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
      });
    });
  }
}

/* ==========================================
   4. Stat Counters Animation on Scroll
   ========================================== */
function initStatCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  let animated = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNumbers.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-count'), 10) || 0;
          const suffix = stat.getAttribute('data-suffix') || '';
          let count = 0;
          const step = Math.max(1, Math.ceil(target / 30));
          const interval = setInterval(() => {
            count += step;
            if (count >= target) {
              stat.textContent = target + suffix;
              clearInterval(interval);
            } else {
              stat.textContent = count + suffix;
            }
          }, 35);
        });
      }
    });
  }, { threshold: 0.2 });

  const statsSection = document.querySelector('.about-stats-grid');
  if (statsSection) observer.observe(statsSection);
}

/* ==========================================
   5. Project Details Modal Logic
   ========================================== */
const projectDetailsData = {
  'alessra': {
    title: 'Alessra Education Platform – LMS',
    category: 'Full Educational Learning Management System',
    stack: ['PHP 8.2', 'Laravel', 'MySQL', 'REST APIs', 'Zoom SDK', 'OAuth 2.0', 'WebSockets', 'Laravel Reverb'],
    description: 'A scalable, full-featured educational platform built to power seamless remote education for thousands of students and teachers.',
    highlights: [
      'Engineered backend LMS architecture for users, courses, lessons, trial sessions, and real-time attendance.',
      'Integrated Zoom Meetings API & SDK with OAuth token management and automated meeting lifecycle generation.',
      'Implemented real-time bi-directional events via Laravel Reverb and WebSockets for live classroom updates.',
      'Designed and indexed high-load MySQL schemas for fast course querying and lesson scheduling.',
      'Secured role-based access control (RBAC) separating Admins, Teachers, Students, and Guardians.'
    ],
    architecture: 'Modular Monolith with Service-Repository pattern, event-driven broadcasting via Laravel Reverb.',
    liveUrl: null,
    githubUrl: null
  },
  'mrshaco': {
    title: 'Mr Shaco Store – E-commerce Platform',
    category: 'High-Performance E-commerce Solution',
    stack: ['Laravel', 'PHP', 'MySQL', 'REST API', 'Payment Gateways', 'Redis Caching', 'IPN Handlers'],
    description: 'A production e-commerce backend handling products, inventory tracking, order states, customer accounts, and automated payment flows.',
    highlights: [
      'Engineered robust RESTful APIs powering mobile applications and modern storefronts.',
      'Integrated multiple payment gateways with asynchronous Webhook / IPN transaction synchronization.',
      'Built race-condition resistant stock and inventory deduction transactions using MySQL row locks.',
      'Implemented administrative dashboard workflows for bulk product updates and order fulfillment.'
    ],
    architecture: 'Layered MVC with dedicated Payment Service Provider abstractions and transactional order dispatching.',
    liveUrl: 'https://www.mrshacostore.com/',
    githubUrl: null
  },
  'sijil': {
    title: 'Sijil – SaaS Platform',
    category: 'Enterprise SaaS Application',
    stack: ['PHP', 'MySQL', 'Authentication', 'Production Deployment', 'Linux Nginx', 'Clean Architecture'],
    description: 'A cloud SaaS platform engineered from ground up, featuring multi-tenant database designs, enterprise authentication, and production monitoring.',
    highlights: [
      'Designed extensible relational database schemas with foreign-key constraints and optimized indexing.',
      'Implemented secure authentication, session management, and role delegation.',
      'Handled complete production deployment on Linux server with Nginx, PHP-FPM, SSL, and automated backups.',
      'Implemented query caching and database tuning for sub-100ms response times.'
    ],
    architecture: 'Clean MVC with domain-driven business logic and repository abstraction.',
    liveUrl: null,
    githubUrl: null
  },
  'rafeeq': {
    title: 'Rafeeq – Social / Delivery Platform',
    category: 'On-Demand Delivery & Social Logistics',
    stack: ['Laravel', 'PHP', 'MySQL', 'REST API', 'Location Services'],
    description: 'A backend platform coordinating on-demand order dispatch, delivery partner routing, and consumer order tracking.',
    highlights: [
      'Built high-concurrency dispatch logic connecting customers with nearby delivery partners.',
      'Designed flexible RESTful API endpoints for consumer, courier, and merchant applications.',
      'Optimized spatial and coordinate-based queries in MySQL for accurate distance calculation.'
    ],
    architecture: 'Service-oriented architecture with decoupled dispatch and notification queues.',
    liveUrl: null,
    githubUrl: null
  },
  'weddy': {
    title: 'Weddy – Event Services Marketplace',
    category: 'Multi-Vendor Marketplace',
    stack: ['Laravel', 'MySQL', 'REST API', 'Vendor Booking Engine'],
    description: 'A two-sided marketplace connecting wedding & event organizers with verified vendors, halls, and caterers.',
    highlights: [
      'Developed vendor onboarding, calendar availability scheduling, and service tier pricing modules.',
      'Built quotation request and real-time proposal exchange workflows.',
      'Engineered search filters supporting date ranges, venue capacities, and pricing brackets.'
    ],
    architecture: 'Multi-vendor modular architecture with granular role-based access control.',
    liveUrl: null,
    githubUrl: null
  },
  'taxi': {
    title: 'Taxi Platform',
    category: 'Ride-Hailing & Real-Time Logistics',
    stack: ['Laravel', 'PHP', 'MySQL', 'REST API', 'Geolocation', 'Background Queues'],
    description: 'A ride-hailing backend managing passenger ride requests, driver matching algorithms, fare estimations, and trip histories.',
    highlights: [
      'Implemented ride state machine: Requested -> Dispatched -> Arrived -> In-Trip -> Completed.',
      'Designed database tables optimized for rapid geospatial lookup and driver status heartbeats.',
      'Engineered background worker queues for receipts, push notifications, and analytics.'
    ],
    architecture: 'Event-driven state machine architecture with asynchronous background processing.',
    liveUrl: null,
    githubUrl: null
  },
  'payop': {
    title: 'Payop & Payment Gateway Integrations',
    category: 'Enterprise Payment Architecture',
    stack: ['Payop SDK', 'REST APIs', 'Webhooks', 'IPN Callbacks', 'JWT', 'Cryptographic Signatures'],
    description: 'Robust payment architecture capable of handling multi-currency transactions, idempotent checkout flows, and cryptographic webhook verification.',
    highlights: [
      'Designed idempotent payment creation endpoints to prevent duplicate charges.',
      'Implemented asynchronous webhook and IPN listeners with SHA-256 signature verification.',
      'Automated real-time transaction reconciliation between database states and payment gateway receipts.',
      'Built fail-safe retry mechanisms with exponential backoff for network timeouts.'
    ],
    architecture: 'Webhook Event Listener -> Signature Verification -> Database Transaction -> Customer Notification.',
    liveUrl: null,
    githubUrl: null
  },
  'zoom': {
    title: 'Zoom SDK & OAuth Integration',
    category: 'Real-Time Video Conference Engine',
    stack: ['Zoom Meeting SDK', 'OAuth 2.0', 'Access Tokens', 'Refresh Tokens', 'ZAK Tokens', 'REST APIs'],
    description: 'Comprehensive Zoom integration providing automated live lesson scheduling, one-click teacher hosting, and embedded student attendance.',
    highlights: [
      'Implemented OAuth 2.0 handshake with token refreshing to maintain uninterrupted API access.',
      'Generated Zoom App Key (ZAK) tokens for verified teacher host identity without leaving the platform.',
      'Embedded client-side Zoom Meeting SDK for seamless in-browser video lessons.',
      'Built automated attendance tracking triggered upon student join and leave Webhook events.'
    ],
    architecture: 'OAuth Handshake -> Server-side Meeting Factory -> ZAK Generation -> Webhook Attendance Logger.',
    liveUrl: null,
    githubUrl: null
  }
};

function initProjectModals() {
  const modalOverlay = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const detailButtons = document.querySelectorAll('[data-project-target]');

  if (!modalOverlay) return;

  detailButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetKey = btn.getAttribute('data-project-target');
      const data = projectDetailsData[targetKey];
      if (data) {
        populateModal(data);
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeModal = () => {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  modalCloseBtn?.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
}

function populateModal(data) {
  document.getElementById('modal-title').textContent = data.title;
  document.getElementById('modal-category').textContent = data.category;
  document.getElementById('modal-description').textContent = data.description;
  document.getElementById('modal-architecture').textContent = data.architecture;

  // Stack badges
  const stackContainer = document.getElementById('modal-stack');
  stackContainer.innerHTML = '';
  data.stack.forEach(tech => {
    const badge = document.createElement('span');
    badge.className = 'tech-badge';
    badge.textContent = tech;
    stackContainer.appendChild(badge);
  });

  // Highlights list
  const highlightsContainer = document.getElementById('modal-highlights');
  highlightsContainer.innerHTML = '';
  data.highlights.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    highlightsContainer.appendChild(li);
  });

  // Link button
  const liveLinkBtn = document.getElementById('modal-live-link');
  if (liveLinkBtn) {
    if (data.liveUrl) {
      liveLinkBtn.href = data.liveUrl;
      liveLinkBtn.style.display = 'inline-flex';
    } else {
      liveLinkBtn.style.display = 'none';
    }
  }
}

/* ==========================================
   6. GitHub Public API Repositories Fetcher
   ========================================== */
function initGitHubRepos() {
  const repoContainer = document.getElementById('github-repos-container');
  if (!repoContainer) return;

  const username = 'hossam-byte';
  const apiUrl = `https://api.github.com/users/${username}/repos?sort=updated&per_page=4`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) throw new Error('GitHub API response not ok');
      return response.json();
    })
    .then(repos => {
      if (!Array.isArray(repos) || repos.length === 0) {
        showFallbackRepos(repoContainer);
        return;
      }

      repoContainer.innerHTML = '';
      repos.forEach(repo => {
        const card = document.createElement('a');
        card.href = repo.html_url;
        card.target = '_blank';
        card.rel = 'noopener noreferrer';
        card.className = 'repo-card';

        card.innerHTML = `
          <div class="repo-card-top">
            <span class="repo-name">${escapeHtml(repo.name)}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </div>
          <p class="repo-desc">${escapeHtml(repo.description || 'Backend PHP / Laravel Repository')}</p>
          <div class="repo-meta">
            <span>● ${escapeHtml(repo.language || 'PHP')}</span>
            <span>⭐ ${repo.stargazers_count || 0}</span>
            <span>🍴 ${repo.forks_count || 0}</span>
          </div>
        `;
        repoContainer.appendChild(card);
      });
    })
    .catch(() => {
      showFallbackRepos(repoContainer);
    });
}

function showFallbackRepos(container) {
  // Graceful fallback showing key highlighted repositories
  container.innerHTML = `
    <a href="https://github.com/hossam-byte" target="_blank" rel="noopener noreferrer" class="repo-card">
      <div class="repo-card-top">
        <span class="repo-name">LMS_alessra</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/></svg>
      </div>
      <p class="repo-desc">Scalable Educational Learning Management System with Zoom SDK & Laravel Reverb.</p>
      <div class="repo-meta"><span>● PHP (Laravel)</span><span>⭐ Public</span></div>
    </a>
    <a href="https://github.com/hossam-byte" target="_blank" rel="noopener noreferrer" class="repo-card">
      <div class="repo-card-top">
        <span class="repo-name">payment-gateway-service</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/></svg>
      </div>
      <p class="repo-desc">Payop & Multi-currency webhook listener and transaction synchronization engine.</p>
      <div class="repo-meta"><span>● PHP</span><span>⭐ Public</span></div>
    </a>
  `;
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* ==========================================
   8. Interactive Contact Form (Direct AJAX Submission)
   ========================================== */
function initContactForm() {
  const contactForm = document.getElementById('portfolio-contact-form');
  const feedbackBox = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('btn-send-message');

  if (!contactForm) return;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name')?.value.trim();
    const email = document.getElementById('contact-email')?.value.trim();
    const subject = document.getElementById('contact-subject')?.value.trim();
    const message = document.getElementById('contact-message')?.value.trim();

    if (!name || !email || !subject || !message) {
      if (feedbackBox) {
        feedbackBox.className = 'form-feedback error';
        feedbackBox.textContent = 'Please fill out all required fields before sending.';
      }
      return;
    }

    // Save original button state and show loading
    const originalBtnContent = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
        </svg>
        Sending Message...
      `;
    }

    if (feedbackBox) {
      feedbackBox.className = 'form-feedback';
      feedbackBox.style.display = 'none';
    }

    try {
      const response = await fetch('https://formsubmit.co/ajax/hm238620@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          _replyto: email,
          _subject: `[Portfolio Inquiry] ${subject} - from ${name}`,
          message: message,
          _template: 'table',
          _captcha: 'false'
        })
      });

      const data = await response.json();

      if (response.ok && (data.success === 'true' || data.success === true || data.message)) {
        if (feedbackBox) {
          feedbackBox.className = 'form-feedback success';
          feedbackBox.innerHTML = `
            <strong>✓ Message Sent Successfully!</strong><br>
            Thank you, ${escapeHtml(name)}. Your message has been sent directly to Hossam's inbox (<code>hm238620@gmail.com</code>). I will get back to you shortly!
          `;
        }
        contactForm.reset();
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (err) {
      console.warn('FormSubmit direct delivery error, providing mailto fallback:', err);
      if (feedbackBox) {
        feedbackBox.className = 'form-feedback error';
        feedbackBox.innerHTML = `
          <strong>Notice:</strong> Unable to send automatically. You can email Hossam directly at 
          <a href="mailto:hm238620@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}" style="color: inherit; text-decoration: underline; font-weight: 700;">
            hm238620@gmail.com
          </a> or reach out on <a href="https://wa.me/201109163202" target="_blank" style="color: inherit; text-decoration: underline; font-weight: 700;">WhatsApp</a>.
        `;
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnContent;
      }
    }
  });
}

/* ==========================================
   9. WordPress Interactive Slider
   ========================================== */
function initWordPressSlider() {
  const track = document.getElementById('wp-slider-track');
  const prevBtn = document.getElementById('wp-prev-btn');
  const nextBtn = document.getElementById('wp-next-btn');
  const dotsContainer = document.getElementById('wp-slider-dots');

  if (!track) return;

  const getScrollAmount = () => {
    const card = track.querySelector('.wp-project-card');
    return card ? card.offsetWidth + 24 : 360;
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    });
  }

  // Generate pagination dots
  if (dotsContainer) {
    const cards = track.querySelectorAll('.wp-project-card');
    dotsContainer.innerHTML = '';

    cards.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `wp-slider-dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Navigate to WordPress project ${idx + 1}`);
      dot.addEventListener('click', () => {
        track.scrollTo({ left: idx * getScrollAmount(), behavior: 'smooth' });
      });
      dotsContainer.appendChild(dot);
    });

    // Update active dot on scroll
    let isScrolling;
    track.addEventListener('scroll', () => {
      window.clearTimeout(isScrolling);
      isScrolling = setTimeout(() => {
        const activeIdx = Math.round(track.scrollLeft / getScrollAmount());
        const dots = dotsContainer.querySelectorAll('.wp-slider-dot');
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === activeIdx);
        });
      }, 50);
    }, { passive: true });
  }
}

