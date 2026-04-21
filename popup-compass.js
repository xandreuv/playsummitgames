document.addEventListener("DOMContentLoaded", () => {
  const headerCompass = document.querySelector(".header-compass .compass-ring");
  const sections = Array.from(document.querySelectorAll("[data-section]"));
  const stops = Array.from(document.querySelectorAll(".altitude-stop"));

  if (!headerCompass || !sections.length || !stops.length) return;

  const STORAGE_KEY = "psg-popup-compass-state";
  const DEFAULT_STATE = {
    left: 24,
    top: 148,
    width: 240,
    height: 320,
    collapsed: false,
    closed: false
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
        <button type="button" class="floating-compass-popup__button floating-compass-popup__button--close" data-action="close" aria-label="Cerrar brújula">×</button>
      </div>
    </div>

    <div class="floating-compass-popup__body">
      <div class="floating-compass-popup__meta">
        <span class="floating-compass-popup__alt">ALT 0 m</span>
      </div>

      <div class="floating-compass-popup__compass-wrap"></div>

      <div class="floating-compass-popup__hint">
        Arrastra la ventana, cambia su tamaño desde la esquina inferior derecha o ciérrala con ×.
      </div>
    </div>
  `;

  document.body.appendChild(popup);

  const popupBody = popup.querySelector(".floating-compass-popup__body");
  const popupAlt = popup.querySelector(".floating-compass-popup__alt");
  const popupCompassWrap = popup.querySelector(".floating-compass-popup__compass-wrap");
  const toggleButton = popup.querySelector('[data-action="toggle"]');
  const resetButton = popup.querySelector('[data-action="reset"]');
  const closeButton = popup.querySelector('[data-action="close"]');

  const clonedCompass = headerCompass.cloneNode(true);
  const popupNeedleWrap = clonedCompass.querySelector("#compassNeedleWrap");

  if (popupNeedleWrap) {
    popupNeedleWrap.id = "popupCompassNeedleWrap";
  }

  popupCompassWrap.appendChild(clonedCompass);

  applyState(savedState);
  updateCollapsedState(savedState.collapsed);

  if (savedState.closed) {
    popup.style.display = "none";
  }

  updateCompassFromScroll();
  bindDragging();
  bindResizingPersistence();

  toggleButton.addEventListener("click", () => {
    const nextCollapsed = !popup.classList.contains("is-collapsed");
    updateCollapsedState(nextCollapsed);
    persistState();
  });

  resetButton.addEventListener("click", () => {
    popup.style.display = "";
    applyState({ ...DEFAULT_STATE, closed: false });
    updateCollapsedState(false);
    persistState();
  });

  closeButton.addEventListener("click", () => {
    popup.style.display = "none";
    persistState(true);
  });

  window.addEventListener("scroll", updateCompassFromScroll, { passive: true });
  window.addEventListener("resize", () => {
    keepPopupInViewport();
    updateCompassScale();
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

  function updateCompassScale() {
    if (!clonedCompass || popup.classList.contains("is-collapsed")) return;

    const bodyStyles = window.getComputedStyle(popupBody);
    const wrapStyles = window.getComputedStyle(popupCompassWrap);

    const availableWidth =
      popup.clientWidth -
      parseFloat(bodyStyles.paddingLeft) -
      parseFloat(bodyStyles.paddingRight) -
      parseFloat(wrapStyles.paddingLeft || 0) -
      parseFloat(wrapStyles.paddingRight || 0);

    const metaHeight = popup.querySelector(".floating-compass-popup__meta")?.offsetHeight || 0;
    const hintHeight = popup.querySelector(".floating-compass-popup__hint")?.offsetHeight || 0;
    const gap = 24;
    const availableHeight =
      popup.clientHeight -
      popup.querySelector(".floating-compass-popup__header").offsetHeight -
      parseFloat(bodyStyles.paddingTop) -
      parseFloat(bodyStyles.paddingBottom) -
      metaHeight -
      hintHeight -
      gap;

    const size = Math.max(120, Math.min(availableWidth, availableHeight, 320));

    clonedCompass.style.width = `${size}px`;
    clonedCompass.style.height = `${size}px`;
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
      if (popup.style.display === "none") return;

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
      if (popup.style.display === "none") return;

      if (resizeFrame) cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        keepPopupInViewport();
        updateCompassScale();
        persistState();
      });
    });

    observer.observe(popup);
  }

  function applyState(state) {
    const maxWidth = Math.max(180, Math.min(460, window.innerWidth - 16));
    const maxHeight = Math.max(220, Math.min(560, window.innerHeight - 16));

    const nextWidth = clamp(state.width, 200, maxWidth);
    const nextHeight = clamp(state.height, 250, maxHeight);

    popup.style.width = `${nextWidth}px`;
    popup.style.height = `${nextHeight}px`;
    setPosition(state.left, state.top);
    updateCompassScale();
  }

  function updateCollapsedState(collapsed) {
    popup.classList.toggle("is-collapsed", collapsed);
    toggleButton.textContent = collapsed ? "+" : "−";
    toggleButton.setAttribute("aria-label", collapsed ? "Mostrar brújula" : "Ocultar brújula");
    popupBody.hidden = collapsed;

    if (!collapsed) {
      updateCompassScale();
    }
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

  function persistState(forceClosed = null) {
    const state = {
      left: popup.offsetLeft || DEFAULT_STATE.left,
      top: popup.offsetTop || DEFAULT_STATE.top,
      width: popup.offsetWidth || DEFAULT_STATE.width,
      height: popup.offsetHeight || DEFAULT_STATE.height,
      collapsed: popup.classList.contains("is-collapsed"),
      closed: forceClosed !== null ? forceClosed : popup.style.display === "none"
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
        width: 240px;
        height: 320px;
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
        min-width: 200px;
        min-height: 250px;
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
        flex: 0 0 auto;
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
        flex: 0 0 auto;
      }

      .floating-compass-popup__button:hover {
        background: rgba(255,255,255,0.14);
      }

      .floating-compass-popup__button--close {
        background: rgba(143, 35, 35, 0.32);
        border-color: rgba(255,255,255,0.18);
      }

      .floating-compass-popup__button--close:hover {
        background: rgba(143, 35, 35, 0.52);
      }

      .floating-compass-popup__body {
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        gap: 12px;
        padding: 12px 14px 16px;
        min-height: 0;
      }

      .floating-compass-popup__meta {
        width: 100%;
        display: flex;
        justify-content: center;
        flex: 0 0 auto;
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
        flex: 1 1 auto;
        width: 100%;
        min-height: 120px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }

      .floating-compass-popup__compass-wrap .compass-ring {
        position: relative;
        flex: 0 0 auto;
        transform-origin: center center;
      }

      .floating-compass-popup__hint {
        font-size: 0.72rem;
        line-height: 1.35;
        text-align: center;
        color: rgba(255,255,255,0.72);
        flex: 0 0 auto;
      }

      .floating-compass-popup.is-collapsed {
        width: 200px !important;
        height: auto !important;
        min-height: 0;
        resize: none;
      }

      .floating-compass-popup.is-collapsed .floating-compass-popup__header {
        border-bottom: 0;
      }

      @media (max-width: 860px) {
        .floating-compass-popup {
          left: 12px;
          top: 12px;
          width: 210px;
          height: 280px;
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
