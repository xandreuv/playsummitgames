document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("[data-section]");
  const stops = document.querySelectorAll(".altitude-stop");
  const currentAltitude = document.querySelector(".altitude-current-value");
  const rulerFill = document.querySelector(".ruler-fill");
  const compassNeedleWrap = document.getElementById("compassNeedleWrap");

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
          const rawValue = meterEl.textContent.trim();
          activeMeter = `ALT ${rawValue}`;
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
      const maxFillHeight = 248;
      const minFillHeight = 14;
      const fillHeight = minFillHeight + (maxFillHeight - minFillHeight) * progressRatio;
      rulerFill.style.height = `${fillHeight}px`;
    }

    if (compassNeedleWrap) {
      compassNeedleWrap.style.transform = `rotate(${activeBearing}deg)`;
    }
  }

  updateActiveStop();
  window.addEventListener("scroll", updateActiveStop);
  window.addEventListener("resize", updateActiveStop);
});
