const PRELOADER_DISMISS_DELAY = 450;
const PRELOADER_FALLBACK_TIMEOUT = 2000;
let fallbackTimerId = null;
function dismissPreloader() {
    const preloader = document.querySelector(".preloader");
    if (!preloader || preloader.dataset.dismissed === "true") {
        return;
    }
    if (fallbackTimerId !== null) {
        window.clearTimeout(fallbackTimerId);
        fallbackTimerId = null;
    }
    preloader.dataset.dismissed = "true";
    preloader.style.opacity = "0";
    preloader.style.pointerEvents = "none";
    window.setTimeout(() => {
        preloader.style.display = "none";
    }, PRELOADER_DISMISS_DELAY);
}
function schedulePreloaderDismissal() {
    window.requestAnimationFrame(dismissPreloader);
}
function setupFallbackDismissal() {
    if (fallbackTimerId !== null) {
        return;
    }
    fallbackTimerId = window.setTimeout(schedulePreloaderDismissal, PRELOADER_FALLBACK_TIMEOUT);
}
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupFallbackDismissal, { once: true });
}
else {
    setupFallbackDismissal();
}
window.addEventListener("background-placeholder-ready", schedulePreloaderDismissal, { once: true });
window.addEventListener("load", schedulePreloaderDismissal, { once: true });
