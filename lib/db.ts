import fs from "fs";
import path from "path";
import { MongoClient } from "mongodb";
import staticDbData from "@/data/final_db.json";

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
  submissionUrl?: string; // Legacy / Fallback
  updatedAt: string;
}

export interface DatabaseSchema {
  teams: TeamRecord[];
  adminPasskey: string;
}

const DB_PATH = path.join(process.cwd(), "data", "final_db.json");

// MongoDB Connection Setup (For 100% Free Cloud Deployment with Serverless Connection Caching)
const MONGODB_URI = process.env.MONGODB_URI || "";

declare global {
  var _mongoClient: MongoClient | undefined;
}

export async function getMongoCollection() {
  if (!MONGODB_URI) return null;
  try {
    if (!global._mongoClient) {
      const client = new MongoClient(MONGODB_URI, {
        serverSelectionTimeoutMS: 3000,
        connectTimeoutMS: 3000,
        maxPoolSize: 10,
        minPoolSize: 1,
        socketTimeoutMS: 10000,
      });
      global._mongoClient = await client.connect();
    }
    const db = global._mongoClient.db("quantexa_portal");
    return db.collection<TeamRecord>("teams");
  } catch (err) {
    console.error("MongoDB Connection Error (falling back to local JSON database):", err);
    global._mongoClient = undefined;
    return null;
  }
}

// Default initial teams seeded into database
const INITIAL_DB_DATA: DatabaseSchema = {
  adminPasskey: "admin123", // Master Admin Passkey
  teams: [
    {
      id: "NEX0001",
      name: "ASTRANOVA",
      passcode: "7358620251",
      leaderName: "SARAVANA NAGESWAR B",
      leaderPhone: "7358620251",
      membersCount: 4,
      isRosterLocked: false,
      memberList: [
        { name: "SARAVANA NAGESWAR B", role: "Team Lead", phone: "7358620251" },
      ],
      problemStatement: "Assigned on Spot (Phase 03)",
      score: 0,
      status: "In Progress",
      dbName: "quantexa_db_astranova",
      dbStatus: "Connected",
      dbStorage: "10 GB SSD",
      dbHost: "db.quantexa.internal:5430",
      gitRepoUrl: "",
      projectFileUrl: "",
      projectFileName: "",
      demoVideoUrl: "",
      submissionUrl: "",
      updatedAt: new Date().toISOString(),
    },
  ],
};

// Ensure local database directory & JSON file exist
function ensureDb() {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify(INITIAL_DB_DATA, null, 2), "utf-8");
    }
  } catch (err) {
    // Read-only filesystem on Vercel serverless environment
  }
}

// Synchronous local read (Guaranteed 145-Team in-memory fallback for Vercel Serverless)
export function getDb(): DatabaseSchema {
  ensureDb();
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, "utf-8");
      const parsed = JSON.parse(data);
      if (parsed && Array.isArray(parsed.teams) && parsed.teams.length > 0) {
        parsed.teams = parsed.teams.map((t: any) => ({
          ...t,
          membersCount: t.membersCount || t.members || 4,
          leaderName: t.leaderName || (t.memberList?.[0]?.name) || "Team Leader",
          memberList: t.memberList || [
            { name: t.leaderName || "Team Leader", role: "Team Lead" },
          ],
        }));
        return parsed;
      }
    }
  } catch (error) {
    console.error("Error reading filesystem database (falling back to bundled 145 teams):", error);
  }

  // Resilient bundled static in-memory fallback containing all 145 teams for Vercel
  const bundled = (staticDbData as unknown) as DatabaseSchema;
  if (bundled && Array.isArray(bundled.teams)) {
    bundled.teams = bundled.teams.map((t: any) => ({
      ...t,
      membersCount: t.membersCount || t.members || 4,
      leaderName: t.leaderName || (t.memberList?.[0]?.name) || "Team Leader",
      memberList: t.memberList || [
        { name: t.leaderName || "Team Leader", role: "Team Lead" },
      ],
    }));
    return bundled;
  }

  return INITIAL_DB_DATA;
}

