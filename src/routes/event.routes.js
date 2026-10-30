import { Router } from "express";

import {
  createEvent,
  deleteEvent,
  getEventById,
  getUpcomingEvents,
  joinEvent,
  leaveEvent,
  listEvents,
  updateEvent,
} from "../controllers/event.controller.js";
import { optionalAuth, requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import {
  createEventSchema,
  updateEventSchema,
} from "../validators/event.validator.js";

const router = Router();

router.get("/upcoming", getUpcomingEvents);
router.get("/", listEvents);
router.get("/:id", optionalAuth, getEventById);

router.post(
  "/",
  requireAuth,
  validateBody(createEventSchema),
  createEvent,
);

router.patch(
  "/:id",
  requireAuth,
  validateBody(updateEventSchema),
  updateEvent,
);

router.delete("/:id", requireAuth, deleteEvent);

router.post("/:id/join", requireAuth, joinEvent);
router.delete("/:id/join", requireAuth, leaveEvent);

export default router;
