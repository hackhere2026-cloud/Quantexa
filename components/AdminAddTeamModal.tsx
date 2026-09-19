"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Plus,
  Server,
  User,
  Phone,
  Mail,
  Shield,
  Layers,
  FileText,
  Github,
  RefreshCw,
} from "lucide-react";
import { TeamMember } from "./AdminEditTeamModal";

interface AdminAddTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (teamData: any) => Promise<void>;
  isSubmitting: boolean;
  suggestedId: string;
}

export default function AdminAddTeamModal({
  isOpen,
  onClose,
  onAdd,
  isSubmitting,
  suggestedId,
}: AdminAddTeamModalProps) {
  const [teamId, setTeamId] = useState(suggestedId);
  const [name, setName] = useState("");
  const [passcode, setPasscode] = useState("");
  const [track, setTrack] = useState("FinTech Track");
  const [isTrackRevealed, setIsTrackRevealed] = useState(false);
  const [leaderName, setLeaderName] = useState("");
  const [leaderPhone, setLeaderPhone] = useState("");
  const [leaderEmail, setLeaderEmail] = useState("");
  const [member2Name, setMember2Name] = useState("");
  const [member2Phone, setMember2Phone] = useState("");
  const [member3Name, setMember3Name] = useState("");
  const [member3Phone, setMember3Phone] = useState("");
  const [member4Name, setMember4Name] = useState("");
  const [member4Phone, setMember4Phone] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [gitRepoUrl, setGitRepoUrl] = useState("");
  const [projectFileUrl, setProjectFileUrl] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const memberList: TeamMember[] = [
      {
        name: leaderName || "Team Leader",
        role: "Team Lead",
        phone: leaderPhone,
        email: leaderEmail,
      },
    ];

    if (member2Name.trim()) {
      memberList.push({ name: member2Name.trim(), role: "Member 1", phone: member2Phone.trim() });
    }
    if (member3Name.trim()) {
      memberList.push({ name: member3Name.trim(), role: "Member 2", phone: member3Phone.trim() });
    }
    if (member4Name.trim()) {
      memberList.push({ name: member4Name.trim(), role: "Member 3", phone: member4Phone.trim() });
    }

    const teamPayload = {
      id: teamId.trim() || suggestedId,
      name: name.trim(),
      passcode: passcode.trim() || leaderPhone.trim() || "pass123",
      track,
      isTrackRevealed,
      leaderName: leaderName.trim() || "Team Leader",
      leaderPhone: leaderPhone.trim(),
      leaderEmail: leaderEmail.trim(),
      membersCount: memberList.length,
      memberList,
      problemStatement: problemStatement.trim() || "Problem Statement assigned for Quantexa Hackathon.",
      problemStatementFileUrl:
        track === "FinTech Track"
          ? "/Problem statement/Fin-tech Track.pdf"
          : "/Problem statement/Quantum and Social Welfare Track.pdf",
      gitRepoUrl: gitRepoUrl.trim(),
      projectFileUrl: projectFileUrl.trim(),
      projectFileName: projectFileUrl.trim() ? "Presentation Drive Link" : "",
      status: (gitRepoUrl.trim() || projectFileUrl.trim()) ? "Submitted" : "In Progress",
      score: 0,
      isRosterLocked: true,
    };

    await onAdd(teamPayload);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-[#0d0e14] border-2 border-amber-500/40 rounded-3xl shadow-[0_0_60px_rgba(212,168,67,0.25)] overflow-hidden my-6 flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-950/40 via-black to-black border-b border-amber-500/30 flex items-center justify-between shrink-0">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/40">
                PROVISION NEW ACCOUNT
              </span>
              <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white">
                Add Team to <span className="text-amber-400">Master Database</span>
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-grow font-mono text-xs">
            {/* Team ID, Name, Passcode */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-amber-400 font-bold block mb-1">Team ID</label>
                <input
                  type="text"
                  required
                  value={teamId}
                  onChange={(e) => setTeamId(e.target.value.toUpperCase())}
                  placeholder="e.g. QUAN146"
                  className="w-full bg-black/70 border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-amber-300 font-bold"
                />
              </div>

              <div>
                <label className="text-amber-400 font-bold block mb-1">Team Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Quantum Pioneers"
                  className="w-full bg-black/70 border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-amber-400 font-bold block mb-1">
                  Passcode (Default: Phone)
                </label>
                <input
                  type="text"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Password or phone"
                  className="w-full bg-black/70 border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>
            </div>

            {/* Track Selection & Reveal State */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-black/40 border border-amber-500/20">
              <div>
                <label className="text-amber-400 font-bold block mb-1">
                  Assign Hackathon Track
                </label>
                <select
                  value={track}
                  onChange={(e) => setTrack(e.target.value)}
                  className="w-full bg-black/80 border border-amber-500/40 rounded-xl px-3.5 py-2.5 text-white font-bold"
                >
                  <option value="FinTech Track">FinTech Track</option>
                  <option value="Quantum and Social Welfare Track">
                    Quantum and Social Welfare Track
                  </option>
                </select>
              </div>

              <div>
                <label className="text-amber-400 font-bold block mb-1">Card Reveal Status</label>
                <select
                  value={isTrackRevealed ? "revealed" : "hidden"}
                  onChange={(e) => setIsTrackRevealed(e.target.value === "revealed")}
                  className="w-full bg-black/80 border border-amber-500/40 rounded-xl px-3.5 py-2.5 text-white"
                >
                  <option value="hidden">Pending Superposition (Dynamic Cards on Login)</option>
                  <option value="revealed">Already Revealed (Track Directly Visible)</option>
                </select>
              </div>
            </div>

            {/* Leader Details */}
            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-3">
              <div className="text-amber-300 font-bold flex items-center gap-2">
                <User className="w-4 h-4 text-amber-400" />
                <span>Team Leader (Member 1)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <input
                    type="text"
                    required
                    value={leaderName}
                    onChange={(e) => setLeaderName(e.target.value)}
                    placeholder="Leader Full Name *"
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    required
                    value={leaderPhone}
                    onChange={(e) => {
                      setLeaderPhone(e.target.value);
                      if (!passcode) setPasscode(e.target.value);
                    }}
                    placeholder="Leader Phone Number *"
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    value={leaderEmail}
                    onChange={(e) => setLeaderEmail(e.target.value)}
                    placeholder="Leader Email (Optional)"
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>
            </div>

            {/* Members 2, 3, 4 */}
            <div className="space-y-2">
              <div className="text-gray-400 font-bold text-[11px] uppercase tracking-wider">
                Additional Team Members (Optional)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5 p-3 rounded-xl bg-black/40 border border-white/10">
                  <span className="text-[10px] text-gray-400 block">Member 2</span>
                  <input
                    type="text"
                    value={member2Name}
                    onChange={(e) => setMember2Name(e.target.value)}
                    placeholder="Name"
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-white text-xs"
                  />
                  <input
                    type="text"
                    value={member2Phone}
                    onChange={(e) => setMember2Phone(e.target.value)}
                    placeholder="Phone"
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-white text-xs"
                  />
                </div>

                <div className="space-y-1.5 p-3 rounded-xl bg-black/40 border border-white/10">
                  <span className="text-[10px] text-gray-400 block">Member 3</span>
                  <input
                    type="text"
                    value={member3Name}
                    onChange={(e) => setMember3Name(e.target.value)}
                    placeholder="Name"
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-white text-xs"
                  />
                  <input
                    type="text"
                    value={member3Phone}
                    onChange={(e) => setMember3Phone(e.target.value)}
                    placeholder="Phone"
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-white text-xs"
                  />
                </div>

                <div className="space-y-1.5 p-3 rounded-xl bg-black/40 border border-white/10">
                  <span className="text-[10px] text-gray-400 block">Member 4</span>
                  <input
                    type="text"
                    value={member4Name}
                    onChange={(e) => setMember4Name(e.target.value)}
                    placeholder="Name"
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-white text-xs"
                  />
                  <input
                    type="text"
                    value={member4Phone}
                    onChange={(e) => setMember4Phone(e.target.value)}
                    placeholder="Phone"
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-white text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Optional Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-gray-400 text-[11px] block mb-1">GitHub URL (Optional)</label>
                <input
                  type="url"
                  value={gitRepoUrl}
                  onChange={(e) => setGitRepoUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full bg-black/70 border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-gray-400 text-[11px] block mb-1">
                  Presentation Drive URL (Optional)
                </label>
                <input
                  type="url"
                  value={projectFileUrl}
                  onChange={(e) => setProjectFileUrl(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full bg-black/70 border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            {/* Bottom buttons */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-[#F0C755] to-amber-500 text-black font-display font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(212,168,67,0.4)] flex items-center gap-2 hover:brightness-110"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Creating Team...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Create & Save Team</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
