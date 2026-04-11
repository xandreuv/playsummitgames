document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("[data-section]");
  const stops = document.querySelectorAll(".altitude-stop");

  function updateActiveStop() {
    if (!sections.length || !stops.length) return;

    let activeId = sections[0].id;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.42) {
        activeId = section.id;
      }
    });

    stops.forEach((stop) => {
      stop.classList.toggle("active", stop.dataset.target === activeId);
    });
  }

  updateActiveStop();
  window.addEventListener("scroll", updateActiveStop);
  window.addEventListener("resize", updateActiveStop);
});