// Write database locally
export function saveDb(data: DatabaseSchema) {
  try {
    ensureDb();
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    // Read-only filesystem on Vercel serverless environment
  }
}

// Async Database fetch (Supports Cloud MongoDB Atlas OR Local JSON with automatic failover)
export async function getDbAsync(): Promise<DatabaseSchema> {
  try {
    const collection = await getMongoCollection();
    if (collection) {
      const teamsFromMongo = await collection.find({}).toArray();
      if (teamsFromMongo.length === 0) {
        // Seed all 145 teams from final_db.json into MongoDB if empty
        const localData = getDb();
        if (localData.teams && localData.teams.length > 0) {
          await collection.insertMany(localData.teams);
          return localData;
        }
      }
      const cleanTeams = teamsFromMongo.map((t: any) => {
        const { _id, ...rest } = t;
        return {
          ...rest,
          membersCount: rest.membersCount || 4,
          leaderName: rest.leaderName || "Team Leader",
          memberList: rest.memberList || [{ name: rest.leaderName || "Team Leader", role: "Team Lead" }],
        } as TeamRecord;
      });
      return {
        adminPasskey: process.env.ADMIN_PASSKEY || "admin123",
        teams: cleanTeams,
      };
    }
  } catch (mongoErr) {
    console.warn("MongoDB Atlas fetch error, fallback to local JSON:", mongoErr);
  }
  return getDb();
}

// Helper: Normalize Team ID Queries (Handles QUAN001, QUAN01, quan1, QTX001, NEX0001, etc.)
export function normalizeTeamIdCandidates(query: string): string[] {
  const q = query.trim();
  const qLower = q.toLowerCase();
  const candidates = new Set<string>();
  candidates.add(qLower);

  const clean = qLower.replace(/[\s\-_]/g, "");
  candidates.add(clean);

  const match = clean.match(/^(quan|qtx|nex)?(\d+)$/);
  if (match) {
    const num = parseInt(match[2], 10);
    if (!isNaN(num)) {
      // 3-digit padded (e.g. QUAN001 to QUAN145)
      candidates.add("quan" + String(num).padStart(3, "0"));
      candidates.add("quan" + String(num).padStart(4, "0"));
      candidates.add("quan" + String(num));

      // QTX & NEX compatibility
      candidates.add("qtx" + String(num).padStart(3, "0"));
      candidates.add("qtx" + String(num).padStart(4, "0"));
      candidates.add("qtx" + String(num));
      candidates.add("nex" + String(num).padStart(4, "0"));
      candidates.add("nex" + String(num));
    }
  }

  return Array.from(candidates);
}

// Helper: Get Team by ID or Name (Async + Sync)
export async function findTeamAsync(query: string): Promise<TeamRecord | undefined> {
  const db = await getDbAsync();
  const candidates = normalizeTeamIdCandidates(query);
  const qCleanDigits = query.replace(/[^0-9]/g, "");
  return db.teams.find(
    (t) =>
      candidates.includes(t.id.toLowerCase()) ||
      t.name.toLowerCase() === query.trim().toLowerCase() ||
      (t.leaderPhone && (
        t.leaderPhone.replace(/\s+/g, "") === query.trim() ||
        (qCleanDigits && t.leaderPhone.replace(/[^0-9]/g, "") === qCleanDigits)
      ))
  );
}

export function findTeam(query: string): TeamRecord | undefined {
  const db = getDb();
  const candidates = normalizeTeamIdCandidates(query);
  const qCleanDigits = query.replace(/[^0-9]/g, "");
  return db.teams.find(
    (t) =>
      candidates.includes(t.id.toLowerCase()) ||
      t.name.toLowerCase() === query.trim().toLowerCase() ||
      (t.leaderPhone && (
        t.leaderPhone.replace(/\s+/g, "") === query.trim() ||
        (qCleanDigits && t.leaderPhone.replace(/[^0-9]/g, "") === qCleanDigits)
      ))
  );
}

