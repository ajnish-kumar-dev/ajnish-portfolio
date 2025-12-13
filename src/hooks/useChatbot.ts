import { useState, useCallback, useRef, useEffect } from 'react';
import { ChatMessage } from '../types/chatbot';
import { chatbotService } from '../services/chatbotService';

export const useChatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Hi! I'm Ajnish Kumar's portfolio assistant. I can help you learn about his technical skills, projects, education, and experience. What would you like to know?",
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    // Add typing indicator
    const typingMessage: ChatMessage = {
      id: 'typing',
      content: 'Thinking...',
      sender: 'assistant',
      timestamp: new Date(),
      isTyping: true,
    };
    setMessages(prev => [...prev, typingMessage]);

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      const response = await chatbotService.sendMessage(content);
      
      // Remove typing indicator
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'));

      if (response.success && response.message) {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: response.message,
          sender: 'assistant',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(response.error || 'Failed to get response');
      }
    } catch (error) {
      // Remove typing indicator
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'));

      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);

      // Add fallback message
      const fallbackMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment, or feel free to contact Ajnish directly at ajnish@example.com.',
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [isLoading]);

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: '1',
        content: "Hi! I'm Ajnish Kumar's portfolio assistant. I can help you learn about his technical skills, projects, education, and experience. What would you like to know?",
        sender: 'assistant',
        timestamp: new Date(),
      },
    ]);
    setError(null);
  }, []);

  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    cancelRequest,
  };
};