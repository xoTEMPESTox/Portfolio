import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Calendar,
  ChevronDown,
} from "lucide-react";
import { useTheme } from "./HeaderBackground";

// --- Markdown Imports (Assumed available in the environment) ---
// Note: Changed import style to resolve module resolution error in the build environment.
// We assume these are globally available or imported via full URLs if necessary.

// --- 1. DATA (Now using Markdown for post body) ---
const BLOG_POSTS = [
  {
    id: 1,
    title: "The 2024 Retrospective",
    date: "2024-12-31",
    excerpt:
      "First Full-Time Year, Solo Travel while Working, Socializing, and more!",
    readTime: 10,
    views: 4097,
    tags: ["retro", "life"],
    imageUrl: "https://placehold.co/144x144/222222/FFD700?text=2024",
    heroImage: "https://placehold.co/1200x500/0a0a0a/34d399?text=2024+Review",
    author: "Theodorus Clarence",
    likes: 512,
    body: `# The Retrospective: A Year of Growth

This is the full retrospective post content. A detailed look at the year's achievements and lessons learned, covering everything from professional growth to personal travels and social life.

### Career Milestones
* Completed the first full year as a Senior Front-End Engineer.
* Successfully mentored two junior developers on the team.
* Presented at a small local tech conference on React performance.

### Solo Travel & Work
I spent three months traveling across Southeast Asia while maintaining a full-time remote workload. This required strict time management and excellent communication.

> "The hardest part of remote work is knowing when to stop, especially when the beach is calling."

We can clearly see the benefits of modern development environments:
\`\`\`javascript
// Example of a code block in Markdown
const calculateDaysUntilNewYear = (today) => {
    const endOfYear = new Date(today.getFullYear() + 1, 0, 1);
    return Math.ceil((endOfYear - today) / (1000 * 60 * 60 * 24));
};
console.log(calculateDaysUntilNewYear(new Date()));
\`\`\`

This year has set the foundation for even greater things to come, and I'm very excited for 2025!`,
  },
  {
    id: 2,
    title: "List Animation using Motion for React",
    date: "2024-12-17",
    excerpt:
      "An in-depth guide on how to animate enter and exit animation for list using Motion for React (previously Framer Motion).",
    readTime: 6,
    views: 7228,
    tags: ["react", "animation"],
    imageUrl: "https://placehold.co/144x144/282a36/F8F8F2?text=Motion",
    heroImage: "https://placehold.co/1200x500/1e293b/a5f3fc?text=React+Motion",
    author: "Theodorus Clarence",
    likes: 220,
    body: `# Mastering Motion for Seamless Lists

A comprehensive tutorial on creating fluid and beautiful list transitions in React using the latest techniques from [Motion for React](https://www.framer.com/motion/). This guide covers keyframes, layout preservation, and performance optimization. It's a must-read for serious front-end developers.

## Key Techniques Comparison
| Feature | Benefit | Example Hook |
| :--- | :--- | :--- |
| **Keyframes** | Fine-grained control over transitions | \`useAnimationControls\` |
| **Layout** | Prevents Cumulative Layout Shift (CLS) | \`<motion.div layout/>\` |
| **Gestures** | Adds interaction (tap, hover) | \`whileTap\`, \`whileHover\` |

### Performance Tips
The use of \`will-change: transform\` is often done automatically by the library, which significantly reduces the paint load on the GPU. Always ensure you are using stable keys for your list items to help React and Motion track elements correctly.

For more complex examples, check out the official [GitHub Repository](https://github.com/framer/motion).`,
  },
  {
    id: 3,
    title: "CSS Grid vs. Flexbox: A modern guide",
    date: "2024-11-25",
    excerpt:
      "When to use Grid for two-dimensional layouts and when Flexbox is sufficient for one-dimensional flows.",
    readTime: 8,
    views: 5100,
    tags: ["css", "grid", "flexbox"],
    imageUrl: "https://placehold.co/144x144/334155/e0f7fa?text=Layout",
    body: "Deep dive into the differences between CSS Grid and Flexbox. We look at real-world examples and common anti-patterns to ensure you choose the right tool for the job. Mastering both is key to modern web development.",
    heroImage: "https://placehold.co/1200x500/0f172a/94a3b8?text=Grid+vs+Flex",
    author: "Theodorus Clarence",
    likes: 350,
  },
  {
    id: 4,
    title: "Vite for Next-Gen Front-End Setup",
    date: "2024-10-10",
    excerpt:
      "How Vite revolutionized my development workflow and its benefits over traditional bundlers like Webpack.",
    readTime: 5,
    views: 3200,
    tags: ["vite", "tools", "setup"],
    imageUrl: "https://placehold.co/144x144/475569/cbd5e1?text=Vite",
    body: "Exploring the speed and simplicity of Vite.js. We cover configuration, hot module replacement, and deploying a Vite-powered application. This tool drastically reduces build times.",
    heroImage: "https://placehold.co/1200x500/1f2937/d1d5db?text=Vite+Setup",
    author: "Theodorus Clarence",
    likes: 180,
  },
];

