import { motion } from "framer-motion";
import Image from "next/image";
import { juries, JuryMember } from "@/data/event";
import { Linkedin, ShieldCheck, Lock, Crown, Sparkles } from "lucide-react";

export default function JuriesSection() {
  const juryMembers = juries;

  const renderJuryCard = (person: JuryMember) => {
    if (person.isLocked) {
      return (
        <div className="glass-panel rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/20 via-ink to-black flex flex-col sm:flex-row overflow-hidden relative group">
          {/* Lock Avatar Frame */}
          <div className="relative w-full sm:w-40 h-44 sm:h-auto bg-black/80 overflow-hidden flex flex-col items-center justify-center p-3 shrink-0 border-r border-amber-500/20">
            <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-2 group-hover:scale-110 transition-transform">
              <Lock className="w-6 h-6 animate-pulse" />
            </div>
            <span className="text-[10px] font-mono font-bold text-amber-400/90 tracking-widest uppercase">
              LOCKED SLOT
            </span>
          </div>

          {/* Body Content */}
          <div className="p-4 flex flex-col justify-between flex-grow bg-ink/95 space-y-3">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono uppercase tracking-wider">
                <Lock className="w-3 h-3" />
                <span>TO BE REVEALED SOON</span>
              </div>
              <h3 className="text-base font-display font-bold text-gray-200">
                {person.name}
              </h3>
              <p className="text-xs font-mono font-semibold text-amber-400/90">
                {person.role}
              </p>
              <p className="text-[11px] text-gray-400 font-sans">
                {person.company}
              </p>
              <p className="text-xs text-gray-400 font-sans leading-relaxed pt-1 italic">
                {person.bio}
              </p>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                // ANNOUNCEMENT PENDING
              </span>
              <span className="text-[10px] font-mono font-bold text-amber-400/80 px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/30">
                REVEALING SOON
              </span>
            </div>
          </div>
        </div>
      );
    }

    // Golden Main Jury Card
    if (person.isMain) {
      return (
        <div className="glass-panel rounded-2xl border-2 border-amber-400/80 hover:border-amber-300 shadow-[0_0_35px_rgba(245,197,66,0.35)] hover:shadow-[0_0_55px_rgba(245,197,66,0.55)] bg-gradient-to-r from-amber-950/50 via-[#151107] to-black flex flex-col sm:flex-row overflow-hidden group relative transition-all duration-300">
          {/* Subtle decorative radial golden glow */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Photo Frame */}
          <div className="relative w-full sm:w-48 h-56 sm:h-auto bg-gradient-to-b from-black/80 to-amber-950/40 overflow-hidden flex items-center justify-center p-3 shrink-0">
            <div className="relative w-full h-full rounded-xl overflow-hidden border-2 border-amber-400/80 shadow-[0_0_20px_rgba(245,197,66,0.35)]">
              <Image
                src={person.image}
                alt={person.name}
                fill
                className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Body Content */}
          <div className="p-5 flex flex-col justify-between flex-grow bg-ink/90 backdrop-blur-sm space-y-3 relative z-10">
            <div className="space-y-2">
              {/* Top Chief Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500/25 via-amber-400/20 to-amber-500/25 border border-amber-400/60 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-widest shadow-[0_0_12px_rgba(245,197,66,0.2)]">
                <Crown className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>{person.badge || "CHIEF JURY & EVALUATOR"}</span>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-display font-extrabold text-white group-hover:text-amber-300 transition-colors tracking-wide">
                  {person.name}
                </h3>
                {person.degrees && (
                  <p className="text-xs font-mono font-semibold text-amber-400 tracking-wide mt-0.5">
                    {person.degrees}
                  </p>
                )}
              </div>

              <div className="pt-0.5">
                <p className="text-xs sm:text-sm font-mono font-bold text-amber-300 tracking-wide uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{person.role}</span>
                </p>
                <p className="text-xs text-gray-300 font-sans font-medium pt-0.5">
                  {person.company}
                </p>
              </div>

              <p className="text-xs text-gray-300/90 font-sans leading-relaxed pt-1">
                {person.bio}
              </p>
            </div>

            <div className="pt-3 border-t border-amber-500/25 flex items-center justify-between">
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                // CHIEF EVALUATOR
              </span>
              {person.linkedin ? (
                <a
                  href={person.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-950/90 border border-amber-500/60 text-amber-300 hover:text-white hover:bg-amber-400 hover:text-black transition-all text-xs font-mono font-bold shadow-[0_0_12px_rgba(245,197,66,0.2)]"
                  aria-label={`${person.name} LinkedIn`}
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                </a>
              ) : (
                <span className="text-[10px] font-mono font-extrabold text-amber-300 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-500/20 border border-amber-400/60 shadow-[0_0_15px_rgba(245,197,66,0.3)]">
                  MAIN JURY
                </span>
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="glass-panel rounded-2xl border border-amber-500/40 hover:border-amber-400 hover:shadow-[0_0_25px_rgba(212,168,67,0.25)] bg-gradient-to-r from-amber-950/30 via-ink to-black flex flex-col sm:flex-row overflow-hidden group relative">
        {/* Photo Frame */}
        <div className="relative w-full sm:w-40 h-44 sm:h-auto bg-black/70 overflow-hidden flex items-center justify-center p-2.5 shrink-0">
          <div className="relative w-full h-full rounded-xl overflow-hidden border border-amber-400/40 shadow-[0_0_15px_rgba(212,168,67,0.2)]">
            <Image
              src={person.image}
              alt={person.name}
              fill
              className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Body Content */}
        <div className="p-4 flex flex-col justify-between flex-grow bg-ink/95 space-y-2">
          <div className="space-y-1">
            <h3 className="text-base font-display font-bold text-white group-hover:text-amber-400 transition-colors">
              {person.name}
            </h3>
            {person.degrees && (
              <p className="text-[11px] font-mono font-semibold text-amber-400/90">
                {person.degrees}
              </p>
            )}
            <p className="text-xs font-mono font-semibold text-amber-400 whitespace-pre-line leading-relaxed">
              {person.role}
            </p>
            <p className="text-[11px] text-gray-400 font-sans">
              {person.company}
            </p>
            <p className="text-xs text-gray-300 font-sans leading-relaxed pt-1">
              {person.bio}
            </p>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
              {person.badge ? `// ${person.badge.toUpperCase()}` : "// OFFICIAL JURY"}
            </span>
            {person.linkedin ? (
              <a
                href={person.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-950/80 border border-amber-500/40 text-amber-300 hover:text-white transition-all text-xs font-mono"
                aria-label={`${person.name} LinkedIn`}
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </a>
            ) : (
              <span className="text-[10px] font-mono text-amber-400/80 px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/30">
                {person.badge || "EVALUATOR"}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="juries" className="py-16 sm:py-20 relative bg-ink border-t border-white/5 overflow-hidden">
      {/* Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[#D4A843]/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto space-y-2"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-crimson-glow">
            [ 02 // EXPERT EVALUATORS ]
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold">
            EXPERT <span className="metal-gradient">JURY PANEL</span>
          </h2>
          <p className="text-gray-400 font-sans text-xs sm:text-sm">
            Distinguished industry leaders and mentor evaluators.
          </p>
        </motion.div>

        {/* ================= JURY PANEL ================= */}
        <div className="space-y-5">
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-500/50" />
            <span className="px-3.5 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-400 font-mono text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 shadow-[0_0_15px_rgba(212,168,67,0.15)]">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>EXPERT JURY PANEL</span>
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-500/50" />
          </div>

          <div className="space-y-6 max-w-5xl mx-auto">
            {/* First Row: Top Jury / Judge 01 (Centered) */}
            {juryMembers.length > 0 && (() => {
              const person = juryMembers[0];
              return (
                <div className="max-w-2xl mx-auto">
                  <motion.div
                    key={person.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    whileHover={{ y: -4, scale: 1.01 }}
                  >
                    {renderJuryCard(person)}
                  </motion.div>
                </div>
              );
            })()}

            {/* Second Row: Remaining Juries (Judge 02 & Judge 03) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {juryMembers.slice(1).map((person: JuryMember, idx: number) => (
                <motion.div
                  key={person.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (idx + 1) * 0.1 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                >
                  {renderJuryCard(person)}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
