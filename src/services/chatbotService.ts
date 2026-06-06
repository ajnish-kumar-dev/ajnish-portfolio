import { ChatbotConfig, ChatbotResponse, PortfolioContext, ConversationMessage } from '../types/chatbot';
import { personalInfo, skills, projects } from '../data/portfolio';

// Security: Use environment variables for sensitive data
const getApiConfig = (): ChatbotConfig | null => {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;

  if (!apiKey) {
    console.warn('DeepSeek API key not found. Chatbot will use enhanced fallback responses.');
    return null;
  }

  return {
    apiKey,
    apiUrl: import.meta.env.VITE_DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions',
    model: import.meta.env.VITE_DEEPSEEK_MODEL || 'deepseek-chat',
    maxTokens: 1000,
    temperature: 0.7,
  };
};

class ChatbotService {
  private config: ChatbotConfig | null;
  private requestQueue: Map<string, AbortController> = new Map();
  private rateLimitTracker: { requests: number; resetTime: number } = { requests: 0, resetTime: 0 };
  private readonly MAX_REQUESTS_PER_MINUTE = 20;
  private conversationHistory: ConversationMessage[] = [];
  private userPreferences: { askedTopics: Set<string> } = { askedTopics: new Set() };

  constructor() {
    this.config = getApiConfig();
  }

  private portfolioContext: PortfolioContext = {
    personalInfo,
    skills,
    projects,
    experience: [
      'BCA Student at Vinoba Bhave University (2023-2026)',
      'Specializing in Computer Science with focus on Java programming',
      'Active in programming competitions and coding challenges',
      'Building practical applications and academic projects',
    ],
    education: [
      'Bachelor of Computer Applications (BCA) - Vinoba Bhave University',
      'Specialization: Computer Science and Programming',
      'Expected Graduation: 2026',
      'Location: Hazaribagh, Jharkhand',
    ],
    achievements: [
      'Completed 12+ programming projects',
      'Proficient in Java, C/C++, and web technologies',
      'Strong foundation in Data Structures and Algorithms',
      'Active contributor to open-source projects',
    ],
    availability: 'Available for internships, collaborative projects, and freelance work',
  };

  private systemPrompt = `You are Ajnish Kumar's professional portfolio assistant. You represent a BCA student and developer who is passionate about programming and web development.

ABOUT AJNISH KUMAR:
- BCA Student at Vinoba Bhave University, Hazaribagh College
- Specializing in Computer Science with focus on Java programming
- Also proficient in C/C++ and web development (HTML, CSS, JavaScript)
- Currently building knowledge in Data Structures and Algorithms
- Location: Hazaribagh, Jharkhand
- Email: ajnishkumar7070@gmail.com
- Phone: +91 9608415521

TECHNICAL SKILLS:
- Java Programming (85% proficiency) - Principal area of academic interest
- C & C++ (80% proficiency) - System programming and performance-critical applications
- Web Development (78% proficiency) - HTML, CSS, JavaScript
- Data Structures & Algorithms (75% proficiency) - Currently building knowledge
- Problem Solving (82% proficiency) - Analytical thinking and systematic approach
- Computer Science Fundamentals (88% proficiency) - Strong foundation

FEATURED PROJECTS:
1. Assignment Cover Generator - Web application using HTML, CSS, JavaScript for generating professional assignment covers
2. Monthly Item List Management System - Comprehensive C++ inventory management system with CRUD operations
3. Personal Portfolio Website - Modern, responsive portfolio with interactive design
4. Programming Practice Solutions - Collection of algorithmic solutions in Java, C, and C++

EDUCATION & BACKGROUND:
- Currently pursuing BCA at Vinoba Bhave University (2023-2026 expected)
- 2+ years of study in Computer Science
- Strong academic focus on programming methodologies
- Active in building practical applications

AVAILABILITY:
- Open to internships and collaborative ventures
- Available for freelance programming projects
- Seeking networking opportunities with professionals
- Looking for hands-on exposure to enhance technical skills

RESPONSE GUIDELINES:
- Be professional yet approachable and friendly
- Provide specific examples when discussing skills or projects
- Use emojis sparingly but effectively to add personality
- Keep responses concise but informative (150-300 words ideal)
- Always maintain a positive, enthusiastic tone about learning and growth
- If asked about information not available, politely indicate what information you can provide
- Emphasize willingness to learn and collaborate
- Use conversational language while maintaining professionalism
- When discussing projects, mention specific technologies and outcomes
- Show passion for programming and continuous learning

Remember: You represent a dedicated student who is passionate about programming and eager to contribute to meaningful projects while continuing to learn and grow in the field.`;

