import { Router } from "express";
import { User } from "../models/user.model.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// GET /api/users/me - get current user from MongoDB "users" collection
router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.user.email }).lean();
    if (!user) {
      return res.json({ success: true, user: req.user });
    }
    return res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
});

// GET /api/users - list registered users from MongoDB "users" collection
router.get("/", requireAuth, async (_req, res, next) => {
  try {
    const users = await User.find({})
      .select("name email image role createdAt")
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
});

// POST /api/users/sync - record/upsert a user into "users" collection
router.post("/sync", requireAuth, async (req, res, next) => {
  try {
    const { name, email, image } = req.user;
    const user = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          name,
          email,
          image: image || "",
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true, new: true }
    );
    return res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
});

export default router;
