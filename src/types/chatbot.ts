// Chatbot-specific type definitions
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  isTyping?: boolean;
}

export interface ChatbotConfig {
  apiKey: string;
  apiUrl: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

export interface ChatbotResponse {
  success: boolean;
  message?: string;
  error?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface PortfolioContext {
  personalInfo: Record<string, unknown>;
  skills: Array<Record<string, unknown>>;
  projects: Array<Record<string, unknown>>;
  experience: string[];
  education: string[];
  achievements: string[];
  availability: string;
}

export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}