const ALL_TAGS = [...new Set(BLOG_POSTS.flatMap((post) => post.tags))].sort();

// --- 3. COMPONENTS ---

// Custom component for the glow aesthetic

const FilterSidebar = ({ filters, setFilters }) => {
      const { theme } = useTheme();
  
  const toggleSortDirection = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      sortDir: prev.sortDir === "desc" ? "asc" : "desc",
    }));
  }, [setFilters]);

  const toggleTagFilter = useCallback(
    (tag) => {
      setFilters((prev) => {
        const currentTags = prev.tags;
        const newTags = currentTags.includes(tag)
          ? currentTags.filter((t) => t !== tag)
          : [...currentTags, tag];

        return {
          ...prev,
          tags: newTags,
        };
      });
    },
    [setFilters]
  );

  const { sortDir, tags } = filters;
  const sortText =
    sortDir === "desc" ? "Sort by date (Newest)" : "Sort by date (Oldest)";
  const iconRotation = sortDir === "desc" ? "rotate-0" : "rotate-180";

  return (
    <aside className="md:col-span-1 order-1 md:order-none">
  <div
    onClick={toggleSortDirection}
    className={`sort-button w-full cursor-pointer p-4 rounded-xl transition-all duration-300 active:scale-[.98] mb-6 border ${
      theme === 'dark' 
        ? 'bg-zinc-950 border-zinc-800 shadow-xl hover:border-slate-500 hover:shadow-white/5' 
        : 'bg-white border-slate-200 shadow-lg hover:border-slate-400 hover:shadow-slate-200'
    }`}
  >
    <div className={`flex items-center justify-between text-lg font-medium transition-colors ${
      theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
    }`}>
      <div className="flex items-center space-x-3">
        <Calendar className={`w-6 h-6 ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`} />
        <span id="sort-text" className="tracking-tight">
          {sortText}
        </span>
      </div>
      <ChevronDown
        className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${iconRotation}`}
      />
    </div>
  </div>

  <div className="mt-12">
    <h3 className="text-sm uppercase tracking-[0.2em] font-bold mb-6 text-slate-500">
      Filter by topics
    </h3>

    <div className="flex flex-wrap gap-2.5">
      {ALL_TAGS.map((tag) => {
        const isActive = tags.includes(tag);

        // Conditional classes based on theme and active state
        const activeClass = isActive
          ? (theme === 'dark' 
              ? "bg-slate-100 text-zinc-950 shadow-lg shadow-white/5 border-white ring-1 ring-white font-bold" 
              : "bg-slate-900 text-white shadow-lg shadow-slate-300 border-slate-900 ring-1 ring-slate-900 font-bold")
          : (theme === 'dark'
              ? "bg-zinc-900 text-slate-400 border-zinc-800 hover:bg-zinc-800 hover:text-slate-100 hover:border-slate-500"
              : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-white hover:text-slate-900 hover:border-slate-400");

        return (
          <button
            key={tag}
            onClick={() => toggleTagFilter(tag)}
            className={`topic-tag px-4 py-2 text-xs uppercase tracking-wider rounded-md border transition-all duration-300 ${activeClass}`}
          >
            {tag}
          </button>
        );
      })}
    </div>
  </div>
</aside>
  );
};

export default FilterSidebar;
