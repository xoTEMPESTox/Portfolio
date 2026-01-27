import React, { useEffect } from "react";
import { Search } from "lucide-react";
import { useTheme } from "./HeaderBackground";

// --- 3. COMPONENTS ---

// Custom component for the glow aesthetic
const BlogHeader = ({ search, setSearch, setFilters }) => {
  const { theme } = useTheme();

  // Handle shift+s shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.shiftKey && e.key === "S") {
        e.preventDefault();
        document.getElementById("search-input").focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearch(newSearchTerm);
  };

  return (
    <header className="max-w-3xl mx-auto text-center mb-20">
      <div
        className={`inline-block p-4 rounded-2xl mb-8 transition-all duration-300 border ${theme === "dark"
          ? "bg-zinc-950 border-zinc-800 shadow-2xl shadow-white/5"
          : "bg-white border-slate-200 shadow-xl shadow-slate-200/50"
          }`}
      >
        <svg
          className={`w-8 h-8 ${theme === "dark" ? "text-slate-100" : "text-slate-900"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          ></path>
        </svg>
      </div>

      <h1 className="text-6xl sm:text-8xl font-black mb-6 tracking-tighter">
        <span className="text-slate-500">The</span>
        <span
          className={`transition-all duration-500 ${theme === "dark"
            ? "text-slate-50 drop-shadow-[0_0_25px_rgba(255,255,255,0.15)]"
            : "text-slate-900 drop-shadow-none"
            }`}
        >
          Blog
        </span>
      </h1>

      <p
        className={`text-lg sm:text-xl mb-12 max-w-xl mx-auto leading-relaxed ${theme === "dark" ? "text-slate-400" : "text-slate-600"
          }`}
      >
        Thoughts, mental models, and tutorials about{" "}
        <span className={theme === "dark" ? "text-slate-100" : "text-slate-900"}>
          AI & ML, Full Stack, & Robotics
        </span>
        .
      </p>

      <div
        className={`relative flex items-center w-full max-w-xl mx-auto p-1.5 rounded-2xl transition-all duration-500 border ${theme === "dark"
          ? "bg-zinc-950 border-zinc-800 focus-within:border-slate-500 focus-within:shadow-[0_0_30px_rgba(255,255,255,0.05)]"
          : "bg-white border-slate-200 focus-within:border-slate-400 focus-within:shadow-[0_10px_30px_rgba(0,0,0,0.05)]"
          }`}
      >
        <div className="flex-shrink-0 pl-4">
          <Search className={`w-5 h-5 ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`} />
        </div>

        <input
          type="text"
          id="search-input"
          placeholder="Search titles, tags, or topics..."
          /* Added pr-20 to ensure text doesn't type 'under' the absolute button */
          className={`flex-grow min-w-0 bg-transparent text-lg py-3 px-3 pr-20 focus:outline-none ${theme === "dark"
            ? "text-slate-100 placeholder-slate-600"
            : "text-slate-900 placeholder-slate-400"
            }`}
          value={search}
          onChange={handleChange}
        />

        {/* FIXED POSITIONING: Using absolute and right-4 to lock it in place */}
        <div
          className={`hidden sm:flex absolute right-4 items-center space-x-1 text-[10px] font-bold px-2.5 py-1.5 rounded-lg border uppercase tracking-widest whitespace-nowrap pointer-events-none ${theme === "dark"
            ? "text-slate-400 bg-zinc-900 border-zinc-800"
            : "text-slate-500 bg-slate-50 border-slate-200"
            }`}
        >
          <span>Shift</span>
          <span>S</span>
        </div>
      </div>
    </header>
  );
};

export default BlogHeader;
