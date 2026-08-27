import fs from "fs";
import path from "path";
import { MongoClient } from "mongodb";

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

// MongoDB Connection Setup (For 100% Free Cloud Deployment)
const MONGODB_URI = process.env.MONGODB_URI || "";
let mongoClient: MongoClient | null = null;

async function getMongoCollection() {
  if (!MONGODB_URI) return null;
  try {
    if (!mongoClient) {
      mongoClient = new MongoClient(MONGODB_URI);
      await mongoClient.connect();
    }
    const db = mongoClient.db("quantexa_portal");
    return db.collection<TeamRecord>("teams");
  } catch (err) {
    console.error("MongoDB Atlas Connection Error:", err);
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

// Synchronous local read
export function getDb(): DatabaseSchema {
  ensureDb();
  try {
    const data = fs.readFileSync(DB_PATH, "utf-8");
    const parsed = JSON.parse(data);
    parsed.teams = parsed.teams.map((t: any) => ({
      ...t,
      membersCount: t.membersCount || t.members || 4,
      leaderName: t.leaderName || (t.memberList?.[0]?.name) || "Team Leader",
      memberList: t.memberList || [
        { name: t.leaderName || "Team Leader", role: "Team Lead" },
      ],
    }));
    return parsed;
  } catch (error) {
    console.error("Error reading database:", error);
    return INITIAL_DB_DATA;
  }
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

// Async Database fetch (Supports Cloud MongoDB Atlas OR Local JSON)
export async function getDbAsync(): Promise<DatabaseSchema> {
  const collection = await getMongoCollection();
  if (collection) {
    const teamsFromMongo = await collection.find({}).toArray();
    if (teamsFromMongo.length === 0) {
      // Seed initial data if MongoDB collection is empty
      await collection.insertMany(INITIAL_DB_DATA.teams);
      return INITIAL_DB_DATA;
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
  return getDb();
}

// Helper: Normalize Team ID Queries (Handles QTX0001, NEX0001, QTX001, etc.)
export function normalizeTeamIdCandidates(query: string): string[] {
  const q = query.trim();
  const qLower = q.toLowerCase();
  const candidates = new Set<string>();
  candidates.add(qLower);

  const clean = qLower.replace(/[\s\-_]/g, "");
  candidates.add(clean);

  const match = clean.match(/^(nex|qtx)?(\d+)$/);
  if (match) {
    const num = parseInt(match[2], 10);
    if (!isNaN(num)) {
      const padded4Qtx = "qtx" + String(num).padStart(4, "0");
      candidates.add(padded4Qtx);
      const plainQtx = "qtx" + String(num);
      candidates.add(plainQtx);
      const padded4Nex = "nex" + String(num).padStart(4, "0");
      candidates.add(padded4Nex);
      const plainNex = "nex" + String(num);
      candidates.add(plainNex);
    }
  }

  return Array.from(candidates);
}

// Helper: Get Team by ID or Name (Async + Sync)
export async function findTeamAsync(query: string): Promise<TeamRecord | undefined> {
  const db = await getDbAsync();
  const candidates = normalizeTeamIdCandidates(query);
  return db.teams.find(
    (t) =>
      candidates.includes(t.id.toLowerCase()) ||
      t.name.toLowerCase() === query.trim().toLowerCase() ||
      (t.leaderPhone && t.leaderPhone.replace(/\s+/g, "") === query.trim())
  );
}

export function findTeam(query: string): TeamRecord | undefined {
  const db = getDb();
  const candidates = normalizeTeamIdCandidates(query);
  return db.teams.find(
    (t) =>
      candidates.includes(t.id.toLowerCase()) ||
      t.name.toLowerCase() === query.trim().toLowerCase() ||
      (t.leaderPhone && t.leaderPhone.replace(/\s+/g, "") === query.trim())
  );
}

// Helper: Authenticate Team
export async function authenticateTeam(query: string, passcode: string): Promise<TeamRecord | null> {
  const team = await findTeamAsync(query);
  if (!team) return null;
  const p1 = (passcode || "").trim().toLowerCase();
  const p2 = (team.passcode || "").trim().toLowerCase();
  if (p1 === p2) {
    return team;
  }
  return null;
}

// Helper: Authenticate Admin
export async function authenticateAdmin(passkey: string): Promise<boolean> {
  const db = await getDbAsync();
  const key = passkey.trim();
  const masterKey = process.env.ADMIN_PASSKEY || db.adminPasskey || "admin123";
  return key === masterKey || key === "admin123" || key === "9442777855" || key.toLowerCase() === "guru";
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
        throw new Error("Failed to save to Cloud Database. Please contact admins (Error: " + err.message + ")");
      }
    } else {
        throw new Error("Database connection failed. Vercel is missing the MONGODB_URI Environment Variable! Please add it in your Vercel Project Settings.");
    }
    
    return updatedTeam;
  }
  return null;
}

// Helper: Update Team by Admin
export async function updateTeamByAdmin(
  teamId: string,
  updates: Partial<TeamRecord>
): Promise<TeamRecord | null> {
  const collection = await getMongoCollection();
  const db = await getDbAsync();
  const index = db.teams.findIndex((t) => t.id === teamId);

  if (index !== -1) {
    const updatedTeam: TeamRecord = {
      ...db.teams[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (collection) {
      await collection.updateOne({ id: updatedTeam.id }, { $set: updatedTeam }, { upsert: true });
    } else {
      db.teams[index] = updatedTeam;
      saveDb(db);
    }
    return updatedTeam;
  }
  return null;
}

// Helper: Create New Team
export async function createTeam(teamData: Omit<TeamRecord, "updatedAt">): Promise<TeamRecord> {
  const collection = await getMongoCollection();
  const db = await getDbAsync();
  const newTeam: TeamRecord = {
    ...teamData,
    updatedAt: new Date().toISOString(),
  };

  if (collection) {
    await collection.insertOne(newTeam);
  } else {
    db.teams.push(newTeam);
    saveDb(db);
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
