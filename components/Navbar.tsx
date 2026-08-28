"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { event } from "@/data/event";
import Image from "next/image";
import Link from "next/link";

interface NavbarProps {
  onRegisterClick: () => void;
}

export default function Navbar({ onRegisterClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-ink/90 backdrop-blur-xl border-b border-crimson/30 shadow-[0_10px_30px_rgba(0,0,0,0.8)] ${
        scrolled ? "py-3 bg-ink/95 border-crimson/50" : "py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-crimson/40 bg-white/5 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Image
              src="/images/hackhere-logo.jpeg"
              alt="Quantexa Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </a>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-300">
          <a href="#about" className="hover:text-crimson-glow transition-colors">
            About
          </a>
          <a href="#juries" className="hover:text-crimson-glow transition-colors">
            Juries
          </a>
          <a href="#tracks" className="hover:text-crimson-glow transition-colors">
            Domains
          </a>
          <a href="#schedule" className="hover:text-crimson-glow transition-colors">
            Schedule
          </a>
          <a href="#rewards" className="hover:text-crimson-glow transition-colors">
            Rewards
          </a>
          <a href="#sponsors" className="hover:text-crimson-glow transition-colors">
            Sponsors
          </a>
          <a href="#team" className="hover:text-crimson-glow transition-colors">
            Team
          </a>
          <a href="#faq" className="hover:text-crimson-glow transition-colors">
            FAQ
          </a>
          <Link
            href="/final"
            className="px-2.5 py-1 rounded-lg bg-amber-950/80 border border-amber-500/40 text-amber-300 hover:text-white transition-all text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-1 shadow-[0_0_10px_rgba(0,229,255,0.2)]"
          >
            <span>FINAL PORTAL</span>
          </Link>
        </div>

        {/* CTA Register Button */}
        <a
          href={event.registerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative group overflow-hidden px-5 py-2.5 rounded-full bg-crimson text-black font-display text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(0,229,255,0.5)] hover:shadow-[0_0_30px_rgba(0,240,255,0.8)] transition-all duration-300 inline-flex items-center justify-center"
        >
          <span className="relative z-10">Register Now</span>
          <div className="absolute inset-0 bg-gradient-to-r from-crimson-glow to-crimson opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </a>
      </div>
    </motion.header>
  );
}
