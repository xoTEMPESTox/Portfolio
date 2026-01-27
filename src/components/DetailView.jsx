import React, { useState } from "react";
import { Clock, Eye, Heart, ArrowLeft } from "lucide-react";
import { useTheme } from "./HeaderBackground";

// --- Markdown Imports (Assumed available in the environment) ---
// Note: Changed import style to resolve module resolution error in the build environment.
// We assume these are globally available or imported via full URLs if necessary.
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // Keeping this structure but knowing the build environment will resolve it.
import "./MarkDown.css";

// --- 2. UTILITY FUNCTIONS ---

const formatViews = (num) => {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k views`;
  }
  return `${num} views`;
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// --- 3. COMPONENTS ---

// Custom component for the glow aesthetic

const DetailView = ({ post, onBack }) => {
    const { theme } = useTheme();
  
  if (!post) return <p className="text-red-400">Post not found.</p>;
  const [isLiking, setIsLiking] = useState(false);

  // --- HANDLER: Like Button ---
  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      const res = await fetch("/api/increment-like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: post.id }),
      });
      const data = await res.json();
      onUpdateStat(post.id, "likes", data.likes);
    } catch (err) {
      console.error("Like error", err);
    } finally {
      setIsLiking(false);
    }
  };

  const dateStr = formatDate(post.date);
  const viewsStr = post.views.toLocaleString();

  // Use inline style for dynamic background image
  const heroStyle = {
    backgroundImage: `url('${post.heroImage}')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <div className="pb-16" data-theme={theme}>
  <button
    onClick={onBack}
    className={`flex items-center space-x-2 mb-8 transition-all duration-200 active:scale-95 ${
      theme === 'dark' ? "text-slate-400 hover:text-slate-100" : "text-slate-800 hover:text-slate-900"
    }`}
  >
    <ArrowLeft className="w-5 h-5" /> <span>Back to Blog</span>
  </button>

  <div
    className={`relative min-h-auto rounded-[2rem] overflow-hidden shadow-2xl border pb-2 transition-colors duration-500 ${
      theme === 'dark' ? "bg-zinc-950 border-zinc-800" : "bg-white border-slate-200"
    }`}
    style={heroStyle}
  >
    <div
      className="absolute inset-0 z-10 transition-opacity duration-500"
      style={{
        background: theme === 'dark' 
          ? "linear-gradient(to top, rgba(9, 9, 11, 1) 0%, rgba(9, 9, 11, 0.8) 30%, rgba(0, 0, 0, 0) 100%)"
          : "linear-gradient(to top, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.8) 30%, rgba(255, 255, 255, 0) 100%)",
      }}
    ></div>

    <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-8 pt-24 pb-0 flex flex-col justify-end h-full">
      <div className="flex space-x-2 mb-6 mt-auto">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className={`text-sm uppercase tracking-wider font-bold px-3 py-1 rounded-md border transition-colors ${
              theme === 'dark' 
                ? "bg-zinc-900 text-slate-300 border-zinc-700" 
                : "bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            {tag}
          </span>
        ))}
      </div>

      <p className={`text-5xl sm:text-7xl font-black leading-tight mb-4 tracking-tighter transition-colors ${
        theme === 'dark' ? "text-slate-50" : "text-slate-900"
      }`}>
        {post.title}
      </p>
      <p className={`text-xl sm:text-2xl mb-10 max-w-3xl leading-relaxed transition-colors ${
        theme === 'dark' ? "text-slate-400" : "text-slate-600"
      }`}>
        {post.excerpt}
      </p>

      <div className="flex items-center space-x-4 mb-10">
        <img
          className={`w-14 h-14 rounded-full object-cover ring-2 transition-all ${
            theme === 'dark' 
              ? "ring-slate-700 shadow-[0_0_15px_rgba(255,255,255,0.1)]" 
              : "ring-slate-200 shadow-lg"
          }`}
          src="https://placehold.co/40x40/5d5d5d/ffffff?text=TC"
          alt={`Author ${post.author}`}
        />
        <div>
          <p className={`font-bold text-xl mb-0 ${theme === 'dark' ? "text-slate-100" : "text-slate-900"}`}>
            {post.author}
          </p>
          <p className="text-md text-slate-500 uppercase tracking-widest font-medium">
            {dateStr}
          </p>
        </div>
      </div>

      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center py-8 border-t text-lg transition-colors ${
        theme === 'dark' ? "border-zinc-800 text-slate-400" : "border-slate-100 text-slate-500"
      }`}>
        <div className="flex space-x-8 mb-4 sm:mb-0">
          <div className="flex items-center space-x-2">
            <Eye className="w-6 h-6 text-slate-500" />
            <span>{viewsStr} views</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-6 h-6 text-slate-500" />
            <span>{post.readTime} min read</span>
          </div>
        </div>

        <button
          onClick={handleLike}
          disabled={isLiking}
          className={`flex items-center space-x-2 group transition-all active:scale-90 px-6 py-2 rounded-full border ${
            theme === 'dark'
              ? "bg-zinc-900 border-zinc-800 hover:border-red-500/50"
              : "bg-slate-50 border-slate-200 hover:border-red-400"
          } ${isLiking ? "opacity-50" : ""}`}
        >
          <Heart className={`w-6 h-6 transition-all duration-300 ${
            post.likes > 0 ? "fill-red-500 text-red-500 scale-110" : "text-slate-500 group-hover:text-red-500"
          }`} />
          <span className={`${post.likes > 0 ? "text-red-500" : "text-slate-500"} font-bold`}>
            {post.likes.toLocaleString()} likes
          </span>
        </button>
      </div>
    </div>
  </div>

  <article className="max-w-4xl mx-auto mt-16 px-4 sm:px-0">
    <div className={`markdownBody prose max-w-none transition-colors duration-500 ${
      theme === 'dark' ? "prose-invert" : "prose-slate"
    }`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
    </div>
  </article>
</div>
  );
};

export default DetailView;
