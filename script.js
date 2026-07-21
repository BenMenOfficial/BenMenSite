// Cookie consent & Google Analytics (נטען רק בהסכמה)
const COOKIE_CONSENT_KEY = "benmen-cookie-consent";
const GA_MEASUREMENT_ID = "G-7XWXNBW6L1";
const ACCESSIBILITY_STORAGE_KEY = "benmen-accessibility-settings";
const defaultAccessibilitySettings = {
  contrast: false,
  textScale: 1,
  linksHighlight: false,
  reducedMotion: false,
  readableFont: false,
};

let accessibilitySettings = { ...defaultAccessibilitySettings };

function getAccessibilitySettings() {
  try {
    const storedValue = localStorage.getItem(ACCESSIBILITY_STORAGE_KEY);
    if (!storedValue) return { ...defaultAccessibilitySettings };
    const parsed = JSON.parse(storedValue);
    return { ...defaultAccessibilitySettings, ...parsed };
  } catch {
    return { ...defaultAccessibilitySettings };
  }
}

function saveAccessibilitySettings() {
  try {
    localStorage.setItem(
      ACCESSIBILITY_STORAGE_KEY,
      JSON.stringify(accessibilitySettings),
    );
  } catch {
    /* ignore */
  }
}

function applyAccessibilitySettings(settings = accessibilitySettings) {
  accessibilitySettings = { ...defaultAccessibilitySettings, ...settings };

  document.body.classList.toggle(
    "accessibility-contrast",
    Boolean(accessibilitySettings.contrast),
  );
  document.body.classList.toggle(
    "accessibility-links-highlight",
    Boolean(accessibilitySettings.linksHighlight),
  );
  document.body.classList.toggle(
    "accessibility-reduced-motion",
    Boolean(accessibilitySettings.reducedMotion),
  );
  document.body.classList.toggle(
    "accessibility-font-readable",
    Boolean(accessibilitySettings.readableFont),
  );

  document.documentElement.style.setProperty(
    "--accessibility-scale",
    String(accessibilitySettings.textScale),
  );

  const textScaleEl = document.getElementById("accessibility-text-scale");
  if (textScaleEl) {
    textScaleEl.textContent = `${Math.round(accessibilitySettings.textScale * 100)}%`;
  }

  const contrastInput = document.getElementById("accessibility-contrast");
  const linksInput = document.getElementById("accessibility-links-highlight");
  const motionInput = document.getElementById("accessibility-reduced-motion");
  const fontInput = document.getElementById("accessibility-readable-font");

  if (contrastInput)
    contrastInput.checked = Boolean(accessibilitySettings.contrast);
  if (linksInput)
    linksInput.checked = Boolean(accessibilitySettings.linksHighlight);
  if (motionInput)
    motionInput.checked = Boolean(accessibilitySettings.reducedMotion);
  if (fontInput)
    fontInput.checked = Boolean(accessibilitySettings.readableFont);

  saveAccessibilitySettings();
}

function closeAccessibilityPanel() {
  const panel = document.getElementById("accessibility-menu");
  const toggle = document.getElementById("accessibility-toggle");
  if (!panel) return;
  panel.classList.remove("is-open");
  panel.setAttribute("aria-hidden", "true");
  if (toggle) toggle.setAttribute("aria-expanded", "false");

  const activeElement = document.activeElement;
  if (activeElement && panel.contains(activeElement) && toggle) {
    toggle.focus();
  }
}

function openAccessibilityPanel() {
  const panel = document.getElementById("accessibility-menu");
  const toggle = document.getElementById("accessibility-toggle");
  if (!panel || !toggle) return;
  panel.classList.add("is-open");
  panel.setAttribute("aria-hidden", "false");
  toggle.setAttribute("aria-expanded", "true");

  const firstFocusable = panel.querySelector(
    "button, input, a, select, textarea",
  );
  if (firstFocusable) firstFocusable.focus();
}

