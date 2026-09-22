import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionHeading } from '../UI/SectionHeading';
import { testimonialsService } from '../../services/testimonialsService';
import type { TestimonialDB } from '../../types';

const fallbackTestimonials: TestimonialDB[] = [
  {
    id: '1',
    client_name: 'Faculty Member',
    client_role: 'Professor',
    client_company: 'Vinoba Bhave University',
    testimonial: 'Ajnish demonstrates exceptional aptitude in programming and computer science fundamentals. His dedication to learning and problem-solving skills set him apart as a standout student.',
    rating: 5,
    approved: true,
    featured: true,
    sort_order: 0,
    created_at: '',
    updated_at: '',
  },
  {
    id: '2',
    client_name: 'Project Collaborator',
    client_role: 'Fellow Student',
    client_company: 'BCA Program',
    testimonial: 'Working with Ajnish on various projects has been a great experience. His technical skills, especially in Java and web development, combined with his collaborative approach, make him an invaluable team member.',
    rating: 5,
    approved: true,
    featured: true,
    sort_order: 1,
    created_at: '',
    updated_at: '',
  },
  {
    id: '3',
    client_name: 'Peer Reviewer',
    client_role: 'Study Group Lead',
    client_company: 'Hazaribagh College',
    testimonial: "Ajnish's commitment to mastering data structures and algorithms is impressive. He consistently helps others understand complex concepts and contributes meaningfully to our study sessions.",
    rating: 5,
    approved: true,
    featured: true,
    sort_order: 2,
    created_at: '',
    updated_at: '',
  },
];

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

export const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<TestimonialDB[]>(fallbackTestimonials);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    testimonialsService.getTestimonials({ limit: 10 })
      .then(({ testimonials: data }) => {
        if (data && data.length > 0) setTestimonials(data);
      })
      .catch(() => {});
  }, []);

  const handlePrev = useCallback(() => {
    setActiveIndex(prev => (prev === 0 ? testimonials.length - 1 : prev - 1));
  }, [testimonials.length]);

  const handleNext = useCallback(() => {
    setActiveIndex(prev => (prev === testimonials.length - 1 ? 0 : prev + 1));
  }, [testimonials.length]);

  // Auto-play
  useEffect(() => {
    if (isPaused || testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, testimonials.length]);

  const active = testimonials[activeIndex];

  return (
    <section
      id="testimonials"
      className="py-24 bg-gradient-to-b from-slate-50/50 to-white dark:from-gray-800/20 dark:to-gray-900 relative overflow-hidden"
    >
      {/* Subtle background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-400/5 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Testimonials"
          badgeIcon={Quote}
          badgeColor="blue"
          title="What People"
          highlight="Say About Me"
          description="Feedback from professors, peers, and collaborators who have witnessed my growth and contributions."
        />

        {/* Carousel */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="bg-white dark:bg-gray-800/60 rounded-3xl p-8 sm:p-10 border border-gray-200 dark:border-gray-700/50 shadow-xl"
            >
              {/* Quote icon */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Quote className="w-6 h-6 text-white" />
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: active.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                  ))}
                </div>
              </div>

              {/* Content */}
              <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed italic mb-8">
                "{active.testimonial}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 border-t border-gray-100 dark:border-gray-700/50 pt-6">
                {/* Avatar */}
                {active.client_photo_url ? (
                  <img
                    src={active.client_photo_url}
                    alt={active.client_name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-200 dark:border-blue-500/30"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {getInitials(active.client_name)}
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{active.client_name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{active.client_role}</p>
                  {active.client_company && (
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{active.client_company}</p>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {testimonials.length > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={handlePrev}
                className="p-3 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700 hover:border-blue-400 dark:hover:border-blue-400 transition-all duration-300 hover:scale-110 active:scale-95"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" />
              </button>

              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      index === activeIndex
                        ? 'bg-blue-600 w-8'
                        : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 w-2.5'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="p-3 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700 hover:border-blue-400 dark:hover:border-blue-400 transition-all duration-300 hover:scale-110 active:scale-95"
                aria-label="Next testimonial"
              >
                <ChevronRight size={20} className="text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
