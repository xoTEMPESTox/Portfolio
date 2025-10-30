import "./styles/fontello.css";
import "./styles/main.css";

// Third-party bundles
import "./scripts/main.js";

const loadDeferredBundles = () => {
  import("./scripts/imports.js");
  import("./scripts/swiper.js");
};

const initFloatingSocials = () => {
  if (typeof document === "undefined") {
    return;
  }

  const navList = document.getElementById("list");
  const socialsBar = document.getElementById("socials");
  const socialsToggle = document.getElementById("item-socials");

  if (!navList || !socialsBar || !socialsToggle) {
    return;
  }

  const hideSocials = () => {
    socialsBar.classList.remove("socials--ready");
  };

  const showSocials = () => {
    socialsBar.classList.add("socials--ready");
  };

  hideSocials();

  navList.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target.closest(".list-item") : null;

    if (!target) {
      return;
    }

    if (target.id === "item-socials") {
      showSocials();
      return;
    }

    hideSocials();
  });
};

const initHomeRoleTyper = () => {
  if (typeof document === "undefined" || typeof window === "undefined") {
    return;
  }

  const container = document.querySelector(".home__info__desc[data-roles]");

  if (!container) {
    return;
  }

  if ("matchMedia" in window && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const parseRoles = () => {
    const rawRoles = container.getAttribute("data-roles");

    if (!rawRoles) {
      return [];
    }

    try {
      const parsed = JSON.parse(rawRoles);
      if (Array.isArray(parsed)) {
        return parsed.map((role) => String(role).trim()).filter(Boolean);
      }
    } catch (error) {
      const fallbackRoles = rawRoles.split("|").map((role) => role.trim()).filter(Boolean);
      if (fallbackRoles.length > 0) {
        return fallbackRoles;
      }
    }

    return [];
  };

  const roles = parseRoles();

  if (roles.length === 0) {
    return;
  }

  const fallback = container.querySelector(".typed-text__fallback");
  const wrapper = document.createElement("span");
  wrapper.className = "typed-text__wrapper";

  const content = document.createElement("span");
  content.className = "typed-text__content";
  content.textContent = "";

  const cursor = document.createElement("span");
  cursor.className = "typed-text__cursor";
  cursor.setAttribute("aria-hidden", "true");

  wrapper.appendChild(content);
  wrapper.appendChild(cursor);

  const insertionPoint = fallback ?? null;
  container.insertBefore(wrapper, insertionPoint);

  if (fallback) {
    fallback.setAttribute("aria-hidden", "true");
  }

  container.classList.add("typed-text--ready");
  container.setAttribute("aria-live", "polite");

  let roleIndex = 0;
  let charIndex = 0;
  let typingTimeoutId = 0;
  let eraseFrameId = 0;
  let expandFallbackTimeoutId = 0;
  let expandListener = null;
  let eraseStarted = false;
  let isActive = true;

  const typeSpeed = 80; // higher is Slower
  const holdDelay = 1800;
  const transitionDelay = 420;
  const expandDuration = 520;
  const eraseDuration = 300;
  const widthBuffer = 0;

  const computedCursor = window.getComputedStyle(cursor);
  const baseCursorWidth = Number.parseFloat(computedCursor.width) || 10;
  const cursorTransition =
    "width 0.48s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease";

  cursor.style.width = `${baseCursorWidth}px`;
  cursor.style.transition = cursorTransition;

  const schedule = (callback, delay) => {
    typingTimeoutId = window.setTimeout(() => {
      typingTimeoutId = 0;
      callback();
    }, delay);
  };

  const ensureActive = () => isActive;

  const clearAnimationFrame = () => {
    if (eraseFrameId) {
      window.cancelAnimationFrame(eraseFrameId);
      eraseFrameId = 0;
    }
  };

  const clearExpandListener = () => {
    if (expandListener) {
      cursor.removeEventListener("transitionend", expandListener);
      expandListener = null;
    }
    if (expandFallbackTimeoutId) {
      window.clearTimeout(expandFallbackTimeoutId);
      expandFallbackTimeoutId = 0;
    }
  };

  const jumpCursorToBase = () => {
    const previousTransition = cursor.style.transition;
    cursor.style.transition = "none";
    cursor.style.width = `${baseCursorWidth}px`;
    void cursor.offsetWidth;
    const restoredTransition =
      previousTransition && previousTransition !== "none"
        ? previousTransition
        : cursorTransition;
    cursor.style.transition = restoredTransition;
  };

  const easeInOutCubic = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const finishErase = () => {
    if (!ensureActive()) {
      return;
    }

    clearAnimationFrame();
    container.classList.remove("typed-text--deleting");
    content.textContent = "";
    charIndex = 0;
    roleIndex = (roleIndex + 1) % roles.length;
    eraseStarted = false;

    jumpCursorToBase();
    schedule(typeNextChar, transitionDelay);
  };

  const startErase = (expandedWidth) => {
    if (!ensureActive()) {
      return;
    }

    const currentRole = roles[roleIndex];

    if (!currentRole) {
      finishErase();
      return;
    }

    container.classList.remove("typed-text--expanding");
    container.classList.add("typed-text--deleting");

    clearAnimationFrame();
    cursor.style.transition = "none";

    const initialLength = currentRole.length;
    const startTime = window.performance.now();
    let lastRenderedLength = charIndex;

    const animateErase = (timestamp) => {
      if (!ensureActive()) {
        return;
      }

      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / eraseDuration, 1);
      const eased = easeInOutCubic(progress);
      const targetLength = Math.max(
        Math.round(initialLength * (1 - eased)),
        0
      );

      if (targetLength !== lastRenderedLength) {
        charIndex = targetLength;
        content.textContent = currentRole.slice(0, charIndex);
        lastRenderedLength = targetLength;
      }

      const nextWidth =
        baseCursorWidth + (expandedWidth - baseCursorWidth) * (1 - eased);
      cursor.style.width = `${nextWidth}px`;

      if (progress < 1) {
        eraseFrameId = window.requestAnimationFrame(animateErase);
        return;
      }

      cursor.style.transition = cursorTransition;
      finishErase();
    };

    eraseFrameId = window.requestAnimationFrame(animateErase);
  };

  const launchErase = (expandedWidth) => {
    if (!ensureActive() || eraseStarted) {
      return;
    }

    eraseStarted = true;
    clearExpandListener();
    startErase(expandedWidth);
  };

  const startExpand = () => {
    if (!ensureActive()) {
      return;
    }

    const currentRole = roles[roleIndex];

    if (!currentRole) {
      return;
    }

    const measuredWidth = Math.ceil(content.getBoundingClientRect().width);
    const expandedWidth = Math.max(measuredWidth + widthBuffer, baseCursorWidth);

    container.classList.add("typed-text--expanding");
    cursor.style.transition = cursorTransition;
    cursor.style.width = `${expandedWidth}px`;

    expandListener = (event) => {
      if (event.propertyName !== "width") {
        return;
      }
      launchErase(expandedWidth);
    };

    cursor.addEventListener("transitionend", expandListener, { once: true });

    expandFallbackTimeoutId = window.setTimeout(
      () => launchErase(expandedWidth),
      expandDuration + 60
    );
  };

  function typeNextChar() {
    if (!ensureActive()) {
      return;
    }

    const currentRole = roles[roleIndex];

    if (!currentRole) {
      return;
    }

    container.classList.remove("typed-text--expanding", "typed-text--deleting");

    if (charIndex === 0) {
      jumpCursorToBase();
      content.textContent = "";
    }

    if (charIndex < currentRole.length) {
      charIndex += 1;
      content.textContent = currentRole.slice(0, charIndex);
      schedule(typeNextChar, typeSpeed);
      return;
    }

    schedule(startExpand, holdDelay);
  }

  schedule(typeNextChar, transitionDelay);

  const cancelTyping = () => {
    if (!isActive) {
      return;
    }

    isActive = false;

    if (typingTimeoutId) {
      window.clearTimeout(typingTimeoutId);
      typingTimeoutId = 0;
    }

    clearAnimationFrame();
    clearExpandListener();

    container.classList.remove("typed-text--expanding", "typed-text--deleting");
    cursor.style.transition = "none";
    cursor.style.width = "";
  };

  window.addEventListener("pagehide", cancelTyping, { once: true });
  window.addEventListener("beforeunload", cancelTyping, { once: true });
};

const scheduleDeferredBundles = () => {
  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    window.requestIdleCallback(loadDeferredBundles, { timeout: 2000 });
    return;
  }
  if (typeof window !== "undefined") {
    window.setTimeout(loadDeferredBundles, 600);
    return;
  }
  loadDeferredBundles();
};

if (typeof document !== "undefined" && document.readyState === "complete") {
  scheduleDeferredBundles();
} else if (typeof window !== "undefined") {
    window.addEventListener("load", scheduleDeferredBundles, { once: true });
} else {
  scheduleDeferredBundles();
}

const runOnDomReady = (callback) => {
  if (typeof document === "undefined") {
    return;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback, { once: true });
    return;
  }

  callback();
};

runOnDomReady(initFloatingSocials);
runOnDomReady(initHomeRoleTyper);
