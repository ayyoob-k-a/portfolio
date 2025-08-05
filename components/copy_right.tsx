'use client';

export default function CopyrightFooter() {
  return (
    <footer className="w-full bg-black text-white/50 py-8 px-4 border-t border-white/10 relative z-50">
      <div className="max-w-7xl mx-auto flex justify-center items-center">
        <div className="text-sm font-mono tracking-wider text-center animate-text-glow">
          © {new Date().getFullYear()} <span className="text-white/80 hover:text-white transition duration-300">Ayyoob K A</span>. All rights reserved.
        </div>
      </div>

      <style jsx>{`
        .animate-text-glow {
          animation: text-glow 2.5s ease-in-out infinite;
        }

        @keyframes text-glow {
          0%, 100% {
            text-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
          }
          50% {
            text-shadow: 0 0 18px rgba(255, 255, 255, 0.5);
          }
        }
      `}</style>
    </footer>
  );
}
