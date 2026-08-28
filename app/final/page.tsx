"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ShieldCheck,
  User,
  Lock,
  ArrowLeft,
  Terminal,
  Upload,
  CheckCircle2,
  Users,
  Key,
  RefreshCw,
  Plus,
  Server,
  AlertCircle,
  ExternalLink,
  Search,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  Github,
  FileText,
  Trash2,
  Download,
  Edit3,
  Eye,
  EyeOff,
  Shield,
} from "lucide-react";
import TrackSpinWheel from "@/components/TrackSpinWheel";

interface TeamMember {
  name: string;
  role: string;
  email?: string;
  phone?: string;
}

interface TeamRecord {
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

export default function FinalPortalPage() {
  const [activeTab, setActiveTab] = useState<"team" | "admin">("team");

  // Auth Inputs
  const [teamInput, setTeamInput] = useState("");
  const [teamPassword, setTeamPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Error / Loading States
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Authenticated State
  const [currentTeam, setCurrentTeam] = useState<TeamRecord | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminPasskey, setAdminPasskey] = useState("");

  // Submission Form State (Git Link & File)
  const [gitRepoUrl, setGitRepoUrl] = useState("");
  const [projectFileUrl, setProjectFileUrl] = useState("");
  const [projectFileName, setProjectFileName] = useState("");

  // Team Members Form State (One-Time Add/Edit)
  const [editingMembers, setEditingMembers] = useState(false);
  const [leaderName, setLeaderName] = useState("");
  const [leaderPhone, setLeaderPhone] = useState("");
  const [leaderEmail, setLeaderEmail] = useState("");
  const [memberList, setMemberList] = useState<TeamMember[]>([]);

  // Admin Data & Search/Filter
  const [adminView, setAdminView] = useState<"database" | "rosters" | "submissions">("database");
  const [teamsList, setTeamsList] = useState<TeamRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Admin Modals
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkJsonInput, setBulkJsonInput] = useState("");

