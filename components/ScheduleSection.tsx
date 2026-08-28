"use client";

import { motion } from "framer-motion";
import { phases } from "@/data/event";
import { Calendar, Rocket, Lightbulb, Code2, Trophy } from "lucide-react";

const phaseIcons = [Rocket, Lightbulb, Code2, Trophy];

export default function ScheduleSection() {
  return (
    <section id="schedule" className="py-24 relative bg-ink border-t border-white/5 overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#D4A843]/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-crimson-glow">
            [ 03 // EVENT TIMELINE ]
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-bold mt-2 mb-4">
            EVENT <span className="metal-gradient">PHASES</span>
          </h2>
          <p className="text-gray-400 font-sans text-base sm:text-lg">
            From direct team registration on Unstop to 24-hour physical build & live pitch grand finale.
          </p>
        </motion.div>

        {/* 4-Phase Grid Layout with Uniform Sizing and Smooth Hover Magnification */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative items-stretch">
          {phases.map((item, idx) => {
            const IconComponent = phaseIcons[idx] || Rocket;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.04, y: -6 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                }}
                className="relative group glass-panel p-7 sm:p-9 rounded-2xl border border-white/15 hover:border-crimson-glow hover:shadow-[0_0_40px_rgba(0,229,255,0.35)] transition-all duration-300 flex flex-col justify-between cursor-pointer h-full min-h-[280px] sm:min-h-[250px]"
              >
                {/* Glowing Node Dot */}
                <div className="absolute top-7 right-7 flex items-center justify-center">
                  <span className="w-3.5 h-3.5 rounded-full bg-crimson-glow shadow-[0_0_15px_#D4A843] group-hover:scale-125 transition-transform" />
                  <span className="absolute w-7 h-7 rounded-full border border-crimson-glow/40 animate-ping" />
                </div>

                <div>
                  {/* Phase Label & Icon */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 rounded-xl bg-crimson/10 border border-crimson/30 flex items-center justify-center text-crimson-glow group-hover:scale-110 group-hover:bg-crimson group-hover:text-black transition-all">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-mono uppercase tracking-widest text-crimson-glow block mb-0.5">
                        {item.phase}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-display font-bold text-white group-hover:text-crimson-glow transition-colors">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  {/* Dates Badge */}
                  <div className="flex items-center gap-2 text-sm sm:text-base font-mono font-semibold text-crimson-glow mb-4 bg-crimson/10 border border-crimson/20 px-3.5 py-1.5 rounded-lg w-fit">
                    <Calendar className="w-4 h-4 text-crimson-glow" />
                    <span>{item.date}</span>
                  </div>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-gray-300 font-sans leading-relaxed">
                    {item.description}
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
