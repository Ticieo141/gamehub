import mongoose from "mongoose";

const uri = "mongodb+srv://hieucongtran141:hieucongtran141@gamehub.rljnxox.mongodb.net/gamehub";

async function testConnection() {
  try {
    await mongoose.connect(uri);

    console.log("✅ MongoDB Connected Successfully!");

    const db = mongoose.connection.db;

    const collections = await db.listCollections().toArray();

    console.log("📦 Collections:", collections);

    process.exit();
  } catch (error) {
    console.error("❌ Connection Failed:", error);
    process.exit(1);
  }
}

testConnection();