"use client";

import Image from "next/image";
import { event } from "@/data/event";
import { Twitter, Disc as Discord, Github, Mail, MapPin, Calendar, ExternalLink } from "lucide-react";

export default function MobileFooter() {
  return (
    <footer className="bg-ink border-t border-cyan-500/20 pt-12 pb-24 px-4 text-gray-400 text-xs font-sans relative z-10">
      <div className="max-w-md mx-auto space-y-8 text-center">
        {/* Brand */}
        <div className="flex flex-col items-center space-y-3">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-cyan-400/50 bg-white/5 flex items-center justify-center">
            <Image
              src="/images/hackhere-logo.jpeg"
              alt="Quantexa Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-xl font-display font-extrabold metal-gradient">
            QUANTEXA 2026
          </span>
          <p className="text-[11px] text-gray-300 leading-relaxed max-w-xs">
            Presented by <strong className="text-white">{event.presentedBy}</strong>. 24-Hour hackathon building the next era of tech innovation.
          </p>
        </div>

        {/* Quick Venue Info */}
        <div className="p-4 rounded-2xl bg-white/5 border border-cyan-500/20 space-y-2 text-center">
          <div className="flex items-center justify-center gap-1.5 text-cyan-400 font-mono font-bold">
            <MapPin className="w-4 h-4" />
            <span>{event.venue}, {event.city}</span>
          </div>
          <p className="text-[11px] text-gray-400">
            Dates: {event.dateRange}, 2026
          </p>
          <a
            href={event.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:underline pt-1"
          >
            <span>Open in Google Maps</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Social Icons */}
        <div className="flex items-center justify-center space-x-4 text-gray-300">
          <a href="#" className="p-2.5 bg-white/5 border border-white/10 rounded-full text-cyan-400">
            <Twitter className="w-4 h-4" />
          </a>
          <a href="#" className="p-2.5 bg-white/5 border border-white/10 rounded-full text-cyan-400">
            <Discord className="w-4 h-4" />
          </a>
          <a href="#" className="p-2.5 bg-white/5 border border-white/10 rounded-full text-cyan-400">
            <Github className="w-4 h-4" />
          </a>
          <a href="#" className="p-2.5 bg-white/5 border border-white/10 rounded-full text-cyan-400">
            <Mail className="w-4 h-4" />
          </a>
        </div>

        {/* Copyright */}
        <div className="pt-4 border-t border-white/10 text-[10px] font-mono text-gray-400">
          © 2026 QUANTEXA • Presented by HackHere. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