function initializeAccessibilityPanel() {
  const toggle = document.getElementById("accessibility-toggle");
  const closeButton = document.getElementById("accessibility-close");
  const panel = document.getElementById("accessibility-menu");

  toggle?.addEventListener("click", () => {
    const isOpen = panel?.classList.contains("is-open");
    if (isOpen) {
      closeAccessibilityPanel();
    } else {
      openAccessibilityPanel();
    }
  });

  closeButton?.addEventListener("click", closeAccessibilityPanel);

  document.addEventListener("click", (event) => {
    if (event.target instanceof Element) {
      const clickedInsidePanel = event.target.closest(".accessibility-panel");
      const clickedToggle = event.target.closest(".accessibility-toggle");
      if (!clickedInsidePanel && !clickedToggle) {
        closeAccessibilityPanel();
      }
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeAccessibilityPanel();
    }
  });

  document
    .getElementById("accessibility-contrast")
    ?.addEventListener("change", (event) => {
      accessibilitySettings.contrast = Boolean(event.target.checked);
      applyAccessibilitySettings(accessibilitySettings);
    });

  document
    .getElementById("accessibility-links-highlight")
    ?.addEventListener("change", (event) => {
      accessibilitySettings.linksHighlight = Boolean(event.target.checked);
      applyAccessibilitySettings(accessibilitySettings);
    });

  document
    .getElementById("accessibility-reduced-motion")
    ?.addEventListener("change", (event) => {
      accessibilitySettings.reducedMotion = Boolean(event.target.checked);
      applyAccessibilitySettings(accessibilitySettings);
    });

  document
    .getElementById("accessibility-readable-font")
    ?.addEventListener("change", (event) => {
      accessibilitySettings.readableFont = Boolean(event.target.checked);
      applyAccessibilitySettings(accessibilitySettings);
    });

  document.querySelectorAll("[data-scale-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.getAttribute("data-scale-action");
      if (action === "increase") {
        accessibilitySettings.textScale = Math.min(
          2,
          Number((accessibilitySettings.textScale + 0.1).toFixed(2)),
        );
      } else {
        accessibilitySettings.textScale = Math.max(
          0.9,
          Number((accessibilitySettings.textScale - 0.1).toFixed(2)),
        );
      }
      applyAccessibilitySettings(accessibilitySettings);
    });
  });

  document
    .getElementById("accessibility-reset")
    ?.addEventListener("click", () => {
      accessibilitySettings = { ...defaultAccessibilitySettings };
      applyAccessibilitySettings(accessibilitySettings);
    });
}

function getCookieConsent() {
  try {
    const value = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (value === "accepted" || value === "essential") return value;
  } catch {
    /* localStorage unavailable */
  }
  return null;
}

function setCookieConsent(value) {
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, value);
  } catch {
    /* ignore */
  }
}

function loadGoogleAnalytics() {
  if (window.__benmenGaLoaded) return;
  window.__benmenGaLoaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer.push(arguments);
    };
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.onload = () => {
    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID, { anonymize_ip: true });
  };
  document.head.appendChild(script);
}

function showCookieBanner() {
  const banner = document.getElementById("cookie-banner");
  if (!banner) return;
  banner.hidden = false;
  banner.setAttribute("aria-hidden", "false");
  document.body.classList.add("cookie-banner-open");
  requestAnimationFrame(() => banner.classList.add("is-visible"));
}

function hideCookieBanner() {
  const banner = document.getElementById("cookie-banner");
  if (!banner) return;
  banner.classList.remove("is-visible");
  banner.setAttribute("aria-hidden", "true");
  document.body.classList.remove("cookie-banner-open");
  setTimeout(() => {
    banner.hidden = true;
  }, 280);
}

function applyCookieConsent(choice) {
  setCookieConsent(choice);
  if (choice === "accepted") {
    loadGoogleAnalytics();
  }
  hideCookieBanner();
}

function openPrivacyFromCookie() {
  const privacyLink = document.getElementById("privacy-link");
  privacyLink?.click();
}

function initializeCookieConsent() {
  const acceptBtn = document.getElementById("cookie-accept");
  const essentialBtn = document.getElementById("cookie-essential");
  const privacyBtn = document.getElementById("cookie-privacy-link");
  const settingsBtn = document.getElementById("cookie-settings-link");
  const footerPrivacyBtn = document.getElementById("footer-privacy-link");

  acceptBtn?.addEventListener("click", () => applyCookieConsent("accepted"));
  essentialBtn?.addEventListener("click", () =>
    applyCookieConsent("essential"),
  );
  privacyBtn?.addEventListener("click", openPrivacyFromCookie);
  settingsBtn?.addEventListener("click", () => showCookieBanner());
  footerPrivacyBtn?.addEventListener("click", openPrivacyFromCookie);

  const stored = getCookieConsent();
  if (stored === "accepted") {
    loadGoogleAnalytics();
    return;
  }
  if (stored === "essential") {
    return;
  }
  showCookieBanner();
}