  // Enhanced keyword detection system
  private keywordPatterns = {
    skills: {
      keywords: ['skill', 'technical', 'programming', 'language', 'technology', 'tech', 'proficiency', 'expertise', 'capability', 'knowledge', 'competency'],
      weight: 1.0
    },
    projects: {
      keywords: ['project', 'work', 'portfolio', 'built', 'created', 'developed', 'application', 'app', 'system', 'website', 'code'],
      weight: 1.0
    },
    education: {
      keywords: ['education', 'background', 'study', 'student', 'university', 'college', 'degree', 'bca', 'academic', 'learning', 'course'],
      weight: 1.0
    },
    contact: {
      keywords: ['contact', 'hire', 'available', 'email', 'phone', 'reach', 'connect', 'touch', 'availability', 'freelance', 'internship', 'opportunity'],
      weight: 1.0
    },
    experience: {
      keywords: ['experience', 'journey', 'background', 'history', 'worked', 'career', 'professional', 'worked on'],
      weight: 0.9
    },
    achievements: {
      keywords: ['achievement', 'accomplish', 'success', 'award', 'recognition', 'milestone', 'competitive', 'won'],
      weight: 0.8
    },
    tools: {
      keywords: ['tool', 'framework', 'library', 'ide', 'software', 'environment', 'platform'],
      weight: 0.7
    },
    personal: {
      keywords: ['who', 'about', 'yourself', 'introduce', 'tell me', 'describe', 'personality', 'interest', 'hobby'],
      weight: 0.9
    },
    specific_tech: {
      keywords: ['java', 'c++', 'javascript', 'html', 'css', 'algorithm', 'data structure', 'oop', 'programming'],
      weight: 1.1
    }
  };

  // Rate limiting check
  private checkRateLimit(): boolean {
    const now = Date.now();
    
    if (now > this.rateLimitTracker.resetTime) {
      this.rateLimitTracker.requests = 0;
      this.rateLimitTracker.resetTime = now + 60000;
    }
    
    return this.rateLimitTracker.requests < this.MAX_REQUESTS_PER_MINUTE;
  }

