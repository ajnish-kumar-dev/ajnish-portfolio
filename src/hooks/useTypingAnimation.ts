import { useState, useEffect, useCallback } from 'react';

interface UseTypingAnimationOptions {
  texts: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
  loop?: boolean;
}

export const useTypingAnimation = ({
  texts,
  typeSpeed = 100,
  deleteSpeed = 50,
  pauseDuration = 2000,
  loop = true,
}: UseTypingAnimationOptions) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const currentText = texts[currentIndex] || '';

  const animate = useCallback(() => {
    if (isPaused) return;

    if (!isDeleting) {
      // Typing phase
      if (displayText.length < currentText.length) {
        setDisplayText(currentText.substring(0, displayText.length + 1));
      } else {
        // Finished typing, pause then start deleting
        setIsPaused(true);
        setTimeout(() => {
          setIsPaused(false);
          setIsDeleting(true);
        }, pauseDuration);
      }
    } else {
      // Deleting phase
      if (displayText.length > 0) {
        setDisplayText(displayText.substring(0, displayText.length - 1));
      } else {
        // Finished deleting, move to next text
        setIsDeleting(false);
        const nextIndex = (currentIndex + 1) % texts.length;
        
        if (nextIndex === 0 && !loop) {
          return; // Stop if not looping and reached the end
        }
        
        setCurrentIndex(nextIndex);
      }
    }
  }, [displayText, currentText, isDeleting, isPaused, currentIndex, texts.length, loop, pauseDuration]);

  useEffect(() => {
    const speed = isDeleting ? deleteSpeed : typeSpeed;
    const timer = setTimeout(animate, speed);
    
    return () => clearTimeout(timer);
  }, [animate, typeSpeed, deleteSpeed, isDeleting]);

  return displayText;
};