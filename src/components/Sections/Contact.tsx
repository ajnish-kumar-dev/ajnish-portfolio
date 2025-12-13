import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { personalInfo, socialLinks } from '../../data/portfolio';
import { SocialIcons } from '../UI/SocialIcons';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import type { ContactFormData, ContactFormErrors } from '../../types';

export const Contact: React.FC = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.2 });
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: ContactFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.length < 3) {
      newErrors.subject = 'Subject must be at least 3 characters';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    } else if (formData.message.length > 1000) {
      newErrors.message = 'Message must be less than 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name as keyof ContactFormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([
          {
            name: formData.name.trim(),
            email: formData.email.trim(),
            subject: formData.subject.trim(),
            message: formData.message.trim(),
            status: 'new',
          },
        ])
        .select();

      if (error) {
        throw new Error(error.message);
      }

      toast.success(
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <div>
            <p className="font-semibold">Message sent successfully!</p>
            <p className="text-sm text-gray-600">I'll get back to you soon.</p>
          </div>
        </div>,
        {
          duration: 5000,
          position: 'top-right',
        }
      );

      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';

      toast.error(
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <div>
            <p className="font-semibold">Failed to send message</p>
            <p className="text-sm text-gray-600">{errorMessage}</p>
          </div>
        </div>,
        {
          duration: 5000,
          position: 'top-right',
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800/30 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="text-center mb-16">
          <div
            className={`inline-flex items-center px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm font-medium mb-6 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Mail size={16} className="mr-2" />
            Get In Touch
          </div>

          <h2
            className={`text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6 transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Let's Connect &{' '}
            <span className="bg-gradient-to-r from-green-500 via-blue-500 to-cyan-600 bg-clip-text text-transparent">
              Collaborate
            </span>
          </h2>

          <p
            className={`text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Open to internships, collaborative projects, and networking opportunities.
            Let's connect and explore how we can work together in technology and innovation.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div
            className={`space-y-8 transition-all duration-700 delay-500 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Contact Information
              </h3>

              <div className="space-y-6">
                <div className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Email</h4>
                    <a
                      href="mailto:ajnishkumar7070@gmail.com"
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
                    >
                      ajnishkumar7070@gmail.com
                    </a>
                  </div>
                </div>

                {personalInfo.phone && (
                  <div className="flex items-start space-x-4 group">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-teal-500 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-green-500/20 group-hover:scale-110 transition-transform duration-300">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Phone</h4>
                      <a
                        href={`tel:${personalInfo.phone}`}
                        className="text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors duration-200"
                      >
                        {personalInfo.phone}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-amber-500 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Location</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {personalInfo.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Connect with me</h4>
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700/50 hover:shadow-lg hover:scale-105 transition-all duration-200 group"
                  >
                    <SocialIcons
                      icon={social.icon}
                      className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-200"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-200">
                      {social.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div
            className={`transition-all duration-700 delay-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.name
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                    } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-opacity-50 transition-colors duration-200`}
                    placeholder="Your full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500 flex items-center space-x-1">
                      <AlertCircle size={14} />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.email
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                    } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-opacity-50 transition-colors duration-200`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500 flex items-center space-x-1">
                      <AlertCircle size={14} />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.subject
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-opacity-50 transition-colors duration-200`}
                  placeholder="Project collaboration, internship, etc."
                />
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-500 flex items-center space-x-1">
                    <AlertCircle size={14} />
                    <span>{errors.subject}</span>
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.message
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-opacity-50 transition-colors duration-200 resize-none`}
                  placeholder="Tell me about your project or how we can work together..."
                />
                <div className="flex justify-between items-center mt-2">
                  {errors.message ? (
                    <p className="text-sm text-red-500 flex items-center space-x-1">
                      <AlertCircle size={14} />
                      <span>{errors.message}</span>
                    </p>
                  ) : (
                    <div />
                  )}
                  <p className={`text-sm ${
                    formData.message.length > 800
                      ? 'text-red-500'
                      : formData.message.length > 600
                      ? 'text-yellow-500'
                      : 'text-gray-400'
                  }`}>
                    {formData.message.length}/1000
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-2 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" className="text-white relative z-10" />
                    <span className="relative z-10">Sending Message...</span>
                  </>
                ) : (
                  <>
                    <Send size={20} className="relative z-10" />
                    <span className="relative z-10">Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
