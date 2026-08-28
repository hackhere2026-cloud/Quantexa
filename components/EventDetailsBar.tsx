"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, QrCode, Timer, ExternalLink } from "lucide-react";
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
      // Show sticky bar once scrolled past 300px
      setShowBar(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {showBar && (
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-6 left-6 sm:left-8 z-40 max-w-5xl glass-panel rounded-full px-4 sm:px-6 py-2.5 shadow-[0_10px_35px_rgba(0,0,0,0.9)] border border-amber-500/40 bg-ink/95 backdrop-blur-xl"
        >
          <div className="flex items-center gap-3 sm:gap-5 text-xs sm:text-sm font-mono text-gray-200 flex-wrap sm:flex-nowrap">
            
            {/* 1. Location Link (Far Left) */}
            <a
              href={event.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open SNS IHUB Location in Google Maps"
              className="flex items-center gap-1.5 text-gray-200 hover:text-amber-400 transition-colors group shrink-0"
            >
              <MapPin className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
              <span className="group-hover:underline underline-offset-4 flex items-center gap-1 text-xs sm:text-sm">
                <strong className="text-white font-sans">{event.venue}</strong>
                <span className="hidden sm:inline-block">• {event.city}</span>
                <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-amber-400" />
              </span>
            </a>

            {/* Vertical Divider */}
            <div className="h-4 w-px bg-white/20 shrink-0" />

            {/* 2. Days Left Countdown (Next on Left) */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
                <Timer className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="hidden sm:inline-block text-[11px] font-mono uppercase tracking-widest text-gray-400">
                  LAUNCH IN
                </span>
              </div>

              {/* Ticking Digit Counters */}
              <div className="flex items-center gap-1 font-mono font-bold text-xs sm:text-sm">
                <div className="bg-black/80 border border-amber-500/50 px-2 py-0.5 rounded-md text-amber-400 shadow-[0_0_10px_rgba(212,168,67,0.3)]">
                  {String(timeLeft.days).padStart(2, "0")}
                  <span className="text-[9px] text-gray-400 ml-0.5">d</span>
                </div>
                <span className="text-amber-400 animate-pulse font-extrabold">:</span>

                <div className="bg-black/80 border border-amber-500/50 px-2 py-0.5 rounded-md text-amber-400 shadow-[0_0_10px_rgba(212,168,67,0.3)]">
                  {String(timeLeft.hours).padStart(2, "0")}
                  <span className="text-[9px] text-gray-400 ml-0.5">h</span>
                </div>
                <span className="text-amber-400 animate-pulse font-extrabold">:</span>

                <div className="bg-black/80 border border-amber-500/50 px-2 py-0.5 rounded-md text-amber-400 shadow-[0_0_10px_rgba(212,168,67,0.3)]">
                  {String(timeLeft.minutes).padStart(2, "0")}
                  <span className="text-[9px] text-gray-400 ml-0.5">m</span>
                </div>
                <span className="text-amber-400 animate-pulse font-extrabold">:</span>

                <motion.div
                  key={timeLeft.seconds}
                  initial={{ scale: 1.15, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="bg-black/80 border border-amber-500/60 px-2 py-0.5 rounded-md text-white bg-gradient-to-r from-amber-950/40 to-amber-900/20 shadow-[0_0_15px_rgba(212,168,67,0.5)]"
                >
                  {String(timeLeft.seconds).padStart(2, "0")}
                  <span className="text-[9px] text-gray-300 ml-0.5">s</span>
                </motion.div>
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="hidden lg:block h-4 w-px bg-white/20 shrink-0" />

            {/* 3. Event Dates (Optional display on larger screens) */}
            <div className="hidden lg:flex items-center gap-1.5 shrink-0">
              <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-white font-sans text-xs font-semibold">{event.dateRange}</span>
            </div>

            {/* Vertical Divider */}
            <div className="h-4 w-px bg-white/20 shrink-0" />

            {/* 4. Register Button */}
            <a
              href={event.registerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-display text-[11px] font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(212,168,67,0.6)] hover:shadow-[0_0_30px_rgba(240,199,85,0.9)] hover:scale-105 shrink-0"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Register</span>
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
