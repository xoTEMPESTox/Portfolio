import React, { useState, useRef, useEffect } from "react";
import { Github, ExternalLink } from "lucide-react";
import { useTheme } from "./HeaderBackground";

// --- Configuration Constants ---
// const EDGE_THRESHOLD = 0.25;

// --- Sub-Components ---
const TechBadge = React.memo(({ label, slug, color, iconColor, theme }) => {
  // slug is the lowercase name of the tech (e.g., 'googlechrome', 'react')
  // color is the official hex (e.g., '4285F4')

  // Only invert if explicitly requested AND we are in dark mode
  const finalIconClass = iconColor === 'invert'
    ? (theme === 'dark' ? 'invert' : '')
    : iconColor;

  return (
    <div
      style={{
        backgroundColor: `#${color}15`, // 15 is ~8% opacity
        borderColor: `#${color}30`, // 30 is ~20% opacity
      }}
      className="flex items-center px-2.5 py-1 rounded-full border backdrop-blur-sm transition-transform hover:scale-105"
    >
      <img
        src={`https://api.iconify.design/${slug}.svg`}
        alt={label}
        decoding="async"
        className={`w-4 h-4 min-[1265px]:w-5 min-[1265px]:h-5 mr-2 ${finalIconClass}`}
      />
      <span
        style={{ color: `#${color}` }}
        className="text-[11px] min-[1265px]:text-[13px]  font-semibold"
      >
        {label}
      </span>
    </div>
  );
});

const handleLinkClick = (url) => (e) => {
  e.stopPropagation();
  e.preventDefault();
  window.open(url, "_blank", "noopener,noreferrer");
};

const RopeBulb = ({ isOn, onClick, onHoverChange }) => {
  const [isPulling, setIsPulling] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    setIsPulling(true);
    onClick();
    setTimeout(() => setIsPulling(false), 300);
  };

  return (
    <div
      className="absolute left-8 top-0 z-50 origin-top transition-transform duration-300 hover:scale-110"
      onMouseEnter={() => onHoverChange && onHoverChange(true)}
      onMouseLeave={() => onHoverChange && onHoverChange(false)}
    >
      <div
        className="flex flex-col items-center cursor-pointer group"
        style={{
          transform: isPulling ? "translateY(12px)" : "translateY(0)",
          transition: "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
          pointerEvents: "auto",
        }}
        onClick={handleClick}
      >
        {/* The Mount Anchor - Making it look connected */}
        <div className="w-8 h-3 bg-zinc-950 rounded-b-lg border-x border-b border-white/10 shadow-lg relative">
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-2 bg-zinc-900 rounded-full blur-[1px]"></div>
        </div>

        {/* The Rope */}
        <div className="w-0.5 h-16 bg-gradient-to-b from-zinc-500 via-zinc-600 to-zinc-700 relative">
          {/* Decorative knots/textures on rope */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-1 h-1.5 bg-zinc-800 rounded-sm opacity-50"></div>
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-1 h-1.5 bg-zinc-800 rounded-sm opacity-50"></div>
        </div>

        {/* Bulb Socket */}
        <div className="w-4 h-5 bg-zinc-800 border border-zinc-600 rounded-t-sm mt-[-2px] relative z-10 shadow-sm"></div>

        {/* The Bulb with Flickering logic */}
        <div
          className={`w-8 h-8 rounded-full border-2 -mt-1 relative z-0 transition-all duration-500 ${isOn
            ? "bg-yellow-200 border-yellow-100 shadow-[0_0_45px_15px_rgba(253,224,71,0.7)]"
            : "bg-orange-400/30 border-orange-300/40 shadow-none animate-bulb-flicker group-hover:bg-orange-400"
            }`}
        >
          {/* Reflection Highlight */}
          <div
            className={`absolute top-1.5 left-2 w-2 h-2 rounded-full rotate-45 transition-colors ${isOn ? "bg-white/60" : "bg-orange-100/30"}`}
          ></div>
        </div>
      </div>
    </div>
  );
};

