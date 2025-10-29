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
        let btnHome = document.getElementById("read-more-home");
        btnHome.addEventListener("click", () => {
            removeFullScreenFromAllSections();
            about.classList.add("full-screen-right");
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
        container.innerHTML = "";
        const video = document.createElement("video");
        video.className = "main__background-media";
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.defaultMuted = true;
        video.setAttribute("muted", "");
        video.setAttribute("playsinline", "");
        video.setAttribute("autoplay", "");
        video.setAttribute("loop", "");
        video.preload = "auto";
        video.setAttribute("preload", "auto");
        video.setAttribute("fetchpriority", "low");
        video.style.backgroundColor = "transparent";
        video.style.transition = "none";
        if (placeholder) {
            video.setAttribute("poster", placeholder);
            setVideoPlaceholder(main, placeholder);
        }
        else {
            main.style.backgroundImage = "";
        }
        const beginVideoLoad = () => {
            if (!video.src) {
                video.src = assetUrl;
                try {
                    video.load();
                }
                catch (_a) {
                    // Ignore load errors; the browser will handle failed fetches.
                }
            }
        };
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
        const handleVideoPlaying = () => {
            cancelFallback();
            revealVideo();
        };
        const resumePlayback = () => {
            const resumePromise = video.play();
            if (resumePromise && typeof resumePromise.catch === "function") {
                resumePromise.catch(() => {
                    // Autoplay might be blocked; nothing else to do.
                });
            }
        };
        const manualLoopThreshold = 0.08;
        const loopResetTime = 0.001;
        let isLoopSeeking = false;
        video.addEventListener("timeupdate", () => {
            if (!video.duration || isLoopSeeking) {
                return;
            }
            const remaining = video.duration - video.currentTime;
            if (remaining > 0 && remaining <= manualLoopThreshold) {
                isLoopSeeking = true;
                try {
                    video.currentTime = loopResetTime;
                }
                catch (_a) {
                    isLoopSeeking = false;
                }
            }
        });
        video.addEventListener("seeked", () => {
            if (!isLoopSeeking) {
                return;
            }
            isLoopSeeking = false;
            resumePlayback();
        });
        video.addEventListener("playing", handleVideoPlaying, { once: true });
        video.addEventListener("loadeddata", () => {
            if (video.paused) {
                resumePlayback();
            }
            if (typeof window !== "undefined") {
                revealFallbackId = window.setTimeout(() => {
                    revealFallbackId = null;
                    revealVideo();
                }, 2000);
            }
        }, { once: true });
        video.addEventListener("error", () => {
            if (!placeholder) {
                main.style.backgroundImage = "";
            }
        }, { once: true });
        video.addEventListener("ended", () => {
            if (video.currentTime !== loopResetTime) {
                try {
                    video.currentTime = loopResetTime;
                }
                catch (_a) {
                    // ignore seek errors
                }
            }
            resumePlayback();
        });
        container.appendChild(video);
        if (typeof window !== "undefined" && "requestIdleCallback" in window) {
            window.requestIdleCallback(beginVideoLoad, { timeout: 2500 });
        }
        else if (typeof window !== "undefined") {
            window.setTimeout(beginVideoLoad, 700);
        }
        else {
            beginVideoLoad();
        }
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
        container.innerHTML = "";
        container.style.transform = "";
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
            main.style.backgroundImage = `url("${placeholder}")`;
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
    main.style.backgroundImage = `url("${poster}")`;
    main.dataset.backgroundPlaceholder = "true";
}
function clearVideoPlaceholder(main) {
    if (main.dataset.backgroundPlaceholder === "true") {
        delete main.dataset.backgroundPlaceholder;
    }
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
    const state = {
        target: { x: 0.5, y: 0.5 },
        current: { x: 0.5, y: 0.5 }
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
        applyParallaxOffset(main, asset, backgroundContainer, state.current);
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
    const handlePointerLeave = () => {
        updateTarget(0.5, 0.5);
    };
    main.addEventListener("mousemove", handlePointerMove);
    main.addEventListener("mouseleave", handlePointerLeave);
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
        return;
    }
    const clampedX = Math.min(1, Math.max(0, position.x));
    const clampedY = Math.min(1, Math.max(0, position.y));
    if (asset.type === "video" && container) {
        const offsetIntensity = 50;
        const offsetX = (clampedX - 0.5) * offsetIntensity;
        const offsetY = (clampedY - 0.5) * offsetIntensity;
        container.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0) scale(1.08)`;
    }
    else {
        const offsetIntensityPercent = 50;
        const offsetXPercent = (clampedX - 0.5) * offsetIntensityPercent;
        const offsetYPercent = (clampedY - 0.5) * offsetIntensityPercent;
        main.style.backgroundPosition = `${50 + offsetXPercent}% ${50 + offsetYPercent}%`;
    }
}
function resetParallax(main, asset, container) {
    if (!asset) {
        return;
    }
    if (asset.type === "video") {
        const target = container || main.querySelector(".main__background");
        if (target) {
            target.style.transform = "";
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
