"use client";

import Image from "next/image";
import { sponsors } from "@/data/event";
import { Award } from "lucide-react";

export default function MobileSponsorsMarquee() {
  const marqueeSponsors = [...sponsors, ...sponsors, ...sponsors];

  return (
    <section id="sponsors" className="py-16 bg-ink/95 relative z-10 border-t border-amber-500/20 overflow-hidden">
      <div className="max-w-md mx-auto px-4 text-center space-y-6 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/30 text-amber-400 text-[10px] font-mono uppercase tracking-widest">
          <Award className="w-3 h-3 text-amber-400" />
          <span>OUR SPONSORS & PARTNERS</span>
        </div>
        <h2 className="text-2xl font-display font-extrabold text-white">
          POWERED BY <span className="text-amber-400">INDUSTRY LEADERS</span>
        </h2>
      </div>

      {/* Infinite Horizontal Scroll Track */}
      <div className="relative w-full overflow-hidden py-4 bg-amber-950/20 border-y border-amber-500/30">
        <div className="flex w-max animate-marquee space-x-6">
          {marqueeSponsors.map((sponsor, idx) => (
            <div
              key={`${sponsor.name}-${idx}`}
              className="flex-shrink-0 w-36 h-20 relative bg-white/5 border border-amber-500/30 rounded-xl p-3 flex items-center justify-center backdrop-blur-sm"
            >
              <Image
                src={sponsor.logoPath}
                alt={sponsor.name}
                fill
                className="object-contain p-2 filter brightness-110"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
