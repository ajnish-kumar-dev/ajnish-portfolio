import React from 'react';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { SEO } from './components/SEO';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { Hero } from './components/Sections/Hero';
import { About } from './components/Sections/About';
import { Skills } from './components/Sections/Skills';
import { Projects } from './components/Sections/Projects';
import { Testimonials } from './components/Sections/Testimonials';
import { Contact } from './components/Sections/Contact';
import { ChatbotWidget } from './components/Chatbot/ChatbotWidget';
import { ScrollProgress } from './components/UI/ScrollProgress';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <SEO />

        {/* Scroll Progress Indicator */}
        <ScrollProgress />
        
        {/* Header */}
        <Header />
        
        {/* Main Content */}
        <main className="relative">
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Testimonials />
          <Contact />
        </main>
        
        {/* Footer */}
        <Footer />
        
        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--toast-bg)',
              color: 'var(--toast-color)',
              border: '1px solid var(--toast-border)',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#FFFFFF',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#FFFFFF',
              },
            },
          }}
        />
        
        {/* Chatbot Widget */}
        <ChatbotWidget />
      </div>
    </ThemeProvider>
  );
}

export default App;