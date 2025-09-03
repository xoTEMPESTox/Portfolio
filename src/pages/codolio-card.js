import { useState, useEffect, memo, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaShareAlt,
  FaHeart,
  FaEye,
  FaMedal,
  FaCode,
  FaProjectDiagram,
  FaChartLine,
  FaLink
} from 'react-icons/fa';
import Layout from '../components/Layout';
import { fallbackCodolioData, getCodolioProfileUrl } from '../utils/codolio';
import personalData from '../data/personal.json';

const CodolioCardPage = memo(() => {
  const [activeTab, setActiveTab] = useState('overview');
  const [liked, setLiked] = useState(false);
  const [viewCount, setViewCount] = useState(fallbackCodolioData.stats.totalViews);
  const [animationTrigger, setAnimationTrigger] = useState(false);
  const [filter, setFilter] = useState('all');
  
  // Browser feature detection
  const [supportsWebShare, setSupportsWebShare] = useState(false);
  const [supportsClipboard, setSupportsClipboard] = useState(false);
  
  // Intersection Observer for lazy loading
  const [isVisible, setIsVisible] = useState({});
  const observer = useRef();
  
  // Custom hook for intersection observer
  const useIntersectionObserver = (options = {}) => {
    return useCallback((element) => {
      if (!element) return;
      
      // Cleanup previous observer
      if (observer.current) observer.current.disconnect();
      
      // Create new observer
      observer.current = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }));
        });
      }, {
        rootMargin: '0px',
        threshold: 0.1,
        ...options
      });
      
      observer.current.observe(element);
      
      // Cleanup function
      return () => {
        if (observer.current) {
          observer.current.disconnect();
        }
      };
    }, [options]);
  };
  
  const observeElement = useIntersectionObserver();
  
  useEffect(() => {
    // Check for Web Share API support
    setSupportsWebShare(!!navigator.share);
    
    // Check for Clipboard API support
    setSupportsClipboard(!!navigator.clipboard && !!navigator.clipboard.writeText);
  }, []);

  // Simulate view count increment
  useEffect(() => {
    const timer = setTimeout(() => {
      setViewCount(prev => prev + 1);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle responsive design adjustments
  useEffect(() => {
    const handleResize = () => {
      // Adjust layout based on screen size
      if (window.innerWidth < 640) {
        // Small screens - adjust grid layouts
        document.documentElement.style.setProperty('--grid-cols', '1');
      } else if (window.innerWidth < 768) {
        // Medium screens
        document.documentElement.style.setProperty('--grid-cols', '2');
      } else {
        // Large screens
        document.documentElement.style.setProperty('--grid-cols', '4');
      }
    };
    
    handleResize(); // Initial call
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLike = () => {
    setLiked(!liked);
    setAnimationTrigger(true);
    setTimeout(() => setAnimationTrigger(false), 500);
  };

  const handleShare = useCallback(() => {
    if (supportsWebShare) {
      navigator.share({
        title: 'Check out my Codolio profile!',
        url: getCodolioProfileUrl(),
      }).catch(console.error);
    } else if (supportsClipboard) {
      // Fallback for browsers that don't support Web Share API but do support Clipboard API
      navigator.clipboard.writeText(getCodolioProfileUrl())
        .then(() => {
          alert('Profile link copied to clipboard!');
        })
        .catch(() => {
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = getCodolioProfileUrl();
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          alert('Profile link copied to clipboard!');
        });
    } else {
      // Ultimate fallback for very old browsers
      const textArea = document.createElement('textarea');
      textArea.value = getCodolioProfileUrl();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Profile link copied to clipboard!');
    }
  }, [supportsWebShare, supportsClipboard]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const statCardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    hover: {
      y: -10,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <Layout title="Codolio Profile Card - Priyanshu Sah">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div 
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Developer Profile
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
              Explore my coding journey, projects, and achievements
            </p>
          </motion.div>

          {/* Main Profile Card */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8 sm:mb-12"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Profile Header */}
            <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 p-6 sm:p-8">
              <div className="absolute top-4 right-4 flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLike}
                  className={`p-2 sm:p-3 rounded-full backdrop-blur-sm ${
                    liked 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                  } transition-colors duration-300`}
                  aria-label={liked ? "Unlike profile" : "Like profile"}
                >
                  <FaHeart className={liked ? "fill-current" : ""} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleShare}
                  className="p-2 sm:p-3 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm transition-colors duration-300"
                  aria-label="Share profile"
                >
                  <FaShareAlt />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    // Could add a toast notification here
                  }}
                  className="p-2 sm:p-3 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm transition-colors duration-300"
                  aria-label="Copy profile link"
                >
                  <FaLink />
                </motion.button>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 p-1 shadow-lg">
                    <div className="bg-white dark:bg-gray-800 rounded-full w-full h-full flex items-center justify-center">
                      <span className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white">
                        {personalData.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 sm:bottom-2 sm:right-2 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full border-2 sm:border-4 border-white dark:border-gray-800 flex items-center justify-center">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full"></div>
                  </div>
                </motion.div>
                
                <div className="text-center sm:text-left text-white flex-1">
                  <motion.h2
                    className="text-2xl sm:text-3xl font-bold mb-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {personalData.name}
                  </motion.h2>
                  <motion.p
                    className="text-lg sm:text-xl mb-3 opacity-90"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {personalData.title}
                  </motion.p>
                  <motion.p
                    className="mb-4 opacity-80 text-sm sm:text-base max-w-2xl"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {personalData.bio[0]}
                  </motion.p>
                  
                  <motion.div
                    className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3 mt-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <a
                      href={personalData.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors duration-300"
                      aria-label="GitHub"
                    >
                      <FaGithub className="text-lg sm:text-xl" />
                    </a>
                    <a
                      href={personalData.links.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors duration-300"
                      aria-label="LinkedIn"
                    >
                      <FaLinkedin className="text-lg sm:text-xl" />
                    </a>
                    <a
                      href={personalData.links.codolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors duration-300"
                      aria-label="Codolio"
                    >
                      <FaCode className="text-lg sm:text-xl" />
                    </a>
                  </motion.div>
                  
                  {/* Profile CTA Buttons */}
                  <motion.div
                    className="mt-6 flex flex-wrap justify-center sm:justify-start gap-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <motion.a
                      href="/contact"
                      className="px-4 py-2 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-colors duration-200 text-sm sm:text-base"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Hire Me
                    </motion.a>
                    <motion.a
                      href="/projects"
                      className="px-4 py-2 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors duration-200 text-sm sm:text-base"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      View Projects
                    </motion.a>
                  </motion.div>
                </div>
              </div>
            </div>
            
            {/* Stats Overview */}
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 xs:grid-cols-4 gap-3 sm:gap-4">
                <motion.div
                  className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-3 sm:p-4 rounded-lg text-center border border-blue-100 dark:border-blue-900/50"
                  variants={statCardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                >
                  <div className="flex justify-center mb-2">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                      <FaProjectDiagram className="text-blue-600 dark:text-blue-400 text-lg sm:text-xl" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {fallbackCodolioData.stats.totalProjects}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Projects</div>
                </motion.div>
                
                <motion.div
                  className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 p-3 sm:p-4 rounded-lg text-center border border-amber-100 dark:border-amber-90/50"
                  variants={statCardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                >
                  <div className="flex justify-center mb-2">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center">
                      <FaMedal className="text-amber-600 dark:text-amber-40 text-lg sm:text-xl" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {fallbackCodolioData.stats.totalLikes + (liked ? 1 : 0)}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Likes</div>
                </motion.div>
                
                <motion.div
                  className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-3 sm:p-4 rounded-lg text-center border border-green-100 dark:border-green-900/50"
                  variants={statCardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                >
                  <div className="flex justify-center mb-2">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                      <FaEye className="text-green-600 dark:text-green-400 text-lg sm:text-xl" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {viewCount}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Views</div>
                </motion.div>
                
                <motion.div
                  className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-3 sm:p-4 rounded-lg text-center border border-purple-100 dark:border-purple-900/50"
                  variants={statCardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                >
                  <div className="flex justify-center mb-2">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center">
                      <FaChartLine className="text-purple-600 dark:text-purple-400 text-lg sm:text-xl" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {fallbackCodolioData.stats.rank}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Rank</div>
                </motion.div>
              </div>
            </div>
            
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex overflow-x-auto px-4 sm:px-6">
                {['overview', 'projects', 'skills', 'badges'].map((tab) => (
                  <button
                    key={tab}
                    className={`px-4 sm:px-6 py-3 sm:py-4 font-medium text-sm sm:text-base capitalize transition-colors duration-200 whitespace-nowrap ${
                      activeTab === tab
                        ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Tab Content */}
            <div className="p-4 sm:p-6">
              {activeTab === 'overview' && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Profile Overview</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <motion.div 
                      className="bg-gray-50 dark:bg-gray-700 p-4 sm:p-6 rounded-lg"
                      variants={itemVariants}
                    >
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center">
                        <FaCode className="mr-2 text-blue-500" /> Top Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {fallbackCodolioData.profile.skills.map((skill, index) => (
                          <motion.span
                            key={index}
                            className="px-2 sm:px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs sm:text-sm"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                    
                    <motion.div
                      className="bg-gray-50 dark:bg-gray-700 p-4 sm:p-6 rounded-lg"
                      variants={itemVariants}
                    >
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Profile Stats</h4>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600 dark:text-gray-400 text-sm flex items-center">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                              Profile Completeness
                            </span>
                            <span className="text-gray-900 dark:text-white text-sm font-medium">85%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                            <motion.div
                              className="bg-blue-500 h-2.5 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: "85%" }}
                              transition={{ duration: 1, delay: 0.5 }}
                            ></motion.div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600 dark:text-gray-400 text-sm flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              Activity Level
                            </span>
                            <span className="text-gray-900 dark:text-white text-sm font-medium">High</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                            <motion.div
                              className="bg-green-500 h-2.5 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: "90%" }}
                              transition={{ duration: 1, delay: 0.7 }}
                            ></motion.div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600 dark:text-gray-400 text-sm flex items-center">
                              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                              Engagement Score
                            </span>
                            <span className="text-gray-90 dark:text-white text-sm font-medium">78%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                            <motion.div
                              className="bg-purple-500 h-2.5 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: "78%" }}
                              transition={{ duration: 1, delay: 0.9 }}
                            ></motion.div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                  
                  <motion.div 
                    className="mt-4 sm:mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 p-4 sm:p-6 rounded-lg border border-blue-100 dark:border-blue-900/50"
                    variants={itemVariants}
                  >
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Recent Activity</h4>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <p className="ml-2 sm:ml-3 text-gray-700 dark:text-gray-300 text-sm">
                          <span className="font-medium">Completed</span> a new machine learning project
                          <span className="block text-xs text-gray-500 dark:text-gray-400">2 hours ago</span>
                        </p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full"></div>
                        </div>
                        <p className="ml-2 sm:ml-3 text-gray-700 dark:text-gray-300 text-sm">
                          <span className="font-medium">Published</span> a new article on React best practices
                          <span className="block text-xs text-gray-500 dark:text-gray-400">1 day ago</span>
                        </p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-purple-500 rounded-full"></div>
                        </div>
                        <p className="ml-2 sm:ml-3 text-gray-700 dark:text-gray-300 text-sm">
                          <span className="font-medium">Achieved</span> the "Full-Stack Expert" badge
                          <span className="block text-xs text-gray-500 dark:text-gray-400">3 days ago</span>
                        </p>
                      </li>
                    </ul>
                  </motion.div>
                </motion.div>
              )}
              
              {activeTab === 'projects' && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Featured Projects</h3>
                  
                  {/* Filter Controls */}
                  <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                    <button
                      className={`px-3 py-1 rounded-full text-sm ${
                        filter === 'all'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
                      }`}
                      onClick={() => setFilter('all')}
                    >
                      All Projects
                    </button>
                    <button
                      className={`px-3 py-1 rounded-full text-sm ${
                        filter === 'web'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
                      }`}
                      onClick={() => setFilter('web')}
                    >
                      Web Apps
                    </button>
                    <button
                      className={`px-3 py-1 rounded-full text-sm ${
                        filter === 'mobile'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
                      }`}
                      onClick={() => setFilter('mobile')}
                    >
                      Mobile Apps
                    </button>
                    <button
                      className={`px-3 py-1 rounded-full text-sm ${
                        filter === 'ai'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
                      }`}
                      onClick={() => setFilter('ai')}
                    >
                      AI/ML
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {fallbackCodolioData.projects
                      .filter(project => filter === 'all' || project.category === filter)
                      .map((project, index) => (
                        <motion.div
                          key={project.id}
                          className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600"
                          variants={itemVariants}
                          whileHover={{ y: -5 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="p-4 sm:p-5">
                            <div className="flex justify-between items-start mb-3">
                              <h4 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white">{project.title}</h4>
                              <div className="flex space-x-2">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="text-gray-500 hover:text-red-500 transition-colors duration-200"
                                  aria-label="Like project"
                                >
                                  <FaHeart />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="text-gray-500 hover:text-blue-500 transition-colors duration-200"
                                  aria-label="Share project"
                                  onClick={() => {
                                    if (navigator.share) {
                                      navigator.share({
                                        title: project.title,
                                        url: project.liveUrl,
                                      }).catch(console.error);
                                    } else {
                                      navigator.clipboard.writeText(project.liveUrl);
                                      // Could add a toast notification here
                                    }
                                  }}
                                >
                                  <FaShareAlt />
                                </motion.button>
                              </div>
                            </div>
                            
                            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-4">
                              {project.description}
                            </p>
                            
                            <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
                              {project.technologies.slice(0, 3).map((tech, techIndex) => (
                                <motion.span
                                  key={techIndex}
                                  className="px-2 py-1 bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded text-xs"
                                  whileHover={{ scale: 1.05, backgroundColor: "#f3f4f6" }}
                                  whileTap={{ scale: 0.95 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                >
                                  {tech}
                                </motion.span>
                              ))}
                              {project.technologies.length > 3 && (
                                <motion.span
                                  className="px-2 py-1 bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded text-xs"
                                  whileHover={{ scale: 1.05, backgroundColor: "#f3f4f6" }}
                                  whileTap={{ scale: 0.95 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                >
                                  +{project.technologies.length - 3} more
                                </motion.span>
                              )}
                            </div>
                            
                            <div className="flex justify-between items-center text-xs sm:text-sm">
                              <div className="flex space-x-3 sm:space-x-4">
                                <span className="flex items-center text-gray-600 dark:text-gray-400">
                                  <FaHeart className="mr-1 text-red-500" /> {project.likes}
                                </span>
                                <span className="flex items-center text-gray-600 dark:text-gray-400">
                                  <FaEye className="mr-1 text-blue-500" /> {project.views}
                                </span>
                              </div>
                              
                              <div className="flex space-x-2">
                                <motion.a
                                  href={project.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2 sm:px-3 py-1 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 rounded text-xs sm:text-sm transition-colors duration-200"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  Code
                                </motion.a>
                                <motion.a
                                  href={project.liveUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2 sm:px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs sm:text-sm transition-colors duration-200"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  Live
                                </motion.a>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </motion.div>
              )}
              
              {activeTab === 'skills' && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Skills & Expertise</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <motion.div
                      className="bg-gray-50 dark:bg-gray-700 p-4 sm:p-6 rounded-lg"
                      variants={itemVariants}
                    >
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Technical Skills</h4>
                      <div className="space-y-4">
                        {fallbackCodolioData.profile.skills.map((skill, index) => (
                          <div key={index}>
                            <div className="flex justify-between mb-2">
                              <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base font-medium">{skill}</span>
                              <span className={`text-xs sm:text-sm font-medium px-2 py-1 rounded-full ${
                                index % 4 === 0 ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                                index % 4 === 1 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                                index % 4 === 2 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                              }`}>
                                {['Expert', 'Advanced', 'Intermediate', 'Beginner'][index % 4]}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                              <div
                                className={`h-2.5 rounded-full ${
                                  index % 4 === 0 ? 'bg-purple-500' :
                                  index % 4 === 1 ? 'bg-blue-500' :
                                  index % 4 === 2 ? 'bg-green-500' : 'bg-amber-500'
                                }`}
                                style={{ width: `${100 - (index % 4) * 20}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-gray-50 dark:bg-gray-700 p-4 sm:p-6 rounded-lg"
                      variants={itemVariants}
                    >
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Certifications</h4>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          </div>
                          <div className="ml-2 sm:ml-3">
                            <p className="text-gray-700 dark:text-gray-300 font-medium text-sm">AWS Certified Developer</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Amazon Web Services</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          </div>
                          <div className="ml-2 sm:ml-3">
                            <p className="text-gray-700 dark:text-gray-300 font-medium text-sm">Google Cloud Professional</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Google Cloud Platform</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          </div>
                          <div className="ml-2 sm:ml-3">
                            <p className="text-gray-700 dark:text-gray-300 font-medium text-sm">TensorFlow Developer</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">TensorFlow</p>
                          </div>
                        </li>
                      </ul>
                    </motion.div>
                  </div>
                </motion.div>
              )}
              
              {activeTab === 'badges' && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Achievements & Badges</h3>
                  
                  <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {fallbackCodolioData.stats.badges.map((badge, index) => (
                      <motion.div 
                        key={index}
                        className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-4 sm:p-6 rounded-lg border border-amber-200 dark:border-amber-900/50 text-center"
                        variants={itemVariants}
                        whileHover={{ scale: 1.03 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                          <FaMedal className="text-white text-xl sm:text-2xl" />
                        </div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base">{badge}</h4>
                        <p className="text-xs sm:text-sm text-gray-60 dark:text-gray-400">
                          Awarded for exceptional contributions
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
            
            {/* Call to Action */}
            <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base text-center sm:text-left">
                  Want to learn more about my work and experience?
                </p>
                <div className="flex flex-wrap justify-center sm:justify-end gap-3">
                  <motion.a
                    href="/resume"
                    className="px-4 py-2 sm:px-5 sm:py-2.5 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-800 dark:text-white rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors duration-200 text-sm sm:text-base"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View Resume
                  </motion.a>
                  <motion.a
                    href="/contact"
                    className="px-4 py-2 sm:px-5 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center transition-colors duration-200 text-sm sm:text-base"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Get In Touch
                  </motion.a>
                </div>
              </div>
              
              {/* Additional CTAs */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                <div className="flex flex-wrap justify-center gap-4">
                  <motion.a
                    href="/blog"
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Read My Blog
                  </motion.a>
                  <motion.a
                    href="/projects"
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    See All Projects
                  </motion.a>
                  <motion.a
                    href="#"
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.preventDefault();
                      // Scroll to projects section
                      document.querySelector('[data-tab="projects"]').scrollIntoView({ behavior: 'smooth' });
                      setActiveTab('projects');
                    }}
                  >
                    View Projects
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Additional Info */}
          <motion.div 
            className="text-center text-gray-600 dark:text-gray-400 text-xs sm:text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p>
              Profile views: {viewCount} • Last updated: Today
            </p>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
});

export default CodolioCardPage;