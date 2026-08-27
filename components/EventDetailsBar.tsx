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

  // Calculate live countdown to hackathon launch (September 12, 2026)
  useEffect(() => {
    const targetDate = new Date("2026-09-12T09:00:00+05:30").getTime();

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
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-5xl glass-panel rounded-full px-5 sm:px-8 py-3 shadow-[0_10px_35px_rgba(0,0,0,0.9)] border border-crimson/40"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-mono text-gray-200">
            {/* Left Side: Animated Event Launch Countdown Timer */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-crimson-glow animate-ping shrink-0" />
                <Timer className="w-4 h-4 text-crimson-glow shrink-0" />
                <span className="hidden sm:inline-block text-[11px] font-mono uppercase tracking-widest text-gray-400">
                  LAUNCH IN
                </span>
              </div>

              {/* Ticking Digit Counters */}
              <div className="flex items-center gap-1 font-mono font-bold text-xs sm:text-sm">
                <div className="bg-black/80 border border-crimson/50 px-2 py-1 rounded-md text-crimson-glow shadow-[0_0_10px_rgba(0,229,255,0.4)]">
                  {String(timeLeft.days).padStart(2, "0")}
                  <span className="text-[9px] text-gray-400 ml-0.5">d</span>
                </div>
                <span className="text-crimson-glow animate-pulse font-extrabold">:</span>

                <div className="bg-black/80 border border-crimson/50 px-2 py-1 rounded-md text-crimson-glow shadow-[0_0_10px_rgba(0,229,255,0.4)]">
                  {String(timeLeft.hours).padStart(2, "0")}
                  <span className="text-[9px] text-gray-400 ml-0.5">h</span>
                </div>
                <span className="text-crimson-glow animate-pulse font-extrabold">:</span>

                <div className="bg-black/80 border border-crimson/50 px-2 py-1 rounded-md text-crimson-glow shadow-[0_0_10px_rgba(0,229,255,0.4)]">
                  {String(timeLeft.minutes).padStart(2, "0")}
                  <span className="text-[9px] text-gray-400 ml-0.5">m</span>
                </div>
                <span className="text-crimson-glow animate-pulse font-extrabold">:</span>

                <motion.div
                  key={timeLeft.seconds}
                  initial={{ scale: 1.15, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="bg-black/80 border border-crimson/60 px-2 py-1 rounded-md text-white bg-gradient-to-r from-crimson/30 to-crimson/10 shadow-[0_0_15px_rgba(0,240,255,0.7)]"
                >
                  {String(timeLeft.seconds).padStart(2, "0")}
                  <span className="text-[9px] text-gray-300 ml-0.5">s</span>
                </motion.div>
              </div>
            </div>

            {/* Right Side: Venue (Clickable Google Maps link), Date & Register Button */}
            <div className="flex items-center gap-3 sm:gap-6">
              {/* Location Link */}
              <a
                href={event.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Open SNS IHUB Location in Google Maps"
                className="hidden lg:flex items-center gap-2 border-l border-white/10 pl-4 text-gray-200 hover:text-crimson-glow transition-colors group"
              >
                <MapPin className="w-4 h-4 text-crimson-glow group-hover:scale-110 transition-transform shrink-0" />
                <span className="group-hover:underline underline-offset-4 flex items-center gap-1">
                  <strong className="text-white font-sans">{event.venue}</strong> • {event.city}
                  <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-crimson-glow" />
                </span>
              </a>

              {/* Dates */}
              <div className="hidden sm:flex items-center gap-2 border-l border-white/10 pl-4">
                <Calendar className="w-4 h-4 text-crimson-glow shrink-0" />
                <span className="text-white font-sans font-semibold">{event.dateRange}</span>
              </div>

              {/* Pill Register Button */}
              <a
                href={event.registerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-crimson hover:bg-crimson-glow text-black font-display text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,229,255,0.6)] hover:shadow-[0_0_30px_rgba(0,240,255,0.9)] hover:scale-105"
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
