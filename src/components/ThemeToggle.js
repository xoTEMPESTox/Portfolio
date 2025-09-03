import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useState, useRef, useEffect } from 'react';

const ThemeToggle = () => {
  const { theme, toggleTheme, setLightTheme, setDarkTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleThemeSelect = (selectedTheme) => {
    if (selectedTheme === 'light') {
      setLightTheme();
    } else if (selectedTheme === 'dark') {
      setDarkTheme();
    } else {
      // System theme - detect and apply
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        setDarkTheme();
      } else {
        setLightTheme();
      }
      // Clear localStorage to follow system preference
      localStorage.removeItem('portfolio-theme');
    }
    setIsOpen(false);
  };

  const getCurrentIcon = () => {
    if (theme === 'dark') {
      return <Moon className="w-5 h-5" />;
    }
    return <Sun className="w-5 h-5" />;
  };

  const themeOptions = [
    {
      id: 'light',
      name: 'Light',
      icon: <Sun className="w-4 h-4" />,
      description: 'Light theme'
    },
    {
      id: 'dark',
      name: 'Dark',
      icon: <Moon className="w-4 h-4" />,
      description: 'Dark theme'
    },
    {
      id: 'system',
      name: 'System',
      icon: <Monitor className="w-4 h-4" />,
      description: 'Follow system preference'
    }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Simple Toggle Button (for mobile/compact view) */}
      <button
        onClick={toggleTheme}
        className="md:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-all duration-300"
        aria-label="Toggle theme"
      >
        {getCurrentIcon()}
      </button>

      {/* Dropdown Toggle Button (for desktop) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden md:flex items-center space-x-2 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-all duration-300"
        aria-label="Theme options"
      >
        {getCurrentIcon()}
        <span className="text-sm font-medium capitalize">{theme}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
          {themeOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleThemeSelect(option.id)}
              className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                (option.id === theme || 
                 (option.id === 'system' && !localStorage.getItem('portfolio-theme')))
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <span className="flex-shrink-0">{option.icon}</span>
              <div className="flex-1">
                <div className="text-sm font-medium">{option.name}</div>
                <div className="text-xs opacity-75">{option.description}</div>
              </div>
              {(option.id === theme || 
                (option.id === 'system' && !localStorage.getItem('portfolio-theme'))) && (
                <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;