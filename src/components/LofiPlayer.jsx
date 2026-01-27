import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  SkipBack,
  SkipForward,
  Pause,
  ChevronDown,
  SlidersVertical,
  ListMusic,
  VolumeX,
} from "lucide-react";
import { useTheme } from "./HeaderBackground";

export const LoFiPlayer = ({
  isExpanded,
  onCollapse,
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  onPlayPause,
  onNext,
  onPrev,
  isMenuOpen,
  onMenuToggle,
  onTrackSelect,
  tracks,
  trackIndex,
  volume,
  onVolumeChange,
}) => {
  const [showVolume, setShowVolume] = useState(false);
  const volumeRef = useRef(null);
  const { theme } = useTheme();

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const volumePercentage = volume * 100;

  const playerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // 1. Handle Volume Click Outside (existing logic)
      if (volumeRef.current && !volumeRef.current.contains(event.target)) {
        setShowVolume(false);
      }

      // 2. Handle Player Click Outside (new logic)
      // Check if the click is OUTSIDE the player container
      if (playerRef.current && !playerRef.current.contains(event.target)) {
        onCollapse();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onCollapse]);

  const formatTime = (timeInSeconds) => {
    if (
      isNaN(timeInSeconds) ||
      timeInSeconds === null ||
      timeInSeconds === undefined
    ) {
      return "--:--";
    }
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div
      ref={playerRef}
      className="relative h-full w-full rounded-[2.5rem] overflow-hidden p-[1rem]"
    >
      <div
        className={`absolute inset-0 pointer-events-none transition-colors duration-500 ${theme === "dark" ? "bg-[#000000]" : "bg-slate-50"
          }`}
        style={{
          filter:
            theme === "dark"
              ? "url(#nnnoise-filter)"
              : "url(#nnnoise-filter-black)",
        }}
      />

      <div
        id="lofi-player"
        className="w-full bg-transparent rounded-[2.5rem] border-4 border-transparent relative overflow-hidden"
      >
        {/* --- Menu Overlay --- */}
        <div
          className={`menu-overlay z-20 rounded-[2.5rem] p-6 flex flex-col overflow-x-hidden transition-all duration-300 border ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
            } ${theme === "dark"
              ? "bg-black/90 border-white/5"
              : "bg-white/95 border-black/5 shadow-2xl"
            }`}
        >
          <div className="flex justify-between items-center mb-6">
            <p className={`font-mono font-bold text-xl md:text-2xl uppercase tracking-widest flex items-center mb-0 transition-colors ${theme === "dark" ? "text-white" : "text-black"
              }`}>
              <ListMusic className="w-8 h-8 mr-2 text-purple-500" /> Track List
            </p>
            <button
              onClick={onMenuToggle}
              className={`p-2 rounded-full active:scale-95 transition-all shadow-md border ${theme === "dark"
                ? "bg-white/5 border-white/20 text-white hover:border-purple-500 hover:bg-white/10"
                : "bg-black/5 border-black/10 text-black hover:border-purple-600 hover:bg-black/10"
                }`}
            >
              <ChevronDown className="w-5 h-5 rotate-90 rounded-full fill-current" />
            </button>
          </div>

          <ul className="flex-1 overflow-y-auto overflow-x-hidden space-y-2 pr-2 custom-scrollbar">
            {tracks.map((track, index) => {
              const isActive = trackIndex === index;
              return (
                <li
                  key={track.id}
                  onClick={() => onTrackSelect(index)}
                  className={`p-3 rounded-xl cursor-pointer transition-all border-2 ${isActive
                    ? "border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)] " +
                    (theme === "dark" ? "bg-white/10 text-white" : "bg-purple-50 text-purple-700")
                    : (theme === "dark" ? "bg-white/5 text-white/60 border-transparent hover:bg-white/10" : "bg-black/5 text-black/60 border-transparent hover:bg-black/10")
                    }`}
                >
                  <div className="font-semibold text-sm md:text-base truncate">
                    {track.title}
                  </div>
                  <div
                    className={`text-xs ${isActive
                      ? (theme === "dark" ? "text-purple-300" : "text-purple-500")
                      : "opacity-60"
                      }`}
                  >
                    {track.artist} - {formatTime(track.duration)}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Header */}
        <div className={`w-full rounded-xl rounded-t-[2.5rem] px-4 py-2 mb-3 shadow-md border transition-colors duration-300 ${theme === "dark"
          ? "bg-white/5 border-white/10"
          : "bg-black/5 border-black/10"
          }`}>
          <div className="flex justify-between items-center relative">
            <div className="w-6 h-6"></div>

            <h1 className={`font-mono text-lg md:text-xl uppercase tracking-widest text-center flex-1 truncate transition-colors ${theme === "dark" ? "text-white" : "text-black"
              }`}>
              {currentTrack.title}
            </h1>

            <button
              onClick={onCollapse}
              className={`p-1 rounded-full active:scale-95 transition-all shadow-inner border ${theme === "dark"
                ? "bg-white/10 text-white hover:bg-white/20 border-white/20"
                : "bg-black/10 text-black hover:bg-black/20 border-black/20"
                }`}
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Media Window */}

        <div className={`w-full aspect-[3/4] rounded-xl overflow-hidden relative shadow-inner border-2 transition-colors duration-300 ${theme === "dark"
          ? "bg-neutral-900 border-white/5"
          : "bg-gray-100 border-black/5"
          }`}>
          <img
            src={currentTrack.img}
            alt={currentTrack.title}
            className={`w-full h-full object-cover transition-opacity duration-500 ${theme === "dark" ? "opacity-80" : "opacity-100"
              }`}
          />

          <div className="absolute bottom-0 left-0 right-0 p-4">
            {/* Progress Bar Container */}
            <div className={`h-1.5 w-full rounded-full mb-2 relative group cursor-pointer transition-colors ${theme === "dark" ? "bg-white/10" : "bg-black/10"
              }`}>
              {/* Highlight Gradient */}
              <div
                className={`h-full rounded-full transition-all duration-100 ease-linear ${theme === "dark"
                  ? "bg-gradient-to-r from-white to-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                  : "bg-gradient-to-r from-purple-400 to-purple-600 shadow-[0_0_8px_rgba(168,85,247,0.3)]"
                  }`}
                style={{ width: `${progressPercent}%` }}
              />
              {/* Progress Handle */}
              <div
                className={`absolute top-1/2 -mt-1.5 w-3 h-3 rounded-full shadow-xl transition-all duration-100 ease-linear group-hover:scale-125 ${theme === "dark" ? "bg-white" : "bg-purple-600"
                  }`}
                style={{
                  left: `${progressPercent}%`,
                  transform: "translateX(-50%)",
                }}
              />
            </div>

            {/* Time Indicator */}
            <div className={`flex justify-between items-center text-lg transition-colors ${theme === "dark" ? "text-white/80" : "text-black/70"
              }`}>
              <span className="font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
          </div>
        </div>

        {/* Controls Panel */}
        <div className={`w-full p-3 md:p-4 mt-3 rounded-xl rounded-b-[2.5rem] relative z-30 transition-colors duration-300 border shadow-md ${theme === "dark"
          ? "bg-white/5 border-white/10 shadow-black/40"
          : "bg-black/5 border-black/10 shadow-gray-200"
          }`}>
          <div className="flex justify-between items-center">
            <button
              onClick={onMenuToggle}
              className={`icon-btn text-xs md:text-xl font-mono px-2 py-1 md:px-4 md:py-2 shadow-inner font-bold rounded-lg transition-colors border ${theme === "dark"
                ? "bg-white/5 border-white/20 text-white hover:border-purple-500 hover:text-purple-500"
                : "bg-black/5 border-black/10 text-black hover:border-purple-600 hover:text-purple-600"
                }`}
            >
              Menu
            </button>

            <div className="flex items-center space-x-1 md:space-x-3">
              {/* Prev Button */}
              <button
                onClick={onPrev}
                className={`icon-btn p-1.5 md:p-2 rounded-full border transition-all active:scale-95 ${theme === "dark"
                  ? "bg-white/5 text-white/60 hover:text-purple-500 hover:border-purple-500 border-white/10"
                  : "bg-black/5 text-black/60 hover:text-purple-600 hover:border-purple-600 border-black/10"
                  }`}
              >
                <SkipBack className="w-6 h-6 fill-current" />
              </button>

              {/* Play/Pause Button */}
              <button
                onClick={onPlayPause}
                className={`icon-btn p-1.5 md:p-2 rounded-full border transition-all active:scale-95 ${theme === "dark"
                  ? "bg-white/5 text-white/60 hover:text-purple-500 hover:border-purple-500 border-white/10"
                  : "bg-black/5 text-black/60 hover:text-purple-600 hover:border-purple-600 border-black/10"
                  }`}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 fill-current" />
                ) : (
                  <Play className="w-6 h-6 fill-current" />
                )}
              </button>

              {/* Next Button */}
              <button
                onClick={onNext}
                className={`icon-btn p-1.5 md:p-2 rounded-full border transition-all active:scale-95 ${theme === "dark"
                  ? "bg-white/5 text-white/60 hover:text-purple-500 hover:border-purple-500 border-white/10"
                  : "bg-black/5 text-black/60 hover:text-purple-600 hover:border-purple-600 border-black/10"
                  }`}
              >
                <SkipForward className="w-6 h-6 fill-current" />
              </button>
            </div>

            {/* --- VOLUME CONTROLLER --- */}
            <div className="relative flex items-center" ref={volumeRef}>
              {showVolume && (
                <div
                  className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-16 backdrop-blur-sm p-3 pb-4 rounded-2xl shadow-2xl z-50 flex flex-col items-center transition-colors duration-300 border ${theme === "dark"
                    ? "bg-neutral-900/95 border-white/10"
                    : "bg-white/95 border-black/10"
                    }`}
                >
                  <div className="relative h-32 w-full flex justify-center items-center">
                    {/* Track Background */}
                    <div className={`absolute w-1.5 h-full rounded-full overflow-hidden ${theme === "dark" ? "bg-white/10" : "bg-black/10"
                      }`}>
                      {/* Highlight Gradient - Adjusted 'to' color for light mode visibility */}
                      <div
                        className={`absolute bottom-0 w-full bg-gradient-to-t transition-all duration-75 ${theme === "dark" ? "from-purple-600 to-white" : "from-purple-600 to-purple-400"
                          }`}
                        style={{ height: `${volumePercentage}%` }}
                      />
                    </div>

                    {/* Slider Thumb */}
                    <div
                      className={`absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full shadow-lg pointer-events-none transition-all duration-75 border-2 ${theme === "dark"
                        ? "bg-white border-neutral-800"
                        : "bg-purple-600 border-white"
                        }`}
                      style={{ bottom: `calc(${volumePercentage}% - 8px)` }}
                    />

                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={onVolumeChange}
                      className="absolute w-[128px] h-8 opacity-0 cursor-pointer appearance-none -rotate-90 origin-center z-10 focus:outline-none bg-transparent"
                      style={{ touchAction: "none" }}
                    />
                  </div>

                  {/* Percentage Text */}
                  <span className={`text-[10px] font-mono font-bold mt-3 tabular-nums ${theme === "dark" ? "text-white/70" : "text-black/70"
                    }`}>
                    {Math.round(volumePercentage)}%
                  </span>
                </div>
              )}

              <button
                onClick={() => setShowVolume(!showVolume)}
                className={`icon-btn p-2 rounded-full flex items-center justify-center transition-all duration-300 ${showVolume
                  ? `scale-110 border ${theme === "dark"
                    ? "text-purple-600 shadow-[0_0_15px_rgba(168,85,247,0.4)] border-purple-500"
                    : "text-purple-700 shadow-md border-purple-300"
                  }`
                  : `transition-transform active:scale-95 border rounded-full ${theme === "dark"
                    ? "bg-white/5 text-white/60 hover:text-white border-white/10"
                    : "bg-black/5 text-black/60 hover:text-black border-black/10"
                  }`
                  }`}
              >
                {volume === 0 ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <SlidersVertical className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
