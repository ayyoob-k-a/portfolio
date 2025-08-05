"use client";

import { sendEmail } from "@/actions/email_service";
import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "sonner";

export default function ContactMeSection() {
  const [formData, setFormData] = useState<any>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<any>({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [textAnimationStep, setTextAnimationStep] = useState(0);
  const [letterAnimations, setLetterAnimations] = useState<any>({});
  const [isFormHovered, setIsFormHovered] = useState(false);

  const sectionRef = useRef<any>(null);
  const rafRef = useRef<any>(null);

  const mainText = "CONNECT";

  // Throttled mouse tracking
  const handleMouseMove = useCallback((e: { clientX: any; clientY: any }) => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      rafRef.current = null;
    });
  }, []);

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
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleMouseMove, handleScroll]);

  // Text animation sequence
  useEffect(() => {
    if (isVisible) {
      const sequence = async () => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        setTextAnimationStep(1);
        await new Promise((resolve) => setTimeout(resolve, 400));
        setTextAnimationStep(2);
        await new Promise((resolve) => setTimeout(resolve, 600));
        setTextAnimationStep(3);
      };
      sequence();
    }
  }, [isVisible]);

  // Letter-by-letter animation
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
          }, index * 80);
        });
      };
      animateLetters();
    }
  }, [textAnimationStep]);

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev: any) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    let valid = true;
    const newErrors = {
      name: "",
      email: "",
      message: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
      valid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
      valid = false;
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message should be at least 10 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!validate()) return;
    setIsSubmitting(true);
    setFormData({ name: "", email: "", message: "" });

    const res: any = await sendEmail(formData);
    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success("Message sent successfully!");
      setIsSubmitting(false);
      setShowSuccess(true);
      setFormData({
        name: "",
        senderEmail: "",
        message: "",
      });
    }
  };

  // Parallax and animation utilities
  const getParallaxStyle = (factor = 1) => ({
    transform: `translateY(${scrollY * factor * 0.05}px)`,
    willChange: "transform",
  });

  const getRotationStyle = (factor = 1) => ({
    transform: `rotate(${scrollY * factor * 0.01}deg)`,
    willChange: "transform",
  });

  return (
    <>
      <div
        id="contact"
        ref={sectionRef}
        className="min-h-screen bg-black text-white relative overflow-hidden"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.04) 0%, transparent 50%)`,
        }}
      >
        {/* Floating Contact Symbols */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {["@", "✉", "📧", "💬"].map((symbol, i) => (
            <div
              key={i}
              className="absolute text-white/8 text-6xl select-none animate-float"
              style={{
                left: `${10 + i * 25}%`,
                top: `${20 + Math.sin(i) * 30}%`,
                ...getParallaxStyle(0.2 + i * 0.1),
                animationDelay: `${i * 0.7}s`,
                animationDuration: `${5 + i * 0.3}s`,
              }}
            >
              {symbol}
            </div>
          ))}
        </div>

        {/* Background Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <div
            className="text-[12vw] font-black text-white/4 select-none tracking-widest"
            style={{
              ...getParallaxStyle(-0.1),
              filter: "blur(2px)",
              textShadow: "0 0 100px rgba(255,255,255,0.1)",
            }}
          >
            CONTACT
          </div>
        </div>

        {/* Main Content Container */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-6 md:px-8 py-16">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              {/* Left Side - Contact Info */}
              <div className="flex flex-col justify-center space-y-10">
                {/* Animated Title */}
                <div>
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-none mb-8">
                    <div
                      className={`inline-block transition-all duration-1200 ${
                        textAnimationStep >= 1
                          ? "opacity-100 transform translate-y-0"
                          : "opacity-0 transform translate-y-12"
                      }`}
                      style={{
                        textShadow: "0 0 30px rgba(255,255,255,0.15)",
                        ...getParallaxStyle(0.03),
                      }}
                    >
                      LET'S
                    </div>
                    <br />
                    <div
                      className={`inline-block transition-all duration-1200 delay-400 ${
                        textAnimationStep >= 2
                          ? "opacity-100 transform translate-y-0"
                          : "opacity-0 transform translate-y-12"
                      }`}
                      style={{
                        ...getParallaxStyle(0.01),
                      }}
                    >
                      {mainText.split("").map((letter, index) => (
                        <span
                          key={index}
                          className={`inline-block transition-all duration-600 ${
                            letterAnimations[index]
                              ? "opacity-100 transform translate-y-0 scale-100"
                              : "opacity-40 transform translate-y-4 scale-95"
                          }`}
                          style={{
                            transitionDelay: `${index * 60}ms`,
                            textShadow: "0 0 25px rgba(255,255,255,0.2)",
                          }}
                        >
                          {letter === " " ? "\u00A0" : letter}
                        </span>
                      ))}
                    </div>
                  </h1>

                  {/* Progress Indicator */}
                  <div className="w-32 h-1 bg-white/15 mb-10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all duration-2500 ease-out"
                      style={{
                        width: textAnimationStep >= 3 ? "100%" : "0%",
                        boxShadow: "0 0 15px rgba(255,255,255,0.6)",
                      }}
                    />
                  </div>
                </div>

                {/* Content Section */}
                <div
                  className={`space-y-8 transition-all duration-1000 delay-1000 ${
                    textAnimationStep >= 3
                      ? "opacity-100 transform translate-y-0"
                      : "opacity-0 transform translate-y-6"
                  }`}
                >
                  <p
                    className="text-xl md:text-2xl font-light text-white/90 leading-relaxed max-w-lg"
                    style={{
                      ...getParallaxStyle(0.008),
                      textShadow: "0 2px 20px rgba(0,0,0,0.5)",
                    }}
                  >
                    "Ready to collaborate on something extraordinary? Let's turn
                    ideas into reality."
                  </p>

                  <p
                    className="text-lg text-white/70 leading-relaxed max-w-lg"
                    style={getParallaxStyle(0.004)}
                  >
                    Whether you have a project in mind, want to discuss
                    opportunities, or simply want to connect, I'm always excited
                    to hear from creative minds.
                  </p>

                  {/* Contact Information */}
                  <div className="space-y-6 pt-6">
                    <div className="flex items-center gap-6 group cursor-pointer">
                      <div
                        className="w-16 h-16 border-2 border-white/20 rounded-full flex items-center justify-center group-hover:border-white/60 transition-all duration-700 group-hover:scale-110 group-hover:rotate-12"
                        style={{
                          ...getRotationStyle(0.1),
                          boxShadow: "0 0 25px rgba(255,255,255,0.1)",
                        }}
                      >
                        <svg
                          className="w-7 h-7 text-white/70 group-hover:text-white transition-all duration-500 group-hover:scale-110"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div className="group-hover:translate-x-2 transition-transform duration-500">
                        <p className="text-sm text-white/50 font-mono uppercase tracking-wider">
                          Email
                        </p>
                        <p className="text-xl text-white/90 font-light group-hover:text-white transition-colors duration-300">
                        ayyoobfouj@gmail.com
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 group cursor-pointer">
                      <div
                        className="w-16 h-16 border-2 border-white/20 rounded-full flex items-center justify-center group-hover:border-white/60 transition-all duration-700 group-hover:scale-110 group-hover:-rotate-12"
                        style={{
                          ...getRotationStyle(-0.1),
                          boxShadow: "0 0 25px rgba(255,255,255,0.1)",
                        }}
                      >
                        <svg
                          className="w-7 h-7 text-white/70 group-hover:text-white transition-all duration-500 group-hover:scale-110"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <div className="group-hover:translate-x-2 transition-transform duration-500">
                        <p className="text-sm text-white/50 font-mono uppercase tracking-wider">
                          Phone
                        </p>
                        <p className="text-xl text-white/90 font-light group-hover:text-white transition-colors duration-300">
                          +91 7306533275
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Philosophy Badge */}
                  <div className="flex items-center gap-4 pt-8 group cursor-pointer">
                    <div
                      className="w-16 h-16 border-2 border-white/30 rounded-full flex items-center justify-center transition-all duration-700 group-hover:scale-125 group-hover:rotate-180 group-hover:border-white/70"
                      style={{
                        ...getRotationStyle(0.3),
                        boxShadow: "0 0 30px rgba(255,255,255,0.15)",
                      }}
                    >
                      <span className="text-white/80 font-mono text-lg animate-pulse group-hover:text-white transition-colors duration-500">
                        {"</>"}
                      </span>
                    </div>
                    <p className="text-white/60 font-mono text-sm leading-tight group-hover:text-white/80 group-hover:translate-x-2 transition-all duration-500">
                      Let's build something
                      <br />
                      <span className="text-white/40 group-hover:text-white/60 transition-colors duration-500">
                        beautiful together
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Side - Contact Form */}
              <div className="flex justify-center lg:justify-end items-center">
                <div
                  className="relative group w-full max-w-lg"
                  onMouseEnter={() => setIsFormHovered(true)}
                  onMouseLeave={() => setIsFormHovered(false)}
                  style={getParallaxStyle(0.02)}
                >
                  {/* Background Effects - Removed white glow */}
                  <div className="absolute inset-0">
                    <div
                      className={`absolute inset-0 bg-black/10 rounded-3xl blur-3xl transition-all duration-1000 ${
                        isFormHovered
                          ? "scale-110 opacity-30"
                          : "scale-100 opacity-15"
                      } animate-pulse-slow`}
                    />
                  </div>

                  {/* Orbiting Elements - Reduced white intensity */}
                  <div className="absolute inset-0">
                    <div
                      className={`absolute inset-0 transition-all duration-1000 ${
                        isFormHovered
                          ? "animate-spin-fast"
                          : "animate-spin-slow"
                      }`}
                    >
                      <div
                        className={`absolute -top-6 left-1/2 w-4 h-4 bg-white/20 rounded-full transform -translate-x-1/2 shadow-xl transition-all duration-500 ${
                          isFormHovered ? "scale-150 bg-white/30" : ""
                        }`}
                      />
                      <div
                        className={`absolute -bottom-6 left-1/2 w-4 h-4 bg-white/20 rounded-full transform -translate-x-1/2 shadow-xl transition-all duration-500 ${
                          isFormHovered ? "scale-150 bg-white/30" : ""
                        }`}
                      />
                      <div
                        className={`absolute top-1/2 -left-6 w-3 h-3 bg-white/15 rounded-full transform -translate-y-1/2 shadow-xl transition-all duration-500 ${
                          isFormHovered ? "scale-150 bg-white/25" : ""
                        }`}
                      />
                      <div
                        className={`absolute top-1/2 -right-6 w-3 h-3 bg-white/15 rounded-full transform -translate-y-1/2 shadow-xl transition-all duration-500 ${
                          isFormHovered ? "scale-150 bg-white/25" : ""
                        }`}
                      />
                    </div>
                  </div>

                  {/* Form Container - Removed white backgrounds */}
                  <div
                    className={`relative bg-black/95 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-2xl overflow-hidden transition-all duration-700 ${
                      isFormHovered
                        ? "scale-105 border-white/40 bg-black/98"
                        : "scale-100"
                    }`}
                    style={{
                      filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.8))",
                      boxShadow: `0 0 ${isFormHovered ? "80px" : "40px"} rgba(0,0,0,${isFormHovered ? "0.6" : "0.4"}), inset 0 0 40px rgba(255,255,255,${isFormHovered ? "0.05" : "0.02"})`,
                    }}
                  >
                    {/* Form Header */}
                    <div className="absolute top-0 left-0 right-0 h-12 bg-black/90 border-b border-white/20 flex items-center px-6 rounded-t-3xl">
                      <div className="flex gap-3">
                        <div
                          className={`w-3 h-3 bg-white/60 rounded-full transition-all duration-500 ${
                            isFormHovered
                              ? "animate-pulse-fast bg-white/80"
                              : "animate-pulse"
                          }`}
                        />
                        <div
                          className={`w-3 h-3 bg-white/40 rounded-full transition-all duration-500 ${
                            isFormHovered
                              ? "animate-pulse-fast bg-white/60"
                              : "animate-pulse"
                          }`}
                          style={{ animationDelay: "0.5s" }}
                        />
                        <div
                          className={`w-3 h-3 bg-white/30 rounded-full transition-all duration-500 ${
                            isFormHovered
                              ? "animate-pulse-fast bg-white/50"
                              : "animate-pulse"
                          }`}
                          style={{ animationDelay: "1s" }}
                        />
                      </div>
                      <div
                        className={`ml-6 text-xs font-mono flex-1 text-center transition-colors duration-500 ${
                          isFormHovered ? "text-white/90" : "text-white/60"
                        }`}
                      >
                        contact_form.dart
                      </div>
                    </div>

                    {/* Form Content */}
                    <div className="relative z-10 space-y-8 pt-4">
                      <div
                        className={`font-mono mb-6 text-sm transition-colors duration-500 ${
                          isFormHovered ? "text-white/70" : "text-white/40"
                        }`}
                      >
                        // Send me a message
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                          <label
                            htmlFor="name"
                            className={`block text-sm font-mono mb-3 uppercase tracking-wider transition-colors duration-300 ${
                              isFormHovered ? "text-white/90" : "text-white/70"
                            }`}
                          >
                            Your Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full px-6 py-4 bg-black/80 border-2 rounded-xl focus:outline-none transition-all duration-500 font-light text-lg text-white hover:bg-black/60 focus:bg-black/60 ${
                              errors.name
                                ? "border-white/50 focus:border-white/70"
                                : "border-white/20 focus:border-white/60 hover:border-white/40"
                            }`}
                            placeholder="Enter your name"
                            style={{
                              backdropFilter: "blur(10px)",
                              boxShadow: errors.name
                                ? "0 0 20px rgba(255, 255, 255, 0.1)"
                                : "0 0 10px rgba(0,0,0,0.3)",
                            }}
                          />
                          {errors.name && (
                            <p className="mt-2 text-sm text-white/80 font-mono">
                              {errors.name}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="email"
                            className={`block text-sm font-mono mb-3 uppercase tracking-wider transition-colors duration-300 ${
                              isFormHovered ? "text-white/90" : "text-white/70"
                            }`}
                          >
                            Email Address
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-6 py-4 bg-black/80 border-2 rounded-xl focus:outline-none transition-all duration-500 font-light text-lg text-white hover:bg-black/60 focus:bg-black/60 ${
                              errors.email
                                ? "border-white/50 focus:border-white/70"
                                : "border-white/20 focus:border-white/60 hover:border-white/40"
                            }`}
                            placeholder="your@email.com"
                            style={{
                              backdropFilter: "blur(10px)",
                              boxShadow: errors.email
                                ? "0 0 20px rgba(255, 255, 255, 0.1)"
                                : "0 0 10px rgba(0,0,0,0.3)",
                            }}
                          />
                          {errors.email && (
                            <p className="mt-2 text-sm text-white/80 font-mono">
                              {errors.email}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="message"
                            className={`block text-sm font-mono mb-3 uppercase tracking-wider transition-colors duration-300 ${
                              isFormHovered ? "text-white/90" : "text-white/70"
                            }`}
                          >
                            Your Message
                          </label>
                          <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={6}
                            className={`w-full px-6 py-4 bg-black/80 border-2 rounded-xl focus:outline-none transition-all duration-500 font-light text-lg text-white resize-none hover:bg-black/60 focus:bg-black/60 ${
                              errors.message
                                ? "border-white/50 focus:border-white/70"
                                : "border-white/20 focus:border-white/60 hover:border-white/40"
                            }`}
                            placeholder="Tell me about your project..."
                            style={{
                              backdropFilter: "blur(10px)",
                              boxShadow: errors.message
                                ? "0 0 20px rgba(255, 255, 255, 0.1)"
                                : "0 0 10px rgba(0,0,0,0.3)",
                            }}
                          />
                          {errors.message && (
                            <p className="mt-2 text-sm text-white/80 font-mono">
                              {errors.message}
                            </p>
                          )}
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className={`w-full py-5 px-8 rounded-xl font-mono font-medium transition-all duration-500 flex items-center justify-center text-lg tracking-wider uppercase group ${
                            isSubmitting
                              ? "bg-black/60 border-2 border-white/30 text-white/60 cursor-not-allowed"
                              : "bg-black/90 hover:bg-black/70 text-white border-2 border-white/30 hover:border-white/60 hover:scale-105 shadow-2xl"
                          }`}
                          style={{
                            boxShadow: isSubmitting
                              ? "none"
                              : "0 10px 40px rgba(0,0,0,0.5), inset 0 0 20px rgba(255,255,255,0.05)",
                          }}
                        >
                          {isSubmitting ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-3 h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              <span className="animate-pulse">
                                Sending Message...
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="group-hover:scale-110 transition-transform duration-300">
                                Send Message
                              </span>
                              <svg
                                className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                />
                              </svg>
                            </>
                          )}
                        </button>
                      </form>
                    </div>

                    {/* Subtle Glow Effects - Removed white background */}
                    <div
                      className={`absolute inset-0 rounded-3xl transition-all duration-1000 pointer-events-none ${
                        isFormHovered ? "bg-black/20" : "bg-black/10"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm animate-fade-in" />
            <div className="relative bg-black/95 backdrop-blur-xl rounded-3xl p-12 max-w-md w-full shadow-2xl border border-white/20 animate-scale-in">
              <div className="text-center">
                <div className="w-24 h-24 border-2 border-white/30 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse-glow">
                  <svg
                    className="w-12 h-12 text-white/90 animate-check-draw"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-3xl font-black text-white mb-4 tracking-wide animate-text-glow">
                  MESSAGE SENT!
                </h3>
                <p className="text-white/70 mb-8 text-lg leading-relaxed">
                  Thank you for reaching out. I'll get back to you as soon as
                  possible.
                </p>
                <button
                  onClick={() => setShowSuccess(false)}
                  className="px-8 py-3 bg-black/80 hover:bg-black/60 border-2 border-white/20 hover:border-white/40 rounded-xl transition-all duration-500 text-white font-mono uppercase tracking-wider hover:scale-105"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Global Styles for Animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-20px) rotate(5deg);
          }
          66% {
            transform: translateY(-10px) rotate(-3deg);
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

        @keyframes spin-fast {
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

        @keyframes pulse-fast {
          0%,
          100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes pulse-glow {
          0%,
          100% {
            opacity: 0.8;
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
          }
          50% {
            opacity: 1;
            box-shadow: 0 0 40px rgba(255, 255, 255, 0.6);
          }
        }

        @keyframes text-glow {
          0%,
          100% {
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
          }
          50% {
            text-shadow: 0 0 40px rgba(255, 255, 255, 0.6);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes check-draw {
          0% {
            stroke-dasharray: 0 50;
          }
          100% {
            stroke-dasharray: 50 0;
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 40s linear infinite;
        }

        .animate-spin-fast {
          animation: spin-fast 20s linear infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-pulse-fast {
          animation: pulse-fast 2s ease-in-out infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .animate-text-glow {
          animation: text-glow 2s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }

        .animate-check-draw {
          animation: check-draw 1s ease-out;
        }
      `}</style>
    </>
  );
}
