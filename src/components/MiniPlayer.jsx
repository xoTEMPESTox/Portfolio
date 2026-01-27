import React, { useState, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipForward,
  SkipBack,
} from "lucide-react";
import { useTheme } from "./HeaderBackground";

const verticalTextStyle = {
  writingMode: "vertical-rl",
  transform: "rotate(270deg)",
  whiteSpace: "nowrap",
};

// --- MiniPlayer Component (Minimized View) ---
export const MiniPlayer = ({
  onExpand,
  currentTrack,
  isPlaying,
  handleAudioPlay,
  onNext,
  onPrev,
}) => {
  const { theme } = useTheme();

  return (
    <div className="relative h-full w-full overflow-hidden" data-theme={theme}>
      {/* Background - theme-dependent color */}
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
        id="mini-player-content"
        className="relative flex flex-row items-center justify-between lg:flex-col lg:rotate-180 h-full w-full px-4 lg:p-2"
      >
        <div
          className={`w-10 h-10 lg:w-16 lg:h-16 rounded-lg lg:-rotate-90 shadow-md flex-shrink-0 overflow-hidden cursor-pointer active:scale-95 transition ${theme === "dark" ? "shadow-black" : "shadow-gray-200"
            }`}
          onClick={onExpand}
        >
          <img
            src={currentTrack.img}
            alt="Album Art"
            className="w-full h-full object-cover"
          />
        </div>

        <div
          className="flex-grow flex flex-col items-center justify-center px-4 overflow-hidden cursor-pointer select-none"
          onClick={onExpand}
        >
          <div
            className="w-full flex flex-col items-center justify-center lg:vertical-rl lg:-rotate-90 lg:space-y-1 truncate group"
            style={verticalTextStyle}
          >
            <p className={`w-full text-center text-xs lg:text-xl font-bold tracking-wide truncate transition-colors ${theme === "dark" ? "text-white opacity-80 group-hover:opacity-100" : "text-black opacity-80 group-hover:opacity-100"
              }`}>
              {currentTrack.title}
            </p>
            <p className={`w-full text-center text-[10px] lg:text-lg truncate transition-colors ${theme === "dark" ? "text-white opacity-70" : "text-gray-600"
              }`}>
              {currentTrack.artist}
            </p>
          </div>
        </div>

        <div className="flex flex-row items-center justify-center lg:flex lg:flex-col lg:items-center lg:justify-between lg:rotate-180 space-x-2 lg:space-x-0 lg:space-y-4 flex-shrink-0">
          {/* Prev Button */}
          {/* <button onClick={onPrev} className="group relative p-2 active:scale-95 transition-all duration-300 flex-shrink-0">
            <div className={`absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-75 group-hover:scale-110 ${theme === "dark" ? "bg-white/10" : "bg-black/5"
              }`} />
            <div className="relative z-10 transition-transform duration-300 group-hover:scale-110">
              <SkipBack className={`w-5 h-5 lg:w-7 lg:h-7 fill-current rotate-180 lg:rotate-90 transition-colors duration-300 ${theme === "dark" ? "text-gray-400 group-hover:text-white" : "text-gray-400 group-hover:text-black"
                }`} />
            </div>
          </button> */}

          {/* Play Button */}
          <button onClick={handleAudioPlay} className="group relative p-2 lg:p-3 rounded-full active:scale-95 transition-all duration-300 flex-shrink-0">
            <div className={`absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${theme === "dark" ? "bg-white/20" : "bg-black/10"
              }`} />
            <div className="relative z-10 transition-transform duration-300 group-hover:scale-110">
              {isPlaying ? (
                <Pause className={`w-6 h-6 lg:w-8 lg:h-8 fill-current transition-colors duration-300 lg:rotate-90 ${theme === "dark" ? "text-gray-400 group-hover:text-white" : "text-gray-400 group-hover:text-black"
                  }`} />
              ) : (
                <Play className={`w-6 h-6 lg:w-8 lg:h-8 fill-current transition-colors duration-300 lg:rotate-90 ${theme === "dark" ? "text-gray-400 group-hover:text-white" : "text-gray-400 group-hover:text-black"
                  }`} />
              )}
            </div>
          </button>

          {/* Next Button */}
          <button onClick={onNext} className="group relative p-2 active:scale-95 transition-all duration-300 flex-shrink-0">
            <div className={`absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-75 group-hover:scale-110 ${theme === "dark" ? "bg-white/10" : "bg-black/5"
              }`} />
            <div className="relative z-10 transition-transform duration-300 group-hover:scale-110">
              <SkipForward className={`w-5 h-5 lg:w-7 lg:h-7 fill-current rotate-0 lg:rotate-90 transition-colors duration-300 ${theme === "dark" ? "text-gray-400 group-hover:text-white" : "text-gray-400 group-hover:text-black"
                }`} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
