import { Router } from "express";
import mongoose from "mongoose";

const router = Router();

const connectionStates = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

router.get("/", (_req, res) => {
  res.json({
    status: "ok",
    service: "ShebaSetu API",
    database: connectionStates[mongoose.connection.readyState] ?? "unknown",
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

export default router;
