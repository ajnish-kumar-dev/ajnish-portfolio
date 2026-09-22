import { motion } from 'framer-motion';
import { ArrowDown, Download, Mail, Code2, Zap, Trophy, Users, Github, Linkedin, Twitter, Sparkles } from 'lucide-react';
import { useTypingAnimation } from '../../hooks/useTypingAnimation';
import { useCountUp } from '../../hooks/useCountUp';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { personalInfo, typingTexts, stats } from '../../data/portfolio';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

function StatCard({ icon: Icon, value, suffix, label, color, delay }: {
  icon: typeof Code2; value: number; suffix: string; label: string; color: string; delay: number;
}) {
  const count = useCountUp({ end: value, duration: 2200 });
  return (
    <motion.div
      custom={delay}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="group relative p-5 bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/60 dark:border-gray-700/50 rounded-2xl hover:border-blue-400/60 dark:hover:border-blue-400/40 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 overflow-hidden"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-300`} />
      <div className="relative flex flex-col items-center space-y-2.5">
        <div className={`p-2.5 bg-gradient-to-br ${color} bg-opacity-10 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={20} className="text-gray-700 dark:text-gray-200" />
        </div>
        <p className="text-2xl font-black text-gray-900 dark:text-white tabular-nums">
          {count}{suffix}
        </p>
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
      </div>
    </motion.div>
  );
}

