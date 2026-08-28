"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { faqs } from "@/data/event";
import { HelpCircle, ChevronDown } from "lucide-react";

export default function MobileFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-16 px-4 bg-ink relative z-10 border-t border-amber-500/20">
      <div className="max-w-md mx-auto space-y-8">
        {/* Section Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/30 text-amber-400 text-[10px] font-mono uppercase tracking-widest">
            <HelpCircle className="w-3 h-3 text-amber-400" />
            <span>GOT QUESTIONS?</span>
          </div>
          <h2 className="text-2xl font-display font-extrabold text-white">
            FREQUENTLY ASKED <span className="text-amber-400">QUESTIONS</span>
          </h2>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white/5 border border-amber-500/30 overflow-hidden backdrop-blur-sm"
              >
                <button
                  onClick={() => toggleIndex(idx)}
                  className="w-full p-4 text-left font-display text-xs font-bold text-white flex items-center justify-between gap-3 focus:outline-none"
                >
                  <span className="leading-snug">{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-amber-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-4 pb-4 text-xs text-gray-300 leading-relaxed border-t border-amber-500/10 pt-3"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
