"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, ChevronDown, Facebook, Twitter, X } from "lucide-react";
import CodePhilosophySection from "@/components/my_philosaphy";
import EnhancedTechPortfolio from "@/components/skill_section";
import ExperienceShowcase from "@/components/my_experience_section";
import ContactMeSection from "@/components/contac_me";
import Link from "next/link";
import { MaskContainer } from "@/components/ui/mask_effect";
import DeveloperJourneySection from "@/components/my_journey";
import { MyProjects } from "@/components/project_page";
import CopyrightFooter from "@/components/copy_right";
import { FloatingDockDemo } from "@/components/ui/floating_doc";

const words = ["CREATIVE", "INNOVATION", "DESIGN", "VISION", "ARTISTRY"];

const menuItems = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
  { label: "Blog", href: "#blog" },
];

export default function Portfolio() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [displayedText, setDisplayedText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const currentWord = words[wordIndex];
    let typingSpeed = isDeleting ? 50 : 120;

    const timeout = setTimeout(() => {
      if (!isDeleting && charIndex < currentWord.length) {
        setDisplayedText(currentWord.substring(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      } else if (isDeleting && charIndex > 0) {
        setDisplayedText(currentWord.substring(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
      } else {
        if (!isDeleting) {
          setTimeout(() => setIsDeleting(true), 1000);
        } else {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, wordIndex]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleMenuItemClick = (href: string) => {
    setIsMenuOpen(false);
    console.log(`Maps to ${href}`);
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      {/* Background video - Fixed to not change */}
      <video
        ref={videoRef}
        src="/16392049-uhd_3840_2160_24fps.mp4"
        className="fixed inset-0 w-full h-full object-cover z-0"
        loop
        muted
        playsInline
        autoPlay
      />
      {/* Black overlay */}
      <div className="fixed inset-0 bg-black/50 z-0" />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 md:p-5">
        <div className="text-xl font-bold text-white">Ayyoob</div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 cursor-pointer hover:text-gray-300 transition-colors">
            <span className="text-sm">EN</span>
            <ChevronDown className="w-3 h-3" />
          </div>
          <button
            onClick={toggleMenu}
            className="w-5 h-5 cursor-pointer hover:text-gray-300 transition-colors"
          >
          
          </button>
        </div>
      </header>

      {/* Side Menu - Fixed styling with solid black background */}
      <div
        className={`fixed top-0 right-0 h-screen w-80 z-50 bg-black/95 backdrop-blur-sm border-l border-white/10 transform transition-all duration-700 ease-out ${
          isMenuOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0"
        }`}
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-white">Menu</h3>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-all duration-300 hover:rotate-90"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        <nav className="p-8">
          {menuItems.map((item, index) => (
            <div
              key={item.label}
              className={`transform transition-all duration-500 ease-out ${
                isMenuOpen
                  ? "translate-x-0 opacity-100"
                  : "translate-x-8 opacity-0"
              }`}
              onClick={() => handleMenuItemClick("#about")}
              style={{
                transitionDelay: isMenuOpen ? `${index * 100 + 200}ms` : "0ms",
              }}
            >
              <Link href={`${item.href}`}>
                <button className="group w-full text-left py-4 px-6 rounded-xl mb-2 relative overflow-hidden hover:bg-white/10 transition-all duration-300">
                  <div className="absolute left-0 top-0 h-full w-1 bg-white/30 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />
                  <span className="relative text-lg font-medium text-white group-hover:text-gray-300 transition-all duration-300 group-hover:translate-x-2">
                    {item.label}
                  </span>
                  <div className="absolute right-6 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 translate-x-2">
                    <div className="w-2 h-2 border-r-2 border-b-2 border-white transform rotate-[-45deg]" />
                  </div>
                </button>
              </Link>
            </div>
          ))}
        </nav>

        {/* Social & Button */}
        <div className="absolute bottom-8 left-8 right-8">
          <div className="flex items-center justify-center gap-6 mb-6">
            {[Facebook, Twitter].map((Icon, index) => (
              <div
                key={index}
                className={`transform transition-all duration-500 ease-out ${
                  isMenuOpen
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
                style={{
                  transitionDelay: isMenuOpen
                    ? `${600 + index * 100}ms`
                    : "0ms",
                }}
              >
                <Icon className="w-6 h-6 cursor-pointer text-white/80 hover:text-white transition duration-300" />
              </div>
            ))}
          </div>

          <div
            className={`transform transition-all duration-700 ease-out ${
              isMenuOpen
                ? "translate-y-0 opacity-100"
                : "translate-y-6 opacity-0"
            }`}
            style={{ transitionDelay: isMenuOpen ? "800ms" : "0ms" }}
          >
            <button className="w-full py-3 px-6 bg-white/20 text-white rounded-xl font-medium hover:shadow-xl hover:bg-white/30 transition-all duration-300">
              Get In Touch
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-500 ${
          isMenuOpen
            ? "backdrop-blur-sm bg-black/20 opacity-100"
            : "backdrop-blur-none bg-black/0 opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Main Content - Updated layout with image */}
      <main className="relative z-10 flex items-center justify-between min-h-screen px-6 md:px-8 pt-16">
        {/* Left Content */}
        <div className="flex-1 max-w-3xl">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold leading-none mb-8 text-white">
            <div className="flex items-center gap-4">
              MAKE IT
              <div className="w-16 md:w-24 h-1 bg-white" />
            </div>
            <div className="text-white min-h-[80px]">
              {displayedText}
              <span className="border-r-2 border-white animate-pulse ml-1" />
            </div>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mb-12 leading-relaxed">
            I'm Ayyoob, a software developer specializing in Flutter for
            cross-platform mobile development, Go for backend services, and
            Next.js for modern web applications. I create efficient, scalable
            solutions that deliver exceptional user experiences across all
            platforms.
          </p>
        </div>

        {/* Right Side - Code Philosophy Text with Advanced Animations */}
      </main>
      {/* Footer */}
      <footer className="relative z-10 flex items-center justify-between p-6 md:p-8 absolute bottom-0 left-0 right-0">
        <button className="border border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300 bg-transparent px-6 py-2 rounded-lg">
          Let's Talk
        </button>

        <div className="flex items-center gap-4">
          <Facebook className="w-6 h-6 cursor-pointer hover:text-white transition-colors" />
          <Twitter className="w-6 h-6 cursor-pointer hover:text-white transition-colors" />
        </div>
      </footer>

      <DeveloperJourneySection />
      <CodePhilosophySection />

      <ExperienceShowcase />
      <EnhancedTechPortfolio />
      <MyProjects />
      <ContactMeSection />
      <CopyrightFooter/>
      <FloatingDockDemo/>

      <style jsx>{`
        @keyframes scan {
          0% {
            transform: translateY(-50%) rotate(0deg);
          }
          100% {
            transform: translateY(-50%) rotate(360deg);
          }
        }

        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
}