// --- Top Face Content Component ---
// Extracted to ensure the 3D face and the 2D overlay look identical
const TopFaceContent = ({ item, toggleLight, onViewDetails }) => {
  const listRef = useRef(null);
  const [glowPosition, setGlowPosition] = useState({ x: 0, y: 0, opacity: 0 });
  const { theme } = useTheme();


  const gradientHoverMove = (e) => {
    if (listRef.current) {
      const rect = listRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setGlowPosition({ x, y, opacity: 1 });
    }
  };

  const gradientHoverLeave = () => {
    setGlowPosition({ ...glowPosition, opacity: 0 });
  };

  const gradientHoverEnter = () => {
    setGlowPosition((prev) => ({ ...prev, opacity: 1 }));
  };

  return (
    <div
      className={`absolute inset-0 backdrop-blur-sm border rounded-4xl p-5 overflow-hidden flex flex-col backface-hidden transition-colors duration-300 ${theme === 'dark'
        ? 'bg-[#0a0a0a]/95 border-white/30'
        : 'bg-white/90 border-black/10 shadow-sm'
        }`}
      ref={listRef}
      onMouseMove={gradientHoverMove}
      onMouseLeave={gradientHoverLeave}
      onMouseEnter={gradientHoverEnter}
    >
      <div className="relative z-10 flex flex-col h-full pointer-events-auto">
        <div className="mt-6 flex-1">
          <p className={`text-2xl min-[1265px]:text-4xl font-bold leading-tight mb-1 uppercase tracking-tight bg-clip-text text-transparent text-center bg-gradient-to-r ${theme === 'dark'
            ? 'from-gray-400 via-white to-gray-500'
            : 'from-gray-500 via-gray-900 to-gray-600'
            }`}>
            {item.title}
          </p>
          <p className={`text-lg min-[1265px]:text-2xl leading-snug line-clamp-3 lg:line-clamp-none text-center ${theme === 'dark' ? 'text-[#c4c4c4]' : 'text-zinc-600'
            }`}>
            {item.description}
          </p>
        </div>
        <div className="hidden xl:flex flex-wrap justify-center gap-2 mt-auto mb-4 px-2">
          {item.techStack &&
            item.techStack
              .slice(0, 6)
              .map((tech) => (
                <TechBadge
                  key={tech.name}
                  slug={tech.slug}
                  label={tech.name}
                  color={tech.color}
                  iconColor={tech.iconColor}
                  theme={theme}
                />
              ))}
        </div>
        <div className="flex items-center justify-between w-full mt-auto pt-4 ">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleLight();
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className={`!text-xl transition-colors uppercase tracking-widest font-semibold cursor-pointer relative z-20 ${theme === 'dark' ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600'
              }`}
          >
            Close
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(item);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className={`group relative font-black uppercase rounded-full overflow-hidden transition-all shadow-xl ${theme === 'dark'
              ? 'bg-white text-black hover:shadow-white/10'
              : 'bg-black text-white hover:shadow-black/20'
              }`}
          >
            <span className="relative z-10 text-xl group-hover:text-white transition-colors rounded-full flex items-center gap-2 px-4 py-2">
              View Details
              <ExternalLink
                size={12}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </span>
            <div className={`absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full ${theme === 'dark' ? 'group-hover:bg-black/70' : 'group-hover:bg-zinc-800'
              }`}></div>
          </button>
        </div>
      </div>

      <div
        className="cursor-glow-portfolio-card pointer-events-none"
        style={{
          left: `${glowPosition.x}px`,
          top: `${glowPosition.y}px`,
          opacity: glowPosition.opacity,
          background: theme === 'dark'
            ? "radial-gradient(circle, rgba(30, 144, 255, 0.2) 0%, rgba(75, 0, 130, 0.1) 70%, transparent 100%)"
            : "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(30, 58, 138, 0.05) 70%, transparent 100%)",
        }}
      ></div>
    </div>
  );
};

