import { createClient } from "@libsql/client";
import path from "path";
import fs from "fs";

const dbPath = path.join(process.cwd(), "dev.db");
const db = createClient({ url: `file:${dbPath}` });

async function main() {
  const lines = [];
  const log = (s) => { lines.push(s); console.log(s); };

  log("========================================");
  log("       EngLens Database Report");
  log("========================================\n");

  // Tables
  const tables = await db.execute(
    "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
  );
  log("TABLES: " + tables.rows.map((r) => r.name).join(", "));

  // Organization
  const orgs = await db.execute("SELECT * FROM Organization");
  log("\n--- ORGANIZATION ---");
  orgs.rows.forEach((r) => log("  " + r.name + " (slug: " + r.slug + ")"));

  // Users
  const users = await db.execute(
    "SELECT id, name, email, role FROM User ORDER BY role DESC, name"
  );
  log("\n--- USERS (" + users.rows.length + ") ---");
  users.rows.forEach((r) =>
    log("  [" + r.role.padEnd(5) + "] " + r.name.padEnd(20) + " " + r.email)
  );

  // Teams + Members
  const teams = await db.execute("SELECT id, name, slug FROM Team");
  log("\n--- TEAMS (" + teams.rows.length + ") ---");
  for (const team of teams.rows) {
    const members = await db.execute(
      "SELECT u.name, tm.role FROM TeamMember tm JOIN User u ON tm.userId = u.id WHERE tm.teamId = '" + team.id + "'"
    );
    const memberList = members.rows.map((m) => m.name + " (" + m.role + ")").join(", ");
    log("  " + team.name + ": " + memberList);
  }

  // Activities
  const activities = await db.execute(
    "SELECT source, category, status, title FROM Activity ORDER BY ingestedAt DESC"
  );
  log("\n--- ACTIVITIES (" + activities.rows.length + " total) ---");
  activities.rows.forEach((r) =>
    log("  [" + r.source + "/" + r.category + "] " + r.title.substring(0, 50) + " -> " + r.status)
  );

  // Reports
  const reports = await db.execute(
    "SELECT r.type, t.name as team, r.summaryMd FROM Report r LEFT JOIN Team t ON r.teamId = t.id"
  );
  log("\n--- REPORTS (" + reports.rows.length + ") ---");
  reports.rows.forEach((r) => log("  [" + r.type + "] " + r.team + ": " + r.summaryMd));

  // Integrations
  const integrations = await db.execute("SELECT type, active FROM Integration");
  log("\n--- INTEGRATIONS (" + integrations.rows.length + ") ---");
  if (integrations.rows.length === 0) log("  (none configured yet)");

  // Row counts
  log("\n--- ROW COUNTS ---");
  for (const table of tables.rows) {
    if (table.name.startsWith("_")) continue;
    const count = await db.execute('SELECT COUNT(*) as c FROM "' + table.name + '"');
    log("  " + table.name.padEnd(20) + " " + count.rows[0].c + " rows");
  }

  log("\nDone!");

  // Write clean report
  fs.writeFileSync("db-report.txt", lines.join("\n"), "utf-8");
}

main().catch(console.error);
