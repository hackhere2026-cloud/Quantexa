"use client";

import { motion } from "framer-motion";
import { eventHighlights } from "../EventHighlightsSection";

export default function MobileEventHighlightsSection() {
  return (
    <section className="py-14 px-4 bg-[#050503] border-t border-b border-[#D4A843]/20 space-y-8">
      <div className="text-center space-y-2">
        <span className="px-3 py-1 rounded-full bg-[#D4A843]/10 border border-[#D4A843]/30 text-[#D4A843] text-[10px] font-mono uppercase tracking-widest">
          EVENT HIGHLIGHTS
        </span>
        <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight">
          WHY JOIN <span className="text-[#D4A843]">QUANTEXA</span>
        </h2>
      </div>

      <div className="space-y-4">
        {eventHighlights.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="p-4 rounded-xl bg-[#0A0E1A] border border-[#D4A843]/30 flex items-start gap-4 shadow-[0_0_15px_rgba(212,168,67,0.1)]"
            >
              <div className="w-10 h-10 rounded-lg bg-[#D4A843]/10 border border-[#D4A843]/40 flex items-center justify-center text-[#D4A843] shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-display font-bold text-white uppercase tracking-wider">
                  {item.title}
                </h3>
                <p className="text-[10px] font-mono text-[#D4A843] uppercase tracking-widest">
                  {item.subtitle}
                </p>
                <p className="text-[11px] text-gray-300 font-sans leading-relaxed pt-1">
                  {item.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
