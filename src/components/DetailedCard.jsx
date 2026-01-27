import React from "react";
import { X, Globe, Github } from "lucide-react";
import { useTheme } from "./HeaderBackground";

const TechBadge = ({ label, slug, color, iconColor }) => {
  // slug is the lowercase name of the tech (e.g., 'googlechrome', 'react')
  // color is the official hex (e.g., '4285F4')

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
        className={`w-5 h-5 mr-2 ${iconColor}`}
      />
      <span
        style={{ color: `#${color}` }}
        className="text-[13px] font-semibold"
      >
        {label}
      </span>
    </div>
  );
};

const DetailCard = ({ project, onClose }) => {
  if (!project) return null;
    const { theme } = useTheme();
  

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300 ${
  theme === 'dark' ? 'bg-black/80' : 'bg-zinc-900/40'
}`}>
  <div
    className={`w-full max-w-6xl mt-4 mb-[10rem] border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 transition-colors ${
      theme === 'dark' 
        ? 'bg-zinc-950 border-zinc-800 text-zinc-200' 
        : 'bg-white border-zinc-200 text-zinc-800'
    }`}
    onClick={(e) => e.stopPropagation()}
  >
    <header className={`p-6 pb-4 border-b flex justify-between items-start transition-colors ${
      theme === 'dark' 
        ? 'border-zinc-800/50 bg-gradient-to-b from-zinc-900/20 to-transparent' 
        : 'border-zinc-200 bg-zinc-50/50'
    }`}>
      <div>
        <div className="flex items-center space-x-3 mb-2">
          <h1 className={`text-2xl font-bold tracking-tight ${
            theme === 'dark' ? 'text-white' : 'text-zinc-900'
          }`}>
            {project.title}
          </h1>
        </div>
        <p className={`text-xl max-w-md ${
          theme === 'dark' ? 'text-[#eaeaea]' : 'text-zinc-600'
        }`}>
          {project.tagline}
        </p>
      </div>
      <button
        onClick={onClose}
        className={`transition-all p-2 rounded-xl ${
          theme === 'dark' 
            ? 'text-zinc-500 hover:text-white hover:bg-zinc-800' 
            : 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100'
        }`}
      >
        <X size={20} />
      </button>
    </header>

    <div className="p-6 space-y-0 max-h-[50vh] overflow-y-auto custom-scrollbar">
      <section className="p-4!">
        <h2 className={`text-xs font-bold uppercase tracking-widest ${
          theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'
        }`}>
          Description
        </h2>
        <p className={`leading-relaxed text-[15px] ${
          theme === 'dark' ? 'text-[#eaeaea]' : 'text-zinc-700'
        }`}>
          {project.description}
        </p>
      </section>

      <section className="p-4!">
        <h2 className={`text-xs font-bold uppercase tracking-widest ${
          theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'
        }`}>
          Tech Stack
        </h2>
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <TechBadge
              key={tech.name}
              slug={tech.slug}
              label={tech.name}
              iconColor={tech.iconColor}
              color={tech.color}
            />
          ))}
        </div>
      </section>

      <section className="p-4!">
        <h2 className={`text-xs font-bold uppercase tracking-widest ${
          theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'
        }`}>
          Key Highlights
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {project.highlights.map((item, index) => (
            <li
              key={index}
              className={`flex items-start space-x-3 p-3 rounded-lg border group transition-all ${
                theme === 'dark' 
                  ? 'bg-zinc-900/50 border-zinc-800/50 hover:border-zinc-600' 
                  : 'bg-zinc-50 border-zinc-200 hover:border-zinc-400'
              }`}
            >
              <span className={`mt-2 h-1 w-1 rounded-full shrink-0 transition-all ${
                theme === 'dark' ? 'bg-white shadow-[0_0_8px_white]' : 'bg-zinc-900'
              }`} />
              <span className={`text-lg leading-snug transition-colors ${
                theme === 'dark' ? 'text-[#eaeaea] group-hover:text-white' : 'text-zinc-700 group-hover:text-zinc-950'
              }`}>
                {item}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>

    <footer className={`p-6 border-t flex gap-4 transition-colors ${
      theme === 'dark' ? 'border-zinc-800/50 bg-zinc-950/50' : 'border-zinc-200 bg-zinc-50/50'
    }`}>
      <button
        onClick={() => window.open(project.links.github_link, "_blank")}
        className={`flex-1 font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center space-x-2 border active:scale-[0.98] ${
          theme === 'dark'
            ? 'bg-zinc-900 hover:bg-zinc-800 text-white border-zinc-800'
            : 'bg-white hover:bg-zinc-50 text-zinc-900 border-zinc-200 shadow-sm'
        }`}
      >
        <Github size={18} />
        <span>GitHub</span>
      </button>
      <button
        onClick={() => window.open(project.links.live_link, "_blank")}
        className={`flex-[2] font-semibold py-3 px-6 rounded-xl transition-all shadow-lg flex items-center justify-center space-x-2 active:scale-[0.98] ${
          theme === 'dark'
            ? 'bg-white hover:bg-zinc-200 text-black shadow-white/5'
            : 'bg-zinc-900 hover:bg-black text-white shadow-zinc-200'
        }`}
      >
        <Globe size={18} />
        <span>Visit Project</span>
      </button>
    </footer>
  </div>

  <style
    dangerouslySetInnerHTML={{
      __html: `
    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: ${theme === 'dark' ? '#3f3f46' : '#d4d4d8'};
      border-radius: 10px;
    }
  `,
    }}
  />
</div>
  );
};

export default DetailCard;
