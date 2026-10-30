import mongoose from "mongoose";

import { ApiError } from "../middleware/error.js";

export function readObjectId(value, label = "identifier") {
  if (!mongoose.isValidObjectId(value)) {
    throw new ApiError(400, `The provided ${label} is not valid.`);
  }

  return value;
}

export function readPositiveInt(value, fallback, max) {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  return Math.min(parsed, max);
}
