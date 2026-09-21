/**
 * Seed script — creates the default admin account.
 * Run once: node seed.js
 *
 * Credentials:
 *   username : admin
 *   password : DbaCoach@2024
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Admin = require("./models/Admin");

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/dbacoach";

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("✅  Connected to MongoDB:", MONGO_URI);

  // Remove existing admin so seed is idempotent
  await Admin.deleteMany({});

  await Admin.create({
    username: "admin",
    password: "DbaCoach@2024",
    name: "DBA Coach Admin",
  });

  console.log("🌱  Admin seeded successfully.");
  console.log("    username : admin");
  console.log("    password : DbaCoach@2024");

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌  Seed failed:", err.message);
  process.exit(1);
});