// Helper: Authenticate Team
export async function authenticateTeam(query: string, passcode: string): Promise<TeamRecord | null> {
  const team = await findTeamAsync(query);
  if (!team) return null;
  const p1 = (passcode || "").trim().toLowerCase();
  const p2 = (team.passcode || "").trim().toLowerCase();
  const pLead = (team.leaderPhone || "").trim().toLowerCase();

  if (p1 === p2 || (pLead && p1 === pLead)) {
    return team;
  }

  // Normalized digit match (e.g. "94883 52388" vs "9488352388", or "+91 9400166179" vs "9400166179")
  const cleanP1 = p1.replace(/[^0-9]/g, "");
  const cleanP2 = p2.replace(/[^0-9]/g, "");
  const cleanPLead = pLead.replace(/[^0-9]/g, "");

  const targetDigits = [cleanP2, cleanPLead].filter(Boolean);

  for (const target of targetDigits) {
    if (cleanP1 && target) {
      if (cleanP1 === target) return team;
      if (cleanP1.length === 12 && cleanP1.startsWith("91") && cleanP1.slice(2) === target) return team;
      if (target.length === 12 && target.startsWith("91") && target.slice(2) === cleanP1) return team;
    }
  }

  return null;
}

// Helper: Authenticate Admin (ID: guru / admin, Password: 9442777855 / admin123)
export async function authenticateAdmin(passkey: string, username?: string): Promise<boolean> {
  const db = await getDbAsync();
  const key = (passkey || "").trim();
  const user = (username || "").trim().toLowerCase();
  const masterKey = process.env.ADMIN_PASSKEY || db.adminPasskey || "9442777855";
  
  if (user === "guru" && (key === "9442777855" || key === "admin123")) return true;
  if (user === "admin" && (key === "9442777855" || key === "admin123")) return true;
  return (
    key === masterKey ||
    key === "9442777855" ||
    key === "admin123" ||
    key.toLowerCase() === "guru" ||
    (user === "guru" && key === "9442777855")
  );
}

// Helper: Update Team Submission (Git Link & Presentation File & Locked Roster)
export async function updateTeamSubmission(
  teamId: string,
  payload: {
    gitRepoUrl?: string;
    projectFileUrl?: string;
    projectFileName?: string;
    demoVideoUrl?: string;
    submissionUrl?: string;
    memberList?: TeamMember[];
    leaderName?: string;
    leaderEmail?: string;
    isRosterLocked?: boolean;
    isTrackRevealed?: boolean;
    problemStatementFileUrl?: string;
  }
): Promise<TeamRecord | null> {
  const collection = await getMongoCollection();
  const db = await getDbAsync();
  const candidates = normalizeTeamIdCandidates(teamId);
  const index = db.teams.findIndex(
    (t) =>
      candidates.includes(t.id.toLowerCase()) ||
      t.id.toLowerCase() === teamId.toLowerCase() ||
      t.name.toLowerCase() === teamId.toLowerCase()
  );
  
  if (index !== -1) {
    const current = db.teams[index];

    const gitRepoUrl = payload.gitRepoUrl !== undefined ? payload.gitRepoUrl : current.gitRepoUrl;
    const projectFileUrl = payload.projectFileUrl !== undefined ? payload.projectFileUrl : current.projectFileUrl;
    const projectFileName = payload.projectFileName !== undefined ? payload.projectFileName : current.projectFileName;
    const demoVideoUrl = payload.demoVideoUrl !== undefined ? payload.demoVideoUrl : current.demoVideoUrl;

    const isSubmitted = Boolean(gitRepoUrl || projectFileUrl || payload.submissionUrl);

    const updatedTeam: TeamRecord = {
      ...current,
      gitRepoUrl,
      projectFileUrl,
      projectFileName,
      demoVideoUrl,
      submissionUrl: gitRepoUrl || payload.submissionUrl || current.submissionUrl,
      status: isSubmitted ? "Submitted" : current.status,
      memberList: payload.memberList || current.memberList,
      leaderName: payload.leaderName || current.leaderName,
      leaderEmail: payload.leaderEmail || current.leaderEmail,
      isRosterLocked: payload.isRosterLocked !== undefined ? payload.isRosterLocked : (current.isRosterLocked || false),
      isTrackRevealed: payload.isTrackRevealed !== undefined ? payload.isTrackRevealed : (current.isTrackRevealed || false),
      problemStatementFileUrl: payload.problemStatementFileUrl || current.problemStatementFileUrl,
      membersCount: payload.memberList ? payload.memberList.length : current.membersCount,
      updatedAt: new Date().toISOString(),
    };

    db.teams[index] = updatedTeam;
    saveDb(db);

    if (collection) {
      try {
        await collection.updateOne({ id: current.id }, { $set: updatedTeam }, { upsert: true });
      } catch (err: any) {
        console.error("MongoDB Atlas sync error:", err);
      }
    }
    
    return updatedTeam;
  }
  return null;
}

