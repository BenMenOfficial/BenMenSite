// Loading screen
window.addEventListener("load", () => {
  const loadingScreen = document.querySelector(".loading-screen");
  loadingScreen.style.opacity = "0";
  setTimeout(() => {
    loadingScreen.style.display = "none";
  }, 500);
});
// Improved smooth scroll for navigation links (ignore external/lightbox links)
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    if (this.hasAttribute('data-ignore-smooth')) return; // allow default
    const hrefVal = this.getAttribute("href") || "";
    if (!hrefVal.startsWith('#')) return;
    e.preventDefault();
    const targetId = hrefVal;
    const targetElement = document.querySelector(targetId);
    const navEl = document.querySelector("nav");
    const isFixed = navEl && getComputedStyle(navEl).position === "fixed";
    const headerOffset = isFixed ? 100 : 0;
    const elementPosition = targetElement.getBoundingClientRect().top;
    const offsetPosition =
      elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  });
});

// Add scroll animation to sections
const sections = document.querySelectorAll("section");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  },
  { threshold: 0.1 }
);

sections.forEach((section) => {
  section.style.opacity = "0";
  section.style.transform = "translateY(20px)";
  section.style.transition = "all 0.6s ease-out";
  observer.observe(section);
});

// Form submission handling
const form = document.getElementById("contact-form");
const confirmationMessage = document.getElementById("confirmation-message");

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  
  // Check if privacy agreement is checked
  const privacyCheckbox = document.getElementById("privacy-agreement");
  if (!privacyCheckbox.checked) {
    alert("עליך להסכים למדיניות הפרטיות כדי לשלוח את הטופס");
    privacyCheckbox.focus();
    return;
  }
  
  try {
    const response = await fetch(form.action, {
      method: form.method,
      body: new FormData(form),
      headers: { Accept: "application/json" },
    });

    if (response.ok) {
      createConfetti();
      form.reset();
      confirmationMessage.style.display = "block";
      setTimeout(() => {
        confirmationMessage.style.display = "none";
      }, 5000);
    } else {
      alert("אירעה תקלה בשליחת הטופס. אנא נסה שנית.");
    }
  } catch (error) {
    alert("אירעה שגיאה. אנא בדוק את חיבור האינטרנט שלך ונסה שוב.");
  }
});

// Add menu toggle functionality
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle?.addEventListener("click", () => {
  const isActive = navLinks.classList.toggle("active");
  menuToggle.setAttribute("aria-expanded", String(isActive));
});

// Close menu when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".nav-container")) {
    navLinks.classList.remove("active");
    menuToggle?.setAttribute("aria-expanded", "false");
  }
});

// Close menu when clicking a link
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

// Scroll to top when clicking the desktop logo (and other nav logos)
document.querySelectorAll(".nav-logo").forEach((logo) => {
  logo.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
});

// Digital Rain Effect
function createDigitalRain() {
  const rainContainer = document.getElementById("digitalRain");
  const dropsCount = 120;
  const colors = [
    'rgba(249, 115, 22, 0.9)', // orange - brighter
    'rgba(251, 191, 36, 0.9)', // gold - brighter
    'rgba(249, 115, 22, 0.7)', // lighter orange
    'rgba(251, 191, 36, 0.7)', // lighter gold
    'rgba(255, 140, 0, 0.8)',  // deep orange
    'rgba(255, 215, 0, 0.8)'   // bright gold
  ];

  for (let i = 0; i < dropsCount; i++) {
    const drop = document.createElement("div");
    drop.className = "rain-drop";
    drop.style.left = `${Math.random() * 100}%`;
    drop.style.animationDuration = `${2 + Math.random() * 3}s`;
    drop.style.animationDelay = `${Math.random() * 5}s`;
    // Random color from orange/gold palette
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    drop.style.background = `linear-gradient(to bottom, transparent, ${randomColor})`;
    drop.style.opacity = `${0.7 + Math.random() * 0.3}`; // Random opacity between 0.7-1.0
    rainContainer.appendChild(drop);
  }
}

// Visitor Counter
function updateVisitorCounter() {
  try {
    let count = localStorage.getItem("visitorCount") || 0;
    count = parseInt(count) + 1;
    localStorage.setItem("visitorCount", count);
    const counterEl = document.querySelector(".counter-number");
    if (counterEl) {
      counterEl.textContent = count;
    }
  } catch (_) {
    // ignore counter errors
  }
}

