document.addEventListener('DOMContentLoaded', () => {
  const langButtons = document.querySelectorAll('.lang-btn');
  const translatableElements = document.querySelectorAll('[data-es][data-cat]');
  const altitudeValue = document.getElementById('altitudeValue');
  const sections = document.querySelectorAll('[data-altitude]');

  function setLanguage(lang) {
    document.body.classList.remove('lang-es', 'lang-cat');
    document.body.classList.add(`lang-${lang}`);

    translatableElements.forEach((el) => {
      const text = el.getAttribute(`data-${lang}`);
      if (text) {
        el.textContent = text;
      }
    });

    langButtons.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    localStorage.setItem('psg-language', lang);
  }

  langButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      setLanguage(btn.dataset.lang);
    });
  });

  const savedLang = localStorage.getItem('psg-language') || 'es';
  setLanguage(savedLang);

  function updateAltitudeIndicator() {
    if (!altitudeValue || sections.length === 0) return;

    let currentSection = sections[0];

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.45) {
        currentSection = section;
      }
    });

    const altitude = currentSection.dataset.altitude || '0';
    altitudeValue.textContent = `${altitude} m`;
  }

  updateAltitudeIndicator();
  window.addEventListener('scroll', updateAltitudeIndicator);
  window.addEventListener('resize', updateAltitudeIndicator);
});
