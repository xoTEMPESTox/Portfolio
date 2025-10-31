"use strict";
const baseUrl = (() => {
    const url = (import.meta.env?.BASE_URL ?? "/");
    return url.endsWith("/") ? url : `${url}/`;
})();
const backgroundImageBasePath = "assets/images/backgrounds";
const backgroundVideoBasePath = "assets/videos/backgrounds";
const videoExtensions = ["mp4", "webm", "ogv", "ogg"];
function withBase(path) {
    if (!path) {
        return baseUrl;
    }
    return `${baseUrl}${path.replace(/^\/+/, "")}`;
}
function sanitizePathValue(value) {
    return typeof value === "string" ? value.trim() : "";
}
function sanitizeBasePath(value) {
    const sanitized = sanitizePathValue(value);
    return sanitized ? sanitized.replace(/\/+$/, "") : "";
}
let cleanupParallax = null;
const parallaxPositionCache = new Map();
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        changeListItems();
        changeBackgroundAfterWhile();
        initSkillBarAnimations();
    });
}
else {
    changeListItems();
    changeBackgroundAfterWhile();
    initSkillBarAnimations();
}
function changeListItems() {
    let home = document.getElementById("home");
    let about = document.getElementById("about");
    let journey = document.getElementById("journey");
    let skills = document.getElementById("skills");
    let services = document.getElementById("services");
    let portfolio = document.getElementById("portfolio");
    let reviews = document.getElementById("reviews");
    let contact = document.getElementById("contact");
    const icons = document.querySelectorAll("#icon-div div");
    function removeDegrees() {
        icons.forEach((el) => {
            el.className = el.className.replace(/deg-\d+/gi, "");
        });
    }
    function removeFullScreenFromAllSections() {
        document.querySelectorAll("section").forEach((sec) => {
            sec.classList.remove("full-screen-left", "full-screen-right");
        });
    }
    function setAnimationServiceSection() {
        icons.forEach((div, index) => {
            if (index === 0) {
                div.classList.add("deg-45");
            }
            else if (index === 1) {
                div.classList.add("deg-90");
            }
            else if (index === 2) {
                div.classList.add("deg-135");
            }
            else if (index === 3) {
                div.classList.add("deg-180");
            }
            else if (index === 4) {
                div.classList.add("deg-230");
            }
            else if (index === 5) {
                div.classList.add("deg-270");
            }
        });
    }
    Array.from(document.querySelectorAll(".main .list li")).forEach((li) => {
        li.addEventListener("click", () => {
            removeFullScreenFromAllSections();
            removeDegrees();
            if (li.getAttribute("id") === "item-home") {
                home.classList.add("full-screen-left");
            }
            else if (li.getAttribute("id") === "item-about") {
                about.classList.add("full-screen-right");
            }
            else if (li.getAttribute("id") === "item-journey") {
                journey.classList.add("full-screen-left");
            }
            else if (li.getAttribute("id") === "item-skills") {
                skills.classList.add("full-screen-right");
            }
            else if (li.getAttribute("id") === "item-services") {
                setAnimationServiceSection();
                services.classList.add("full-screen-left");
            }
            else if (li.getAttribute("id") === "item-portfolio") {
                portfolio.classList.add("full-screen-right");
            }
            else if (li.getAttribute("id") === "item-reviews") {
                reviews.classList.add("full-screen-left");
            }
            else if (li.getAttribute("id") === "item-contact") {
                contact.classList.add("full-screen-right");
            }
        });
    });
    function readMoreHome() {
        const btnHome = document.getElementById("read-more-home");
        const aboutNavItem = document.getElementById("item-about");
        if (!btnHome || !aboutNavItem) {
            return;
        }
        btnHome.addEventListener("click", (event) => {
            event.preventDefault();
            aboutNavItem.click();
        });
    }
    readMoreHome();
}
function initSkillBarAnimations() {
    if (typeof document === "undefined") {
        return;
    }
    const skillsSection = document.getElementById("skills");
    if (!skillsSection) {
        return;
    }
    const items = [];
    skillsSection.querySelectorAll(".skills__box").forEach((box) => {
        const rateElement = box.querySelector(".skills__box__head__rate");
        const barElement = box.querySelector(".skills__box__line span");
        if (!rateElement || !barElement) {
            return;
        }
        const rateText = (rateElement.textContent || "").trim();
        const match = rateText.match(/(\d+(?:\.\d+)?)/);
        if (!match) {
            return;
        }
        const parsed = parseFloat(match[1]);
        if (Number.isNaN(parsed)) {
            return;
        }
        const clampedRate = Math.min(100, Math.max(0, parsed));
        items.push({ box, bar: barElement, rate: clampedRate });
    });
    if (!items.length) {
        return;
    }
    const supportsWindow = typeof window !== "undefined";
    let prefersReducedMotion = false;
    if (supportsWindow && typeof window.matchMedia === "function") {
        prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    if (supportsWindow) {
        items.forEach(({ box }) => {
            const removeTouch = () => {
                box.classList.remove("is-touch");
            };
            box.addEventListener("touchstart", () => {
                box.classList.add("is-touch");
            }, { passive: true });
            box.addEventListener("touchend", removeTouch);
            box.addEventListener("touchcancel", removeTouch);
        });
    }
    if (!supportsWindow || prefersReducedMotion) {
        items.forEach(({ bar, rate }) => {
            bar.style.transition = "none";
            bar.style.width = `${rate}%`;
        });
        return;
    }
    items.forEach(({ bar }) => {
        bar.style.width = "0";
    });
    let hasAnimated = false;
    const schedule = typeof window.requestAnimationFrame === "function"
        ? window.requestAnimationFrame.bind(window)
        : (callback) => window.setTimeout(callback, 0);
    const animate = () => {
        if (hasAnimated) {
            return;
        }
        hasAnimated = true;
        schedule(() => {
            items.forEach(({ bar, rate }) => {
                bar.style.width = `${rate}%`;
            });
        });
    };
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
                animate();
                observer.disconnect();
            }
        }, { threshold: 0.35 });
        observer.observe(skillsSection);
    }
    else {
        animate();
    }
}
function changeBackgroundAfterWhile() {
    const main = document.getElementById("main");
    if (!main) {
        return;
    }
    const manifestUrl = withBase("assets/images/backgrounds/backgrounds.json");
    const storageKey = "portfolio:lastBackground";
    const storedBackgroundRaw = getStoredBackground(storageKey);
    const storedBackground = parseStoredBackground(storedBackgroundRaw);
    if (storedBackground) {
        applyStoredBackgroundPlaceholder(main, storedBackground);
    }
    fetch(manifestUrl)
        .then((response) => {
        if (!response.ok) {
            throw new Error(`Unable to load background manifest: ${response.status}`);
        }
        return response.json();
    })
        .then((assets) => {
        const normalizedAssets = normalizeBackgroundAssets(assets);
        if (!normalizedAssets.length) {
            console.warn("No background assets available.");
            return;
        }
        let selectedAsset = null;
        if (!storedBackground && normalizedAssets.length) {
            selectedAsset = normalizedAssets[0];
        }
        else {
            const lastAssetSrc = storedBackground?.src || (typeof storedBackgroundRaw === "string" ? storedBackgroundRaw : null);
            const candidateAssets = normalizedAssets.filter((asset) => asset.src !== lastAssetSrc);
            const selectionPool = candidateAssets.length ? candidateAssets : normalizedAssets;
            selectedAsset = selectionPool[Math.floor(Math.random() * selectionPool.length)];
        }
        if (!selectedAsset) {
            selectedAsset = normalizedAssets[0];
        }
        applyBackground(main, selectedAsset);
        enableBackgroundParallax(main, selectedAsset);
        setStoredBackground(storageKey, serializeBackgroundConfig(selectedAsset));
    })
        .catch((error) => {
        console.error("Failed to set background:", error);
    });
}
function normalizeBackgroundAssets(assets) {
    if (!Array.isArray(assets)) {
        return [];
    }
    return assets
        .map((asset) => createAssetConfig(asset))
        .filter((asset) => asset !== null);
}
function createAssetConfig(entry) {
    if (!entry) {
        return null;
    }
    if (typeof entry === "string") {
        const sanitizedSrc = sanitizePathValue(entry);
        if (!sanitizedSrc) {
            return null;
        }
        const extension = sanitizedSrc.includes(".") ? sanitizedSrc.split(".").pop() : "";
        const type = extension && videoExtensions.includes(extension.toLowerCase()) ? "video" : "image";
        const basePath = type === "video" ? backgroundVideoBasePath : backgroundImageBasePath;
        return {
            src: sanitizedSrc,
            type,
            srcBasePath: basePath,
            poster: null,
            posterBasePath: backgroundImageBasePath
        };
    }
    if (typeof entry === "object") {
        const videoSrc = sanitizePathValue(entry.video);
        const imageSrc = sanitizePathValue(entry.image);
        const posterSrc = sanitizePathValue(entry.poster);
        const rawSrc = sanitizePathValue(entry.src);
        const declaredType = sanitizePathValue(entry.type).toLowerCase();
        if (videoSrc || declaredType === "video") {
            const resolvedVideoSrc = videoSrc || rawSrc;
            if (!resolvedVideoSrc) {
                return null;
            }
            const basePath = sanitizeBasePath(entry.videoBasePath) || sanitizeBasePath(entry.basePath) || backgroundVideoBasePath;
            const posterCandidate = posterSrc || imageSrc;
            const posterBase = sanitizeBasePath(entry.imageBasePath) || sanitizeBasePath(entry.posterBasePath) || backgroundImageBasePath;
            return {
                src: resolvedVideoSrc,
                type: "video",
                srcBasePath: basePath,
                poster: posterCandidate || null,
                posterBasePath: posterBase || backgroundImageBasePath
            };
        }
        const resolvedImageSrc = rawSrc || imageSrc || posterSrc;
        if (!resolvedImageSrc) {
            return null;
        }
        const imageBase = sanitizeBasePath(entry.imageBasePath) || sanitizeBasePath(entry.basePath) || backgroundImageBasePath;
        return {
            src: resolvedImageSrc,
            type: "image",
            srcBasePath: imageBase || backgroundImageBasePath,
            poster: null,
            posterBasePath: backgroundImageBasePath
        };
    }
    return null;
}
function resolveAssetUrl(src, type, basePath) {
    if (!src) {
        return "";
    }
    if (/^(?:https?:)?\/\//i.test(src)) {
        return src;
    }
    const normalizedSrc = src.replace(/^\/+/, "");
    if (normalizedSrc.startsWith("assets/")) {
        return withBase(normalizedSrc);
    }
    const normalizedBase = (basePath && basePath.length ? basePath : type === "video" ? backgroundVideoBasePath : backgroundImageBasePath).replace(/\/+$/, "");
    return withBase(`${normalizedBase}/${normalizedSrc}`);
}
function applyBackground(main, asset) {
    if (!asset) {
        return;
    }
    const assetUrl = resolveAssetUrl(asset.src, asset.type, asset.srcBasePath);
    if (asset.type === "video") {
        const placeholder = asset.poster ? resolveAssetUrl(asset.poster, "image", asset.posterBasePath) : null;
        const container = ensureBackgroundContainer(main);
        if (typeof container.__backgroundCleanup === "function") {
            container.__backgroundCleanup();
            delete container.__backgroundCleanup;
        }
        container.innerHTML = "";
        if (placeholder) {
            setVideoPlaceholder(main, placeholder);
        }
        else {
            clearVideoPlaceholder(main);
        }
        const revealVideo = () => {
            const performClear = () => clearVideoPlaceholder(main);
            if (typeof window !== "undefined" && typeof window.requestAnimationFrame === "function") {
                window.requestAnimationFrame(() => {
                    window.requestAnimationFrame(performClear);
                });
            }
            else {
                performClear();
            }
        };
        let revealFallbackId = null;
        const cancelFallback = () => {
            if (typeof window !== "undefined" && revealFallbackId !== null) {
                window.clearTimeout(revealFallbackId);
                revealFallbackId = null;
            }
        };
        const createVideoElement = (isActive) => {
            const element = document.createElement("video");
            element.className = "main__background-media";
            element.classList.add(isActive ? "is-active" : "is-standby");
            element.loop = false;
            element.autoplay = true;
            element.muted = true;
            element.playsInline = true;
            element.defaultMuted = true;
            element.preload = "auto";
            element.src = assetUrl;
            element.disableRemotePlayback = true;
            element.setAttribute("muted", "");
            element.setAttribute("playsinline", "");
            element.setAttribute("webkit-playsinline", "");
            element.setAttribute("autoplay", "");
            element.setAttribute("preload", "auto");
            element.setAttribute("fetchpriority", "low");
            element.style.backgroundColor = "transparent";
            if (placeholder) {
                element.setAttribute("poster", placeholder);
            }
            return element;
        };
        const waitForMetadata = (video) => {
            if (video.readyState >= 1) {
                return Promise.resolve();
            }
            return new Promise((resolve) => {
                video.addEventListener("loadedmetadata", resolve, { once: true });
            });
        };
        let fallbackActivated = false;
        const installSingleVideoLoop = () => {
            fallbackActivated = true;
            if (typeof container.__backgroundCleanup === "function") {
                container.__backgroundCleanup();
                delete container.__backgroundCleanup;
            }
            container.innerHTML = "";
            if (placeholder) {
                setVideoPlaceholder(main, placeholder);
            }
            const video = document.createElement("video");
            video.className = "main__background-media";
            video.loop = true;
            video.autoplay = true;
            video.muted = true;
            video.playsInline = true;
            video.defaultMuted = true;
            video.preload = "auto";
            video.src = assetUrl;
            video.disableRemotePlayback = true;
            video.setAttribute("muted", "");
            video.setAttribute("playsinline", "");
            video.setAttribute("webkit-playsinline", "");
            video.setAttribute("autoplay", "");
            video.setAttribute("preload", "auto");
            video.setAttribute("fetchpriority", "low");
            video.style.backgroundColor = "transparent";
            if (placeholder) {
                video.setAttribute("poster", placeholder);
            }
            const cleanup = () => {
                if (typeof window !== "undefined" && revealFallbackId !== null) {
                    window.clearTimeout(revealFallbackId);
                    revealFallbackId = null;
                }
                try {
                    video.pause();
                }
                catch (_a) {
                    // ignore pause issues
                }
            };
            container.__backgroundCleanup = cleanup;
            const ensurePlayback = () => {
                const playPromise = video.play();
                if (playPromise && typeof playPromise.catch === "function") {
                    playPromise.catch(() => {
                        // If autoplay fails even here, keep placeholder visible.
                    });
                }
            };
            video.addEventListener("playing", () => {
                cancelFallback();
                revealVideo();
            }, { once: true });
            video.addEventListener("loadeddata", () => {
                if (video.paused) {
                    ensurePlayback();
                }
                if (typeof window !== "undefined") {
                    revealFallbackId = window.setTimeout(() => {
                        revealFallbackId = null;
                        revealVideo();
                    }, 2000);
                }
            }, { once: true });
            video.addEventListener("error", () => {
                cleanup();
                removeBackgroundVideo(main);
                if (placeholder) {
                    setVideoPlaceholder(main, placeholder);
                }
                else {
                    clearVideoPlaceholder(main);
                }
            }, { once: true });
            container.appendChild(video);
        };
        const ensureFallback = () => {
            if (fallbackActivated) {
                return;
            }
            installSingleVideoLoop();
        };
        const installCrossfadeLoop = () => {
            fallbackActivated = false;
            if (typeof container.__backgroundCleanup === "function") {
                container.__backgroundCleanup();
                delete container.__backgroundCleanup;
            }
            container.innerHTML = "";
            if (placeholder) {
                setVideoPlaceholder(main, placeholder);
            }
            const leadVideo = createVideoElement(true);
            const tailVideo = createVideoElement(false);
            const videos = [leadVideo, tailVideo];
            videos.forEach((video) => container.appendChild(video));
            let disposed = false;
            let lead = leadVideo;
            let tail = tailVideo;
            const crossfadeDurationMs = 750;
            const blurOverhead = 1.25;
            const fadeDelayMs = Math.max(0, Math.round(crossfadeDurationMs * blurOverhead));
            const blurInDurationMs = Math.max(0, Math.round(crossfadeDurationMs * (blurOverhead + 0.5)));
            const blurOutDurationMs = blurInDurationMs;
            const blurOutStartDelayMs = blurInDurationMs;
            const totalTransitionMs = blurOutStartDelayMs + blurOutDurationMs;
            const finalizeDelayMs = Math.max(0, totalTransitionMs - fadeDelayMs);
            const crossfadeBufferSeconds = Math.max(0.1, totalTransitionMs / 1000);
            container.style.setProperty("--background-crossfade-duration", `${crossfadeDurationMs}ms`);
            container.style.setProperty("--background-blur-overhead", `${blurOverhead}`);
            container.style.setProperty("--background-blur-in-duration", `${blurInDurationMs}ms`);
            container.style.setProperty("--background-blur-out-duration", `${blurOutDurationMs}ms`);
            let crossfadeInProgress = false;
            let swapTimeoutId = null;
            let swapTimeoutClear = null;
            let teardownIncomingReady = null;
            let activeBlurCleanup = null;
            const listenerRegistry = new WeakMap();
            const detachListeners = (video) => {
                const listeners = listenerRegistry.get(video);
                if (!listeners) {
                    return;
                }
                listeners.forEach(([event, handler]) => video.removeEventListener(event, handler));
                listenerRegistry.delete(video);
            };
            const cleanup = () => {
                if (disposed) {
                    return;
                }
                disposed = true;
                if (typeof activeBlurCleanup === "function") {
                    activeBlurCleanup();
                    activeBlurCleanup = null;
                }
                if (typeof teardownIncomingReady === "function") {
                    teardownIncomingReady();
                }
                if (swapTimeoutId !== null) {
                    if (typeof swapTimeoutClear === "function") {
                        swapTimeoutClear(swapTimeoutId);
                    }
                    else if (typeof window !== "undefined") {
                        window.clearTimeout(swapTimeoutId);
                    }
                    else if (typeof clearTimeout === "function") {
                        clearTimeout(swapTimeoutId);
                    }
                    swapTimeoutId = null;
                    swapTimeoutClear = null;
                }
                videos.forEach(detachListeners);
                videos.forEach((video) => {
                    try {
                        video.pause();
                    }
                    catch (_a) {
                        // ignore pause issues
                    }
                });
            };
            container.__backgroundCleanup = cleanup;
            const safePlay = (video) => {
                const playPromise = video.play();
                if (playPromise && typeof playPromise.catch === "function") {
                    playPromise.catch(() => {
                        if (disposed) {
                            return;
                        }
                        cleanup();
                        ensureFallback();
                    });
                }
                return playPromise;
            };
            const startCrossfade = () => {
                if (disposed || crossfadeInProgress) {
                    return;
                }
                crossfadeInProgress = true;
                const outgoing = lead;
                const incoming = tail;
                detachListeners(outgoing);
                if (typeof teardownIncomingReady === "function") {
                    teardownIncomingReady();
                    teardownIncomingReady = null;
                }
                try {
                    incoming.currentTime = 0;
                }
                catch (_a) {
                    // ignore seek issues
                }
                let transitionActivated = false;
                let cancelFadeDelay = null;
                let cancelBlurOutDelay = null;
                const scheduleWithDelay = (handler, delay) => {
                    if (delay <= 0) {
                        handler();
                        return null;
                    }
                    if (typeof window !== "undefined" && typeof window.setTimeout === "function") {
                        const id = window.setTimeout(handler, delay);
                        return () => window.clearTimeout(id);
                    }
                    if (typeof setTimeout === "function") {
                        const id = setTimeout(handler, delay);
                        if (typeof clearTimeout === "function") {
                            return () => clearTimeout(id);
                        }
                    }
                    handler();
                    return null;
                };
                const finalizeSwap = () => {
                    if (disposed) {
                        return;
                    }
                    if (typeof activeBlurCleanup === "function") {
                        activeBlurCleanup();
                        activeBlurCleanup = null;
                    }
                    if (typeof teardownIncomingReady === "function") {
                        teardownIncomingReady();
                        teardownIncomingReady = null;
                    }
                    try {
                        outgoing.pause();
                    }
                    catch (_a) {
                        // ignore pause issues
                    }
                    try {
                        outgoing.currentTime = 0;
                    }
                    catch (_a) {
                        // ignore seek issues
                    }
                    tail = outgoing;
                    lead = incoming;
                    crossfadeInProgress = false;
                    attachLeadListeners(lead);
                };
                const scheduleFinalize = () => {
                    if (typeof window !== "undefined") {
                        if (swapTimeoutId !== null) {
                            if (typeof swapTimeoutClear === "function") {
                                swapTimeoutClear(swapTimeoutId);
                            }
                            else {
                                window.clearTimeout(swapTimeoutId);
                            }
                        }
                        swapTimeoutClear = (id) => window.clearTimeout(id);
                        swapTimeoutId = window.setTimeout(() => {
                            swapTimeoutId = null;
                            swapTimeoutClear = null;
                            finalizeSwap();
                        }, finalizeDelayMs);
                    }
                    else if (typeof setTimeout === "function") {
                        if (swapTimeoutId !== null) {
                            if (typeof swapTimeoutClear === "function") {
                                swapTimeoutClear(swapTimeoutId);
                            }
                            else if (typeof clearTimeout === "function") {
                                clearTimeout(swapTimeoutId);
                            }
                        }
                        swapTimeoutClear = typeof clearTimeout === "function" ? (id) => clearTimeout(id) : null;
                        swapTimeoutId = setTimeout(() => {
                            swapTimeoutId = null;
                            swapTimeoutClear = null;
                            finalizeSwap();
                        }, finalizeDelayMs);
                    }
                    else {
                        finalizeSwap();
                    }
                };
                let incomingReadyHandler = null;
                const removeIncomingReadyListeners = () => {
                    if (!incomingReadyHandler) {
                        return;
                    }
                    incoming.removeEventListener("playing", incomingReadyHandler);
                    incoming.removeEventListener("timeupdate", incomingReadyHandler);
                    incomingReadyHandler = null;
                };
                const beginVisualTransition = () => {
                    if (transitionActivated || disposed) {
                        return;
                    }
                    transitionActivated = true;
                    removeIncomingReadyListeners();
                    teardownIncomingReady = null;
                    if (typeof activeBlurCleanup === "function") {
                        activeBlurCleanup();
                        activeBlurCleanup = null;
                    }
                    const applyBlurClasses = () => {
                        incoming.classList.add("is-blur-max");
                        outgoing.classList.add("is-blur-max");
                    };
                    const removeBlurClasses = () => {
                        incoming.classList.remove("is-blur-max");
                        outgoing.classList.remove("is-blur-max");
                    };
                    const triggerFade = () => {
                        if (disposed) {
                            return;
                        }
                        incoming.classList.add("is-active");
                        incoming.classList.remove("is-standby");
                        outgoing.classList.remove("is-active");
                        outgoing.classList.add("is-standby");
                        scheduleFinalize();
                        cancelFadeDelay = null;
                    };
                    const startBlurOut = () => {
                        if (disposed) {
                            return;
                        }
                        removeBlurClasses();
                        cancelBlurOutDelay = null;
                    };
                    applyBlurClasses();
                    cancelFadeDelay = scheduleWithDelay(triggerFade, fadeDelayMs);
                    cancelBlurOutDelay = scheduleWithDelay(startBlurOut, blurOutStartDelayMs);
                    activeBlurCleanup = () => {
                        removeBlurClasses();
                        if (typeof cancelFadeDelay === "function") {
                            cancelFadeDelay();
                        }
                        if (typeof cancelBlurOutDelay === "function") {
                            cancelBlurOutDelay();
                        }
                        cancelFadeDelay = null;
                        cancelBlurOutDelay = null;
                        activeBlurCleanup = null;
                    };
                };
                teardownIncomingReady = () => {
                    removeIncomingReadyListeners();
                    teardownIncomingReady = null;
                };
                safePlay(incoming);
                if (!incoming.paused && incoming.readyState >= 2) {
                    beginVisualTransition();
                }
                else {
                    incomingReadyHandler = () => {
                        if (disposed) {
                            return;
                        }
                        removeIncomingReadyListeners();
                        teardownIncomingReady = null;
                        beginVisualTransition();
                    };
                    incoming.addEventListener("playing", incomingReadyHandler);
                    incoming.addEventListener("timeupdate", incomingReadyHandler);
                }
            };
            const attachLeadListeners = (video) => {
                if (disposed) {
                    return;
                }
                detachListeners(video);
                const handleTimeUpdate = () => {
                    if (disposed || crossfadeInProgress) {
                        return;
                    }
                    const duration = video.duration || 0;
                    if (!duration) {
                        return;
                    }
                    if (duration - video.currentTime <= crossfadeBufferSeconds) {
                        startCrossfade();
                    }
                };
                const handleEnded = () => startCrossfade();
                const listeners = [
                    ["timeupdate", handleTimeUpdate],
                    ["ended", handleEnded]
                ];
                listenerRegistry.set(video, listeners);
                listeners.forEach(([event, handler]) => video.addEventListener(event, handler));
            };
            lead.addEventListener("playing", () => {
                cancelFallback();
                revealVideo();
            }, { once: true });
            videos.forEach((video) => {
                video.addEventListener("error", () => {
                    if (disposed) {
                        return;
                    }
                    cleanup();
                    ensureFallback();
                }, { once: true });
            });
            Promise.all(videos.map(waitForMetadata)).then(() => {
                if (disposed) {
                    return;
                }
                try {
                    tail.pause();
                }
                catch (_a) {
                    // ignore pause issues
                }
                try {
                    tail.currentTime = 0;
                }
                catch (_a) {
                    // ignore seek issues
                }
                safePlay(lead);
                attachLeadListeners(lead);
                if (typeof window !== "undefined") {
                    revealFallbackId = window.setTimeout(() => {
                        revealFallbackId = null;
                        revealVideo();
                    }, 2000);
                }
            }).catch(() => {
                if (disposed) {
                    return;
                }
                cleanup();
                ensureFallback();
            });
        };
        installCrossfadeLoop();
    }
    else {
        removeBackgroundVideo(main);
        delete main.dataset.backgroundPlaceholder;
        main.style.backgroundImage = `url("${assetUrl}")`;
    }
}
function ensureBackgroundContainer(main) {
    let container = main.querySelector(".main__background");
    if (!container) {
        container = document.createElement("div");
        container.className = "main__background";
        container.setAttribute("aria-hidden", "true");
        main.prepend(container);
        container.style.willChange = "transform";
    }
    return container;
}
function removeBackgroundVideo(main) {
    const container = main.querySelector(".main__background");
    if (container) {
        if (typeof container.__backgroundCleanup === "function") {
            container.__backgroundCleanup();
            delete container.__backgroundCleanup;
        }
        container.innerHTML = "";
        container.style.removeProperty("--parallax-offset-x");
        container.style.removeProperty("--parallax-offset-y");
        container.style.removeProperty("--parallax-scale");
    }
}
function getStoredBackground(key) {
    try {
        return localStorage.getItem(key);
    }
    catch (error) {
        return null;
    }
}
function setStoredBackground(key, value) {
    try {
        localStorage.setItem(key, value);
    }
    catch (error) {
        return;
    }
}
function parseStoredBackground(rawValue) {
    if (!rawValue) {
        return null;
    }
    if (typeof rawValue === "string") {
        try {
            const parsed = JSON.parse(rawValue);
            const normalized = createAssetConfig(parsed);
            if (normalized) {
                return normalized;
            }
        }
        catch (error) {
            const normalized = createAssetConfig(rawValue);
            if (normalized) {
                return normalized;
            }
        }
    }
    return null;
}
function serializeBackgroundConfig(asset) {
    if (!asset) {
        return "";
    }
    let payload;
    if (asset.type === "video") {
        payload = {
            video: asset.src,
            image: asset.poster || null,
            videoBasePath: asset.srcBasePath,
            imageBasePath: asset.posterBasePath
        };
    }
    else {
        payload = {
            image: asset.src,
            imageBasePath: asset.srcBasePath
        };
    }
    return JSON.stringify(payload);
}
function applyStoredBackgroundPlaceholder(main, asset) {
    if (!asset) {
        return;
    }
    if (asset.type === "video") {
        const placeholder = asset.poster ? resolveAssetUrl(asset.poster, "image", asset.posterBasePath) : null;
        if (placeholder) {
            setVideoPlaceholder(main, placeholder);
        }
        else {
            clearVideoPlaceholder(main);
        }
    }
    else {
        const imageUrl = resolveAssetUrl(asset.src, "image", asset.srcBasePath);
        if (imageUrl) {
            main.style.backgroundImage = `url("${imageUrl}")`;
        }
    }
}
function setVideoPlaceholder(main, poster) {
    if (!poster) {
        return;
    }
    const container = ensureBackgroundContainer(main);
    let placeholder = container.querySelector(".main__background-placeholder");
    if (!placeholder) {
        placeholder = document.createElement("img");
        placeholder.className = "main__background-media main__background-placeholder";
        placeholder.alt = "";
        placeholder.setAttribute("aria-hidden", "true");
        placeholder.draggable = false;
        container.prepend(placeholder);
    }
    placeholder.src = poster;
    placeholder.classList.add("is-active");
    placeholder.classList.remove("is-standby");
    main.dataset.backgroundPlaceholder = "true";
    main.style.backgroundImage = "";
}
function clearVideoPlaceholder(main) {
    const container = main.querySelector(".main__background");
    if (container) {
        const placeholder = container.querySelector(".main__background-placeholder");
        if (placeholder) {
            container.removeChild(placeholder);
        }
    }
    if (main.dataset.backgroundPlaceholder === "true") {
        delete main.dataset.backgroundPlaceholder;
    }
}
function getParallaxCacheKey(asset) {
    if (!asset || !asset.src) {
        return null;
    }
    const type = asset.type || "unknown";
    const basePath = asset.srcBasePath || "";
    return `${type}|${basePath}|${asset.src}`;
}
function enableBackgroundParallax(main, asset) {
    if (cleanupParallax) {
        cleanupParallax();
        cleanupParallax = null;
    }
    if (!asset || !shouldEnableParallax()) {
        resetParallax(main, asset);
        return;
    }
    const backgroundContainer = asset.type === "video" ? main.querySelector(".main__background") : null;
    const cacheKey = getParallaxCacheKey(asset);
    const cachedPosition = cacheKey ? parallaxPositionCache.get(cacheKey) : null;
    const initialPosition = cachedPosition
        ? {
            x: Math.min(1, Math.max(0, typeof cachedPosition.x === "number" ? cachedPosition.x : 0.5)),
            y: Math.min(1, Math.max(0, typeof cachedPosition.y === "number" ? cachedPosition.y : 0.5))
        }
        : { x: 0.5, y: 0.5 };
    const state = {
        target: { x: initialPosition.x, y: initialPosition.y },
        current: { x: initialPosition.x, y: initialPosition.y }
    };
    const rememberPosition = (position) => {
        if (!cacheKey || !position) {
            return;
        }
        parallaxPositionCache.set(cacheKey, position);
    };
    const smoothingFactor = 0.1;
    const settleThreshold = 0.00000000001;
    let animationFrameId = null;
    const stepAnimation = () => {
        const deltaX = state.target.x - state.current.x;
        const deltaY = state.target.y - state.current.y;
        const remainsActive = Math.abs(deltaX) > settleThreshold || Math.abs(deltaY) > settleThreshold;
        if (remainsActive) {
            state.current.x += deltaX * smoothingFactor;
            state.current.y += deltaY * smoothingFactor;
            animationFrameId = window.requestAnimationFrame(stepAnimation);
        }
        else {
            state.current.x = state.target.x;
            state.current.y = state.target.y;
            animationFrameId = null;
        }
        const appliedPosition = applyParallaxOffset(main, asset, backgroundContainer, state.current);
        rememberPosition(appliedPosition);
    };
    const ensureAnimationRunning = () => {
        if (animationFrameId === null) {
            animationFrameId = window.requestAnimationFrame(stepAnimation);
        }
    };
    const updateTarget = (x, y) => {
        state.target.x = x;
        state.target.y = y;
        ensureAnimationRunning();
    };
    const handlePointerMove = (event) => {
        const bounds = main.getBoundingClientRect();
        if (!bounds.width || !bounds.height) {
            return;
        }
        const relativeX = (event.clientX - bounds.left) / bounds.width;
        const relativeY = (event.clientY - bounds.top) / bounds.height;
        updateTarget(relativeX, relativeY);
    };
    const handlePointerLeave = (event) => {
        const nextTarget = event?.relatedTarget ?? event?.toElement ?? null;
        if (!nextTarget) {
            return;
        }
        updateTarget(0.5, 0.5);
    };
    main.addEventListener("mousemove", handlePointerMove);
    main.addEventListener("mouseleave", handlePointerLeave);
    const initialAppliedPosition = applyParallaxOffset(main, asset, backgroundContainer, state.current);
    rememberPosition(initialAppliedPosition);
    ensureAnimationRunning();
    cleanupParallax = () => {
        main.removeEventListener("mousemove", handlePointerMove);
        main.removeEventListener("mouseleave", handlePointerLeave);
        if (animationFrameId !== null) {
            window.cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        resetParallax(main, asset, backgroundContainer);
    };
}
function applyParallaxOffset(main, asset, container, position) {
    if (!asset) {
        return null;
    }
    const clampedX = Math.min(1, Math.max(0, position.x));
    const clampedY = Math.min(1, Math.max(0, position.y));
    if (asset.type === "video" && container) {
        const offsetIntensity = 50;
        const offsetX = (clampedX - 0.5) * offsetIntensity;
        const offsetY = (clampedY - 0.5) * offsetIntensity;
        const offsetXValue = `${offsetX}px`;
        const offsetYValue = `${offsetY}px`;
        container.style.setProperty("--parallax-offset-x", offsetXValue);
        container.style.setProperty("--parallax-offset-y", offsetYValue);
        container.style.setProperty("--parallax-scale", "1.08");
    }
    else {
        const offsetIntensityPercent = 50;
        const offsetXPercent = (clampedX - 0.5) * offsetIntensityPercent;
        const offsetYPercent = (clampedY - 0.5) * offsetIntensityPercent;
        main.style.backgroundPosition = `${50 + offsetXPercent}% ${50 + offsetYPercent}%`;
    }
    return { x: clampedX, y: clampedY };
}
function resetParallax(main, asset, container) {
    if (!asset) {
        return;
    }
    if (asset.type === "video") {
        const target = container || main.querySelector(".main__background");
        if (target) {
            target.style.removeProperty("--parallax-offset-x");
            target.style.removeProperty("--parallax-offset-y");
            target.style.removeProperty("--parallax-scale");
        }
    }
    else {
        main.style.backgroundPosition = "";
    }
}
function shouldEnableParallax() {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
        return false;
    }
    const hasTouchInput = (typeof navigator !== "undefined" &&
        ((navigator.maxTouchPoints && navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints && navigator.msMaxTouchPoints > 0))) || "ontouchstart" in window;
    if (hasTouchInput) {
        return false;
    }
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
        return false;
    }
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    return hasFinePointer;
}
