"use client";

import { useEffect, useRef, useState, MouseEvent, TouchEvent } from "react";
import { motion } from "framer-motion";
import { Atom, ExternalLink, Award, Clock, Zap } from "lucide-react";
import { event } from "@/data/event";
import CodropsParticleButton from "@/components/CodropsParticleButton";

interface HeroSectionProps {
  onRegisterClick: () => void;
}

export default function HeroSection({ onRegisterClick }: HeroSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, spotX: 50, spotY: 50 });

  // Mouse / Touch 3D Card Tilt (Apple Keynote Product Showcase Style)
  const handleCardMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const normX = (x / rect.width) * 2 - 1;
    const normY = (y / rect.height) * 2 - 1;

    setTilt({
      rotateX: -normY * 8,
      rotateY: normX * 8,
      spotX: (x / rect.width) * 100,
      spotY: (y / rect.height) * 100,
    });
  };

  const handleCardTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!cardRef.current || e.touches.length === 0) return;
    const rect = cardRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const normX = (x / rect.width) * 2 - 1;
    const normY = (y / rect.height) * 2 - 1;

    setTilt({
      rotateX: -normY * 6,
      rotateY: normX * 6,
      spotX: (x / rect.width) * 100,
      spotY: (y / rect.height) * 100,
    });
  };

  const handleCardMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, spotX: 50, spotY: 50 });
  };

  // Ambient Canvas Quantum Particle Stream with Mobile Touch Support
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouseRef.current = {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top,
        };
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove as any);
    window.addEventListener("touchmove", handleTouchMove as any, { passive: true });
    window.addEventListener("touchstart", handleTouchMove as any, { passive: true });

    // Adaptive Particle Density for Smooth 60FPS on Mobile
    const isMobile = width < 768;
    const particleCount = isMobile ? 65 : 110;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * (isMobile ? 0.5 : 0.7),
      vy: (Math.random() - 0.5) * (isMobile ? 0.5 : 0.7),
      radius: Math.random() * (isMobile ? 2.2 : 3) + 1,
    }));

    let ringAngle = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. EXPANDED 3D Gyroscope Structure (Responsively Scaled for Mobile & Desktop)
      const centerX = width / 2;
      const centerY = height / 2 - 10;
      ringAngle += 0.007;

      ctx.save();
      ctx.translate(centerX, centerY);

      // Outer Ring
      ctx.beginPath();
      ctx.ellipse(0, 0, Math.min(680, width * 0.44), Math.min(230, height * 0.28), ringAngle, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(212, 168, 67, 0.22)";
      ctx.lineWidth = isMobile ? 1.2 : 1.8;
      ctx.stroke();

      // Middle Ring
      ctx.beginPath();
      ctx.ellipse(0, 0, Math.min(520, width * 0.34), Math.min(170, height * 0.21), -ringAngle * 1.4, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(240, 199, 85, 0.28)";
      ctx.lineWidth = isMobile ? 1 : 1.5;
      ctx.stroke();

      // Inner Core Ring
      ctx.beginPath();
      ctx.ellipse(0, 0, Math.min(360, width * 0.24), Math.min(120, height * 0.15), ringAngle * 2.1, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 215, 0, 0.35)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();

      // 2. Interactive Constellation Node Network with Mobile Touch Repulsion
      const repelRadius = isMobile ? 180 : 260;
      const maxConnectDist = isMobile ? 130 : 180;

      for (let i = 0; i < particleCount; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        // Touch & Mouse Repulsion
        const dx = p1.x - mouseRef.current.x;
        const dy = p1.y - mouseRef.current.y;
        const mouseDist = Math.sqrt(dx * dx + dy * dy);

        if (mouseDist < repelRadius) {
          const force = (repelRadius - mouseDist) / repelRadius;
          p1.x += (dx / mouseDist) * force * (isMobile ? 7 : 10);
          p1.y += (dy / mouseDist) * force * (isMobile ? 7 : 10);
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(240, 199, 85, 0.9)";
        ctx.shadowColor = "#D4A843";
        ctx.shadowBlur = isMobile ? 4 : 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Connect nearby nodes
        for (let j = i + 1; j < particleCount; j++) {
          const p2 = particles[j];
          const distDx = p1.x - p2.x;
          const distDy = p1.y - p2.y;
          const dist = Math.sqrt(distDx * distDx + distDy * distDy);

          if (dist < maxConnectDist) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(212, 168, 67, ${0.35 * (1 - dist / maxConnectDist)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove as any);
      window.removeEventListener("touchmove", handleTouchMove as any);
      window.removeEventListener("touchstart", handleTouchMove as any);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const titleChars = "QUANTEXA".split("");

  return (
    <section className="relative w-full min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16 flex flex-col items-center justify-center overflow-hidden bg-[#050503]">
      {/* Soft Faded Background Grid Pattern */}
      <div className="absolute inset-0 bg-white-checked opacity-35 pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_85%)]" />

      {/* Top & Bottom Vignette Shield Gradients */}
      <div className="absolute top-0 left-0 right-0 h-32 sm:h-40 bg-gradient-to-b from-[#050503] via-[#050503]/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-40 bg-gradient-to-t from-[#050503] via-[#050503]/80 to-transparent z-10 pointer-events-none" />

      {/* Ambient Core Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[1100px] h-[600px] sm:h-[1100px] bg-[#D4A843]/15 rounded-full blur-[140px] sm:blur-[220px] pointer-events-none z-0 animate-pulse" />

      {/* Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 pointer-events-none opacity-95"
      />

      {/* Main Hero Card Seamlessly Blended with Touch & Responsive Scaling */}
      <div className="relative z-20 max-w-5xl mx-auto px-3 sm:px-4 w-full flex flex-col items-center justify-center">
        <motion.div
          ref={cardRef}
          onMouseMove={handleCardMouseMove}
          onTouchMove={handleCardTouchMove}
          onMouseLeave={handleCardMouseLeave}
          animate={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          style={{ perspective: 1200, transformStyle: "preserve-3d" }}
          className="w-full p-6 sm:p-14 rounded-3xl border border-[#D4A843]/20 bg-black/5 hover:bg-black/10 backdrop-blur-sm shadow-[0_0_80px_rgba(212,168,67,0.08)] flex flex-col items-center text-center relative overflow-hidden group transition-shadow duration-500"
        >
          {/* Dynamic Mouse / Touch Spotlight Gradient */}
          <div
            className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
            style={{
              background: `radial-gradient(500px circle at ${tilt.spotX}% ${tilt.spotY}%, rgba(240, 199, 85, 0.15), transparent 70%)`,
            }}
          />

          {/* Corner Reticles */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 w-4 h-4 sm:w-5 sm:h-5 border-t-2 border-l-2 border-[#D4A843]/60 group-hover:border-[#D4A843] transition-all duration-300 z-20" />
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-4 h-4 sm:w-5 sm:h-5 border-t-2 border-r-2 border-[#D4A843]/60 group-hover:border-[#D4A843] transition-all duration-300 z-20" />
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 w-4 h-4 sm:w-5 sm:h-5 border-b-2 border-l-2 border-[#D4A843]/60 group-hover:border-[#D4A843] transition-all duration-300 z-20" />
          <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-4 h-4 sm:w-5 sm:h-5 border-b-2 border-r-2 border-[#D4A843]/60 group-hover:border-[#D4A843] transition-all duration-300 z-20" />

          {/* Presenter Pill */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative z-20 inline-flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-[#D4A843]/10 border border-[#D4A843]/35 text-[#D4A843] text-[10px] sm:text-xs font-mono uppercase tracking-[0.15em] sm:tracking-[0.25em] mb-4 sm:mb-6 shadow-[0_0_20px_rgba(212,168,67,0.15)]"
          >
            <span className="w-2 h-2 rounded-full bg-[#D4A843] animate-ping" />
            <span>HACKHERE PRESENTS • 24 HOUR OFFLINE HACKATHON</span>
          </motion.div>

          {/* Responsive Staggered Title (QUANTEXA Only) */}
          <h1 className="relative z-20 text-4xl xs:text-5xl sm:text-7xl lg:text-8xl font-display font-black tracking-wider sm:tracking-widest text-white uppercase drop-shadow-[0_0_50px_rgba(212,168,67,0.6)] mb-3 flex items-center justify-center flex-wrap gap-x-1">
            {titleChars.map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 30, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.2 + index * 0.05,
                  ease: [0.215, 0.61, 0.355, 1],
                }}
                className="inline-block bg-gradient-to-r from-white via-[#F0C755] to-[#D4A843] bg-clip-text text-transparent"
              >
                {char}
              </motion.span>
            ))}
          </h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="relative z-20 text-[11px] sm:text-sm font-mono text-[#F0C755] uppercase tracking-[0.2em] sm:tracking-[0.35em] font-bold mb-6 sm:mb-8"
          >
            THINK QUANTUM • SHAPE THE FUTURE
          </motion.p>

          {/* Responsive Telemetry Metrics Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="relative z-20 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-8 w-full max-w-2xl text-xs font-mono"
          >
            <div className="flex flex-col items-center p-2.5 sm:p-3 rounded-2xl bg-black/10 border border-[#D4A843]/20 hover:border-[#D4A843] transition-all backdrop-blur-xs">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4A843] mb-1" />
              <span className="text-white font-bold text-xs sm:text-sm">24 HOURS</span>
              <span className="text-[9px] sm:text-[10px] text-gray-400 uppercase">Non-Stop Sprint</span>
            </div>
            <div className="flex flex-col items-center p-2.5 sm:p-3 rounded-2xl bg-black/10 border border-[#D4A843]/20 hover:border-[#D4A843] transition-all backdrop-blur-xs">
              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4A843] mb-1" />
              <span className="text-white font-bold text-xs sm:text-sm">₹30,000</span>
              <span className="text-[9px] sm:text-[10px] text-gray-400 uppercase">Prize Pool</span>
            </div>
            <div className="flex flex-col items-center p-2.5 sm:p-3 rounded-2xl bg-black/10 border border-[#D4A843]/20 hover:border-[#D4A843] transition-all backdrop-blur-xs">
              <Atom className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4A843] mb-1" />
              <span className="text-white font-bold text-xs sm:text-sm">2 TRACKS</span>
              <span className="text-[9px] sm:text-[10px] text-gray-400 uppercase">Quantum & FinTech</span>
            </div>
            <div className="flex flex-col items-center p-2.5 sm:p-3 rounded-2xl bg-black/10 border border-[#D4A843]/20 hover:border-[#D4A843] transition-all backdrop-blur-xs">
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4A843] mb-1" />
              <span className="text-white font-bold text-xs sm:text-sm">SNS IHUB</span>
              <span className="text-[9px] sm:text-[10px] text-gray-400 uppercase">Coimbatore</span>
            </div>
          </motion.div>

          {/* Action CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="relative z-20 flex items-center justify-center w-full"
          >
            <CodropsParticleButton
              href={event.registerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-64 py-3.5 sm:py-4 rounded-full bg-[#D4A843] hover:bg-[#F0C755] text-black font-display text-xs sm:text-sm font-black uppercase tracking-widest shadow-[0_0_30px_rgba(212,168,67,0.6)] hover:shadow-[0_0_50px_rgba(240,199,85,0.9)] transition-all duration-300 text-center flex items-center justify-center gap-2"
            >
              <span>REGISTER NOW</span>
              <ExternalLink className="w-4 h-4" />
            </CodropsParticleButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
