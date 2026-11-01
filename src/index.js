import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB, disconnectDB } from "./db/connect.js";
import { User } from "./models/user.model.js";

async function ensureInitialUsers() {
  try {
    const count = await User.countDocuments();
    if (count === 0) {
      await User.insertMany([
        {
          name: "MD ASADUZZAMAN",
          email: "soponmd6@gmail.com",
          image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
          emailVerified: true,
          role: "admin",
        },
      ]);
      console.log("[db] Initialized 'users' collection with default user.");
    }
  } catch (err) {
    // Non-blocking initialization
  }
}

async function start() {
  await connectDB();
  await ensureInitialUsers();

  const server = app.listen(env.port, () => {
    console.log(`[api] SDEP API listening on http://localhost:${env.port}`);
  });

  const shutdown = async (signal) => {
    console.log(`\n[api] ${signal} received. Shutting down gracefully.`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

start().catch((error) => {
  console.error("[api] Failed to start the server:", error);
  process.exit(1);
});
