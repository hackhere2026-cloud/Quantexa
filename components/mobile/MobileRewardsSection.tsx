"use client";

import { motion } from "framer-motion";
import { Trophy, Briefcase, ShieldCheck, Cpu, Sparkles, BookOpen, Award } from "lucide-react";

export default function MobileRewardsSection() {
  return (
    <section id="rewards" className="py-16 px-4 bg-ink relative z-10 border-t border-amber-500/20">
      <div className="max-w-md mx-auto space-y-8">
        
        {/* Section Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-400 text-[10px] font-mono uppercase tracking-widest">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>PRIZES & PERKS</span>
          </div>
          <h2 className="text-2xl font-display font-extrabold text-white">
            REWARDS & <span className="text-amber-400">PERKS</span>
          </h2>
          <p className="text-xs text-gray-300">
            Win cash awards, internships, Web3 certs & technical blockchain bootcamp.
          </p>
        </div>

        {/* Featured Cash Pool Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="p-6 rounded-3xl bg-gradient-to-b from-amber-950/90 via-ink to-black border border-amber-500/50 space-y-4 shadow-[0_0_30px_rgba(251,191,36,0.2)] text-center relative overflow-hidden"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.3)]">
            <Trophy className="w-10 h-10 text-amber-400" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
              TOTAL CASH POOL
            </span>
            <h3 className="text-3xl font-display font-black text-white">
              ₹30,000
            </h3>
            <p className="text-xs text-gray-300 font-sans leading-relaxed pt-1">
              Distributed among Winner, Runner-Up, and Domain Bounties at SNS IHUB, Coimbatore.
            </p>
          </div>
        </motion.div>

        {/* 4 Mobile Perks Cards */}
        <div className="space-y-4">
          
          {/* Internships */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Briefcase className="w-5 h-5 text-amber-400" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-display font-bold text-white">
                Direct Internship Offers
              </h4>
              <p className="text-xs text-gray-300 font-sans">
                Fast-track interview pipelines with hiring partners including ELRO Tech, Rezilyens & Pronoia IMF.
              </p>
            </div>
          </motion.div>

          {/* Hedera Cert */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5 text-purple-400" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-display font-bold text-white">
                Hedera Web3 Certification
              </h4>
              <p className="text-xs text-gray-300 font-sans">
                Official Hedera Blockchain Developer credentials for top Web3 and decentralized app builders.
              </p>
            </div>
          </motion.div>

          {/* Technical Bootcamp on Blockchain */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
              <BookOpen className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-display font-bold text-white">
                Technical Bootcamp on Blockchain
              </h4>
              <p className="text-xs text-gray-300 font-sans">
                Hands-on technical bootcamp covering blockchain architecture, smart contracts, and Web3 development.
              </p>
            </div>
          </motion.div>

          {/* Featherless AI Credits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Cpu className="w-5 h-5 text-rose-400" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-display font-bold text-white">
                Featherless AI Credits & Inference
              </h4>
              <p className="text-xs text-gray-300 font-sans">
                All participants receive $25 AI credits, 1 month of inference access & 40+ AI models. Winning team gets $300 Featherless AI credits.
              </p>
            </div>
          </motion.div>

          {/* Physical Participation Certificate */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-display font-bold text-white">
                Physical Participation Certificate
              </h4>
              <p className="text-xs text-gray-300 font-sans">
                Official physical certificates of participation awarded to all hackathon builders.
              </p>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
