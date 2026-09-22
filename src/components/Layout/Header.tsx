import React, { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun, Download } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import { navigationItems, personalInfo } from '../../data/portfolio';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const activeSection = useScrollSpy(navigationItems.map(item => item.id));

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setIsScrolled(scrollTop > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/30 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <div className="flex-shrink-0">
              <button
                onClick={() => handleNavClick('#home')}
                className="relative text-xl lg:text-2xl font-bold transition-all duration-300 hover:scale-105 group"
              >
                <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-teal-500 dark:from-blue-400 dark:via-sky-400 dark:to-teal-400 bg-clip-text text-transparent">
                  {personalInfo.name.split(' ').map((word, index) => (
                    <span key={index} className={index === 0 ? 'font-black' : 'font-light'}>
                      {word}
                      {index === 0 && ' '}
                    </span>
                  ))}
                </span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-teal-500 group-hover:w-full transition-all duration-400 ease-out" />
              </button>
            </div>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center space-x-1">
              <div className="flex items-center space-x-1 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-full px-2 py-1.5 border border-gray-200/40 dark:border-gray-700/30 shadow-sm">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.href)}
                    className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                      activeSection === item.id
                        ? 'text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                  >
                    {activeSection === item.id && (
                      <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-teal-500 rounded-full shadow-md shadow-blue-500/20" />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Resume button */}
              <button
                onClick={() => window.open(personalInfo.resumeUrl, '_blank')}
                className="ml-2 inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 rounded-full hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all duration-300 hover:shadow-md"
              >
                <Download size={15} />
                Resume
              </button>
            </div>

            {/* Theme toggle + mobile menu */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className="relative p-2.5 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/40 dark:border-gray-700/30 text-gray-600 dark:text-gray-300 hover:scale-110 active:scale-95 transition-all duration-300 group"
                aria-label="Toggle theme"
              >
                <span className="block transition-transform duration-500 group-hover:rotate-180">
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </span>
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden relative p-2.5 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/40 dark:border-gray-700/30 text-gray-600 dark:text-gray-300 hover:scale-110 active:scale-95 transition-all duration-300"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile nav */}
          <div
            className={`lg:hidden transition-all duration-400 ease-out overflow-hidden ${
              isMenuOpen ? 'max-h-[500px] opacity-100 mb-3' : 'max-h-0 opacity-0 pointer-events-none'
            }`}
          >
            <div className="py-2 space-y-0.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl mt-2 border border-gray-200/40 dark:border-gray-700/30 shadow-lg overflow-hidden">
              {navigationItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.href)}
                  className={`relative block w-full text-left px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                    activeSection === item.id ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                  }`}
                  style={{
                    animation: isMenuOpen ? `slideIn 0.4s ease-out ${index * 0.05}s both` : 'none',
                  }}
                >
                  {activeSection === item.id && (
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-teal-500" />
                  )}
                  <span className="relative z-10 flex items-center justify-between">
                    <span>{item.label}</span>
                    {activeSection === item.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </span>
                </button>
              ))}
              {/* Mobile resume button */}
              <button
                onClick={() => { window.open(personalInfo.resumeUrl, '_blank'); setIsMenuOpen(false); }}
                className="relative block w-full text-left px-4 py-3 text-sm font-semibold text-blue-600 dark:text-blue-400"
              >
                <span className="flex items-center gap-2">
                  <Download size={15} />
                  Download Resume
                </span>
              </button>
            </div>
          </div>
        </nav>
      </header>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(16px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </>
  );
};
