import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Folder, Star, X, ArrowUpRight } from 'lucide-react';
import { SectionHeading } from '../UI/SectionHeading';
import { FilterTabs } from '../UI/FilterTabs';
import { projects } from '../../data/portfolio';
import type { Project } from '../../types';

type TabId = 'all' | 'web' | 'desktop' | 'academic';

const categoryLabels: Record<string, string> = {
  web: 'Web',
  desktop: 'Desktop',
  academic: 'Academic',
};

const categoryColors: Record<string, string> = {
  web: 'from-blue-500 to-sky-400',
  desktop: 'from-teal-500 to-emerald-400',
  academic: 'from-amber-500 to-orange-400',
};

const statusStyles: Record<string, string> = {
  completed: 'bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-400',
  'in-progress': 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  planned: 'bg-gray-100 text-gray-600 dark:bg-gray-700/50 dark:text-gray-400',
};

export const Projects: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('all');
  const [selected, setSelected] = useState<Project | null>(null);

  const tabs = useMemo(() => {
    const counts = {
      all: projects.length,
      web: projects.filter(p => p.category === 'web').length,
      desktop: projects.filter(p => p.category === 'desktop').length,
      academic: projects.filter(p => p.category === 'academic').length,
    };
    return [
      { id: 'all', label: 'All', count: counts.all },
      { id: 'web', label: 'Web', count: counts.web },
      { id: 'desktop', label: 'Desktop', count: counts.desktop },
      { id: 'academic', label: 'Academic', count: counts.academic },
    ];
  }, []);

  const filtered = useMemo(() => {
    if (activeTab === 'all') return projects;
    return projects.filter(p => p.category === activeTab);
  }, [activeTab]);

  return (
    <section id="projects" className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Portfolio"
          badgeIcon={Folder}
          badgeColor="amber"
          title="Featured"
          highlight="Projects"
          description="Academic and personal projects demonstrating programming skills, problem-solving abilities, and practical application development."
        />

        <FilterTabs tabs={tabs} active={activeTab} onChange={(id) => setActiveTab(id as TabId)} />

        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => setSelected(project)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Detail modal */}
      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  );
};

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const color = categoryColors[project.category] || 'from-blue-500 to-teal-400';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      onClick={onClick}
      className="group bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700/50 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-300 dark:hover:border-blue-500/30 transition-all duration-300 overflow-hidden cursor-pointer hover:-translate-y-1"
    >
      {/* Header banner */}
      <div className={`relative h-36 bg-gradient-to-br ${color} overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10" />
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.2) 0%, transparent 50%)',
        }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <Folder className="w-10 h-10 text-white/60 group-hover:scale-110 transition-transform duration-300" />
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[project.status]}`}>
            {project.status.replace('-', ' ')}
          </span>
        </div>
        {project.featured && (
          <div className="absolute top-3 right-3">
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-2.5 py-1">
              <Star className="w-3.5 h-3.5 text-yellow-300 fill-current" />
              <span className="text-white text-xs font-medium">Featured</span>
            </div>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="text-white font-semibold text-sm flex items-center gap-1.5">
            View Details <ArrowUpRight size={16} />
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {project.title}
          </h3>
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            {categoryLabels[project.category]}
          </span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed line-clamp-2">
          {project.description}
        </p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.technologies.slice(0, 3).map((tech) => (
            <span key={tech} className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-md text-xs font-medium">
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="px-2.5 py-1 text-gray-400 text-xs font-medium">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>

        {/* Links */}
        <div className="flex gap-3">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <Github size={16} /> Code
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              <ExternalLink size={16} /> Demo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
          >
            {/* Header banner */}
            <div className={`relative h-40 bg-gradient-to-br ${categoryColors[project.category] || 'from-blue-500 to-teal-400'} overflow-hidden rounded-t-3xl`}>
              <div className="absolute inset-0 bg-black/10" />
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)',
              }} />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                aria-label="Close"
              >
                <X size={18} className="text-white" />
              </button>
              <div className="absolute bottom-4 left-6">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[project.status]}`}>
                  {project.status.replace('-', ' ')}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{project.title}</h3>

              {project.longDescription && (
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                  {project.longDescription}
                </p>
              )}

              {/* Tech stack */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Tech Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="flex flex-wrap gap-3">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium text-sm"
                  >
                    <Github size={18} /> View Code
                  </a>
                )}
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all font-medium text-sm"
                  >
                    <ExternalLink size={18} /> Live Demo
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
