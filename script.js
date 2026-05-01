document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("[data-section]");
  const stops = document.querySelectorAll(".altitude-stop");
  const currentAltitude = document.querySelector(".altitude-current-value");
  const rulerFill = document.querySelector(".ruler-fill");
  const metaDescription = document.querySelector('meta[name="description"]');
  const pageKey = document.body.dataset.page;
  const htmlEl = document.documentElement;
  const switchButtons = document.querySelectorAll(".lang-switch-button");
  const translations = window.PSG_TRANSLATIONS || {};
  const panoramaScroll = document.getElementById("summitPanoramaScroll");
  const seccion5 = document.querySelector('.seccion-5');

  if (seccion5) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        seccion5.classList.add('visible');
      }
    });
  }, { threshold: 0.3 });

  observer.observe(seccion5);
}

  
  function updateActiveStop() {
    if (!sections.length || !stops.length) return;

    let activeId = sections[0].id;
    let activeIndex = 0;
    let activeMeter = "ALT 0 m";

    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.42) {
        activeId = section.id;
        activeIndex = index;
      }
    });

    stops.forEach((stop) => {
      const isActive = stop.dataset.target === activeId;
      stop.classList.toggle("active", isActive);

      if (isActive) {
        const meterEl = stop.querySelector(".altitude-stop-meter");
        if (meterEl) {
          activeMeter = `ALT ${meterEl.textContent.trim()}`;
        }
      }
    });

    if (currentAltitude) {
      currentAltitude.textContent = activeMeter;
    }

    if (rulerFill) {
      const totalSections = Math.max(sections.length - 1, 1);
      const progressRatio = activeIndex / totalSections;
      const maxFillHeight = 248;
      const minFillHeight = 14;
      const fillHeight = minFillHeight + (maxFillHeight - minFillHeight) * progressRatio;
      rulerFill.style.height = `${fillHeight}px`;
    }
  }

  function getLanguage() {
    const saved = localStorage.getItem("psg-language");
    return saved === "cat" ? "cat" : "es";
  }

  function applyTranslations(lang) {
    const pageTranslations = translations[pageKey];
    if (!pageTranslations || !pageTranslations[lang]) return;

    const current = pageTranslations[lang];
    const strings = current.strings || {};

    document.title = current.title;

    if (metaDescription) {
      metaDescription.setAttribute("content", current.description);
    }

    htmlEl.setAttribute("lang", lang === "cat" ? "ca" : "es");

    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.dataset.i18n;
      if (strings[key] !== undefined) {
        element.textContent = strings[key];
      }
    });

    document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
      const key = element.dataset.i18nAria;
      if (strings[key] !== undefined) {
        element.setAttribute("aria-label", strings[key]);
      }
    });

    switchButtons.forEach((button) => {
      const isActive = button.dataset.lang === lang;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  function setLanguage(lang) {
    const normalized = lang === "cat" ? "cat" : "es";
    localStorage.setItem("psg-language", normalized);
    applyTranslations(normalized);
  }

  function revealOnScroll() {
  const revealTargets = document.querySelectorAll(
    ".premium-card, .step-card, .metric-card"
  );

    if (!revealTargets.length) return;

    revealTargets.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const inView = rect.top <= window.innerHeight * 0.88;

      if (inView) {
        element.classList.add("is-visible");
      }
    });
  }

  function initLanguageSwitch() {
    if (!switchButtons.length) return;

    switchButtons.forEach((button) => {
      button.addEventListener("click", () => {
        setLanguage(button.dataset.lang);
      });
    });

    applyTranslations(getLanguage());
  }

  function initPanoramaScroll() {
    if (!panoramaScroll) return;

    let isPointerDown = false;
    let startX = 0;
    let startScrollLeft = 0;

    panoramaScroll.addEventListener(
      "wheel",
      (event) => {
        const hasHorizontalOverflow =
          panoramaScroll.scrollWidth > panoramaScroll.clientWidth;

        if (!hasHorizontalOverflow) return;

        if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
          event.preventDefault();
          panoramaScroll.scrollLeft += event.deltaY;
        }
      },
      { passive: false }
    );

    panoramaScroll.addEventListener("mousedown", (event) => {
      isPointerDown = true;
      panoramaScroll.classList.add("is-dragging");
      startX = event.pageX - panoramaScroll.offsetLeft;
      startScrollLeft = panoramaScroll.scrollLeft;
    });

    window.addEventListener("mouseup", () => {
      isPointerDown = false;
      panoramaScroll.classList.remove("is-dragging");
    });

    panoramaScroll.addEventListener("mouseleave", () => {
      isPointerDown = false;
      panoramaScroll.classList.remove("is-dragging");
    });

    panoramaScroll.addEventListener("mousemove", (event) => {
      if (!isPointerDown) return;
      event.preventDefault();
      const x = event.pageX - panoramaScroll.offsetLeft;
      const walk = (x - startX) * 1.15;
      panoramaScroll.scrollLeft = startScrollLeft - walk;
    });

    panoramaScroll.addEventListener("touchstart", () => {
      panoramaScroll.classList.remove("is-dragging");
    }, { passive: true });
  }

  function onScrollOrResize() {
    updateActiveStop();
    revealOnScroll();
  }

  initLanguageSwitch();
  initPanoramaScroll();
  updateActiveStop();
  revealOnScroll();

  window.addEventListener("scroll", onScrollOrResize);
  window.addEventListener("resize", onScrollOrResize);
});
