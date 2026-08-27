"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink } from "lucide-react";
import Image from "next/image";
import { event } from "@/data/event";

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QRModal({ isOpen, onClose }: QRModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-md bg-ink border border-crimson/30 rounded-2xl p-6 sm:p-8 shadow-2xl z-10 text-center glass-panel"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <span className="text-xs font-mono uppercase tracking-widest text-crimson-glow">
                Access Token Gate
              </span>
              <h3 className="text-2xl font-display font-bold mt-1 metal-gradient">
                SCAN TO REGISTER
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Point your mobile camera at the QR code to open the QUANTEXA registration portal.
              </p>
            </div>
 
            {/* Event Poster / QR Image */}
            <div className="relative mx-auto w-full max-w-[280px] aspect-[994/1350] bg-black/80 p-2 rounded-2xl shadow-inner border-2 border-crimson/50 mb-6 overflow-hidden group">
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <Image
                  src="/qr.png"
                  alt="Quantexa Registration Event Poster"
                  fill
                  className="object-contain rounded-xl"
                />
              </div>
            </div>

            {/* Event Info Badge */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 mb-6 text-xs text-gray-300 flex justify-between items-center">
              <div>
                <span className="block text-gray-400">Location & Dates</span>
                <span className="font-semibold text-white">{event.city} • {event.dateRange}</span>
              </div>
              <div className="text-right">
                <span className="block text-gray-400">Presented By</span>
                <span className="font-semibold text-crimson-glow">{event.presentedBy}</span>
              </div>
            </div>

            {/* Action Link */}
            <a
              href={event.registerUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                onClose();
              }}
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl bg-gradient-to-r from-crimson to-crimson-dark text-white font-display font-semibold hover:shadow-[0_0_25px_rgba(255,30,60,0.6)] transition-all duration-300"
            >
              <span>Proceed to Unstop Portal</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
