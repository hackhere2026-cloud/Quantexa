"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { event } from "@/data/event";

interface HeroSectionProps {
  onRegisterClick: () => void;
}

export default function HeroSection({ onRegisterClick }: HeroSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Set slow-motion playback rate on background glowing video
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.45;
    }
  }, []);

  // Ambient Canvas Circuit-Line Particle Effect (Neon Cyan / Blue Theme)
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

    // Particle nodes for circuit network
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

      // Draw circuit lines between close particles
      for (let i = 0; i < particleCount; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        // Draw particle node (Neon Cyan)
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 240, 255, 0.9)";
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
            ctx.strokeStyle = `rgba(0, 229, 255, ${0.45 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.9;
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
    <section className="relative w-full h-screen min-h-[750px] flex items-center justify-center overflow-hidden bg-ink bg-white-checked">
      {/* Glowing Video Background Loop */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover opacity-90 z-0 pointer-events-none"
      >
        <source src="/glowing video.mp4" type="video/mp4" />
        <source src="/hero/glowing-video.mp4" type="video/mp4" />
      </video>

      {/* Top Header Shield Gradient */}
      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-ink via-ink/60 to-transparent z-10 pointer-events-none" />

      {/* Radial Ambient Backlight (Neon Blue Glow) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-500/20 rounded-full blur-[160px] pointer-events-none z-0" />

      {/* Dark Radial Vignette */}
      <div className="absolute inset-0 bg-radial from-transparent via-ink/50 to-ink z-0 pointer-events-none" />

      {/* Canvas Circuit Particle Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 pointer-events-none opacity-80"
      />

      {/* Centered Dashboard Interface */}
      <div className="relative z-20 max-w-3xl mx-auto px-4 text-center flex flex-col items-center justify-center mt-12">
        {/* Glassmorphic console container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="glass-panel p-8 sm:p-12 rounded-3xl border border-cyan-500/30 bg-ink/80 backdrop-blur-xl shadow-[0_0_60px_rgba(0,229,255,0.2)] flex flex-col items-center"
        >
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/30 text-cyan-300 text-xs font-mono uppercase tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Registration Open • {event.dateRange}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl font-display font-black tracking-widest text-white uppercase drop-shadow-[0_0_30px_rgba(0,229,255,0.6)] mb-4">
            QUANTEXA <span className="text-cyan-400">2026</span>
          </h1>

          {/* Tagline / presentedBy */}
          <p className="text-sm sm:text-base font-mono text-cyan-300/80 uppercase tracking-widest mb-6">
            presented by {event.presentedBy}
          </p>

          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-sans max-w-lg mb-8">
            The decision intelligence & deep tech hackathon. Build explainable triage pipelines and medical imaging systems at SNS IHUB, Coimbatore.
          </p>

          {/* Real interactive buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <a
              href={event.registerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-52 py-3.5 rounded-full bg-cyan-400 hover:bg-cyan-350 text-black font-display text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:shadow-[0_0_30px_rgba(0,229,255,0.8)] transition-all duration-300 text-center"
            >
              Claim Access Pass
            </a>
            <a
              href="#tracks"
              className="w-full sm:w-52 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 text-white font-display text-xs font-bold uppercase tracking-wider transition-all duration-300 text-center"
            >
              Explore Domains
            </a>
          </div>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center text-gray-300 hover:text-crimson-glow transition-colors cursor-pointer"
      >
        <span className="text-[10px] font-mono tracking-widest uppercase mb-1">
          Scroll Down
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-cyan-400" />
        </motion.div>
      </motion.a>
    </section>
  );
}
