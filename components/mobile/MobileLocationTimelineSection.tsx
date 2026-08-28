"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Calendar,
  Clock,
  Navigation,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { event, phases } from "@/data/event";

interface MobileLocationTimelineSectionProps {
  onRegisterClick?: () => void;
}

export default function MobileLocationTimelineSection({
  onRegisterClick,
}: MobileLocationTimelineSectionProps) {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

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

  return (
    <section id="schedule" className="py-12 px-4 bg-ink relative z-10 border-t border-amber-500/20">
      <div className="max-w-md mx-auto space-y-8">
        
        {/* Section Header */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/30 text-amber-400 text-[10px] font-mono uppercase tracking-widest">
            <MapPin className="w-3 h-3 text-amber-400" />
            <span>COMMAND HUB</span>
          </div>
          <h2 className="text-xl font-display font-extrabold text-white">
            VENUE & <span className="text-amber-400">TIMELINE</span>
          </h2>
          <p className="text-[11px] text-gray-300">
            SNS IHUB Coimbatore | September 19–20, 2026
          </p>
        </div>

        {/* Live Countdown Box */}
        <div className="p-4 rounded-2xl bg-black/90 border border-amber-500/30 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-amber-400 font-bold">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-400" />
              COUNTDOWN TO SPRINT
            </span>
            <span className="text-gray-400 text-[10px]">COIMBATORE</span>
          </div>

          <div className="grid grid-cols-4 gap-1.5 text-center font-mono">
            <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-500/30">
              <div className="text-base font-bold text-amber-300">
                {String(timeLeft.days).padStart(2, "0")}
              </div>
              <div className="text-[8px] text-gray-400 uppercase">DAYS</div>
            </div>
            <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-500/30">
              <div className="text-base font-bold text-amber-300">
                {String(timeLeft.hours).padStart(2, "0")}
              </div>
              <div className="text-[8px] text-gray-400 uppercase">HOURS</div>
            </div>
            <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-500/30">
              <div className="text-base font-bold text-amber-300">
                {String(timeLeft.minutes).padStart(2, "0")}
              </div>
              <div className="text-[8px] text-gray-400 uppercase">MINS</div>
            </div>
            <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-500/30">
              <div className="text-base font-bold text-amber-300 animate-pulse">
                {String(timeLeft.seconds).padStart(2, "0")}
              </div>
              <div className="text-[8px] text-gray-400 uppercase">SECS</div>
            </div>
          </div>
        </div>

        {/* Venue Location Card */}
        <div className="p-4 rounded-2xl bg-white/5 border border-amber-500/40 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">
                // VENUE HQ
              </span>
              <h3 className="text-sm font-display font-bold text-white">
                SNS IHUB, Coimbatore
              </h3>
            </div>

            <a
              href={event.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-amber-950/80 border border-amber-500/40 text-amber-300 text-[10px] font-mono font-bold uppercase flex items-center gap-1"
            >
              <Navigation className="w-3 h-3" />
              <span>Map</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>

          <div className="relative w-full h-36 rounded-xl overflow-hidden border border-amber-500/30">
            <iframe
              title="SNS IHUB Location Map Mobile"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3915.2891969446864!2d76.99360817573934!3d11.091763789076891!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba8f71253d10001%3A0xa6187b5a198c60cb!2sSNS%20iHub!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) contrast(120%) brightness(90%)" }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Event Timeline Stepper */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400">
              EVENT PHASES & TIMELINE
            </h3>
          </div>

          {phases.map((item, idx) => {
            const isActive = activeTab === idx;
            return (
              <div
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`p-3.5 rounded-xl border transition-all ${
                  isActive
                    ? "bg-amber-950/60 border-amber-400"
                    : "bg-white/5 border-white/10"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono text-amber-400 uppercase font-bold">
                        {item.phase}
                      </span>
                      <span className="text-[9px] font-mono text-gray-300 px-1.5 py-0.5 rounded bg-black/60 border border-amber-500/20">
                        {item.date}
                      </span>
                    </div>
                    <h4 className="text-xs font-display font-extrabold text-white">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-gray-300 font-sans leading-snug pt-0.5">
                      {item.description}
                    </p>
                  </div>

                  <ChevronRight className={`w-4 h-4 shrink-0 mt-1 ${
                    isActive ? "text-amber-400" : "text-gray-500"
                  }`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Register CTA */}
        {onRegisterClick && (
          <button
            onClick={onRegisterClick}
            className="w-full py-3 rounded-xl bg-amber-400 text-black font-display text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(212,168,67,0.3)]"
          >
            <Sparkles className="w-3.5 h-3.5 fill-black" />
            <span>REGISTER NOW ON UNSTOP</span>
          </button>
        )}

      </div>
    </section>
  );
}
