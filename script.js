document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("[data-section]");
  const stops = document.querySelectorAll(".altitude-stop");
  const currentAltitude = document.querySelector(".altitude-current-value");
  const rulerFill = document.querySelector(".ruler-fill");
  const compassNeedleWrap = document.getElementById("compassNeedleWrap");
  const metaDescription = document.querySelector('meta[name="description"]');
  const pageKey = document.body.dataset.page;
  const htmlEl = document.documentElement;
  const switchButtons = document.querySelectorAll(".lang-switch-button");
  const translations = window.PSG_TRANSLATIONS || {};

  function updateActiveStop() {
    if (!sections.length || !stops.length) return;

    let activeId = sections[0].id;
    let activeIndex = 0;
    let activeMeter = "ALT 0 m";
    let activeBearing = 0;

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

        const bearing = parseFloat(stop.dataset.bearing || "0");
        activeBearing = Number.isFinite(bearing) ? bearing : 0;
      }
    });

    if (currentAltitude) {
      currentAltitude.textContent = activeMeter;
    }

   if (rulerFill) {
  const totalSections = Math.max(sections.length - 1, 1);
  const progressRatio = activeIndex / totalSections;
  const isMobileProgress = window.innerWidth <= 860;

  if (isMobileProgress) {
    const minFillWidth = 18;
    const maxFillWidth = 220;
    const fillWidth = minFillWidth + (maxFillWidth - minFillWidth) * progressRatio;

    rulerFill.style.height = `4px`;
    rulerFill.style.width = `${fillWidth}px`;
  } else {
    const maxFillHeight = 248;
    const minFillHeight = 14;
    const fillHeight = minFillHeight + (maxFillHeight - minFillHeight) * progressRatio;

    rulerFill.style.width = `4px`;
    rulerFill.style.height = `${fillHeight}px`;
  }
}

    if (compassNeedleWrap) {
      compassNeedleWrap.style.transform = `rotate(${activeBearing}deg)`;
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

  switchButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setLanguage(button.dataset.lang);
    });
  });

  applyTranslations(getLanguage());
  updateActiveStop();

  window.addEventListener("scroll", updateActiveStop);
  window.addEventListener("resize", updateActiveStop);
});
