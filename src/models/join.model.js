import mongoose from "mongoose";

const { Schema, model } = mongoose;

const participantSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    image: { type: String, default: "" },
  },
  { _id: false },
);

const joinSchema = new Schema(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    eventDate: { type: Date, required: true },
    user: { type: participantSchema, required: true },
    joinedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

joinSchema.index({ eventId: 1, "user.id": 1 }, { unique: true });
joinSchema.index({ "user.id": 1, eventDate: 1 });

export const Join = model("Join", joinSchema);
