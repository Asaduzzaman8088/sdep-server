import app from "../src/app.js";
import { connectDB } from "../src/db/connect.js";

let isConnected = false;

export default async function handler(req, res) {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (err) {
      console.error("[vercel-serverless] Database connection error:", err);
    }
  }
  return app(req, res);
}
