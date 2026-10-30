import "dotenv/config";

const nodeEnv = process.env.NODE_ENV ?? "development";

const clientOrigins = (process.env.CLIENT_URL ?? "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const requiredInProduction = ["MONGODB_URI", "BETTER_AUTH_URL", "CLIENT_URL"];

if (nodeEnv === "production") {
  const missing = requiredInProduction.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}

export const env = {
  nodeEnv,
  isProduction: nodeEnv === "production",
  port: Number(process.env.PORT ?? 5000),
  mongodbUri: process.env.MONGODB_URI ?? "",
  dbName: process.env.DB_NAME ?? "sdep",
  betterAuthUrl: (process.env.BETTER_AUTH_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  ),
  clientOrigins,
};
