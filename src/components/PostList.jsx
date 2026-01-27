import React, {useState} from "react";
import PostCard from "./PostCard";
import { useTheme } from "../components/HeaderBackground"; // Assuming this is where your theme hook lives

const PostList = ({ filteredPosts, onPostClick }) => {
  const { theme } = useTheme();

  if (filteredPosts.length === 0) {
    return (
      <section className="md:col-span-2 order-2 md:order-none pt-0!">
        <div 
          className={`text-center py-16 border-2 rounded-xl shadow-xl transition-all duration-500 ${
            theme === 'dark' 
              ? "border-zinc-800 bg-zinc-950 shadow-black/50" 
              : "border-slate-100 bg-white shadow-slate-200/50"
          }`}
        >
          <p className={`text-xl font-semibold transition-colors ${
            theme === 'dark' ? "text-slate-400" : "text-slate-600"
          }`}>
            No posts found matching your criteria.
          </p>
          <p className={`text-sm mt-2 transition-colors ${
            theme === 'dark' ? "text-slate-600" : "text-slate-400"
          }`}>
            Try adjusting your filters or search terms.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="md:col-span-2 order-2 md:order-none pt-0! rounded-2xl">
      {filteredPosts.map((post) => (
        <PostCard key={post.id} post={post} onPostClick={onPostClick} />
      ))}
    </section>
  );
};

export default PostList;