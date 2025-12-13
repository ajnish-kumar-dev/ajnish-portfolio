import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Minimize2, Maximize2, Bot, User, Sparkles, HelpCircle, RefreshCw, Volume2, VolumeX } from 'lucide-react';
import { ChatMessage } from '../../types/chatbot';
import { chatbotService } from '../../services/chatbotService';
import { TypingIndicator } from './TypingIndicator';
import { AutoResizeTextarea } from './AutoResizeTextarea';

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [userIsTyping, setUserIsTyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Hi there! I'm Ajnish's AI assistant. I'm here to help you explore his portfolio, skills, and projects. What would you like to discover?",
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connected');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const handleInputChange = useCallback((value: string) => {
    setInputMessage(value);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    if (!userIsTyping && value.length > 0) {
      setUserIsTyping(true);
    }

    const timeout = setTimeout(() => {
      setUserIsTyping(false);
    }, 1000);

    setTypingTimeout(timeout);
  }, [typingTimeout, userIsTyping]);

  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || isLoading) return;

    const messageText = inputMessage.trim();
    setInputMessage('');
    setUserIsTyping(false);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: messageText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setIsTyping(true);
    setConnectionStatus('connecting');

    const typingMessage: ChatMessage = {
      id: 'typing',
      content: 'Thinking...',
      sender: 'assistant',
      timestamp: new Date(),
      isTyping: true,
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      const response = await chatbotService.sendMessage(messageText);

      setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
      setConnectionStatus('connected');

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response.message || 'I apologize, but I encountered an issue. Please try asking your question again.',
        sender: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
      setConnectionStatus('disconnected');

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment, or feel free to contact Ajnish directly at ajnishkumar7070@gmail.com.',
        sender: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  }, [inputMessage, isLoading, typingTimeout]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleQuickResponse = useCallback((question: string) => {
    setInputMessage(question);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  }, [handleSendMessage]);

  const handleResetChat = useCallback(() => {
    setMessages([
      {
        id: '1',
        content: "Hi there! I'm Ajnish's AI assistant. I'm here to help you explore his portfolio, skills, and projects. What would you like to discover?",
        sender: 'assistant',
        timestamp: new Date(),
      },
    ]);
    setConnectionStatus('connected');
  }, []);

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-400';
      case 'connecting': return 'bg-yellow-400 animate-pulse';
      case 'disconnected': return 'bg-red-400';
      default: return 'bg-gray-400';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Online';
      case 'connecting': return 'Connecting...';
      case 'disconnected': return 'Offline';
      default: return 'Unknown';
    }
  };

  const quickResponses = chatbotService.getQuickResponses();

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative bg-gradient-to-r from-blue-600 via-teal-600 to-cyan-600 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/30 transform hover:scale-110 transition-all duration-300 animate-pulse hover:animate-none"
          aria-label="Open chat assistant"
        >
          <MessageCircle size={24} className="relative z-10" />

          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 opacity-75 animate-ping"></div>

          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center animate-bounce">
            <Sparkles size={12} className="text-white" />
          </div>

          <div className="absolute bottom-full right-0 mb-3 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none shadow-xl">
            Chat with Ajnish's AI Assistant
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 overflow-hidden ${
        isMinimized ? 'w-80 h-16' : 'w-[90vw] sm:w-96 h-[85vh] sm:h-[600px] max-w-md max-h-[600px]'
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 via-teal-600 to-cyan-600 text-white rounded-t-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-teal-600/20 to-cyan-600/20 animate-pulse"></div>

          <div className="flex items-center space-x-3 relative z-10">
            <div className="relative w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 shadow-lg">
              <Bot size={18} className="text-white" />
              <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getConnectionStatusColor()} rounded-full border-2 border-white shadow-sm`}></div>
            </div>
            <div>
              <h3 className="font-bold text-sm">AI Assistant</h3>
              <p className="text-xs opacity-90 flex items-center space-x-1">
                <span className={`w-2 h-2 ${getConnectionStatusColor()} rounded-full`}></span>
                <span>{isTyping ? 'Typing...' : getConnectionStatusText()}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1 relative z-10">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200 hover:scale-110"
              aria-label={soundEnabled ? "Mute notifications" : "Enable notifications"}
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
            <button
              onClick={handleResetChat}
              className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200 hover:scale-110"
              aria-label="Reset chat"
            >
              <RefreshCw size={16} />
            </button>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200 hover:scale-110"
              aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
            >
              {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200 hover:scale-110"
              aria-label="Close chat"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[340px] sm:h-[440px] bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-800/50 dark:to-gray-800 chatbot-messages">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-end space-x-2 ${message.sender === 'user' ? 'justify-end flex-row-reverse space-x-reverse' : 'justify-start'} animate-slide-in-up`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-teal-500'
                      : 'bg-gradient-to-r from-gray-500 to-gray-600 dark:from-gray-600 dark:to-gray-700'
                  }`}>
                    {message.sender === 'user' ? (
                      <User size={16} className="text-white" />
                    ) : (
                      <Bot size={16} className="text-white" />
                    )}
                  </div>

                  <div
                    className={`max-w-[75%] p-3 rounded-2xl shadow-sm transition-all duration-200 ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-br-sm'
                        : message.isTyping
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-bl-sm border border-gray-200 dark:border-gray-600'
                        : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-sm border border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    {message.isTyping ? (
                      <TypingIndicator />
                    ) : (
                      <>
                        <div className="text-sm whitespace-pre-wrap leading-relaxed chatbot-message">{message.content}</div>
                        <div className={`text-xs mt-2 opacity-70 ${
                          message.sender === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}

              {userIsTyping && (
                <div className="flex items-end space-x-2 justify-end flex-row-reverse space-x-reverse animate-fade-in">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-blue-500 to-teal-500 shadow-sm">
                    <User size={16} className="text-white" />
                  </div>
                  <div className="max-w-[75%] p-3 rounded-2xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-br-sm border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">typing...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {messages.length === 1 && (
              <div className="px-4 pb-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                <div className="flex items-center space-x-2 mb-3 pt-3">
                  <HelpCircle size={16} className="text-gray-400" />
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Quick questions:</p>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {quickResponses.slice(0, 2).map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickResponse(item.question)}
                      className="text-xs bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 text-left hover:shadow-sm"
                    >
                      {item.question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex items-end space-x-3">
                <AutoResizeTextarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-gray-600 transition-all text-sm resize-none min-h-[48px] max-h-[120px]"
                  disabled={isLoading}
                  maxLength={1000}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="p-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-xl hover:from-blue-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg hover:scale-105 disabled:hover:scale-100 group"
                  aria-label="Send message"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <Send size={16} className="group-hover:translate-x-0.5 transition-transform duration-200" />
                  )}
                </button>
              </div>

              <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                <span>Press Enter to send</span>
                <span className={inputMessage.length > 800 ? 'text-red-500' : ''}>
                  {inputMessage.length}/1000
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