// Confetti Effect
function createConfetti() {
  const colors = ["#00f7ff", "#4deeea", "#00b7ff"];
  const confettiCount = 100;

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDuration = `${2 + Math.random() * 3}s`;
    confetti.style.animationDelay = `${Math.random() * 0.5}s`;
    document.body.appendChild(confetti);

    setTimeout(() => {
      confetti.remove();
    }, 3000);
  }
}

// Privacy Policy Lightbox functionality
function initializePrivacyLightbox() {
  const privacyLink = document.getElementById("privacy-link");
  const privacyLightbox = document.getElementById("privacyLightbox");
  const privacyLightboxClose = document.getElementById("privacyLightboxClose");

  if (privacyLink && privacyLightbox && privacyLightboxClose) {
    privacyLink.addEventListener("click", (e) => {
      e.preventDefault();
      privacyLightbox.classList.add("active");
      privacyLightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });

    privacyLightboxClose.addEventListener("click", () => {
      closePrivacyLightbox();
    });

    privacyLightbox.addEventListener("click", (e) => {
      if (e.target === privacyLightbox) {
        closePrivacyLightbox();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && privacyLightbox.classList.contains("active")) {
        closePrivacyLightbox();
      }
    });
  }
}

function closePrivacyLightbox() {
  const privacyLightbox = document.getElementById("privacyLightbox");
  if (privacyLightbox) {
    privacyLightbox.classList.remove("active");
    privacyLightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
}

// Initialize effects
document.addEventListener("DOMContentLoaded", () => {
  createDigitalRain();
  updateVisitorCounter();
  initializePrivacyLightbox();
  
  // Initialize gallery after a short delay to ensure DOM is ready
  setTimeout(() => {
    initializeGallery();
    // expose gallery navigation to inline onclick handlers
    window.nextImage = nextImage;
    window.prevImage = prevImage;
  }, 200);
  
  // Initialize FAQ after DOM is fully ready
  setTimeout(() => {
    initializeFAQ();
  }, 300);
});



// Enhanced touch swipe support and scroll tracking
let gallery = null;
let touchStartX = 0;
let touchEndX = 0;
let isScrolling = false;

function initializeGallery() {
  gallery = document.querySelector(".gallery-grid");
  
  if (gallery) {
    // setup new simple controls
    recalcGallery();
    attachGalleryControls();
    gallery.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
      isScrolling = false;
    });

    gallery.addEventListener("touchmove", (e) => {
      isScrolling = true;
    });

    gallery.addEventListener("touchend", (e) => {
      if (!isScrolling) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      }
    });

    // no extra trackers needed; handled in attachGalleryControls
  }
}



// New simple gallery scroller
let currentImageIndex = 0;
let totalImages = 0;

function recalcGallery() {
  const gallery = document.querySelector('.gallery-grid');
  const items = gallery ? Array.from(gallery.querySelectorAll('.gallery-item')) : [];
  totalImages = items.length;
  if (currentImageIndex >= totalImages) currentImageIndex = Math.max(0, totalImages - 1);
  const totalEl = document.getElementById('totalImagesNumber');
  if (totalEl) totalEl.textContent = String(totalImages || 1);
  updateIndicator();
}

function updateIndicator() {
  const currEl = document.getElementById('currentImageNumber');
  if (currEl) currEl.textContent = String((currentImageIndex || 0) + 1);
}

function attachGalleryControls() {
  const gallery = document.querySelector('.gallery-grid');
  if (!gallery) return;
  const prevBtn = document.getElementById('galleryPrev');
  const nextBtn = document.getElementById('galleryNext');
  const items = Array.from(gallery.querySelectorAll('.gallery-item'));
  let isAutoScrolling = false;
  let scrollDebounceId = null;
  
  function goTo(index) {
    if (index < 0 || index >= items.length) return;
    currentImageIndex = index;
    isAutoScrolling = true;
    const el = items[index];
    const container = gallery;
    const targetLeft = el.offsetLeft - (container.clientWidth - el.clientWidth) / 2;
    container.scrollTo({ left: targetLeft, behavior: 'smooth' });
    updateIndicator();
    updateButtonsState();
    // unlock after animation
    clearTimeout(scrollDebounceId);
    scrollDebounceId = setTimeout(() => {
      isAutoScrolling = false;
    }, 400);
  }
  
  function updateButtonsState() {
    if (prevBtn) prevBtn.disabled = currentImageIndex <= 0;
    if (nextBtn) nextBtn.disabled = currentImageIndex >= items.length - 1;
  }
  
  prevBtn?.addEventListener('click', (e) => { e.preventDefault(); goTo(currentImageIndex - 1); });
  nextBtn?.addEventListener('click', (e) => { e.preventDefault(); goTo(currentImageIndex + 1); });
  
  // sync on manual scroll
  gallery.addEventListener('scroll', () => {
    if (isAutoScrolling) return;
    clearTimeout(scrollDebounceId);
    scrollDebounceId = setTimeout(() => {
      const center = gallery.scrollLeft + gallery.clientWidth / 2;
      let best = 0, bestDist = Infinity;
      items.forEach((el, i) => {
        const mid = el.offsetLeft + el.clientWidth / 2;
        const dist = Math.abs(mid - center);
        if (dist < bestDist) { bestDist = dist; best = i; }
      });
      if (best !== currentImageIndex) {
        currentImageIndex = best;
        updateIndicator();
        updateButtonsState();
      }
    }, 80);
  }, { passive: true });
  
  updateButtonsState();
}

