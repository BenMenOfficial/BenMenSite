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

// Digital Rain Effect
function createDigitalRain() {
  const rainContainer = document.getElementById("digitalRain");
  const dropsCount = 100;

  for (let i = 0; i < dropsCount; i++) {
    const drop = document.createElement("div");
    drop.className = "rain-drop";
    drop.style.left = `${Math.random() * 100}%`;
    drop.style.animationDuration = `${2 + Math.random() * 3}s`;
    drop.style.animationDelay = `${Math.random() * 5}s`;
    rainContainer.appendChild(drop);
  }
}

// Visitor Counter
function updateVisitorCounter() {
  let count = localStorage.getItem("visitorCount") || 0;
  count = parseInt(count) + 1;
  localStorage.setItem("visitorCount", count);
  document.querySelector(".counter-number").textContent = count;
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

// Initialize effects
document.addEventListener("DOMContentLoaded", () => {
  createDigitalRain();
  updateVisitorCounter();
});

// Gallery navigation
function nextImage() {
  const gallery = document.querySelector(".gallery-grid");
  const itemWidth = gallery.querySelector(".gallery-item").offsetWidth;
  gallery.scrollBy({
    left: itemWidth,
    behavior: "smooth",
  });
}

function prevImage() {
  const gallery = document.querySelector(".gallery-grid");
  const itemWidth = gallery.querySelector(".gallery-item").offsetWidth;
  gallery.scrollBy({
    left: -itemWidth,
    behavior: "smooth",
  });
}

// Add touch swipe support
const gallery = document.querySelector(".gallery-grid");
let touchStartX = 0;
let touchEndX = 0;

gallery.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

gallery.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

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
});
