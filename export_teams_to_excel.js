const fs = require("fs");
const { MongoClient } = require("mongodb");
const xlsx = require("xlsx");

async function generateReport() {
  const envFile = fs.readFileSync(".env.local", "utf-8");
  const uriMatch = envFile.match(/MONGODB_URI=(.*)/);
  if (!uriMatch) return console.log("NO URI in .env.local");
  
  const uri = uriMatch[1].trim();
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("quantexa_portal");
  const teams = await db.collection("teams").find({}).toArray();
  
  const reportData = [];

  for (const team of teams) {
    // Generate up to 4 members columns
    const members = team.memberList || [{ name: team.leaderName || "Team Leader", role: "Team Lead", phone: team.leaderPhone }];
    
    reportData.push({
      "Team ID": team.id,
      "Team Name": team.name,
      "Track": team.track,
      "Leader Name": members[0]?.name || team.leaderName,
      "Leader Phone": members[0]?.phone || team.leaderPhone || "",
      "Leader Email": team.leaderEmail || "",
      "Member 2": members[1]?.name || "",
      "Member 3": members[2]?.name || "",
      "Member 4": members[3]?.name || "",
      "Roster Locked": team.isRosterLocked ? "Yes" : "No",
      "Submission URL": team.submissionUrl || team.gitRepoUrl || "",
      "Project File URL": team.projectFileUrl || "",
      "Last Updated": team.updatedAt || ""
    });
  }

  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(reportData);
  xlsx.utils.book_append_sheet(wb, ws, "Quantexa Teams");

  const outputName = "Quantexa_Final_Teams_Report.xlsx";
  xlsx.writeFile(wb, outputName);
  
  console.log(`Successfully generated report: ${outputName} with ${reportData.length} teams.`);
  await client.close();
}

generateReport().catch(console.error);