function handleSwipe() {
  const swipeThreshold = 50;
  if (touchEndX < touchStartX - swipeThreshold) {
    nextImage();
  } else if (touchEndX > touchStartX + swipeThreshold) {
    prevImage();
  }
}

// Lightbox functionality
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxDesc = document.getElementById('lightboxDesc');
const lightboxTags = document.getElementById('lightboxTags');
const lightboxLink = document.getElementById('lightboxLink');
const lightboxClose = document.getElementById('lightboxClose');

function openLightboxFromItem(item) {
  const img = item.querySelector('img');
  lightboxImg.src = img?.src || '';
  lightboxImg.alt = img?.alt || 'תצוגת פרויקט';
  lightboxTitle.textContent = item.getAttribute('data-title') || img?.alt || 'פרויקט';

  // description: prefer data-description; otherwise generate from alt/tags
  const explicitDesc = item.getAttribute('data-description') || '';
  if (explicitDesc) {
    lightboxDesc.textContent = explicitDesc;
  } else {
    const generated = generateAutoDescription(img?.alt || '', item.getAttribute('data-tags') || '');
    lightboxDesc.textContent = generated;
  }

  // tags
  lightboxTags.innerHTML = '';
  const tagsStr = item.getAttribute('data-tags') || '';
  if (tagsStr) {
    tagsStr.split(',').map(t => t.trim()).filter(Boolean).forEach(tag => {
      const chip = document.createElement('span');
      chip.className = 'tag-chip';
      chip.textContent = tag;
      lightboxTags.appendChild(chip);
    });
  }

  const link = item.getAttribute('data-link');
  if (link) {
    lightboxLink.href = link;
    lightboxLink.style.display = 'inline-flex';
  } else {
    lightboxLink.style.display = 'none';
  }

  lightbox.classList.add('active');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function generateAutoDescription(altText, tagsStr) {
  const normalized = (altText || '').trim();
  const tags = (tagsStr || '').split(',').map(t => t.trim()).filter(Boolean);
  const tagsSentence = tags.length ? ` טכנולוגיות: ${tags.join(', ')}.` : '';

  const contains = (kw) => normalized.includes(kw);
  if (contains('לוגו')) {
    return `עיצוב לוגו ממותג המדגיש בהירות וקריאות בכל קנה מידה, עם קו וקטורי נקי ופלטת צבעים עקבית.${tagsSentence}`;
  }
  if (contains('כרטיס ביקור')) {
    return `כרטיס ביקור מינימליסטי עם היררכיית מידע ברורה, מרווחים מאוזנים והתאמה לדפוס ורשת.${tagsSentence}`;
  }
  if (contains('פוסטר')) {
    return `פוסטר פרסומי בעל קומפוזיציה מודגשת, טיפוגרפיה בולטת וניגודיות צבעים לשיפור תשומת הלב.${tagsSentence}`;
  }
  if (contains('עיצוב אתר') || contains('אתר')) {
    return `ממשק אתר רספונסיבי עם דגש על UX נקי, קצב טיפוגרפי קריא ונגישות גבוהה במובייל ובדסקטופ.${tagsSentence}`;
  }
  if (contains('עיצוב מוצר')) {
    return `עיצוב מוצר חזותי השומר על זהות מותג עקבית, איזון צבעים והדגשת ערך שימושי.${tagsSentence}`;
  }
  if (contains('עיצוב גרפי')) {
    return `קונספט עיצוב גרפי עם היררכיית מידע ברורה, טיפוגרפיה תומכת מסר וקומפוזיציה מאוזנת.${tagsSentence}`;
  }
  // fallback
  return `${normalized || 'פרויקט עיצוב'} עם דגש על קריאות, אחידות מותג ורספונסיביות.${tagsSentence}`;
}

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => openLightboxFromItem(item));
});

