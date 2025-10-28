"use strict";
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        changeListItems();
        changeBackgroundAfterWhile();
    });
}
else {
    changeListItems();
    changeBackgroundAfterWhile();
}
function changeListItems() {
    let home = document.getElementById("home");
    let about = document.getElementById("about");
    let quality = document.getElementById("quality");
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
            else if (li.getAttribute("id") === "item-quality") {
                quality.classList.add("full-screen-left");
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
function changeBackgroundAfterWhile() {
    const main = document.getElementById("main");
    if (!main) {
        return;
    }
    const manifestUrl = "/assets/images/backgrounds/backgrounds.json";
    const storageKey = "portfolio:lastBackground";
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
        const lastAsset = getStoredBackground(storageKey);
        const candidateAssets = normalizedAssets.filter((asset) => asset.src !== lastAsset);
        const selectionPool = candidateAssets.length ? candidateAssets : normalizedAssets;
        const selectedAsset = selectionPool[Math.floor(Math.random() * selectionPool.length)];
        applyBackground(main, selectedAsset);
        setStoredBackground(storageKey, selectedAsset.src);
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
        .map((asset) => {
        if (typeof asset === "string") {
            return createAssetConfig(asset);
        }
        if (asset && typeof asset === "object" && typeof asset.src === "string") {
            return createAssetConfig(asset.src);
        }
        return null;
    })
        .filter((asset) => asset !== null);
}
function createAssetConfig(src) {
    const sanitizedSrc = typeof src === "string" ? src.trim() : "";
    if (!sanitizedSrc) {
        return null;
    }
    const extension = sanitizedSrc.includes(".") ? sanitizedSrc.split(".").pop() : "";
    const videoExtensions = ["mp4", "webm", "ogv", "ogg"];
    const type = extension && videoExtensions.includes(extension.toLowerCase()) ? "video" : "image";
    return { src: sanitizedSrc, type };
}
function applyBackground(main, asset) {
    if (!asset) {
        return;
    }
    if (asset.type === "video") {
        const container = ensureBackgroundContainer(main);
        container.innerHTML = "";
        const video = document.createElement("video");
        video.className = "main__background-media";
        video.src = `/assets/images/backgrounds/${asset.src}`;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.defaultMuted = true;
        video.setAttribute("muted", "");
        video.setAttribute("playsinline", "");
        video.setAttribute("autoplay", "");
        video.setAttribute("loop", "");
        video.setAttribute("preload", "auto");
        container.appendChild(video);
        main.style.backgroundImage = "none";
    }
    else {
        removeBackgroundVideo(main);
        main.style.backgroundImage = `url("/assets/images/backgrounds/${asset.src}")`;
    }
}
function ensureBackgroundContainer(main) {
    let container = main.querySelector(".main__background");
    if (!container) {
        container = document.createElement("div");
        container.className = "main__background";
        container.setAttribute("aria-hidden", "true");
        main.prepend(container);
    }
    return container;
}
function removeBackgroundVideo(main) {
    const container = main.querySelector(".main__background");
    if (container) {
        container.innerHTML = "";
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
