"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, QrCode, Timer, ExternalLink, Compass } from "lucide-react";
import { event } from "@/data/event";

interface EventDetailsBarProps {
  onRegisterClick: () => void;
}

export default function EventDetailsBar({ onRegisterClick }: EventDetailsBarProps) {
  const [showBar, setShowBar] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Calculate live countdown to hackathon launch (September 19, 2026)
  useEffect(() => {
    const targetDate = new Date("2026-09-19T09:00:00+05:30").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar once scrolled past 250px
      setShowBar(window.scrollY > 250);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {showBar && (
        <motion.div
          initial={{ y: 70, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 70, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-5xl glass-panel rounded-2xl px-5 sm:px-7 py-3 shadow-[0_12px_45px_rgba(0,0,0,0.95)] border border-[#D4A843]/40 bg-[#0A0E1A]/95 backdrop-blur-2xl relative overflow-hidden"
        >
          {/* Subtle Ambient Gold Line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4A843]/60 to-transparent" />

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-mono text-gray-200">
            {/* Left Side: Quantum Telemetry Countdown Timer */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D4A843] animate-ping shrink-0" />
                <Timer className="w-4 h-4 text-[#F0C755] shrink-0" />
                <span className="hidden sm:inline-block text-[11px] font-mono font-bold uppercase tracking-widest text-[#D4A843]">
                  LAUNCH IN
                </span>
              </div>

              {/* Ticking Digital Blocks */}
              <div className="flex items-center gap-1 font-mono font-bold text-xs sm:text-sm">
                <div className="bg-black/90 border border-[#D4A843]/50 px-2.5 py-1 rounded-lg text-[#F0C755] shadow-[0_0_12px_rgba(212,168,67,0.25)]">
                  {String(timeLeft.days).padStart(2, "0")}
                  <span className="text-[9px] text-gray-400 ml-0.5">d</span>
                </div>
                <span className="text-[#D4A843] animate-pulse font-extrabold">:</span>

                <div className="bg-black/90 border border-[#D4A843]/50 px-2.5 py-1 rounded-lg text-[#F0C755] shadow-[0_0_12px_rgba(212,168,67,0.25)]">
                  {String(timeLeft.hours).padStart(2, "0")}
                  <span className="text-[9px] text-gray-400 ml-0.5">h</span>
                </div>
                <span className="text-[#D4A843] animate-pulse font-extrabold">:</span>

                <div className="bg-black/90 border border-[#D4A843]/50 px-2.5 py-1 rounded-lg text-[#F0C755] shadow-[0_0_12px_rgba(212,168,67,0.25)]">
                  {String(timeLeft.minutes).padStart(2, "0")}
                  <span className="text-[9px] text-gray-400 ml-0.5">m</span>
                </div>
                <span className="text-[#D4A843] animate-pulse font-extrabold">:</span>

                <motion.div
                  key={timeLeft.seconds}
                  initial={{ scale: 1.12, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="bg-black/90 border border-[#F0C755] px-2.5 py-1 rounded-lg text-black bg-gradient-to-r from-[#F0C755] to-[#D4A843] font-black shadow-[0_0_15px_rgba(240,199,85,0.6)]"
                >
                  {String(timeLeft.seconds).padStart(2, "0")}
                  <span className="text-[9px] text-black/80 ml-0.5">s</span>
                </motion.div>
              </div>
            </div>

            {/* Right Side: Interactive Venue Coordinates & Register CTA */}
            <div className="flex items-center gap-3 sm:gap-6">
              {/* Location Badge (Clickable Google Maps link) */}
              <a
                href={event.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Open SNS IHUB Location in Google Maps"
                className="hidden lg:flex items-center gap-2 border-l border-white/10 pl-4 text-gray-200 hover:text-[#F0C755] transition-colors group"
              >
                <div className="p-1 rounded-md bg-[#D4A843]/10 border border-[#D4A843]/30 text-[#D4A843] group-hover:scale-110 transition-transform">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <span className="group-hover:underline underline-offset-4 flex items-center gap-1.5 text-xs">
                  <strong className="text-white font-sans font-bold">{event.venue}</strong>
                  <span className="text-gray-400">• {event.city}</span>
                  <ExternalLink className="w-3 h-3 text-[#D4A843] group-hover:text-white" />
                </span>
              </a>

              {/* Event Dates Chip */}
              <div className="hidden sm:flex items-center gap-2 border-l border-white/10 pl-4 text-xs">
                <Calendar className="w-3.5 h-3.5 text-[#D4A843] shrink-0" />
                <span className="text-gray-200 font-sans font-semibold">Sept 19–20, 2026</span>
              </div>

              {/* Gold Register Button */}
              <a
                href={event.registerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D4A843] hover:bg-[#F0C755] text-black font-display text-xs font-black uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(212,168,67,0.4)] hover:shadow-[0_0_30px_rgba(240,199,85,0.7)] hover:scale-105"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Register</span>
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
