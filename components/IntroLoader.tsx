"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IntroLoaderProps {
  onComplete: () => void;
}

export default function IntroLoader({ onComplete }: IntroLoaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [displayText, setDisplayText] = useState("QUANTEXA");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleFinish = () => {
    setIsVisible(false);
    setTimeout(() => {
      onComplete();
    }, 600); // smooth cinematic fade exit
  };

  // Matrix / Cyber Glitch Decoding effect for QUANTEXA
  useEffect(() => {
    const targetText = "QUANTEXA";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%-+&*";
    let iteration = 0;
    
    const glitchInterval = setInterval(() => {
      setDisplayText(() =>
        targetText
          .split("")
          .map((char, index) => {
            if (index < iteration) {
              return targetText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= targetText.length) {
        clearInterval(glitchInterval);
      }
      iteration += 1 / 3;
    }, 40);

    return () => clearInterval(glitchInterval);
  }, []);

  // 5-Second Timer Logic (0% to 100% over 5000ms)
  useEffect(() => {
    const startTime = Date.now();
    const duration = 4800; // ~4.8 seconds + 200ms pause = 5 seconds

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(timer);
        setTimeout(handleFinish, 300);
      }
    }, 30);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        clearInterval(timer);
        setProgress(100);
        handleFinish();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      clearInterval(timer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Canvas particle stream effect
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

    // Particle nodes
    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      size: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw particle network
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 229, 255, ${p.alpha})`;
        ctx.fill();

        // Connect nearby particles with laser threads
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 229, 255, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.15,
            filter: "blur(12px)",
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
          }}
          onClick={handleFinish}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#03070d] overflow-hidden cursor-pointer select-none"
        >
          {/* Background Canvas Particles */}
          <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

          {/* Radial Ambient Core Glow */}
          <div className="absolute w-[600px] h-[600px] bg-gradient-to-r from-[#00E5FF]/20 via-[#0088FF]/10 to-transparent rounded-full blur-[160px] pointer-events-none animate-pulse" />

          {/* Main 5-Second Quantum Hologram Loader */}
          <div className="relative z-10 flex flex-col items-center justify-center max-w-xl w-full px-6 text-center">
            
            {/* Spinning Quantum Ring Assembly */}
            <div className="relative w-36 h-36 mb-8 flex items-center justify-center">
              {/* Outer Counter-Rotating Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-dashed border-[#00E5FF]/40"
              />
              
              {/* Inner Glowing Speed Ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 rounded-full border-2 border-t-[#00E5FF] border-r-transparent border-b-[#00E5FF]/30 border-l-transparent shadow-[0_0_20px_rgba(0,229,255,0.4)]"
              />

              {/* Core Pulse Sphere */}
              <motion.div
                animate={{ scale: [0.95, 1.1, 0.95] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#00E5FF] to-[#0088FF] flex items-center justify-center shadow-[0_0_30px_#00E5FF] font-mono font-black text-black text-sm"
              >
                {progress}%
              </motion.div>
            </div>

            {/* Sub-Header Presenter */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 text-xs font-mono tracking-[0.3em] text-[#00E5FF] uppercase mb-2"
            >
              <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-ping" />
              <span>HACKHERE PRESENTS</span>
            </motion.div>

            {/* Glitching Title */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-5xl sm:text-7xl font-display font-black tracking-widest text-white uppercase drop-shadow-[0_0_35px_rgba(0,229,255,0.8)] mb-6"
            >
              <span className="bg-gradient-to-r from-white via-[#00E5FF] to-[#00E5FF] bg-clip-text text-transparent">
                {displayText}
              </span>
            </motion.h1>

            {/* Telemetry Domain Chips */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8 text-[11px] font-mono">
              <span className="px-3 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF]">
                CYBER SECURITY
              </span>
              <span className="px-3 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF]">
                MED-TECH
              </span>
            </div>

            {/* Precision 5s Laser Energy Bar */}
            <div className="w-full max-w-md h-2 bg-gray-950 rounded-full border border-[#00E5FF]/30 p-[1px] overflow-hidden shadow-[0_0_20px_rgba(0,229,255,0.2)] mb-6">
              <motion.div
                className="h-full bg-gradient-to-r from-[#00E5FF] via-[#00E5FF] to-white shadow-[0_0_15px_#00E5FF] rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Status Footer Readout */}
            <div className="flex items-center justify-between w-full max-w-md text-[11px] font-mono text-gray-400 uppercase tracking-wider">
              <span>SNS IHUB COIMBATORE</span>
              <span className="text-[#00E5FF]">SEPT 12–13, 2026</span>
            </div>

            {/* Skip hint */}
            <div className="mt-8 text-[10px] font-mono text-white/40 uppercase tracking-widest">
              [ CLICK OR PRESS SPACE TO SKIP ]
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
