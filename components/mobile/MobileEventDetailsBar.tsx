"use client";

import { useState, useEffect } from "react";
import { QrCode, MapPin, ExternalLink } from "lucide-react";
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
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0A0E1A]/95 backdrop-blur-xl border-t border-[#D4A843]/40 px-4 py-2.5 flex items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.9)]">
      {/* Location / Timer Telemetry */}
      <div className="flex flex-col text-[11px] font-mono space-y-0.5 min-w-0">
        <a
          href={event.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-300 flex items-center gap-1 hover:text-[#F0C755] transition-colors truncate"
        >
          <MapPin className="w-3 h-3 text-[#D4A843] shrink-0" />
          <span className="text-white font-bold truncate">{event.venue}</span>
          <ExternalLink className="w-2.5 h-2.5 text-[#D4A843] shrink-0" />
        </a>
        <div className="flex items-center gap-1.5 text-[#F0C755] font-bold text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4A843] animate-ping shrink-0" />
          <span>
            {timeLeft.days}d : {timeLeft.hours}h : {timeLeft.minutes}m : {timeLeft.seconds}s
          </span>
        </div>
      </div>

      {/* Direct Register Link */}
      <a
        href={event.registerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 rounded-xl bg-[#D4A843] hover:bg-[#F0C755] text-black font-display text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(212,168,67,0.5)] shrink-0 ml-2"
      >
        <QrCode className="w-3.5 h-3.5" />
        <span>Register</span>
      </a>
    </div>
  );
}
