document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("[data-section]");
  const stops = document.querySelectorAll(".altitude-stop");
  const currentAltitude = document.querySelector(".altitude-current .altitude-stop-meter");

  function updateActiveStop() {
    if (!sections.length || !stops.length) return;

    let activeId = sections[0].id;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.42) {
        activeId = section.id;
      }
    });

    let activeMeter = null;

    stops.forEach((stop) => {
      const isActive = stop.dataset.target === activeId;
      stop.classList.toggle("active", isActive);

      if (isActive) {
        const meterEl = stop.querySelector(".altitude-stop-meter");
        if (meterEl) {
          activeMeter = meterEl.textContent.trim();
        }
      }
    });

    if (currentAltitude && activeMeter) {
      currentAltitude.textContent = activeMeter;
    }
  }

  updateActiveStop();
  window.addEventListener("scroll", updateActiveStop);
  window.addEventListener("resize", updateActiveStop);
});
