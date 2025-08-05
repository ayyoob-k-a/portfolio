'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Code, Smartphone, Server, Palette, ArrowRight, ChevronRight,
  Database, Flame, GitBranch, Box, Blocks, Video, Coffee,
  MessageSquare, Share2, ArrowRightFromLine, Type, Globe,
  Zap, Star, Hexagon, X, Terminal, Cpu, Cloud, Lock,
  Layers, Settings, Wifi, Monitor
} from 'lucide-react';
import React from 'react';

interface Skill {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  description: string;
  level: number;
  category: string;
  projects: string[];
}

const skills: Skill[] = [
  { 
    icon: Smartphone, 
    title: "FLUTTER", 
    subtitle: "Mobile Development", 
    description: "Creating beautiful, high-performance cross-platform mobile applications with native performance.", 
    level: 90, 
    category: "Mobile",
    projects: ["E-commerce App", "Social Media Platform", "Fitness Tracker", "Real-time Chat App"]
  },
  { 
    icon: Code, 
    title: "NEXT.JS", 
    subtitle: "Full-Stack Development", 
    description: "Building modern web applications with React and the Next.js framework for optimal performance.", 
    level: 95, 
    category: "Frontend",
    projects: ["SaaS Dashboard", "E-learning Platform", "Portfolio Sites", "Admin Panels"]
  },
  { 
    icon: Server, 
    title: "GO LANG", 
    subtitle: "Backend Development", 
    description: "Developing robust and high-performance server-side applications and APIs with Go.", 
    level: 85, 
    category: "Backend",
    projects: ["Microservices", "REST APIs", "WebSocket Servers", "CLI Tools"]
  },
  { 
    icon: Database, 
    title: "POSTGRESQL", 
    subtitle: "Database Management", 
    description: "Designing and managing scalable and reliable relational databases with advanced queries.", 
    level: 88, 
    category: "Database",
    projects: ["Data Warehouses", "Analytics Systems", "User Management", "Inventory Systems"]
  },
  { 
    icon: Flame, 
    title: "FIREBASE", 
    subtitle: "Backend-as-a-Service", 
    description: "Leveraging Firebase for scalable backend solutions, authentication, and real-time data sync.", 
    level: 92, 
    category: "Cloud",
    projects: ["Real-time Apps", "Authentication Systems", "Cloud Functions", "Analytics"]
  },
  { 
    icon: Type, 
    title: "DART", 
    subtitle: "Language for Flutter", 
    description: "Writing efficient and expressive code for mobile, web, and desktop applications.", 
    level: 90, 
    category: "Language",
    projects: ["Mobile Apps", "Web Applications", "Desktop Tools", "CLI Utilities"]
  },
  { 
    icon: GitBranch, 
    title: "GIT", 
    subtitle: "Version Control", 
    description: "Proficient in managing codebases and collaborating effectively using advanced Git workflows.", 
    level: 95, 
    category: "Tools",
    projects: ["Team Collaboration", "CI/CD Pipelines", "Code Reviews", "Release Management"]
  },
  { 
    icon: Globe, 
    title: "RESTFUL APIs", 
    subtitle: "API Development", 
    description: "Designing and implementing scalable and efficient RESTful APIs for seamless data exchange.", 
    level: 93, 
    category: "Backend",
    projects: ["Payment APIs", "Social APIs", "Analytics APIs", "Integration Services"]
  },
];

const techSymbols = [
  '<div>', '</div>', '{', '}', '[]', '()', '=>', '&&', '||', '==', '!=', 
  'function', 'const', 'let', 'var', 'class', 'import', 'export', 'async', 
  'await', 'return', 'if', 'else', 'for', 'while', 'switch', 'case', 'try', 
  'catch', 'throw', 'new', 'this', 'super', 'extends', 'implements', 'interface'
];

