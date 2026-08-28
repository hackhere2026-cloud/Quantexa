"use client";

import { motion } from "framer-motion";
import { tracks } from "@/data/event";
import { Atom, TrendingUp, Sparkles } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  atom: Atom,
  "trending-up": TrendingUp,
};

export default function TracksSection() {
  return (
    <section id="tracks" className="py-24 relative bg-ink/90 border-t border-white/5">
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
            [ 02 // CHALLENGE DOMAINS ]
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-bold mt-2 mb-4">
            HACKATHON <span className="metal-gradient">DOMAINS</span>
          </h2>
          <p className="text-gray-400 font-sans text-base sm:text-lg">
            Choose your frontier. Shape the future.
          </p>
        </motion.div>

        {/* Domains 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {tracks.map((track, idx) => {
            const IconComponent = iconMap[track.icon] || Sparkles;
            return (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative glass-panel rounded-2xl p-8 hover:border-crimson hover:shadow-[0_0_30px_rgba(0,229,255,0.3)] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Domain Icon */}
                  <div className="mb-6 flex justify-between items-start">
                    <div className="w-14 h-14 rounded-2xl bg-crimson/10 border border-crimson/30 flex items-center justify-center text-crimson-glow group-hover:scale-110 group-hover:bg-crimson group-hover:text-black transition-all">
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-mono font-bold text-crimson-glow bg-crimson/10 px-3 py-1 rounded-full border border-crimson/35">
                      {track.prize}
                    </span>
                  </div>

                  {/* Domain Title */}
                  <h3 className="text-2xl font-display font-bold text-white mb-4 group-hover:text-crimson-glow transition-colors">
                    {track.title}
                  </h3>

                  {/* Domain Description */}
                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-sans">
                    {track.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
