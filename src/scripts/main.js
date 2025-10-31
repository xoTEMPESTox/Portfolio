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
        const video = document.createElement("video");
        video.className = "main__background-media";
        video.classList.add("is-active");
        video.loop = false;
        video.autoplay = true;
        video.muted = true;
        video.playsInline = true;
        video.defaultMuted = true;
        video.preload = "auto";
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
        container.appendChild(video);
        const teardown = initializeVideoBackgroundLoop(main, video, assetUrl, asset);
        container.__backgroundCleanup = () => {
            teardown();
            if (typeof container.__backgroundCleanup === "function") {
                delete container.__backgroundCleanup;
            }
        };
    }
    else {
        removeBackgroundVideo(main);
        delete main.dataset.backgroundPlaceholder;
        main.style.backgroundImage = `url("${assetUrl}")`;
    }
}
function initializeVideoBackgroundLoop(main, video, assetUrl, asset) {
    const createFallback = () => setupNativeVideoLoop(main, video, assetUrl);
    if (typeof window === "undefined" ||
        typeof window.MediaSource !== "function" ||
        typeof URL === "undefined" ||
        typeof URL.createObjectURL !== "function") {
        return createFallback();
    }
    const cleanup = setupMseVideoLoop(main, video, assetUrl, asset, createFallback);
    return cleanup || createFallback();
}
function setupNativeVideoLoop(main, video, assetUrl) {
    const reveal = () => deferClearVideoPlaceholder(main);
    const handlePlaying = () => {
        reveal();
    };
    const handleLoaded = () => {
        if (video.paused) {
            const playPromise = video.play();
            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(() => {
                    // keep placeholder if autoplay is blocked
                });
            }
        }
    };
    video.loop = true;
    video.src = assetUrl;
    video.addEventListener("playing", handlePlaying, { once: true });
    video.addEventListener("loadeddata", handleLoaded, { once: true });
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
            // autoplay might be blocked; placeholder will stay visible
        });
    }
    return () => {
        video.removeEventListener("playing", handlePlaying);
        video.removeEventListener("loadeddata", handleLoaded);
        try {
            video.pause();
        }
        catch (_a) {
            // ignore pause issues
        }
        video.removeAttribute("src");
        try {
            video.load();
        }
        catch (_b) {
            // ignore load issues
        }
    };
}
function setupMseVideoLoop(main, video, assetUrl, asset, createFallbackCleanup) {
    const MediaSourceCtor = typeof window !== "undefined" ? window.MediaSource : null;
    if (!MediaSourceCtor || typeof MediaSourceCtor !== "function") {
        return null;
    }
    let disposed = false;
    let fallbackCleanup = null;
    let mediaSource = null;
    let sourceBuffer = null;
    let objectUrl = null;
    let segmentTemplate = null;
    let segmentDuration = 0;
    let loopsAppended = 0;
    let appendQueued = false;
    let lastOperation = null;
    const cleanupCallbacks = [];
    const abortController = typeof AbortController === "function" ? new AbortController() : null;
    const addCleanup = (fn) => {
        if (typeof fn === "function") {
            cleanupCallbacks.push(fn);
        }
    };
    const runCleanupCallbacks = () => {
        while (cleanupCallbacks.length) {
            const fn = cleanupCallbacks.pop();
            try {
                fn();
            }
            catch (_a) {
                // ignore cleanup issues
            }
        }
    };
    const addEvent = (target, event, handler, options) => {
        target.addEventListener(event, handler, options);
        addCleanup(() => target.removeEventListener(event, handler));
    };
    const ensurePlayback = () => {
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(() => {
                // leave placeholder visible if autoplay is blocked
            });
        }
    };
    const teardownMse = () => {
        runCleanupCallbacks();
        if (sourceBuffer) {
            try {
                if (mediaSource && mediaSource.readyState === "open") {
                    sourceBuffer.abort();
                    mediaSource.removeSourceBuffer(sourceBuffer);
                }
            }
            catch (_a) {
                // ignore abort issues
            }
            sourceBuffer = null;
        }
        if (mediaSource && mediaSource.readyState === "open") {
            try {
                mediaSource.endOfStream();
            }
            catch (_b) {
                // ignore endOfStream issues
            }
        }
        if (abortController) {
            abortController.abort();
        }
        if (video.src === objectUrl) {
            try {
                video.removeAttribute("src");
                video.load();
            }
            catch (_c) {
                // ignore load cleanup issues
            }
        }
        if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
        }
        mediaSource = null;
        objectUrl = null;
        segmentTemplate = null;
    };
    const fallback = () => {
        if (disposed || fallbackCleanup) {
            return;
        }
        teardownMse();
        fallbackCleanup = createFallbackCleanup();
    };
    const maintainBufferAhead = () => {
        if (disposed || !segmentDuration || !sourceBuffer) {
            return;
        }
        const bufferedAhead = loopsAppended * segmentDuration - video.currentTime;
        if (!Number.isFinite(bufferedAhead) || bufferedAhead < 0) {
            return;
        }
        if (bufferedAhead <= segmentDuration * 1.25) {
            appendSegment();
        }
    };
    const maybeTrimBuffer = () => {
        if (disposed || !sourceBuffer || !segmentDuration) {
            return;
        }
        if (loopsAppended < 6) {
            return;
        }
        if (sourceBuffer.updating) {
            return;
        }
        const retainDuration = segmentDuration * 3;
        const trimBefore = Math.max(0, video.currentTime - retainDuration);
        if (!Number.isFinite(trimBefore) || trimBefore <= 0) {
            return;
        }
        const buffered = sourceBuffer.buffered;
        if (!buffered || buffered.length === 0) {
            return;
        }
        let start;
        try {
            start = buffered.start(0);
        }
        catch (_a) {
            return;
        }
        if (trimBefore <= start + 0.25) {
            return;
        }
        lastOperation = "trim";
        try {
            sourceBuffer.remove(0, trimBefore);
        }
        catch (error) {
            console.warn("Failed to trim seamless background buffer:", error);
            lastOperation = null;
        }
    };
    const appendSegment = () => {
        if (disposed || !sourceBuffer || !segmentTemplate) {
            return;
        }
        if (sourceBuffer.updating) {
            appendQueued = true;
            return;
        }
        appendQueued = false;
        lastOperation = "append";
        try {
            const copy = new Uint8Array(segmentTemplate);
            sourceBuffer.appendBuffer(copy);
        }
        catch (error) {
            console.error("Failed to append seamless background segment:", error);
            lastOperation = null;
            fallback();
        }
    };
    const handleUpdateEnd = () => {
        if (disposed || !sourceBuffer) {
            return;
        }
        const wasAppend = lastOperation === "append";
        lastOperation = null;
        if (wasAppend) {
            loopsAppended += 1;
            if (!segmentDuration) {
                const duration = Number.isFinite(video.duration) ? video.duration : 0;
                if (duration > 0) {
                    segmentDuration = duration;
                }
            }
            maintainBufferAhead();
            maybeTrimBuffer();
        }
        else {
            maintainBufferAhead();
        }
        if (appendQueued) {
            appendQueued = false;
            appendSegment();
        }
        ensurePlayback();
    };
    const handleTimeUpdate = () => {
        maintainBufferAhead();
    };
    const handleVideoError = () => {
        fallback();
    };
    addEvent(video, "timeupdate", handleTimeUpdate);
    addEvent(video, "error", handleVideoError);
    addEvent(video, "playing", () => deferClearVideoPlaceholder(main), { once: true });
    mediaSource = new MediaSourceCtor();
    try {
        objectUrl = URL.createObjectURL(mediaSource);
    }
    catch (error) {
        console.error("Failed to create MediaSource URL:", error);
        runCleanupCallbacks();
        mediaSource = null;
        return null;
    }
    video.src = objectUrl;
    const onSourceOpen = async () => {
        if (disposed) {
            return;
        }
        mediaSource.removeEventListener("sourceopen", onSourceOpen);
        try {
            const fetchOptions = abortController ? { signal: abortController.signal } : undefined;
            const response = await fetch(assetUrl, fetchOptions);
            if (!response.ok) {
                throw new Error(`Unexpected status ${response.status}`);
            }
            const arrayBuffer = await response.arrayBuffer();
            if (!arrayBuffer || !arrayBuffer.byteLength) {
                throw new Error("Received empty background segment.");
            }
            const mimeType = resolveMediaSourceMimeType(asset, assetUrl, response.headers.get("Content-Type"));
            if (!mimeType || !MediaSourceCtor.isTypeSupported(mimeType)) {
                throw new Error(`Unsupported MIME type: ${mimeType || "unknown"}`);
            }
            if (disposed) {
                return;
            }
            sourceBuffer = mediaSource.addSourceBuffer(mimeType);
            sourceBuffer.mode = "sequence";
            addEvent(sourceBuffer, "updateend", handleUpdateEnd);
            segmentTemplate = new Uint8Array(arrayBuffer);
            mediaSource.duration = Infinity;
            appendSegment();
            ensurePlayback();
        }
        catch (error) {
            console.error("Failed to initialize seamless background video:", error);
            fallback();
        }
    };
    mediaSource.addEventListener("sourceopen", onSourceOpen, { once: true });
    addCleanup(() => mediaSource.removeEventListener("sourceopen", onSourceOpen));
    return () => {
        if (disposed) {
            return;
        }
        disposed = true;
        teardownMse();
        if (fallbackCleanup) {
            const cleanup = fallbackCleanup;
            fallbackCleanup = null;
            cleanup();
        }
        else {
            try {
                video.pause();
            }
            catch (_a) {
                // ignore pause issues
            }
            video.removeAttribute("src");
            try {
                video.load();
            }
            catch (_b) {
                // ignore load issues
            }
        }
    };
}
function resolveMediaSourceMimeType(asset, assetUrl, responseType) {
    const candidates = [];
    const declared = sanitizePathValue(asset?.mimeType);
    if (declared) {
        candidates.push(declared);
    }
    const normalizedResponse = sanitizePathValue(responseType);
    if (normalizedResponse) {
        const baseResponse = normalizedResponse.split(";")[0].trim();
        if (baseResponse) {
            candidates.push(baseResponse);
        }
    }
    const extension = sanitizePathValue(assetUrl).split(".").pop()?.toLowerCase() ?? "";
    candidates.push(...getMimeTypeCandidatesForExtension(extension));
    const MediaSourceCtor = typeof window !== "undefined" ? window.MediaSource : null;
    const uniqueCandidates = [];
    candidates.forEach((candidate) => {
        const normalized = sanitizePathValue(candidate);
        if (!normalized) {
            return;
        }
        if (!uniqueCandidates.includes(normalized)) {
            uniqueCandidates.push(normalized);
        }
    });
    if (!MediaSourceCtor || typeof MediaSourceCtor.isTypeSupported !== "function") {
        return uniqueCandidates[0] ?? null;
    }
    for (const candidate of uniqueCandidates) {
        if (MediaSourceCtor.isTypeSupported(candidate)) {
            return candidate;
        }
    }
    return uniqueCandidates[0] ?? null;
}
function getMimeTypeCandidatesForExtension(extension) {
    switch (extension) {
        case "mp4":
            return [
                'video/mp4; codecs="avc1.64001F, mp4a.40.2"',
                'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
                "video/mp4"
            ];
        case "webm":
            return [
                'video/webm; codecs="vp9, opus"',
                'video/webm; codecs="vp8, vorbis"',
                "video/webm"
            ];
        case "ogg":
        case "ogv":
            return [
                'video/ogg; codecs="theora, vorbis"',
                "video/ogg"
            ];
        case "mov":
            return [
                "video/quicktime"
            ];
        default:
            return [];
    }
}
function deferClearVideoPlaceholder(main) {
    const performClear = () => clearVideoPlaceholder(main);
    if (typeof window !== "undefined" && typeof window.requestAnimationFrame === "function") {
        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(performClear);
        });
    }
    else {
        performClear();
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
