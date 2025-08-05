import React, { useRef, useEffect } from 'react';

// Mock GSAP for this demo - in real usage, import from 'gsap'
const gsap = {
  quickSetter: (target: any, property: string, unit: string) => {
    return (value: number) => {
      if (target && target.style) {
        target.style.setProperty(property, `${value}${unit}`);
      }
    };
  },
  to: (target: any, vars: any) => {
    // Simple animation mock for demo purposes
    const duration = (vars.duration || 0.5) * 1000;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Simple easing
      const eased = 1 - Math.pow(1 - progress, 3);
      
      if (vars.onUpdate) {
        vars.onUpdate();
      }
      
      if (target && target.style && vars.opacity !== undefined) {
        target.style.opacity = vars.opacity;
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }
};

interface ChromaItem {
  image: string;
  title: string;
  subtitle: string;
  handle?: string;
  borderColor?: string;
  gradient?: string;
  url?: string;
  location?: string;
}

interface ChromaGridProps {
  items?: ChromaItem[];
  className?: string;
  radius?: number;
  columns?: number;
  rows?: number;
  damping?: number;
  fadeOut?: number;
  ease?: string;
}

const ChromaGrid = ({
  items,
  className = "",
  radius = 300,
  columns = 3,
  rows = 2,
  damping = 0.45,
  fadeOut = 0.6,
  ease = "power3.out",
}: ChromaGridProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const setX = useRef<(value: number) => void | null>(null);
  const setY = useRef<(value: number) => void | null>(null);
  const pos = useRef({ x: 0, y: 0 });

  const demo: ChromaItem[] = [
    {
      image: "https://i.pravatar.cc/300?img=1",
      title: "Sarah Johnson",
      subtitle: "Frontend Developer",
      handle: "@sarahjohnson",
      borderColor: "#3B82F6",
      gradient: "linear-gradient(145deg, #3B82F6, #000)",
      url: "https://github.com/sarahjohnson"
    },
    {
      image: "https://i.pravatar.cc/300?img=2",
      title: "Mike Chen",
      subtitle: "Backend Engineer",
      handle: "@mikechen",
      borderColor: "#10B981",
      gradient: "linear-gradient(180deg, #10B981, #000)",
      url: "https://linkedin.com/in/mikechen"
    },
    {
      image: "https://i.pravatar.cc/300?img=3",
      title: "Emma Wilson",
      subtitle: "UI/UX Designer",
      handle: "@emmawilson",
      borderColor: "#8B5CF6",
      gradient: "linear-gradient(225deg, #8B5CF6, #000)",
      url: "https://dribbble.com/emmawilson"
    },
    {
      image: "https://i.pravatar.cc/300?img=4",
      title: "David Kim",
      subtitle: "DevOps Specialist",
      handle: "@davidkim",
      borderColor: "#EF4444",
      gradient: "linear-gradient(195deg, #EF4444, #000)",
      url: "https://github.com/davidkim"
    },
    {
      image: "https://i.pravatar.cc/300?img=5",
      title: "Lisa Wong",
      subtitle: "Product Manager",
      handle: "@lisawong",
      borderColor: "#F59E0B",
      gradient: "linear-gradient(165deg, #F59E0B, #000)",
      url: "https://linkedin.com/in/lisawong"
    },
    {
      image: "https://i.pravatar.cc/300?img=6",
      title: "James Rodriguez",
      subtitle: "Mobile Developer",
      handle: "@jamesrod",
      borderColor: "#06B6D4",
      gradient: "linear-gradient(135deg, #06B6D4, #000)",
      url: "https://github.com/jamesrod"
    }
  ];

  const data = items?.length ? items : demo;

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    setX.current = gsap.quickSetter(el, "--x", "px") as (value: number) => void;
    setY.current = gsap.quickSetter(el, "--y", "px") as (value: number) => void;
    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };
    if (setX.current) setX.current(pos.current.x);
    if (setY.current) setY.current(pos.current.y);
  }, []);

  const moveTo = (x: number, y: number) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        if (setX.current) setX.current(pos.current.x);
        if (setY.current) setY.current(pos.current.y);
      },
      overwrite: true,
    });
  };

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = rootRef.current?.getBoundingClientRect();
    if (!r) return;
    moveTo(e.clientX - r.left, e.clientY - r.top);
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
  };

  const handleLeave = () => {
    gsap.to(fadeRef.current, {
      opacity: 1,
      duration: fadeOut,
      overwrite: true,
    });
  };

  const handleCardClick = (url?: string) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };
const handleCardMove = (e: React.MouseEvent<HTMLElement>) => {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  card.style.setProperty("--mouse-x", `${x}px`);
  card.style.setProperty("--mouse-y", `${y}px`);
};  // This closing brace was missing
    
  

  return (
    <div className="team-page">
      <header className="team-header">
        <h1>Our Team</h1>
        <p>Meet the talented individuals who make it all happen</p>
      </header>
      
      <div className="chroma-container">
        <div
          ref={rootRef}
          className={`chroma-grid ${className}`}
          style={{
            '--r': `${radius}px`,
            '--cols': columns,
            '--rows': rows,
          } as React.CSSProperties}
          onPointerMove={handleMove}
          onPointerLeave={handleLeave}
        >
          {data.map((c, i) => (
            <article
              key={i}
              className="chroma-card"
              onMouseMove={handleCardMove}
              onClick={() => handleCardClick(c.url)}
              style={{
                '--card-border': c.borderColor || "transparent",
                '--card-gradient': c.gradient,
                cursor: c.url ? "pointer" : "default",
              } as React.CSSProperties}
            >
              <div className="chroma-img-wrapper">
                <img src={c.image} alt={c.title} loading="lazy" />
              </div>
              <footer className="chroma-info">
                <h3 className="name">{c.title}</h3>
                {c.handle && <span className="handle">{c.handle}</span>}
                <p className="role">{c.subtitle}</p>
                {c.location && <span className="location">{c.location}</span>}
              </footer>
            </article>
          ))}
          <div className="chroma-overlay" />
          <div ref={fadeRef} className="chroma-fade" />
        </div>
      </div>

      <footer className="team-footer">
        <p>© {new Date().getFullYear()} Our Awesome Company. All rights reserved.</p>
      </footer>

      <style jsx>{`
        .team-page {
          min-height: 100vh;
          background-color: #000000;
          padding: 2rem;
          color: white;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .team-header {
          text-align: center;
          margin-bottom: 4rem;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .team-header h1 {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 800;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #fff 0%, #ccc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .team-header p {
          font-size: 1.25rem;
          color: #a0a0a0;
          line-height: 1.6;
        }

        .chroma-container {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
        }

        .chroma-grid {
          display: grid;
          grid-template-columns: repeat(var(--cols), 1fr);
          gap: 2rem;
          position: relative;
          padding: 2rem;
          border-radius: 24px;
          background: radial-gradient(
            circle at var(--x, 50%) var(--y, 50%),
            rgba(255, 255, 255, 0.05) 0%,
            rgba(255, 255, 255, 0.02) 40%,
            transparent 70%
          );
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .chroma-card {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          height: 400px;
          background: linear-gradient(145deg, #1a1a1a, #0d0d0d);
          border: 1px solid #333;
          transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
          transform-origin: center;
        }

        .chroma-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(
            600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
            rgba(255, 255, 255, 0.06),
            transparent 40%
          );
          opacity: 0;
          transition: opacity 0.3s;
          z-index: 1;
          border-radius: 20px;
        }

        .chroma-card:hover::before {
          opacity: 1;
        }

        .chroma-card:hover {
          transform: translateY(-8px);
          border-color: var(--card-border);
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.4),
            0 0 0 1px var(--card-border);
        }

        .chroma-img-wrapper {
          position: relative;
          height: 60%;
          overflow: hidden;
          border-radius: 20px 20px 0 0;
        }

        .chroma-img-wrapper::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--card-gradient);
          opacity: 0;
          transition: opacity 0.6s ease;
          z-index: 2;
          mix-blend-mode: overlay;
        }

        .chroma-card:hover .chroma-img-wrapper::before {
          opacity: 0.3;
        }

        .chroma-img-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(100%) contrast(1.1) brightness(0.8);
          transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
          transform: scale(1.05);
        }

        .chroma-card:hover .chroma-img-wrapper img {
          filter: grayscale(0%) contrast(1) brightness(1);
          transform: scale(1);
        }

        .chroma-info {
          position: relative;
          height: 40%;
          padding: 1.5rem;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.9) 0%,
            rgba(10, 10, 10, 0.8) 100%
          );
          z-index: 3;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .name {
          font-size: 1.5rem;
          font-weight: 700;
          color: #e0e0e0;
          margin: 0 0 0.5rem 0;
          transition: color 0.4s ease;
        }

        .chroma-card:hover .name {
          color: #ffffff;
        }

        .handle {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 0.75rem;
          transition: color 0.4s ease;
        }

        .chroma-card:hover .handle {
          color: var(--card-border);
        }

        .role {
          font-size: 1rem;
          color: #999;
          margin: 0;
          font-weight: 400;
          transition: color 0.4s ease;
        }

        .chroma-card:hover .role {
          color: #cccccc;
        }

        .location {
          font-size: 0.85rem;
          color: #666;
          margin-top: 0.5rem;
          transition: color 0.4s ease;
        }

        .chroma-card:hover .location {
          color: #999;
        }

        .chroma-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(
            var(--r) circle at var(--x, 50%) var(--y, 50%),
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.05) 20%,
            transparent 50%
          );
          pointer-events: none;
          border-radius: 24px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .chroma-grid:hover .chroma-overlay {
          opacity: 1;
        }

        .chroma-fade {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            rgba(0, 0, 0, 0.2) 0%,
            transparent 50%,
            rgba(0, 0, 0, 0.1) 100%
          );
          pointer-events: none;
          border-radius: 24px;
          opacity: 1;
          transition: opacity 0.6s ease;
        }

        .team-footer {
          text-align: center;
          margin-top: 4rem;
          padding: 2rem 0;
          color: #666;
          border-top: 1px solid #333;
          max-width: 1200px;
          margin-left: auto;
          margin-right: auto;
        }

        @media (max-width: 768px) {
          .chroma-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
            padding: 1rem;
          }
          
          .chroma-card {
            height: 350px;
          }
          
          .team-page {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ChromaGrid;