// Helper: Update Team by Admin (Full Control to Add and Change Any Details)
export async function updateTeamByAdmin(
  teamId: string,
  updates: Partial<TeamRecord>
): Promise<TeamRecord | null> {
  const collection = await getMongoCollection();
  const db = await getDbAsync();
  const candidates = normalizeTeamIdCandidates(teamId);
  const index = db.teams.findIndex(
    (t) =>
      t.id.toLowerCase() === teamId.toLowerCase() ||
      candidates.includes(t.id.toLowerCase())
  );

  if (index !== -1) {
    const updatedTeam: TeamRecord = {
      ...db.teams[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    db.teams[index] = updatedTeam;
    saveDb(db);

    if (collection) {
      try {
        await collection.updateOne({ id: updatedTeam.id }, { $set: updatedTeam }, { upsert: true });
      } catch (err) {
        console.error("MongoDB Atlas sync error:", err);
      }
    }
    return updatedTeam;
  }
  return null;
}

// Helper: Delete Team by Admin
export async function deleteTeamByAdmin(teamId: string): Promise<boolean> {
  const collection = await getMongoCollection();
  const db = await getDbAsync();
  const index = db.teams.findIndex((t) => t.id.toLowerCase() === teamId.toLowerCase());

  if (index !== -1) {
    const removed = db.teams.splice(index, 1)[0];
    saveDb(db);

    if (collection) {
      try {
        await collection.deleteOne({ id: removed.id });
      } catch (err) {
        console.error("MongoDB delete error:", err);
      }
    }
    return true;
  }
  return false;
}

// Helper: Create New Team
export async function createTeam(teamData: Omit<TeamRecord, "updatedAt">): Promise<TeamRecord> {
  const collection = await getMongoCollection();
  const db = await getDbAsync();
  const newTeam: TeamRecord = {
    ...teamData,
    updatedAt: new Date().toISOString(),
  };

  db.teams.push(newTeam);
  saveDb(db);

  if (collection) {
    try {
      await collection.updateOne({ id: newTeam.id }, { $set: newTeam }, { upsert: true });
    } catch (err) {
      console.error("MongoDB Atlas sync error on create:", err);
    }
  }
  return newTeam;
}

// Helper: Bulk Import Teams
export async function importTeams(teamsData: TeamRecord[]): Promise<TeamRecord[]> {
  const collection = await getMongoCollection();
  if (collection) {
    for (const team of teamsData) {
      await collection.updateOne({ id: team.id }, { $set: team }, { upsert: true });
    }
    const updatedDb = await getDbAsync();
    return updatedDb.teams;
  } else {
    const db = getDb();
    db.teams = teamsData;
    saveDb(db);
    return db.teams;
  }
}
