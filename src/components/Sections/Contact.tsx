import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MapPin, Phone, Send, CheckCircle, AlertCircle, MessageCircle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { SectionHeading } from '../UI/SectionHeading';
import { SocialIcons } from '../UI/SocialIcons';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import { personalInfo, socialLinks } from '../../data/portfolio';
import type { ContactFormData, ContactFormErrors } from '../../types';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: ContactFormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    else if (formData.name.length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    else if (formData.subject.length < 3) newErrors.subject = 'Subject must be at least 3 characters';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    else if (formData.message.length < 10) newErrors.message = 'Message must be at least 10 characters';
    else if (formData.message.length > 1000) newErrors.message = 'Message must be less than 1000 characters';
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
      const { error } = await supabase.from('contact_messages').insert([
        { name: formData.name.trim(), email: formData.email.trim(), subject: formData.subject.trim(), message: formData.message.trim(), status: 'new' },
      ]).select();
      if (error) throw new Error(error.message);
      toast.success('Message sent successfully! I\'ll get back to you soon.');
      setIsSent(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      toast.error(`Failed to send message: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactCards = [
    { icon: Mail, label: 'Email', value: personalInfo.email, href: `mailto:${personalInfo.email}`, color: 'from-blue-500 to-sky-400' },
    ...(personalInfo.phone ? [{ icon: Phone, label: 'Phone', value: personalInfo.phone, href: `tel:${personalInfo.phone}`, color: 'from-teal-500 to-emerald-400' }] : []),
    { icon: MapPin, label: 'Location', value: personalInfo.location, href: null, color: 'from-amber-500 to-orange-400' },
  ];

  return (
    <section id="contact" className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Get In Touch"
          badgeIcon={Mail}
          badgeColor="emerald"
          title="Let's Connect &"
          highlight="Collaborate"
          description="Open to internships, collaborative projects, and networking opportunities. Let's explore how we can work together."
        />

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Availability badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-green-50 dark:bg-green-500/10 rounded-xl border border-green-200 dark:border-green-500/20">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              <span className="text-sm font-semibold text-green-700 dark:text-green-400">Available for internships and collaborations</span>
            </div>

            {/* Contact cards */}
            <div className="space-y-3">
              {contactCards.map((card) => (
                <div key={card.label}>
                  {card.href ? (
                    <a
                      href={card.href}
                      className="group flex items-center gap-4 p-4 bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700/50 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-500/30 hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <div className={`w-11 h-11 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center text-white shadow-md flex-shrink-0`}>
                        <card.icon size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide">{card.label}</p>
                        <p className="text-sm text-gray-900 dark:text-white font-medium truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{card.value}</p>
                      </div>
                      <ArrowRight size={16} className="text-gray-300 dark:text-gray-600 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                    </a>
                  ) : (
                    <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700/50">
                      <div className={`w-11 h-11 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center text-white shadow-md flex-shrink-0`}>
                        <card.icon size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide">{card.label}</p>
                        <p className="text-sm text-gray-900 dark:text-white font-medium">{card.value}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Social links */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Connect on social</h4>
              <div className="flex flex-wrap gap-2.5">
                {socialLinks.map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
                  >
                    <SocialIcons icon={social.icon} className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{social.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Form / Success state */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            <AnimatePresence mode="wait">
              {isSent ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white dark:bg-gray-800/60 rounded-3xl p-10 border border-gray-200 dark:border-gray-700/50 shadow-lg text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20">
                    <CheckCircle size={32} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">Thanks for reaching out. I'll get back to you as soon as possible.</p>
                  <button
                    onClick={() => setIsSent(false)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="bg-white dark:bg-gray-800/60 rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700/50 shadow-lg space-y-5"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle size={18} className="text-blue-500" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">Send me a message</h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <FormField label="Name" name="name" value={formData.name} onChange={handleInputChange} error={errors.name} placeholder="Your full name" />
                    <FormField label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} error={errors.email} placeholder="your.email@example.com" />
                  </div>

                  <FormField label="Subject" name="subject" value={formData.subject} onChange={handleInputChange} error={errors.subject} placeholder="Project collaboration, internship, etc." />

                  <div>
                    <FormField
                      label="Message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      error={errors.message}
                      placeholder="Tell me about your project or how we can work together..."
                      textarea
                    />
                    <div className="flex justify-end mt-1.5">
                      <p className={`text-xs ${
                        formData.message.length > 800 ? 'text-red-500' : formData.message.length > 600 ? 'text-amber-500' : 'text-gray-400'
                      }`}>
                        {formData.message.length}/1000
                      </p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <LoadingSpinner size="sm" className="text-white" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  placeholder?: string;
  type?: string;
  textarea?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({ label, name, value, onChange, error, placeholder, type = 'text', textarea }) => {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;
  const isFloating = focused || hasValue;

  const baseClass = `w-full px-4 pt-6 pb-2 rounded-xl border bg-white dark:bg-gray-900/50 text-gray-900 dark:text-white transition-all duration-200 outline-none ${
    error
      ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
      : 'border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
  }`;

  return (
    <div className="relative">
      <label
        htmlFor={name}
        className={`absolute left-4 transition-all duration-200 pointer-events-none ${
          isFloating
            ? 'top-2 text-xs font-medium text-blue-500 dark:text-blue-400'
            : 'top-4 text-sm text-gray-400 dark:text-gray-500'
        }`}
      >
        {label} *
      </label>
      {textarea ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={5}
          className={`${baseClass} resize-none`}
          placeholder={isFloating ? placeholder : ''}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={baseClass}
          placeholder={isFloating ? placeholder : ''}
        />
      )}
      {error && (
        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
          <AlertCircle size={12} />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};
