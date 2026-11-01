import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, unique: true },
    image: { type: String, default: "" },
    emailVerified: { type: Boolean, default: false },
    role: { type: String, default: "user" },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "users",
  }
);

userSchema.index({ email: 1 }, { unique: true });

export const User = model("User", userSchema, "users");
