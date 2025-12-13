import React from 'react';
import { Quote, Star } from 'lucide-react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  organization: string;
  content: string;
  rating: number;
  image?: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Faculty Member',
    role: 'Professor',
    organization: 'Vinoba Bhave University',
    content: 'Ajnish demonstrates exceptional aptitude in programming and computer science fundamentals. His dedication to learning and problem-solving skills set him apart as a standout student.',
    rating: 5,
  },
  {
    id: '2',
    name: 'Project Collaborator',
    role: 'Fellow Student',
    organization: 'BCA Program',
    content: 'Working with Ajnish on various projects has been a great experience. His technical skills, especially in Java and web development, combined with his collaborative approach, make him an invaluable team member.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Peer Reviewer',
    role: 'Study Group Lead',
    organization: 'Hazaribagh College',
    content: 'Ajnish\'s commitment to mastering data structures and algorithms is impressive. He consistently helps others understand complex concepts and contributes meaningfully to our study sessions.',
    rating: 5,
  },
];

export const Testimonials: React.FC = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-white via-blue-50/30 to-white dark:from-gray-900 dark:via-blue-900/10 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="text-center mb-16">
          <div
            className={`inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Quote size={16} className="mr-2" />
            Testimonials
          </div>

          <h2
            className={`text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6 transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            What People{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 dark:from-blue-400 dark:via-indigo-400 dark:to-teal-400 bg-clip-text text-transparent">
              Say About Me
            </span>
          </h2>

          <p
            className={`text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Feedback from professors, peers, and collaborators who have witnessed my growth and contributions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
  isVisible: boolean;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial, index, isVisible }) => {
  const [cardRef, isCardVisible] = useIntersectionObserver({ threshold: 0.2 });

  return (
    <div
      ref={cardRef}
      className={`group bg-white dark:bg-gray-800/50 rounded-2xl p-8 border border-gray-200 dark:border-gray-700/50 hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/5 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-500 transform hover:-translate-y-2 ${
        isVisible ? `opacity-100 translate-y-0 delay-${index * 100}` : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Quote className="w-6 h-6 text-white" />
        </div>
        <div className="flex space-x-1">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <Star
              key={i}
              className="w-4 h-4 text-yellow-500 fill-current"
            />
          ))}
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed italic">
        "{testimonial.content}"
      </p>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h4 className="font-bold text-gray-900 dark:text-white mb-1">
          {testimonial.name}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {testimonial.role}
        </p>
        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
          {testimonial.organization}
        </p>
      </div>
    </div>
  );
};
