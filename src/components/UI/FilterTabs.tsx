import { motion, AnimatePresence } from 'framer-motion';

interface FilterTab {
  id: string;
  label: string;
  count?: number;
}

interface FilterTabsProps {
  tabs: FilterTab[];
  active: string;
  onChange: (id: string) => void;
}

export function FilterTabs({ tabs, active, onChange }: FilterTabsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative px-5 py-2.5 rounded-full text-sm font-semibold transition-colors duration-300 ${
              isActive
                ? 'text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="filter-tab-bg"
                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-teal-500 rounded-full shadow-lg shadow-blue-500/30"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            {!isActive && (
              <span className="absolute inset-0 bg-gray-100 dark:bg-gray-800 rounded-full" />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {tab.label}
              {tab.count !== undefined && (
                <span className={`text-xs ${isActive ? 'text-white/70' : 'text-gray-400'}`}>
                  {tab.count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export { AnimatePresence };
