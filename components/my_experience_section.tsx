import { useEffect, useState, useRef, useCallback } from "react";

export default function ExperienceSection() {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [textAnimationStep, setTextAnimationStep] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredTech, setHoveredTech] = useState(null);
  const sectionRef: any = useRef(null);
  const rafRef: any = useRef(null);

  const experiences = [
    {
      id: 1,

      company: "TOWNER SOLUTION PVT LTD",
      position: "Flutter Developer",
      duration: "July 2025 - Present",
      description:
        "Developed Towner, a smart ride management app for drivers and transport partners with real-time trip updates, earnings dashboard, and SOS support.",
      technologies: [
        "Flutter",
        "Provider",
        "Dart",
        "Firebase",
        "Socket.IO",
        "REST API",
      ],
      achievements: [
        "Built driver-focused ride UI with live updates",
        "Integrated SOS and real-time earnings view",
        "Ensured performance under heavy usage",
      ],
    },
    {
      id: 2,
      company: "KAFAAYA AGGREGATOR PVT LTD",
      position: "Flutter Developer",
      duration: "April 2024 - July 2025",
      description:
        "Built Ciyaaryahan, a Flutter soccer app with live scores, news, chat, and match streams. Integrated real-time updates with Java Spring Boot and Socket.IO backend.",
      technologies: [
        "Flutter",
        "Dart",
        "Socket.IO",
        "Provider",
        "REST API",
        "Hive",
        "ZegoCloud",
      ],
      achievements: [
        "Delivered real-time score and stream updates",
        "Integrated secure and optimized chat feature",
        "Improved app performance using Hive and XML",
      ],
    },
    {
      id: 3,
      company: "GreenCreon LLP Software Solutions",
      position: "Flutter Developer",
      duration: "April 2024 - August 2024",
      description:
        "Built Markaz Abu Ali, a fast shopping app using Flutter WebView for seamless mobile shopping experience and M-Women for pregnancy support with milestone tracking.",
      technologies: ["Flutter", "Dart", "WebView", "REST API"],
      achievements: [
        "Delivered elegant UI with smooth UX",
        "Launched feature-rich WebView-based app",
        "Designed pregnancy milestone tracking system",
      ],
    },
    {
      id: 4,
      company: "Self Project - FINORA",
      position: "Go Backend Developer",
      duration: "2024 - Present",
      description:
        "Developed backend for a money management system using Go, handling secure financial transactions, data integrity, and user management.",
      technologies: ["Go", "PostgreSQL", "Redis", "REST API"],
      achievements: [
        "Built secure transaction flow in Go",
        "Optimized API performance",
        "Designed scalable architecture",
      ],
    },
    {
      id: 5,
      company: "Freelance & Personal Projects",
      position: "Flutter Developer",
      duration: "2023 - 2024",
      description:
        "Built multiple applications including Oiot (ride booking), Shaafi (telehealth), Almuqtadir Gold (shopping), and BUS3 (ticket booking with seat selection and payments).",
      technologies: [
        "Flutter",
        "Dart",
        "REST API",
        "Firebase",
        "Agora RTC",
        "Sqflite",
        "Hive",
      ],
      achievements: [
        "Integrated OTP login and QR confirmations",
        "Added push notifications and real-time features",
        "Focused on clean, scalable UI architecture",
      ],
    },
  ];

  const skills = [
    { name: "JavaScript", level: 95, category: "Frontend" },
    { name: "React", level: 92, category: "Frontend" },
    { name: "Flutter", level: 88, category: "Mobile" },
    { name: "Node.js", level: 85, category: "Backend" },
    { name: "Python", level: 80, category: "Backend" },
    { name: "AWS", level: 75, category: "Cloud" },
  ];

  // Throttled mouse tracking
  const handleMouseMove = useCallback((e: { clientX: any; clientY: any }) => {
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
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;
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

  // Text animation sequence
  useEffect(() => {
    if (isVisible) {
      const sequence = async () => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        setTextAnimationStep(1); // MY
        await new Promise((resolve) => setTimeout(resolve, 400));
        setTextAnimationStep(2); // EXPERIENCE
        await new Promise((resolve) => setTimeout(resolve, 600));
        setTextAnimationStep(3); // Complete
      };
      sequence();
    }
  }, [isVisible]);

  // Parallax calculations
  const getParallaxStyle = (factor = 1) => ({
    transform: `translateY(${scrollY * factor * 0.05}px)`,
    willChange: "transform",
  });

  const getRotationStyle = (factor = 1) => ({
    transform: `rotate(${scrollY * factor * 0.01}deg)`,
    willChange: "transform",
  });

  return (
    <div
      id="experience"
      ref={sectionRef}
      className="min-h-screen bg-black text-white relative overflow-hidden"
      style={{
        background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.03) 0%, transparent 50%)`,
      }}
    >
      {/* Floating Code Symbols */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {["{", "}", "(", ")", ";", "="].map((symbol, i) => (
          <div
            key={i}
            className="absolute text-white/10 font-mono text-4xl md:text-6xl select-none animate-float"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + Math.sin(i) * 25}%`,
              ...getParallaxStyle(0.3),
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + i * 0.5}s`,
            }}
          >
            {symbol}
          </div>
        ))}
      </div>

      {/* Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div
          className="text-[12vw] md:text-[15vw] font-bold text-white/5 select-none"
          style={{
            ...getParallaxStyle(-0.1),
            filter: "blur(1px)",
          }}
        >
          EXPERIENCE
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 py-16">
        {/* Header Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-none mb-6">
            <div
              className={`inline-block transition-all duration-1000 ${
                textAnimationStep >= 1
                  ? "opacity-100 transform translate-y-0"
                  : "opacity-0 transform translate-y-8"
              }`}
              style={{
                textShadow: "0 0 20px rgba(255,255,255,0.1)",
                ...getParallaxStyle(0.05),
              }}
            >
              MY
            </div>
            <br />
            <div
              className={`inline-block transition-all duration-1000 delay-300 ${
                textAnimationStep >= 2
                  ? "opacity-70 transform translate-y-0"
                  : "opacity-0 transform translate-y-8"
              }`}
              style={{
                color: "rgba(255,255,255,0.7)",
                ...getParallaxStyle(0.02),
              }}
            >
              EXPERIENCE
            </div>
          </h1>

          {/* Progress Bar */}
          <div className="w-32 h-1 bg-white/20 mx-auto mb-8 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-white to-white/50 rounded-full transition-all duration-2000 ease-out"
              style={{
                width: textAnimationStep >= 3 ? "100%" : "0%",
                boxShadow: "0 0 10px rgba(255,255,255,0.5)",
              }}
            />
          </div>

          <p
            className={`text-xl md:text-2xl text-white/70 max-w-3xl mx-auto transition-all duration-1000 delay-700 ${
              textAnimationStep >= 3
                ? "opacity-100 transform translate-y-0"
                : "opacity-0 transform translate-y-4"
            }`}
            style={getParallaxStyle(0.01)}
          >
            Crafting digital experiences through code, one project at a time
          </p>
        </div>

        {/* Experience Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-20">
          {experiences.map((exp: any, index) => (
            <div
              key={exp.id}
              className={`group relative transition-all duration-700 delay-${
                index * 200
              } ${
                textAnimationStep >= 3
                  ? "opacity-100 transform translate-y-0"
                  : "opacity-0 transform translate-y-8"
              }`}
              onMouseEnter={() => setActiveCard(exp.id)}
              onMouseLeave={() => setActiveCard(null)}
              style={getParallaxStyle(0.02)}
            >
              {/* Card Background Effects */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-2xl blur-xl opacity-30 transition-opacity duration-500 group-hover:opacity-60" />
              </div>

              {/* Orbiting Elements */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 animate-spin-slow">
                  <div className="absolute -top-2 left-1/2 w-2 h-2 bg-white/40 rounded-full transform -translate-x-1/2" />
                  <div className="absolute -bottom-2 left-1/2 w-2 h-2 bg-white/40 rounded-full transform -translate-x-1/2" />
                  <div className="absolute top-1/2 -left-2 w-2 h-2 bg-white/40 rounded-full transform -translate-y-1/2" />
                  <div className="absolute top-1/2 -right-2 w-2 h-2 bg-white/40 rounded-full transform -translate-y-1/2" />
                </div>
              </div>

              {/* Main Card */}
              <div
                className="relative bg-black/90 backdrop-blur-lg border border-white/20 rounded-2xl p-6 h-full transition-all duration-500 group-hover:border-white/40 group-hover:scale-105"
                style={{
                  boxShadow: `0 10px 40px rgba(0,0,0,0.5), 0 0 30px rgba(255,255,255,0.1)`,
                  filter:
                    activeCard === exp.id
                      ? "drop-shadow(0 20px 40px rgba(255,255,255,0.1))"
                      : "none",
                }}
              >
                {/* Company Header */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                      <span className="text-white/70 font-mono text-sm">
                        #{exp.id}
                      </span>
                    </div>
                    <span className="text-white/60 text-sm font-mono">
                      {exp.duration}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {exp.company}
                  </h3>
                  <p className="text-white/80 font-medium">{exp.position}</p>
                </div>

                {/* Description */}
                <p className="text-white/70 text-sm mb-4 leading-relaxed">
                  {exp.description}
                </p>

                {/* Technologies */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech: any, techIndex: any) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/80 font-mono transition-all duration-300 hover:bg-white/20 hover:scale-105"
                        onMouseEnter={() => setHoveredTech(tech)}
                        onMouseLeave={() => setHoveredTech(null)}
                        style={{
                          boxShadow:
                            hoveredTech === tech
                              ? "0 0 20px rgba(255,255,255,0.3)"
                              : "none",
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div className="space-y-2">
                  {exp.achievements.map((achievement: any, achIndex: any) => (
                    <div
                      key={achIndex}
                      className="flex items-center gap-2 text-white/60 text-xs"
                    >
                      <div className="w-1 h-1 bg-white/60 rounded-full animate-pulse" />
                      <span>{achievement}</span>
                    </div>
                  ))}
                </div>

                {/* Hover Glow Effect */}
                <div
                  className={`absolute inset-0 rounded-2xl transition-all duration-500 pointer-events-none ${
                    activeCard === exp.id
                      ? "bg-gradient-to-br from-white/5 via-transparent to-white/10"
                      : "bg-transparent"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Skills Section */}
        <div
          className={`transition-all duration-1000 delay-1000 ${
            textAnimationStep >= 3
              ? "opacity-100 transform translate-y-0"
              : "opacity-0 transform translate-y-8"
          }`}
        ></div>

        {/* Stats Section */}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
