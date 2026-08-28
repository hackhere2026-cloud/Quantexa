"use client";

import { motion } from "framer-motion";
import { Terminal, Download, Shield, HeartPulse, CheckCircle2 } from "lucide-react";

interface TrackSpinWheelProps {
  track: string;
  problemStatement: string;
  problemStatementFileUrl?: string;
  teamId: string;
}

export default function TrackSpinWheel({
  track,
  problemStatement,
  problemStatementFileUrl,
}: TrackSpinWheelProps) {
  const isCyberTrack = track.toLowerCase().includes("cyber");

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 bg-black/60 relative overflow-hidden space-y-6">
      {/* Ambient background glow */}
      <div className={`absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl pointer-events-none ${
        isCyberTrack ? "bg-purple-600/15" : "bg-emerald-600/15"
      }`} />

      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-950/80 border border-amber-500/40 text-amber-400">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
              Domain Track & Problem Statement
            </h3>
            <p className="text-xs text-gray-400 font-mono">
              Assigned domain track & challenge statement
            </p>
          </div>
        </div>
      </div>

      {/* Revealed Track Card */}
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="space-y-6"
      >
        {/* Domain Track Banner */}
        <div className={`p-6 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
          isCyberTrack
            ? "bg-purple-950/40 border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.2)]"
            : "bg-emerald-950/40 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
        }`}>
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className={`p-3.5 rounded-2xl border shrink-0 ${
              isCyberTrack
                ? "bg-purple-900/60 border-purple-400 text-purple-300"
                : "bg-emerald-900/60 border-emerald-400 text-emerald-300"
            }`}>
              {isCyberTrack ? <Shield className="w-8 h-8" /> : <HeartPulse className="w-8 h-8" />}
            </div>
            <div>
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">// OFFICIAL ASSIGNED TRACK</span>
              <h4 className={`font-display font-black text-2xl uppercase tracking-wide ${
                isCyberTrack ? "text-purple-300" : "text-emerald-300"
              }`}>
                {track}
              </h4>
              <p className="text-xs font-mono text-gray-300 mt-0.5">
                Your team is assigned to build an innovative solution in the <strong>{track}</strong> domain.
              </p>
            </div>
          </div>

          {problemStatementFileUrl && (
            <a
              href={problemStatementFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-display font-bold text-xs uppercase flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.5)] shrink-0 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Problem PDF</span>
            </a>
          )}
        </div>

        {/* Problem Statement Details */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 font-mono text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-amber-400 tracking-wider uppercase">// PROBLEM STATEMENT BRIEF</span>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Track Assigned
            </span>
          </div>
          <p className="text-gray-200 font-sans text-sm font-semibold leading-relaxed pt-1">
            {problemStatement}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
