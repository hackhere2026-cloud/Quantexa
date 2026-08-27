"use client";

import { motion } from "framer-motion";
import { tracks } from "@/data/event";
import { Shield, Activity, Sparkles, Layers } from "lucide-react";

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "shield": return Shield;
    case "activity": return Activity;
    default: return Sparkles;
  }
};

export default function MobileTracksSection() {
  return (
    <section id="tracks" className="py-16 px-4 bg-ink/90 relative z-10 border-t border-cyan-500/20">
      <div className="max-w-md mx-auto space-y-8">
        {/* Section Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono uppercase tracking-widest">
            <Layers className="w-3 h-3 text-cyan-400" />
            <span>HACKATHON DOMAINS</span>
          </div>
          <h2 className="text-2xl font-display font-extrabold text-white">
            FRONTIER <span className="text-cyan-400">TRACKS</span>
          </h2>
          <p className="text-xs text-gray-300">
            Choose your track, innovate, and compete for ₹30K cash prizes and perks.
          </p>
        </div>

        {/* Tracks List */}
        <div className="space-y-4">
          {tracks.map((track, idx) => {
            const Icon = getIconComponent(track.icon);
            return (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="p-5 rounded-2xl bg-white/5 border border-cyan-500/30 space-y-3 relative overflow-hidden backdrop-blur-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-cyan-950/90 border border-cyan-400/50 text-cyan-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-display font-bold text-white">
                      {track.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed">
                  {track.description}
                </p>

                <div className="pt-1 flex items-center justify-between border-t border-white/10">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                    Perks & Rewards
                  </span>
                  <span className="text-[11px] font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-500/30">
                    {track.prize}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
