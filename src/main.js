import "./styles/fontello.css";
import "./styles/main.css";

// Third-party bundles
import "./scripts/main.js";

const loadDeferredBundles = () => {
  import("./scripts/imports.js");
  import("./scripts/swiper.js");
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
