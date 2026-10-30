import { z } from "zod";

import { EVENT_TYPES, MAX_EVENT_CAPACITY } from "../constants/eventTypes.js";

const title = z
  .string()
  .trim()
  .min(4, "Title must be at least 4 characters.")
  .max(120, "Title must be 120 characters or fewer.");

const description = z
  .string()
  .trim()
  .min(20, "Description must be at least 20 characters.")
  .max(5000, "Description must be 5000 characters or fewer.");

const eventType = z.enum(EVENT_TYPES, {
  message: "Choose a valid event type.",
});

const thumbnail = z
  .string()
  .trim()
  .url("Thumbnail must be a valid URL.")
  .refine((value) => /^https?:\/\//i.test(value), {
    message: "Thumbnail must start with http:// or https://.",
  });

const location = z
  .string()
  .trim()
  .min(3, "Location must be at least 3 characters.")
  .max(160, "Location must be 160 characters or fewer.");

const eventDate = z.coerce.date({
  message: "Provide a valid event date.",
});

const capacity = z
  .coerce.number()
  .int("Capacity must be a whole number.")
  .min(0, "Capacity cannot be negative.")
  .max(MAX_EVENT_CAPACITY, `Capacity cannot exceed ${MAX_EVENT_CAPACITY}.`);

const isFutureDate = (date) => date.getTime() > Date.now();

export const createEventSchema = z
  .object({
    title,
    description,
    eventType,
    thumbnail,
    location,
    eventDate: eventDate.refine(
      isFutureDate,
      "Event date must be in the future.",
    ),
    capacity: capacity.optional(),
  })
  .strict();

export const updateEventSchema = z
  .object({
    title: title.optional(),
    description: description.optional(),
    eventType: eventType.optional(),
    thumbnail: thumbnail.optional(),
    location: location.optional(),
    eventDate: eventDate.optional(),
    capacity: capacity.optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update.",
  });
