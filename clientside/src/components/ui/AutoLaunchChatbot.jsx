import React, { useState, useEffect, useRef, useCallback } from 'react';
import { assets } from '../../assets/assets';

const AutoLaunchChatbot = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatbotPosition, setChatbotPosition] = useState({ 
    x: 0, // Will be set by useEffect
    y: 0  // Will be set by useEffect
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasAutoLaunched, setHasAutoLaunched] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const chatbotRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize position based on current window size
  useEffect(() => {
    const updatePosition = () => {
      setChatbotPosition({
        x: Math.max(20, window.innerWidth - 340), // 320px width + 20px margin, minimum 20px from left
        y: Math.max(20, window.innerHeight - 500) // Keep some margin from top and bottom
      });
    };

    // Set initial position
    updatePosition();

    // Update position on window resize
    window.addEventListener('resize', updatePosition);
    
    return () => window.removeEventListener('resize', updatePosition);
  }, []);

  // Auto-launch the chatbot on page load
  useEffect(() => {
    if (!hasAutoLaunched) {
      const timer = setTimeout(() => {
        setIsChatbotOpen(true);
        setHasAutoLaunched(true);
        setMessages([
          {
            id: 1,
            text: "Hello! 👋 Welcome to Ayursutra! I'm your PanchKarma Wellness Assistant. I'm here to help you with Panchkarma treatments, therapies, and your wellness journey. How can I assist you today?",
            sender: 'bot',
            timestamp: new Date()
          }
        ]);
      }, 1000); // Auto-launch after 1 seconds to allow positioning

      return () => clearTimeout(timer);
    }
  }, [hasAutoLaunched]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chatbot opens
  useEffect(() => {
    if (isChatbotOpen && !isMinimized && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isChatbotOpen, isMinimized]);

  // Handle dragging with boundary constraints
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging && chatbotRef.current) {
        e.preventDefault();
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;

        // Get current chatbot dimensions
        const chatbotRect = chatbotRef.current.getBoundingClientRect();
        const chatbotWidth = 320; // Fixed width
        const chatbotHeight = chatbotRect.height;

        // Calculate boundaries with some padding
        const padding = 10;
        const maxX = window.innerWidth - chatbotWidth - padding;
        const maxY = window.innerHeight - chatbotHeight - padding;

        const constrainedX = Math.max(padding, Math.min(maxX, newX));
        const constrainedY = Math.max(padding, Math.min(maxY, newY));

        setChatbotPosition({
          x: constrainedX,
          y: constrainedY
        });
      }
    };

    const handleMouseUp = (e) => {
      e.preventDefault();
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove, { passive: false });
      document.addEventListener('mouseup', handleMouseUp, { passive: false });
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'grabbing';
    } else {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDragging, dragOffset]);

  const toggleChatbot = () => {
    if (isChatbotOpen && !isMinimized) {
      setIsMinimized(true);
    } else if (isChatbotOpen && isMinimized) {
      setIsMinimized(false);
    } else {
      setIsChatbotOpen(true);
      setIsMinimized(false);
      if (messages.length === 0) {
        setMessages([
          {
            id: 1,
            text: "Hello! 👋 I'm your Ayursutra Assistant. How can I help you with your Panchkarma treatments and wellness journey today?",
            sender: 'bot',
            timestamp: new Date()
          }
        ]);
      }
    }
  };

  const closeChatbot = () => {
    setIsChatbotOpen(false);
    setIsMinimized(false);
  };

  const handleDragStart = (e) => {
    const target = e.target;
    const isInteractiveElement = target.closest('input, button, .chatbot-input-area, .chatbot-messages');

    // Don't drag if clicking on interactive elements
    if (isInteractiveElement || e.target.closest('.chatbot-close-btn') || e.target.closest('.chatbot-minimize-btn')) {
      return;
    }

    // Only handle left mouse button
    if (e.button !== 0) return;

    const rect = chatbotRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
    e.preventDefault();
    e.stopPropagation();
  };

  const sendMessageToGemini = async (message) => {
    const API_KEY = "AIzaSyBQ1qqJICZ4lBpKsZmBc_NUr6STO-Gsklg";
    const MODEL_NAME = "gemini-2.0-flash";
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are Ayursutra Assistant, a helpful and knowledgeable chatbot for a Panchkarma wellness and therapy platform.
              You should provide helpful, accurate information about:
              - Panchkarma treatments and their benefits (Vamana, Virechana, Basti, Nasya, Raktamokshana)
              - Booking appointments with certified Panchkarma specialists and therapists
              - Pre and post-treatment care and preparation for Panchkarma therapies
              - Ayurvedic lifestyle guidance and wellness practices
              - Specific conditions treated through Panchkarma detoxification
              - Platform navigation and appointment management
              
              Keep responses concise but informative. Be friendly and professional. Focus on Panchkarma therapies, Ayurvedic wellness, and holistic detoxification.
              
              User message: ${message}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.candidates &&
        data.candidates[0] &&
        data.candidates[0].content &&
        data.candidates[0].content.parts &&
        data.candidates[0].content.parts[0]) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Invalid response structure from Gemini API');
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);

      if (error.message.includes('403')) {
        return "I'm sorry, there seems to be an authentication issue. Please check the API configuration.";
      } else if (error.message.includes('429')) {
        return "I'm receiving too many requests right now. Please wait a moment and try again.";
      } else {
        return "I'm sorry, I'm having trouble connecting to the server. Please try again later.";
      }
    }
  };

  const handleSendMessage = useCallback(async () => {
    const trimmedMessage = inputMessage.trim();
    if (!trimmedMessage || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: trimmedMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const botResponse = await sendMessageToGemini(trimmedMessage);

      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble responding right now. Please try again.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        if (inputRef.current && isChatbotOpen && !isMinimized) {
          inputRef.current.focus();
        }
      }, 100);
    }
  }, [inputMessage, isLoading, isChatbotOpen, isMinimized]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleInputChange = useCallback((e) => {
    setInputMessage(e.target.value);
  }, []);

  // Floating chatbot button when minimized or closed
  const FloatingButton = () => (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        isChatbotOpen && !isMinimized ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <button
        onClick={toggleChatbot}
        className="bg-[#8B4513] hover:bg-[#733a10] text-white rounded-full p-4 shadow-elevated hover-lift transition-all duration-300 group relative"
        aria-label="Open chatbot"
      >
        <img
  src={assets.chatbot}
  alt="Chatbot"
  className="w-6 h-6 group-hover:scale-110 transition-transform duration-200"
/>

        {/* Notification dot for new messages */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse"></div>
      </button>
    </div>
  );

  return (
    <>
      <FloatingButton />
      
      {/* Main Chatbot Panel */}
      <div
        ref={chatbotRef}
        className={`fixed w-80 bg-background border border-border rounded-lg shadow-elevated z-[60] transition-all duration-300 transform ${
          isChatbotOpen && !isMinimized
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-2 pointer-events-none'
        }`}
        style={{ left: `${chatbotPosition.x}px`, top: `${chatbotPosition.y}px` }}
      >
        {/* Header */}
        <div
          className={`flex justify-between items-center p-4 bg-muted rounded-t-lg select-none transition-colors ${
            isDragging ? 'cursor-grabbing bg-muted/80' : 'cursor-grab hover:bg-muted/80'
          }`}
          onMouseDown={handleDragStart}
        >
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <h3 className="font-semibold text-foreground">Ayursutra Assistant</h3>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setIsMinimized(true)}
              className="chatbot-minimize-btn text-text-secondary hover:text-foreground p-1 hover:bg-background rounded transition-colors"
              aria-label="Minimize chatbot"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <button
              onClick={closeChatbot}
              className="chatbot-close-btn text-text-secondary hover:text-foreground p-1 hover:bg-background rounded transition-colors"
              aria-label="Close chatbot"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="p-4">
          <div className="chatbot-messages h-64 bg-muted rounded-lg p-3 mb-3 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-3 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
              >
                <div
                  className={`inline-block p-3 rounded-lg max-w-[80%] ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-sm'
                      : 'bg-secondary text-secondary-foreground rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="text-left mb-3">
                <div className="inline-block p-3 rounded-lg bg-secondary text-secondary-foreground rounded-bl-sm">
                  <div className="flex items-center">
                    <div className="text-sm">Ayursutra Assistant is thinking</div>
                    <div className="ml-2 flex space-x-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chatbot-input-area flex space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              placeholder="Ask about Panchkarma treatments, therapies, or wellness guidance..."
              className="flex-1 px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              disabled={isLoading}
              autoComplete="off"
              spellCheck="false"
            />
            <button
              onClick={handleSendMessage}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[60px]"
              disabled={isLoading || !inputMessage.trim()}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Send'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AutoLaunchChatbot;

