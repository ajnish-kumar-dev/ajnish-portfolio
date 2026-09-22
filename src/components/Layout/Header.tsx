import React, { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun, ChevronDown } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import { navigationItems, personalInfo } from '../../data/portfolio';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { theme, toggleTheme } = useTheme();
  const activeSection = useScrollSpy(navigationItems.map(item => item.id));

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      
      setIsScrolled(scrollTop > 50);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 dark:from-blue-400 dark:via-indigo-400 dark:to-teal-400 transition-transform duration-150 origin-left" 
           style={{ transform: `scaleX(${scrollProgress / 100})` }} />
      
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl border-b border-gray-200/20 dark:border-gray-700/20 shadow-2xl shadow-gray-200/20 dark:shadow-black/20'
            : 'bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo with Animation */}
            <div className="flex-shrink-0 group">
              <button
                onClick={() => handleNavClick('#home')}
                className="relative text-2xl lg:text-3xl font-bold transition-all duration-300 hover:scale-105"
              >
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 dark:from-blue-400 dark:via-indigo-400 dark:to-teal-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                  {personalInfo.name.split(' ').map((word, index) => (
                    <span key={index} className={index === 0 ? 'font-black' : 'font-light'}>
                      {word}
                      {index === 0 && ' '}
                    </span>
                  ))}
                </span>
                {/* Underline Effect */}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-teal-600 dark:from-blue-400 dark:to-teal-400 group-hover:w-full transition-all duration-500 ease-out" />
              </button>
            </div>

            {/* Desktop Navigation with Enhanced Design */}
            <div className="hidden lg:flex items-center space-x-1">
              <nav className="flex items-center space-x-1 bg-gradient-to-r from-white/60 to-gray-50/60 dark:from-gray-800/60 dark:to-gray-900/60 backdrop-blur-2xl rounded-full px-8 py-3 border border-gray-200/30 dark:border-gray-700/30 shadow-2xl shadow-gray-200/30 dark:shadow-black/20">
                {navigationItems.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.href)}
                    className={`relative px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-500 overflow-hidden group ${
                      activeSection === item.id
                        ? 'text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Active Background with Gradient */}
                    {activeSection === item.id && (
                      <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 rounded-full shadow-lg shadow-blue-500/40 animate-gradient bg-[length:200%_auto]" />
                    )}
                    
                    {/* Hover Effect */}
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-teal-500/10 dark:from-blue-400/10 dark:to-teal-400/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Text */}
                    <span className="relative z-10 flex items-center gap-1">
                      {item.label}
                      {activeSection === item.id && (
                        <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                      )}
                    </span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Theme Toggle & Mobile Menu with Enhanced Design */}
            <div className="flex items-center space-x-1.5 sm:space-x-2.5">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="relative p-1.5 sm:p-2 lg:p-2.5 rounded-lg sm:rounded-xl lg:rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border border-gray-200/30 dark:border-gray-700/30 text-gray-700 dark:text-gray-300 hover:scale-110 active:scale-95 transition-all duration-300 shadow-lg group overflow-hidden"
                aria-label="Toggle theme"
              >
                {/* Animated Background */}
                <span className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-400/20 dark:from-blue-400/20 dark:to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <span className="relative z-10 block transition-transform duration-500 group-hover:rotate-180">
                  {theme === 'dark' ? <Sun size={16} className="sm:w-[18px] sm:h-[18px] lg:w-5 lg:h-5" /> : <Moon size={16} className="sm:w-[18px] sm:h-[18px] lg:w-5 lg:h-5" />}
                </span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden relative p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border border-gray-200/30 dark:border-gray-700/30 text-gray-700 dark:text-gray-300 hover:scale-110 active:scale-95 transition-all duration-300 shadow-lg group overflow-hidden"
                aria-label="Toggle menu"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-teal-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <span className="relative z-10 block transition-transform duration-300">
                  {isMenuOpen ? <X size={18} className="sm:w-5 sm:h-5" /> : <Menu size={18} className="sm:w-5 sm:h-5" />}
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Navigation with Enhanced Animation */}
          <div
            className={`lg:hidden transition-all duration-500 ease-out ${
              isMenuOpen ? 'max-h-[400px] opacity-100 translate-y-0 mb-2' : 'max-h-0 opacity-0 -translate-y-4 pointer-events-none'
            }`}
          >
            <div className="py-2 space-y-0.5 bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-900/90 dark:to-gray-800/90 backdrop-blur-2xl rounded-xl mt-2 border border-gray-200/30 dark:border-gray-700/30 shadow-2xl shadow-gray-200/30 dark:shadow-black/20 overflow-hidden">
              {navigationItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.href)}
                  className={`relative block w-full text-left px-4 py-2.5 text-sm font-semibold transition-all duration-300 group overflow-hidden ${
                    activeSection === item.id
                      ? 'text-white'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                  style={{ 
                    animationDelay: `${index * 50}ms`,
                    animation: isMenuOpen ? 'slideInFromRight 0.5s ease-out forwards' : 'none'
                  }}
                >
                  {/* Active Background */}
                  {activeSection === item.id && (
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 animate-gradient bg-[length:200%_auto]" />
                  )}
                  
                  {/* Hover Effect */}
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-teal-500/10 dark:from-blue-400/10 dark:to-teal-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Left Border Indicator */}
                  <span className={`absolute left-0 top-1/2 -translate-y-1/2 h-0 w-1 rounded-r-full transition-all duration-300 ${
                    activeSection === item.id
                      ? 'h-5 bg-white'
                      : 'h-0 group-hover:h-5 bg-gradient-to-b from-blue-600 to-teal-600 dark:from-blue-400 dark:to-teal-400'
                  }`} />
                  
                  {/* Text Content */}
                  <span className="relative z-10 flex items-center justify-between">
                    <span>{item.label}</span>
                    {activeSection === item.id && (
                      <ChevronDown size={12} className="animate-bounce" />
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </nav>
      </header>

      {/* Add Custom Animations */}
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-gradient {
          animation: gradient 6s ease infinite;
        }

        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
};