export const Hero: React.FC = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.2 });
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
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollDown = () => {
    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900"
    >
      {/* Refined animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-teal-400/10 dark:bg-teal-500/5 rounded-full blur-3xl" />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_60%,transparent_100%)]" />

        {/* Subtle floating particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-float"
              style={{
                width: `${Math.random() * 5 + 2}px`,
                height: `${Math.random() * 5 + 2}px`,
                background: i % 2 === 0 ? 'rgba(59, 130, 246, 0.25)' : 'rgba(20, 184, 166, 0.25)',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${4 + Math.random() * 6}s`,
                filter: 'blur(0.5px)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Main content */}
      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 lg:pt-36 pb-20">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">

          {/* Profile picture */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: -20 }}
            animate={isVisible ? { opacity: 1, scale: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex-shrink-0"
          >
            <div className="relative group">
              {/* Glow rings */}
              <div className="absolute -inset-3 bg-gradient-to-r from-blue-500/30 to-teal-500/30 rounded-full blur-2xl opacity-50 group-hover:opacity-70 transition duration-700" />
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full opacity-60 group-hover:opacity-80 animate-spin-slow" style={{ animationDuration: '12s' }} />

              {/* Image */}
              <div className="relative">
                <img
                  src="/profile.jpg"
                  alt={personalInfo.name}
                  className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-full object-cover border-4 border-white dark:border-gray-900 shadow-2xl transition-transform duration-500 group-hover:scale-105"
                />

                {/* Status badge */}
                <div className="absolute bottom-6 right-2 sm:right-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl flex items-center space-x-2 border border-green-200 dark:border-green-500/30">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                  </span>
                  <span>Available for Work</span>
                </div>

                {/* Floating icon badges */}
                <div className="absolute -top-3 -right-3 bg-white dark:bg-gray-800 p-2.5 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 animate-float" style={{ animationDuration: '4s' }}>
                  <Code2 size={20} className="text-blue-500" />
                </div>
                <div className="absolute -bottom-3 -left-3 bg-white dark:bg-gray-800 p-2.5 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 animate-float" style={{ animationDuration: '5s', animationDelay: '1s' }}>
                  <Zap size={20} className="text-teal-500" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Text content */}
          <div className="flex-1 text-center lg:text-left max-w-2xl">
            {/* Greeting */}
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate={isVisible ? 'visible' : 'hidden'}
              className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 ring-1 ring-blue-200/60 dark:ring-blue-500/20"
            >
              <Sparkles size={15} className="text-blue-500" />
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">Welcome to my portfolio</span>
            </motion.div>

            {/* Name heading */}
            <motion.h1
              custom={0.1}
              variants={fadeUp}
              initial="hidden"
              animate={isVisible ? 'visible' : 'hidden'}
              className="text-5xl sm:text-6xl lg:text-7xl font-black mb-4 leading-[1.1] tracking-tight"
            >
              <span className="block text-gray-900 dark:text-white">Hi, I'm</span>
              <span className="block bg-gradient-to-r from-blue-600 via-sky-500 to-teal-500 dark:from-blue-400 dark:via-sky-400 dark:to-teal-400 bg-clip-text text-transparent mt-1">
                {personalInfo.name}
              </span>
            </motion.h1>

            {/* Typing animation */}
            <motion.div
              custom={0.2}
              variants={fadeUp}
              initial="hidden"
              animate={isVisible ? 'visible' : 'hidden'}
              className="text-2xl sm:text-3xl font-bold mb-6 min-h-[48px] flex items-center justify-center lg:justify-start gap-2"
            >
              <span className="text-gray-500 dark:text-gray-400 font-medium">I'm a</span>
              <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-teal-500 dark:from-blue-400 dark:via-sky-400 dark:to-teal-400 bg-clip-text text-transparent font-black">
                {typingText}
              </span>
              <span className="animate-pulse text-blue-500">|</span>
            </motion.div>

            {/* Bio */}
            <motion.p
              custom={0.3}
              variants={fadeUp}
              initial="hidden"
              animate={isVisible ? 'visible' : 'hidden'}
              className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-xl"
            >
              {personalInfo.bio}
            </motion.p>

            {/* Social links */}
            <motion.div
              custom={0.4}
              variants={fadeUp}
              initial="hidden"
              animate={isVisible ? 'visible' : 'hidden'}
              className="flex gap-3 justify-center lg:justify-start mb-8"
            >
              {[
                { href: 'https://github.com/ajnish-kumar-sahu', icon: Github },
                { href: 'https://linkedin.com/in/ajnish-kumar-20ag', icon: Linkedin },
                { href: '#', icon: Twitter },
              ].map(({ href, icon: Icon }, i) => (
                <a
                  key={i}
                  href={href}
                  target={href !== '#' ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="group p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-400 dark:hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <Icon size={20} className="text-gray-600 dark:text-gray-300 group-hover:text-blue-500 transition-colors" />
                </a>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              custom={0.5}
              variants={fadeUp}
              initial="hidden"
              animate={isVisible ? 'visible' : 'hidden'}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center"
            >
              <button
                onClick={handleContactClick}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.03] transition-all duration-300 flex items-center space-x-2.5"
              >
                <Mail size={20} />
                <span>Let's Connect</span>
              </button>

              <button
                onClick={handleDownloadResume}
                className="group px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-400 hover:shadow-lg transition-all duration-300 flex items-center space-x-2.5"
              >
                <Download size={20} className="group-hover:translate-y-0.5 transition-transform" />
                <span>View Resume</span>
              </button>
            </motion.div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <StatCard icon={Code2} value={stats.projectsCompleted} suffix="+" label="Projects" color="from-blue-500 to-sky-400" delay={0.6} />
              <StatCard icon={Zap} value={stats.technologiesLearned} suffix="+" label="Tech" color="from-teal-500 to-emerald-400" delay={0.7} />
              <StatCard icon={Trophy} value={stats.certificationsEarned} suffix="+" label="Certs" color="from-amber-500 to-orange-400" delay={0.8} />
              <StatCard icon={Users} value={stats.yearsOfStudy} suffix="+" label="Years" color="from-sky-500 to-blue-400" delay={0.9} />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ delay: 1.2 }}
          className="text-center mt-16"
        >
          <button
            onClick={handleScrollDown}
            className="group inline-flex flex-col items-center gap-2"
            aria-label="Scroll to next section"
          >
            <span className="text-xs font-medium text-gray-400 dark:text-gray-500 group-hover:text-blue-500 transition-colors uppercase tracking-wider">Scroll Down</span>
            <div className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full group-hover:border-blue-400 group-hover:shadow-lg transition-all duration-300 animate-bounce">
              <ArrowDown size={18} className="text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors" />
            </div>
          </button>
        </motion.div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </section>
  );
};