  // Enhanced error handling with retry logic
  private async makeApiRequest(messages: ConversationMessage[], retryCount = 0): Promise<Record<string, unknown>> {
    if (!this.config) {
      throw new Error('Chatbot API is not configured');
    }

    const maxRetries = 3;
    const baseDelay = 1000;

    try {
      const response = await fetch(this.config.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
          'User-Agent': 'Portfolio-Chatbot/1.0',
        },
        body: JSON.stringify({
          model: this.config.model,
          messages,
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' })) as Record<string, unknown>;
        
        switch (response.status) {
          case 401:
            throw new Error('Invalid API key. Please check your configuration.');
          case 402:
            throw new Error('Insufficient credits. Please check your DeepSeek account.');
          case 429:
            if (retryCount < maxRetries) {
              const delay = baseDelay * Math.pow(2, retryCount);
              await new Promise(resolve => setTimeout(resolve, delay));
              return this.makeApiRequest(messages, retryCount + 1);
            }
            throw new Error('Rate limit exceeded. Please try again later.');
          case 500:
            if (retryCount < maxRetries) {
              const delay = baseDelay * Math.pow(2, retryCount);
              await new Promise(resolve => setTimeout(resolve, delay));
              return this.makeApiRequest(messages, retryCount + 1);
            }
            throw new Error('Server error. Please try again later.');
          default:
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }
      }

      return await response.json();
    } catch (error) {
      if (retryCount < maxRetries && error instanceof TypeError) {
        const delay = baseDelay * Math.pow(2, retryCount);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.makeApiRequest(messages, retryCount + 1);
      }
      throw error;
    }
  }

  // Intelligent intent detection
  private detectIntent(message: string): { intent: string; confidence: number }[] {
    const normalizedMessage = message.toLowerCase();
    const scores: { intent: string; confidence: number }[] = [];

    for (const [intent, { keywords, weight }] of Object.entries(this.keywordPatterns)) {
      let score = 0;
      let matchCount = 0;

      for (const keyword of keywords) {
        if (normalizedMessage.includes(keyword)) {
          matchCount++;
          // Give extra weight for exact matches vs. partial matches
          const isExactWord = new RegExp(`\\b${keyword}\\b`, 'i').test(normalizedMessage);
          score += isExactWord ? weight : weight * 0.7;
        }
      }

      if (score > 0) {
        // Normalize score based on message length and keyword count
        const normalizedScore = (score / Math.sqrt(normalizedMessage.split(' ').length)) * matchCount;
        scores.push({ intent, confidence: normalizedScore });
      }
    }

    // Sort by confidence descending
    return scores.sort((a, b) => b.confidence - a.confidence);
  }

  async sendMessage(userMessage: string): Promise<ChatbotResponse> {
    // Add to conversation history
    this.conversationHistory.push({ role: 'user', content: userMessage });

    // Check if API is configured
    if (!this.config) {
      const response = this.getEnhancedFallbackResponse(userMessage);
      this.conversationHistory.push({ role: 'assistant', content: response });
      return {
        success: true,
        message: response,
      };
    }

    // Check rate limiting
    if (!this.checkRateLimit()) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please wait a moment before sending another message.',
        message: this.getEnhancedFallbackResponse(userMessage),
      };
    }

    this.rateLimitTracker.requests++;

    try {
      const messages = [
        {
          role: 'system',
          content: this.systemPrompt,
        },
        ...this.conversationHistory.slice(-6), // Keep last 3 exchanges for context
      ];

      const data = await this.makeApiRequest(messages);

      if (data.choices && data.choices[0] && data.choices[0].message) {
        const responseMessage = data.choices[0].message.content.trim();
        this.conversationHistory.push({ role: 'assistant', content: responseMessage });
        
        return {
          success: true,
          message: responseMessage,
          usage: data.usage,
        };
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (error) {
      console.error('Chatbot API Error:', error);
      const fallbackResponse = this.getEnhancedFallbackResponse(userMessage);
      this.conversationHistory.push({ role: 'assistant', content: fallbackResponse });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: fallbackResponse,
      };
    }
  }

  // Enhanced fallback response system with intelligent intent matching
  private getEnhancedFallbackResponse(userMessage: string): string {
    const message = userMessage.toLowerCase();
    const intents = this.detectIntent(message);

    // Track what topics the user has asked about
    if (intents.length > 0) {
      this.userPreferences.askedTopics.add(intents[0].intent);
    }

    // Handle greetings
    if (/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)\b/i.test(message)) {
      return this.getGreetingResponse();
    }

    // Handle thanks
    if (/(thank|thanks|appreciate|grateful)/i.test(message)) {
      return this.getThanksResponse();
    }

    // Handle specific technology questions
    if (/(java|c\+\+|javascript|html|css)/i.test(message)) {
      return this.getSpecificTechResponse(message);
    }

