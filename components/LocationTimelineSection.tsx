"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Calendar,
  Clock,
  Navigation,
  Wifi,
  Coffee,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Zap,
} from "lucide-react";
import { event, phases } from "@/data/event";

interface LocationTimelineSectionProps {
  onRegisterClick?: () => void;
}

export default function LocationTimelineSection({ onRegisterClick }: LocationTimelineSectionProps) {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Countdown timer to September 19, 2026 09:00 IST
  useEffect(() => {
    const targetDate = new Date("2026-09-19T09:00:00+05:30").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
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

  const venueFeatures = [
    { icon: Zap, label: "24/7 Continuous Power", desc: "Uninterrupted sprint infrastructure" },
    { icon: Wifi, label: "High-Speed Wi-Fi", desc: "Dedicated high-bandwidth hacker lines" },
    { icon: Coffee, label: "Meals & Refreshments", desc: "Complimentary food, snacks & midnight coffee" },
    { icon: ShieldCheck, label: "Hacker Rest & Mentors", desc: "Dedicated rest lounges & 1-on-1 mentor desks" },
  ];

  return (
    <section id="schedule" className="py-20 sm:py-24 relative bg-ink border-t border-white/5 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4A843]/5 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-14">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-950/80 border border-amber-500/30 text-amber-400 font-mono text-xs uppercase tracking-widest">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>[ 03 // QUANTUM COMMAND HUB ]</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white">
            VENUE & <span className="metal-gradient">EVENT TIMELINE</span>
          </h2>
          <p className="text-gray-300 font-sans text-sm sm:text-base leading-relaxed">
            Discover the grand finale venue at SNS IHUB, Coimbatore, and navigate through the 4 core event phases.
          </p>
        </motion.div>

        {/* Dual Command Hub Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* ================= LEFT WING: VENUE GEO COMMAND ================= */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 glass-panel rounded-3xl border border-amber-500/30 bg-gradient-to-b from-amber-950/20 via-ink to-black p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group shadow-[0_0_30px_rgba(0,0,0,0.8)]"
          >
            <div className="space-y-6">
              {/* Card Header & Badges */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-amber-400/80 uppercase tracking-widest block">
                      // OFFICIAL VENUE HQ
                    </span>
                    <h3 className="text-xl font-display font-bold text-white">
                      {event.venue}, {event.city}
                    </h3>
                  </div>
                </div>

                <a
                  href={event.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-400 hover:text-black border border-amber-500/40 text-amber-300 font-mono text-xs font-bold uppercase transition-all"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Directions</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              </div>

              {/* Geo Coordinate HUD Ribbon */}
              <div className="px-4 py-2.5 rounded-xl bg-black/80 border border-amber-500/20 flex flex-wrap items-center justify-between text-xs font-mono text-gray-300 gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-amber-400 font-bold">COORDINATES:</span>
                  <span>11.0827° N, 76.9958° E</span>
                </div>
                <span className="text-gray-400">SNS IHUB Campus, Coimbatore</span>
              </div>

              {/* Live Interactive Map Embed Frame */}
              <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden border border-amber-500/30 group-hover:border-amber-400/60 transition-colors shadow-inner">
                <iframe
                  title="SNS IHUB Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3915.2891969446864!2d76.99360817573934!3d11.091763789076891!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba8f71253d10001%3A0xa6187b5a198c60cb!2sSNS%20iHub!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) contrast(120%) brightness(90%)" }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full object-cover"
                />
                
                {/* Map Overlay Badge */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-amber-500/40 text-[11px] font-mono text-amber-300 font-bold flex items-center gap-1.5 shadow-lg">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>SNS IHUB GRAND FINALE</span>
                </div>
              </div>

              {/* Venue Features Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                {venueFeatures.map((feat, idx) => {
                  const Icon = feat.icon;
                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/40 transition-colors space-y-1"
                    >
                      <div className="flex items-center gap-2 text-amber-400">
                        <Icon className="w-4 h-4" />
                        <span className="text-xs font-display font-bold text-white">{feat.label}</span>
                      </div>
                      <p className="text-[11px] text-gray-400 font-sans leading-snug">{feat.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

          </motion.div>

          {/* ================= RIGHT WING: EVENT TIMELINE CIRCUIT ================= */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 glass-panel rounded-3xl border border-amber-500/30 bg-gradient-to-b from-amber-950/20 via-ink to-black p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)] space-y-6"
          >
            {/* Header & Live Countdown Clock */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-amber-400/80 uppercase tracking-widest block">
                      // EVENT SCHEDULE
                    </span>
                    <h3 className="text-xl font-display font-bold text-white">
                      Event Timeline & Phases
                    </h3>
                  </div>
                </div>

                <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span>SEP 19–20</span>
                </div>
              </div>

              {/* Integrated Live Countdown Timer Box */}
              <div className="p-4 rounded-2xl bg-black/90 border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-gray-400 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    GRAND FINALE COUNTDOWN
                  </span>
                  <span className="text-[10px] text-gray-500">SEPTEMBER 19, 2026</span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center pt-1 font-mono">
                  <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-500/30">
                    <div className="text-lg sm:text-2xl font-bold text-amber-300">
                      {String(timeLeft.days).padStart(2, "0")}
                    </div>
                    <div className="text-[9px] text-gray-400 uppercase font-semibold">DAYS</div>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-500/30">
                    <div className="text-lg sm:text-2xl font-bold text-amber-300">
                      {String(timeLeft.hours).padStart(2, "0")}
                    </div>
                    <div className="text-[9px] text-gray-400 uppercase font-semibold">HOURS</div>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-500/30">
                    <div className="text-lg sm:text-2xl font-bold text-amber-300">
                      {String(timeLeft.minutes).padStart(2, "0")}
                    </div>
                    <div className="text-[9px] text-gray-400 uppercase font-semibold">MINS</div>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-500/30">
                    <div className="text-lg sm:text-2xl font-bold text-amber-300 animate-pulse">
                      {String(timeLeft.seconds).padStart(2, "0")}
                    </div>
                    <div className="text-[9px] text-gray-400 uppercase font-semibold">SECS</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Timeline Stepper List */}
            <div className="space-y-3.5">
              {phases.map((item, idx) => {
                const isActive = activeTab === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setActiveTab(idx)}
                    className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden ${
                      isActive
                        ? "bg-amber-950/50 border-amber-400 shadow-[0_0_20px_rgba(212,168,67,0.2)]"
                        : "bg-white/5 border-white/10 hover:border-amber-500/40 hover:bg-white/10"
                    }`}
                  >
                    {/* Active Accent Bar */}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-400" />
                    )}

                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${
                            isActive ? "text-amber-300" : "text-gray-400"
                          }`}>
                            {item.phase}
                          </span>
                          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-black/60 border border-amber-500/30 text-amber-400">
                            {item.date}
                          </span>
                        </div>
                        <h4 className="text-base font-display font-extrabold text-white">
                          {item.title}
                        </h4>
                        <p className="text-xs text-gray-300 font-sans leading-relaxed pt-0.5">
                          {item.description}
                        </p>
                      </div>

                      <ChevronRight className={`w-5 h-5 shrink-0 transition-transform ${
                        isActive ? "text-amber-400 translate-x-1" : "text-gray-500"
                      }`} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Footer */}
            {onRegisterClick && (
              <div className="pt-2">
                <button
                  onClick={onRegisterClick}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-black font-display text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,168,67,0.4)] transition-all hover:scale-[1.01]"
                >
                  <Sparkles className="w-4 h-4 fill-black" />
                  <span>REGISTER TEAM ON UNSTOP NOW</span>
                </button>
              </div>
            )}
          </motion.div>

        </div>

      </div>
    </section>
  );
}
