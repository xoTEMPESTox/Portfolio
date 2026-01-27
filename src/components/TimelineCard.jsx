import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "./HeaderBackground";

const TimelineCard = ({ item, isLeft, progressRatio, effectivePos, effectiveThreshold, borderColor }) => {
  const cardRef = useRef(null);
    const { theme } = useTheme(); 
  
  // Use the passed "effectivePos" (which handles mobile vs desktop logic)
  // Use "effectiveThreshold" to determine how long it stays visible
  const isActive = progressRatio >= effectivePos && progressRatio <= effectivePos + effectiveThreshold;

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty(
      "--mouse-x",
      `${e.clientX - rect.left}px`
    );
    cardRef.current.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };



  return (
   <div
  className="absolute w-full px-4 md:px-0"
  style={{ top: `${effectivePos * 100}%`, transform: "translateY(-50%)" }}
>
  <div
    ref={cardRef}
    onMouseMove={handleMouseMove}
    className={`relative p-8 md:p-10 rounded-3xl border-2 transition-all duration-700 ease-out transform backdrop-blur-sm m-0 w-[100%] max-w-[85%]
      ${isActive
        ? "opacity-100 translate-y-0 scale-100"
        : "opacity-0 translate-y-16 scale-95 pointer-events-none"
      } 
      ${theme === 'dark' 
        ? `bg-black/90 border-white/5 ${borderColor}` 
        : `bg-white/80 border-slate-200 shadow-xl ${borderColor.replace('white/10', 'blue-200')}`
      }`}
    style={{
      backgroundImage: theme === 'dark' 
        ? `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(59, 130, 246, 0.15), transparent 60%)`
        : `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(59, 130, 246, 0.28), transparent 60%)`,
      marginLeft: isLeft ? "5rem" : "0",
      marginRight: !isLeft ? "5rem" : "0",
    }}
  >
    <div className="flex flex-col gap-2">
      <h3 className={`font-bold text-xl md:text-2xl tracking-tight transition-colors ${
        theme === 'dark' ? "text-white" : "text-slate-900"
      }`}>
        {item.title}
      </h3>
      
      <p className={`font-bold text-base md:text-xl transition-colors ${
        item.type === "edu" 
          ? (theme === 'dark' ? "text-blue-400" : "text-blue-600") 
          : (theme === 'dark' ? "text-purple-400" : "text-purple-600")
      }`}>
        {item.subtitle}
      </p>

      <p className={`text-xl mt-4 leading-relaxed font-normal transition-colors ${
        theme === 'dark' ? "text-gray-300" : "text-gray-600"
      }`}>
        {item.description}
      </p>

      <div className={`mt-6 pt-6 flex justify-between items-center border-t ${
        theme === 'dark' ? "border-white/10" : "border-slate-100"
      }`}>
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              item.type === "edu" 
                ? (theme === 'dark' ? "bg-blue-500" : "bg-blue-600") 
                : (theme === 'dark' ? "bg-purple-500" : "bg-purple-600")
            }`}
          ></div>
          <span className={`text-sm md:text-lg mb-0! font-mono tracking-widest uppercase font-bold transition-colors ${
            theme === 'dark' ? "text-gray-500" : "text-slate-600"
          }`}>
            {item.date}
          </span>
        </div>

        <span
          className={`text-[10px] md:text-xl font-mono uppercase px-4 py-1.5 rounded-md transition-all ${
            theme === 'dark' 
              ? "bg-white/5" 
              : "bg-slate-100 shadow-sm"
          } ${
            item.type === "edu" 
              ? (theme === 'dark' ? "text-blue-400" : "text-blue-600") 
              : (theme === 'dark' ? "text-purple-400" : "text-purple-600")
          }`}
        >
          {item.tag || (item.type === "edu" ? "Undergrad" : "Internship")}
        </span>
      </div>
    </div>
  </div>
</div>
  );
};

export default TimelineCard;
