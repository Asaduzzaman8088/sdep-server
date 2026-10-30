import mongoose from "mongoose";

import { env } from "../config/env.js";

export async function connectDB() {
  if (!env.mongodbUri) {
    console.warn(
      "[db] MONGODB_URI is not set. The API will start without a database connection.",
    );
    return null;
  }

  mongoose.connection.on("error", (error) => {
    console.error("[db] MongoDB connection error:", error.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("[db] MongoDB disconnected.");
  });

  await mongoose.connect(env.mongodbUri, {
    dbName: env.dbName,
    serverSelectionTimeoutMS: 10_000,
  });

  console.log(`[db] Connected to MongoDB database "${env.dbName}".`);
  return mongoose.connection;
}

export async function disconnectDB() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}
