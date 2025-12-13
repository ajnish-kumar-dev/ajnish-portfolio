import React from 'react';
import { Code, Zap, Globe, Brain, Target, BookOpen } from 'lucide-react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { skills } from '../../data/portfolio';

const skillIcons: Record<string, React.ReactNode> = {
  java: <Code className="w-8 h-8" />,
  cpp: <Zap className="w-8 h-8" />,
  web: <Globe className="w-8 h-8" />,
  dsa: <Brain className="w-8 h-8" />,
  'problem-solving': <Target className="w-8 h-8" />,
  'cs-fundamentals': <BookOpen className="w-8 h-8" />,
};

export const Skills: React.FC = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section id="skills" className="py-20 bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800/30 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="text-center mb-16">
          {/* Section Badge */}
          <div
            className={`inline-flex items-center px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-medium mb-6 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Code size={16} className="mr-2" />
            My Expertise
          </div>

          {/* Section Title */}
          <h2
            className={`text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6 transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Technical{' '}
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
              Skills
            </span>
          </h2>

          {/* Section Description */}
          <p
            className={`text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Passionate about programming and web development, with strong foundation in core computer 
            science concepts and hands-on experience in multiple technologies.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills.map((skill, index) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              icon={skillIcons[skill.id]}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

interface SkillCardProps {
  skill: typeof skills[0];
  icon: React.ReactNode;
  index: number;
  isVisible: boolean;
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, icon, index, isVisible }) => {
  const [cardRef, isCardVisible] = useIntersectionObserver({ threshold: 0.3 });

  return (
    <div
      ref={cardRef}
      className={`group bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 border border-gray-200 dark:border-gray-700/50 hover:shadow-2xl hover:shadow-purple-500/10 transform hover:scale-105 transition-all duration-500 cursor-pointer ${
        isVisible ? `opacity-100 translate-y-0 delay-${index * 100}` : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Icon */}
      <div className="mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-teal-600 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-blue-500/20">
          {icon}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
        {skill.name}
      </h3>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
        {skill.description}
      </p>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Proficiency Level
          </span>
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
            {skill.proficiency}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 rounded-full transition-all duration-1000 ease-out ${
              isCardVisible ? `w-[${skill.proficiency}%]` : 'w-0'
            }`}
            style={{ width: isCardVisible ? `${skill.proficiency}%` : '0%' }}
          >
            <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};