    // Route to appropriate response based on highest confidence intent
    if (intents.length > 0) {
      const primaryIntent = intents[0].intent;

      switch (primaryIntent) {
        case 'skills':
        case 'specific_tech':
          return this.getSkillsResponse(message);
        case 'projects':
          return this.getProjectsResponse(message);
        case 'education':
          return this.getEducationResponse();
        case 'contact':
          return this.getContactResponse();
        case 'experience':
          return this.getExperienceResponse();
        case 'achievements':
          return this.getAchievementsResponse();
        case 'personal':
          return this.getPersonalResponse();
        default:
          return this.getDefaultResponse();
      }
    }

    return this.getDefaultResponse();
  }

  private getGreetingResponse(): string {
    const greetings = [
      "👋 Hello! I'm Ajnish Kumar's AI assistant. I'm here to help you explore his portfolio, skills, and projects. What would you like to know?",
      "Hi there! 😊 Thanks for your interest in Ajnish's portfolio. I can tell you about his technical skills, projects, education, or how to get in touch. What interests you most?",
      "Hey! Welcome! I'm here to share all about Ajnish's journey as a developer. Feel free to ask me anything about his skills, projects, or background!",
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  private getThanksResponse(): string {
    const responses = [
      "You're welcome! 😊 Is there anything else you'd like to know about Ajnish's work or skills?",
      "Happy to help! Feel free to ask if you have any other questions about Ajnish's portfolio or projects.",
      "My pleasure! Let me know if you'd like to learn more about his technical expertise or recent projects.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getSkillsResponse(message: string): string {
    return `💻 **Technical Skills & Expertise**

**Primary Programming Languages:**
• **Java** (85% proficiency) - My strongest area! I focus on OOP principles, data structures, and application development
• **C & C++** (80% proficiency) - System programming, memory management, and performance optimization
• **Web Technologies** (78% proficiency) - HTML5, CSS3, JavaScript for modern responsive websites

**Computer Science Fundamentals:**
• **Data Structures & Algorithms** (75% proficiency) - Arrays, linked lists, trees, sorting, searching
• **Problem Solving** (82% proficiency) - Algorithmic thinking and code optimization
• **CS Foundations** (88% proficiency) - Strong grasp of core concepts

**Development Approach:**
✨ Clean, maintainable code
✨ Test-driven development practices
✨ Continuous learning mindset

I'm always working on improving these skills through hands-on projects and practice. Want to know more about any specific technology?`;
  }

  private getSpecificTechResponse(message: string): string {
    if (/java/i.test(message)) {
      return `☕ **Java Expertise**

Java is my primary programming language with **85% proficiency**!

**What I've Built with Java:**
• Assignment Cover Generator - Swing GUI application
• Monthly Item Management System - CRUD operations with file handling
• Various algorithmic solutions and data structure implementations

**Java Concepts I'm Proficient In:**
✓ Object-Oriented Programming (OOP)
✓ Collections Framework
✓ Exception Handling
✓ File I/O Operations
✓ GUI Development with Swing

**Currently Learning:**
→ Advanced design patterns
→ Spring Boot framework basics
→ Multithreading concepts

I love Java's "write once, run anywhere" philosophy and its robust ecosystem!`;
    }

    if (/c\+\+|cpp/i.test(message)) {
      return `⚡ **C++ Proficiency**

C++ is one of my core skills with **80% proficiency**!

**Projects Built:**
• Monthly Item List Management System - Comprehensive inventory solution
• Data structure implementations (linked lists, trees, stacks)
• System-level programming exercises

**C++ Strengths:**
✓ Memory management & pointers
✓ OOP concepts in C++
✓ STL (Standard Template Library)
✓ File handling & data persistence
✓ Performance optimization

I appreciate C++'s power and control over system resources. Great for building efficient, high-performance applications!`;
    }

    if (/(web|html|css|javascript)/i.test(message)) {
      return `🌐 **Web Development Skills**

I have **78% proficiency** in modern web technologies!

**Technologies:**
• **HTML5** - Semantic markup, accessibility
• **CSS3** - Responsive design, flexbox, grid, animations
• **JavaScript** - DOM manipulation, ES6+, async programming

**Web Projects:**
✨ Personal Portfolio Website - Modern, responsive design
✨ Assignment Cover Generator - Interactive web application
✨ Various frontend components and layouts

**Focus Areas:**
→ Responsive design principles
→ Cross-browser compatibility
→ Clean, maintainable code
→ User experience (UX)

I enjoy creating visually appealing and functional web experiences!`;
    }

    return this.getSkillsResponse(message);
  }

  private getProjectsResponse(message: string): string {
    return `🚀 **Featured Projects Portfolio**

Here are some projects I'm proud of:

**1. Assignment Cover Generator** 🎨
→ Java Swing application for creating professional assignment covers
→ Features: Customizable templates, auto-formatting, export options
→ Tech: Java, Swing, File I/O
→ Impact: Helps students save time on assignment presentation

**2. Monthly Item List Management System** 📊
→ Comprehensive inventory management solution
→ Features: CRUD operations, data persistence, search functionality
→ Tech: C++, File handling, Data structures
→ Impact: Efficient tracking and organization of monthly supplies

**3. Personal Portfolio Website** 🌟
→ Modern, responsive portfolio showcase
→ Features: Interactive UI, project gallery, contact form
→ Tech: HTML5, CSS3, JavaScript
→ Impact: Professional online presence

**4. Programming Practice Solutions** 💡
→ Collection of algorithmic implementations
→ Languages: Java, C, C++
→ Topics: Data structures, sorting, searching, problem-solving

Each project demonstrates practical application of programming concepts and commitment to quality code. Want to know more about any specific project?`;
  }

  private getEducationResponse(): string {
    return `🎓 **Educational Background**

**Current Education:**
• **Bachelor of Computer Applications (BCA)**
• **Institution:** Vinoba Bhave University, Hazaribagh College
• **Duration:** 2023 - 2026 (Expected)
• **Location:** Hazaribagh, Jharkhand
• **Specialization:** Computer Science & Programming

**Academic Focus Areas:**
📚 Object-Oriented Programming (Java)
📚 System Programming (C/C++)
📚 Data Structures & Algorithms
📚 Web Development Technologies
📚 Software Engineering Principles
📚 Database Management Systems

**Learning Philosophy:**
✨ Hands-on, project-based learning
✨ Continuous skill development
✨ Practical application of theory
✨ Active participation in coding challenges

**Current Academic Status:**
→ Strong foundation in programming fundamentals
→ Active in building practical applications
→ Participating in academic projects and competitions
→ Maintaining focus on industry-relevant skills

I believe in learning by doing - every project is an opportunity to grow! 🌱`;
  }

  private getContactResponse(): string {
    return `📬 **Let's Connect!**

I'm always excited to discuss new opportunities and collaborations!

**Contact Information:**
📧 **Email:** ajnishkumar7070@gmail.com
📱 **Phone:** +91 9608415521
📍 **Location:** Hazaribagh, Jharkhand

**I'm Available For:**
✅ Internship opportunities
✅ Collaborative projects
✅ Freelance development work
✅ Open-source contributions
✅ Networking with professionals
✅ Learning and mentorship opportunities

**Best Projects For:**
🎯 Java application development
🎯 C++ system programming
🎯 Web development projects
🎯 Academic and educational tools
🎯 Programming challenges and competitions

**Response Time:** 
I typically respond within 24 hours to emails and calls during business hours.

**Preferred Communication:**
Email is best for detailed discussions, but feel free to call for quick questions!

Looking forward to connecting with you! 🤝`;
  }

  private getExperienceResponse(): string {
    return `💼 **Experience & Journey**

**Current Status:**
🎓 BCA Student (2023-2026) at Vinoba Bhave University

**Development Journey:**
📅 **2+ years** of programming experience
📅 Completed **12+ projects** across various domains
📅 Active in **coding challenges** and **problem-solving**

**Key Experiences:**
✨ Building real-world applications from scratch
✨ Implementing complex algorithms and data structures
✨ Contributing to academic and personal projects
✨ Participating in programming competitions
✨ Continuous self-learning through online resources

**Technical Growth:**
→ Started with basic programming fundamentals
→ Progressed to advanced OOP concepts
→ Expanded into web development
→ Currently mastering data structures and algorithms

**Project Experience Includes:**
• Desktop application development (Java Swing)
• System programming (C++)
• Web development (HTML, CSS, JS)
• Algorithm implementation and optimization
• Software design and architecture

**What Drives Me:**
I'm passionate about writing clean, efficient code and solving real-world problems through technology. Every project is a learning opportunity! 🚀

Want to know about any specific aspect of my journey?`;
  }

  private getAchievementsResponse(): string {
    return `🏆 **Achievements & Milestones**

**Academic Accomplishments:**
✨ Completed **12+ programming projects** successfully
✨ Strong foundation in **multiple programming languages**
✨ Consistent academic performance in CS courses
✨ Active participation in coding challenges

**Technical Milestones:**
🎯 Achieved **85% proficiency in Java**
🎯 Built **production-ready applications**
🎯 Mastered **OOP principles** and design patterns
🎯 Developed **strong problem-solving skills** (82% proficiency)
🎯 **88% proficiency** in CS fundamentals

**Project Highlights:**
✓ Assignment Cover Generator - Helped streamline academic work for many students
✓ Inventory Management System - Full-featured CRUD application
✓ Personal Portfolio - Professional online presence
✓ Algorithm Solutions - Diverse collection of optimized implementations

**Skills Development:**
→ Self-taught in web development
→ Continuously learning advanced programming concepts
→ Building practical solutions to real problems
→ Active contributor to open-source learning

**What Sets Me Apart:**
💡 Strong foundation in fundamentals
💡 Passion for clean, maintainable code
💡 Continuous learning mindset
💡 Ability to translate theory into practice
💡 Enthusiasm for new challenges

**Currently Working Towards:**
🎯 Mastering advanced data structures
🎯 Learning modern web frameworks
🎯 Building more complex applications
🎯 Contributing to larger projects

The journey is ongoing, and I'm excited about what's ahead! 🚀`;
  }

  private getPersonalResponse(): string {
    return `👨‍💻 **About Ajnish Kumar**

**Who I Am:**
I'm a passionate BCA student and aspiring developer from Hazaribagh, Jharkhand. Programming isn't just my field of study—it's something I genuinely love doing!

**My Programming Journey:**
Started my coding journey with Java and quickly fell in love with problem-solving. Since then, I've expanded into C++, web development, and continue to explore new technologies every day.

**What Drives Me:**
💡 **Curiosity** - Always eager to learn new technologies
🎯 **Problem-Solving** - Love the challenge of finding elegant solutions
🚀 **Building Things** - Creating applications that solve real problems
📚 **Continuous Learning** - Technology never stops evolving, neither do I

**Work Style:**
✨ Detail-oriented with focus on code quality
✨ Systematic approach to problem-solving
✨ Collaborative and open to feedback
✨ Deadline-conscious and reliable

**Beyond Coding:**
When I'm not programming, I enjoy:
• Exploring new programming languages and frameworks
• Participating in coding challenges
• Reading tech blogs and documentation
• Staying updated with industry trends

**My Goal:**
To become a skilled full-stack developer who can contribute to meaningful projects and help solve real-world problems through technology.

**Philosophy:**
"Every line of code is an opportunity to learn something new!" 💫

I believe in writing code that's not just functional, but also clean, efficient, and maintainable. Quality over quantity, always!`;
  }

  private getDefaultResponse(): string {
    const topics = Array.from(this.userPreferences.askedTopics);
    const unaskedTopics = ['skills', 'projects', 'education', 'contact', 'experience']
      .filter(topic => !topics.includes(topic));

    let suggestions = '';
    if (unaskedTopics.length > 0) {
      const topicLabels: Record<string, string> = {
        skills: '💻 Technical Skills',
        projects: '🚀 Projects',
        education: '🎓 Education',
        contact: '📬 Contact Info',
        experience: '💼 Experience'
      };
      
      suggestions = '\n\n**You might also want to know about:**\n' + 
        unaskedTopics.slice(0, 3).map(t => topicLabels[t]).join('\n');
    }

    return `👋 **Hello! I'm Ajnish Kumar's Portfolio Assistant**

I can help you discover:

💻 **Technical Skills** - Programming languages, frameworks, and proficiencies
🚀 **Projects** - Completed work and practical applications  
🎓 **Education** - Academic background and specializations
💼 **Experience** - Development journey and achievements
📬 **Contact** - How to reach out for opportunities

**About Ajnish:**
A dedicated BCA student specializing in Java, C++, and web development. Passionate about building practical solutions and continuously learning new technologies.

**Quick Facts:**
• 85% proficiency in Java
• 12+ completed projects
• 2+ years of programming experience
• Available for internships and collaborations

What would you like to explore? Feel free to ask specific questions!${suggestions}`;
  }

  // Enhanced quick responses with better categorization
  getQuickResponses(): { question: string; response: string; category: string }[] {
    return [
      {
        category: 'skills',
        question: "What are your main technical skills?",
        response: "I specialize in Java (85%), C/C++ (80%), and web development (78%). Strong foundation in data structures, algorithms, and problem-solving!"
      },
      {
        category: 'projects',
        question: "Tell me about your best projects",
        response: "My featured projects include an Assignment Cover Generator in Java, a C++ Inventory Management System, and a modern Portfolio Website. Each showcases practical programming skills!"
      },
      {
        category: 'education',
        question: "What's your educational background?",
        response: "I'm pursuing BCA at Vinoba Bhave University (2023-2026), specializing in Computer Science with focus on programming and software development."
      },
      {
        category: 'contact',
        question: "How can I contact you?",
        response: "Feel free to reach out! Email: ajnishkumar7070@gmail.com | Phone: +91 9608415521. I'm available for internships, projects, and collaborations!"
      },
      {
        category: 'experience',
        question: "What's your development experience?",
        response: "2+ years of programming with 12+ completed projects. Active in coding challenges, building practical applications, and continuously learning new technologies!"
      },
      {
        category: 'specific',
        question: "Tell me about your Java expertise",
        response: "Java is my strongest skill at 85% proficiency! I've built desktop applications, implemented data structures, and created various solutions using OOP principles."
      }
    ];
  }

  // Method to get suggested follow-up questions
  getSuggestedQuestions(lastIntent?: string): string[] {
    const suggestions: Record<string, string[]> = {
      skills: [
        "Which programming language are you most proficient in?",
        "What web technologies do you know?",
        "Tell me about your Java expertise"
      ],
      projects: [
        "What was your most challenging project?",
        "Do you have any web development projects?",
        "What technologies did you use in your projects?"
      ],
      education: [
        "What are you currently learning?",
        "What's your specialization?",
        "When will you graduate?"
      ],
      contact: [
        "What type of opportunities are you looking for?",
        "Are you available for freelance work?",
        "What's the best way to reach you?"
      ]
    };

    if (lastIntent && suggestions[lastIntent]) {
      return suggestions[lastIntent];
    }

    return [
      "What are your technical skills?",
      "Tell me about your projects",
      "How can I contact you?",
      "What's your educational background?"
    ];
  }

  // Clear conversation history
  clearHistory(): void {
    this.conversationHistory = [];
    this.userPreferences.askedTopics.clear();
  }
}

export const chatbotService = new ChatbotService();