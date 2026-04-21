document.addEventListener("DOMContentLoaded", () => {
  const headerCompass = document.querySelector(".header-compass .compass-ring");
  const sections = Array.from(document.querySelectorAll("[data-section]"));
  const stops = Array.from(document.querySelectorAll(".altitude-stop"));

  if (!headerCompass || !sections.length || !stops.length) return;

  const STORAGE_KEY = "psg-popup-compass-state";
  const DEFAULT_STATE = {
    left: 24,
    top: 148,
    width: 220,
    height: 282,
    collapsed: false
  };

  const savedState = loadState();

  injectPopupStyles();

  const popup = document.createElement("div");
  popup.className = "floating-compass-popup";
  popup.innerHTML = `
    <div class="floating-compass-popup__header">
      <div class="floating-compass-popup__title">Brújula</div>
      <div class="floating-compass-popup__actions">
        <button type="button" class="floating-compass-popup__button" data-action="reset" aria-label="Recolocar brújula">↺</button>
        <button type="button" class="floating-compass-popup__button" data-action="toggle" aria-label="Mostrar u ocultar brújula">−</button>
      </div>
    </div>
    <div class="floating-compass-popup__body">
      <div class="floating-compass-popup__meta">
        <span class="floating-compass-popup__alt">ALT 0 m</span>
      </div>
      <div class="floating-compass-popup__compass-wrap"></div>
      <div class="floating-compass-popup__hint">Arrastra la ventana y cambia su tamaño desde la esquina inferior derecha.</div>
    </div>
  `;

  document.body.appendChild(popup);

  const popupBody = popup.querySelector(".floating-compass-popup__body");
  const popupAlt = popup.querySelector(".floating-compass-popup__alt");
  const popupCompassWrap = popup.querySelector(".floating-compass-popup__compass-wrap");
  const toggleButton = popup.querySelector('[data-action="toggle"]');
  const resetButton = popup.querySelector('[data-action="reset"]');

  const clonedCompass = headerCompass.cloneNode(true);
  const popupNeedleWrap = clonedCompass.querySelector("#compassNeedleWrap");
  if (popupNeedleWrap) {
    popupNeedleWrap.id = "popupCompassNeedleWrap";
  }
  popupCompassWrap.appendChild(clonedCompass);

  applyState(savedState);
  updateCollapsedState(savedState.collapsed);
  updateCompassFromScroll();
  bindDragging();
  bindResizingPersistence();

  toggleButton.addEventListener("click", () => {
    const nextCollapsed = !popup.classList.contains("is-collapsed");
    updateCollapsedState(nextCollapsed);
    persistState();
  });

  resetButton.addEventListener("click", () => {
    applyState({ ...DEFAULT_STATE });
    updateCollapsedState(false);
    persistState();
  });

  window.addEventListener("scroll", updateCompassFromScroll, { passive: true });
  window.addEventListener("resize", () => {
    keepPopupInViewport();
    updateCompassFromScroll();
    persistState();
  });

  function updateCompassFromScroll() {
    let activeId = sections[0].id;
    let activeMeter = "ALT 0 m";
    let activeBearing = 0;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.42) {
        activeId = section.id;
      }
    });

    stops.forEach((stop) => {
      if (stop.dataset.target === activeId) {
        const meterEl = stop.querySelector(".altitude-stop-meter");
        if (meterEl) {
          activeMeter = `ALT ${meterEl.textContent.trim()}`;
        }

        const bearing = parseFloat(stop.dataset.bearing || "0");
        activeBearing = Number.isFinite(bearing) ? bearing : 0;
      }
    });

    popupAlt.textContent = activeMeter;

    if (popupNeedleWrap) {
      popupNeedleWrap.style.transform = `rotate(${activeBearing}deg)`;
    }
  }

  function bindDragging() {
    const dragHandle = popup.querySelector(".floating-compass-popup__header");
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;
    let dragging = false;

    const onPointerMove = (event) => {
      if (!dragging) return;
      const nextLeft = startLeft + (event.clientX - startX);
      const nextTop = startTop + (event.clientY - startY);
      setPosition(nextLeft, nextTop);
    };

    const onPointerUp = () => {
      if (!dragging) return;
      dragging = false;
      popup.classList.remove("is-dragging");
      persistState();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    dragHandle.addEventListener("pointerdown", (event) => {
      if (event.target.closest("button")) return;
      dragging = true;
      popup.classList.add("is-dragging");
      startX = event.clientX;
      startY = event.clientY;
      startLeft = popup.offsetLeft;
      startTop = popup.offsetTop;
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
    });
  }

  function bindResizingPersistence() {
    let resizeFrame = null;

    const observer = new ResizeObserver(() => {
      if (resizeFrame) cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        keepPopupInViewport();
        persistState();
      });
    });

    observer.observe(popup);
  }

  function applyState(state) {
    const nextWidth = clamp(state.width, 180, Math.min(420, window.innerWidth - 16));
    const nextHeight = clamp(state.height, 210, Math.min(520, window.innerHeight - 16));

    popup.style.width = `${nextWidth}px`;
    popup.style.height = `${nextHeight}px`;
    setPosition(state.left, state.top);
  }

  function updateCollapsedState(collapsed) {
    popup.classList.toggle("is-collapsed", collapsed);
    toggleButton.textContent = collapsed ? "+" : "−";
    toggleButton.setAttribute("aria-label", collapsed ? "Mostrar brújula" : "Ocultar brújula");
    popupBody.hidden = collapsed;
    persistState();
  }

  function setPosition(left, top) {
    const maxLeft = Math.max(8, window.innerWidth - popup.offsetWidth - 8);
    const maxTop = Math.max(8, window.innerHeight - popup.offsetHeight - 8);
    const safeLeft = clamp(left, 8, maxLeft);
    const safeTop = clamp(top, 8, maxTop);

    popup.style.left = `${safeLeft}px`;
    popup.style.top = `${safeTop}px`;
  }

  function keepPopupInViewport() {
    setPosition(popup.offsetLeft, popup.offsetTop);
  }

  function persistState() {
    const state = {
      left: popup.offsetLeft,
      top: popup.offsetTop,
      width: popup.offsetWidth,
      height: popup.offsetHeight,
      collapsed: popup.classList.contains("is-collapsed")
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      return { ...DEFAULT_STATE, ...(parsed || {}) };
    } catch (error) {
      return { ...DEFAULT_STATE };
    }
  }

  function injectPopupStyles() {
    if (document.getElementById("floatingCompassPopupStyles")) return;

    const style = document.createElement("style");
    style.id = "floatingCompassPopupStyles";
    style.textContent = `
      .floating-compass-popup {
        position: fixed;
        left: 24px;
        top: 148px;
        width: 220px;
        height: 282px;
        z-index: 1400;
        display: flex;
        flex-direction: column;
        resize: both;
        overflow: auto;
        border-radius: 20px;
        border: 1px solid rgba(255,255,255,0.16);
        background: rgba(12, 19, 24, 0.82);
        box-shadow: 0 22px 48px rgba(0, 0, 0, 0.28);
        backdrop-filter: blur(14px);
        color: #ffffff;
        min-width: 180px;
        min-height: 210px;
      }

      .floating-compass-popup.is-dragging {
        user-select: none;
        cursor: grabbing;
      }

      .floating-compass-popup__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 12px 14px 10px;
        border-bottom: 1px solid rgba(255,255,255,0.08);
        cursor: grab;
      }

      .floating-compass-popup__title {
        font-size: 0.8rem;
        font-weight: 900;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }

      .floating-compass-popup__actions {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .floating-compass-popup__button {
        appearance: none;
        border: 1px solid rgba(255,255,255,0.14);
        background: rgba(255,255,255,0.08);
        color: #ffffff;
        width: 28px;
        height: 28px;
        border-radius: 999px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font: inherit;
        font-weight: 900;
        line-height: 1;
      }

      .floating-compass-popup__button:hover {
        background: rgba(255,255,255,0.14);
      }

      .floating-compass-popup__body {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        gap: 12px;
        padding: 12px 14px 16px;
      }

      .floating-compass-popup__meta {
        width: 100%;
        display: flex;
        justify-content: center;
      }

      .floating-compass-popup__alt {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 32px;
        padding: 7px 12px;
        border-radius: 999px;
        background: rgba(255,255,255,0.12);
        border: 1px solid rgba(255,255,255,0.12);
        font-size: 0.82rem;
        font-weight: 900;
        letter-spacing: 0.06em;
      }

      .floating-compass-popup__compass-wrap {
        flex: 1;
        width: 100%;
        min-height: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .floating-compass-popup__compass-wrap .compass-ring {
        width: min(100%, 178px);
        aspect-ratio: 1 / 1;
        height: auto;
      }

      .floating-compass-popup__compass-wrap .compass-outer-ring,
      .floating-compass-popup__compass-wrap .compass-ticks,
      .floating-compass-popup__compass-wrap .compass-spokes,
      .floating-compass-popup__compass-wrap .compass-needle-wrap,
      .floating-compass-popup__compass-wrap .compass-cardinal,
      .floating-compass-popup__compass-wrap .compass-face,
      .floating-compass-popup__compass-wrap .compass-inner-rim {
        inset: auto;
      }

      .floating-compass-popup__compass-wrap .compass-outer-ring { inset: 0; }
      .floating-compass-popup__compass-wrap .compass-ticks { inset: 5px; }
      .floating-compass-popup__compass-wrap .compass-inner-rim { inset: 7px; }
      .floating-compass-popup__compass-wrap .compass-face { inset: 8px; }
      .floating-compass-popup__compass-wrap .compass-spokes,
      .floating-compass-popup__compass-wrap .compass-needle-wrap { inset: 0; }

      .floating-compass-popup__hint {
        font-size: 0.72rem;
        line-height: 1.35;
        text-align: center;
        color: rgba(255,255,255,0.72);
      }

      .floating-compass-popup.is-collapsed {
        width: 200px !important;
        height: auto !important;
        resize: none;
      }

      .floating-compass-popup.is-collapsed .floating-compass-popup__header {
        border-bottom: 0;
      }

      @media (max-width: 860px) {
        .floating-compass-popup {
          left: 12px;
          top: 12px;
          width: 188px;
          height: 244px;
        }

        .floating-compass-popup__hint {
          display: none;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
});
