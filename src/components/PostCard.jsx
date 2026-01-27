import React from "react";
import { Clock, Eye } from "lucide-react";
import { useTheme } from "./HeaderBackground";

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

// --- 3. COMPONENT ---

const PostCard = ({ post, onPostClick }) => {
  const { theme } = useTheme();

  const dateStr = formatDate(post.date);
  const viewsStr = formatViews(post.views);

  return (
    <article
  className={`flex flex-col sm:flex-row justify-between items-start py-8 px-8 mb-8 cursor-pointer 
              transition-all duration-300 rounded-2xl border group backdrop-blur-sm shadow-sm ${
                theme === 'dark' 
                  ? "bg-zinc-900/40 hover:bg-zinc-800/60 border-zinc-800/50 hover:border-zinc-600" 
                  : "bg-white/10 backdrop-blur-sm hover:bg-slate-50 border-slate-200 hover:border-slate-300 shadow-slate-200/80"
              }`}
  onClick={() => onPostClick(post.id)}
>
  {/* Text Content */}
  <div className="flex-grow pr-0 sm:pr-8 mb-4 sm:mb-0">
    <p className={`text-sm font-medium mb-2 tracking-wide uppercase transition-colors ${
      theme === 'dark' ? "text-slate-500" : "text-slate-800"
    }`}>
      {dateStr}
    </p>

    <h2 className={`text-3xl font-bold leading-tight transition-colors duration-300 ${
      theme === 'dark' 
        ? "text-white group-hover:text-slate-300" 
        : "text-slate-900 group-hover:text-slate-700"
    }`}>
      {post.title}
    </h2>

    <p className={`text-base mt-3 leading-relaxed transition-colors ${
      theme === 'dark' ? "text-slate-400" : "text-slate-600"
    }`}>
      {post.excerpt}
    </p>

    {/* Metadata and Tags Container */}
    <div className={`flex flex-wrap items-center justify-start mt-6 space-x-6 text-sm transition-colors ${
      theme === 'dark' ? "text-slate-500" : "text-slate-800"
    }`}>
      {/* Read Time */}
      <div className="flex items-center space-x-1.5">
        <Clock className="w-4 h-4" />
        <span>{post.readTime} min read</span>
      </div>

      {/* View Count */}
      <div className="flex items-center space-x-1.5">
        <Eye className="w-4 h-4" />
        <span>{viewsStr}</span>
      </div>

      {/* Tags: Greyscale theme */}
      <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className={`text-xs font-medium px-3 py-1 rounded-md border transition-all ${
              theme === 'dark' 
                ? "bg-zinc-800/80 text-slate-300 border-zinc-700 group-hover:border-zinc-500" 
                : "bg-slate-100 text-slate-600 border-slate-200 group-hover:bg-slate-200"
            }`}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  </div>

  {/* Image Thumbnail */}
  <div className="flex-shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
    <img
      className={`w-full h-80 sm:w-40 sm:h-40 object-cover rounded-xl grayscale group-hover:grayscale-0 
                 transition-all duration-500 shadow-xl border ${
                   theme === 'dark' ? "border-zinc-800" : "border-slate-200"
                 }`}
      src={post.imageUrl}
      alt={`${post.title} thumbnail`}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = "https://placehold.co/160x160/1a1a1a/ffffff?text=Post";
      }}
    />
  </div>
</article>
  );
};

export default PostCard;
