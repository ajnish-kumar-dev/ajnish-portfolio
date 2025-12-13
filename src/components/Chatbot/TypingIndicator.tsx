import React from 'react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center space-x-3">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce chatbot-typing-dot"></div>
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce chatbot-typing-dot" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce chatbot-typing-dot" style={{ animationDelay: '0.2s' }}></div>
      </div>
      <span className="text-sm text-gray-500 dark:text-gray-400">AI is thinking...</span>
    </div>
  );
};