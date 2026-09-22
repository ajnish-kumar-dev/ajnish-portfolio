import React, { useState, useEffect } from 'react';

export const ScrollProgress: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-[100] bg-gray-200/30 dark:bg-gray-800/30">
      <div
        className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 transition-all duration-150 ease-out shadow-lg shadow-blue-500/50"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
};
