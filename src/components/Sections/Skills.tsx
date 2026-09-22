import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Zap, Globe, Brain, Target, BookOpen } from 'lucide-react';
import { SectionHeading } from '../UI/SectionHeading';
import { FilterTabs } from '../UI/FilterTabs';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { skills } from '../../data/portfolio';

const skillIcons: Record<string, React.ReactNode> = {
  java: <Code className="w-7 h-7" />,
  cpp: <Zap className="w-7 h-7" />,
  web: <Globe className="w-7 h-7" />,
  dsa: <Brain className="w-7 h-7" />,
  'problem-solving': <Target className="w-7 h-7" />,
  'cs-fundamentals': <BookOpen className="w-7 h-7" />,
};

const techTags: Record<string, string[]> = {
  java: ['Core Java', 'OOP', 'Collections', 'JDBC'],
  cpp: ['C', 'C++', 'STL', 'Memory Management'],
  web: ['HTML5', 'CSS3', 'JavaScript', 'Responsive'],
  dsa: ['Arrays', 'LinkedLists', 'Trees', 'Sorting'],
  'problem-solving': ['Logic', 'Analysis', 'Optimization'],
  'cs-fundamentals': ['OS', 'DBMS', 'Networking', 'Architecture'],
};

const categoryLabels: Record<string, string> = {
  programming: 'Programming',
  web: 'Web Development',
  soft: 'Core Skills',
};

const categoryColors: Record<string, string> = {
  java: 'from-blue-500 to-sky-400',
  cpp: 'from-teal-500 to-emerald-400',
  web: 'from-sky-500 to-cyan-400',
  dsa: 'from-amber-500 to-orange-400',
  'problem-solving': 'from-emerald-500 to-green-400',
  'cs-fundamentals': 'from-blue-600 to-indigo-400',
};

type TabId = 'all' | 'programming' | 'web' | 'soft';

export const Skills: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('all');

  const tabs = useMemo(() => {
    const counts = {
      all: skills.length,
      programming: skills.filter(s => s.category === 'programming').length,
      web: skills.filter(s => s.category === 'web').length,
      soft: skills.filter(s => s.category === 'soft').length,
    };
    return [
      { id: 'all', label: 'All Skills', count: counts.all },
      { id: 'programming', label: 'Programming', count: counts.programming },
      { id: 'web', label: 'Web', count: counts.web },
      { id: 'soft', label: 'Core Skills', count: counts.soft },
    ];
  }, []);

  const filteredSkills = useMemo(() => {
    if (activeTab === 'all') return skills;
    return skills.filter(s => s.category === activeTab);
  }, [activeTab]);

  return (
    <section id="skills" className="py-24 bg-gradient-to-b from-slate-50/50 to-white dark:from-gray-800/20 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="My Expertise"
          badgeIcon={Code}
          badgeColor="teal"
          title="Technical"
          highlight="Skills"
          description="Passionate about programming and web development, with a strong foundation in core computer science concepts and hands-on experience in multiple technologies."
        />

        <FilterTabs tabs={tabs} active={activeTab} onChange={(id) => setActiveTab(id as TabId)} />

        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} tags={techTags[skill.id] || []} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

interface SkillCardProps {
  skill: typeof skills[0];
  tags: string[];
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, tags }) => {
  const [cardRef, isCardVisible] = useIntersectionObserver({ threshold: 0.3 });
  const color = categoryColors[skill.id] || 'from-blue-500 to-teal-400';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      ref={cardRef}
      className="group bg-white dark:bg-gray-800/60 rounded-2xl p-7 border border-gray-200 dark:border-gray-700/50 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300"
    >
      {/* Icon + category */}
      <div className="flex items-start justify-between mb-5">
        <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
          {skillIcons[skill.id]}
        </div>
        <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-2">
          {categoryLabels[skill.category] || skill.category}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {skill.name}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">
        {skill.description}
      </p>

      {/* Tech tags */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-md text-xs font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Proficiency bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Proficiency</span>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 tabular-nums">
            {skill.proficiency}%
          </span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={isCardVisible ? { width: `${skill.proficiency}%` } : { width: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full bg-gradient-to-r ${color} rounded-full relative`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
