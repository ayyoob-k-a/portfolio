import { useEffect, useState, useRef, useCallback } from "react";

export default function CodePhilosophySection() {
  const [scrollY, setScrollY] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [codeText, setCodeText] = useState("");
  const [isTypingCode, setIsTypingCode] = useState(false);
  const [textAnimationStep, setTextAnimationStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef: any = useRef(null);
  const [letterAnimations, setLetterAnimations] = useState<any>({});
  const rafRef: any = useRef(null);

  const flutterCode = `class CodePhilosophy extends StatelessWidget {
  @override
  Widget build(context) {
    return Container(
      child: Text(
        'I BELIEVE IN CODE',
        style: TextStyle(
          fontSize: 24,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}`;

  const philosophyText = "MY PHILOSOPHY";
  const beliefText = "I BELIEVE IN CODE";
  const subText = "NOT HUMANS";

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

  // Optimized scroll handling with throttling
  const handleScroll = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      const newScrollY = window.scrollY;
      setScrollY(newScrollY);

      // Visibility check
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
    handleScroll(); // Initial call
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
        setTextAnimationStep(2); // PHILOSOPHY
        await new Promise((resolve) => setTimeout(resolve, 600));
        setTextAnimationStep(3); // Complete
      };
      sequence();
    }
  }, [isVisible]);

  // Letter-by-letter animation for main text
  useEffect(() => {
    if (textAnimationStep >= 3) {
      const animateLetters = () => {
        const letters = beliefText.split("");
        letters.forEach((_, index) => {
          setTimeout(() => {
            setLetterAnimations((prev: any) => ({
              ...prev,
              [index]: true,
            }));
          }, index * 100);
        });
      };
      animateLetters();
    }
  }, [textAnimationStep]);

  // Optimized typewriter effect
  useEffect(() => {
    let timeouts: NodeJS.Timeout[] = [];

    if (isHovering && !isTypingCode) {
      setIsTypingCode(true);
      setCodeText("");
      const lines = flutterCode.split("\n");
      let delay = 300;

      lines.forEach((line, lineIndex) => {
        const timeout = setTimeout(() => {
          setCodeText((prev) => {
            const existingLines = prev.split("\n");
            const newLines = [...existingLines];
            newLines[lineIndex] = line;
            return newLines.slice(0, lineIndex + 1).join("\n");
          });
        }, delay);

        timeouts.push(timeout);
        delay += 200;
      });

      const finalTimeout = setTimeout(() => {
        setIsTypingCode(false);
      }, delay);

      timeouts.push(finalTimeout);
    } else if (!isHovering) {
      timeouts.forEach((timeout) => clearTimeout(timeout));
      setCodeText("");
      setIsTypingCode(false);
    }

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
    };
  }, [isHovering]);

  // Simplified transform calculations
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
      id="Philosophy"  
      ref={sectionRef}
      className="min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center"
      style={{
        background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.03) 0%, transparent 50%)`,
      }}
    >
      {/* Floating Code Symbols - Reduced quantity for performance */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {["<", ">", "{", "}"].map((symbol, i) => (
          <div
            key={i}
            className="absolute text-white/10 font-mono text-6xl select-none animate-float"
            style={{
              left: `${15 + i * 20}%`,
              top: `${25 + Math.sin(i) * 20}%`,
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
          className="text-[15vw] font-bold text-white/5 select-none"
          style={{
            ...getParallaxStyle(-0.1),
            filter: "blur(1px)",
          }}
        >
          PHILOSOPHY
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left Side - Philosophy Text */}
          <div className="space-y-8">
            <div>
              {/* Animated Title */}
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
                  PHILOSOPHY
                </div>
              </h1>

              {/* Progress Bar */}
              <div className="w-24 h-1 bg-white/20 mb-8 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-white to-white/50 rounded-full transition-all duration-2000 ease-out"
                  style={{
                    width: textAnimationStep >= 3 ? "100%" : "0%",
                    boxShadow: "0 0 10px rgba(255,255,255,0.5)",
                  }}
                />
              </div>
            </div>

            {/* Content */}
            <div
              className={`space-y-6 transition-all duration-1000 delay-700 ${
                textAnimationStep >= 3
                  ? "opacity-100 transform translate-y-0"
                  : "opacity-0 transform translate-y-4"
              }`}
            >
              <p
                className="text-2xl md:text-3xl font-light text-white/90 leading-relaxed"
                style={{
                  ...getParallaxStyle(0.01),
                  textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                }}
              >
                "In a world driven by technology, I believe in the power of
                clean, efficient, and innovative code."
              </p>

              <p
                className="text-lg md:text-xl text-white/70 leading-relaxed"
                style={getParallaxStyle(0.005)}
              >
                Every line of code is a building block towards creating
                something extraordinary. My approach focuses on writing
                maintainable, scalable, and elegant solutions that not only
                solve problems but inspire innovation.
              </p>

              {/* Icon Section */}
              <div className="flex items-center gap-4 pt-4">
                <div
                  className="w-12 h-12 border-2 border-white/30 rounded-full flex items-center justify-center hover:border-white/60 transition-all duration-300"
                  style={{
                    ...getRotationStyle(0.2),
                    boxShadow: "0 0 20px rgba(255,255,255,0.1)",
                  }}
                >
                  <span className="text-white/70 font-mono text-sm animate-pulse">
                    {"</>"}
                  </span>
                </div>
                <p className="text-white/60 font-mono text-sm">
                  Code is poetry in motion
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Interactive Code Section - Moved more to the right */}
          <div className="flex justify-end items-center lg:pl-16">
            <div
              className="relative group cursor-pointer"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              style={getParallaxStyle(0.02)}
            >
              {/* Background Effects */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-2xl blur-2xl opacity-30 animate-pulse-slow" />
              </div>

              {/* Simplified Orbiting Elements */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 animate-spin-slow">
                  <div className="absolute -top-4 left-1/2 w-3 h-3 bg-white/40 rounded-full transform -translate-x-1/2 shadow-lg" />
                  <div className="absolute -bottom-4 left-1/2 w-3 h-3 bg-white/40 rounded-full transform -translate-x-1/2 shadow-lg" />
                </div>
              </div>

              {/* Main Container */}
              <div
                className="relative w-80 h-80 md:w-96 md:h-96 bg-black/95 backdrop-blur-lg border border-white/30 shadow-2xl transform transition-all duration-700 group-hover:scale-105 group-hover:border-white/50 rounded-2xl flex items-center justify-center overflow-hidden"
                style={{
                  filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.8))",
                  boxShadow: `0 0 60px rgba(255,255,255,0.1), inset 0 0 60px rgba(255,255,255,0.05)`,
                }}
              >
                {/* Terminal Header */}
                <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-r from-black via-gray-900 to-black border-b border-white/30 flex items-center px-4 rounded-t-2xl">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-500/70 rounded-full animate-pulse" />
                    <div
                      className="w-3 h-3 bg-yellow-500/70 rounded-full animate-pulse"
                      style={{ animationDelay: "0.5s" }}
                    />
                    <div
                      className="w-3 h-3 bg-green-500/70 rounded-full animate-pulse"
                      style={{ animationDelay: "1s" }}
                    />
                  </div>
                  <div className="ml-4 text-xs text-white/70 font-mono flex-1 text-center">
                    {isHovering ? "> flutter_app.dart" : "> philosophy.js"}
                  </div>
                </div>

                {/* Main Philosophy Text - Moved to the right */}
                <div
                  className={`text-center p-8 pr-4 relative z-10 transition-all duration-700 ${
                    isHovering ? "opacity-0 scale-90" : "opacity-100 scale-100"
                  }`}
                >
                  <div className="text-xl md:text-2xl font-bold text-white leading-tight space-y-4">
                    <div className="text-white/60 text-sm font-mono opacity-80">
                      // My Core Belief
                    </div>
                    <div className="text-3xl md:text-4xl font-black text-white">
                      I BELIEVE IN
                    </div>
                    <div className="text-4xl md:text-5xl font-black text-white relative ml-6">
                      {beliefText.split("").map((letter, index) => (
                        <span
                          key={index}
                          className={`inline-block transition-all duration-500 ${
                            letterAnimations[index]
                              ? "opacity-100 transform translate-y-0 scale-100"
                              : "opacity-60 transform translate-y-2 scale-95"
                          }`}
                          style={{
                            transitionDelay: `${index * 50}ms`,
                            textShadow: "0 0 20px rgba(255,255,255,0.3)",
                          }}
                        >
                          {letter === " " ? "\u00A0" : letter}
                        </span>
                      ))}
                    </div>
                    <div className="text-base md:text-lg text-white/60 font-light">
                      {subText}
                    </div>
                  </div>
                </div>

                {/* Flutter Code Display */}
                <div
                  className={`absolute inset-8 top-14 flex flex-col transition-all duration-500 ${
                    isHovering ? "opacity-100 scale-100" : "opacity-0 scale-95"
                  }`}
                >
                  <div className="text-green-400 font-mono text-xs mb-3 opacity-80">
                    // Flutter Widget Implementation
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <pre className="font-mono text-xs leading-relaxed text-white whitespace-pre">
                      {codeText && (
                        <>
                          <span className="text-purple-400">class</span>{" "}
                          <span className="text-blue-400">CodePhilosophy</span>{" "}
                          <span className="text-purple-400">extends</span>{" "}
                          <span className="text-blue-400">StatelessWidget</span>{" "}
                          {"{"}
                          {"\n"}{" "}
                          <span className="text-purple-400">@override</span>
                          {"\n"} <span className="text-blue-400">Widget</span>{" "}
                          <span className="text-yellow-400">build</span>
                          (context) {"{"}
                          {"\n"} <span className="text-purple-400">return</span>{" "}
                          <span className="text-blue-400">Container</span>(
                          {"\n"} <span className="text-yellow-400">child:</span>{" "}
                          <span className="text-blue-400">Text</span>({"\n"}{" "}
                          <span className="text-green-400">
                            'I BELIEVE IN CODE'
                          </span>
                          ,{"\n"}{" "}
                          <span className="text-yellow-400">style:</span>{" "}
                          <span className="text-blue-400">TextStyle</span>(
                          {"\n"}{" "}
                          <span className="text-yellow-400">fontSize:</span> 24,
                          {"\n"}{" "}
                          <span className="text-yellow-400">fontWeight:</span>{" "}
                          <span className="text-blue-400">FontWeight</span>
                          .bold,
                          {"\n"} ),
                          {"\n"} ),
                          {"\n"} );
                          {"\n"} {"}"}
                          {"\n"}
                          {"}"}
                        </>
                      )}
                      {isTypingCode && (
                        <span className="text-green-400 animate-pulse">|</span>
                      )}
                    </pre>
                  </div>
                </div>

                {/* Live Indicator */}
                {isHovering && (
                  <div className="absolute bottom-4 right-4 flex items-center">
                    <div className="w-2 h-4 bg-green-400 animate-pulse shadow-lg" />
                    <span className="ml-2 text-green-400 text-xs font-mono">
                      Live
                    </span>
                    <div className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-ping" />
                  </div>
                )}

                {/* Glow Effects */}
                <div
                  className={`absolute inset-0 rounded-2xl transition-all duration-1000 ${
                    isHovering
                      ? "bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-green-500/20"
                      : "bg-gradient-to-br from-white/5 via-transparent to-white/5"
                  }`}
                />
              </div>

              {/* Flutter Badge */}
              <div className="absolute -top-6 -right-6 z-10">
                <div
                  className="w-16 h-16 bg-gradient-to-br from-black via-gray-900 to-black border-2 border-white/40 rounded-xl flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110"
                  style={{
                    boxShadow: "0 0 30px rgba(255,255,255,0.2)",
                  }}
                >
                  <svg viewBox="0 0 128 128" className="w-8 h-8">
                    <path
                      d="M12.3 64.2L76.3 0h39.4L32.1 83.6z"
                      fill="#ffffff"
                    />
                    <path
                      d="M76.3 128h39.4L81.6 93.9l34.1-34.8H76.3L42.2 93.5z"
                      fill="#cccccc"
                    />
                    <path
                      d="M81.6 93.9L76.3 128H12.3l64-64h39.4l-34.1 29.9z"
                      fill="#ffffff"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Optimized CSS Animations */}
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

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 30s linear infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
