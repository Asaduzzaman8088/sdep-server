import { Router } from "express";

import {
  getMyEvents,
  getMyJoinedEvents,
} from "../controllers/my.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.get("/events", getMyEvents);
router.get("/joined", getMyJoinedEvents);

export default router;
