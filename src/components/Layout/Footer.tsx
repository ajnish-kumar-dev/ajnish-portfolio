import { ArrowUp, Heart, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import { personalInfo, socialLinks, navigationItems } from '../../data/portfolio';
import { SocialIcons } from '../UI/SocialIcons';

export const Footer: React.FC = () => {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-950 dark:bg-black text-white relative overflow-hidden">
      {/* Subtle gradient accents */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main content */}
        <div className="py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-sky-400 to-teal-400 bg-clip-text text-transparent mb-2">
              {personalInfo.name}
            </h3>
            <p className="text-gray-400 text-sm mb-4">{personalInfo.title}</p>
            <p className="text-gray-500 leading-relaxed text-sm max-w-sm">
              {personalInfo.tagline}. Passionate about creating efficient solutions and continuously learning new technologies.
            </p>

            {/* Social */}
            <div className="flex gap-2 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-white/5 border border-white/10 rounded-lg hover:bg-blue-500/10 hover:border-blue-400/30 transition-all duration-300 group"
                  aria-label={`Connect on ${social.name}`}
                >
                  <SocialIcons icon={social.icon} className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold mb-5 text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-1 h-4 bg-gradient-to-b from-blue-400 to-teal-400 rounded-full" />
              Quick Links
            </h4>
            <nav className="space-y-2.5">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.href)}
                  className="block text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm"
                >
                  {item.label}
                </button>
              ))}
              <a
                href={personalInfo.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm"
              >
                Download Resume
              </a>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold mb-5 text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-1 h-4 bg-gradient-to-b from-teal-400 to-emerald-400 rounded-full" />
              Get In Touch
            </h4>
            <div className="space-y-3">
              <a href={`mailto:${personalInfo.email}`} className="group flex items-center gap-3 text-sm text-gray-400 hover:text-blue-400 transition-colors">
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-blue-500/10 transition-colors">
                  <Mail size={15} />
                </div>
                <span className="truncate">{personalInfo.email}</span>
              </a>
              {personalInfo.phone && (
                <a href={`tel:${personalInfo.phone}`} className="group flex items-center gap-3 text-sm text-gray-400 hover:text-teal-400 transition-colors">
                  <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-teal-500/10 transition-colors">
                    <Phone size={15} />
                  </div>
                  <span>{personalInfo.phone}</span>
                </a>
              )}
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
                  <MapPin size={15} />
                </div>
                <span>{personalInfo.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 text-xs text-gray-500">
              <p>&copy; {new Date().getFullYear()} {personalInfo.name}. All rights reserved.</p>
              <p className="flex items-center gap-1.5">
                <span>Crafted with</span>
                <Heart size={12} className="text-red-400" />
                <span>and dedication</span>
              </p>
            </div>
            <button
              onClick={handleScrollToTop}
              className="p-2.5 bg-gradient-to-r from-blue-600 to-teal-500 rounded-full hover:shadow-lg hover:shadow-blue-500/30 hover:scale-110 transition-all duration-300 group"
              aria-label="Scroll to top"
            >
              <ArrowUp size={16} className="text-white group-hover:animate-bounce" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
