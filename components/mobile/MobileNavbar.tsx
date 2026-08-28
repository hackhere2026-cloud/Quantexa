"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, ExternalLink, ShieldCheck } from "lucide-react";
import { event } from "@/data/event";
import Image from "next/image";
import Link from "next/link";

interface MobileNavbarProps {
  onRegisterClick: () => void;
}

export default function MobileNavbar({ onRegisterClick }: MobileNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-ink/95 backdrop-blur-xl border-b border-amber-500/30 px-4 py-3 flex items-center justify-between ${
          scrolled ? "shadow-[0_10px_25px_rgba(0,0,0,0.9)]" : ""
        }`}
      >
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2">
          <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-amber-400/50 bg-black/40 flex items-center justify-center">
            <Image
              src="/images/hackhere-logo.jpeg"
              alt="Quantexa Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-display font-extrabold tracking-wider metal-gradient">
              QUANTEXA
            </span>
            <span className="text-[9px] font-mono text-amber-400 -mt-1 tracking-widest uppercase">
              HACKHERE 2026
            </span>
          </div>
        </a>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <a
            href={event.registerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-full bg-amber-400 text-black font-display text-[11px] font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(0,229,255,0.6)]"
          >
            Register
          </a>

          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Navigation Menu"
            className="p-2 rounded-lg bg-amber-950/50 border border-amber-500/40 text-amber-400 focus:outline-none"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Slide-Down Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-[60px] left-0 right-0 z-40 bg-ink/98 backdrop-blur-2xl border-b border-amber-500/40 px-6 py-6 space-y-4 shadow-2xl"
          >
            <nav className="flex flex-col space-y-3 font-display text-sm tracking-wider uppercase">
              <a
                href="#about"
                onClick={closeMenu}
                className="py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400 text-gray-200 flex items-center justify-between"
              >
                <span>About Event</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </a>
              <a
                href="#juries"
                onClick={closeMenu}
                className="py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400 text-gray-200 flex items-center justify-between"
              >
                <span>Juries & Chief Guests</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </a>
              <a
                href="#tracks"
                onClick={closeMenu}
                className="py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400 text-gray-200 flex items-center justify-between"
              >
                <span>Domains & Tracks</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </a>
              <a
                href="#schedule"
                onClick={closeMenu}
                className="py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400 text-gray-200 flex items-center justify-between"
              >
                <span>Schedule Timeline</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </a>
              <a
                href="#rewards"
                onClick={closeMenu}
                className="py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400 text-gray-200 flex items-center justify-between"
              >
                <span>Rewards & Perks</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </a>
              <a
                href="#sponsors"
                onClick={closeMenu}
                className="py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400 text-gray-200 flex items-center justify-between"
              >
                <span>Sponsors</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </a>
              <a
                href="#team"
                onClick={closeMenu}
                className="py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400 text-gray-200 flex items-center justify-between"
              >
                <span>Organizing Team</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </a>
              <a
                href="#faq"
                onClick={closeMenu}
                className="py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400 text-gray-200 flex items-center justify-between"
              >
                <span>FAQ</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </a>
              <Link
                href="/final"
                onClick={closeMenu}
                className="py-2.5 px-4 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-300 flex items-center justify-between font-bold"
              >
                <span>Final Portal</span>
                <ShieldCheck className="w-4 h-4 text-amber-400" />
              </Link>
            </nav>

            <div className="pt-2">
              <a
                href={event.registerUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMenu}
                className="w-full py-3.5 rounded-xl bg-amber-400 text-black font-display font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(0,229,255,0.7)]"
              >
                <span>Proceed to Unstop Registration</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