// Loading screen
window.addEventListener("load", () => {
  const loadingScreen = document.querySelector(".loading-screen");
  if (!loadingScreen) return;
  loadingScreen.style.opacity = "0";
  setTimeout(() => {
    loadingScreen.style.display = "none";
  }, 400);
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    if (this.hasAttribute("data-ignore-smooth")) return;
    const hrefVal = this.getAttribute("href") || "";
    if (!hrefVal.startsWith("#") || hrefVal === "#") return;
    const targetElement = document.querySelector(hrefVal);
    if (!targetElement) return;
    e.preventDefault();
    const navEl = document.getElementById("main-nav");
    const headerOffset = navEl ? 80 : 0;
    const top =
      targetElement.getBoundingClientRect().top +
      window.pageYOffset -
      headerOffset;
    window.scrollTo({ top, behavior: "smooth" });
  });
});

// Nav scroll state
const mainNav = document.getElementById("main-nav");

function onScroll() {
  const y = window.scrollY;
  if (mainNav) mainNav.classList.toggle("scrolled", y > 40);
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Active nav link
const navLinkEls = document.querySelectorAll(".nav-links a[href^='#']");
const sectionIds = ["about", "skills", "catalog", "gallery", "faq", "contact"];

function updateActiveNav() {
  const scrollPos = window.scrollY + 120;
  let current = "";
  sectionIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el && el.offsetTop <= scrollPos) current = id;
  });
  navLinkEls.forEach((link) => {
    const href = link.getAttribute("href")?.slice(1);
    link.classList.toggle("active", href === current);
  });
}

window.addEventListener("scroll", updateActiveNav, { passive: true });
updateActiveNav();

// Section reveal
const sections = document.querySelectorAll("section");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
);

sections.forEach((section) => {
  section.classList.add("reveal-ready");
  revealObserver.observe(section);
});

// Form
const form = document.getElementById("contact-form");
const confirmationMessage = document.getElementById("confirmation-message");

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const privacyCheckbox = document.getElementById("privacy-agreement");
  if (!privacyCheckbox?.checked) {
    alert("עליך להסכים למדיניות הפרטיות כדי לשלוח את הטופס");
    privacyCheckbox?.focus();
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
      if (confirmationMessage) confirmationMessage.style.display = "block";
      setTimeout(() => {
        if (confirmationMessage) confirmationMessage.style.display = "none";
      }, 5000);
    } else {
      alert("אירעה תקלה בשליחת הטופס. אנא נסה שנית.");
    }
  } catch {
    alert("אירעה שגיאה. אנא בדוק את חיבור האינטרנט שלך ונסה שוב.");
  }
});

// Mobile menu
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle?.addEventListener("click", () => {
  const isActive = navLinks.classList.toggle("active");
  menuToggle.setAttribute("aria-expanded", String(isActive));
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".nav-container")) {
    navLinks?.classList.remove("active");
    menuToggle?.setAttribute("aria-expanded", "false");
  }
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks?.classList.remove("active");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

// Confetti
function createConfetti() {
  const colors = ["#22d3ee", "#34d399", "#fbbf24"];
  for (let i = 0; i < 60; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animation = `confetti-fall ${2 + Math.random() * 2}s ease-out forwards`;
    confetti.style.animationDelay = `${Math.random() * 0.3}s`;
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 3500);
  }
}

// Privacy lightbox
function initializePrivacyLightbox() {
  const privacyLink = document.getElementById("privacy-link");
  const privacyLightbox = document.getElementById("privacyLightbox");
  const privacyLightboxClose = document.getElementById("privacyLightboxClose");

  privacyLink?.addEventListener("click", (e) => {
    e.preventDefault();
    privacyLightbox?.classList.add("active");
    privacyLightbox?.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  });

  privacyLightboxClose?.addEventListener("click", closePrivacyLightbox);
  privacyLightbox?.addEventListener("click", (e) => {
    if (e.target === privacyLightbox) closePrivacyLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && privacyLightbox?.classList.contains("active")) {
      closePrivacyLightbox();
    }
  });
}

