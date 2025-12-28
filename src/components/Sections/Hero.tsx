import React from 'react';
import { ArrowDown, Download, Mail, Code2, Zap, Trophy, Users, Sparkles, Github, Linkedin, Twitter } from 'lucide-react';
import { useTypingAnimation } from '../../hooks/useTypingAnimation';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { personalInfo, typingTexts, stats } from '../../data/portfolio';

export const Hero: React.FC = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.3 });
  const typingText = useTypingAnimation({
    texts: typingTexts,
    typeSpeed: 100,
    deleteSpeed: 50,
    pauseDuration: 2000,
  });

  const handleDownloadResume = () => {
    window.open(personalInfo.resumeUrl, '_blank');
  };

  const handleContactClick = () => {
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollDown = () => {
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-teal-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900"
    >
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Gradient Orbs */}
        <div className="absolute -top-1/2 -right-1/2 w-full h-full">
          <div className="w-[800px] h-[800px] bg-gradient-to-r from-blue-400/20 via-indigo-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse" />
        </div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full">
          <div className="w-[800px] h-[800px] bg-gradient-to-r from-teal-400/20 via-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
          <div className="w-[600px] h-[600px] bg-gradient-to-r from-purple-400/15 via-pink-400/15 to-indigo-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Enhanced Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_70%,transparent_100%)]" />

        {/* Floating Particles with More Variety */}
        <div className="absolute inset-0">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-float"
              style={{
                width: `${Math.random() * 8 + 2}px`,
                height: `${Math.random() * 8 + 2}px`,
                background: i % 4 === 0 
                  ? 'rgba(59, 130, 246, 0.4)' 
                  : i % 4 === 1 
                  ? 'rgba(20, 184, 166, 0.4)' 
                  : i % 4 === 2
                  ? 'rgba(99, 102, 241, 0.4)'
                  : 'rgba(168, 85, 247, 0.4)',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 7}s`,
                filter: 'blur(1px)',
              }}
            />
          ))}
        </div>

        {/* Animated Lines */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-400 to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-3/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
      </div>

      {/* Main Content */}
      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-32 pb-20">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24">
          
          {/* Enhanced Profile Picture */}
          <div
            className={`flex-shrink-0 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 -translate-x-12 scale-90'
            }`}
          >
            <div className="relative group">
              {/* Multiple Gradient Rings */}
              <div className="absolute -inset-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 rounded-full blur-2xl opacity-60 group-hover:opacity-90 transition duration-1000 animate-pulse"></div>
              <div className="absolute -inset-2 bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 rounded-full blur-xl opacity-40 group-hover:opacity-70 transition duration-700" style={{ animationDelay: '0.5s' }}></div>

              {/* Rotating Border */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 via-purple-600 to-teal-600 rounded-full opacity-75 group-hover:opacity-100 animate-spin-slow"></div>

              {/* Profile Image Container */}
              <div className="relative">
                <img
                  src="/profile.jpg"
                  alt={personalInfo.name}
                  className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full object-cover border-4 border-white dark:border-gray-900 shadow-2xl hover:shadow-3xl transition-all duration-500 group-hover:scale-105"
                />

                {/* Enhanced Status Badge with Icon */}
                <div className="absolute bottom-8 right-6 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-2xl flex items-center space-x-2 border-3 border-white dark:border-gray-900 hover:shadow-green-500/50 hover:scale-110 transition-all duration-300 animate-bounce-slow">
                  <Sparkles size={16} className="animate-pulse" />
                  <span>Available for Work</span>
                </div>

                {/* Floating Icons Around Profile */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl shadow-xl animate-float" style={{ animationDelay: '0s', animationDuration: '3s' }}>
                  <Code2 size={24} className="text-white" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-gradient-to-br from-teal-500 to-cyan-600 p-3 rounded-2xl shadow-xl animate-float" style={{ animationDelay: '1s', animationDuration: '4s' }}>
                  <Zap size={24} className="text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Text Content */}
          <div className="flex-1 text-center lg:text-left max-w-2xl">
            {/* Greeting with Icon */}
            <div
              className={`inline-flex items-center gap-2 mb-4 transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <span className="text-4xl sm:text-5xl animate-wave">👋</span>
              <span className="text-xl sm:text-2xl font-semibold text-gray-600 dark:text-gray-400">Welcome!</span>
            </div>

            {/* Main Heading with Enhanced Gradient */}
            <h1
              className={`text-5xl sm:text-6xl lg:text-7xl font-black mb-6 transition-all duration-1000 delay-100 leading-tight ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <span className="block bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 dark:from-white dark:via-blue-200 dark:to-white bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                Hi, I'm
              </span>
              <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 dark:from-blue-400 dark:via-indigo-400 dark:to-teal-400 bg-clip-text text-transparent mt-2 animate-gradient bg-[length:200%_auto]">
                {personalInfo.name}
              </span>
            </h1>

            {/* Enhanced Typing Animation */}
            <div
              className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 min-h-[80px] flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 transition-all duration-1000 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Sparkles size={28} className="text-yellow-500 animate-pulse" />
                I'm a
              </span>
              <span className="relative">
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 dark:from-blue-400 dark:via-indigo-400 dark:to-teal-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto] font-black">
                  {typingText}
                </span>
                <span className="animate-pulse text-blue-600 dark:text-blue-400 ml-1">|</span>
              </span>
            </div>

            {/* Enhanced Description */}
            <p
              className={`text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed transition-all duration-1000 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {personalInfo.bio}
            </p>

            {/* Social Links (New Addition) */}
            <div
              className={`flex gap-3 justify-center lg:justify-start mb-8 transition-all duration-1000 delay-400 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <a href="https://github.com/ajnish-kumar-sahu" className="group p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg hover:scale-110 transition-all duration-300">
                <Github size={22} className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
              </a>
              <a href="#" className="group p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg hover:scale-110 transition-all duration-300">
                <Linkedin size={22} className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
              </a>
              <a href="#" className="group p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg hover:scale-110 transition-all duration-300">
                < Twitter size={22} className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
              </a>
            </div>

            {/* Enhanced CTA Buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center transition-all duration-1000 delay-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <button
                onClick={handleContactClick}
                className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-blue-500/40 transform hover:scale-105 transition-all duration-300 flex items-center space-x-3 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-600 via-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Mail size={22} className="relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                <span className="relative z-10 text-lg">Let's Connect</span>
                <Sparkles size={18} className="relative z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>

              <button
                onClick={handleDownloadResume}
                className="group relative px-10 py-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-2xl border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Download size={22} className="relative z-10 group-hover:translate-y-1 transition-transform duration-300" />
                <span className="relative z-10 text-lg">View Resume</span>
              </button>
            </div>

            {/* Enhanced Quick Stats */}
            <div
              className={`mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 transition-all duration-1000 delay-600 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="group relative p-5 bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-800/70 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl hover:border-blue-400/60 dark:hover:border-blue-400/60 transition-all duration-300 transform hover:scale-105 hover:shadow-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex flex-col items-center space-y-3">
                  <div className="p-3 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Code2 size={24} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-2xl font-black text-gray-900 dark:text-white">{stats.projectsCompleted}+</p>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Projects</p>
                </div>
              </div>

              <div className="group relative p-5 bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-800/70 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl hover:border-teal-400/60 dark:hover:border-teal-400/60 transition-all duration-300 transform hover:scale-105 hover:shadow-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex flex-col items-center space-y-3">
                  <div className="p-3 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Zap size={24} className="text-teal-600 dark:text-teal-400" />
                  </div>
                  <p className="text-2xl font-black text-gray-900 dark:text-white">{stats.technologiesLearned}+</p>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Technologies</p>
                </div>
              </div>

              <div className="group relative p-5 bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-800/70 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl hover:border-purple-400/60 dark:hover:border-purple-400/60 transition-all duration-300 transform hover:scale-105 hover:shadow-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex flex-col items-center space-y-3">
                  <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Trophy size={24} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <p className="text-2xl font-black text-gray-900 dark:text-white">{stats.certificationsEarned}+</p>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Certifications</p>
                </div>
              </div>

              <div className="group relative p-5 bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-800/70 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl hover:border-orange-400/60 dark:hover:border-orange-400/60 transition-all duration-300 transform hover:scale-105 hover:shadow-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex flex-col items-center space-y-3">
                  <div className="p-3 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Users size={24} className="text-orange-600 dark:text-orange-400" />
                  </div>
                  <p className="text-2xl font-black text-gray-900 dark:text-white">{stats.yearsOfStudy}+</p>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Years</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <div className="text-center mt-24">
          <button
            onClick={handleScrollDown}
            className={`group relative inline-flex flex-col items-center gap-2 transition-all duration-1000 delay-700 hover:scale-110 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            aria-label="Scroll to next section"
          >
            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Scroll Down</span>
            <div className="p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-full group-hover:border-blue-500 dark:group-hover:border-blue-400 group-hover:shadow-lg transition-all duration-300 animate-bounce">
              <ArrowDown size={24} className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            </div>
          </button>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient {
          animation: gradient 6s ease infinite;
        }

        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(20deg); }
          75% { transform: rotate(-15deg); }
        }
        
        .animate-wave {
          animation: wave 2s ease-in-out infinite;
          display: inline-block;
          transform-origin: 70% 70%;
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};