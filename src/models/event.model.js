import mongoose from "mongoose";

import { EVENT_TYPES, MAX_EVENT_CAPACITY } from "../constants/eventTypes.js";

const { Schema, model } = mongoose;

const creatorSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    image: { type: String, default: "" },
  },
  { _id: false },
);

const eventSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    eventType: {
      type: String,
      required: true,
      enum: EVENT_TYPES,
    },
    thumbnail: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true, maxlength: 160 },
    eventDate: { type: Date, required: true },
    capacity: {
      type: Number,
      default: 0,
      min: 0,
      max: MAX_EVENT_CAPACITY,
    },
    joinedCount: { type: Number, default: 0, min: 0 },
    createdBy: { type: creatorSchema, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

eventSchema.index({ eventDate: 1 });
eventSchema.index({ "createdBy.id": 1, eventDate: -1 });
eventSchema.index({ "createdBy.email": 1 });
eventSchema.index({ eventType: 1, eventDate: 1 });

export const Event = model("Event", eventSchema);
