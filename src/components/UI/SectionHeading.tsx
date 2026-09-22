import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface SectionHeadingProps {
  badge: string;
  badgeIcon: LucideIcon;
  badgeColor?: 'blue' | 'teal' | 'amber' | 'emerald';
  title: string;
  highlight: string;
  description: string;
}

const badgeColors: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 ring-blue-200/60 dark:ring-blue-500/20',
  teal: 'bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400 ring-teal-200/60 dark:ring-teal-500/20',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 ring-amber-200/60 dark:ring-amber-500/20',
  emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 ring-emerald-200/60 dark:ring-emerald-500/20',
};

export function SectionHeading({
  badge,
  badgeIcon: Icon,
  badgeColor = 'blue',
  title,
  highlight,
  description,
}: SectionHeadingProps) {
  return (
    <div className="text-center mb-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ring-1 ${badgeColors[badgeColor]} mb-6`}
      >
        <Icon size={15} />
        {badge}
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-5 tracking-tight"
      >
        {title}{' '}
        <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-teal-500 dark:from-blue-400 dark:via-sky-400 dark:to-teal-400 bg-clip-text text-transparent">
          {highlight}
        </span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed"
      >
        {description}
      </motion.p>
    </div>
  );
}
