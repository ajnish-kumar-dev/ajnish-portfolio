import React from 'react';
import { GraduationCap, MapPin, Calendar, Award } from 'lucide-react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { personalInfo, stats } from '../../data/portfolio';

export const About: React.FC = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.2 });

  const achievements = [
    {
      icon: <Calendar className="w-6 h-6" />,
      label: 'Years of Study',
      value: stats.yearsOfStudy,
      suffix: '+',
      color: 'from-blue-600 to-cyan-500',
    },
    {
      icon: <Award className="w-6 h-6" />,
      label: 'Projects Completed',
      value: stats.projectsCompleted,
      suffix: '+',
      color: 'from-indigo-600 to-blue-500',
    },
    {
      icon: <GraduationCap className="w-6 h-6" />,
      label: 'Technologies',
      value: stats.technologiesLearned,
      suffix: '+',
      color: 'from-teal-600 to-green-500',
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      label: 'Academic Focus',
      value: 100,
      suffix: '%',
      color: 'from-orange-600 to-amber-500',
    },
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-800/50 dark:via-gray-900 dark:to-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="text-center mb-16">
          {/* Section Badge */}
          <div
            className={`inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <GraduationCap size={16} className="mr-2" />
            About Me
          </div>

          {/* Section Title */}
          <h2
            className={`text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6 transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Academic Journey &{' '}
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 bg-clip-text text-transparent">
              Aspirations
            </span>
          </h2>

          {/* Section Description */}
          <p
            className={`text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            BCA student at Vinoba Bhave University with passion for programming, web development, 
            and continuous learning in computer science.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div
            className={`space-y-8 transition-all duration-700 delay-500 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                My Academic Journey
              </h3>
              <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                <p>
                  I am currently pursuing my Bachelor of Computer Applications at Vinoba Bhave University, 
                  Hazaribagh College, with specialization in Computer Science. My principal area of academic 
                  interest lies in programming, especially Java, but I'm also proficient in C and C++.
                </p>
                <p>
                  I am actively working on building my knowledge in data structures and algorithms to develop 
                  my analytical and problem-solving skills. Beyond core programming, I have a keen interest 
                  in web development with hands-on experience in HTML, CSS, and JavaScript.
                </p>
                <p>
                  I am looking forward to internships, collaborative ventures, and networking opportunities 
                  that will provide hands-on exposure and help me hone my technical skills further. I welcome 
                  connections with professionals and fellow technology enthusiasts.
                </p>
              </div>
            </div>

            {/* Education Details */}
            <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Bachelor of Computer Applications
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400">Vinoba Bhave University</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <MapPin size={14} />
                  <span>{personalInfo.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar size={14} />
                  <span>2023 - 2026 (Expected)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div
            className={`grid grid-cols-2 gap-6 transition-all duration-700 delay-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            {achievements.map((achievement, index) => (
              <div
                key={achievement.label}
                className={`bg-white dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700/50 shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 delay-${index * 100}`}
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${achievement.color} rounded-xl flex items-center justify-center text-white mb-4 shadow-md`}>
                  {achievement.icon}
                </div>
                <div className={`text-3xl font-bold bg-gradient-to-r ${achievement.color} bg-clip-text text-transparent mb-2`}>
                  {achievement.value}{achievement.suffix}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {achievement.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};