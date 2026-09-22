import { motion } from 'framer-motion';
import { GraduationCap, MapPin, Calendar, Code2, Globe, Brain, Target, BookOpen, Rocket } from 'lucide-react';
import { SectionHeading } from '../UI/SectionHeading';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { personalInfo } from '../../data/portfolio';

const services = [
  { icon: Code2, title: 'Programming', desc: 'Java, C, and C++ development with clean, efficient code.', color: 'from-blue-500 to-sky-400' },
  { icon: Globe, title: 'Web Development', desc: 'Responsive, interactive web apps with modern tech.', color: 'from-teal-500 to-emerald-400' },
  { icon: Brain, title: 'Problem Solving', desc: 'Algorithmic thinking and DSA for efficient solutions.', color: 'from-amber-500 to-orange-400' },
  { icon: Target, title: 'CS Fundamentals', desc: 'Strong foundation in computer science principles.', color: 'from-sky-500 to-blue-400' },
];

const timeline = [
  {
    year: '2023',
    title: 'Started BCA Program',
    desc: 'Began Bachelor of Computer Applications at Vinoba Bhave University, Hazaribagh College.',
    icon: BookOpen,
  },
  {
    year: '2024',
    title: 'Core Programming Mastery',
    desc: 'Developed strong proficiency in Java, C, and C++. Built first web applications and tools.',
    icon: Code2,
  },
  {
    year: '2025',
    title: 'Projects & DSA Focus',
    desc: 'Built multiple projects including assignment cover generator and inventory management system. Intensified DSA practice.',
    icon: Rocket,
  },
  {
    year: '2026',
    title: 'Graduation & Beyond',
    desc: 'Expected graduation. Seeking internships and collaborative opportunities in software development.',
    icon: GraduationCap,
  },
];

export const About: React.FC = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.15 });

  return (
    <section id="about" className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-transparent dark:from-gray-800/20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="About Me"
          badgeIcon={GraduationCap}
          badgeColor="blue"
          title="Academic Journey &"
          highlight="Aspirations"
          description="BCA student at Vinoba Bhave University with a passion for programming, web development, and continuous learning in computer science."
        />

        <div className="grid lg:grid-cols-2 gap-16 items-start mb-20">
          {/* Left: Bio + education card */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">My Story</h3>
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
                  that will provide hands-on exposure and help me hone my technical skills further.
                </p>
              </div>
            </div>

            {/* Education card */}
            <div className="bg-white dark:bg-gray-800/60 rounded-2xl p-6 border border-gray-200 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Bachelor of Computer Applications
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">Vinoba Bhave University</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} />
                      <span>{personalInfo.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      <span>2023 - 2026 (Expected)</span>
                    </div>
                  </div>
                  {/* Progress toward graduation */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                      <span>Program Progress</span>
                      <span>~67%</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: '67%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-blue-600 to-teal-500 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Service cards */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">What I Do</h3>
            <div className="grid grid-cols-2 gap-4">
              {services.map((service, i) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group bg-white dark:bg-gray-800/60 rounded-2xl p-5 border border-gray-200 dark:border-gray-700/50 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className={`w-11 h-11 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center text-white mb-3 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon size={20} />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1.5 text-sm">{service.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{service.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Currently learning */}
            <div className="mt-4 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-500/10 dark:to-teal-500/10 rounded-2xl p-5 border border-blue-200/50 dark:border-blue-500/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg flex items-center justify-center">
                  <Brain size={16} className="text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Currently Learning</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Deep diving into Data Structures & Algorithms, exploring modern web frameworks, and building real-world projects to sharpen my skills.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Timeline */}
        <div ref={ref}>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-10 text-center">My Journey</h3>
          <div className="relative max-w-3xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-teal-500/50 to-transparent dark:from-blue-400/30 dark:via-teal-400/30 sm:-translate-x-px" />

            {timeline.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className={`relative flex items-start gap-6 mb-10 ${
                  i % 2 === 0 ? 'sm:flex-row-reverse sm:text-right' : ''
                }`}
              >
                {/* Dot */}
                <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 z-10">
                  <div className="w-8 h-8 bg-white dark:bg-gray-800 border-2 border-blue-500 dark:border-blue-400 rounded-full flex items-center justify-center shadow-md">
                    <item.icon size={14} className="text-blue-500 dark:text-blue-400" />
                  </div>
                </div>

                {/* Content */}
                <div className={`flex-1 pl-14 sm:pl-0 ${i % 2 === 0 ? 'sm:pr-14' : 'sm:pl-14'}`}>
                  <div className="bg-white dark:bg-gray-800/60 rounded-2xl p-5 border border-gray-200 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{item.year}</span>
                    <h4 className="font-semibold text-gray-900 dark:text-white mt-1 mb-1.5">{item.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
