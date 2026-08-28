"use client";

import { motion } from "framer-motion";
import { event } from "@/data/event";
import { Zap, Globe, Trophy, Layers } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-24 relative overflow-hidden bg-ink border-t border-white/5">
      {/* Glow highlight */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-crimson/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-crimson-glow">
            [ 01 // OVERVIEW ]
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-bold mt-2 mb-6">
            WELCOME TO <span className="metal-gradient">{event.name}</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans">
            Hosted by <strong className="text-white">{event.presentedBy}</strong> at{" "}
            <a
              href={event.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-crimson-glow hover:underline underline-offset-4 font-semibold"
            >
              {event.venue}, {event.city} ↗
            </a>
            , QUANTEXA is a 24-hour hackathon crucible. Build next-generation solutions in Quantum Technology and Finance Technology that address real-world deep tech challenges.
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Zap,
              title: "24H Non-Stop Sprint",
              desc: "Pure uninterrupted 24-hour hack time with high-speed compute infrastructure and technical mentors.",
            },
            {
              icon: Globe,
              title: "Direct Entry Format",
              desc: "Register directly on Unstop to confirm your slot for the physical 24-hour hackathon sprint at SNS IHUB, Coimbatore.",
            },
            {
              icon: Trophy,
              title: "₹30K Prize Pool & Perks",
              desc: "Cash prizes, direct internship offers from partner companies, and professional mentoring.",
            },
            {
              icon: Layers,
              title: "Direct Grand Finale",
              desc: "Direct access to the physical 24-hour build & live pitch grand finale at SNS IHUB, Coimbatore.",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="glass-panel p-6 rounded-2xl hover:border-crimson/60 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-crimson/10 border border-crimson/30 flex items-center justify-center text-crimson-glow mb-4 group-hover:scale-110 group-hover:bg-crimson/20 transition-all">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-2 text-white group-hover:text-crimson-glow transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed font-sans">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
