import React from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';

interface ChatbotButtonProps {
  onClick: () => void;
  isActive?: boolean;
}

export const ChatbotButton: React.FC<ChatbotButtonProps> = ({ onClick, isActive = false }) => {
  return (
    <button
      onClick={onClick}
      className={`group relative bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 ${
        isActive ? 'scale-110' : 'animate-pulse'
      }`}
      aria-label="Open portfolio assistant"
    >
      <MessageCircle size={24} className="relative z-10" />
      
      {/* Notification badge */}
      <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold animate-bounce">
        <Sparkles size={12} />
      </div>
      
      {/* Ripple effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-75 animate-ping"></div>
      
      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        Ask me about Ajnish's portfolio
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
      </div>
    </button>
  );
};