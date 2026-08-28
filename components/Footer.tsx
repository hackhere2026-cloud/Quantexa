import { event, sponsors } from "@/data/event";
import Image from "next/image";
import { Github, Twitter, Disc as Discord, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-ink border-t border-white/10 pt-16 pb-12 text-gray-400 font-sans text-sm relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-crimson/40 bg-white/5 flex items-center justify-center">
                <Image
                  src="/images/hackhere-logo.jpeg"
                  alt="Quantexa Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Presented by <strong className="text-white">{event.presentedBy}</strong>. 24-Hour hackathon building the next era of Quantum Technology algorithms and Finance Technology telemetry.
            </p>
            <div className="flex items-center space-x-3 text-gray-400">
              <a href="#" className="hover:text-crimson-glow transition-colors p-2 bg-white/5 rounded-full hover:bg-white/10">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-crimson-glow transition-colors p-2 bg-white/5 rounded-full hover:bg-white/10">
                <Discord className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-crimson-glow transition-colors p-2 bg-white/5 rounded-full hover:bg-white/10">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-crimson-glow transition-colors p-2 bg-white/5 rounded-full hover:bg-white/10">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Event Info Column */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-white mb-4">
              EVENT DETAILS
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-gray-500">Location:</span>{" "}
                <a
                  href={event.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 font-semibold hover:text-crimson-glow transition-colors underline underline-offset-2"
                >
                  {event.venue}, {event.city} ↗
                </a>
              </li>
              <li>
                <span className="text-gray-500">Dates:</span>{" "}
                <span className="text-gray-300 font-semibold">{event.dateRange}, 2026</span>
              </li>
              <li>
                <span className="text-gray-500">Duration:</span>{" "}
                <span className="text-gray-300 font-semibold">24-Hour Non-Stop Hackathon</span>
              </li>
              <li>
                <span className="text-gray-500">Prizes & Perks:</span>{" "}
                <span className="text-gray-300 font-semibold">₹30K Pool, Internships & Mentoring</span>
              </li>
            </ul>
          </div>

          {/* Key Links */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-white mb-4">
              QUICK NAVIGATION
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#about" className="hover:text-crimson-glow transition-colors">
                  About Hackathon
                </a>
              </li>
              <li>
                <a href="#tracks" className="hover:text-crimson-glow transition-colors">
                  Challenge Tracks
                </a>
              </li>
              <li>
                <a href="#schedule" className="hover:text-crimson-glow transition-colors">
                  Run of Show Schedule
                </a>
              </li>
              <li>
                <a href="#sponsors" className="hover:text-crimson-glow transition-colors">
                  Sponsors & Partners
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-crimson-glow transition-colors">
                  FAQ & Support
                </a>
              </li>
            </ul>
          </div>

          {/* Partners Mini Grid */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-white mb-4">
              PARTNERS
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {sponsors.slice(0, 6).map((sponsor, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 border border-white/10 rounded-lg p-2 flex items-center justify-center h-10 hover:border-crimson/40 transition-colors"
                >
                  <div className="relative w-full h-full grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all">
                    <Image
                      src={sponsor.logoPath}
                      alt={sponsor.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <div>
            © 2026 {event.name} by {event.presentedBy}. All rights reserved.
          </div>
          <div className="flex items-center space-x-6">
            <a href="#" className="hover:text-gray-400 transition-colors">
              Privacy Matrix
            </a>
            <a href="#" className="hover:text-gray-400 transition-colors">
              Code of Conduct
            </a>
            <a href="#" className="hover:text-gray-400 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
