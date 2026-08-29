"use client";

import { motion } from "framer-motion";
import { Trophy, Award, Briefcase, ShieldCheck, Sparkles, Cpu, BookOpen } from "lucide-react";

export interface RewardItem {
  id: string;
  icon: any;
  title: string;
  badge: string;
  highlight: string;
  description: string;
  color: string;
}

const rewardCards: RewardItem[] = [
  {
    id: "cash-prize",
    icon: Trophy,
    title: "₹30,000 CASH PRIZE POOL",
    badge: "MAIN POOL",
    highlight: "₹30,000",
    description: "Grand cash awards distributed across Overall Champion, Runner-up, and Track Bounties for top innovation.",
    color: "from-amber-500/20 via-crimson/20 to-amber-500/10 border-amber-500/40 text-amber-400",
  },
  {
    id: "internships",
    icon: Briefcase,
    title: "DIRECT INTERNSHIP OFFERS",
    badge: "CAREER FAST-TRACK",
    highlight: "INTERNSHIPS",
    description: "Exclusive fast-track hiring pipelines and internship opportunities with leading partner tech firms.",
    color: "from-amber-500/20 via-blue-600/20 to-amber-500/10 border-amber-400/40 text-amber-400",
  },
  {
    id: "hedera-cert",
    icon: ShieldCheck,
    title: "HEDERA WEB3 CERTIFICATION",
    badge: "BLOCKCHAIN CREDENTIAL",
    highlight: "CERTIFIED",
    description: "Official Hedera Blockchain Developer Certifications and Web3 credential badges for top performing builders.",
    color: "from-purple-500/20 via-indigo-600/20 to-purple-500/10 border-purple-400/40 text-purple-400",
  },
  {
    id: "blockchain-bootcamp",
    icon: BookOpen,
    title: "TECHNICAL BOOTCAMP ON BLOCKCHAIN",
    badge: "WEB3 TRAINING",
    highlight: "BOOTCAMP",
    description: "Hands-on technical bootcamp covering blockchain architecture, smart contracts, and Web3 development.",
    color: "from-emerald-500/20 via-teal-600/20 to-emerald-500/10 border-emerald-400/40 text-emerald-400",
  },
  {
    id: "ai-credits",
    icon: Cpu,
    title: "FEATHERLESS AI CREDITS & INFERENCE",
    badge: "AI COMPUTING",
    highlight: "$325 AI CREDITS",
    description: "All participants receive $25 AI credits, 1-month inference & 40+ models. Winning team additionally gets $300 Featherless AI credits.",
    color: "from-rose-500/20 via-pink-600/20 to-rose-500/10 border-rose-400/40 text-rose-400",
  },
  {
    id: "physical-cert",
    icon: Award,
    title: "PHYSICAL PARTICIPATION CERTIFICATE",
    badge: "ALL PARTICIPANTS",
    highlight: "CERTIFICATES",
    description: "Official physical certificates of participation awarded to all hackathon builders.",
    color: "from-amber-500/20 via-orange-600/20 to-amber-500/10 border-amber-400/40 text-amber-400",
  },
];

export default function RewardsSection() {
  return (
    <section id="rewards" className="py-24 relative bg-ink border-t border-white/5 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-crimson/10 rounded-full blur-[200px] pointer-events-none" />

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
            <Trophy className="w-4 h-4 text-crimson-glow" />
            <span>[ 04 // PRIZES & PERKS ]</span>
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-bold mt-2 mb-4">
            REWARDS & <span className="metal-gradient">PERKS</span>
          </h2>
          <p className="text-gray-400 font-sans text-base sm:text-lg">
            Unlock ₹30K cash pool, direct internships, Hedera certifications, Featherless AI credits, and physical certificates.
          </p>
        </motion.div>

        {/* Featured Grand Cash Prize Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl p-8 sm:p-10 bg-gradient-to-r from-amber-950/60 via-crimson/20 to-black/80 border border-amber-500/40 shadow-[0_0_50px_rgba(251,191,36,0.15)] mb-8 overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            <div className="space-y-4 max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold uppercase tracking-widest">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>GRAND PRIZE POOL</span>
              </div>
              <h3 className="text-4xl sm:text-6xl font-display font-black text-white tracking-tight">
                ₹30,000 <span className="text-amber-400 font-sans">CASH POOL</span>
              </h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Compete live at SNS IHUB, Coimbatore during the continuous 24-hour sprint. Winners receive direct cash rewards, trophy awards, and exclusive domain bounty prizes!
              </p>
            </div>

            <div className="flex-shrink-0 relative">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center shadow-[0_0_40px_rgba(251,191,36,0.3)] group-hover:scale-105 transition-transform duration-500">
                <Trophy className="w-20 h-20 text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* 5 Supporting Perks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {rewardCards.slice(1).map((reward, idx) => {
            const IconComponent = reward.icon;
            return (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className={`glass-panel rounded-3xl p-6 border bg-gradient-to-b ${reward.color} transition-all duration-300 flex flex-col justify-between overflow-hidden group relative shadow-lg`}
              >
                <div className="space-y-4">
                  {/* Icon & Badge */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-crimson transition-colors">
                      <IconComponent className={`w-6 h-6 ${reward.color.split(' ').pop()}`} />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono font-bold tracking-widest text-gray-300 uppercase">
                      {reward.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h4 className="text-lg font-display font-bold text-white group-hover:text-crimson-glow transition-colors">
                      {reward.title}
                    </h4>
                    <p className="text-xs text-gray-300 leading-relaxed font-sans">
                      {reward.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
