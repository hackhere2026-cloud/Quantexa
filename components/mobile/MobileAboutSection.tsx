"use client";

import { motion } from "framer-motion";
import { Shield, Sparkles, Globe, Trophy, Layers } from "lucide-react";
import { event } from "@/data/event";

const highlights = [
  {
    icon: Sparkles,
    title: "Frontier Innovation",
    desc: "Quantum information processing, quantum algorithms, and financial tech telemetry.",
  },
  {
    icon: Globe,
    title: "Direct Entry Format",
    desc: "Register directly on Unstop to join the physical 24-hour hackathon sprint at SNS IHUB, Coimbatore.",
  },
  {
    icon: Trophy,
    title: "₹30K Prize Pool & Perks",
    desc: "Cash prizes, direct internship offers from industry partners, and professional mentoring.",
  },
  {
    icon: Layers,
    title: "Direct Grand Finale",
    desc: "Registration fee of ₹1,000/team grants direct access to the 24-hour physical build & live pitch at SNS IHUB.",
  },
];

export default function MobileAboutSection() {
  return (
    <section id="about" className="py-16 px-4 bg-ink relative z-10 border-t border-amber-500/20">
      <div className="max-w-md mx-auto space-y-8">
        {/* Section Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/30 text-amber-400 text-[10px] font-mono uppercase tracking-widest">
            <Shield className="w-3 h-3 text-amber-400" />
            <span>ABOUT THE HACKATHON</span>
          </div>
          <h2 className="text-2xl font-display font-extrabold text-white">
            DEEP TECH & <span className="text-amber-400">INTELLIGENCE</span>
          </h2>
          <p className="text-xs text-gray-300 leading-relaxed pt-1">
            QUANTEXA is a flagship 24-hour innovation marathon bringing together high-impact builders, engineers, and deep tech visionaries.
          </p>
        </div>

        {/* Feature Cards Stack */}
        <div className="space-y-4">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="p-5 rounded-2xl bg-white/5 border border-amber-500/20 space-y-2 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-950/90 border border-amber-400/40 text-amber-400 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-display font-bold text-white">
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed pl-1">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
