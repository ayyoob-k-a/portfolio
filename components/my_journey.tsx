import { useEffect, useState, useRef, useCallback } from "react";
import { X, Calendar, MapPin, Award, Code, BookOpen, Network } from "lucide-react";

export default function DeveloperJourneySection() {
  const [scrollY, setScrollY] = useState(0);
  const [textAnimationStep, setTextAnimationStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedSkill, setSelectedSkill] = useState<any>(null);
  const [selectedJourney, setSelectedJourney] = useState<any>(null);
  const sectionRef = useRef<any>(null);
  const [letterAnimations, setLetterAnimations] = useState<any>({});
  const [skillAnimations, setSkillAnimations] = useState<any>({});
  const [journeyAnimations, setJourneyAnimations] = useState<any>({});
  const rafRef = useRef<any>(null);

  const mainText = "DEVELOPER JOURNEY";
  
  const skills = [
    { 
      name: "Flutter", 
      years: "2+",
      icon: Code,
      description: "Cross-platform mobile development framework by Google",
      details: [
        "Built 5+ production mobile applications",
        "Expert in Dart programming language",
        "State management with Provider, Bloc, Riverpod",
        "Custom animations and UI components",
        "Firebase integration and real-time databases",
        "Play Store and App Store deployment"
      ],
      projects: ["E-commerce App", "Social Media Platform", "Healthcare App"]
    },
    { 
      name: "Go Lang", 
      years: "1+",
      icon: Code,
      description: "High-performance backend development language",
      details: [
        "Microservices architecture design",
        "RESTful API development with Gin framework",
        "Database integration (PostgreSQL, MongoDB)",
        "Concurrent programming with goroutines",
        "Docker containerization",
        "Cloud deployment (AWS, GCP)"
      ],
      projects: ["Payment Gateway", "Real-time Chat API", "Analytics Service"]
    },
    { 
      name: "Next.js", 
      years: "1+",
      icon: Code,
      description: "React framework for production-grade web applications",
      details: [
        "Server-side rendering (SSR) optimization",
        "Static site generation (SSG)",
        "API routes and middleware",
        "Performance optimization techniques",
        "SEO best practices implementation",
        "Deployment on Vercel and Netlify"
      ],
      projects: ["Corporate Website", "E-learning Platform", "Portfolio Sites"]
    },
    { 
      name: "Networking", 
      years: "Cisco",
      icon: Network,
      description: "Advanced networking protocols and infrastructure",
      details: [
        "CCNA certified network engineer",
        "Router and switch configuration",
        "Network security protocols",
        "VLAN and subnetting expertise",
        "Troubleshooting network issues",
        "Network monitoring and optimization"
      ],
      projects: ["Enterprise Network Setup", "Security Implementation", "Performance Monitoring"]
    },
    { 
      name: "Full Stack", 
      years: "Expert",
      icon: Award,
      description: "Complete web and mobile application development",
      details: [
        "Frontend: React, Next.js, Flutter",
        "Backend: Go, Node.js, Python",
        "Databases: PostgreSQL, MongoDB, Firebase",
        "DevOps: Docker, AWS, CI/CD pipelines",
        "Version control with Git/GitHub",
        "Agile development methodologies"
      ],
      projects: ["Complete SaaS Platform", "Mobile + Web Ecosystem", "Enterprise Solutions"]
    }
  ];

  const journey = [
    {
      title: "Diploma in Computer Science & Engineering",
      subtitle: "Foundation",
      year: "2019-2021",
      icon: BookOpen,
      location: "Kerala, India",
      description: "Built strong fundamentals in programming, algorithms, and system design",
      details: [
        "Core Programming: C, C++, Java, Python",
        "Data Structures and Algorithms mastery",
        "Database management systems (DBMS)",
        "Computer networks and operating systems",
        "Software engineering principles",
        "Project: Student Management System"
      ],
      achievements: [
        "First class with distinction",
        "Best project award for innovative solution",
        "Active participant in coding competitions"
      ]
    },
    {
      title: "Flutter Specialization",
      subtitle: "Brototype Certification",
      year: "2023",
      icon: Code,
      location: "Kerala, India",
      description: "Mastered cross-platform mobile development with Flutter framework",
      details: [
        "Intensive 6-month bootcamp program",
        "Dart programming language expertise",
        "UI/UX design principles for mobile",
        "State management patterns",
        "API integration and data handling",
        "Real-world project development"
      ],
      achievements: [
        "Top 5% of batch performance",
        "Built 3 production-ready applications",
        "Mentor for junior developers"
      ]
    },
    {
      title: "Cisco Certification",
      subtitle: "Network Engineering",
      year: "2025",
      icon: Network,
      location: "Online Certification",
      description: "Advanced networking protocols, security, and infrastructure management",
      details: [
        "CCNA certification preparation and completion",
        "Network design and implementation",
        "Security protocols and firewall configuration",
        "Network troubleshooting and optimization",
        "Cloud networking (AWS, Azure)",
        "IoT and modern network architectures"
      ],
      achievements: [
        "CCNA certification achieved",
        "Enterprise network project completion",
        "Network security specialization"
      ]
    }
  ];

  // Throttled mouse tracking
  const handleMouseMove = useCallback((e: { clientX: any; clientY: any; }) => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      rafRef.current = null;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleMouseMove]);

  // Optimized scroll handling
  const handleScroll = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      const newScrollY = window.scrollY;
      setScrollY(newScrollY);

      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
        setIsVisible(isInView);
      }
      rafRef.current = null;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleScroll]);

  // Text animation sequence - improved timing
  useEffect(() => {
    if (isVisible) {
      const sequence = async () => {
        setTextAnimationStep(1);
        await new Promise((resolve) => setTimeout(resolve, 300));
        setTextAnimationStep(2);
        await new Promise((resolve) => setTimeout(resolve, 400));
        setTextAnimationStep(3);
      };
      sequence();
    }
  }, [isVisible]);

  // Letter-by-letter animation - improved
  useEffect(() => {
    if (textAnimationStep >= 3) {
      const animateLetters = () => {
        const letters = mainText.split("");
        letters.forEach((_, index) => {
          setTimeout(() => {
            setLetterAnimations((prev: any) => ({
              ...prev,
              [index]: true,
            }));
          }, index * 60);
        });
      };
      animateLetters();

      // Skills animation
      setTimeout(() => {
        skills.forEach((_, index) => {
          setTimeout(() => {
            setSkillAnimations((prev: any) => ({
              ...prev,
              [index]: true,
            }));
          }, index * 120);
        });
      }, 600);

      // Journey animation
      setTimeout(() => {
        journey.forEach((_, index) => {
          setTimeout(() => {
            setJourneyAnimations((prev: any) => ({
              ...prev,
              [index]: true,
            }));
          }, index * 200);
        });
      }, 1000);
    }
  }, [textAnimationStep]);

  const getParallaxStyle = (factor = 1) => ({
    transform: `translateY(${scrollY * factor * 0.05}px)`,
    willChange: "transform",
  });

  const closeModal = () => {
    setSelectedSkill(null);
    setSelectedJourney(null);
    document.body.style.overflow = 'unset';
  };

  // Handle skill click
  const handleSkillClick = (skill:any, index:any) => {
    setSelectedSkill({ ...skill, index });
    setSelectedJourney(null);
    document.body.style.overflow = 'hidden';
  };

  // Handle journey click
  const handleJourneyClick = (journeyItem:any, index:any) => {
    setSelectedJourney({ ...journeyItem, index });
    setSelectedSkill(null);
    document.body.style.overflow = 'hidden';
  };

  return (
    <>
      <div
        id="education"
        ref={sectionRef}
        className="min-h-screen bg-black text-white relative overflow-hidden py-12 md:py-16 lg:py-20"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.03) 0%, transparent 50%)`,
        }}
      >
        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {["01", "10", "11", "00", "101", "110"].map((binary, i) => (
            <div
              key={i}
              className="absolute text-white/8 font-mono text-2xl md:text-4xl select-none animate-float"
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + Math.sin(i) * 25}%`,
                ...getParallaxStyle(0.2 + i * 0.1),
                animationDelay: `${i * 0.6}s`,
                animationDuration: `${6 + i * 0.4}s`,
              }}
            >
              {binary}
            </div>
          ))}
        </div>

        {/* Background Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <div
            className="text-[8vw] md:text-[12vw] font-black text-white/5 select-none"
            style={{
              ...getParallaxStyle(-0.1),
              filter: "blur(1px)",
            }}
          >
            JOURNEY
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          
          {/* Header Section */}
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-black leading-tight mb-6">
              <div
                className={`inline-block transition-all duration-700 ease-out ${
                  textAnimationStep >= 1
                    ? "opacity-100 transform translate-y-0"
                    : "opacity-0 transform translate-y-8"
                }`}
                style={{
                  textShadow: "0 0 30px rgba(255,255,255,0.1)",
                  ...getParallaxStyle(0.05),
                }}
              >
                MY
              </div>
              <br />
              <div
                className={`transition-all duration-700 delay-300 ease-out ${
                  textAnimationStep >= 2
                    ? "opacity-100 transform translate-y-0"
                    : "opacity-0 transform translate-y-8"
                }`}
                style={{
                  color: "rgba(255,255,255,0.9)",
                  ...getParallaxStyle(0.02),
                }}
              >
                {mainText.split("").map((letter, index) => (
                  <span
                    key={index}
                    className={`inline-block text-3xl md:text-5xl lg:text-7xl transition-all duration-500 ease-out ${
                      letterAnimations[index]
                        ? "opacity-100 transform translate-y-0 scale-100"
                        : "opacity-40 transform translate-y-4 scale-95"
                    }`}
                    style={{
                      transitionDelay: `${index * 40}ms`,
                      textShadow: "0 0 20px rgba(255,255,255,0.2)",
                    }}
                  >
                    {letter === " " ? "\u00A0" : letter}
                  </span>
                ))}
              </div>
            </h1>

            {/* Progress Bar */}
            <div className="flex justify-center mb-8">
              <div className="w-24 md:w-32 h-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-white to-white/60 rounded-full transition-all duration-1200 ease-out"
                  style={{
                    width: textAnimationStep >= 3 ? "100%" : "0%",
                    boxShadow: "0 0 15px rgba(255,255,255,0.4)",
                  }}
                />
              </div>
            </div>

            {/* Subtitle */}
            <div
              className={`text-lg md:text-xl lg:text-2xl text-white/70 font-light transition-all duration-700 delay-500 ease-out px-4 ${
                textAnimationStep >= 3
                  ? "opacity-100 transform translate-y-0"
                  : "opacity-0 transform translate-y-4"
              }`}
            >
              2+ Years of Innovation • Full Stack Development • Kerala, India
            </div>
          </div>

          {/* Skills Grid */}
          <div
            className={`mb-12 md:mb-16 transition-all duration-700 delay-700 ease-out ${
              textAnimationStep >= 3
                ? "opacity-100 transform translate-y-0"
                : "opacity-0 transform translate-y-8"
            }`}
          >
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-center mb-8 md:mb-10 text-white/90">
              Technical Expertise
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {skills.map((skill, index) => {
                const IconComponent = skill.icon;
                return (
                  <div
                    key={skill.name}
                    className={`group relative transition-all duration-600 ease-out cursor-pointer ${
                      skillAnimations[index]
                        ? "opacity-100 transform translate-y-0 scale-100"
                        : "opacity-0 transform translate-y-8 scale-95"
                    }`}
                    style={{
                      transitionDelay: `${index * 100}ms`,
                      ...getParallaxStyle(0.02 * (index + 1)),
                    }}
                    onClick={() => handleSkillClick(skill, index)}
                  >
                    <div className="relative bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-4 md:p-6 text-center hover:border-white/40 hover:bg-white/10 transition-all duration-300 group-hover:scale-105">
                      <div className="flex justify-center mb-2 md:mb-3">
                        <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-white/80" />
                      </div>
                      <div className="text-lg md:text-2xl lg:text-3xl font-black text-white mb-1 md:mb-2">
                        {skill.name}
                      </div>
                      <div className="text-xs md:text-sm text-white/60 font-mono">
                        {skill.years} {skill.years.includes('+') ? 'Years' : ''}
                      </div>
                      
                      {/* Hover glow effect */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Education & Career Timeline */}
          <div
            className={`transition-all duration-700 delay-900 ease-out ${
              textAnimationStep >= 3
                ? "opacity-100 transform translate-y-0"
                : "opacity-0 transform translate-y-8"
            }`}
          >
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-center mb-8 md:mb-12 text-white/90">
              Educational & Professional Path
            </h2>
            
            <div className="relative">
              {/* Timeline line - Hidden on mobile, visible on md+ */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-white/40 via-white/20 to-transparent" />
              
              <div className="space-y-8 md:space-y-12">
                {journey.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <div
                      key={index}
                      className={`relative transition-all duration-700 ease-out cursor-pointer ${
                        journeyAnimations[index]
                          ? "opacity-100 transform translate-y-0"
                          : "opacity-0 transform translate-y-12"
                      }`}
                      style={{
                        transitionDelay: `${index * 200}ms`,
                        ...getParallaxStyle(0.01 * (index + 1)),
                      }}
                      onClick={() => handleJourneyClick(item, index)}
                    >
                      {/* Mobile Layout */}
                      <div className="block md:hidden">
                        <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-4 md:p-6 hover:border-white/30 hover:bg-white/8 transition-all duration-300 hover:scale-105">
                          <div className="flex items-center gap-3 mb-3">
                            <IconComponent className="w-5 h-5 text-white/70" />
                            <div className="text-xs font-mono text-white/50">
                              {item.year}
                            </div>
                          </div>
                          <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                            {item.title}
                          </h3>
                          <h4 className="text-base text-white/70 mb-3 font-medium">
                            {item.subtitle}
                          </h4>
                          <p className="text-sm text-white/60 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className={`hidden md:flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                        {/* Content */}
                        <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:border-white/30 hover:bg-white/8 transition-all duration-300 hover:scale-105">
                            <div className="flex items-center gap-2 mb-2 justify-center">
                              <IconComponent className="w-5 h-5 text-white/70" />
                              <div className="text-xs font-mono text-white/50">
                                {item.year}
                              </div>
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                              {item.title}
                            </h3>
                            <h4 className="text-lg text-white/70 mb-3 font-medium">
                              {item.subtitle}
                            </h4>
                            <p className="text-white/60 leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        
                        {/* Timeline dot */}
                        <div className="relative w-2/12 flex justify-center">
                          <div className="w-4 h-4 bg-white rounded-full shadow-lg shadow-white/30 animate-pulse" />
                        </div>
                        
                        {/* Empty space */}
                        <div className="w-5/12" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Current Status */}
          <div
            className={`text-center mt-12 md:mt-16 transition-all duration-700 delay-1100 ease-out ${
              textAnimationStep >= 3
                ? "opacity-100 transform translate-y-0"
                : "opacity-0 transform translate-y-4"
            }`}
          >
            <div className="inline-flex items-center gap-3 md:gap-4 bg-white/5 backdrop-blur-sm border border-white/30 rounded-full px-4 md:px-8 py-3 md:py-4 hover:border-white/50 hover:bg-white/10 transition-all duration-300 mx-4">
              <div className="w-2 h-2 md:w-3 md:h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
              <span className="text-sm md:text-lg font-medium text-white text-center">
                Currently Available for New Opportunities
              </span>
              <div className="w-2 h-2 md:w-3 md:h-3 bg-green-400 rounded-full animate-ping" />
            </div>
          </div>
        </div>

        {/* Skill Detail Modal */}
        {selectedSkill && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
              onClick={closeModal}
            />
            
            {/* Modal */}
            <div 
              className={`relative bg-black/90 backdrop-blur-md border border-white/20 rounded-2xl p-6 md:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto transform transition-all duration-500 animate-scale-in`}
            >
              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-300 z-10"
              >
                <X className="w-4 h-4 text-white" />
              </button>

              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4 pr-8">
                  <selectedSkill.icon className="w-10 h-10 md:w-12 md:h-12 text-white flex-shrink-0" />
                  <div className="min-w-0">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">{selectedSkill.name}</h3>
                    <p className="text-white/70 text-sm md:text-base">{selectedSkill.description}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-lg md:text-xl font-semibold text-white mb-3">Skills & Expertise</h4>
                  <div className="grid gap-2">
                    {selectedSkill.details.map((detail:any, index:any) => (
                      <div key={index} className="flex items-start gap-3 text-white/80 text-sm md:text-base">
                        <div className="w-2 h-2 bg-white/60 rounded-full mt-2 flex-shrink-0" />
                        <span className="leading-relaxed">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg md:text-xl font-semibold text-white mb-3">Key Projects</h4>
                  <div className="grid gap-3">
                    {selectedSkill.projects.map((project:any, index:any) => (
                      <div key={index} className="bg-white/5 border border-white/20 rounded-lg p-3 md:p-4 hover:bg-white/10 transition-colors duration-300">
                        <span className="text-white font-medium text-sm md:text-base">{project}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center pt-4">
                  <div className="inline-flex items-center gap-2 text-white/60 text-sm md:text-base">
                    <Calendar className="w-4 h-4" />
                    <span className="font-mono">{selectedSkill.years} {selectedSkill.years.includes('+') ? 'Years of Experience' : 'Certification'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Journey Detail Modal */}
        {selectedJourney && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
              onClick={closeModal}
            />
            
            {/* Modal */}
            <div 
              className={`relative bg-black/90 backdrop-blur-md border border-white/20 rounded-2xl p-6 md:p-8 max-w-3xl w-full max-h-[85vh] overflow-y-auto transform transition-all duration-500 animate-scale-in`}
            >
              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-300 z-10"
              >
                <X className="w-4 h-4 text-white" />
              </button>

              <div className="mb-6 pr-8">
                <div className="flex items-start gap-4 mb-4">
                  <selectedJourney.icon className="w-10 h-10 md:w-12 md:h-12 text-white flex-shrink-0 mt-1" />
                  <div className="min-w-0">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">{selectedJourney.title}</h3>
                    <p className="text-lg md:text-xl text-white/70 font-medium mb-2">{selectedJourney.subtitle}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-white/60 text-sm md:text-base">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span className="font-mono">{selectedJourney.year}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedJourney.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-white/80 text-base md:text-lg leading-relaxed">{selectedJourney.description}</p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-lg md:text-xl font-semibold text-white mb-4">Curriculum & Skills</h4>
                  <div className="grid gap-2">
                    {selectedJourney.details.map((detail:any, index:any) => (
                      <div key={index} className="flex items-start gap-3 text-white/80 text-sm md:text-base">
                        <div className="w-2 h-2 bg-white/60 rounded-full mt-2 flex-shrink-0" />
                        <span className="leading-relaxed">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg md:text-xl font-semibold text-white mb-4">Key Achievements</h4>
                  <div className="grid gap-3">
                    {selectedJourney.achievements.map((achievement:any, index:any) => (
                      <div key={index} className="bg-white/5 border border-white/20 rounded-lg p-3 md:p-4 hover:bg-white/10 transition-colors duration-300">
                        <div className="flex items-start gap-3">
                          <Award className="w-4 h-4 md:w-5 md:h-5 text-white/60 mt-0.5 flex-shrink-0" />
                          <span className="text-white font-medium text-sm md:text-base leading-relaxed">{achievement}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Global Styles for Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-15px) rotate(3deg); }
          66% { transform: translateY(-8px) rotate(-2deg); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scale-in {
          from { 
            opacity: 0; 
            transform: scale(0.9) translateY(20px);
          }
          to { 
            opacity: 1; 
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.4s ease-out;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out;
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 0.5s ease-out;
        }
      `}</style>
    </>
  );
}