import React from 'react';
import { ArrowUp, Heart, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import { personalInfo, socialLinks, navigationItems } from '../../data/portfolio';
import { SocialIcons } from '../UI/SocialIcons';

export const Footer: React.FC = () => {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-teal-500/10" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 40% 60%, rgba(20, 184, 166, 0.1) 0%, transparent 50%)`,
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-teal-400 bg-clip-text text-transparent mb-2">
                {personalInfo.name}
              </h3>
              <p className="text-lg text-gray-300 mb-4">{personalInfo.title}</p>
              <p className="text-gray-400 leading-relaxed max-w-md">
                {personalInfo.tagline}. Passionate about creating efficient solutions and continuously learning new technologies.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-blue-400/30 transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🎓</span>
                  <div>
                    <p className="text-sm text-gray-400">Education</p>
                    <p className="font-semibold">BCA Student</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-teal-400/30 transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="text-sm text-gray-400">Location</p>
                    <p className="font-semibold">{personalInfo.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white flex items-center">
              <span className="w-1 h-6 bg-gradient-to-b from-blue-400 to-indigo-400 rounded-full mr-3" />
              Quick Links
            </h4>
            <nav className="space-y-3">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.href)}
                  className="block text-gray-400 hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 transform"
                >
                  {item.label}
                </button>
              ))}
              <a
                href={personalInfo.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-400 hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 transform"
              >
                Download Resume
              </a>
            </nav>
          </div>

          {/* Contact & Social - Enhanced Professional Design */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-white flex items-center">
              <span className="w-1.5 h-8 bg-gradient-to-b from-indigo-400 via-blue-400 to-teal-400 rounded-full mr-3" />
              Let's Connect
            </h4>

            {/* Contact Info Cards */}
            <div className="space-y-3 mb-8">
              {/* Email Card */}
              <a
                href="mailto:ajnishkumar7070@gmail.com"
                className="group block bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-indigo-500/10 hover:border-blue-400/40 transition-all duration-300 transform hover:translate-x-1"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Mail size={18} className="text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 mb-0.5">Email</p>
                    <p className="text-sm text-white font-medium truncate group-hover:text-blue-400 transition-colors duration-200">
                      ajnishkumar7070@gmail.com
                    </p>
                  </div>
                  <ExternalLink size={14} className="text-gray-500 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-200" />
                </div>
              </a>

              {/* Phone Card */}
              {personalInfo.phone && (
                <a
                  href={`tel:${personalInfo.phone}`}
                  className="group block bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-gradient-to-r hover:from-teal-500/10 hover:to-emerald-500/10 hover:border-teal-400/40 transition-all duration-300 transform hover:translate-x-1"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-teal-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Phone size={18} className="text-teal-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400 mb-0.5">Phone</p>
                      <p className="text-sm text-white font-medium truncate group-hover:text-teal-400 transition-colors duration-200">
                        {personalInfo.phone}
                      </p>
                    </div>
                    <ExternalLink size={14} className="text-gray-500 group-hover:text-teal-400 opacity-0 group-hover:opacity-100 transition-all duration-200" />
                  </div>
                </a>
              )}

              {/* Location Card */}
              <div className="block bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                    <MapPin size={18} className="text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 mb-0.5">Location</p>
                    <p className="text-sm text-white font-medium truncate">
                      {personalInfo.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links - Enhanced */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Connect on Social</p>
              <div className="grid grid-cols-2 gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center space-x-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2.5 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-indigo-500/10 hover:border-blue-400/40 transition-all duration-300 transform hover:scale-105"
                    aria-label={`Connect on ${social.name}`}
                  >
                    <SocialIcons
                      icon={social.icon}
                      className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors duration-200 flex-shrink-0"
                    />
                    <span className="text-xs text-gray-300 group-hover:text-white font-medium transition-colors duration-200 truncate">
                      {social.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-400">
              <p>&copy; {new Date().getFullYear()} {personalInfo.name}. All rights reserved.</p>
              <p className="flex items-center space-x-1">
                <span>Crafted with</span>
                <Heart size={14} className="text-red-400 animate-pulse" />
                <span>and dedication</span>
              </p>
            </div>

            {/* Scroll to Top Button */}
            <button
              onClick={handleScrollToTop}
              className="p-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 rounded-full hover:shadow-xl hover:shadow-blue-500/30 hover:scale-110 transition-all duration-300 group"
              aria-label="Scroll to top"
            >
              <ArrowUp size={20} className="text-white group-hover:animate-bounce" />
            </button>
          </div>

          {/* Additional Links */}
          <div className="mt-6 pt-6 border-t border-white/5 flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <a href="#home" className="hover:text-blue-400 transition-colors duration-200">Privacy Policy</a>
            <span className="text-gray-600">•</span>
            <a href="#home" className="hover:text-blue-400 transition-colors duration-200">Terms of Service</a>
            <span className="text-gray-600">•</span>
            <a href="#home" className="hover:text-blue-400 transition-colors duration-200">Sitemap</a>
            <span className="text-gray-600">•</span>
            <button onClick={handleScrollToTop} className="hover:text-blue-400 transition-colors duration-200">
              Back to Top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};