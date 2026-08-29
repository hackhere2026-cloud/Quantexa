"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Atom, TrendingUp, MapPin, Calendar, ExternalLink } from "lucide-react";
import { event } from "@/data/event";
import CodropsParticleButton from "@/components/CodropsParticleButton";

interface HeroSectionProps {
  onRegisterClick: () => void;
}

export default function HeroSection({ onRegisterClick }: HeroSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Ambient Canvas Quantum Stream (Gold / Amber Theme)
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
    window.addEventListener("resize", handleResize);

    const particleCount = 45;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particleCount; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(240, 199, 85, 0.85)";
        ctx.fill();

        for (let j = i + 1; j < particleCount; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(212, 168, 67, ${0.45 * (1 - dist / 130)})`;
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
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="relative w-full h-screen min-h-[800px] flex items-center justify-center overflow-hidden bg-[#050503] bg-white-checked">
      {/* Top Shield Gradient */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#050503] via-[#050503]/80 to-transparent z-10 pointer-events-none" />

      {/* Radial Ambient Core Glow (Warm Gold) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-[#D4A843]/15 rounded-full blur-[170px] pointer-events-none z-0 animate-pulse" />

      {/* Dark Radial Overlay */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#050503]/60 to-[#050503] z-0 pointer-events-none" />

      {/* Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 pointer-events-none opacity-85"
      />

      {/* Main Sci-Fi HUD Container */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 w-full flex flex-col items-center justify-center mt-12">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full glass-panel p-8 sm:p-14 rounded-3xl border border-[#D4A843]/40 bg-[#0A0E1A]/90 backdrop-blur-2xl shadow-[0_0_80px_rgba(212,168,67,0.2)] flex flex-col items-center text-center relative overflow-hidden"
        >
          {/* Decorative Corner Sci-Fi Reticles */}
          <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#D4A843]" />
          <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[#D4A843]" />
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[#D4A843]" />
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#D4A843]" />

          {/* Presenter Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4A843]/10 border border-[#D4A843]/40 text-[#D4A843] text-xs font-mono uppercase tracking-[0.25em] mb-6 shadow-[0_0_15px_rgba(212,168,67,0.15)]">
            <span className="w-2 h-2 rounded-full bg-[#D4A843] animate-ping" />
            <span>HACKHERE PRESENTS • 24 HOUR OFFLINE HACKATHON</span>
          </div>

          {/* Main Metallic Title */}
          <h1 className="text-5xl sm:text-7xl font-display font-black tracking-widest text-white uppercase drop-shadow-[0_0_40px_rgba(212,168,67,0.6)] mb-3">
            <span className="bg-gradient-to-r from-white via-[#F0C755] to-[#D4A843] bg-clip-text text-transparent">
              QUANTEXA
            </span>{" "}
            <span className="text-[#D4A843]">2026</span>
          </h1>

          {/* Tagline */}
          <p className="text-xs sm:text-sm font-mono text-[#F0C755] uppercase tracking-[0.3em] font-bold mb-6">
            THINK QUANTUM • SHAPE THE FUTURE
          </p>

          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-sans max-w-xl mb-8">
            The flagship national decision intelligence & deep-tech hackathon. Build quantum-inspired algorithms, financial risk telemetry systems, and decision intelligence models at SNS iHub, Coimbatore.
          </p>

          {/* Domain Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8 text-xs font-mono">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-black/60 border border-[#D4A843]/30 text-gray-200">
              <Atom className="w-4 h-4 text-[#D4A843]" />
              <span>QUANTUM TECHNOLOGY</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-black/60 border border-[#D4A843]/30 text-gray-200">
              <TrendingUp className="w-4 h-4 text-[#D4A843]" />
              <span>FINANCE TECHNOLOGY</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#D4A843]/10 border border-[#D4A843]/40 text-[#D4A843]">
              <Calendar className="w-4 h-4" />
              <span>SEPTEMBER 19–20, 2026</span>
            </div>
          </div>

          {/* Action CTA Buttons with Codrops Particle Emitter */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <CodropsParticleButton
              href={event.registerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-60 py-4 rounded-full bg-[#D4A843] hover:bg-[#F0C755] text-black font-display text-xs font-black uppercase tracking-widest shadow-[0_0_25px_rgba(212,168,67,0.5)] hover:shadow-[0_0_40px_rgba(240,199,85,0.8)] transition-all duration-300 text-center flex items-center justify-center gap-2"
            >
              <span>REGISTER ON UNSTOP</span>
              <ExternalLink className="w-4 h-4" />
            </CodropsParticleButton>

            <CodropsParticleButton
              onClick={onRegisterClick}
              className="w-full sm:w-52 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/20 hover:border-[#D4A843]/60 text-white font-display text-xs font-bold uppercase tracking-wider transition-all duration-300"
            >
              <span>SCAN QR CODE</span>
            </CodropsParticleButton>
          </div>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center text-gray-400 hover:text-[#D4A843] transition-colors cursor-pointer"
      >
        <span className="text-[10px] font-mono tracking-widest uppercase mb-1">
          EXPLORE QUANTEXA
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-[#D4A843]" />
        </motion.div>
      </motion.a>
    </section>
  );
}