function closeLightbox() {
  lightbox.classList.remove('active');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox?.classList.contains('active')) {
    closeLightbox();
  }
  
  // Gallery navigation with keyboard
  if (!lightbox?.classList.contains('active')) {
    // because we normalized scroll container to LTR, map keys explicitly
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      prevImage();
    } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      nextImage();
    }
  }
});

// Animated Statistics Counter
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      if (target >= 50) {
        element.textContent = target + '+';
      } else {
        element.textContent = target;
      }
      clearInterval(timer);
    } else {
      if (target >= 50) {
        element.textContent = Math.floor(current) + '+';
      } else {
        element.textContent = Math.floor(current);
      }
    }
  }, 16);
}

// Observe statistics section for animation
const statsSection = document.querySelector('.stats-section');
if (statsSection) {
  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const statNumbers = entry.target.querySelectorAll('.stat-number');
          statNumbers.forEach((stat) => {
            const target = parseInt(stat.getAttribute('data-target'));
            if (target) {
              const currentText = stat.textContent.trim();
              // Only animate if it hasn't been animated yet (starts with 0)
              if (currentText.startsWith('0')) {
                animateCounter(stat, target);
              }
            }
          });
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  
  statsObserver.observe(statsSection);
}

// FAQ Accordion
function initializeFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  if (faqItems.length === 0) {
    return;
  }
  
  faqItems.forEach((item, index) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    if (!question || !answer) {
      return;
    }
    
    // Make sure answer is initially closed
    answer.style.maxHeight = '0';
    answer.style.padding = '0 1.5rem';
    question.setAttribute('aria-expanded', 'false');
    
    let isAnimating = false;
    
    // Add click event to the button
    question.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Prevent rapid clicking
      if (isAnimating) {
        return;
      }
      
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      
      // Toggle current FAQ (allow multiple FAQs to be open)
      isAnimating = true;
      
      if (isExpanded) {
        // Close - get current height
        const startHeight = answer.scrollHeight;
        
        // Set explicit height first (no transition yet)
        answer.style.maxHeight = startHeight + 'px';
        answer.style.padding = '0 1.5rem 1.5rem 1.5rem';
        answer.style.transition = 'none';
        
        // Update state
        question.setAttribute('aria-expanded', 'false');
        item.removeAttribute('data-expanded');
        
        // Update other elements
        item.style.transition = 'border 0.15s ease, box-shadow 0.15s ease, background 0.15s ease';
        question.style.transition = 'background 0.15s ease, color 0.15s ease';
        const icon = question.querySelector('.faq-icon');
        if (icon) icon.style.transition = 'background 0.15s ease, box-shadow 0.15s ease';
        const iconSvg = icon?.querySelector('svg');
        if (iconSvg) iconSvg.style.transition = 'transform 0.25s cubic-bezier(0.4, 0, 1, 1)';
        
        // Force reflow to apply the height
        void answer.offsetHeight;
        
        // Now add transition and animate to 0
        answer.style.transition = 'max-height 0.3s cubic-bezier(0.4, 0, 1, 1), padding 0.3s cubic-bezier(0.4, 0, 1, 1)';
        answer.style.maxHeight = '0';
        answer.style.padding = '0 1.5rem';
        
        // Cleanup after animation
        setTimeout(() => {
          answer.style.transition = '';
          answer.style.maxHeight = '';
          answer.style.padding = '';
          item.style.transition = '';
          question.style.transition = '';
          if (icon) icon.style.transition = '';
          if (iconSvg) iconSvg.style.transition = '';
          isAnimating = false;
        }, 300);
      } else {
        // Open
        answer.style.transition = 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), padding 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        answer.style.maxHeight = '0';
        answer.style.padding = '0 1.5rem';
        
        // Update state
        question.setAttribute('aria-expanded', 'true');
        item.setAttribute('data-expanded', 'true');
        
        // Restore transitions
        item.style.transition = '';
        question.style.transition = '';
        const icon = question.querySelector('.faq-icon');
        if (icon) icon.style.transition = '';
        const iconSvg = icon?.querySelector('svg');
        if (iconSvg) iconSvg.style.transition = '';
        
        // Force reflow
        void answer.offsetHeight;
        
        // Animate to open
        answer.style.maxHeight = '2000px';
        answer.style.padding = '0 1.5rem 1.5rem 1.5rem';
        
        // Reset animation lock
        setTimeout(() => {
          isAnimating = false;
        }, 400);
      }
    }, true); // Use capture phase
  });
}
