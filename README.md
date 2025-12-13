# Modern Portfolio with AI Chatbot Assistant

A comprehensive React TypeScript portfolio application featuring an intelligent AI chatbot assistant powered by DeepSeek AI.

## Features

### Core Portfolio Features
- **Modern React 18+ Application** with functional components and custom hooks
- **TypeScript Implementation** with complete type safety and proper interfaces
- **Responsive Design** with mobile-first approach using Tailwind CSS
- **Dark/Light Mode Toggle** with persistent user preferences
- **SEO Optimization** with proper meta tags and structured data
- **Performance Optimizations** including lazy loading and intersection observers
- **Accessibility Compliance** with WCAG guidelines and keyboard navigation

### AI Chatbot Assistant
- **DeepSeek AI Integration** for intelligent responses about portfolio content
- **Professional Portfolio Representation** with comprehensive knowledge base
- **Real-time Chat Interface** with typing indicators and message history
- **Fallback Responses** for offline or API connectivity issues
- **Quick Response Suggestions** for common inquiries
- **Responsive Chat Widget** that works across all devices

## Chatbot Capabilities

The AI assistant can provide detailed information about:

- **Technical Skills & Competencies**
  - Programming languages (Java, C/C++, JavaScript)
  - Proficiency levels and areas of expertise
  - Current learning focus and development goals

- **Project Portfolio**
  - Detailed project descriptions and outcomes
  - Technologies used and implementation approaches
  - Live demos and source code repositories

- **Educational Background**
  - Current BCA studies at Vinoba Bhave University
  - Academic specializations and coursework
  - Expected graduation and career timeline

- **Professional Experience**
  - Development journey and achievements
  - Collaborative projects and contributions
  - Internship and freelance availability

- **Contact Information**
  - Direct contact methods and availability
  - Project collaboration opportunities
  - Professional networking and mentorship

## Technical Implementation

### Chatbot Architecture
```typescript
// API Integration with DeepSeek AI
const chatbotService = new ChatbotService({
  apiKey: 'sk-047b9f83856b4074a9706207a7a614b3',
  apiUrl: 'https://api.deepseek.com/v1/chat/completions',
  model: 'deepseek-chat',
  maxTokens: 1000,
  temperature: 0.7
});
```

### Key Components
- **ChatbotWidget**: Main chat interface with message history
- **ChatbotService**: API integration and response handling
- **useChatbot Hook**: State management and message processing
- **Fallback System**: Offline responses for common questions

### Response Guidelines
- Professional yet approachable tone
- Structured responses with bullet points
- Specific examples and concrete details
- Emphasis on learning and collaboration
- Clear contact information and availability

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd portfolio-chatbot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## Environment Configuration

The chatbot is pre-configured with the DeepSeek AI API key. For production deployment, consider:

- Environment variable management for API keys
- Rate limiting and usage monitoring
- Error handling and logging
- User session management

## Chatbot Usage Examples

### Common Interactions
- "Tell me about your web development experience"
- "What projects have you completed recently?"
- "What are your technical skills?"
- "How can I contact you for a project?"
- "Are you available for internships?"

### Response Format
The chatbot provides structured, informative responses with:
- Clear headings and bullet points
- Specific proficiency percentages
- Project details with technologies used
- Contact information and availability
- Professional achievements and goals

## Deployment

The application is optimized for deployment on modern hosting platforms with:
- Static site generation support
- Service worker for offline functionality
- Progressive Web App (PWA) capabilities
- SEO optimization and social media integration

## Contributing

This portfolio represents Ajnish Kumar's professional work and educational journey. The chatbot assistant serves as an intelligent interface for potential collaborators, employers, and fellow developers to learn about his skills and experience.

For questions about the portfolio or potential collaboration opportunities, the chatbot assistant is available 24/7 to provide detailed information and facilitate connections.