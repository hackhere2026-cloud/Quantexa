"use client";

import { motion } from "framer-motion";
import { Atom, TrendingUp, Code2, Users, Lightbulb } from "lucide-react";
import CodropsMagneticCard from "@/components/CodropsMagneticCard";

export const eventHighlights = [
  {
    id: "quantum-insights",
    icon: Atom,
    title: "QUANTUM INSIGHTS",
    subtitle: "Frontier Intelligence",
    description: "Explore next-generation decision intelligence, deep-tech paradigms, and automated vulnerability triage.",
  },
  {
    id: "fintech-revolution",
    icon: TrendingUp,
    title: "FINTECH REVOLUTION",
    subtitle: "Financial Security",
    description: "Build high-impact solution frameworks for risk scoring, financial telemetry, and automated compliance.",
  },
  {
    id: "hands-on-session",
    icon: Code2,
    title: "HANDS-ON SESSION",
    subtitle: "24-Hour Build Sprint",
    description: "Engage in an intense 24-hour offline rapid prototyping marathon at SNS iHub, Coimbatore.",
  },
  {
    id: "network-collaborate",
    icon: Users,
    title: "NETWORK & COLLABORATE",
    subtitle: "Ecosystem Access",
    description: "Connect directly with CISOs, senior architects, HR leaders, and industry domain judges.",
  },
  {
    id: "innovate-future",
    icon: Lightbulb,
    title: "INNOVATE THE FUTURE",
    subtitle: "Direct Entry & Rewards",
    description: "Compete for ₹30,000 cash prize pools, direct corporate internship opportunities, and certificates.",
  },
];

export default function EventHighlightsSection() {
  return (
    <section className="relative w-full py-20 px-4 sm:px-8 bg-[#050503] overflow-hidden border-t border-b border-[#D4A843]/20">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#D4A843]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4A843]/10 border border-[#D4A843]/30 text-[#D4A843] text-xs font-mono uppercase tracking-widest"
          >
            <span className="w-2 h-2 rounded-full bg-[#D4A843] animate-ping" />
            <span>EVENT HIGHLIGHTS</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-display font-black tracking-tight text-white uppercase"
          >
            WHY JOIN <span className="bg-gradient-to-r from-[#F0C755] via-[#D4A843] to-[#C9952E] bg-clip-text text-transparent">QUANTEXA 2026</span>
          </motion.h2>

          <p className="text-xs sm:text-sm font-mono text-gray-400 max-w-2xl mx-auto uppercase tracking-wider">
            Think Quantum • Shape The Future • Engineer Solutions
          </p>
        </div>

        {/* 5-Column Grid Layout with Codrops 3D Magnetic Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {eventHighlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <CodropsMagneticCard
                  glowColor="rgba(212, 168, 67, 0.4)"
                  tiltIntensity={12}
                  className="h-full"
                >
                  <div className="relative glass-panel rounded-2xl p-6 border border-[#D4A843]/30 bg-[#0A0E1A]/80 hover:border-[#D4A843] hover:shadow-[0_0_30px_rgba(212,168,67,0.25)] transition-all duration-300 flex flex-col justify-between h-full">
                    <div className="space-y-4">
                      {/* Icon Badge */}
                      <div className="w-12 h-12 rounded-xl bg-[#D4A843]/10 border border-[#D4A843]/40 flex items-center justify-center text-[#D4A843] group-hover:scale-110 group-hover:bg-[#D4A843] group-hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(212,168,67,0.2)]">
                        <Icon className="w-6 h-6" />
                      </div>

                      <div>
                        <h3 className="text-sm font-display font-extrabold text-white tracking-wider uppercase group-hover:text-[#F0C755] transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-[11px] font-mono text-[#D4A843] tracking-widest uppercase mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>

                      <p className="text-xs text-gray-400 leading-relaxed font-sans">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-gray-500">
                      <span>PILLAR 0{index + 1}</span>
                      <span className="text-[#D4A843]">⦿ ACTIVE</span>
                    </div>
                  </div>
                </CodropsMagneticCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
