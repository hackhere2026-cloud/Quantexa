"use client";

import { motion } from "framer-motion";
import { QrCode, Sparkles, ChevronDown, Trophy, MapPin, Calendar } from "lucide-react";
import { event } from "@/data/event";

interface MobileHeroSectionProps {
  onRegisterClick: () => void;
}

export default function MobileHeroSection({ onRegisterClick }: MobileHeroSectionProps) {
  return (
    <section className="relative w-full min-h-screen pt-24 pb-16 px-4 flex flex-col justify-center items-center text-center overflow-hidden bg-ink">
      {/* Radial Backlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/25 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-sm mx-auto space-y-6 flex flex-col items-center">
        {/* Status Pill */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 text-[10px] font-mono uppercase tracking-widest backdrop-blur-md"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>SEATS FILLING FAST • LIMITED SPOTS</span>
        </motion.div>

        {/* Hero Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-2"
        >
          <h1 className="text-4xl font-display font-black tracking-tight text-white drop-shadow-[0_0_25px_rgba(0,229,255,0.7)]">
            QUANTEXA <span className="text-cyan-400">2026</span>
          </h1>
          <p className="text-xs font-mono text-cyan-300 tracking-widest uppercase">
            DECODING RISKS • ENGINEERING SOLUTIONS
          </p>
          <p className="text-xs text-gray-300 pt-1 leading-relaxed">
            24-Hour Premier Hackathon presented by{"  "}
            <span className="text-cyan-400 font-bold">{event.presentedBy}</span>
          </p>
        </motion.div>

        {/* Location & Date Badge */}
        <div className="w-full grid grid-cols-2 gap-2 text-[11px] font-mono text-gray-200">
          <div className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/5 border border-cyan-500/30">
            <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Sept 19–20</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/5 border border-cyan-500/30">
            <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">Coimbatore</span>
          </div>
        </div>

        {/* Prize Alert Banner */}
        <div className="w-full py-2.5 px-4 rounded-xl bg-cyan-950/70 border border-cyan-400/50 flex items-center justify-center gap-2 text-xs font-mono text-cyan-300">
          <Trophy className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>₹30K Cash Pool + Internships</span>
        </div>

        {/* Mobile CTA Buttons */}
        <div className="w-full space-y-3 pt-2">
          <a
            href={event.registerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 rounded-full bg-cyan-400 text-black font-display font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(0,229,255,0.8)] active:scale-95 transition-transform"
          >
            <QrCode className="w-4 h-4" />
            <span>CLAIM ACCESS PASS</span>
          </a>

          <a
            href="#tracks"
            className="w-full py-3.5 rounded-full bg-white/10 border border-white/20 text-white font-display font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>EXPLORE DOMAINS</span>
          </a>
        </div>

        {/* Scroll Indicator */}
        <div className="pt-6 flex flex-col items-center text-gray-400 text-[10px] font-mono uppercase tracking-widest">
          <span>Scroll to explore</span>
          <ChevronDown className="w-4 h-4 text-cyan-400 animate-bounce mt-1" />
        </div>
      </div>
    </section>
  );
}
