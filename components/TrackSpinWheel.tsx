"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  Download,
  Shield,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  Zap,
  Cpu,
  Layers,
  FileText,
} from "lucide-react";

interface TrackSpinWheelProps {
  track: string;
  problemStatement: string;
  problemStatementFileUrl?: string;
  teamId: string;
  isTrackRevealed?: boolean;
  onReveal?: () => void;
}

// Optional futuristic quantum audio feedback via Web Audio API
function playQuantumSound(type: "hover" | "reveal") {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === "hover") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 note
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08); // A5
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === "reveal") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.4);
      osc.frequency.exponentialRampToValueAtTime(1174.66, ctx.currentTime + 0.7);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.75);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.75);
    }
  } catch (e) {
    // Graceful fallback
  }
}

export default function TrackSpinWheel({
  track,
  problemStatement,
  problemStatementFileUrl,
  teamId,
  isTrackRevealed = false,
  onReveal,
}: TrackSpinWheelProps) {
  const isFinanceTrack = track.toLowerCase().includes("fin") || track.toLowerCase().includes("finance");

  // Determine initial revealed state from prop or localStorage
  const checkInitialRevealed = () => {
    if (isTrackRevealed) return true;
    if (typeof window !== "undefined" && teamId) {
      const qVal = localStorage.getItem(`quantexa_track_revealed_${teamId}`);
      const nVal = localStorage.getItem(`nexora_track_revealed_${teamId}`);
      if (qVal === "true" || nVal === "true") return true;
    }
    return false;
  };

  // Local revealed state initialized from prop or localStorage
  const [revealed, setRevealed] = useState<boolean>(checkInitialRevealed);
  const [isRevealing, setIsRevealing] = useState<boolean>(false);
  const [selectedCard, setSelectedCard] = useState<"ALPHA" | "BETA" | null>(null);
  const [decryptStep, setDecryptStep] = useState<string>("INITIALIZING...");
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined" && teamId) {
      const isLocal =
        localStorage.getItem(`quantexa_track_revealed_${teamId}`) === "true" ||
        localStorage.getItem(`nexora_track_revealed_${teamId}`) === "true";

      if (isTrackRevealed || isLocal) {
        setRevealed(true);
        localStorage.setItem(`quantexa_track_revealed_${teamId}`, "true");

        // Self-heal: If local is revealed but server has not recorded it yet, update server DB in background
        if (isLocal && !isTrackRevealed) {
          fetch("/api/teams/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              teamId,
              isTrackRevealed: true,
            }),
          }).catch(() => {});
        }
      }
    } else if (isTrackRevealed) {
      setRevealed(true);
    }
  }, [teamId, isTrackRevealed]);

  // Handler for card selection
  const handleSelectCard = (card: "ALPHA" | "BETA") => {
    if (isRevealing || revealed) return;
    setSelectedCard(card);
    setIsRevealing(true);
    playQuantumSound("reveal");

    const steps = [
      "SYNCHRONIZING WITH QUANTUM REGISTER...",
      "COLLAPSING SUPERPOSITION PROBABILITY...",
      "DECRYPTING TRACK SPECIFICATIONS...",
      "OFFICIAL TRACK CONFIRMED!",
    ];

    steps.forEach((text, i) => {
      setTimeout(() => {
        setDecryptStep(text);
      }, i * 350);
    });

    setTimeout(async () => {
      setRevealed(true);
      setIsRevealing(false);

      if (typeof window !== "undefined" && teamId) {
        localStorage.setItem(`quantexa_track_revealed_${teamId}`, "true");
      }

      onReveal?.();

      // Persist to database in background
      try {
        await fetch("/api/teams/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            teamId,
            isTrackRevealed: true,
          }),
        });
      } catch (err) {
        // Fallback local persistence
      }
    }, 1500);
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-950/20 via-ink to-black relative overflow-hidden space-y-6">
      {/* Ambient background glow */}
      <div
        className={`absolute -top-24 -left-24 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
          revealed
            ? isFinanceTrack
              ? "bg-emerald-600/15"
              : "bg-amber-500/20"
            : "bg-amber-500/10"
        }`}
      />
      <div
        className={`absolute -bottom-24 -right-24 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
          revealed
            ? isFinanceTrack
              ? "bg-cyan-500/10"
              : "bg-orange-500/15"
            : "bg-cyan-500/10"
        }`}
      />

      {/* Header bar */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/10 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-950/80 border border-amber-500/40 text-amber-400 shadow-[0_0_15px_rgba(212,168,67,0.25)]">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-base text-white">
                Domain Track & Problem Statement
              </h3>
              {revealed && (
                <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-500/40 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Unlocked
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 font-mono">
              {revealed
                ? "Official assigned track and challenge brief"
                : "Interactive Quantum Track Selection Protocol"}
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!revealed ? (
          /* ========================================================================= */
          /* STAGE 1: 2 DYNAMIC MOVING CARDS (CONTINUOUS SWAPPING MOTION)             */
          /* ========================================================================= */
          <motion.div
            key="cards-selection-stage"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="py-4 space-y-6 relative z-10"
          >
            {/* Guide Instructions */}
            <div className="text-center space-y-1.5 max-w-xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-mono font-bold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                HACKHERE QUANTEXA TRACK ALLOCATION
              </div>
              <h4 className="font-display font-extrabold text-lg sm:text-xl text-white">
                Choose a Moving HackHere Card to Reveal Your Track
              </h4>
              <p className="text-xs text-gray-400 font-sans">
                Two official encrypted HackHere cards are dynamically orbiting in the arena. Select either card to reveal your team&apos;s challenge and problem statement.
              </p>
            </div>

            {/* Decrypting Overlay Banner (Shown during 1.5s selection) */}
            {isRevealing ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 rounded-3xl bg-black/80 border border-amber-500/60 shadow-[0_0_40px_rgba(212,168,67,0.3)] text-center space-y-4 max-w-lg mx-auto"
              >
                <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-amber-400/20 animate-ping" />
                  <div className="w-12 h-12 rounded-full border-2 border-amber-400 border-t-transparent animate-spin flex items-center justify-center">
                    <Zap className="w-5 h-5 text-amber-300" />
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-widest">
                    // DECRYPTION IN PROGRESS //
                  </span>
                  <h5 className="font-display font-bold text-white text-base">
                    {decryptStep}
                  </h5>
                  <p className="text-xs text-gray-400 font-mono">
                    Team: {teamId} • Quantum Node {selectedCard} Locked
                  </p>
                </div>
              </motion.div>
            ) : (
              /* THE DYNAMIC 2 MOVING CARDS ARENA */
              <div
                className="relative h-72 sm:h-80 w-full max-w-2xl mx-auto flex items-center justify-center overflow-visible"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {/* Visual Center Anchor / Orbital Field Ring */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-64 sm:w-80 h-28 sm:h-36 rounded-full border border-amber-500/20 border-dashed animate-[spin_20s_linear_infinite]" />
                  <div className="w-80 sm:w-96 h-36 sm:h-44 rounded-full border border-cyan-500/15 border-dotted animate-[spin_25s_linear_infinite_reverse]" />
                </div>

                {/* CARD 1: HACKHERE MYSTERY CARD 01 */}
                <motion.div
                  onClick={() => handleSelectCard("ALPHA")}
                  onMouseEnter={() => playQuantumSound("hover")}
                  animate={
                    isHovered
                      ? { x: -85, scale: 1.02, y: 0 }
                      : {
                          x: [-95, 95, -95],
                          y: [-8, 8, -8],
                          scale: [1.02, 0.96, 1.02],
                          zIndex: [20, 10, 20],
                        }
                  }
                  transition={{
                    duration: 4.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  whileHover={{
                    scale: 1.08,
                    zIndex: 40,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute cursor-pointer w-60 sm:w-72 h-72 sm:h-80 rounded-3xl p-6 bg-gradient-to-b from-[#14120B] via-[#100D08] to-black border-2 border-amber-500/40 hover:border-amber-400 shadow-[0_0_35px_rgba(212,168,67,0.25)] hover:shadow-[0_0_50px_rgba(212,168,67,0.5)] flex flex-col justify-between backdrop-blur-2xl group select-none transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-[10px] font-mono font-bold tracking-wider uppercase">
                      HACKHERE // 01
                    </span>
                    <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
                  </div>

                  {/* HackHere Official Logo in Center */}
                  <div className="text-center space-y-2 py-2">
                    <div className="relative w-44 sm:w-52 h-24 sm:h-28 mx-auto flex items-center justify-center">
                      <div className="absolute inset-0 bg-amber-500/10 rounded-2xl blur-xl group-hover:bg-amber-500/20 transition-all duration-300" />
                      <img
                        src="/images/hackhere-card-logo.png"
                        alt="HackHere Logo"
                        className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_20px_rgba(212,168,67,0.35)] group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div>
                      <h5 className="font-display font-black text-xs sm:text-sm text-white tracking-widest uppercase group-hover:text-amber-300 transition-colors">
                        QUANTEXA 2026
                      </h5>
                      <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                        Official Track Deck
                      </span>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-amber-500/20 flex items-center justify-center">
                    <span className="text-[11px] font-mono font-bold text-amber-300 group-hover:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> Click to Reveal Track
                    </span>
                  </div>
                </motion.div>

                {/* CARD 2: HACKHERE MYSTERY CARD 02 */}
                <motion.div
                  onClick={() => handleSelectCard("BETA")}
                  onMouseEnter={() => playQuantumSound("hover")}
                  animate={
                    isHovered
                      ? { x: 85, scale: 1.02, y: 0 }
                      : {
                          x: [95, -95, 95],
                          y: [8, -8, 8],
                          scale: [0.96, 1.02, 0.96],
                          zIndex: [10, 20, 10],
                        }
                  }
                  transition={{
                    duration: 4.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  whileHover={{
                    scale: 1.08,
                    zIndex: 40,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute cursor-pointer w-60 sm:w-72 h-72 sm:h-80 rounded-3xl p-6 bg-gradient-to-b from-[#14120B] via-[#100D08] to-black border-2 border-amber-500/40 hover:border-amber-400 shadow-[0_0_35px_rgba(212,168,67,0.25)] hover:shadow-[0_0_50px_rgba(212,168,67,0.5)] flex flex-col justify-between backdrop-blur-2xl group select-none transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-[10px] font-mono font-bold tracking-wider uppercase">
                      HACKHERE // 02
                    </span>
                    <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
                  </div>

                  {/* HackHere Official Logo in Center */}
                  <div className="text-center space-y-2 py-2">
                    <div className="relative w-44 sm:w-52 h-24 sm:h-28 mx-auto flex items-center justify-center">
                      <div className="absolute inset-0 bg-amber-500/10 rounded-2xl blur-xl group-hover:bg-amber-500/20 transition-all duration-300" />
                      <img
                        src="/images/hackhere-card-logo.png"
                        alt="HackHere Logo"
                        className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_20px_rgba(212,168,67,0.35)] group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div>
                      <h5 className="font-display font-black text-xs sm:text-sm text-white tracking-widest uppercase group-hover:text-amber-300 transition-colors">
                        QUANTEXA 2026
                      </h5>
                      <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                        Official Track Deck
                      </span>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-amber-500/20 flex items-center justify-center">
                    <span className="text-[11px] font-mono font-bold text-amber-300 group-hover:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> Click to Reveal Track
                    </span>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        ) : (
          /* ========================================================================= */
          /* STAGE 2: REVEALED OFFICIAL TRACK & PROBLEM STATEMENT                     */
          /* ========================================================================= */
          <motion.div
            key="revealed-stage"
            initial={{ opacity: 0, y: 15, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-6 relative z-10"
          >
            {/* Domain Track Banner */}
            <div
              className={`p-6 rounded-3xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden ${
                isFinanceTrack
                  ? "bg-gradient-to-r from-emerald-950/40 via-[#0A1A14] to-black border-emerald-500/50 shadow-[0_0_35px_rgba(16,185,129,0.25)]"
                  : "bg-gradient-to-r from-amber-950/40 via-[#1C1406] to-black border-amber-500/50 shadow-[0_0_35px_rgba(212,168,67,0.3)]"
              }`}
            >
              {/* Inner ambient shine */}
              <div
                className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
                  isFinanceTrack ? "bg-emerald-500/10" : "bg-amber-500/15"
                }`}
              />

              <div className="flex items-start sm:items-center gap-4 relative z-10">
                <div
                  className={`p-4 rounded-2xl border shrink-0 ${
                    isFinanceTrack
                      ? "bg-emerald-900/60 border-emerald-400 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                      : "bg-amber-900/60 border-amber-400 text-amber-300 shadow-[0_0_20px_rgba(212,168,67,0.35)]"
                  }`}
                >
                  {isFinanceTrack ? (
                    <TrendingUp className="w-9 h-9" />
                  ) : (
                    <Shield className="w-9 h-9" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono uppercase tracking-widest font-bold px-2 py-0.5 rounded-full border ${
                        isFinanceTrack
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      }`}
                    >
                      // OFFICIAL ASSIGNED TRACK
                    </span>
                    <span className="text-[10px] font-mono text-gray-400">
                      Team {teamId}
                    </span>
                  </div>

                  <h4
                    className={`font-display font-black text-2xl sm:text-3xl uppercase tracking-wide ${
                      isFinanceTrack
                        ? "text-emerald-300"
                        : "bg-gradient-to-r from-white via-[#F0C755] to-[#D4A843] bg-clip-text text-transparent"
                    }`}
                  >
                    {track}
                  </h4>

                  <p className="text-xs font-mono text-gray-300 max-w-xl">
                    Your team is officially assigned to build an innovative solution for the{" "}
                    <strong className={isFinanceTrack ? "text-emerald-300" : "text-amber-300"}>
                      {track}
                    </strong>{" "}
                    domain.
                  </p>
                </div>
              </div>

              {problemStatementFileUrl && (
                <a
                  href={problemStatementFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-6 py-3.5 rounded-xl font-display font-extrabold text-xs uppercase flex items-center gap-2.5 shrink-0 transition-all shadow-lg relative z-10 ${
                    isFinanceTrack
                      ? "bg-gradient-to-r from-emerald-400 to-teal-500 hover:brightness-110 text-black shadow-[0_0_25px_rgba(16,185,129,0.4)]"
                      : "bg-gradient-to-r from-amber-400 via-[#F0C755] to-amber-500 hover:brightness-110 text-black shadow-[0_0_25px_rgba(212,168,67,0.45)]"
                  }`}
                >
                  <Download className="w-4 h-4" />
                  <span>Download Problem PDF</span>
                </a>
              )}
            </div>

            {/* Problem Statement Details Brief */}
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 font-mono text-xs space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-[11px] text-amber-400 tracking-wider uppercase font-bold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  // PROBLEM STATEMENT CHALLENGE SPECIFICATION
                </span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Track Locked
                </span>
              </div>

              <div className="space-y-3 font-sans">
                <h5 className="text-white text-base sm:text-lg font-bold">
                  {isFinanceTrack
                    ? "Quantitative Multi-Asset Financial Intelligence & Backtesting Platform"
                    : "Quantum-Enhanced Adaptive Urban Traffic Optimization"}
                </h5>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {problemStatement}
                </p>

                {/* Key Technical Deliverables Pills */}
                <div className="pt-2">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-2 font-bold">
                    Key Evaluation Focus Areas:
                  </span>
                  <div className="flex flex-wrap gap-2 text-xs font-mono">
                    {isFinanceTrack ? (
                      <>
                        <span className="px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
                          Multi-Asset Market Data (Gold, BTC, NVDA)
                        </span>
                        <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300">
                          Quantitative Indicators (SMA, EMA, Sharpe, Drawdown)
                        </span>
                        <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300">
                          Cross-Asset Correlation Matrix
                        </span>
                        <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300">
                          Strategy Backtesting Engine & Dashboard
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="px-3 py-1 rounded-lg bg-amber-950/60 border border-amber-500/30 text-amber-300">
                          Hybrid Quantum-Classical Optimization
                        </span>
                        <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300">
                          Multi-Intersection Traffic Signal Management
                        </span>
                        <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300">
                          Emergency Vehicle Green Corridor Routing
                        </span>
                        <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300">
                          Emissions & Fuel Reduction Simulation
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
