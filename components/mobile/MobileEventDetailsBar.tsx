"use client";

import { useState, useEffect } from "react";
import { QrCode, MapPin } from "lucide-react";
import { event } from "@/data/event";

interface MobileEventDetailsBarProps {
  onRegisterClick: () => void;
}

export default function MobileEventDetailsBar({ onRegisterClick }: MobileEventDetailsBarProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date("2026-09-19T09:00:00+05:30").getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-ink/95 backdrop-blur-xl border-t border-cyan-500/40 px-4 py-2.5 flex items-center justify-between shadow-[0_-10px_25px_rgba(0,0,0,0.8)]">
      {/* Location / Timer */}
      <div className="flex flex-col text-[11px] font-mono">
        <span className="text-gray-400 flex items-center gap-1">
          <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
          <span className="text-white font-semibold">{event.city}</span>
        </span>
        <span className="text-cyan-400 font-bold">
          {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </span>
      </div>

      {/* Direct Register Link */}
      <a
        href={event.registerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 rounded-full bg-cyan-400 text-black font-display text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,229,255,0.6)]"
      >
        <QrCode className="w-3.5 h-3.5" />
        <span>Register</span>
      </a>
    </div>
  );
}
