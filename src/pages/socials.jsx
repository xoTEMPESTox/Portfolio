import React, { useState, useMemo, useEffect, useCallback } from "react";
import BlogHeader from "../components/BlogHeader";
import FilterSidebar from "../components/FilterSidebar";
import PostList from "../components/PostList";
import DetailView from "../components/DetailView";
import "../styles/main.css";
import { useTheme } from "../components/HeaderBackground";
import { NavLink } from "react-router-dom";

// --- 1. DATA (Now using Markdown for post body) ---
const BLOG_POSTS = [];

const Socials = () => {
  const [currentPage, setCurrentPage] = useState("list"); // 'list' or 'detail'

  // --- NEW: Tab State for Blog vs LinkedIn ---
  const [activeTab, setActiveTab] = useState("linkedin"); // 'blogs' or 'linkedin'

  const [selectedPostId, setSelectedPostId] = useState(null);
  const [search, setSearch] = useState("");
  const { theme } = useTheme();

  // --- NEW: State for merged posts ---
  const [posts, setPosts] = useState(BLOG_POSTS);
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState({
    tags: [],
    sortDir: "desc",
  });

  // --- NEW: Fetch and Merge Logic ---
  useEffect(() => {
    async function fetchStats() {
      try {
        // Send existing IDs to API to ensure they exist in DB (as per your backend logic)
        const response = await fetch("/api/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: BLOG_POSTS.map((p) => p.id) }),
        });

        const dbData = await response.json();

        // Merge DB data (likes/views) into our static BLOG_POSTS
        const merged = BLOG_POSTS.map((staticPost) => {
          const dbPost = dbData.find((db) => db.id === staticPost.id);
          if (dbPost) {
            return {
              ...staticPost,
              views: dbPost.views, // Overwrite static views with DB views
              likes: dbPost.likes, // Overwrite static likes with DB likes
            };
          }
          return staticPost;
        });

        setPosts(merged);
      } catch (error) {
        console.error("Failed to fetch blog stats:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  // Update Filtering Logic to use 'posts' state instead of 'BLOG_POSTS'
  const filteredPosts = useMemo(() => {
    let currentPosts = [...posts]; // Use state here

    // 1. Filtering by Tags
    if (filters.tags.length > 0) {
      currentPosts = currentPosts.filter((post) =>
        filters.tags.some((tag) => post.tags.includes(tag)),
      );
    }

    // 2. Search
    const searchLower = search.toLowerCase().trim();
    if (searchLower) {
      currentPosts = currentPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchLower) ||
          post.excerpt.toLowerCase().includes(searchLower) ||
          post.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
      );
    }

    // 3. Sorting
    currentPosts.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return filters.sortDir === "desc" ? dateB - dateA : dateA - dateB;
    });

    return currentPosts;
  }, [posts, search, filters.tags, filters.sortDir]); // Added 'posts' as dependency

  // Navigation Handlers
  const handlePostClick = useCallback((postId) => {
    setSelectedPostId(postId);
    setCurrentPage("detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleBack = useCallback(() => {
    setCurrentPage("list");
    setSelectedPostId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Use 'posts' state to find the selected post so it has updated likes/views
  const selectedPost = useMemo(
    () => posts.find((p) => p.id === selectedPostId),
    [posts, selectedPostId],
  );

  // Inside your Socials component
  useEffect(() => {
    if (currentPage === "detail" && selectedPostId) {
      incrementView(selectedPostId);
    }
  }, [currentPage, selectedPostId]);

  const incrementView = async (id) => {
    try {
      const response = await fetch("/api/increment-view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        // Update local state so the UI reflects the new view count immediately
        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p.id === id ? { ...p, views: updatedData.views } : p,
          ),
        );
      }
    } catch (err) {
      console.error("Failed to increment view:", err);
    }
  };

  const socialLinks = [
    {
      href: "/mail",
      label: "Email Priyanshu Sah",
      internal: true,
      icon: (
        // Email SVG Icon
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          width="24"
          height="24"
        >
          <path d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
          <path d="m22 7-10 6L2 7" />
        </svg>
      ),
    },
    {
      href: "/linkedin",
      label: "LinkedIn profile",
      target: "_blank",
      rel: "noopener noreferrer",
      icon: (
        // LinkedIn SVG Icon
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-hidden="true"
        >
          <path
            d="M4.75 7.75C4.75 6.09315 6.09315 4.75 7.75 4.75H16.25C17.9069 4.75 19.25 6.09315 19.25 7.75V16.25C19.25 17.9069 17.9069 19.25 16.25 19.25H7.75C6.09315 19.25 4.75 17.9069 4.75 16.25V7.75Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
          <path
            d="M10.75 16.25V14C10.75 12.7574 11.7574 11.75 13 11.75C14.2426 11.75 15.25 12.7574 15.25 14V16.25"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
          <path
            d="M10.75 11.75V16.25"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
          <path
            d="M7.75 11.75V16.25"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
          <path
            d="M7.75 8.75V9.25"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
      ),
    },
    {
      href: "/github",
      label: "GitHub profile",
      target: "_blank",
      rel: "noopener noreferrer",
      icon: (
        // GitHub SVG Icon
        <svg
          stroke="currentColor"
          fill="none"
          strokeWidth="1"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
          height="20"
          width="20"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-hidden="true"
        >
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
          <path d="M9 18c-4.51 2-5-2-7-2"></path>
        </svg>
      ),
    },
    {
      href: "/codolio",
      label: "Codolio LeetCode profile",
      target: "_blank",
      rel: "noopener noreferrer",
      icon: (
        // LeetCode SVG Icon
        <svg
          role="img"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <title>LeetCode</title>
          <path
            d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"
            fill="currentColor"
            strokeWidth="1"
          ></path>
        </svg>
      ),
    },
    {
      href: "/resume-global",
      label: "Download CV",
      target: "_blank",
      rel: "noopener noreferrer",
      icon: (
        // Resume/CV SVG Icon
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          role="img"
          aria-hidden="true"
        >
          <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3"></path>
          <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
          <path d="M5 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
          <path d="M7 16.5 8 22l-3-1-3 1 1-5.5"></path>
        </svg>
      ),
    },
  ];

  return (
    <div className="page-section" data-theme={theme}>
      <h1 className="sr-only">Blog & Socials</h1>
      <ul
        id="socials"
        aria-label="Social links"
        // Combine custom class for positioning/border and Tailwind for flex layout/colors
        className={`socials-container flex items-center justify-evenly list-none m-0 p-0 relative z-10 group transition-all duration-500 border ${theme === "dark"
            ? "bg-black border-white/10 shadow-2xl shadow-black/50"
            : "bg-white border-white/90 shadow-lg shadow-gray-200"
          }`}
      >
        <div className="absolute overflow-hidden h-[100%] w-[100%] pointer-events-none ">
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
        </div>
        {socialLinks.map((link, index) => {
          const commonClasses = `socials-link border border-transparent rounded-full 
    flex items-center justify-center 
    h-[3.4rem] w-[3.4rem] z-10
    transition-all duration-200 ease-in-out 
    focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white 
    hover:text-sky-400 transition-transform duration-200
    ${theme === "dark" ? "text-white" : "text-slate-900"}`;

          return (
            <li key={index} className="hover:scale-125">
              {link.internal ? (
                <NavLink
                  to={link.href}
                  aria-label={link.label}
                  className={commonClasses}
                >
                  <span className="h-5 w-5 md:h-8 md:w-8">
                    <div className="[&>svg]:stroke-[2px]">{link.icon}</div>
                  </span>
                </NavLink>
              ) : (
                <a
                  href={link.href}
                  target={link.target}
                  rel={link.rel}
                  aria-label={link.label}
                  className={commonClasses}
                >
                  <span className="h-5 w-5 md:h-8 md:w-8">
                    <div className="[&>svg]:stroke-[2px]">{link.icon}</div>
                  </span>
                </a>
              )}
            </li>
          );
        })}
      </ul>
      <div
        className={`max-w-[95%] md:max-w-[85%] lg:max-w-[95rem] mx-auto p-6 md:p-12 rounded-[2.5rem] transition-all duration-500 border ${theme === "dark"
            ? "bg-zinc-950/70 backdrop-blur-sm border-zinc-800 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_20px_rgba(255,255,255,0.02)]"
            : "bg-white/60 backdrop-blur-sm border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.05),0_0_20px_rgba(0,0,0,0.02)]"
          }`}
      >
        {/* --- TOGGLE SWITCH (Blogs | LinkedIn) --- */}
        {/* Only show this on the main list page, hide it if viewing a specific blog post detail */}
        {currentPage === "list" && (
          <div className="flex justify-center mb-8">
            <div
              className={`relative flex items-center p-1 rounded-2xl w-[20rem] h-12 ${theme === "dark" ? "bg-zinc-900/50" : "bg-slate-200/50"
                }`}
            >
              {/* Sliding Background Pill */}
              <div
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl shadow-sm transition-all duration-300 ease-in-out ${theme === "dark" ? "bg-zinc-700" : "bg-white"
                  } ${activeTab === "linkedin" ? "translate-x-[100%] left-[2px]" : "translate-x-0 left-1"}`}
              />

              {/* Buttons */}
              <button
                onClick={() => setActiveTab("blogs")}
                className={`relative z-10 w-1/2 h-full text-sm font-semibold transition-colors duration-200 ${activeTab === "blogs"
                    ? theme === "dark"
                      ? "text-white"
                      : "text-slate-900"
                    : theme === "dark"
                      ? "text-zinc-400 hover:text-zinc-200"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
              >
                Blogs
              </button>
              <button
                onClick={() => setActiveTab("linkedin")}
                className={`relative z-10 w-1/2 h-full text-sm font-semibold transition-colors duration-200 ${activeTab === "linkedin"
                    ? theme === "dark"
                      ? "text-white"
                      : "text-slate-900"
                    : theme === "dark"
                      ? "text-zinc-400 hover:text-zinc-200"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
              >
                LinkedIn Posts
              </button>
            </div>
          </div>
        )}

        {/* LIST VIEW */}
        {currentPage === "list" && (
          <>
            {/* 1. BLOGS TAB CONTENT */}
            {activeTab === "blogs" && (
              <div className="animate-in fade-in zoom-in duration-300">
                <BlogHeader
                  search={search}
                  setSearch={setSearch}
                  setFilters={setFilters}
                />

                <main className="grid grid-cols-1 lg:grid-cols-3 gap-16 mt-8">
                  <div className="lg:col-span-2">
                    <PostList
                      filteredPosts={filteredPosts}
                      onPostClick={handlePostClick}
                    />
                  </div>
                  <aside className="lg:col-span-1">
                    <FilterSidebar filters={filters} setFilters={setFilters} />
                  </aside>
                </main>
              </div>
            )}

            {/* 2. LINKEDIN TAB CONTENT */}
            {activeTab === "linkedin" && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 w-full min-h-[500px] flex justify-center p-8 bg-[#f9fafb] rounded-3xl ">
                {/* IFrame Widget - Width set to 100% for responsiveness */}
                <iframe
                  src="https://widgets.sociablekit.com/linkedin-profile-posts/iframe/25647450"
                  frameBorder="0"
                  width="100%"
                  height="1000"
                  style={{
                    borderRadius: "12px",
                    maxWidth: "1200px", // Keeps it from getting too stretched on huge screens
                  }}
                  title="LinkedIn Profile Posts"
                ></iframe>
              </div>
            )}
          </>
        )}

        {/* DETAIL VIEW */}
        {currentPage === "detail" && selectedPost && (
          <div className="animate-in fade-in duration-500">
            <DetailView post={selectedPost} onBack={handleBack} />
          </div>
        )}
      </div>
      <style>{`.sk-header-button { background-color: #FFFF00 !important}`}</style>
    </div>
  );
};

export default Socials;
