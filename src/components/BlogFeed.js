import { useState, useEffect, useCallback } from 'react';
import { ExternalLink, Calendar, Tag, RefreshCw, AlertCircle, BookOpen } from 'lucide-react';

const BlogFeed = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Cache key for localStorage
  const CACHE_KEY = 'portfolio_blog_cache';
  const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

  const fetchBlogs = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    try {
      // Check cache first
      if (!forceRefresh) {
        const cached = getCachedBlogs();
        if (cached) {
          setBlogs(cached.blogs);
          setLastUpdated(new Date(cached.timestamp));
          setLoading(false);
          return;
        }
      }

      // Try to fetch from Medium RSS (using a CORS proxy)
      const mediumBlogs = await fetchMediumBlogs();
      
      // Combine with static blogs from data file
      const staticBlogs = await fetchStaticBlogs();
      
      const allBlogs = [...mediumBlogs, ...staticBlogs]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 6); // Limit to 6 most recent

      setBlogs(allBlogs);
      setLastUpdated(new Date());
      
      // Cache the results
      cacheBlogs(allBlogs);
      
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Failed to load blog posts. Showing cached content.');
      
      // Try to load from cache as fallback
      const cached = getCachedBlogs();
      if (cached) {
        setBlogs(cached.blogs);
        setLastUpdated(new Date(cached.timestamp));
      } else {
        // Load static blogs as final fallback
        const staticBlogs = await fetchStaticBlogs();
        setBlogs(staticBlogs);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const getCachedBlogs = () => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const data = JSON.parse(cached);
        const now = new Date().getTime();
        if (now - data.timestamp < CACHE_DURATION) {
          return data;
        }
      }
    } catch (err) {
      console.error('Error reading cache:', err);
    }
    return null;
  };

  const cacheBlogs = (blogs) => {
    try {
      const data = {
        blogs,
        timestamp: new Date().getTime()
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error('Error caching blogs:', err);
    }
  };

  const fetchMediumBlogs = async () => {
    // For demo purposes, return mock Medium blogs
    // In production, you would use a CORS proxy or server-side API
    return [
      {
        id: 'medium-1',
        title: 'Building Scalable Web Applications with Next.js',
        date: '2024-02-15',
        summary: 'A comprehensive guide to building modern web applications using Next.js, covering performance optimization, SEO, and deployment strategies.',
        url: 'https://medium.com/@priyanshu123sah/building-scalable-web-apps',
        tags: ['Next.js', 'React', 'Web Development'],
        source: 'Medium',
        readTime: '8 min read'
      },
      {
        id: 'medium-2',
        title: 'AI-Powered Development: The Future is Here',
        date: '2024-01-28',
        summary: 'Exploring how artificial intelligence is transforming software development, from code generation to automated testing and deployment.',
        url: 'https://medium.com/@priyanshu123sah/ai-powered-development',
        tags: ['AI', 'Machine Learning', 'Development'],
        source: 'Medium',
        readTime: '12 min read'
      }
    ];
  };

  const fetchStaticBlogs = async () => {
    // Import static blog data
    try {
      const publicationsData = await import('../data/publications.json');
      return publicationsData.default.blogs.map(blog => ({
        ...blog,
        source: 'Portfolio',
        readTime: '5 min read'
      }));
    } catch (err) {
      console.error('Error loading static blogs:', err);
      return [];
    }
  };


  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (err) {
      return dateString;
    }
  };

  const getSourceColor = (source) => {
    switch (source) {
      case 'Medium': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'LinkedIn': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const BlogCard = ({ blog }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSourceColor(blog.source)}`}>
            {blog.source}
          </span>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(blog.date)}
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {blog.title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
          {blog.summary}
        </p>
        
        {blog.tags && (
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {blog.readTime}
          </span>
          <a
            href={blog.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium transition-colors"
          >
            Read More
            <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
          <BookOpen className="w-6 h-6 mr-2 text-blue-500" />
          Latest Blog Posts
        </h2>
        <div className="flex items-center space-x-4">
          {lastUpdated && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={() => fetchBlogs(true)}
            disabled={loading}
            className="inline-flex items-center px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
            <span className="text-sm text-yellow-800 dark:text-yellow-200">{error}</span>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
              <div className="flex justify-between items-center mb-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              </div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-3/4"></div>
              <div className="flex gap-2 mb-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              </div>
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      ) : blogs.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
            No blog posts found
          </h3>
          <p className="text-gray-500 dark:text-gray-500">
            Check back later for new content!
          </p>
        </div>
      )}

      {blogs.length > 0 && (
        <div className="mt-8 text-center">
          <a
            href="https://medium.com/@priyanshu123sah"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-colors"
          >
            View All Posts
            <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        </div>
      )}
    </div>
  );
};

export default BlogFeed;