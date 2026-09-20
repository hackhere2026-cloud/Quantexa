"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ShieldCheck,
  User,
  Lock,
  ArrowLeft,
  Terminal,
  Upload,
  UploadCloud,
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
  Phone,
  RotateCcw,
  Sparkles,
  Layers,
  Radio,
  Instagram,
  Linkedin,
  Globe,
  Twitter,
} from "lucide-react";
import TrackSpinWheel from "@/components/TrackSpinWheel";
import AdminEditTeamModal from "@/components/AdminEditTeamModal";
import AdminAddTeamModal from "@/components/AdminAddTeamModal";

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

export default function FinalPortalPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"team" | "admin">("team");
  const [loginMode, setLoginMode] = useState<"team" | "admin">("team");

  // Auth Inputs
  const [teamInput, setTeamInput] = useState("");
  const [teamPassword, setTeamPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Error / Loading States
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Authenticated State (Synchronously restored from localStorage on reload to prevent state loss or login flash)
  const [currentTeam, setCurrentTeam] = useState<TeamRecord | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("quantexa_current_team");
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (e) {}
    }
    return null;
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      try {
        const storedAuth =
          localStorage.getItem("quantexa_auth") || localStorage.getItem("nexora_auth");
        if (storedAuth) {
          const parsed = JSON.parse(storedAuth);
          if (parsed.type === "admin") return true;
        }
      } catch (e) {}
    }
    return false;
  });

  const [adminPasskey, setAdminPasskey] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        const storedAuth =
          localStorage.getItem("quantexa_auth") || localStorage.getItem("nexora_auth");
        if (storedAuth) {
          const parsed = JSON.parse(storedAuth);
          if (parsed.type === "admin") return parsed.passkey || "9442777855";
        }
      } catch (e) {}
    }
    return "";
  });

  // Submission Form State (Git Link & Presentation Drive Link with draft persistence)
  const [gitRepoUrl, setGitRepoUrl] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        const savedTeamStr = localStorage.getItem("quantexa_current_team");
        if (savedTeamStr) {
          const t = JSON.parse(savedTeamStr);
          const draft = localStorage.getItem(`quantexa_draft_git_${t.id}`);
          return draft || t.gitRepoUrl || t.submissionUrl || "";
        }
      } catch (e) {}
    }
    return "";
  });

  const [projectFileUrl, setProjectFileUrl] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        const savedTeamStr = localStorage.getItem("quantexa_current_team");
        if (savedTeamStr) {
          const t = JSON.parse(savedTeamStr);
          const draft = localStorage.getItem(`quantexa_draft_ppt_${t.id}`);
          return draft || t.projectFileUrl || "";
        }
      } catch (e) {}
    }
    return "";
  });

  const [projectFileName, setProjectFileName] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        const savedTeamStr = localStorage.getItem("quantexa_current_team");
        if (savedTeamStr) {
          const t = JSON.parse(savedTeamStr);
          return t.projectFileName || (t.projectFileUrl ? "Drive Link" : "");
        }
      } catch (e) {}
    }
    return "";
  });

  // Team Details State (Read-only verified roster)
  const [leaderName, setLeaderName] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        const savedTeamStr = localStorage.getItem("quantexa_current_team");
        if (savedTeamStr) {
          const t = JSON.parse(savedTeamStr);
          return t.leaderName || "Team Leader";
        }
      } catch (e) {}
    }
    return "";
  });

  const [leaderPhone, setLeaderPhone] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        const savedTeamStr = localStorage.getItem("quantexa_current_team");
        if (savedTeamStr) {
          const t = JSON.parse(savedTeamStr);
          return t.leaderPhone || "";
        }
      } catch (e) {}
    }
    return "";
  });

  const [leaderEmail, setLeaderEmail] = useState<string>("");
  const [memberList, setMemberList] = useState<TeamMember[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const savedTeamStr = localStorage.getItem("quantexa_current_team");
        if (savedTeamStr) {
          const t = JSON.parse(savedTeamStr);
          if (Array.isArray(t.memberList) && t.memberList.length > 0) {
            return t.memberList;
          }
        }
      } catch (e) {}
    }
    return [];
  });

  // Admin Data & Search/Filter
  const [adminView, setAdminView] = useState<"database" | "rosters" | "submissions">("database");
  const [teamsList, setTeamsList] = useState<TeamRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterTrack, setFilterTrack] = useState("ALL");
  const [filterReveal, setFilterReveal] = useState("ALL");
  const [filterSubmissions, setFilterSubmissions] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [lastSyncTime, setLastSyncTime] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Admin Modals & Editing Full Power
  const [editingTeam, setEditingTeam] = useState<TeamRecord | null>(null);
  const [isSavingTeam, setIsSavingTeam] = useState(false);
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkJsonInput, setBulkJsonInput] = useState("");
  const [parsedPreview, setParsedPreview] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Editing Score State for Admin
  const [editingScoreId, setEditingScoreId] = useState<string | null>(null);
  const [tempScore, setTempScore] = useState<number>(0);

  // Suggested next team ID
  const suggestedNextId = useMemo(() => {
    const highest = teamsList.reduce((max, t) => {
      const match = t.id.match(/\d+/);
      if (match) {
        const num = parseInt(match[0], 10);
        return num > max ? num : max;
      }
      return max;
    }, 0);
    return `QUAN${String(highest + 1).padStart(3, "0")}`;
  }, [teamsList]);

  // Fetch all teams
  const fetchTeams = async () => {
    try {
      const res = await fetch("/api/teams?t=" + Date.now(), { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.teams)) {
        setTeamsList(data.teams);
        setLastSyncTime(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error("Failed to fetch teams:", err);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchTeams();
  }, []);

  // Real-Time Dynamic Sync Polling for Admin View
  useEffect(() => {
    if (!isAdminLoggedIn) return;
    setLastSyncTime(new Date().toLocaleTimeString());
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/teams?t=" + Date.now(), { cache: "no-store" });
        const data = await res.json();
        if (data.success && Array.isArray(data.teams)) {
          setTeamsList(data.teams);
          setLastSyncTime(new Date().toLocaleTimeString());
        }
      } catch (err) {
        // silent fail on network hiccups
      }
    }, 3500);
    return () => clearInterval(interval);
  }, [isAdminLoggedIn]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("quantexa_auth");
      localStorage.removeItem("nexora_auth");
      localStorage.removeItem("quantexa_current_team");
      if (currentTeam?.id) {
        localStorage.removeItem(`quantexa_draft_git_${currentTeam.id}`);
        localStorage.removeItem(`quantexa_draft_ppt_${currentTeam.id}`);
      }
    }
    setActiveTab("team");
    setIsAdminLoggedIn(false);
    setCurrentTeam(null);
    setTeamInput("");
    setTeamPassword("");
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/teams?t=" + Date.now(), { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.teams)) {
        setTeamsList(data.teams);
        setLastSyncTime(new Date().toLocaleTimeString());
        setSuccessMsg("Teams database synced dynamically!");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const storedAuth =
      localStorage.getItem("quantexa_auth") || localStorage.getItem("nexora_auth");
    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth);
        if (parsed.type === "admin") {
          setIsAdminLoggedIn(true);
          setAdminPasskey(parsed.passkey || "9442777855");
          setActiveTab("admin");
        } else if (parsed.type === "team") {
          // Only show full loading indicator if team wasn't already loaded from localStorage
          if (!currentTeam) {
            setIsLoading(true);
          }
          fetch("/api/auth/team", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ teamId: parsed.teamId, passcode: parsed.passcode }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.success) {
                setIsAdminLoggedIn(false);
                populateTeamState(data.team);
                setActiveTab("team");
              } else {
                localStorage.removeItem("quantexa_auth");
                localStorage.removeItem("nexora_auth");
                localStorage.removeItem("quantexa_current_team");
                setCurrentTeam(null);
              }
            })
            .catch(() => {
              // Network blip - keep currentTeam from localStorage so participant never loses view
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
        (t.track && t.track.toLowerCase().includes(q)) ||
        (t.gitRepoUrl && t.gitRepoUrl.toLowerCase().includes(q)) ||
        (t.projectFileUrl && t.projectFileUrl.toLowerCase().includes(q)) ||
        (t.status && t.status.toLowerCase().includes(q)) ||
        (t.problemStatement && t.problemStatement.toLowerCase().includes(q));

      const matchesStatus = filterStatus === "ALL" || t.status === filterStatus;

      const matchesTrack =
        filterTrack === "ALL" ||
        (filterTrack === "FinTech Track" && t.track?.includes("FinTech")) ||
        (filterTrack === "Quantum and Social Welfare Track" &&
          (t.track?.includes("Quantum") || t.track?.includes("Social")));

      const matchesReveal =
        filterReveal === "ALL" ||
        (filterReveal === "Revealed" && t.isTrackRevealed) ||
        (filterReveal === "Pending" && !t.isTrackRevealed);

      const matchesSubmissions =
        filterSubmissions === "ALL" ||
        (filterSubmissions === "Has GitHub" && Boolean(t.gitRepoUrl)) ||
        (filterSubmissions === "Has PPT" && Boolean(t.projectFileUrl)) ||
        (filterSubmissions === "Both Submitted" && Boolean(t.gitRepoUrl && t.projectFileUrl)) ||
        (filterSubmissions === "Missing" && (!t.gitRepoUrl || !t.projectFileUrl));

      return matchesQuery && matchesStatus && matchesTrack && matchesReveal && matchesSubmissions;
    });
  }, [teamsList, searchQuery, filterStatus, filterTrack, filterReveal, filterSubmissions]);

  const totalPages = Math.ceil(filteredTeams.length / pageSize) || 1;
  const paginatedTeams = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTeams.slice(start, start + pageSize);
  }, [filteredTeams, currentPage, pageSize]);

  // Sync team form states when logged in & guard against reload resets
  const populateTeamState = (team: TeamRecord) => {
    let isTrackRevealed = Boolean(team.isTrackRevealed);
    if (!isTrackRevealed && typeof window !== "undefined") {
      const localRevealed =
        localStorage.getItem(`quantexa_track_revealed_${team.id}`) === "true" ||
        localStorage.getItem(`nexora_track_revealed_${team.id}`) === "true";
      if (localRevealed) {
        isTrackRevealed = true;
      }
    }

    const mergedTeam: TeamRecord = {
      ...team,
      isTrackRevealed,
    };

    setCurrentTeam(mergedTeam);

    const savedGit = mergedTeam.gitRepoUrl || mergedTeam.submissionUrl || "";
    const savedPpt = mergedTeam.projectFileUrl || "";
    const savedPptName = mergedTeam.projectFileName || (savedPpt ? "Presentation File" : "");

    let activeGit = savedGit;
    let activePpt = savedPpt;
    if (typeof window !== "undefined") {
      const draftGit = localStorage.getItem(`quantexa_draft_git_${mergedTeam.id}`);
      const draftPpt = localStorage.getItem(`quantexa_draft_ppt_${mergedTeam.id}`);
      if (draftGit && !savedGit) activeGit = draftGit;
      if (draftPpt && !savedPpt) activePpt = draftPpt;
    }

    setGitRepoUrl(activeGit);
    setProjectFileUrl(activePpt);
    setProjectFileName(savedPptName);
    setLeaderName(mergedTeam.leaderName || "Team Leader");
    setLeaderPhone(mergedTeam.leaderPhone || "");
    setLeaderEmail(mergedTeam.leaderEmail || "");

    const size = mergedTeam.membersCount || mergedTeam.memberList?.length || 4;
    const initialMembers: TeamMember[] = [];

    if (mergedTeam.memberList && Array.isArray(mergedTeam.memberList) && mergedTeam.memberList.length > 0) {
      mergedTeam.memberList.forEach((m, i) => {
        initialMembers.push({
          name: m.name || (i === 0 ? mergedTeam.leaderName || "" : ""),
          role: m.role || (i === 0 ? "Team Lead" : `Team Member ${i}`),
          phone: i === 0 ? (m.phone || mergedTeam.leaderPhone || "") : (m.phone || ""),
        });
      });
    } else {
      initialMembers.push({
        name: mergedTeam.leaderName || "Team Leader",
        role: "Team Lead",
        phone: mergedTeam.leaderPhone || "",
      });
    }

    while (initialMembers.length < size) {
      initialMembers.push({
        name: "",
        role: `Team Member ${initialMembers.length}`,
      });
    }

    setMemberList(initialMembers);

    if (typeof window !== "undefined") {
      localStorage.setItem("quantexa_current_team", JSON.stringify(mergedTeam));
      if (isTrackRevealed) {
        localStorage.setItem(`quantexa_track_revealed_${mergedTeam.id}`, "true");
      }
    }
  };

  const handleTrackRevealed = () => {
    if (currentTeam) {
      const updated: TeamRecord = { ...currentTeam, isTrackRevealed: true };
      setCurrentTeam(updated);
      if (typeof window !== "undefined") {
        localStorage.setItem("quantexa_current_team", JSON.stringify(updated));
        localStorage.setItem(`quantexa_track_revealed_${currentTeam.id}`, "true");
      }
    }
  };

  // Login Handler (Supports Team Logins AND Admin Access via ID: guru, Pass: 9442777855)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);

    const inputLower = teamInput.trim().toLowerCase();
    const passTrim = teamPassword.trim();

    // Check if logging in as Admin (loginMode === "admin" or ID: "guru" / "admin")
    if (
      loginMode === "admin" ||
      inputLower === "guru" ||
      inputLower === "admin"
    ) {
      try {
        const passkeyToUse = passTrim;
        const userToUse = inputLower;

        if (!userToUse || !passkeyToUse) {
          setErrorMsg("Please enter both Admin ID and Password.");
          setIsLoading(false);
          return;
        }

        const res = await fetch("/api/auth/admin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ passkey: passkeyToUse, username: userToUse }),
        });
        const data = await res.json();

        if (data.success) {
          setIsAdminLoggedIn(true);
          setAdminPasskey(passkeyToUse);
          setTeamsList(data.teams);
          setActiveTab("admin");
          setSuccessMsg(`Master Admin Authenticated! Managing ${data.teams.length} teams.`);
          localStorage.setItem(
            "quantexa_auth",
            JSON.stringify({ type: "admin", passkey: passkeyToUse, username: userToUse })
          );
          setIsLoading(false);
          return;
        } else {
          setErrorMsg(data.message || "Invalid Admin Credentials.");
          setIsLoading(false);
          return;
        }
      } catch (err) {
        setErrorMsg("Failed to connect to Admin authentication server.");
        setIsLoading(false);
        return;
      }
    }

    // Standard Team Authentication with Vercel Cold-Start Resilience & Auto-Retry
    let attempts = 0;
    const maxAttempts = 2;
    while (attempts < maxAttempts) {
      attempts++;
      try {
        const res = await fetch("/api/auth/team", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ teamId: teamInput, passcode: teamPassword }),
        });
        const data = await res.json().catch(() => null);

        if (res.ok && data?.success) {
          setIsAdminLoggedIn(false);
          populateTeamState(data.team);
          setActiveTab("team");
          setErrorMsg("");
          setSuccessMsg("");
          if (typeof window !== "undefined") {
            localStorage.setItem(
              "quantexa_auth",
              JSON.stringify({ type: "team", teamId: teamInput, passcode: teamPassword })
            );
            localStorage.setItem("quantexa_current_team", JSON.stringify(data.team));
          }
          setIsLoading(false);
          return;
        } else if (res.status === 401 || data?.message?.toLowerCase().includes("invalid") || data?.message?.toLowerCase().includes("required")) {
          // Explicit invalid credentials - no need to retry
          setErrorMsg(data?.message || "Invalid Team ID or Passcode.");
          setIsLoading(false);
          return;
        } else if (attempts < maxAttempts) {
          // Wait 400ms and retry once if server had a brief cold-start glitch
          await new Promise((r) => setTimeout(r, 400));
          continue;
        } else {
          setErrorMsg(data?.message || "Authentication error. Please check your credentials or try again.");
          setIsLoading(false);
          return;
        }
      } catch (err) {
        if (attempts < maxAttempts) {
          await new Promise((r) => setTimeout(r, 400));
          continue;
        }
        setErrorMsg("Unable to reach server. Please check your internet connection or try again.");
      }
    }
    setIsLoading(false);
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
        if (typeof window !== "undefined" && currentTeam) {
          localStorage.setItem(`quantexa_draft_ppt_${currentTeam.id}`, data.fileUrl);
          const updated = {
            ...currentTeam,
            projectFileUrl: data.fileUrl,
            projectFileName: data.fileName,
          };
          localStorage.setItem("quantexa_current_team", JSON.stringify(updated));
        }
        setSuccessMsg("Presentation file uploaded successfully!");
      } else {
        setErrorMsg(data.message || "File upload failed.");
      }
    } catch (err) {
      setErrorMsg("Error uploading presentation file.");
    } finally {
      setIsUploading(false);
    }
  };

  // Save Final Submissions (Git Link + File)
  const handleSaveSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTeam) return;

    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const isRevealed =
      Boolean(currentTeam.isTrackRevealed) ||
      (typeof window !== "undefined" &&
        (localStorage.getItem(`quantexa_track_revealed_${currentTeam.id}`) === "true" ||
          localStorage.getItem(`nexora_track_revealed_${currentTeam.id}`) === "true"));

    try {
      const res = await fetch("/api/teams/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId: currentTeam.id,
          passcode: currentTeam.passcode,
          gitRepoUrl,
          projectFileUrl,
          projectFileName: projectFileName || "Presentation File",
          isTrackRevealed: isRevealed,
        }),
      });
      const data = await res.json();

      if (data.success) {
        populateTeamState(data.team);
        if (typeof window !== "undefined") {
          localStorage.removeItem(`quantexa_draft_git_${currentTeam.id}`);
          localStorage.removeItem(`quantexa_draft_ppt_${currentTeam.id}`);
        }
        setSuccessMsg("Submissions updated successfully!");
        fetchTeams();
      } else {
        setErrorMsg(data.message || "Failed to update submissions.");
      }
    } catch (err) {
      setErrorMsg("Submission error.");
    } finally {
      setIsLoading(false);
    }
  };

  // Save Team Changes by Admin (Full Power)
  const handleAdminSaveTeam = async (teamId: string, updates: Partial<TeamRecord>) => {
    setIsSavingTeam(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/update-team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passkey: adminPasskey || "9442777855",
          username: "guru",
          teamId,
          ...updates,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTeamsList(data.allTeams);
        setEditingTeam(null);
        setSuccessMsg(`Team "${updates.name || teamId}" details updated successfully!`);
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        setErrorMsg(data.message || "Failed to update team.");
      }
    } catch (err) {
      setErrorMsg("Error updating team details.");
    } finally {
      setIsSavingTeam(false);
    }
  };

  // Delete Team by Admin
  const handleAdminDeleteTeam = async (teamId: string) => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/delete-team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passkey: adminPasskey || "9442777855",
          username: "guru",
          teamId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTeamsList(data.allTeams);
        setEditingTeam(null);
        setSuccessMsg(`Team ${teamId} has been successfully deleted.`);
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        setErrorMsg(data.message || "Failed to delete team.");
      }
    } catch (err) {
      setErrorMsg("Error deleting team.");
    } finally {
      setIsLoading(false);
    }
  };

  // Add New Team by Admin (Full Power)
  const handleAdminAddTeam = async (teamData: any) => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/add-team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passkey: adminPasskey || "9442777855",
          username: "guru",
          team: teamData,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTeamsList(data.allTeams);
        setShowAddTeam(false);
        setSuccessMsg(data.message || "Team created and added to database!");
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        setErrorMsg(data.message || "Failed to add team.");
      }
    } catch (err) {
      setErrorMsg("Error creating team.");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset all 145 reveals to superposed card state
  const handleResetAllReveals = async () => {
    if (!confirm("Are you sure you want to reset all team track reveals back to superposed moving cards?")) {
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/reset-reveals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passkey: adminPasskey || "9442777855",
          username: "guru",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTeamsList(data.teams);
        setSuccessMsg("All 145 team cards reset to unrevealed state!");
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        setErrorMsg(data.message || "Reset failed.");
      }
    } catch (err) {
      setErrorMsg("Error resetting team reveals.");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to parse 10-Column Row (Columns A to J)
  const parse10ColumnRow = (parts: string[], idx: number) => {
    let offset = 0;
    // If parts[0] is numeric Sno (e.g. 1, 2) and parts.length >= 6, then Col B is TEAM ID
    if (/^\d+$/.test(parts[0]) && parts.length >= 6) {
      offset = 1;
    }

    const id = parts[offset] ? parts[offset].toUpperCase().trim() : `QTX-${idx + 101}`;
    const name = parts[offset + 1] ? parts[offset + 1].trim() : `Team ${id}`;
    const teamSize = parseInt(parts[offset + 2], 10) || 4;
    const leaderName = parts[offset + 3] ? parts[offset + 3].trim() : "Team Leader";
    const leaderPhone = parts[offset + 4] ? parts[offset + 4].trim() : "";
    const passcode = leaderPhone || `pass${idx + 1}`;

    const rawM1 = parts[offset + 5] ? parts[offset + 5].trim() : "";
    const rawM2 = parts[offset + 6] ? parts[offset + 6].trim() : "";
    const rawM3 = parts[offset + 7] ? parts[offset + 7].trim() : "";
    const rawM4 = parts[offset + 8] ? parts[offset + 8].trim() : "";

    const memberList: TeamMember[] = [
      {
        name: leaderName,
        role: "Team Lead",
        phone: leaderPhone,
      },
    ];

    const otherMembers = [rawM1, rawM2, rawM3, rawM4].filter(
      (m) => m && m !== "-" && m !== "N/A" && m.toLowerCase() !== leaderName.toLowerCase()
    );

    otherMembers.forEach((memName, mIdx) => {
      if (memberList.length < teamSize) {
        memberList.push({
          name: memName,
          role: memberList.length === 1 ? "Member" : `Member ${memberList.length + 1}`,
        });
      }
    });

    while (memberList.length < teamSize) {
      memberList.push({
        name: "",
        role: memberList.length === 1 ? "Member" : `Member ${memberList.length + 1}`,
      });
    }

    return {
      id,
      name,
      membersCount: teamSize,
      leaderName,
      leaderPhone,
      passcode,
      memberList,
    };
  };

  // Upload and parse Excel (.xlsx, .xls) or CSV files directly
  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);

    try {
      const XLSX = await import("xlsx");
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rawRows: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const parsed: any[] = [];
      rawRows.forEach((row, rIdx) => {
        if (!row || !Array.isArray(row) || row.length < 3) return;
        const parts = row.map((c) => (c !== undefined && c !== null ? String(c).trim() : ""));
        const first = parts[0]?.toLowerCase() || "";
        const second = parts[1]?.toLowerCase() || "";
        if (
          first === "sno" ||
          first === "s.no" ||
          first === "sl no" ||
          first === "sl.no" ||
          first === "column" ||
          first === "#" ||
          second === "team id" ||
          second === "teamid"
        ) {
          return;
        }

        const teamObj = parse10ColumnRow(parts, rIdx);
        if (teamObj.id) {
          parsed.push(teamObj);
        }
      });

      if (parsed.length > 0) {
        setParsedPreview(parsed);
        setSuccessMsg(`Extracted ${parsed.length} teams from ${file.name}! Click "Import All Teams" below to save to DB.`);
      } else {
        setErrorMsg("No valid team records found in uploaded file.");
      }
    } catch (err: any) {
      setErrorMsg("Failed to parse file: " + (err?.message || "Unknown error"));
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Bulk Import Teams from 10-Column Excel / CSV / TSV / Markdown data
  const handleBulkImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);

    try {
      let parsedData: any[] = [];

      // If user uploaded an Excel file and has parsedPreview ready
      if (parsedPreview.length > 0 && !bulkJsonInput.trim()) {
        parsedData = parsedPreview;
      } else {
        try {
          parsedData = JSON.parse(bulkJsonInput);
        } catch (err) {
          const lines = bulkJsonInput.trim().split(/\r?\n/);

          for (let idx = 0; idx < lines.length; idx++) {
            const rawLine = lines[idx].trim();
            if (!rawLine) continue;

            // Detect separator: Pipe | (Markdown), Tab \t, Semicolon ;, or Comma ,
            let parts: string[] = [];
            if (rawLine.includes("|")) {
              parts = rawLine.split("|").map((p) => p.trim());
              if (parts.length > 0 && parts[0] === "") parts.shift();
              if (parts.length > 0 && parts[parts.length - 1] === "") parts.pop();
              if (parts.every((p) => /^-+$/.test(p) || p === "")) continue;
            } else if (rawLine.includes("\t")) {
              parts = rawLine.split("\t").map((p) => p.trim());
            } else if (rawLine.includes(";") && !rawLine.includes(",")) {
              parts = rawLine
                .split(";")
                .map((p) => p.replace(/^["']|["']$/g, "").trim());
            } else {
              parts = rawLine
                .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
                .map((p) => p.replace(/^["']|["']$/g, "").trim());
            }

            // Skip header row if present
            const firstCol = (parts[0] || "").toLowerCase().trim();
            const secondCol = (parts[1] || "").toLowerCase().trim();
            if (
              firstCol === "sno" ||
              firstCol === "s.no" ||
              firstCol === "sl no" ||
              firstCol === "sl.no" ||
              firstCol === "column" ||
              firstCol === "#" ||
              secondCol === "team id" ||
              secondCol === "teamid" ||
              secondCol.includes("team name") ||
              secondCol.includes("team")
            ) {
              continue;
            }

            if (parts.length >= 3) {
              const teamObj = parse10ColumnRow(parts, idx);
              if (teamObj.id) {
                parsedData.push(teamObj);
              }
            }
          }
        }
      }

      if (parsedData.length === 0) {
        setErrorMsg("No valid team data rows found. Please check format.");
        setIsLoading(false);
        return;
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
        setParsedPreview([]);
        setSuccessMsg(data.message || `Imported ${parsedData.length} teams successfully!`);
      } else {
        setErrorMsg(data.message || "Bulk import failed.");
      }
    } catch (err) {
      setErrorMsg("Error parsing or importing team records.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) {
    return (
      <main className="min-h-screen bg-[#08090C] text-white relative overflow-hidden flex flex-col items-center justify-center font-sans">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#D4A843]/10 rounded-full blur-[190px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[550px] h-[550px] bg-[#C9952E]/10 rounded-full blur-[190px] pointer-events-none" />
        <div className="flex flex-col items-center gap-4 relative z-10">
          <div className="w-10 h-10 rounded-full border-2 border-amber-400/30 border-t-amber-400 animate-spin" />
          <span className="text-xs font-mono text-amber-300 tracking-widest uppercase">QUANTEXA PORTAL INITIALIZING...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#08090C] text-white relative overflow-hidden flex flex-col font-sans selection:bg-[#D4A843] selection:text-black">
      {/* Background Ambient Glows - Quantexa Warm Gold & Crimson */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#D4A843]/10 rounded-full blur-[190px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[550px] h-[550px] bg-[#C9952E]/10 rounded-full blur-[190px] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="sticky top-0 z-50 bg-[#08090C]/90 backdrop-blur-xl border-b border-amber-500/30 px-4 sm:px-8 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/5 border border-amber-500/40 hover:border-amber-400 text-xs font-mono text-amber-300 transition-all shadow-[0_0_15px_rgba(212,168,67,0.2)]"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span className="font-semibold">Back to Quantexa</span>
        </Link>

        {(isAdminLoggedIn || currentTeam) && (
          <button
            onClick={handleLogout}
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
            /* ================= DUAL AUTHENTICATION CARD (PARTICIPANT & MASTER ADMIN) ================= */
            <motion.div
              key="portal-login"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-xl sm:max-w-2xl mx-auto pt-4 sm:pt-8"
            >
              <div className="glass-panel p-8 sm:p-12 rounded-[2.5rem] border-2 border-amber-500/40 bg-gradient-to-b from-amber-950/25 via-[#0c0d12] to-black space-y-8 shadow-[0_0_50px_rgba(212,168,67,0.2)]">
                {/* Mode Selector Tabs */}
                <div className="flex bg-black/60 p-1.5 rounded-2xl border border-white/10 w-fit mx-auto font-mono text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMode("team");
                      setTeamInput("");
                      setTeamPassword("");
                      setErrorMsg("");
                    }}
                    className={`px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 ${
                      loginMode === "team"
                        ? "bg-amber-400 text-black shadow-[0_0_15px_rgba(212,168,67,0.4)]"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>Participant Portal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLoginMode("admin");
                      setTeamInput("");
                      setTeamPassword("");
                      setErrorMsg("");
                    }}
                    className={`px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 ${
                      loginMode === "admin"
                        ? "bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-[0_0_15px_rgba(255,100,0,0.4)]"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Master Admin Console</span>
                  </button>
                </div>

                <div className="text-center space-y-3">
                  <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-lg transition-all ${
                    loginMode === "admin"
                      ? "bg-red-950/90 border-2 border-red-500/50 text-amber-400 shadow-[0_0_25px_rgba(255,50,0,0.35)]"
                      : "bg-amber-950/90 border-2 border-amber-500/50 text-amber-400 shadow-[0_0_25px_rgba(212,168,67,0.35)]"
                  }`}>
                    {loginMode === "admin" ? <Shield className="w-8 h-8 text-amber-400" /> : <Key className="w-8 h-8" />}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-wide">
                    {loginMode === "admin" ? (
                      <>MASTER <span className="text-amber-400">ADMIN LOGIN</span></>
                    ) : (
                      <>TEAM <span className="text-amber-400">AUTHENTICATION</span></>
                    )}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-300 font-sans max-w-md mx-auto">
                    {loginMode === "admin"
                      ? "Master Administrator access for complete database control, team roster editing, and real-time live monitoring."
                      : "Connect to your team account to access official tracks, guidelines, and submission links."}
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6 font-mono text-xs sm:text-sm">
                  <div className="space-y-2">
                    <label className="text-amber-400 uppercase tracking-widest text-xs font-bold block">
                      {loginMode === "admin" ? "Admin ID" : "ID (Team ID)"}
                    </label>
                    <div className="relative">
                      <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={teamInput}
                        onChange={(e) => setTeamInput(e.target.value)}
                        placeholder={loginMode === "admin" ? "Enter Admin ID" : "e.g. QUAN001"}
                        className="w-full bg-black/70 border border-white/15 focus:border-amber-400 rounded-2xl pl-12 pr-4 py-4 sm:py-4.5 text-white text-sm sm:text-base placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-400/30 transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-amber-400 uppercase tracking-widest text-xs font-bold block">
                      {loginMode === "admin" ? "Master Password" : "Password (Team Lead Number)"}
                    </label>
                    <div className="relative">
                      <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={teamPassword}
                        onChange={(e) => setTeamPassword(e.target.value)}
                        placeholder={loginMode === "admin" ? "••••••••••••" : "e.g. 9342141436"}
                        className="w-full bg-black/70 border border-white/15 focus:border-amber-400 rounded-2xl pl-12 pr-12 py-4 sm:py-4.5 text-white text-sm sm:text-base placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-400/30 transition-all shadow-inner"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-400 transition-colors p-1"
                        title={showPassword ? "Hide Password" : "Show Password"}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-4 sm:py-5 rounded-2xl font-display text-sm sm:text-base font-black uppercase tracking-wider shadow-[0_0_30px_rgba(212,168,67,0.55)] transition-all flex items-center justify-center gap-2.5 mt-2 ${
                      loginMode === "admin"
                        ? "bg-gradient-to-r from-amber-400 via-amber-300 to-[#F0C755] text-black hover:brightness-110"
                        : "bg-gradient-to-r from-amber-400 via-[#F0C755] to-amber-500 hover:brightness-110 text-black"
                    }`}
                  >
                    {isLoading ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : loginMode === "admin" ? (
                      "Authenticate Administrator"
                    ) : (
                      "Connect Team Portal"
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          ) : currentTeam ? (
            (currentTeam.status === "Submitted" || currentTeam.gitRepoUrl) ? (
              /* ========================================================================= */
              /* FULL PAGE THANK YOU & OFFICIAL HACKHERE HANDLES SCREEN                   */
              /* ========================================================================= */
              <motion.div
                key="thank-you-full-page"
                initial={{ opacity: 0, scale: 0.97, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: -15 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-8 max-w-5xl mx-auto w-full pb-16"
              >
                {/* Top Status Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-black to-amber-950/30 border border-amber-500/40 font-mono text-xs shadow-md">
                  <div className="flex items-center gap-2.5">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 font-bold uppercase tracking-wider">FINAL SUBMISSION RECORDED & LOCKED</span>
                    <span className="text-gray-500 hidden sm:inline">|</span>
                    <span className="text-gray-400 hidden sm:inline">Team ID: <strong className="text-amber-300">{currentTeam.id}</strong></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleLogout}
                      className="px-3.5 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900/60 border border-red-500/40 text-red-300 text-xs font-mono transition-all"
                    >
                      Logout
                    </button>
                  </div>
                </div>

                {/* Main Hero Celebration Card */}
                <div className="relative p-8 sm:p-14 rounded-3xl bg-gradient-to-b from-[#121624] via-[#0A0E1A] to-[#08090C] border border-amber-500/50 shadow-[0_0_80px_rgba(212,168,67,0.25)] overflow-hidden text-center">
                  {/* Background Radial Glow */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 bg-amber-500/20 rounded-full blur-[120px] pointer-events-none" />

                  {/* Celebration Icon */}
                  <div className="relative z-10 w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500/20 via-amber-400/30 to-amber-300/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-[0_0_40px_rgba(212,168,67,0.6)] mb-6">
                    <CheckCircle2 className="w-11 h-11 text-amber-400" />
                  </div>

                  {/* Super Title Pill */}
                  <div className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-400 text-xs font-mono uppercase tracking-[0.2em] mb-4 shadow-[0_0_20px_rgba(212,168,67,0.2)]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>HACKHERE • QUANTEXA 2026</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>

                  {/* Giant Headline */}
                  <h1 className="relative z-10 text-3xl sm:text-5xl lg:text-6xl font-display font-black text-white uppercase tracking-wider mb-4 drop-shadow-[0_0_35px_rgba(212,168,67,0.6)]">
                    Thank You For Participating!
                  </h1>

                  {/* Team Callout */}
                  <p className="relative z-10 text-base sm:text-xl font-mono text-amber-300 font-bold mb-3">
                    Team: <span className="text-white underline decoration-amber-400 underline-offset-4">{currentTeam.name}</span>{" "}
                    <span className="text-gray-400 text-sm">({currentTeam.id})</span>
                  </p>

                  <p className="relative z-10 text-xs sm:text-sm text-gray-300 font-sans leading-relaxed max-w-2xl mx-auto mb-8">
                    Congratulations on completing your 24-hour sprint at <strong className="text-amber-300">SNS iHub, Coimbatore</strong>! 
                    Your project submission for the <strong className="text-white">{currentTeam.track || "Quantexa 2026"}</strong> track has been officially recorded and queued for jury evaluation.
                  </p>

                  {/* Challenge Statement Banner */}
                  {currentTeam.problemStatement && (
                    <div className="relative z-10 max-w-2xl mx-auto p-4 rounded-2xl bg-black/60 border border-amber-500/30 text-left mb-8 font-mono text-xs">
                      <span className="text-amber-400 font-bold uppercase text-[10px] block mb-1">
                        // ASSIGNED CHALLENGE TRACK
                      </span>
                      <p className="text-white font-semibold">{currentTeam.problemStatement}</p>
                    </div>
                  )}

                  {/* Verified Links Cards */}
                  <div className="relative z-10 max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-left font-mono text-xs mb-8">
                    {/* GitHub Link Card */}
                    <div className="p-4 rounded-2xl bg-black/70 border border-white/15 space-y-2 hover:border-amber-400/50 transition-all">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-[11px] flex items-center gap-1.5 uppercase font-bold">
                          <Github className="w-4 h-4 text-white" /> Git Repository
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[10px]">
                          Required ✓
                        </span>
                      </div>
                      <div className="truncate text-amber-300 font-semibold text-xs">
                        {currentTeam.gitRepoUrl || gitRepoUrl || "Not Provided"}
                      </div>
                      {(currentTeam.gitRepoUrl || gitRepoUrl) && (
                        <a
                          href={currentTeam.gitRepoUrl || gitRepoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:text-white hover:underline pt-1"
                        >
                          <span>Open Repository</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    {/* Presentation Link Card */}
                    <div className="p-4 rounded-2xl bg-black/70 border border-white/15 space-y-2 hover:border-emerald-400/50 transition-all">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-[11px] flex items-center gap-1.5 uppercase font-bold">
                          <FileText className="w-4 h-4 text-emerald-400" /> Presentation Link
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400 text-[10px]">
                          Optional
                        </span>
                      </div>
                      <div className="truncate text-emerald-300 font-semibold text-xs">
                        {currentTeam.projectFileUrl || projectFileUrl || "Not Provided"}
                      </div>
                      {(currentTeam.projectFileUrl || projectFileUrl) && (
                        <a
                          href={currentTeam.projectFileUrl || projectFileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-white hover:underline pt-1"
                        >
                          <span>Open Drive Link</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Locked Submission Status (No updation allowed) */}
                  <div className="relative z-10 flex items-center justify-center">
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 font-mono text-xs uppercase tracking-widest shadow-[0_0_25px_rgba(0,255,150,0.25)]">
                      <Lock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Final Submission Locked • No Further Updates Permitted</span>
                    </div>
                  </div>
                </div>

                {/* Section 2: Official Handles of HackHere (Full Width High-Impact Showcase) */}
                <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-amber-950/20 via-black to-purple-950/20 border border-amber-500/40 space-y-6 shadow-[0_0_50px_rgba(212,168,67,0.15)]">
                  <div className="text-center space-y-2">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono uppercase tracking-widest">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>STAY CONNECTED WITH THE BUILDER COMMUNITY</span>
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-wider">
                      Official Handles of <span className="bg-gradient-to-r from-white via-[#F0C755] to-[#D4A843] bg-clip-text text-transparent">HackHere</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 font-sans max-w-xl mx-auto">
                      Follow our official channels for live event photos, winner announcements, certificates, and future nationwide hackathons!
                    </p>
                  </div>

                  {/* 4 Social Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
                    {/* Instagram */}
                    <a
                      href="https://www.instagram.com/hackhere_connect?stkn=MW9tZjZ5ZmhiOXV4ag=="
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-5 rounded-2xl bg-gradient-to-b from-purple-950/40 via-pink-950/30 to-black border border-pink-500/30 hover:border-pink-400 transition-all hover:scale-105 group shadow-lg hover:shadow-[0_0_25px_rgba(236,72,153,0.35)] flex flex-col justify-between space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400 group-hover:scale-110 transition-transform">
                          <Instagram className="w-6 h-6" />
                        </div>
                        <ExternalLink className="w-4 h-4 text-pink-400 opacity-60 group-hover:opacity-100" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-pink-300 font-bold uppercase tracking-wider">Instagram</div>
                        <div className="text-sm font-bold text-white group-hover:text-pink-200 truncate">@hackhere_connect</div>
                        <p className="text-[11px] text-gray-400 font-sans leading-snug">
                          Live event stories, photos & winner reveals.
                        </p>
                      </div>
                    </a>

                    {/* LinkedIn */}
                    <a
                      href="https://www.linkedin.com/in/hackhere/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-5 rounded-2xl bg-gradient-to-b from-blue-950/40 via-[#0B1528] to-black border border-blue-500/30 hover:border-blue-400 transition-all hover:scale-105 group shadow-lg hover:shadow-[0_0_25px_rgba(59,130,246,0.35)] flex flex-col justify-between space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 group-hover:scale-110 transition-transform">
                          <Linkedin className="w-6 h-6" />
                        </div>
                        <ExternalLink className="w-4 h-4 text-blue-400 opacity-60 group-hover:opacity-100" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-blue-300 font-bold uppercase tracking-wider">LinkedIn</div>
                        <div className="text-sm font-bold text-white group-hover:text-blue-200 truncate">HackHere</div>
                        <p className="text-[11px] text-gray-400 font-sans leading-snug">
                          Networking, hiring partners & certificates.
                        </p>
                      </div>
                    </a>

                    {/* Website */}
                    <a
                      href="https://hackhere.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-5 rounded-2xl bg-gradient-to-b from-amber-950/40 via-[#1A1308] to-black border border-amber-500/30 hover:border-amber-400 transition-all hover:scale-105 group shadow-lg hover:shadow-[0_0_25px_rgba(212,168,67,0.35)] flex flex-col justify-between space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 group-hover:scale-110 transition-transform">
                          <Globe className="w-6 h-6" />
                        </div>
                        <ExternalLink className="w-4 h-4 text-amber-400 opacity-60 group-hover:opacity-100" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-amber-300 font-bold uppercase tracking-wider">Official Portal</div>
                        <div className="text-sm font-bold text-white group-hover:text-amber-200 truncate">hackhere.in</div>
                        <p className="text-[11px] text-gray-400 font-sans leading-snug">
                          Upcoming hackathons & community hub.
                        </p>
                      </div>
                    </a>

                    {/* Twitter / X */}
                    <a
                      href="https://x.com/hackhere"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-5 rounded-2xl bg-gradient-to-b from-gray-900/60 via-black to-black border border-white/20 hover:border-white/50 transition-all hover:scale-105 group shadow-lg hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] flex flex-col justify-between space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="p-3 rounded-xl bg-white/5 border border-white/20 text-white group-hover:scale-110 transition-transform">
                          <Twitter className="w-6 h-6" />
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400 opacity-60 group-hover:opacity-100" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] text-gray-300 font-bold uppercase tracking-wider">Twitter / X</div>
                        <div className="text-sm font-bold text-white group-hover:text-gray-200 truncate">@hackhere</div>
                        <p className="text-[11px] text-gray-400 font-sans leading-snug">
                          Tweet your project with #Quantexa2026.
                        </p>
                      </div>
                    </a>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* ========================================================================= */
              /* TEAM DASHBOARD (QUANTEXA BRAND COLOR THEME - GOLD AMBER + EMERALD)        */
              /* ========================================================================= */
              <motion.div
                key="team-dashboard"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
              {/* Team Header Banner (NO SCORE - QUANTEXA GOLD AMBER) */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/30 via-ink to-black border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
                <div className="space-y-1">
                  <span className="text-xs font-mono text-amber-400 font-bold">
                    // TEAM ID: {currentTeam.id}
                  </span>
                  <h1 className="text-2xl font-display font-extrabold text-white">
                    Welcome,{" "}
                    <span className="bg-gradient-to-r from-white via-[#F0C755] to-[#D4A843] bg-clip-text text-transparent">
                      {currentTeam.name}
                    </span>
                  </h1>
                </div>

                {/* Roster Lock Status Badge */}
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                  <div className="px-3.5 py-1.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-mono flex items-center gap-2 shadow-[0_0_15px_rgba(212,168,67,0.15)]">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Official Roster (Verified)</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-3.5 py-1.5 rounded-xl bg-red-950/60 border border-red-500/40 hover:bg-red-900/60 text-red-300 text-xs font-mono transition-all"
                  >
                    Logout
                  </button>
                </div>
              </div>

              {/* Section 1: Team Details (Strictly Non-Editable Verified Roster) */}
              <div className="glass-panel p-6 rounded-3xl border border-amber-500/30 bg-black/40 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-400 shadow-[0_0_15px_rgba(212,168,67,0.25)]">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-bold text-base text-white">Team Details</h3>
                        <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          Verified
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 font-sans">
                        Official verified participant roster for Quantexa 2026.
                      </p>
                    </div>
                  </div>

                  <div className="text-[11px] font-mono text-amber-400/80 bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-500/30">
                    Team Size: <strong className="text-white">{memberList.length} Members</strong>
                  </div>
                </div>

                {/* Display Member Cards (Strictly Non-Editable) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs pt-1">
                  {memberList.map((m, idx) => {
                    const isLead = idx === 0;
                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl flex flex-col justify-between space-y-3 transition-all ${
                          isLead
                            ? "bg-amber-950/30 border-2 border-amber-500/50 shadow-[0_0_20px_rgba(212,168,67,0.15)]"
                            : "bg-white/5 border border-white/10 hover:border-amber-500/40"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase border ${
                              isLead
                                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                                : "bg-white/10 text-gray-300 border-white/10"
                            }`}
                          >
                            {isLead ? "★ Team Leader" : `Team Member ${idx}`}
                          </span>
                          <User className={`w-4 h-4 ${isLead ? "text-amber-400" : "text-gray-500"}`} />
                        </div>

                        <div>
                          <div
                            className={`text-sm sm:text-base font-bold tracking-wide truncate ${
                              m.name ? (isLead ? "text-amber-200" : "text-white") : "text-gray-500 italic text-xs"
                            }`}
                          >
                            {m.name || "(Unassigned)"}
                          </div>

                          {isLead && (m.phone || currentTeam.leaderPhone) && (
                            <div className="text-[11px] text-amber-400/80 flex items-center gap-1.5 mt-1.5 font-sans">
                              <Phone className="w-3 h-3 text-amber-400" />
                              <span>{m.phone || currentTeam.leaderPhone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section 2: Interactive Domain Track & Problem Statement Card */}
              <TrackSpinWheel
                track={currentTeam.track || "Quantum Technology"}
                problemStatement={currentTeam.problemStatement}
                problemStatementFileUrl={currentTeam.problemStatementFileUrl}
                teamId={currentTeam.id}
                isTrackRevealed={currentTeam.isTrackRevealed}
                onReveal={handleTrackRevealed}
              />

              {/* Section 3: Submissions Section: Git Link + Presentation File (Quantexa Gold Theme) */}
              <div className="glass-panel p-6 rounded-3xl border border-amber-500/40 bg-gradient-to-r from-amber-950/20 via-ink to-black space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-400 shadow-[0_0_15px_rgba(212,168,67,0.25)]">
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
                          className="text-xs text-amber-300 hover:text-amber-200 hover:underline flex items-center gap-1"
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
                      onChange={(e) => {
                        setGitRepoUrl(e.target.value);
                        if (typeof window !== "undefined" && currentTeam?.id) {
                          localStorage.setItem(`quantexa_draft_git_${currentTeam.id}`, e.target.value);
                        }
                      }}
                      placeholder="https://github.com/your-team-name/quantexa-project"
                      className="w-full bg-black/80 border border-white/10 focus:border-amber-400 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none transition-all"
                    />
                  </div>

                  {/* 2. Presentation Drive Link (Optional) */}
                  <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-amber-400 font-bold uppercase text-[11px] flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-400" />
                        2. Project Presentation Drive Link <span className="text-gray-400 font-normal lowercase">(optional)</span>
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
                      value={projectFileUrl}
                      onChange={(e) => {
                        setProjectFileUrl(e.target.value);
                        setProjectFileName(e.target.value ? "Drive Link" : "");
                        if (typeof window !== "undefined" && currentTeam?.id) {
                          localStorage.setItem(`quantexa_draft_ppt_${currentTeam.id}`, e.target.value);
                        }
                      }}
                      placeholder="https://docs.google.com/presentation/d/... or Google Drive URL (Optional)"
                      className="w-full bg-black/80 border border-white/10 focus:border-amber-400 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none transition-all"
                    />
                    <p className="text-[10px] text-gray-400 font-sans">
                      💡 Tip: If submitting a Google Drive / Slide link, make sure sharing is set to <span className="text-amber-300">&ldquo;Anyone with the link can view&rdquo;</span>.
                    </p>
                  </div>

                  {/* Submit Links Button */}
                  <button
                    type="submit"
                    disabled={isLoading || isUploading}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-400 via-[#F0C755] to-amber-500 hover:brightness-110 text-black font-display text-sm font-extrabold uppercase tracking-wider shrink-0 transition-all shadow-[0_0_25px_rgba(212,168,67,0.4)] flex items-center justify-center gap-2"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Submit Project Links"}
                  </button>
                </form>

                {/* Official Handles Ribbon */}
                <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#0A0E1A] to-amber-950/30 border border-amber-500/40 space-y-3 shadow-[0_0_30px_rgba(212,168,67,0.15)]">
                  <div className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Official Handles of HackHere</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
                    <a
                      href="https://www.instagram.com/hackhere_connect?stkn=MW9tZjZ5ZmhiOXV4ag=="
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-purple-950/40 border border-pink-500/30 hover:border-pink-400 text-pink-300 hover:text-white transition-all group shadow-sm hover:shadow-[0_0_15px_rgba(236,72,153,0.3)]"
                    >
                      <Instagram className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform shrink-0" />
                      <div className="truncate">
                        <div className="text-[9px] text-gray-400 font-sans">Instagram</div>
                        <span className="text-[10px] font-bold">@hackhere_connect</span>
                      </div>
                    </a>
                    <a
                      href="https://www.linkedin.com/in/hackhere/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/30 hover:border-blue-400 text-blue-300 hover:text-white transition-all group shadow-sm hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                    >
                      <Linkedin className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform shrink-0" />
                      <div className="truncate">
                        <div className="text-[9px] text-gray-400 font-sans">LinkedIn</div>
                        <span className="text-[10px] font-bold">HackHere</span>
                      </div>
                    </a>
                    <a
                      href="https://hackhere.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 hover:border-amber-400 text-amber-300 hover:text-white transition-all group shadow-sm hover:shadow-[0_0_15px_rgba(212,168,67,0.3)]"
                    >
                      <Globe className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
                      <div className="truncate">
                        <div className="text-[9px] text-gray-400 font-sans">Website</div>
                        <span className="text-[10px] font-bold">hackhere.in</span>
                      </div>
                    </a>
                    <a
                      href="https://x.com/hackhere"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/15 hover:border-white/40 text-gray-200 hover:text-white transition-all group shadow-sm hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                    >
                      <Twitter className="w-4 h-4 text-gray-300 group-hover:scale-110 transition-transform shrink-0" />
                      <div className="truncate">
                        <div className="text-[9px] text-gray-400 font-sans">Twitter / X</div>
                        <span className="text-[10px] font-bold">@hackhere</span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        ) : (
            /* ================= MASTER ADMIN CONTROL CENTER ================= */
            <motion.div
              key="admin-dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {/* Top Admin Header Banner */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-red-950/40 via-[#0e0f16] to-black border border-amber-500/40 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-[0_0_40px_rgba(212,168,67,0.15)]">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="px-3 py-1 rounded-lg bg-gradient-to-r from-red-900/80 to-amber-900/80 border border-amber-500/50 text-amber-300 font-mono text-xs font-black tracking-wider flex items-center gap-1.5 shadow-sm">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                      MASTER ADMIN CONSOLE
                    </span>

                    {/* Live Real-Time Polling Beacon */}
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-mono text-[11px] shadow-[0_0_15px_rgba(0,255,150,0.25)]">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                      <span className="font-bold tracking-wide">LIVE DYNAMIC SYNC ACTIVE</span>
                      <span className="text-gray-400">({lastSyncTime || "polling..."})</span>
                    </div>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-display font-black text-white">
                    QUANTEXA <span className="text-amber-400">Master Database & Live Control</span>
                  </h1>
                  <p className="text-xs text-gray-300 font-sans max-w-2xl">
                    Full administrator control to view, add, and change all team details, track assignments, and live participant Git & Presentation updates.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={handleManualRefresh}
                    disabled={isRefreshing}
                    title="Force immediate dynamic refresh"
                    className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/40 text-gray-300 hover:text-white text-xs font-mono transition-all flex items-center gap-1.5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isRefreshing ? "animate-spin" : ""}`} />
                    <span>Sync Now</span>
                  </button>

                  <button
                    onClick={handleResetAllReveals}
                    disabled={isLoading}
                    title="Reset all 145 teams back to unrevealed state"
                    className="px-3.5 py-2 rounded-xl bg-purple-950/40 border border-purple-500/40 hover:bg-purple-900/50 text-purple-300 text-xs font-mono transition-all flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
                    <span>Reset All Cards</span>
                  </button>

                  <button
                    onClick={() => setShowAddTeam(true)}
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-display font-black uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_20px_rgba(212,168,67,0.5)] transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add New Team</span>
                  </button>

                  <button
                    onClick={() => setShowBulkImport(!showBulkImport)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-display font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,255,150,0.4)]"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Bulk Import</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="px-3.5 py-2 rounded-xl bg-red-950/60 border border-red-500/40 hover:bg-red-900/60 text-red-300 text-xs font-mono transition-all flex items-center gap-1.5"
                  >
                    <span>Logout</span>
                  </button>
                </div>
              </div>

              {/* KPI Metrics Summary Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
                <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Total Teams</span>
                  <div className="text-xl font-bold text-white flex items-center gap-2">
                    <span>{teamsList.length}</span>
                    <span className="text-[10px] text-amber-400 font-normal">Active</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                  <span className="text-[10px] text-emerald-400 uppercase tracking-wider block">FinTech Track</span>
                  <div className="text-xl font-bold text-emerald-300">
                    {teamsList.filter((t) => t.track?.includes("FinTech")).length}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-1">
                  <span className="text-[10px] text-purple-400 uppercase tracking-wider block">Quantum & Social</span>
                  <div className="text-xl font-bold text-purple-300">
                    {teamsList.filter((t) => t.track?.includes("Quantum") || t.track?.includes("Social")).length}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-1">
                  <span className="text-[10px] text-amber-400 uppercase tracking-wider block">Cards Revealed</span>
                  <div className="text-xl font-bold text-amber-300 flex items-center gap-1.5">
                    <span>{teamsList.filter((t) => t.isTrackRevealed).length}</span>
                    <span className="text-[10px] text-gray-400 font-normal">/ {teamsList.length}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-blue-950/20 border border-blue-500/30 space-y-1">
                  <span className="text-[10px] text-blue-400 uppercase tracking-wider block">GitHub Repos</span>
                  <div className="text-xl font-bold text-blue-300 flex items-center gap-1.5">
                    <span>{teamsList.filter((t) => Boolean(t.gitRepoUrl)).length}</span>
                    <span className="text-[10px] text-emerald-400 font-normal">Submitted</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-teal-950/20 border border-teal-500/30 space-y-1">
                  <span className="text-[10px] text-teal-400 uppercase tracking-wider block">Presentation PPT</span>
                  <div className="text-xl font-bold text-teal-300 flex items-center gap-1.5">
                    <span>{teamsList.filter((t) => Boolean(t.projectFileUrl)).length}</span>
                    <span className="text-[10px] text-emerald-400 font-normal">Uploaded</span>
                  </div>
                </div>
              </div>

              {/* Bulk Excel/CSV Import Box */}
              {showBulkImport && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-6 rounded-3xl bg-emerald-950/30 border border-emerald-500/40 space-y-4"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="font-display font-bold text-sm text-emerald-300 uppercase tracking-wider flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                      Bulk Upload Excel / CSV / Sheets (10-Column Format)
                    </h3>
                    <span className="text-[10px] font-mono text-emerald-300/80 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                      Standard Input Specification
                    </span>
                  </div>

                  {/* File Upload Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-black/40 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept=".xlsx, .xls, .csv"
                        onChange={handleExcelUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs flex items-center gap-2 border border-white/10 transition-all"
                      >
                        <UploadCloud className="w-4 h-4 text-emerald-400" />
                        Choose Excel (.xlsx / .csv) File
                      </button>
                      <span className="text-[11px] text-gray-400 font-sans">
                        or paste rows into the box below
                      </span>
                    </div>

                    {parsedPreview.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-emerald-300 font-mono">
                          ✓ {parsedPreview.length} teams extracted
                        </span>
                        <button
                          type="button"
                          onClick={() => setParsedPreview([])}
                          className="text-[11px] text-gray-400 hover:text-white underline font-mono"
                        >
                          Clear
                        </button>
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleBulkImport} className="space-y-3 font-mono text-xs">
                    <textarea
                      rows={6}
                      value={bulkJsonInput}
                      onChange={(e) => setBulkJsonInput(e.target.value)}
                      placeholder={`Paste Excel/Sheets rows (Header row is automatically ignored):\n1\tQUAN001\tBEYONDLOOP\t4\tSandhya.S\t9342141436\tAmutha Nila.A.R\tAkshara Nethra.N.P\tShree Varsha.M\n2\tQUAN002\tTechforge\t4\tAslam J\t7305373188\tSanjay S\tDharshn M.S\tYogesh S`}
                      className="w-full bg-black/70 border border-white/10 rounded-2xl p-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-400 text-xs font-mono leading-relaxed"
                    />
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowBulkImport(false);
                          setParsedPreview([]);
                        }}
                        className="px-4 py-2 rounded-xl bg-white/5 text-gray-300 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-2 rounded-xl bg-emerald-400 text-black font-display font-bold text-xs uppercase flex items-center gap-2 shadow-[0_0_15px_rgba(0,255,150,0.5)]"
                      >
                        {isLoading ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : parsedPreview.length > 0 ? (
                          `Confirm & Import ${parsedPreview.length} Teams`
                        ) : (
                          "Import All Teams into Database"
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Team Database Search & Multi-Filter Control Center */}
              <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-black/40 space-y-6">
                {/* Admin View Toggle */}
                <div className="flex bg-black/50 p-1.5 rounded-2xl border border-white/10 w-fit font-display text-xs uppercase tracking-wider font-bold overflow-x-auto">
                  <button
                    onClick={() => setAdminView("database")}
                    className={`px-4 py-2 rounded-xl transition-all ${
                      adminView === "database"
                        ? "bg-amber-400 text-black shadow-[0_0_12px_rgba(212,168,67,0.4)]"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Main Database View ({teamsList.length})
                  </button>
                  <button
                    onClick={() => setAdminView("rosters")}
                    className={`px-4 py-2 rounded-xl transition-all ${
                      adminView === "rosters"
                        ? "bg-amber-400 text-black shadow-[0_0_12px_rgba(212,168,67,0.4)]"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Team Rosters View
                  </button>
                  <button
                    onClick={() => setAdminView("submissions")}
                    className={`px-4 py-2 rounded-xl transition-all ${
                      adminView === "submissions"
                        ? "bg-amber-400 text-black shadow-[0_0_12px_rgba(212,168,67,0.4)]"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Live Git & PPT Submissions ({teamsList.filter((t) => t.gitRepoUrl || t.projectFileUrl).length})
                  </button>
                </div>

                {/* Filter and Search Bar with Full Multi-Filters */}
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                    <div className="relative flex-grow max-w-md">
                      <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setCurrentPage(1);
                        }}
                        placeholder="Search ID, name, leader, phone, track, git, ppt..."
                        className="w-full bg-black/70 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Track Filter */}
                      <select
                        value={filterTrack}
                        onChange={(e) => {
                          setFilterTrack(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="bg-black/70 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="ALL">All Tracks</option>
                        <option value="FinTech Track">FinTech Track</option>
                        <option value="Quantum and Social Welfare Track">Quantum & Social Track</option>
                      </select>

                      {/* Reveal Filter */}
                      <select
                        value={filterReveal}
                        onChange={(e) => {
                          setFilterReveal(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="bg-black/70 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="ALL">All Card States</option>
                        <option value="Revealed">Revealed (Card Picked)</option>
                        <option value="Pending">Pending Superposition</option>
                      </select>

                      {/* Submission Filter */}
                      <select
                        value={filterSubmissions}
                        onChange={(e) => {
                          setFilterSubmissions(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="bg-black/70 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="ALL">All Submissions</option>
                        <option value="Has GitHub">Has GitHub Repo</option>
                        <option value="Has PPT">Has PPT Link</option>
                        <option value="Both Submitted">Both Submitted</option>
                        <option value="Missing">Pending Submissions</option>
                      </select>

                      {/* Status Filter */}
                      <select
                        value={filterStatus}
                        onChange={(e) => {
                          setFilterStatus(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="bg-black/70 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="ALL">All Statuses</option>
                        <option value="Submitted">Submitted</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                    <span>
                      Showing {filteredTeams.length} of {teamsList.length} teams
                    </span>
                    {(searchQuery || filterTrack !== "ALL" || filterReveal !== "ALL" || filterSubmissions !== "ALL" || filterStatus !== "ALL") && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                          setFilterTrack("ALL");
                          setFilterReveal("ALL");
                          setFilterSubmissions("ALL");
                          setFilterStatus("ALL");
                          setCurrentPage(1);
                        }}
                        className="text-amber-400 hover:underline"
                      >
                        Reset All Filters
                      </button>
                    )}
                  </div>
                </div>

                {/* VIEW 1: Main Comprehensive Database View (All Details) */}
                {adminView === "database" && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-gray-400 text-[10px] uppercase tracking-wider bg-white/[0.02]">
                          <th className="py-3.5 px-3">Team ID</th>
                          <th className="py-3.5 px-3">Team Name</th>
                          <th className="py-3.5 px-3">Track Chosen</th>
                          <th className="py-3.5 px-3">Card State</th>
                          <th className="py-3.5 px-3">Leader & Phone</th>
                          <th className="py-3.5 px-3">Passcode</th>
                          <th className="py-3.5 px-3">GitHub Link</th>
                          <th className="py-3.5 px-3">PPT / Drive Link</th>
                          <th className="py-3.5 px-3">Status</th>
                          <th className="py-3.5 px-3">Score</th>
                          <th className="py-3.5 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {paginatedTeams.map((team) => {
                          const isFinTech = team.track?.includes("FinTech");
                          return (
                            <tr key={team.id} className="hover:bg-white/[0.03] transition-colors">
                              {/* Team ID */}
                              <td className="py-3.5 px-3 text-amber-400 font-bold whitespace-nowrap">
                                {team.id}
                              </td>

                              {/* Team Name */}
                              <td className="py-3.5 px-3 font-semibold text-white whitespace-nowrap">
                                {team.name}
                              </td>

                              {/* Track Chosen */}
                              <td className="py-3.5 px-3 whitespace-nowrap">
                                <span
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                                    isFinTech
                                      ? "bg-emerald-950/50 text-emerald-300 border-emerald-500/40"
                                      : "bg-purple-950/50 text-purple-300 border-purple-500/40"
                                  }`}
                                >
                                  {team.track || "FinTech Track"}
                                </span>
                              </td>

                              {/* Card Reveal Status */}
                              <td className="py-3.5 px-3 whitespace-nowrap">
                                {team.isTrackRevealed ? (
                                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 inline-flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                    Revealed
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                    Pending Choice
                                  </span>
                                )}
                              </td>

                              {/* Leader & Phone */}
                              <td className="py-3.5 px-3 text-gray-300 whitespace-nowrap">
                                <div className="text-white font-medium">{team.leaderName}</div>
                                <div className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                                  <Phone className="w-2.5 h-2.5 text-amber-400" />
                                  <span>{team.leaderPhone}</span>
                                </div>
                              </td>

                              {/* Passcode */}
                              <td className="py-3.5 px-3 whitespace-nowrap">
                                <code className="text-amber-300 font-bold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/20 text-xs">
                                  {team.passcode}
                                </code>
                              </td>

                              {/* GitHub Link */}
                              <td className="py-3.5 px-3 whitespace-nowrap">
                                {team.gitRepoUrl ? (
                                  <a
                                    href={team.gitRepoUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] border border-white/10 inline-flex items-center gap-1.5 transition-all"
                                  >
                                    <Github className="w-3.5 h-3.5 text-white" />
                                    <span>Repo</span>
                                    <ExternalLink className="w-2.5 h-2.5 text-amber-400" />
                                  </a>
                                ) : (
                                  <span className="text-[10px] text-gray-500 italic">Pending</span>
                                )}
                              </td>

                              {/* PPT Link */}
                              <td className="py-3.5 px-3 whitespace-nowrap">
                                {team.projectFileUrl ? (
                                  <a
                                    href={team.projectFileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-2.5 py-1 rounded-lg bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-300 text-[11px] border border-emerald-500/30 inline-flex items-center gap-1.5 transition-all"
                                  >
                                    <FileText className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>Drive</span>
                                    <ExternalLink className="w-2.5 h-2.5 text-amber-400" />
                                  </a>
                                ) : (
                                  <span className="text-[10px] text-gray-500 italic">Pending</span>
                                )}
                              </td>

                              {/* Status */}
                              <td className="py-3.5 px-3 whitespace-nowrap">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    team.status === "Submitted"
                                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                      : team.status === "In Progress"
                                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                      : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                                  }`}
                                >
                                  {team.status}
                                </span>
                              </td>

                              {/* Score */}
                              <td className="py-3.5 px-3 whitespace-nowrap">
                                {editingScoreId === team.id ? (
                                  <div className="flex items-center gap-1">
                                    <input
                                      type="number"
                                      min={0}
                                      max={100}
                                      value={tempScore}
                                      onChange={(e) => setTempScore(Number(e.target.value))}
                                      className="w-14 bg-black border border-amber-400 rounded px-1.5 py-0.5 text-center text-white"
                                    />
                                    <button
                                      onClick={async () => {
                                        await handleAdminSaveTeam(team.id, { score: tempScore });
                                        setEditingScoreId(null);
                                      }}
                                      className="px-2 py-0.5 rounded bg-amber-400 text-black font-bold text-[10px]"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={() => setEditingScoreId(null)}
                                      className="px-1.5 py-0.5 rounded bg-white/5 text-gray-400 text-[10px]"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setEditingScoreId(team.id);
                                      setTempScore(team.score || 0);
                                    }}
                                    className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-white font-bold text-xs inline-flex items-center gap-1.5"
                                  >
                                    <span>{team.score || 0} pts</span>
                                    <Edit3 className="w-3 h-3 text-amber-400" />
                                  </button>
                                )}
                              </td>

                              {/* Actions: Edit & Delete */}
                              <td className="py-3.5 px-3 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => setEditingTeam(team)}
                                    className="px-3 py-1.5 rounded-xl bg-amber-400/15 hover:bg-amber-400 text-amber-300 hover:text-black text-[11px] font-bold border border-amber-500/40 transition-all inline-flex items-center gap-1"
                                    title="Edit all team details"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                    <span>Edit</span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      if (confirm(`Are you sure you want to permanently delete team "${team.name}" (${team.id})?`)) {
                                        handleAdminDeleteTeam(team.id);
                                      }
                                    }}
                                    className="p-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/30 transition-all"
                                    title="Delete Team"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* VIEW 2: Rosters View */}
                {adminView === "rosters" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
                    {paginatedTeams.map((team) => (
                      <div
                        key={team.id}
                        className="p-5 rounded-3xl bg-black/60 border border-white/10 space-y-3 relative group hover:border-amber-500/40 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-amber-400 font-bold text-sm">{team.id}</span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-md font-bold border ${
                              team.track?.includes("FinTech")
                                ? "bg-emerald-950/60 text-emerald-300 border-emerald-500/30"
                                : "bg-purple-950/60 text-purple-300 border-purple-500/30"
                            }`}
                          >
                            {team.track || "FinTech Track"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="font-bold text-white text-base">{team.name}</div>
                          <button
                            onClick={() => setEditingTeam(team)}
                            className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-bold"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                        </div>

                        <div className="text-gray-300 text-xs">
                          Lead: <span className="text-white font-semibold">{team.leaderName}</span> ({team.leaderPhone})
                        </div>

                        <div className="pt-2 border-t border-white/5 space-y-1.5">
                          <span className="text-[10px] text-gray-500 uppercase tracking-wider block">
                            Roster Members ({team.memberList?.filter((m: any) => m.name).length || 1} / {team.membersCount || 4})
                          </span>
                          {team.memberList?.map((m, i) => (
                            <div key={i} className="text-gray-300 flex items-center justify-between text-xs py-0.5">
                              <span className={i === 0 ? "text-amber-300 font-bold" : m.name ? "text-white" : "text-gray-500 italic"}>
                                {i === 0 ? "★ " : "• "}
                                {m.name || "(Slot Open)"}
                              </span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded ${i === 0 ? "bg-amber-950/60 text-amber-400 border border-amber-500/30" : "bg-white/5 text-gray-400"}`}>
                                {i === 0 ? "Lead" : `Member ${i}`}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-gray-400">
                          <span>Passcode: <strong className="text-amber-300">{team.passcode}</strong></span>
                          <span>Score: <strong className="text-white">{team.score || 0} pts</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* VIEW 3: Live Submissions & PPT View */}
                {adminView === "submissions" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                    {paginatedTeams
                      .filter((t) => t.gitRepoUrl || t.projectFileUrl)
                      .map((team) => (
                        <div
                          key={team.id}
                          className="p-5 rounded-3xl bg-black/60 border border-white/10 space-y-3.5 hover:border-amber-500/40 transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-amber-400 font-bold">{team.id}</span> •{" "}
                              <span className="text-white font-bold text-sm">{team.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                {team.status}
                              </span>
                              <button
                                onClick={() => setEditingTeam(team)}
                                className="text-amber-400 hover:text-amber-300 p-1"
                                title="Edit Team"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="text-[11px] text-gray-400">
                            Track: <span className="text-amber-300 font-bold">{team.track}</span>
                          </div>

                          <div className="space-y-2">
                            {team.gitRepoUrl ? (
                              <a
                                href={team.gitRepoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all border border-white/10"
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <Github className="w-4 h-4 text-white shrink-0" />
                                  <span className="truncate">{team.gitRepoUrl}</span>
                                </div>
                                <ExternalLink className="w-3.5 h-3.5 text-amber-400 shrink-0 ml-2" />
                              </a>
                            ) : (
                              <div className="p-2 rounded-xl bg-black/40 border border-white/5 text-gray-500 text-[11px]">
                                No GitHub URL submitted yet
                              </div>
                            )}

                            {team.projectFileUrl ? (
                              <a
                                href={team.projectFileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 transition-all border border-emerald-500/30"
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                                  <span className="truncate">{team.projectFileUrl}</span>
                                </div>
                                <ExternalLink className="w-3.5 h-3.5 text-amber-400 shrink-0 ml-2" />
                              </a>
                            ) : (
                              <div className="p-2 rounded-xl bg-black/40 border border-white/5 text-gray-500 text-[11px]">
                                No Presentation Drive link submitted yet
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-gray-400">
                            <span>Score: <strong className="text-white">{team.score || 0} / 100</strong></span>
                            <span>Lead: <strong className="text-gray-300">{team.leaderName}</strong> ({team.leaderPhone})</span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4 border-t border-white/10 font-mono text-xs">
                    <span className="text-gray-400 text-[11px]">
                      Page {currentPage} of {totalPages} ({filteredTeams.length} teams)
                    </span>
                    <div className="flex gap-2">
                      <button
                        disabled={currentPage <= 1}
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        disabled={currentPage >= totalPages}
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Edit Team Modal (Full Power) */}
              <AdminEditTeamModal
                isOpen={editingTeam !== null}
                team={editingTeam}
                onClose={() => setEditingTeam(null)}
                onSave={handleAdminSaveTeam}
                onDelete={handleAdminDeleteTeam}
                isSaving={isSavingTeam}
              />

              {/* Add Team Modal (Full Power) */}
              <AdminAddTeamModal
                isOpen={showAddTeam}
                onClose={() => setShowAddTeam(false)}
                onAdd={handleAdminAddTeam}
                isSubmitting={isLoading}
                suggestedId={suggestedNextId}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