  // New Team Modal Form
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamPasscode, setNewTeamPasscode] = useState("");
  const [newTeamLeader, setNewTeamLeader] = useState("");
  const [newTeamPhone, setNewTeamPhone] = useState("");
  const [newTeamProblem, setNewTeamProblem] = useState("");

  // Editing Score State for Admin
  const [editingScoreId, setEditingScoreId] = useState<string | null>(null);
  const [tempScore, setTempScore] = useState<number>(0);

  // Fetch all teams
  const fetchTeams = async () => {
    try {
      const res = await fetch("/api/teams");
      const data = await res.json();
      if (data.success) {
        setTeamsList(data.teams);
      }
    } catch (err) {
      console.error("Failed to fetch teams:", err);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("quantexa_auth");
    setActiveTab("team");
    setIsAdminLoggedIn(false);
    setCurrentTeam(null);
  };

  useEffect(() => {
    const storedAuth = localStorage.getItem("quantexa_auth");
    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth);
        if (parsed.type === "admin") {
          setIsAdminLoggedIn(true);
          setAdminPasskey(parsed.passkey);
          setActiveTab("admin");
        } else if (parsed.type === "team") {
          setIsLoading(true);
          fetch("/api/auth/team", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ teamId: parsed.teamId, passcode: parsed.passcode }),
          })
            .then(res => res.json())
            .then(data => {
              if (data.success) {
                setIsAdminLoggedIn(false);
                populateTeamState(data.team);
                setActiveTab("team");
              } else {
                localStorage.removeItem("quantexa_auth");
              }
            })
            .finally(() => setIsLoading(false));
        }
      } catch (e) {
        localStorage.removeItem("quantexa_auth");
      }
    }
  }, []);

  // Filtered & Paginated Teams for Admin View
  const filteredTeams = useMemo(() => {
    return teamsList.filter((t) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        t.id.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q) ||
        (t.leaderName && t.leaderName.toLowerCase().includes(q)) ||
        (t.leaderPhone && t.leaderPhone.toLowerCase().includes(q)) ||
        t.passcode.toLowerCase().includes(q) ||
        t.problemStatement.toLowerCase().includes(q);

      const matchesStatus = filterStatus === "ALL" || t.status === filterStatus;

      return matchesQuery && matchesStatus;
    });
  }, [teamsList, searchQuery, filterStatus]);

  const totalPages = Math.ceil(filteredTeams.length / pageSize) || 1;
  const paginatedTeams = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTeams.slice(start, start + pageSize);
  }, [filteredTeams, currentPage, pageSize]);

  // Sync team form states when logged in
  const populateTeamState = (team: TeamRecord) => {
    setCurrentTeam(team);
    setGitRepoUrl(team.gitRepoUrl || team.submissionUrl || "");
    setProjectFileUrl(team.projectFileUrl || "");
    setProjectFileName(team.projectFileName || "");
    setLeaderName(team.leaderName || "Team Leader");
    setLeaderPhone(team.leaderPhone || "");
    setLeaderEmail(team.leaderEmail || "");

    const size = team.membersCount || 4;
    const initialMembers: TeamMember[] = [];
    
    for (let i = 0; i < size; i++) {
      if (i === 0) {
        initialMembers.push({
          name: team.leaderName || (team.memberList?.[0]?.name) || "Team Leader",
          role: "Team Lead",
          phone: team.leaderPhone || "",
        });
      } else {
        initialMembers.push({
          name: team.memberList?.[i]?.name || "",
          role: team.memberList?.[i]?.role || `Member ${i + 1}`,
        });
      }
    }

    setMemberList(initialMembers);
  };

  // Login Handler (Supports Team Logins AND Admin Access via admin123 passkey)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);

    const inputLower = teamInput.trim().toLowerCase();
    const passTrim = teamPassword.trim();

    // Check if logging in as Admin (ID must be explicitly "guru" or "admin")
    if (
      (inputLower === "guru" || inputLower === "admin") &&
      (passTrim === "9442777855" || passTrim === "admin123")
    ) {
      try {
        const passkeyToUse = passTrim || "9442777855";
        const res = await fetch("/api/auth/admin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ passkey: passkeyToUse }),
        });
        const data = await res.json();

        if (data.success) {
          setIsAdminLoggedIn(true);
          setAdminPasskey(passkeyToUse);
          setTeamsList(data.teams);
          setActiveTab("admin");
          setSuccessMsg(`Master Admin Authenticated! Managing ${data.teams.length} team accounts.`);
          localStorage.setItem("quantexa_auth", JSON.stringify({ type: "admin", passkey: passkeyToUse }));
          setIsLoading(false);
          return;
        }
      } catch (err) {
        // Fallback to normal team auth
      }
    }

    // Standard Team Authentication
    try {
      const res = await fetch("/api/auth/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId: teamInput, passcode: teamPassword }),
      });
      const data = await res.json();

      if (data.success) {
        setIsAdminLoggedIn(false);
        populateTeamState(data.team);
        setActiveTab("team");
        setErrorMsg("");
        setSuccessMsg("");
        localStorage.setItem("quantexa_auth", JSON.stringify({ type: "team", teamId: teamInput, passcode: teamPassword }));
      } else {
        setErrorMsg(data.message || "Invalid Team ID or Passcode.");
      }
    } catch (err) {
      setErrorMsg("Network error connecting to system.");
    } finally {
      setIsLoading(false);
    }
  };

  // Upload File handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentTeam) return;

    setIsUploading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("teamId", currentTeam.id);

    try {
      const res = await fetch("/api/teams/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setProjectFileUrl(data.fileUrl);
        setProjectFileName(data.fileName);
        setSuccessMsg(`File "${data.fileName}" uploaded! Click "Save Submissions" below to complete.`);
      } else {
        setErrorMsg(data.message || "File upload failed.");
      }
    } catch (err) {
      setErrorMsg("Error uploading file.");
    } finally {
      setIsUploading(false);
    }
  };

  // Save All Team Submissions (Git Link + Presentation File)
  const handleSaveSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTeam) return;
    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/teams/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId: currentTeam.id,
          gitRepoUrl,
          projectFileUrl,
          projectFileName,
          memberList,
          leaderName,
          leaderEmail,
        }),
      });
      const data = await res.json();

      if (data.success) {
        populateTeamState(data.team);
        setSuccessMsg("Git repository link and presentation file saved successfully!");
        fetchTeams();
      } else {
        setErrorMsg(data.message || "Failed to save submission.");
      }
    } catch (err) {
      setErrorMsg("Submission error.");
    } finally {
      setIsLoading(false);
    }
  };

  // Save Team Members ONE TIME (Finalize & Lock)
  const handleSaveMembersOneTime = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTeam) return;
    if (currentTeam.isRosterLocked) {
      setErrorMsg("Team roster has already been finalized and locked.");
      return;
    }

    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/teams/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId: currentTeam.id,
          memberList,
          leaderName,
          leaderEmail,
          gitRepoUrl,
          projectFileUrl,
          projectFileName,
          isRosterLocked: false,
        }),
      });
      const data = await res.json();

      if (data.success) {
        populateTeamState(data.team);
        setEditingMembers(false);
        setSuccessMsg("Team members saved successfully!");
        fetchTeams();
      } else {
        setErrorMsg(data.message || "Failed to save team roster.");
      }
    } catch (err) {
      setErrorMsg("Roster save error.");
    } finally {
      setIsLoading(false);
    }
  };

  // Member Management helpers (Up to team size limit)
  const handleAddMember = () => {
    const maxAllowed = currentTeam?.membersCount || 4;
    if (memberList.length >= maxAllowed) {
      setErrorMsg(`Maximum allowed team size is ${maxAllowed} members.`);
      return;
    }
    setMemberList((prev) => [
      ...prev,
      { name: `Member ${prev.length + 1}`, role: "Developer" },
    ]);
  };

  const handleRemoveMember = (index: number) => {
    if (index === 0) {
      setErrorMsg("Team Leader cannot be removed.");
      return;
    }
    setMemberList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateMember = (index: number, key: keyof TeamMember, val: string) => {
    setMemberList((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [key]: val };
      return copy;
    });
  };

  // Update Team by Admin
  const handleAdminUpdateTeam = async (teamId: string, updates: Partial<TeamRecord>) => {
    try {
      const res = await fetch("/api/admin/update-team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passkey: adminPasskey,
          teamId,
          ...updates,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTeamsList(data.allTeams);
        if (currentTeam && currentTeam.id === teamId) {
          populateTeamState(data.team);
        }
      }
    } catch (err) {
      console.error("Failed to update team:", err);
    }
  };

  // Create New Single Team
  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newTeamName,
          passcode: newTeamPasscode || newTeamPhone || "pass123",
          leaderName: newTeamLeader,
          leaderPhone: newTeamPhone,
          problemStatement: newTeamProblem,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTeamsList((prev) => [...prev, data.team]);
        setShowAddTeam(false);
        setNewTeamName("");
        setNewTeamPasscode("");
        setNewTeamLeader("");
        setNewTeamPhone("");
        setNewTeamProblem("");
        setSuccessMsg(`Team "${data.team.name}" created!`);
      }
    } catch (err) {
      setErrorMsg("Failed to create team.");
    } finally {
      setIsLoading(false);
    }
  };

  // Bulk Import Teams from JSON / CSV data
  const handleBulkImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);

    try {
      let parsedData = [];
      try {
        parsedData = JSON.parse(bulkJsonInput);
      } catch (err) {
        const lines = bulkJsonInput.trim().split("\n");
        parsedData = lines.map((line, idx) => {
          const parts = line.split(",").map((p) => p.trim());
          return {
            id: parts[0] || `NX-${idx + 101}`,
            name: parts[1] || `Team ${parts[0]}`,
            leaderName: parts[2] || "Team Leader",
            leaderPhone: parts[3] || "",
            passcode: parts[4] || parts[3] || `pass${idx + 1}`,
          };
        });
      }

      const res = await fetch("/api/admin/import-teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passkey: adminPasskey,
          teams: parsedData,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setTeamsList(data.teams);
        setShowBulkImport(false);
        setBulkJsonInput("");
        setSuccessMsg(data.message);
      } else {
        setErrorMsg(data.message || "Bulk import failed.");
      }
    } catch (err) {
      setErrorMsg("Error parsing or importing team records.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-ink text-white relative overflow-hidden flex flex-col font-sans">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#D4A843]/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-crimson/10 rounded-full blur-[180px] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="sticky top-0 z-50 bg-ink/90 backdrop-blur-xl border-b border-amber-500/30 px-4 sm:px-8 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/5 border border-amber-500/30 hover:border-amber-400 text-xs font-mono text-amber-300 transition-all shadow-[0_0_15px_rgba(0,229,255,0.15)]"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>Back to Quantexa</span>
        </Link>

        {(isAdminLoggedIn || currentTeam) && (
          <button
            onClick={() => {
              localStorage.removeItem("quantexa_auth");
              setIsAdminLoggedIn(false);
              setCurrentTeam(null);
              setSuccessMsg("");
              setErrorMsg("");
            }}
            className="px-4 py-2 rounded-xl bg-red-950/60 border border-red-500/40 hover:border-red-400 text-red-300 text-xs font-mono transition-all flex items-center gap-1.5"
          >
            <span>Log Out</span>
          </button>
        )}
      </header>

      {/* Main Portal Area */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-grow space-y-8 relative z-10">

        {/* Global Notifications */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-950/80 border border-red-500/50 text-red-300 text-xs font-mono flex items-center gap-3 shadow-[0_0_20px_rgba(255,0,0,0.2)]">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-3 shadow-[0_0_20px_rgba(0,255,150,0.2)]">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Dynamic Content Views */}
        <AnimatePresence mode="wait">
          {!currentTeam && !isAdminLoggedIn ? (
            /* ================= SINGLE UNIFIED LOGIN FORM ================= */
            <motion.div
              key="portal-login"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-md mx-auto space-y-4"
            >
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/40 bg-gradient-to-b from-amber-950/20 via-ink to-black space-y-6 shadow-[0_0_30px_rgba(0,229,255,0.15)]">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-500/40 mx-auto flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(0,229,255,0.3)]">
                    <Key className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-display font-extrabold text-white tracking-wide">
                    TEAM <span className="text-amber-400">AUTHENTICATION</span>
                  </h2>
                  <p className="text-xs text-gray-400 font-sans">
                    Connect to your team account, manage members, and submit your project files.
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4 font-mono text-xs">
                  <div className="space-y-1.5">
                    <label className="text-amber-400 uppercase tracking-widest text-[10px]">
                      Team ID / Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="text"
                        required
                        value={teamInput}
                        onChange={(e) => setTeamInput(e.target.value)}
                        placeholder="e.g. QTX0001 or Team Name"
                        className="w-full bg-black/60 border border-white/10 focus:border-amber-400 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-gray-600 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-amber-400 uppercase tracking-widest text-[10px]">
                      Passcode / Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={teamPassword}
                        onChange={(e) => setTeamPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-black/60 border border-white/10 focus:border-amber-400 rounded-xl pl-10 pr-10 py-3 text-white placeholder:text-gray-600 focus:outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-400 transition-colors p-1"
                        title={showPassword ? "Hide Password" : "Show Password"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-display text-xs font-extrabold uppercase tracking-wider shadow-[0_0_20px_rgba(0,229,255,0.6)] transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Connect Team Portal"}
                  </button>
                </form>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono space-y-2">
                <div className="flex justify-between items-center text-[10px] text-amber-400 uppercase tracking-widest font-bold">
                  <span>🔑 LOGIN CREDENTIALS INFO:</span>
                </div>
                <div className="space-y-1.5 text-[11px] text-gray-300">
                  <div>• <strong className="text-emerald-400">Team Login:</strong> ID: <code className="text-amber-300 font-bold">TEAM ID</code> (e.g. QTX0001) | Password: <code className="text-amber-300 font-bold">TEAM LEAD NUMBER</code></div>
                </div>
              </div>
            </motion.div>
          ) : currentTeam ? (
            /* ================= TEAM DASHBOARD ================= */
            <motion.div
              key="team-dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {/* Team Header Banner */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/40 via-ink to-black border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-mono text-amber-400 font-bold">// TEAM ID: {currentTeam.id}</span>
                  <h1 className="text-2xl font-display font-extrabold text-white">
                    Welcome, <span className="text-amber-400">{currentTeam.name}</span>
                  </h1>
                </div>

                {/* Roster Lock Status Badge */}
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                  {currentTeam.isRosterLocked ? (
                    <div className="px-3.5 py-1.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-mono flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Roster Locked</span>
                    </div>
                  ) : (
                    <div className="px-3.5 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Roster Edit Available</span>
                    </div>
                  )}
                  <button onClick={handleLogout} className="px-3.5 py-1.5 rounded-xl bg-red-950/60 border border-red-500/40 hover:bg-red-900/60 text-red-300 text-xs font-mono transition-all">
                    Logout
                  </button>
                </div>
              </div>

              {/* Team Members Details Section (One-Time Edit & Lock) */}
              <div className="glass-panel p-6 rounded-3xl border border-amber-500/30 bg-black/40 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-400">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-base text-white">Team Details</h3>
                      <p className="text-xs text-gray-400 font-sans">
                        {currentTeam.isRosterLocked
                          ? "Your team roster is finalized. Contact admin if you need updates."
                          : `Add your team members once (Allowed team size: max ${currentTeam.membersCount || 4} members).`}
                      </p>
                    </div>
                  </div>

                  {!currentTeam.isRosterLocked && (
                    <button
                      onClick={() => setEditingMembers(!editingMembers)}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-950/80 border border-amber-500/40 hover:border-amber-400 text-amber-300 text-xs font-mono flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{editingMembers ? "Cancel Edit" : "Add/Edit Team Members"}</span>
                    </button>
                  )}
                </div>

                {editingMembers && !currentTeam.isRosterLocked ? (
                  /* Edit Members Form (One-Time Add) */
                  <form onSubmit={handleSaveMembersOneTime} className="space-y-4 font-mono text-xs pt-2">
                    <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[11px]">
                      ✅ <strong>INFO:</strong> Please ensure all team member names are spelled correctly before saving.
                    </div>

                    <div className="space-y-3">
                      <div className="text-[10px] text-amber-400 uppercase tracking-widest font-bold">
                        Team Roster ({currentTeam.membersCount || 4} Total Members Allowed)
                      </div>

                      {memberList.map((m, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-xl bg-black/60 border border-white/10">
                          <div className="w-full sm:w-1/3 text-amber-400 font-bold flex items-center gap-2">
                            <User className="w-4 h-4 text-amber-400 shrink-0" />
                            <span>{idx === 0 ? "1. Team Leader" : `${idx + 1}. Member ${idx + 1}`}</span>
                          </div>

                          <input
                            type="text"
                            required={idx === 0}
                            readOnly={idx === 0}
                            placeholder={idx === 0 ? "Team Leader Name" : `Enter Member ${idx + 1} Name`}
                            value={m.name}
                            onChange={(e) => handleUpdateMember(idx, "name", e.target.value)}
                            className={`w-full sm:w-2/3 border rounded-xl px-3.5 py-2.5 text-white transition-all ${
                              idx === 0
                                ? "bg-amber-950/40 border-amber-500/40 text-amber-200 cursor-not-allowed font-semibold"
                                : "bg-black/80 border-white/10 focus:border-amber-400"
                            }`}
                          />
                        </div>
                      ))}
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-display font-extrabold text-xs uppercase flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all"
                    >
                      {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Save Team Members"}
                    </button>
                  </form>
                ) : (
                  /* Display Member Cards (Read-only after lock) */
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
                    {memberList.map((m, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-1"
                      >
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-amber-400 shrink-0" />
                          <span className="font-bold text-white truncate">{m.name}</span>
                        </div>
                        <span className="text-[10px] text-amber-300/80 uppercase tracking-wider">
                          {m.role || (idx === 0 ? "Team Lead" : "Member")}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Interactive Spin Wheel Domain Track & Problem Statement Card */}
              <TrackSpinWheel
                track={currentTeam.track || "Quantum Technology"}
                problemStatement={currentTeam.problemStatement}
                problemStatementFileUrl={currentTeam.problemStatementFileUrl}
                teamId={currentTeam.id}
              />

              {/* Submissions Section: Git Link + Presentation File Upload */}
              <div className="glass-panel p-6 rounded-3xl border border-amber-500/40 bg-gradient-to-r from-amber-950/20 via-ink to-black space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-400">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-white">Project Submissions</h3>
                    <p className="text-xs text-gray-400 font-sans">
                      Provide your GitHub repository link and Google Drive presentation link.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSaveSubmission} className="space-y-6 font-mono text-xs">
                  {/* 1. Git Link Asking */}
                  <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-amber-400 font-bold uppercase text-[11px] flex items-center gap-2">
                        <Github className="w-4 h-4 text-white" />
                        1. GitHub / Git Repository Link (Required)
                      </label>
                      {gitRepoUrl && (
                        <a
                          href={gitRepoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-amber-300 hover:underline flex items-center gap-1"
                        >
                          <span>Open Repository</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    <input
                      type="url"
                      required
                      value={gitRepoUrl}
                      onChange={(e) => setGitRepoUrl(e.target.value)}
                      placeholder="https://github.com/your-team-name/quantexa-project"
                      className="w-full bg-black/80 border border-white/10 focus:border-amber-400 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none"
                    />
                  </div>

                  {/* 2. Presentation Drive Link */}
                  <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-amber-400 font-bold uppercase text-[11px] flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-400" />
                        2. Project Presentation Drive Link (Required)
                      </label>
                      {projectFileUrl && (
                        <a
                          href={projectFileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-emerald-300 hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Open Drive Link</span>
                        </a>
                      )}
                    </div>

                    <input
                      type="url"
                      required
                      value={projectFileUrl}
                      onChange={(e) => {
                        setProjectFileUrl(e.target.value);
                        setProjectFileName("Drive Link");
                      }}
                      placeholder="https://docs.google.com/presentation/d/... or Google Drive URL"
                      className="w-full bg-black/80 border border-white/10 focus:border-amber-400 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none"
                    />
                  </div>

                  {/* Submit All Changes Button */}
                  <button
                    type="submit"
                    disabled={isLoading || isUploading}
                    className="w-full py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-display text-sm font-extrabold uppercase tracking-wider shrink-0 transition-all shadow-[0_0_25px_rgba(0,229,255,0.5)] flex items-center justify-center gap-2"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Save All Submissions & Details"}
                  </button>
                </form>
              </div>
            </motion.div>
          ) : (
            /* ================= ADMIN CONTROL CENTER ================= */
            <motion.div
              key="admin-dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {/* Admin Header Banner */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-red-950/40 via-ink to-black border border-crimson/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-crimson/20 border border-crimson/40 text-crimson font-mono text-[10px]">
                      MASTER ADMIN CONSOLE
                    </span>
                    <span className="text-xs font-mono text-gray-400">
                      // TOTAL TEAMS IN DB: {teamsList.length}
                    </span>
                  </div>
                  <h1 className="text-2xl font-display font-extrabold text-white">
                    QUANTEXA <span className="text-crimson">200+ Team Database Control</span>
                  </h1>
                  <p className="text-xs text-gray-400 font-sans">
                    Manage participant logins, inspect Git links & presentation files, and update jury scores.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setShowBulkImport(!showBulkImport)}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-display font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,255,150,0.4)]"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Bulk Excel/CSV Import</span>
                  </button>

                  <button
                    onClick={() => setShowAddTeam(!showAddTeam)}
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-display font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,229,255,0.4)]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Single Team DB</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsAdminLoggedIn(false);
                      setActiveTab("team");
                      setSuccessMsg("");
                      setErrorMsg("");
                    }}
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-red-500/40 text-gray-400 hover:text-red-400 text-xs font-mono transition-all flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin Logout</span>
                  </button>
                </div>
              </div>

              {/* Bulk Excel/CSV Import Modal */}
              {showBulkImport && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-6 rounded-3xl bg-emerald-950/30 border border-emerald-500/40 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-sm text-emerald-300 uppercase tracking-wider flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                      Bulk Upload Excel/CSV Participant Accounts
                    </h3>
                    <span className="text-[10px] font-mono text-gray-400">FORMAT: CSV (TeamID, TeamName, LeaderName, LeaderPhone)</span>
                  </div>

                  <form onSubmit={handleBulkImport} className="space-y-3 font-mono text-xs">
                    <textarea
                      rows={6}
                      required
                      value={bulkJsonInput}
                      onChange={(e) => setBulkJsonInput(e.target.value)}
                      placeholder={`Paste CSV lines like:\nNX-101, CyberPulse, Alex Vance, +919876543210\nNX-102, BlockFoundry, Siddharth Rao, +919876543211`}
                      className="w-full bg-black/70 border border-white/10 rounded-2xl p-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-400 text-xs font-mono"
                    />
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setShowBulkImport(false)}
                        className="px-4 py-2 rounded-xl bg-white/5 text-gray-300 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-2 rounded-xl bg-emerald-400 text-black font-display font-bold text-xs uppercase flex items-center gap-2 shadow-[0_0_15px_rgba(0,255,150,0.5)]"
                      >
                        {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Import All Teams into Database"}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Provision Single Team Form */}
              {showAddTeam && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-6 rounded-3xl bg-amber-950/30 border border-amber-500/40 space-y-4"
                >
                  <h3 className="font-display font-bold text-sm text-amber-300 uppercase tracking-wider flex items-center gap-2">
                    <Server className="w-4 h-4 text-amber-400" />
                    Provision Single Team & Account
                  </h3>

                  <form onSubmit={handleCreateTeam} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
                    <input
                      type="text"
                      required
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      placeholder="Team Name (e.g. ApexDevs)"
                      className="bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-400"
                    />
                    <input
                      type="text"
                      required
                      value={newTeamLeader}
                      onChange={(e) => setNewTeamLeader(e.target.value)}
                      placeholder="Team Leader Name"
                      className="bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-400"
                    />
                    <input
                      type="text"
                      required
                      value={newTeamPhone}
                      onChange={(e) => setNewTeamPhone(e.target.value)}
                      placeholder="Leader Phone / Passcode"
                      className="bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-amber-400 text-black font-display text-xs font-bold uppercase py-2.5 rounded-xl hover:bg-amber-300 transition-all flex items-center justify-center gap-2"
                    >
                      {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Create Team"}
                    </button>
                  </form>
                </motion.div>
              )}

              {/* Team Database Search & Control Center */}
              <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-black/40 space-y-6">
                
                {/* Admin View Toggle */}
                <div className="flex bg-black/50 p-1 rounded-xl border border-white/10 w-fit font-display text-xs uppercase tracking-wider font-bold">
                  <button
                    onClick={() => setAdminView("database")}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      adminView === "database"
                        ? "bg-amber-400 text-black shadow-[0_0_10px_rgba(0,229,255,0.4)]"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Main Database View
                  </button>
                  <button
                    onClick={() => setAdminView("rosters")}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      adminView === "rosters"
                        ? "bg-amber-400 text-black shadow-[0_0_10px_rgba(0,229,255,0.4)]"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Team Rosters View
                  </button>
                  <button
                    onClick={() => setAdminView("submissions")}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      adminView === "submissions"
                        ? "bg-amber-400 text-black shadow-[0_0_10px_rgba(0,229,255,0.4)]"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Project Submissions View
                  </button>
                </div>

                {/* Search Bar */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 font-mono text-xs">
                  <div className="relative flex-grow max-w-md">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder="Search teams by ID, Name, Leader, Phone..."
                      className="w-full bg-black/60 border border-white/10 focus:border-amber-400 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 text-gray-400">
                    <span>Per Page:</span>
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="bg-black border border-white/10 rounded-lg px-2 py-1.5 text-white focus:outline-none focus:border-amber-400 text-xs"
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={200}>200</option>
                    </select>
                  </div>
                </div>

                {/* Results Count & Table */}
                <div className="overflow-x-auto">
                  {adminView === "rosters" ? (
                    <table className="w-full text-left border-collapse font-mono text-xs">
                      <thead>
                        <tr className="border-b border-white/10 text-gray-400 uppercase text-[10px]">
                          <th className="py-3 px-4">Team ID</th>
                          <th className="py-3 px-4">Team Name</th>
                          <th className="py-3 px-4">Leader (Member 1)</th>
                          <th className="py-3 px-4">Member 2</th>
                          <th className="py-3 px-4">Member 3</th>
                          <th className="py-3 px-4">Member 4</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {paginatedTeams.length > 0 ? (
                          paginatedTeams.map((t) => {
                            const members = t.memberList || [{ name: t.leaderName, role: "Team Lead", phone: t.leaderPhone }];
                            return (
                              <tr key={t.id} className="hover:bg-white/5 transition-colors">
                                <td className="py-3.5 px-4 font-bold text-amber-400">{t.id}</td>
                                <td className="py-3.5 px-4 font-sans font-semibold text-white">{t.name}</td>
                                <td className="py-3.5 px-4">
                                  <div className="font-sans font-semibold text-emerald-300">{members[0]?.name || t.leaderName || "-"}</div>
                                  <div className="text-[10px] text-gray-400">{members[0]?.phone || t.leaderPhone || ""}</div>
                                </td>
                                <td className="py-3.5 px-4 text-white font-sans">{members[1]?.name || "-"}</td>
                                <td className="py-3.5 px-4 text-white font-sans">{members[2]?.name || "-"}</td>
                                <td className="py-3.5 px-4 text-white font-sans">{members[3]?.name || "-"}</td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-gray-500 italic">
                              No team rosters match your filter criteria.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  ) : adminView === "submissions" ? (
                    <table className="w-full text-left border-collapse font-mono text-xs">
                      <thead>
                        <tr className="border-b border-white/10 text-gray-400 uppercase text-[10px]">
                          <th className="py-3 px-4">Team ID</th>
                          <th className="py-3 px-4">Team Name</th>
                          <th className="py-3 px-4">Assigned Track</th>
                          <th className="py-3 px-4">Git Repo / Code Link</th>
                          <th className="py-3 px-4">Presentation / Drive Link</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {paginatedTeams.length > 0 ? (
                          paginatedTeams.map((t) => (
                            <tr key={t.id} className="hover:bg-white/5 transition-colors">
                              <td className="py-3.5 px-4 font-bold text-amber-400">{t.id}</td>
                              <td className="py-3.5 px-4 font-sans font-semibold text-white">{t.name}</td>
                              <td className="py-3.5 px-4">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                                  t.track === "Quantum Technology"
                                    ? "bg-purple-950/80 border-purple-500/40 text-purple-300"
                                    : "bg-emerald-950/80 border-emerald-500/40 text-emerald-300"
                                }`}>
                                  {t.track || "Unassigned"}
                                </span>
                              </td>
                              <td className="py-3.5 px-4">
                                {t.gitRepoUrl || t.submissionUrl ? (
                                  <a
                                    href={t.gitRepoUrl || t.submissionUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-amber-400 underline hover:text-amber-300 text-xs flex items-center gap-1"
                                  >
                                    <Github className="w-4 h-4" />
                                    <span className="truncate max-w-[200px] block">{t.gitRepoUrl || t.submissionUrl}</span>
                                  </a>
                                ) : (
                                  <span className="text-gray-500 italic text-[10px]">No Link Submitted</span>
                                )}
                              </td>
                              <td className="py-3.5 px-4">
                                {t.projectFileUrl ? (
                                  <a
                                    href={t.projectFileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-emerald-400 underline hover:text-emerald-300 text-xs flex items-center gap-1"
                                  >
                                    <FileText className="w-4 h-4" />
                                    <span className="truncate max-w-[200px] block">{t.projectFileUrl}</span>
                                  </a>
                                ) : (
                                  <span className="text-gray-500 italic text-[10px]">No File Submitted</span>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-gray-500 italic">
                              No project submissions match your filter criteria.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  ) : (
                    <table className="w-full text-left border-collapse font-mono text-xs">
                      <thead>
                      <tr className="border-b border-white/10 text-gray-400 uppercase text-[10px]">
                        <th className="py-3 px-4">Team ID</th>
                        <th className="py-3 px-4">Team Name</th>
                        <th className="py-3 px-4">Leader & Phone</th>
                        <th className="py-3 px-4">Passcode</th>
                        <th className="py-3 px-4">Assigned Track</th>
                        <th className="py-3 px-4">Roster Lock</th>
                        <th className="py-3 px-4">Git Repo Link</th>
                        <th className="py-3 px-4">Presentation File</th>
                        <th className="py-3 px-4">Score</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {paginatedTeams.length > 0 ? (
                        paginatedTeams.map((t) => (
                          <tr key={t.id} className="hover:bg-white/5 transition-colors">
                            <td className="py-3.5 px-4 font-bold text-amber-400">{t.id}</td>
                            <td className="py-3.5 px-4 font-sans font-semibold text-white">{t.name}</td>
                            <td className="py-3.5 px-4">
                              <div className="font-sans font-semibold text-white">{t.leaderName || "Leader N/A"}</div>
                              <div className="text-[10px] text-gray-400">{t.leaderPhone || "No Phone"}</div>
                            </td>
                            <td className="py-3.5 px-4 text-amber-300 font-mono">{t.passcode}</td>
                            <td className="py-3.5 px-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                                t.track === "Quantum Technology"
                                  ? "bg-purple-950/80 border-purple-500/40 text-purple-300"
                                  : "bg-emerald-950/80 border-emerald-500/40 text-emerald-300"
                              }`}>
                                {t.track || "Unassigned"}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              {t.isRosterLocked ? (
                                <span className="px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/40 text-amber-400 text-[10px]">
                                  🔒 Locked
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[10px]">
                                  Open
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              {t.gitRepoUrl || t.submissionUrl ? (
                                <a
                                  href={t.gitRepoUrl || t.submissionUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-amber-400 underline hover:text-amber-300 text-[11px] flex items-center gap-1"
                                >
                                  <Github className="w-3 h-3" />
                                  <span>Git Repo ↗</span>
                                </a>
                              ) : (
                                <span className="text-gray-500 italic text-[10px]">Missing</span>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              {t.projectFileUrl ? (
                                <a
                                  href={t.projectFileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-emerald-400 underline hover:text-emerald-300 text-[11px] flex items-center gap-1"
                                >
                                  <FileText className="w-3 h-3" />
                                  <span>{t.projectFileName || "File"} ↗</span>
                                </a>
                              ) : (
                                <span className="text-gray-500 italic text-[10px]">No File</span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 font-bold text-amber-400">
                              {editingScoreId === t.id ? (
                                <div className="flex items-center gap-1">
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={tempScore}
                                    onChange={(e) => setTempScore(Number(e.target.value))}
                                    className="w-16 bg-black border border-amber-400 rounded px-1.5 py-0.5 text-amber-300 text-xs"
                                  />
                                  <button
                                    onClick={() => {
                                      handleAdminUpdateTeam(t.id, { score: tempScore });
                                      setEditingScoreId(null);
                                    }}
                                    className="px-2 py-0.5 rounded bg-emerald-500 text-black text-[10px] font-bold"
                                  >
                                    Save
                                  </button>
                                </div>
                              ) : (
                                <span
                                  onClick={() => {
                                    setEditingScoreId(t.id);
                                    setTempScore(t.score);
                                  }}
                                  className="cursor-pointer hover:underline"
                                  title="Click to edit score"
                                >
                                  {t.score} / 100
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-right flex items-center justify-end gap-1.5">
                              {t.isRosterLocked && (
                                <button
                                  onClick={() => handleAdminUpdateTeam(t.id, { isRosterLocked: false })}
                                  className="px-2 py-1 rounded bg-amber-950/80 border border-amber-500/40 text-[10px] text-amber-300 hover:text-amber-200"
                                  title="Unlock team roster for re-editing"
                                >
                                  Unlock
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setEditingScoreId(t.id);
                                  setTempScore(t.score);
                                }}
                                className="px-2.5 py-1 rounded bg-white/5 hover:bg-amber-950/80 border border-white/10 hover:border-amber-500/40 text-[10px] text-gray-300 hover:text-amber-300 transition-all"
                              >
                                Score
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={9} className="py-8 text-center text-gray-500 italic">
                            No team records match your filter criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  )}
                </div>

                {/* Pagination Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10 font-mono text-xs">
                  <div className="text-gray-400 text-[11px]">
                    Showing <strong className="text-white">{filteredTeams.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</strong> to{" "}
                    <strong className="text-white">{Math.min(currentPage * pageSize, filteredTeams.length)}</strong> of{" "}
                    <strong className="text-amber-400">{filteredTeams.length}</strong> teams
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-1.5 rounded-lg bg-white/5 border border-white/10 disabled:opacity-30 text-gray-300 hover:text-white"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-gray-300">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-1.5 rounded-lg bg-white/5 border border-white/10 disabled:opacity-30 text-gray-300 hover:text-white"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}
