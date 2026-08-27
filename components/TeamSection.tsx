"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { teamMembers, TeamMember } from "@/data/event";
import { Linkedin, Users } from "lucide-react";

export default function TeamSection() {
  return (
    <section id="team" className="py-24 relative bg-ink border-t border-white/5 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-crimson/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-crimson-glow flex items-center justify-center gap-2">
            <Users className="w-4 h-4 text-crimson-glow" />
            <span>[ 06 // MEET TEAM HACKHERE ]</span>
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-bold mt-2 mb-4">
            MEET TEAM <span className="metal-gradient">HACKHERE</span>
          </h2>
          <p className="text-gray-400 font-sans text-base sm:text-lg">
            The visionary leads and operational orchestrators driving HackHere and Quantexa 2026.
          </p>
        </motion.div>

        {/* 4 Vertical Rectangle Cards Side-by-Side Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {teamMembers.map((member: TeamMember, idx: number) => {
            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass-panel rounded-3xl p-5 border border-white/15 hover:border-crimson hover:shadow-[0_0_30px_rgba(0,229,255,0.25)] transition-all duration-300 flex flex-col justify-between overflow-hidden group relative"
              >
                {/* Glowing Top Accent Bar */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-crimson to-crimson-dark group-hover:h-2 transition-all duration-300" />

                {/* Standardized Vertical Portrait Photo Frame */}
                <div className="relative w-full aspect-[4/5] bg-black/60 rounded-2xl overflow-hidden border border-crimson/40 mb-4 group-hover:border-crimson transition-colors shadow-[0_0_20px_rgba(0,229,255,0.15)]">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-ink/90 to-transparent pointer-events-none" />
                </div>

                {/* Card Details: Name & Designation */}
                <div className="flex flex-col flex-grow justify-between space-y-4">
                  <div className="text-left space-y-1 min-w-0">
                    <h3
                      className="text-lg xl:text-xl font-display font-extrabold text-white group-hover:text-crimson-glow transition-colors truncate whitespace-nowrap"
                      title={member.name}
                    >
                      {member.name}
                    </h3>
                    <p className="text-xs sm:text-sm font-mono font-bold text-crimson-glow tracking-wide uppercase">
                      {member.role}
                    </p>
                  </div>

                  {/* LinkedIn Action Link */}
                  {member.linkedin && (
                    <div className="pt-3 border-t border-white/10 mt-auto">
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-crimson/20 border border-white/15 hover:border-crimson/60 text-gray-300 hover:text-crimson-glow font-display text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(0,229,255,0.1)]"
                      >
                        <Linkedin className="w-4 h-4 text-crimson-glow" />
                        <span>CONNECT ON LINKEDIN</span>
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