export default function AdvancedTechPortfolio() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [cardPhase, setCardPhase] = useState<'idle' | 'flipping' | 'expanded'>('idle');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<any>(null);

  useEffect(() => {
    setIsVisible(true);
    
    const startAutoSlide = () => {
      intervalRef.current = setInterval(() => {
        if (cardPhase === 'idle') {
          setCurrentSlide(prev => (prev + 1) % skills.length);
        }
      }, 3000);
    };

    startAutoSlide();

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [cardPhase]);

  const nextSlide = useCallback(() => {
    if (cardPhase === 'idle') {
      setCurrentSlide(prev => (prev + 1) % skills.length);
    }
  }, [cardPhase]);

  const prevSlide = useCallback(() => {
    if (cardPhase === 'idle') {
      setCurrentSlide(prev => (prev - 1 + skills.length) % skills.length);
    }
  }, [cardPhase]);

  const handleCardClick = useCallback((index: number) => {
    if (cardPhase !== 'idle') return;
    
    setSelectedCard(index);
    setCardPhase('flipping');
    
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    setTimeout(() => {
      setCardPhase('expanded');
    }, 600);
  }, [cardPhase]);

  const closeExpandedCard = useCallback(() => {
    setCardPhase('flipping');
    
    setTimeout(() => {
      setCardPhase('idle');
      setSelectedCard(null);
      
      intervalRef.current = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % skills.length);
      }, 3000);
    }, 600);
  }, []);

  const getVisibleCards = () => {
    const cards = [];
    for (let i = -2; i <= 2; i++) {
      const index = (currentSlide + i + skills.length) % skills.length;
      cards.push({
        skill: skills[index],
        position: i,
        index
      });
    }
    return cards;
  };

  return (
    <div 
      id="skills"
      className="min-h-screen bg-black text-white relative overflow-hidden"
    >
      {/* Subtle Background Effects */}
      <div className="absolute inset-0">
        {/* Dynamic subtle glow following mouse */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.03) 0%, transparent 50%)`
          }}
        />
        
        {/* Animated Grid */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            transform: `translate(${Math.sin(scrollY * 0.01) * 10}px, ${Math.cos(scrollY * 0.01) * 5}px)`
          }}
        />
      </div>

      {/* Floating Tech Symbols */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {techSymbols.map((symbol, i) => (
          <div
            key={i}
            className="absolute text-white/5 font-mono font-bold select-none animate-pulse"
            style={{
              left: `${(i * 13) % 100}%`,
              top: `${(i * 17) % 100}%`,
              fontSize: `${12 + (i % 5) * 4}px`,
              transform: `rotate(${scrollY * 0.02 + i * 15}deg) translate(${Math.sin(scrollY * 0.005 + i) * 20}px, ${Math.cos(scrollY * 0.003 + i) * 15}px)`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${3 + (i % 3)}s`
            }}
          >
            {symbol}
          </div>
        ))}
      </div>

      {/* Animated Tech Icons */}
      <div className="absolute inset-0 pointer-events-none">
        {[Terminal, Cpu, Cloud, Lock, Layers, Settings, Wifi, Monitor].map((Icon, i) => (
          <div
            key={i}
            className="absolute opacity-5 animate-bounce"
            style={{
              left: `${15 + (i * 12)}%`,
              top: `${10 + Math.sin(i * 0.5) * 60}%`,
              transform: `rotate(${scrollY * 0.03 + i * 45}deg) scale(${0.8 + Math.sin(scrollY * 0.01 + i) * 0.3})`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${4 + i * 0.3}s`
            }}
          >
            <Icon className="w-8 h-8 text-white" />
          </div>
        ))}
      </div>

      {/* Particle System */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${6 + Math.random() * 6}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <section className="relative z-10 py-20">
        {/* Enhanced Header */}
        <div className={`text-center mb-10 md:mb-20 px-6 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <div className="relative inline-block">
            <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-9xl font-black mb-4 md:mb-8 text-white">
              TECH STACK
            </h2>
            
            {/* Subtle shadow text */}
            <div className="absolute inset-0 text-4xl sm:text-6xl md:text-7xl lg:text-9xl font-black text-white/10 blur-lg">
              TECH STACK
            </div>
            
            {/* Simple underline */}
            <div className="relative w-24 md:w-40 h-1 md:h-2 bg-white mx-auto mb-4 md:mb-8 rounded-full">
              <div className="absolute inset-0 bg-white/50 animate-pulse rounded-full" />
            </div>
          </div>
          
          <p className="text-base md:text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
            Technologies that power innovation and exceptional digital experiences
          </p>
        </div>

        {/* Enhanced Carousel */}
        <div className="relative max-w-7xl mx-auto px-4" ref={containerRef}>
          {/* Expanded Card Modal */}
          {cardPhase === 'expanded' && selectedCard !== null && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl bg-black/95">
              <div className="relative w-full max-w-5xl bg-black/90 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl max-h-[90vh] overflow-y-auto">
                
                <button 
                  onClick={closeExpandedCard}
                  className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-110 z-10"
                >
                  <X className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </button>
                
                <div className="relative flex flex-col lg:flex-row gap-6 md:gap-8">
                  <div className="flex flex-col items-center lg:w-1/3">
                    <div className="relative flex items-center justify-center w-24 h-24 md:w-32 md:h-32 mb-6 md:mb-8">
                      <div className="absolute inset-0 bg-white/10 rounded-2xl" />
                      {React.createElement(skills[selectedCard].icon, {
                        className: "relative w-12 h-12 md:w-16 md:h-16 text-white z-10"
                      })}
                      <div className="absolute inset-0 bg-white/5 rounded-2xl blur-xl" />
                    </div>
                    
                    <h3 className="text-2xl md:text-4xl font-black text-white text-center mb-2 md:mb-3">
                      {skills[selectedCard].title}
                    </h3>
                    <span className="inline-block px-3 py-1 md:px-4 md:py-2 bg-white/10 rounded-full text-xs md:text-sm font-bold text-white mb-6 md:mb-8 shadow-lg border border-white/10">
                      {skills[selectedCard].category}
                    </span>
                    
                    <div className="w-full space-y-2 md:space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-white/70 text-sm md:text-base">Proficiency</span>
                        <span className="text-white font-bold text-base md:text-lg">{skills[selectedCard].level}%</span>
                      </div>
                      <div className="w-full h-2 md:h-3 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-white rounded-full transition-all duration-1500"
                          style={{ width: `${skills[selectedCard].level}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:w-2/3 space-y-4 md:space-y-6">
                    <div>
                      <h4 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">{skills[selectedCard].subtitle}</h4>
                      <p className="text-white/90 text-sm md:text-lg leading-relaxed">{skills[selectedCard].description}</p>
                    </div>
                    
                    <div className="bg-white/5 rounded-2xl p-4 md:p-6 backdrop-blur-sm border border-white/10">
                      <h5 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 flex items-center">
                        <Star className="w-4 h-4 md:w-5 md:h-5 mr-2 text-white" />
                        Featured Projects
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                        {skills[selectedCard].projects.map((project, i) => (
                          <div key={i} className="flex items-center p-2 md:p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300">
                            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-white mr-2 md:mr-3" />
                            <span className="text-white/90 font-medium text-sm md:text-base">{project}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-white/5 rounded-2xl p-4 md:p-6 backdrop-blur-sm border border-white/10">
                      <h5 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 flex items-center">
                        <Zap className="w-4 h-4 md:w-5 md:h-5 mr-2 text-white" />
                        Key Capabilities
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                        {[
                          "High Performance Architecture", 
                          "Scalable Solutions", 
                          "Modern Best Practices", 
                          "Security Implementation",
                          "Cross-Platform Development",
                          "API Integration & Design"
                        ].map((capability, i) => (
                          <div key={i} className="flex items-center p-2 md:p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300">
                            <Hexagon className="w-3 h-3 md:w-4 md:h-4 mr-2 md:mr-3 text-white" />
                            <span className="text-white/90 text-sm md:text-base">{capability}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3D Carousel */}
          <div 
            className={`flex items-center justify-center min-h-[400px] md:min-h-[600px] relative transition-all duration-700 ${
              cardPhase !== 'idle' ? 'opacity-20 scale-95' : 'opacity-100 scale-100'
            }`}
            style={{ perspective: '1500px' }}
          >
            {getVisibleCards().map(({ skill, position, index }) => {
              const Icon = skill.icon;
              const isCenter = position === 0;
              const distance = Math.abs(position);
              
              // Safe window check for responsive behavior
              const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
              const translateX = position * (isMobile ? 160 : 380);
              const translateZ = isCenter ? 100 : -200 * distance;
              const scale = isCenter ? 1.1 : 1 - distance * (isMobile ? 0.3 : 0.2);

              return (
                <div
                  key={index}
                  className={`absolute transition-all duration-700 ease-out cursor-pointer ${
                    distance <= 2 ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    transform: `translateX(${translateX}px) translateZ(${translateZ}px) scale(${scale}) rotateY(${position * 25}deg)`,
                    zIndex: isCenter ? 50 : 30 - distance * 10,
                  }}
                  onClick={() => handleCardClick(index)}
                >
                  <div className={`group relative bg-black/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl border w-[280px] sm:w-[320px] md:w-96 h-[400px] md:h-[500px] transition-all duration-400 ${
                    isCenter 
                      ? 'border-white/40 shadow-white/10' 
                      : 'border-white/20 shadow-black/50'
                  } hover:scale-105 hover:shadow-2xl hover:border-white/60 overflow-hidden`}>
                    
                    {/* Subtle card glow */}
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
                    
                    {/* Enhanced Icon */}
                    <div className="relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24 mb-6 md:mb-8 mx-auto">
                      <div className="absolute inset-0 bg-white/10 rounded-2xl group-hover:scale-110 transition-transform duration-300 group-hover:bg-white/20" />
                      <Icon className="relative w-10 h-10 md:w-12 md:h-12 text-white z-10 group-hover:scale-110 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-white/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
                    </div>

                    {/* Enhanced Content */}
                    <div className="relative space-y-3 md:space-y-4 text-center">
                      <div className="space-y-2 md:space-y-3">
                        <h3 className="text-2xl md:text-3xl font-black text-white group-hover:text-white transition-all duration-300 tracking-wider">
                          {skill.title}
                        </h3>
                        <span className="inline-block px-3 py-1 md:px-4 md:py-2 bg-white/10 rounded-full text-xs md:text-sm font-bold text-white shadow-lg group-hover:shadow-xl group-hover:bg-white/20 transition-all duration-300 border border-white/10">
                          {skill.category}
                        </span>
                      </div>
                      
                      <p className="text-sm md:text-lg text-white/70 group-hover:text-white/90 transition-colors duration-300 font-semibold">
                        {skill.subtitle}
                      </p>
                      
                      <p className="text-white/60 text-xs md:text-sm leading-relaxed group-hover:text-white/80 transition-colors duration-300 px-2">
                        {skill.description}
                      </p>

                      {/* Enhanced Skill Level */}
                      <div className="pt-4 md:pt-6 space-y-2 md:space-y-3">
                        <div className="flex justify-between items-center text-xs md:text-sm">
                          <span className="text-white/70 group-hover:text-white/90 transition-colors duration-300 font-semibold">Proficiency</span>
                          <span className="text-white/90 group-hover:text-white transition-colors duration-300 font-bold text-base md:text-lg">{skill.level}%</span>
                        </div>
                        <div className="w-full h-1 md:h-2 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-white rounded-full transition-all duration-1000 group-hover:shadow-lg"
                            style={{ 
                              width: isCenter ? `${skill.level}%` : '0%',
                              boxShadow: isCenter ? '0 0 10px rgba(255, 255, 255, 0.3)' : 'none'
                            }}
                          />
                        </div>
                      </div>

                      {/* Click Indicator */}
                      <div className="absolute bottom-2 md:bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex items-center space-x-1 md:space-x-2 text-[10px] md:text-xs text-white/60">
                          <div className="w-1 h-1 md:w-2 md:h-2 bg-white/60 rounded-full animate-ping" />
                          <span>Click to explore</span>
                        </div>
                      </div>
                    </div>

                    {/* Corner Decorations */}
                    <div className="absolute top-2 left-2 md:top-4 md:left-4 w-4 h-4 md:w-6 md:h-6 border-l-2 border-t-2 border-white/30 group-hover:border-white/60 transition-colors duration-300" />
                    <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 w-4 h-4 md:w-6 md:h-6 border-r-2 border-b-2 border-white/30 group-hover:border-white/60 transition-colors duration-300" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Enhanced Navigation */}
          {cardPhase === 'idle' && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-2 md:left-8 top-1/2 transform -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 hover:scale-110 group shadow-xl"
              >
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6 rotate-180 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute right-2 md:right-8 top-1/2 transform -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 hover:scale-110 group shadow-xl"
              >
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </>
          )} 
        </div>
      </section>
    </div>
  );
}