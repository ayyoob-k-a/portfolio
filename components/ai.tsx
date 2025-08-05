"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Zap, Brain, Code2, Rocket, Star, Wand2, AtSign, Phone, User, Bot } from 'lucide-react';

const AdvancedAIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any>([
    {
      id: 1,
      text: "✨ Welcome! I'm Ayyoob's AI-powered assistant. I'm here to showcase his incredible journey in tech. What would you like to discover about his work?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'welcome'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentEffect, setCurrentEffect] = useState('idle');
  const messagesEndRef = useRef<any>(null);
  const [particles, setParticles] = useState<any>([]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Create floating particles effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (isOpen) {
        setParticles((prev: string | any[]) => [
          ...prev.slice(-20),
          {
            id: Date.now(),
            x: Math.random() * 320,
            y: 400,
            size: Math.random() * 4 + 2,
            speed: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.3
          }
        ]);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Animate particles
  useEffect(() => {
    if (particles.length > 0) {
      const animationFrame = setInterval(() => {
        setParticles((prev: any[]) => 
          prev.map(particle => ({
            ...particle,
            y: particle.y - particle.speed,
            opacity: particle.opacity - 0.01
          })).filter(particle => particle.y > -20 && particle.opacity > 0)
        );
      }, 16);

      return () => clearInterval(animationFrame);
    }
  }, [particles]);

  // Advanced AI Responses with rich content
  const aiResponses = {
    skills: [
      {
        text: "🚀 Ayyoob is a full-stack wizard! His arsenal includes Flutter for stunning cross-platform apps, Go for lightning-fast backends, and Next.js for incredible web experiences. He's also skilled in TypeScript, React, and modern cloud technologies!",
        type: 'skill',
        suggestions: ['Show me his projects', 'What about his experience?', 'How can I hire him?']
      },
      {
        text: "💻 His technical expertise spans mobile development with Flutter & Dart, backend engineering with Go & Node.js, and frontend mastery with React & Next.js. Plus, he's experienced with databases, APIs, and cloud deployment!",
        type: 'skill',
        suggestions: ['Tell me about his projects', 'What makes him unique?', 'Contact information?']
      }
    ],
    projects: [
      {
        text: "🎯 Ayyoob has crafted amazing projects! From e-commerce mobile apps serving thousands of users to real-time web platforms with beautiful UIs. Each project showcases his attention to performance, user experience, and scalable architecture.",
        type: 'project',
        suggestions: ['What technologies does he use?', 'Can I see his work?', 'Is he available for hire?']
      },
      {
        text: "⭐ His portfolio includes cross-platform mobile applications, progressive web apps, and robust backend systems. He loves building solutions that solve real problems and create delightful user experiences!",
        type: 'project',
        suggestions: ['Tell me about his skills', 'How to contact him?', 'What\'s his background?']
      }
    ],
    experience: [
      {
        text: "🌟 Ayyoob brings extensive experience in full-stack development with a mobile-first approach. He's worked with startups and established companies, building applications that handle high traffic and deliver exceptional performance.",
        type: 'experience',
        suggestions: ['What are his main skills?', 'Show me his projects', 'How to get in touch?']
      }
    ],
    contact: [
      {
        text: "📞 Ready to collaborate? You can reach Ayyoob through the contact section below! He's always excited about new opportunities and innovative projects. Check his LinkedIn or GitHub for the latest updates!",
        type: 'contact',
        suggestions: ['What are his skills?', 'Show me his projects', 'Tell me more about him']
      }
    ],
    personality: [
      {
        text: "🎨 Ayyoob is a creative problem-solver who believes technology should be beautiful AND functional. He's passionate about clean code, innovative solutions, and creating experiences that users love. When not coding, he explores new tech trends!",
        type: 'personality',
        suggestions: ['What projects has he built?', 'What are his technical skills?', 'How can I contact him?']
      }
    ],
    default: [
      {
        text: "🤔 That's an interesting question! While I'm pretty smart, Ayyoob would be the best person to give you detailed insights about that. Feel free to reach out to him directly through the contact section!",
        type: 'default',
        suggestions: ['Ask about his skills', 'See his projects', 'Contact information']
      }
    ]
  };

  const getAIResponse = (message:any) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('skill') || lowerMessage.includes('tech') || lowerMessage.includes('flutter') || lowerMessage.includes('go') || lowerMessage.includes('next')) {
      return aiResponses.skills[Math.floor(Math.random() * aiResponses.skills.length)];
    }
    if (lowerMessage.includes('project') || lowerMessage.includes('work') || lowerMessage.includes('portfolio') || lowerMessage.includes('app')) {
      return aiResponses.projects[Math.floor(Math.random() * aiResponses.projects.length)];
    }
    if (lowerMessage.includes('experience') || lowerMessage.includes('background') || lowerMessage.includes('career')) {
      return aiResponses.experience[0];
    }
    if (lowerMessage.includes('contact') || lowerMessage.includes('reach') || lowerMessage.includes('hire') || lowerMessage.includes('available')) {
      return aiResponses.contact[0];
    }
    if (lowerMessage.includes('who') || lowerMessage.includes('about') || lowerMessage.includes('personality')) {
      return aiResponses.personality[0];
    }
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return {
        text: "👋 Hello there! Welcome to Ayyoob's digital space! I'm his AI assistant, powered by the latest tech. What would you like to discover about his incredible journey in software development?",
        type: 'greeting',
        suggestions: ['Tell me about his skills', 'Show me his projects', 'How can I contact him?']
      };
    }
    
    return aiResponses.default[0];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages((prev: any) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setCurrentEffect('thinking');

    // Simulate AI processing with realistic delay
    setTimeout(() => {
      const response = getAIResponse(inputValue);
      const botResponse = {
        id: messages.length + 2,
        text: response.text,
        sender: 'bot',
        timestamp: new Date(),
        type: response.type,
        suggestions: response.suggestions
      };
      
      setMessages((prev: any) => [...prev, botResponse]);
      setIsTyping(false);
      setCurrentEffect('idle');
    }, 1500 + Math.random() * 1000);
  };

  const handleSuggestionClick = (suggestion: React.SetStateAction<string>) => {
    setInputValue(suggestion);
    setTimeout(handleSendMessage, 100);
  };

  const handleKeyPress = (e: { key: string; shiftKey: any; preventDefault: () => void; }) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickStarters = [
    { text: "🚀 What are his superpowers?", icon: <Rocket className="w-4 h-4" /> },
    { text: "💼 Show me his projects", icon: <Code2 className="w-4 h-4" /> },
    { text: "⚡ His experience level?", icon: <Zap className="w-4 h-4" /> },
    { text: "📱 How to reach him?", icon: <AtSign className="w-4 h-4" /> }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Action Button */}
      {!isOpen && (
        <div className="relative">
          <button
            onClick={() => setIsOpen(true)}
            className="group relative bg-black text-white p-4 rounded-2xl shadow-2xl transform transition-all duration-500 hover:scale-110 hover:rotate-3 border border-gray-700 hover:border-gray-500"
            style={{
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px rgba(255, 255, 255, 0.1)'
            }}
          >
            <div className="relative">
              <Brain className="w-7 h-7 transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-pulse"></div>
            </div>
            
            {/* Floating notification */}
            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-xl text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none border border-gray-700">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-white" />
                Ask me about Ayyoob!
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
            </div>
          </button>

          {/* 3D effect rings */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 rounded-2xl bg-white/10 animate-ping opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </div>
        </div>
      )}

      {/* 3D Chat Interface */}
      {isOpen && (
<div className="relative bg-black border border-gray-700 rounded-3xl shadow-2xl w-full sm:w-[28rem] h-[90vh] sm:h-[32rem] flex flex-col overflow-hidden transform transition-all duration-300"
          style={{
            boxShadow: '0 20px 50px -15px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((particle: { id: React.Key | null | undefined; x: any; y: any; size: any; opacity: any; }) => (
              <div
                key={particle.id}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: particle.x,
                  top: particle.y,
                  width: particle.size,
                  height: particle.size,
                  opacity: particle.opacity
                }}
              />
            ))}
          </div>

          {/* 3D Header */}
          <div className="relative bg-black p-5 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center border border-gray-700">
                    <Brain className={`w-6 h-6 text-white transition-all duration-300 ${currentEffect === 'thinking' ? 'animate-pulse scale-110' : ''}`} />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full border-2 border-black flex items-center justify-center">
                    <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Ayyoob AI</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <p className="text-sm text-gray-300">Powered by ayyoob AI</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-all duration-300 hover:rotate-90 hover:scale-110 p-2 rounded-xl hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 3D effect at bottom of header */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-60">
              <div className="h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
            </div>
          </div>

          {/* Quick Starters */}
          {messages.length === 1 && (
            <div className="p-4 border-b border-gray-700">
              <p className="text-sm text-gray-400 mb-3 flex items-center gap-2">
                <Wand2 className="w-4 h-4" />
                Quick starters:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {quickStarters.map((starter, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(starter.text)}
                    className="flex items-center gap-2 text-sm bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white px-3 py-2 rounded-xl transition-all duration-300 hover:scale-105 border border-gray-700 hover:border-gray-600"
                  >
                    {starter.icon}
                    <span className="truncate">{starter.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages Container - Scrollbar removed but scrolling still works */}
          <div 
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              overflow: '-moz-scrollbars-none',
            }}
          >
            <style jsx>{`
              .scrollbar-none::-webkit-scrollbar {
                display: none;
                width: 0;
                height: 0;
                background: transparent;
              }
            `}</style>
            
            {messages.map((message: { id: React.Key | null | undefined; sender: string; text: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; timestamp: { toLocaleTimeString: (arg0: never[], arg1: { hour: string; minute: string; }) => string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }; suggestions: any[]; }) => (
              <div key={message.id}>
                <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-end gap-3 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                      message.sender === 'user' 
                        ? 'bg-gray-700' 
                        : 'bg-gray-800 border border-gray-700'
                    }`}>
                      {message.sender === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Brain className="w-4 h-4 text-white" />
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div className={`relative p-4 rounded-2xl max-w-full ${
                      message.sender === 'user' 
                        ? 'bg-gray-800 text-white rounded-br-md shadow-lg border border-gray-700' 
                        : 'bg-gray-900 text-white rounded-bl-md border border-gray-700'
                    }`}
                    style={{
                      boxShadow: message.sender === 'user' 
                        ? '0 5px 15px rgba(0, 0, 0, 0.3)'
                        : '0 5px 15px rgba(0, 0, 0, 0.5)'
                    }}>
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      
                      {/* Message timestamp */}
                      <div className={`text-xs mt-2 ${
                        message.sender === 'user' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Suggestions */}
                {message.suggestions && (
                  <div className="mt-3 ml-11 flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-3 py-1 rounded-full transition-all duration-300 border border-gray-700 hover:border-gray-600 hover:scale-105"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-end gap-3">
                  <div className="w-8 h-8 rounded-2xl bg-gray-900 border border-gray-700 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-white animate-pulse" />
                  </div>
                  <div className="bg-gray-900 p-4 rounded-2xl rounded-bl-md border border-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span className="text-xs text-gray-400 ml-2">AI thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 3D Input */}
          <div className="p-4 bg-black border-t border-gray-700">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about Ayyoob..."
                className="flex-1 bg-gray-900 border border-gray-700 rounded-2xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition-all duration-300"
                style={{
                  boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.5)'
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className={`p-3 rounded-2xl transition-all duration-300 hover:scale-110 disabled:scale-100 disabled:opacity-50 ${
                  inputValue.trim() && !isTyping
                    ? 'bg-gray-800 hover:bg-gray-700 text-white shadow-lg border border-gray-600'
                    : 'bg-gray-900 text-gray-500 border border-gray-700'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedAIAssistant;