"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Save,
  Trash2,
  Users,
  Shield,
  Layers,
  FileText,
  Github,
  Award,
  Sparkles,
  Phone,
  Mail,
  User,
  ExternalLink,
  RefreshCw,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export interface TeamMember {
  name: string;
  role: string;
  email?: string;
  phone?: string;
}

export interface TeamRecord {
  id: string;
  name: string;
  passcode: string;
  track?: string;
  leaderName: string;
  leaderEmail?: string;
  leaderPhone?: string;
  membersCount: number;
  memberList: TeamMember[];
  isRosterLocked?: boolean;
  isTrackRevealed?: boolean;
  problemStatement: string;
  problemStatementFileUrl?: string;
  score: number;
  status: "Pending" | "In Progress" | "Submitted";
  dbName: string;
  dbStatus: "Connected" | "Provisioning" | "Offline";
  dbStorage: string;
  dbHost: string;
  gitRepoUrl?: string;
  projectFileUrl?: string;
  projectFileName?: string;
  demoVideoUrl?: string;
  submissionUrl?: string;
  updatedAt: string;
}

interface AdminEditTeamModalProps {
  isOpen: boolean;
  team: TeamRecord | null;
  onClose: () => void;
  onSave: (teamId: string, updates: Partial<TeamRecord>) => Promise<void>;
  onDelete: (teamId: string) => Promise<void>;
  isSaving: boolean;
}

export default function AdminEditTeamModal({
  isOpen,
  team,
  onClose,
  onSave,
  onDelete,
  isSaving,
}: AdminEditTeamModalProps) {
  const [formData, setFormData] = useState<Partial<TeamRecord>>({});
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [activeTab, setActiveTab] = useState<"general" | "roster" | "submissions" | "eval">("general");
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name || "",
        passcode: team.passcode || "",
        track: team.track || "FinTech Track",
        isTrackRevealed: Boolean(team.isTrackRevealed),
        leaderName: team.leaderName || "",
        leaderPhone: team.leaderPhone || "",
        leaderEmail: team.leaderEmail || "",
        problemStatement: team.problemStatement || "",
        problemStatementFileUrl: team.problemStatementFileUrl || "",
        gitRepoUrl: team.gitRepoUrl || "",
        projectFileUrl: team.projectFileUrl || "",
        projectFileName: team.projectFileName || "Presentation File",
        score: team.score || 0,
        status: team.status || "In Progress",
        isRosterLocked: team.isRosterLocked !== undefined ? team.isRosterLocked : true,
      });

      // Populate 4 members
      const initial: TeamMember[] = [];
      const count = Math.max(team.membersCount || 4, team.memberList?.length || 4, 4);
      for (let i = 0; i < count; i++) {
        const existing = team.memberList?.[i];
        initial.push({
          name: existing?.name || (i === 0 ? team.leaderName : ""),
          role: existing?.role || (i === 0 ? "Team Lead" : `Member ${i}`),
          phone: existing?.phone || (i === 0 ? team.leaderPhone : ""),
          email: existing?.email || (i === 0 ? team.leaderEmail : ""),
        });
      }
      setMembers(initial);
      setDeleteConfirm(false);
    }
  }, [team]);

  if (!isOpen || !team) return null;

  const handleMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    setMembers((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      if (index === 0) {
        if (field === "name") setFormData((f) => ({ ...f, leaderName: value }));
        if (field === "phone") setFormData((f) => ({ ...f, leaderPhone: value, passcode: value }));
        if (field === "email") setFormData((f) => ({ ...f, leaderEmail: value }));
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMembers = members.filter((m) => m.name.trim() !== "");
    const updates: Partial<TeamRecord> = {
      ...formData,
      leaderName: members[0]?.name || formData.leaderName || "Team Leader",
      leaderPhone: members[0]?.phone || formData.leaderPhone || "",
      leaderEmail: members[0]?.email || formData.leaderEmail || "",
      memberList: members,
      membersCount: cleanMembers.length || 4,
    };

    if (formData.track === "FinTech Track" && !formData.problemStatementFileUrl) {
      updates.problemStatementFileUrl = "/Problem statement/Fin-tech Track.pdf";
    } else if (formData.track === "Quantum and Social Welfare Track" && !formData.problemStatementFileUrl) {
      updates.problemStatementFileUrl = "/Problem statement/Quantum and Social Welfare Track.pdf";
    }

    await onSave(team.id, updates);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-[#0d0e14] border-2 border-amber-500/40 rounded-3xl shadow-[0_0_60px_rgba(212,168,67,0.25)] overflow-hidden my-6 flex flex-col max-h-[92vh]"
        >
          {/* Top Modal Header */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-950/40 via-black to-black border-b border-amber-500/30 flex items-center justify-between shrink-0">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/40">
                  EDIT TEAM // {team.id}
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  {formData.track || team.track}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white">
                Modify <span className="text-amber-400">{team.name}</span>
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2 px-6 pt-4 border-b border-white/10 bg-black/40 overflow-x-auto shrink-0 font-mono text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("general")}
              className={`pb-3 px-3 border-b-2 font-bold transition-all whitespace-nowrap ${
                activeTab === "general"
                  ? "border-amber-400 text-amber-400"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              1. Basic Info & Track
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("roster")}
              className={`pb-3 px-3 border-b-2 font-bold transition-all whitespace-nowrap ${
                activeTab === "roster"
                  ? "border-amber-400 text-amber-400"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              2. Leader & Roster ({members.filter((m) => m.name).length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("submissions")}
              className={`pb-3 px-3 border-b-2 font-bold transition-all whitespace-nowrap ${
                activeTab === "submissions"
                  ? "border-amber-400 text-amber-400"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              3. GitHub & PPT Links
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("eval")}
              className={`pb-3 px-3 border-b-2 font-bold transition-all whitespace-nowrap ${
                activeTab === "eval"
                  ? "border-amber-400 text-amber-400"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              4. Problem & Score
            </button>
          </div>

          {/* Form Content Body */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-grow font-mono text-xs">
            {/* TAB 1: General & Track */}
            {activeTab === "general" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-amber-400 font-bold block mb-1">Team Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name || ""}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-black/70 border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-amber-400 font-bold block mb-1">
                      Passcode / Password (Leader Phone)
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.passcode || ""}
                      onChange={(e) => setFormData({ ...formData, passcode: e.target.value })}
                      className="w-full bg-black/70 border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white font-bold text-amber-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-amber-400 font-bold block mb-1">
                      Assigned Track (FinTech vs Quantum)
                    </label>
                    <select
                      value={formData.track || "FinTech Track"}
                      onChange={(e) => {
                        const newTrack = e.target.value;
                        setFormData({
                          ...formData,
                          track: newTrack,
                          problemStatementFileUrl:
                            newTrack === "FinTech Track"
                              ? "/Problem statement/Fin-tech Track.pdf"
                              : "/Problem statement/Quantum and Social Welfare Track.pdf",
                        });
                      }}
                      className="w-full bg-black/80 border border-amber-500/40 rounded-xl px-3.5 py-2.5 text-white font-bold"
                    >
                      <option value="FinTech Track">FinTech Track</option>
                      <option value="Quantum and Social Welfare Track">
                        Quantum and Social Welfare Track
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="text-amber-400 font-bold block mb-1">
                      Track Reveal State (Cards Dynamic Choice)
                    </label>
                    <select
                      value={formData.isTrackRevealed ? "revealed" : "hidden"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isTrackRevealed: e.target.value === "revealed",
                        })
                      }
                      className="w-full bg-black/80 border border-amber-500/40 rounded-xl px-3.5 py-2.5 text-white font-bold"
                    >
                      <option value="revealed">Revealed (Card Picked & Track Disclosed)</option>
                      <option value="hidden">Pending Superposition (Card Not Yet Picked)</option>
                    </select>
                    <span className="text-[11px] text-gray-400 block mt-1">
                      {formData.isTrackRevealed
                        ? "Participant already sees this track confirmed on their screen."
                        : "Participant will see 2 animated HackHere cards to choose from upon next login."}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-amber-400 font-bold block mb-1">Submission Status</label>
                    <select
                      value={formData.status || "In Progress"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as any,
                        })
                      }
                      className="w-full bg-black/80 border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Submitted">Submitted</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-amber-400 font-bold block mb-1">Roster Lock State</label>
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, isRosterLocked: !formData.isRosterLocked })
                        }
                        className={`px-4 py-2 rounded-xl border font-bold flex items-center gap-2 transition-all ${
                          formData.isRosterLocked
                            ? "bg-amber-950/40 border-amber-500/50 text-amber-300"
                            : "bg-emerald-950/40 border-emerald-500/50 text-emerald-300"
                        }`}
                      >
                        {formData.isRosterLocked ? (
                          <>
                            <Lock className="w-3.5 h-3.5 text-amber-400" />
                            <span>Roster Locked (Verified)</span>
                          </>
                        ) : (
                          <>
                            <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Roster Unlocked</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Leader & Roster */}
            {activeTab === "roster" && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-3">
                  <div className="flex items-center gap-2 text-amber-300 font-bold">
                    <User className="w-4 h-4 text-amber-400" />
                    <span>Member 1 (Team Leader)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-gray-400 text-[11px] block mb-1">Leader Name</label>
                      <input
                        type="text"
                        value={members[0]?.name || ""}
                        onChange={(e) => handleMemberChange(0, "name", e.target.value)}
                        placeholder="Leader Name"
                        className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-[11px] block mb-1">Phone (Passcode)</label>
                      <input
                        type="text"
                        value={members[0]?.phone || ""}
                        onChange={(e) => handleMemberChange(0, "phone", e.target.value)}
                        placeholder="10-digit Phone"
                        className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-[11px] block mb-1">Leader Email</label>
                      <input
                        type="email"
                        value={members[0]?.email || ""}
                        onChange={(e) => handleMemberChange(0, "email", e.target.value)}
                        placeholder="leader@example.com"
                        className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Member 2, 3, 4 */}
                {[1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2"
                  >
                    <div className="flex items-center justify-between text-gray-300 font-bold text-xs">
                      <span>Member {idx + 1}</span>
                      <span className="text-[10px] text-gray-500 font-normal">
                        {members[idx]?.name ? "Active" : "Unassigned"}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          value={members[idx]?.name || ""}
                          onChange={(e) => handleMemberChange(idx, "name", e.target.value)}
                          placeholder={`Member ${idx + 1} Full Name`}
                          className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={members[idx]?.phone || ""}
                          onChange={(e) => handleMemberChange(idx, "phone", e.target.value)}
                          placeholder={`Member ${idx + 1} Phone Number`}
                          className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: GitHub & PPT Links */}
            {activeTab === "submissions" && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-amber-400 font-bold flex items-center gap-2">
                      <Github className="w-4 h-4 text-white" />
                      GitHub Repository URL
                    </label>
                    {formData.gitRepoUrl && (
                      <a
                        href={formData.gitRepoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-amber-300 hover:underline flex items-center gap-1 text-[11px]"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Test Link
                      </a>
                    )}
                  </div>
                  <input
                    type="url"
                    value={formData.gitRepoUrl || ""}
                    onChange={(e) => setFormData({ ...formData, gitRepoUrl: e.target.value })}
                    placeholder="https://github.com/org/repo"
                    className="w-full bg-black/80 border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-amber-400 font-bold flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-400" />
                      Project Presentation / PPT Google Drive Link
                    </label>
                    {formData.projectFileUrl && (
                      <a
                        href={formData.projectFileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-300 hover:underline flex items-center gap-1 text-[11px]"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Test Drive Link
                      </a>
                    )}
                  </div>
                  <input
                    type="url"
                    value={formData.projectFileUrl || ""}
                    onChange={(e) => setFormData({ ...formData, projectFileUrl: e.target.value })}
                    placeholder="https://docs.google.com/presentation/d/... or drive link"
                    className="w-full bg-black/80 border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2">
                  <label className="text-gray-400 font-bold block">Presentation File Name / Label</label>
                  <input
                    type="text"
                    value={formData.projectFileName || ""}
                    onChange={(e) => setFormData({ ...formData, projectFileName: e.target.value })}
                    placeholder="e.g. Final_Pitch_Presentation.pdf"
                    className="w-full bg-black/80 border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>
              </div>
            )}

            {/* TAB 4: Problem Statement & Score */}
            {activeTab === "eval" && (
              <div className="space-y-4">
                <div>
                  <label className="text-amber-400 font-bold block mb-1">
                    Problem Statement Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.problemStatement || ""}
                    onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
                    placeholder="Full problem statement or title..."
                    className="w-full bg-black/70 border border-white/15 focus:border-amber-400 rounded-xl p-3 text-white"
                  />
                </div>

                <div>
                  <label className="text-amber-400 font-bold block mb-1">
                    Problem Statement PDF Document URL
                  </label>
                  <input
                    type="text"
                    value={formData.problemStatementFileUrl || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, problemStatementFileUrl: e.target.value })
                    }
                    placeholder="/Problem statement/Fin-tech Track.pdf"
                    className="w-full bg-black/70 border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-amber-400 font-bold block mb-1">
                      Jury Score (0 - 100 pts)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={formData.score ?? 0}
                      onChange={(e) => setFormData({ ...formData, score: Number(e.target.value) })}
                      className="w-full bg-black/70 border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white text-lg font-bold text-amber-300"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Actions Bar */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div>
                {!deleteConfirm ? (
                  <button
                    type="button"
                    onClick={() => setDeleteConfirm(true)}
                    className="px-4 py-2.5 rounded-xl bg-red-950/40 border border-red-500/40 hover:bg-red-900/60 text-red-300 text-xs font-mono flex items-center gap-2 transition-all"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                    <span>Delete Team</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-red-400 text-xs font-mono">Confirm deletion?</span>
                    <button
                      type="button"
                      onClick={() => onDelete(team.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold text-xs"
                    >
                      Yes, Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm(false)}
                      className="px-3 py-1.5 rounded-lg bg-white/10 text-gray-300 text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 text-xs"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-[#F0C755] to-amber-500 text-black font-display font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(212,168,67,0.4)] flex items-center gap-2 hover:brightness-110 transition-all"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save All Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