function closePrivacyLightbox() {
  const privacyLightbox = document.getElementById("privacyLightbox");
  privacyLightbox?.classList.remove("active");
  privacyLightbox?.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

// Lightbox
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxDesc = document.getElementById("lightboxDesc");
const lightboxTags = document.getElementById("lightboxTags");
const lightboxLink = document.getElementById("lightboxLink");
const lightboxClose = document.getElementById("lightboxClose");

function openLightboxFromItem(item) {
  const img = item.querySelector("img");
  if (lightboxImg) {
    lightboxImg.src = img?.src || "";
    lightboxImg.alt = img?.alt || "תצוגת פרויקט";
  }
  if (lightboxTitle)
    lightboxTitle.textContent =
      item.getAttribute("data-title") || img?.alt || "פרויקט";

  const explicitDesc = item.getAttribute("data-description") || "";
  if (lightboxDesc) {
    lightboxDesc.textContent = explicitDesc
      ? explicitDesc
      : generateAutoDescription(
          img?.alt || "",
          item.getAttribute("data-tags") || "",
        );
  }

  if (lightboxTags) {
    lightboxTags.innerHTML = "";
    const tagsStr = item.getAttribute("data-tags") || "";
    tagsStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .forEach((tag) => {
        const chip = document.createElement("span");
        chip.className = "tag-chip";
        chip.textContent = tag;
        lightboxTags.appendChild(chip);
      });
  }

  const link = item.getAttribute("data-link");
  if (lightboxLink) {
    if (link) {
      lightboxLink.href = link;
      lightboxLink.style.display = "inline-flex";
    } else {
      lightboxLink.style.display = "none";
    }
  }

  lightbox?.classList.add("active");
  lightbox?.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function generateAutoDescription(altText, tagsStr) {
  const normalized = (altText || "").trim();
  const tags = (tagsStr || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const tagsSentence = tags.length ? ` טכנולוגיות: ${tags.join(", ")}.` : "";
  if (normalized.includes("לוגו"))
    return `עיצוב לוגו ממותג עם קו נקי ופלטת צבעים עקבית.${tagsSentence}`;
  if (normalized.includes("כרטיס ביקור"))
    return `כרטיס ביקור עם היררכיית מידע ברורה והתאמה לדפוס ורשת.${tagsSentence}`;
  if (normalized.includes("פוסטר"))
    return `פוסטר שיווקי עם קומפוזיציה בולטת וניגודיות צבעים.${tagsSentence}`;
  if (normalized.includes("אתר"))
    return `ממשק אתר רספונסיבי עם דגש על UX נקי ונגישות.${tagsSentence}`;
  return `${normalized || "פרויקט עיצוב"} עם דגש על קריאות ואחידות מותג.${tagsSentence}`;
}

function closeLightbox() {
  lightbox?.classList.remove("active");
  lightbox?.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.querySelectorAll(".gallery-item").forEach((item) => {
  item.addEventListener("click", () => openLightboxFromItem(item));
});

lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && lightbox?.classList.contains("active"))
    closeLightbox();
});

// Stats counter
function animateCounter(element, target, duration = 1800) {
  const increment = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target >= 50 ? target + "+" : String(target);
      clearInterval(timer);
    } else {
      element.textContent =
        target >= 50 ? Math.floor(current) + "+" : String(Math.floor(current));
    }
  }, 16);
}

const statsSection = document.querySelector(".stats-section");
if (statsSection) {
  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll(".stat-number").forEach((stat) => {
          const target = parseInt(stat.getAttribute("data-target"), 10);
          if (target && stat.textContent.trim().startsWith("0")) {
            animateCounter(stat, target);
          }
        });
        statsObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.4 },
  );
  statsObserver.observe(statsSection);
}

// FAQ — grid 0fr/1fr (אנימציה חלקה, בלי max-height)
function initializeFAQ() {
  document.querySelectorAll(".faq-answer").forEach((answer) => {
    if (answer.querySelector(".faq-answer-inner")) return;
    const inner = document.createElement("div");
    inner.className = "faq-answer-inner";
    while (answer.firstChild) {
      inner.appendChild(answer.firstChild);
    }
    answer.appendChild(inner);
  });

  document.querySelectorAll(".faq-item").forEach((item) => {
    const question = item.querySelector(".faq-question");
    if (!question) return;

    question.setAttribute("aria-expanded", "false");

    question.addEventListener("click", (e) => {
      e.preventDefault();
      const isOpen = item.classList.contains("is-open");

      if (isOpen) {
        item.classList.remove("is-open");
        question.setAttribute("aria-expanded", "false");
        item.removeAttribute("data-expanded");
      } else {
        item.classList.add("is-open");
        question.setAttribute("aria-expanded", "true");
        item.setAttribute("data-expanded", "true");
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  accessibilitySettings = getAccessibilitySettings();
  applyAccessibilitySettings(accessibilitySettings);
  initializeAccessibilityPanel();
  initializeCookieConsent();
  initializePrivacyLightbox();
  initializeFAQ();
});
