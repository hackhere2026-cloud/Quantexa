"use client";

import { motion } from "framer-motion";
import { phases } from "@/data/event";
import { Calendar, Rocket, Lightbulb, Code2, Trophy } from "lucide-react";
import CodropsMagneticCard from "@/components/CodropsMagneticCard";

const phaseIcons = [Rocket, Lightbulb, Code2, Trophy];

export default function ScheduleSection() {
  return (
    <section id="schedule" className="py-24 relative bg-[#050503] border-t border-white/5 overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#D4A843]/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-amber-400">
            [ 03 // EVENT TIMELINE ]
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-black tracking-wider uppercase mt-2 mb-4">
            EVENT <span className="bg-gradient-to-r from-white via-[#F0C755] to-[#D4A843] bg-clip-text text-transparent">PHASES</span>
          </h2>
          <p className="text-gray-400 font-sans text-base sm:text-lg">
            From direct team registration on Unstop to 24-hour physical build & live pitch grand finale.
          </p>
        </motion.div>

        {/* 4-Phase Grid Layout with Codrops 3D Magnetic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative items-stretch">
          {phases.map((item, idx) => {
            const IconComponent = phaseIcons[idx] || Rocket;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <CodropsMagneticCard glowColor="rgba(212, 168, 67, 0.4)" tiltIntensity={10} className="h-full">
                  <div className="relative group glass-panel p-7 sm:p-9 rounded-3xl border border-amber-500/30 bg-[#0A0E1A]/80 hover:border-amber-400/70 hover:shadow-[0_0_40px_rgba(212,168,67,0.25)] transition-all duration-300 flex flex-col justify-between cursor-pointer h-full min-h-[280px] sm:min-h-[250px]">
                    {/* Glowing Node Dot */}
                    <div className="absolute top-7 right-7 flex items-center justify-center">
                      <span className="w-3.5 h-3.5 rounded-full bg-amber-400 shadow-[0_0_15px_#D4A843] group-hover:scale-125 transition-transform" />
                      <span className="absolute w-7 h-7 rounded-full border border-amber-400/40 animate-ping" />
                    </div>

                    <div>
                      {/* Phase Label & Icon */}
                      <div className="flex items-center gap-4 mb-5">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-black transition-all">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 block mb-0.5 font-bold">
                            {item.phase}
                          </span>
                          <h3 className="text-xl sm:text-2xl font-display font-bold text-white group-hover:text-amber-400 transition-colors">
                            {item.title}
                          </h3>
                        </div>
                      </div>

                      {/* Dates Badge */}
                      <div className="flex items-center gap-2 text-sm sm:text-base font-mono font-semibold text-amber-400 mb-4 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-xl w-fit">
                        <Calendar className="w-4 h-4 text-amber-400" />
                        <span>{item.date}</span>
                      </div>

                      {/* Description */}
                      <p className="text-sm sm:text-base text-gray-300 font-sans leading-relaxed">
                        {item.description}
                      </p>
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
