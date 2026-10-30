import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middleware/error.js";
import eventRouter from "./routes/event.routes.js";
import healthRouter from "./routes/health.routes.js";
import myRouter from "./routes/my.routes.js";
import statsRouter from "./routes/stats.routes.js";

const app = express();

app.disable("x-powered-by");

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || env.clientOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`Origin ${origin} is not allowed by CORS.`));
    },
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));

if (!env.isProduction) {
  app.use(morgan("dev"));
}

app.get("/", (_req, res) => {
  res.json({
    name: "ShebaSetu API",
    version: "0.1.0",
    status: "ok",
  });
});

app.use("/api/health", healthRouter);
app.use("/api/events", eventRouter);
app.use("/api/my", myRouter);
app.use("/api/stats", statsRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
