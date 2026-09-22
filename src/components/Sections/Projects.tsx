import React from 'react';
import { ExternalLink, Github, Folder, Star } from 'lucide-react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { projects } from '../../data/portfolio';

export const Projects: React.FC = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  const featuredProjects = projects.filter(project => project.featured);
  const otherProjects = projects.filter(project => !project.featured);

  return (
    <section id="projects" className="py-20 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-800/50 dark:via-gray-900 dark:to-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="text-center mb-16">
          {/* Section Badge */}
          <div
            className={`inline-flex items-center px-4 py-2 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 text-sm font-medium mb-6 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Folder size={16} className="mr-2" />
            Portfolio
          </div>

          {/* Section Title */}
          <h2
            className={`text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6 transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Featured{' '}
            <span className="bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Projects
            </span>
          </h2>

          {/* Section Description */}
          <p
            className={`text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Academic and personal projects demonstrating programming skills, problem-solving abilities, 
            and practical application development.
          </p>
        </div>

        {/* Featured Projects */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {featuredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              isVisible={isVisible}
              featured
            />
          ))}
        </div>

        {/* Other Projects */}
        {otherProjects.length > 0 && (
          <>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Other Projects
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {otherProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index + featuredProjects.length}
                  isVisible={isVisible}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

interface ProjectCardProps {
  project: typeof projects[0];
  index: number;
  isVisible: boolean;
  featured?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, isVisible, featured = false }) => {
  const [cardRef, isCardVisible] = useIntersectionObserver({ threshold: 0.2 });

  const categoryColors = {
    web: 'from-blue-600 to-cyan-500',
    mobile: 'from-green-600 to-emerald-500',
    desktop: 'from-indigo-600 to-blue-500',
    academic: 'from-orange-600 to-amber-500',
  };

  const statusColors = {
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'in-progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    planned: 'bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-400',
  };

  return (
    <div
      ref={cardRef}
      className={`group bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/5 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-500 overflow-hidden transform hover:-translate-y-2 ${
        featured ? 'lg:col-span-1' : ''
      } ${
        isVisible ? `opacity-100 translate-y-0 delay-${index * 100}` : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Project Header */}
      <div className={`h-32 bg-gradient-to-r ${categoryColors[project.category]} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Folder className="w-12 h-12 text-white/80" />
        </div>
        
        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-4 right-4">
            <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
              <Star className="w-4 h-4 text-yellow-300 fill-current" />
              <span className="text-white text-sm font-medium">Featured</span>
            </div>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
            {project.status.replace('-', ' ')}
          </span>
        </div>
      </div>

      {/* Project Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-teal-500 transition-colors duration-300">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
          {project.description}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium hover:bg-teal-100 dark:hover:bg-teal-900/30 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Project Links */}
        <div className="flex flex-wrap gap-3">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-colors duration-200 group/link"
            >
              <Github size={16} className="group-hover/link:scale-110 transition-transform duration-200" />
              <span className="text-sm font-medium">Code</span>
            </a>
          )}
          
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-200 group/link"
            >
              <ExternalLink size={16} className="group-hover/link:scale-110 transition-transform duration-200" />
              <span className="text-sm font-medium">Live Demo</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};