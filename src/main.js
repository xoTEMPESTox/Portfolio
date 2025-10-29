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

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initFloatingSocials, { once: true });
  } else {
    initFloatingSocials();
  }
}