const Cube = React.memo(({
  item,
  onViewDetails,
  isDragging,
  isScrolling,
  width,
  height,
  onImageOpen,
  isVisible = true,
}) => {
  const [isLightOn, setIsLightOn] = useState(false);
  const [isBulbHovered, setIsBulbHovered] = useState(false);
  const { theme } = useTheme();

  const [showImageModal, setShowImageModal] = useState(false);
  // interactionReady determines if the 2D overlay should be shown
  const [interactionReady, setInteractionReady] = useState(false);

  // Reset state when not visible
  useEffect(() => {
    if (!isVisible && isLightOn) {
      setIsLightOn(false);
    }
  }, [isVisible, isLightOn]);

  const toggleLight = () => {
    setIsLightOn(!isLightOn);
  };

  // Manage interaction readiness based on animation timing
  useEffect(() => {
    let timer;
    if (isLightOn) {
      // Wait for the 700ms transition to finish before enabling the 2D overlay
      // This ensures the user sees the 3D rotation, then gets the stable 2D interface
      timer = setTimeout(() => {
        setInteractionReady(true);
      }, 550); // slightly less than duration to feel responsive
    } else {
      // Immediately disable overlay when closing to allow 3D rotation back
      setInteractionReady(false);
    }
    return () => clearTimeout(timer);
  }, [isLightOn]);

  const handleImageClick = (e) => {
    e.stopPropagation();
    setShowImageModal(true);
  };

  const translateZ = width / 2;

  // Optimize: Disable pointer events during scroll/drag to prevent expensive hover calcs
  const isInteracting = isDragging || isScrolling;

  return (
    <>
      <div
        // Note: Removed preserve-3d from here to allow simple 2D stacking for the overlay
        className="relative transition-all duration-500"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          perspective: "1200px",
          pointerEvents: isInteracting ? "none" : "auto",
          willChange: "transform", // Hint browser for optimization
        }}
      >
        {/* The 3D Pivot Container */}
        {/* The 3D Pivot Container */}
        <div
          className="w-full h-full relative transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
          style={{
            transformStyle: "preserve-3d",
            transform: `translateZ(-${translateZ}px) rotateX(${isLightOn ? -90 : 0}deg)`,
            pointerEvents: "none",
          }}
        >
           {/* --- ADDED: Animation Styles (Hover Only) --- */}
           <style>{`
            @keyframes border-signal-dark {
              0% { border-color: rgba(0,0,0,0.9); box-shadow: 10 10 10 transparent; }
              50% { border-color: rgba(99, 102, 241, 0.8); box-shadow: 0 0 20px rgba(99, 102, 241, 0.4); }
              100% { border-color: rgba(0,0,0,0.9); box-shadow: 0 0 0 transparent; }
            }
            @keyframes border-signal-light {
              0% { border-color: rgba(212, 212, 216, 1); box-shadow: 0 0 0 transparent; }
              50% { border-color: rgba(59, 130, 246, 0.8); box-shadow: 0 0 20px rgba(59, 130, 246, 0.4); }
              100% { border-color: rgba(212, 212, 216, 1); box-shadow: 10 10 10 transparent; }
            }
            /* Only animate on hover */
            .hover-glow-dark:hover {
              animation: border-signal-dark 1.5s ease-in-out infinite;
             
            }
            .hover-glow-light:hover {
              animation: border-signal-light 1.5s ease-in-out infinite;
            
            }
          `}</style>

          {/* FRONT FACE (Links) */}
          <div
            className={`absolute inset-0 border-2 rounded-4xl flex items-end justify-between gap-4 backface-hidden backdrop-blur-sm overflow-hidden transition-colors duration-300 ${theme === 'dark'
              ? 'bg-[#0f172a] border-black/90 hover-glow-dark' // Added hover-glow-dark
              : 'bg-[#0f172a] border-zinc-300 shadow-inner hover-glow-light' // Added hover-glow-light
              }`}
            style={{
              transform: `rotateX(0deg) translateZ(${translateZ}px)`,
              visibility: isLightOn ? "hidden" : "visible",
              pointerEvents: isLightOn ? "none" : "auto",
              backfaceVisibility: "hidden",
            }}
          >
            
            <div
              className={`absolute inset-0 bg-cover bg-center rounded-4xl cursor-pointer transition-all duration-300 ${isBulbHovered ? 'scale-105 opacity-100' : 'opacity-50'}`}
              style={{ backgroundImage: `url(${item.image_url})` }}
              onClick={(e) => {
                e.stopPropagation();
                toggleLight();
              }}
            />

            {/* Top Right Tag */}
            <div className="absolute top-4 right-4 z-20">
              <span className={`px-3 py-1 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest border rounded-full transition-colors ${theme === 'dark'
                ? 'bg-black/60 text-white border-white/10'
                : 'bg-white/80 text-zinc-900 border-black/10'
                }`}>
                {item.tag}
              </span>
            </div>

            {/* Button Container (Bottom Left) */}
            <div className={`relative z-[100] flex gap-3 px-4 pt-4 pb-3 rounded-tr-3xl rounded-bl-4xl border-t border-r transition-colors -ml-[1px] -mb-[1px] ${theme === 'dark'
              ? 'bg-zinc-900 border-white/10'
              : 'bg-white border-zinc-200 shadow-lg'
              }`}>
              {/* Github Button */}
              <button
                onClick={handleLinkClick(item.links.github_link)}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                className={`w-14 h-14 flex items-center justify-center rounded-full transition-all transform hover:scale-110 border cursor-pointer ${theme === 'dark'
                  ? 'bg-black hover:bg-zinc-800 text-white border-white/20 shadow-[0_0_15px_rgba(0,0,0,0.5)]'
                  : 'bg-zinc-900 hover:bg-black text-white border-transparent shadow-md'
                  }`}
                style={{ pointerEvents: "auto" }}
              >
                <Github size={18} />
              </button>

              {/* Live Link Button */}
              <button
                onClick={handleLinkClick(item.links.live_link)}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                className={`w-14 h-14 flex items-center justify-center rounded-full transition-all transform hover:scale-110 border cursor-pointer ${theme === 'dark'
                  ? 'bg-white hover:bg-zinc-200 text-black border-black/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  : 'bg-white hover:bg-zinc-50 text-zinc-900 border-zinc-200 shadow-md'
                  }`}
                style={{ pointerEvents: "auto" }}
              >
                <ExternalLink size={15} />
              </button>
            </div>

            <RopeBulb isOn={isLightOn} onClick={() => onImageOpen(item)} onHoverChange={setIsBulbHovered} />
          </div>

          {/* TOP FACE (3D Animation Version) */}
          <div
            className="absolute inset-0 backface-hidden"
            style={{
              transform: `rotateX(90deg) translateZ(${translateZ}px)`,
              // Hide this face once the 2D overlay takes over to prevent double-rendering/z-fighting
              visibility: isLightOn && !interactionReady ? "visible" : "hidden",
              pointerEvents: "none", // This version is purely for animation
              backfaceVisibility: "hidden",
            }}
          >
            <TopFaceContent
              item={item}
              toggleLight={toggleLight}
              onViewDetails={onViewDetails}
            />
          </div>
        </div>

        {/* 2D INTERACTION OVERLAY (Stable Click Target) */}
        {interactionReady && (
          <div
            className="absolute inset-0 z-50 animate-in fade-in duration-200"
            style={{ pointerEvents: "auto" }}
          >
            <TopFaceContent
              item={item}
              toggleLight={toggleLight}
              onViewDetails={onViewDetails}
            />
          </div>
        )}
      </div>
    </>
  );
});

export default Cube;
