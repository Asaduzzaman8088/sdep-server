import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB, disconnectDB } from "./db/connect.js";

async function start() {
  await connectDB();

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
